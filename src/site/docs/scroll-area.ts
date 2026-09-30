import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Scroll area",
	tagline: "A native scroll container with thin overlay scrollbars and edge fades that appear only when content overflows.",
	description: "A native scroll container with thin overlay scrollbars and edge fades that appear only when content overflows.",
	group: 'expand',
	status: 'ported',
	whenToUse: ["Panels, sidebars, and popovers whose content can outgrow their box.","Horizontal strips of cards or chips that need mouse-wheel scrolling and snap points.","Places where platform scrollbars look heavy but native scrolling must be kept."],
	whenNotToUse: ["Use carousel when items should page one at a time with controls.","Do not wrap the whole page; let the document scroll natively.","Use data-grid for large tabular data; it virtualizes its own scroll."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/scroll-area',
		manual: {
			dependencies: ["bits-ui"],
			steps: [
				'Copy scroll-area files into src/lib/components/scroll-area/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import ScrollArea from $lib/components/scroll-area'
			]
		}
	},
	usage: `<script lang="ts">
  import { ScrollArea } from '$lib/components/scroll-area';
<\/script>

<ScrollArea />`,
	demoCode: `<script lang="ts">
  import { ScrollArea } from '$lib/components/scroll-area';
<\/script>

<div class="demo-scroll-area-container">
  <ScrollArea />
</div>`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: `<ScrollArea />`
		}
	],
	api: [
  {
    "name": "fade",
    "type": "number",
    "default": "'28'",
    "description": "Length of the edge fade in px. 0 turns the fades off."
  },
  {
    "name": "hideDelay",
    "type": "number",
    "default": "'900'",
    "description": "How long scrollbars linger after scrolling stops, in ms."
  },
  {
    "name": "maxHeight",
    "type": "CSSProperties[\"maxHeight\"]",
    "default": "–",
    "description": "Maximum viewport height, for vertical areas that grow with their content."
  },
  {
    "name": "snap",
    "type": "CSSProperties[\"scrollSnapType\"]",
    "default": "–",
    "description": "Passed to the viewport's scroll-snap-type, for example \\\"x mandatory\\\". Children set their own scroll-snap-align."
  },
  {
    "name": "label",
    "type": "string",
    "default": "–",
    "description": "Accessible name. The viewport becomes a labelled region."
  },
  {
    "name": "wheelToHorizontal",
    "type": "boolean",
    "default": "'true'",
    "description": "Turns vertical wheel movement into horizontal scrolling for horizontal areas."
  },
  {
    "name": "viewportClassName",
    "type": "string",
    "default": "–",
    "description": "Extra class on the scrolling viewport."
  },
  {
    "name": "viewportStyle",
    "type": "CSSProperties",
    "default": "–",
    "description": "Inline style on the viewport."
  },
  {
    "name": "viewportRef",
    "type": "Ref<HTMLDivElement>",
    "default": "–",
    "description": "The scrolling element, for programmatic scrolling."
  },
  {
    "name": "onScroll",
    "type": "(event: UIEvent<HTMLDivElement>) => void",
    "default": "–",
    "description": "Viewport scroll handler."
  },
  {
    "name": "onEdgeChange",
    "type": "(edges: ScrollAreaEdges) => void",
    "default": "–",
    "description": "Called when content starts or stops extending past an edge: { top, bottom, left, right }."
  },
  {
    "name": "...props",
    "type": "HTMLAttributes<HTMLDivElement>",
    "default": "–",
    "description": "Forwarded to the root, including ref and className."
  }
],
	keyboard: [
  {
    "key": "Tab",
    "action": "The viewport is focusable (tabIndex 0)."
  },
  {
    "key": "Arrow keys / Page Up / Page Down / Home / End / Space",
    "action": "Scroll natively once the viewport has focus."
  }
],
	accessibility: ["Scrolling stays native, so keyboard, screen reader, and touch behavior match the platform.","With label, the viewport is a named region; without one, give it context another way.","The overlay tracks and thumbs are aria-hidden; the hidden native scrollbar remains the real control."],
	motion: "- Scrollbars fade in while scrolling or on hover and fade out after hideDelay; the thumb thickens under the pointer. - Pressing the track pages 90% of the viewport toward the pointer with smooth scrolling, or instantly under reduced motion. - Reduced motion removes scrollbar transitions.",
	notes: "Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["Use it wherever content scrolls inside a fixed box: sidebars, panels, menus, horizontal card strips.","Give vertical areas a height or maxHeight; the viewport scrolls only when it has a constrained size.","Use onEdgeChange to show a \"more below\" affordance or to load more when bottom becomes false."],
	related: [{"name":"Resizable panels","slug":"markdown","description":"Trade space between panes by dragging the divider between them."},{"name":"Carousel","slug":"markdown","description":"Browse a row of slides by dragging, flicking, or arrowing through them."},{"name":"Data grid","slug":"markdown","description":"A spreadsheet grid with range selection, inline editing, a fill handle, and animated sorting."},{"name":"Tree view","slug":"markdown","description":"Navigate nested folders and structured content."}],
	source: 'registry/components/scroll-area/scroll-area.tsx'
};

export default doc;
