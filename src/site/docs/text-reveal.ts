import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Text reveal",
	tagline: "Reveal a short piece of content with restrained motion.",
	description: "Reveal a short piece of content with restrained motion.",
	group: 'text-effects',
	status: 'ported',
	whenToUse: ["Above-the-fold hero headlines that animate on page load.","Landing page intros where text must appear on first paint even if scripts are slow."],
	whenNotToUse: ["Use in-view-title for section titles further down the page.","Use scroll-highlight for a key paragraph that reveals with scroll.","Use word-rotate when one word in the headline should cycle."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/text-reveal',
		manual: {
			dependencies: ["bits-ui"],
			steps: [
				'Copy text-reveal files into src/lib/components/text-reveal/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import TextReveal from $lib/components/text-reveal'
			]
		}
	},
	usage: `<script lang="ts">
  import { TextReveal } from '$lib/components/text-reveal';
<\/script>

<TextReveal as="h1" text="Ship interfaces\nthat feel precise" delay={0.1} />`,
	demoCode: `<script lang="ts">
  import { TextReveal } from '$lib/components/text-reveal';
<\/script>

<div class="demo-text-reveal-container">
  <TextReveal as="h1" text="Ship interfaces\nthat feel precise" delay={0.1} />
</div>`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: `<TextReveal as="h1" text="Ship interfaces\nthat feel precise" delay={0.1} />`
		}
	],
	api: [
  {
    "name": "text",
    "type": "string",
    "default": "–",
    "description": "(Required) The copy to reveal. Use \\n for a deliberate line break."
  },
  {
    "name": "delay",
    "type": "number",
    "default": "'0'",
    "description": "Seconds before the first word rises."
  },
  {
    "name": "className",
    "type": "string",
    "default": "–",
    "description": "Merged onto the rendered element."
  },
  {
    "name": "id",
    "type": "string",
    "default": "–",
    "description": "Forwarded to the rendered element, e.g. for aria-labelledby."
  }
],
	keyboard: [
  {
    "key": "Tab",
    "action": "Moves focus to the interactive element."
  }
],
	accessibility: ["The full text sits in a visually hidden span; the animated words are aria-hidden, so screen readers read one clean sentence.","Line breaks are read as spaces.","Pick the heading level with as so the page outline stays correct."],
	motion: "- Words rise out of a clip and sharpen from blur on a per-word stagger; total stagger is capped so long text never drags. - The entrance is pure CSS, so text is never left hidden when scripts load slowly. - Reduced motion drops the clip and rise and fades the words in quickly.",
	notes: "Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["Use for above-the-fold headlines that should animate on page load. For titles further down the page use in-view-title; for body copy worth slowing down on use scroll-highlight.","It plays once per mount. Change the element's key to replay it."],
	related: [{"name":"In-view title","slug":"in-view-title","description":"Bring a section title in as it scrolls into view."},{"name":"Text morph","slug":"text-morph","description":"Morph a label into its next state, letter by letter."}],
	source: 'registry/components/text-reveal/text-reveal.tsx'
};

export default doc;
