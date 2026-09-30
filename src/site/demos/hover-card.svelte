<script lang="ts">
	import { HoverCard, HoverCardProfile } from '$lib/components/hover-card';
</script>

<div class="demo-hover-card-row">
	<HoverCard>
		{#snippet children()}
			<button type="button" class="mention-pill">@maya</button>
		{/snippet}

		{#snippet content()}
			<HoverCardProfile
				name="Maya Chen"
				role="Product Designer, Core Systems"
				avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face"
				bio="Leading component craft and design architecture for the web platform."
				stats={[
					{ label: 'Repos', value: 14 },
					{ label: 'Followers', value: '1.2k' }
				]}
			/>
		{/snippet}
	</HoverCard>

	<HoverCard side="top" align="center">
		{#snippet children()}
			<a href="#alex" class="mention-pill">@alex</a>
		{/snippet}

		{#snippet content()}
			<HoverCardProfile
				name="Alex Rivera"
				role="Systems Engineer, Infrastructure"
				avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face"
				bio="Building high-throughput edge nodes and reactive primitives."
				stats={[
					{ label: 'Deploys', value: 340 },
					{ label: 'Uptime', value: '99.99%' }
				]}
			/>
		{/snippet}
	</HoverCard>
</div>

<style>
	.demo-hover-card-row {
		display: flex;
		gap: 2rem;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1rem;
	}

	.mention-pill {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.75rem;
		background: var(--surface-muted, rgba(255, 255, 255, 0.08));
		border: 1px solid var(--border, rgba(255, 255, 255, 0.15));
		border-radius: var(--radius-pill, 9999px);
		color: var(--accent, #6366f1);
		font-family: var(--font-mono, monospace);
		font-size: var(--text-sm, 0.875rem);
		font-weight: 500;
		text-decoration: none;
		cursor: pointer;
		transition: background-color 0.15s ease, border-color 0.15s ease;
	}

	.mention-pill:hover,
	.mention-pill:focus-visible {
		background: var(--surface-raised, rgba(255, 255, 255, 0.14));
		border-color: var(--accent, #6366f1);
		outline: none;
	}
</style>
