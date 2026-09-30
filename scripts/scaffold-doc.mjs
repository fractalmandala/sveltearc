#!/usr/bin/env node
/**
 * Scaffold Doc — Generates rich src/site/docs/<name>.ts from official uiarc.dev markdown
 * Usage: node scripts/scaffold-doc.mjs <component-name> [--force]
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ARC = resolve(ROOT, '../arc-library-main');

const args = process.argv.slice(2);
const name = args.find((a) => !a.startsWith('--'));
const force = args.includes('--force');

if (!name) {
	console.error('Usage: node scripts/scaffold-doc.mjs <component-name> [--force]');
	process.exit(1);
}

const targetDocPath = resolve(ROOT, 'src/site/docs', `${name}.ts`);
const targetDemoPath = resolve(ROOT, 'src/site/demos', `${name}.svelte`);

if (existsSync(targetDocPath) && !force) {
	console.log(`  info  ${name}.ts already exists in src/site/docs/ (pass --force to overwrite)`);
	process.exit(0);
}

const rJsonPath = resolve(ARC, 'public/r', `${name}.json`);
let rJson = null;
if (existsSync(rJsonPath)) {
	try {
		rJson = JSON.parse(readFileSync(rJsonPath, 'utf8'));
	} catch (e) {
		console.warn(`  warn  failed to parse ${rJsonPath}: ${e.message}`);
	}
}

// Fetch or read markdown
let markdown = '';
const markdownUrl = rJson?.meta?.markdown || `https://uiarc.dev/components/${name}/markdown`;

try {
	console.log(`  fetch ${markdownUrl}...`);
	const res = await fetch(markdownUrl);
	if (res.ok) {
		markdown = await res.text();
	} else {
		console.warn(`  warn  fetch returned ${res.status}, using metadata fallback`);
	}
} catch (e) {
	console.warn(`  warn  could not fetch live markdown (${e.message}), using fallback`);
}

function parseSection(md, headerPattern) {
	const re = new RegExp(`##\\s+${headerPattern}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`, 'i');
	const match = md.match(re);
	return match ? match[1].trim() : '';
}

function parseBullets(sectionText) {
	if (!sectionText) return [];
	return sectionText
		.split('\n')
		.map((l) => l.trim())
		.filter((l) => l.startsWith('- ') || l.startsWith('* '))
		.map((l) => l.replace(/^[-*]\s+/, '').trim())
		.filter(Boolean);
}

function parseTable(sectionText) {
	if (!sectionText) return [];
	const lines = sectionText
		.split('\n')
		.map((l) => l.trim())
		.filter((l) => l.startsWith('|'));
	if (lines.length < 3) return [];
	const headers = lines[0]
		.split('|')
		.slice(1, -1)
		.map((h) => h.trim().toLowerCase());
	const rows = [];
	for (let i = 2; i < lines.length; i++) {
		const cells = lines[i]
			.split('|')
			.slice(1, -1)
			.map((c) => c.trim());
		if (cells.length === headers.length) {
			const row = {};
			headers.forEach((h, idx) => {
				row[h] = cells[idx];
			});
			rows.push(row);
		}
	}
	return rows;
}

// Extract fields
const titleMatch = markdown.match(/^#\s+(.+)$/m);
const title = titleMatch ? titleMatch[1].trim() : rJson?.title || name.replace(/-/g, ' ');

const taglineMatch = markdown.match(/^>\s+(.+)$/m);
const tagline = taglineMatch ? taglineMatch[1].trim() : rJson?.description || '';

const typeMatch = markdown.match(/- Type:\s*Component\s*\(([^)]+)\)/i);
const group = typeMatch ? typeMatch[1].trim() : rJson?.meta?.tags?.[0] || 'components';

const whenToUse = parseBullets(parseSection(markdown, 'When to use'));
const whenNotToUse = parseBullets(parseSection(markdown, 'When not to use'));

// API table
const apiRaw = parseTable(parseSection(markdown, 'API reference'));
const api = apiRaw.map((row) => {
	const rawName = (row.prop || row.name || '').replace(/`|\*/g, '').trim();
	const isRequired = /\(required\)/i.test(rawName);
	const cleanName = rawName.replace(/\(required\)/gi, '').trim();
	const desc = (row.description || '').replace(/"/g, '\\"');
	return {
		name: cleanName,
		type: (row.type || 'any').replace(/`/g, '').replace(/ReactNode|ReactElement/g, 'Snippet'),
		default: (row.default || '–').replace(/`/g, "'"),
		description: isRequired && !desc.toLowerCase().includes('required') ? `(Required) ${desc}` : desc
	};
});

