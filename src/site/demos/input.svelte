<script lang="ts">
	import { Input } from '$lib/components/input';

	let email = $state('');
	let username = $state('amrit');
	let errorVal = $state('invalid-key-format');
</script>

<div class="demo-input-container">
	<Input
		label="Work Email"
		type="email"
		placeholder="you@company.com"
		description="We will send a single sign-on magic link."
		bind:value={email}
	/>

	<Input
		label="Username"
		placeholder="username"
		bind:value={username}
	/>

	<Input
		label="API Secret Key"
		error="Secret key must begin with 'sk_live_'"
		bind:value={errorVal}
	/>

	<Input
		label="Organization ID"
		value="org_99214710"
		disabled
	/>
</div>

<style>
	.demo-input-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		max-width: 440px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}
</style>
