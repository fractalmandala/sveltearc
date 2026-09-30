<script lang="ts">
	import { MultiSelect } from '$lib/components/multi-select';

	let topics = $state(['svelte', 'rust']);
	let stack = $state<string[]>([]);
	let menuOpen = $state(false);

	const topicOptions = [
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'react', label: 'React' },
		{ value: 'vue', label: 'Vue' },
		{ value: 'rust', label: 'Rust' },
		{ value: 'go', label: 'Go', disabled: true }
	];
</script>

<div class="demo-multi-select-stack">
	<MultiSelect
		label="Topics"
		bind:value={topics}
		bind:open={menuOpen}
		options={topicOptions}
		description="Chips fold behind a count after two. Go is unavailable."
	/>

	<MultiSelect
		label="Stack"
		bind:value={stack}
		options={topicOptions}
		placeholder="Pick your stack…"
		maxVisible={1}
	/>

	<MultiSelect label="Disabled" value={['svelte']} options={topicOptions} disabled />

	<div class="selection-readout">
		<span>Topics: <strong>{topics.length ? topics.join(', ') : 'none'}</strong></span>
		<span>Stack: <strong>{stack.length ? stack.join(', ') : 'none'}</strong></span>
		<span>Topics menu: <strong>{menuOpen ? 'open' : 'closed'}</strong></span>
	</div>
</div>

<style>
	.demo-multi-select-stack {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		max-width: 380px;
		margin: 0 auto;
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
