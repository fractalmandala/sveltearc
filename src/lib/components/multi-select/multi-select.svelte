<script lang="ts">
	import { untrack } from 'svelte';
	import { Combobox as BitsCombobox } from 'bits-ui';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import X from '@lucide/svelte/icons/x';
	import type { Props } from './multi-select.types';
	import styles from './multi-select.module.css';

	let {
		label,
		options,
		value = $bindable(undefined),
		defaultValue = [],
		onValueChange,
		open = $bindable(undefined),
		onOpenChange,
		placeholder = 'Select options',
		description,
		maxVisible = 2,
		disabled = false,
		class: className
	}: Props = $props();

	const uid = $props.id();
	const labelId = $derived(`${uid}-label`);
	const valueId = $derived(`${uid}-value`);
	const listboxId = $derived(`${uid}-listbox`);

	/** Uncontrolled mirror; captures only the initial `defaultValue`. */
	let internal = $state(untrack(() => defaultValue));
	const selected = $derived(value !== undefined ? value : internal);

	function handleValueChange(next: string[]) {
		if (value === undefined) internal = next;
		else value = next;
		onValueChange?.(next);
	}

	let internalOpen = $state(false);
	const currentOpen = $derived(open !== undefined ? open : internalOpen);

	function handleOpenChange(next: boolean) {
		if (open === undefined) internalOpen = next;
		else open = next;
		// A closed menu forgets its highlight, so the next open starts clean.
		if (!next) activeIndex = -1;
		onOpenChange?.(next);
	}

	let activeIndex = $state(-1);

	const labelFor = (item: string) => options.find((option) => option.value === item)?.label ?? item;
	const visible = $derived(
		selected.slice(0, maxVisible).map((item) => ({ value: item, label: labelFor(item) }))
	);
	const remaining = $derived(Math.max(0, selected.length - visible.length));
	const selectedText = $derived(selected.length ? selected.map(labelFor).join(', ') : placeholder);

	function clear() {
		handleValueChange([]);
		handleOpenChange(false);
	}

	const fieldClasses = $derived([styles.field, className].filter(Boolean).join(' '));
	const triggerClasses = $derived(
		[styles.trigger, selected.length ? styles.hasClear : ''].filter(Boolean).join(' ')
	);
</script>

<div class={fieldClasses}>
	<span id={labelId} class={styles.label}>{label}</span>
	<div class={styles.control}>
		<BitsCombobox.Root
			type="multiple"
			value={selected}
			onValueChange={handleValueChange}
			open={currentOpen}
			onOpenChange={handleOpenChange}
			{disabled}
			items={options}
		>
			<BitsCombobox.Trigger
				class={triggerClasses}
				aria-labelledby={`${labelId} ${valueId}`}
				aria-controls={listboxId}
			>
				<span id={valueId} class={styles.srOnly}>{selectedText}</span>
				<span class={styles.value} aria-hidden="true">
					<!-- Phase 1 still-state: chips render at their resting end-state, no slot-spring travel. -->
					{#each visible as item (item.value)}
						<span class={styles.slot}>
							<span class={styles.chip}>{item.label}</span>
						</span>
					{/each}
					{#if remaining > 0}
						<span class={styles.slot}>
							<span class={styles.more}>
								+<span class={styles.count}><span>{remaining}</span></span>
							</span>
						</span>
					{/if}
					{#if !selected.length}
						<span class={styles.placeholder}>{placeholder}</span>
					{/if}
				</span>
				<ChevronDown class={styles.chevron} size={16} aria-hidden="true" />
			</BitsCombobox.Trigger>
			<!-- Phase 1 still-state: the menu mounts when open at its resting end-state (no enter/exit travel); data-state comes from bits-ui. -->
			<BitsCombobox.ContentStatic
				loop
				id={listboxId}
				class={styles.menu}
				aria-label={label}
			>
				{#each options as option, index (option.value)}
					<BitsCombobox.Item
						value={option.value}
						label={option.label}
						disabled={option.disabled}
						class={styles.option}
						data-active={activeIndex === index ? 'true' : undefined}
						onHighlight={() => {
							activeIndex = index;
						}}
						onUnhighlight={() => {
							if (activeIndex === index) activeIndex = -1;
						}}
					>
						{#snippet children({ selected: isSelected })}
							<span>{option.label}</span>
							{#if isSelected}
								<svg
									class={styles.check}
									width="15"
									height="15"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<path d="M4 12.5 9 17.5 20 6.5" />
								</svg>
							{/if}
						{/snippet}
					</BitsCombobox.Item>
				{/each}
			</BitsCombobox.ContentStatic>
		</BitsCombobox.Root>
		<!-- Phase 1 still-state: the clear button renders at its resting end-state, no scale/blur travel. -->
		{#if selected.length > 0 && !disabled}
			<button type="button" aria-label="Clear selections" class={styles.clear} onclick={clear}>
				<X size={14} aria-hidden="true" />
			</button>
		{/if}
	</div>
	{#if description}
		<span class={styles.description}>{description}</span>
	{/if}
</div>
