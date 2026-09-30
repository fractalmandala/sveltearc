import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
/**
 * Props for EmptyState — ported from ARC `registry/components/empty-state/empty-state.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 */
export interface Props extends HTMLAttributes<HTMLElement> {
    title: string;
    description: string;
    action?: Snippet;
    icon?: Snippet;
    className?: string;
    /** Optional accessible label for the state region. */
    label?: string;
    class?: string;
}
export type EmptyStateProps = Props;
