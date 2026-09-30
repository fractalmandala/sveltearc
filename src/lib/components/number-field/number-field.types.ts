/**
 * Port of ARC `NumberField` — `registry/components/number-field/number-field.tsx`.
 *
 * The ARC source is a standalone composite (it does not extend the native
 * input attributes), so this interface lists the full field contract
 * explicitly. `className` maps to Svelte's `class`.
 */
export type NumberFieldAffix = string | ((value: number) => string);

export type NumberFieldSize = 'sm' | 'md' | 'lg';

export interface Props {
	/** Visible label, tied to the input. Doubles as the scrub handle when `scrub` is set. */
	label: string;
	/** Controlled value. Omit (with `defaultValue`) for uncontrolled use. */
	value?: number;
	/** Initial value for uncontrolled use. */
	defaultValue?: number;
	/** Fires with the clamped, snapped value on every committed change. */
	onValueChange?: (value: number) => void;
	/** Lower bound. Defaults to `0`. */
	min?: number;
	/** Upper bound. Defaults to `Number.MAX_SAFE_INTEGER`. */
	max?: number;
	/** Step size. Non-positive values fall back to `1`. */
	step?: number;
	/** PageUp, PageDown, and Shift with an arrow move this far. Defaults to ten steps. */
	largeStep?: number;
	/** Helper copy under the field, linked through `aria-describedby`. */
	description?: string;
	/** Disables the input and both step buttons. */
	disabled?: boolean;
	/** Element id. Falls back to `$props.id()`. */
	id?: string;
	/** Text before the number, such as `"$"`. */
	prefix?: NumberFieldAffix;
	/** Text after the number, such as `" seats"`. */
	suffix?: NumberFieldAffix;
	/** Drag the label sideways to scrub the value, one step every few pixels. */
	scrub?: boolean;
	/** Formatting locale. Fixed by default so server and client render the same digits. */
	locale?: string;
	/** Fraction digits and grouping. Fraction digits follow the precision of `step` by default. */
	formatOptions?: {
		minimumFractionDigits?: number;
		maximumFractionDigits?: number;
		useGrouping?: boolean;
	};
	/** Control height, type size, and default width. */
	size?: NumberFieldSize;
	/** A short note beside the label when a press meets a limit or a typed value passes one. `false` hides it; a function writes the copy. */
	limitHint?: boolean | ((edge: 'min' | 'max', limit: number) => string);
	/** Extra class on the field root. */
	class?: string;
	/** Caller ids merged ahead of the hint and limit-note ids. */
	'aria-describedby'?: string;
	/** Caller invalid flag; a typed value past a limit forces `true`. */
	'aria-invalid'?: boolean | 'true' | 'false';
}

export type NumberFieldProps = Props;
