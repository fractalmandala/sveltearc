import type { HTMLInputAttributes } from 'svelte/elements';

/**
 * Props for SearchField — ported from ARC `registry/components/search-field/search-field.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 */
export interface Props extends Omit<HTMLInputAttributes, 'type'> {
	label: string;
	value?: string;
	onValueChange?: (value: string) => void;
	id?: string;
	class?: string;
	className?: string;
}

export type SearchFieldProps = Props;
