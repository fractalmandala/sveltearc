import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: 'Swipe actions',
	tagline: 'Reveal row actions with a swipe, or from the same actions in a menu.',
	description:
		'A list whose rows reveal actions on a horizontal swipe, the way a mobile mail client does. Every row also includes an accessible More Actions menu powered by Bits UI DropdownMenu.',
	group: 'gestures',
	status: 'ported',
	whenToUse: [
		'Touch-first triage lists such as mail, notifications, or tasks.',
		'Rows with one or two quick actions per side, like Archive and Mark unread.',
		'Lists where swipe gestures streamline high-volume item processing.'
	],
	whenNotToUse: [
		'Use context-menu or dropdown-menu for desktop-first data tables.',
		'Use reorderable-list when rows need to be dragged vertically.',
		'Use hold-to-confirm for a single destructive action outside a list.'
	],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/swipe-actions',
		manual: {
			dependencies: ['bits-ui', '@lucide/svelte'],
			steps: [
				'Copy swipe-actions files into src/lib/components/swipe-actions/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import SwipeActions and SwipeActionsRow from $lib/components/swipe-actions'
			]
		}
	},
	usage: `<script lang="ts">
  import { SwipeActions, SwipeActionsRow } from '$lib/components/swipe-actions';
  import { Archive, MailOpen } from '@lucide/svelte';

  let messages = $state([
    { id: '1', sender: 'GitHub', subject: 'New release v2.4.0 published', time: '10:42 AM' }
  ]);

  function archive(id: string) {
    messages = messages.filter(m => m.id !== id);
  }
<\/script>

<SwipeActions label="Inbox">
  {#each messages as message (message.id)}
    <SwipeActionsRow
      label={message.subject}
      leading={[
        { label: 'Unread', icon: unreadIcon, tone: 'accent', keepRow: true, onSelect: () => {} }
      ]}
      trailing={[
        { label: 'Archive', icon: archiveIcon, tone: 'danger', onSelect: () => archive(message.id) }
      ]}
    >
      <div class="message-preview">
        <strong>{message.sender}</strong>
        <span>{message.subject}</span>
      </div>
    </SwipeActionsRow>
  {/each}
</SwipeActions>`,
	demoCode: `<script lang="ts">
  import { SwipeActions, SwipeActionsRow } from '$lib/components/swipe-actions';
  import { Archive, MailOpen, Trash2, CheckCircle2 } from '@lucide/svelte';

  let items = $state([
    { id: '1', title: 'Review pull request #142', subtitle: 'Design tokens & CSS modules', type: 'task' },
    { id: '2', title: 'Design system alignment meeting', subtitle: 'Calendar invite for 3:00 PM', type: 'mail' },
    { id: '3', title: 'Update production certificates', subtitle: 'Expires in 7 days', type: 'alert' }
  ]);

  function removeItem(id: string) {
    items = items.filter(i => i.id !== id);
  }
<\/script>

{#snippet archiveIcon()}
  <Archive size={18} strokeWidth={1.8} />
{\/snippet}

{#snippet unreadIcon()}
  <MailOpen size={18} strokeWidth={1.8} />
{\/snippet}

{#snippet checkIcon()}
  <CheckCircle2 size={18} strokeWidth={1.8} />
{\/snippet}

<div class="demo-swipe-container">
  <SwipeActions label="Active Triage List">
    {#each items as item (item.id)}
      <SwipeActionsRow
        label={item.title}
        leading={[
          { label: 'Done', icon: checkIcon, tone: 'accent', onSelect: () => removeItem(item.id) }
        ]}
        trailing={[
          { label: 'Archive', icon: archiveIcon, tone: 'danger', onSelect: () => removeItem(item.id) }
        ]}
      >
        <div class="demo-row-body">
          <div class="demo-row-text">
            <span class="demo-row-title">{item.title}</span>
            <span class="demo-row-sub">{item.subtitle}</span>
          </div>
          <span class="demo-swipe-hint">Swipe ↔</span>
        </div>
      </SwipeActionsRow>
    {/each}
  </SwipeActions>
</div>`,
	variants: [
		{
			name: 'Dual Actions (Done & Archive)',
			description: 'Left swipe reveals Done (accent), right swipe reveals Archive (danger).',
			code: `<SwipeActionsRow
  label="Deploy update"
  leading={[{ label: 'Done', tone: 'accent', onSelect: complete }]}
  trailing={[{ label: 'Archive', tone: 'danger', onSelect: archive }]}
>
  <RowItem />
</SwipeActionsRow>`
		},
		{
			name: 'Keep Row After Action',
			description: 'Set keepRow: true for actions that toggle state without removing the row (such as Mark as Read).',
			code: `<SwipeActionsRow
  label="Message"
  leading={[{ label: 'Unread', tone: 'accent', keepRow: true, onSelect: toggleUnread }]}
>
  <MessageItem />
</SwipeActionsRow>`
		}
	],
	api: [
		{
			name: 'label',
			type: 'string',
			default: '–',
			description: 'Accessible name for the list, applied via aria-label on the root ul element.'
		},
		{
			name: 'children',
			type: 'Snippet',
			default: '–',
			description: 'SwipeActionsRow elements composing the list.'
		},
		{
			name: 'leading',
			type: 'SwipeAction[]',
			default: '[]',
			description: 'Actions placed under the left edge, revealed by swiping right.'
		},
		{
			name: 'trailing',
			type: 'SwipeAction[]',
			default: '[]',
			description: 'Actions placed under the right edge, revealed by swiping left.'
		},
		{
			name: 'fullSwipe',
			type: 'boolean',
			default: 'true',
			description: 'Allows an extended swipe or flick to trigger the outermost action directly.'
		},
		{
			name: 'class',
			type: 'string',
			default: '–',
			description: 'Additional CSS class applied to the list container or row.'
		}
	],
	keyboard: [
		{
			key: 'Enter / Space',
			action: 'Opens the row More Actions menu from its trigger button.'
		},
		{
			key: 'ArrowDown / ArrowUp',
			action: 'Navigates between actions in the dropdown menu.'
		},
		{
			key: 'Escape',
			action: 'Closes the dropdown menu or resets any open swipe offset.'
		}
	],
	accessibility: [
		'Semantic markup: list container is a ul with role="list" and aria-label; each row is an li.',
		'Every row includes an accessible "More actions for <label>" menu containing all actions.',
		'Revealed gesture buttons are aria-hidden and tab-index="-1", ensuring screen readers and keyboard users use the accessible dropdown.',
		'Focus is managed appropriately on item removal.'
	],
	motion:
		'Phase 1 still-state: Row reveals leading/trailing action layers on horizontal pointer drag with 76px action snap points; dropdown menu features standard enter/exit animations. Phase 2 wires gesture velocity projection, rubber-band resistance beyond last stop, animated full-swipe stretch, and height collapse on row deletion.',
	notes:
		'Built with Bits UI DropdownMenu for full keyboard and screen reader accessibility. ARC .module.css supplies all visual styling verbatim.',
	notesForAi: [
		'Use for touch-first triage lists on mobile/touch interfaces.',
		'Every row requires a descriptive label for the accessible More Actions button.',
		'Handle state removal in onSelect; set keepRow: true if the item stays in the list.'
	],
	related: [
		{
			name: 'Dropdown Menu',
			slug: 'dropdown-menu',
			description: 'A focused list of actions anchored to a trigger button.'
		},
		{
			name: 'Context Menu',
			slug: 'context-menu',
			description: 'Secondary actions anchored to the cursor location.'
		},
		{
			name: 'Card',
			slug: 'card',
			description: 'A structured surface with quick actions and detail transitions.'
		}
	],
	source: 'registry/components/swipe-actions/swipe-actions.tsx'
};

export default doc;
