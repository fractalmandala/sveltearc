export interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

export interface Props {
	label: string;
	options: SelectOption[];
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	disabled?: boolean;
	name?: string;
	required?: boolean;
	placeholder?: string;
	description?: string;
	id?: string;
	class?: string;
	className?: string;
}

export type SelectProps = Props;
