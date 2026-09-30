#!/usr/bin/env node
/**
 * normalize-groups.mjs — migrate every `$site/docs/*.ts` `group:` field to its
 * canonical uiarc group **id** (Task 7 §2.1, Lane A). Idempotent; `--dry-run`
 * prints planned edits without writing.
 *
 * The canonical mapping lives in `src/site/groups.ts` (`COMPONENT_GROUP`) — this
 * script never re-declares it, so the registry and the migration cannot drift.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const docsDir = join(root, 'src/site/docs');
const { COMPONENT_GROUP, GROUP_BY_ID } = await import(join(root, 'src/site/groups.ts'));

const dryRun = process.argv.includes('--dry-run');
const files = readdirSync(docsDir)
	.filter((f) => f.endsWith('.ts'))
	.sort();

let changed = 0;
const problems = [];

for (const file of files) {
	const slug = file.replace(/\.ts$/, '');
	const abs = join(docsDir, file);
	const src = readFileSync(abs, 'utf8');
	const m = src.match(/^(\s*)group:\s*(['"])(.*?)\2,?\s*$/m);
	if (!m) {
		problems.push(`${slug}: no group: field found`);
		continue;
	}
	const target = COMPONENT_GROUP[slug];
	if (!target) {
		problems.push(`${slug}: not in COMPONENT_GROUP (src/site/groups.ts) — left unchanged`);
		continue;
	}
	if (!GROUP_BY_ID[target]) {
		problems.push(`${slug}: COMPONENT_GROUP target "${target}" is not a UI_GROUPS id`);
		continue;
	}
	if (m[3] === target) continue;
	if (!dryRun) writeFileSync(abs, src.replace(m[0], `${m[1]}group: '${target}',`));
	console.log(`${dryRun ? 'would change' : 'changed'}  ${slug}: ${JSON.stringify(m[3])} -> "${target}"`);
	changed++;
}

console.log(
	`\nnormalize-groups${dryRun ? ' (dry run)' : ''}: ${files.length} doc(s), ${changed} change(s), ${problems.length} problem(s)`
);
for (const p of problems) console.error(`  PROBLEM ${p}`);
process.exit(problems.length > 0 ? 1 : 0);
