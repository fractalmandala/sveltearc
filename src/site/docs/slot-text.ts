import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: 'Slot text',
	tagline: 'Spin text and numbers into their new value like slot machine reels.',
	description: 'Text and numbers that spin into their new value like slot machine reels.',
	group: 'text-effects',
	status: 'ported',
	whenToUse: [
		'Prices, stats, and launch moments where a value change deserves a beat.',
		'Numbers that grow on the left (999 to 1,000) or strings that shuffle letters.'
	],
	whenNotToUse: [
		'Use text-morph for short status words that share most of their letters.',
		'Use animated-counter for a plain counting transition without reels.'
	],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy slot-text files into src/lib/components/slot-text/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import SlotText from $lib/components/slot-text'
			]
		}
	},
	usage: `<script lang="ts">
  import { SlotText } from '$lib/components/slot-text';
<\/script>

<SlotText value={12480} announce />`,
	demoCode: `<script lang="ts">
  import { SlotText } from '$lib/components/slot-text';
<\/script>

<div class="demo-slot-text-container">
  <SlotText value={12480} announce />
</div>`,
	variants: [
		{
			name: 'Number',
			description: 'Grouped by default, so 12480 reads 12,480.',
			code: `<SlotText value={12480} announce />`
		},
		{
			name: 'String',
			description: 'Strings render as they are.',
			code: `<SlotText value="Liftoff" />`
		}
	],
	api: [
		{
			name: 'value',
			type: 'string | number',
			default: '–',
			description: '(Required) The value to show. Numbers pass through format; strings render as they are.'
		},
		{
			name: 'format',
			type: '(value: number) => string',
			default: '–',
			description: 'Formats a number value. Defaults to en-US grouping, so 12480 reads 12,480.'
		},
		{
			name: 'duration',
			type: 'number',
			default: '0.9',
			description: 'Seconds the first reel spins. Phase-1 still-port: parity only, no behaviour yet.'
		},
		{
			name: 'stagger',
			type: 'number',
			default: '0.07',
			description: 'Seconds between reels stopping, left to right. Phase-1 still-port: parity only.'
		},
		{
			name: 'spins',
			type: 'number',
			default: '1',
			description: 'Extra full turns a digit makes before it lands. Phase-1 still-port: parity only.'
		},
		{
			name: 'align',
			type: '"start" | "end"',
			default: '"end" for numbers, "start" for strings',
			description: 'Which end reels are matched from when the length changes. Phase-1 still-port: parity only.'
		},
		{
			name: 'announce',
			type: 'boolean',
			default: 'false',
			description: 'Announce new values politely to screen readers via aria-live="polite".'
		},
		{
			name: 'class',
			type: 'string',
			default: '–',
			description: 'Merged onto the root element.'
		},
		{
			name: 'style',
			type: 'string',
			default: '–',
			description: 'Inline styles forwarded to the root element.'
		}
	],
	accessibility: [
		'New values are announced politely when announce is set; the reels themselves are aria-hidden.',
		'Digits use tabular numerals so the line does not reflow as values change.'
	],
	motion:
		'Phase-1 still-port: every reel renders its landed target cell statically with the live-region wiring intact — spinning, stagger, width springs and velocity blur are deferred to Phase 2, with a reduced-motion instant path.',
	notes: 'Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Numbers default to end alignment so growth happens on the left; pass align="start" to pin the left.',
		'Motion props (duration, stagger, spins, align) are accepted now and take effect in Phase 2.'
	],
	related: [
		{
			name: 'Text morph',
			slug: 'text-morph',
			description: 'Morph a label into its next state, letter by letter.'
		},
		{
			name: 'Text shimmer',
			slug: 'text-shimmer',
			description: 'Show ongoing work with a calm light across the words.'
		}
	],
	source: 'registry/components/slot-text/slot-text.tsx'
};

export default doc;
