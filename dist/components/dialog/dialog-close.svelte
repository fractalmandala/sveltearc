<script lang="ts">
	import { Dialog } from 'bits-ui';
	import type { Props } from './dialog-close.types';

	let { ref = $bindable(null), children, ...rest }: Props = $props();
</script>

<Dialog.Close {...rest} bind:ref>
	{@render children?.()}
</Dialog.Close>
