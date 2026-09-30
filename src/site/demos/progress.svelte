<script lang="ts">
	import { Progress } from '$lib/components/progress';

	let progress = $state(45);

	function step() {
		progress = (progress + 15) % 115;
		if (progress > 100) progress = 100;
	}
</script>

<div class="demo-progress-container">
	<div class="demo-progress-card">
		<Progress
			label="System Build Artifacts"
			value={progress}
			max={100}
			showValue
		/>
		<div class="demo-actions">
			<button class="demo-btn" onclick={step}>Advance Progress (+15%)</button>
			<button class="demo-btn" onclick={() => (progress = 0)}>Reset</button>
		</div>
	</div>

	<div class="demo-progress-stack">
		<Progress label="Asset Pipeline Compression" value={72} showValue />
		<Progress label="Deploy Deployment Complete" value={100} showValue />
		<Progress label="Indexing, no percentage" value={25} />
	</div>
</div>

<style>
	.demo-progress-container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;
		max-width: 520px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.demo-progress-card {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.5rem;
		background: var(--surface, #111);
		border: 1px solid var(--border, rgba(255, 255, 255, 0.12));
		border-radius: var(--radius-control, 8px);
	}

	.demo-actions {
		display: flex;
		gap: 0.75rem;
	}

	.demo-btn {
		padding: 0.4rem 0.85rem;
		background: var(--surface-raised, rgba(255, 255, 255, 0.1));
		border: 1px solid var(--border, rgba(255, 255, 255, 0.2));
		border-radius: var(--radius-control, 6px);
		color: var(--foreground, #fff);
		font-size: var(--text-xs, 0.75rem);
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.15s ease;
	}

	.demo-btn:hover {
		background: var(--surface-muted, rgba(255, 255, 255, 0.15));
	}

	.demo-progress-stack {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding: 1.5rem;
		background: var(--surface, #111);
		border: 1px solid var(--border, rgba(255, 255, 255, 0.12));
		border-radius: var(--radius-control, 8px);
	}
</style>
