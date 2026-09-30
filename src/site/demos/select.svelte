<script lang="ts">
	import { Select } from '$lib/components/select';

	let region = $state('eu');
	let framework = $state('');

	const regionOptions = [
		{ value: 'us', label: 'United States (us-east-1)' },
		{ value: 'eu', label: 'Europe (eu-west-1)' },
		{ value: 'ap', label: 'Asia Pacific (ap-southeast-1)', disabled: true },
		{ value: 'sa', label: 'South America (sa-east-1)' }
	];

	const frameworkOptions = [
		{ value: 'svelte', label: 'SvelteKit 2.0' },
		{ value: 'astro', label: 'Astro 5.0' },
		{ value: 'next', label: 'Next.js 15' },
		{ value: 'nuxt', label: 'Nuxt 3' }
	];
</script>

<div class="demo-select-container">
	<Select
		label="Cloud Region"
		bind:value={region}
		options={regionOptions}
		description="Primary deployment region for compute instances."
	/>

	<Select
		label="Application Framework"
		bind:value={framework}
		options={frameworkOptions}
		placeholder="Pick your framework..."
	/>

	<div class="selection-readout">
		<span>Selected Region: <strong>{region || 'none'}</strong></span>
		<span>Selected Framework: <strong>{framework || 'none'}</strong></span>
	</div>
</div>

<style>
	.demo-select-container {
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
