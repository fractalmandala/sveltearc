<script lang="ts">
	import { Slider } from '$lib/components/slider';

	let brightness = $state(65);
	let priceRange = $state<[number, number]>([25, 75]);
</script>

<div class="demo-slider-container">
	<div class="demo-slider-box">
		<Slider
			label="Display Brightness"
			min={0}
			max={100}
			step={1}
			bind:value={brightness}
			format={(v) => `${v}%`}
		/>
	</div>

	<div class="demo-slider-box">
		<Slider
			label="Budget Range ($USD)"
			min={0}
			max={100}
			step={5}
			bind:value={priceRange}
			format={(v) => `$${v}`}
		/>
	</div>

	<div class="demo-slider-box">
		<Slider
			label="Size"
			min={0}
			max={100}
			step={25}
			defaultValue={50}
			marks={[{ value: 0, label: 'S' }, 25, { value: 50, label: 'M' }, 75, { value: 100, label: 'L' }]}
		/>
	</div>
</div>

<style>
	.demo-slider-container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;
		max-width: 520px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.demo-slider-box {
		padding: 1.5rem;
		background: var(--surface, #111);
		border: 1px solid var(--border, rgba(255, 255, 255, 0.12));
		border-radius: var(--radius-control, 8px);
	}
</style>
