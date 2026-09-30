<script lang="ts">
	import { SegmentedControl } from '$lib/components/segmented-control';

	let range = $state('week');
	let view = $state('grid');
</script>

<div class="demo-segmented-control-wrap">
	<div class="demo-box">
		<div class="demo-row">
			<span class="demo-label">Timeframe:</span>
			<SegmentedControl
				label="Timeframe"
				bind:value={range}
				options={[
					{ value: 'day', label: 'Day' },
					{ value: 'week', label: 'Week' },
					{ value: 'month', label: 'Month' },
					{ value: 'year', label: 'Year' }
				]}
			/>
		</div>

		<div class="demo-row">
			<span class="demo-label">View mode:</span>
			<SegmentedControl
				label="View Mode"
				bind:value={view}
				options={[
					{ value: 'grid', label: 'Grid' },
					{ value: 'list', label: 'List' },
					{ value: 'compact', label: 'Compact' }
				]}
			/>
		</div>

		<div class="demo-result">
			Selected: <code>range = {range}</code>, <code>view = {view}</code>
		</div>
	</div>
</div>

<style>
	.demo-segmented-control-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1rem;
		width: 100%;
	}
	.demo-box {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: center;
	}
	.demo-row {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.demo-label {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		min-width: 80px;
		text-align: right;
	}
	.demo-result {
		font-size: var(--text-xs);
		color: var(--text-muted);
		padding: 0.5rem 1rem;
		background: var(--surface-muted);
		border-radius: var(--radius-control);
	}
	.demo-result code {
		color: var(--accent);
		font-family: var(--font-mono, monospace);
	}
</style>
