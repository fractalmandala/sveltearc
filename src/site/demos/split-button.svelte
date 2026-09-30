<script lang="ts">
	import SplitButton from '$lib/components/split-button/split-button.svelte';
	import GitMerge from '@lucide/svelte/icons/git-merge';
	import Share2 from '@lucide/svelte/icons/share-2';

	let lastAction = $state('None');

	function handleAction(name: string) {
		lastAction = name;
	}
</script>

{#snippet mergeIcon()}<GitMerge size={15} />{/snippet}
{#snippet shareIcon()}<Share2 size={15} />{/snippet}

<div class="demo-box">
	<div class="demo-row">
		<SplitButton
			label="Merge pull request"
			icon={mergeIcon}
			variant="primary"
			onClick={() => handleAction('Merge pull request (default)')}
			actions={[
				{ label: 'Squash and merge', onSelect: () => handleAction('Squash and merge') },
				{ label: 'Rebase and merge', onSelect: () => handleAction('Rebase and merge') },
				{ label: 'Close pull request', destructive: true, onSelect: () => handleAction('Close pull request') }
			]}
		/>

		<SplitButton
			label="Export project"
			icon={shareIcon}
			variant="secondary"
			onClick={() => handleAction('Export project as ZIP')}
			actions={[
				{ label: 'Export as JSON', onSelect: () => handleAction('Export as JSON') },
				{ label: 'Export as CSV', onSelect: () => handleAction('Export as CSV') }
			]}
		/>
	</div>

	<p class="demo-status">Last triggered action: <strong>{lastAction}</strong></p>
</div>

<style>
	.demo-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 2.5rem;
	}
	.demo-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
	}
	.demo-status {
		font-size: 0.8125rem;
		color: var(--color-fg-muted, #71717a);
	}
	.demo-status strong {
		color: var(--color-fg-default, #18181b);
	}
</style>
