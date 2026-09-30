<script lang="ts">
	import AnimatedCounter from '$lib/components/animated-counter/animated-counter.svelte';

	let revenue = $state(128400);
</script>

<div class="demo-grid">
	<AnimatedCounter value={revenue} label="Monthly revenue" prefix="$" />
	<AnimatedCounter value={97.5} decimals={1} suffix="%" label="Retention" />
	<AnimatedCounter value={1048576} label="Events processed" />
	<button type="button" onclick={() => (revenue += 1250)}>Add $1,250</button>
</div>

<p class="demo-note">
	revenue: <strong>{revenue}</strong>
</p>
