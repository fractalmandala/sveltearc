import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Breadcrumb",
	tagline: "Show where a page sits in a hierarchy.",
	description: "Show where a page sits in a hierarchy.",
	group: 'navigation',
	status: 'ported',
	whenToUse: ["Showing where a page sits in a hierarchy, such as Workspace, Settings, Billing.","Client-side paths like a file browser, where crumbs call onClick instead of navigating.","Paths that grow as people drill in, where new crumbs should slide in."],
	whenNotToUse: ["Use tree-view when people need to browse the whole hierarchy.","Use tabs for switching between sibling views.","Use pagination for moving through pages of a list."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/breadcrumb',
		manual: {
			dependencies: ["bits-ui","@lucide/svelte"],
			steps: [
				'Copy breadcrumb files into src/lib/components/breadcrumb/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import Breadcrumb from $lib/components/breadcrumb'
			]
		}
	},
	usage: `<script lang="ts">
  import { Breadcrumb } from '$lib/components/breadcrumb';
<\/script>

<Breadcrumb
      items={[
        { label: "Workspace", href: "/" },
        { label: "Settings", href: "/settings" },
        { label: "Billing" },
      ]}
    />`,
	demoCode: `<script lang="ts">
  import { Breadcrumb } from '$lib/components/breadcrumb';
<\/script>

<div class="demo-breadcrumb-container">
  <Breadcrumb
      items={[
        { label: "Workspace", href: "/" },
        { label: "Settings", href: "/settings" },
        { label: "Billing" },
      ]}
    />
</div>`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: `<Breadcrumb
      items={[
        { label: "Workspace", href: "/" },
        { label: "Settings", href: "/settings" },
        { label: "Billing" },
      ]}
    />`
		}
	],
	api: [
  {
    "name": "items",
    "type": "{ label: string; href?: string; onClick?: (event: MouseEvent<HTMLElement>) => void }[]",
    "default": "–",
    "description": "(Required) Path from root to current page. Items with href render next/link; items with only onClick render buttons."
  },
  {
    "name": "ariaLabel",
    "type": "string",
    "default": "'\"Breadcrumb\"'",
    "description": "Label for the nav landmark."
  }
],
	keyboard: [
  {
    "key": "Tab",
    "action": "Moves between crumb links and buttons."
  },
  {
    "key": "Enter",
    "action": "Follows the focused crumb."
  }
],
	accessibility: ["Renders a nav landmark with an ordered list.","The last item is a span with aria-current=\"page\" and is never a link.","Chevron separators are aria-hidden."],
	motion: "- Crumbs present on first render stay still; new crumbs slide in 8px from the left out of a blur while siblings shift on a smooth spring. - Reduced motion adds and removes crumbs without movement.",
	notes: "Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["Use for hierarchical page location. For client-side paths such as a file browser, pass onClick without href.","Keep labels short; the component does not truncate or collapse long paths."],
	related: [{"name":"Tree view","slug":"tree-view","description":"Navigate nested folders and structured content."},{"name":"Pagination","slug":"pagination","description":"Move through a long collection with clear bounds."},{"name":"Tabs","slug":"tabs","description":"Switch between related content in the same context."}],
	source: 'registry/components/breadcrumb/breadcrumb.tsx'
};

export default doc;
