<script lang="ts">
	import type { Props } from './alert.types';
	import styles from './alert.module.css';
	import { Check, CircleX, Info, TriangleAlert, X } from '@lucide/svelte';

	let {
		tone = 'info',
		title,
		children,
		open = $bindable(undefined),
		onDismiss,
		class: classNameProp,
		className,
		...restProps
	}: Props = $props();

	let dismissed = $state(false);

	const isVisible = $derived(open !== undefined ? open : !dismissed);

	function handleDismiss() {
		if (open === undefined) {
			dismissed = true;
		} else {
			open = false;
		}
		onDismiss?.();
	}

	const iconMap = {
		info: Info,
		success: Check,
		warning: TriangleAlert,
		danger: CircleX
	};

	const IconComponent = $derived(iconMap[tone] ?? Info);
	const alertClasses = $derived(
		[styles.alert, styles[tone], classNameProp, className].filter(Boolean).join(' ')
	);
</script>

{#if isVisible}
	<div class={styles.presence}>
		<div
			class={alertClasses}
			role={tone === 'danger' ? 'alert' : 'status'}
			{...restProps}
		>
			<span class={styles.icon}>
				<span class={styles.glyph}>
					<IconComponent size={18} aria-hidden="true" />
				</span>
			</span>
			<div class={styles.copy}>
				<div class={styles.content}>
					<strong class={styles.title}>
						<span class={styles.line}>{title}</span>
					</strong>
					{#if children}
						<div class={styles.description}>
							{@render children()}
						</div>
					{/if}
				</div>
			</div>
			{#if onDismiss}
				<button
					type="button"
					class={styles.dismiss}
					aria-label={`Dismiss: ${title}`}
					onclick={handleDismiss}
				>
					<X size={16} strokeWidth={1.75} aria-hidden="true" />
				</button>
			{/if}
		</div>
	</div>
{/if}
