<script lang="ts">
	import Switch from '$lib/components/switch/switch.svelte';

	let bound = $state(false);
	let controlled = $state(true);
	let viaCallback = $state(false);
</script>

<div class="demo-grid">
	<Switch bind:checked={bound} label="Notifications" />
	<Switch bind:checked={controlled} label="Controlled (starts on)" />
	<Switch checked={viaCallback} onCheckedChange={(next) => (viaCallback = next)} label="Callback" />
	<Switch defaultChecked label="Default on (uncontrolled)" />
	<Switch disabled label="Disabled" />
</div>

<p class="demo-note">
	bound: <strong>{bound ? 'on' : 'off'}</strong> · controlled: <strong>{controlled ? 'on' : 'off'}</strong> ·
	callback: <strong>{viaCallback ? 'on' : 'off'}</strong>
</p>
