<script lang="ts">
	import { Tabs } from 'bits-ui';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import styles from './tabs.module.css';
	import type { TabsListProps } from './tabs.types';

	let { class: className, children, ...rest }: TabsListProps = $props();

	let shell = $state<HTMLDivElement | null>(null);
	let viewport = $state<HTMLDivElement | null>(null);
	let list = $state<HTMLDivElement | null>(null);

	let overflow = $state(false);
	let left = $state(false);
	let right = $state(false);

	function update() {
		const frame = shell;
		const scroll = viewport;
		if (!frame || !scroll) return;
		const max = Math.max(0, scroll.scrollWidth - scroll.clientWidth);
		overflow = scroll.scrollWidth > frame.clientWidth + 1;
		left = scroll.scrollLeft > 1;
		right = scroll.scrollLeft < max - 1;
	}

	function scrollTabs(direction: number) {
		if (!viewport) return;
		viewport.scrollBy({
			left: direction * (viewport.clientWidth || 0) * 0.75,
			behavior: 'smooth'
		});
	}

	$effect(() => {
		const frame = shell;
		const scroll = viewport;
		const content = list;
		if (!frame || !scroll || !content) return;
		const observer = new ResizeObserver(update);
		observer.observe(frame);
		observer.observe(scroll);
		observer.observe(content);
		scroll.addEventListener('scroll', update, { passive: true });
		update();
		return () => {
			observer.disconnect();
			scroll.removeEventListener('scroll', update);
		};
	});

	const listClasses = $derived([styles.list, className].filter(Boolean).join(' '));
</script>

<div
	bind:this={shell}
	class={styles.listShell}
	data-overflow={overflow ? 'true' : undefined}
	data-left={left ? 'true' : undefined}
	data-right={right ? 'true' : undefined}
>
	{#if overflow}
		<button
			type="button"
			class={`${styles.scrollButton} ${styles.scrollLeft}`}
			aria-label="Scroll tabs left"
			disabled={!left}
			onclick={() => scrollTabs(-1)}
		>
			<ChevronLeft size={17} aria-hidden="true" />
		</button>
	{/if}

	<div bind:this={viewport} class={styles.viewport}>
		<Tabs.List bind:ref={list} class={listClasses} {...rest}>
			{@render children?.()}
		</Tabs.List>
	</div>

	{#if overflow}
		<button
			type="button"
			class={`${styles.scrollButton} ${styles.scrollRight}`}
			aria-label="Scroll tabs right"
			disabled={!right}
			onclick={() => scrollTabs(1)}
		>
			<ChevronRight size={17} aria-hidden="true" />
		</button>
	{/if}
</div>
