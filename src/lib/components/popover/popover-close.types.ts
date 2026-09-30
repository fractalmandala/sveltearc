import type { ComponentProps, Snippet } from 'svelte';
import { Popover } from 'bits-ui';

/** Close props — ARC exports `PopoverPrimitive.Close` directly. */
export interface Props extends ComponentProps<typeof Popover.Close> {
	children?: Snippet;
}
