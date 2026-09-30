/** One toggleable chip in the group. */
export interface ChipOption {
	value: string;
	label: string;
}

/**
 * Public props for the ChipGroup port.
 *
 * Mirrors ARC `ChipGroupProps` 1:1 except React-only `className`, which is
 * dropped in favour of Svelte `class`. `value` stays purely controlled, as
 * in ARC: every toggle flows out through `onValueChange` and the parent owns
 * the array (use `bind:value` for the two-way shorthand).
 */
export interface Props {
	/** Chips in the group, in reading order. */
	options: ChipOption[];
	/** Controlled selection of chip values; supports two-way `bind:value`. */
	value: string[];
	/** Callback fired whenever the selection changes. Optional when using `bind:value`. */
	onValueChange?: (value: string[]) => void;
	/** Accessible name of the group, such as "Topics". */
	label: string;
	/** Allow several chips at once. In single mode the selected chip can still be cleared. */
	multiple?: boolean;
	/** Chips shown before the rest fold behind a "+N more" chip. Chips selected when it folds stay in view. */
	maxVisible?: number;
	/** Additional CSS class applied to the group element. */
	class?: string;
}
