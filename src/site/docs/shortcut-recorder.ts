import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: 'Shortcut recorder',
	tagline: 'Record keyboard shortcuts without guessing the keys.',
	description:
		'A field that captures physical key combinations, shows platform-correct caps, warns about conflicts, and documents them in a searchable cheatsheet.',
	group: 'special-inputs',
	status: 'ported',
	whenToUse: [
		'Settings and command surfaces where people assign their own shortcuts.',
		'Products that must explain shortcuts with spoken labels and platform-correct caps.',
		'Flows that need conflict detection, reserved-combination warnings, and a cheatsheet.'
	],
	whenNotToUse: [
		'Use static text when a shortcut is fixed and never recorded.',
		'Use the browser or operating-system table when shortcuts live outside the app.',
		'Use a simple text field when modifier order and spoken labels do not matter.'
	],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy shortcut-recorder files into src/lib/components/shortcut-recorder/',
				'Ensure foundation.css is loaded for the design tokens',
				"Import ShortcutRecorder and ShortcutList from '$lib/components/shortcut-recorder'"
			]
		}
	},
	usage: `<script lang="ts">
  import { ShortcutRecorder } from '$lib/components/shortcut-recorder';

  let shortcut = $state<string | null>(null);
</script>

<ShortcutRecorder
  label="Save"
  bind:value={shortcut}
  bindings={[{ shortcut: 'mod+s', label: 'Search' }]}
/>`,
	demoCode: `<script lang="ts">
  import { ShortcutRecorder } from '$lib/components/shortcut-recorder';
  let shortcut = $state<string | null>(null);
</script>

<ShortcutRecorder label="Save" bind:value={shortcut} />`,
	variants: [
		{
			name: 'Conflict handling',
			description: 'A used or reserved shortcut asks before it is taken.',
			code: `<ShortcutRecorder label="Export" bind:value={value} bindings={bindings} />`
		},
		{
			name: 'Cheatsheet',
			description: 'Searchable key-cap documentation with live pressed-key highlighting.',
			code: `<ShortcutList groups={groups} />`
		}
	],
	api: [
		{
			name: 'label',
			type: 'string',
			default: '–',
			description: '(Required) Visible label naming the action the shortcut is recorded for.'
		},
		{
			name: 'value',
			type: 'string | null',
			default: '–',
			description: 'Recorded shortcut string, or null when empty. Bindable.'
		},
		{
			name: 'defaultValue',
			type: 'string | null',
			default: 'null',
			description: 'Initial shortcut for uncontrolled use.'
		},
		{
			name: 'onValueChange',
			type: '(value: string | null, details: { replaced?: ShortcutBinding }) => void',
			default: '–',
			description: 'Fires when the shortcut changes, including the replaced binding.'
		},
		{
			name: 'bindings',
			type: 'ShortcutBinding[]',
			default: '[]',
			description: 'Shortcuts already in use. Recording one asks before taking it.'
		},
		{
			name: 'warnReserved',
			type: 'boolean',
			default: 'true',
			description: 'Warn about combinations the browser or system keeps.'
		},
		{
			name: 'requireModifier',
			type: 'boolean',
			default: 'true',
			description: 'Require a modifier (function keys are always allowed).'
		},
		{
			name: 'platform',
			type: '"mac" | "other"',
			default: 'auto-detected',
			description: 'Platform override for key caps.'
		},
		{
			name: 'description',
			type: 'string',
			default: '–',
			description: 'Helper copy under the field, linked through aria-describedby.'
		}
	],
	keyboard: [
		{
			key: 'Shortcut chord',
			action: 'Press the combination while recording. Held modifiers show as key caps.'
		},
		{
			key: 'Escape',
			action: 'Cancels recording without changing the saved shortcut.'
		},
		{
			key: 'Backspace / Delete',
			action: 'Clears the recorded shortcut.'
		},
		{
			key: 'Tab',
			action: 'Leaves recording mode and moves focus.'
		}
	],
	accessibility: [
		'The recorder is a labelled button whose visible key caps are decorative and whose spoken shortcut is explicit.',
		'Recording, conflicts, clears, and resets are announced through a polite live region.',
		'The cheatsheet keeps real headings, a labelled search field, and match counts.'
	],
	motion:
		'Phase 1 still-port: token layout, conflict panels, reset/clear affordances, cheatsheet rows, and recording indicator render static end states; Phase 2 wires layout and enter/exit motion.',
	notes:
		'Shortcuts are physical-key strings, not display labels. Platform caps, normalization, conflict detection, and search semantics are shared framework-agnostic modules. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Store the normalized shortcut string. Do not reconstruct behavior from key-cap labels.',
		'Keep platform detection automatic unless documenting a fixed platform.',
		'Use the Use anyway result to unbind the replaced shortcut explicitly.'
	],
	related: [
		{
			name: 'Button',
			slug: 'button',
			description: 'Trigger actions without recording shortcuts.'
		},
		{
			name: 'Input',
			slug: 'input',
			description: 'Single-line text entry with helper and error rows.'
		},
		{
			name: 'Tooltip',
			slug: 'tooltip',
			description: 'Short supporting text for unfamiliar controls.'
		}
	],
	source: 'registry/components/shortcut-recorder/shortcut-recorder.tsx'
};

export default doc;
