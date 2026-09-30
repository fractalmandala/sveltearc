<script lang="ts">
	import { TextShimmer } from '$lib/components/text-shimmer';

	let active = $state(true);
</script>

<div class="demo-text-shimmer-wrap">
	<TextShimmer {active} children={active ? 'Generating summary' : 'Summary ready'} />
	<button class="demo-text-shimmer-toggle" onclick={() => (active = !active)}>
		Toggle active
	</button>
</div>

<style>
	.demo-text-shimmer-wrap {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 2.5rem 1rem;
		width: 100%;
	}
	.demo-text-shimmer-toggle {
		padding: 0.375rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: 0.375rem;
		background: var(--background);
		color: var(--foreground);
		cursor: pointer;
	}
</style>
