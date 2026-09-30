/**
 * Port of ARC `TagInput` — `registry/components/tag-input/tag-input.tsx`.
 *
 * The ARC source is a standalone composite (it does not extend the native
 * input attributes), so this interface lists the full field contract
 * explicitly. `className` maps to Svelte's `class`.
 */
export interface Props {
	/** Visible label, tied to the input. */
	label: string;
	/** Controlled tag list. Omit (with `defaultValue`) for uncontrolled use. */
	value?: string[];
	/** Initial tags for uncontrolled use. */
	defaultValue?: string[];
	/** Fires with the next tag list on every add or remove. */
	onValueChange?: (value: string[]) => void;
	/** Placeholder for the inner input, also drawn as the animated overlay. */
	placeholder?: string;
	/** Helper copy under the field, linked through `aria-describedby`. */
	description?: string;
	/** Element id. Falls back to `$props.id()`. */
	id?: string;
	/** Extra class on the field root. */
	class?: string;
	/** Caller ids merged ahead of the hint id. */
	'aria-describedby'?: string;
}

export type TagInputProps = Props;
