import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';

export type Platform = 'mac' | 'other';

export interface ShortcutToken {
	/** What the key cap shows. */
	label: string;
	/** Physical key id, matched against held keys. */
	id: string;
	spoken: string;
}

export interface ShortcutBinding {
	shortcut: string;
	label: string;
}

export interface ShortcutListItem {
	label: string;
	shortcut: string;
	/** Extra words that match when searching. */
	keywords?: string;
}

export interface ShortcutListGroup {
	label: string;
	items: ShortcutListItem[];
}

export interface KbdProps extends HTMLAttributes<HTMLElement> {
	children: Snippet;
	/** Draws the key pushed down and lit, such as while it is held. */
	pressed?: boolean;
	size?: 'sm' | 'md';
}

export interface ShortcutKeysProps {
	shortcut: string;
	platform?: Platform;
	/** Held key ids from `usePressedKeys`; matching caps light up. */
	pressed?: ReadonlySet<string>;
	size?: 'sm' | 'md';
	class?: string;
}

/**
 * Port of ARC `ShortcutRecorder` — `registry/components/shortcut-recorder/shortcut-recorder.tsx`.
 *
 * The recorder is a `<button>` that captures a key combination, so props
 * extend the native button attributes. `className` maps to Svelte's `class`.
 * The recorded shortcut string (`"mod+shift+k"`, or `null` when empty) is
 * `$bindable()` in the component.
 */
export interface Props extends HTMLButtonAttributes {
	/** Visible label naming the action the shortcut is recorded for. */
	label: string;
	/** Visually hide the label (it stays available to assistive technology). */
	hideLabel?: boolean;
	/** Recorded shortcut string, or `null` when empty. `bind:value` for two-way use. */
	value?: string | null;
	/** Initial shortcut for uncontrolled use. */
	defaultValue?: string | null;
	/**
	 * Fires when the shortcut changes. `replaced` is the binding the new
	 * shortcut was taken from after "Use anyway", so the caller can unbind it.
	 */
	onValueChange?: (value: string | null, details: { replaced?: ShortcutBinding }) => void;
	/** What the reset button restores. Defaults to `defaultValue`. */
	resetValue?: string | null;
	/** Shortcuts already in use. Recording one of them asks before taking it. */
	bindings?: ShortcutBinding[];
	/** Also warn about combinations the browser or system keeps. On by default. */
	warnReserved?: boolean;
	/** Require a modifier (function keys are always allowed). On by default. */
	requireModifier?: boolean;
	/** Platform override for key caps. Auto-detected when omitted. */
	platform?: Platform;
	/** Placeholder shown when no shortcut is recorded. */
	placeholder?: string;
	/** Helper copy under the field, linked through `aria-describedby`. */
	description?: string;
	disabled?: boolean;
	id?: string;
	class?: string;
}

export type ShortcutRecorderProps = Props;

export interface ShortcutListProps {
	/** Grouped shortcuts shown in the cheatsheet. */
	groups: ShortcutListGroup[];
	/** Accessible name of the list. */
	label?: string;
	/** Show the search field. On by default. */
	searchable?: boolean;
	/** Placeholder of the search field. */
	searchPlaceholder?: string;
	/** Light up caps as keys are held. On by default. */
	highlightPressed?: boolean;
	/** Platform override for key caps. Auto-detected when omitted. */
	platform?: Platform;
	/** Extra class for the list root. */
	class?: string;
}
