<script lang="ts">
	import type { Props } from './skeleton.types';
	import styles from './skeleton.module.css';

	let {
		label = 'Loading content',
		lines = 3,
		avatar = false,
		className,
		class: classNameProp,
		children,
		loading = true,
		ref = $bindable(null),
		...restProps
	}: Props = $props();

	// ARC clamps the wave to 1–6 lines. Avatar occupies beat 0, so lines start at 1.
	const count = $derived(Math.min(Math.max(Math.floor(Number.isFinite(lines) ? lines : 3), 1), 6));
	const lineIndices = $derived(Array.from({ length: count }, (_, index) => index));
	const extraClass = $derived([classNameProp, className].filter(Boolean).join(' '));
	const rootClass = $derived([styles.root, extraClass].filter(Boolean).join(' '));
</script>

{#snippet bones()}
	{#if avatar}
		<span class={styles.avatar} aria-hidden="true"></span>
	{/if}
	<span class={styles.lines} aria-hidden="true">
		{#each lineIndices as index (index)}
			<span class={styles.line} style:--index={index + (avatar ? 1 : 0)}></span>
		{/each}
	</span>
{/snippet}

{#if children === undefined}
	<div
		bind:this={ref}
		{...restProps}
		class={rootClass}
		role="status"
		aria-label={label}
		aria-busy="true"
	>
		{@render bones()}
	</div>
{:else}
	<!-- HeightFrame settled state: height auto, no clip. Phase 2 springs height on morph. -->
	<div
		bind:this={ref}
		{...restProps}
		{...(extraClass ? { class: extraClass } : {})}
		style:height="auto"
		aria-busy={loading}
	>
		<div class={styles.frame}>
			{#if loading}
				<div>
					<div class={styles.root} role="status" aria-label={label} aria-busy="true">
						{@render bones()}
					</div>
				</div>
			{:else}
				<div>
					{@render children()}
				</div>
			{/if}
		</div>
	</div>
{/if}
