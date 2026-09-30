<script lang="ts">
	import { untrack } from 'svelte';
	import X from '@lucide/svelte/icons/x';
	import styles from './toast.module.css';
	import type { Props } from './toast.types';

	let {
		title,
		description,
		open = true,
		onOpenChange,
		duration = 4500,
		class: className = '',
		...restProps
	}: Props = $props();

	const uid = $props.id();

	let dismissed = $state(false);
	// ARC snapshots `open` with useState(initial); later prop changes only flip
	// this mirror through the effect below.
	let prevOpen = $state(untrack(() => open));

	// ARC resets the throw/dismissed state during render when `open` flips back
	// to true. The same bookkeeping lives here in an effect (no set-state-in-render).
	$effect(() => {
		if (open !== prevOpen) {
			prevOpen = open;
			if (open) dismissed = false;
		}
	});

	const visible = $derived(open && !dismissed);

	function dismiss() {
		dismissed = true;
		onOpenChange?.(false);
	}

	// Auto-dismiss timer. Effects run browser-only, so `window` is SSR-safe.
	// Phase 1 still-port: no exit animation — the toast unmounts at once.
	$effect(() => {
		if (!visible || !onOpenChange || duration <= 0) return;
		const timer = window.setTimeout(() => {
			dismissed = true;
			onOpenChange(false);
		}, duration);
		return () => window.clearTimeout(timer);
	});
</script>

{#if visible}
	<div
		{...restProps}
		class={[styles.toast, className].filter(Boolean).join(' ')}
		role="status"
		aria-live="polite"
		aria-atomic="true"
		id={uid}
	>
		<span class={styles.icon} aria-hidden="true">
			<svg
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.25"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M4 12.5l5 5L20 6.5" />
			</svg>
		</span>
		<div class={styles.frame}>
			<div class={styles.copy}>
				<strong class={styles.title}><span class={styles.line}>{title}</span></strong>
				{#if description}
					<span class={styles.description}>{description}</span>
				{/if}
			</div>
		</div>
		<button
			type="button"
			class={styles.close}
			aria-label="Dismiss notification"
			onclick={dismiss}
		>
			<X size={16} strokeWidth={2} aria-hidden="true" />
		</button>
	</div>
{/if}
