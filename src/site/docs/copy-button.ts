import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Copy button",
	tagline: "Copy a value with immediate confirmation.",
	description: "Copy a value with immediate confirmation.",
	group: 'buttons',
	status: 'ported',
	whenToUse: ["Next to API keys, install commands, links, or code snippets.","Icon-only copy controls in dense rows, with an accessible label.","Any copy action that should confirm Copied or Could not copy in place."],
	whenNotToUse: ["Use split-button when copying has alternatives, such as Copy link and Copy as Markdown.","Use code-block for full code samples, which include their own copy control."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/copy-button',
		manual: {
			dependencies: ["bits-ui","@lucide/svelte"],
			steps: [
				'Copy copy-button files into src/lib/components/copy-button/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import CopyButton from $lib/components/copy-button'
			]
		}
	},
	usage: `<script lang="ts">
  import { CopyButton } from '$lib/components/copy-button';
<\/script>

<CopyButton value={apiKey} label="Copy key" iconOnly />`,
	demoCode: `<script lang="ts">
  import { CopyButton } from '$lib/components/copy-button';
<\/script>

<div class="demo-copy-button-container">
  <CopyButton value={apiKey} label="Copy key" iconOnly />
</div>`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: `<CopyButton value={apiKey} label="Copy key" iconOnly />`
		}
	],
	api: [
  {
    "name": "value",
    "type": "string",
    "default": "–",
    "description": "(Required) The text to copy."
  },
  {
    "name": "label",
    "type": "string",
    "default": "'\"Copy\"'",
    "description": "Idle label and accessible name."
  },
  {
    "name": "iconOnly",
    "type": "boolean",
    "default": "'false'",
    "description": "Hides the text and shows only the icon."
  },
  {
    "name": "disabled",
    "type": "boolean",
    "default": "–",
    "description": "Disables the button."
  },
  {
    "name": "onCopied",
    "type": "() => void",
    "default": "–",
    "description": "Called after a successful copy."
  },
  {
    "name": "className",
    "type": "string",
    "default": "–",
    "description": "Extra class on the button."
  }
],
	keyboard: [
  {
    "key": "Enter / Space",
    "action": "Copies the value."
  }
],
	accessibility: ["Native button named by label, including when iconOnly.","A polite role=\"status\" region announces \"<label>: Copied\" or \"<label>: Could not copy\".","The label cell reserves the widest of its three states, so the layout never shifts."],
	motion: "- Icons trade places through a blur on a slow, nearly critically damped spring, and the check draws its stroke in. - Only the changed letters of the label move; the same motion plays in reverse on reset. - Reduced motion swaps icon and text with an instant fade and skips the stroke draw.",
	notes: "Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["Use next to any copyable value: API keys, install commands, links, code. For a copy action that also has alternatives use split-button.","Named export only; there is no default export.","Clipboard state and reset timing come from lib/use-copy-feedback, so copy that file along with the component."],
	related: [{"name":"Button","slug":"button","description":"A clear, responsive action with quiet secondary states."},{"name":"Code block","slug":"code-block","description":"Present code with legible hierarchy and copy access."},{"name":"Split button","slug":"split-button","description":"A primary action with a menu of nearby alternatives."},{"name":"Action button","slug":"action-button","description":"A compact button for frequent toolbar actions."}],
	source: 'registry/components/copy-button/copy-button.tsx'
};

export default doc;
