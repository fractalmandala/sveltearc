import type { HTMLAttributes } from 'svelte/elements';

/**
 * Port of ARC `Avatar` — `registry/components/avatar/avatar.tsx`.
 *
 * Not part of Batch D's Radix set: ported here because `notification-center`
 * depends on it. `next/image` (`fill`) becomes a plain `<img>` positioned to
 * fill the avatar box.
 */
export interface Props extends HTMLAttributes<HTMLSpanElement> {
	/** Full name; drives the initials fallback and the accessible label. */
	name: string;
	/** Portrait URL. Falls back to initials when absent or on load error. */
	src?: string;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	status?: 'online' | 'offline';
}
