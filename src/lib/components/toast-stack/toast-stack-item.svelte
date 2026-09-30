<script lang="ts">
	import { untrack } from 'svelte';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import CircleX from '@lucide/svelte/icons/circle-x';
	import Info from '@lucide/svelte/icons/info';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import X from '@lucide/svelte/icons/x';
	import styles from './toast-stack.module.css';
	import { BORDER, type ToastStackStore } from './toast-stack-store.svelte';
	import type { ToastRecord, ToastTarget } from './toast-stack.types';

	interface ItemProps {
		toast: ToastRecord;
		target: ToastTarget;
		expanded: boolean;
		front: boolean;
		hidden: boolean;
		paused: boolean;
		store: ToastStackStore;
		onMeasure: (id: string, height: number) => void;
		onBeforeDismiss: (id: string, keyboard: boolean) => void;
		onTap: () => void;
	}

	let {
		toast,
		target,
		expanded,
		front,
		hidden,
		paused,
		store,
		onMeasure,
		onBeforeDismiss,
		onTap
	}: ItemProps = $props();

	const id = $derived(toast.id);

	let closeRef = $state<HTMLButtonElement | null>(null);
	let contentH = $state(0);
	let pointerType = $state('mouse');

	const typeLabels: Record<ToastRecord['type'], string> = {
		success: 'Success',
		info: 'Info',
		warning: 'Warning',
		error: 'Error',
		loading: 'In progress'
	};

	// Measure before paint, so each toast takes exactly its own height.
	// `bind:offsetHeight` is the Svelte counterpart of ARC's ResizeObserver.
	$effect(() => {
		onMeasure(id, contentH + BORDER);
	});

	// An update restarts the clock; pausing keeps whatever time is left.
	// ARC snapshots the duration with useState; untrack marks the same intent.
	let remaining = $state(untrack(() => toast.duration));
	$effect(() => {
		void toast.version;
		remaining = toast.duration;
	});
	$effect(() => {
		if (paused) return;
		const budget = remaining;
		if (!Number.isFinite(budget) || budget <= 0) return;
		const started = performance.now();
		const timer = window.setTimeout(() => store.dismiss(id), Math.max(budget, 0));
		return () => {
			window.clearTimeout(timer);
			remaining = Math.max(budget - (performance.now() - started), 0);
		};
	});

	function focusVisible(element: Element): boolean {
		try {
			return element.matches(':focus-visible');
		} catch {
			return true;
		}
	}

	function dismissSelf(keyboard: boolean) {
		onBeforeDismiss(id, keyboard);
		store.dismiss(id);
	}

	// An action that updates its toast usually folds itself away; keyboard focus
	// lands on the close button instead of the page.
	function runAction(event: MouseEvent) {
		const keyboard = focusVisible(event.currentTarget as Element);
		store.runAction(id);
		if (keyboard && !store.getSnapshot().find((item) => item.id === id)?.action) {
			closeRef?.focus();
		}
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key !== 'Escape') return;
		event.stopPropagation();
		dismissSelf(focusVisible(event.currentTarget as Element));
	}

	function onCardClick(event: MouseEvent) {
		if ((event.target as Element).closest('button, a')) return;
		// Touch has no hover, so a tap on the card opens or closes the stack instead.
		if (pointerType !== 'mouse') onTap();
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions: ARC-parity — Escape dismisses from anywhere in the item; every action stays keyboard-reachable through the action/close buttons. -->
<li
	class={styles.item}
	data-front={front}
	data-expanded={expanded}
	data-toast-id={id}
	inert={hidden}
	onkeydown={onKeyDown}
	style={target.height > 0
		? `transform: translateY(${target.y}px) scale(${target.scale}); height: ${target.height}px; opacity: ${target.opacity}; z-index: ${toast.seq};`
		: `opacity: 0; z-index: ${toast.seq};`}
>
	<!-- svelte-ignore a11y_click_events_have_key_events: card tap is a touch affordance that toggles the hover-less stack; keyboard users get Alt+T, focus expansion and the Escape/button paths. -->
	<div
		class={styles.card}
		role="status"
		aria-live="polite"
		aria-atomic="true"
		onpointerdown={(event) => {
			pointerType = event.pointerType;
		}}
		onclick={onCardClick}
	>
		<div
			class={styles.content}
			bind:offsetHeight={contentH}
			style={target.content === 1 ? '' : 'opacity: 0;'}
		>
			<span class={styles.icon} data-type={toast.type} aria-hidden="true">
				<span class={styles.glyph}>
					{#if toast.type === 'success'}
						<CircleCheck size={18} strokeWidth={1.75} />
					{:else if toast.type === 'info'}
						<Info size={18} strokeWidth={1.75} />
					{:else if toast.type === 'warning'}
						<TriangleAlert size={18} strokeWidth={1.75} />
					{:else if toast.type === 'error'}
						<CircleX size={18} strokeWidth={1.75} />
					{:else}
						<span class={styles.spinner}></span>
					{/if}
				</span>
			</span>
			<div class={styles.copy}>
				<span class={styles.srOnly}>{typeLabels[toast.type]}: </span>
				<span class={styles.title}><span class={styles.line}>{toast.title}</span></span>
				{#if toast.description}
					<span class={styles.description}>{toast.description}</span>
				{/if}
			</div>
			{#if toast.action}
				<div class={styles.actionSlot}>
					<button type="button" class={styles.action} onclick={runAction}>
						{toast.action.label}
					</button>
				</div>
			{/if}
			<button
				bind:this={closeRef}
				type="button"
				class={styles.close}
				aria-label="Dismiss notification"
				onclick={(event) => dismissSelf(focusVisible(event.currentTarget))}
			>
				<X size={16} strokeWidth={1.75} aria-hidden="true" />
			</button>
		</div>
	</div>
</li>
