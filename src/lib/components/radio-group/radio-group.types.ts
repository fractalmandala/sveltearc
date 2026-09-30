export interface RadioOption {
	value: string;
	label: string;
	description?: string;
}

/**
 * Props for RadioGroup — ported from ARC `registry/components/radio-group/radio-group.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 */
export interface Props {
	label: string;
	options: RadioOption[];
	value?: string;
	onValueChange?: (value: string) => void;
	name?: string;
	class?: string;
	className?: string;
}

export type RadioGroupProps = Props;
