import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: 'Text shimmer',
	tagline: 'Show ongoing work with a calm light across the words.',
	description: 'A calm light sweep across a short status line to show that work is ongoing.',
	group: 'text-effects',
	status: 'ported',
	whenToUse: [
		'Short status lines such as Thinking or Generating summary while work is ongoing.',
		'Loading states where the text should settle to solid once active turns false.'
	],
	whenNotToUse: [
		'Use text-morph for completed state changes between two labels.',
		'Announce completion from your own live region — this component only sets aria-busy.'
	],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy text-shimmer files into src/lib/components/text-shimmer/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import TextShimmer from $lib/components/text-shimmer'
			]
		}
	},
	usage: `<script lang="ts">
  import { TextShimmer } from '$lib/components/text-shimmer';
<\/script>

<TextShimmer active>Generating summary</TextShimmer>`,
	demoCode: `<script lang="ts">
  import { TextShimmer } from '$lib/components/text-shimmer';
<\/script>

<div class="demo-text-shimmer-container">
  <TextShimmer active>Generating summary</TextShimmer>
</div>`,
	variants: [
		{
			name: 'Active',
			description: 'Sweep while work is ongoing.',
			code: `<TextShimmer active>Generating summary</TextShimmer>`
		},
		{
			name: 'Idle',
			description: 'Settled to solid once work completes.',
			code: `<TextShimmer active={false}>Summary ready</TextShimmer>`
		}
	],
	api: [
		{
			name: 'children',
			type: 'string',
			default: '–',
			description: '(Required) The status text. Keep it to one short line.'
		},
		{
			name: 'active',
			type: 'boolean',
			default: 'true',
			description: 'Sweep while work is ongoing. When false the text settles to solid.'
		},
		{
			name: 'duration',
			type: 'number',
			default: '1.8',
			description: 'Seconds for one sweep across the text. Phase-1 still-port: parity only, no behaviour yet.'
		},
		{
			name: 'as',
			type: '"span" | "p" | "div" | "h2" | "h3" | "h4"',
			default: '"span"',
			description: 'Wrapper element for the status line.'
		},
		{
			name: 'class',
			type: 'string',
			default: '–',
			description: 'Merged onto the wrapper element.'
		},
		{
			name: 'id',
			type: 'string',
			default: '–',
			description: 'Forwarded to the wrapper element.'
		}
	],
	accessibility: [
		'The component sets aria-busy while active; announce completion from your own live region.',
		'A changed label rises in place; keep the text to one short line.'
	],
	motion:
		'Phase-1 still-port: the label renders settled with data-state and aria-busy intact and a static solid gradient (the CSS makes text transparent without a background-image, so the component sets one inline). Phase 2 adds the driven sweep, glide-off finish and reduced-motion instant path.',
	notes: 'Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Flip active to false when work completes; the band glides off (animated in Phase 2).',
		'Never pass your own background-image to this component — the label needs the component-owned gradient to stay visible.'
	],
	related: [
		{
			name: 'Text morph',
			slug: 'text-morph',
			description: 'Morph a label into its next state, letter by letter.'
		},
		{
			name: 'Slot text',
			slug: 'slot-text',
			description: 'Spin text and numbers into their new value like slot machine reels.'
		}
	],
	source: 'registry/components/text-shimmer/text-shimmer.tsx'
};

export default doc;
