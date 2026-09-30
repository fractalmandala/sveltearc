import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: 'Select',
	tagline: 'A compact choice field with a keyboard friendly menu.',
	description:
		'A labelled choice field whose shown value rolls in the direction of the list. Built on Bits UI Select for accessible keyboard navigation and typeahead.',
	group: 'selects',
	status: 'ported',
	whenToUse: [
		'A short fixed list where typing is not needed, such as region or sort order.',
		'Form fields that should submit natively through the hidden input name.',
		'Dropdown selectors requiring clean keyboard navigation and typeahead.'
	],
	whenNotToUse: [
		'Use combobox for long or searchable lists.',
		'Use multi-select when several values can be chosen.',
		'Use segmented-control for two to four choices that should stay visible.'
	],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/select',
		manual: {
			dependencies: ['bits-ui', '@lucide/svelte'],
			steps: [
				'Copy select.svelte, select.types.ts, and select.module.css into src/lib/components/select/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import Select directly from $lib/components/select'
			]
		}
	},
	usage: `<script lang="ts">
  import { Select } from '$lib/components/select';

  let region = $state('eu');

  const options = [
    { value: 'us', label: 'United States' },
    { value: 'eu', label: 'Europe' },
    { value: 'ap', label: 'Asia Pacific', disabled: true },
    { value: 'sa', label: 'South America' }
  ];
<\/script>

<Select
  label="Region"
  bind:value={region}
  {options}
  description="Select the primary deployment region for your cluster."
/>`,
	demoCode: `<script lang="ts">
  import { Select } from '$lib/components/select';

  let region = $state('eu');
  let framework = $state('');

  const regionOptions = [
    { value: 'us', label: 'United States (us-east-1)' },
    { value: 'eu', label: 'Europe (eu-west-1)' },
    { value: 'ap', label: 'Asia Pacific (ap-southeast-1)', disabled: true },
    { value: 'sa', label: 'South America (sa-east-1)' }
  ];

  const frameworkOptions = [
    { value: 'svelte', label: 'SvelteKit 2.0' },
    { value: 'astro', label: 'Astro 5.0' },
    { value: 'next', label: 'Next.js 15' },
    { value: 'nuxt', label: 'Nuxt 3' }
  ];
<\/script>

<div class="demo-select-container">
  <Select
    label="Cloud Region"
    bind:value={region}
    options={regionOptions}
    description="Primary deployment region for compute instances."
  />

  <Select
    label="Application Framework"
    bind:value={framework}
    options={frameworkOptions}
    placeholder="Pick your framework..."
  />
</div>`,
	variants: [
		{
			name: 'Controlled with Description',
			description: 'Two-way binding via bind:value with helper text linked through aria-describedby.',
			code: `<Select
  label="Region"
  bind:value={selectedRegion}
  options={regionOptions}
  description="Linked helper text for assistive technology."
/>`
		},
		{
			name: 'Disabled and Disabled Options',
			description: 'Supports disabling individual options or the entire select trigger.',
			code: `<Select
  label="Restricted Field"
  value="us"
  disabled
  options={regionOptions}
/>`
		}
	],
	api: [
		{
			name: 'label',
			type: 'string',
			default: '–',
			description: 'Visible label for the trigger, linked via for attribute.'
		},
		{
			name: 'options',
			type: 'SelectOption[]',
			default: '–',
			description: 'Array of { value: string; label: string; disabled?: boolean } items in list order.'
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
			description: 'Callback fired when an option is selected.'
		},
		{
			name: 'open',
			type: 'boolean',
			default: 'undefined',
			description: 'Controlled open state of the dropdown; supports two-way bind:open.'
		},
		{
			name: 'onOpenChange',
			type: '(open: boolean) => void',
			default: '–',
			description: 'Callback fired when dropdown opens or closes.'
		},
		{
			name: 'placeholder',
			type: 'string',
			default: "'Select an option'",
			description: 'Placeholder text displayed when no value is selected.'
		},
		{
			name: 'description',
			type: 'string',
			default: '–',
			description: 'Helper copy rendered below the trigger, linked through aria-describedby.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Whether the select is disabled.'
		},
		{
			name: 'name',
			type: 'string',
			default: '–',
			description: 'Form submission input name.'
		},
		{
			name: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Whether selection is required for form validation.'
		},
		{
			name: 'id',
			type: 'string',
			default: '–',
			description: 'Trigger ID; auto-generated via $props.id() when omitted.'
		},
		{
			name: 'class',
			type: 'string',
			default: '–',
			description: 'Additional CSS class applied to the trigger element.'
		}
	],
	keyboard: [
		{
			key: 'Enter / Space / ArrowDown',
			action: 'Opens the list from the trigger.'
		},
		{
			key: 'ArrowUp / ArrowDown',
			action: 'Moves highlight between enabled items in the list.'
		},
		{
			key: 'Enter / Space',
			action: 'Selects the highlighted item and closes the dropdown.'
		},
		{
			key: 'Escape',
			action: 'Closes the dropdown without changing the selected value.'
		},
		{
			key: 'Type a letter',
			action: 'Jumps directly to the next item starting with that letter (typeahead).'
		}
	],
	accessibility: [
		'Built on Bits UI Select: provides native role="combobox" on trigger and role="listbox" on content.',
		'Trigger is linked to label with for/id, and to description through aria-describedby.',
		'Real value renders in a visually hidden input for form submission; animated copy is aria-hidden.',
		'Focus is properly trapped and returned to trigger on close.'
	],
	motion:
		'Phase 1 still-state: Selected value renders in trigger valueText container. Content animates in and out with CSS keyframes (select-in / select-out). Chevron rotates 180deg when open. Phase 2 wires directional value roll (later option rises from below, earlier drops from above with soft blur filter). Reduced motion swaps value with instant crossfade.',
	notes:
		'Headless select accessibility and typeahead navigation are powered by Bits UI Select. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Pick for short fixed lists where typing is not needed.',
		'Two-way binding is available via bind:value={selected}.',
		'Use options array with value and label properties; disabled flag is optional per item.'
	],
	related: [
		{
			name: 'Dropdown Menu',
			slug: 'dropdown-menu',
			description: 'A focused list of actions anchored to a trigger button.'
		},
		{
			name: 'Popover',
			slug: 'popover',
			description: 'A small anchored surface for contextual content.'
		},
		{
			name: 'Split Button',
			slug: 'split-button',
			description: 'A dual-action control with primary action and dropdown options.'
		}
	],
	source: 'registry/components/select/select.tsx'
};

export default doc;
