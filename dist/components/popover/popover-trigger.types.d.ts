import type { ComponentProps, Snippet } from 'svelte';
import { Popover } from 'bits-ui';
/** Trigger props — ARC `PopoverTrigger` (adds `styles.anchor`, opts out of press-scale). */
export interface Props extends ComponentProps<typeof Popover.Trigger> {
    children?: Snippet;
}
