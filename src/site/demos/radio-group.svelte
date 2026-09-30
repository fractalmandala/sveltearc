<script lang="ts">
	import { RadioGroup } from '$lib/components/radio-group';

	let plan = $state('team');
</script>

<div class="demo-radio-group-wrap">
	<div class="demo-box">
		<RadioGroup
			label="Choose a subscription tier"
			name="billing-plan"
			bind:value={plan}
			options={[
				{
					value: 'hobby',
					label: 'Hobbyist',
					description: 'Free forever. Ideal for personal experiments.'
				},
				{
					value: 'team',
					label: 'Team Pro',
					description: 'Collaborate with up to 20 seats and shared components.'
				},
				{
					value: 'enterprise',
					label: 'Enterprise',
					description: 'Custom SLA, SAML SSO, and dedicated design engineering.'
				}
			]}
		/>

		<div class="demo-output">
			Selected Plan: <code>{plan}</code>
		</div>
	</div>
</div>

<style>
	.demo-radio-group-wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2.5rem 1rem;
		width: 100%;
	}
	.demo-box {
		width: 100%;
		max-width: 440px;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}
	.demo-output {
		font-size: var(--text-xs);
		color: var(--text-secondary);
		padding: 0.5rem 0.75rem;
		background: var(--surface-muted);
		border-radius: var(--radius-control);
		border: 1px solid var(--border);
	}
	.demo-output code {
		color: var(--accent);
		font-weight: 500;
	}
</style>
