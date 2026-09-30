<script lang="ts">
	import type { Props } from './password-field.types';
	import styles from './password-field.module.css';

	const fallbackId = $props.id();

	let {
		label,
		description,
		value = $bindable(''),
		id = fallbackId,
		class: classNameProp,
		className,
		'aria-describedby': ariaDescribedBy,
		...restProps
	}: Props = $props();

	let visible = $state(false);
	let toggled = $state(false);

	const maskId = `eye-${fallbackId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
	const hintId = $derived(description ? `${id}-description` : undefined);
	const describedBy = $derived([ariaDescribedBy, hintId].filter(Boolean).join(' ') || undefined);

	function toggleVisibility() {
		visible = !visible;
		toggled = true;
	}

	const inputClasses = $derived([styles.input, classNameProp, className].filter(Boolean).join(' '));
</script>

<div class={styles.field}>
	<label for={id}>{label}</label>
	<div class={styles.shell}>
		<input
			{id}
			type={visible ? 'text' : 'password'}
			bind:value
			data-reveal={toggled ? (visible ? 'shown' : 'hidden') : undefined}
			aria-describedby={describedBy}
			class={inputClasses}
			{...restProps}
		/>
		<button
			type="button"
			onclick={toggleVisibility}
			aria-label={visible ? 'Hide password' : 'Show password'}
			aria-pressed={visible}
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.75"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
					<rect width="24" height="24" fill="white" stroke="none" />
					{#if visible}
						<path d="M2 2l20 20" stroke="black" stroke-width="5" />
					{/if}
				</mask>
				<g mask={`url(#${maskId})`}>
					<path
						d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
					/>
					<circle cx="12" cy="12" r="3" />
				</g>
				{#if visible}
					<path d="M2 2l20 20" />
				{/if}
			</svg>
		</button>
	</div>
	{#if description}
		<span class={styles.messageSlot}>
			<span id={hintId} class={styles.hint}>
				<span class={styles.words}>
					<span class={styles.word}>{description}</span>
				</span>
			</span>
		</span>
	{/if}
</div>
