<script lang="ts">
	import { Dialog } from 'bits-ui';
	import type { Props } from './dialog-trigger.types';

	let { ref = $bindable(null), children, ...rest }: Props = $props();
</script>

<Dialog.Trigger {...rest} bind:ref>
	{@render children?.()}
</Dialog.Trigger>
