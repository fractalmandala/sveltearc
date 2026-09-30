import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Stepper',
	description: 'Show where a person is in a multi-step flow and what is done.',
	tagline: 'Progress you can point at.',
	group: 'progress',
	status: 'ported',
	whenToUse: [
		'Onboarding, checkout, and setup flows where the person needs to see the path.',
		'When completed steps should be revisitable by click or keyboard.',
		'Horizontal above the step content, or vertical beside it.'
	],
	whenNotToUse: [
		'For an unknown-length task — use Progress.',
		'For a single action — use a Button.',
		'When the steps are not sequential — use Tabs.'
	],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy the stepper folder into src/lib/components/stepper/.',
				'Import Stepper from $lib/components/stepper.',
				'Drive it with `current`; set `current` to steps.length when finished.'
			]
		}
	},
	usage: `<script lang="ts">
  import { Stepper } from '$lib/components/stepper';

  const steps = [
    { id: 'account', label: 'Account' },
    { id: 'profile', label: 'Profile' },
    { id: 'review', label: 'Review' }
  ];
  let current = $state(0);
</script>

<Stepper {steps} {current} onStepSelect={(i) => (current = i)} />`,
	api: [
		{ name: 'steps', type: 'StepperStep[]', description: 'The steps: id, label, optional description and error.' },
		{ name: 'current', type: 'number', description: 'Index of the step in progress; steps.length means complete.' },
		{ name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction.' },
		{ name: 'onStepSelect', type: '(index: number) => void', description: 'Called for a completed step; without it the stepper is read-only.' },
		{ name: 'details', type: "'all' | 'current'", default: "'all'", description: 'Show every description, or only the active step’s.' },
		{ name: 'compact', type: 'boolean', default: 'false', description: 'Markers only; labels stay for assistive tech.' },
		{ name: 'label', type: 'string', default: "'Progress'", description: 'Accessible name.' },
		{ name: 'completeLabel', type: 'string', default: "'All steps complete'", description: 'Shown/announced when every step is done.' }
	],
	keyboard: [
		{ key: 'Arrow keys', action: 'Move between reachable steps (interactive mode).' },
		{ key: 'Home / End', action: 'Jump to the first / current reachable step.' },
		{ key: 'Enter / Space', action: 'Return to a completed step.' }
	],
	accessibility: [
		'Interactive mode is a nav; read-only mode is a group, both labelled.',
		'The current step is aria-current="step"; each step’s state is spoken (Completed, Not started, Error).',
		'A polite live region announces the current step; errors use the danger colour and a label.'
	],
	motion: 'Phase 1 still-state: statuses, glyphs, connector fills, and the caption render statically. Phase 2 wires the glyph pop and check draw, the connector spring, the current-step ring, and the text-swap height animation. Reduced motion keeps the end states.',
	notes: 'No Bits UI primitive. Interactive mode gives completed steps roving focus; the current and upcoming steps are aria-disabled.',
	notesForAi: [
		'Set `current` to steps.length to mark the flow complete.',
		'Provide `onStepSelect` only when completed steps should be revisitable.',
		'An `error` on a step morphs its marker and shows the message instead of the description.'
	],
	related: [
		{ name: 'Progress', slug: 'progress', description: 'A known-length task.' },
		{ name: 'Tabs', slug: 'tabs', description: 'Switch between peer views.' }
	],
	source: 'registry/components/stepper/stepper.tsx'
};

export default doc;
