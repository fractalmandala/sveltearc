<script lang="ts">
	import { untrack } from 'svelte';
	import { Checkbox } from 'bits-ui';
	import styles from './checkbox.module.css';
	import type { CheckedState, Props } from './checkbox.types';

	let {
		label,
		description,
		id,
		checked = $bindable(undefined),
		defaultChecked = false,
		onCheckedChange,
		class: className,
		ref = $bindable(null),
		...rest
	}: Props = $props();

	const uid = $props.id();
	const controlId = $derived(id ?? uid);

	/** Uncontrolled mirror; captures only the initial `defaultChecked`. */
	let internal: CheckedState = $state(untrack(() => defaultChecked));
	const current: CheckedState = $derived(checked ?? internal);
	const on = $derived(current !== false);
	const indeterminate = $derived(current === 'indeterminate');

	function handleCheckedChange(next: boolean) {
		if (checked === undefined) internal = next;
		else checked = next;
		onCheckedChange?.(next);
	}

	const boxClasses = $derived([styles.box, className].filter(Boolean).join(' '));
	const ariaLabel = $derived(rest['aria-label'] ?? (label ? undefined : 'Checkbox'));

	/** Both marks share three points, so the check morphs into the dash and back. */
	const checkPath = 'M4.25 9.25 L7.25 12.25 L13.75 5.75';
	const dashPath = 'M4.75 9 L9 9 L13.25 9';
</script>

<div class={styles.field}>
	<Checkbox.Root
		{...rest}
		bind:ref
		id={controlId}
		checked={on}
		{indeterminate}
		onCheckedChange={handleCheckedChange}
		class={boxClasses}
		aria-describedby={description ? `${controlId}-description` : undefined}
		aria-label={ariaLabel}
	>
		<span class={styles.visual} aria-hidden="true">
			<!-- Phase 1 still-state: end values only (no spring / path draw). -->
			<span class={styles.fill} style:opacity={on ? 1 : 0} style:transform={`scale(${on ? 1 : 0.6})`}></span>
			<svg class={styles.mark} viewBox="0 0 18 18" fill="none" focusable="false">
				<path
					d={indeterminate ? dashPath : checkPath}
					opacity={on ? 1 : 0}
					stroke="currentColor"
					stroke-width="1.75"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</span>
	</Checkbox.Root>
	{#if label || description}
		<div class={styles.copy}>
			{#if label}<label for={controlId}>{label}</label>{/if}
			{#if description}<span id={`${controlId}-description`}>{description}</span>{/if}
		</div>
	{/if}
</div>
