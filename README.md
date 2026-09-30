# svelteArc

A Svelte 5 + SvelteKit component library ported from [Arc](https://uiarc.dev) — headless
[Bits UI](https://bits-ui.com) primitives, verbatim CSS modules on a small token set, and a shared
motion language. **No Tailwind.**

Every component ships as typed Svelte 5 source with its own `.module.css`, a full props contract,
and a doc page with a live demo. The doc is the proof.

## Install

```sh
pnpm add sveltearc
```

`sveltearc` declares its Svelte-adjacent libraries as **peer dependencies** — install them once so
there is a single copy of each (a second `bits-ui` would bring a second Svelte runtime):

```sh
pnpm add svelte bits-ui @humanspeak/svelte-motion @lucide/svelte
```

## Usage

Import the foundation tokens once, at the root of your app:

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import 'sveltearc/foundation.css';
</script>

{@render children()}
```

Then use components anywhere:

```svelte
<script lang="ts">
	import { Button, Switch } from 'sveltearc';

	let on = $state(false);
</script>

<Button>Save changes</Button>
<Switch bind:checked={on} label="Notifications" />
```

## Components

35 components, grouped by job. All are exported from the package root.

| Group | Components |
| --- | --- |
| **Buttons** | `Button`, `SplitButton`, `CopyButton`, `ThemeSwitch` |
| **Gestures** | `SwipeActions`, `SwipeActionsRow` |
| **Menus** | `DropdownMenu` |
| **Text fields** | `Input`, `Textarea`, `PasswordField`, `SearchField` |
| **Selects** | `Select` |
| **Toggles** | `Checkbox`, `RadioGroup`, `Switch`, `SegmentedControl` |
| **Sliders** | `Slider` |
| **Navigation** | `Tabs` (`TabsList`, `TabsTrigger`, `TabsContent`), `Breadcrumb` |
| **Expand** | `ScrollArea`, `Accordion` |
| **Overlays** | `Dialog` (`DialogTrigger`, `DialogContent`, `DialogClose`), `Drawer`, `BottomSheet`, `Popover` (`PopoverTrigger`, `PopoverContent`, `PopoverClose`), `HoverCard`, `Tooltip` |
| **Messages** | `Alert`, `NotificationCenter` |
| **Progress** | `Progress`, `Skeleton` |
| **Avatars** | `Avatar`, `Badge` |
| **Cards** | `Card`, `EmptyState` |
| **Text effects** | `TextReveal` |

## Theming

Components read semantic tokens, never raw colors. Change a token and every component follows, in
both themes.

| Token | Used for |
| --- | --- |
| `--background` | The page behind everything |
| `--surface`, `--surface-raised`, `--surface-muted` | Cards and inputs, floating layers, quiet fills |
| `--foreground`, `--text-secondary`, `--text-muted` | Primary, supporting and hint text |
| `--border`, `--border-subtle`, `--border-strong` | Separators and edges |
| `--accent`, `--accent-strong`, `--accent-subtle` | Selection, progress and helpful context |
| `--success`, `--warning`, `--danger` | Status, always paired with a label |
| `--radius-control`, `--radius-panel`, `--radius-surface` | Controls, menus, cards |

- **Dark mode:** set `data-theme="dark"` on `<html>`. Dark values are tuned separately, not inverted.
- **Accent:** set `data-accent` on `<html>` to `neutral`, `violet`, `blue`, `green`, `amber`,
  `orange`, `coral` or `rose`.

## Motion

Motion presets live in `sveltearc/motion-tokens` and use
[`@humanspeak/svelte-motion`](https://github.com/humanspeak/svelte-motion).

- **Phase 1 (current for most components):** DOM parity with the React original and static
  end-states — correct layout, `data-state`, and accessibility, without animation.
- **Phase 2 (in progress):** still-states are swapped for springs. `Switch` and `Dialog` are wired;
  the rest are landing in batches.
- Every animation has a `prefers-reduced-motion: reduce` path.

## Docs

Live docs, demos and full API references: **https://sveltearc.fractalsvelte.dev**

Every component page also has a Markdown version at `/components/<name>/markdown`, and the whole
set is indexed at `/llms.txt`.

## Development

```sh
pnpm install
pnpm dev            # docs site + component gallery
pnpm check          # svelte-check
pnpm check:port     # per-component port contract
pnpm lint:agent     # design-system lint
pnpm package        # build the publishable package (svelte-package → dist/)
```

The library source lives in `src/lib/`; the docs site is `src/site/` + `src/routes/` (site-only,
never published).

## License

MIT
