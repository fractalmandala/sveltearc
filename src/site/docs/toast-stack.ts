import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Toast Stack',
	description: 'Stack short results at the edge until you reach for them.',
	tagline: 'Every result in one calm, stacked corner.',
	group: 'messages',
	status: 'ported',
	whenToUse: [
		'For short, non-blocking results of what someone just did.',
		'When several results can arrive at once and must queue.',
		'When a result needs an action (Undo) or a type morph (loading into success).'
	],
	whenNotToUse: [
		'For a single one-off confirmation — use toast.',
		'For persistent, in-flow messages — use alert.',
		'When people must respond before continuing — use dialog.'
	],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy toast-stack.svelte, toast-stack-item.svelte, toast-stack-provider.svelte, toast-stack-store.svelte.ts, toast-stack.types.ts and toast-stack.module.css into src/lib/components/toast-stack/.',
				"Import ToastStackProvider and ToastStack from '$lib/components/toast-stack/'.",
				'Render the provider once, the viewport once inside it, and call useToastStack() from any component below.'
			]
		}
	},
	usage: `<script lang="ts">
	import ToastStackProvider from '$lib/components/toast-stack/toast-stack-provider.svelte';
	import ToastStack from '$lib/components/toast-stack/toast-stack.svelte';
	import { useToastStack } from '$lib/components/toast-stack/toast-stack-store.svelte';

	function save() {
		const { toast, update } = useToastStack();
		const id = toast({ type: 'loading', title: 'Saving…' });
		persist().then(() => update(id, { type: 'success', title: 'Saved' }));
	}
</script>

<ToastStackProvider>
	<button onclick={save}>Save</button>
	<ToastStack />
</ToastStackProvider>`,
	demoCode: `<script lang="ts">
	import ToastStackProvider from '$lib/components/toast-stack/toast-stack-provider.svelte';
	import ToastStack from '$lib/components/toast-stack/toast-stack.svelte';
	import { ToastStackStore } from '$lib/components/toast-stack/toast-stack-store.svelte';

	const store = new ToastStackStore();
</script>

<ToastStackProvider {store}>
	<button onclick={() => store.toast({ title: 'Saved' })}>Save</button>
	<ToastStack />
</ToastStackProvider>`,
	variants: [
		{
			name: 'Types',
			description: 'Success, info, warning, error and loading toasts.',
			code: `<button onclick={() => store.toast({ type: 'success', title: 'Deployed' })}>Ship</button>
<button onclick={() => store.toast({ type: 'error', title: 'Build failed', description: 'See the log.' })}>Fail</button>`
		},
		{
			name: 'With action',
			description: 'An Undo action that morphs the toast on click.',
			code: `<button onclick={() => store.toast({ title: 'Deleted', action: { label: 'Undo', onClick: (id) => restore(id) } })}>Delete</button>`
		},
		{
			name: 'Update in place',
			description: 'A loading toast that morphs into its result under a stable id.',
			code: `<button onclick={() => { const id = store.toast({ id: 'save', type: 'loading', title: 'Saving…' }); finish().then(() => store.update(id, { type: 'success', title: 'Saved' })); }}>Save</button>`
		}
	],
	api: [
		{ name: 'children', type: 'Snippet', description: 'Provider: the subtree the toast queue is scoped to.' },
		{ name: 'duration', type: 'number', default: '5000', description: 'Provider: base lifetime in milliseconds. Warnings and errors stay 1.6 times longer.' },
		{ name: 'limit', type: 'number', default: '12', description: 'Provider: oldest toasts beyond this count are dropped from the queue.' },
		{ name: 'label', type: 'string', default: "'Notifications'", description: 'Viewport: accessible name of the notification region.' },
		{ name: 'position', type: "'bottom-right' | 'bottom-center' | 'bottom-left'", default: "'bottom-right'", description: 'Viewport: which bottom corner (or center) the stack anchors to.' },
		{ name: 'contained', type: 'boolean', default: 'false', description: 'Viewport: pin the stack inside the nearest positioned ancestor instead of the window.' },
		{ name: 'visibleToasts', type: 'number', default: '3', description: 'Viewport: how many toasts show at once. Older ones wait behind.' },
		{ name: 'hotkey', type: 'boolean', default: 'true', description: 'Viewport: Alt+T moves focus into the stack.' },
		{ name: 'class', type: 'string', default: '—', description: 'Viewport: additional classes merged with the viewport class.' },
		{ name: 'toast', type: '(options: ToastOptions) => string', description: 'API: shows a toast and returns its id. Reuse an id to update in place.' },
		{ name: 'update', type: '(id, patch) => void', description: 'API: morphs a toast in place and restarts its timer.' },
		{ name: 'dismiss', type: '(id?) => void', description: 'API: dismisses one toast, or every toast when called without an id.' }
	],
	keyboard: [
		{ key: 'Alt+T', action: 'Move focus into the stack.' },
		{ key: 'Escape', action: 'Dismiss the focused toast.' },
		{ key: 'Enter / Space', action: 'Run the toast action or dismiss from its buttons.' }
	],
	accessibility: [
		'The region is aria-live="polite" with aria-relevant="additions text"; each card is role="status".',
		'The type is announced as a screen-reader prefix ("Success: …"), not colour alone.',
		'Toasts beyond the visible count are inert; keyboard dismissal hands focus to the next toast.'
	],
	motion: 'Phase 1 still-state: no animation. layoutStack() geometry is applied statically; toasts appear, fan out on hover/focus/tap, and dismiss instantly. Phase 2 wires the enter rise, the stack springs, the icon/text/action swaps and the swipe-to-dismiss.',
	notes: 'There is no bits-ui Toast primitive, so this is plain DOM carrying the source live-region roles/aria. React context + useSyncExternalStore became a $state-backed ToastStackStore with Svelte context. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Render ToastStackProvider once and ToastStack once inside it; call useToastStack() below the provider.',
		'Reuse a toast id to morph it in place instead of stacking a new one.'
	],
	related: [
		{ name: 'Toast', slug: 'toast', description: 'Brief confirmation for a completed background action.' },
		{ name: 'Alert', slug: 'alert', description: 'A persistent message that helps people recover or continue.' },
		{ name: 'Notification Center', slug: 'notification-center', description: 'A bell-anchored panel that lists updates.' }
	],
	source: 'registry/components/toast-stack/toast-stack.tsx'
};

export default doc;
