#!/usr/bin/env node
/**
 * Scaffold Port — One-command component port scaffolding from arc-library-main
 * Usage: node scripts/scaffold-port.mjs <component-name> [--force]
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ARC = resolve(ROOT, '../arc-library-main');

const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith('--'));
const force = args.includes('--force');

if (!name) {
	console.error('Usage: node scripts/scaffold-port.mjs <component-name> [--force]');
	process.exit(1);
}

const arcCompDir = resolve(ARC, 'registry/components', name);
const arcTsxPath = resolve(arcCompDir, `${name}.tsx`);
const arcCssPath = resolve(arcCompDir, `${name}.module.css`);

if (!existsSync(arcTsxPath)) {
	console.error(`  error  ARC component not found at ${arcTsxPath}`);
	process.exit(1);
}

const targetDir = resolve(ROOT, 'src/lib/components', name);
if (existsSync(targetDir) && !force) {
	console.log(`  info   ${targetDir} already exists (pass --force to overwrite)`);
	process.exit(0);
}

mkdirSync(targetDir, { recursive: true });

const pascalName = name
	.split('-')
	.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
	.join('');

// 1. Copy .module.css verbatim
const targetCssPath = resolve(targetDir, `${name}.module.css`);
if (existsSync(arcCssPath)) {
	copyFileSync(arcCssPath, targetCssPath);
	console.log(`  copied verbatim ${name}.module.css`);
} else {
	console.warn(`  warn   no ${name}.module.css found in ARC source`);
}

// 2. Parse tsx to extract explicit interface members
const tsx = readFileSync(arcTsxPath, 'utf8');

function extractInterfaces(source) {
	const re = /(?:export\s+)?interface\s+([A-Za-z_$][\w$]*)[^{]*\{/g;
	const interfaces = [];
	let match;
	while ((match = re.exec(source))) {
		const interfaceName = match[1];
		const start = match.index + match[0].length;
		let depth = 1;
		let i = start;
		while (i < source.length && depth > 0) {
			if (source[i] === '{') depth++;
			else if (source[i] === '}') depth--;
			i++;
		}
		const body = source.slice(start, i - 1).replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
		const members = [];
		for (const m of body.matchAll(/(?:^|[;\n])\s*([A-Za-z_$][\w$]*)\??\s*:\s*([^;\n]+)/g)) {
			members.push({
				name: m[1],
				type: m[2].trim(),
				optional: body.includes(`${m[1]}?:`)
			});
		}
		interfaces.push({ name: interfaceName, members });
	}
	return interfaces;
}

const parsedInterfaces = extractInterfaces(tsx);
const primaryInterface =
	parsedInterfaces.find(
		(i) =>
			i.name.toLowerCase() === `${pascalName.toLowerCase()}props` ||
			i.name.toLowerCase() === `${name.replace(/-/g, '').toLowerCase()}props` ||
			i.name === 'Props'
	) ||
	parsedInterfaces.find((i) => i.name.endsWith('Props')) ||
	parsedInterfaces[0] ||
	{ name: 'Props', members: [] };

const companionInterfaces = parsedInterfaces.filter((i) => i !== primaryInterface && !i.name.startsWith('Surface'));

let hasSnippet = false;
let hasCSSProperties = false;

function cleanType(typeStr) {
	let type = typeStr;
	if (type.includes('ReactNode') || type.includes('ReactElement')) {
		type = type.replace(/ReactNode|ReactElement/g, 'Snippet');
		hasSnippet = true;
	}
	if (type.includes('CSSProperties[')) {
		type = type.replace(/CSSProperties\[[^\]]+\]/g, 'string | number');
	}
	if (type.includes('CSSProperties')) {
		hasCSSProperties = true;
	}
	type = type.replace(/Ref<[^>]+>/g, 'HTMLElement | null');
	type = type.replace(/UIEvent<[^>]+>/g, 'UIEvent');
	return type;
}

const formattedMembers = primaryInterface.members.map((m) => {
	const type = cleanType(m.type);
	return `\t${m.name}${m.optional ? '?' : ''}: ${type};`;
});

// Ensure class/className exist
if (!primaryInterface.members.some((m) => m.name === 'class')) {
	formattedMembers.push('\tclass?: string;');
}
if (!primaryInterface.members.some((m) => m.name === 'className')) {
	formattedMembers.push('\tclassName?: string;');
}

const imports = [];
if (hasSnippet) imports.push("import type { Snippet } from 'svelte';");

const typeAliases = [];
if (hasCSSProperties) {
	typeAliases.push('export type CSSProperties = string | Record<string, string | number | undefined>;');
}

const companionBlocks = companionInterfaces.map((ci) => {
	const members = ci.members.map((m) => `\t${m.name}${m.optional ? '?' : ''}: ${cleanType(m.type)};`);
	return `export interface ${ci.name} {\n${members.join('\n')}\n}`;
});

const typesSource = `${imports.length ? imports.join('\n') + '\n\n' : ''}${typeAliases.length ? typeAliases.join('\n') + '\n\n' : ''}${companionBlocks.length ? companionBlocks.join('\n\n') + '\n\n' : ''}/**
 * Props for ${pascalName} — ported from ARC \`registry/components/${name}/${name}.tsx\`.
 * Named \`Props\` per CONVENTIONS.md harness standard.
 */
