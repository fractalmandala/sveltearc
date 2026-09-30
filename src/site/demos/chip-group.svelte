<script lang="ts">
	import { ChipGroup } from '$lib/components/chip-group';

	let topics = $state(['svelte', 'rust']);
	let framework = $state(['svelte']);

	const many = [
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'react', label: 'React' },
		{ value: 'vue', label: 'Vue' },
		{ value: 'rust', label: 'Rust' },
		{ value: 'go', label: 'Go' },
		{ value: 'zig', label: 'Zig' }
	];

	const frameworks = [
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'react', label: 'React' },
		{ value: 'vue', label: 'Vue' }
	];
</script>

<div class="demo-chip-group-stack">
	<div class="demo-chip-group-row">
		<span class="demo-chip-group-caption">Multiple with overflow (4 visible)</span>
		<ChipGroup label="Topics" bind:value={topics} options={many} maxVisible={4} />
	</div>

	<div class="demo-chip-group-row">
		<span class="demo-chip-group-caption">Single mode, clearable</span>
		<ChipGroup label="Framework" bind:value={framework} options={frameworks} multiple={false} />
	</div>

	<div class="selection-readout">
		<span>Topics: <strong>{topics.length ? topics.join(', ') : 'none'}</strong></span>
		<span>Framework: <strong>{framework.length ? framework.join(', ') : 'none'}</strong></span>
	</div>
</div>

<style>
	.demo-chip-group-stack {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		max-width: 520px;
		margin: 0 auto;
	}

	.demo-chip-group-row {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.demo-chip-group-caption {
		font-size: var(--text-xs, 0.75rem);
		color: var(--text-muted, #888);
	}

	.selection-readout {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.75rem 1rem;
		background: var(--surface-muted, rgba(255, 255, 255, 0.05));
		border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
		border-radius: var(--radius-control, 8px);
		font-size: var(--text-xs, 0.75rem);
		color: var(--text-muted, #888);
	}

	.selection-readout strong {
		color: var(--foreground, #fff);
	}
</style>
