<script lang="ts">
	import { setContext } from 'svelte';
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { DIALOG_ROOT, type DialogRootContext } from './dialog-context';
	import type { DialogRootProps } from './dialog.types';

	let {
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		onOpenChangeComplete,
		children,
		...rest
	}: DialogRootProps = $props();

	// svelte-ignore state_referenced_locally -- uncontrolled mode captures defaultOpen once (React useState parity).
	let uncontrolled = $state(defaultOpen);
	const resolved = $derived(open ?? uncontrolled);

	setContext<DialogRootContext>(DIALOG_ROOT, { open: () => resolved });

	function handleOpenChange(next: boolean) {
		if (open === undefined) uncontrolled = next;
		else open = next;
		onOpenChange?.(next);
	}
</script>

<DialogPrimitive.Root open={resolved} onOpenChange={handleOpenChange} {onOpenChangeComplete} {...rest}>
	{@render children?.()}
</DialogPrimitive.Root>
