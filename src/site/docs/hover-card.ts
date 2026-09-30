import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: 'Hover card',
	tagline: 'Preview a person or link on hover or focus without leaving the page.',
	description:
		'A read-only preview that opens after a short hover or keyboard focus and stays open while the pointer travels into it. Built on Bits UI LinkPreview.',
	group: 'overlays',
	status: 'ported',
	whenToUse: [
		'Previews of people behind mentions, avatars, or author names.',
		'Link or reference previews where the click must stay free for navigation.',
		'Dense lists where moving between triggers should open cards almost instantly.'
	],
	whenNotToUse: [
		'Use tooltip for a plain text label.',
		'Use popover when the content has interactive buttons or inputs.',
		'Use user-menu for the account menu on your own avatar.'
	],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/hover-card',
		manual: {
			dependencies: ['bits-ui'],
			steps: [
				'Copy hover-card.svelte, hover-card-profile.svelte, hover-card.types.ts, and hover-card.module.css into src/lib/components/hover-card/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import HoverCard and HoverCardProfile from $lib/components/hover-card'
			]
		}
	},
	usage: `<script lang="ts">
  import { HoverCard, HoverCardProfile } from '$lib/components/hover-card';
<\/script>

<HoverCard>
  {#snippet children()}
    <a href="/team/maya" class="mention-link">@maya</a>
  {/snippet}

  {#snippet content()}
    <HoverCardProfile
      name="Maya Chen"
      role="Staff Product Designer, Payments"
      avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face"
      bio="Designing resilient payment systems and design token primitives."
      stats={[
        { label: 'Projects', value: 18 },
        { label: 'Components', value: 42 }
      ]}
    />
  {/snippet}
</HoverCard>`,
	demoCode: `<script lang="ts">
  import { HoverCard, HoverCardProfile } from '$lib/components/hover-card';
<\/script>

<div class="demo-hover-card-row">
  <HoverCard>
    {#snippet children()}
      <button type="button" class="mention-pill">@maya</button>
    {/snippet}

    {#snippet content()}
      <HoverCardProfile
        name="Maya Chen"
        role="Product Designer, Core Systems"
        avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop&crop=face"
        bio="Leading component craft and design architecture for the web platform."
        stats={[
          { label: 'Repos', value: 14 },
          { label: 'Followers', value: '1.2k' }
        ]}
      />
    {/snippet}
  </HoverCard>

  <HoverCard side="top" align="center">
    {#snippet children()}
      <a href="#alex" class="mention-pill">@alex</a>
    {/snippet}

    {#snippet content()}
      <HoverCardProfile
        name="Alex Rivera"
        role="Systems Engineer, Infrastructure"
        avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face"
        bio="Building high-throughput edge nodes and reactive primitives."
        stats={[
          { label: 'Deploys', value: 340 },
          { label: 'Uptime', value: '99.99%' }
        ]}
      />
    {/snippet}
  </HoverCard>
</div>`,
	variants: [
		{
			name: 'Default Bottom Alignment',
			description: 'Card anchors below the trigger with person profile metadata and follower statistics.',
			code: `<HoverCard side="bottom" align="start">
  {#snippet children()}
    <button type="button">@maya</button>
  {/snippet}
  {#snippet content()}
    <HoverCardProfile name="Maya Chen" role="Designer" />
  {/snippet}
</HoverCard>`
		},
		{
			name: 'Top Center Placement',
			description: 'Positions above the trigger, centered horizontally.',
			code: `<HoverCard side="top" align="center">
  {#snippet children()}
    <a href="#alex">@alex</a>
  {/snippet}
  {#snippet content()}
    <HoverCardProfile name="Alex Rivera" role="Engineer" />
  {/snippet}
</HoverCard>`
		}
	],
	api: [
		{
			name: 'children',
			type: 'Snippet',
			default: '–',
			description: 'The trigger element, such as a mention button or link.'
		},
		{
			name: 'content',
			type: 'Snippet',
			default: '–',
			description: 'The preview content rendered inside the card (e.g. HoverCardProfile).'
		},
		{
			name: 'side',
			type: "'top' | 'bottom' | 'left' | 'right'",
			default: "'bottom'",
			description: 'Preferred placement edge relative to trigger.'
		},
		{
			name: 'align',
			type: "'start' | 'center' | 'end'",
			default: "'start'",
			description: 'Alignment along the trigger edge.'
		},
		{
			name: 'openDelay',
			type: 'number',
			default: '500',
			description: 'Milliseconds of hover before the card opens.'
		},
		{
			name: 'closeDelay',
			type: 'number',
			default: '140',
			description: 'Grace period in milliseconds after the pointer leaves before dismissal.'
		},
		{
			name: 'class',
			type: 'string',
			default: '–',
			description: 'Additional CSS class applied to the floating card.'
		}
	],
	keyboard: [
		{
			key: 'Tab',
			action: 'Keyboard focus on trigger opens card immediately without hover delay.'
		},
		{
			key: 'Enter',
			action: 'Opens card without delay when focused.'
		},
		{
			key: 'Escape',
			action: 'Closes card and prevents reopening until pointer leaves and returns.'
		}
	],
	accessibility: [
		'Card has role="tooltip" and trigger receives aria-describedby while open.',
		'Focus remains on the trigger; card content is strictly read-only.',
		'On touch devices, a single tap toggles the preview.'
	],
	motion:
		'Phase 1 still-state: Card mounts in portal with accurate positioning, border, and floating shadow. Phase 2 wires smooth spring scale (0.96 -> 1) with 4px directional travel, warm skip-window, and staggered profile settlement.',
	notes:
		'Built on Bits UI LinkPreview headless component. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Use for read-only previews of people or links where the click must stay free for navigation.',
		'Pass trigger elements via children snippet and card content via content snippet.',
		'Pair with HoverCardProfile for author or user previews.'
	],
	related: [
		{
			name: 'Tooltip',
			slug: 'tooltip',
			description: 'Short supporting text for unfamiliar controls.'
		},
		{
			name: 'Popover',
			slug: 'popover',
			description: 'A small anchored surface for interactive contextual information.'
		},
		{
			name: 'Avatar',
			slug: 'avatar',
			description: 'A compact identity marker for people and accounts.'
		}
	],
	source: 'registry/components/hover-card/hover-card.tsx'
};

export default doc;
