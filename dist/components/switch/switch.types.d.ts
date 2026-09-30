import type { ComponentProps } from 'svelte';
import { Switch } from 'bits-ui';
type BitsSwitchRoot = ComponentProps<typeof Switch.Root>;
/**
 * Port of ARC `Switch` — `registry/components/switch/switch.tsx`.
 *
 * Public props mirror the React source: the Bits UI root props (DOM button
 * attributes included), plus `label`, the controlled/uncontrolled checked pair,
 * a change callback, and a bindable `ref`.
 */
export interface Props extends Omit<BitsSwitchRoot, 'checked' | 'onCheckedChange' | 'child' | 'children' | 'ref'> {
    /** Controlled checked state. Use `bind:checked` for two-way. */
    checked?: boolean;
    /** Uncontrolled initial state, used only while `checked` is not provided. */
    defaultChecked?: boolean;
    /** Fired whenever the switch toggles. */
    onCheckedChange?: (checked: boolean) => void;
    /** Visible label beside the track; also used as `aria-label` when none is passed. */
    label?: string;
    /** Bits UI bindable ref to the root button element. */
    ref?: HTMLElement | null;
}
export {};
