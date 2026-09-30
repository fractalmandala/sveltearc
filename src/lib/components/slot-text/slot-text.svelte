<script lang="ts">
	import type { Props } from './slot-text.types';
	import styles from './slot-text.module.css';

	let {
		value,
		format,
		duration = 0.9,
		stagger = 0.07,
		spins = 1,
		align,
		announce = false,
		class: classNameProp,
		style,
		...restProps
	}: Props = $props();

	const text = $derived(
		typeof value === 'number' ? (format ? format(value) : value.toLocaleString('en-US')) : value
	);
	const chars = $derived(Array.from(text));
	const classes = $derived([styles.root, classNameProp].filter(Boolean).join(' '));
</script>

<!--
	Phase-1 still-port: every reel renders its landed target cell statically.
	The spin strips, width springs, velocity blur and AnimatePresence enter/exit
	are deferred to Phase 2 (see manifest gaps). `duration`, `stagger`, `spins`
	and `align` are accepted for API parity only.
-->
<span class={classes} {style} {...restProps}>
	<span class={styles.srOnly} aria-live={announce ? 'polite' : undefined}>{text}</span>
	<span class={styles.reels} aria-hidden="true">
		{#each chars as char, i (i)}
			<span class={styles.slot}>
				<span class={styles.sizer}>{char === ' ' ? '\u00a0' : char}</span>
				<span class={styles.window}>
					<span class={styles.strip}>
						<span class={styles.cell}>{char === ' ' ? '\u00a0' : char}</span>
					</span>
				</span>
			</span>
		{/each}
	</span>
</span>
