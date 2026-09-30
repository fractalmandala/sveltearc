import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Textarea",
	tagline: "A multiline field for notes, descriptions, and longer text.",
	description: "A multiline field for notes, descriptions, and longer text.",
	group: 'text-fields',
	status: 'ported',
	whenToUse: ["Free-form multi-line text like bios, comments, or feedback.","Fields with a live character count, which rolls its digits in the helper row."],
	whenNotToUse: ["Use input for single-line values.","Use inline-edit with multiline for a description edited in place on a page.","Use tag-input when the text is really a list of short values."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/textarea',
		manual: {
			dependencies: [],
			steps: [
				'Copy textarea files into src/lib/components/textarea/',
				'Ensure foundation.css is loaded for the design tokens',
				'Import Textarea from $lib/components/textarea'
			]
		}
	},
	usage: `<script lang="ts">
  import { Textarea } from '$lib/components/textarea';
  let notes = $state('');
</script>

<Textarea label="Release notes" rows={4} bind:value={notes} description="Markdown is supported." />`,
	demoCode: `<script lang="ts">
  import { Textarea } from '$lib/components/textarea';
  let notes = $state('');
</script>

<Textarea label="Release notes" rows={4} bind:value={notes} description="Markdown is supported." />`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: `<Textarea />`
		}
	],
	api: [
  {
    "name": "label",
    "type": "string",
    "default": "–",
    "description": "(Required) Visible label, tied to the textarea with htmlFor."
  },
  {
    "name": "description",
    "type": "string",
    "default": "–",
    "description": "Helper copy under the field, linked through aria-describedby. Counts such as \\\"120 characters\\\" roll their digits."
  },
  {
    "name": "error",
    "type": "string",
    "default": "–",
    "description": "Error copy. Sets aria-invalid and renders in a role=\\\"alert\\\" row."
  },
  {
    "name": "...props",
    "type": "TextareaHTMLAttributes<HTMLTextAreaElement>",
    "default": "–",
    "description": "Forwarded to the native textarea, including ref, rows, value, onChange, and maxLength."
  }
],
	keyboard: [
  {
    "key": "Tab",
    "action": "Moves focus to the interactive element."
  }
],
	accessibility: ["Native textarea with a real label.","Description and error ids are merged into aria-describedby; errors set aria-invalid and use role=\"alert\".","Animated copy is aria-hidden and mirrored in a visually hidden plain-text span."],
	motion: "- Message rows open their height on a smooth spring; changed words rise in with a soft blur and counts roll only the digits that changed. - Reduced motion drops the roll, blur, and height spring for instant changes.",
	notes: "Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["Use for free-form, multi-line text. Use input for single lines and inline-edit for text edited in place on a page.","A live character count in description gets the rolling-digit treatment for free."],
	related: [{"name":"Input","slug":"input","description":"A single line field with clear labels and useful states."},{"name":"Inline edit","slug":"inline-edit","description":"Rename in place: the text becomes a field without moving."},{"name":"Tag input","slug":"tag-input","description":"Turn short text values into removable tags."}],
	source: 'registry/components/textarea/textarea.tsx'
};

export default doc;
