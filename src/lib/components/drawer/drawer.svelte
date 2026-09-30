<script lang="ts">
	import { setContext, untrack } from 'svelte';
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { DRAWER_ROOT, type DrawerRootContext } from './drawer-context';
	import type { DrawerRootProps } from './drawer.types';

	let {
		open = $bindable(undefined),
		defaultOpen = false,
		onOpenChange,
		children,
		...rest
	}: DrawerRootProps = $props();

	let uncontrolled = $state(untrack(() => defaultOpen));
	const resolved = $derived(open !== undefined ? open : uncontrolled);

	setContext<DrawerRootContext>(DRAWER_ROOT, { open: () => resolved });

	function handleOpenChange(next: boolean) {
		if (open === undefined) uncontrolled = next;
		else open = next;
		onOpenChange?.(next);
	}
</script>

<DialogPrimitive.Root open={resolved} onOpenChange={handleOpenChange} {...rest}>
	{@render children?.()}
</DialogPrimitive.Root>
