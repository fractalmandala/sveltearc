<script lang="ts">
	import type { Props } from './search-field.types';
	import styles from './search-field.module.css';
	import { Search, X } from '@lucide/svelte';

	const fallbackId = $props.id();

	let {
		label,
		value = $bindable(''),
		onValueChange,
		id = fallbackId,
		class: classNameProp,
		className,
		...restProps
	}: Props = $props();

	let inputEl = $state<HTMLInputElement | null>(null);

	function handleInput(e: Event & { currentTarget: HTMLInputElement }) {
		const val = e.currentTarget.value;
		value = val;
		onValueChange?.(val);
	}

	function clear() {
		value = '';
		onValueChange?.('');
		inputEl?.focus();
	}

	const inputClasses = $derived([styles.input, classNameProp, className].filter(Boolean).join(' '));
</script>

<div class={styles.field}>
	<label for={id}>{label}</label>
	<div class={styles.shell} data-filled={value ? 'true' : undefined}>
		<Search size={18} aria-hidden="true" />
		<input
			bind:this={inputEl}
			{id}
			type="search"
			{value}
			oninput={handleInput}
			class={inputClasses}
			{...restProps}
		/>
		<span class={styles.clearSlot}>
			{#if value}
				<button
					type="button"
					tabindex={0}
					onclick={clear}
					aria-label="Clear search"
				>
					<X size={16} aria-hidden="true" />
				</button>
			{/if}
		</span>
	</div>
</div>
