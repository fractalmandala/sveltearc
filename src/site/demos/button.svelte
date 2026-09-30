<script lang="ts">
	import { Button } from '$lib/components/button';

	let loading = $state(false);

	function handleClick() {
		loading = true;
		setTimeout(() => {
			loading = false;
		}, 1500);
	}
</script>

<div class="demo-button-row">
	<Button variant="primary" {loading} onclick={handleClick}>
		{loading ? 'Saving...' : 'Save Changes'}
	</Button>
	<Button variant="secondary">Secondary</Button>
	<Button variant="ghost">Ghost</Button>
	<Button variant="danger">Destructive</Button>
</div>

<style>
	.demo-button-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1rem;
		width: 100%;
	}
</style>
