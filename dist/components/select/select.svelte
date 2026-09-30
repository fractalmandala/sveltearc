<script lang="ts">
	import { untrack } from 'svelte';
	import { Select as BitsSelect } from 'bits-ui';
	import { Check, ChevronDown, ChevronUp } from '@lucide/svelte';
	import type { SelectProps } from './select.types';
	import styles from './select.module.css';

	let {
		label,
		options,
		value = $bindable(undefined),
		defaultValue = '',
		onValueChange,
		open = $bindable(undefined),
		onOpenChange,
		disabled = false,
		name,
		required = false,
		placeholder = 'Select an option',
		description,
		id,
		class: classNameProp,
		className,
		...restProps
	}: SelectProps = $props();

	const uid = $props.id();
	const controlId = $derived(id ?? uid);
	const hintId = $derived(description ? `${controlId}-description` : undefined);

	let internalValue = $state(untrack(() => defaultValue));
	const currentValue = $derived(value !== undefined ? value : internalValue);

	function handleValueChange(next: string) {
		if (value === undefined) {
			internalValue = next;
		} else {
			value = next;
		}
		onValueChange?.(next);
	}

	let internalOpen = $state(false);
	const currentOpen = $derived(open !== undefined ? open : internalOpen);

	function handleOpenChange(next: boolean) {
		if (open === undefined) {
			internalOpen = next;
		} else {
			open = next;
		}
		onOpenChange?.(next);
	}

	const selectedOption = $derived(options.find((opt) => opt.value === currentValue));
	const shown = $derived(selectedOption ? selectedOption.label : placeholder);
	const classes = $derived([styles.trigger, classNameProp, className].filter(Boolean).join(' '));
</script>

<div class={styles.field}>
	<label for={controlId}>{label}</label>
	<BitsSelect.Root
		type="single"
		value={currentValue}
		onValueChange={handleValueChange}
		open={currentOpen}
		onOpenChange={handleOpenChange}
		{disabled}
		{name}
		{required}
		items={options}
	>
		<BitsSelect.Trigger
			id={controlId}
			aria-describedby={hintId}
			class={classes}
			{...restProps}
		>
			<span class={styles.srOnly}>
				<BitsSelect.Value {placeholder} />
			</span>
			<span class={styles.valueText} aria-hidden="true">
				<span data-placeholder={currentValue ? undefined : ''}>{shown}</span>
			</span>
			<span class={styles.chevron}>
				<ChevronDown size={16} strokeWidth={1.8} aria-hidden="true" />
			</span>
		</BitsSelect.Trigger>
		<BitsSelect.Portal>
			<BitsSelect.Content class={styles.content} sideOffset={4} collisionPadding={12}>
				<BitsSelect.ScrollUpButton class={styles.scrollButton}>
					<ChevronUp size={15} strokeWidth={1.8} aria-hidden="true" />
				</BitsSelect.ScrollUpButton>
				<BitsSelect.Viewport class={styles.viewport}>
					{#each options as option (option.value)}
						<BitsSelect.Item
							value={option.value}
							label={option.label}
							disabled={option.disabled}
							class={styles.item}
						>
							{#snippet children({ selected })}
								<span>{option.label}</span>
								{#if selected}
									<span class={styles.indicator}>
										<Check size={16} strokeWidth={2} aria-hidden="true" />
									</span>
								{/if}
							{/snippet}
						</BitsSelect.Item>
					{/each}
				</BitsSelect.Viewport>
				<BitsSelect.ScrollDownButton class={styles.scrollButton}>
					<ChevronDown size={15} strokeWidth={1.8} aria-hidden="true" />
				</BitsSelect.ScrollDownButton>
			</BitsSelect.Content>
		</BitsSelect.Portal>
	</BitsSelect.Root>
	{#if description}
		<span id={hintId} class={styles.hint}>{description}</span>
	{/if}
</div>
