/**
 * Props for TextMorph — ported from ARC `registry/components/text-morph/text-morph.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 *
 * ARC `children: string` is the morphing label itself (plain text, not a Snippet),
 * so it is kept as `children: string`. React-only `className` is dropped in
 * favour of Svelte `class`.
 */
export interface Props {
	/** The label to show. Changing it morphs the letters in place (Phase 2). */
	children: string;
	/** Wrapper element for the label. */
	as?: 'span' | 'div' | 'p' | 'strong' | 'h1' | 'h2' | 'h3';
	/** Merged onto the wrapper element. */
	class?: string;
	/** Forwarded to the wrapper element, e.g. for aria-labelledby. */
	id?: string;
}

export type TextMorphProps = Props;
