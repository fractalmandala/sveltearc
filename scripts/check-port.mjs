#!/usr/bin/env node
// Lane C harness — per-component port verifier.
//
// Gates (adapted from playbook/canonical/gates.md #2 coverage / #7 prop parity):
//   files      .svelte + .module.css + manifest present
//   no-style   no <style> block in a library component (CSS Modules only)
//   css        copied .module.css is byte-identical to the ARC source
//   props      ARC public props are all present on the port (mapped deltas allowed)
//   manifest   output-contract manifest is present and schema-shaped
//
// Usage: node scripts/check-port.mjs [--json] [--arc <path>]
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const asJson = args.includes('--json');
const arcFlag = args.indexOf('--arc');
const ARC = resolve(ROOT, arcFlag !== -1 ? args[arcFlag + 1] : '../arc-library-main');

const KNOWN_PROP_MAP = { className: 'class', children: 'children' };
const DOM_EVENT = /^on[A-Z]/;

function read(path) {
	try {
		return readFileSync(path, 'utf8');
	} catch {
		return null;
	}
}

function interfaceMembers(source, namePattern, exportOnly = false) {
	if (!source) return [];
	const re = new RegExp(`${exportOnly ? 'export\\s+' : '(?:export\\s+)?'}interface\\s+${namePattern}[^{]*\\{`, 'g');
	const out = [];
	let match;
	while ((match = re.exec(source))) {
		const start = match.index + match[0].length;
		let depth = 1;
		let i = start;
		while (i < source.length && depth > 0) {
			if (source[i] === '{') depth++;
			else if (source[i] === '}') depth--;
			i++;
		}
		const rawBody = source.slice(start, i - 1).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
		let body = '';
		let nestedDepth = 0;
		for (let j = 0; j < rawBody.length; j++) {
			if (rawBody[j] === '{') nestedDepth++;
			else if (rawBody[j] === '}') nestedDepth--;
			else if (nestedDepth === 0) body += rawBody[j];
		}
		for (const member of body.matchAll(/(?:^|[;\n])\s*([A-Za-z_$][\w$]*)\??\s*[:(]/g)) {
			out.push(member[1]);
		}
	}
	return [...new Set(out)];
}

function arcProps(tsx, name) {
	if (!tsx) return { explicit: [], extendsDom: false };
	const pascal = name
		? name
				.split('-')
				.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
				.join('')
		: null;
	let explicit = pascal ? interfaceMembers(tsx, `(?:${pascal}|Props)Props?`, true) : [];
	if (!explicit.length) {
		explicit = interfaceMembers(tsx, '[A-Za-z_$][\\w$]*Props', true);
	}
	if (!explicit.length) {
		explicit = interfaceMembers(tsx, '[A-Za-z_$][\\w$]*Props', false);
	}
	const extendsDom = /extends\s+.*ComponentProps/.test(tsx);
	return { explicit, extendsDom };
}

function portProps(typesSource, svelteSource) {
	const members = interfaceMembers(typesSource, 'Props');
	const source = typesSource ?? svelteSource ?? '';
	const inheritsDom = /HTML\w+Attributes|ComponentProps\s*<|BitsPrimitive/.test(source);
	return { members, inheritsDom };
}

function checkComponent(name) {
	const dir = resolve(ROOT, 'src/lib/components', name);
	const sveltePath = resolve(dir, `${name}.svelte`);
	const cssPath = resolve(dir, `${name}.module.css`);
	const typesPath = resolve(dir, `${name}.types.ts`);
	const manifestPath = resolve(dir, `${name}.manifest.json`);
	const arcTsxPath = resolve(ARC, 'registry/components', name, `${name}.tsx`);
	const arcCssPath = resolve(ARC, 'registry/components', name, `${name}.module.css`);

	const findings = [];
	const fail = (gate, message) => findings.push({ gate, message, severity: 'error' });
	const warn = (gate, message) => findings.push({ gate, message, severity: 'warning' });

	const svelte = read(sveltePath);
	if (!svelte) fail('files', `${name}: missing ${name}.svelte`);
	if (!existsSync(cssPath)) fail('files', `${name}: missing ${name}.module.css`);
	if (!existsSync(manifestPath)) fail('files', `${name}: missing ${name}.manifest.json`);

	if (svelte && /<style[\s>]/.test(svelte)) {
		fail('no-style', `${name}: <style> block present — library components use .module.css only`);
	}

	const portedCss = read(cssPath);
	const arcCss = read(arcCssPath);
	if (portedCss && arcCss && portedCss !== arcCss) {
		fail('css', `${name}: .module.css differs from the ARC source (must be verbatim)`);
	} else if (portedCss && !arcCss) {
		warn('css', `${name}: no ARC .module.css found at ${arcCssPath}`);
	}

	const tsx = read(arcTsxPath);
	if (tsx) {
		const arc = arcProps(tsx, name);
		const port = portProps(read(typesPath), svelte);
		const ported = new Set(port.members);
		for (const prop of arc.explicit) {
			if (ported.has(prop)) continue;
			const mapped = KNOWN_PROP_MAP[prop];
			if (mapped && (ported.has(mapped) || port.inheritsDom)) continue;
			if (DOM_EVENT.test(prop) && port.inheritsDom) continue;
			fail('props', `${name}: ARC prop "${prop}" is not present on the port`);
		}
		for (const prop of ported) {
			if (arc.explicit.includes(prop)) continue;
			if (['class', 'className', 'ref', 'children'].includes(prop)) continue;
			// When ARC inherits the primitive's props, the port legitimately exposes
			// more (checked, onCheckedChange, …). Only flag extras ARC could not have had.
			if (arc.extendsDom) continue;
			warn('props', `${name}: port adds prop "${prop}" not in the ARC source`);
		}
	} else {
		warn('files', `${name}: ARC source not found at ${arcTsxPath} (pass --arc)`);
	}

	const manifest = read(manifestPath);
	if (manifest) {
		try {
			const parsed = JSON.parse(manifest);
			for (const key of ['contractVersion', 'status', 'source', 'target', 'dependencies', 'dataFlow', 'ssr', 'verification', 'gaps']) {
				if (!(key in parsed)) fail('manifest', `${name}: manifest missing "${key}"`);
			}
		} catch (error) {
			fail('manifest', `${name}: manifest is not valid JSON — ${error.message}`);
		}
	}

	return { name, findings };
}

const componentsDir = resolve(ROOT, 'src/lib/components');
const names = existsSync(componentsDir)
	? readdirSync(componentsDir, { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name)
			.sort()
	: [];

const results = names.map(checkComponent);
const errors = results.flatMap((r) => r.findings.filter((f) => f.severity === 'error'));
const warnings = results.flatMap((r) => r.findings.filter((f) => f.severity === 'warning'));

if (asJson) {
	console.log(JSON.stringify({ components: results, summary: { errors: errors.length, warnings: warnings.length } }, null, 2));
} else {
	for (const result of results) {
		if (!result.findings.length) {
			console.log(`  ok    ${result.name}`);
			continue;
		}
		console.log(`  ${result.findings.some((f) => f.severity === 'error') ? 'FAIL' : 'warn'}  ${result.name}`);
		for (const finding of result.findings) console.log(`        [${finding.gate}] ${finding.message}`);
	}
	console.log(`\ncheck-port: ${results.length} component(s), ${errors.length} error(s), ${warnings.length} warning(s)`);
}

process.exit(errors.length ? 1 : 0);
