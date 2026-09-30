<script lang="ts">
	import type { Props } from './copy-button.types';
	import styles from './copy-button.module.css';
	import { Copy, Check, CircleAlert } from '@lucide/svelte';
	import { createCopyFeedback } from '../../use-copy-feedback.svelte';

	let {
		value,
		label = 'Copy',
		className,
		class: classNameProp,
		iconOnly = false,
		variant = 'outline',
		disabled = false,
		onCopied,
		ref = $bindable(null),
		...restProps
	}: Props = $props();

	const feedback = createCopyFeedback();
	const state = $derived(feedback.state);
	const text = $derived(state === 'copied' ? 'Copied' : state === 'error' ? 'Failed' : label);

	const buttonClasses = $derived(
		[
			styles.button,
			iconOnly && styles.iconOnly,
			variant === 'plain' && styles.plain,
			classNameProp,
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	async function handleCopy() {
		if (disabled) return;
		const ok = await feedback.copy(value);
		if (ok) onCopied?.();
	}
</script>

<button
	bind:this={ref}
	type="button"
	class={buttonClasses}
	onclick={handleCopy}
	aria-label={label}
	data-copy-state={state}
	disabled={disabled}
	{...restProps}
>
	<span class={styles.icon} aria-hidden="true">
		<span class={styles.iconInner} data-state={state}>
			{#if state === 'copied'}
				<Check size={16} strokeWidth={2} />
			{:else if state === 'error'}
				<CircleAlert size={16} strokeWidth={1.8} />
			{:else}
				<Copy size={16} strokeWidth={1.8} />
			{/if}
		</span>
	</span>
	{#if !iconOnly}
		<span class={styles.label} aria-hidden="true">
			<span class={styles.measure}>{label}</span>
			<span class={styles.measure}>Copied</span>
			<span class={styles.measure}>Failed</span>
			<span class={styles.glyphs}>
				<span class={styles.glyph}>{text}</span>
			</span>
		</span>
	{/if}
</button>
<span class={styles.srOnly} role="status" aria-live="polite">
	{state === 'idle' ? '' : state === 'error' ? `${label}: Could not copy` : `${label}: Copied`}
</span>
