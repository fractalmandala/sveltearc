<script lang="ts">
	import { Tabs } from 'bits-ui';
	import styles from './tabs.module.css';
	import { getTabsContext } from './tabs-context';
	import type { TabsTriggerProps } from './tabs.types';

	let { value, disabled = false, class: className, children, ...rest }: TabsTriggerProps = $props();

	const ctx = getTabsContext();
	const isSelected = $derived(ctx ? ctx.value() === value : false);
	const triggerClasses = $derived([styles.trigger, className].filter(Boolean).join(' '));
</script>

<Tabs.Trigger
	{value}
	{disabled}
	data-value={value}
	class={triggerClasses}
	{...rest}
>
	{#if isSelected}
		<span class={styles.selection} aria-hidden="true"></span>
	{/if}
	<span class={styles.triggerLabel}>
		{@render children?.()}
	</span>
</Tabs.Trigger>
