<script lang="ts">
	import type { HoverCardProfileProps } from './hover-card.types';
	import styles from './hover-card.module.css';

	let {
		name,
		role,
		avatar,
		bio,
		stats = [],
		meta
	}: HoverCardProfileProps = $props();

	const initials = $derived(
		name
			.trim()
			.split(/\s+/)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase())
			.join('')
	);
</script>

<div class={styles.profile}>
	<div class={styles.head}>
		<span class={styles.avatar} aria-hidden="true">
			{#if typeof avatar === 'string'}
				<img src={avatar} alt="" width={48} height={48} decoding="async" />
			{:else if avatar}
				{@render avatar()}
			{:else}
				<span class={styles.initials}>{initials}</span>
			{/if}
		</span>
		<span class={styles.identity}>
			<span class={styles.name}>{name}</span>
			{#if role}
				<span class={styles.role}>{role}</span>
			{/if}
		</span>
	</div>
	{#if bio}
		<p class={styles.bio}>{bio}</p>
	{/if}
	{#if stats.length > 0}
		<dl class={styles.stats}>
			{#each stats as stat (stat.label)}
				<div class={styles.stat}>
					<dt>{stat.label}</dt>
					<dd>{stat.value}</dd>
				</div>
			{/each}
		</dl>
	{/if}
	{#if meta}
		<div class={styles.meta}>
			{@render meta()}
		</div>
	{/if}
</div>
