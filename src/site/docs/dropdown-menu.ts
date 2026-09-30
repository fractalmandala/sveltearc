import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Dropdown Menu',
	tagline: 'A focused list of actions anchored to a trigger.',
	description: 'A labelled trigger that opens a floating menu with keyboard navigation, single-highlight gliding, and destructive action styling.',
	group: 'menus',
	status: 'ported',
	whenToUse: [
		'A list of commands behind a labelled button, such as Rename, Duplicate, and Delete.',
		'Row or card actions where a visible trigger is clearer than right-click.',
		'Short grouped menus with separators and one destructive item at the end.'
	],
	whenNotToUse: [
		'Use Split Button when one command is the default.',
		'Use Context Menu for right-click actions on content.',
		'Use User Menu for the account menu, and Command Palette for searching many commands.'
	],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/dropdown-menu',
		manual: {
			dependencies: ['bits-ui', '@lucide/svelte', '@humanspeak/svelte-motion'],
			steps: [
				'Copy src/lib/components/dropdown-menu/ to your project components directory.',
				'Ensure the $lib path alias is configured in svelte.config.js / tsconfig.json.',
				'All styles live in dropdown-menu.module.css — no Tailwind configuration required.'
			]
		}
	},
	usage: `<script lang="ts">
  import DropdownMenu from '$lib/components/dropdown-menu/dropdown-menu.svelte';
  import Pencil from '@lucide/svelte/icons/pencil';
  import Copy from '@lucide/svelte/icons/copy';
  import Trash2 from '@lucide/svelte/icons/trash-2';

  function rename() { console.log('Rename clicked'); }
  function duplicate() { console.log('Duplicate clicked'); }
  function remove() { console.log('Delete clicked'); }
</script>

{#snippet renameIcon()}<Pencil size={15} />{/snippet}
{#snippet duplicateIcon()}<Copy size={15} />{/snippet}
{#snippet deleteIcon()}<Trash2 size={15} />{/snippet}

<DropdownMenu
  label="Actions"
  items={[
    { label: 'Rename', icon: renameIcon, onSelect: rename },
    { label: 'Duplicate', icon: duplicateIcon, onSelect: duplicate },
    { label: 'Delete', icon: deleteIcon, onSelect: remove, destructive: true, separatorBefore: true }
  ]}
/>`,
	demoCode: `<script lang="ts">
  import DropdownMenu from '$lib/components/dropdown-menu/dropdown-menu.svelte';
  import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
  import Pencil from '@lucide/svelte/icons/pencil';
  import Copy from '@lucide/svelte/icons/copy';
  import Share2 from '@lucide/svelte/icons/share-2';
  import Archive from '@lucide/svelte/icons/archive';
  import Trash2 from '@lucide/svelte/icons/trash-2';

  let lastAction = $state('None');

  function handleAction(name: string) {
    lastAction = name;
  }
</script>

{#snippet triggerIcon()}<MoreHorizontal size={15} />{/snippet}
{#snippet pencilIcon()}<Pencil size={15} />{/snippet}
{#snippet copyIcon()}<Copy size={15} />{/snippet}
{#snippet shareIcon()}<Share2 size={15} />{/snippet}
{#snippet archiveIcon()}<Archive size={15} />{/snippet}
{#snippet trashIcon()}<Trash2 size={15} />{/snippet}

<div class="demo-box">
  <div class="demo-controls">
    <DropdownMenu
      label="Project Options"
      icon={triggerIcon}
      items={[
        { label: 'Edit Metadata', icon: pencilIcon, onSelect: () => handleAction('Edit Metadata') },
        { label: 'Make a Copy', icon: copyIcon, onSelect: () => handleAction('Make a Copy') },
        { label: 'Share Link', icon: shareIcon, onSelect: () => handleAction('Share Link') },
        { label: 'Archive Project', icon: archiveIcon, separatorBefore: true, onSelect: () => handleAction('Archive Project') },
        { label: 'Delete Project', icon: trashIcon, destructive: true, onSelect: () => handleAction('Delete Project') }
      ]}
    />
  </div>

  <p class="demo-status">
    Last executed action: <strong>{lastAction}</strong>
  </p>
</div>

<style>
  .demo-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 2rem;
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
			name: 'Default Project Actions',
			description: 'Standard trigger button with text label and items array.',
			code: `<DropdownMenu label="Actions" items={actionItems} />`
		},
		{
			name: 'With Trigger Icon',
			description: 'Leading icon rendered in the trigger alongside the label.',
			code: `{#snippet icon()}<MoreHorizontal size={15} />{/snippet}
<DropdownMenu label="Options" {icon} items={actionItems} />`
		},
		{
			name: 'Separators and Destructive Items',
			description: 'Groups related commands with visual dividers and danger styling.',
			code: `<DropdownMenu
  label="File"
  items={[
    { label: 'Download', onSelect: download },
    { label: 'Move to Trash', destructive: true, separatorBefore: true, onSelect: remove }
  ]}
/>`
		}
	],
	api: [
		{ name: 'label', type: 'string', description: 'Trigger text. In Phase 2, a new label rises in while the trigger width springs.' },
		{ name: 'items', type: 'DropdownItem[]', description: 'Items array: { label, onSelect?, disabled?, icon?: Snippet, destructive?, separatorBefore? }.' },
		{ name: 'icon', type: 'Snippet', description: 'Optional leading icon snippet rendered in the trigger button.' }
	],
	keyboard: [
		{ key: 'Enter / Space / ArrowDown', action: 'Opens the menu from the trigger.' },
		{ key: 'ArrowDown / ArrowUp', action: 'Moves focus between menu items, looping at the ends.' },
		{ key: 'Home / End', action: 'Jumps directly to the first or last menu item.' },
		{ key: 'Escape', action: 'Closes the menu and returns focus cleanly to the trigger.' }
	],
	accessibility: [
		'Built on Bits UI DropdownMenu (WAI-ARIA Menu button pattern): the trigger receives aria-haspopup="menu" and aria-expanded; items receive role="menuitem" and typeahead.',
		'Icons and gliding highlight elements are aria-hidden; destructive items are marked by color tone and should clearly state what they destroy.',
		'Disabled items are skipped during keyboard navigation.'
	],
	motion: 'Phase 1 still-state: trigger label renders measured width statically and the highlight renders at the active menuitem. Phase 2 springs the gliding highlight between items via motionTokens.spring.snappy for pointer hover, and springs trigger width on label changes with motionTokens.spring.morph. Reduced motion disables highlight gliding and scale transitions.',
	notes: 'Headless accessibility and menu mechanics are powered by Bits UI DropdownMenu. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Default choice for a list of commands behind a button. Use Split Button when one command is the default.',
		'Items are passed as data objects, not children, so build the array from your application actions.',
		'Group items with separatorBefore; place destructive items at the end.'
	],
	related: [
		{ name: 'Split Button', slug: 'split-button', description: 'A primary action with a menu of nearby alternatives.' },
		{ name: 'Popover', slug: 'popover', description: 'A small anchored surface for contextual information.' }
	],
	source: 'registry/components/dropdown-menu/dropdown-menu.tsx'
};

export default doc;
