// Stage 1 - Deterministic anatomy extractor.
//
// Input : an installed headless component namespace, e.g.
//         node_modules/bits-ui/dist/bits/accordion
// Output: anatomy/<name>.json - parts, states, props, snippets.
//
// Three deterministic readers, because real headless libraries put the three
// kinds of information in three different places:
//
//   barrel (exports.js)      part name -> part file, e.g. Root -> components/accordion.svelte
//   state module (*.svelte.js) the part list, and the data-* attributes each part
//                            actually renders at runtime
//   part sources (*.svelte)  props, tag, snippets, static attributes
//
// CORE-IDEA.md's Stage 1 assumed all of that lives in the template as
// `data-slot` / `data-state` attributes. In real bits-ui the template is a single
// `{...mergedProps}` spread and every state attribute is built in JS, so a
// template-only walk returns an anatomy with no states at all - which is exactly
// the kind of thing that would have looked fine in a demo and failed in practice.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { parse as parseJs } from 'acorn';
import { parse as parseSvelte } from 'svelte/compiler';
import { ROOT, header, parseArgv, readText, stableStringify, writeOut } from './lib.mjs';

const { flags, positional } = parseArgv(process.argv.slice(2));
const namespaceRel = positional[0] ?? 'node_modules/bits-ui/dist/bits/accordion';
const component = String(flags.component ?? 'Accordion');
const source = String(flags.source ?? 'bits-ui');
const outRel = String(flags.out ?? `anatomy/${component.toLowerCase()}.json`);
const namespaceAbs = resolve(ROOT, namespaceRel);		if (!existsSync(namespaceAbs)) {
		console.error(`Component namespace not found: ${namespaceRel}\nRun pnpm install first.`);
	process.exit(1);
}

const ELEMENT_TYPES = new Set([
	'Component',
	'RegularElement',
	'SlotElement',
	'SvelteBody',
	'SvelteComponent',
	'SvelteDocument',
	'SvelteElement',
	'SvelteFragment',
	'SvelteHead',
	'SvelteSelf',
	'SvelteWindow',
	'TitleElement'
]);

const barrel = readBarrel(namespaceAbs);
const runtime = readStateModule(namespaceAbs, component);

// Cross-check the two part lists. They are *related but not equal*: the barrel is
// the public API, while the state module also names internal holders (checkbox's
// hidden `input`, dialog's `action`/`cancel` close variants) and omits pure
// passthroughs like `portal`. So this reports the difference rather than failing
// on it - the barrel stays authoritative for parts, and state attributes are
// matched onto it by normalised name.
const barrelParts = new Set(barrel.map((entry) => normalise(entry.name)));
const declaredParts = new Set([...runtime.parts].map(normalise));
const onlyBarrel = [...barrelParts].filter((name) => !declaredParts.has(name));
const onlyState = [...declaredParts].filter((name) => !barrelParts.has(name));
if (onlyBarrel.length || onlyState.length) {
	console.log(
		`  note  part lists differ - exported only: [${onlyBarrel.join(', ')}] · state only: [${onlyState.join(', ')}]`
	);
}

function normalise(name) {
	return name.replace(/-/g, '').toLowerCase();
}

/** `RadioGroup` -> `radio-group`, `GroupLabel` -> `group-label`. */
function kebab(name) {
	return name
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
		.toLowerCase();
}

const parts = {};
const snippets = new Set();
const states = {};

