import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Progress",
	tagline: "Show how much of a known task is complete.",
	description: "Show how much of a known task is complete.",
	group: 'progress',
	status: 'ported',
	whenToUse: ["Determinate progress for uploads, imports, or long tasks.","Progress with a visible percentage and a check at completion, via showValue."],
	whenNotToUse: ["Use skeleton while content is loading with no progress to report.","Use usage-meter for quota against a limit, and gauge for dashboard metrics.","Use stepper to show position in a multi-step flow."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/progress',
		manual: {
			dependencies: ["@lucide/svelte"],
			steps: [
				'Copy progress files into src/lib/components/progress/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import Progress from $lib/components/progress'
			]
		}
	},
	usage: `<script lang="ts">
  import { Progress } from '$lib/components/progress';
<\/script>

<Progress label="Uploading report.pdf" value={sent} max={size} showValue />`,
	demoCode: `<script lang="ts">
  import { Progress } from '$lib/components/progress';

  let value = $state(45);
<\/script>

<Progress label="System Build Artifacts" {value} max={100} showValue />
<Progress label="Asset Pipeline Compression" value={72} showValue />
<Progress label="Deploy Deployment Complete" value={100} showValue />
<Progress label="Indexing, no percentage" value={25} />`,
	variants: [
		{
			name: 'With percentage',
			description: 'showValue counts the clamped percentage and mounts a check at 100%.',
			code: `<Progress label="Uploading report.pdf" value={sent} max={size} showValue />`
		},
		{
			name: 'Label only',
			description: 'Without showValue the track still reports aria-valuenow. The fill turns success at 100%.',
			code: `<Progress label="Indexing" value={25} />`
		}
	],
	api: [
  {
    "name": "value",
    "type": "number",
    "default": "0",
    "description": "Current value, clamped between 0 and max."
  },
  {
    "name": "max",
    "type": "number",
    "default": "100",
    "description": "Value that counts as complete."
  },
  {
    "name": "label",
    "type": "string",
    "default": "–",
    "description": "Visible label and aria-label. Falls back to \\\"Progress\\\" for assistive tech."
  },
  {
    "name": "showValue",
    "type": "boolean",
    "default": "false",
    "description": "Shows the counted percentage and a check at 100%."
  },
  {
    "name": "...props",
    "type": "Omit<HTMLAttributes<HTMLDivElement>, \"children\">",
    "default": "–",
    "description": "Forwarded to the progressbar element, such as className."
  }
],
	keyboard: [
		{ key: 'None', action: 'The progressbar reports a value. It does not take keyboard input.' }
	],
	accessibility: ["Renders role=\"progressbar\" with aria-valuemin, aria-valuemax, aria-valuenow, and a percentage aria-valuetext.","Phase 1 shows a single label. Phase 2 crossfades label changes and marks the outgoing copy aria-hidden.","It is not a live region; announce completion separately if it matters.","The check icon is aria-hidden."],
	motion: "Phase 1 jumps the fill with translateX to the clamped percentage and shows the check only at 100% when showValue is set. The success colour is the verbatim data-complete rule. Phase 2 shares one spring across the fill and the counted number, crossfades the label, and springs the check in. Reduced motion is the Phase 1 jump.",
	notes: "No Bits UI primitive. The check icon is @lucide/svelte. ARC .module.css is copied verbatim, including the reserved 100% width on the count.",
	notesForAi: ["Use for determinate task progress. Use skeleton while content has no progress to report, gauge or activity-rings for dashboard metrics, and usage-meter for quota against a limit.","Pass raw value and max; the percentage is computed and clamped for you."],
	related: [{"name":"Usage meter","slug":"usage-meter","description":"Show what fills an allowance and how close it is to the limit."},{"name":"Skeleton","slug":"skeleton","description":"Reserve space while content is still loading."},{"name":"Gauge","slug":"gauge","description":"Show a value against a known range."},{"name":"Stepper","slug":"stepper","description":"Show where a person is in a multi-step flow and what is done."}],
	source: 'registry/components/progress/progress.tsx'
};

export default doc;
