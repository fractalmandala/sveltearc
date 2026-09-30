import type { HTMLInputAttributes } from 'svelte/elements';

/**
 * Props for PasswordField — ported from ARC `registry/components/password-field/password-field.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 */
export interface Props extends Omit<HTMLInputAttributes, 'type'> {
	label: string;
	description?: string;
	value?: string;
	id?: string;
	class?: string;
	className?: string;
}

export type PasswordFieldProps = Props;
