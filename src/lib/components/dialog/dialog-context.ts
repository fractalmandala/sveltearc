/**
 * Root → Content channel. ARC mirrors the resolved open state through `OpenContext`
 * so the content can stay mounted while it animates out and retarget mid-flight.
 * When this key is absent, the content sits under a bare bits-ui root and the
 * keyframes path runs instead (ARC's `open === null` branch).
 */
export interface DialogRootContext {
	open: () => boolean;
}

export const DIALOG_ROOT = Symbol('arc-dialog-root');
