import type { Snippet } from 'svelte';
export interface SwipeAction {
    label: string;
    icon?: Snippet;
    tone?: 'neutral' | 'accent' | 'danger';
    onSelect: () => void;
    keepRow?: boolean;
}
export interface SwipeActionsProps {
    label: string;
    children?: Snippet;
    className?: string;
    class?: string;
}
export interface SwipeActionsRowProps {
    label: string;
    leading?: SwipeAction[];
    trailing?: SwipeAction[];
    fullSwipe?: boolean;
    children?: Snippet;
    className?: string;
    class?: string;
}
export interface Props {
    label: string;
    children?: Snippet;
    className?: string;
    class?: string;
    leading?: SwipeAction[];
    trailing?: SwipeAction[];
    fullSwipe?: boolean;
}
