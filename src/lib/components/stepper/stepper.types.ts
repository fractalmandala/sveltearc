export type StepperOrientation = 'horizontal' | 'vertical';
export type StepperStatus = 'complete' | 'current' | 'upcoming' | 'error';

export interface StepperStep {
	/** Stable key, so each step keeps its own identity when the list changes. */
	id: string;
	label: string;
	/** A short hint under the label. */
	description?: string;
	/** Marks the step as failed: the marker becomes an alert and this message replaces the description. */
	error?: string;
}

/**
 * Port of ARC `Stepper` — `registry/components/stepper/stepper.tsx`.
 *
 * A steps indicator for onboarding, checkout, and setup flows. Drive it with `current`;
 * set `current` to `steps.length` once every step is done. `className` maps to Svelte's `class`.
 */
export interface Props {
	steps: StepperStep[];
	/** Index of the step in progress; `steps.length` marks the whole flow complete. */
	current: number;
	orientation?: StepperOrientation;
	/** Called with the index of a completed step when chosen. Without it the stepper is read-only. */
	onStepSelect?: (index: number) => void;
	/** `current` shows only the active step's description. Errors always show. */
	details?: 'all' | 'current';
	/** Markers only; labels stay available to assistive tech. */
	compact?: boolean;
	/** Accessible name for the stepper. */
	label?: string;
	/** Announced, and shown in the compact caption, once every step is complete. */
	completeLabel?: string;
	/** Extra classes merged onto the root. */
	class?: string;
}

export type StepperProps = Props;
