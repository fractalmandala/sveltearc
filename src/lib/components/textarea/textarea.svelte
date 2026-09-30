<script lang="ts">
	import type { Props } from './textarea.types';
	import styles from './textarea.module.css';

	const fallbackId = $props.id();

	let {
		label,
		description,
		error,
		id = fallbackId,
		class: className,
		value = $bindable(),
		ref = $bindable(null),
		'aria-describedby': ariaDescribedBy,
		'aria-invalid': ariaInvalid,
		...restProps
	}: Props = $props();

	const controlId = $derived(id);
	const hintId = $derived(description ? `${controlId}-description` : undefined);
	const errorId = $derived(error ? `${controlId}-error` : undefined);
	const describedBy = $derived(
		[ariaDescribedBy, hintId, errorId].filter(Boolean).join(' ') || undefined
	);
	const invalid = $derived(error ? true : (ariaInvalid ?? undefined));
	const controlClasses = $derived([styles.control, className].filter(Boolean).join(' '));
</script>

{#snippet message(id: string | undefined, text: string, cls: string, alert: boolean)}
	{@const parts = text.split(' ')}
	<span class={styles.messageSlot}>
		<span {id} class={cls} role={alert ? 'alert' : undefined}>
			<span class={styles.srOnly}>{text}</span>
			<span class={styles.words} aria-hidden="true">
				{#each parts as word, index (index)}<span class={styles.word}
						>{word}{index < parts.length - 1 ? ' ' : ''}</span
					>{/each}
			</span>
		</span>
	</span>
{/snippet}

<div class={styles.field}>
	<label for={controlId}>{label}</label>
	<textarea
		{...restProps}
		bind:this={ref}
		bind:value
		id={controlId}
		class={controlClasses}
		aria-invalid={invalid}
		aria-describedby={describedBy}
	></textarea>
	{#if description}{@render message(hintId, description, styles.hint, false)}{/if}
	{#if error}{@render message(errorId, error, styles.error, true)}{/if}
</div>
