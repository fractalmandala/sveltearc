import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Tabs',
	tagline: 'Switch between related content in the same context.',
	description: 'Peer views of the same object with sliding selection indicator, horizontally scrollable overflow with edge buttons, and spring panel height.',
	group: 'navigation',
	status: 'ported',
	whenToUse: [
		'Peer views of the same object, such as Overview, Activity, and Settings.',
		'Panels with different heights, where the container should spring between them.',
		'Long tab sets that need to scroll horizontally with edge buttons.'
	],
	whenNotToUse: [
		'Use Segmented Control for a compact value toggle not tied to panels.',
		'Use Accordion for stacked sections people read in order.',
		'Use Liquid Tab Bar or Morph Nav for app-level navigation between routes.'
	],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/tabs',
		manual: {
			dependencies: ['bits-ui', '@lucide/svelte', '@humanspeak/svelte-motion'],
			steps: [
				'Copy src/lib/components/tabs/ to your project components directory.',
				'Ensure the $lib path alias is configured in svelte.config.js / tsconfig.json.',
				'All styles live in tabs.module.css — no Tailwind configuration required.'
			]
		}
	},
	usage: `<script lang="ts">
  import { Tabs, TabsList, TabsTrigger, TabsContent } from '$lib/components/tabs';
</script>

<Tabs defaultValue="overview">
  <TabsList aria-label="Project Sections">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    <p>Project summary and performance metrics.</p>
  </TabsContent>
  <TabsContent value="activity">
    <p>Recent audit logs and team events.</p>
  </TabsContent>
  <TabsContent value="settings">
    <p>Configure team permissions and notifications.</p>
  </TabsContent>
</Tabs>`,
	demoCode: `<script lang="ts">
  import { Tabs, TabsList, TabsTrigger, TabsContent } from '$lib/components/tabs';

  let currentTab = $state('overview');
</script>

<div class="demo-box">
  <Tabs bind:value={currentTab} defaultValue="overview">
    <TabsList aria-label="Project views">
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="features">Features</TabsTrigger>
      <TabsTrigger value="team">Team</TabsTrigger>
      <TabsTrigger value="billing" disabled>Billing</TabsTrigger>
    </TabsList>

    <TabsContent value="overview">
      <div class="demo-panel">
        <h4>Project Dashboard</h4>
        <p>Real-time analytics and system status for your SvelteKit deployment.</p>
      </div>
    </TabsContent>

    <TabsContent value="features">
      <div class="demo-panel">
        <h4>Feature Flags</h4>
        <p>12 features active in production, 3 in staging evaluation.</p>
      </div>
    </TabsContent>

    <TabsContent value="team">
      <div class="demo-panel">
        <h4>Contributors</h4>
        <p>4 core engineers collaborating across the Sveltebois swarm.</p>
      </div>
    </TabsContent>

    <TabsContent value="billing">
      <div class="demo-panel">
        <h4>Subscription</h4>
        <p>Enterprise tier with unlimited parallel subagents.</p>
      </div>
    </TabsContent>
  </Tabs>

  <p class="demo-status">Active tab: <strong>{currentTab}</strong></p>
</div>

<style>
  .demo-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2.5rem;
    width: 100%;
    max-width: 32rem;
    margin: 0 auto;
  }
  .demo-panel {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem 0;
  }
  .demo-panel h4 {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
  }
  .demo-panel p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-fg-muted, #71717a);
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
			name: 'Standard Tab Set',
			description: 'Default uncontrolled tab list with 3 panels.',
			code: `<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">One</TabsTrigger>
    <TabsTrigger value="tab2">Two</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">First</TabsContent>
  <TabsContent value="tab2">Second</TabsContent>
</Tabs>`
		},
		{
			name: 'Controlled Active Tab',
			description: 'Two-way binding with Svelte 5 bind:value rune.',
			code: `<Tabs bind:value={activeTab}>
  <TabsList><TabsTrigger value="a">A</TabsTrigger></TabsList>
  <TabsContent value="a">Panel A</TabsContent>
</Tabs>`
		},
		{
			name: 'Disabled Tab',
			description: 'Triggers can be disabled individually to prevent activation.',
			code: `<TabsTrigger value="pro" disabled>Pro Only</TabsTrigger>`
		}
	],
	api: [
		{ name: 'value', type: 'string', description: 'Controlled active tab value. Supports two-way bind:value.' },
		{ name: 'defaultValue', type: 'string', default: "''", description: 'Initial active tab when uncontrolled.' },
		{ name: 'onValueChange', type: '(value: string) => void', description: 'Called when the active tab changes.' },
		{ name: 'children', type: 'Snippet', description: 'Tabs content comprising TabsList and TabsContent elements.' }
	],
	keyboard: [
		{ key: 'ArrowLeft / ArrowRight', action: 'Moves between tabs and activates them.' },
		{ key: 'Home / End', action: 'Jumps directly to the first or last tab.' },
		{ key: 'Tab', action: 'Moves focus from the tab list into the active panel.' }
	],
	accessibility: [
		'Bits UI provides role="tablist", role="tab", role="tabpanel", aria-selected, and aria-controls.',
		'The outgoing panel is made inert so it cannot take focus.',
		'Overflow scroll buttons are labelled "Scroll tabs left" and "Scroll tabs right"; give TabsList an aria-label.'
	],
	motion: 'Phase 1 still-state: selection pill renders statically at active tab; panels render content without direction slide. Phase 2 springs selection pill morph spring (motionTokens.spring.morph), height animation on tab switch, and left/right enter/exit transitions.',
	notes: 'Headless tabs accessibility and roving focus are powered by Bits UI Tabs. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Use for peer views of the same object. Use Segmented Control for a compact value toggle that is not tied to panels.',
		'Every TabsTrigger value needs a matching TabsContent. Long lists scroll horizontally on their own.'
	],
	related: [
		{ name: 'Segmented Control', slug: 'segmented-control', description: 'Switch between a small set of related views.' },
		{ name: 'Accordion', slug: 'accordion', description: 'Progressively reveal supporting information in place.' }
	],
	source: 'registry/components/tabs/tabs.tsx'
};

export default doc;
