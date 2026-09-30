import type { Snippet } from 'svelte';
import type { ToastStackStore } from './toast-stack-store.svelte';

export type ToastType = 'success' | 'info' | 'warning' | 'error' | 'loading';

export interface ToastAction {
	label: string;
	/** Runs the action. The toast closes afterwards unless the handler updates it, so an Undo can morph the toast into its result. */
	onClick: (id: string) => void;
}

export interface ToastOptions {
	/** Reuse an id to update a toast in place instead of stacking a new one. */
	id?: string;
	type?: ToastType;
	title: string;
	description?: string;
	action?: ToastAction;
	/** Milliseconds before the toast closes itself. Defaults by type; loading toasts wait for an update. Pass Infinity to keep it until closed. */
	duration?: number;
}

export interface ToastStackApi {
	/** Shows a toast and returns its id. */
	toast: (options: ToastOptions) => string;
	/** Morphs a toast in place: icon, copy, and height animate to the new content and its timer restarts. Pass `action: undefined` to remove the action. */
	update: (id: string, patch: Partial<Omit<ToastOptions, 'id'>>) => void;
	/** Dismisses one toast, or every toast when called without an id. */
	dismiss: (id?: string) => void;
}

/** Stored toast with queue bookkeeping. `seq` orders the stack; `version` restarts the clock on update. */
export interface ToastRecord {
	id: string;
	type: ToastType;
	title: string;
	description?: string;
	action?: ToastAction;
	duration: number;
	seq: number;
	version: number;
}

/** Still-state geometry for one item, computed by `layoutStack`. */
export interface ToastTarget {
	y: number;
	scale: number;
	height: number;
	opacity: number;
	content: number;
}

/**
 * Viewport props — ported from ARC `ToastStackProps`
 * (`registry/components/toast-stack/toast-stack.tsx`). Named `Props` per
 * harness standard; this is the interface the prop-parity gate reads.
 */
export interface Props {
	/** Accessible name of the notification region. */
	label?: string;
	/** Which bottom corner (or center) the stack anchors to. */
	position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
	/** Pin the stack inside the nearest positioned ancestor instead of the window. */
	contained?: boolean;
	/** How many toasts show at once. Older ones wait behind. */
	visibleToasts?: number;
	/** Alt+T moves focus into the stack. */
	hotkey?: boolean;
	class?: string;
}

/**
 * Provider props — ported from ARC `ToastStackProviderProps`.
 * Separate from `Props` so each component is typed by exactly its own ARC
 * contract (the parity gate reads `Props` for the viewport pair entry).
 */
export interface ProviderProps {
	/** The subtree the toast queue is scoped to. */
	children?: Snippet;
	/** Base lifetime in milliseconds. Warnings and errors stay 1.6 times longer. */
	duration?: number;
	/** Oldest toasts beyond this count are dropped from the queue. */
	limit?: number;
	/**
	 * Inject a pre-made store (demo/test escape hatch). When omitted the
	 * provider creates one from `duration`/`limit`, exactly like ARC.
	 */
	store?: ToastStackStore;
}

/** Viewport-only view of the shared props. */
export type ToastStackProps = Props;

/** Provider-only view of the shared props. */
export type ToastStackProviderProps = ProviderProps;
