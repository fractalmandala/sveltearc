<script lang="ts">
	import Checkbox from '$lib/components/checkbox/checkbox.svelte';
	import type { CheckedState } from '$lib/components/checkbox/checkbox.types';

	let bound = $state<CheckedState>(false);
	let mixed = $state<CheckedState>('indeterminate');
	let viaCallback = $state<CheckedState>(false);
</script>

<div class="demo-grid">
	<Checkbox bind:checked={bound} label="Accept terms" description="You can change this later." />
	<Checkbox bind:checked={mixed} label="Indeterminate (starts mixed)" />
	<Checkbox
		checked={viaCallback}
		onCheckedChange={(next) => (viaCallback = next)}
		label="Callback"
	/>
	<Checkbox defaultChecked label="Default checked (uncontrolled)" />
	<Checkbox disabled label="Disabled" />
</div>

<p class="demo-note">
	bound: <strong>{bound ? 'on' : 'off'}</strong> · mixed: <strong>{String(mixed)}</strong> · callback:
	<strong>{viaCallback ? 'on' : 'off'}</strong>
</p>