for (const entry of barrel) {
	const fileRel = `${namespaceRel}/${entry.file}`;
	const text = readText(fileRel);
	const ast = parseSvelte(text, { modern: true, filename: entry.file });
	const props = extractProps(ast, text);

	const partSnippets = new Set();
	const elements = [];
	walkHtml(ast.fragment, (node) => {
		if (ELEMENT_TYPES.has(node.type)) elements.push(node);
	});
	// Real parts have no data-slot: they are `<div {...mergedProps}>`. The slot
	// name is a pipeline convention (`<component>-<part>`), which the emitter then
	// stamps onto the generated wrapper, so Sass and DOM agree by construction.
	const slotElements = elements.filter((element) => describeAttributes(element, text).staticAttributes['data-slot']);
	// Prefer a real DOM element: dialog-content's outermost node is a `<FocusScope>`
	// utility component, and attributes on a component are props, not a hook. The
	// element that actually receives `{...mergedProps}` is nested inside it.
	const domElements = elements.filter((element) => element.type === 'RegularElement');
	// A part may render no element at all: dialog.svelte is a pure context provider
	// whose entire body is `{@render children?.()}`. That is not an error, it means
	// the part simply has no DOM to style - which the gates then enforce.
	const root = slotElements[0] ?? domElements[0] ?? elements[0] ?? null;
	const elementless = root === null;

	const { bindings, dynamicAttributes, staticAttributes } = root
		? describeAttributes(root, text)
		: { bindings: [], dynamicAttributes: [], staticAttributes: {} };
	// `data-slot` is a pipeline convention, not a library attribute: real bits-ui
	// parts are `<div {...mergedProps}>` with no marker of their own. Kebab-casing
	// the component name keeps the marker, the CSS class, the anatomy filename, the
	// recipe and the playground slug spelled the same way - `radio-group-item`, not
	// `radiogroup-item`.
	const dataSlot = staticAttributes['data-slot'] ?? `${kebab(component)}-${kebab(entry.name)}`;
	// Outlets are collected from the whole part file, not the root element subtree:
	// bits-ui's `child` render prop is rendered in an `{#if child}` branch that sits
	// *beside* the element carrying the props spread.
	for (const snippet of collectSnippets(ast.fragment, text)) partSnippets.add(snippet);

	const partStates = new Set();
	// `GroupLabel` (barrel) vs `group-label` (state module): normalise both sides.
	const runtimeAttributes = runtime.attributes[normalise(entry.name)] ?? {};
	for (const [name, info] of Object.entries(runtimeAttributes)) {
		if (info.values) for (const value of info.values) partStates.add(value);
		if (info.state) partStates.add(info.state);
	}
	// Template-level conditional states (e.g. `data-state={open ? 'open' : 'closed'}`)
	// still count, for libraries that do put them in the markup.
	for (const attribute of dynamicAttributes) {
		if (!attribute.name.startsWith('data-') || runtimeAttributes[attribute.name]) continue;
		const literalValues = [...attribute.expression.matchAll(/'([^']*)'|"([^"]*)"/g)]
			.map((match) => match[1] ?? match[2])
			.filter((value) => /^[a-z][a-z-]*$/.test(value));
		if (literalValues.length) {
			for (const value of literalValues) partStates.add(value);
			continue;
		}
		const propName = attribute.expression.trim();
		if (props[propName]?.type === 'boolean') partStates.add(attribute.name.slice('data-'.length));
	}

	for (const snippet of partSnippets) snippets.add(snippet);
	if (partStates.size) states[entry.name] = [...partStates].sort();

	parts[entry.name] = {
		bindings: [...bindings].sort(),
		dataSlot,
		elementless,
		exportName: entry.exportName,
		dynamicAttributes: dynamicAttributes.map((attribute) => attribute.name).sort(),
		file: basename(entry.file),
		props,
		role: staticAttributes.role ?? null,
		runtimeAttributes,
		snippets: [...partSnippets].sort(),
		staticAttributes: Object.fromEntries(
			Object.entries(staticAttributes).filter(([name]) => name !== 'data-slot')
		),
		tag: root?.name ?? null
	};
}

const anatomy = {
	$generated: header('scripts/extract-anatomy.mjs'),
	component,
	namespace: namespaceRel,
	parts,
	runtimeParts: runtime.parts,
	snippets: [...snippets].sort(),
	source,
	states
};

