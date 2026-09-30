import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Tooltip',
	tagline: 'Short supporting text for unfamiliar controls.',
	description: 'A short label on hover or focus that opens without delay when moving between tooltips, with collision flipping and spring sizing.',
	group: 'overlays',
	status: 'ported',
	whenToUse: [
		'One-line labels on icon-only buttons in toolbars.',
		'Revealing the full text of truncated labels on hover or focus.',
		'Dense toolbars where moving between icons should show labels instantly after the first one.'
	],
	whenNotToUse: [
		'Use Popover for anything with links or controls inside.',
		'Use Hover Card for rich previews such as a person or link.',
		'Avoid it for information people must see on touch devices, where hover does not exist.'
	],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/tooltip',
		manual: {
			dependencies: ['bits-ui', '@humanspeak/svelte-motion'],
			steps: [
				'Copy src/lib/components/tooltip/ to your project components directory.',
				'Ensure the $lib path alias is configured in svelte.config.js / tsconfig.json.',
				'All styles live in tooltip.module.css — no Tailwind configuration required.'
			]
		}
	},
	usage: `<script lang="ts">
  import Tooltip from '$lib/components/tooltip/tooltip.svelte';
  import Archive from '@lucide/svelte/icons/archive';
<\/script>

<Tooltip content="Archive project">
  {#snippet children({ props })}
    <button {...props} type="button" aria-label="Archive project">
      <Archive size={16} />
    </button>
  {/snippet}
</Tooltip>`,
	demoCode: `<script lang="ts">
  import Tooltip from '$lib/components/tooltip/tooltip.svelte';
  import Archive from '@lucide/svelte/icons/archive';
  import Copy from '@lucide/svelte/icons/copy';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import Settings from '@lucide/svelte/icons/settings';
<\/script>

<div class="demo-box">
  <div class="demo-toolbar">
    <Tooltip content="Copy project link" side="top">
      {#snippet children({ props })}
        <button {...props} type="button" class="demo-icon-btn" aria-label="Copy project link">
          <Copy size={16} />
        </button>
      {/snippet}
    </Tooltip>

    <Tooltip content="Archive to storage" side="top">
      {#snippet children({ props })}
        <button {...props} type="button" class="demo-icon-btn" aria-label="Archive to storage">
          <Archive size={16} />
        </button>
      {/snippet}
    </Tooltip>

    <Tooltip content="Project settings" side="bottom">
      {#snippet children({ props })}
        <button {...props} type="button" class="demo-icon-btn" aria-label="Project settings">
          <Settings size={16} />
        </button>
      {/snippet}
    </Tooltip>

    <Tooltip content="Delete permanently" side="bottom">
      {#snippet children({ props })}
        <button {...props} type="button" class="demo-icon-btn demo-btn-danger" aria-label="Delete permanently">
          <Trash2 size={16} />
        </button>
      {/snippet}
    </Tooltip>
  </div>

  <p class="demo-hint">Hover or focus across icons to test the instant skip window.</p>
</div>

<style>
  .demo-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2.5rem;
  }
  .demo-toolbar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem;
    background: var(--color-bg-subtle, #f4f4f5);
    border: 1px solid var(--color-border-default, #e4e4e7);
    border-radius: 0.5rem;
  }
  .demo-icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 0.375rem;
    background: transparent;
    border: none;
    color: var(--color-fg-default, #18181b);
    cursor: pointer;
  }
  .demo-icon-btn:hover,
  .demo-icon-btn:focus-visible {
    background: var(--color-bg-muted, #e4e4e7);
    outline: none;
  }
  .demo-btn-danger:hover,
  .demo-btn-danger:focus-visible {
    color: #ef4444;
  }
  .demo-hint {
    font-size: 0.8125rem;
    color: var(--color-fg-muted, #71717a);
  }
</style>`,
	variants: [
		{
			name: 'Top Placement',
			description: 'Default placement anchored above the trigger element.',
			code: `<Tooltip content="Duplicate item" side="top">
  {#snippet children({ props })}
    <button {...props} type="button" aria-label="Duplicate"><Copy size={16} /></button>
  {/snippet}
</Tooltip>`
		},
		{
			name: 'Bottom Placement',
			description: 'Anchored below the trigger, ideal for upper navigation bars.',
			code: `<Tooltip content="Account settings" side="bottom">
  {#snippet children({ props })}
    <button {...props} type="button" aria-label="Settings"><Settings size={16} /></button>
  {/snippet}
</Tooltip>`
		},
		{
			name: 'Custom Snippet Content',
			description: 'Renders custom rich markup snippet within the tooltip bubble.',
			code: `{#snippet tip()}
  <span>Keyboard shortcut: <strong>⌘S</strong></span>
{/snippet}

<Tooltip content={tip}>
  {#snippet children({ props })}
    <button {...props} type="button">Save</button>
  {/snippet}
</Tooltip>`
		}
	],
	api: [
		{ name: 'content', type: 'string | Snippet', description: 'Tooltip content. Strings and numbers crossfade and resize when changed.' },
		{ name: 'children', type: 'Snippet<[{ props }]>', description: 'Your trigger element as a snippet: spread the received props onto your own button. Focus opens the tooltip and Escape closes it.' },
		{ name: 'side', type: "'top' | 'bottom'", default: "'top'", description: 'Preferred side of the trigger element.' }
	],
	keyboard: [
		{ key: 'Tab', action: 'Focusing the trigger element opens the tooltip.' },
		{ key: 'Escape', action: 'Closes the tooltip immediately.' }
	],
	accessibility: [
		'Bits UI links the content to the trigger with aria-describedby and renders role="tooltip".',
		'Content is supplemental: icon-only triggers still need their own aria-label.',
		'Do not put interactive elements inside; use Popover instead.'
	],
	motion: 'Phase 1 still-state: hover opens after 250ms, keyboard focus opens instantly, both with a 3px rise from 0.97 scale and static string rendering. Phase 2 springs bubble width and height to content changes with motionTokens.spring.morph. Reduced motion drops transforms and keeps a 90ms opacity fade.',
	notes: 'Headless tooltip mechanics and skip-window timers are powered by Bits UI Tooltip. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Use for one-line labels on icon buttons and truncated text. Use Hover Card for rich previews and Popover for interactive controls.',
		'Each Tooltip brings its own provider; no app-level wrapper is needed. Pass your button in the children snippet (with the props argument) and spread its props — the button itself becomes the trigger, so focus and aria-describedby land on it.'
	],
	related: [
		{ name: 'Popover', slug: 'popover', description: 'A small anchored surface for contextual information.' },
		{ name: 'Hover Card', slug: 'hover-card', description: 'Preview a person or link on hover or focus without leaving the page.' }
	],
	source: 'registry/components/tooltip/tooltip.tsx'
};

export default doc;
