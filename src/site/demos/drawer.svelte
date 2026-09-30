<script lang="ts">
	import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from '$lib/components/drawer';

	let openRight = $state(false);
	let openLeft = $state(false);
</script>

<div class="demo-drawer-row">
	<Drawer bind:open={openRight}>
		<DrawerTrigger class="demo-btn">Open Right Drawer</DrawerTrigger>

		<DrawerContent
			title="Environment Settings"
			description="Configure edge deployment regions and API tokens."
			side="right"
		>
			<div class="demo-drawer-content">
				<label class="demo-field">
					<span class="demo-label">Cluster Region</span>
					<input type="text" value="eu-west-1 (Ireland)" readonly class="demo-input" />
				</label>
				<label class="demo-field">
					<span class="demo-label">Telemetry Sampling</span>
					<input type="text" value="100% of incoming traces" readonly class="demo-input" />
				</label>
				<div class="demo-drawer-actions">
					<DrawerClose class="demo-btn-action">Save Changes</DrawerClose>
				</div>
			</div>
		</DrawerContent>
	</Drawer>

	<Drawer bind:open={openLeft}>
		<DrawerTrigger class="demo-btn">Open Left Drawer</DrawerTrigger>

		<DrawerContent
			title="Navigation Menu"
			description="Jump across internal services and monitoring."
			side="left"
		>
			<div class="demo-drawer-content">
				<nav class="demo-nav-list">
					<a href="#overview" class="demo-nav-item">System Overview</a>
					<a href="#metrics" class="demo-nav-item">Live Metrics</a>
					<a href="#deployments" class="demo-nav-item">Deployments</a>
					<a href="#logs" class="demo-nav-item">Audit Logs</a>
				</nav>
			</div>
		</DrawerContent>
	</Drawer>
</div>

<style>
	.demo-drawer-row {
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1rem;
	}

	:global(.demo-btn) {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 1rem;
		background: var(--surface-muted, rgba(255, 255, 255, 0.08));
		border: 1px solid var(--border, rgba(255, 255, 255, 0.15));
		border-radius: var(--radius-control, 8px);
		color: var(--foreground, #fff);
		font-size: var(--text-sm, 0.875rem);
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.15s ease, border-color 0.15s ease;
	}

	:global(.demo-btn:hover) {
		background: var(--surface-raised, rgba(255, 255, 255, 0.15));
		border-color: var(--border-strong, rgba(255, 255, 255, 0.25));
	}

	.demo-drawer-content {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding-top: 0.5rem;
	}

	.demo-field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.demo-label {
		font-size: var(--text-xs, 0.75rem);
		color: var(--text-secondary, #999);
	}

	.demo-input {
		padding: 0.5rem 0.75rem;
		background: var(--surface-muted, rgba(255, 255, 255, 0.05));
		border: 1px solid var(--border, rgba(255, 255, 255, 0.12));
		border-radius: var(--radius-control, 8px);
		color: var(--foreground, #fff);
		font-size: var(--text-sm, 0.875rem);
		font-family: var(--font-mono, monospace);
	}

	.demo-drawer-actions {
		margin-top: 1rem;
		display: flex;
		justify-content: flex-end;
	}

	:global(.demo-btn-action) {
		padding: 0.5rem 1rem;
		background: var(--accent, #6366f1);
		color: #fff;
		border: none;
		border-radius: var(--radius-control, 8px);
		font-size: var(--text-sm, 0.875rem);
		font-weight: 500;
		cursor: pointer;
	}

	.demo-nav-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.demo-nav-item {
		padding: 0.5rem 0.75rem;
		border-radius: var(--radius-control, 8px);
		color: var(--foreground, #fff);
		text-decoration: none;
		font-size: var(--text-sm, 0.875rem);
		transition: background-color 0.15s ease;
	}

	.demo-nav-item:hover {
		background: var(--surface-muted, rgba(255, 255, 255, 0.08));
	}
</style>
