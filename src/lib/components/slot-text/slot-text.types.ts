export type SlotTextAlign = 'start' | 'end';

/**
 * Props for SlotText — ported from ARC `registry/components/slot-text/slot-text.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 *
 * React-only `className` is dropped in favour of Svelte `class`. ARC
 * `style?: CSSProperties` becomes `style?: string` (Svelte inline-style
 * attribute). `duration`, `stagger`, `spins` and `align` are kept for API
 * parity but the reel-spinning motion is deferred to Phase 2.
 */
export interface Props {
	/** The value to show. Numbers pass through `format`; strings render as they are. */
	value: string | number;
	/** Formats a number value. Defaults to en-US grouping, so 12480 reads 12,480. */
	format?: (value: number) => string;
	/** Seconds the first reel spins. Later reels add stagger. Phase-1: parity only. */
	duration?: number;
	/** Seconds between reels stopping, left to right. Phase-1: parity only. */
	stagger?: number;
	/** Extra full turns a digit makes before it lands. Phase-1: parity only. */
	spins?: number;
	/**
	 * Which end reels are matched from when the length changes. Numbers default
	 * to `end`, so 999 to 1,000 grows on the left. Phase-1: parity only.
	 */
	align?: SlotTextAlign;
	/** Announce new values politely to screen readers via aria-live="polite". */
	announce?: boolean;
	/** Merged onto the root element. */
	class?: string;
	/** Inline styles forwarded to the root element. */
	style?: string;
}

export type SlotTextProps = Props;
