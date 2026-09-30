import type { Snippet } from 'svelte';
export interface SplitButtonAction {
    label: string;
    onSelect?: () => void;
    disabled?: boolean;
    destructive?: boolean;
    icon?: Snippet;
}
export interface Props {
    label: string;
    actions: SplitButtonAction[];
    onClick?: () => void;
    disabled?: boolean;
    icon?: Snippet;
    variant?: 'primary' | 'secondary';
}
export type SplitButtonProps = Props;
