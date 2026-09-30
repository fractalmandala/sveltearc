<script lang="ts">
	import { Dialog, DialogTrigger, DialogContent, DialogClose } from '$lib/components/dialog';

	let projectName = $state('My Project');
	let open = $state(false);
</script>

<div class="demo-box">
	<Dialog bind:open>
		<DialogTrigger class="demo-trigger-btn">Edit Project Settings</DialogTrigger>
		<DialogContent
			title="Project Settings"
			description="Update your project name and public visibility."
		>
			<div class="demo-dialog-content">
				<label class="demo-label" for="proj-name">Project Name</label>
				<input id="proj-name" class="demo-input" bind:value={projectName} />
			</div>
			<div class="demo-dialog-footer">
				<DialogClose class="demo-btn-secondary">Cancel</DialogClose>
				<DialogClose class="demo-btn-primary">Save Changes</DialogClose>
			</div>
		</DialogContent>
	</Dialog>

	<p class="demo-status">Current project name: <strong>{projectName}</strong></p>
</div>

<style>
	.demo-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		padding: 2.5rem;
	}
	:global(.demo-trigger-btn) {
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		border-radius: 0.375rem;
		background: var(--color-bg-subtle, #f4f4f5);
		border: 1px solid var(--color-border-default, #e4e4e7);
		cursor: pointer;
	}
	.demo-dialog-content {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 1rem 0;
	}
	.demo-label {
		font-size: 0.8125rem;
		font-weight: 500;
	}
	.demo-input {
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		border-radius: 0.375rem;
		border: 1px solid var(--color-border-default, #e4e4e7);
		background: transparent;
	}
	.demo-dialog-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		margin-top: 1rem;
	}
	:global(.demo-btn-secondary) {
		padding: 0.375rem 0.75rem;
		font-size: 0.8125rem;
		border-radius: 0.375rem;
		background: transparent;
		border: 1px solid var(--color-border-default, #e4e4e7);
		cursor: pointer;
	}
	:global(.demo-btn-primary) {
		padding: 0.375rem 0.75rem;
		font-size: 0.8125rem;
		font-weight: 500;
		border-radius: 0.375rem;
		background: #18181b;
		color: #fff;
		border: none;
		cursor: pointer;
	}
	.demo-status {
		font-size: 0.8125rem;
		color: var(--color-fg-muted, #71717a);
	}
	.demo-status strong {
		color: var(--color-fg-default, #18181b);
	}
</style>
