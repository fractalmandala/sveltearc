import type { ComponentProps, Snippet } from 'svelte';
import { Dialog } from 'bits-ui';
/** Close props — ARC `DialogClose` (a pass-through of the bits-ui close). */
export interface Props extends ComponentProps<typeof Dialog.Close> {
    children?: Snippet;
}
