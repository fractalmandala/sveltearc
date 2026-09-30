<script lang="ts">
	import { Combobox } from '$lib/components/combobox';

	let fruit = $state('apple');
	let city = $state('');
	let menuOpen = $state(false);

	const fruits = [
		{ value: 'apple', label: 'Apple', keywords: ['red', 'orchard'] },
		{ value: 'banana', label: 'Banana', keywords: ['yellow', 'tropical'] },
		{ value: 'cherry', label: 'Cherry', keywords: ['red', 'stone fruit'] },
		{ value: 'durian', label: 'Durian', disabled: true, keywords: ['tropical'] }
	];

	const cities = [
		{ value: 'oslo', label: 'Oslo' },
		{ value: 'kyoto', label: 'Kyoto' },
		{ value: 'lima', label: 'Lima' }
	];
</script>

<div class="demo-combobox-stack">
	<Combobox
		label="Fruit"
		bind:value={fruit}
		bind:open={menuOpen}
		options={fruits}
		description="Type to filter by name or keyword. Durian is unavailable."
	/>

	<Combobox
		label="City"
		bind:value={city}
		options={cities}
		placeholder="Pick a city…"
		emptyMessage="No cities match that search"
	/>

	<Combobox label="Disabled" value="apple" options={fruits} disabled />

	<div class="selection-readout">
		<span>Selected fruit: <strong>{fruit || 'none'}</strong></span>
		<span>Selected city: <strong>{city || 'none'}</strong></span>
		<span>Fruit menu: <strong>{menuOpen ? 'open' : 'closed'}</strong></span>
	</div>
</div>

<style>
	.demo-combobox-stack {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		width: 100%;
		max-width: 380px;
		margin: 0 auto;
	}

	.selection-readout {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.75rem 1rem;
		background: var(--surface-muted, rgba(255, 255, 255, 0.05));
		border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
		border-radius: var(--radius-control, 8px);
		font-size: var(--text-xs, 0.75rem);
		color: var(--text-muted, #888);
	}

	.selection-readout strong {
		color: var(--foreground, #fff);
	}
</style>
