// Headless CDP verification for the dialog Phase 2 wiring (task-11 spike rep 2).
// Drives http://localhost:4173/components/dialog with frames flowing (hidden panes
// suspend rAF, so the exit-hold and mid-exit retarget need a real renderer).
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = 'http://localhost:4173/components/dialog';
const PORT = 9338;
const profile = mkdtempSync(join(tmpdir(), 'arcui-cdp-dialog-'));

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

const PAGE_HELPERS = `
	const snap = (el) => {
		if (!el || !el.isConnected) return { gone: true };
		const cs = getComputedStyle(el);
		const tf = cs.transform;
		let y = 0, sc = 1;
		if (tf && tf !== 'none') {
			if (tf.startsWith('matrix3d(')) {
				const v = tf.slice(9, -1).split(',').map(Number);
				sc = v[0]; y = v[13];
			} else if (tf.startsWith('matrix(')) {
				const v = tf.slice(7, -1).split(',').map(Number);
				sc = v[0]; y = v[5];
			}
		}
		const o = parseFloat(cs.opacity);
		return {
			y: Math.round(y * 1000) / 1000,
			sc: Math.round(sc * 10000) / 10000,
			o: Math.round((Number.isFinite(o) ? o : 1) * 1000) / 1000,
			state: el.getAttribute('data-state'),
			raw: (el.getAttribute('style') || '').slice(0, 90)
		};
	};
	const rafSample = (getEl, ms) =>
		new Promise((res) => {
			const t0 = performance.now();
			const samples = [];
			const tick = () => {
				const s = snap(getEl());
				s.t = Math.round(performance.now() - t0);
				samples.push(s);
				if (!s.gone && performance.now() - t0 < ms) requestAnimationFrame(tick);
				else res(samples);
			};
			requestAnimationFrame(tick);
		});
	const rafSample2 = (getA, getB, ms) =>
		new Promise((res) => {
			const t0 = performance.now();
			const as = [], bs = [];
			const tick = () => {
				const a = snap(getA()); a.t = Math.round(performance.now() - t0); as.push(a);
				const b = snap(getB()); b.t = a.t; bs.push(b);
				if ((!a.gone || !b.gone) && performance.now() - t0 < ms) requestAnimationFrame(tick);
				else res({ a: as, b: bs });
			};
			requestAnimationFrame(tick);
		});
	const waitFor = (fn, ms) =>
		new Promise((res) => {
			const t0 = performance.now();
			const tick = () => {
				const v = fn();
				if (v) return res(v);
				if (performance.now() - t0 > ms) return res(null);
				requestAnimationFrame(tick);
			};
			tick();
		});
	const bodyLock = () => ({
		pe: getComputedStyle(document.body).pointerEvents,
		of: getComputedStyle(document.body).overflow
	});
	const getContent = () => document.querySelector('[role="dialog"]');
	const getOverlay = () => document.querySelector('[class*="overlay"][data-state]');
`;

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
			if (document.querySelector('.demo-trigger-btn')) {
				return { ok: true, ms: Math.round(performance.now() - t0) };
			}
			await new Promise((r) => requestAnimationFrame(r));
		}
		return { ok: false };
	})()`);
	if (!results.hydration.ok) throw new Error('specimen did not hydrate');

	// PHASE 1 — normal motion
	results.normal = await evalx(`(async () => {
		${PAGE_HELPERS}
		const out = {};
		const trigger = document.querySelector('.demo-trigger-btn');

		out.initial = {
			trigger: !!trigger,
			dialog: !!getContent(),
			overlay: !!getOverlay(),
			body: bodyLock()
		};

		// OPEN — enter: overlay 0→1, content y 8→0 scale .96→1
		trigger.click();
		const contentEl = await waitFor(() => getContent(), 1500);
		const { a: enter, b: overlay } = await rafSample2(() => getContent(), () => getOverlay(), 900);
		const enterLive = enter.filter((s) => !s.gone);
		const overlayLive = overlay.filter((s) => !s.gone);
		out.enter = {
			found: !!contentEl,
			frames: enterLive.length,
			first: enterLive[0],
			last: enterLive[enterLive.length - 1],
			maxY: Math.max(...enterLive.map((s) => s.y)),
			minSc: Math.min(...enterLive.map((s) => s.sc)),
			reachedO: Math.max(...enterLive.map((s) => s.o)),
			states: [...new Set(enterLive.map((s) => s.state))],
			overlay: {
				frames: overlayLive.length,
				minO: Math.min(...overlayLive.map((s) => s.o)),
				maxO: Math.max(...overlayLive.map((s) => s.o))
			}
		};

		out.open = {
			body: bodyLock(),
			state: contentEl?.getAttribute('data-state'),
			labelledby: contentEl?.getAttribute('aria-labelledby') ?? null
		};
		await new Promise((r) => setTimeout(r, 300));
		const dlg = getContent();
		out.open.focusInside = !!(dlg && document.activeElement && dlg.contains(document.activeElement));

		// CLOSE — exit: y →4, scale →.98, opacity →0, then node removed (presence hold releases)
		contentEl.__probeMark = 'kept';
		document.querySelector('[aria-label="Close dialog"]').click();
		const exit = await rafSample(() => contentEl, 1200);
		const exitLive = exit.filter((s) => !s.gone);
		out.close = {
			frames: exitLive.length,
			maxY: Math.max(...exitLive.map((s) => s.y)),
			minSc: Math.min(...exitLive.map((s) => s.sc)),
			lastO: exitLive[exitLive.length - 1]?.o ?? null,
			states: [...new Set(exitLive.map((s) => s.state))]
		};
		await new Promise((r) => setTimeout(r, 200));
		out.close.removed = !getContent();
		out.close.overlayGone = !getOverlay();
		out.close.body = bodyLock();
		out.close.focusOnTrigger = document.activeElement === trigger;

		// REOPEN MID-EXIT — press the trigger while the exit is in flight; the same node must
		// survive (spring retarget, not a remount). That is what the AnimatePresence hold buys us.
		trigger.click();
		const node2 = await waitFor(() => getContent(), 1500);
		node2.__probeMark = 'kept2';
		await new Promise((r) => setTimeout(r, 500));
		document.querySelector('[aria-label="Close dialog"]').click();
		await new Promise((r) => setTimeout(r, 80));
		const midExitConnected = node2.isConnected;
		trigger.click();
		const re = await rafSample(() => getContent(), 800);
		const reLive = re.filter((s) => !s.gone);
		const reLast = reLive[reLive.length - 1];
		out.retarget = {
			midExitConnected,
			sameNode: getContent() === node2,
			mark: node2.__probeMark ?? null,
			lastO: reLast?.o ?? null,
			lastY: reLast?.y ?? null,
			lastSc: reLast?.sc ?? null,
			sawGone: re.some((s) => s.gone)
		};

		// ESCAPE — close via keyboard; removal + unlock again
		document.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true })
		);
		await new Promise((r) => setTimeout(r, 1200));
		out.escape = { removed: !getContent(), overlayGone: !getOverlay(), body: bodyLock() };
		return out;
	})()`);

	// PHASE 2 — reduced motion
	await send('Emulation.setEmulatedMedia', {
		features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
	});
	results.reduced = await evalx(`(async () => {
		${PAGE_HELPERS}
		const out = {};
		const trigger = document.querySelector('.demo-trigger-btn');
		await new Promise((r) => setTimeout(r, 150));
		out.reduceNow = matchMedia('(prefers-reduced-motion: reduce)').matches;

		trigger.click();
		const enter = await rafSample(getContent, 700);
		const enterLive = enter.filter((s) => !s.gone);
		out.enter = {
			frames: enterLive.length,
			allY: [...new Set(enterLive.map((s) => s.y))],
			allSc: [...new Set(enterLive.map((s) => s.sc))],
			maxO: Math.max(...enterLive.map((s) => s.o))
		};
		document.querySelector('[aria-label="Close dialog"]').click();
		const exit = await rafSample(getContent, 1200);
		const exitLive = exit.filter((s) => !s.gone);
		out.exit = {
			frames: exitLive.length,
			allY: [...new Set(exitLive.map((s) => s.y))],
			allSc: [...new Set(exitLive.map((s) => s.sc))],
			lastO: exitLive[exitLive.length - 1]?.o ?? null,
			removed: !getContent()
		};
		return out;
	})()`);

	results.pageErrors = await evalx(`window.__errs`);

	// summary
	const n = results.normal;
	const r = results.reduced;
	const checks = [
		['hydration: trigger found, no dialog/overlay mounted, body unlocked', n.initial.trigger && !n.initial.dialog && !n.initial.overlay && n.initial.body.pe !== 'none'],
		['enter: content mounts as role=dialog with data-state=open', n.enter.found && n.open.state === 'open' && n.enter.states.includes('open')],
		['enter: content springs from y>2 scale<.99 (>5 frames)', n.enter.frames > 5 && n.enter.maxY > 2 && n.enter.minSc < 0.99 && !!n.enter.first && n.enter.first.y > 0.5],
		['enter: settles opacity 1, y 0, scale 1', !!n.enter.last && n.enter.last.o >= 0.98 && Math.abs(n.enter.last.y) <= 0.15 && Math.abs(n.enter.last.sc - 1) <= 0.02],
		['enter: overlay fades in 0→1', !!n.enter.overlay && n.enter.overlay.minO <= 0.6 && n.enter.overlay.maxO >= 0.98],
		['open: body scroll-locked (pointer-events none + overflow hidden)', n.open.body.pe === 'none' && n.open.body.of === 'hidden'],
		['open: focus moved inside dialog', n.open.focusInside === true],
		['exit: node held + animated (>5 frames, y moved, opacity →0)', n.close.frames > 5 && n.close.maxY > 1.5 && n.close.lastO !== null && n.close.lastO <= 0.5],
		['exit: data-state flips to closed while held', n.close.states.includes('closed')],
		['exit: node removed after exit, overlay gone, body unlocked', n.close.removed && n.close.overlayGone && n.close.body.pe !== 'none'],
		['exit: focus returned to trigger', n.close.focusOnTrigger === true],
		['retarget: reopen mid-exit reuses same node (marker kept, no gap)', n.retarget.midExitConnected === true && n.retarget.sameNode === true && n.retarget.mark === 'kept2' && n.retarget.sawGone === false],
		['retarget: settles fully visible again', n.retarget.lastO !== null && n.retarget.lastO >= 0.98 && Math.abs(n.retarget.lastY) <= 0.15 && Math.abs(n.retarget.lastSc - 1) <= 0.02],
		['escape: closes, removes node, body unlocked', n.escape.removed && n.escape.overlayGone && n.escape.body.pe !== 'none'],
		['reduced: emulation active', r.reduceNow === true],
		['reduced enter: opacity only, no travel (y/sc identity)', r.enter.allY.every((y) => y === 0) && r.enter.allSc.every((s) => Math.abs(s - 1) < 0.001) && r.enter.maxO >= 0.98],
		['reduced exit: no travel, fades, node removed', r.exit.allY.every((y) => y === 0) && r.exit.allSc.every((s) => Math.abs(s - 1) < 0.001) && r.exit.removed === true],
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