writeOut(outRel, stableStringify(anatomy));
console.log(`anatomy: ${Object.keys(parts).length} part(s) from ${namespaceRel}`);
for (const [name, part] of Object.entries(parts)) {
	const attrs = Object.keys(part.runtimeAttributes);
	console.log(
		`  ${name.padEnd(12)} <${part.tag ?? 'none'}>`.padEnd(24) +
			` states: ${(states[name] ?? []).join(', ') || '-'}`.padEnd(34) +
			` attrs: ${attrs.join(', ') || '-'}`
	);
}

// --- barrel: part name -> file ----------------------------------------------

function readBarrel(dir) {
	const candidates = ['exports.js', 'index.js'];
	const file = candidates.map((name) => resolve(dir, name)).find((path) => existsSync(path));
	if (!file) {
		console.error(`No barrel (${candidates.join(' / ')}) in ${namespaceRel}`);
		process.exit(1);
	}
	const entries = [];
	for (const [index, line] of readText(`${namespaceRel}/${basename(file)}`).split('\n').entries()) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('//')) continue;
		// A re-export barrel is a trivial, machine-generated grammar. It is not
		// Svelte, so svelte/compiler cannot read it; a strict pattern that fails
		// loudly on anything unrecognised is safer than pulling in a JS parser for
		// five lines of `export { default as X } from "..."`.
		const match = trimmed.match(/^export\s*\{\s*default\s+as\s+([A-Za-z_$][\w$]*)\s*\}\s*from\s*["'](.+?)["'];?$/);
		if (!match) {
			// Barrels also re-export helpers that are not parts (tooltip exports
			// `createTooltipTether`). Only default exports are components, so any
			// other well-formed re-export is skipped - but anything that is not an
			// export statement at all still aborts, rather than being ignored.
			if (/^export\s*\{[\s\S]*\}\s*from\s*["'][^"']+["'];?$/.test(trimmed)) continue;
			console.error(`${basename(file)}:${index + 1}: unrecognised barrel line: ${trimmed}`);
			process.exit(1);
		}
		// `exportName` is the namespace member (`Item`), which is what generated code
		// must reference: bits-ui's files are named `accordion-item.svelte`, so the
		// filename is not a usable component tag.
		entries.push({ exportName: match[1], file: match[2].replace(/^\.\//, ''), name: match[1].toLowerCase() });
	}
	if (!entries.length) {
		console.error(`${basename(file)}: no parts exported`);
		process.exit(1);
	}
	return entries;
}

// --- state module: part list + runtime data-* attributes --------------------

function readStateModule(dir, componentName) {
	// The state module is named after the namespace directory, not the component:
	// bits-ui ships `pin-input.svelte.js`, and `PinInput.toLowerCase()` is
	// `pininput`, so deriving the name loses every multi-word component. Discover
	// it instead, preferring the directory's own name.
	const candidates = readdirSync(dir).filter((name) => name.endsWith('.svelte.js'));
	const moduleName =
		candidates.find((name) => name === `${basename(dir)}.svelte.js`) ??
		candidates.find((name) => name === `${componentName.toLowerCase()}.svelte.js`) ??
		candidates[0];
	if (!moduleName) {
		console.warn(`  warn  no *.svelte.js in ${basename(dir)}: no runtime attributes will be extracted`);
		return { attributes: {}, helpers: { enums: {}, flags: new Set() }, parts: [] };
	}
	const text = readText(`${namespaceRel}/${moduleName}`);
	const ast = parseJs(text, { ecmaVersion: 'latest', sourceType: 'module' });
	const helpers = readHelpers(ast, dir);

	let attrsVar = null;
	let runtimeParts = [];
	walkJs(ast, (node) => {
		if (node.type !== 'CallExpression' || node.callee?.name !== 'createBitsAttrs') return;
		const config = node.arguments?.[0];
		if (config?.type !== 'ObjectExpression') return;
		for (const property of config.properties ?? []) {
			// Object literal keys are Identifiers (`.name`), not Literals (`.value`).
			const key = property.key?.name ?? property.key?.value;
			if (key !== 'parts' || property.value?.type !== 'ArrayExpression') continue;
			runtimeParts = property.value.elements.map((element) => element.value);
		}
	});

	// The attribute variable is the const that createBitsAttrs is assigned to.
	walkJs(ast, (node) => {
		if (node.type !== 'VariableDeclarator') return;
		if (node.init?.type !== 'CallExpression' || node.init.callee?.name !== 'createBitsAttrs') return;
		attrsVar = node.id?.name ?? attrsVar;
	});

	const attributes = {};
	const shared = sharedObjects(ast, helpers);
	// Each state class builds one props object per part, and marks which part it
	// belongs to with a computed key `[switchAttrs.<part>]: ""`. That is a
	// structural signal, so parts are attributed from the code itself instead of
	// guessing from class names or filenames.
	walkJs(ast, (node) => {
		if (node.type !== 'ObjectExpression') return;
		const marker = (node.properties ?? []).find(
			(property) =>
				property.computed &&
				property.key?.type === 'MemberExpression' &&
				(!attrsVar || property.key.object?.name === attrsVar)
		);
		if (!marker) return;
		const part = marker.key.property?.name;
		if (!part) return;
		const key = normalise(part);
		attributes[key] ??= {};
		for (const property of node.properties ?? []) {
			// `...this.root.sharedProps`: a part's props often spread a shared object
			// that carries the state attributes (`data-state` on switch root *and*
			// thumb). Resolving that one level is what makes the state visible on
			// every part it actually reaches.
			if (property.type === 'SpreadElement') {
				const name = spreadName(property.argument);
				for (const [attribute, info] of Object.entries(shared[name] ?? {})) attributes[key][attribute] ??= info;
				continue;
			}
			if (property.computed) continue;
			const name = property.key?.value;
			if (typeof name !== 'string' || !name.startsWith('data-')) continue;
			attributes[key][name] = classify(property.value, name, helpers);
		}
	});

	return { attributes, helpers, parts: runtimeParts, shared };
}

/** Last identifier of a spread expression: `this.root.sharedProps` -> `sharedProps`. */
function spreadName(node) {
	if (node?.type === 'MemberExpression') return node.property?.name ?? null;
	if (node?.type === 'Identifier') return node.name;
	return null;
}

/**
 * `sharedProps = $derived.by(() => ({ "data-state": ... }))` has no part marker of
 * its own; it is an object several parts spread. Index those by their declaring
 * property name so the spread pass above can resolve them.
 */
function sharedObjects(ast, helpers) {
	const shared = {};
	walkJs(ast, (node) => {
		if (!['PropertyDefinition', 'VariableDeclarator'].includes(node.type)) return;
		const key = node.key?.name ?? node.id?.name;
		if (!key || !node.value && !node.init) return;
		let found = null;
		const search = (child) => {
			if (found || !child || typeof child !== 'object') return;
			if (Array.isArray(child)) return void child.forEach(search);
			if (child.type === 'ObjectExpression') {
				const marked = (child.properties ?? []).some((property) => property.computed);
				const dataKeys = (child.properties ?? []).filter(
					(property) => typeof property.key?.value === 'string' && property.key.value.startsWith('data-')
				);
				if (!marked && dataKeys.length) {
					found = child;
					return;
				}
			}
			for (const [name, value] of Object.entries(child)) {
				if (['type', 'start', 'end', 'loc'].includes(name)) continue;
				search(value);
			}
		};
		search(node.value ?? node.init);
		if (found) shared[key] = found;
	});
	for (const [key, object] of Object.entries(shared)) {
		shared[key] = Object.fromEntries(
			object.properties
				.filter((property) => typeof property.key?.value === 'string' && property.key.value.startsWith('data-'))
				.map((property) => [property.key.value, classify(property.value, property.key.value, helpers)])
		);
	}
	return shared;
}

function classify(node, name, helpers) {
	if (node?.type === 'CallExpression') {
		const callee = node.callee?.name;
		if (helpers.enums[callee]) return { kind: 'enum', values: helpers.enums[callee] };
		if (helpers.flags.has(callee)) return { kind: 'flag', state: name.slice('data-'.length) };
	}
	return { kind: 'dynamic' };
}

/**
 * Read the value sets out of the library's own attribute helpers instead of
 * hard-coding them: `getDataOpenClosed(condition)` returns "open"/"closed",
 * `getCheckboxDataState(...)` returns "checked"/"unchecked"/"indeterminate",
 * and every component defines its own. Scanning the helper bodies means a new
 * component needs no new table entry.
 *
 * Sources: the state module itself (bits-ui defines some helpers locally) and
 * whatever relative modules it imports (the shared attrs module).
 */
function readHelpers(stateModuleAst, dir) {
	const enums = {};
	const flags = new Set();
	const collect = (ast) => {
		walkJs(ast, (node) => {
			let fn = null;
			let name = null;
			if (node.type === 'FunctionDeclaration' && node.id) {
				name = node.id.name;
				fn = node;
			} else if (
				node.type === 'VariableDeclarator' &&
				node.id?.name &&
				['ArrowFunctionExpression', 'FunctionExpression'].includes(node.init?.type)
			) {
				name = node.id.name;
				fn = node.init;
			} else if (node.type === 'MethodDefinition' && node.kind === 'method' && node.key?.name) {
				name = node.key.name;
				fn = node.value;
			}
			if (!name || !fn) return;
			// `boolToEmptyStrOrUndef` and friends turn a boolean into an attribute
			// whose presence is the value: the name after `data-` is the state.
			if (/^boolTo/.test(name)) {
				flags.add(name);
				return;
			}
			if (!/Data/.test(name)) return;
			const values = [...new Set(returnedStrings(fn))].filter((value) => /^[a-z][a-z-]*$/.test(value)).sort();
			if (values.length) enums[name] = values;
		});
	};

	collect(stateModuleAst);
	for (const declaration of stateModuleAst.body) {
		if (declaration.type !== 'ImportDeclaration' || !declaration.source.value.startsWith('.')) continue;
		const file = resolve(dir, declaration.source.value);
		if (!existsSync(file)) continue;
		try {
			collect(parseJs(readFileSync(file, 'utf8'), { ecmaVersion: 'latest', sourceType: 'module' }));
		} catch {
			// A dependency that will not parse simply contributes no helper knowledge.
		}
	}
	return { enums, flags };
}

/** String literals a function returns, ignoring object keys and nested functions. */
function returnedStrings(fn) {
	const values = [];
	const collect = (node) => {
		if (!node || typeof node !== 'object') return;
		if (Array.isArray(node)) {
			for (const child of node) collect(child);
			return;
		}
		if (node.type === 'Literal') {
			if (typeof node.value === 'string') values.push(node.value);
			return;
		}
		if (['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(node.type)) return;
		for (const [key, value] of Object.entries(node)) {
			if (['type', 'start', 'end', 'loc', 'key', 'callee'].includes(key)) continue;
			collect(value);
		}
	};
	const body = fn.body;
	if (!body) return values;
	if (body.type === 'BlockStatement') {
		walkJs(body, (node) => {
			if (node.type === 'ReturnStatement') collect(node.argument);
		});
	} else {
		collect(body);
	}
	return values;
}

// --- part source: props, tag, snippets --------------------------------------

function describeAttributes(node, text) {
	const staticAttributes = {};
	const dynamicAttributes = [];
	const bindings = [];
	for (const attribute of node.attributes ?? []) {
		if (attribute.type === 'SpreadAttribute') continue;
		if (attribute.type === 'BindDirective') {
			bindings.push(attribute.name);
			continue;
		}
		if (attribute.type === 'ClassDirective') {
			dynamicAttributes.push({ expression: 'dynamic', name: `class:${attribute.name}` });
			continue;
		}
		if (attribute.type !== 'Attribute') continue;
		const parts = attribute.value === true ? [] : Array.isArray(attribute.value) ? attribute.value : [attribute.value];
		if (parts.length && parts.every((value) => value.type === 'Text')) {
			staticAttributes[attribute.name] = parts.map((value) => value.data).join('');
			continue;
		}
		if (attribute.value === true) {
			staticAttributes[attribute.name] = true;
			continue;
		}
		const expressions = parts
			.filter((value) => value.type === 'ExpressionTag' || value.type === 'AttributeShorthand')
			.map((value) => text.slice(value.expression.start, value.expression.end));
		dynamicAttributes.push({ expression: expressions.join(' ') || 'dynamic', name: attribute.name });
	}
	return { bindings, dynamicAttributes, staticAttributes };
}

function collectSnippets(node, text) {
	const found = new Set();
	walkHtml(node, (child) => {
		if (child.type !== 'RenderTag') return;
		const expression = text.slice(child.expression.start, child.expression.end);
		const name = expression.match(/^[A-Za-z_$][\w$]*/);
		if (name) found.add(name[0]);
	});
	return found;
}

function walkHtml(node, visit) {
	if (!node || typeof node !== 'object') return;
	if (Array.isArray(node)) {
		for (const child of node) walkHtml(child, visit);
		return;
	}
	if (typeof node.type !== 'string') return;
	visit(node);
	switch (node.type) {
		case 'Fragment':
			walkHtml(node.nodes, visit);
			break;
		case 'Root':
		case 'IfBlock':
			walkHtml(node.fragment ?? node.consequent, visit);
			if (node.type === 'IfBlock') walkHtml(node.alternate, visit);
			break;
		case 'SnippetBlock':
			walkHtml(node.body, visit);
			break;
		case 'EachBlock':
			walkHtml(node.body, visit);
			break;
		case 'KeyBlock':
			walkHtml(node.fragment, visit);
			break;
		case 'AwaitBlock':
			walkHtml(node.pending, visit);
			walkHtml(node.then, visit);
			walkHtml(node.catch, visit);
			break;
		case 'Component':
		case 'RegularElement':
		case 'SlotElement':
		case 'SvelteBody':
		case 'SvelteComponent':
		case 'SvelteDocument':
		case 'SvelteElement':
		case 'SvelteFragment':
		case 'SvelteHead':
		case 'SvelteSelf':
		case 'SvelteWindow':
		case 'TitleElement':
			walkHtml(node.fragment, visit);
			break;
		default:
			break;
	}
}

function walkJs(node, visit) {
	if (!node || typeof node !== 'object') return;
	if (Array.isArray(node)) {
		for (const child of node) walkJs(child, visit);
		return;
	}
	if (typeof node.type !== 'string') return;
	visit(node);
	for (const [key, value] of Object.entries(node)) {
		if (key === 'type' || key === 'start' || key === 'end' || key === 'loc') continue;
		walkJs(value, visit);
	}
}

function extractProps(ast, text) {
	const declared = {};
	for (const node of ast.instance?.content.body ?? []) {
		if (node.type !== 'TSTypeAliasDeclaration' || node.id.name !== 'Props') continue;
		const members = node.typeAnnotation.type === 'TSTypeLiteral' ? node.typeAnnotation.members : [];
		for (const member of members) {
			const key = member.key?.name ?? member.key?.value;
			if (key) declared[key] = { ...(describeType(member.typeAnnotation) ?? { type: 'unknown' }), optional: member.optional === true };
		}
	}

	const props = {};
	for (const node of ast.instance?.content.body ?? []) {
		if (node.type !== 'VariableDeclaration') continue;
		for (const declaration of node.declarations) {
			if (declaration.id.type !== 'ObjectPattern') continue;
			const init = declaration.init;
			if (init?.type !== 'CallExpression') continue;
			const callee = init.callee;
			const called = callee.type === 'Identifier' ? callee.name : callee.type === 'MemberExpression' ? callee.property?.name : null;
			if (called !== '$props') continue;

			for (const property of declaration.id.properties) {
				if (property.type === 'RestElement') continue;
				const name = property.key?.name ?? property.key?.value;
				const local = property.value.type === 'AssignmentPattern' ? property.value.left.name : property.value.name;
				const isDefault = property.value.type === 'AssignmentPattern';
				const defaultNode = isDefault ? property.value.right : null;
				const defaultText = defaultNode ? text.slice(defaultNode.start, defaultNode.end) : null;
				// `ref = $bindable(null)` must stay two-way bindable through the
				// generated wrapper, or a pass-through component silently breaks
				// consumers' `bind:` usage.
				const isBindable = defaultNode?.type === 'CallExpression' && defaultNode.callee?.name === '$bindable';
				const described = declared[name] ?? describeType(property.value.typeAnnotation) ?? { type: 'unknown' };
				const entry = {
					bindable: isBindable,
					hasDefault: isDefault || isBindable,
					local: local ?? name,
					// `required` is only claimed when the type was actually resolved. Real
					// bits-ui declares its props through imported type aliases, so "has no
					// default and no `?` in the destructure" is not evidence: it would
					// announce `<Button.Root>` as requiring `href` and `type`, and bits-ui
					// marks both optional (`href?: never` on the anchor branch). An
					// unresolved type means we cannot know, and a wrapper must not invent a
					// constraint the library does not have.
					required: !isDefault && !isBindable && described.optional !== true && described.type !== 'unknown',
					type: described.type
				};
				if (described.values) entry.values = described.values;
				if (isDefault) {
					// `$bindable()` with no argument means "no default" - `text.slice(undefined, undefined)`
					// would return the whole file, so the argument is checked first.
					const argument = defaultNode.arguments?.[0];
					entry.default = isBindable
						? { bindable: true, value: argument ? literalValue(text.slice(argument.start, argument.end)) : null }
						: literalValue(defaultText);
				}
				props[name] = entry;
			}
		}
	}
	return Object.fromEntries(Object.entries(props).sort(([a], [b]) => a.localeCompare(b)));
}

function describeType(node) {
	if (!node) return null;
	switch (node.type) {
		case 'TSKeywordType':
			return { type: keywordKind(node.kind) };
		case 'TSBooleanKeyword':
			return { type: 'boolean' };
		case 'TSStringKeyword':
			return { type: 'string' };
		case 'TSNumberKeyword':
			return { type: 'number' };
		case 'TSTypeAnnotation':
			return describeType(node.typeAnnotation);
		case 'TSUnionType': {
			const allLiterals = node.types.filter((type) => type.type === 'TSLiteralType');
			if (allLiterals.length === node.types.length) {
				const strings = allLiterals.filter((type) => typeof type.literal.value === 'string').map((type) => type.literal.value);
				if (strings.length === allLiterals.length) return { type: 'union', values: strings };
				if (allLiterals.every((type) => typeof type.literal.value === 'number')) return { type: 'number' };
				return { type: 'unknown' };
			}
			const literals = node.types
				.filter((type) => type.type === 'TSLiteralType' && typeof type.literal.value === 'string')
				.map((type) => type.literal.value);
			const scalars = node.types
				.filter((type) => type.type !== 'TSLiteralType')
				.map((type) => describeType(type)?.type)
				.filter(Boolean);
			if (scalars.includes('snippet')) return { type: 'snippet' };
			if (scalars.includes('boolean') && !literals.length) return { type: 'boolean' };
			if (!literals.length) return { type: scalars[0] ?? 'unknown' };
			return { type: 'union', values: literals };
		}
		case 'TSTypeReference': {
			const name = node.typeName?.name;
			if (name === 'Snippet') return { type: 'snippet' };
			return { type: name === 'Array' ? 'array' : 'unknown' };
		}
		case 'TSArrayType':
			return { type: 'array' };
		default:
			return null;
	}
}

function keywordKind(kind) {
	const normalized = String(kind ?? '').toLowerCase();
	if (normalized === 'unknown' || !normalized) return 'unknown';
	return normalized;
}

function literalValue(text) {
	if (text === null || text === undefined) return null;
	if (text === 'true' || text === 'false') return text === 'true';
	if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
	const quoted = text.match(/^(?:'([^']*)'|"([^"]*)")$/);
	if (quoted) return quoted[1] ?? quoted[2];
	return { raw: text };
}
