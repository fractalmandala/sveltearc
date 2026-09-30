import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Dialog',
	tagline: 'A focused surface for decisions that need attention.',
	description: 'A modal overlay and panel with a titled header, built-in close button, accessible focus trap, and interruptible spring transitions.',
	group: 'overlays',
	status: 'ported',
	whenToUse: [
		'Confirmations and decisions that must interrupt, such as Delete project.',
		'Short forms like rename or invite that fit in one focused panel.',
		'Flows where the dialog title changes between steps and should crossfade in place.'
	],
	whenNotToUse: [
		'Use Drawer for long forms or detail panels that keep the page in context.',
		'Use Bottom Sheet for mobile-first secondary tasks with snap heights.',
		'Use Popover for light, non-modal content anchored to a trigger.'
	],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/dialog',
		manual: {
			dependencies: ['bits-ui', '@lucide/svelte', '@humanspeak/svelte-motion'],
			steps: [
				'Copy src/lib/components/dialog/ to your project components directory.',
				'Ensure the $lib path alias is configured in svelte.config.js / tsconfig.json.',
				'All styles live in dialog.module.css — no Tailwind configuration required.'
			]
		}
	},
	usage: `<script lang="ts">
  import { Dialog, DialogTrigger, DialogContent, DialogClose } from '$lib/components/dialog';
</script>

<Dialog>
  <DialogTrigger class="btn-primary">Rename project</DialogTrigger>
  <DialogContent title="Rename project" description="This updates the project URL across your team.">
    <div class="form-body">
      <label for="name">Project Name</label>
      <input id="name" type="text" value="Arc UI Svelte" />
    </div>
    <div class="dialog-actions">
      <DialogClose class="btn-secondary">Cancel</DialogClose>
      <DialogClose class="btn-primary">Save Changes</DialogClose>
    </div>
  </DialogContent>
</Dialog>`,
	demoCode: `<script lang="ts">
  import { Dialog, DialogTrigger, DialogContent, DialogClose } from '$lib/components/dialog';

  let projectName = $state('My Project');
  let open = $state(false);
</script>

<div class="demo-box">
  <Dialog bind:open>
    <DialogTrigger class="demo-trigger-btn">Edit Project Settings</DialogTrigger>
    <DialogContent
      title="Project Settings"
      description="Update your project name and public visibility."
    >
      <div class="demo-dialog-content">
        <label class="demo-label" for="proj-name">Project Name</label>
        <input id="proj-name" class="demo-input" bind:value={projectName} />
      </div>
      <div class="demo-dialog-footer">
        <DialogClose class="demo-btn-secondary">Cancel</DialogClose>
        <DialogClose class="demo-btn-primary">Save Changes</DialogClose>
      </div>
    </DialogContent>
  </Dialog>

  <p class="demo-status">Current project name: <strong>{projectName}</strong></p>
</div>

<style>
  .demo-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 2.5rem;
  }
  .demo-trigger-btn {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.375rem;
    background: var(--color-bg-subtle, #f4f4f5);
    border: 1px solid var(--color-border-default, #e4e4e7);
    cursor: pointer;
  }
  .demo-dialog-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem 0;
  }
  .demo-label {
    font-size: 0.8125rem;
    font-weight: 500;
  }
  .demo-input {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    border-radius: 0.375rem;
    border: 1px solid var(--color-border-default, #e4e4e7);
    background: transparent;
  }
  .demo-dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
  }
  .demo-btn-secondary {
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
    border-radius: 0.375rem;
    background: transparent;
    border: 1px solid var(--color-border-default, #e4e4e7);
    cursor: pointer;
  }
  .demo-btn-primary {
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
    font-weight: 500;
    border-radius: 0.375rem;
    background: #18181b;
    color: #fff;
    border: none;
    cursor: pointer;
  }
  .demo-status {
    font-size: 0.8125rem;
    color: var(--color-fg-muted, #71717a);
  }
  .demo-status strong {
    color: var(--color-fg-default, #18181b);
  }
</style>`,
	variants: [
		{
			name: 'Standard Modal Dialog',
			description: 'Uncontrolled dialog triggered by a nested button with title and description.',
			code: `<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent title="Quick Action" description="Perform an immediate action.">
    <p>Dialog body content.</p>
  </DialogContent>
</Dialog>`
		},
		{
			name: 'Controlled Two-Way Binding',
			description: 'Controlled visibility using Svelte 5 bind:open rune.',
			code: `<script lang="ts">
  let isModalOpen = $state(false);
</script>

<Dialog bind:open={isModalOpen}>
  <DialogTrigger>Configure</DialogTrigger>
  <DialogContent title="Configuration">
    <p>Settings panel</p>
  </DialogContent>
</Dialog>`
		},
		{
			name: 'Destructive Confirmation',
			description: 'Dialog focused on irreversible actions with clear cancel and confirm paths.',
			code: `<Dialog>
  <DialogTrigger class="btn-danger">Delete</DialogTrigger>
  <DialogContent title="Delete Project?" description="This action cannot be undone.">
    <div class="actions">
      <DialogClose>Cancel</DialogClose>
      <DialogClose class="btn-danger">Confirm Delete</DialogClose>
    </div>
  </DialogContent>
</Dialog>`
		}
	],
	api: [
		{ name: 'title', type: 'string', description: 'Dialog title, rendered as Dialog.Title. In Phase 2, title changes crossfade in place.' },
		{ name: 'description', type: 'string', description: 'Optional supporting line, rendered as Dialog.Description.' },
		{ name: 'open', type: 'boolean', description: 'Controlled open state. Supports two-way bind:open.' },
		{ name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial open state when uncontrolled.' },
		{ name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the dialog opens or closes.' },
		{ name: 'onInteractOutside', type: '(event: PointerEvent) => void', description: 'Callback when clicking outside the dialog content.' },
		{ name: 'children', type: 'Snippet', description: 'Modal body content rendered below header and above close button.' },
		{ name: 'ref', type: 'HTMLElement | null', description: 'Bindable ref to the underlying Dialog.Content element.' }
	],
	keyboard: [
		{ key: 'Escape', action: 'Closes the dialog and returns focus cleanly to the trigger.' },
		{ key: 'Tab / Shift+Tab', action: 'Cycles focus trapped strictly within the active dialog modal.' }
	],
	accessibility: [
		'Bits UI renders role="dialog" with aria-modal="true", traps focus, and restores it cleanly to the trigger on close.',
		'title and description automatically link to aria-labelledby and aria-describedby.',
		'The built-in close button carries aria-label="Close dialog".'
	],
	motion: 'Phase 1 still-state: overlay and panel render their static rest and leave end-states with visibility toggles. Phase 2 springs the overlay fade and panel 8px rise / 0.96 scale with interruptible retargeting. Reduced motion uses a plain opacity fade.',
	notes: 'Headless accessibility and focus trapping are powered by Bits UI Dialog. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Use for decisions that must interrupt: confirmations, short forms. Use Drawer for side panels, Bottom Sheet for mobile-first secondary tasks, Popover for light non-modal content.',
		'Always compose Dialog with DialogTrigger, DialogContent, and optional DialogClose.'
	],
	related: [
		{ name: 'Drawer', slug: 'drawer', description: 'A temporary side surface for focused work.' },
		{ name: 'Bottom Sheet', slug: 'bottom-sheet', description: 'A sheet that rests at a peek or full height and follows your finger.' },
		{ name: 'Popover', slug: 'popover', description: 'A small anchored surface for contextual information.' }
	],
	source: 'registry/components/dialog/dialog.tsx'
};

export default doc;
