<script lang="ts">
	import { Tabs } from 'bits-ui';
	import styles from './tabs.module.css';
	import type { TabsContentProps } from './tabs.types';

	let { value, forceMount = false, class: className, children, ...rest }: TabsContentProps = $props();

	const classes = $derived([styles.content, className].filter(Boolean).join(' '));
</script>

<Tabs.Content
	{value}
	class={classes}
	{...rest}
>
	{@render children?.()}
</Tabs.Content>
