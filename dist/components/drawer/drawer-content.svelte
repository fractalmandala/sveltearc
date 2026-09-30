<script lang="ts">
	import { getContext } from 'svelte';
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { X } from '@lucide/svelte';
	import styles from './drawer.module.css';
	import { DRAWER_ROOT, type DrawerRootContext } from './drawer-context';
	import type { Props } from './drawer.types';

	let {
		title,
		description,
		side = 'right',
		container = null,
		class: classNameProp,
		className,
		children,
		ref = $bindable(null),
		...rest
	}: Props = $props();

	const root = getContext<DrawerRootContext | undefined>(DRAWER_ROOT);
	const open = $derived(root ? root.open() : null);

	const classes = $derived([styles.content, classNameProp, className].filter(Boolean).join(' '));
</script>

{#snippet inner()}
	<div class={[styles.header, styles.handle].filter(Boolean).join(' ')}>
		<div>
			<DialogPrimitive.Title class={styles.title}>
				<span class={styles.swap}>{title}</span>
			</DialogPrimitive.Title>
			{#if description}
				<DialogPrimitive.Description class={styles.description}>
					<span class={styles.swap}>{description}</span>
				</DialogPrimitive.Description>
			{/if}
		</div>
		<DialogPrimitive.Close class={styles.close} aria-label="Close drawer">
			<X size={18} strokeWidth={1.8} aria-hidden="true" />
		</DialogPrimitive.Close>
	</div>
	<div class={styles.body}>{@render children?.()}</div>
{/snippet}

<DialogPrimitive.Portal to={container ?? undefined}>
	<DialogPrimitive.Overlay
		class={`${styles.overlay} ${styles.keyframes}`}
		data-contained={container ? '' : undefined}
	/>
	<DialogPrimitive.Content
		{...rest}
		bind:ref
		data-side={side}
		data-contained={container ? '' : undefined}
		class={`${classes} ${styles.keyframes}`}
	>
		{@render inner()}
	</DialogPrimitive.Content>
</DialogPrimitive.Portal>
