import type { Snippet } from 'svelte';

/** One FAQ row. React's `content: ReactNode` becomes a Snippet — see manifest gaps (documented API-shape delta). */
export interface AccordionItem {
	title: string;
	content?: Snippet;
}

/**
 * Port of ARC `Accordion` — `registry/components/accordion/accordion.tsx`.
 * Named `Props` per harness convention (check-port reads `interface Props` from the types file).
 */
export interface Props {
	items: AccordionItem[];
	defaultOpen?: number;
	/** "lg" suits page-level FAQs: questions at the large text size, answers at body size. */
	size?: 'md' | 'lg';
}
