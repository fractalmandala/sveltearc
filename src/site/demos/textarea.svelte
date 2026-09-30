<script lang="ts">
	import { Textarea } from '$lib/components/textarea';

	let feedback = $state('');
	let notes = $state('Antigravity and Svelte 5 runes pair programming notes.');
</script>

<div class="demo-textarea-container">
	<Textarea
		label="Release Notes & Changelog"
		placeholder="Summarize the core changes made in this release..."
		description="Markdown syntax is supported for list items and code spans."
		rows={4}
		bind:value={feedback}
	/>

	<Textarea
		label="Architectural Decisions"
		rows={3}
		bind:value={notes}
	/>

	<Textarea
		label="Validation Feedback"
		error="Commit message exceeds maximum allowed line length (72 characters)."
		value="feat(ui): this is a very long commit header that easily blows past the recommended git convention limit"
		rows={2}
	/>
</div>

<style>
	.demo-textarea-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		max-width: 480px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}
</style>
