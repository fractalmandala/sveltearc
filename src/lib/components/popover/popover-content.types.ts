import type { ComponentProps, Snippet } from 'svelte';
import { Popover } from 'bits-ui';

/**
 * Content props — ARC `PopoverContent`. ARC wraps the content in a Portal and
 * defaults `align="start"`, `sideOffset={6}`, `collisionPadding={10}`; this port
 * applies the same defaults.
 */
export interface Props extends ComponentProps<typeof Popover.Content> {
	children?: Snippet;
}
