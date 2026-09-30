export type ThemeSwitchVariant = 'reveal' | 'eclipse' | 'split' | 'rise';
export type Theme = 'light' | 'dark';

/**
 * Props for ThemeSwitch — ported from ARC `registry/components/theme-switch/theme-switch.tsx`.
 * Named `Props` per CONVENTIONS.md harness standard.
 */
export interface Props {
	theme?: Theme;
	variant?: ThemeSwitchVariant;
	onThemeChange?: (next: Theme, variant: ThemeSwitchVariant, trigger: HTMLElement) => void;
	label?: string;
	iconOnly?: boolean;
	class?: string;
	className?: string;
}

export type ThemeSwitchProps = Props;
