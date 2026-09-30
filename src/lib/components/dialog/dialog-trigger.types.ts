import type { ComponentProps, Snippet } from 'svelte';
import { Dialog } from 'bits-ui';

/** Trigger props — ARC `DialogTrigger` (a pass-through of the bits-ui trigger). */
export interface Props extends ComponentProps<typeof Dialog.Trigger> {
	children?: Snippet;
}
