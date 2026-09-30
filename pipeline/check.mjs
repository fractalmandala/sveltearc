// Stage 6 - the gatekeeper. Nine gates, no human in the loop:
//
//   1. referential integrity  recipe parts/roles/axes and adapter tokens resolve
//   2. anatomy coverage       every part has a role; every state is answered
//   3. taxonomy lint          interactive roles focus, adapter satisfies all roles
//   4. token lint             component Sass is token-only, no raw values
//   5. format contract        single-tab indented Sass, no braces/semicolons
//   6. prop parity            every anatomy prop is forwarded by its wrapper
//   7. Svelte compile         every generated wrapper is valid Svelte 5
//   8. Sass compile           generated/styles/index.sass compiles to CSS
//   9. byte stability         disk matches a fresh render exactly
import { resolve } from 'node:path';
import * as sass from 'sass';
import { compile } from 'svelte/compiler';
import { Diagnostics, ROOT, compareOutputs, countByGate, header, parseArgv, readText, staleOutputs, stableStringify, writeOut } from './lib.mjs';
import { loadData, renderProject } from './compose.mjs';

const GATE_NAMES = [
	['referential', 'referential integrity'],
	['coverage', 'anatomy coverage'],
	['taxonomy', 'taxonomy lint'],
	['tokens', 'token lint'],
	['vocabulary', 'vocabulary'],
	['format', 'format contract'],
	['parity', 'prop parity'],
	['svelte', 'Svelte compile'],
	['sass', 'Sass compile'],
	['cascade', 'cascade ties'],
	['determinism', 'byte stability']
];

const { flags } = parseArgv(process.argv.slice(2));
const diag = new Diagnostics();
const data = loadData();
const { diags, outputs, plans } = renderProject(data);
diag.errors.push(...diags.errors);
diag.warnings.push(...diags.warnings);

// --- 3. taxonomy lint ---------------------------------------------------------
const adapterTokens = new Set(Object.keys(data.adapter.values));
const roleTokens = collectRoleTokenNames(data.roles);
const componentSassPrefix = 'generated/styles/components/';

diag.defaultGate = 'taxonomy';
for (const [roleName, role] of Object.entries(data.roles)) {
	if (role.behavior?.interactive && !role.states?.[':focus-visible']) {
		diag.error(`roles.json ${roleName}: interactive roles must declare a ":focus-visible" state`);
	}
	for (const selector of Object.keys(role.states ?? {})) {
		if (!data.vocabulary.stateSelectors.includes(selector)) {
			diag.error(`roles.json ${roleName}: state selector "${selector}" is not in vocabulary.json stateSelectors`);
		}
	}
	for (const name of collectRoleTokenNames({ [roleName]: role })) {
		if (!adapterTokens.has(`--${name}`) && !data.vocabulary.keywords.includes(name)) {
			diag.error(`roles.json ${roleName}: "${name}" is neither a token nor a keyword`);
		}
	}
}

// `$chromeOnly` is the adapter's own declaration of tokens nothing in the
// taxonomy reaches but the playground chrome needs. The checker cannot read the
// playground's Sass, so without it the only ways to keep this gate quiet would
// be deleting a token the UI uses or inventing a role to justify it.
const chromeOnly = new Set(data.adapter.$chromeOnly ?? []);
const unusedTokens = [...adapterTokens].filter(
	(name) => !roleTokens.has(name.replace(/^--/, '')) && !chromeOnly.has(name)
);
if (unusedTokens.length) {
	diag.warn(`tokens/${data.adapter.name}.json defines ${unusedTokens.length} token(s) no role references: ${unusedTokens.sort().join(', ')}`, 'tokens');
}
const collisions = namespaceCollisions(data.roles, data.adapter);
if (collisions.length) {
	diag.warn(`token namespace collision - one prefix carries both type scale and colour: ${collisions.join(', ')}`, 'tokens');
}

