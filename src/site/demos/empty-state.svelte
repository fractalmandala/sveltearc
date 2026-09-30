<script lang="ts">
	import { EmptyState } from '$lib/components/empty-state';
	import { Button } from '$lib/components/button';
	import { Search, FolderPlus, Inbox } from '@lucide/svelte';

	let stateType = $state<'search' | 'files' | 'inbox'>('search');

	function handleAction() {
		alert(`Action triggered for ${stateType}`);
	}
</script>

<div class="demo-empty-state-wrap">
	<div class="demo-box">
		{#if stateType === 'search'}
			<EmptyState
				title="No results found"
				description="We couldn't find any components matching your criteria."
			>
				{#snippet icon()}
					<Search size={24} strokeWidth={1.5} />
				{/snippet}
				{#snippet action()}
					<Button variant="secondary" size="sm" onclick={handleAction}>Clear query</Button>
				{/snippet}
			</EmptyState>
		{:else if stateType === 'files'}
			<EmptyState
				title="No documents uploaded"
				description="Drop your markdown or code files here to begin inspection."
			>
				{#snippet icon()}
					<FolderPlus size={24} strokeWidth={1.5} />
				{/snippet}
				{#snippet action()}
					<Button variant="primary" size="sm" onclick={handleAction}>Upload file</Button>
				{/snippet}
			</EmptyState>
		{:else}
			<EmptyState
				title="Inbox is clear"
				description="All notifications and review requests have been resolved."
			>
				{#snippet icon()}
					<Inbox size={24} strokeWidth={1.5} />
				{/snippet}
				{#snippet action()}
					<Button variant="secondary" size="sm" onclick={handleAction}>Refresh feed</Button>
				{/snippet}
			</EmptyState>
		{/if}

		<div class="demo-toggles">
			<button
				type="button"
				class:active={stateType === 'search'}
				onclick={() => (stateType = 'search')}
			>
				Search
			</button>
			<button
				type="button"
				class:active={stateType === 'files'}
				onclick={() => (stateType = 'files')}
			>
				Files
			</button>
			<button
				type="button"
				class:active={stateType === 'inbox'}
				onclick={() => (stateType = 'inbox')}
			>
				Inbox
			</button>
		</div>
	</div>
</div>

<style>
	.demo-empty-state-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1rem;
		width: 100%;
	}
	.demo-box {
		width: 100%;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 1px dashed var(--border);
		border-radius: var(--radius-card);
		background: var(--surface);
		padding: 1.5rem;
	}
	.demo-toggles {
		display: flex;
		gap: 0.5rem;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
	}
	.demo-toggles button {
		padding: 0.25rem 0.6rem;
		font-size: var(--text-xs);
		border: 1px solid var(--border);
		border-radius: var(--radius-control);
		background: var(--surface-muted);
		color: var(--text-secondary);
		cursor: pointer;
	}
	.demo-toggles button.active {
		background: var(--foreground);
		color: var(--background);
		font-weight: 500;
	}
</style>
