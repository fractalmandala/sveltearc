import type { ComponentProps, Snippet } from 'svelte';
import { Popover } from 'bits-ui';

/** Root props — `Popover` (ARC exports `PopoverPrimitive.Root` directly). */
export interface Props extends ComponentProps<typeof Popover.Root> {
	children?: Snippet;
}
