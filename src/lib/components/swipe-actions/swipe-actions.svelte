<script lang="ts">
	import { setContext } from 'svelte';
	import { SWIPE_GROUP, type SwipeGroupContext } from './swipe-actions-context';
	import type { SwipeActionsProps } from './swipe-actions.types';
	import styles from './swipe-actions.module.css';

	let {
		label,
		children,
		class: classNameProp,
		className
	}: SwipeActionsProps = $props();

	let openId = $state<string | null>(null);

	setContext<SwipeGroupContext>(SWIPE_GROUP, {
		openId: () => openId,
		setOpenId: (id) => (openId = id)
	});

	const surfaceClasses = $derived([styles.surface, classNameProp, className].filter(Boolean).join(' '));
</script>

<div class={surfaceClasses}>
	<ul role="list" aria-label={label} tabindex="-1" class={styles.list}>
		{@render children?.()}
	</ul>
</div>
