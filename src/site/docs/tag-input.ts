import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Tag input",
	tagline: "Turn short text values into removable tags.",
	description: "Turn short text values into removable tags.",
	group: 'special-inputs',
	status: 'ported',
	whenToUse: ["Short text values added one at a time, such as tags, emails, or skills.","Lists whose items are removed individually with a visible affordance.","Keyboard-first entry where Enter or comma should commit a value."],
	whenNotToUse: ["Use input for a single text value with no list.","Use multi-select when the choices come from a fixed set.","Use textarea for long-form text that should never split into items."],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy tag-input files into src/lib/components/tag-input/',
				'Ensure foundation.css is loaded for the design tokens',
				'Import TagInput from $lib/components/tag-input'
			]
		}
	},
	usage: `<script lang="ts">
  import { TagInput } from '$lib/components/tag-input';
  let tags = $state(['svelte', 'design']);
</script>

<TagInput label="Tags" bind:value={tags} description="Press Enter to add a tag." />`,
	demoCode: `<script lang="ts">
  import { TagInput } from '$lib/components/tag-input';
  let tags = $state(['svelte', 'design']);
</script>

<TagInput label="Tags" bind:value={tags} description="Press Enter to add a tag." />`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: `<TagInput label="Tags" />`
		}
	],
	api: [
  {
    "name": "label",
    "type": "string",
    "default": "–",
    "description": "(Required) Visible label, tied to the input."
  },
  {
    "name": "value",
    "type": "string[]",
    "default": "–",
    "description": "Controlled tag list. Omit (with defaultValue) for uncontrolled use; bindable."
  },
  {
    "name": "defaultValue",
    "type": "string[]",
    "default": "[]",
    "description": "Initial tags for uncontrolled use."
  },
  {
    "name": "onValueChange",
    "type": "(value: string[]) => void",
    "default": "–",
    "description": "Fires with the next tag list on every add or remove."
  },
  {
    "name": "placeholder",
    "type": "string",
    "default": "\"Add a tag\"",
    "description": "Placeholder for the inner input, also drawn as the visible overlay."
  },
  {
    "name": "description",
    "type": "string",
    "default": "–",
    "description": "Helper copy under the field, linked through aria-describedby."
  },
  {
    "name": "id",
    "type": "string",
    "default": "$props.id()",
    "description": "Element id. Falls back to an auto-generated id."
  }
],
	keyboard: [
  {
    "key": "Enter / ,",
    "action": "Adds the current draft as a tag."
  },
  {
    "key": "Backspace",
    "action": "Picks the last tag first, then removes the picked tag."
  },
  {
    "key": "ArrowLeft / ArrowRight",
    "action": "Moves the pick between tags."
  },
  {
    "key": "Escape",
    "action": "Clears the tag pick."
  },
  {
    "key": "Tab",
    "action": "Moves focus to the interactive element."
  }
],
	accessibility: ["Renders a native input with a real label, so focus and form behavior are native.","Tag picks and add/remove results announce through a polite live region.","Duplicates announce instead of silently ignoring the keypress; animated words are aria-hidden with a plain screen reader copy."],
	motion: "Phase 1 still-port: tag enter/exit, layout glide, pick-ring glide, shell height, and helper word-rise render their static end states; Phase 2 wires the springs without restructuring.",
	notes: "Headless mechanics powered by Svelte runes. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["List-of-strings entry with removable pills. Duplicates are refused with an announcement.","Works controlled or with defaultValue; blur commits the draft like Enter.","Backspace and arrow keys pick a tag first — the next Backspace removes it."],
	related: [{"name":"Input","slug":"input","description":"A single line field for free-form text values."},{"name":"Number field","slug":"number-field","description":"Enter a bounded number with clear increment controls."},{"name":"Inline edit","slug":"inline-edit","description":"Rename in place without moving surrounding content."}],
	source: 'registry/components/tag-input/tag-input.tsx'
};

export default doc;
