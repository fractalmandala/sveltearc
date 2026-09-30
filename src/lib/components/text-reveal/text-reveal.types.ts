/**
 * Props for TextReveal — ported from ARC `registry/components/text-reveal/text-reveal.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 */
export interface Props {
	text: string;
	as?: "h1" | "h2" | "h3" | "p";
	className?: string;
	id?: string;
	delay?: number;
	class?: string;
}

export type TextRevealProps = Props;
