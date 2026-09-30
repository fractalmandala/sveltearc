import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: 'Drawer',
	tagline: 'A temporary side surface for focused work.',
	description:
		'Overlay and panel with a titled header that doubles as the drag handle, a close button, and a scrolling body. Built on Bits UI Dialog.',
	group: 'overlays',
	status: 'ported',
	whenToUse: [
		'Side panels for filters, settings, or record details that keep the page in context.',
		'Forms that are too long for a dialog but should not leave the current view.',
		'Panels from any edge, via side, with drag-to-dismiss on the header.'
	],
	whenNotToUse: [
		'Use dialog for short decisions and confirmations.',
		'Use bottom-sheet for mobile-first sheets with snap points.',
		'Use popover for small anchored content that does not need a modal overlay.'
	],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/drawer',
		manual: {
			dependencies: ['bits-ui', '@lucide/svelte'],
			steps: [
				'Copy drawer files into src/lib/components/drawer/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import Drawer, DrawerTrigger, DrawerContent, DrawerClose from $lib/components/drawer'
			]
		}
	},
	usage: `<script lang="ts">
  import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from '$lib/components/drawer';

  let open = $state(false);
<\/script>

<Drawer bind:open>
  <DrawerTrigger class="btn-primary">Open Filters</DrawerTrigger>

  <DrawerContent title="Project Filters" description="Narrow the list of active repositories.">
    <div class="filters-body">
      <p>Filter options and configuration settings go here.</p>
    </div>
    <div class="filters-footer">
      <DrawerClose class="btn-secondary">Apply Filters</DrawerClose>
    </div>
  </DrawerContent>
</Drawer>`,
	demoCode: `<script lang="ts">
  import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from '$lib/components/drawer';

  let openRight = $state(false);
  let openLeft = $state(false);
<\/script>

<div class="demo-drawer-row">
  <Drawer bind:open={openRight}>
    <DrawerTrigger class="demo-btn">Open Right Drawer</DrawerTrigger>

    <DrawerContent
      title="Environment Settings"
      description="Configure edge deployment regions and API tokens."
      side="right"
    >
      <div class="demo-drawer-content">
        <label>
          <span>Cluster Region</span>
          <input type="text" value="eu-west-1 (Ireland)" readonly />
        </label>
        <label>
          <span>Telemetry Sampling</span>
          <input type="text" value="100% of incoming traces" readonly />
        </label>
        <div class="demo-drawer-actions">
          <DrawerClose class="demo-btn-action">Save Changes</DrawerClose>
        </div>
      </div>
    </DrawerContent>
  </Drawer>

  <Drawer bind:open={openLeft}>
    <DrawerTrigger class="demo-btn">Open Left Drawer</DrawerTrigger>

    <DrawerContent
      title="Navigation Menu"
      description="Jump across internal services and monitoring."
      side="left"
    >
      <div class="demo-drawer-content">
        <nav class="demo-nav-list">
          <a href="#overview">System Overview</a>
          <a href="#metrics">Live Metrics</a>
          <a href="#deployments">Deployments</a>
          <a href="#logs">Audit Logs</a>
        </nav>
      </div>
    </DrawerContent>
  </Drawer>
</div>`,
	variants: [
		{
			name: 'Right Slide-over',
			description: 'Default edge placement for inspector panels, record detail views, and edit forms.',
			code: `<DrawerContent title="Settings" side="right">
  <!-- Content -->
</DrawerContent>`
		},
		{
			name: 'Left Navigation Drawer',
			description: 'Ideal for navigation drawers and hierarchy trees on smaller viewports.',
			code: `<DrawerContent title="Navigation" side="left">
  <!-- Content -->
</DrawerContent>`
		},
		{
			name: 'Bottom Panel',
			description: 'Full-width bottom panel anchored to the bottom edge with centered grab bar.',
			code: `<DrawerContent title="Console Output" side="bottom">
  <!-- Content -->
</DrawerContent>`
		}
	],
	api: [
		{
			name: 'open',
			type: 'boolean',
			default: 'undefined',
			description: 'Controlled open state; supports two-way bind:open.'
		},
		{
			name: 'defaultOpen',
			type: 'boolean',
			default: 'false',
			description: 'Initial state when uncontrolled.'
		},
		{
			name: 'onOpenChange',
			type: '(open: boolean) => void',
			default: '–',
			description: 'Callback fired when the drawer opens or closes.'
		},
		{
			name: 'title',
			type: 'string',
			default: '–',
			description: 'Dialog title rendered in the drawer header, linked to Dialog.Title.'
		},
		{
			name: 'description',
			type: 'string',
			default: '–',
			description: 'Supporting text rendered under the title, linked to Dialog.Description.'
		},
		{
			name: 'side',
			type: "'left' | 'right' | 'top' | 'bottom'",
			default: "'right'",
			description: 'Edge the panel attaches to and slides from.'
		},
		{
			name: 'container',
			type: 'HTMLElement | null',
			default: 'null',
			description: 'Renders the drawer inside this container element instead of the document body.'
		},
		{
			name: 'class',
			type: 'string',
			default: '–',
			description: 'Additional CSS class applied to the drawer panel.'
		}
	],
	keyboard: [
		{
			key: 'Escape',
			action: 'Closes the drawer and returns focus to the trigger button.'
		},
		{
			key: 'Tab / Shift+Tab',
			action: 'Traps and cycles focus within the drawer content while open.'
		}
	],
	accessibility: [
		'Built on Bits UI Dialog: provides role="dialog", aria-modal="true", and focus management.',
		'Title and description are wired to Dialog.Title and Dialog.Description for screen readers.',
		'Header close button is explicitly labelled "Close drawer".',
		'Focus is trapped while open and restored to trigger on dismissal.'
	],
	motion:
		'Phase 1 still-state: Panel animates from its designated edge using CSS keyframes (drawer-in / drawer-out) and backdrop blur overlay. Phase 2 wires gesture drag-to-dismiss on header, rubber-banding past resting boundary, and velocity fling physics.',
	notes:
		'Headless dialog accessibility and state mechanics are powered by Bits UI Dialog. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Use for side panels with forms, filters, settings, or detail views that keep the page in context.',
		'Compose Drawer as the root with DrawerTrigger, DrawerContent, and DrawerClose.',
		'Control open with bind:open when the drawer needs to close after an async form submission.'
	],
	related: [
		{
			name: 'Dialog',
			slug: 'dialog',
			description: 'A focused modal surface for decisions that require immediate attention.'
		},
		{
			name: 'Bottom Sheet',
			slug: 'bottom-sheet',
			description: 'A sheet that rests at a peek or full height and follows finger gestures.'
		},
		{
			name: 'Popover',
			slug: 'popover',
			description: 'A small anchored surface for contextual information.'
		}
	],
	source: 'registry/components/drawer/drawer.tsx'
};

export default doc;
