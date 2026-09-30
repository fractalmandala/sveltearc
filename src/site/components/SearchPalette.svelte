<script lang="ts">
	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { Dialog } from 'bits-ui';
	import { search, highlight, type SearchHit } from '$site/search';

	/** Mounted once (layout). Opens on ⌘K / Ctrl-K or the `arc:search-open` window event SearchTrigger fires. */
	let { open = $bindable(false) }: { open?: boolean } = $props();

	const listId = $props.id();
	const LIMIT = 50;

	let query = $state('');
	let active = $state(0);
	let input = $state<HTMLInputElement | null>(null);
	let list = $state<HTMLUListElement | null>(null);

	// Nothing is indexed until the palette is first opened; `search` builds lazily on its first call.
	const hits = $derived<SearchHit[]>(open ? search(query, LIMIT) : []);
	const activeHit = $derived(hits[active]);

	$effect(() => {
		const onKey = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
				event.preventDefault();
				open = !open;
			}
		};
		const onOpen = () => (open = true);
		window.addEventListener('keydown', onKey);
		window.addEventListener('arc:search-open', onOpen);
		return () => {
			window.removeEventListener('keydown', onKey);
			window.removeEventListener('arc:search-open', onOpen);
		};
	});

	$effect(() => {
		if (open) {
			query = '';
			active = 0;
		}
	});

	// A new query always restarts at the best match.
	$effect(() => {
		query;
		active = 0;
	});

	async function move(delta: number) {
		if (!hits.length) return;
		active = (active + delta + hits.length) % hits.length;
		await tick();
		list?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
	}

	function go(hit: SearchHit | undefined) {
		if (!hit) return;
		open = false;
		goto(`/components/${hit.slug}`);
	}

	function onInputKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') (event.preventDefault(), move(1));
		else if (event.key === 'ArrowUp') (event.preventDefault(), move(-1));
		else if (event.key === 'Enter') (event.preventDefault(), go(activeHit));
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Portal>
		<Dialog.Overlay class="search-overlay" />
		<Dialog.Content
			class="search-content"
			onOpenAutoFocus={(event) => {
				event.preventDefault();
				input?.focus();
			}}
		>
			<Dialog.Title class="search-sr">Search components</Dialog.Title>
			<Dialog.Description class="search-sr">
				Type to filter. Use the arrow keys to move through results and Enter to open one.
			</Dialog.Description>
			<input
				bind:this={input}
				bind:value={query}
				class="search-input"
				type="text"
				role="combobox"
				placeholder="Search components…"
				autocomplete="off"
				autocapitalize="off"
				spellcheck="false"
				aria-label="Search components"
				aria-expanded={hits.length > 0}
				aria-controls={listId}
				aria-autocomplete="list"
				aria-activedescendant={activeHit ? `${listId}-${activeHit.slug}` : undefined}
				onkeydown={onInputKeydown}
			/>
			<p class="search-sr" role="status" aria-live="polite">
				{hits.length === 0 ? 'No results' : `${hits.length} result${hits.length === 1 ? '' : 's'}`}
			</p>
			{#if hits.length}
				<ul bind:this={list} id={listId} class="search-list" role="listbox" aria-label="Components">
					{#each hits as hit, index (hit.slug)}
						<!-- svelte-ignore a11y_click_events_have_key_events -- keyboard operation lives on the combobox input (aria-activedescendant); options are not focusable by design -->
						<li
							id="{listId}-{hit.slug}"
							class="search-option"
							role="option"
							aria-selected={index === active}
							onmousemove={() => (active = index)}
							onclick={() => go(hit)}
						>
							<span class="search-row">
								<span class="search-title">
									{#each highlight(hit.title, query) as part}{#if part.hit}<mark>{part.text}</mark>{:else}{part.text}{/if}{/each}
								</span>
								<span class="search-group">{hit.group}</span>
							</span>
							<span class="search-desc">{hit.description}</span>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="search-empty">No components match “{query}”.</p>
			{/if}
			<footer class="search-foot" aria-hidden="true">
				<span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
				<span><kbd>↵</kbd> open</span>
				<span><kbd>esc</kbd> close</span>
			</footer>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	/* bits-ui renders these into a portal, so the classes are passed through and styled globally. */
	:global(.search-overlay) {
		position: fixed;
		inset: 0;
		z-index: 90;
		background: color-mix(in oklch, var(--foreground) 35%, transparent);
	}
	:global(.search-content) {
		position: fixed;
		top: min(14vh, 8rem);
		left: 50%;
		z-index: 91;
		display: flex;
		flex-direction: column;
		width: min(36rem, calc(100vw - 2rem));
		max-height: min(32rem, 76vh);
		translate: -50% 0;
		overflow: hidden;
		border: 1px solid var(--border-strong);
		border-radius: var(--radius-control, 12px);
		background: var(--surface-raised);
		color: var(--foreground);
		box-shadow: var(--shadow-raised, 0 12px 40px oklch(0% 0 0 / 0.25));
	}
	:global(.search-sr) {
		position: absolute;
		width: 1px;
		height: 1px;
		margin: -1px;
		padding: 0;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}
	.search-input {
		flex: none;
		width: 100%;
		padding: var(--space-4) var(--space-5);
		border: 0;
		border-bottom: 1px solid var(--border);
		background: transparent;
		color: inherit;
		font: inherit;
		font-size: var(--text-base);
		outline: none;
	}
	.search-input::placeholder {
		color: var(--text-muted);
	}
	.search-list {
		flex: 1;
		min-height: 0;
		margin: 0;
		padding: var(--space-2);
		overflow-y: auto;
		list-style: none;
	}
	.search-option {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: var(--space-3) var(--space-4);
		border-radius: calc(var(--radius-control, 8px) - 2px);
		cursor: pointer;
	}
	.search-option[aria-selected='true'] {
		background: var(--surface-muted);
		box-shadow: inset 2px 0 0 var(--accent);
	}
	.search-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-4);
	}
	.search-title {
		font-size: var(--text-sm);
		font-weight: 600;
	}
	.search-title :global(mark) {
		background: var(--accent-subtle);
		color: inherit;
		border-radius: 2px;
	}
	.search-group {
		flex: none;
		color: var(--text-muted);
		font-size: var(--text-xs);
	}
	.search-desc {
		overflow: hidden;
		color: var(--text-secondary);
		font-size: var(--text-xs);
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.search-empty {
		margin: 0;
		padding: var(--space-6) var(--space-5);
		color: var(--text-secondary);
		font-size: var(--text-sm);
		text-align: center;
	}
	.search-foot {
		display: flex;
		flex: none;
		gap: var(--space-5);
		padding: var(--space-3) var(--space-5);
		border-top: 1px solid var(--border);
		color: var(--text-muted);
		font-size: var(--text-xs);
	}
	kbd {
		margin-right: 2px;
		padding: 0 5px;
		border: 1px solid var(--border-strong);
		border-radius: 4px;
		background: var(--surface-muted);
		font: inherit;
	}
	@media (prefers-reduced-motion: no-preference) {
		:global(.search-overlay[data-state='open']) {
			animation: search-fade 120ms ease-out;
		}
		:global(.search-content[data-state='open']) {
			animation: search-pop 140ms ease-out;
		}
	}
	@keyframes search-fade {
		from {
			opacity: 0;
		}
	}
	@keyframes search-pop {
		from {
			opacity: 0;
			transform: translateY(-6px) scale(0.98);
		}
	}
</style>
