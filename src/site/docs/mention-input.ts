import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: 'Mention input',
	tagline: 'Mention people and channels without breaking the sentence.',
	description:
		'A textarea with atomic @people and #channel mentions, keyboard-first suggestions, and structured offsets.',
	group: 'special-inputs',
	status: 'ported',
	whenToUse: [
		'Comment, chat, and description fields where people or channels are part of the sentence.',
		'Values that downstream code must store or notify with stable mention offsets.',
		'Fields where Backspace should remove an entire token instead of one character.'
	],
	whenNotToUse: [
		'Use input or textarea for prose that never tags another object.',
		'Use combobox or multi-select for option picking that does not live inside running text.',
		'Use mention rendering alone when the copy is read-only.'
	],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy mention-input files into src/lib/components/mention-input/',
				'Ensure foundation.css is loaded for the design tokens',
				"Import MentionInput from '$lib/components/mention-input'"
			]
		}
	},
	usage: `<script lang="ts">
  import { MentionInput } from '$lib/components/mention-input';
  import type { MentionValue } from '$lib/components/mention-input';

  let value = $state<MentionValue>({ text: 'Hello @Ada ', mentions: [] });
  const people = [{ id: 'ada', name: 'Ada Lovelace', role: 'Foundations' }];
</script>

<MentionInput
  bind:value
  people={people}
  placeholder="Write an update…"
  onSubmit={(next) => console.log(next)}
/>`,
	demoCode: `<script lang="ts">
  import { MentionInput } from '$lib/components/mention-input';
  import type { MentionValue } from '$lib/components/mention-input';
  let value = $state<MentionValue>({ text: 'Hello @Ada ', mentions: [] });
</script>

<MentionInput bind:value people={people} channels={channels} />`,
	variants: [
		{
			name: 'People and channels',
			description: 'Type @ for people and # for channels; Enter chooses the highlighted suggestion.',
			code: `<MentionInput bind:value people={people} channels={channels} submitOnEnter />`
		},
		{
			name: 'Bounded growth',
			description: 'The field grows to maxRows, then its textarea scrolls.',
			code: `<MentionInput bind:value minRows={2} maxRows={5} />`
		}
	],
	api: [
		{
			name: 'value',
			type: 'MentionValue',
			default: '–',
			description: 'Controlled structured value: plain text plus mention offsets. Bindable.'
		},
		{
			name: 'defaultValue',
			type: 'MentionValue',
			default: '{ text: "", mentions: [] }',
			description: 'Initial value for uncontrolled use.'
		},
		{
			name: 'onChange',
			type: '(value: MentionValue) => void',
			default: '–',
			description: 'Fires on every edit with the next structured value.'
		},
		{
			name: 'people',
			type: 'MentionPerson[]',
			default: '–',
			description: 'People offered after @. Leave out to disable person mentions.'
		},
		{
			name: 'channels',
			type: 'MentionChannel[]',
			default: '–',
			description: 'Channels offered after #. Leave out to disable channel mentions.'
		},
		{
			name: 'onMentionAdd',
			type: '(mention: Mention) => void',
			default: '–',
			description: 'Called when a suggestion becomes a mention.'
		},
		{
			name: 'submitOnEnter',
			type: 'boolean',
			default: 'false',
			description: 'Enter submits through onSubmit; Shift+Enter adds a line.'
		},
		{
			name: 'minRows',
			type: 'number',
			default: '1',
			description: 'Minimum visible rows used when measuring the autosize height.'
		},
		{
			name: 'maxRows',
			type: 'number',
			default: '8',
			description: 'The field grows to this many rows, then scrolls.'
		},
		{
			name: 'placement',
			type: '"auto" | "top" | "bottom"',
			default: '"auto"',
			description: 'Where suggestions open. Auto flips above when there is no room below.'
		}
	],
	keyboard: [
		{
			key: 'ArrowUp / ArrowDown',
			action: 'Moves through suggestions while the list is open.'
		},
		{
			key: 'Enter / Tab',
			action: 'Chooses the highlighted suggestion when the list is open.'
		},
		{
			key: 'Escape',
			action: 'Dismisses the open suggestion list.'
		},
		{
			key: 'Backspace / Delete',
			action: 'Selects the whole mention token under a caret before deleting it.'
		}
	],
	accessibility: [
		'The field is a combobox bound to a listbox with aria-controls, aria-expanded, and aria-activedescendant.',
		'A polite live region announces the number and kind of suggestions.',
		'Mention tokens are atomic for pointer and keyboard selection, so deletions are predictable.'
	],
	motion:
		'Phase 1 still-port: suggestion highlight, anchor placement, panel size, and field height render their measured end states; Phase 2 wires the springs and list transitions without restructuring.',
	notes:
		'Mention offsets are stored in character units and survive ordinary edits; edits that touch a token drop it. Headless suggestion behavior is Svelte runes. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Model the field as controlled MentionValue only when the parent normalizes offsets.',
		'Use serializeMentions for storage; do not parse display text with regular expressions.',
		'Do not invent the placement — the component measures the trigger marker and flips automatically.'
	],
	related: [
		{
			name: 'Textarea',
			slug: 'textarea',
			description: 'A multiline field without structured mention tokens.'
		},
		{
			name: 'Combobox',
			slug: 'combobox',
			description: 'Option picking outside running text.'
		},
		{
			name: 'Tag input',
			slug: 'tag-input',
			description: 'Short discrete values as removable tags.'
		}
	],
	source: 'registry/components/mention-input/mention-input.tsx'
};

export default doc;
