import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Empty state",
	tagline: "A useful next step when there is nothing to show yet.",
	description: "A useful next step when there is nothing to show yet.",
	group: 'cards',
	status: 'ported',
	whenToUse: ["Empty lists, zero search results, and first-run views.","A view that should morph between states, such as empty and success, by changing props."],
	whenNotToUse: ["Use skeleton while data is still loading.","Use alert for errors inside a page that still has content.","Use onboarding-checklist when first-run needs several steps."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/empty-state',
		manual: {
			dependencies: ["bits-ui","@lucide/svelte"],
			steps: [
				'Copy empty-state files into src/lib/components/empty-state/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import EmptyState from $lib/components/empty-state'
			]
		}
	},
	usage: `<script lang="ts">
  import { EmptyState } from '$lib/components/empty-state';
  import { Button } from '$lib/components/button';
  import { Search } from '@lucide/svelte';
<\/script>

<EmptyState
  title="No results found"
  description="Try adjusting your search terms or filters to find what you need."
>
  {#snippet icon()}
    <Search size={24} strokeWidth={1.5} />
  {/snippet}
  {#snippet action()}
    <Button variant="secondary" size="sm">Clear filters</Button>
  {/snippet}
</EmptyState>`,
	demoCode: `<script lang="ts">
  import { EmptyState } from '$lib/components/empty-state';
  import { Button } from '$lib/components/button';
  import { Search } from '@lucide/svelte';
<\/script>

<div class="demo-empty-state-container">
  <EmptyState
    title="No results found"
    description="Try adjusting your search terms or filters to find what you need."
  >
    {#snippet icon()}
      <Search size={24} strokeWidth={1.5} />
    {/snippet}
    {#snippet action()}
      <Button variant="outline" size="sm">Clear filters</Button>
    {/snippet}
  </EmptyState>
</div>`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: `<EmptyState
  title="No files yet"
  description="Upload your first document to get started."
/>`
		}
	],
	api: [
  {
    "name": "title",
    "type": "string",
    "default": "–",
    "description": "(Required) Headline. A new title rises in while the old one leaves."
  },
  {
    "name": "description",
    "type": "string",
    "default": "–",
    "description": "(Required) One or two sentences on why it is empty and what to do."
  },
  {
    "name": "action",
    "type": "Snippet",
    "default": "–",
    "description": "Call to action, usually a button."
  },
  {
    "name": "icon",
    "type": "Snippet",
    "default": "'<Folder />'",
    "description": "Leading icon. A different icon component crossfades in."
  },
  {
    "name": "className",
    "type": "string",
    "default": "–",
    "description": "Class for the root section."
  },
  {
    "name": "label",
    "type": "string",
    "default": "–",
    "description": "Accessible name for the section region."
  }
],
	keyboard: [
  {
    "key": "Tab",
    "action": "Moves focus to the interactive element."
  }
],
	accessibility: ["Renders a section with an h3 title; pass label to name the region.","The icon is aria-hidden.","Outgoing copy is hidden from assistive tech while it fades."],
	motion: "- Changing title or description rolls the copy in place while the block height springs to fit. - A new icon pops in with a short blur. - Reduced motion swaps copy with a fade and snaps height; the icon's idle animation stops.",
	notes: "Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["Use for empty lists, zero search results, and first-run views. Use skeleton while data is loading.","Keep it mounted and change its props to morph between states such as empty and success."],
	related: [{"name":"Skeleton","slug":"skeleton","description":"Reserve space while content is still loading."},{"name":"Alert","slug":"alert","description":"A persistent message that helps people recover or continue."},{"name":"Sortable data table","slug":"sortable-data-table","description":"Compare structured records with sortable columns."}],
	source: 'registry/components/empty-state/empty-state.tsx'
};

export default doc;
