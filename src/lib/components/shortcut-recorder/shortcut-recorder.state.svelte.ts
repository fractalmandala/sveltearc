import { detectPlatform, keyId } from './shortcut-recorder.data';
import type { Platform } from './shortcut-recorder.types';

/** The viewer's platform. Server renders assume a Mac and settle on the first client render. */
export function usePlatform(override?: Platform): Platform {
	let detected = $state<Platform>('mac');

	$effect(() => {
		if (override === undefined) detected = detectPlatform();
	});

	return override ?? detected;
}

/** Keys held down right now, by physical id. Clears on window blur, and after Command lifts (macOS drops the other keyups). */
export function usePressedKeys(enabled = true): string[] {
	let held = $state<string[]>([]);

	$effect(() => {
		if (!enabled) {
			if (held.length) held = [];
			return;
		}

		const setNext = (change: (next: Set<string>) => void) => {
			const next = new Set(held);
			change(next);
			const value = [...next];
			if (value.length !== held.length || value.some((key, index) => key !== held[index])) {
				held = value;
			}
		};
		const down = (event: KeyboardEvent) => {
			const id = keyId(event);
			if (id) setNext((next) => next.add(id));
		};
		const up = (event: KeyboardEvent) => {
			const id = keyId(event);
			setNext((next) => {
				if (id) next.delete(id);
				if (id === 'meta') [...next].forEach((key) => {
					if (!['ctrl', 'alt', 'shift'].includes(key)) next.delete(key);
				});
				if (!event.metaKey) next.delete('meta');
				if (!event.ctrlKey) next.delete('ctrl');
				if (!event.altKey) next.delete('alt');
				if (!event.shiftKey) next.delete('shift');
			});
		};
		const clear = () => {
			if (held.length) held = [];
		};

		window.addEventListener('keydown', down);
		window.addEventListener('keyup', up);
		window.addEventListener('blur', clear);
		document.addEventListener('visibilitychange', clear);
		return () => {
			window.removeEventListener('keydown', down);
			window.removeEventListener('keyup', up);
			window.removeEventListener('blur', clear);
			document.removeEventListener('visibilitychange', clear);
		};
	});

	return held;
}
