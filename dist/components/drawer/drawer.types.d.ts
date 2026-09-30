import type { ComponentProps, Snippet } from 'svelte';
import { Dialog } from 'bits-ui';
export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';
export interface DrawerRootProps extends ComponentProps<typeof Dialog.Root> {
    open?: boolean;
    defaultOpen?: boolean;
    children?: Snippet;
}
export interface Props extends ComponentProps<typeof Dialog.Content> {
    title: string;
    description?: string;
    children?: Snippet;
    side?: DrawerSide;
    container?: HTMLElement | null;
    class?: string;
    className?: string;
}
export type DrawerContentProps = Props;
