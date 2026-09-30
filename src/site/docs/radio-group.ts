import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Radio group",
	tagline: "Choose one option from a visible set.",
	description: "Choose one option from a visible set.",
	group: 'toggles',
	status: 'ported',
	whenToUse: ["Two to six mutually exclusive options that need descriptions, such as plans.","Form choices that should submit natively through name."],
	whenNotToUse: ["Use segmented-control for short inline view options.","Use select for longer lists.","Use checkbox when several options can be on at once."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/radio-group',
		manual: {
			dependencies: ["bits-ui"],
			steps: [
				'Copy radio-group files into src/lib/components/radio-group/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import RadioGroup from $lib/components/radio-group'
			]
		}
	},
	usage: `<script lang="ts">
  import { RadioGroup } from '$lib/components/radio-group';

  let plan = $state('solo');
<\/script>

<RadioGroup
  label="Plan"
  name="plan"
  bind:value={plan}
  options={[
    { value: 'solo', label: 'Solo', description: 'One seat for personal projects' },
    { value: 'team', label: 'Team', description: 'Up to 20 seats with collaborative workspaces' },
    { value: 'enterprise', label: 'Enterprise', description: 'Dedicated support and custom SLAs' }
  ]}
/>`,
	demoCode: `<script lang="ts">
  import { RadioGroup } from '$lib/components/radio-group';

  let plan = $state('solo');
<\/script>

<div class="demo-radio-group-container">
  <RadioGroup
    label="Plan"
    name="plan"
    bind:value={plan}
    options={[
      { value: 'solo', label: 'Solo', description: 'One seat for personal projects' },
      { value: 'team', label: 'Team', description: 'Up to 20 seats with collaborative workspaces' },
      { value: 'enterprise', label: 'Enterprise', description: 'Dedicated support and custom SLAs' }
    ]}
  />
</div>`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: `<RadioGroup
      label="Plan"
      name="plan"
      value={plan}
      onValueChange={setPlan}
      options={[
        { value: "solo", label: "Solo", description: "One seat" },
        { value: "team", label: "Team", description: "Up to 20 seats" },
      ]}
    />`
		}
	],
	api: [
  {
    "name": "label",
    "type": "string",
    "default": "–",
    "description": "(Required) Rendered as the fieldset legend."
  },
  {
    "name": "options",
    "type": "{ value: string; label: string; description?: string }[]",
    "default": "–",
    "description": "(Required) Rows in order, each with optional secondary copy."
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
    "description": "(Required) Called with the chosen value."
  },
  {
    "name": "name",
    "type": "string",
    "default": "–",
    "description": "Native radio name for form submission. Generated when omitted."
  }
],
	keyboard: [
  {
    "key": "Arrow keys",
    "action": "Move the selection between options (native radio behavior)."
  },
  {
    "key": "Tab",
    "action": "Enters and leaves the group at the selected option."
  }
],
	accessibility: ["Uses a fieldset and legend with native radio inputs wrapped in labels.","The highlight and dot are aria-hidden decoration."],
	motion: "- One highlight glides to the chosen row on the morph spring while the new dot springs in and the old one shrinks away. - Reduced motion places the highlight and dot instantly; resizes never animate.",
	notes: "Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["Use for two to six mutually exclusive options that need descriptions. Use segmented-control for short inline choices and select for longer lists.","Always controlled: value and onValueChange are required. Pass name to submit with a form."],
	related: [{"name":"Segmented control","slug":"segmented-control","description":"Switch between a small set of related views."},{"name":"Select","slug":"select","description":"A compact choice field with a keyboard friendly menu."},{"name":"Checkbox","slug":"checkbox","description":"A binary choice with a precise, legible state."}],
	source: 'registry/components/radio-group/radio-group.tsx'
};

export default doc;
