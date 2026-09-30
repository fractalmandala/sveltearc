<script lang="ts">
	import { SlotText } from '$lib/components/slot-text';

	const values = [999, 1000, 12480, 'Liftoff'];
	let index = $state(2);
</script>

<div class="demo-slot-text-wrap">
	<SlotText value={values[index]} announce />
	<button
		class="demo-slot-text-toggle"
		onclick={() => (index = (index + 1) % values.length)}
	>
		Next value
	</button>
</div>

<style>
	.demo-slot-text-wrap {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 2.5rem 1rem;
		width: 100%;
	}
	.demo-slot-text-toggle {
		padding: 0.375rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: 0.375rem;
		background: var(--background);
		color: var(--foreground);
		cursor: pointer;
	}
</style>
