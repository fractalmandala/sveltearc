import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Skeleton",
	tagline: "Reserve space while content is still loading.",
	description: "Reserve space while content is still loading.",
	group: 'progress',
	status: 'ported',
	whenToUse: ["Loading states for content whose shape is known, like a profile or comment.","Swapping a placeholder into real content with a crossfade and height spring."],
	whenNotToUse: ["Use progress when you can report a percentage.","Use empty-state when loading finished and there is nothing to show.","Use text-shimmer for an AI thinking or status line."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/skeleton',
		manual: {
			dependencies: [],
			steps: [
				'Copy skeleton files into src/lib/components/skeleton/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import Skeleton from $lib/components/skeleton'
			]
		}
	},
	usage: `<script lang="ts">
  import { Skeleton } from '$lib/components/skeleton';
<\/script>

<Skeleton avatar lines={2} loading={!user}>
      {user && <ProfileCard user={user} />}
    </Skeleton>`,
	demoCode: `<script lang="ts">
  import { Skeleton } from '$lib/components/skeleton';

  let loading = $state(true);
<\/script>

<Skeleton avatar lines={3} {loading}>
  <Profile />
</Skeleton>
<Skeleton lines={4} />
<Skeleton lines={9} label="Loading a long list" />`,
	variants: [
		{
			name: 'With content',
			description: 'Placeholder crossfades into children while loading is true. Phase 1 swaps to the settled layer.',
			code: `<Skeleton avatar lines={3} loading={loading}>
  <Profile />
</Skeleton>`
		},
		{
			name: 'Standalone',
			description: 'No children. lines is clamped to 1–6, so lines={9} renders six bars.',
			code: `<Skeleton lines={4} />`
		}
	],
	api: [
  {
    "name": "label",
    "type": "string",
    "default": "\"Loading content\"",
    "description": "aria-label of the loading status."
  },
  {
    "name": "lines",
    "type": "number",
    "default": "3",
    "description": "Number of text lines, clamped to 1-6."
  },
  {
    "name": "avatar",
    "type": "boolean",
    "default": "false",
    "description": "Adds a round avatar placeholder."
  },
  {
    "name": "children",
    "type": "Snippet",
    "default": "–",
    "description": "Content to reveal once loading finishes. With children the placeholder crossfades into them."
  },
  {
    "name": "loading",
    "type": "boolean",
    "default": "true",
    "description": "Keeps the placeholder visible while true. Only used with children."
  },
  {
    "name": "className",
    "type": "string",
    "default": "–",
    "description": "Class on the outer element."
  }
],
	keyboard: [
		{ key: 'None', action: 'The placeholder is not in the tab order. Its shapes are aria-hidden.' }
	],
	accessibility: ["The placeholder is role=\"status\" with aria-busy and an aria-label; its shapes are aria-hidden.","With children, the wrapper sets aria-busy while loading."],
	motion: "Phase 1: the CSS pulse runs (1.8s, 90ms stagger on --index, 11 iterations) and a loading toggle shows the settled layer immediately. Phase 2: the placeholder fades out, content rises 4px, and the height springs from placeholder to content. Reduced motion stops the pulse and skips the height animation.",
	notes: "No Bits UI primitive. Pulse timing lives in the verbatim CSS module. Children mode is a HeightFrame that Phase 1 renders at height auto.",
	notesForAi: ["Use while fetching content whose shape is known. Use progress when you can report a percentage, and empty-state when there is nothing to show.","Wrap the real content as children and drive loading to get the crossfade; without children it renders only the placeholder."],
	related: [{"name":"Progress","slug":"progress","description":"Show how much of a known task is complete."},{"name":"Empty state","slug":"empty-state","description":"A useful next step when there is nothing to show yet."},{"name":"Card","slug":"card","description":"A contained group of related content and actions."}],
	source: 'registry/components/skeleton/skeleton.tsx'
};

export default doc;
