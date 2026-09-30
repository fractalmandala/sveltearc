<script lang="ts">
	import Card from '$lib/components/card/card.svelte';
</script>

<div class="demo-row demo-row-wrap">
	<div class="demo-card-wrap">
		<Card title="Quarterly report" description="Revenue is up 18% quarter over quarter." status="Updated 2 hours ago">
			{#snippet details()}
				<p>
					The full breakdown — per-region revenue, retention and the forward plan — lands in this quick look.
					Press Escape or the close control to return to the card.
				</p>
			{/snippet}
		</Card>
	</div>
	<div class="demo-card-wrap">
		<Card title="Static card" description="No details, so this card never opens." />
	</div>
</div>
