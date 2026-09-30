<script lang="ts">
	import type { Props, Theme } from './theme-switch.types';
	import styles from './theme-switch.module.css';
	import { Button } from '../button';
	import { Sun, Moon } from '@lucide/svelte';

	let {
		theme = $bindable('light'),
		variant = 'reveal',
		onThemeChange,
		label,
		iconOnly = false,
		class: classNameProp,
		className
	}: Props = $props();

	let settled = $state(false);

	$effect(() => {
		const first = requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				settled = true;
			});
		});
		return () => cancelAnimationFrame(first);
	});

	const nextTheme = $derived<Theme>(theme === 'light' ? 'dark' : 'light');

	function handleClick(event: MouseEvent & { currentTarget: HTMLButtonElement }) {
		const next = nextTheme;
		theme = next;
		onThemeChange?.(next, variant, event.currentTarget);
	}

	const buttonClasses = $derived(
		[
			styles.themeSwitch,
			styles[variant],
			iconOnly ? styles.iconOnly : '',
			settled ? styles.settled : '',
			classNameProp,
			className
		]
			.filter(Boolean)
			.join(' ')
	);
</script>

<Button
	type="button"
	size="sm"
	variant="secondary"
	class={buttonClasses}
	data-theme={theme}
	aria-label={label ?? `Switch to ${nextTheme} mode`}
	aria-pressed={theme === 'dark'}
	onclick={handleClick}
>
	<span class={styles.iconWrap}>
		<span class={styles.icon} aria-hidden="true">
			{#if theme === 'light'}
				<Sun size={15} strokeWidth={1.9} />
			{:else}
				<Moon size={15} strokeWidth={1.9} />
			{/if}
		</span>
	</span>
	{#if !iconOnly}
		<span class={styles.label}>Switch theme</span>
	{/if}
</Button>
