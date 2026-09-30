import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Metric Card',
	description: 'A compact summary for a number that needs context: label, animated number, and a signed change.',
	tagline: 'One number, with its story attached.',
	group: 'cards',
	status: 'ported',
	whenToUse: [
		'Dashboard metrics where a single number needs a label, context, and a delta.',
		'When the change direction should read in color as well as sign.'
	],
	whenNotToUse: [
		'For tabular comparison across many rows — use a table.',
		'When there is detail to reveal — use Card with its quick look.'
	],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy metric-card.svelte, metric-card.types.ts and metric-card.module.css into src/lib/components/metric-card/.',
				'Also copy src/lib/components/animated-counter/ — MetricCard renders its number through the ported AnimatedCounter.',
				'All styles live in the .module.css files — no Tailwind configuration required.'
			]
		}
	},
	usage: `<script lang="ts">
  import MetricCard from '$lib/components/metric-card/metric-card.svelte';
</script>

<MetricCard
  label="Monthly revenue"
  value={128400}
  suffix=""
  context="vs $114k last month"
  change="+12.4%"
/>`,
	demoCode: `<script lang="ts">
  import MetricCard from '$lib/components/metric-card/metric-card.svelte';
</script>

<div class="demo-row demo-row-wrap">
  <MetricCard label="Monthly revenue" value={128400} context="vs $114k last month" change="+12.4%" />
  <MetricCard label="Churn rate" value={2.1} suffix="%" context="vs 2.4% last month" change="-0.3pts" />
</div>`,
	variants: [
		{
			name: 'Rising Change',
			description: 'A leading "+" tints the chip with the success color (data-trend="up").',
			code: `<MetricCard label="Signups" value={8420} context="vs last week" change="+8.1%" />`
		},
		{
			name: 'Falling Change',
			description: 'A leading "-" tints the chip with the danger color (data-trend="down").',
			code: `<MetricCard label="Churn" value={2.1} suffix="%" context="vs last month" change="-0.3pts" />`
		},
		{
			name: 'No Change',
			description: 'Without `change` the chip is omitted entirely.',
			code: `<MetricCard label="Total seats" value={1200} context="across all workspaces" />`
		}
	],
	api: [
		{ name: 'label', type: 'string', description: 'Heading for the metric, e.g. "Monthly revenue".' },
		{ name: 'value', type: 'number', description: 'The numeric value, rendered through the ported AnimatedCounter.' },
		{ name: 'suffix', type: 'string', description: 'Static symbol after the digits, e.g. "%".' },
		{ name: 'context', type: 'string', description: 'Supporting line under the number, e.g. "vs last quarter".' },
		{ name: 'change', type: 'string', description: 'Signed delta chip, e.g. "+12.4%". Leading "+" → data-trend="up", leading "-" → "down".' }
	],
	accessibility: [
		'The number is announced as a single string through the counter’s sr-only node.',
		'Change direction is carried by the sign text itself, not color alone.'
	],
	motion: 'Phase 1 still-state: label, change chip, and context render as static text with the .swap/.swapBlock/.text/.sizer hooks kept for Phase 2. Phase 2 wires the directional text swaps (rise on increase, drop on decrease), the width-morph spring on the chip, and the AnimatedCounter digit roll; the prefers-reduced-motion path is instant state and already fully functional.',
	notes: 'Renders its number through the ported AnimatedCounter (animateOnView, like ARC) and derives data-trend from the change sign exactly like ARC. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Always import the ported AnimatedCounter via the $lib path — never the ARC one.',
		'Keep the .sizer inside the change chip; Phase 2 measures it for the width morph.',
		'Do not hand-write trend colors; data-trend owns them in CSS.'
	],
	related: [
		{ name: 'Animated Counter', slug: 'animated-counter', description: 'The odometer number this card renders.' },
		{ name: 'Card', slug: 'card', description: 'A surface with an optional quick look for deeper content.' }
	],
	source: 'registry/components/metric-card/metric-card.tsx'
};

export default doc;
