// Headless CDP verification for the switch Phase 2 wiring (task-11 spike rep 1).
// Drives http://localhost:4173/components/switch with frames flowing (headed-first
// checks ran in a hidden pane where rAF is suspended, so springs could not tick).
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = 'http://localhost:4173/components/switch';
const PORT = 9337;
const profile = mkdtempSync(join(tmpdir(), 'arcui-cdp-'));

const chrome = spawn(
	CHROME,
	[
		'--headless=new',
		`--remote-debugging-port=${PORT}`,
		`--user-data-dir=${profile}`,
		'--no-first-run',
		'--no-default-browser-check',
		'--disable-extensions',
		'--mute-audio',
		'--window-size=1280,900',
		URL
	],
	{ stdio: 'ignore' }
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws;
let id = 0;
const pending = new Map();

const send = (method, params = {}) => {
	const i = ++id;
	ws.send(JSON.stringify({ id: i, method, params }));
	return new Promise((res) => pending.set(i, res));
};

const evalx = async (expression) => {
	const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
	if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails));
	return r.result.result.value;
};

const results = {};

try {
	// wait for CDP endpoint + page target
	let targets = [];
	for (let i = 0; i < 60; i++) {
		try {
			targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
			if (targets.some((t) => t.type === 'page' && t.url.includes('localhost:4173'))) break;
		} catch {}
		await sleep(250);
	}
	const target =
		targets.find((t) => t.type === 'page' && t.url.includes('localhost:4173')) ||
		targets.find((t) => t.type === 'page');
	if (!target) throw new Error('no page target: ' + JSON.stringify(targets));

	ws = new WebSocket(target.webSocketDebuggerUrl);
	await new Promise((res, rej) => {
		ws.onopen = res;
		ws.onerror = rej;
	});
	ws.onmessage = (m) => {
		const d = JSON.parse(m.data);
		if (d.id && pending.has(d.id)) {
			pending.get(d.id)(d);
			pending.delete(d.id);
		}
	};

	await send('Runtime.enable');
	await send('Page.enable');

	// hydrate + error taps
	results.hydration = await evalx(`(async () => {
		window.__errs = [];
		window.addEventListener('error', (e) => window.__errs.push(String(e.message)));
		window.addEventListener('unhandledrejection', (e) => window.__errs.push('rej:' + String(e.reason)));
		const t0 = performance.now();
		while (performance.now() - t0 < 10000) {
			if (document.querySelector('button[role=switch][aria-label="Notifications"] span[class*="thumb"]')) {
				return { ok: true, ms: Math.round(performance.now() - t0) };
			}
			await new Promise((r) => requestAnimationFrame(r));
		}
		return { ok: false };
	})()`);
	if (!results.hydration.ok) throw new Error('specimen did not hydrate');

	// PHASE 1 — normal motion
	results.normal = await evalx(`(async () => {
		const out = {};
		const parse = (s) => {
			const x = /translateX\\(([-\\d.]+)px\\)/.exec(s);
			const sx = /scaleX\\(([-\\d.]+)\\)/.exec(s);
			const w = /width:\\s*([-\\d.]+)px/.exec(s);
			return {
				x: x ? parseFloat(x[1]) : s.includes('transform: none') ? 0 : null,
				scaleX: sx ? parseFloat(sx[1]) : 1,
				width: w ? parseFloat(w[1]) : null
			};
		};
		const rafSample = (el, ms) =>
			new Promise((res) => {
				const t0 = performance.now();
				const samples = [];
				const tick = () => {
					samples.push(el.getAttribute('style') || '');
					if (performance.now() - t0 < ms) requestAnimationFrame(tick);
					else res(samples);
				};
				requestAnimationFrame(tick);
			});
		const b = document.querySelector('button[role=switch][aria-label="Notifications"]');
		const thumb = b.querySelector('span[class*="thumb"]');
		out.initial = { state: b.getAttribute('data-state'), ...parse(thumb.getAttribute('style') || '') };

		// A) toggle: spring travel + wobble
		b.click();
		const travel = await rafSample(thumb, 1200);
		out.travel = {
			frames: travel.length,
			first: parse(travel[0]),
			last: parse(travel[travel.length - 1]),
			distinctX: [...new Set(travel.map((s) => parse(s).x))].length,
			maxScaleX: Math.max(...travel.map((s) => parse(s).scaleX)),
			endState: b.getAttribute('data-state')
		};

		// B) press-hold stretch (button 0) then release
		b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
		const hold = await rafSample(thumb, 320);
		out.hold = {
			frames: hold.length,
			maxWidth: Math.max(...hold.map((s) => parse(s).width)),
			minX: Math.min(...hold.map((s) => parse(s).x)),
			last: parse(hold[hold.length - 1])
		};
		b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }));
		const release = await rafSample(thumb, 800);
		out.release = { last: parse(release[release.length - 1]), state: b.getAttribute('data-state') };
		return out;
	})()`);

	// PHASE 2 — reduced motion
	await send('Emulation.setEmulatedMedia', {
		features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
	});
	results.reduced = await evalx(`(async () => {
		const parse = (s) => {
			const x = /translateX\\(([-\\d.]+)px\\)/.exec(s);
			const sx = /scaleX\\(([-\\d.]+)\\)/.exec(s);
			const w = /width:\\s*([-\\d.]+)px/.exec(s);
			return {
				x: x ? parseFloat(x[1]) : s.includes('transform: none') ? 0 : null,
				scaleX: sx ? parseFloat(sx[1]) : 1,
				width: w ? parseFloat(w[1]) : null
			};
		};
		const rafSample = (el, ms) =>
			new Promise((res) => {
				const t0 = performance.now();
				const samples = [];
				const tick = () => {
					samples.push(el.getAttribute('style') || '');
					if (performance.now() - t0 < ms) requestAnimationFrame(tick);
					else res(samples);
				};
				requestAnimationFrame(tick);
			});
		const b = document.querySelector('button[role=switch][aria-label="Notifications"]');
		const thumb = b.querySelector('span[class*="thumb"]');
		// let the matchMedia listener propagate into the component
		await new Promise((r) => requestAnimationFrame(r));
		await new Promise((r) => setTimeout(r, 80));
		const reduceNow = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const stateBefore = b.getAttribute('data-state');
		b.click();
		const jump = await rafSample(thumb, 700);
		const xs = [...new Set(jump.map((s) => parse(s).x))];
		const maxScaleX = Math.max(...jump.map((s) => parse(s).scaleX));
		// stretch must be disabled under reduced motion
		b.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
		const hold = await rafSample(thumb, 300);
		const widths = [...new Set(hold.map((s) => parse(s).width))];
		b.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }));
		const settled = await rafSample(thumb, 300);
		return {
			reduceNow,
			stateBefore,
			stateAfter: b.getAttribute('data-state'),
			frames: jump.length,
			xs,
			maxScaleX,
			holdWidths: widths,
			final: parse(settled[settled.length - 1])
		};
	})()`);

	results.pageErrors = await evalx(`window.__errs`);

	// summary
	const n = results.normal;
	const r = results.reduced;
	const checks = [
		['normal: initial unchecked at x=0 w=18', n.initial.state === 'unchecked' && n.initial.x === 0 && n.initial.width === 18],
		['normal: travel passes through intermediates (spring)', n.travel.distinctX > 5],
		['normal: travel settles at x=18', n.travel.last.x === 18 && n.travel.endState === 'checked'],
		['normal: wobble scaleX > 1 observed', n.travel.maxScaleX > 1.02],
		['normal: press stretch widens thumb beyond 18px', n.hold.maxWidth > 19],
		['normal: press shift pulls x below 18 (far edge anchored)', n.hold.minX < 17],
		['normal: release returns width to 18', n.release.last.width === 18],
		['reduced: emulation active', r.reduceNow === true],
		['reduced: no intermediate x (jump, no travel)', r.xs.every((x) => x === 0 || x === 18)],
		['reduced: no wobble', r.maxScaleX <= 1.02],
		['reduced: no press stretch (width stays 18)', r.holdWidths.every((w) => w === 18)],
		['reduced: state flipped', r.stateAfter !== r.stateBefore],
		['no page errors', Array.isArray(results.pageErrors) && results.pageErrors.length === 0]
	];
	console.log(JSON.stringify(results, null, 1));
	console.log('---');
	let failed = 0;
	for (const [name, ok] of checks) {
		console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}`);
		if (!ok) failed++;
	}
	console.log(failed === 0 ? 'ALL PASS' : `${failed} FAILURES`);
	process.exitCode = failed === 0 ? 0 : 1;
} catch (err) {
	console.error('ERROR', err);
	process.exitCode = 2;
} finally {
	try {
		ws?.close();
	} catch {}
	chrome.kill('SIGTERM');
	setTimeout(() => chrome.kill('SIGKILL'), 1500).unref();
}
