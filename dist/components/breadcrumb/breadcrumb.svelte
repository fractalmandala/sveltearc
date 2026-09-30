<script lang="ts">
	import type { Props } from './breadcrumb.types';
	import styles from './breadcrumb.module.css';
	import { ChevronRight } from '@lucide/svelte';

	let {
		items = [],
		ariaLabel = 'Breadcrumb',
		class: classNameProp,
		className
	}: Props = $props();

	const navClasses = $derived([classNameProp, className].filter(Boolean).join(' '));
</script>

<nav aria-label={ariaLabel} class={navClasses}>
	<ol class={styles.list}>
		{#each items as item, index (`${item.label}-${index}`)}
			{@const current = index === items.length - 1}
			{@const clickHandler = item.onclick ?? item.onClick}
			<li>
				{#if index > 0}
					<ChevronRight size={14} aria-hidden="true" />
				{/if}
				{#if !current && item.href}
					<a href={item.href} data-label={item.label} onclick={clickHandler}>
						{item.label}
					</a>
				{:else if !current && clickHandler}
					<button type="button" data-label={item.label} onclick={clickHandler}>
						{item.label}
					</button>
				{:else}
					<span aria-current={current ? 'page' : undefined} data-label={item.label}>
						{item.label}
					</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
