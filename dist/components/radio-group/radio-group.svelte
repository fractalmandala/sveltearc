<script lang="ts">
	import type { Props } from './radio-group.types';
	import styles from './radio-group.module.css';

	const fallbackId = $props.id();

	let {
		label,
		options = [],
		value = $bindable(''),
		onValueChange,
		name,
		class: classNameProp,
		className
	}: Props = $props();

	let listEl = $state<HTMLDivElement | null>(null);
	let highlightEl = $state<HTMLSpanElement | null>(null);
	let rowEls: (HTMLLabelElement | null)[] = $state([]);

	// Initialize value if empty
	$effect(() => {
		if (!value && options.length > 0 && options[0]) {
			value = options[0].value;
		}
	});

	const selected = $derived(options.findIndex((opt) => opt.value === value));

	function placeHighlight() {
		if (!highlightEl) return;
		const row = rowEls[selected];
		if (!row) {
			highlightEl.style.opacity = '0';
			return;
		}
		highlightEl.style.transform = `translateY(${row.offsetTop}px)`;
		highlightEl.style.height = `${row.offsetHeight}px`;
		highlightEl.style.opacity = '1';
		highlightEl.style.transition = 'transform var(--duration-spring) var(--ease-spring), height var(--duration-spring) var(--ease-spring)';
	}

	$effect(() => {
		if (selected >= 0) {
			placeHighlight();
			listEl?.setAttribute('data-ready', '');
		}
	});

	$effect(() => {
		if (!listEl) return;
		const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => placeHighlight());
		observer?.observe(listEl);
		rowEls.forEach((row) => row && observer?.observe(row));
		return () => observer?.disconnect();
	});

	function selectOption(val: string) {
		value = val;
		onValueChange?.(val);
	}

	const groupClasses = $derived([styles.group, classNameProp, className].filter(Boolean).join(' '));
</script>

<fieldset class={groupClasses}>
	<legend>{label}</legend>
	<div bind:this={listEl} class={styles.options}>
		<span bind:this={highlightEl} class={styles.highlight} aria-hidden="true"></span>
		{#each options as option, index (option.value)}
			{@const checked = value === option.value}
			<label
				class={styles.option}
				bind:this={rowEls[index]}
			>
				<input
					type="radio"
					name={name ?? fallbackId}
					value={option.value}
					{checked}
					onchange={() => selectOption(option.value)}
				/>
				<span class={styles.mark} aria-hidden="true">
					<span
						class={styles.dot}
						style={checked ? 'transform: scale(1); opacity: 1;' : 'transform: scale(0.4); opacity: 0;'}
					></span>
				</span>
				<span>
					<strong>{option.label}</strong>
					{#if option.description}
						<small>{option.description}</small>
					{/if}
				</span>
			</label>
		{/each}
	</div>
</fieldset>
