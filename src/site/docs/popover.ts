import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Popover',
	tagline: 'A small anchored surface for contextual information.',
	description:
		'A floating panel anchored to a trigger, with spring settle, origin-aware scale, and collision-aware viewport flipping.',
	group: 'overlays',
	status: 'ported',
	whenToUse: [
		'Click-opened panels with interactive content, like share settings or a small filter form.',
		'Non-modal helpers that should stay open while people interact with the rest of the page.',
		'Custom pickers built from your own controls anchored to a button.'
	],
	whenNotToUse: [
		'Use Tooltip for short hover labels.',
		'Use Hover Card for read-only previews that open on hover.',
		'Use Dialog when the choice must block the page, and Dropdown Menu for a list of commands.'
	],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/popover',
		manual: {
			dependencies: ['bits-ui'],
			steps: [
				'Copy src/lib/components/popover/ to your project components directory.',
				'Ensure the $lib path alias is configured in svelte.config.js / tsconfig.json.',
				'All styles live in popover.module.css — no Tailwind configuration required.'
			]
		}
	},
	usage: `<script lang="ts">
  import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverClose
  } from '$lib/components/popover';

  let open = $state(false);
</script>

<Popover bind:open>
  <PopoverTrigger class="demo-trigger">Share settings</PopoverTrigger>
  <PopoverContent>
    <div style="font-weight: 600; margin-bottom: var(--space-1); font-size: var(--text-sm);">Share this project</div>
    <p class="demo-pop-text">Anyone with the link can view.</p>
    <PopoverClose class="demo-close">Done</PopoverClose>
  </PopoverContent>
</Popover>`,
	demoCode: `<script lang="ts">
  import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '$lib/components/popover';

  let open = $state(false);
</script>

<div class="demo-grid">
  <Popover bind:open>
    <PopoverTrigger class="demo-trigger">Open popover</PopoverTrigger>
    <PopoverContent>
      <p class="demo-pop-text">
        This panel is anchored to its trigger and uses ARC’s popover CSS verbatim.
      </p>
      <PopoverClose class="demo-close">Close</PopoverClose>
    </PopoverContent>
  </Popover>
  <p class="demo-note">open: <strong>{open}</strong></p>
</div>`,
	variants: [
		{
			name: 'Default Controlled',
			description: 'Two-way binding via bind:open with trigger and close buttons.',
			code: `<Popover bind:open>
  <PopoverTrigger class="demo-trigger">Open popover</PopoverTrigger>
  <PopoverContent>
    <p>Anchored floating panel.</p>
    <PopoverClose class="demo-close">Close</PopoverClose>
  </PopoverContent>
</Popover>`
		},
		{
			name: 'Centered Alignment with Custom Offset',
			description: 'Centers the floating panel relative to the trigger and increases the sideOffset distance.',
			code: `<Popover>
  <PopoverTrigger class="demo-trigger">Centered Popover</PopoverTrigger>
  <PopoverContent align="center" sideOffset={12}>
    <p>Positioned center with 12px offset.</p>
  </PopoverContent>
</Popover>`
		},
		{
			name: 'Custom Placement (Top Side)',
			description: 'Renders the panel above the trigger with collision-aware viewport flipping.',
			code: `<Popover>
  <PopoverTrigger class="demo-trigger">Top Aligned</PopoverTrigger>
  <PopoverContent side="top" align="start">
    <p>Appears above the trigger with collision handling.</p>
  </PopoverContent>
</Popover>`
		}
	],
	api: [
		{
			name: 'open (Popover)',
			type: 'boolean',
			default: 'false',
			description: 'Controlled open state. Use bind:open for two-way reactivity with Svelte 5 runes.'
		},
		{
			name: 'defaultOpen (Popover)',
			type: 'boolean',
			default: 'false',
			description: 'Initial open state when uncontrolled.'
		},
		{
			name: 'onOpenChange (Popover)',
			type: '(open: boolean) => void',
			description: 'Callback fired whenever the popover opens or closes.'
		},
		{
			name: 'onOpenChangeComplete (Popover)',
			type: '(open: boolean) => void',
			description: 'Callback fired when the open or close animation completes.'
		},
		{
			name: 'align (PopoverContent)',
			type: "'start' | 'center' | 'end'",
			default: "'start'",
			description: 'Alignment of the floating content along the trigger edge.'
		},
		{
			name: 'side (PopoverContent)',
			type: "'top' | 'right' | 'bottom' | 'left'",
			default: "'bottom'",
			description: 'Preferred placement side relative to the trigger.'
		},
		{
			name: 'sideOffset (PopoverContent)',
			type: 'number',
			default: '6',
			description: 'Distance in pixels between the trigger and the floating panel.'
		},
		{
			name: 'collisionPadding (PopoverContent)',
			type: 'number',
			default: '10',
			description: 'Minimum distance in pixels from the viewport edges to prevent clipping.'
		},
		{
			name: 'ref (PopoverTrigger / Content / Close)',
			type: 'HTMLElement | null',
			description: 'Bindable ref to the underlying DOM element.'
		}
	],
	keyboard: [
		{ key: 'Enter / Space', action: 'Opens the popover when focused on the trigger.' },
		{ key: 'Escape', action: 'Closes the popover and restores focus to the trigger.' },
		{ key: 'Tab', action: 'Cycles focus through interactive elements inside the open popover.' }
	],
	accessibility: [
		'Bits UI automatically sets aria-expanded, aria-controls, and aria-haspopup="dialog" on PopoverTrigger.',
		'Focus automatically moves into the popover content upon opening and returns smoothly to the trigger on close.',
		'Dismissible via Escape key press or clicking outside the floating surface.',
		'Popover is non-modal by default, allowing seamless interaction with the rest of the page; set modal={true} to trap focus when needed.',
		'High-contrast focus ring outlines interactive elements in compliance with WCAG 2.1 AA standards.'
	],
	motion:
		'CSS transitions: the panel fades and settles from 5px toward its trigger at 0.97 scale on a spring; it leaves in 140ms. Transitions are used instead of keyframes, so a reopen mid-close reverses smoothly from where the panel currently is. Reduced motion drops the translate transform and keeps an instantaneous opacity fade.',
	notes:
		'Headless positioning, portal rendering, and focus management are powered by Bits UI Popover. ARC .module.css supplies all floating styles, shadow tokens, and starting-style animations verbatim.',
	notesForAi: [
		'Use for click-opened panels containing interactive elements (forms, share menus, multi-step actions). Use Tooltip for hover-only readouts.',
		'Compose using Popover, PopoverTrigger, PopoverContent, and optional PopoverClose.',
		'Always prefer bind:open for reactive state synchronization in Svelte 5.',
		'PopoverContent automatically renders inside a portal at the document body to prevent overflow clipping.'
	],
	related: [
		{
			name: 'Tooltip',
			slug: 'tooltip',
			description: 'Short supporting text for unfamiliar controls.'
		},
		{
			name: 'Dialog',
			slug: 'dialog',
			description: 'A focused modal surface for decisions that require user attention.'
		},
		{
			name: 'Dropdown Menu',
			slug: 'dropdown-menu',
			description: 'A focused list of actions anchored to a trigger.'
		}
	],
	source: 'registry/components/popover/popover.tsx'
};

export default doc;
