<script lang="ts">
	import { untrack } from 'svelte';
	import { Popover } from 'bits-ui';
	import Bell from '@lucide/svelte/icons/bell';
	import Check from '@lucide/svelte/icons/check';
	import CheckCheck from '@lucide/svelte/icons/check-check';
	import CircleCheck from '@lucide/svelte/icons/circle-check';
	import CircleDot from '@lucide/svelte/icons/circle-dot';
	import MessageCircle from '@lucide/svelte/icons/message-circle';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import X from '@lucide/svelte/icons/x';
	import Avatar from '$lib/components/avatar/avatar.svelte';
	import styles from './notification-center.module.css';
	import type { NotificationItem, Props } from './notification-center.types';

	let {
		notifications,
		label = 'Notifications',
		onReadChange,
		onDismiss,
		open,
		onOpenChange,
		avoidCollisions = true
	}: Props = $props();

	let internalOpen = $state(false);
	/** ARC uses `useState(initial)`, so later `notifications` changes are ignored. */
	let items = $state<NotificationItem[]>(untrack(() => notifications));
	let view = $state<'all' | 'unread'>('all');
	let expandedId = $state<string | null>(null);

	const isOpen = $derived(open ?? internalOpen);
	const unreadCount = $derived(items.filter((item) => !item.read).length);
	const readCount = $derived(items.length - unreadCount);
	const visible = $derived(view === 'unread' ? items.filter((item) => !item.read) : items);
	const summary = $derived(
		unreadCount
			? `${unreadCount} update${unreadCount === 1 ? '' : 's'} waiting for you`
			: 'You’re all caught up'
	);

	const itemRefs = new Map<string, HTMLButtonElement>();
	let allTab = $state<HTMLButtonElement | null>(null);
	let unreadTab = $state<HTMLButtonElement | null>(null);

	function registerItem(node: HTMLButtonElement, id: string) {
		itemRefs.set(id, node);
		return { destroy: () => itemRefs.delete(id) };
	}

	function setOpen(next: boolean) {
		if (open === undefined) internalOpen = next;
		onOpenChange?.(next);
	}

	function setView(next: 'all' | 'unread') {
		view = next;
		expandedId = null;
	}

	function toggleRead(item: NotificationItem) {
		const next = !item.read;
		if (next && view === 'unread') {
			const index = visible.findIndex((entry) => entry.id === item.id);
			const nextId = visible[index + 1]?.id ?? visible[index - 1]?.id;
			requestAnimationFrame(() =>
				nextId ? itemRefs.get(nextId)?.focus() : unreadTab?.focus()
			);
		}
		items = items.map((entry) => (entry.id === item.id ? { ...entry, read: next } : entry));
		if (next && view === 'unread') expandedId = null;
		onReadChange?.(item, next);
	}

	function markAllRead() {
		items.filter((item) => !item.read).forEach((item) => onReadChange?.(item, true));
		items = items.map((item) => ({ ...item, read: true }));
		expandedId = null;
		requestAnimationFrame(() => (view === 'unread' ? unreadTab : allTab)?.focus());
	}

	function dismiss(item: NotificationItem) {
		const index = visible.findIndex((entry) => entry.id === item.id);
		const nextId = visible[index + 1]?.id ?? visible[index - 1]?.id;
		requestAnimationFrame(() => (nextId ? itemRefs.get(nextId)?.focus() : unreadTab?.focus()));
		items = items.filter((entry) => entry.id !== item.id);
		if (expandedId === item.id) expandedId = null;
		onDismiss?.(item);
	}

	function clearRead() {
		items.filter((item) => item.read).forEach((item) => onDismiss?.(item));
		items = items.filter((item) => !item.read);
		requestAnimationFrame(() => allTab?.focus());
	}
</script>

