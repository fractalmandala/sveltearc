<script lang="ts">
	import MetricCard from '$lib/components/metric-card/metric-card.svelte';
</script>

<div class="demo-row demo-row-wrap">
	<div class="demo-card-wrap">
		<MetricCard
			label="Monthly revenue"
			value={128400}
			context="vs $114k last month"
			change="+12.4%"
		/>
	</div>
	<div class="demo-card-wrap">
		<MetricCard
			label="Churn rate"
			value={2.1}
			suffix="%"
			context="vs 2.4% last month"
			change="-0.3pts"
		/>
	</div>
	<div class="demo-card-wrap">
		<MetricCard label="Total seats" value={1200} context="across all workspaces" />
	</div>
</div>
