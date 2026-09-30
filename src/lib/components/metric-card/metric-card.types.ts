/**
 * Port of ARC `MetricCard` — `registry/components/metric-card/metric-card.tsx`.
 *
 * A compact summary for a number that needs context: label row, animated number,
 * context line. Phase 1 renders all copy as static text; the `.swap`/`.swapBlock`/
 * `.text`/`.sizer` hooks are kept so Phase 2 can wire the directional text swaps
 * and the width-morph spring without restructuring.
 */
export interface Props {
	/** Heading for the metric, e.g. "Monthly revenue". */
	label: string;
	/** The numeric value, rendered through the ported AnimatedCounter. */
	value: number;
	/** Static symbol after the digits, e.g. "%". */
	suffix?: string;
	/** Supporting line under the number, e.g. "vs last quarter". */
	context: string;
	/**
	 * Signed delta chip, e.g. "+12.4%". A leading "+" reads `data-trend="up"`,
	 * a leading "-" (or U+2212) reads `data-trend="down"`.
	 */
	change?: string;
}
