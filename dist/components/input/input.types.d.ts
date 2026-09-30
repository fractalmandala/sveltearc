import type { HTMLInputAttributes } from 'svelte/elements';
/**
 * Port of ARC `Input` — `registry/components/input/input.tsx`.
 *
 * Extends the native input attributes (the React source extends
 * `InputHTMLAttributes<HTMLInputElement>`) and adds the field contract.
 * `className` maps to Svelte's `class`.
 */
export interface Props extends HTMLInputAttributes {
    /** Visible label, tied to the input. */
    label: string;
    /** Helper copy under the field, linked through `aria-describedby`. */
    description?: string;
    /** Error copy. Sets `aria-invalid` and renders a `role="alert"` row. */
    error?: string;
    /** Bindable ref to the native input element. */
    ref?: HTMLInputElement | null;
}
export type InputProps = Props;