// --- 2. state coverage --------------------------------------------------------
// One finding per component rather than one per (part, state): with a whole
// library generating at once, 26 near-identical lines is noise, and noise is how
// a gate gets ignored. The finding is still specific - it names every unanswered
// state - it is just reported once.
for (const plan of plans) {
	const anatomy = safeAnatomy(plan);
	const anatomyStates = anatomy?.states ?? {};
	const anatomyParts = anatomy?.parts ?? {};
	const unstyled = [];
	// `unstyled: { part: [state] }` is where a designer records "this state needs no
	// declaration". Without it the gate has only two answers (styled / unanswered)
	// and every resting or aria-only state becomes permanent noise. The declaration
	// is validated in both directions, so it cannot rot into a lie.
	for (const [partName, states] of Object.entries(plan.recipe.unstyled ?? {})) {
		if (!anatomyParts[partName]) {
			diag.error(`${plan.recipe.path}: unstyled names part "${partName}", which the anatomy does not have`);
			continue;
		}
		for (const state of states) {
			if (!(anatomyStates[partName] ?? []).includes(state)) {
				diag.error(`${plan.recipe.path}: unstyled names "${partName}[${state}]", which the anatomy does not declare`);
			}
		}
	}
	for (const part of plan.parts) {
		// States this part's own roles actually answer, e.g. `&[data-disabled]` -> disabled.
		const styled = new Set();
		for (const state of part.declarations.states) {
			for (const match of state.selector.matchAll(/="([a-z-]+)"|\bdata-([a-z-]+)\b/g)) styled.add(match[1] ?? match[2]);
		}
		const declared = new Set(plan.recipe.unstyled?.[part.partName] ?? []);
		for (const state of anatomyStates[part.partName] ?? []) {
			if (state === 'closed' || state === 'default') continue; // resting state
			if (styled.has(state)) {
				// A state that IS styled must not also be declared unstyled.
				if (declared.has(state)) {
					diag.error(
						`${plan.recipe.path}: "${part.partName}[${state}]" is declared unstyled but a role styles it - remove the declaration`,
						'coverage'
					);
				}
				continue;
			}
			if (declared.has(state)) continue;
			unstyled.push(`${part.partName}[${state}]`);
		}
	}
	if (unstyled.length) {
		diag.warn(
			`${plan.recipe.slug}: ${unstyled.length} state(s) the library declares that no role answers: ${unstyled.join(', ')} - style them, or declare them under "unstyled" in ${plan.recipe.path}`,
			'coverage'
		);
	}
}

// --- 4-6. per-file gates ------------------------------------------------------
for (const [path, contents] of outputs) {
	let current;
	try {
		current = readText(path);
	} catch {
		diag.error(`${path}: missing on disk (run gen)`, 'determinism');
		continue;
	}
	// JSON cannot carry a comment banner, so its marker is the `$generated` field.
	const banner = path.endsWith('.json')
		? current.includes('"$generated"')
		: current.split('\n')[0].includes('@generated by uiautomation/pipeline');
	if (!banner) {
		diag.error(`${path}: missing the @generated banner, so gen would silently overwrite hand edits`, 'determinism');
	}
	if (path.endsWith('.sass')) {
		// _tokens.sass is the adapter's own output (raw values are its job) and
		// index.sass is an @use manifest; only component Sass is under the rules.
		if (path.startsWith(componentSassPrefix)) lintComponentSass(path, current, diag);
	} else if (path.endsWith('.svelte')) {
		lintSvelte(path, current, diag);
	}
}

// --- 6. prop parity -----------------------------------------------------------
for (const plan of plans) {
	for (const part of plan.parts) {
		const path = `generated/components/${plan.component}/${part.exportName}.svelte`;
		let current;
		try {
			current = readText(path);
		} catch {
			continue;
		}
		for (const propName of Object.keys(part.props)) {
			if (!new RegExp(`\\b${propName}\\b`).test(current)) {
				diag.error(`${path}: anatomy prop "${propName}" is not forwarded by the wrapper`, 'parity');
			}
		}
		for (const axis of part.axes) {
			if (!current.includes(`data-${axis}={`)) {
				diag.error(`${path}: part declares axis "${axis}" but the wrapper does not render data-${axis}`, 'parity');
			}
		}
	}
}

// --- 8. Sass compile ----------------------------------------------------------
try {
	const stylesRoot = resolve(ROOT, 'generated/styles');
	const compiled = sass.compile(resolve(stylesRoot, 'index.sass'), { loadPaths: [stylesRoot], style: 'expanded' });
	for (const plan of plans) {
		for (const part of plan.parts) {
			if (!compiled.css.includes(`.${part.className}`)) {
				diag.error(`Sass compiled but produced no rule for .${part.className}`, 'sass');
			}
		}
	}
	console.log(`sass compile: ${plans.reduce((total, plan) => total + plan.parts.length, 0)} part selector(s) emitted`);
} catch (error) {		diag.error(`Sass failed to compile: ${error.message}`, 'sass');
}

// --- 9. byte stability --------------------------------------------------------
if (!flags['allow-drift']) {
	for (const problem of [...compareOutputs(outputs), ...staleOutputs(outputs)]) {
		diag.error(`generated output is not clean: ${problem}`, 'determinism');
	}
}

