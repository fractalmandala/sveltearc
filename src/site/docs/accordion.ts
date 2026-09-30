import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Accordion',
	tagline: 'Progressively reveal supporting information in place.',
	description:
		'A single-open, collapsible list of question and answer rows built on Bits UI with spring-animated panel disclosure.',
	group: 'expand',
	status: 'ported',
	whenToUse: [
		'FAQ sections where only one answer should be open at a time.',
		'Settings or help pages that group long content under short, scannable questions.',
		'Page-level FAQs that need larger type, via size="lg".'
	],
	whenNotToUse: [
		'Use Expandable Card for a single standalone disclosure such as a plan or order summary.',
		'Use Tabs when sections are peer views that people switch between.',
		'Use Onboarding Checklist when the rows are setup tasks to complete.'
	],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/accordion',
		manual: {
			dependencies: ['bits-ui', '@lucide/svelte', '@humanspeak/svelte-motion'],
			steps: [
				'Copy src/lib/components/accordion/ to your project components directory.',
				'Ensure the $lib path alias is configured in svelte.config.js / tsconfig.json.',
				'All styles live in accordion.module.css — no Tailwind configuration required.'
			]
		}
	},
	usage: `<script lang="ts">
  import Accordion from '$lib/components/accordion/accordion.svelte';

  const items = [
    { title: 'Can I cancel anytime?', content: cancelAnswer },
    { title: 'Do you offer refunds?', content: refundAnswer }
  ];
</script>

<Accordion size="lg" {items} />

{#snippet cancelAnswer()}
  <p>Yes. Your plan stays active until the billing period ends.</p>
{/snippet}

{#snippet refundAnswer()}
  <p>Within 14 days of purchase, no questions asked.</p>
{/snippet}`,
	demoCode: `<script lang="ts">
  import Accordion from '$lib/components/accordion/accordion.svelte';

  const items = [
    { title: 'What does the pilot prove?', content: answerBits },
    { title: 'Why do closed panels stay mounted?', content: answerForce },
    { title: 'What changes for consumers?', content: answerApi }
  ];
</script>

{#snippet answerBits()}
  <p>
    Bits UI owns roles, ids, focus and keyboard. The CSS Module is verbatim, its
    <code>[data-state="open"]</code> selector keeps working untouched, and the anatomy JSON
    contract — not memory — dictated every prop wired.
  </p>
{/snippet}
{#snippet answerForce()}
  <p>
    The React original used <code>forceMount</code> so a toggle mid-animation retargets the
    spring instead of restarting it. Phase 1 keeps that mounted contract with static
    end-states; Phase 2 swaps the style carrier for motion variants with no structural edit.
  </p>
{/snippet}
{#snippet answerApi()}
  <p>
    <code>content: ReactNode</code> becomes <code>content?: Snippet</code> inside
    <code>items</code>. That is the one documented props-contract delta (see
    <code>accordion.manifest.json</code> gaps).
  </p>
{/snippet}

<div class="demo-stack">
  <Accordion {items} />
  <Accordion {items} size="lg" />
</div>

<style>
  .demo-stack {
    display: grid;
    gap: 2.5rem;
  }
</style>`,
	variants: [
		{
			name: 'Default (size="md")',
			description: 'Compact row height with standard question typography for cards or sidebars.',
			code: `<Accordion {items} />`
		},
		{
			name: 'Large (size="lg")',
			description: 'Expanded row height with large question headings and a 62ch max-width for page-level FAQs.',
			code: `<Accordion {items} size="lg" />`
		},
		{
			name: 'All Closed on First Render',
			description: 'Pass defaultOpen={-1} to start with all items collapsed.',
			code: `<Accordion {items} defaultOpen={-1} />`
		}
	],
	api: [
		{
			name: 'items',
			type: '{ title: string; content?: Snippet }[]',
			description:
				'Ordered rows. The title is the trigger button label; content is a Svelte 5 Snippet rendering the panel body.'
		},
		{
			name: 'defaultOpen',
			type: 'number',
			default: '0',
			description: 'Index of the row open on first render. Pass -1 to start with every row closed.'
		},
		{
			name: 'size',
			type: "'md' | 'lg'",
			default: "'md'",
			description: '"lg" sets questions at the large text size for page-level FAQs with responsive padding.'
		}
	],
	keyboard: [
		{ key: 'Enter / Space', action: 'Toggles the focused accordion row.' },
		{ key: 'ArrowDown', action: 'Moves focus to the next accordion trigger.' },
		{ key: 'ArrowUp', action: 'Moves focus to the previous accordion trigger.' },
		{ key: 'Home', action: 'Jumps focus directly to the first trigger.' },
		{ key: 'End', action: 'Jumps focus directly to the last trigger.' }
	],
	accessibility: [
		'Bits UI wires aria-expanded, aria-controls, and region labelling between each trigger and panel.',
		'Closed panels stay mounted in the DOM but switch to visibility: hidden once collapsed, cleanly leaving the accessibility tree.',
		'Triggers sit inside h3 heading elements (level 3, matching the React original); the chevron icon is aria-hidden="true".',
		'Keyboard navigation conforms to the WAI-ARIA Accordion design pattern with automatic looping/boundary handling.'
	],
	motion:
		'Phase 1 still-state: closed panels hold at height 0 / opacity 0 / visibility hidden while staying mounted; the chevron sits at its rotation end value (0deg vs 180deg). Phase 2 wires the non-overshooting height spring, blur settle (slides down 6px out of a subtle blur), and snappy icon spring via @humanspeak/svelte-motion; mid-flight toggles retarget smoothly without restarting. Reduced-motion applies the same end states instantly in one step.',
	notes:
		'DOM parity is load-bearing: panels are never conditionally unmounted (Radix forceMount equivalent), so a mid-flight toggle retargets instead of restarting. Bits UI owns roles, ids, aria-expanded and keyboard; the verbatim CSS Module’s [data-state="open"] selector is the styling hook. Header is level 3, matching the React original.',
	notesForAi: [
		'Use for FAQs and settings groups where only one section should be open. Use expandable-card for single disclosures and tabs when sections are peers.',
		'Content is passed via Svelte 5 snippets ({#snippet answer()}...{/snippet}) rather than ReactNode.',
		'Pass defaultOpen={-1} if you need all accordion items to be collapsed on initial render.',
		'Only single-expand mode is supported by design to keep disclosure focused.'
	],
	related: [
		{ name: 'Tabs', slug: 'tabs', description: 'Switch between related content in the same context.' },
		{ name: 'Popover', slug: 'popover', description: 'A small anchored surface for contextual information.' }
	],
	source: 'registry/components/accordion/accordion.tsx'
};

export default doc;
