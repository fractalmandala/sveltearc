import type { Snippet } from "svelte";
/**
 * Port note (delta vs React API): `icon` was `ReactNode` — now a `Snippet`
 * (snippets are first-class values; declare one and store it in the item).
 * Recorded in the manifest `gaps` per the plan's accepted ReactNode → Snippet rule.
 */
export interface DropdownItem {
    label: string;
    onSelect?: () => void;
    disabled?: boolean;
    icon?: Snippet;
    destructive?: boolean;
    separatorBefore?: boolean;
}
export interface Props {
    label: string;
    /** Keyed by `label` in the component's each-block, same as the React original — labels should be unique. */
    items: DropdownItem[];
    /** Trigger icon; `ReactNode` in the React API → `Snippet`. */
    icon?: Snippet;
}
export type DropdownMenuProps = Props;
