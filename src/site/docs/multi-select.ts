import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: 'Multi Select',
	tagline: 'A choice field that collects several values as chips.',
	description:
		'A labelled trigger that opens a multi-choice menu. Picks collect as chips with an overflow count, and a clear button empties the field. Built on Bits UI Combobox multiple mode with ARC styling verbatim.',
	group: 'selects',
	status: 'ported',
	whenToUse: [
		'Form fields where several options apply at once, such as tags or team members.',
		'Compact filters where the selection must stay visible as chips.',
		'Menus that need accessible multi-select semantics with keyboard navigation.'
	],
	whenNotToUse: [
		'Use select or combobox when only one value can be chosen.',
		'Use chip-group when every choice should stay visible as toggleable filters.',
		'Use checkbox lists when each option needs its own visible label and description.'
	],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: ['bits-ui', '@lucide/svelte'],
			steps: [
				'Copy multi-select.svelte, multi-select.types.ts, and multi-select.module.css into src/lib/components/multi-select/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import MultiSelect directly from $lib/components/multi-select'
			]
		}
	},
	usage: `<script lang="ts">
  import { MultiSelect } from '$lib/components/multi-select';

  let topics = $state(['svelte']);

  const options = [
    { value: 'svelte', label: 'Svelte' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue', disabled: true }
  ];
<\/script>

<MultiSelect
  label="Topics"
  bind:value={topics}
  {options}
  description="Followed topics for the weekly digest."
/>`,
	demoCode: `<script lang="ts">
  import { MultiSelect } from '$lib/components/multi-select';

  let topics = $state(['svelte', 'rust']);
  let stack = $state([]);

  const topicOptions = [
    { value: 'svelte', label: 'Svelte' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'rust', label: 'Rust' },
    { value: 'go', label: 'Go', disabled: true }
  ];
<\/script>

<MultiSelect label="Topics" bind:value={topics} options={topicOptions} description="Chips fold behind a count after two." />
<MultiSelect label="Stack" bind:value={stack} options={topicOptions} placeholder="Pick your stack…" />
<MultiSelect label="Disabled" value={['svelte']} options={topicOptions} disabled />`,
	variants: [
		{
			name: 'Controlled with Description',
			description: 'Two-way binding via bind:value with helper text below the field.',
			code: `<MultiSelect
  label="Topics"
  bind:value={topics}
  options={topicOptions}
  description="Followed topics for the weekly digest."
/>`
		},
		{
			name: 'Overflow Count',
			description: 'Chips beyond maxVisible fold behind a "+N" count.',
			code: `<MultiSelect
  label="Topics"
  bind:value={topics}
  options={topicOptions}
  maxVisible={1}
/>`
		},
		{
			name: 'Disabled',
			description: 'Disables the whole field, or individual options via disabled on the option.',
			code: `<MultiSelect
  label="Locked Topics"
  value={['svelte']}
  disabled
  options={topicOptions}
/>`
		}
	],
	api: [
		{
			name: 'label',
			type: 'string',
			default: '–',
			description: 'Accessible name of the field, rendered as the visible label.'
		},
		{
			name: 'options',
			type: 'MultiSelectOption[]',
			default: '–',
			description: 'Array of { value: string; label: string; disabled?: boolean } items in list order.'
		},
		{
			name: 'value',
			type: 'string[]',
			default: 'undefined',
			description: 'Controlled selection; supports two-way bind:value.'
		},
		{
			name: 'defaultValue',
			type: 'string[]',
			default: '[]',
			description: 'Initial selection when uncontrolled.'
		},
		{
			name: 'onValueChange',
			type: '(value: string[]) => void',
			default: '–',
			description: 'Callback fired whenever the selection changes.'
		},
		{
			name: 'open',
			type: 'boolean',
			default: 'undefined',
			description: 'Controlled open state of the menu; supports two-way bind:open.'
		},
		{
			name: 'onOpenChange',
			type: '(open: boolean) => void',
			default: '–',
			description: 'Callback fired when the menu opens or closes.'
		},
		{
			name: 'placeholder',
			type: 'string',
			default: "'Select options'",
			description: 'Placeholder copy shown when nothing is selected.'
		},
		{
			name: 'description',
			type: 'string',
			default: '–',
			description: 'Helper copy rendered below the field.'
		},
		{
			name: 'maxVisible',
			type: 'number',
			default: '2',
			description: 'Chips shown before the rest fold behind a "+N" count.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether the whole field is disabled.'
		},
		{
			name: 'class',
			type: 'string',
			default: '–',
			description: 'Additional CSS class applied to the field wrapper.'
		}
	],
	keyboard: [
		{
			key: 'Enter / Space',
			action: 'Opens the menu from the trigger, or picks the highlighted option when open.'
		},
		{
			key: 'ArrowDown / ArrowUp',
			action: 'Moves the highlight between enabled options.'
		},
		{
			key: 'Escape',
			action: 'Closes the menu without changing the selection.'
		}
	],
	accessibility: [
		'Built on Bits UI Combobox multiple mode: the menu carries role="listbox" with aria-multiselectable, options carry role="option" with aria-selected.',
		'The trigger announces the selection through an aria-labelledby pair of visible label and screen-reader value text.',
		'Highlight is tracked for the data-active style hook without taking focus from the trigger.',
		'Disabled options are exposed with aria-disabled and skipped by selection.'
	],
	motion:
		'Phase 1 still-state: chips and the overflow count render at their resting end-state with no slot-spring travel; the menu mounts when open with no enter/exit travel; the check renders fully drawn. Phase 2 wires the chip slot springs, overflow count roll, checkbox path draw, and menu spring. Reduced motion keeps the same end-states with instant transitions.',
	notes:
		'Menu open/close, multi-selection, and outside-dismiss are powered by Bits UI Combobox; chips, overflow count, and clear-button behaviour follow ARC. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Pick when several values can be chosen and should read back as chips.',
		'Two-way binding is available via bind:value={selected}.',
		'Control chip overflow with maxVisible; the rest fold behind a "+N" count.'
	],
	related: [
		{
			name: 'Combobox',
			slug: 'combobox',
			description: 'A searchable choice field that filters without leaving the keyboard.'
		},
		{
			name: 'Select',
			slug: 'select',
			description: 'A compact choice field with a keyboard friendly menu.'
		},
		{
			name: 'Chip Group',
			slug: 'chip-group',
			description: 'Toggleable filter chips that stay visible.'
		}
	],
	source: 'registry/components/multi-select/multi-select.tsx'
};

export default doc;
