<script lang="ts">
	import Tooltip from '$lib/components/tooltip/tooltip.svelte';
	import Archive from '@lucide/svelte/icons/archive';
	import Copy from '@lucide/svelte/icons/copy';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import Settings from '@lucide/svelte/icons/settings';
</script>

<div class="demo-box">
	<div class="demo-toolbar">
		<Tooltip content="Copy project link" side="top">
			{#snippet children({ props })}
				<button {...props} type="button" class="demo-icon-btn" aria-label="Copy project link">
					<Copy size={16} />
				</button>
			{/snippet}
		</Tooltip>

		<Tooltip content="Archive to storage" side="top">
			{#snippet children({ props })}
				<button {...props} type="button" class="demo-icon-btn" aria-label="Archive to storage">
					<Archive size={16} />
				</button>
			{/snippet}
		</Tooltip>

		<Tooltip content="Project settings" side="bottom">
			{#snippet children({ props })}
				<button {...props} type="button" class="demo-icon-btn" aria-label="Project settings">
					<Settings size={16} />
				</button>
			{/snippet}
		</Tooltip>

		<Tooltip content="Delete permanently" side="bottom">
			{#snippet children({ props })}
				<button {...props} type="button" class="demo-icon-btn demo-btn-danger" aria-label="Delete permanently">
					<Trash2 size={16} />
				</button>
			{/snippet}
		</Tooltip>
	</div>

	<p class="demo-hint">Hover or focus across icons to test the instant skip window.</p>
</div>

<style>
	.demo-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 2.5rem;
	}
	.demo-toolbar {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem;
		background: var(--color-bg-subtle, #f4f4f5);
		border: 1px solid var(--color-border-default, #e4e4e7);
		border-radius: 0.5rem;
	}
	.demo-icon-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 0.375rem;
		background: transparent;
		border: none;
		color: var(--color-fg-default, #18181b);
		cursor: pointer;
	}
	.demo-icon-btn:hover,
	.demo-icon-btn:focus-visible {
		background: var(--color-bg-muted, #e4e4e7);
		outline: none;
	}
	.demo-btn-danger:hover,
	.demo-btn-danger:focus-visible {
		color: #ef4444;
	}
	.demo-hint {
		font-size: 0.8125rem;
		color: var(--color-fg-muted, #71717a);
	}
</style>
