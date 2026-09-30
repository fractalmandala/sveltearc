// Stage 5 - the emitter. `pnpm gen` writes, `pnpm gen --check` refuses to write
// and compares bytes instead (the "generated output is clean" gate).
import { compareOutputs, parseArgv, staleOutputs, writeOut } from './lib.mjs';
import { loadData, renderProject } from './compose.mjs';

const { flags } = parseArgv(process.argv.slice(2));
const data = loadData();
const { diags, outputs, plans } = renderProject(data);

if (!diags.ok) {
	diags.report('gen');
	console.error('\nRefusing to write: the recipe does not resolve. Fix the errors above.');
	process.exit(1);
}

if (flags.check) {
	const problems = [...compareOutputs(outputs), ...staleOutputs(outputs)];
	if (problems.length) {
		console.error('Generated output is not clean:');
		for (const problem of problems) console.error(`  ${problem}`);
		console.error('\nRun: node scripts/gen.mjs');
		process.exit(1);
	}
	console.log(`gen --check: ${outputs.size} file(s) byte-identical, no stale files`);
} else {
	for (const [path, contents] of outputs) writeOut(path, contents);
	console.log(`gen: wrote ${outputs.size} file(s)`);
	for (const plan of plans) {
		const parts = plan.parts.map((part) => `${part.partName}=(${part.roleNames.join('+')})`).join(' ');
		console.log(`  ${plan.component}  axes=[${plan.axes.join(', ')}]  ${parts}`);
	}
}
