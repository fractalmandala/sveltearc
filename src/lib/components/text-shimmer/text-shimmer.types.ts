/**
 * Props for TextShimmer — ported from ARC `registry/components/text-shimmer/text-shimmer.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 *
 * ARC `children: string` is the status text itself (plain text, not a Snippet),
 * so it is kept as `children: string`. React-only `className` is dropped in
 * favour of Svelte `class`. `duration` is kept for API parity but the sweep
 * animation is deferred to Phase 2.
 */
export interface Props {
	/** The status text. Keep it to one short line. */
	children: string;
	/** Sweep while work is ongoing. Defaults to true. */
	active?: boolean;
	/** Seconds for one sweep across the text. Phase-1 still-port: parity only, no behaviour. */
	duration?: number;
	/** Wrapper element for the status line. */
	as?: 'span' | 'p' | 'div' | 'h2' | 'h3' | 'h4';
	/** Merged onto the wrapper element. */
	class?: string;
	/** Forwarded to the wrapper element. */
	id?: string;
}

export type TextShimmerProps = Props;
