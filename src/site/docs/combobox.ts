import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: 'Combobox',
	tagline: 'A searchable choice field that filters without leaving the keyboard.',
	description:
		'A labelled text field with a filterable listbox. Typing narrows the list by label or keywords, arrows move the highlight, and Enter picks. Built on Bits UI Combobox for the list semantics with ARC styling verbatim.',
	group: 'selects',
	status: 'ported',
	whenToUse: [
		'Long or searchable lists where typing narrows the choices, such as countries or repositories.',
		'Form fields that submit the chosen value through the text input name.',
		'Single-choice selectors that need full keyboard navigation and an empty state.'
	],
	whenNotToUse: [
		'Use select for short fixed lists where typing is not needed.',
		'Use multi-select when several values can be chosen.',
		'Use chip-group when the choices should stay visible as toggleable filters.'
	],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: ['bits-ui', '@lucide/svelte'],
			steps: [
				'Copy combobox.svelte, combobox.types.ts, and combobox.module.css into src/lib/components/combobox/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import Combobox directly from $lib/components/combobox'
			]
		}
	},
	usage: `<script lang="ts">
  import { Combobox } from '$lib/components/combobox';

  let fruit = $state('apple');

  const options = [
    { value: 'apple', label: 'Apple', keywords: ['fruit', 'red'] },
    { value: 'banana', label: 'Banana', keywords: ['fruit', 'yellow'] },
    { value: 'cherry', label: 'Cherry', disabled: true }
  ];
<\/script>

<Combobox
  label="Fruit"
  bind:value={fruit}
  {options}
  description="Pick the fruit for this week's box."
/>`,
	demoCode: `<script lang="ts">
  import { Combobox } from '$lib/components/combobox';

  let fruit = $state('apple');
  let city = $state('');

  const fruits = [
    { value: 'apple', label: 'Apple', keywords: ['red', 'orchard'] },
    { value: 'banana', label: 'Banana', keywords: ['yellow', 'tropical'] },
    { value: 'cherry', label: 'Cherry', keywords: ['red', 'stone'] },
    { value: 'durian', label: 'Durian', disabled: true, keywords: ['tropical'] }
  ];

  const cities = [
    { value: 'oslo', label: 'Oslo' },
    { value: 'kyoto', label: 'Kyoto' },
    { value: 'lima', label: 'Lima' }
  ];
<\/script>

<Combobox label="Fruit" bind:value={fruit} options={fruits} description="Type to filter by name or keyword." />
<Combobox label="City" bind:value={city} options={cities} placeholder="Pick a city…" />
<Combobox label="Disabled" value="apple" options={fruits} disabled />`,
	variants: [
		{
			name: 'Controlled with Description',
			description: 'Two-way binding via bind:value with helper text linked through aria-describedby.',
			code: `<Combobox
  label="Fruit"
  bind:value={fruit}
  options={fruits}
  description="Linked helper text for assistive technology."
/>`
		},
		{
			name: 'Open State and Empty Message',
			description: 'Control the listbox visibility with bind:open and customise the no-match copy.',
			code: `<Combobox
  label="City"
  bind:value={city}
  bind:open={menuOpen}
  options={cities}
  emptyMessage="No cities match that search"
/>`
		},
		{
			name: 'Disabled',
			description: 'Disables the whole field, or individual options via disabled on the option.',
			code: `<Combobox
  label="Restricted Field"
  value="apple"
  disabled
  options={fruits}
/>`
		}
	],
	api: [
		{
			name: 'label',
			type: 'string',
			default: '–',
			description: 'Visible label for the field, linked to the input via for attribute.'
		},
		{
			name: 'options',
			type: 'ComboboxOption[]',
			default: '–',
			description: 'Array of { value: string; label: string; disabled?: boolean; keywords?: string[] } items in list order.'
		},
		{
			name: 'value',
			type: 'string',
			default: 'undefined',
			description: 'Controlled selected value; supports two-way bind:value.'
		},
		{
			name: 'defaultValue',
			type: 'string',
			default: "''",
			description: 'Initial value when uncontrolled.'
		},
		{
			name: 'onValueChange',
			type: '(value: string) => void',
			default: '–',
			description: 'Callback fired when an option is chosen or the selection is cleared.'
		},
		{
			name: 'open',
			type: 'boolean',
			default: 'undefined',
			description: 'Controlled open state of the listbox; supports two-way bind:open.'
		},
		{
			name: 'onOpenChange',
			type: '(open: boolean) => void',
			default: '–',
			description: 'Callback fired when the listbox opens or closes.'
		},
		{
			name: 'description',
			type: 'string',
			default: '–',
			description: 'Helper copy rendered below the field, linked through aria-describedby.'
		},
		{
			name: 'placeholder',
			type: 'string',
			default: "'Search or select…'",
			description: 'Placeholder copy shown when nothing is selected.'
		},
		{
			name: 'emptyMessage',
			type: 'string',
			default: "'No matches found'",
			description: 'Copy shown when the filter matches no option.'
		},
		{
			name: 'id',
			type: 'string',
			default: '–',
			description: 'Input ID; auto-generated via $props.id() when omitted.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether the field is disabled.'
		},
		{
			name: 'class',
			type: 'string',
			default: '–',
			description: 'Additional CSS class applied to the control element.'
		},
		{
			name: 'ref',
			type: 'HTMLInputElement | null',
			default: '–',
			description: 'Bindable reference to the underlying text field.'
		}
	],
	keyboard: [
		{
			key: 'ArrowDown / ArrowUp',
			action: 'Opens the list from the field, then moves the highlight between enabled options.'
		},
		{
			key: 'Enter',
			action: 'Chooses the highlighted option and closes the list.'
		},
		{
			key: 'Escape',
			action: 'Closes the list without changing the selected value.'
		},
		{
			key: 'Type to filter',
			action: 'Narrows the list by label or keywords as you type.'
		}
	],
	accessibility: [
		'Input carries role="combobox" with aria-expanded, aria-controls, aria-autocomplete="list", and aria-activedescendant tracking the highlight.',
		'List semantics (role="listbox", role="option", aria-selected) come from Bits UI Combobox parts.',
		'Label is linked with for/id, and description through aria-describedby.',
		'Disabled options are exposed with aria-disabled and skipped by keyboard navigation.'
	],
	motion:
		'Phase 1 still-state: the list mounts when open at its resting end-state with no enter/exit travel; the clear button renders statically; the chosen label swaps without the rise-in/blur settle. Phase 2 wires the popover spring, list auto-height morph, clear-button scale/blur, and the label settle animation. Reduced motion keeps the same end-states with instant transitions.',
	notes:
		'List open/close, selection, and outside-dismiss are powered by Bits UI Combobox; the text field keeps ARC query/display/keyboard behaviour. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Pick for long or searchable single-choice lists where typing narrows options.',
		'Two-way binding is available via bind:value={selected} and bind:open={menuOpen}.',
		'Use options with value, label, optional disabled, and optional keywords for filter aliases.'
	],
	related: [
		{
			name: 'Select',
			slug: 'select',
			description: 'A compact choice field with a keyboard friendly menu.'
		},
		{
			name: 'Multi Select',
			slug: 'multi-select',
			description: 'A choice field that collects several values as chips.'
		},
		{
			name: 'Chip Group',
			slug: 'chip-group',
			description: 'Toggleable filter chips that stay visible.'
		}
	],
	source: 'registry/components/combobox/combobox.tsx'
};

export default doc;
