<script lang="ts">
	import { ThemeSwitch } from '$lib/components/theme-switch';
	import type { Theme, ThemeSwitchVariant } from '$lib/components/theme-switch';

	let theme = $state<Theme>('light');
	let variant = $state<ThemeSwitchVariant>('reveal');
	let iconOnly = $state(false);
</script>

<div class="demo-theme-switch-wrap">
	<div class="demo-box">
		<div class="demo-switch-surface" data-preview-theme={theme}>
			<ThemeSwitch
				bind:theme
				{variant}
				{iconOnly}
			/>
			<span class="demo-badge">Active: {theme}</span>
		</div>

		<div class="demo-controls">
			<label>
				Variant:
				<select bind:value={variant}>
					<option value="reveal">Reveal</option>
					<option value="eclipse">Eclipse</option>
					<option value="split">Split</option>
					<option value="rise">Rise</option>
				</select>
			</label>

			<label class="demo-checkbox-label">
				<input type="checkbox" bind:checked={iconOnly} />
				Icon only mode
			</label>
		</div>
	</div>
</div>

<style>
	.demo-theme-switch-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1rem;
		width: 100%;
	}
	.demo-box {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: center;
	}
	.demo-switch-surface {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 1.5rem 2rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-card);
		background: var(--surface);
		transition: background-color var(--duration-fast) var(--ease-standard);
	}
	.demo-badge {
		font-size: var(--text-xs);
		color: var(--text-secondary);
		padding: 0.25rem 0.6rem;
		border-radius: var(--radius-pill);
		background: var(--surface-muted);
		border: 1px solid var(--border);
		text-transform: capitalize;
	}
	.demo-controls {
		display: flex;
		gap: 1.5rem;
		align-items: center;
		font-size: var(--text-xs);
		color: var(--text-secondary);
	}
	.demo-controls select {
		margin-left: 0.5rem;
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-control);
		background: var(--surface);
		color: var(--foreground);
	}
	.demo-checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		cursor: pointer;
	}
</style>
