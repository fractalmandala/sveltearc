import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Button",
	tagline: "A clear, responsive action with quiet secondary states.",
	description: "A clear, responsive action with quiet secondary states.",
	group: 'buttons',
	status: 'ported',
	whenToUse: ["Any single action on a page, form, or dialog, such as Save, Continue, or Cancel.","Actions whose label changes in place, like Save to Saved, where the width should spring instead of jump.","Short async work where a spinner on the button is enough feedback, via loading."],
	whenNotToUse: ["Use action-button when the button itself should show pending and success states after an async commit.","Use split-button when one default action has two to five close variants.","Use hold-to-confirm for destructive actions that need more than a single click."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/button',
		manual: {
			dependencies: [],
			steps: [
				'Copy src/lib/components/button/ into your project — button.module.css carries all styles, no Tailwind required.',
				'Ensure foundation.css (design tokens) and motion-tokens.ts (Phase 2 motion carrier) are present in src/lib.',
				"Import { Button } from '$lib/components/button' — no other dependencies."
			]
		}
	},
	usage: `<script lang="ts">
  import { Button } from '$lib/components/button';

  let saving = $state(false);

  async function save() {
    saving = true;
    await submit(); // your async work
    saving = false;
  }
<\/script>

<Button variant="primary" loading={saving} onclick={save}>
  Save changes
</Button>`,
	demoCode: `<script lang="ts">
  import { Button } from '$lib/components/button';

  let loading = $state(false);

  function handleClick() {
    loading = true;
    setTimeout(() => {
      loading = false;
    }, 1500);
  }
<\/script>

<div class="demo-button-row">
  <Button variant="primary" {loading} onclick={handleClick}>
    {loading ? 'Saving...' : 'Save Changes'}
  </Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="danger">Destructive</Button>
</div>

<style>
  .demo-button-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    justify-content: center;
    padding: 2.5rem 1rem;
    width: 100%;
  }
</style>`,
	variants: [
		{
			name: 'Visual weights',
			description: 'One primary action per surface, with secondary, ghost, and danger as the quiet alternatives.',
			code: `<Button variant="primary">Save changes</Button>
<Button variant="secondary">Preview</Button>
<Button variant="ghost">Cancel</Button>
<Button variant="danger">Delete</Button>`
		},
		{
			name: 'Label that morphs after saving',
			description: 'Pass changing children to get the width morph for free — the width springs to fit the new label.',
			code: `<Button variant="secondary" loading={saving} onclick={save}>
  {saved ? 'Saved' : 'Save draft'}
</Button>`
		},
		{
			name: 'Loading state',
			description: 'loading shows a spinner, sets aria-busy, and swallows clicks while keeping keyboard focus.',
			code: `<Button variant="primary" loading={true}>Saving changes…</Button>`
		}
	],
	api: [
		{
			name: 'variant',
			type: '"primary" | "secondary" | "ghost" | "danger"',
			default: "'primary'",
			description: 'Visual weight. Use one primary action per surface.'
		},
		{
			name: 'size',
			type: '"sm" | "md" | "lg"',
			default: "'md'",
			description: 'Height and padding.'
		},
		{
			name: 'loading',
			type: 'boolean',
			default: 'false',
			description: 'Shows a spinner, sets aria-busy, and swallows clicks while keeping focus.'
		},
		{
			name: '...props',
			type: 'HTMLButtonAttributes',
			default: '–',
			description: 'Forwarded to the underlying native button (disabled, type, onclick, aria-*). ref binds the element.'
		}
	],
	keyboard: [
		{ key: 'Enter / Space', action: 'Activates the button.' }
	],
	accessibility: ["Renders a native button, so role and focus come for free.","Loading uses aria-busy and aria-disabled instead of disabled, so keyboard focus is not lost mid-action.","Icon-only buttons need an aria-label."],
	motion: "- Presses scale to about 0.97 on a snappy spring; icon-sized buttons press slightly deeper. - A new label crossfades with a short blur while the width springs to fit. - Reduced motion drops the press scale and swaps labels with a plain fade.",
	notes: "Svelte 5 runes only — the native button keeps role and focus for free, with no runtime dependencies. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["Default choice for any single action. Use action-button for dense icon toolbars and split-button when one action has close alternatives.","Pass a changing label (Save → Saved) as children to get the width morph for free.","Wrap in a popup trigger (e.g. a bits-ui Trigger child snippet); the press scale turns off automatically for popup anchors."],
	related: [{"name":"Action button","slug":"action-button","description":"A compact button for frequent toolbar actions."},{"name":"Split button","slug":"split-button","description":"A primary action with a menu of nearby alternatives."},{"name":"Copy button","slug":"copy-button","description":"Copy a value with immediate confirmation."},{"name":"Hold to confirm","slug":"hold-to-confirm","description":"Confirm a destructive action by holding, not tapping."}],
	source: 'registry/components/button/button.tsx'
};

export default doc;
