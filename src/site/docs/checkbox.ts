import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Checkbox',
	tagline: 'A binary choice with a precise, legible state.',
	description:
		'A binary or tri-state control with a spring-animated check mark that morphs into an indeterminate dash, and integrated label and description.',
	group: 'toggles',
	status: 'ported',
	whenToUse: [
		'Independent on and off choices confirmed by a submit button, such as accepting terms and conditions.',
		'Parent rows that show a partial selection through the indeterminate state.',
		'Form lists where multiple items can be checked simultaneously.'
	],
	whenNotToUse: [
		'Use Switch for settings that apply immediately without a form submission.',
		'Use Radio Group when only one option can be chosen from a visible set.',
		'Use Chip Group for filter facets people toggle frequently.'
	],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/checkbox',
		manual: {
			dependencies: ['bits-ui', '@humanspeak/svelte-motion'],
			steps: [
				'Copy src/lib/components/checkbox/ to your project components directory.',
				'Ensure the $lib path alias is configured in svelte.config.js / tsconfig.json.',
				'All styles live in checkbox.module.css — no Tailwind configuration required.'
			]
		}
	},
	usage: `<script lang="ts">
  import Checkbox from '$lib/components/checkbox/checkbox.svelte';
  import type { CheckedState } from '$lib/components/checkbox/checkbox.types';

  let accepted = $state<CheckedState>(false);
</script>

<Checkbox
  bind:checked={accepted}
  label="I agree to the terms"
  description="You can export your data at any time."
/>`,
	demoCode: `<script lang="ts">
  import Checkbox from '$lib/components/checkbox/checkbox.svelte';
  import type { CheckedState } from '$lib/components/checkbox/checkbox.types';

  let bound = $state<CheckedState>(false);
  let mixed = $state<CheckedState>('indeterminate');
  let viaCallback = $state<CheckedState>(false);
</script>

<div class="demo-grid">
  <Checkbox bind:checked={bound} label="Accept terms" description="You can change this later." />
  <Checkbox bind:checked={mixed} label="Indeterminate (starts mixed)" />
  <Checkbox
    checked={viaCallback}
    onCheckedChange={(next) => (viaCallback = next)}
    label="Callback"
  />
  <Checkbox defaultChecked label="Default checked (uncontrolled)" />
  <Checkbox disabled label="Disabled" />
</div>

<p class="demo-note">
  bound: <strong>{bound ? 'on' : 'off'}</strong> · mixed: <strong>{String(mixed)}</strong> · callback:
  <strong>{viaCallback ? 'on' : 'off'}</strong>
</p>`,
	variants: [
		{
			name: 'Controlled with Description',
			description: 'Two-way binding via bind:checked with supporting secondary copy.',
			code: `<Checkbox bind:checked={accepted} label="Accept terms" description="You can change this later." />`
		},
		{
			name: 'Indeterminate State',
			description: 'Displays a horizontal dash mark when partially selected in hierarchical lists.',
			code: `<Checkbox checked="indeterminate" label="Select all subtasks" />`
		},
		{
			name: 'Disabled State',
			description: 'Prevents user interaction and dims visual contrast.',
			code: `<Checkbox checked={true} label="Required permission" disabled />`
		},
		{
			name: 'Uncontrolled with Default',
			description: 'Initializes state once via defaultChecked without external variable binding.',
			code: `<Checkbox defaultChecked={true} label="Remember me on this device" />`
		}
	],
	api: [
		{
			name: 'checked',
			type: "boolean | 'indeterminate'",
			description: 'Controlled state. Use bind:checked for two-way reactivity with Svelte 5 runes.'
		},
		{
			name: 'defaultChecked',
			type: "boolean | 'indeterminate'",
			default: 'false',
			description: 'Initial state when uncontrolled.'
		},
		{
			name: 'onCheckedChange',
			type: '(checked: CheckedState) => void',
			description: 'Callback fired on every toggle transition.'
		},
		{
			name: 'label',
			type: 'string',
			description:
				'Visible label text rendered beside the box; connects automatically as the accessible label.'
		},
		{
			name: 'description',
			type: 'string',
			description: 'Secondary descriptive text rendered under the label, linked via aria-describedby.'
		},
		{
			name: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disables user interaction and dims visual contrast.'
		},
		{
			name: 'required',
			type: 'boolean',
			default: 'false',
			description: 'Marks the input field as required in HTML forms.'
		},
		{
			name: 'name',
			type: 'string',
			description: 'Form input field name; renders a hidden input for native form submissions.'
		},
		{
			name: 'value',
			type: 'string',
			default: "'on'",
			description: 'Form value submitted when the checkbox is checked.'
		},
		{
			name: 'id',
			type: 'string',
			description: 'Unique identifier for the input; falls back to an auto-generated id.'
		},
		{
			name: 'ref',
			type: 'HTMLElement | null',
			description: 'Bindable ref to the underlying Bits UI root button element.'
		}
	],
	keyboard: [
		{ key: 'Space', action: 'Toggles the checkbox between checked and unchecked.' },
		{ key: 'Tab', action: 'Moves focus to or away from the checkbox control.' }
	],
	accessibility: [
		'Bits UI renders a semantic <button> with role="checkbox" and aria-checked (including "mixed" when indeterminate).',
		'The label is a semantic <label> element tied by id; description is automatically linked via aria-describedby.',
		'The drawn SVG check mark and fill are aria-hidden="true".',
		'High-contrast focus ring conforms to WCAG 2.1 AA specifications.',
		'Full hit area is an expanded touch target (control height) so it remains effortless to tap on mobile even though the visual mark is compact.'
	],
	motion:
		'Phase 1 still-state: the fill and check mark render their static end values (opacity 0 vs 1, scale 0.6 vs 1, path d) with no animation. Phase 2 wires the snappy spring fill scale and the check path morphing into the dash path via @humanspeak/svelte-motion. The prefers-reduced-motion path applies every state change instantly via CSS.',
	notes:
		'Bits UI splits Radix’s `checked` union into a boolean `checked` plus an `indeterminate` prop; this port keeps the Radix-shaped union on the public API and translates internally. Accessibility (role, aria-checked, keyboard, focus) is owned by Bits UI.',
	notesForAi: [
		'Use for independent on/off choices in forms. Use Switch for settings that apply immediately upon toggle.',
		'Set checked="indeterminate" on a parent checkbox when only a subset of child options are selected.',
		'Bits UI renders a hidden native input when name is set, so it submits with standard HTML forms and SvelteKit form actions.',
		'Always prefer bind:checked with Svelte 5 runes for reactive two-way binding.'
	],
	related: [
		{
			name: 'Switch',
			slug: 'switch',
			description: 'A tactile toggle for settings that take effect immediately.'
		},
		{
			name: 'Radio Group',
			slug: 'radio-group',
			description: 'Choose one option from a visible set.'
		},
		{
			name: 'Segmented Control',
			slug: 'segmented-control',
			description: 'Switch between a small set of related views.'
		}
	],
	source: 'registry/components/checkbox/checkbox.tsx'
};

export default doc;
