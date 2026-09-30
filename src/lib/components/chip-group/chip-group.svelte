<script lang="ts">
	import { untrack } from 'svelte';
	import type { Props } from './chip-group.types';
	import styles from './chip-group.module.css';

	/** Roving-focus key of the overflow chip; the NUL keeps it from colliding with any option value. */
	const MORE = '\u0000more';

	let {
		options,
		value = $bindable(),
		onValueChange,
		label,
		multiple = true,
		maxVisible = Infinity,
		class: className
	}: Props = $props();

	let expanded = $state(false);
	// Chips selected when the overflow folds stay in view, so a selection is
	// never hidden and deselecting never makes a chip vanish. Captures only
	// the initial `value`.
	let pinned = $state(untrack(() => [...value]));
	let active = $state<string | null>(null);

	const foldable = $derived(options.length > maxVisible);
	const visible = $derived(
		!foldable || expanded
			? options
			: options.filter(
					(option, index) =>
						index < maxVisible || pinned.includes(option.value) || value.includes(option.value)
				)
	);
	const hidden = $derived(options.length - visible.length);
	const showMore = $derived(foldable && (expanded || hidden > 0));
	const keys = $derived([...visible.map((option) => option.value), ...(showMore ? [MORE] : [])]);
	// One chip holds the tab stop: the last one focused, else the first selected, else the first.
	const tabStop = $derived(
		active !== null && keys.includes(active)
			? active
			: (visible.find((option) => value.includes(option.value))?.value ?? keys[0])
	);

	function toggle(next: string) {
		const on = value.includes(next);
		if (!multiple) {
			const result = on ? [] : [next];
			value = result;
			onValueChange?.(result);
			return;
		}
		const result = options
			.filter((option) => (option.value === next ? !on : value.includes(option.value)))
			.map((option) => option.value);
		value = result;
		onValueChange?.(result);
	}

	function toggleMore() {
		if (expanded) pinned = [...value];
		expanded = !expanded;
	}

	function onKeyDown(event: KeyboardEvent) {
		const host = event.currentTarget as HTMLDivElement | null;
		if (!host) return;
		const buttons = Array.from(
			host.querySelectorAll<HTMLButtonElement>(
				":is(button[data-chip], button[data-more]):not([aria-hidden='true'])"
			)
		);
		const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
		if (index < 0) return;
		const last = buttons.length - 1;
		const moves: Record<string, number> = {
			ArrowRight: index === last ? 0 : index + 1,
			ArrowDown: index === last ? 0 : index + 1,
			ArrowLeft: index === 0 ? last : index - 1,
			ArrowUp: index === 0 ? last : index - 1,
			Home: 0,
			End: last
		};
		if (!(event.key in moves)) return;
		event.preventDefault();
		buttons[moves[event.key]]?.focus();
	}

	const groupClasses = $derived([styles.group, className].filter(Boolean).join(' '));
</script>

<!-- Phase 1 still-state: chips render at their resting end-state (check in, label over, surface tinted) with no layout-spring travel; the overflow folds instantly with no height morph. -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions: the group owns arrow-key roving focus for its chip buttons (ARC parity); it never takes a tab stop itself. -->
<div class={groupClasses} role="group" aria-label={label} onkeydown={onKeyDown}>
	<!-- Chips revealed by the overflow appear in reading order, without stagger. -->
	{#each visible as option (option.value)}
		{@const selected = value.includes(option.value)}
		<button
			type="button"
			class={styles.chip}
			data-chip={option.value}
			aria-pressed={selected}
			tabindex={tabStop === option.value ? 0 : -1}
			onclick={() => toggle(option.value)}
			onfocus={() => (active = option.value)}
		>
			<span class={styles.body} data-selected={selected}>
				<span class={styles.surface} aria-hidden="true"></span>
				{#if selected}
					<span class={styles.check} aria-hidden="true">
						<svg
							width={14}
							height={14}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width={2.5}
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M4 12.5 9.5 18 20 6.5" />
						</svg>
					</span>
				{/if}
				<span class={styles.slot} aria-hidden="true"></span>
				<span class={styles.label}>{option.label}</span>
			</span>
		</button>
	{/each}
	{#if showMore}
		<button
			type="button"
			class={`${styles.chip} ${styles.more}`}
			data-more=""
			aria-expanded={expanded}
			tabindex={tabStop === MORE ? 0 : -1}
			onclick={toggleMore}
			onfocus={() => (active = MORE)}
		>
			<span class={styles.body}>
				<span class={styles.surface} aria-hidden="true"></span>
				<span class={styles.moreText}>
					<span class={styles.moreLine}>{expanded ? 'Show less' : `+${hidden} more`}</span>
				</span>
			</span>
		</button>
	{/if}
</div>
