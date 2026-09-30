import type { Snippet } from 'svelte';
export interface TabsProps {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    class?: string;
    children?: Snippet;
}
export interface TabsListProps {
    class?: string;
    'aria-label'?: string;
    loop?: boolean;
    children?: Snippet;
}
export interface TabsTriggerProps {
    value: string;
    disabled?: boolean;
    class?: string;
    children?: Snippet;
}
export interface TabsContentProps {
    value: string;
    forceMount?: boolean;
    class?: string;
    children?: Snippet;
}
export interface Props extends TabsProps {
}
