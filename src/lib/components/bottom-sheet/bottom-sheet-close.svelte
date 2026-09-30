<script lang="ts">
	import { Dialog } from 'bits-ui';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), children, ...rest }: ComponentProps<typeof Dialog.Close> = $props();
</script>

<Dialog.Close {...rest} bind:ref>
	{@render children?.()}
</Dialog.Close>
