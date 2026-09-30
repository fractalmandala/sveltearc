import type { Snippet } from 'svelte';

export interface Segment {
	value: string;
	label: string;
	/** Optional content after the label, such as a badge. */
	accessory?: Snippet;
}

/**
 * Props for SegmentedControl — ported from ARC `registry/components/segmented-control/segmented-control.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 */
export interface Props {
	options: Segment[];
	value?: string;
	onValueChange?: (value: string) => void;
	label?: string;
	/** Called when the pointer or focus reaches an option, before it is chosen. Use it to start loading what that option shows. */
	onOptionIntent?: (value: string) => void;
	className?: string;
	class?: string;
}

export type SegmentedControlProps = Props;
