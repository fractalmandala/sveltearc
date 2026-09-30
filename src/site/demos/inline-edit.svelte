<script lang="ts">
	import { InlineEdit } from '$lib/components/inline-edit';

	let name = $state('Launch plan');
	let description = $state('Everything for the spring release.');
	let failing = $state('Unstable title');

	function wait(ms: number) {
		return new Promise<void>((resolve) => setTimeout(resolve, ms));
	}

	async function saveName(next: string) {
		await wait(600);
		name = next;
	}

	async function saveDescription(next: string) {
		await wait(600);
		description = next;
	}

	function validateName(next: string) {
		if (!next) return 'Give it a name first.';
		return null;
	}

	async function saveFailing(): Promise<unknown> {
		await wait(600);
		throw new Error('Save failed');
	}
</script>

<div class="demo-inline-edit-container">
	<InlineEdit label="Project name" bind:value={name} onSave={saveName} validate={validateName} />

	<InlineEdit
		label="Description"
		bind:value={description}
		onSave={saveDescription}
		multiline
		variant="body"
	/>

	<InlineEdit label="Release title" bind:value={failing} onSave={saveFailing} as="h2" />
</div>

<style>
	.demo-inline-edit-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		max-width: 440px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}
</style>
