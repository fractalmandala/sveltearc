import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Input",
	tagline: "A single line field with clear labels and useful states.",
	description: "A single line field with clear labels and useful states.",
	group: 'text-fields',
	status: 'ported',
	whenToUse: ["Any single-line text value in a form, such as name, email, or URL.","Fields whose helper or error copy changes as the person types, where the message should reword in place.","Plain form posts, since it forwards name and every native input attribute."],
	whenNotToUse: ["Use textarea for multi-line text.","Use password-field, search-field, or number-field when the value has that shape.","Use inline-edit for a value shown as page text and edited in place."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/input',
		manual: {
			dependencies: [],
			steps: [
				'Copy input files into src/lib/components/input/',
				'Ensure foundation.css is loaded for the design tokens',
				'Import Input from $lib/components/input'
			]
		}
	},
	usage: `<script lang="ts">
  import { Input } from '$lib/components/input';
  let email = $state('');
</script>

<Input label="Work email" type="email" bind:value={email} description="We only use this for sign-in." />`,
	demoCode: `<script lang="ts">
  import { Input } from '$lib/components/input';
  let email = $state('');
</script>

<Input label="Work email" type="email" bind:value={email} description="We only use this for sign-in." />`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: `<Input />`
		}
	],
	api: [
  {
    "name": "label",
    "type": "string",
    "default": "–",
    "description": "(Required) Visible label, tied to the input with htmlFor."
  },
  {
    "name": "description",
    "type": "string",
    "default": "–",
    "description": "Helper copy under the field, linked through aria-describedby."
  },
  {
    "name": "error",
    "type": "string",
    "default": "–",
    "description": "Error copy. Sets aria-invalid and renders in a role=\\\"alert\\\" row."
  },
  {
    "name": "...props",
    "type": "InputHTMLAttributes<HTMLInputElement>",
    "default": "–",
    "description": "Forwarded to the native input, including ref, type, value, onChange, and name."
  }
],
	keyboard: [
  {
    "key": "Tab",
    "action": "Moves focus to the interactive element."
  }
],
	accessibility: ["Renders a native input with a real label, so focus and form behavior are native.","Description and error ids are merged into aria-describedby alongside any caller value.","Errors set aria-invalid and announce through role=\"alert\"; animated words are aria-hidden with a plain screen reader copy."],
	motion: "- Helper and error rows open their height on a smooth spring, then changed words rise in and unblur while numbers roll digit by digit. - Reduced motion mounts rows at full height and swaps words with an instant fade.",
	notes: "Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["Default single-line text field. Use password-field, search-field, or number-field when the value has that shape.","Works controlled or uncontrolled like a native input; pass name for plain form submission.","Changing the error string rewords it in place, so derive it from state instead of toggling separate messages."],
	related: [{"name":"Textarea","slug":"textarea","description":"A multiline field for notes, descriptions, and longer text."},{"name":"Password field","slug":"password-field","description":"Capture sensitive text with a visible reveal control."},{"name":"Search field","slug":"search-field","description":"A recognizable search entry point with clear affordances."},{"name":"Number field","slug":"number-field","description":"Enter a bounded number with clear increment controls."}],
	source: 'registry/components/input/input.tsx'
};

export default doc;
