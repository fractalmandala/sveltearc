export type CopyFeedbackState = 'idle' | 'copied' | 'error';

/** Shared clipboard state for actions that render their own button or menu. */
/* Ported from arc-library/lib/use-copy-feedback.ts (React hook -> Svelte 5 runes factory). */
export function createCopyFeedback(duration = 1900) {
	let state = $state<CopyFeedbackState>('idle');
	let activeKey = $state<string | null>(null);
	let timeout: ReturnType<typeof setTimeout> | null = null;

	function clear() {
		if (timeout) clearTimeout(timeout);
		timeout = null;
	}

	function reset() {
		clear();
		state = 'idle';
		activeKey = null;
	}

	async function copy(value: string, key = 'default'): Promise<boolean> {
		clear();
		activeKey = key;
		try {
			await navigator.clipboard.writeText(value);
			state = 'copied';
			timeout = setTimeout(reset, duration);
			return true;
		} catch {
			state = 'error';
			timeout = setTimeout(reset, duration);
			return false;
		}
	}

	return {
		get state(): CopyFeedbackState {
			return state;
		},
		get activeKey(): string | null {
			return activeKey;
		},
		copy,
		reset
	};
}
