<script lang="ts">
	import styles from './avatar.module.css';
	import type { Props } from './avatar.types';

	let { name, src, size = 'md', status, class: className, ...rest }: Props = $props();

	const initials = $derived(
		name
			.trim()
			.split(/\s+/)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase() ?? '')
			.join('')
	);

	let failedSrc = $state<string | undefined>(undefined);
	const showImage = $derived(Boolean(src) && failedSrc !== src);
	const classes = $derived([styles.avatar, styles[size], className].filter(Boolean).join(' '));

	/** A photo that is already decoded shows at once; one still loading waits, then fades in. */
	function trackLoad(node: HTMLImageElement) {
		if (!node.complete) node.dataset.loading = '';
		const done = () => delete node.dataset.loading;
		node.addEventListener('load', done);
		return { destroy: () => node.removeEventListener('load', done) };
	}
</script>

<span {...rest} class={classes} role="img" aria-label={status ? `${name}, ${status}` : name}>
	{#if showImage}
		<img
			{src}
			alt=""
			use:trackLoad
			onerror={() => (failedSrc = src)}
			style="position: absolute; inset: 0; width: 100%; height: 100%;"
		/>
	{:else}
		<span class={src ? styles.fallback : undefined} aria-hidden="true">{initials}</span>
	{/if}
	{#if status}
		<i class={[styles.status, styles[status]].join(' ')} aria-hidden="true"></i>
	{/if}
</span>
