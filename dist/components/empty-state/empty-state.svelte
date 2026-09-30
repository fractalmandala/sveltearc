<script lang="ts">
	import type { Props } from './empty-state.types';
	import styles from './empty-state.module.css';
	import { Folder } from '@lucide/svelte';

	let {
		title,
		description,
		action,
		icon,
		label,
		class: classNameProp,
		className,
		...restProps
	}: Props = $props();

	const rootClasses = $derived([styles.root, classNameProp, className].filter(Boolean).join(' '));
</script>

<section class={rootClasses} aria-label={label} {...restProps}>
	<div class={styles.icon} aria-hidden="true">
		<span class={styles.glyph}>
			{#if icon}
				{@render icon()}
			{:else}
				<Folder size={24} strokeWidth={1.5} />
			{/if}
		</span>
	</div>
	<div class={styles.frame}>
		<div class={styles.copy}>
			<h3>
				<span class={styles.line}>{title}</span>
			</h3>
			<p>
				<span class={styles.line}>{description}</span>
			</p>
		</div>
	</div>
	{#if action}
		<div class={styles.action}>
			{@render action()}
		</div>
	{/if}
</section>
