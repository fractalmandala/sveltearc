import type { ComponentProps, Snippet } from 'svelte';
import { Dialog } from 'bits-ui';

/**
 * Root props — ARC `Dialog`. Controlled `open` plus a `defaultOpen`-seeded
 * uncontrolled mode (`useState(defaultOpen)` parity) and the `onOpenChange` callback.
 */
export interface DialogRootProps extends ComponentProps<typeof Dialog.Root> {
	open?: boolean;
	defaultOpen?: boolean;
	children?: Snippet;
}

/**
 * Content props — ARC `DialogContentProps`. The explicit ARC contract is
 * `title` + optional `description` + body `children`; everything else extends the
 * Bits UI content part (the same inherited surface ARC reached through
 * `ComponentPropsWithoutRef<DialogPrimitive.Content>`).
 *
 * Named `Props` exactly, per CONVENTIONS §6: check-port's `portProps()` matches
 * `interface Props`, and ARC's one explicit interface (`DialogContentProps`, whose
 * members include `title` and `description`) is the props-parity contract this file
 * must satisfy.
 */
export interface Props extends ComponentProps<typeof Dialog.Content> {
	/** Visible dialog heading (ARC renders it through the animated swap text). */
	title: string;
	/** Optional supporting copy under the title. */
	description?: string;
	/** Dialog body. */
	children?: Snippet;
}
