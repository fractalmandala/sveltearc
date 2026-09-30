<script lang="ts">
	import { getContext } from 'svelte';
	import { DropdownMenu } from 'bits-ui';
	import { MoreHorizontal } from '@lucide/svelte';
	import { SWIPE_GROUP, type SwipeGroupContext } from './swipe-actions-context';
	import type { SwipeActionsRowProps } from './swipe-actions.types';
	import styles from './swipe-actions.module.css';

	let {
		label,
		leading = [],
		trailing = [],
		fullSwipe = true,
		children,
		class: classNameProp,
		className
	}: SwipeActionsRowProps = $props();

	const uid = $props.id();
	const group = getContext<SwipeGroupContext | undefined>(SWIPE_GROUP);

	let offsetX = $state(0);
	let isDragging = $state(false);
	let startX = 0;
	let menuOpen = $state(false);

	function onPointerDown(e: PointerEvent) {
		if ((e.target as HTMLElement)?.closest('button, a, [role="menuitem"]')) return;
		startX = e.clientX - offsetX;
		isDragging = true;
		group?.setOpenId(uid);
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (!isDragging) return;
		const dx = e.clientX - startX;
		if (dx > 0 && leading.length === 0) return;
		if (dx < 0 && trailing.length === 0) return;
		offsetX = dx;
	}

	function onPointerUp(e: PointerEvent) {
		if (!isDragging) return;
		isDragging = false;
		const threshold = 50;
		if (offsetX > threshold && leading.length > 0) {
			offsetX = leading.length * 76;
		} else if (offsetX < -threshold && trailing.length > 0) {
			offsetX = -(trailing.length * 76);
		} else {
			offsetX = 0;
		}
	}

	const menuItems = $derived([
		...leading.map((action, index) => ({ action, side: 'leading' as const, index })),
		...trailing.map((action, index) => ({ action, side: 'trailing' as const, index }))
	]);

	const rowClasses = $derived([styles.row, classNameProp, className].filter(Boolean).join(' '));
</script>

<li
	class={rowClasses}
	data-dragging={isDragging ? '' : undefined}
	style="--swipe-action-width: 76px;"
>
	{#each leading as action, index (action.label)}
		<button
			type="button"
			tabindex="-1"
			aria-hidden="true"
			class={styles.layer}
			data-side="leading"
			data-tone={action.tone ?? 'neutral'}
			style="transform: translateX({Math.max(0, offsetX)}px); z-index: {leading.length - index};"
			onclick={() => {
				action.onSelect();
				offsetX = 0;
			}}
		>
			<span class={styles.anchor}>
				<span class={styles.glyph}>
					{#if action.icon}
						<span class={styles.icon}>{@render action.icon()}</span>
					{/if}
					<span class={styles.label}>{action.label}</span>
				</span>
			</span>
		</button>
	{/each}

	{#each trailing as action, index (action.label)}
		<button
			type="button"
			tabindex="-1"
			aria-hidden="true"
			class={styles.layer}
			data-side="trailing"
			data-tone={action.tone ?? 'neutral'}
			style="transform: translateX({Math.min(0, offsetX)}px); z-index: {index + 1};"
			onclick={() => {
				action.onSelect();
				offsetX = 0;
			}}
		>
			<span class={styles.anchor}>
				<span class={styles.glyph}>
					{#if action.icon}
						<span class={styles.icon}>{@render action.icon()}</span>
					{/if}
					<span class={styles.label}>{action.label}</span>
				</span>
			</span>
		</button>
	{/each}

	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class={styles.content}
		style="transform: translateX({offsetX}px); transition: {isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.32, 0.72, 0, 1)'};"
		onpointerdown={onPointerDown}
		onpointermove={onPointerMove}
		onpointerup={onPointerUp}
		onpointercancel={onPointerUp}
	>
		<div class={styles.body}>{@render children?.()}</div>

		{#if menuItems.length > 0}
			<DropdownMenu.Root bind:open={menuOpen}>
				<DropdownMenu.Trigger
					class={styles.more}
					data-swipe-more=""
					aria-label="More actions for {label}"
				>
					<MoreHorizontal size={18} strokeWidth={1.75} aria-hidden="true" />
				</DropdownMenu.Trigger>
				<DropdownMenu.Portal>
					<DropdownMenu.Content
						class={styles.menu}
						align="end"
						sideOffset={6}
						collisionPadding={12}
					>
						{#each menuItems as { action, side, index }, order (`${side}-${index}`)}
							<DropdownMenu.Item
								class={styles.item}
								data-tone={action.tone}
								style="--i: {order};"
								onSelect={() => {
									action.onSelect();
									offsetX = 0;
								}}
							>
								{#if action.icon}
									<span class={styles.itemIcon} aria-hidden="true">
										{@render action.icon()}
									</span>
								{/if}
								<span>{action.label}</span>
							</DropdownMenu.Item>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>
		{/if}
	</div>
</li>
