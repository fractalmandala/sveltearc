import type { ComponentProps } from 'svelte';
import { Checkbox } from 'bits-ui';

type BitsCheckboxRoot = ComponentProps<typeof Checkbox.Root>;

/** Radix `CheckedState` — Bits UI splits this into `checked` + `indeterminate`. */
export type CheckedState = boolean | 'indeterminate';

/**
 * Port of ARC `Checkbox` — `registry/components/checkbox/checkbox.tsx`.
 *
 * Mirrors the React source: the Bits UI root props (DOM button attributes
 * included), plus the Radix `checked` union, a change callback, and the
 * `label` / `description` copy.
 */
export interface Props
	extends Omit<
		BitsCheckboxRoot,
		'checked' | 'onCheckedChange' | 'indeterminate' | 'onIndeterminateChange' | 'child' | 'children' | 'ref'
	> {
	/** Controlled state. Use `bind:checked` for two-way. */
	checked?: CheckedState;
	/** Uncontrolled initial state. */
	defaultChecked?: CheckedState;
	/** Fired whenever the checkbox toggles. */
	onCheckedChange?: (checked: CheckedState) => void;
	/** Visible label rendered beside the box. */
	label?: string;
	/** Secondary description, wired through `aria-describedby`. */
	description?: string;
	/** Bits UI bindable ref to the root button element. */
	ref?: HTMLElement | null;
}
