import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Slider",
	tagline: "Pick a value or a range on a track that follows your finger.",
	description: "Pick a value or a range on a track that follows your finger.",
	group: 'sliders',
	status: 'ported',
	whenToUse: ["Approximate values like volume, opacity, or a price range.","Ranges with two thumbs, labelled marks, and a formatted readout."],
	whenNotToUse: ["Use number-field when the exact number matters.","Use progress to show a value people cannot change."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/slider',
		manual: {
			dependencies: [],
			steps: [
				'Copy slider files into src/lib/components/slider/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import Slider from $lib/components/slider'
			]
		}
	},
	usage: `<script lang="ts">
  import { Slider } from '$lib/components/slider';

  let volume = $state(40);
<\/script>

<Slider label="Volume" bind:value={volume} />`,
	demoCode: `<script lang="ts">
  import { Slider } from '$lib/components/slider';

  let brightness = $state(65);
  let budget = $state<[number, number]>([25, 75]);
<\/script>

<Slider label="Brightness" bind:value={brightness} format={(v) => \`\${v}%\`} />
<Slider label="Budget" bind:value={budget} step={5} format={(v) => \`$\${v}\`} />
<Slider label="Size" step={25} defaultValue={50} marks={[{ value: 0, label: 'S' }, { value: 50, label: 'M' }, { value: 100, label: 'L' }]} />`,
	variants: [
		{
			name: 'Single value',
			description: 'Bind a number. Omit value and pass defaultValue for uncontrolled use.',
			code: `<Slider label="Volume" bind:value={volume} />`
		},
		{
			name: 'Range',
			description: 'Bind a [low, high] tuple to get two thumbs. minStepsBetweenThumbs keeps them apart.',
			code: `<Slider label="Budget" bind:value={range} step={5} minStepsBetweenThumbs={2} thumbLabels={['Minimum price', 'Maximum price']} />`
		},
		{
			name: 'Marks',
			description: 'A bare number draws a tick. A mark with a label prints under the track, and clicking it moves the nearest thumb there.',
			code: `<Slider label="Size" step={25} defaultValue={50} marks={[{ value: 0, label: 'S' }, 50, { value: 100, label: 'L' }]} />`
		},
		{
			name: 'Start and end snippets',
			description: 'Place content beside the track, such as an icon.',
			code: `<Slider label="Volume" bind:value={volume}>\n  {#snippet start()}<VolumeIcon />{/snippet}\n</Slider>`
		}
	],
	api: [
  {
    "name": "value",
    "type": "T extends number | [number, number]",
    "default": "–",
    "description": "Bindable. A number for one thumb, a tuple for a range. Leave unset for uncontrolled use."
  },
  {
    "name": "defaultValue",
    "type": "T",
    "default": "–",
    "description": "Initial value when uncontrolled. Its shape (number or tuple) decides single or range."
  },
  {
    "name": "marks",
    "type": "(number | { value: number; label?: string })[]",
    "default": "–",
    "description": "Ticks on the track. A labelled mark also prints under the track and is clickable."
  },
  {
    "name": "label",
    "type": "string",
    "default": "–",
    "description": "(Required) Visible label; names the thumbs unless thumbLabels is set."
  },
  {
    "name": "onValueChange",
    "type": "(value: T) => void",
    "default": "–",
    "description": "Called on every step while dragging or pressing keys."
  },
  {
    "name": "onValueCommit",
    "type": "(value: T) => void",
    "default": "–",
    "description": "Called once when a drag is released or a key changes the value."
  },
  {
    "name": "min",
    "type": "number",
    "default": "'0'",
    "description": "Lower bound."
  },
  {
    "name": "max",
    "type": "number",
    "default": "'100'",
    "description": "Upper bound."
  },
  {
    "name": "step",
    "type": "number",
    "default": "'1'",
    "description": "Increment."
  },
  {
    "name": "largeStep",
    "type": "number",
    "default": "'a tenth of the range'",
    "description": "Distance for PageUp, PageDown, and Shift with an arrow."
  },
  {
    "name": "minStepsBetweenThumbs",
    "type": "number",
    "default": "'0'",
    "description": "Closest two range thumbs may sit, in steps."
  },
  {
    "name": "format",
    "type": "(value: number) => string",
    "default": "–",
    "description": "Formats the readout, bubble, and spoken value."
  },
  {
    "name": "showValue",
    "type": "boolean",
    "default": "'true'",
    "description": "Show the readout beside the label."
  },
  {
    "name": "thumbLabels",
    "type": "[string, string]",
    "default": "–",
    "description": "Accessible names for the two range thumbs."
  },
  {
    "name": "start",
    "type": "Snippet",
    "default": "–",
    "description": "Content before the track, such as an icon."
  },
  {
    "name": "end",
    "type": "Snippet",
    "default": "–",
    "description": "Content after the track."
  },
  {
    "name": "name",
    "type": "string",
    "default": "–",
    "description": "Submits the value with a form, one hidden input per thumb."
  },
  {
    "name": "disabled",
    "type": "boolean",
    "default": "–",
    "description": "Disables dragging and keys."
  },
  {
    "name": "className",
    "type": "string",
    "default": "–",
    "description": "Added to the root."
  }
],
	keyboard: [
  {
    "key": "ArrowRight / ArrowUp",
    "action": "Increases by step."
  },
  {
    "key": "ArrowLeft / ArrowDown",
    "action": "Decreases by step."
  },
  {
    "key": "Shift + Arrow / PageUp / PageDown",
    "action": "Moves by largeStep."
  },
  {
    "key": "Home / End",
    "action": "Moves to the lowest or highest allowed value for that thumb."
  }
],
	accessibility: ["Each thumb is role=\"slider\" with aria-valuemin, aria-valuemax, aria-valuenow, aria-valuetext from format, and aria-orientation.","Thumbs are named by label, or by thumbLabels for ranges.","The readout, bubble, and marks are aria-hidden because the thumbs carry the value."],
	motion: "Phase 1 (current): the thumb, fill, and readout jump straight to the stepped value; the bubble appears and disappears without animation. Phase 2 (React behaviour): - Released drags carry a little momentum before snapping; the bubble springs up over an active thumb and digits roll in the readout. At a limit the thumb strains toward the key press and springs back. - Reduced motion removes momentum, the strain, and digit rolling, and turns off CSS transitions.",
	notes: "Hand-built pointer and keyboard mechanics in Svelte 5 runes; no Bits UI primitive is involved (ARC's slider was custom too). ARC .module.css supplies all styling verbatim.",
	notesForAi: ["Use for approximate values and ranges like volume, price filters, or opacity. Use number-field when the exact number matters.","Controlled or uncontrolled; pass a tuple for a range. Put heavy work such as fetching in onValueCommit, not onValueChange.","Pass name to submit through hidden inputs. Exported as a named export: import { Slider } from '$lib/components/slider'."],
	related: [{"name":"Number field","slug":"number-field","description":"Enter a bounded number with clear increment controls."},{"name":"Progress","slug":"progress","description":"Show how much of a known task is complete."},{"name":"Filter toolbar","slug":"filter-toolbar","description":"Keep collection filters close and easy to reset."}],
	source: 'registry/components/slider/slider.tsx'
};

export default doc;
