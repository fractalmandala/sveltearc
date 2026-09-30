<script lang="ts">
	import { untrack } from 'svelte';
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { X } from '@lucide/svelte';
	import type { Props } from './bottom-sheet.types';
	import styles from './bottom-sheet.module.css';

	let {
		title,
		description,
		children,
		trigger,
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		detents = [0.45, 0.92],
		initialDetent = 0,
		onDetentChange,
		closeLabel = 'Close',
		class: classNameProp,
		className,
		...restProps
	}: Props = $props();

	let uncontrolled = $state(untrack(() => defaultOpen));
	const resolvedOpen = $derived(open !== undefined ? open : uncontrolled);

	function handleOpenChange(next: boolean) {
		if (open === undefined) uncontrolled = next;
		else open = next;
		onOpenChange?.(next);
	}

	const stops = $derived(
		detents
			.slice()
			.filter((d) => d > 0)
			.sort((a, b) => a - b)
	);
	const top = $derived(stops.length > 0 ? stops.length - 1 : 0);

	let detent = $state(untrack(() => Math.min(Math.max(0, Math.round(initialDetent)), top)));
	const currentDetent = $derived(Math.min(detent, top));
	const expanded = $derived(currentDetent === top);

	const announcement = $derived(
		currentDetent === top
			? 'Sheet expanded'
			: currentDetent === 0
				? 'Sheet collapsed'
				: `Sheet at ${Math.round((stops[currentDetent] ?? 0.45) * 100)} percent height`
	);

	function grabberClick() {
		const next = currentDetent === top ? 0 : top;
		detent = next;
		onDetentChange?.(next);
	}

	function grabberKey(event: KeyboardEvent) {
		const current = currentDetent;
		const next =
			event.key === 'ArrowUp'
				? Math.min(current + 1, top)
				: event.key === 'ArrowDown'
					? Math.max(current - 1, 0)
					: event.key === 'Home'
						? top
						: event.key === 'End'
							? 0
							: null;
		if (next === null) return;
		event.preventDefault();
		detent = next;
		onDetentChange?.(next);
	}

	const sheetClasses = $derived([styles.sheet, classNameProp, className].filter(Boolean).join(' '));
	const sheetMax = $derived(stops[currentDetent] ?? 0.92);
</script>

<DialogPrimitive.Root open={resolvedOpen} onOpenChange={handleOpenChange} {...restProps}>
	{#if trigger}
		<DialogPrimitive.Trigger>
			{#snippet child({ props })}
				{@render trigger({ props })}
			{/snippet}
		</DialogPrimitive.Trigger>
	{/if}

	<DialogPrimitive.Portal>
		<DialogPrimitive.Overlay class={styles.overlay} />
		<DialogPrimitive.Content
			class={sheetClasses}
			data-expanded={expanded ? '' : undefined}
			style="--sheet-max: {sheetMax}; --sheet-extension: 160px;"
		>
			<div class={styles.header}>
				<button
					type="button"
					class={styles.grabber}
					data-grabber=""
					aria-label={expanded ? 'Collapse sheet' : 'Expand sheet'}
					aria-expanded={expanded}
					onclick={grabberClick}
					onkeydown={grabberKey}
				>
					<span class={styles.grabberBar} aria-hidden="true"></span>
				</button>
				<div class={styles.headRow}>
					<div class={styles.headText}>
						<DialogPrimitive.Title class={styles.title}>{title}</DialogPrimitive.Title>
						{#if description}
							<DialogPrimitive.Description class={styles.description}>
								{description}
							</DialogPrimitive.Description>
						{/if}
					</div>
					<DialogPrimitive.Close class={styles.close} aria-label={closeLabel}>
						<X size={16} strokeWidth={1.75} aria-hidden="true" />
					</DialogPrimitive.Close>
				</div>
			</div>
			<div class={styles.body}>
				{@render children?.()}
			</div>
			<span class={styles.srOnly} role="status" aria-live="polite">{announcement}</span>
		</DialogPrimitive.Content>
	</DialogPrimitive.Portal>
</DialogPrimitive.Root>
