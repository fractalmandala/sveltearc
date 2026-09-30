import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Animated Counter',
	description: 'A number that animates digit changes, odometer-style, with place-value-stable columns.',
	tagline: 'Give changing totals a clear sense of movement.',
	group: 'charts',
	status: 'ported',
	whenToUse: [
		'Totals that update in place, such as revenue, active users, or event counts.',
		'When the number deserves attention but the layout must not shift under it.'
	],
	whenNotToUse: [
		'For static numbers that never change — plain text is lighter.',
		'For charting a series over time — use a line, bar, or slope chart.'
	],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy animated-counter.svelte, animated-counter.types.ts and animated-counter.module.css into src/lib/components/animated-counter/.',
				'All styles live in animated-counter.module.css — no Tailwind configuration required.'
			]
		}
	},
	usage: `<script lang="ts">
  import AnimatedCounter from '$lib/components/animated-counter/animated-counter.svelte';

  let revenue = $state(128400);
</script>

<AnimatedCounter value={revenue} label="Monthly revenue" prefix="$" />`,
	demoCode: `<script lang="ts">
  import AnimatedCounter from '$lib/components/animated-counter/animated-counter.svelte';

  let revenue = $state(128400);
</script>

<div class="demo-grid">
  <AnimatedCounter value={revenue} label="Monthly revenue" prefix="$" />
  <AnimatedCounter value={97.5} decimals={1} suffix="%" label="Retention" />
  <button onclick={() => (revenue += 1250)}>Add $1,250</button>
</div>`,
	variants: [
		{
			name: 'With Prefix',
			description: 'A static currency symbol ahead of the digit columns.',
			code: `<AnimatedCounter value={128400} prefix="$" />`
		},
		{
			name: 'Decimals + Suffix',
			description: 'Fraction digits with a trailing unit symbol.',
			code: `<AnimatedCounter value={97.5} decimals={1} suffix="%" />`
		},
		{
			name: 'With Label',
			description: 'A small caption above the value.',
			code: `<AnimatedCounter value={42000} label="Active users" />`
		}
	],
	api: [
		{ name: 'value', type: 'number', description: 'The numeric value to display, formatted per decimals/locale.' },
		{ name: 'label', type: 'string', description: 'Small caption above the value.' },
		{ name: 'prefix', type: 'string', default: "' '", description: 'Static symbol rendered before the digits, e.g. "$".' },
		{ name: 'suffix', type: 'string', default: "' '", description: 'Static symbol rendered after the digits, e.g. "%".' },
		{ name: 'decimals', type: 'number', default: '0', description: 'Fraction digits for Intl.NumberFormat.' },
		{ name: 'animateOnView', type: 'boolean', default: 'false', description: 'Roll every digit up from zero the first time the counter scrolls into view (Phase 2).' },
		{ name: 'locale', type: 'string', default: "'en-US'", description: 'Formatting locale. Fixed by default so server and client render the same digits.' }
	],
	accessibility: [
		'The formatted value is announced as a single string via an sr-only node; the digit columns are aria-hidden.',
		'Locales are fixed by default so server and client render the same digits.'
	],
	motion: 'Phase 1 still-state: the final formatted value renders statically, with the digit/column DOM (.column/.sizer/.glyph) and tabular-nums kept as Phase 2 hooks. Phase 2 wires the odometer roll (digit-wheel springs, width morph, label rise/blur swap, animateOnView roll) via @humanspeak/svelte-motion; the prefers-reduced-motion path is instant state and already fully functional.',
	notes: 'Formatting is computed locally with Intl.NumberFormat using ARC-identical place-value keying, so 999 → 1,000 keeps the ones column the ones column. No headless primitive is involved; ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'The columns are keyed by place value, not by index — never re-key them.',
		'Keep the sr-only text in sync with the visible digits; it is the accessible name.',
		'Do not hand-roll grouping separators; Intl.NumberFormat owns them.'
	],
	related: [
		{ name: 'Metric Card', slug: 'metric-card', description: 'A compact summary card that renders its number through this counter.' }
	],
	source: 'registry/components/animated-counter/animated-counter.tsx'
};

export default doc;
