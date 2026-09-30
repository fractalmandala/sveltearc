<script lang="ts">
	import { PasswordField } from '$lib/components/password-field';

	let password = $state('s3cure_P@ssw0rd!');

	const lengthScore = $derived(password.length >= 8 ? 1 : 0);
	const hasNumber = $derived(/\d/.test(password) ? 1 : 0);
	const hasSpecial = $derived(/[^a-zA-Z0-9]/.test(password) ? 1 : 0);
	const score = $derived(lengthScore + hasNumber + hasSpecial);

	const strengthLabel = $derived(
		score === 3 ? 'Strong' : score === 2 ? 'Medium' : score === 1 ? 'Weak' : 'Too short'
	);
	const strengthColor = $derived(
		score === 3 ? 'var(--success)' : score === 2 ? 'var(--warning)' : 'var(--danger)'
	);
</script>

<div class="demo-password-field-wrap">
	<div class="demo-box">
		<PasswordField
			label="Account Password"
			name="password"
			autocomplete="current-password"
			description="Must be at least 8 characters with numbers and symbols"
			bind:value={password}
			required
		/>

		<div class="demo-strength">
			<div class="demo-bar-track">
				<div
					class="demo-bar-fill"
					style="width: {(score / 3) * 100}%; background-color: {strengthColor};"
				></div>
			</div>
			<div class="demo-strength-meta">
				<span>Strength: <strong style="color: {strengthColor};">{strengthLabel}</strong></span>
				<span>Length: {password.length} chars</span>
			</div>
		</div>
	</div>
</div>

<style>
	.demo-password-field-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1rem;
		width: 100%;
	}
	.demo-box {
		width: 100%;
		max-width: 400px;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}
	.demo-strength {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.875rem;
		background: var(--surface-muted);
		border-radius: var(--radius-control);
		border: 1px solid var(--border);
	}
	.demo-bar-track {
		height: 4px;
		width: 100%;
		background: var(--border);
		border-radius: var(--radius-pill);
		overflow: hidden;
	}
	.demo-bar-fill {
		height: 100%;
		transition: width var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard);
	}
	.demo-strength-meta {
		display: flex;
		justify-content: space-between;
		font-size: var(--text-xs);
		color: var(--text-secondary);
	}
</style>
