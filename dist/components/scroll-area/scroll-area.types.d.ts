import type { Snippet } from 'svelte';
export type CSSProperties = string | Record<string, string | number | undefined>;
export interface ScrollAreaEdges {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
}
/**
 * Props for ScrollArea — ported from ARC `registry/components/scroll-area/scroll-area.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 */
export interface Props {
    children?: Snippet;
    orientation?: "vertical" | "horizontal" | "both";
    fade?: number;
    scrollbars?: "auto" | "always";
    hideDelay?: number;
    maxHeight?: string | number;
    snap?: string | number;
    label?: string;
    wheelToHorizontal?: boolean;
    viewportClassName?: string;
    viewportStyle?: CSSProperties;
    viewportRef?: HTMLElement | null;
    onScroll?: (event: UIEvent) => void;
    onEdgeChange?: (edges: ScrollAreaEdges) => void;
    class?: string;
    className?: string;
}
export type ScrollAreaProps = Props;