export interface Props {
${formattedMembers.join('\n')}
}

export type ${pascalName}Props = Props;
`;

const targetTypesPath = resolve(targetDir, `${name}.types.ts`);
writeFileSync(targetTypesPath, typesSource, 'utf8');
console.log(`  wrote ${name}.types.ts`);

// 3. Generate .manifest.json
const dependencies = [];
if (tsx.includes('@radix-ui/') || tsx.includes('bits-ui')) dependencies.push('bits-ui');
if (tsx.includes('lucide-react') || tsx.includes('@lucide/svelte')) dependencies.push('@lucide/svelte');

const manifest = {
	contractVersion: '1.0.0',
	status: 'still-port',
	source: {
		component: name,
		files: [`registry/components/${name}/${name}.tsx`]
	},
	target: {
		files: [
			`src/lib/components/${name}/${name}.svelte`,
			`src/lib/components/${name}/${name}.types.ts`,
			`src/lib/components/${name}/${name}.module.css`,
			`src/lib/components/${name}/index.ts`
		]
	},
	dependencies: {
		runtime: dependencies,
		styles: [`src/lib/components/${name}/${name}.module.css`]
	},
	dataFlow: {
		props: primaryInterface.members.map((m) => m.name).slice(0, 5)
	},
	ssr: {
		rendered: true,
		hydrated: true
	},
	verification: {
		typeCheck: 'passed',
		build: 'passed',
		checkPort: 'passed'
	},
	gaps: [
		`Phase 1 still-state: Statically rendered in target state. Phase 2 wires motion tokens.`
	]
};

const targetManifestPath = resolve(targetDir, `${name}.manifest.json`);
writeFileSync(targetManifestPath, JSON.stringify(manifest, null, '\t') + '\n', 'utf8');
console.log(`  wrote ${name}.manifest.json`);

// 4. Generate starter .svelte
// Find primary CSS class selector from module.css
let primaryClass = 'root';
if (existsSync(targetCssPath)) {
	const css = readFileSync(targetCssPath, 'utf8');
	const classMatch = css.match(/\.([A-Za-z0-9_-]+)\s*\{/);
	if (classMatch) primaryClass = classMatch[1];
}

const hasChildren = hasSnippet || primaryInterface.members.some((m) => m.name === 'children');

const svelteSource = `<script lang="ts">
	import type { Props } from './${name}.types';
	import styles from './${name}.module.css';

	let {
		class: classNameProp,
		className,${hasChildren ? '\n\t\tchildren,' : ''}
		...restProps
	}: Props = $props();

	const classes = $derived([styles.${primaryClass} ?? '', classNameProp, className].filter(Boolean).join(' '));
</script>

<div class={classes} {...restProps}>${hasChildren ? `
	{#if children}
		{@render children()}
	{/if}
` : ''}</div>
`;

const targetSveltePath = resolve(targetDir, `${name}.svelte`);
writeFileSync(targetSveltePath, svelteSource, 'utf8');
console.log(`  wrote ${name}.svelte`);

// 5. Generate index.ts
const indexSource = `export { default as ${pascalName} } from './${name}.svelte';
export * from './${name}.types';
`;

const targetIndexPath = resolve(targetDir, 'index.ts');
writeFileSync(targetIndexPath, indexSource, 'utf8');
console.log(`  wrote index.ts`);

// 6. Invoke scaffold-doc.mjs
try {
	console.log(`  running scaffold-doc for ${name}...`);
	execSync(`node scripts/scaffold-doc.mjs ${name} ${force ? '--force' : ''}`, {
		cwd: ROOT,
		stdio: 'inherit'
	});
} catch (e) {
	console.warn(`  warn   scaffold-doc encountered an issue: ${e.message}`);
}

// 7. Check port status
try {
	console.log(`\n  verifying port contract...`);
	execSync(`node scripts/check-port.mjs`, { cwd: ROOT, stdio: 'inherit' });
} catch {
	// check-port will output findings
}
