import type { HTMLInputAttributes } from 'svelte/elements';

/** One searchable entry in the combobox list. */
export interface ComboboxOption {
	value: string;
	label: string;
	disabled?: boolean;
	/** Extra terms the filter matches against (e.g. aliases, codes). */
	keywords?: string[];
}

/**
 * Public props for the Combobox port.
 *
 * Mirrors ARC `ComboboxProps` (which extends the native input attributes):
 * every ARC prop is present; React-only `className` is dropped in favour of
 * Svelte `class`. `open` / `onOpenChange` are added so the popover can be
 * controlled through the bits-ui host, and `ref` exposes the text field.
 */
export interface Props
	extends Omit<HTMLInputAttributes, 'value' | 'defaultValue' | 'onChange' | 'placeholder'> {
	/** Visible label for the field, linked to the input via for/id. */
	label: string;
	/** Options shown in the listbox, in list order. */
	options: ComboboxOption[];
	/** Controlled selected value; supports two-way `bind:value`. */
	value?: string;
	/** Initial value when uncontrolled. */
	defaultValue?: string;
	/** Callback fired when an option is chosen or the selection is cleared. */
	onValueChange?: (value: string) => void;
	/** Controlled open state of the listbox; supports two-way `bind:open`. */
	open?: boolean;
	/** Callback fired when the listbox opens or closes. */
	onOpenChange?: (open: boolean) => void;
	/** Helper copy rendered below the field, linked through aria-describedby. */
	description?: string;
	/** Placeholder copy shown when nothing is selected. */
	placeholder?: string;
	/** Copy shown when the filter matches no option. */
	emptyMessage?: string;
	/** Input id; auto-generated via `$props.id()` when omitted. */
	id?: string;
	/** Whether the field is disabled (narrowed from the native attribute union). */
	disabled?: boolean;
	/** Additional CSS class applied to the control element. */
	class?: string;
	/** Bindable reference to the underlying text field. */
	ref?: HTMLInputElement | null;
}
