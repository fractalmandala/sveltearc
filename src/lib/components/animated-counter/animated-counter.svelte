<script lang="ts">
	import styles from './animated-counter.module.css';
	import type { Props } from './animated-counter.types';

	let {
		value,
		label,
		prefix = '',
		suffix = '',
		decimals = 0,
		animateOnView = false,
		locale = 'en-US'
	}: Props = $props();

	// `animateOnView` is accepted in Phase 1; the in-view roll from zero is Phase 2.
	// It stays in the destructure (with its ARC default) as the Phase 2 wiring point.

	type Part = { key: string; digit: number; order: number } | { key: string; text: string };

	/**
	 * Split a formatted number into columns keyed by place value, so 999 → 1,000
	 * keeps the ones column the ones column. Same keying as ARC; Phase 2 animates
	 * inside these columns.
	 */
	function partsFor(value: number, decimals: number, locale: string): Part[] {
		const parts = new Intl.NumberFormat(locale, {
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
			numberingSystem: 'latn'
		}).formatToParts(value);
		let place = parts.reduce(
			(count, part) => count + (part.type === 'integer' ? part.value.length : 0),
			0
		);
		let fraction = 0;
		let order = 0;
		return parts.flatMap((part, index): Part[] => {
			if (part.type === 'integer')
				return [...part.value].map((char) => ({
					key: `i${--place}`,
					digit: Number(char),
					order: order++
				}));
			if (part.type === 'fraction')
				return [...part.value].map((char) => ({
					key: `f${fraction++}`,
					digit: Number(char),
					order: order++
				}));
			return [
				{
					key: part.type === 'group' ? `g${place}` : part.type === 'decimal' ? 'd' : `${part.type}${index}`,
					text: part.value
				}
			];
		});
	}

	const parts = $derived(partsFor(value, decimals, locale));
	const text = $derived(
		`${prefix}${parts.map((part) => ('text' in part ? part.text : part.digit)).join('')}${suffix}`
	);
</script>

<span class={styles.counter}>
	{#if label}
		<span class={styles.label}>
			<span class={styles.labelSwap}>
				<span class={styles.labelText}>{label}</span>
			</span>
		</span>
	{/if}
	<span class={styles.srOnly}>{text}</span>
	<span class={styles.value} aria-hidden="true">
		{#if prefix}<span class={styles.symbol}>{prefix}</span>{/if}
		{#each parts as part (part.key)}
			{#if 'digit' in part}
				<!-- Phase-1 still: the final digit, static. Phase 2 drives a digit wheel inside this column. -->
				<span class={styles.column}>
					<span class={styles.sizer}>0</span>
					<span class={styles.glyph}>{part.digit}</span>
				</span>
			{:else}
				<span class={styles.symbol}>{part.text}</span>
			{/if}
		{/each}
		{#if suffix}<span class={styles.symbol}>{suffix}</span>{/if}
	</span>
</span>