// --- report -------------------------------------------------------------------
// Machine-readable gate results, so the playground (and CI) can show which gate
// produced which finding instead of a flat list of strings.
writeOut(
	'report.json',
	stableStringify({
		$generated: header('scripts/check.mjs'),
		components: plans.map((plan) => ({
			axes: plan.axes,
			component: plan.component,
			parts: plan.parts.map((part) => ({ exportName: part.exportName, partName: part.partName, roles: part.roleNames })),
			slug: plan.recipe.slug,
			tokens: [...plan.usedTokens].sort()
		})),
		errors: diag.errors,
		gates: GATE_NAMES.map(([name, label]) => ({
			errors: diag.errors.filter((error) => error.gate === name).length,
			label,
			name,
			warnings: diag.warnings.filter((warning) => warning.gate === name).length
		})),
		generated: [...outputs.keys()].sort(),
		summary: {
			errors: diag.errors.length,
			errorsByGate: countByGate(diag.errors),
			warnings: diag.warnings.length,
			warningsByGate: countByGate(diag.warnings)
		},
		warnings: diag.warnings
	})
);

process.exit(diag.report('check') ? 0 : 1);

// --- helpers -----------------------------------------------------------------

function collectRoleTokenNames(roles) {
	const names = new Set();
	const record = (property, value) => {
		if (property === 'transition') {
			// [target-property, duration-token, easing-token]: the target is a CSS
			// property name, not a token.
			if (Array.isArray(value)) for (const entry of value.slice(1)) record('', entry);
			return;
		}
		if (Array.isArray(value)) return value.forEach((entry) => record('', entry));
		if (typeof value === 'string') names.add(value);
	};
	for (const role of Object.values(roles)) {
		for (const [property, value] of Object.entries(role.tokens ?? {})) record(property, value);
		for (const state of Object.values(role.states ?? {})) for (const [property, value] of Object.entries(state)) record(property, value);
		for (const modifier of Object.values(role.when ?? {})) for (const [property, value] of Object.entries(modifier)) record(property, value);
	}
	return names;
}

/** Tokens whose shared prefix is used both as a type scale and as a colour. */
function namespaceCollisions(roles, adapter) {
	const usage = new Map();
	for (const [roleName, role] of Object.entries(roles)) {
		const record = (property, value) => {
			if (typeof value !== 'string') return;
			if (!(`--${value}` in adapter.values)) return;
			const group = value.split('-')[1];
			if (!usage.has(group)) usage.set(group, { colour: new Set(), size: new Set() });
			const entry = usage.get(group);
			if (property === 'font-size') entry.size.add(`${roleName}.${property} -> ${value}`);
			if (['color', 'background-color', 'border-color', 'outline-color'].includes(property)) entry.colour.add(`${roleName}.${property} -> ${value}`);
		};
		for (const [property, value] of Object.entries(role.tokens ?? {})) record(property, value);
		for (const state of Object.values(role.states ?? {})) for (const [property, value] of Object.entries(state)) record(property, value);
	}
	return [...usage.entries()]
		.filter(([, entry]) => entry.size.size && entry.colour.size)
		.map(([group, entry]) => `--${group}-* (${[...entry.size, ...entry.colour].join(', ')})`);
}

function safeAnatomy(plan) {
	try {
		return JSON.parse(readText(plan.recipe.anatomyPath));
	} catch {
		return null;
	}
}

