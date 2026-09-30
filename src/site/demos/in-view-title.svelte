<script lang="ts">
	import { InViewTitle } from '$lib/components/in-view-title';
</script>

<div class="demo-in-view-title-wrap">
	<InViewTitle text="Built for the long read" variant="blur" as="h2" />
	<InViewTitle text="Built for the long read" variant="word" as="h3" />
	<InViewTitle text="Built for the long read" variant="line" as="h3" lines={['Built for', 'the long read']} />
	<InViewTitle text="Built for the long read" variant="tracking" as="h3" />
	<InViewTitle text="Built for the long read" variant="wipe" as="h3" />
</div>

<style>
	.demo-in-view-title-wrap {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1.5rem;
		padding: 2.5rem 1rem;
		width: 100%;
	}
</style>
