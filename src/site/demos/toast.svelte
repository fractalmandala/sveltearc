<script lang="ts">
	import Toast from '$lib/components/toast/toast.svelte';

	let open = $state(true);
	let withDescription = $state(true);
	let duration = $state(4500);

	function show() {
		open = true;
	}
</script>

<div class="demo-toast-wrap">
	{#if open}
		<Toast
			title="Changes saved"
			description={withDescription ? 'Your workspace is up to date.' : undefined}
			{open}
			onOpenChange={(o) => (open = o)}
			{duration}
		/>
	{:else}
		<div class="demo-dismissed">
			<span>Toast dismissed</span>
			<button type="button" class="demo-reset-btn" onclick={show}>Show toast again</button>
		</div>
	{/if}

	<div class="demo-controls">
		<label>
			<input type="checkbox" bind:checked={withDescription} />
			Description
		</label>
		<label>
			Duration (ms):
			<select bind:value={duration}>
				<option value={1500}>1500</option>
				<option value={4500}>4500</option>
				<option value={0}>Never (timer off)</option>
			</select>
		</label>
	</div>
</div>

<style>
	.demo-toast-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		padding: 2.5rem 1rem;
		width: 100%;
		max-width: 28rem;
		margin-inline: auto;
	}
	.demo-dismissed {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		width: 100%;
		padding: 1rem;
		border: 1px dashed var(--border);
		border-radius: var(--radius-control);
		font-size: var(--text-sm);
		color: var(--text-secondary);
	}
	.demo-reset-btn {
		padding: 0.375rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-control);
		background: var(--surface);
		color: var(--foreground);
		font-size: var(--text-xs);
		cursor: pointer;
	}
	.demo-controls {
		display: flex;
		gap: 1.5rem;
		font-size: var(--text-xs);
		color: var(--text-secondary);
	}
	.demo-controls label {
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}
	.demo-controls select {
		background: var(--surface);
		color: var(--foreground);
		border: 1px solid var(--border);
		border-radius: var(--radius-control);
		padding: 0.2rem 0.4rem;
	}
</style>
