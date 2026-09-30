import type { DocMeta } from '../registry';

export const doc: DocMeta = {
	title: "Password field",
	tagline: "Capture sensitive text with a visible reveal control.",
	description: "Capture sensitive text with a visible reveal control.",
	group: 'text-fields',
	status: 'ported',
	whenToUse: ["Sign in forms and password confirmation fields.","Any secret the person may want to check by revealing it."],
	whenNotToUse: ["Use password-strength when creating or changing a password.","Use input for non-secret values."],
	install: {
		cli: 'pnpm dlx shadcn-svelte@latest add @arcui/password-field',
		manual: {
			dependencies: ["bits-ui"],
			steps: [
				'Copy password-field files into src/lib/components/password-field/',
				'Ensure motion-tokens.ts and foundation.css exist in your project root',
				'Import PasswordField from $lib/components/password-field'
			]
		}
	},
	usage: `<script lang="ts">
  import { PasswordField } from '$lib/components/password-field';

  let password = $state('');
<\/script>

<PasswordField
  label="Password"
  name="password"
  autocomplete="current-password"
  description="Must be at least 8 characters"
  bind:value={password}
  required
/>`,
	demoCode: `<script lang="ts">
  import { PasswordField } from '$lib/components/password-field';

  let password = $state('');
<\/script>

<div class="demo-password-field-container">
  <PasswordField
    label="Password"
    name="password"
    autocomplete="current-password"
    description="Must be at least 8 characters"
    bind:value={password}
    required
  />
</div>`,
	variants: [
		{
			name: 'Default',
			description: 'Standard appearance and configuration.',
			code: `<PasswordField
      label="Password"
      name="password"
      autoComplete="current-password"
      required
    />`
		}
	],
	api: [
  {
    "name": "label",
    "type": "string",
    "default": "–",
    "description": "(Required) Visible label tied to the input."
  },
  {
    "name": "description",
    "type": "string",
    "default": "–",
    "description": "Helper copy under the field, linked through aria-describedby."
  },
  {
    "name": "...props",
    "type": "Omit<InputHTMLAttributes<HTMLInputElement>, \"type\">",
    "default": "–",
    "description": "Forwarded to the input, including ref, value, onChange, name, and autoComplete."
  }
],
	keyboard: [
  {
    "key": "Enter / Space",
    "action": "On the toggle button, shows or hides the password."
  }
],
	accessibility: ["Toggle is a native button with aria-pressed and a label that switches between \"Show password\" and \"Hide password\".","Description is linked through aria-describedby.","Set autoComplete to current-password or new-password so password managers work."],
	motion: "- A slash draws across the eye and masks the outline beneath it instead of swapping icons. - After the first toggle, the value resolves through a short CSS reveal on each change; reduced motion draws the slash instantly.",
	notes: "Headless mechanics powered by Bits UI / Svelte runes. ARC .module.css supplies all visual styling verbatim.",
	notesForAi: ["Use for sign in and password confirmation. Use password-strength when the user is creating a new password.","Uncontrolled by default; pass value and onChange to control it like a native input."],
	related: [{"name":"Input","slug":"input","description":"A single line field with clear labels and useful states."}],
	source: 'registry/components/password-field/password-field.tsx'
};

export default doc;
