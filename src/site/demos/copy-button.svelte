<script lang="ts">
	import { CopyButton } from '$lib/components/copy-button';

	const token = 'arc_live_99d8e7b1a204f6c5';
	const installCmd = 'pnpm dlx shadcn-svelte@latest add @arcui/button';
</script>

<div class="demo-copy-container">
	<div class="demo-snippet-box">
		<code>{installCmd}</code>
		<CopyButton value={installCmd} label="Copy command" iconOnly />
	</div>

	<div class="demo-copy-row">
		<CopyButton value={token} label="Copy API Token" variant="outline" />
		<CopyButton value={token} label="Copy Plain" variant="plain" />
		<CopyButton value="disabled-sample" label="Disabled" disabled />
	</div>
</div>

<style>
	.demo-copy-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: center;
		justify-content: center;
		width: 100%;
		max-width: 520px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.demo-snippet-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 0.6rem 0.85rem;
		background: var(--surface, #111);
		border: 1px solid var(--border, rgba(255, 255, 255, 0.15));
		border-radius: var(--radius-control, 8px);
		font-family: var(--font-mono, monospace);
		font-size: var(--text-xs, 0.75rem);
		color: var(--foreground, #fff);
	}

	.demo-copy-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		align-items: center;
		justify-content: center;
	}
</style>
