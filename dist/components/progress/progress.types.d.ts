import type { HTMLAttributes } from 'svelte/elements';
/**
 * Props for Progress — ported from ARC `registry/components/progress/progress.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 */
export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    value?: number;
    max?: number;
    label?: string;
    showValue?: boolean;
    class?: string;
    className?: string;
    ref?: HTMLElement | null;
}
export type ProgressProps = Props;
