// The pure compiler core.
//
// `planComponent` is a lookup: recipe + anatomy + roles + axes + adapter ->
// a resolved plan. `render*` turns a plan into bytes. There is no per-component
// logic anywhere in this file - which is the whole claim CORE-IDEA.md makes,
// and the reason axes had to move into roles.json (otherwise per-component
// `&[data-size="sm"]` blocks would have to be hand-written here).
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { Diagnostics, ROOT, header, readJson, stableStringify } from './lib.mjs';

export const isRoleKey = (key) => !key.startsWith('$');

export function loadData() {
	return {
		adapter: readJson('tokens/kitui.json'),
		axes: onlyData(readJson('axes.json')),
		roles: onlyData(readJson('roles.json')),
		vocabulary: readJson('vocabulary.json'),
		recipes: readdirSync(resolve(ROOT, 'recipes'))
			.filter((file) => file.endsWith('.json'))
			.sort()
			.map((file) => `recipes/${file}`)
	};
}

function onlyData(object) {
	return Object.fromEntries(Object.entries(object).filter(([key]) => isRoleKey(key)));
}

export function loadRecipe(recipePath) {
	const recipe = readJson(recipePath);
	const anatomyPath = recipe.anatomy ?? `anatomy/${recipe.component.toLowerCase()}.json`;
	return { ...recipe, anatomyPath, path: recipePath, slug: recipePath.replace(/^recipes\//, '').replace(/\.json$/, '') };
}

export function loadAnatomy(recipe) {
	// Anatomy filenames are kebab-case (`toggle-group.json`) while component names
	// are not, so a recipe may name its anatomy file explicitly.
	const path = recipe.anatomy ?? `anatomy/${recipe.component.toLowerCase()}.json`;
	try {
		return readJson(path);
	} catch {
		throw new Error(
			`${recipe.path}: no anatomy at ${path}. Multi-word components need an explicit "anatomy" field, e.g. "anatomy/radio-group.json".`
		);
	}
}

/**
 * Can a role's declarations actually reach a DOM element for this part?
 *
 * Two real bits-ui shapes say no. `dialog.svelte` is a pure context provider
 * whose whole body is `{@render children?.()}` (nothing to style). And
 * tooltip's `arrow` is `FloatingLayerArrow`, a component whose tag the wrapper
 * would pass as a *prop*. Neither is an error: it means the part is re-exported
 * from the headless library instead of wrapped. A recipe may still claim one as
 * styleable by listing it, which is the explicit override.
 */
function isStyleablePart(part) {
	if (part.elementless) return false;
	return /^[a-z]/.test(part.tag ?? '');
}

/** Merge `incoming` over `into` (later wins) while keeping first-seen order. */
function mergeInto(into, incoming) {
	for (const [property, value] of Object.entries(incoming ?? {})) into.set(property, value);
	return into;
}

export function resolveValue(value, context, resolver) {
	const { adapter, vocabulary } = resolver;
	const keywords = new Set(vocabulary.keywords);
	if (Array.isArray(value)) {
		return value.map((entry) => resolveValue(entry, context, resolver)).join(' ');
	}
	if (typeof value !== 'string') {
		resolver.diag.error(`${context}: value must be a string or array of strings, got ${JSON.stringify(value)}`, 'tokens');
		return '';
	}
	// Roles name tokens bare (`bg-raised`); the adapter owns them with the CSS
	// custom-property prefix (`--bg-raised`), because that is what it emits.
	if (`--${value}` in adapter.values) {
		resolver.usedTokens.add(value);
		return `var(--${value})`;
	}
	if (keywords.has(value)) return value;
	resolver.diag.error(`${context}: "${value}" is neither a token in tokens/${adapter.name}.json nor a vocabulary keyword`, 'tokens');
	return '';
}

/**
 * Resolve one component. Returns a plan whose `parts` are already ordered by
 * the recipe: emission order is authored, not incidental.
 */
export function planComponent(recipe, anatomy, data) {
	const diag = new Diagnostics();
	diag.defaultGate = 'referential';
	const resolver = { adapter: data.adapter, diag, usedTokens: new Set(), vocabulary: data.vocabulary };
	const anatomyParts = anatomy.parts ?? {};
	const enabledAxes = recipe.axes ?? [];
	const modifierOrder = enabledAxes.flatMap((axis) => (data.axes[axis]?.values ?? []).map((value) => `${axis}=${value}`));
	const parts = [];

	for (const axis of enabledAxes) {
		if (!data.axes[axis]) diag.error(`${recipe.path}: axis "${axis}" is not declared in axes.json`);
	}
	for (const [partName, roleNames] of Object.entries(recipe.parts ?? {})) {
		const part = anatomyParts[partName];
		if (!part) {
			diag.error(`${recipe.path}: part "${partName}" does not exist in anatomy/${anatomy.component.toLowerCase()}.json`);
			continue;
		}

		const decls = new Map();
		const states = new Map();
		const when = new Map();
		const partAxes = new Set();

		for (const roleName of roleNames) {
			const role = data.roles[roleName];
			if (!role) {
				diag.error(`${recipe.path}: role "${roleName}" is not in roles.json`);
				continue;
			}
			mergeInto(decls, role.tokens);
			for (const [selector, declarations] of Object.entries(role.states ?? {})) {
				if (!data.vocabulary.stateSelectors.includes(selector)) {
					diag.error(`roles.json ${roleName}: state selector "${selector}" is not in vocabulary.json stateSelectors`);
				}
				mergeInto(states.get(selector) ?? states.set(selector, new Map()).get(selector), declarations);
			}
			for (const [modifier, declarations] of Object.entries(role.when ?? {})) {
				const [axis, value] = modifier.split('=');
				if (!data.axes[axis]) {
					diag.error(`roles.json ${roleName}: "${modifier}" names an axis that is not in axes.json`);
					continue;
				}
				if (!data.axes[axis].values.includes(value)) {
					diag.error(`roles.json ${roleName}: "${modifier}" is not a declared value of axis "${axis}"`);
					continue;
				}
				if (!enabledAxes.includes(axis)) continue; // role answers an axis this component does not expose
				partAxes.add(axis);
				mergeInto(when.get(modifier) ?? when.set(modifier, new Map()).get(modifier), declarations);
			}
		}

		// Resolve every declaration to a token or a keyword, in authored order.
		const resolved = {
			base: resolveDecls(decls, `${partName} base`, resolver),
			states: [...states.entries()]
				.map(([selector, declarations]) => ({ declarations: resolveDecls(declarations, `${partName} ${selector}`, resolver), selector }))
				.sort((a, b) => orderOf(data.vocabulary.stateSelectors, a.selector) - orderOf(data.vocabulary.stateSelectors, b.selector)),
			when: [...when.entries()]
				.map(([modifier, declarations]) => {
					const [axis] = modifier.split('=');
					return {
						attribute: data.axes[axis].attribute,
						declarations: resolveDecls(declarations, `${partName} ${modifier}`, resolver),
						modifier
					};
				})
				.sort((a, b) => orderOf(modifierOrder, a.modifier) - orderOf(modifierOrder, b.modifier))
		};

		parts.push({
			axes: [...partAxes].sort(),
			className: part.dataSlot,
			component: anatomy.component,
			declarations: resolved,
			exportName: part.exportName ?? part.file.replace(/\.svelte$/, ''),
			file: part.file,
			partName,
			props: part.props ?? {},
			roleNames: [...roleNames],
			snippets: part.snippets ?? [],
			states: anatomy.states?.[partName] ?? [],
			tag: part.tag
		});
	}

	// Every part the anatomy declares is accounted for: styleable parts must be a
	// design decision in the recipe, everything else is re-exported untouched.
	const passthrough = [];
	for (const [partName, part] of Object.entries(anatomyParts)) {
		if (partName in (recipe.parts ?? {})) continue;
		if (isStyleablePart(part)) {
			diag.error(`${recipe.path}: styleable part "${partName}" has no role assignment`, 'coverage');
			continue;
		}
		passthrough.push({
			exportName: part.exportName ?? part.file.replace(/\.svelte$/, ''),
			partName,
			reason: part.elementless ? 'renders no element' : `renders <${part.tag}>`
		});
	}
	if (!parts.length) diag.error(`${recipe.path}: nothing to generate`);

	return {
		axisDefaults: Object.fromEntries(enabledAxes.map((axis) => [axis, data.axes[axis]?.default])),
		axes: enabledAxes,
		axisValues: Object.fromEntries(enabledAxes.map((axis) => [axis, data.axes[axis]?.values ?? []])),
		component: anatomy.component,
		diag,
		parts,
		passthrough,
		recipe,
		usedTokens: resolver.usedTokens
	};
}

function orderOf(list, value) {
	const index = list.indexOf(value);
	return index === -1 ? list.length : index;
}

function resolveDecls(declarations, context, resolver) {
	const out = [];
	for (const [property, rawValue] of declarations.entries()) {
		if (!resolver.vocabulary.properties.includes(property)) {
			resolver.diag.error(`${context}: property "${property}" is not in vocabulary.json properties`, 'vocabulary');
			continue;
		}
		if (property === 'transition') {
			// Motion discipline: transition is [target-property, duration-token, easing-token].
			// The target is a CSS property name, the other two must resolve to tokens.
			if (!Array.isArray(rawValue) || rawValue.length !== 3) {
				resolver.diag.error(`${context}: transition must be [property, duration-token, easing-token]`, 'vocabulary');
				continue;
			}
			const [target, duration, easing] = rawValue;
			if (!resolver.vocabulary.properties.includes(target)) {
				resolver.diag.error(`${context}: transition target "${target}" is not a CSS property in vocabulary.json`, 'vocabulary');
				continue;
			}
			out.push([property, `${target} ${resolveValue(duration, `${context} duration`, resolver)} ${resolveValue(easing, `${context} easing`, resolver)}`]);
			continue;
		}
		const value = resolveValue(rawValue, `${context} ${property}`, resolver);
		if (value) out.push([property, value]);
	}
	return out;
}

// --- rendering --------------------------------------------------------------

export function renderTokensSass(adapter) {
	const lines = [`// ${header(`tokens/${adapter.name}.json`)}`, ':root'];
	for (const name of Object.keys(adapter.values).sort()) {
		lines.push(`\t${name}: ${adapter.values[name]}`);
	}
	return `${lines.join('\n')}\n`;
}

export function renderComponentSass(plan) {
	const lines = [`// ${header(plan.recipe.path)}`];
	for (const part of plan.parts) {
		lines.push('');
		lines.push(`.${part.className}`);
		for (const [property, value] of part.declarations.base) lines.push(`\t${property}: ${value}`);
		for (const state of part.declarations.states) {
			lines.push('');
			// Most state selectors attach to the part itself (`&:hover`). A few are
			// descendant selectors - `[data-state="checked"] &` styles this part from
			// an ancestor's state - and those already carry their own `&`.
			lines.push(`\t${state.selector.includes('&') ? state.selector : `&${state.selector}`}`);
			for (const [property, value] of state.declarations) lines.push(`\t\t${property}: ${value}`);
		}
		for (const modifier of part.declarations.when) {
			const value = modifier.modifier.split('=')[1];
			lines.push('');
			lines.push(`\t&[${modifier.attribute}="${value}"]`);
			for (const [property, declaration] of modifier.declarations) lines.push(`\t\t${property}: ${declaration}`);
		}
	}
	return `${lines.join('\n')}\n`;
}

/**
 * The resolved plan, as data. The playground renders its inspector from this
 * rather than re-deriving anything in the browser, so what you see on screen is
 * literally what the compiler resolved - and a wrong plan is visible, not buried.
 */
export function renderPlanJson(plan) {
	return stableStringify({
		$generated: header(plan.recipe.path),
		axes: Object.fromEntries(plan.axes.map((axis) => [axis, { default: plan.axisDefaults[axis], values: plan.axisValues[axis] }])),
		component: plan.component,
		recipe: plan.recipe.path,
		slug: plan.recipe.slug,
		passthrough: plan.passthrough.map((part) => ({ exportName: part.exportName, partName: part.partName, reason: part.reason })),
		unstyled: plan.recipe.unstyled ?? {},
		parts: plan.parts.map((part) => ({
			className: part.className,
			declarations: {
				base: part.declarations.base,
				states: part.declarations.states,
				when: part.declarations.when
			},
			exportName: part.exportName,
			file: part.file,
			hasAxes: part.axes,
			partName: part.partName,
			props: part.props,
			roles: part.roleNames,
			snippets: part.snippets,
			states: part.states,
			tag: part.tag
		})),
		source: plan.recipe.source
	});
}

export function renderStyleIndex(componentSlugs) {
	const lines = [`// ${header('recipes/')}`, "@use 'tokens'"];
	for (const slug of [...componentSlugs].sort()) lines.push(`@use 'components/${slug}'`);
	return `${lines.join('\n')}\n`;
}

export function renderPartSvelte(plan) {
	const { component, recipe } = plan;
	const files = [];
	for (const part of plan.parts) {
		const partTag = part.exportName;
		const axisProps = part.axes;
		const props = { ...part.props };
		const propNames = Object.keys(props)
			.filter((name) => name !== 'class' && !part.snippets.includes(name))
			.sort();
		// Snippet outlets come from the headless template's own `{@render x()}`
		// calls, not from prop types: real bits-ui declares its props through an
		// imported type alias, so `children` arrives typed as `unknown`.
		const snippetProps = part.snippets.filter((name) => name in props).sort();

		// `class` is always accepted: the pipeline composes the role class with
		// whatever the consumer passes, and real libraries route `class` through
		// restProps rather than declaring it.
		const typeLines = [];
		for (const name of [			...propNames, ...axisProps, 'class', ...snippetProps].sort()) {
			typeLines.push(`\t\t${name}${typeOf(name, props, axisProps, part, plan)}`);
		}

		// Only what the pipeline owns is destructured: the role class, the axes, the
		// `children` slot, and props the library declares bindable (so `bind:` keeps
		// working through the wrapper). Everything else rides in restProps, which
		// means the wrapper never duplicates the library's prop defaults - the most
		// likely place for silent drift.
		const destructure = [];
		for (const name of Object.keys(props).filter((key) => props[key].bindable).sort()) {
			destructure.push(`${name}${bindableDefault(props[name])}`);
		}
		for (const axis of axisProps) destructure.push(`${axis} = '${plan.axisDefaults[axis]}'`);
		destructure.push("class: className = ''");
		// Renamed on purpose: the template declares its own `children` snippet to
		// forward the library's snippet arguments, so the prop cannot keep that name.
		if (snippetProps.includes('children')) destructure.push('children: childrenProp');
		destructure.push('...restProps');		const attributes = [
			`data-slot="${part.className}"`,
			...axisProps.map((axis) => `data-${axis}={${axis}}`),
			`class="${part.className} {className}"`,
			// The consumer's snippet is passed straight through as a prop rather than
			// wrapped in a snippet of our own. A wrapper that always declares
			// `{#snippet children(...)}` makes `children` defined from the library's
			// point of view even when nobody passed one, which silently defeats parts
			// that fall back to default content - `<Pagination.Page>` renders
			// `{page.value}` only when it has no children, and would render nothing.
			...(snippetProps.includes('children') ? ['children={childrenProp}'] : []),
			...Object.keys(props)
				.filter((key) => props[key].bindable)
				.map((key) => `{${key}}`),
			'{...restProps}'
		];
		// The consumer's snippet is called by the library with whatever arguments the
		// library passes (`{ tickItems, thumbItems }` for Slider.Root), so passing it
		// through untouched is what keeps those arguments intact. There is no wrapper
		// body at all: the wrapper owns attributes, never content.
		const body = [];

		files.push({
			contents: [
				`<!-- ${header(recipe.path)} -->`,
				'<script lang="ts">',
				`\timport { ${recipe.importName} as Headless } from '${recipe.importFrom}';`,
				...(snippetProps.length ? ["\timport type { Snippet } from 'svelte';"] : []),
				'',
				'\ttype Props = {',
				...typeLines,
				'\t};',
				'',
				`\tlet { ${destructure.join(', ')} }: Props = $props();`,
				'</script>',
				'',
				`<Headless.${partTag}`,
				...attributes.map((attribute) => `\t${attribute}`),
				'>',
				...body,
				`</Headless.${partTag}>`,
				''
			].join('\n'),				path: `generated/components/${component}/${partTag}.svelte`
		});
	}

	const barrel = plan.parts.map((part) => `export { default as ${part.exportName} } from './${part.exportName}.svelte';`);
	for (const part of plan.passthrough) {
		barrel.push(`// ${part.partName}: ${part.reason}, so there is no class to style.`);
		barrel.push(`export const ${part.exportName} = Headless.${part.exportName};`);
	}
	files.push({
		contents: [
			`// ${header(recipe.path)}`,
			`// Usage: import * as ${component} from '$lib/components/${component}';`,
			...(plan.passthrough.length ? [`import { ${recipe.importName} as Headless } from '${recipe.importFrom}';`] : []),
			...barrel,
			''
		].join('\n'),
		path: `generated/components/${component}/index.ts`
	});
	return files;
}

function bindableDefault(prop) {
	const value = prop.default?.value;
	if (!value) return ' = $bindable()';
	if (typeof value === 'boolean' || typeof value === 'number') return ` = $bindable(${value})`;
	if (typeof value === 'string') return ` = $bindable('${value}')`;
	if ('raw' in value) return ` = $bindable(${value.raw})`;
	return ' = $bindable()';
}

function typeOf(name, props, axisProps, part, plan) {
	const prop = props[name];
	if (axisProps.includes(name)) {
		const values = plan.axisValues[name];
		return `?: ${values.map((value) => `'${value}'`).join(' | ')};`;
	}
	// Outlets are always optional: whether a render prop is required is decided by
	// `WithChild`-style intersection types in the library, which the extractor
	// cannot see through, and no library actually requires one.
	// A snippet's parameters are library-defined (`child` receives `{ props }`,
	// Slider.Root's `children` receives `{ tickItems, thumbItems }`) and the
	// extractor cannot read them off an imported type alias, so the wrapper types
	// the parameter bag loosely rather than inventing a shape it cannot verify.
	if (part.snippets.includes(name)) return '?: Snippet<[Record<string, unknown>]>;';
	if (!prop) return '?: string;';
	const optional = prop.required ? '' : '?';
	switch (prop.type) {
		case 'boolean':
			return `${optional}: boolean;`;
		case 'string':
			return `${optional}: string;`;
		case 'number':
			return `${optional}: number;`;
		case 'snippet':
			return `${optional}: Snippet;`;
		case 'union':
			return prop.values?.length ? `${optional}: ${prop.values.map((value) => `'${value}'`).join(' | ')};` : `${optional}: string;`;
		default:
			return `${optional}: unknown;`;
	}
}

function defaultOf(prop) {
	if (!prop.hasDefault) return '';
	const value = prop.default;
	if (typeof value === 'boolean' || typeof value === 'number') return ` = ${value}`;
	if (typeof value === 'string') return ` = '${value}'`;
	if (value && typeof value === 'object' && 'raw' in value) return ` = ${value.raw}`;
	return '';
}

// --- whole-project rendering -------------------------------------------------

export function renderProject(data) {
	const outputs = new Map();
	const diags = new Diagnostics();
	const plans = [];
	for (const recipePath of data.recipes) {
		const recipe = loadRecipe(recipePath);
		const plan = planComponent(recipe, loadAnatomy(recipe), data);
		plans.push(plan);
		diags.errors.push(...plan.diag.errors);
		diags.warnings.push(...plan.diag.warnings);
		outputs.set(`generated/styles/components/${recipe.slug}.sass`, renderComponentSass(plan));
		outputs.set(`generated/plan/${recipe.slug}.json`, renderPlanJson(plan));
		for (const file of renderPartSvelte(plan)) outputs.set(file.path, file.contents);
	}
	outputs.set('generated/styles/_tokens.sass', renderTokensSass(data.adapter));
	outputs.set('generated/styles/index.sass', renderStyleIndex(plans.map((plan) => plan.recipe.slug)));
	return { diags, outputs, plans };
}
