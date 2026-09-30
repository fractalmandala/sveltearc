<script lang="ts">
	import Avatar from '$lib/components/avatar/avatar.svelte';
	import styles from './avatar-group.module.css';
	import type { Props } from './avatar-group.types';

	let {
		members,
		max = 4,
		size = 'md',
		label = 'Team members',
		class: className,
		...rest
	}: Props = $props();

	const visible = $derived(members.slice(0, Math.max(0, max)));
	const overflow = $derived(Math.max(0, members.length - visible.length));
	const count = $derived(visible.length + (overflow > 0 ? 1 : 0));
	const classes = $derived([styles.group, styles[size], className].filter(Boolean).join(' '));
</script>

<!-- Phase 1 still-state: the stack renders statically. The slot open/close spring and
     the overflow count roll are Phase 2 (MOTION-CONVENTIONS.md). -->
<div class={classes} role="group" aria-label={label} style={`--count: ${count}`} {...rest}>
	{#each visible as member, index (member.name)}
		<span class={styles.slot} style={`--index: ${index}`}>
			<span class={styles.lift}>
				<Avatar
					class={styles.avatar}
					name={member.name}
					src={member.src}
					status={member.status}
					{size}
				/>
				<span class={styles.tip} aria-hidden="true">{member.name}</span>
			</span>
		</span>
	{/each}
	{#if overflow > 0}
		<span class={styles.slot} style={`--index: ${visible.length}`}>
			<span
				class={[styles.lift, styles.overflow, styles[size]].filter(Boolean).join(' ')}
				role="img"
				aria-label={`${overflow} more ${label.toLowerCase()}`}
			>
				<span class={styles.count} aria-hidden="true">+{overflow}</span>
			</span>
		</span>
	{/if}
</div>
