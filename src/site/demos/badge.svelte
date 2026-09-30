<script lang="ts">
	import { Badge } from '$lib/components/badge';
	import { Check, ShieldAlert, Sparkles, AlertCircle } from '@lucide/svelte';
</script>

{#snippet checkIcon()}
	<Check size={12} />
{/snippet}

{#snippet alertIcon()}
	<AlertCircle size={12} />
{/snippet}

{#snippet shieldIcon()}
	<ShieldAlert size={12} />
{/snippet}

{#snippet sparkleIcon()}
	<Sparkles size={12} />
{/snippet}

<div class="demo-badge-wrap">
	<div class="demo-badge-row">
		<Badge tone="neutral">Draft</Badge>
		<Badge tone="success" icon={checkIcon}>Live</Badge>
		<Badge tone="info" icon={sparkleIcon}>Experimental</Badge>
		<Badge tone="warning" icon={alertIcon}>Pending</Badge>
		<Badge tone="danger" icon={shieldIcon}>Security Alert</Badge>
	</div>
	<div class="demo-badge-row">
		<Badge tone="neutral" size="sm">Small Neutral</Badge>
		<Badge tone="success" size="sm" icon={checkIcon}>Small Success</Badge>
		<Badge tone="info" size="sm">Small Info</Badge>
	</div>
</div>

<style>
	.demo-badge-wrap {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1rem;
		width: 100%;
	}

	.demo-badge-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
		justify-content: center;
	}
</style>