function lintComponentSass(path, text, diag) {
	const rules = [
		[/#[0-9a-fA-F]{3,8}\b/, 'raw hex colour'],
		[/\b\d+(\.\d+)?px\b/, 'raw px length'],
		[/\b\d+(\.\d+)?(rem|em|ms)\b/, 'raw relative length or duration'],
		[/\brgba?\(/, 'raw rgb() value'],
		[/!important/, '!important'],
		[/[{};]/, 'brace or semicolon (this pipeline emits indented Sass)']
	];
	for (const [pattern, label] of rules) {
		const match = text.match(pattern);
		if (match) diag.error(`${path}: ${label} found ("${match[0]}") - component Sass must name tokens only`, 'tokens');
	}

	const declared = new Set([...text.matchAll(/var\(--([a-z0-9-]+)\)/g)].map((match) => match[1]));
	const plan = plans.find((entry) => path.endsWith(`/${entry.recipe.slug}.sass`));
	if (plan) {
		for (const name of declared) {
			if (!plan.usedTokens.has(name)) {
				diag.error(`${path}: references --${name}, which no role in ${plan.recipe.path} reaches`, 'tokens');
			}
		}
		for (const name of plan.usedTokens) {
			if (!declared.has(name)) diag.error(`${path}: role expects --${name} but the Sass never uses it`, 'tokens');
		}
	}

	const blocks = parseIndentedSass(text, path, diag);
	for (const part of blocks) {
		for (let i = 0; i < part.nested.length; i++) {
			for (let j = i + 1; j < part.nested.length; j++) {
				const a = part.nested[i];
				const b = part.nested[j];
				if (mutuallyExclusive(a.selector, b.selector)) continue;
				const shared = a.properties.filter((property) => b.properties.includes(property));
				if (!shared.length) continue;
				if (specificity(a.selector) !== specificity(b.selector)) continue;
				// The ordering of vocabulary.json's stateSelectors IS the documented
				// cascade contract, so a tie that resolves the way the contract says it
				// should - library state (`[data-*]`) outranking pointer state
				// (`:hover`, `:active`, `:focus-visible`) - is the contract working, not a
				// finding. Re-reporting it on every run is how a gate trains people to
				// ignore it. What is a finding: a pointer state beating a library state,
				// or two states of the same kind fighting, because neither is a decision
				// anyone recorded anywhere.
				// The stored selector still carries the `&` it was written with
				// (`&[data-selected]`, `&:hover`), so classification looks past it.
				const kind = (selector) => (/^&?\[/.test(selector) ? 'library' : 'pointer');
				if (kind(a.selector) === 'pointer' && kind(b.selector) === 'library') continue;
				diag.warn(
					`${path}: on ${part.selector}, ${a.selector} and ${b.selector} tie on specificity and both set ${shared.join(', ')}; ` +
						`${b.selector} wins by source order - either make that intentional by ordering vocabulary.json's stateSelectors, or merge them`,
					'cascade'
				);
			}
		}
	}
}

function parseIndentedSass(text, path, diag) {
	diag.defaultGate = 'format';
	const blocks = [];
	let part = null;
	for (const [index, raw] of text.split('\n').entries()) {
		if (!raw.trim() || raw.trim().startsWith('//')) continue;
		const indent = raw.match(/^\t*/)[0].length;
		const line = raw.slice(indent).trim();
		if (indent === 0) {
			if (!line.startsWith('.')) {
				diag.error(`${path}:${index + 1}: top-level selector must be a class, got "${line}"`);
				continue;
			}
			part = { nested: [], properties: [], selector: line };
			blocks.push(part);
			continue;
		}
		if (!part) {
			diag.error(`${path}:${index + 1}: indented declaration before any selector`);
			continue;
		}
		// At indent 1 a line is either a nested selector or a declaration. A
		// declaration always starts with the property name; selectors start with
		// `&`, a combinator-free descendant reference, an attribute, a class, or a
		// pseudo-class. (The old rule only accepted `&`, which silently mis-read
		// `[data-state="checked"] &` as a declaration and then reported its body as
		// bad indentation.)
		if (indent === 1 && /^[&.:\[]/.test(line)) {
			part.nested.push({ properties: [], selector: line });
			continue;
		}
		if (indent === 1) {
			part.properties.push(line.split(':')[0].trim());
			continue;
		}
		if (indent === 2 && part.nested.length) {
			part.nested.at(-1).properties.push(line.split(':')[0].trim());
			continue;
		}
		diag.error(`${path}:${index + 1}: unexpected indentation level ${indent}`);
	}
	return blocks;
}

/** Two blocks on the same attribute with different values can never both match. */
function mutuallyExclusive(a, b) {
	const attribute = (selector) => selector.match(/\[([a-z-]+)=/)?.[1];
	const first = attribute(a);
	return Boolean(first) && first === attribute(b) && a !== b;
}

function specificity(selector) {
	const ids = (selector.match(/#[a-zA-Z0-9-_]+/g) ?? []).length;
	const classes = (selector.match(/\.[a-zA-Z0-9-_]+/g) ?? []).length;
	const attributes = (selector.match(/\[[^\]]+\]/g) ?? []).length;
	const pseudoClasses = (selector.match(/(?<!:):[a-zA-Z-]+/g) ?? []).length;
	return [ids, classes + attributes + pseudoClasses].join(',');
}

function lintSvelte(path, text, diag) {
	try {
		const result = compile(text, { filename: path, generate: false });
		for (const warning of result.warnings ?? []) {
			if (warning.code === 'a11y_missing_attribute') continue;
			diag.warn(`${path}: svelte warning ${warning.code}: ${warning.message}`, 'svelte');
		}
	} catch (error) {
		diag.error(`${path}: svelte compile failed - ${error.message}`, 'svelte');
	}
}
