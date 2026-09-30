import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Switch',
	tagline: 'A tactile toggle for settings that take effect immediately.',
	description: 'A toggle for a single on/off preference, with a spring-glide thumb, tactile press-stretch, and integrated accessible label.',
	group: 'toggles',
	status: 'ported',
	whenToUse: [
		'Settings that take effect as soon as they are flipped, such as notifications or feature toggles.',
		'Settings lists where each row represents one distinct on/off preference.'
	],
	whenNotToUse: [
		'Use Checkbox when the choice waits for a form submit button.',
		'Use Segmented Control for choosing between multiple named options.',
		'Use Theme Switch for light and dark appearance toggling.'
	],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/switch',
		manual: {
			dependencies: ['bits-ui', '@humanspeak/svelte-motion'],
			steps: [
				'Copy src/lib/components/switch/ to your project components directory.',
				'Ensure the $lib path alias is configured in svelte.config.js / tsconfig.json.',
				'All styles live in switch.module.css — no Tailwind configuration required.'
			]
		}
	},
	usage: `<script lang="ts">
  import Switch from '$lib/components/switch/switch.svelte';
  let enabled = $state(true);
</script>

<Switch bind:checked={enabled} label="Email notifications" />`,
	demoCode: `<script lang="ts">
  import Switch from '$lib/components/switch/switch.svelte';

  let wifi = $state(true);
  let bluetooth = $state(false);
  let airplane = $state(false);
</script>

<div class="demo-grid">
  <Switch bind:checked={wifi} label="Wi-Fi Networking" />
  <Switch bind:checked={bluetooth} label="Bluetooth Connections" />
  <Switch bind:checked={airplane} label="Airplane Mode" disabled />
</div>`,
	variants: [
		{
			name: 'Default (Controlled)',
			description: 'Two-way binding with Svelte 5 $bindable() rune.',
			code: `<Switch bind:checked={val} label="Push notifications" />`
		},
		{
			name: 'Disabled State',
			description: 'Interaction is disabled and visual opacity is dimmed.',
			code: `<Switch checked={false} label="Location services" disabled />`
		},
		{
			name: 'Uncontrolled with Default',
			description: 'Seeds initial state once via defaultChecked without external binding.',
			code: `<Switch defaultChecked={true} label="Auto-update apps" />`
		}
	],
	api: [
		{ name: 'checked', type: 'boolean', description: 'Controlled state. Use bind:checked for two-way reactivity.' },
		{ name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
		{ name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Callback fired on every toggle transition.' },
		{ name: 'label', type: 'string', description: 'Visible label text; automatically acts as aria-label.' },
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction and dims control contrast.' },
		{ name: 'required', type: 'boolean', default: 'false', description: 'Marks the input field as required in forms.' },
		{ name: 'name', type: 'string', description: 'Form input field name; renders a hidden input for form submissions.' },
		{ name: 'value', type: 'string', default: "'on'", description: 'Form value submitted when the switch is checked.' },
		{ name: 'ref', type: 'HTMLElement | null', description: 'Bindable ref to the underlying Bits UI root button element.' }
	],
	keyboard: [
		{ key: 'Space', action: 'Toggles the switch. Holding Space stretches the thumb until release.' },
		{ key: 'Enter', action: 'Toggles the switch.' },
		{ key: 'Tab', action: 'Moves focus to or away from the switch control.' }
	],
	accessibility: [
		'Bits UI renders a semantic <button> with role="switch" and aria-checked.',
		'The label prop automatically connects as the accessible label; icon-only variants require an explicit aria-label.',
		'Focus states display a high-contrast focus ring conforming to WCAG 2.1 AA.'
	],
	motion: 'Phase 1 still-state: the thumb rests at its static terminal coordinate (translateX 0 vs 18px). Phase 2 wires the dynamic spring glide and press-stretch (scaleX) via @humanspeak/svelte-motion; the prefers-reduced-motion path is instant CSS state and already fully functional.',
	notes: 'Headless accessibility and state mechanics are powered by Bits UI Switch. Root. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Use for preferences that take effect immediately upon toggle. Use Checkbox when choices require a submit button.',
		'Always prefer bind:checked with Svelte 5 runes for reactive state synchronization.',
		'Pass the name prop whenever the switch is part of a native HTML form or SvelteKit form action.'
	],
	related: [
		{ name: 'Checkbox', slug: 'checkbox', description: 'A binary choice with a precise, legible check/dash state for forms.' },
		{ name: 'Segmented Control', slug: 'segmented-control', description: 'Switch between a small set of related views.' }
	],
	source: 'registry/components/switch/switch.tsx'
};

export default doc;
