import type { Snippet } from 'svelte';
export interface Props {
    content: string | Snippet;
    /**
     * Your trigger element. Write it as `{#snippet children({ props })}` and spread
     * the received props onto your own interactive element (usually a button) — the
     * element itself then becomes the trigger, so focus opens the tooltip and
     * aria-describedby lands on it.
     */
    children: Snippet<[{
        props: Record<string, unknown>;
    }]>;
    side?: 'top' | 'bottom';
}
export type TooltipProps = Props;
