<script lang="ts">
	import { Tabs, TabsList, TabsTrigger, TabsContent } from '$lib/components/tabs';

	let currentTab = $state('overview');
</script>

<div class="demo-box">
	<Tabs bind:value={currentTab} defaultValue="overview">
		<TabsList aria-label="Project views">
			<TabsTrigger value="overview">Overview</TabsTrigger>
			<TabsTrigger value="features">Features</TabsTrigger>
			<TabsTrigger value="team">Team</TabsTrigger>
			<TabsTrigger value="billing" disabled>Billing</TabsTrigger>
		</TabsList>

		<TabsContent value="overview">
			<div class="demo-panel">
				<h4>Project Dashboard</h4>
				<p>Real-time analytics and system status for your SvelteKit deployment.</p>
			</div>
		</TabsContent>

		<TabsContent value="features">
			<div class="demo-panel">
				<h4>Feature Flags</h4>
				<p>12 features active in production, 3 in staging evaluation.</p>
			</div>
		</TabsContent>

		<TabsContent value="team">
			<div class="demo-panel">
				<h4>Contributors</h4>
				<p>4 core engineers collaborating across the Sveltebois swarm.</p>
			</div>
		</TabsContent>

		<TabsContent value="billing">
			<div class="demo-panel">
				<h4>Subscription</h4>
				<p>Enterprise tier with unlimited parallel subagents.</p>
			</div>
		</TabsContent>
	</Tabs>

	<p class="demo-status">Active tab: <strong>{currentTab}</strong></p>
</div>

<style>
	.demo-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 2.5rem;
		width: 100%;
		max-width: 32rem;
		margin: 0 auto;
	}
	.demo-panel {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 1rem 0;
	}
	.demo-panel h4 {
		margin: 0;
		font-size: 0.9375rem;
		font-weight: 600;
	}
	.demo-panel p {
		margin: 0;
		font-size: 0.875rem;
		color: var(--color-fg-muted, #71717a);
	}
	.demo-status {
		font-size: 0.8125rem;
		color: var(--color-fg-muted, #71717a);
	}
	.demo-status strong {
		color: var(--color-fg-default, #18181b);
	}
</style>
