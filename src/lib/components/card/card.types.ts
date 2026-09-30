import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

/**
 * Port of ARC `Card` — `registry/components/card/card.tsx`.
 *
 * The quick look (`details`) is a Dialog-hosted expanded view. Phase 1 renders
 * it as a normal dialog with DOM parity; the shared-layout morph (layoutId) that
 * grows out of the card and returns to its box is Phase 2.
 */
export interface Props extends HTMLAttributes<HTMLElement> {
	title: string;
	description?: string;
	/** Leading visual, e.g. an image. */
	media?: Snippet;
	/** Trailing control in the footer. */
	action?: Snippet;
	/** Small leading visual for the footer, such as an avatar. */
	avatar?: Snippet;
	/** Who the card belongs to, such as the owner's name. */
	meta?: Snippet;
	/** A short status under the meta, such as "Updated 2 hours ago". */
	status?: string;
	/** Content for the quick look. When set, the card opens into a larger view. */
	details?: Snippet;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	children?: Snippet;
}
