/** One entry in the multi-select list. */
export interface MultiSelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

/**
 * Public props for the MultiSelect port.
 *
 * Mirrors ARC `MultiSelectProps` 1:1 except React-only `className`, which is
 * dropped in favour of Svelte `class`. `open` / `onOpenChange` are added so
 * the menu can be controlled through the bits-ui host.
 */
export interface Props {
	/** Accessible name of the field, rendered as the visible label. */
	label: string;
	/** Options shown in the menu, in list order. */
	options: MultiSelectOption[];
	/** Controlled selection; supports two-way `bind:value`. */
	value?: string[];
	/** Initial selection when uncontrolled. */
	defaultValue?: string[];
	/** Callback fired whenever the selection changes. */
	onValueChange?: (value: string[]) => void;
	/** Controlled open state of the menu; supports two-way `bind:open`. */
	open?: boolean;
	/** Callback fired when the menu opens or closes. */
	onOpenChange?: (open: boolean) => void;
	/** Placeholder copy shown when nothing is selected. */
	placeholder?: string;
	/** Helper copy rendered below the field. */
	description?: string;
	/** Chips shown before the rest fold behind a "+N" count. */
	maxVisible?: number;
	/** Whether the whole field is disabled. */
	disabled?: boolean;
	/** Additional CSS class applied to the field wrapper. */
	class?: string;
}
