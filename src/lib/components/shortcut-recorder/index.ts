export { default as Kbd } from './kbd.svelte';
export { default as ShortcutKeys } from './shortcut-keys.svelte';
export { default as ShortcutRecorder } from './shortcut-recorder.svelte';
export { default as ShortcutList } from './shortcut-list.svelte';
export {
	keyId,
	matchesShortcut,
	normalizeShortcut,
	shortcutFromEvent,
	shortcutTokens,
	formatShortcut,
	RESERVED,
	detectPlatform,
	searchAliases
} from './shortcut-recorder.data';
export { usePlatform, usePressedKeys } from './shortcut-recorder.state.svelte';
export * from './shortcut-recorder.types';
