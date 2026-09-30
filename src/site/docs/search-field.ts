import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Search field",
	tagline: "A recognizable search entry point with clear affordances.",
	description: "A recognizable search entry point with clear affordances.",
	group: 'text-fields',
	status: 'ported',
	whenToUse: ["Filtering a visible list or table in place.","Toolbar search where the query should be clearable with one click."],
	whenNotToUse: ["Use expanding-search for compact header search with results.","Use combobox when the search sets a form value.","Use filter-toolbar when search sits with other filters and sort."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/search-field',
		manual: {
			dependencies: ["bits-ui","@lucide/svelte"],
			steps: [
				'Copy search-field files into src/lib/components/search-field/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import SearchField from $lib/components/search-field'
			]
		}
	},
	usage: `<script lang="ts">
  import { SearchField } from '$lib/components/search-field';

  let query = $state('');
<\/script>

<SearchField
  label="Search members"
  placeholder="Name or email"
  bind:value={query}
/>`,
	demoCode: `<script lang="ts">
  import { SearchField } from '$lib/components/search-field';

  let query = $state('');
<\/script>

<div class="demo-search-field-container">
  <SearchField
    label="Search members"
    placeholder="Name or email"
    bind:value={query}
  />
</div>`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: `<SearchField
      label="Search members"
      placeholder="Name or email"
      value={query}
      onValueChange={setQuery}
    />`
		}
	],
	api: [
  {
    "name": "label",
    "type": "string",
    "default": "–",
    "description": "(Required) Visible label tied to the input."
  },
  {
    "name": "value",
    "type": "string",
    "default": "–",
    "description": "(Required) Current query."
  },
  {
    "name": "onValueChange",
    "type": "(value: string) => void",
    "default": "–",
    "description": "(Required) Called on every keystroke and with an empty string when cleared."
  },
  {
    "name": "...props",
    "type": "Omit<InputHTMLAttributes<HTMLInputElement>, \"type\">",
    "default": "–",
    "description": "Forwarded to the input, including ref, placeholder, and name."
  }
],
	keyboard: [
  {
    "key": "Escape",
    "action": "Clears the field (native type=\\\"search\\\" behavior in most browsers)."
  }
],
	accessibility: ["Native input type=\"search\" with a real label.","Clear button is labelled \"Clear search\" and returns focus to the input.","The search icon is aria-hidden."],
	motion: "- The clear button scales in from 0.8 with a slight blur on a snappy spring and presses to 0.96. - Reduced motion fades it in and out without scale or blur; the reserved slot keeps the field width fixed either way.",
	notes: "Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["Use to filter a visible list in place. Use expanding-search for a compact header search with results, and combobox to choose a value.","Always controlled: pass value and onValueChange, and debounce expensive filtering yourself."],
	related: [{"name":"Combobox","slug":"combobox","description":"Search and select from a list without leaving the field."},{"name":"Filter toolbar","slug":"filter-toolbar","description":"Keep collection filters close and easy to reset."}],
	source: 'registry/components/search-field/search-field.tsx'
};

export default doc;
