<script lang="ts">
	import { Popover } from 'bits-ui';
	import type { Props } from './popover-close.types';

	let { class: className, ref = $bindable(null), children, ...rest }: Props = $props();
</script>

<Popover.Close {...rest} bind:ref class={className}>
	{@render children?.()}
</Popover.Close>
