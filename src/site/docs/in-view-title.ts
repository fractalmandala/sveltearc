import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: 'In-view title',
	tagline: 'Bring a section title in as it scrolls into view.',
	description: 'A section title that reveals itself once it scrolls into view.',
	group: 'text-effects',
	status: 'ported',
	whenToUse: [
		'Section titles further down the page that should reveal on entry.',
		'Editorial pages where headlines rise out of a clip or sharpen from blur.'
	],
	whenNotToUse: [
		'Use text-reveal for above-the-fold hero headlines that animate on page load.',
		'Use text-shimmer for short status lines showing ongoing work.'
	],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy in-view-title files into src/lib/components/in-view-title/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import InViewTitle from $lib/components/in-view-title'
			]
		}
	},
	usage: `<script lang="ts">
  import { InViewTitle } from '$lib/components/in-view-title';
<\/script>

<InViewTitle text="Built for the long read" variant="blur" as="h2" />`,
	demoCode: `<script lang="ts">
  import { InViewTitle } from '$lib/components/in-view-title';
<\/script>

<div class="demo-in-view-title-container">
  <InViewTitle text="Built for the long read" variant="blur" as="h2" />
</div>`,
	variants: [
		{
			name: 'Blur',
			description: 'Sharpens word by word; suits most headings.',
			code: `<InViewTitle text="Built for the long read" variant="blur" as="h2" />`
		},
		{
			name: 'Word',
			description: 'Words rise out of a clip; editorial feel.',
			code: `<InViewTitle text="Built for the long read" variant="word" as="h2" />`
		},
		{
			name: 'Line',
			description: 'Whole lines rise out of a clip; pass lines to set the breaks.',
			code: `<InViewTitle text="Built for the long read" variant="line" as="h2" lines={['Built for', 'the long read']} />`
		},
		{
			name: 'Tracking',
			description: 'Opens tight letter spacing, letter by letter.',
			code: `<InViewTitle text="Built for the long read" variant="tracking" as="h2" />`
		},
		{
			name: 'Wipe',
			description: 'Uncovers the title left to right through a soft edge.',
			code: `<InViewTitle text="Built for the long read" variant="wipe" as="h2" />`
		}
	],
	api: [
		{
			name: 'text',
			type: 'string',
			default: '–',
			description: '(Required) The title copy to reveal.'
		},
		{
			name: 'variant',
			type: '"word" | "line" | "blur" | "tracking" | "wipe"',
			default: '"blur"',
			description: 'Reveal style for the title.'
		},
		{
			name: 'as',
			type: '"h1" | "h2" | "h3"',
			default: '"h2"',
			description: 'Heading level of the rendered title.'
		},
		{
			name: 'lines',
			type: 'string[]',
			default: '–',
			description: 'Explicit line breaks for the line variant. Defaults to [text].'
		},
		{
			name: 'class',
			type: 'string',
			default: '–',
			description: 'Merged onto the outer wrapper element.'
		},
		{
			name: 'id',
			type: 'string',
			default: '–',
			description: 'Forwarded to the title element, e.g. for aria-labelledby.'
		},
		{
			name: 'once',
			type: 'boolean',
			default: 'true',
			description: 'Replay on every entry when false. Phase-1 still-port: parity only, no behaviour yet.'
		}
	],
	accessibility: [
		'The title carries aria-label with the full text while the animated words are aria-hidden, so screen readers read one clean heading.',
		'Pick the heading level with as so the page outline stays correct.'
	],
	motion:
		'Phase-1 still-port: every variant renders its final visible end state statically — no scroll observation or transitions are wired yet. Phase 2 adds the in-view reveal with reduced-motion instant end state.',
	notes: 'Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Use for section titles further down the page. For above-the-fold headlines use text-reveal.',
		'Pass lines to control breaks for the line variant.'
	],
	related: [
		{
			name: 'Text reveal',
			slug: 'text-reveal',
			description: 'Reveal a short piece of content with restrained motion.'
		},
		{
			name: 'Text morph',
			slug: 'text-morph',
			description: 'Morph a label into its next state, letter by letter.'
		}
	],
	source: 'registry/components/in-view-title/in-view-title.tsx'
};

export default doc;
