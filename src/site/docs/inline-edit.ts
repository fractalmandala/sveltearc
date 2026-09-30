import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Inline edit",
	tagline: "Rename in place: the text becomes a field without moving.",
	description: "Rename in place: the text becomes a field without moving.",
	group: 'text-fields',
	status: 'ported',
	whenToUse: ["Names and short fields read far more often than they change, such as a project name or description.","Single values saved on their own with Enter, where optimistic feedback matters.","Headings that stay headings while editable through the as prop."],
	whenNotToUse: ["Use input inside a regular form when several fields must be saved together.","Use textarea-backed forms for long documents rather than one-line renames.","Use a dialog when saving needs confirmation before it applies."],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy inline-edit files into src/lib/components/inline-edit/',
				'Ensure foundation.css is loaded for the design tokens',
				'Import InlineEdit from $lib/components/inline-edit'
			]
		}
	},
	usage: `<script lang="ts">
  import { InlineEdit } from '$lib/components/inline-edit';
  let name = $state('Launch plan');
  async function save(next: string) {
    name = next;
  }
</script>

<InlineEdit label="Project name" bind:value={name} onSave={save} />`,
	demoCode: `<script lang="ts">
  import { InlineEdit } from '$lib/components/inline-edit';
  let name = $state('Launch plan');
  async function save(next: string) {
    name = next;
  }
</script>

<InlineEdit label="Project name" bind:value={name} onSave={save} />`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: `<InlineEdit label="Project name" value="Launch plan" onSave={(next) => console.log(next)} />`
		}
	],
	api: [
  {
    "name": "value",
    "type": "string",
    "default": "–",
    "description": "(Required) The saved value. A new value from outside replaces the text while it is not being edited; bindable."
  },
  {
    "name": "onSave",
    "type": "(next: string) => void | Promise<unknown>",
    "default": "–",
    "description": "(Required) Persists the new value. Return a promise to show the saving state, and reject it to roll back."
  },
  {
    "name": "label",
    "type": "string",
    "default": "–",
    "description": "(Required) Accessible name, for example “Project name”."
  },
  {
    "name": "validate",
    "type": "(next: string) => string | null | undefined",
    "default": "–",
    "description": "Returns a message when the draft cannot be saved."
  },
  {
    "name": "placeholder",
    "type": "string",
    "default": "\"\"",
    "description": "Shown when the value is empty."
  },
  {
    "name": "multiline",
    "type": "boolean",
    "default": "false",
    "description": "Wraps onto several lines and grows in height. Enter still saves; Shift+Enter adds a line break."
  },
  {
    "name": "variant",
    "type": "\"title\" | \"body\"",
    "default": "\"title\"",
    "description": "title for names and headings, body for descriptions."
  },
  {
    "name": "as",
    "type": "\"span\" | \"p\" | \"h1\" | \"h2\" | \"h3\"",
    "default": "\"span\"",
    "description": "The element that holds the text, so a title can stay a heading."
  }
],
	keyboard: [
  {
    "key": "Enter",
    "action": "Saves the draft. With multiline, Shift+Enter adds a line break instead."
  },
  {
    "key": "Escape",
    "action": "Cancels editing and rolls the text back."
  },
  {
    "key": "Tab",
    "action": "Moves focus to the interactive element."
  }
],
	accessibility: ["The display is a real button labeled with the value, with hints for both modes exposed as screen reader copy.","Validation and failed-save messages render in a polite live region with a retry action.","Save, cancel, and status changes announce through a status live region."],
	motion: "Phase 1 still-port: text swaps, icon springs, the drawn check, frame morph, and message reveal render their static end states; Phase 2 wires the springs without restructuring.",
	notes: "Headless mechanics powered by Svelte runes. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["Click-to-edit text with optimistic save. Reject onSave's promise to roll back to the last saved value.","Validate drafts with validate; leaving the component saves like a rename, switching windows does not.","Use multiline + body variant for descriptions; keep as matched to the surrounding semantics."],
	related: [{"name":"Input","slug":"input","description":"A single line field for free-form text values."},{"name":"Textarea","slug":"textarea","description":"A multiline field for notes, descriptions, and longer text."},{"name":"Number field","slug":"number-field","description":"Enter a bounded number with clear increment controls."}],
	source: 'registry/components/inline-edit/inline-edit.tsx'
};

export default doc;
