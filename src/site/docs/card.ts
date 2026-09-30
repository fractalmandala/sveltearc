import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Card',
	description: 'A surface for a single subject, with an optional quick look that opens into a larger dialog.',
	tagline: 'One surface, two sizes.',
	group: 'cards',
	status: 'ported',
	whenToUse: [
		'When a single subject needs a compact summary with optional depth.',
		'When the summary should stay on the page while detail opens above it.',
		'When the card has a title, optional description, media, and an owner (meta/status).'
	],
	whenNotToUse: [
		'For tabular comparison — use a table or list.',
		'When there is no detail to reveal — drop `details` and the card stays static.',
		'For destructive confirmations — use a dialog.'
	],
	install: {
		cli: 'npx shadcn-svelte@latest add @arcui/card',
		manual: {
			dependencies: ['bits-ui', '@lucide/svelte'],
			steps: [
				'Copy card.svelte, card.types.ts and card.module.css into src/lib/components/card/.',
				'Provide `details` to enable the quick look; without it the card never opens.'
			]
		}
	},
	usage: `<script lang="ts">
  import Card from '$lib/components/card/card.svelte';
</script>

<Card title="Quarterly report" description="Revenue is up 18%." status="Updated 2 hours ago">
  {#snippet details()}
    <p>The full breakdown lands here.</p>
  {/snippet}
</Card>`,
	demoCode: `<script lang="ts">
  import Card from '$lib/components/card/card.svelte';
</script>

<div class="demo-row demo-row-wrap">
  <div class="demo-card-wrap">
    <Card title="Quarterly report" description="Revenue is up 18% quarter over quarter." status="Updated 2 hours ago">
      {#snippet details()}
        <p>
          The full breakdown — per-region revenue, retention and the forward plan — lands in this quick look.
          Press Escape or the close control to return to the card.
        </p>
      {/snippet}
    </Card>
  </div>
  <div class="demo-card-wrap">
    <Card title="Static card" description="No details, so this card never opens." />
  </div>
</div>`,
	variants: [
		{
			name: 'With Quick Look Details',
			description: 'Title acts as a trigger button expanding into a full Dialog.',
			code: `<Card title="Interactive Spec" description="Click to expand full details.">
  {#snippet details()}
    <div>Deep contextual breakdown goes here.</div>
  {/snippet}
</Card>`
		},
		{
			name: 'Static Summary Card',
			description: 'Omits the details snippet, rendering as a pure static container.',
			code: `<Card title="Documentation Summary" description="All 16 primitives mapped cleanly." />`
		},
		{
			name: 'With Media & Status',
			description: 'Header image preview with live footer status indicator.',
			code: `{#snippet media()}<img src="/preview.jpg" alt="Preview" />{/snippet}
<Card title="Release v1.0" status="Shipped today" {media} />`
		}
	],
	api: [
		{ name: 'title', type: 'string', description: 'Card heading; becomes the quick-look trigger when details exist.' },
		{ name: 'description', type: 'string', description: 'Short supporting line.' },
		{ name: 'media', type: 'Snippet', description: 'Leading visual.' },
		{ name: 'action', type: 'Snippet', description: 'Trailing footer control.' },
		{ name: 'avatar', type: 'Snippet', description: 'Footer byline visual.' },
		{ name: 'meta', type: 'Snippet', description: 'Footer byline text, e.g. owner.' },
		{ name: 'status', type: 'string', description: 'Footer status line.' },
		{ name: 'details', type: 'Snippet', description: 'Quick-look content. Enables the dialog.' },
		{ name: 'open', type: 'boolean', description: 'Controlled quick-look state.' },
		{ name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Uncontrolled initial state.' },
		{ name: 'onOpenChange', type: '(open: boolean) => void', description: 'Quick-look open callback.' }
	],
	keyboard: [
		{ key: 'Enter / Space', action: 'Open the quick look from the title trigger.' },
		{ key: 'Escape', action: 'Close the quick look.' },
		{ key: 'Tab', action: 'Move through footer and quick-look controls.' }
	],
	accessibility: [
		'The title trigger stretches its hit area over the card, so pointing anywhere opens the quick look.',
		'The quick look is a labelled dialog with a title and (when present) a description.',
		'Status text is announced via role="status"; the visible roll is aria-hidden.'
	],
	motion: 'Phase 1 still-state: the quick look is a normal dialog. Phase 2 wires the shared-layout morph (layoutId across card and panel), the return-to-card landing, the card lift and the media zoom. This is the port’s designated layoutId spike.',
	notes: 'Bits UI Dialog is forceMount-free in Phase 1: without the morph the portal renders only while open, which matches ARC’s reduced-motion path.',
	notesForAi: [
		'`details` is the switch for the whole quick look; no details means no dialog.',
		'Keep `data-hover` — the CSS lift depends on it.',
		'Do not hand-write focus traps; Bits UI owns them.'
	],
	related: [
		{ name: 'Dialog', slug: 'dialog', description: 'The primitive hosting the quick look.' },
		{ name: 'Avatar', slug: 'avatar', description: 'Common footer byline visual.' }
	],
	source: 'registry/components/card/card.tsx'
};

export default doc;
