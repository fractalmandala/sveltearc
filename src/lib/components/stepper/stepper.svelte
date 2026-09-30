<script lang="ts">
	import styles from './stepper.module.css';
	import type { Props, StepperStatus, StepperStep } from './stepper.types';

	let {
		steps,
		current,
		orientation = 'horizontal',
		onStepSelect,
		details = 'all',
		compact = false,
		label = 'Progress',
		completeLabel = 'All steps complete',
		class: className
	}: Props = $props();

	const count = $derived(steps.length);
	const active = $derived(Math.min(Math.max(Math.round(current), 0), count));
	const vertical = $derived(orientation === 'vertical');
	const interactive = $derived(Boolean(onStepSelect));
	const done = $derived(active >= count);
	const now = $derived(done ? undefined : steps[active]);

	const statusText: Record<StepperStatus, string> = {
		complete: 'Completed',
		current: '',
		upcoming: 'Not started',
		error: 'Error'
	};

	const rootClasses = $derived(
		[
			styles.root,
			vertical ? styles.vertical : styles.horizontal,
			compact ? styles.compact : '',
			className
		]
			.filter(Boolean)
			.join(' ')
	);
	const listStyle = $derived(
		vertical
			? undefined
			: `grid-template-columns: ${count > 1 ? `repeat(${count - 1}, minmax(0, 1fr)) auto` : 'auto'}`
	);

	function statusOf(step: StepperStep, index: number): StepperStatus {
		return step.error ? 'error' : index < active ? 'complete' : index === active ? 'current' : 'upcoming';
	}

	/** Arrow keys move between the steps you can reach; Home and End jump to the first and the current one. */
	function onKeyDown(event: KeyboardEvent) {
		const nav = event.currentTarget as HTMLElement;
		const rtl = !vertical && getComputedStyle(nav).direction === 'rtl';
		const back = ['ArrowUp', rtl ? 'ArrowRight' : 'ArrowLeft'];
		const ahead = ['ArrowDown', rtl ? 'ArrowLeft' : 'ArrowRight'];
		if (![...back, ...ahead, 'Home', 'End'].includes(event.key)) return;
		const targets = Array.from(nav.querySelectorAll<HTMLButtonElement>('button[data-reachable]'));
		const at = targets.indexOf(event.target as HTMLButtonElement);
		if (at < 0) return;
		event.preventDefault();
		const next =
			event.key === 'Home'
				? 0
				: event.key === 'End'
					? targets.length - 1
					: back.includes(event.key)
						? Math.max(0, at - 1)
						: Math.min(targets.length - 1, at + 1);
		targets[next]?.focus();
	}
</script>

{#snippet stepContent(
	step: StepperStep,
	index: number,
	status: StepperStatus,
	isCurrent: boolean,
	detail: string | undefined
)}
	{@const kind = step.error ? 'error' : index < active ? 'check' : 'number'}
	<span class={styles.marker} aria-hidden="true">
		{#if isCurrent}<span class={styles.ring}></span>{/if}
		<span class={styles.disc}>
			{#if kind === 'number'}
				<span class={styles.glyph}>{index + 1}</span>
			{:else if kind === 'check'}
				<svg
					class={`${styles.glyph} ${styles.icon}`}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M5.5 12.5l4.25 4.25L18.5 8" />
				</svg>
			{:else}
				<svg
					class={`${styles.glyph} ${styles.icon}`}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M12 6.75v6.5" />
					<circle cx="12" cy="17.4" r="1.4" fill="currentColor" stroke="none" />
				</svg>
			{/if}
		</span>
	</span>
	<span class={styles.text}>
		<span class={styles.label}>{step.label}</span>
		{#if statusText[status]}<span class={styles.srOnly}>, {statusText[status]}</span>{/if}
		{#if detail}
			<span class={styles.slot}
				><span class={styles.slotInner}
					><span class={step.error ? styles.error : styles.description}>{detail}</span></span
				></span
			>
		{/if}
	</span>
{/snippet}

<!-- Phase 1 still-state: statuses, glyphs, connector fills, and the live caption render
     statically. The glyph pop, connector spring, ring, and text swap are Phase 2. -->
<svelte:element
	this={interactive ? 'nav' : 'div'}
	class={rootClasses}
	aria-label={label}
	role={interactive ? undefined : 'group'}
>
	<!-- Roving-focus pattern: the list delegates arrow keys to its focusable step buttons. -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<ol class={styles.list} style={listStyle} onkeydown={interactive ? onKeyDown : undefined}>
		{#each steps as step, index (step.id)}
			{@const status = statusOf(step, index)}
			{@const isCurrent = index === active}
			{@const clickable = interactive && index < active}
			{@const detail = step.error ?? (details === 'all' || isCurrent ? step.description : undefined)}
			<li class={styles.item} data-status={status}>
				{#if index < count - 1}
					<span class={styles.connector} aria-hidden="true">
						<span
							class={styles.fill}
							style:transform={vertical
								? `scaleY(${index < active ? 1 : 0})`
								: `scaleX(${index < active ? 1 : 0})`}
						></span>
					</span>
				{/if}
				{#if interactive}
					<button
						type="button"
						class={styles.head}
						data-clickable={clickable || undefined}
						data-reachable={index <= active || undefined}
						aria-current={isCurrent ? 'step' : undefined}
						aria-disabled={clickable ? undefined : true}
						tabindex={clickable ? undefined : -1}
						onclick={clickable ? () => onStepSelect?.(index) : undefined}
					>
						{@render stepContent(step, index, status, isCurrent, detail)}
					</button>
				{:else}
					<span class={styles.head} aria-current={isCurrent ? 'step' : undefined}>
						{@render stepContent(step, index, status, isCurrent, detail)}
					</span>
				{/if}
			</li>
		{/each}
	</ol>
	{#if !vertical}
		<span class={styles.caption} aria-hidden="true">
			<span class={styles.captionLabel}>{now?.label ?? completeLabel}</span>
			{#if now?.error ?? now?.description}
				<span class={now?.error ? styles.error : styles.description}
					>{now?.error ?? now?.description}</span
				>
			{/if}
		</span>
	{/if}
	<span class={styles.srOnly} aria-live="polite"
		>{now ? `Step ${active + 1} of ${count}: ${now.label}` : completeLabel}</span
	>
</svelte:element>
