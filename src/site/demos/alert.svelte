<script lang="ts">
	import { Alert } from '$lib/components/alert';
	import type { AlertTone } from '$lib/components/alert';

	let open = $state(true);
	let tone = $state<AlertTone>('warning');
	let dismissedCount = $state(0);

	function handleDismiss() {
		dismissedCount++;
		open = false;
	}

	function resetAlert() {
		open = true;
	}
</script>

<div class="demo-alert-wrap">
	<div class="demo-box">
		{#if open}
			<Alert
				bind:open
				{tone}
				title="Card expires soon"
				onDismiss={handleDismiss}
			>
				Update your payment method before March 1 to avoid interruption.
			</Alert>
		{:else}
			<div class="demo-dismissed">
				<span>Alert dismissed ({dismissedCount}x)</span>
				<button type="button" class="demo-reset-btn" onclick={resetAlert}>
					Show Alert Again
				</button>
			</div>
		{/if}

		<div class="demo-controls">
			<label>
				Tone:
				<select bind:value={tone}>
					<option value="info">Info</option>
					<option value="success">Success</option>
					<option value="warning">Warning</option>
					<option value="danger">Danger</option>
				</select>
			</label>
		</div>
	</div>
</div>

<style>
	.demo-alert-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1rem;
		width: 100%;
	}
	.demo-box {
		width: 100%;
		max-width: 480px;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.demo-dismissed {
		display: flex;
		align-items: center;
		justify-content: space-between;
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
		gap: 1rem;
		font-size: var(--text-xs);
		color: var(--text-secondary);
	}
	.demo-controls select {
		margin-left: 0.5rem;
		background: var(--surface);
		color: var(--foreground);
		border: 1px solid var(--border);
		border-radius: var(--radius-control);
		padding: 0.2rem 0.4rem;
	}
</style>
