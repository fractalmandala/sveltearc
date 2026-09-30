/**
 * Port of ARC `InlineEdit` — `registry/components/inline-edit/inline-edit.tsx`.
 *
 * The ARC source is a standalone composite (it does not extend the native
 * input attributes), so this interface lists the full contract explicitly.
 * `className` maps to Svelte's `class`.
 */
export interface Props {
	/** The saved value. A new value from outside replaces the text while it is not being edited. */
	value: string;
	/** Persists the new value. Return a promise to show the saving state, and reject it to roll back. */
	onSave: (next: string) => void | Promise<unknown>;
	/** Accessible name, for example "Project name". */
	label: string;
	/** Returns a message when the draft cannot be saved. */
	validate?: (next: string) => string | null | undefined;
	/** Shown when the value is empty. */
	placeholder?: string;
	/** Wraps onto several lines and grows in height. Enter still saves; Shift+Enter adds a line break. */
	multiline?: boolean;
	/** `title` for names and headings, `body` for descriptions. */
	variant?: 'title' | 'body';
	/** The element that holds the text, so a title can stay a heading. */
	as?: 'span' | 'p' | 'h1' | 'h2' | 'h3';
	/** Extra class on the root. */
	class?: string;
}

export type InlineEditProps = Props;
