<script lang="ts">
	import { MentionInput, serializeMentions } from '$lib/components/mention-input';
	import type { MentionInputHandle, MentionValue } from '$lib/components/mention-input';

	let peopleValue = $state<MentionValue>({ text: 'Hello @Ada ', mentions: [] });
	let channelValue = $state<MentionValue>({ text: 'Deploy to #', mentions: [] });
	let peopleRef = $state<MentionInputHandle | null>(null);

	const people = [
		{ id: 'ada', name: 'Ada Lovelace', role: 'Foundations' },
		{ id: 'grace', name: 'Grace Hopper', role: 'Compilers' }
	];
	const channels = [
		{ id: 'releases', name: 'releases', description: 'Ship notes', members: 128 },
		{ id: 'watercooler', name: 'watercooler', description: 'Small talk', members: 512 }
	];
</script>

<div class="demo-mention-input-container">
	<MentionInput
		bind:value={peopleValue}
		bind:ref={peopleRef}
		people={people}
		placeholder="Mention someone with @"
		onSubmit={(value) => console.log(value)}
	/>

	<div class="demo-mention-input-row">
		<button type="button" onclick={() => peopleRef?.insert('@')}>Insert @</button>
		<button type="button" onclick={() => peopleRef?.openSuggestions('person')}>Suggest people</button>
		<button type="button" onclick={() => peopleRef?.clear()}>Clear</button>
		<span>Stored: {serializeMentions(peopleValue)}</span>
	</div>

	<MentionInput
		bind:value={channelValue}
		channels={channels}
		placeholder="Reference a channel with #"
		maxRows={5}
	/>

	<MentionInput value={{ text: '', mentions: [] }} placeholder="Disabled mentions" disabled />
</div>

<style>
	.demo-mention-input-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		max-width: 560px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.demo-mention-input-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
	}
</style>
