<script lang="ts">
	import AnimatedCounter from '$lib/components/animated-counter/animated-counter.svelte';
	import styles from './metric-card.module.css';
	import type { Props } from './metric-card.types';

	let { label, value, suffix, context, change }: Props = $props();

	/** A signed change reads its direction in color as well as sign. */
	const trend = $derived(
		change === undefined
			? undefined
			: /^[+]/.test(change)
				? 'up'
				: /^[-−]/.test(change)
					? 'down'
					: undefined
	);
</script>

<article class={styles.card}>
	<div class={styles.top}>
		<!-- Phase-1 still: plain spans keep the .swapBlock/.text hooks Phase 2 animates. -->
		<span><span class={styles.swapBlock}><span class={styles.text}>{label}</span></span></span>
		{#if change}
			<small data-trend={trend}>
				<span class={styles.swap}>
					<span class={styles.sizer} aria-hidden="true">{change}</span>
					<span class={styles.text}>{change}</span>
				</span>
			</small>
		{/if}
	</div>
	<AnimatedCounter {value} {suffix} animateOnView />
	<p>
		<span class={styles.swapBlock}><span class={styles.text}>{context}</span></span>
	</p>
</article>
