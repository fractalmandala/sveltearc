<script lang="ts">
	import { PhoneInput } from '$lib/components/phone-input';

	let number = $state('');
	let country = $state('US');
	let constrained = $state('');
</script>

<div class="demo-phone-input-container">
	<PhoneInput
		label="Mobile number"
		bind:value={number}
		bind:country={country}
		description="Used only for delivery updates."
	/>

	<p class="demo-phone-input-output">
		E.164: <strong>{number || '—'}</strong> · Country: <strong>{country}</strong>
	</p>

	<PhoneInput
		label="Support line"
		bind:value={constrained}
		countries={['US', 'CA', 'GB']}
		error={constrained ? undefined : 'Enter a test number.'}
	/>

	<PhoneInput label="Disabled number" value="+14155550132" disabled />
</div>

<style>
	.demo-phone-input-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		max-width: 560px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.demo-phone-input-output {
		margin: 0;
	}
</style>
