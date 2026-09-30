<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import styles from './split-button.module.css';
	import type { Props } from './split-button.types';

	let {
		label,
		actions,
		onClick,
		disabled = false,
		icon,
		variant = 'primary'
	}: Props = $props();

	const groupClass = $derived(
		[styles.group, variant === 'secondary' ? styles.secondary : ''].filter(Boolean).join(' ')
	);
</script>

<DropdownMenu.Root>
	<div class={groupClass}>
		<button class={styles.primary} type="button" onclick={onClick} {disabled}>
			<span class={styles.primarySlot} aria-hidden="true">
				<span class={styles.primaryContent}>
					{#if icon}
						<span class={styles.mainIcon}>
							<span class={styles.iconPhase}>{@render icon()}</span>
						</span>
					{/if}
					<span class={styles.glyphs}>
						<span class={styles.glyph}>{label}</span>
					</span>
				</span>
			</span>
			<span class={styles.srOnly} aria-live="polite">{label}</span>
		</button>
		<DropdownMenu.Trigger class={styles.trigger} type="button" aria-label="{label} more actions" {disabled}>
			<ChevronDown class={styles.chevron} size={15} strokeWidth={1.8} aria-hidden="true" />
		</DropdownMenu.Trigger>
	</div>
	<DropdownMenu.Portal>
		<DropdownMenu.Content class={styles.menu} sideOffset={4} align="end" collisionPadding={12} loop>
			{#each actions as action, index (action.label)}
				<DropdownMenu.Item
					class={[styles.item, action.destructive ? styles.destructive : ''].filter(Boolean).join(' ')}
					style="--i: {index}"
					disabled={action.disabled}
					onSelect={action.onSelect}
				>
					{#if action.icon}
						<span class={styles.icon} aria-hidden="true">{@render action.icon()}</span>
					{/if}
					{action.label}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
