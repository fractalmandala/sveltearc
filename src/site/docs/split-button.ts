import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Split Button',
	tagline: 'A primary action with a menu of nearby alternatives.',
	description: 'A primary action joined to a chevron trigger that opens a floating dropdown of related secondary commands.',
	group: 'buttons',
	status: 'ported',
	whenToUse: [
		'One default action with a few close variants, like Merge with Squash and Rebase.',
		'Export or share actions where one format is the usual pick and others sit behind the chevron.',
		'Copy actions that swap the label to Copied in place while offering alternatives.'
	],
	whenNotToUse: [
		'Use Dropdown Menu when there is no default action and every option is equal.',
		'Use Button when there are no alternatives.',
		'Use Context Menu for actions tied to a piece of content rather than a toolbar.'
	],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/split-button',
		manual: {
			dependencies: ['bits-ui', '@lucide/svelte', '@humanspeak/svelte-motion'],
			steps: [
				'Copy src/lib/components/split-button/ to your project components directory.',
				'Ensure the $lib path alias is configured in svelte.config.js / tsconfig.json.',
				'All styles live in split-button.module.css — no Tailwind configuration required.'
			]
		}
	},
	usage: `<script lang="ts">
  import SplitButton from '$lib/components/split-button/split-button.svelte';
  import GitMerge from '@lucide/svelte/icons/git-merge';
  import GitPullRequest from '@lucide/svelte/icons/git-pull-request';

  function merge() { console.log('Merged'); }
  function squash() { console.log('Squashed'); }
  function rebase() { console.log('Rebased'); }
</script>

{#snippet mergeIcon()}<GitMerge size={15} />{/snippet}

<SplitButton
  label="Merge pull request"
  icon={mergeIcon}
  onClick={merge}
  actions={[
    { label: 'Squash and merge', onSelect: squash },
    { label: 'Rebase and merge', onSelect: rebase },
    { label: 'Close pull request', destructive: true, onSelect: () => console.log('Closed') }
  ]}
/>`,
	demoCode: `<script lang="ts">
  import SplitButton from '$lib/components/split-button/split-button.svelte';
  import GitMerge from '@lucide/svelte/icons/git-merge';
  import Share2 from '@lucide/svelte/icons/share-2';

  let lastAction = $state('None');

  function handleAction(name: string) {
    lastAction = name;
  }
</script>

{#snippet mergeIcon()}<GitMerge size={15} />{/snippet}
{#snippet shareIcon()}<Share2 size={15} />{/snippet}

<div class="demo-box">
  <div class="demo-row">
    <SplitButton
      label="Merge pull request"
      icon={mergeIcon}
      variant="primary"
      onClick={() => handleAction('Merge pull request (default)')}
      actions={[
        { label: 'Squash and merge', onSelect: () => handleAction('Squash and merge') },
        { label: 'Rebase and merge', onSelect: () => handleAction('Rebase and merge') },
        { label: 'Close pull request', destructive: true, onSelect: () => handleAction('Close pull request') }
      ]}
    />

    <SplitButton
      label="Export project"
      icon={shareIcon}
      variant="secondary"
      onClick={() => handleAction('Export project as ZIP')}
      actions={[
        { label: 'Export as JSON', onSelect: () => handleAction('Export as JSON') },
        { label: 'Export as CSV', onSelect: () => handleAction('Export as CSV') }
      ]}
    />
  </div>

  <p class="demo-status">Last triggered action: <strong>{lastAction}</strong></p>
</div>

<style>
  .demo-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2.5rem;
  }
  .demo-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
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
			name: 'Primary Variant',
			description: 'High-contrast primary action button joined with dropdown trigger.',
			code: `<SplitButton label="Publish" variant="primary" onClick={publish} actions={publishActions} />`
		},
		{
			name: 'Secondary Variant',
			description: 'Muted border variant for secondary workflows like Export and Share.',
			code: `<SplitButton label="Export" variant="secondary" onClick={exportData} actions={exportActions} />`
		},
		{
			name: 'Disabled State',
			description: 'Disables both the primary action and the dropdown chevron trigger.',
			code: `<SplitButton label="Merge" disabled actions={actions} />`
		}
	],
	api: [
		{ name: 'label', type: 'string', description: 'Main action label. In Phase 2, text changes morph letter by letter.' },
		{ name: 'actions', type: 'SplitButtonAction[]', description: 'Menu items: { label, onSelect?, disabled?, destructive?, icon?: Snippet }.' },
		{ name: 'onClick', type: '() => void', description: 'Runs the primary action.' },
		{ name: 'icon', type: 'Snippet', description: 'Optional leading icon snippet on the primary half.' },
		{ name: 'variant', type: "'primary' | 'secondary'", default: "'primary'", description: 'Visual weight of both button halves.' },
		{ name: 'disabled', type: 'boolean', default: 'false', description: 'Disables both the main action and the menu trigger.' }
	],
	keyboard: [
		{ key: 'Enter / Space', action: 'Runs the main action, or opens the menu from the chevron.' },
		{ key: 'ArrowDown / ArrowUp', action: 'Moves between menu items, looping at the ends.' },
		{ key: 'Escape', action: 'Closes the menu and returns focus cleanly to the chevron.' }
	],
	accessibility: [
		'Two native button elements; the chevron is labelled "<label> more actions".',
		'The menu is powered by Bits UI DropdownMenu with WAI-ARIA menu and menuitem roles and roving focus management.',
		'The main label is announced through an aria-live="polite" region when it changes.'
	],
	motion: 'Phase 1 still-state: primary slot width is measured statically and label renders plain string without character morphing. Phase 2 springs width with motionTokens.spring.morph and wires MorphText letter diffing. Reduced motion drops transitions and swaps states instantly.',
	notes: 'Headless menu mechanics are powered by Bits UI DropdownMenu. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Use when one action is the default and two to five close variants exist. For a menu with no default action use Dropdown Menu.',
		'Keep the menu actions as variations of the main action; put unrelated commands elsewhere.'
	],
	related: [
		{ name: 'Dropdown Menu', slug: 'dropdown-menu', description: 'A focused list of actions anchored to a trigger.' },
		{ name: 'Popover', slug: 'popover', description: 'A small anchored surface for contextual information.' }
	],
	source: 'registry/components/split-button/split-button.tsx'
};

export default doc;
