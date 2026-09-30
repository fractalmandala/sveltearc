<script lang="ts">
	import { SwipeActions, SwipeActionsRow } from '$lib/components/swipe-actions';
	import { Archive, MailOpen, Trash2, CheckCircle2 } from '@lucide/svelte';

	let items = $state([
		{ id: '1', title: 'Review pull request #142', subtitle: 'Design tokens & CSS modules', type: 'task' },
		{ id: '2', title: 'Design system alignment meeting', subtitle: 'Calendar invite for 3:00 PM', type: 'mail' },
		{ id: '3', title: 'Update production certificates', subtitle: 'Expires in 7 days', type: 'alert' }
	]);

	function removeItem(id: string) {
		items = items.filter((i) => i.id !== id);
	}
</script>

{#snippet archiveIcon()}
	<Archive size={18} strokeWidth={1.8} />
{/snippet}

{#snippet checkIcon()}
	<CheckCircle2 size={18} strokeWidth={1.8} />
{/snippet}

<div class="demo-swipe-container">
	<SwipeActions label="Active Triage List">
		{#each items as item (item.id)}
			<SwipeActionsRow
				label={item.title}
				leading={[
					{ label: 'Done', icon: checkIcon, tone: 'accent', onSelect: () => removeItem(item.id) }
				]}
				trailing={[
					{ label: 'Archive', icon: archiveIcon, tone: 'danger', onSelect: () => removeItem(item.id) }
				]}
			>
				<div class="demo-row-body">
					<div class="demo-row-text">
						<span class="demo-row-title">{item.title}</span>
						<span class="demo-row-sub">{item.subtitle}</span>
					</div>
					<span class="demo-swipe-hint">Swipe ↔</span>
				</div>
			</SwipeActionsRow>
		{/each}
	</SwipeActions>
</div>

<style>
	.demo-swipe-container {
		width: 100%;
		max-width: 480px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.demo-row-body {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0.25rem 0;
	}

	.demo-row-text {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.demo-row-title {
		font-size: var(--text-sm, 0.875rem);
		font-weight: 500;
		color: var(--foreground, #fff);
	}

	.demo-row-sub {
		font-size: var(--text-xs, 0.75rem);
		color: var(--text-secondary, #888);
	}

	.demo-swipe-hint {
		font-size: var(--text-xs, 0.75rem);
		color: var(--text-muted, #666);
		padding: 0.2rem 0.5rem;
		background: var(--surface-muted, rgba(255, 255, 255, 0.05));
		border-radius: var(--radius-pill, 9999px);
		user-select: none;
	}
</style>
