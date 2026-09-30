export interface AvatarGroupMember {
	name: string;
	src?: string;
	status?: 'online' | 'offline';
}

/**
 * Port of ARC `AvatarGroup` — `registry/components/avatar-group/avatar-group.tsx`.
 *
 * A compact stack of `Avatar`s with an overflow count. `className` maps to Svelte's `class`.
 */
export interface Props {
	/** The people to show, in order. */
	members: AvatarGroupMember[];
	/** How many to show before the `+N` overflow chip. */
	max?: number;
	/** Avatar diameter. */
	size?: 'sm' | 'md' | 'lg';
	/** Accessible group label. */
	label?: string;
	/** Extra classes merged onto the group. */
	class?: string;
}

export type AvatarGroupProps = Props;
