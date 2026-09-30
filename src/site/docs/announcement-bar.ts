import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Announcement Bar',
	description: 'A top banner that rotates messages, counts down, and collapses smoothly when dismissed.',
	tagline: 'One slim line for what everyone should see.',
	group: 'messages',
	status: 'ported',
	whenToUse: [
		'For a site-wide note at the top of the page: launches, sales, maintenance.',
		'When several messages should rotate on one clock with pause on hover.',
		'When a message carries a call to action or a live countdown.'
	],
	whenNotToUse: [
		'For transient results of an action — use toast or toast-stack.',
		'For persistent, in-flow messages tied to a form — use alert.',
		'When people must respond before continuing — use dialog.'
	],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy announcement-bar.svelte, announcement-bar.types.ts and announcement-bar.module.css into src/lib/components/announcement-bar/.',
				"Import AnnouncementBar from '$lib/components/announcement-bar/announcement-bar.svelte'."
			]
		}
	},
	usage: `<script lang="ts">
	import AnnouncementBar from '$lib/components/announcement-bar/announcement-bar.svelte';

	const messages = [
		{
			id: 'launch',
			message: 'Aurora is live — see what is new.',
			action: { label: 'Read the notes', href: '/changelog' }
		}
	];
</script>

<AnnouncementBar {messages} id="launch-2026" controls />`,
	demoCode: `<script lang="ts">
	import AnnouncementBar from '$lib/components/announcement-bar/announcement-bar.svelte';
</script>

<AnnouncementBar
	messages={[{ id: 'sale', message: 'Spring sale ends soon.' }]}
	controls
/>`,
	variants: [
		{
			name: 'Rotating with controls',
			description: 'Previous, next and pause buttons across several messages.',
			code: `<AnnouncementBar {messages} controls />`
		},
		{
			name: 'Countdown',
			description: 'A live countdown beside the message, with onCountdownEnd.',
			code: `<AnnouncementBar messages={[{ id: 'sale', message: 'Sale ends in', countdown: { to: deadline, label: 'Ends in' } }]} />`
		},
		{
			name: 'Inverted tone',
			description: 'Light-on-dark bar for high-contrast moments.',
			code: `<AnnouncementBar {messages} tone="inverted" />`
		}
	],
	api: [
		{ name: 'messages', type: 'Announcement[]', description: 'The rotating messages. Each has an id, a message (string or Snippet), an optional action and an optional countdown.' },
		{ name: 'id', type: 'string', default: '—', description: 'Remembers dismissal under this id. Change the id to show a new campaign to everyone again.' },
		{ name: 'open', type: 'boolean', default: '—', description: 'Whether the bar is shown. Leave it out to let the component manage it.' },
		{ name: 'defaultOpen', type: 'boolean', default: 'true', description: 'Initial visibility when uncontrolled.' },
		{ name: 'onOpenChange', type: '(open: boolean) => void', default: '—', description: 'Fired with false on dismiss.' },
		{ name: 'index', type: 'number', default: '—', description: 'Index of the visible message. Leave it out for internal rotation.' },
		{ name: 'defaultIndex', type: 'number', default: '0', description: 'Initial message when uncontrolled.' },
		{ name: 'onIndexChange', type: '(index: number) => void', default: '—', description: 'Fired when rotation advances or the visitor steps.' },
		{ name: 'interval', type: 'number', default: '6000', description: 'Milliseconds each message stays before the next one.' },
		{ name: 'autoPlay', type: 'boolean', default: 'true', description: 'Rotate automatically. Pauses on hover, focus, or a hidden tab; off under reduced motion.' },
		{ name: 'controls', type: 'boolean', default: 'false', description: 'Show previous, next, and pause controls when there are several messages.' },
		{ name: 'dismissible', type: 'boolean', default: 'true', description: 'Show the dismiss button.' },
		{ name: 'tone', type: "'neutral' | 'inverted'", default: "'neutral'", description: 'Colour story of the bar.' },
		{ name: 'onAction', type: '(announcement) => void', default: '—', description: 'Fired after a message action, with the announcement.' },
		{ name: 'onCountdownEnd', type: '(announcement) => void', default: '—', description: 'Fired once when a countdown reaches zero.' },
		{ name: 'label', type: 'string', default: "'Announcements'", description: 'Accessible name of the region.' },
		{ name: 'class', type: 'string', default: '—', description: 'Additional classes merged with the collapse class.' },
		{ name: 'ref', type: 'HTMLElement | null', default: '—', description: 'Bindable reference to the outer section.' }
	],
	keyboard: [
		{ key: 'Tab', action: 'Move between the message action and the controls.' },
		{ key: 'Enter / Space', action: 'Step, pause, or dismiss from the control buttons.' }
	],
	accessibility: [
		'The bar is a labelled region; with several messages it is a carousel of labelled slides.',
		'The live countdown is role="timer" with aria-live="off" and a spoken hours/minutes label.',
		'Rotation pauses on hover, focus, or a hidden tab so no message changes under the reader.'
	],
	motion: 'Phase 1 still-state: no animation. Faces swap instantly, the viewport snaps to the face height, countdown digits swap instantly, and dismissal closes at once. Phase 2 wires the rise/blur face swap, the height spring, the digit roll, the pause-ring sweep and the collapse.',
	notes: 'There is no bits-ui primitive here; this is plain DOM carrying the source carousel roles/aria. Message bodies accept a string or a Snippet. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Pass an id to remember dismissal in localStorage; clearAnnouncementDismissal(id) forgets it.',
		'Rotation pauses itself on hover, focus, hidden tabs and reduced motion — no extra wiring needed.'
	],
	related: [
		{ name: 'Toast', slug: 'toast', description: 'Brief confirmation for a completed background action.' },
		{ name: 'Alert', slug: 'alert', description: 'A persistent message that helps people recover or continue.' },
		{ name: 'Toast Stack', slug: 'toast-stack', description: 'Stack short results at the edge until you reach for them.' }
	],
	source: 'registry/components/announcement-bar/announcement-bar.tsx'
};

export default doc;
