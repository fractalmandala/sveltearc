import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: 'Chip Group',
	tagline: 'Toggleable filter chips that stay visible in the row.',
	description:
		'A group of selectable filter chips for facets people toggle often, such as topics or statuses. Picking morphs the chip around a check, neighbours re-flow, and long sets fold behind a "+N more" chip. This port keeps the behaviour with static end-states.',
	group: 'selects',
	status: 'ported',
	whenToUse: [
		'Facets people toggle often, such as topics, statuses, or tags.',
		'Filters where every choice should stay visible instead of hiding in a menu.',
		'Single- or multi-pick groups with full arrow-key and Home/End navigation.'
	],
	whenNotToUse: [
		'Use multi-select when the choices should collapse into a compact field.',
		'Use checkbox lists when each option needs its own description.',
		'Use segmented-control for two to four exclusive choices with a sliding indicator.'
	],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy chip-group.svelte, chip-group.types.ts, and chip-group.module.css into src/lib/components/chip-group/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import ChipGroup directly from $lib/components/chip-group'
			]
		}
	},
	usage: `<script lang="ts">
  import { ChipGroup } from '$lib/components/chip-group';

  let topics = $state(['svelte']);

  const options = [
    { value: 'svelte', label: 'Svelte' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' }
  ];
<\/script>

<ChipGroup
  label="Topics"
  bind:value={topics}
  {options}
/>`,
	demoCode: `<script lang="ts">
  import { ChipGroup } from '$lib/components/chip-group';

  let topics = $state(['svelte', 'rust']);
  let framework = $state(['svelte']);

  const many = [
    { value: 'svelte', label: 'Svelte' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'rust', label: 'Rust' },
    { value: 'go', label: 'Go' },
    { value: 'zig', label: 'Zig' }
  ];
<\/script>

<ChipGroup label="Topics" bind:value={topics} options={many} maxVisible={4} />
<ChipGroup label="Framework" bind:value={framework} options={many.slice(0, 3)} multiple={false} />`,
	variants: [
		{
			name: 'Multiple (default)',
			description: 'Several chips can be selected at once; clicking a selected chip removes it.',
			code: `<ChipGroup
  label="Topics"
  bind:value={topics}
  options={many}
/>`
		},
		{
			name: 'Single',
			description: 'Only one chip at a time; the selected chip can still be cleared.',
			code: `<ChipGroup
  label="Framework"
  bind:value={framework}
  options={frameworks}
  multiple={false}
/>`
		},
		{
			name: 'Overflow',
			description: 'Chips beyond maxVisible fold behind a "+N more" chip; selections never hide.',
			code: `<ChipGroup
  label="Topics"
  bind:value={topics}
  options={many}
  maxVisible={4}
/>`
		}
	],
	api: [
		{
			name: 'options',
			type: 'ChipOption[]',
			default: '–',
			description: 'Chips in the group, as { value: string; label: string }, in reading order.'
		},
		{
			name: 'value',
			type: 'string[]',
			default: '–',
			description: 'Controlled selection of chip values; supports two-way bind:value.'
		},
		{
			name: 'onValueChange',
			type: '(value: string[]) => void',
			default: '–',
			description: 'Callback fired whenever the selection changes.'
		},
		{
			name: 'label',
			type: 'string',
			default: '–',
			description: 'Accessible name of the group, such as "Topics".'
		},
		{
			name: 'multiple',
			type: 'boolean',
			default: 'true',
			description: 'Allow several chips at once. In single mode the selected chip can still be cleared.'
		},
		{
			name: 'maxVisible',
			type: 'number',
			default: 'Infinity',
			description: 'Chips shown before the rest fold behind a "+N more" chip. Chips selected when it folds stay in view.'
		},
		{
			name: 'class',
			type: 'string',
			default: '–',
			description: 'Additional CSS class applied to the group element.'
		}
	],
	keyboard: [
		{
			key: 'ArrowRight / ArrowDown',
			action: 'Moves focus to the next chip, wrapping at the end.'
		},
		{
			key: 'ArrowLeft / ArrowUp',
			action: 'Moves focus to the previous chip, wrapping at the start.'
		},
		{
			key: 'Home / End',
			action: 'Jumps focus to the first or last chip.'
		},
		{
			key: 'Space / Enter',
			action: 'Toggles the focused chip.'
		}
	],
	accessibility: [
		'The row carries role="group" with the accessible name from label.',
		'Each chip is a button with aria-pressed reflecting selection.',
		'Roving tabindex keeps one tab stop: the last focused chip, else the first selected, else the first.',
		'The overflow chip announces its state through aria-expanded.'
	],
	motion:
		'Phase 1 still-state: chips render at their resting end-state (check in, label over, surface tinted) with no layout-spring travel; the overflow folds instantly with no height morph; the "+N" text swaps without the roll. Phase 2 wires the shared-layout springs, width-lag edge follow, height morph, text roll, stagger, and check draw. Reduced motion keeps the same end-states with instant transitions.',
	notes:
		'No Radix or Bits UI primitive exists for this composition, so the group is a custom port of ARC behaviour with motion reduced to still end-states. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Pick for visible toggle filters, not for collapsed fields.',
		'value stays purely controlled: every toggle flows out through onValueChange (bind:value is the shorthand).',
		'Chips selected when the overflow folds stay in view, so selections never hide.'
	],
	related: [
		{
			name: 'Multi Select',
			slug: 'multi-select',
			description: 'A choice field that collects several values as chips.'
		},
		{
			name: 'Combobox',
			slug: 'combobox',
			description: 'A searchable choice field that filters without leaving the keyboard.'
		},
		{
			name: 'Select',
			slug: 'select',
			description: 'A compact choice field with a keyboard friendly menu.'
		}
	],
	source: 'registry/components/chip-group/chip-group.tsx'
};

export default doc;
