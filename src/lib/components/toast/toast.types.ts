import type { HTMLAttributes } from 'svelte/elements';

/**
 * Props for Toast — ported from ARC `registry/components/toast/toast.tsx`.
 * Named `Props` per harness standard.
 *
 * A single-shot confirmation toast. There is no bits-ui Toast namespace, so
 * this is plain DOM carrying the source's own roles/aria (`role="status"`,
 * `aria-live="polite"`, `aria-atomic="true"`).
 */
export interface Props extends HTMLAttributes<HTMLDivElement> {
	/** Headline of the toast. */
	title: string;
	/** Optional details rendered under the title. */
	description?: string;
	/** Controls visibility. Flipping back to `true` resets the dismissed state. */
	open?: boolean;
	/** Fired with `false` when the toast dismisses (timer or close button). */
	onOpenChange?: (open: boolean) => void;
	/** Milliseconds before the toast closes itself. Defaults to 4500. `<= 0` disables the timer. */
	duration?: number;
	class?: string;
}

export type ToastProps = Props;
