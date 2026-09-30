<script lang="ts">
	import { untrack } from 'svelte';
	import { Combobox as BitsCombobox } from 'bits-ui';
	import Search from '@lucide/svelte/icons/search';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import type { ComboboxOption, Props } from './combobox.types';
	import styles from './combobox.module.css';

	let {
		label,
		options,
		value = $bindable(undefined),
		defaultValue = '',
		onValueChange,
		open = $bindable(undefined),
		onOpenChange,
		description,
		placeholder = 'Search or select…',
		emptyMessage = 'No matches found',
		id,
		disabled = false,
		class: className,
		ref = $bindable(null),
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const controlId = $derived(id ?? uid);
	const listboxId = $derived(`${controlId}-listbox`);
	const hintId = $derived(description ? `${controlId}-description` : undefined);

	/** Uncontrolled mirror; captures only the initial `defaultValue`. */
	let internalValue = $state(untrack(() => defaultValue));
	const currentValue = $derived(value !== undefined ? value : internalValue);

	function handleValueChange(next: string) {
		if (value === undefined) internalValue = next;
		else value = next;
		onValueChange?.(next);
		setQuery('');
	}

	let internalOpen = $state(false);
	const currentOpen = $derived(open !== undefined ? open : internalOpen);

	function handleOpenChange(next: boolean) {
		if (open === undefined) internalOpen = next;
		else open = next;
		onOpenChange?.(next);
	}

	let query = $state('');
	let activeIndex = $state(-1);
	let rootEl = $state<HTMLDivElement | null>(null);

	const selectedOption = $derived(options.find((option) => option.value === currentValue));
	/** While searching, the chosen label stays in place as muted placeholder copy instead of vanishing. */
	const displayValue = $derived(currentOpen ? query : (selectedOption?.label ?? ''));
	const placeholderText = $derived(selectedOption?.label ?? placeholder);

	const filteredOptions = $derived.by(() => {
		const normalizedQuery = query.trim().toLocaleLowerCase();
		if (!normalizedQuery) return options;
		return options.filter((option) =>
			[option.label, ...(option.keywords ?? [])].some((term) =>
				term.toLocaleLowerCase().includes(normalizedQuery)
			)
		);
	});

	const enabledIndices = $derived(
		filteredOptions.reduce<number[]>((indices, option, index) => {
			if (!option.disabled) indices.push(index);
			return indices;
		}, [])
	);

	const activeOption = $derived(activeIndex >= 0 ? filteredOptions[activeIndex] : undefined);

	/** Keeps the highlighted option in view while arrowing through a long list. */
	$effect(() => {
		if (!currentOpen) return;
		if (activeIndex < 0 || !rootEl) return;
		rootEl.querySelectorAll('[data-option-id]')[activeIndex]?.scrollIntoView({ block: 'nearest' });
	});

	function setQuery(next: string) {
		query = next;
	}

	function openMenu() {
		if (disabled) return;
		handleOpenChange(true);
		setQuery('');
		activeIndex = -1;
	}

	function choose(option: ComboboxOption) {
		if (option.disabled) return;
		handleValueChange(option.value);
		handleOpenChange(false);
		ref?.focus();
	}

	function clear(event: MouseEvent) {
		event.preventDefault();
		handleValueChange('');
		handleOpenChange(true);
		ref?.focus();
	}

	function handleType(text: string) {
		setQuery(text);
		activeIndex = -1;
		if (!currentOpen) handleOpenChange(true);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (disabled) return;
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			if (!currentOpen) {
				openMenu();
				return;
			}
			if (!enabledIndices.length) return;
			const currentPosition = enabledIndices.indexOf(activeIndex);
			const nextPosition =
				event.key === 'ArrowDown'
					? (currentPosition + 1) % enabledIndices.length
					: (currentPosition - 1 + enabledIndices.length) % enabledIndices.length;
			activeIndex = enabledIndices[nextPosition];
			return;
		}
		if (event.key === 'Enter' && currentOpen && activeIndex >= 0) {
			event.preventDefault();
			const option = filteredOptions[activeIndex];
			if (option) choose(option);
			return;
		}
		if (event.key === 'Escape' && currentOpen) {
			event.preventDefault();
			handleOpenChange(false);
			setQuery('');
		}
	}

	const controlClasses = $derived(
		[styles.control, currentOpen ? styles.open : '', disabled ? styles.disabled : '', className]
			.filter(Boolean)
			.join(' ')
	);
