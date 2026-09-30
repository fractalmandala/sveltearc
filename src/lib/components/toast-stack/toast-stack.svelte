<script lang="ts">
	import styles from './toast-stack.module.css';
	import ToastStackItem from './toast-stack-item.svelte';
	import { layoutStack, ToastStackStore, useToastStackStore } from './toast-stack-store.svelte';
	import type { Props } from './toast-stack.types';

	let {
		label = 'Notifications',
		position = 'bottom-right',
		contained = false,
		visibleToasts = 3,
		hotkey = true,
		class: className = ''
	}: Props = $props();

	// ARC throws outside a provider. The port falls back to a local store so a
	// lone viewport still works (e.g. previews); scoped queues still need the
	// provider. See manifest gaps.
	const store = useToastStackStore() ?? new ToastStackStore();

	let hovered = $state(false);
	let focused = $state(false);
	let tapped = $state(false);
	let heights = $state<Record<string, number>>({});
	let reduced = $state(false);
	let pageHidden = $state(false);
	let regionRef = $state<HTMLElement | null>(null);
	let listRef = $state<HTMLOListElement | null>(null);
	let returnFocus = $state<HTMLElement | null>(null);

	const toasts = $derived(store.toasts);

	// A tap-opened stack with no toasts left closes itself.
	$effect(() => {
		if (tapped && store.toasts.length === 0) tapped = false;
	});

	const expanded = $derived(toasts.length > 0 && (hovered || focused || tapped));
	const paused = $derived(expanded || pageHidden);
	const layout = $derived(layoutStack(toasts, heights, expanded, visibleToasts));

	function measure(id: string, height: number) {
		if (heights[id] === height) return;
		heights = { ...heights, [id]: height };
	}

	// ARC prunes heights on exit-complete; Phase 1 drops them once the toast is gone.
	$effect(() => {
		const ids = new Set(toasts.map((item) => item.id));
		const stale = Object.keys(heights).filter((id) => !ids.has(id));
		if (stale.length) {
			heights = Object.fromEntries(Object.entries(heights).filter(([id]) => ids.has(id)));
		}
	});

	$effect(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	$effect(() => {
		const read = () => {
			pageHidden = document.visibilityState === 'hidden';
		};
		document.addEventListener('visibilitychange', read);
		return () => document.removeEventListener('visibilitychange', read);
	});

	$effect(() => {
		if (!hotkey) return;
		const onKey = (event: globalThis.KeyboardEvent) => {
			if (!event.altKey || event.metaKey || event.ctrlKey || event.code !== 'KeyT') return;
			const target = listRef?.querySelector<HTMLElement>(
				':scope > li:not([inert]) button'
			);
			if (!target) return;
			event.preventDefault();
			target.focus();
			setFocused(true);
		};
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	});

	// Close-on-outside-tap mirrors ARC's pointerdown-away for the tapped-open stack.
	$effect(() => {
		if (!tapped) return;
		const onDown = (event: PointerEvent) => {
			if (!regionRef?.contains(event.target as Node)) tapped = false;
		};
		document.addEventListener('pointerdown', onDown);
		return () => document.removeEventListener('pointerdown', onDown);
	});

	function setFocused(next: boolean) {
		focused = next;
	}

	function focusVisible(element: Element): boolean {
		try {
			return element.matches(':focus-visible');
		} catch {
			return true;
		}
	}

	function onFocus(event: FocusEvent) {
		const el = event.currentTarget;
		if (!(el instanceof HTMLElement)) return;
		const from = event.relatedTarget;
		if (!(from instanceof Node) || !el.contains(from)) {
			returnFocus = from instanceof HTMLElement ? from : null;
		}
		// Only keyboard focus opens the stack; a mouse click on a button should not pin it open.
		if (focusVisible(event.target as Element)) setFocused(true);
	}

	function onBlur(event: FocusEvent) {
		const el = event.currentTarget;
		if (!(el instanceof HTMLElement)) return;
		if (!(event.relatedTarget instanceof Node) || !el.contains(event.relatedTarget)) {
			setFocused(false);
		}
	}

	/** Keyboard users land on the next toast; with none left they return to where they were. */
	function handleBeforeDismiss(id: string, keyboard: boolean) {
		if (!keyboard) return;
		const items = Array.from(listRef?.children ?? []) as HTMLElement[];
		const at = items.findIndex((el) => el.dataset.toastId === id);
		requestAnimationFrame(() => {
			const live = Array.from(
				listRef?.querySelectorAll(':scope > li:not([inert])') ?? []
			) as HTMLElement[];
			const next = live[Math.min(Math.max(at, 0), live.length - 1)] ?? live[live.length - 1];
			const button = next?.querySelector<HTMLElement>('button');
			if (button) button.focus();
			else if (returnFocus?.isConnected) returnFocus.focus();
			else (document.activeElement as HTMLElement | null)?.blur();
		});
	}

	function toggleTap() {
		tapped = !tapped;
	}
</script>

<section
	bind:this={regionRef}
	class={[styles.viewport, styles[position], contained && styles.contained, className]
		.filter(Boolean)
		.join(' ')}
	aria-label={hotkey ? `${label} (Alt+T)` : label}
	aria-live="polite"
	aria-relevant="additions text"
	aria-atomic="false"
	onfocus={onFocus}
	onblur={onBlur}
>
	<ol
		bind:this={listRef}
		class={styles.list}
		data-expanded={expanded}
		style={`height: ${layout.listHeight}px;`}
		onpointerenter={(event) => {
			if (event.pointerType === 'mouse') hovered = true;
		}}
		onpointermove={(event) => {
			if (event.pointerType === 'mouse' && !hovered) hovered = true;
		}}
		onpointerleave={(event) => {
			if (event.pointerType === 'mouse') hovered = false;
		}}
	>
		{#each toasts as item, index (item.id)}
			<ToastStackItem
				toast={item}
				target={layout.targets[index]}
				{expanded}
				front={index === 0}
				hidden={index >= visibleToasts}
				{paused}
				{store}
				onMeasure={measure}
				onBeforeDismiss={handleBeforeDismiss}
				onTap={toggleTap}
			/>
		{/each}
	</ol>
</section>
