import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Avatar',
	tagline: 'A compact identity marker for people and accounts.',
	description: 'A round portrait that falls back to initials and can show an online or offline presence dot.',
	group: 'avatars',
	status: 'ported',
	whenToUse: [
		'Showing one person next to their name, comment, or record.',
		'Presence in a header or list, via the online or offline status dot.',
		'Places where a photo may be missing and initials should stand in.'
	],
	whenNotToUse: [
		'Use Avatar Group for several people with an overflow count.',
		'Use User Menu when the avatar is the trigger for account actions.'
	],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/avatar',
		manual: {
			dependencies: ['@humanspeak/svelte-motion'],
			steps: [
				'Copy src/lib/components/avatar/ to your project components directory.',
				'Ensure the $lib path alias is configured in svelte.config.js / tsconfig.json.',
				'All styles live in avatar.module.css — no Tailwind configuration required.'
			]
		}
	},
	usage: `<script lang="ts">
  import Avatar from '$lib/components/avatar/avatar.svelte';
</script>

<Avatar name="Maya Chen" src="/people/maya.jpg" size="lg" status="online" />`,
	demoCode: `<script lang="ts">
  import Avatar from '$lib/components/avatar/avatar.svelte';
</script>

<div class="demo-row">
  <Avatar name="Ada Lovelace" size="sm" />
  <Avatar name="Grace Hopper" size="md" status="online" />
  <Avatar name="Alan Turing" size="lg" status="offline" />
  <Avatar name="Katherine Johnson" size="xl" />
</div>`,
	variants: [
		{
			name: 'Initials Fallback with Sizes',
			description: 'Scales from sm (28px) to xl (88px) displaying first two letters of name.',
			code: `<div class="demo-row">
  <Avatar name="Ada Lovelace" size="sm" />
  <Avatar name="Alan Turing" size="lg" />
</div>`
		},
		{
			name: 'Presence Status Dot',
			description: 'Appends online or offline indicator dot with accessible label update.',
			code: `<Avatar name="Grace Hopper" size="md" status="online" />`
		},
		{
			name: 'Image Source with Fallback',
			description: 'Loads external portrait image with automatic fallback to initials on error.',
			code: `<Avatar name="Katherine Johnson" src="/photo.jpg" size="xl" />`
		}
	],
	api: [
		{ name: 'name', type: 'string', description: 'Full name. Used for the accessible label and the first two initials.' },
		{ name: 'src', type: 'string', description: 'Image URL rendered with plain <img>. Falls back to initials if it fails to load.' },
		{ name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Diameter, from 28px to 88px.' },
		{ name: 'status', type: "'online' | 'offline'", description: 'Adds a presence dot and appends the status to the accessible label.' }
	],
	accessibility: [
		'The root is role="img" with an aria-label of the name plus status, such as "Maya Chen, online".',
		'The image and initials are decorative, so the name is read once by screen readers.',
		'The status dot is aria-hidden; the accessible label carries the presence state.'
	],
	motion: 'Phase 1 still-state: cached photo displays at once and presence dot renders statically. Phase 2 wires the status-dot spring pop and image soft blur fade. Reduced motion drops transitions and swaps states instantly.',
	notes: 'Ported as the cross-component dependency for Notification Center. next/image fill from React original becomes a standard <img> with object-fit: cover, eliminating Next.js runtime coupling.',
	notesForAi: [
		'Use for a single person. For a row of people with an overflow count use Avatar Group.',
		'The component is self-contained and needs no Next.js runtime.'
	],
	related: [
		{ name: 'Card', slug: 'card', description: 'A contained group of related content and actions.' },
		{ name: 'Notification Center', slug: 'notification-center', description: 'Uses Avatar for person-generated update items.' }
	],
	source: 'registry/components/avatar/avatar.tsx'
};

export default doc;
