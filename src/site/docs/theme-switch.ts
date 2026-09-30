import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Theme switcher",
	tagline: "Four smooth ways to move between light and dark appearance.",
	description: "Four smooth ways to move between light and dark appearance.",
	group: 'buttons',
	status: 'ported',
	whenToUse: ["A single light and dark toggle in an app or marketing top bar.","Pages that want to run their own view transition from the button's position."],
	whenNotToUse: ["Use user-menu when theme choice, including system, belongs inside an account menu.","Use theme-switch-rise for quiet product chrome, or theme-switch-eclipse for a dramatic showcase change."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/theme-switch',
		manual: {
			dependencies: ["bits-ui","@lucide/svelte"],
			steps: [
				'Copy theme-switch files into src/lib/components/theme-switch/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import ThemeSwitch from $lib/components/theme-switch'
			]
		}
	},
	usage: `<script lang="ts">
  import { ThemeSwitch } from '$lib/components/theme-switch';

  let theme = $state<'light' | 'dark'>('light');
<\/script>

<ThemeSwitch bind:theme variant="reveal" />`,
	demoCode: `<script lang="ts">
  import { ThemeSwitch } from '$lib/components/theme-switch';

  let theme = $state<'light' | 'dark'>('light');
<\/script>

<div class="demo-theme-switch-container">
  <ThemeSwitch bind:theme variant="reveal" />
</div>`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: `<ThemeSwitch theme="light" variant="reveal" />`
		}
	],
	api: [
  {
    "name": "onThemeChange",
    "type": "(next: Theme, variant: ThemeSwitchVariant, trigger: HTMLElement) => void",
    "default": "–",
    "description": "(Required) Called on press with the opposite theme, the variant, and the button, so the page transition can start from it."
  },
  {
    "name": "label",
    "type": "string",
    "default": "–",
    "description": "Accessible name. Defaults to \\\"Switch to dark mode\\\" or \\\"Switch to light mode\\\"."
  },
  {
    "name": "iconOnly",
    "type": "boolean",
    "default": "'false'",
    "description": "Hides the \\\"Switch theme\\\" text and renders a 38px square button."
  }
],
	keyboard: [
  {
    "key": "Enter / Space",
    "action": "Toggles the theme."
  }
],
	accessibility: ["Renders the library Button with aria-pressed set when the theme is dark.","aria-label defaults to \"Switch to dark mode\" or \"Switch to light mode\"; pass label to override.","The icons are aria-hidden."],
	motion: "- Sun and moon trade places with a shared rotation, scale, and blur on a snappy spring; the icon also nudges in the direction of the chosen variant. - A theme that arrives during hydration swaps without motion, so a dark page never spins its switch on load. - Reduced motion swaps the icon with an instant fade and removes the nudge; skip the page transition too when reduced.",
	notes: "Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["Use for a single light/dark toggle in a top bar. For light, dark, and system inside an account menu use user-menu.","The component only reports the change. Apply the theme in onThemeChange, typically inside document.startViewTransition, and use trigger's rect as the transition origin.","variant is passed back to onThemeChange so one handler can run the matching page transition (reveal, eclipse, split, rise)."],
	related: [{"name":"Eclipse","slug":"theme-switch-eclipse","description":"The next appearance crosses the page like an eclipse."},{"name":"Split","slug":"theme-switch-split","description":"The next appearance opens from a slim center seam."},{"name":"Rise","slug":"theme-switch-rise","description":"The next appearance rises into place."},{"name":"User menu","slug":"user-menu","description":"Your account, settings, theme, and sign out behind the avatar. Opens as a bottom sheet on phones."},{"name":"Button","slug":"button","description":"A clear, responsive action with quiet secondary states."}],
	source: 'registry/components/theme-switch/theme-switch.tsx'
};

export default doc;
