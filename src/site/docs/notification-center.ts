import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Notification Center',
	description: 'A bell-anchored panel that lists updates, with unread counts, an all/unread filter and per-row actions.',
	tagline: 'Every update in one calm, anchored surface.',
	group: 'messages',
	status: 'ported',
	whenToUse: [
		'When the product produces asynchronous updates the user should be able to catch up on.',
		'When updates need triage: mark read, mark all read, dismiss, clear read.',
		'When the count matters — the badge and the panel share one source of truth.'
	],
	whenNotToUse: [
		'For a single, time-critical alert — use a toast or an inline banner.',
		'For actions that must block — use a dialog.',
		'When there is nothing to accumulate — a static list is simpler.'
	],
	install: {
		cli: 'npx shadcn-svelte@latest add @arcui/notification-center',
		manual: {
			dependencies: ['bits-ui', '@lucide/svelte'],
			steps: [
				'Copy notification-center.svelte, notification-center.types.ts and notification-center.module.css into src/lib/components/notification-center/.',
				'This block depends on src/lib/components/avatar/avatar.svelte — port that too.'
			]
		}
	},
	usage: `<script lang="ts">
  import NotificationCenter from '$lib/components/notification-center/notification-center.svelte';

  const items = [
    { id: '1', title: 'New comment', description: 'Ada replied.', time: '2m', tone: 'info' },
    { id: '2', title: 'Deploy finished', time: '1h', tone: 'success', read: true }
  ];
</script>

<NotificationCenter notifications={items} />`,
	demoCode: `<script lang="ts">
  import NotificationCenter from '$lib/components/notification-center/notification-center.svelte';
  import type { NotificationItem } from '$lib/components/notification-center/notification-center.types';

  const items: NotificationItem[] = [
    { id: '1', title: 'New comment', description: 'Ada replied to your thread.', time: '2m', tone: 'info' },
    { id: '2', title: 'Deploy finished', description: 'Production is healthy.', time: '1h', tone: 'success', read: true },
    { id: '3', title: 'Storage almost full', description: 'You have used 92% of your quota.', time: '3h', tone: 'warning' }
  ];
</script>

<div class="demo-grid">
  <NotificationCenter notifications={items} />
  <p class="demo-note">Open the bell, then expand a row to mark it read or dismiss it.</p>
</div>`,
	variants: [
		{
			name: 'Default with Status Tones',
			description: 'Includes unread items with info, success, and warning tones.',
			code: `<NotificationCenter notifications={items} />`
		},
		{
			name: 'With Avatar Actor',
			description: 'Shows user portrait avatar instead of generic status icon.',
			code: `<NotificationCenter
  notifications={[
    { id: '1', title: 'Ana commented', time: '1h', actor: { name: 'Ana', photo: '/ana.jpg' } }
  ]}
/>`
		},
		{
			name: 'Controlled Open State',
			description: 'Synchronizes panel visibility externally via open and onOpenChange.',
			code: `<NotificationCenter open={panelOpen} onOpenChange={(o) => panelOpen = o} {notifications} />`
		}
	],
	api: [
		{ name: 'notifications', type: 'NotificationItem[]', description: 'The update list. Captured once (ARC uses useState(initial)).' },
		{ name: 'label', type: 'string', default: "'Notifications'", description: 'Panel and trigger label.' },
		{ name: 'onReadChange', type: '(item, read) => void', description: 'Fired when a row is marked read or unread.' },
		{ name: 'onDismiss', type: '(item) => void', description: 'Fired when a row is dismissed or cleared.' },
		{ name: 'open', type: 'boolean', description: 'Controlled open state; omit for uncontrolled.' },
		{ name: 'onOpenChange', type: '(open: boolean) => void', description: 'Open-state callback.' },
		{ name: 'avoidCollisions', type: 'boolean', default: 'true', description: 'Let the panel flip to stay in view.' }
	],
	keyboard: [
		{ key: 'Enter / Space', action: 'Open or close the panel from the trigger.' },
		{ key: 'Escape', action: 'Close the panel.' },
		{ key: 'Tab', action: 'Move between the view switch, mark-all, rows and footer actions.' }
	],
	accessibility: [
		'The trigger is a labelled button whose aria-label includes the unread count.',
		'Unread state is conveyed by a dot plus the row label (", unread"), not colour alone.',
		'The summary line is aria-live="polite" so the count is announced when it changes.',
		'Rows are role="listitem" inside a labelled role="list".'
	],
	motion: 'Phase 1 still-state: no animation. Phase 2 wires the badge pop, the odometer count, the view-highlight layoutId slide, the row cascade (--index), the height-morphing rows and the panel enter/exit.',
	notes: 'ARC ships this as a block built on Popover. Accessibility and focus are owned by Bits UI; the port keeps ARC’s own roving-focus behaviour after read/dismiss.',
	notesForAi: [
		'`notifications` is captured on mount — later prop changes are ignored, matching ARC.',
		'Do not add colour-only unread signalling; keep the dot and the aria-label.',
		'Avatar rows require the avatar component; the tone icons are Lucide.'
	],
	related: [
		{ name: 'Popover', slug: 'popover', description: 'The primitive this block composes.' },
		{ name: 'Avatar', slug: 'avatar', description: 'Used for person-generated updates.' },
		{ name: 'Switch', slug: 'switch', description: 'A control often paired with notification settings.' }
	],
	source: 'registry/components/notification-center/notification-center.tsx'
};

export default doc;
