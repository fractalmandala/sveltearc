export interface BreadcrumbItem {
	label: string;
	href?: string;
	/** Runs when the crumb is chosen. Without an href the crumb renders as a button, for paths that live in local state. */
	onClick?: (event: MouseEvent) => void;
	onclick?: (event: MouseEvent) => void;
}

/**
 * Props for Breadcrumb — ported from ARC `registry/components/breadcrumb/breadcrumb.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 */
export interface Props {
	items: BreadcrumbItem[];
	ariaLabel?: string;
	class?: string;
	className?: string;
}

export type BreadcrumbProps = Props;
