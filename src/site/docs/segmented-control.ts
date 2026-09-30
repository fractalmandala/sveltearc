import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Segmented control",
	tagline: "Switch between a small set of related views.",
	description: "Switch between a small set of related views.",
	group: 'toggles',
	status: 'ported',
	whenToUse: ["Two to five short view options like Day, Week, and Month.","Toolbar toggles between layouts or modes that apply immediately."],
	whenNotToUse: ["Use tabs when each option swaps a panel of content.","Use radio-group in forms or when options need descriptions.","Use switch for a single on and off setting."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/segmented-control',
		manual: {
			dependencies: ["bits-ui"],
			steps: [
				'Copy segmented-control files into src/lib/components/segmented-control/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import SegmentedControl from $lib/components/segmented-control'
			]
		}
	},
	usage: `<script lang="ts">
  import { SegmentedControl } from '$lib/components/segmented-control';

  let range = $state('day');
<\/script>

<SegmentedControl
  label="Range"
  bind:value={range}
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' }
  ]}
/>`,
	demoCode: `<script lang="ts">
  import { SegmentedControl } from '$lib/components/segmented-control';

  let range = $state('day');
<\/script>

<div class="demo-segmented-control-container">
  <SegmentedControl
    label="Range"
    bind:value={range}
    options={[
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' }
    ]}
  />
</div>`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: `<SegmentedControl
      label="Range"
      value={range}
      onValueChange={setRange}
      options={[
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
      ]}
    />`
		}
	],
	api: [
  {
    "name": "options",
    "type": "{ value: string; label: string; accessory?: Snippet }[]",
    "default": "–",
    "description": "(Required) Segments in order. An accessory, such as a badge, renders after the label."
  },
  {
    "name": "value",
    "type": "string",
    "default": "–",
    "description": "(Required) Selected value."
  },
  {
    "name": "onValueChange",
    "type": "(value: string) => void",
    "default": "–",
    "description": "(Required) Called with the chosen segment's value, from a click or the arrow, Home and End keys."
  },
  {
    "name": "label",
    "type": "string",
    "default": "–",
    "description": "aria-label for the group."
  },
  {
    "name": "onOptionIntent",
    "type": "(value: string) => void",
    "default": "–",
    "description": "Called when the pointer or focus reaches a segment before it is chosen, to start loading what it shows."
  },
  {
    "name": "className",
    "type": "string",
    "default": "–",
    "description": "Extra class on the root."
  }
],
	keyboard: [
  {
    "key": "Tab",
    "action": "Moves focus into the control, onto the selected segment, and out again."
  },
  {
    "key": "Arrow keys",
    "action": "Select and focus the previous or next segment, wrapping at the ends."
  },
  {
    "key": "Home / End",
    "action": "Select the first or last segment."
  }
],
	accessibility: ["Renders role=\"group\" labelled by label, with native buttons using aria-pressed for the selected segment. Only the selected segment is a tab stop.","The sliding pill is aria-hidden."],
	motion: "- A shared layoutId pill slides to the selected segment on the morph spring, scoped per instance by a LayoutGroup. - Reduced motion moves the pill instantly and disables button transitions.",
	notes: "Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["Use for two to five short, mutually exclusive view options like time ranges or layouts. Use tabs when each option swaps a panel, and radio-group in forms.","Always controlled. Import it as a default export."],
	related: [{"name":"Tabs","slug":"tabs","description":"Switch between related content in the same context."},{"name":"Radio group","slug":"radio-group","description":"Choose one option from a visible set."},{"name":"Switch","slug":"switch","description":"A tactile toggle for settings that take effect immediately."},{"name":"Liquid tab bar","slug":"liquid-tab-bar","description":"Tabs with a liquid selection that stretches between them and fills in icons as it passes."}],
	source: 'registry/components/segmented-control/segmented-control.tsx'
};

export default doc;
