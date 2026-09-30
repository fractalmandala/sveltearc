<script lang="ts">
	import { untrack } from 'svelte';
	import { Switch } from 'bits-ui';
	import { animate, motion, useMotionValue, useReducedMotion } from '@humanspeak/svelte-motion';
	import { motionTokens } from '../../motion-tokens';
	import styles from './switch.module.css';
	import type { Props } from './switch.types';

	let {
		checked = $bindable(undefined),
		defaultChecked = false,
		onCheckedChange,
		disabled = false,
		label,
		class: className,
		ref = $bindable(null),
		onpointerdown,
		onpointerup,
		onpointerleave,
		onpointercancel,
		onkeydown,
		onkeyup,
		onblur,
		...rest
	}: Props = $props();

	/** Uncontrolled mirror; captures only the initial `defaultChecked`. */
	let internal = $state(untrack(() => defaultChecked));
	const on = $derived(checked ?? internal);

	/** Track inner width (42 - 6 padding) minus the 18px thumb; keep in sync with switch.module.css. */
	const size = 18;
	const travel = 18;
	/** How far the thumb widens toward the other side while pressed. */
	const stretch = 5;
	/** Critically damped: the thumb lands on its end without overshooting the state it reports. */
	const glide = { type: 'spring', visualDuration: 0.3, bounce: 0 } as const;

	const reduced = useReducedMotion();
	let pressed = $state(false);
	const extra = $derived(pressed && !reduced.current && !disabled ? stretch : 0);

	// A brief stretch along the travel, so the thumb reads as moving mass rather than a sliding dot.
	const scaleX = useMotionValue(1);
	let shown = untrack(() => on);
	$effect(() => {
		if (shown === on) return;
		shown = on;
		if (reduced.current) return;
		const controls = animate(scaleX, [1, 1.16, 1], {
			duration: 0.34,
			times: [0, 0.4, 1],
			ease: ['easeOut', 'easeInOut']
		});
		return () => controls.stop();
	});

	function handleCheckedChange(next: boolean) {
		if (checked === undefined) internal = next;
		else checked = next;
		onCheckedChange?.(next);
	}

	const classes = $derived([styles.switch, className].filter(Boolean).join(' '));
	const ariaLabel = $derived(rest['aria-label'] ?? label);
</script>

<Switch.Root
	{...rest}
	bind:ref
	{disabled}
	checked={on}
	onCheckedChange={handleCheckedChange}
	class={classes}
	aria-label={ariaLabel}
	onpointerdown={(event) => {
		onpointerdown?.(event);
		if (event.button === 0) pressed = true;
	}}
	onpointerup={(event) => {
		onpointerup?.(event);
		pressed = false;
	}}
	onpointerleave={(event) => {
		onpointerleave?.(event);
		pressed = false;
	}}
	onpointercancel={(event) => {
		onpointercancel?.(event);
		pressed = false;
	}}
	onkeydown={(event) => {
		onkeydown?.(event);
		if (event.key === ' ') pressed = true;
	}}
	onkeyup={(event) => {
		onkeyup?.(event);
		pressed = false;
	}}
	onblur={(event) => {
		onblur?.(event);
		pressed = false;
	}}
>
	<span class={styles.track}>
		<!-- The thumb stretches like a held finger and keeps its far edge anchored, then travels on a spring. -->
		<motion.span
			class={styles.thumb}
			style={{ scaleX }}
			initial={false}
			animate={{ x: on ? travel - extra : 0, width: size + extra }}
			transition={reduced.current
				? { duration: 0 }
				: { x: glide, width: motionTokens.spring.snappy }}
		></motion.span>
	</span>
	{#if label}<span class={styles.label}>{label}</span>{/if}
</Switch.Root>