</script>

<div bind:this={rootEl} class={styles.field}>
	<label for={controlId}>{label}</label>
	<BitsCombobox.Root
		type="single"
		value={currentValue}
		onValueChange={handleValueChange}
		open={currentOpen}
		onOpenChange={handleOpenChange}
		{disabled}
		items={options}
	>
		<div class={controlClasses}>
			<Search class={styles.searchIcon} size={16} strokeWidth={1.8} aria-hidden="true" />
			<input
				{...restProps}
				bind:this={ref}
				id={controlId}
				type="text"
				role="combobox"
				value={displayValue}
				placeholder={placeholderText}
				{disabled}
				aria-describedby={hintId}
				aria-expanded={currentOpen}
				aria-controls={currentOpen ? listboxId : undefined}
				aria-autocomplete="list"
				aria-activedescendant={currentOpen && activeOption
					? `${controlId}-option-${activeOption.value}`
					: undefined}
				onfocus={(event) => {
					restProps.onfocus?.(event);
					openMenu();
				}}
				onclick={openMenu}
				oninput={(event) => handleType(event.currentTarget.value)}
				onkeydown={handleKeyDown}
			/>
			<!-- Phase 1 still-state: the clear button renders at its resting end-state, no scale/blur travel. -->
			{#if selectedOption && !disabled}
				<button
					type="button"
					class={styles.clear}
					aria-label="Clear selection"
					onmousedown={(event) => event.preventDefault()}
					onclick={clear}
				>
					<X size={15} strokeWidth={1.9} aria-hidden="true" />
				</button>
			{/if}
			<ChevronDown class={styles.chevron} size={16} strokeWidth={1.8} aria-hidden="true" />
		</div>
		<!-- Phase 1 still-state: the list mounts when open at its resting end-state (no enter/exit travel); data-state comes from bits-ui. -->
		<BitsCombobox.ContentStatic loop>
			{#snippet child({ props })}
				<div {...props} class={styles.popover} role="presentation">
					<div id={listboxId} class={styles.listbox} role="listbox" aria-label={`${label} options`}>
						{#if filteredOptions.length}
							{#each filteredOptions as option, index (option.value)}
								<BitsCombobox.Item
									value={option.value}
									label={option.label}
									disabled={option.disabled}
									id={`${controlId}-option-${option.value}`}
									class={styles.option}
									data-option-id={option.value}
									data-active={index === activeIndex ? 'true' : undefined}
									data-disabled={option.disabled ? 'true' : undefined}
									onHighlight={() => {
										activeIndex = index;
									}}
									onUnhighlight={() => {
										if (activeIndex === index) activeIndex = -1;
									}}
									onmousedown={(event) => event.preventDefault()}
									onclick={() => ref?.focus()}
								>
									{#snippet children({ selected })}
										<span>{option.label}</span>
										{#if selected}
											<span class={styles.check}>
												<Check size={15} strokeWidth={2} aria-hidden="true" />
											</span>
										{/if}
									{/snippet}
								</BitsCombobox.Item>
							{/each}
						{:else}
							<div class={styles.empty} role="status">{emptyMessage}</div>
						{/if}
					</div>
				</div>
			{/snippet}
		</BitsCombobox.ContentStatic>
	</BitsCombobox.Root>
	{#if description}
		<span id={hintId} class={styles.hint}>{description}</span>
	{/if}
</div>
