<script lang="ts">
	import { Stepper } from '$lib/components/stepper';
	import type { StepperStep } from '$lib/components/stepper';

	const steps: StepperStep[] = [
		{ id: 'account', label: 'Account', description: 'Email and password' },
		{ id: 'profile', label: 'Profile', description: 'Name and photo' },
		{ id: 'billing', label: 'Billing', description: 'Payment method' },
		{ id: 'review', label: 'Review', description: 'Confirm and finish' }
	];

	let current = $state(1);
	let failing = $state(2);
</script>

<div class="demo-grid">
	<Stepper {steps} {current} onStepSelect={(index) => (current = index)} />
	<div class="demo-row">
		<button class="demo-trigger" onclick={() => (current = Math.max(0, current - 1))}>Back</button>
		<button class="demo-trigger" onclick={() => (current = Math.min(steps.length, current + 1))}
			>Next</button
		>
	</div>

	<Stepper
		steps={[
			{ id: 'a', label: 'Connect', description: 'Link your repo' },
			{ id: 'b', label: 'Build', error: 'Build failed on the last run' },
			{ id: 'c', label: 'Deploy', description: 'Ship it' }
		]}
		current={failing}
		orientation="vertical"
	/>
</div>
