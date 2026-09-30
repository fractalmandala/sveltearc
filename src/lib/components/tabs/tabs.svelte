<script lang="ts">
	import { untrack } from 'svelte';
	import { Tabs } from 'bits-ui';
	import styles from './tabs.module.css';
	import { setTabsContext } from './tabs-context';
	import type { Props } from './tabs.types';

	let {
		value = $bindable(undefined),
		defaultValue = '',
		onValueChange,
		class: className,
		children,
		...rest
	}: Props = $props();

	let internal = $state(untrack(() => defaultValue));
	const active = $derived(value ?? internal);

	function handleChange(next: string) {
		if (value === undefined) internal = next;
		else value = next;
		onValueChange?.(next);
	}

	setTabsContext({
		value: () => active,
		setValue: handleChange
	});

	const rootClasses = $derived([styles.root, className].filter(Boolean).join(' '));
</script>

<Tabs.Root
	value={active}
	onValueChange={handleChange}
	class={rootClasses}
	{...rest}
>
	{@render children?.()}
</Tabs.Root>
