#!/usr/bin/env node
/**
 * Regenerate the public package barrel (`src/lib/index.ts`) from the component
 * folders. Run after a sprint batch lands: `pnpm barrel`.
 *
 * Named exports only — several component `index.ts` files re-export a bare
 * `Props`, which would collide under `export *`.
 */
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = join(ROOT, 'src/lib/components');

const dirs = readdirSync(base)
	.filter((d) => statSync(join(base, d)).isDirectory())
	.sort();

const lines = ['// Public entry — sveltearc. Named exports only, to avoid `Props` collisions.', ''];

for (const d of dirs) {
	const idx = join(base, d, 'index.ts');
	let names = [];
	if (existsSync(idx)) {
		names = [...readFileSync(idx, 'utf8').matchAll(/export \{ default as (\w+) \}/g)].map((m) => m[1]);
	}
	if (names.length) {
		lines.push(`export { ${names.join(', ')} } from './components/${d}/index';`);
		continue;
	}
	for (const f of readdirSync(join(base, d)).filter((f) => f.endsWith('.svelte'))) {
		const pascal = f
			.replace('.svelte', '')
			.split('-')
			.map((s) => s[0].toUpperCase() + s.slice(1))
			.join('');
		lines.push(`export { default as ${pascal} } from './components/${d}/${f}';`);
	}
}

lines.push(
	'',
	'// Shared foundation',
	"export { motionTokens } from './motion-tokens';",
	"export * from './media';",
	"export { createCopyFeedback } from './use-copy-feedback.svelte';",
	"export type { CopyFeedbackState } from './use-copy-feedback.svelte';",
	''
);

writeFileSync(join(ROOT, 'src/lib/index.ts'), lines.join('\n'));
console.log(`barrel: ${dirs.length} component(s) exported to src/lib/index.ts`);
