<script lang="ts">
	import type { Props } from './button.types';
	import styles from './button.module.css';

	let {
		variant = 'primary',
		size = 'md',
		loading = false,
		disabled = false,
		class: classNameProp,
		className,
		ref = $bindable(null),
		children,
		onclick,
		...restProps
	}: Props = $props();

	const classes = $derived(
		[styles.button, styles[variant], styles[size], classNameProp, className].filter(Boolean).join(' ')
	);

	function handleClick(event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }) {
		if (loading) {
			event.preventDefault();
			return;
		}
		onclick?.(event);
	}
</script>

<button
	bind:this={ref}
	class={classes}
	disabled={disabled}
	aria-busy={loading ? true : undefined}
	tabindex={restProps.tabindex ?? 0}
	onclick={handleClick}
	{...restProps}
	aria-disabled={loading || restProps['aria-disabled'] || undefined}
>
	{#if loading}
		<span class={styles.loader} aria-hidden="true">
			<span class={styles.spinner}></span>
		</span>
	{/if}
	<span class={[styles.labelSlot, loading ? styles.loadingLabel : ''].filter(Boolean).join(' ')}>
		<span class={styles.labelContent}>
			<span class={styles.labelPhase}>
				{#if children}
					{@render children()}
				{/if}
			</span>
		</span>
	</span>
</button>
