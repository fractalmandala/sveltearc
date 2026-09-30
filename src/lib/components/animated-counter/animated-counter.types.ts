/**
 * Port of ARC `AnimatedCounter` — `registry/components/animated-counter/animated-counter.tsx`.
 *
 * A number that animates digit changes (odometer-style digit wheels). Phase 1 renders
 * the FINAL formatted value statically; the digit/column DOM (`.column`, `.sizer`,
 * `.glyph`) and the tabular-nums classes are kept so Phase 2 can wire the roll
 * without restructuring.
 */
export interface Props {
	/** The numeric value to display, formatted per `decimals`/`locale`. */
	value: number;
	/** Small caption above the value; swaps with a rise/blur in Phase 2. */
	label?: string;
	/** Static symbol rendered before the digits, e.g. "$". */
	prefix?: string;
	/** Static symbol rendered after the digits, e.g. "%". */
	suffix?: string;
	/** Fraction digits for `Intl.NumberFormat`. */
	decimals?: number;
	/**
	 * Roll every digit up from zero the first time the counter scrolls into view.
	 * Accepted in Phase 1; the in-view roll is wired in Phase 2.
	 */
	animateOnView?: boolean;
	/** Formatting locale. Fixed by default so server and client render the same digits. */
	locale?: string;
}
