import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Toast',
	description: 'Brief confirmation for a completed background action.',
	tagline: 'A short, polite word that dismisses itself.',
	group: 'messages',
	status: 'ported',
	whenToUse: [
		'For short, non-blocking results of what someone just did.',
		'When the message needs no action and can dismiss itself.',
		'When one confirmation at a time is enough — otherwise use toast-stack.'
	],
	whenNotToUse: [
		'For stacked or queued results — use toast-stack.',
		'For persistent, in-flow messages — use alert.',
		'When people must respond before continuing — use dialog.'
	],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy toast.svelte, toast.types.ts and toast.module.css into src/lib/components/toast/.',
				"Import Toast from '$lib/components/toast/toast.svelte'."
			]
		}
	},
	usage: `<script lang="ts">
	import Toast from '$lib/components/toast/toast.svelte';

	let open = $state(true);
</script>

<Toast
	title="Changes saved"
	description="Your workspace is up to date."
	bind:open={open}
	onOpenChange={(o) => (open = o)}
/>`,
	demoCode: `<script lang="ts">
	import Toast from '$lib/components/toast/toast.svelte';
</script>

<Toast title="Changes saved" description="Your workspace is up to date." />`,
	variants: [
		{
			name: 'With description',
			description: 'Headline plus details under the title.',
			code: `<Toast title="Changes saved" description="Your workspace is up to date." />`
		},
		{
			name: 'Title only',
			description: 'A bare confirmation with no description row.',
			code: `<Toast title="Copied to clipboard" />`
		},
		{
			name: 'Controlled',
			description: 'Visibility driven by open and onOpenChange.',
			code: `<Toast title="Changes saved" {open} onOpenChange={(o) => (open = o)} />`
		}
	],
	api: [
		{ name: 'title', type: 'string', description: 'Headline of the toast.' },
		{ name: 'description', type: 'string', default: '—', description: 'Optional details rendered under the title.' },
		{ name: 'open', type: 'boolean', default: 'true', description: 'Controls visibility. Flipping back to true resets the dismissed state.' },
		{ name: 'onOpenChange', type: '(open: boolean) => void', default: '—', description: 'Fired with false when the toast dismisses (timer or close button).' },
		{ name: 'duration', type: 'number', default: '4500', description: 'Milliseconds before the toast closes itself. <= 0 disables the timer.' },
		{ name: 'class', type: 'string', default: '—', description: 'Additional classes merged with the toast class.' }
	],
	keyboard: [
		{ key: 'Tab', action: 'Move focus to the dismiss button.' },
		{ key: 'Enter / Space', action: 'Dismiss the toast from the close button.' }
	],
	accessibility: [
		'The toast is role="status" with aria-live="polite" and aria-atomic="true".',
		'The tone icon is aria-hidden; the close button is labelled "Dismiss notification".'
	],
	motion: 'Phase 1 still-state: no animation. The toast renders its shown end-state and unmounts instantly on dismiss. Phase 2 wires the enter rise, the exit sink-or-throw, the check draw-in, the copy cross-fade and the drag-to-dismiss.',
	notes: 'There is no bits-ui Toast primitive, so this is plain DOM carrying the source roles/aria. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Single-shot only — for queued results use toast-stack.',
		'Keep one Toast mounted and change title/description to morph between states instead of swapping components.'
	],
	related: [
		{ name: 'Toast stack', slug: 'toast-stack', description: 'Stack short results at the edge until you reach for them.' },
		{ name: 'Alert', slug: 'alert', description: 'A persistent message that helps people recover or continue.' },
		{ name: 'Announcement bar', slug: 'announcement-bar', description: 'A top banner that rotates messages and collapses when dismissed.' }
	],
	source: 'registry/components/toast/toast.tsx'
};

export default doc;
