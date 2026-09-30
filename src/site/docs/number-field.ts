import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Number field",
	tagline: "A bounded number with odometer digits and steppers.",
	description: "A bounded number with odometer digits and steppers.",
	group: 'special-inputs',
	status: 'ported',
	whenToUse: ["Any bounded numeric value with clear increment and decrement controls, such as seats, quantity, or retries.","Values typed often and stepped often, where arrow keys, PageUp/PageDown, and hold-to-repeat speed up entry.","Prefixed or suffixed amounts where the unit should follow the value."],
	whenNotToUse: ["Use input for free-form numeric strings like serials or codes.","Use slider when the value is picked from a range by position rather than typed.","Use several fields with one save button — number-field commits every change as it happens."],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy number-field files into src/lib/components/number-field/',
				'Ensure foundation.css is loaded for the design tokens',
				'Import NumberField from $lib/components/number-field'
			]
		}
	},
	usage: `<script lang="ts">
  import { NumberField } from '$lib/components/number-field';
  let seats = $state(4);
</script>

<NumberField label="Seats" bind:value={seats} min={1} max={12} suffix={(n) => n === 1 ? ' seat' : ' seats'} description="How many people need access." />`,
	demoCode: `<script lang="ts">
  import { NumberField } from '$lib/components/number-field';
  let seats = $state(4);
</script>

<NumberField label="Seats" bind:value={seats} min={1} max={12} suffix={(n) => n === 1 ? ' seat' : ' seats'} description="How many people need access." />`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: `<NumberField label="Seats" />`
		}
	],
	api: [
  {
    "name": "label",
    "type": "string",
    "default": "–",
    "description": "(Required) Visible label, tied to the input. Doubles as the scrub handle when scrub is set."
  },
  {
    "name": "value",
    "type": "number",
    "default": "–",
    "description": "Controlled value. Omit (with defaultValue) for uncontrolled use; bindable."
  },
  {
    "name": "defaultValue",
    "type": "number",
    "default": "0",
    "description": "Initial value for uncontrolled use."
  },
  {
    "name": "onValueChange",
    "type": "(value: number) => void",
    "default": "–",
    "description": "Fires with the clamped, snapped value on every committed change."
  },
  {
    "name": "min",
    "type": "number",
    "default": "0",
    "description": "Lower bound."
  },
  {
    "name": "max",
    "type": "number",
    "default": "Number.MAX_SAFE_INTEGER",
    "description": "Upper bound."
  },
  {
    "name": "step",
    "type": "number",
    "default": "1",
    "description": "Step size. Non-positive values fall back to 1."
  },
  {
    "name": "largeStep",
    "type": "number",
    "default": "ten steps",
    "description": "PageUp, PageDown, and Shift with an arrow move this far."
  },
  {
    "name": "description",
    "type": "string",
    "default": "–",
    "description": "Helper copy under the field, linked through aria-describedby."
  },
  {
    "name": "disabled",
    "type": "boolean",
    "default": "false",
    "description": "Disables the input and both step buttons."
  },
  {
    "name": "id",
    "type": "string",
    "default": "$props.id()",
    "description": "Element id. Falls back to an auto-generated id."
  },
  {
    "name": "prefix",
    "type": "string | ((value: number) => string)",
    "default": "–",
    "description": "Text before the number, such as \"$\"."
  },
  {
    "name": "suffix",
    "type": "string | ((value: number) => string)",
    "default": "–",
    "description": "Text after the number, such as \" seats\"."
  },
  {
    "name": "scrub",
    "type": "boolean",
    "default": "false",
    "description": "Drag the label sideways to scrub the value, one step every few pixels."
  },
  {
    "name": "locale",
    "type": "string",
    "default": "\"en-US\"",
    "description": "Formatting locale. Fixed by default so server and client render the same digits."
  },
  {
    "name": "formatOptions",
    "type": "{ minimumFractionDigits?: number; maximumFractionDigits?: number; useGrouping?: boolean }",
    "default": "–",
    "description": "Fraction digits and grouping. Fraction digits follow the precision of step by default."
  },
  {
    "name": "size",
    "type": "\"sm\" | \"md\" | \"lg\"",
    "default": "\"md\"",
    "description": "Control height, type size, and default width."
  },
  {
    "name": "limitHint",
    "type": "boolean | ((edge: \"min\" | \"max\", limit: number) => string)",
    "default": "true",
    "description": "A short note beside the label when a press meets a limit. false hides it; a function writes the copy."
  }
],
	keyboard: [
  {
    "key": "ArrowUp / ArrowDown",
    "action": "Steps the value; hold to repeat. Shift takes a large step."
  },
  {
    "key": "PageUp / PageDown",
    "action": "Takes a large step."
  },
  {
    "key": "Home / End",
    "action": "Jumps to the minimum or maximum."
  },
  {
    "key": "Enter",
    "action": "Commits a typed draft, or selects the value when idle."
  },
  {
    "key": "Escape",
    "action": "Rolls a typed draft back to the value it started from."
  },
  {
    "key": "Tab",
    "action": "Moves focus to the interactive element."
  }
],
	accessibility: ["Renders a native text input with role=\"spinbutton\" plus aria-valuenow, aria-valuetext, aria-valuemin, and aria-valuemax.","Description and limit-note ids are merged into aria-describedby alongside any caller value; a typed value past a limit sets aria-invalid.","Limit presses announce which limit was met through a polite live region; animated digits are aria-hidden with a plain screen reader value."],
	motion: "Phase 1 still-port: odometer wheels, affix rolls, limit-note slide, value strain, and helper word-rise render their static end states; Phase 2 wires the springs without restructuring.",
	notes: "Headless mechanics powered by Svelte runes. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["Bounded numeric entry with steppers. Commits every change live — do not use where several fields must save together.","Works controlled or with defaultValue; onValueChange always receives the clamped, snapped value.","Typed drafts apply live while valid; derive limit copy with limitHint instead of custom messages."],
	related: [{"name":"Input","slug":"input","description":"A single line field for free-form text values."},{"name":"Tag input","slug":"tag-input","description":"Turn short text values into removable tags."},{"name":"Inline edit","slug":"inline-edit","description":"Rename in place without moving surrounding content."}],
	source: 'registry/components/number-field/number-field.tsx'
};

export default doc;
