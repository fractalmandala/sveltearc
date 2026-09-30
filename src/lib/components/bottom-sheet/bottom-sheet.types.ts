import type { Snippet } from 'svelte';

export interface Props {
	title: string;
	children?: Snippet;
	trigger?: Snippet<[{ props: Record<string, unknown> }]>;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	description?: string;
	detents?: number[];
	initialDetent?: number;
	onDetentChange?: (index: number) => void;
	closeLabel?: string;
	className?: string;
	class?: string;
}

export type BottomSheetProps = Props;
