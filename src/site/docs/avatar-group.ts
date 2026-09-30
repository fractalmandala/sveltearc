import type { DocMeta } from '../registry';

const doc: DocMeta = {
	title: 'Avatar group',
	description: 'Show a team or set of contributors in a small space, with an overflow count.',
	tagline: 'A stack that says who is here.',
	group: 'avatars',
	status: 'ported',
	whenToUse: [
		'Showing who owns or edits something in a header, card, or table cell.',
		'Collaborator stacks where people join and leave while the page is open.',
		'Long member lists that should collapse into a +N chip.'
	],
	whenNotToUse: [
		'For a single person — use Avatar.',
		'When every name and role must be visible — use a list or a data table.'
	],
	install: {
		cli: 'pnpm add sveltearc',
		manual: {
			dependencies: [],
			steps: [
				'Copy the avatar-group folder into src/lib/components/avatar-group/.',
				'It depends on src/lib/components/avatar/avatar.svelte — port that too.',
				'Import AvatarGroup from $lib/components/avatar-group.'
			]
		}
	},
	usage: `<script lang="ts">
  import { AvatarGroup } from '$lib/components/avatar-group';

  const team = [
    { name: 'Ada Lovelace', status: 'online' },
    { name: 'Grace Hopper' },
    { name: 'Alan Turing' }
  ];
</script>

<AvatarGroup members={team} max={3} label="Editors" />`,
	api: [
		{ name: 'members', type: 'AvatarGroupMember[]', description: 'The people to show, in order.' },
		{ name: 'max', type: 'number', default: '4', description: 'How many to show before the +N chip.' },
		{ name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Avatar diameter.' },
		{ name: 'label', type: 'string', default: "'Team members'", description: 'Accessible group label; also names the overflow chip.' }
	],
	accessibility: [
		'The stack is role="group" with the given label.',
		'The overflow chip is role="img" labelled "N more <label>".',
		'Hover names are decorative (aria-hidden); the accessible name comes from each Avatar.'
	],
	motion: 'Phase 1 still-state: the stack renders statically. Phase 2 wires the slot open/close spring and the overflow count roll. The hover fan, lift, and name tip are pure CSS and already work; reduced motion keeps the stack still while the ring and name still answer the pointer.',
	notes: 'Composed from Avatar. No Bits UI primitive; the overlap and hover fan are CSS custom properties.',
	notesForAi: [
		'`members` is ordered; `max` controls where the +N chip starts.',
		'It depends on the Avatar component.',
		'Do not restyle the overlap; it is driven by --index / --count in the CSS module.'
	],
	related: [
		{ name: 'Avatar', slug: 'avatar', description: 'A single person.' },
		{ name: 'Badge', slug: 'badge', description: 'A small label for status or metadata.' }
	],
	source: 'registry/components/avatar-group/avatar-group.tsx'
};

export default doc;
