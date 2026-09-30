<script lang="ts">
	import AnnouncementBar, {
		clearAnnouncementDismissal
	} from '$lib/components/announcement-bar/announcement-bar.svelte';
	import type { Announcement } from '$lib/components/announcement-bar/announcement-bar.types';

	const deadline = Date.now() + 1000 * 60 * 62 + 1000 * 14;

	const messages: Announcement[] = [
		{
			id: 'launch',
			message: 'Aurora is live — see what shipped this week.',
			action: { label: 'Read the notes', href: '#' }
		},
		{
			id: 'sale',
			message: 'Spring sale ends soon.',
			countdown: { to: deadline, label: 'Ends in' }
		},
		{
			id: 'maintenance',
			message: 'Scheduled maintenance Sunday at 02:00 UTC.'
		}
	];

	let tone = $state<'neutral' | 'inverted'>('neutral');
	let controls = $state(true);
	let open = $state(true);
	let index = $state(0);
	let countdownEnded = $state(false);

	function reset() {
		clearAnnouncementDismissal('demo-campaign');
		open = true;
	}
</script>

<div class="demo-bar-wrap">
	{#if open}
		<AnnouncementBar
			{messages}
			id="demo-campaign"
			{open}
			onOpenChange={(o) => (open = o)}
			{index}
			onIndexChange={(i) => (index = i)}
			{tone}
			{controls}
			onCountdownEnd={() => (countdownEnded = true)}
		/>
	{:else}
		<div class="demo-dismissed">
			<span>Bar dismissed (remembered under “demo-campaign”)</span>
			<button type="button" class="demo-reset-btn" onclick={reset}>Show again</button>
		</div>
	{/if}

	<div class="demo-controls">
		<label>
			Tone:
			<select bind:value={tone}>
				<option value="neutral">Neutral</option>
				<option value="inverted">Inverted</option>
			</select>
		</label>
		<label>
			<input type="checkbox" bind:checked={controls} />
			Controls
		</label>
		<span>Message {index + 1} of {messages.length}{countdownEnded ? ' — countdown ended' : ''}</span>
	</div>
</div>

<style>
	.demo-bar-wrap {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 2.5rem 1rem;
		width: 100%;
	}
	.demo-dismissed {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem;
		border: 1px dashed var(--border);
		border-radius: var(--radius-control);
		font-size: var(--text-sm);
		color: var(--text-secondary);
	}
	.demo-reset-btn {
		padding: 0.375rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-control);
		background: var(--surface);
		color: var(--foreground);
		font-size: var(--text-xs);
		cursor: pointer;
	}
	.demo-controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1.5rem;
		font-size: var(--text-xs);
		color: var(--text-secondary);
	}
	.demo-controls label {
		display: flex;
		align-items: center;
		gap: 0.375rem;
	}
	.demo-controls select {
		background: var(--surface);
		color: var(--foreground);
		border: 1px solid var(--border);
		border-radius: var(--radius-control);
		padding: 0.2rem 0.4rem;
	}
</style>
