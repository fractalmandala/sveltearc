<script lang="ts">
	import { Popover } from 'bits-ui';
	import styles from './popover.module.css';
	import type { Props } from './popover-content.types';

	let {
		class: className,
		align = 'start',
		sideOffset = 6,
		collisionPadding = 10,
		ref = $bindable(null),
		children,
		...rest
	}: Props = $props();

	const classes = $derived([styles.content, className].filter(Boolean).join(' '));
</script>

<Popover.Portal>
	<Popover.Content
		{...rest}
		bind:ref
		{align}
		{sideOffset}
		{collisionPadding}
		class={classes}
	>
		{@render children?.()}
	</Popover.Content>
</Popover.Portal>
