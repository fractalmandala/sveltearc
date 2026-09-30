<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import type { Props } from './progress.types';
	import styles from './progress.module.css';

	let {
		value = 0,
		max = 100,
		label,
		showValue = false,
		className,
		class: classNameProp,
		ref = $bindable(null),
		...restProps
	}: Props = $props();

	const safeMax = $derived(max > 0 ? max : 100);
	const safeValue = $derived(Math.min(Math.max(value, 0), safeMax));
	const percentage = $derived(Math.round((safeValue / safeMax) * 100));
	const complete = $derived(percentage >= 100);
	const classes = $derived([styles.progress, classNameProp, className].filter(Boolean).join(' '));
	// Fill slides by translate, so the rounded cap keeps its shape. Phase 1 jumps to the end value.
	const fillX = $derived(`${Math.min(Math.max(percentage, 0), 100) - 100}%`);
</script>

<div
	bind:this={ref}
	{...restProps}
	class={classes}
	data-complete={complete ? '' : undefined}
	role="progressbar"
	aria-label={label ?? 'Progress'}
	aria-valuemin={0}
	aria-valuemax={safeMax}
	aria-valuenow={safeValue}
	aria-valuetext="{percentage}%"
>
	{#if label || showValue}
		<div class={styles.meta}>
			{#if label}
				<span class={styles.label}>
					<span class={styles.line}>{label}</span>
				</span>
			{:else}
				<span></span>
			{/if}
			{#if showValue}
				<span class={styles.value}>
					{#if complete}
						<span class={styles.done}>
							<Check size={14} strokeWidth={2} aria-hidden="true" />
						</span>
					{/if}
					<span class={styles.count}>{percentage}%</span>
				</span>
			{/if}
		</div>
	{/if}
	<div class={styles.track}>
		<span class={styles.fill} style:transform="translateX({fillX})"></span>
	</div>
</div>
