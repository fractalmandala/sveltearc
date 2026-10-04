import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: 'Phone input',
	tagline: 'An international number field that formats as it is typed.',
	description:
		'A phone number field with a searchable country picker, live formatting, validation, and E.164 output.',
	group: 'special-inputs',
	status: 'ported',
	whenToUse: [
		'Contact, billing, and authentication forms that need a real phone number.',
		'Numbers entered internationally, pasted with a calling code, or autofilled from a browser.',
		'Forms that submit E.164 values natively without parsing display text.'
	],
	whenNotToUse: [
		'Use input for telephone-shaped strings that are never validated or formatted.',
		'Use select plus input when the country choices are business rules rather than dialing metadata.',
		'Use a plain display string when no one edits the number.'
	],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy phone-input files into src/lib/components/phone-input/',
				'Ensure foundation.css is loaded for the design tokens',
				"Import PhoneInput from '$lib/components/phone-input'"
			]
		}
	},
	usage: `<script lang="ts">
  import { PhoneInput } from '$lib/components/phone-input';

  let number = $state('');
  let country = $state('US');
</script>

<PhoneInput
  label="Mobile number"
  bind:value={number}
  bind:country={country}
  description="Used only for delivery updates."
/>`,
	demoCode: `<script lang="ts">
  import { PhoneInput } from '$lib/components/phone-input';
  let number = $state('');
</script>

<PhoneInput label="Mobile number" bind:value={number} />`,
	variants: [
		{
			name: 'Controlled country and validation',
			description: 'The same picker drives validation, status, and E.164 output.',
			code: `<PhoneInput
  label="Work phone"
  bind:value={number}
  bind:country={country}
  description="Include the country code."
/>`
		},
		{
			name: 'Constrained pool',
			description: 'Limit the searchable picker to the markets being served.',
			code: `<PhoneInput label="Support line" countries={['US', 'CA', 'GB']} />`
		}
	],
	api: [
		{
			name: 'label',
			type: 'string',
			default: '–',
			description: '(Required) Visible label, tied to the number field.'
		},
		{
			name: 'value',
			type: 'string',
			default: '–',
			description: 'Controlled E.164 number. An empty string clears the field. Bindable.'
		},
		{
			name: 'defaultValue',
			type: 'string',
			default: "''",
			description: 'Initial E.164 value for uncontrolled use.'
		},
		{
			name: 'onValueChange',
			type: '(value: string, details: PhoneInputDetails) => void',
			default: '–',
			description: 'Fires on every edit with the E.164 number and its parsed details.'
		},
		{
			name: 'country',
			type: 'string',
			default: '–',
			description: 'ISO code of the selected country. Bindable.'
		},
		{
			name: 'defaultCountry',
			type: 'string',
			default: '"US"',
			description: 'ISO code used before a selection or international entry.'
		},
		{
			name: 'countries',
			type: 'string[]',
			default: '–',
			description: 'Limit the picker to these ISO codes.'
		},
		{
			name: 'description',
			type: 'string',
			default: '–',
			description: 'Helper copy under the field, linked through aria-describedby.'
		},
		{
			name: 'error',
			type: 'string',
			default: '–',
			description: 'Replaces the built-in validation message and sets aria-invalid.'
		},
		{
			name: 'validate',
			type: 'boolean',
			default: 'true',
			description: 'Show a message after blur when the number is incomplete.'
		}
	],
	keyboard: [
		{
			key: 'ArrowDown / ArrowUp',
			action: 'Opens the country picker from the trigger.'
		},
		{
			key: 'Arrow keys / PageUp / PageDown / Home / End',
			action: 'Moves through country rows while the picker is open.'
		},
		{
			key: 'Enter',
			action: 'Chooses the highlighted country.'
		},
		{
			key: 'Escape',
			action: 'Closes the picker and returns focus to the trigger.'
		},
		{
			key: 'Backspace / Delete',
			action: 'Removes the digit beside a formatting separator instead of doing nothing.'
		}
	],
	accessibility: [
		'The number field keeps a native label, invalid state, described-by linkage, and validation announcements.',
		'The picker is a labelled listbox with an active descendant, selected option, and focus return.',
		'Validation states remain meaningful without animation or color alone.'
	],
	motion:
		'Phase 1 still-port: picker dimensions, highlight position, roll direction, validation icon, and helper rows render measured end states; Phase 2 wires panel morph, highlight glide, and enter/exit transitions.',
	notes:
		'Numbers are formatted from an embedded country table instead of a metadata download. E.164 output can be submitted through the optional hidden input. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Prefer E.164 `value`; never parse the formatted display string.',
		'Treat `country` as bindable state separate from the national digits.',
		'Do not replace the country table with an external metadata package.'
	],
	related: [
		{
			name: 'Input',
			slug: 'input',
			description: 'A single-line field for free-form text.'
		},
		{
			name: 'Select',
			slug: 'select',
			description: 'A compact choice field with a keyboard-friendly menu.'
		},
		{
			name: 'Button',
			slug: 'button',
			description: 'Actions commonly adjacent to phone verification.'
		}
	],
	source: 'registry/components/phone-input/phone-input.tsx'
};

export default doc;
