import type { HTMLTextareaAttributes } from 'svelte/elements';

export type MentionKind = 'person' | 'channel';

export interface MentionPerson {
	id: string;
	name: string;
	/** One short line under the name, such as a job title. */
	role?: string;
	/** Portrait URL. Initials show when it is missing. */
	avatar?: string;
}

export interface MentionChannel {
	id: string;
	name: string;
	description?: string;
	members?: number;
}

/** A mention inside `text`. `start` and `end` are character offsets; the text between them is `@label` or `#label`. */
export interface Mention {
	kind: MentionKind;
	id: string;
	label: string;
	start: number;
	end: number;
}

export interface MentionValue {
	text: string;
	mentions: Mention[];
}

export interface MentionInputHandle {
	focus: () => void;
	/** Inserts text at the caret, as if typed. */
	insert: (text: string) => void;
	/** Types a trigger at the caret so the suggestions open, adding a space first when needed. */
	openSuggestions: (kind: MentionKind) => void;
	clear: () => void;
	textarea: HTMLTextAreaElement | null;
}

/**
 * Port of ARC `MentionInput` — `registry/components/mention-input/mention-input.tsx`.
 *
 * Extends the native textarea attributes and adds the mention contract.
 * `className` maps to Svelte's `class`. The structured `value`
 * (`{ text, mentions }`) is `$bindable()` in the component; the imperative
 * handle (`focus`, `insert`, `openSuggestions`, `clear`) is exposed through
 * a bindable `ref`.
 */
export interface Props extends HTMLTextareaAttributes {
	/** Structured value: plain text plus the `mentions` array with offsets. */
	value?: MentionValue;
	/** Initial value for uncontrolled use. */
	defaultValue?: MentionValue;
	/** Fires on every edit with the next structured value. */
	onChange?: (value: MentionValue) => void;
	/** People offered after `@`. Leave it out to turn person mentions off. */
	people?: MentionPerson[];
	/** Channels offered after `#`. Leave it out to turn channel mentions off. */
	channels?: MentionChannel[];
	/** Called when a suggestion becomes a mention. */
	onMentionAdd?: (mention: Mention) => void;
	/** With `submitOnEnter`, Enter submits and Shift+Enter adds a line. */
	onSubmit?: (value: MentionValue) => void;
	/** Enter submits instead of adding a line. Off by default. */
	submitOnEnter?: boolean;
	placeholder?: string;
	/** Minimum visible rows used when measuring the autosize height. */
	minRows?: number;
	/** The field grows to this many rows, then scrolls. */
	maxRows?: number;
	/** Where suggestions open. `auto` flips above when there is no room below. */
	placement?: 'auto' | 'top' | 'bottom';
	/** Maximum suggestions shown. */
	maxSuggestions?: number;
	disabled?: boolean;
	name?: string;
	id?: string;
	'aria-label'?: string;
	'aria-describedby'?: string;
	class?: string;
	/** Bindable imperative handle (`focus`, `insert`, `openSuggestions`, `clear`). */
	ref?: MentionInputHandle | null;
}

export type MentionInputProps = Props;
