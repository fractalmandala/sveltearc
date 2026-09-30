import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: 'Bottom sheet',
	tagline: 'A sheet that rests at a peek or full height and follows your finger.',
	description:
		'A modal sheet that rises from the bottom edge and rests at one or more detents, with drag, flick, and keyboard control. Built on Bits UI Dialog.',
	group: 'overlays',
	status: 'ported',
	whenToUse: [
		'Mobile-first secondary tasks such as details, filters, or share options.',
		'Content that benefits from a peek height before expanding to nearly full screen.',
		'Maps, media, and detail views where users triage content between detents.'
	],
	whenNotToUse: [
		'Use dialog for interrupting decisions on any screen size.',
		'Use drawer for side panels on wide desktop layouts.',
		'Use popover for small anchored content that should not dim the page.'
	],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/bottom-sheet',
		manual: {
			dependencies: ['bits-ui', '@lucide/svelte'],
			steps: [
				'Copy bottom-sheet files into src/lib/components/bottom-sheet/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import BottomSheet and BottomSheetClose from $lib/components/bottom-sheet'
			]
		}
	},
	usage: `<script lang="ts">
  import { BottomSheet, BottomSheetClose } from '$lib/components/bottom-sheet';

  let open = $state(false);
<\/script>

<BottomSheet
  bind:open
  title="Trip Details — Lisbon"
  description="Oct 12 to Oct 15 · 3 nights"
  detents={[0.45, 0.9]}
>
  {#snippet trigger({ props })}
    <button {...props} type="button" class="btn-primary">View Trip</button>
  {/snippet}

  <div class="sheet-content">
    <p>Flight details, hotel reservations, and recommended activities.</p>
    <BottomSheetClose class="btn-secondary">Done</BottomSheetClose>
  </div>
</BottomSheet>`,
	demoCode: `<script lang="ts">
  import { BottomSheet, BottomSheetClose } from '$lib/components/bottom-sheet';

  let open = $state(false);
  let activeDetent = $state(0);
<\/script>

<div class="demo-sheet-container">
  <BottomSheet
    bind:open
    title="Flight Confirmation — UA 842"
    description="San Francisco (SFO) → Tokyo Haneda (HND)"
    detents={[0.4, 0.88]}
    initialDetent={0}
    onDetentChange={(d) => (activeDetent = d)}
  >
    {#snippet trigger({ props })}
      <button {...props} type="button" class="demo-sheet-trigger">
        View Boarding Pass & Details
      </button>
    {/snippet}

    <div class="demo-sheet-body">
      <div class="flight-card">
        <div class="flight-endpoint">
          <span class="code">SFO</span>
          <span class="city">San Francisco</span>
          <span class="time">11:15 AM</span>
        </div>
        <div class="flight-arrow">✈</div>
        <div class="flight-endpoint">
          <span class="code">HND</span>
          <span class="city">Tokyo</span>
          <span class="time">3:25 PM +1</span>
        </div>
      </div>

      <div class="flight-meta-grid">
        <div class="meta-item">
          <span class="label">Seat</span>
          <span class="value">14A (Window)</span>
        </div>
        <div class="meta-item">
          <span class="label">Terminal</span>
          <span class="value">Terminal 3, G92</span>
        </div>
        <div class="meta-item">
          <span class="label">Status</span>
          <span class="value badge-ok">On Time</span>
        </div>
      </div>

      <div class="sheet-actions">
        <BottomSheetClose class="demo-btn-close">Close Boarding Pass</BottomSheetClose>
      </div>
    </div>
  </BottomSheet>
</div>`,
	variants: [
		{
			name: 'Dual Detent (Peek & Expand)',
			description: 'Starts at 45% peek height and expands to 92% on tap or drag.',
			code: `<BottomSheet
  title="Details"
  detents={[0.45, 0.92]}
  initialDetent={0}
>
  <!-- Content -->
</BottomSheet>`
		},
		{
			name: 'Single Detent (Fixed Height)',
			description: 'Pass a single detent fraction for a fixed-height sheet that does not expand.',
			code: `<BottomSheet
  title="Quick Share"
  detents={[0.5]}
>
  <!-- Content -->
</BottomSheet>`
		}
	],
	api: [
		{
			name: 'title',
			type: 'string',
			default: '–',
			description: 'Sheet title rendered as Dialog.Title in the header.'
		},
		{
			name: 'children',
			type: 'Snippet',
			default: '–',
			description: 'Scrollable sheet body content.'
		},
		{
			name: 'trigger',
			type: 'Snippet<[{ props }]>',
			default: '–',
			description:
				'Control that opens the sheet; spread its props onto your button. Focus returns to it on close.'
		},
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
			description: 'Initial open state when uncontrolled.'
		},
		{
			name: 'onOpenChange',
			type: '(open: boolean) => void',
			default: '–',
			description: 'Called when the sheet opens or closes.'
		},
		{
			name: 'description',
			type: 'string',
			default: '–',
			description: 'Supporting line rendered as Dialog.Description below title.'
		},
		{
			name: 'detents',
			type: 'number[]',
			default: '[0.45, 0.92]',
			description: 'Resting heights as fractions of the viewport height.'
		},
		{
			name: 'initialDetent',
			type: 'number',
			default: '0',
			description: 'Index into sorted detents array the sheet opens at.'
		},
		{
			name: 'onDetentChange',
			type: '(index: number) => void',
			default: '–',
			description: 'Called when the sheet settles on a different detent.'
		},
		{
			name: 'closeLabel',
			type: 'string',
			default: "'Close'",
			description: 'Accessible label for the header close button.'
		},
		{
			name: 'class',
			type: 'string',
			default: '–',
			description: 'Additional CSS class applied to the sheet surface.'
		}
	],
	keyboard: [
		{
			key: 'ArrowUp / ArrowDown',
			action: 'On the grabber, moves one detent up or down.'
		},
		{
			key: 'Home / End',
			action: 'On the grabber, jumps to tallest or smallest detent.'
		},
		{
			key: 'Enter / Space',
			action: 'On the grabber, toggles between smallest and tallest detent.'
		},
		{
			key: 'Escape',
			action: 'Closes the bottom sheet and returns focus to trigger.'
		}
	],
	accessibility: [
		'Built on Bits UI Dialog: provides role="dialog", focus trap, and focus return to trigger.',
		'Grabber is a semantic button with aria-expanded and localized Expand/Collapse label.',
		'Detent changes are announced through a polite live status region.',
		'Tabbing into content below the fold automatically expands sheet to reveal focused elements.'
	],
	motion:
		'Phase 1 still-state: Sheet opens at detent height fraction, grabber button toggles peek/expanded with keyboard control. Phase 2 wires touch gesture velocity tracking, rubber band resistance past top detent, and dim opacity linked to sheet position.',
	notes:
		'Built on Bits UI Dialog headless primitive. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Use for mobile-first secondary tasks where a peek helps: details, filters, share options.',
		'Pass a trigger snippet and spread its props onto your button, or control open yourself with bind:open.',
		'Use a single-value detents array for a fixed-height sheet.'
	],
	related: [
		{
			name: 'Drawer',
			slug: 'drawer',
			description: 'A temporary side surface for focused work.'
		},
		{
			name: 'Dialog',
			slug: 'dialog',
			description: 'A focused modal surface for decisions that require immediate attention.'
		},
		{
			name: 'Popover',
			slug: 'popover',
			description: 'A small anchored surface for contextual information.'
		}
	],
	source: 'registry/components/bottom-sheet/bottom-sheet.tsx'
};

export default doc;
