<script lang="ts">
	import { Popover } from 'bits-ui';
	import type { Props } from './popover.types';

	let {
		open = $bindable(false),
		onOpenChange,
		onOpenChangeComplete,
		children,
		...rest
	}: Props = $props();
</script>

<Popover.Root bind:open {onOpenChange} {onOpenChangeComplete} {...rest}>
	{@render children?.()}
</Popover.Root>
