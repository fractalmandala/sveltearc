<script lang="ts">
	import DropdownMenu from '$lib/components/dropdown-menu/dropdown-menu.svelte';
	import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Copy from '@lucide/svelte/icons/copy';
	import Share2 from '@lucide/svelte/icons/share-2';
	import Archive from '@lucide/svelte/icons/archive';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	let lastAction = $state('None');

	function handleAction(name: string) {
		lastAction = name;
	}
</script>

{#snippet triggerIcon()}<MoreHorizontal size={15} />{/snippet}
{#snippet pencilIcon()}<Pencil size={15} />{/snippet}
{#snippet copyIcon()}<Copy size={15} />{/snippet}
{#snippet shareIcon()}<Share2 size={15} />{/snippet}
{#snippet archiveIcon()}<Archive size={15} />{/snippet}
{#snippet trashIcon()}<Trash2 size={15} />{/snippet}

<div class="demo-box">
	<div class="demo-controls">
		<DropdownMenu
			label="Project Options"
			icon={triggerIcon}
			items={[
				{ label: 'Edit Metadata', icon: pencilIcon, onSelect: () => handleAction('Edit Metadata') },
				{ label: 'Make a Copy', icon: copyIcon, onSelect: () => handleAction('Make a Copy') },
				{ label: 'Share Link', icon: shareIcon, onSelect: () => handleAction('Share Link') },
				{ label: 'Archive Project', icon: archiveIcon, separatorBefore: true, onSelect: () => handleAction('Archive Project') },
				{ label: 'Delete Project', icon: trashIcon, destructive: true, onSelect: () => handleAction('Delete Project') }
			]}
		/>
	</div>

	<p class="demo-status">
		Last executed action: <strong>{lastAction}</strong>
	</p>
</div>

<style>
	.demo-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		padding: 2rem;
	}
	.demo-status {
		font-size: 0.8125rem;
		color: var(--color-fg-muted, #71717a);
	}
	.demo-status strong {
		color: var(--color-fg-default, #18181b);
	}
</style>
