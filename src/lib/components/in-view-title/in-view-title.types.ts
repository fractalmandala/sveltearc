export type InViewTitleVariant = 'word' | 'line' | 'blur' | 'tracking' | 'wipe';

/**
 * Props for InViewTitle — ported from ARC `registry/components/in-view-title/in-view-title.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 *
 * React-only `className` is dropped in favour of Svelte `class`.
 * `once` is kept for API parity but has no effect in the Phase-1 still-port
 * (the title always renders its final visible end state).
 */
export interface Props {
	/** The title copy to reveal. */
	text: string;
	/**
	 * Reveal style: `blur` sharpens word by word; `word` and `line` rise out of a
	 * clip; `tracking` opens tight letter spacing; `wipe` uncovers left to right.
	 */
	variant?: InViewTitleVariant;
	/** Heading level of the rendered title. */
	as?: 'h1' | 'h2' | 'h3';
	/** Explicit line breaks for the `line` variant. Defaults to `[text]`. */
	lines?: string[];
	/** Merged onto the outer wrapper element. */
	class?: string;
	/** Forwarded to the title element, e.g. for aria-labelledby. */
	id?: string;
	/** Replay on every entry when false. Phase-1 still-port: parity only, no behaviour. */
	once?: boolean;
}

export type InViewTitleProps = Props;
