<script lang="ts">
	import { Dialog } from 'bits-ui';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), children, ...rest }: ComponentProps<typeof Dialog.Trigger> = $props();
</script>

<Dialog.Trigger {...rest} bind:ref>
	{@render children?.()}
</Dialog.Trigger>
