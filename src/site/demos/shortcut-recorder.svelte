<script lang="ts">
	import { ShortcutList, ShortcutRecorder } from '$lib/components/shortcut-recorder';

	let save = $state<string | null>(null);
	let search = $state<string | null>(null);
	const bindings = [{ shortcut: 'mod+s', label: 'Search' }];
	const groups = [
		{
			label: 'File',
			items: [
				{ label: 'Save', shortcut: 'mod+s' },
				{ label: 'Search', shortcut: 'mod+k', keywords: 'find command' }
			]
		},
		{
			label: 'Edit',
			items: [{ label: 'Undo', shortcut: 'mod+z' }]
		}
	];
</script>

<div class="demo-shortcut-recorder-container">
	<ShortcutRecorder
		label="Save"
		bind:value={save}
		bindings={bindings}
		description="Press the recorder, then press a chord."
	/>
	<ShortcutRecorder label="Quick search" bind:value={search} placeholder="Record Find" />
	<ShortcutList {groups} />
</div>

<style>
	.demo-shortcut-recorder-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		max-width: 560px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}
</style>
