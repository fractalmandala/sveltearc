import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';

export interface AnnouncementAction {
	label: string;
	href?: string;
	onClick?: () => void;
}

export interface Announcement {
	/** Stable id, reported to callbacks. */
	id: string;
	/**
	 * Message body. ARC takes a ReactNode (usually a string); the port accepts
	 * a plain string or a Snippet for rich content.
	 */
	message: string | Snippet;
	action?: AnnouncementAction;
	/** Counts down to a moment, for example the end of a sale. */
	countdown?: { to: Date | string | number; label?: string };
}

/**
 * Props for AnnouncementBar — ported from ARC
 * `registry/components/announcement-bar/announcement-bar.tsx`.
 * Named `Props` per harness standard.
 *
 * There is no bits-ui primitive here; this is plain DOM carrying the source's
 * own carousel roles/aria. `ref` is `$bindable` for the outer section.
 */
export interface Props extends HTMLAttributes<HTMLElement> {
	messages: Announcement[];
	/** Remembers dismissal under this id. Change the id to show a new campaign to everyone again. */
	id?: string;
	/** Whether the bar is shown. Leave it out to let the component manage it. */
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/** Index of the visible message. */
	index?: number;
	defaultIndex?: number;
	onIndexChange?: (index: number) => void;
	/** Milliseconds each message stays before the next one. Defaults to 6000. */
	interval?: number;
	/** Rotate automatically. Pauses on hover, focus, or a hidden tab, and is turned off when the visitor prefers reduced motion. Defaults to true. */
	autoPlay?: boolean;
	/** Show previous, next, and pause controls when there are several messages. Defaults to false: only the close button shows. */
	controls?: boolean;
	dismissible?: boolean;
	tone?: 'neutral' | 'inverted';
	onAction?: (announcement: Announcement) => void;
	onCountdownEnd?: (announcement: Announcement) => void;
	/** Accessible name of the region. */
	label?: string;
	class?: string;
	ref?: HTMLElement | null;
}

export type AnnouncementBarProps = Props;
