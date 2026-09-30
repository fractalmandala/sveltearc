<script lang="ts">
	import type { Props } from './segmented-control.types';
	import styles from './segmented-control.module.css';

	const fallbackId = $props.id();

	let {
		options = [],
		value = $bindable(''),
		onValueChange,
		label,
		onOptionIntent,
		className,
		class: classNameProp
	}: Props = $props();

	let trackEl = $state<HTMLDivElement | null>(null);

	// Select first option by default if empty
	$effect(() => {
		if (!value && options.length > 0 && options[0]) {
			value = options[0].value;
		}
	});

	function updateFadeEdges() {
		if (!trackEl) return;
		const rest = trackEl.scrollWidth - trackEl.clientWidth - trackEl.scrollLeft;
		trackEl.toggleAttribute('data-fade-start', trackEl.scrollLeft > 1);
		trackEl.toggleAttribute('data-fade-end', rest > 1);
	}

	$effect(() => {
		if (!trackEl) return;
		updateFadeEdges();
		trackEl.addEventListener('scroll', updateFadeEdges, { passive: true });
		const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateFadeEdges);
		observer?.observe(trackEl);
		return () => {
			trackEl?.removeEventListener('scroll', updateFadeEdges);
			observer?.disconnect();
		};
	});

	// Auto-scroll selected button into view
	$effect(() => {
		if (!trackEl || !value) return;
		const button = trackEl.querySelector<HTMLElement>('[aria-pressed="true"]');
		if (!button || trackEl.scrollWidth <= trackEl.clientWidth) return;
		const room = 20;
		const start = button.offsetLeft - room;
		const end = button.offsetLeft + button.offsetWidth + room - trackEl.clientWidth;
		const left = trackEl.scrollLeft > start ? start : trackEl.scrollLeft < end ? end : trackEl.scrollLeft;
		if (left !== trackEl.scrollLeft) {
			trackEl.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
		}
	});

	const selectedIndex = $derived(
		Math.max(0, options.findIndex((opt) => opt.value === value))
	);

	function selectOption(val: string) {
		value = val;
		onValueChange?.(val);
	}

	function handleKeyDown(event: KeyboardEvent) {
		const last = options.length - 1;
		const targetIndex =
			event.key === 'ArrowRight' || event.key === 'ArrowDown'
				? selectedIndex === last
					? 0
					: selectedIndex + 1
				: event.key === 'ArrowLeft' || event.key === 'ArrowUp'
					? selectedIndex === 0
						? last
						: selectedIndex - 1
					: event.key === 'Home'
						? 0
						: event.key === 'End'
							? last
							: -1;

		if (targetIndex < 0 || !options[targetIndex]) return;
		event.preventDefault();
		const nextVal = options[targetIndex].value;
		selectOption(nextVal);
		trackEl
			?.querySelector<HTMLElement>(`[data-value="${CSS.escape(nextVal)}"]`)
			?.focus({ preventScroll: true });
	}

	const rootClasses = $derived([styles.root, classNameProp, className].filter(Boolean).join(' '));
</script>

<div class={rootClasses} role="group" aria-label={label}>
	<div bind:this={trackEl} class={styles.track}>
		{#each options as option, index (option.value)}
			{@const isSelected = value === option.value}
			<button
				id={`${fallbackId}-${option.value}`}
				class={styles.button}
				type="button"
				data-value={option.value}
				aria-pressed={isSelected}
				tabindex={index === selectedIndex ? 0 : -1}
				onclick={() => selectOption(option.value)}
				onkeydown={handleKeyDown}
				onpointerenter={onOptionIntent ? () => onOptionIntent(option.value) : undefined}
				onfocus={onOptionIntent ? () => onOptionIntent(option.value) : undefined}
			>
				{#if isSelected}
					<span class={styles.selection} aria-hidden="true"></span>
				{/if}
				<span class={styles.label}>
					{option.label}
					{#if option.accessory}
						{@render option.accessory()}
					{/if}
				</span>
			</button>
		{/each}
	</div>
</div>
