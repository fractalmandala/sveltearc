import type { HTMLButtonAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
/**
 * Props for Button — ported from ARC `registry/components/button/button.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 */
export interface Props extends HTMLButtonAttributes {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    children?: Snippet;
    class?: string;
    className?: string;
    ref?: HTMLButtonElement | null;
}
export type ButtonProps = Props;
