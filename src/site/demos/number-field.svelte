<script lang="ts">
	import { NumberField } from '$lib/components/number-field';

	let seats = $state(4);
	let price = $state(19);
	let weight = $state(2.5);
	let limited = $state(9);
</script>

<div class="demo-number-field-container">
	<NumberField
		label="Seats"
		bind:value={seats}
		min={1}
		max={12}
		suffix={(n) => (n === 1 ? ' seat' : ' seats')}
		description="How many people need access."
	/>

	<NumberField
		label="Price"
		bind:value={price}
		min={0}
		max={999}
		prefix="$"
		step={1}
		size="lg"
	/>

	<NumberField
		label="Weight"
		bind:value={weight}
		min={0}
		max={10}
		step={0.5}
		suffix=" kg"
		scrub
		size="sm"
		description="Drag the label to scrub."
	/>

	<NumberField
		label="Retries"
		bind:value={limited}
		min={0}
		max={10}
		description="Held presses lean on the limits."
	/>

	<NumberField
		label="Disabled quota"
		value={3}
		min={0}
		max={10}
		disabled
	/>
</div>

<style>
	.demo-number-field-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		max-width: 440px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}
</style>
