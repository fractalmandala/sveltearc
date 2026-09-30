<script lang="ts">
	import { TextMorph } from '$lib/components/text-morph';

	let published = $state(true);
</script>

<div class="demo-text-morph-wrap">
	<TextMorph as="strong" children={published ? 'Published' : 'Publishing'} />
	<button class="demo-text-morph-toggle" onclick={() => (published = !published)}>
		Toggle label
	</button>
</div>

<style>
	.demo-text-morph-wrap {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 2.5rem 1rem;
		width: 100%;
	}
	.demo-text-morph-toggle {
		padding: 0.375rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: 0.375rem;
		background: var(--background);
		color: var(--foreground);
		cursor: pointer;
	}
</style>
