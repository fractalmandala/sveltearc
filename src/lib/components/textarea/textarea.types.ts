import type { HTMLTextareaAttributes } from 'svelte/elements';

/**
 * Port of ARC `Textarea` — `registry/components/textarea/textarea.tsx`.
 *
 * Extends the native textarea attributes (the React source extends
 * `TextareaHTMLAttributes<HTMLTextAreaElement>`) and adds the field contract.
 * `className` maps to Svelte's `class`.
 */
export interface Props extends HTMLTextareaAttributes {
	/** Visible label, tied to the textarea. */
	label: string;
	/** Helper copy under the field, linked through `aria-describedby`. */
	description?: string;
	/** Error copy. Sets `aria-invalid` and renders a `role="alert"` row. */
	error?: string;
	/** Bindable ref to the native textarea element. */
	ref?: HTMLTextAreaElement | null;
}

export type TextareaProps = Props;
