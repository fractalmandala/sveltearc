<script lang="ts">
	import Search from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';
	import styles from './shortcut-recorder.module.css';
	import { searchAliases, shortcutTokens } from './shortcut-recorder.data';
	import { usePlatform, usePressedKeys } from './shortcut-recorder.state.svelte';
	import ShortcutKeys from './shortcut-keys.svelte';
	import type { ShortcutListProps } from './shortcut-recorder.types';

	let {
		groups,
		label = 'Keyboard shortcuts',
		searchable = true,
		searchPlaceholder = 'Search shortcuts',
		highlightPressed = true,
		platform: platformProp,
		class: className = ''
	}: ShortcutListProps = $props();

	const platform = usePlatform(platformProp);
	const heldStrings = usePressedKeys(highlightPressed);
	const held = $derived(new Set(heldStrings));
	const heldMods = $derived(
		[...held].filter((key) => ['meta', 'ctrl', 'alt', 'shift'].includes(key))
	);

	let query = $state('');
	let searchEl: HTMLInputElement | null = $state(null);

	const words = $derived(
		query
			.trim()
			.toLowerCase()
			.replace(/[⌘]/g, ' cmd ')
			.replace(/[⇧]/g, ' shift ')
			.replace(/[⌥]/g, ' alt ')
			.replace(/[⌃]/g, ' ctrl ')
			.split(/[\s+]+/)
			.filter(Boolean)
	);

	const filtered = $derived(
		groups
			.map((group) => ({
				...group,
				items: group.items.filter((item) => {
					if (!words.length) return true;
					const tokens = shortcutTokens(item.shortcut, platform);
					const haystack =
						`${item.label} ${group.label} ${item.keywords ?? ''} ${tokens.map((token) => `${token.spoken} ${token.label}`).join(' ')}`.toLowerCase();
					return words.every((word) =>
						searchAliases(word, platform).some((candidate) => haystack.includes(candidate))
					);
				})
			}))
			.filter((group) => group.items.length)
	);
	const total = $derived(filtered.reduce((sum, group) => sum + group.items.length, 0));
</script>

<section
	class={[styles.list, className].filter(Boolean).join(' ')}
	aria-label={label}
>
	{#if searchable}
		<div class={styles.searchRow}>
			<Search class={styles.searchIcon} size={16} strokeWidth={1.75} aria-hidden="true" />
			<input
				bind:this={searchEl}
				class={styles.search}
				type="search"
				placeholder={searchPlaceholder}
				value={query}
				aria-label={searchPlaceholder}
				autocomplete="off"
				spellcheck={false}
				oninput={(event) => {
					query = event.currentTarget.value;
				}}
				onkeydown={(event) => {
					if (event.key === 'Escape' && query) {
						event.preventDefault();
						query = '';
					}
				}}
			/>
			<span class={styles.count} aria-live="polite">
				{query ? `${total} ${total === 1 ? 'match' : 'matches'}` : ''}
			</span>
			{#if query}
				<button
					type="button"
					class={styles.clear}
					aria-label="Clear search"
					onclick={() => {
						query = '';
						searchEl?.focus();
					}}
				>
					<X size={14} strokeWidth={1.75} aria-hidden="true" />
				</button>
			{/if}
		</div>
	{/if}

	<div class={styles.groups}>
		{#each filtered as group (group.label)}
			<section class={styles.group} aria-label={group.label}>
				<h4 class={styles.groupLabel}>{group.label}</h4>
				<ul class={styles.rows}>
					{#each group.items as item (item.label)}
						{@const tokens = shortcutTokens(item.shortcut, platform)}
						{@const ids = tokens.map((token) => token.id)}
						{@const match = held.size > 0 && ids.every((key) => held.has(key))}
						{@const dim =
							heldMods.length > 0 && !match && !heldMods.every((mod) => ids.includes(mod))}
						<li class={styles.item} data-match={match || undefined} data-dim={dim || undefined}>
							<span class={styles.itemInner}>
								<span class={styles.itemLabel}>{item.label}</span>
								<ShortcutKeys shortcut={item.shortcut} platform={platform} pressed={held} size="sm" />
							</span>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
		{#if total === 0}
			<p class={styles.empty}>No shortcuts match “{query.trim()}”</p>
		{/if}
	</div>
</section>
