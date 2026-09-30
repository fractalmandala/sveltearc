<script lang="ts">
	import Search from '@lucide/svelte/icons/search';

	/** Sidebar button. It only announces intent; the single SearchPalette in the layout owns the open state. */
	let { label = 'Search components' }: { label?: string } = $props();

	// Platform is unknown during SSR, so the hint is resolved after mount to keep hydration identical.
	let shortcut = $state('Ctrl K');
	$effect(() => {
		if (/Mac|iPhone|iPad/.test(navigator.platform)) shortcut = '⌘K';
	});
</script>

<button
	type="button"
	class="search-trigger"
	aria-haspopup="dialog"
	aria-keyshortcuts="Control+K Meta+K"
	onclick={() => window.dispatchEvent(new CustomEvent('arc:search-open'))}
>
	<Search size={15} aria-hidden="true" />
	<span class="label">{label}</span>
	<kbd>{shortcut}</kbd>
</button>

<style>

	.search-trigger {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		width: 100%;
		margin: var(--space-4) 0;
		padding: var(--space-2);
		border: 1px solid var(--border);
		border-radius: 8px;
		background: var(--bg-raised);
		color: var(--text-secondary);
		font: inherit;
		font-size: var(--text-sm);
		cursor: pointer;
	}

	.search-trigger:hover {
		color: var(--text-primary);
	}
	.search-trigger:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
	.label {
		flex: 1;
		text-align: left;
	}
	kbd {
		padding: 0 5px;
		border: 1px solid var(--border);
		border-radius: 4px;
		background: var(--surface-muted);
		color: var(--text-muted);
		font: inherit;
		font-size: var(--text-xs);
	}
</style>
