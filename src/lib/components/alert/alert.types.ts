import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

/**
 * Props for Alert — ported from ARC `registry/components/alert/alert.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 */
export interface Props extends HTMLAttributes<HTMLDivElement> {
	tone?: AlertTone;
	title: string;
	children?: Snippet;
	/** Controls presence. Hiding the alert collapses its height and fades it out. */
	open?: boolean;
	/** Shows a dismiss button. An uncontrolled alert collapses first, then calls this. */
	onDismiss?: () => void;
	class?: string;
	className?: string;
}

export type AlertProps = Props;
