import type { HTMLAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';
export type BadgeTone = 'neutral' | 'success' | 'info' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md';
/**
 * Props for Badge — ported from ARC `registry/components/badge/badge.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 */
export interface Props extends HTMLAttributes<HTMLSpanElement> {
    tone?: BadgeTone;
    size?: BadgeSize;
    icon?: Snippet;
    children?: Snippet;
    class?: string;
    className?: string;
    ref?: HTMLElement | null;
}
export type BadgeProps = Props;
