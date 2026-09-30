<script lang="ts">
	import { TagInput } from '$lib/components/tag-input';

	let tags = $state(['svelte', 'design']);
	let emails = $state(['ada@example.com']);
	let empty = $state<string[]>([]);
</script>

<div class="demo-tag-input-container">
	<TagInput
		label="Tags"
		bind:value={tags}
		description="Press Enter or comma to add a tag."
	/>

	<TagInput
		label="Invite by email"
		bind:value={emails}
		placeholder="Add an email"
		description="Backspace picks a tag before removing it."
	/>

	<TagInput
		label="Empty starting point"
		bind:value={empty}
		placeholder="Add a tag"
	/>
</div>

<style>
	.demo-tag-input-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		max-width: 440px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}
</style>
