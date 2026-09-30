import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: 'Text morph',
	tagline: 'Morph a label into its next state, letter by letter.',
	description: 'Morphs one short label into the next in place.',
	group: 'text-effects',
	status: 'ported',
	whenToUse: [
		'Status words that change a few letters at a time, such as Publish, Publishing, and Published, or Follow and Following.',
		'Short single-line labels where the surrounding layout should glide instead of jump.'
	],
	whenNotToUse: [
		'Use slot-text for prices and stats that deserve a slot-machine spin.',
		'Use text-shimmer for ongoing-work status lines rather than completed state changes.'
	],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy text-morph files into src/lib/components/text-morph/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import TextMorph from $lib/components/text-morph'
			]
		}
	},
	usage: `<script lang="ts">
  import { TextMorph } from '$lib/components/text-morph';
<\/script>

<TextMorph as="span">Published</TextMorph>`,
	demoCode: `<script lang="ts">
  import { TextMorph } from '$lib/components/text-morph';
<\/script>

<div class="demo-text-morph-container">
  <TextMorph as="strong">Published</TextMorph>
</div>`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: `<TextMorph as="strong">Published</TextMorph>`
		}
	],
	api: [
		{
			name: 'children',
			type: 'string',
			default: '–',
			description: '(Required) The label to show. Changing it morphs the letters in place (Phase 2).'
		},
		{
			name: 'as',
			type: '"span" | "div" | "p" | "strong" | "h1" | "h2" | "h3"',
			default: '"span"',
			description: 'Wrapper element for the label.'
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
			description: 'Forwarded to the wrapper element, e.g. for aria-labelledby.'
		}
	],
	accessibility: [
		'Assistive technology reads the plain label text from a visually hidden span; the animated glyphs are aria-hidden.',
		'It stays on one line; keep labels short.'
	],
	motion:
		'Phase-1 still-port: the current label renders in its settled end state statically — the glyph-sharing morph, width-follow spring and stagger are deferred to Phase 2, with a reduced-motion instant path.',
	notes: 'Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Pass the label as children text; change it to morph (animated in Phase 2).',
		'Best for labels that share most of their letters between states.'
	],
	related: [
		{
			name: 'Slot text',
			slug: 'slot-text',
			description: 'Spin text and numbers into their new value like slot machine reels.'
		},
		{
			name: 'Text shimmer',
			slug: 'text-shimmer',
			description: 'Show ongoing work with a calm light across the words.'
		}
	],
	source: 'registry/components/text-morph/text-morph.tsx'
};

export default doc;
