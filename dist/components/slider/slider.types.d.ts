import type { HTMLAttributes } from 'svelte/elements';
import type { Snippet } from 'svelte';
export type SliderValue = number | [number, number];
export interface SliderMark {
    value: number;
    label?: string;
}
/**
 * Props for Slider — ported from ARC `registry/components/slider/slider.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 */
export interface Props<T extends SliderValue = number> extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
    label: string;
    value?: T;
    defaultValue?: T;
    onValueChange?: (value: T) => void;
    onValueCommit?: (value: T) => void;
    min?: number;
    max?: number;
    step?: number;
    largeStep?: number;
    marks?: (number | SliderMark)[];
    minStepsBetweenThumbs?: number;
    format?: (value: number) => string;
    showValue?: boolean;
    thumbLabels?: [string, string];
    start?: Snippet;
    end?: Snippet;
    name?: string;
    disabled?: boolean;
    className?: string;
    class?: string;
    ref?: HTMLElement | null;
}
export type SliderProps<T extends SliderValue = number> = Props<T>;
