<script lang="ts">
	import type { Props } from './badge.types';
	import styles from './badge.module.css';

	let {
		tone = 'neutral',
		size = 'md',
		icon,
		class: classNameProp,
		className,
		ref = $bindable(null),
		children,
		...restProps
	}: Props = $props();

	const classes = $derived(
		[styles.badge, styles[tone], styles[size], classNameProp, className].filter(Boolean).join(' ')
	);
</script>

<span
	bind:this={ref}
	class={classes}
	{...restProps}
>
	<span class={styles.body}>
		<span class={styles.content}>
			{#if icon}
				<span class={styles.icon} aria-hidden="true">
					<span class={styles.glyph}>
						{@render icon()}
					</span>
				</span>
			{/if}
			<span class={styles.label}>
				<span class={styles.text}>
					{#if children}
						{@render children()}
					{/if}
				</span>
			</span>
		</span>
	</span>
</span>
