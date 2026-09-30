import type { HTMLButtonAttributes } from 'svelte/elements';

/**
 * Props for CopyButton — ported from ARC `registry/components/copy-button/copy-button.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 */
export interface Props extends Omit<HTMLButtonAttributes, 'value'> {
	value: string;
	label?: string;
	iconOnly?: boolean;
	variant?: 'outline' | 'plain';
	disabled?: boolean;
	onCopied?: () => void;
	class?: string;
	className?: string;
	ref?: HTMLButtonElement | null;
}

export type CopyButtonProps = Props;
