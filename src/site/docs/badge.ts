import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Badge",
	tagline: "A small label for status, category, or metadata.",
	description: "A small label for status, category, or metadata.",
	group: 'avatars',
	status: 'ported',
	whenToUse: ["Short statuses next to titles or in table cells, such as Live, Draft, or Failed.","Counts or states that change in place and should morph instead of jump.","Tagging a row with one tone plus an optional icon."],
	whenNotToUse: ["Use alert or toast when the message needs a full sentence.","Use chip-group when people toggle the values.","Use stat-card for a headline number with a trend."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/badge',
		manual: {
			dependencies: [],
			steps: [
				'Copy src/lib/components/badge/ into your project — badge.module.css carries all styles, no Tailwind required.',
				'Ensure foundation.css (design tokens) and motion-tokens.ts (Phase 2 motion carrier) are present in src/lib.',
				"Import { Badge } from '$lib/components/badge' — icons come from your own icon library as snippets."
			]
		}
	},
	usage: `<script lang="ts">
  import { Badge } from '$lib/components/badge';
  import { Check } from '@lucide/svelte';

  let live = $state(true);
<\/script>

{#snippet checkIcon()}
  <Check size={12} />
{/snippet}

<Badge tone={live ? 'success' : 'neutral'} icon={live ? checkIcon : undefined}>
  {live ? 'Live' : 'Draft'}
</Badge>`,
	demoCode: `<script lang="ts">
  import { Badge } from '$lib/components/badge';
  import { Check, ShieldAlert, Sparkles, AlertCircle } from '@lucide/svelte';
<\/script>

{#snippet checkIcon()}
  <Check size={12} />
{/snippet}

{#snippet alertIcon()}
  <AlertCircle size={12} />
{/snippet}

{#snippet shieldIcon()}
  <ShieldAlert size={12} />
{/snippet}

{#snippet sparkleIcon()}
  <Sparkles size={12} />
{/snippet}

<div class="demo-badge-wrap">
  <div class="demo-badge-row">
    <Badge tone="neutral">Draft</Badge>
    <Badge tone="success" icon={checkIcon}>Live</Badge>
    <Badge tone="info" icon={sparkleIcon}>Experimental</Badge>
    <Badge tone="warning" icon={alertIcon}>Pending</Badge>
    <Badge tone="danger" icon={shieldIcon}>Security Alert</Badge>
  </div>
  <div class="demo-badge-row">
    <Badge tone="neutral" size="sm">Small Neutral</Badge>
    <Badge tone="success" size="sm" icon={checkIcon}>Small Success</Badge>
    <Badge tone="info" size="sm">Small Info</Badge>
  </div>
</div>

<style>
  .demo-badge-wrap {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 1rem;
    width: 100%;
  }

  .demo-badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
    justify-content: center;
  }
</style>`,
	variants: [
		{
			name: 'Status tones',
			description: 'Five tones cover neutral, success, info, warning, and danger statuses.',
			code: `<Badge tone="neutral">Draft</Badge>
<Badge tone="success">Live</Badge>
<Badge tone="info">Experimental</Badge>
<Badge tone="warning">Pending</Badge>
<Badge tone="danger">Security Alert</Badge>`
		},
		{
			name: 'With icon',
			description: 'The icon prop is a snippet, so any icon component works — the icon is aria-hidden.',
			code: `{#snippet checkIcon()}
  <Check size={12} />
{/snippet}

<Badge tone="success" icon={checkIcon}>Live</Badge>`
		},
		{
			name: 'Compact size',
			description: 'size="sm" tightens height and text for dense rows and table cells.',
			code: `<Badge tone="neutral" size="sm">Small Neutral</Badge>
<Badge tone="success" size="sm">Small Success</Badge>`
		}
	],
	api: [
		{
			name: 'tone',
			type: '"neutral" | "success" | "info" | "warning" | "danger"',
			default: "'neutral'",
			description: 'Color of the pill.'
		},
		{
			name: 'size',
			type: '"sm" | "md"',
			default: "'md'",
			description: 'Height and text size.'
		},
		{
			name: 'icon',
			type: 'Snippet',
			default: '–',
			description: 'Leading icon. A different icon component crossfades in.'
		},
		{
			name: 'children',
			type: 'Snippet',
			default: '–',
			description: 'Label. String or number children get the rolling text swap; other nodes render as is.'
		},
		{
			name: '...props',
			type: 'HTMLAttributes<HTMLSpanElement>',
			default: '–',
			description: 'Forwarded to the root span.'
		}
	],
	accessibility: ["Renders a plain span, so it is read inline with surrounding text.","The icon is aria-hidden; the label must state the status on its own, not rely on tone color.","Outgoing labels are hidden from assistive tech while they fade, so only the current text is read.","It does not announce changes. Put it inside a live region if a status update must be spoken."],
	motion: "- A new label rises in with a short blur while the old one lifts away, and the pill width springs to fit. - Passive reflows such as font swaps resize instantly; only a content change springs. - Reduced motion swaps the label with a quick fade and snaps the width.",
	notes: "Svelte 5 runes only — no runtime dependencies, a plain span that reads inline. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["Use for short statuses and counts next to titles or in table cells. Use alert or toast for messages with sentences.","Keep the badge mounted and change its children to get the morph; remounting with a new key loses it."],
	related: [{"name":"Alert","slug":"alert","description":"A persistent message that helps people recover or continue."},{"name":"Sortable data table","slug":"sortable-data-table","description":"Compare structured records with sortable columns."}],
	source: 'registry/components/badge/badge.tsx'
};

export default doc;
