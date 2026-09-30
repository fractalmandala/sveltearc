import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Alert",
	tagline: "A persistent message that helps people recover or continue.",
	description: "A persistent message that helps people recover or continue.",
	group: 'messages',
	status: 'ported',
	whenToUse: ["Persistent, in-flow messages about a page or form, such as an expiring card.","Status that changes over time, where one alert should morph between tones.","Dismissible notices that should collapse and close the gap below them."],
	whenNotToUse: ["Use toast or toast-stack for transient results of an action.","Use empty-state when there is no content to show.","Use dialog when people must respond before continuing."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/alert',
		manual: {
			dependencies: ["bits-ui","@lucide/svelte"],
			steps: [
				'Copy alert files into src/lib/components/alert/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import Alert from $lib/components/alert'
			]
		}
	},
	usage: `<script lang="ts">
  import { Alert } from '$lib/components/alert';
<\/script>

<Alert tone="warning" title="Card expires soon" ondismiss={() => track("dismissed")}>
      Update your payment method before March 1 to avoid interruption.
    </Alert>`,
	demoCode: `<script lang="ts">
  import { Alert } from '$lib/components/alert';
<\/script>

<div class="demo-alert-container">
  <Alert tone="warning" title="Card expires soon" ondismiss={() => track("dismissed")}>
      Update your payment method before March 1 to avoid interruption.
    </Alert>
</div>`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: `<Alert tone="warning" title="Card expires soon" ondismiss={() => track("dismissed")}>
      Update your payment method before March 1 to avoid interruption.
    </Alert>`
		}
	],
	api: [
  {
    "name": "title",
    "type": "string",
    "default": "–",
    "description": "(Required) Headline. A new title rises in over the old one."
  },
  {
    "name": "children",
    "type": "Snippet",
    "default": "–",
    "description": "Details under the title. String children crossfade when they change."
  },
  {
    "name": "open",
    "type": "boolean",
    "default": "–",
    "description": "Controls presence. Hiding collapses the height and fades it out."
  },
  {
    "name": "onDismiss",
    "type": "() => void",
    "default": "–",
    "description": "Shows a dismiss button. Uncontrolled alerts collapse first, then call this."
  },
  {
    "name": "...props",
    "type": "HTMLAttributes<HTMLDivElement>",
    "default": "–",
    "description": "Forwarded to the alert element, such as className and id."
  }
],
	keyboard: [
  {
    "key": "Enter / Space",
    "action": "Activates the dismiss button when present."
  }
],
	accessibility: ["Danger alerts use role=\"alert\" and interrupt; other tones use role=\"status\" and announce politely.","Outgoing copies are aria-hidden while they fade, so the live region reads only the current text.","The dismiss button is labelled \"Dismiss: <title>\"; the tone icon is aria-hidden."],
	motion: "- Presence collapses or expands the height on a smooth spring with a fade, so content below closes the gap. - Tone changes morph the icon through a small scale and blur; copy changes rise in while the height springs to fit. - Reduced motion swaps content with short fades and no height animation.",
	notes: "Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["Use for persistent, in-flow messages tied to a page or form. Use toast or toast-stack for transient results of an action.","Keep one Alert mounted and change tone, title, and children to morph between states instead of swapping components."],
	related: [{"name":"Toast","slug":"toast","description":"Brief confirmation for a completed background action."},{"name":"Toast stack","slug":"toast-stack","description":"Stack short results at the edge until you reach for them."},{"name":"Empty state","slug":"empty-state","description":"A useful next step when there is nothing to show yet."}],
	source: 'registry/components/alert/alert.tsx'
};

export default doc;
