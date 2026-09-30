<script lang="ts">
	import { Skeleton } from '$lib/components/skeleton';

	let loading = $state(true);

	function toggle() {
		loading = !loading;
	}
</script>

<div class="demo-skeleton-container">
	<div class="demo-controls">
		<button class="demo-btn" onclick={toggle}>
			Toggle State: {loading ? 'Loading Placeholder' : 'Content Loaded'}
		</button>
	</div>

	<div class="demo-card">
		<Skeleton avatar lines={3} {loading}>
			<div class="demo-profile">
				<div class="demo-avatar">AU</div>
				<div class="demo-info">
					<h4 class="demo-name">Arc UI Engineering</h4>
					<p class="demo-handle">@arcui • Design System Primitives</p>
					<p class="demo-bio">A clean, high-precision component library ported directly to Svelte 5 runes.</p>
				</div>
			</div>
		</Skeleton>
	</div>

	<div class="demo-card">
		<h5 class="demo-subtitle">Standalone, 4 lines</h5>
		<Skeleton lines={4} />
	</div>

	<div class="demo-card">
		<h5 class="demo-subtitle">lines=9 clamps to 6</h5>
		<Skeleton lines={9} label="Loading a long list" />
	</div>
</div>

<style>
	.demo-skeleton-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: center;
		justify-content: center;
		padding: 2rem 1rem;
		width: 100%;
		max-width: 520px;
		margin: 0 auto;
	}

	.demo-controls {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.demo-btn {
		padding: 0.5rem 1rem;
		background: var(--surface-raised, rgba(255, 255, 255, 0.1));
		border: 1px solid var(--border, rgba(255, 255, 255, 0.2));
		border-radius: var(--radius-control, 8px);
		color: var(--foreground, #fff);
		font-size: var(--text-sm, 0.875rem);
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.15s ease;
	}

	.demo-btn:hover {
		background: var(--surface-muted, rgba(255, 255, 255, 0.15));
	}

	.demo-card {
		width: 100%;
		padding: 1.5rem;
		background: var(--surface, #111);
		border: 1px solid var(--border, rgba(255, 255, 255, 0.12));
		border-radius: var(--radius-control, 8px);
	}

	.demo-subtitle {
		margin: 0 0 1rem 0;
		font-size: var(--text-xs, 0.75rem);
		color: var(--text-secondary, #999);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.demo-profile {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
	}

	.demo-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--accent, #6366f1);
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		font-size: 0.875rem;
		flex-shrink: 0;
	}

	.demo-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.demo-name {
		margin: 0;
		font-size: var(--text-sm, 0.875rem);
		font-weight: 600;
		color: var(--foreground, #fff);
	}

	.demo-handle {
		margin: 0;
		font-size: var(--text-xs, 0.75rem);
		color: var(--text-secondary, #999);
	}

	.demo-bio {
		margin: 0.25rem 0 0 0;
		font-size: var(--text-xs, 0.75rem);
		color: var(--text-secondary, #aaa);
		line-height: 1.4;
	}
</style>