<Popover.Root open={isOpen} onOpenChange={setOpen}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<button
				{...props}
				class={styles.trigger}
				type="button"
				aria-label={`${label}${unreadCount ? `, ${unreadCount} unread` : ''}`}
			>
				<span><Bell size={19} strokeWidth={1.75} aria-hidden="true" /></span>
				{#if unreadCount > 0}
					<span class={styles.badge} aria-hidden="true">{unreadCount > 9 ? '9+' : unreadCount}</span>
				{/if}
			</button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content
			class={styles.panel}
			align="center"
			side="bottom"
			sideOffset={12}
			collisionPadding={12}
			{avoidCollisions}
			aria-label={label}
		>
			<div class={styles.header}>
				<div>
					<div class={styles.heading}>
						<h2>{label}</h2>
						<span class={styles.count}>{unreadCount}</span>
					</div>
					<p aria-live="polite">{summary}</p>
				</div>
				<Popover.Close class={styles.close} aria-label="Close notifications">
					<X size={17} strokeWidth={1.75} aria-hidden="true" />
				</Popover.Close>
			</div>

			<div class={styles.toolbar}>
				<div class={styles.viewSwitch} role="group" aria-label="Show notifications">
					<button
						bind:this={allTab}
						type="button"
						class={view === 'all' ? styles.viewActive : undefined}
						aria-pressed={view === 'all'}
						onclick={() => setView('all')}
					>
						{#if view === 'all'}<span class={styles.viewHighlight}></span>{/if}
						<span>All</span>
					</button>
					<button
						bind:this={unreadTab}
						type="button"
						class={view === 'unread' ? styles.viewActive : undefined}
						aria-pressed={view === 'unread'}
						onclick={() => setView('unread')}
					>
						{#if view === 'unread'}<span class={styles.viewHighlight}></span>{/if}
						<span>Unread</span>
					</button>
				</div>
				{#if unreadCount > 0}
					<button type="button" class={styles.markAll} onclick={markAllRead}>
						<CheckCheck size={15} strokeWidth={1.75} aria-hidden="true" />
						<span>Mark all read</span>
					</button>
				{/if}
			</div>

			<div
				class={styles.list}
				role="list"
				aria-label={view === 'all' ? 'All notifications' : 'Unread notifications'}
			>
				{#each visible as item, index (item.id)}
					<div role="listitem" class={styles.row}>
						<article
							class={[
								styles.item,
								item.read ? styles.itemRead : '',
								expandedId === item.id ? styles.itemExpanded : ''
							]
								.filter(Boolean)
								.join(' ')}
							style={`--index: ${Math.min(index, 7)}`}
						>
							<div class={styles.itemMain}>
								{#if item.actor}
									<Avatar name={item.actor.name} src={item.actor.photo} size="md" />
								{:else}
									<span
										class={[styles.eventIcon, styles[item.tone ?? 'info']].join(' ')}
										aria-hidden="true"
									>
										{#if item.tone === 'warning'}
											<TriangleAlert size={18} strokeWidth={1.7} aria-hidden="true" />
										{:else if item.tone === 'success'}
											<CircleCheck size={18} strokeWidth={1.7} aria-hidden="true" />
										{:else}
											<MessageCircle size={18} strokeWidth={1.7} aria-hidden="true" />
										{/if}
									</span>
								{/if}
								<button
									type="button"
									use:registerItem={item.id}
									class={styles.itemToggle}
									aria-expanded={expandedId === item.id}
									aria-label={`${item.title}${item.read ? '' : ', unread'}. ${expandedId === item.id ? 'Hide details' : 'Show details'}`}
									onclick={() => (expandedId = expandedId === item.id ? null : item.id)}
								>
									<span class={styles.itemTitle}>
										<strong>{item.title}</strong>
										{#if !item.read}<span class={styles.unreadDot} aria-hidden="true"></span>{/if}
									</span>
									<span class={styles.itemPreview}
										>{item.description ??
											(item.actor ? `From ${item.actor.name}` : 'View update details')}</span
									>
								</button>
								<time class={styles.time}>{item.time}</time>
							</div>
							{#if expandedId === item.id}
								<div class={styles.details}>
									<p>
										{item.description ??
											(item.actor
												? `${item.actor.name} shared an update with you.`
												: 'This update is ready to review.')}
									</p>
									<div class={styles.itemActions}>
										<button type="button" onclick={() => toggleRead(item)}>
											<span class={styles.actionIcon}>
												<span class={styles.actionGlyph}>
													{#if item.read}
														<CircleDot size={14} strokeWidth={1.75} aria-hidden="true" />
													{:else}
														<Check size={14} strokeWidth={1.75} aria-hidden="true" />
													{/if}
												</span>
											</span>
											<span class={styles.morph}
												><span class={styles.morphContent}
													>{item.read ? 'Mark unread' : 'Mark read'}</span
												></span
											>
										</button>
										<button type="button" onclick={() => dismiss(item)}>
											<X size={14} strokeWidth={1.75} aria-hidden="true" />Dismiss
										</button>
									</div>
								</div>
							{/if}
						</article>
					</div>
				{/each}
				{#if visible.length === 0}
					<div class={styles.emptyFrame}>
						<div class={styles.empty}>
							<CircleCheck size={24} strokeWidth={1.5} aria-hidden="true" />
							<strong>{view === 'unread' ? 'Nothing unread' : 'All clear'}</strong>
							<p>{view === 'unread' ? 'You’ve seen every update.' : 'New updates will appear here.'}</p>
							{#if view === 'unread' && items.length > 0}
								<button type="button" onclick={() => setView('all')}>View all updates</button>
							{/if}
						</div>
					</div>
				{/if}
			</div>

			{#if readCount > 0}
				<div class={styles.footerFrame}>
					<div class={styles.footer}>
						<span>{readCount} read</span>
						<button type="button" onclick={clearRead}>Clear read</button>
					</div>
				</div>
			{/if}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