function extractUsageSnippet(md, pName) {
	const usageText = parseSection(md, 'Usage');
	if (usageText) {
		const codeMatch = usageText.match(/```(?:tsx|jsx|svelte)?\s*([\s\S]*?)```/);
		if (codeMatch) {
			const rawCode = codeMatch[1];
			// 1. Try matching paired tag <pName ...>...</pName>
			const pairMatch = rawCode.match(new RegExp(`<${pName}[\\s\\S]*?<\\/${pName}>`, 'm'));
			if (pairMatch) {
				let tag = pairMatch[0].trim();
				tag = tag.replace(/\bclassName=/g, 'class=');
				tag = tag.replace(/=\{"([^"]*)"\}/g, '="$1"');
				tag = tag.replace(/\bon([A-Z][a-z]+)=/g, (m, ev) => `on${ev.toLowerCase()}=`);
				return tag;
			}
			// 2. Try matching self-closing tag <pName ... />
			const selfMatch = rawCode.match(new RegExp(`<${pName}(?:[^"'>]|"[^"]*"|'[^']*')*?\\/>`, 'm'));
			if (selfMatch) {
				let tag = selfMatch[0].trim();
				tag = tag.replace(/\bclassName=/g, 'class=');
				tag = tag.replace(/=\{"([^"]*)"\}/g, '="$1"');
				tag = tag.replace(/\bon([A-Z][a-z]+)=/g, (m, ev) => `on${ev.toLowerCase()}=`);
				return tag;
			}
		}
	}
	return `<${pName} />`;
}

// Keyboard table
const kbRaw = parseTable(parseSection(markdown, 'Keyboard interactions'));
const keyboard = kbRaw.map((row) => ({
	key: row.keys || row.key || '',
	action: (row.action || '').replace(/"/g, '\\"')
}));

const accessibility = parseBullets(parseSection(markdown, 'Accessibility'));

const motionText = parseSection(markdown, 'Motion')
	.replace(/\n+/g, ' ')
	.replace(/"/g, '\\"')
	.trim();

const notesForAi = parseBullets(parseSection(markdown, 'Notes for AI'));

// Related components
const relatedSection = parseSection(markdown, 'Related');
const related = [];
for (const match of relatedSection.matchAll(/\[([^\]]+)\]\(([^)]+)\):\s*([^\n]+)/g)) {
	const relName = match[1];
	const urlClean = match[2].replace(/\/markdown\/?$/i, '').replace(/\.(markdown|md)$/i, '');
	const slug = urlClean.split('/').filter(Boolean).pop() || '';
	const relDesc = match[3].replace(/"/g, '\\"');
	related.push({ name: relName, slug, description: relDesc });
}

// Determine runtime dependencies
const dependencies = ['bits-ui'];
if (markdown.includes('lucide') || rJson?.dependencies?.includes('lucide-react')) {
	dependencies.push('@lucide/svelte');
}

const pascalName = name
	.split('-')
	.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
	.join('');

const usageTag = extractUsageSnippet(markdown, pascalName);

const docSource = `import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: ${JSON.stringify(title)},
	tagline: ${JSON.stringify(tagline)},
	description: ${JSON.stringify(rJson?.description || tagline)},
	group: ${JSON.stringify(group)},
	status: 'ported',
	whenToUse: ${JSON.stringify(whenToUse.length ? whenToUse : ['Standard usage in modern web applications.'])},
	whenNotToUse: ${JSON.stringify(whenNotToUse.length ? whenNotToUse : ['When a simpler native HTML element suffices.'])},
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/${name}',
		manual: {
			dependencies: ${JSON.stringify(dependencies)},
			steps: [
				'Copy ${name} files into src/lib/components/${name}/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import ${pascalName} from $lib/components/${name}'
			]
		}
	},
	usage: \`<script lang="ts">
  import { ${pascalName} } from '$lib/components/${name}';
<\\/script>

${usageTag}\`,
	demoCode: \`<script lang="ts">
  import { ${pascalName} } from '$lib/components/${name}';
<\\/script>

<div class="demo-${name}-container">
  ${usageTag}
</div>\`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: \`${usageTag}\`
		}
	],
	api: ${JSON.stringify(
		api.length
			? api
			: [
					{
						name: 'class',
						type: 'string',
						default: '–',
						description: 'Additional CSS class applied to root.'
					}
				],
		null,
		2
	)},
	keyboard: ${JSON.stringify(
		keyboard.length
			? keyboard
			: [
					{
						key: 'Tab',
						action: 'Moves focus to the interactive element.'
					}
				],
		null,
		2
	)},
	accessibility: ${JSON.stringify(
		accessibility.length
			? accessibility
			: [
					'Accessible semantic HTML markup.',
					'Conforms to WCAG 2.1 AA focus ring and contrast standards.'
				]
	)},
	motion: ${JSON.stringify(
		motionText ||
			'Phase 1 still-state: Statically rendered in target state. Phase 2 wires spring physics.'
	)},
	notes: ${JSON.stringify(
		`Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.`
	)},
	notesForAi: ${JSON.stringify(
		notesForAi.length
			? notesForAi
			: ['Follow declared prop types. Retain verbatim CSS and accessibility attributes.']
	)},
	related: ${JSON.stringify(related)},
	source: 'registry/components/${name}/${name}.tsx'
};

export default doc;
`;

mkdirSync(resolve(ROOT, 'src/site/docs'), { recursive: true });
writeFileSync(targetDocPath, docSource, 'utf8');
console.log(`  wrote ${targetDocPath}`);

// Also scaffold starter demo if missing or force
if (!existsSync(targetDemoPath) || force) {
	mkdirSync(resolve(ROOT, 'src/site/demos'), { recursive: true });
	const demoSource = `<script lang="ts">
	import { ${pascalName} } from '$lib/components/${name}';
</script>

<div class="demo-${name}-wrap">
	${usageTag}
</div>

<style>
	.demo-${name}-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1rem;
		width: 100%;
	}
</style>
`;
	writeFileSync(targetDemoPath, demoSource, 'utf8');
	console.log(`  wrote ${targetDemoPath}`);
}
