/**
 * Canonical UI groups — uiarc.dev taxonomy.
 *
 * Source of truth: DOCUMENTATION.md §"UI Groups in uiarc" (22 groups, canonical order).
 * Task 7 §2.1 / §3: `DocMeta.group` is a group **id** (e.g. "overlays"), never a display
 * title. Titles come from `UI_GROUPS`. Empty groups never render.
 */

export interface UiGroup {
	id: string;
	title: string;
	order: number;
}

/** All 22 uiarc groups, in canonical order. */
export const UI_GROUPS: UiGroup[] = [
	{ id: 'buttons', title: 'Buttons', order: 1 },
	{ id: 'gestures', title: 'Gestures', order: 2 },
	{ id: 'menus', title: 'Menus', order: 3 },
	{ id: 'text-fields', title: 'Text fields', order: 4 },
	{ id: 'special-inputs', title: 'Special inputs', order: 5 },
	{ id: 'selects', title: 'Selects', order: 6 },
	{ id: 'toggles', title: 'Toggles', order: 7 },
	{ id: 'sliders', title: 'Sliders', order: 8 },
	{ id: 'pickers', title: 'Pickers', order: 9 },
	{ id: 'editors', title: 'Editors', order: 10 },
	{ id: 'navigation', title: 'Navigation', order: 11 },
	{ id: 'expand', title: 'Expand', order: 12 },
	{ id: 'overlays', title: 'Overlays', order: 13 },
	{ id: 'messages', title: 'Messages', order: 14 },
	{ id: 'progress', title: 'Progress', order: 15 },
	{ id: 'avatars', title: 'Avatars', order: 16 },
	{ id: 'cards', title: 'Cards', order: 17 },
	{ id: 'charts', title: 'Charts', order: 18 },
	{ id: 'tables', title: 'Tables', order: 19 },
	{ id: 'activity', title: 'Activity', order: 20 },
	{ id: 'media', title: 'Media', order: 21 },
	{ id: 'text-effects', title: 'Text effects', order: 22 }
];

export const GROUP_BY_ID: Record<string, UiGroup> = Object.fromEntries(
	UI_GROUPS.map((g) => [g.id, g])
);

/**
 * Frozen component → group-id map. The migration script and future scaffolds read this.
 * Per Task 7 §3; covers every slug in `$site/docs` today (35).
 */
export const COMPONENT_GROUP: Record<string, string> = {
	// buttons
	button: 'buttons',
	'split-button': 'buttons',
	'copy-button': 'buttons',
	'theme-switch': 'buttons',
	// gestures
	'swipe-actions': 'gestures',
	// menus
	'dropdown-menu': 'menus',
	// text fields
	input: 'text-fields',
	textarea: 'text-fields',
	'password-field': 'text-fields',
	'search-field': 'text-fields',
	// selects
	select: 'selects',
	// toggles
	checkbox: 'toggles',
	'radio-group': 'toggles',
	switch: 'toggles',
	'segmented-control': 'toggles',
	// sliders
	slider: 'sliders',
	// navigation
	tabs: 'navigation',
	breadcrumb: 'navigation',
	// expand
	'scroll-area': 'expand',
	accordion: 'expand',
	// overlays
	dialog: 'overlays',
	drawer: 'overlays',
	'bottom-sheet': 'overlays',
	popover: 'overlays',
	'hover-card': 'overlays',
	tooltip: 'overlays',
	// messages
	alert: 'messages',
	'notification-center': 'messages',
	// progress
	progress: 'progress',
	skeleton: 'progress',
	// avatars
	avatar: 'avatars',
	badge: 'avatars',
	// cards
	card: 'cards',
	'empty-state': 'cards',
	// text effects
	'text-reveal': 'text-effects'
};
