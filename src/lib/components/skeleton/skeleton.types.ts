import type { HTMLAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';

/**
 * Props for Skeleton — ported from ARC `registry/components/skeleton/skeleton.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 */
export interface Props extends HTMLAttributes<HTMLDivElement> {
	label?: string;
	lines?: number;
	avatar?: boolean;
	children?: Snippet;
	loading?: boolean;
	class?: string;
	className?: string;
	ref?: HTMLElement | null;
}

export type SkeletonProps = Props;
