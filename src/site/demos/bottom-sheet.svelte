<script lang="ts">
	import { BottomSheet, BottomSheetClose } from '$lib/components/bottom-sheet';

	let open = $state(false);
	let activeDetent = $state(0);
</script>

<div class="demo-sheet-container">
	<BottomSheet
		bind:open
		title="Flight Confirmation — UA 842"
		description="San Francisco (SFO) → Tokyo Haneda (HND)"
		detents={[0.4, 0.88]}
		initialDetent={0}
		onDetentChange={(d) => (activeDetent = d)}
	>
		{#snippet trigger({ props })}
			<button {...props} type="button" class="demo-sheet-trigger">
				View Boarding Pass & Details
			</button>
		{/snippet}

		<div class="demo-sheet-body">
			<div class="flight-card">
				<div class="flight-endpoint">
					<span class="code">SFO</span>
					<span class="city">San Francisco</span>
					<span class="time">11:15 AM</span>
				</div>
				<div class="flight-arrow">✈</div>
				<div class="flight-endpoint">
					<span class="code">HND</span>
					<span class="city">Tokyo</span>
					<span class="time">3:25 PM +1</span>
				</div>
			</div>

			<div class="flight-meta-grid">
				<div class="meta-item">
					<span class="label">Seat</span>
					<span class="value">14A (Window)</span>
				</div>
				<div class="meta-item">
					<span class="label">Terminal</span>
					<span class="value">Terminal 3, G92</span>
				</div>
				<div class="meta-item">
					<span class="label">Status</span>
					<span class="value badge-ok">On Time</span>
				</div>
			</div>

			<div class="sheet-actions">
				<BottomSheetClose class="demo-btn-close">Close Boarding Pass</BottomSheetClose>
			</div>
		</div>
	</BottomSheet>
</div>

<style>
	.demo-sheet-container {
		display: flex;
		justify-content: center;
		padding: 3rem 1rem;
	}

	.demo-sheet-trigger {
		padding: 0.65rem 1.25rem;
		background: var(--surface-raised, rgba(255, 255, 255, 0.1));
		border: 1px solid var(--border, rgba(255, 255, 255, 0.2));
		border-radius: var(--radius-control, 8px);
		color: var(--foreground, #fff);
		font-size: var(--text-sm, 0.875rem);
		font-weight: 500;
		cursor: pointer;
		transition: background-color 0.15s ease, border-color 0.15s ease;
	}

	.demo-sheet-trigger:hover {
		background: var(--surface-muted, rgba(255, 255, 255, 0.15));
		border-color: var(--border-strong, rgba(255, 255, 255, 0.3));
	}

	.demo-sheet-body {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding-top: 0.5rem;
	}

	.flight-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.25rem;
		background: var(--surface-muted, rgba(255, 255, 255, 0.05));
		border: 1px solid var(--border, rgba(255, 255, 255, 0.1));
		border-radius: var(--radius-panel, 12px);
	}

	.flight-endpoint {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.flight-endpoint .code {
		font-family: var(--font-mono, monospace);
		font-size: var(--text-xl, 1.25rem);
		font-weight: 700;
		color: var(--foreground, #fff);
	}

	.flight-endpoint .city {
		font-size: var(--text-xs, 0.75rem);
		color: var(--text-secondary, #999);
	}

	.flight-endpoint .time {
		font-size: var(--text-sm, 0.875rem);
		font-weight: 500;
		color: var(--foreground, #fff);
	}

	.flight-arrow {
		font-size: 1.25rem;
		color: var(--accent, #6366f1);
	}

	.flight-meta-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		padding: 1rem;
		background: var(--surface-muted, rgba(255, 255, 255, 0.03));
		border: 1px solid var(--border, rgba(255, 255, 255, 0.08));
		border-radius: var(--radius-control, 8px);
	}

	.meta-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.meta-item .label {
		font-size: var(--text-xs, 0.75rem);
		color: var(--text-muted, #777);
	}

	.meta-item .value {
		font-size: var(--text-sm, 0.875rem);
		font-weight: 500;
		color: var(--foreground, #fff);
	}

	.badge-ok {
		color: #22c55e !important;
	}

	.sheet-actions {
		display: flex;
		justify-content: flex-end;
		margin-top: 0.5rem;
	}

	:global(.demo-btn-close) {
		padding: 0.5rem 1rem;
		background: var(--surface-muted, rgba(255, 255, 255, 0.08));
		border: 1px solid var(--border, rgba(255, 255, 255, 0.15));
		border-radius: var(--radius-control, 8px);
		color: var(--foreground, #fff);
		font-size: var(--text-sm, 0.875rem);
		cursor: pointer;
	}
</style>
