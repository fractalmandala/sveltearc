// Stage 1, whole-library mode: extract every component namespace the installed
// headless library ships, not just the one being worked on.
//
// This is a runner, not a second extractor. It shells out to
// extract-anatomy.mjs once per namespace so a namespace the extractor cannot
// read (an unrecognised barrel shape, a package that moved its state module)
// fails on its own instead of taking the whole run down - the point of
// extracting everything is to learn exactly which components the pipeline can
// already see, and which need extractor work.
//
// Usage:
//   node scripts/extract-all.mjs                 # every namespace, overwrite
//   node scripts/extract-all.mjs --only dialog,tabs
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { ROOT, parseArgv } from './lib.mjs';

const { flags } = parseArgv(process.argv.slice(2));
const bitsDir = resolve(ROOT, String(flags.dir ?? 'node_modules/bits-ui/dist/bits'));
if (!existsSync(bitsDir)) {
	console.error(`No namespace directory at ${bitsDir}. Run pnpm install first.`);
	process.exit(1);
}

const only = flags.only ? String(flags.only).split(',').map((name) => name.trim()) : null;
const directories = readdirSync(bitsDir, { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	// `utilities` holds shared helpers (FocusScope, PopperLayer), not components.
	.filter((entry) => entry.name !== 'utilities')
	.map((entry) => entry.name)
	.filter((name) => !only || only.includes(name))
	.sort();

const ok = [];
const failed = [];

for (const directory of directories) {
	const component = pascal(directory);
	const out = `pipeline/anatomy/${directory}.json`;
	try {
		const stdout = execFileSync(
			process.execPath,
			[
				resolve(ROOT, 'pipeline/extract-anatomy.mjs'),
				`node_modules/bits-ui/dist/bits/${directory}`,
				'--component',
				component,
				'--out',
				out,
				'--source',
				'bits-ui'
			],
			{ cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
		);
		const partCount = (stdout.match(/^\s+\S+\s+</gm) ?? []).length;
		ok.push({ component, directory, out, partCount, notes: (stdout.match(/note |warn /g) ?? []).length });
	} catch (error) {
		const message = `${error.stderr ?? ''}${error.stdout ?? ''}`.trim().split('\n').filter(Boolean).pop() ?? error.message;
		failed.push({ component, directory, message });
	}
}

console.log(`extracted ${ok.length}/${directories.length} namespace(s)\n`);
for (const entry of ok) {
	console.log(
		`  ok    ${entry.directory.padEnd(20)} ${String(entry.partCount).padStart(2)} part(s)` +
			(entry.notes ? `  (${entry.notes} note/warning)` : '')
	);
}
for (const entry of failed) console.log(`  FAIL  ${entry.directory.padEnd(20)} ${entry.message}`);
console.log(`\n${ok.length} anatomies written to pipeline/anatomy/`);

/** `toggle-group` -> `ToggleGroup`; `menubar` -> `Menubar`. */
function pascal(name) {
	return name
		.split('-')
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join('');
}
