<script lang="ts">
	import { LinkPreview } from 'bits-ui';
	import type { HoverCardProps } from './hover-card.types';
	import styles from './hover-card.module.css';

	let {
		children,
		content,
		side = 'bottom',
		align = 'start',
		openDelay = 500,
		closeDelay = 140,
		class: classNameProp,
		className,
		...restProps
	}: HoverCardProps = $props();

	const cardClasses = $derived([styles.card, classNameProp, className].filter(Boolean).join(' '));
</script>

<LinkPreview.Root {openDelay} {closeDelay}>
	<LinkPreview.Trigger {...restProps}>
		{#snippet child({ props })}
			<span {...props} style="display: inline-block;">
				{@render children?.()}
			</span>
		{/snippet}
	</LinkPreview.Trigger>
	<LinkPreview.Portal>
		<LinkPreview.Content
			{side}
			{align}
			sideOffset={8}
			collisionPadding={12}
			class={cardClasses}
			role="tooltip"
		>
			{#if content}
				{@render content()}
			{/if}
		</LinkPreview.Content>
	</LinkPreview.Portal>
</LinkPreview.Root>
