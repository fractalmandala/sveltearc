export type { PhoneCountry, PhoneInputDetails, PhoneStatus } from './phone-input.data';

/**
 * Port of ARC `PhoneInput` — `registry/components/phone-input/phone-input.tsx`.
 *
 * These are the exact ARC props. `className` maps to Svelte's `class`.
 * Two-way state (`value`, `country`) is `$bindable()` in the component.
 */
export interface Props {
	/** Visible label, tied to the number field. */
	label: string;
	/** Visually hide the label (it stays available to assistive technology). */
	hideLabel?: boolean;
	/**
	 * The number in E.164, such as "+14155550132". An empty string clears
	 * the field. `bind:value` for two-way use; omit for uncontrolled.
	 */
	value?: string;
	/** Initial E.164 value for uncontrolled use. */
	defaultValue?: string;
	/** Fires on every edit with the E.164 number and its parsed details. */
	onValueChange?: (value: string, details: import('./phone-input.data').PhoneInputDetails) => void;
	/** ISO code of the selected country. `bind:country` for two-way use. */
	country?: string;
	/** ISO code used until someone picks a country or enters an international number. */
	defaultCountry?: string;
	/** Fires when the country changes. */
	onCountryChange?: (iso: string) => void;
	/** Limit the picker to these ISO codes. */
	countries?: string[];
	/** Pinned at the top of the picker under "Suggested". */
	preferredCountries?: string[];
	/** Helper copy under the field, linked through `aria-describedby`. */
	description?: string;
	/** Replaces the built-in validation message. Sets `aria-invalid`. */
	error?: string;
	/** Show a message after blur when the number is incomplete. On by default. */
	validate?: boolean;
	disabled?: boolean;
	required?: boolean;
	/** Adds a hidden input carrying the E.164 value for native form submission. */
	name?: string;
	id?: string;
	class?: string;
	/** Bindable ref to the number input element. */
	ref?: HTMLInputElement | null;
	/** Number-field blur handler. */
	onBlur?: (event: FocusEvent) => void;
}

export type PhoneInputProps = Props;
