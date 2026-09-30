import type { Snippet } from 'svelte';
export interface HoverCardStat {
    label: string;
    value: string | number;
}
export interface HoverCardProfileProps {
    name: string;
    role?: string;
    avatar?: string | Snippet;
    bio?: string;
    stats?: HoverCardStat[];
    meta?: Snippet;
}
export interface Props {
    children?: Snippet;
    content?: Snippet;
    side?: 'top' | 'bottom' | 'left' | 'right';
    align?: 'start' | 'center' | 'end';
    openDelay?: number;
    closeDelay?: number;
    className?: string;
    class?: string;
    instant?: boolean;
    reduced?: boolean;
    name?: string;
    role?: string;
    avatar?: string | Snippet;
    bio?: string;
    stats?: HoverCardStat[];
    meta?: Snippet;
}
export type HoverCardProps = Props;
