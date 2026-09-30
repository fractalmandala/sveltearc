# Replication Steps — standing this up on a new project

The order matters: each step makes the next one *enforceable*. Do them in sequence, and run the verifier after every step so a mistake fails loudly instead of accumulating.

Two viable modes:
- **Wrap mode** (`uiautomation`): you have a headless library (bits-ui, Melt, Radix) and want it styled on-system. Start at Step 1.
- **Own mode** (`affedo`): you author your own primitives. Skip the extractor; write anatomy files by hand (or from your own generator) and start at Step 2. You still get everything from Step 3 on.

Prereqs: Node 18+, pnpm, `svelte` (v5) + `sass` in the workspace. If wrapping bits-ui, make it **one physical copy** (a pnpm workspace) or two Svelte runtimes will fail confusingly, and set `optimizeDeps.exclude: ['bits-ui']` in Vite (it ships uncompiled `.svelte`).

---

## Step 0 — Author the closed vocabulary and axes first

Before any component. These are the constitution.

- `vocabulary.json` — allowed CSS properties, allowed keyword literals, and the ordered `stateSelectors` array (**the cascade contract**). Copy [`engine/uiautomation/pipeline/vocabulary.json`](./engine/uiautomation/pipeline/vocabulary.json) and prune to what you'll actually emit.
- `axes.json` — your variance axes (start with `size`, `tone`). Copy [`engine/uiautomation/pipeline/axes.json`](./engine/uiautomation/pipeline/axes.json).

Rule: an axis owns only its scale + data attribute. The *declarations* that respond to an axis value live in the role's `when` block, never in the compiler.

## Step 1 — Extract anatomy deterministically (wrap mode)

Point the extractor at one installed namespace; it writes `anatomy/<name>.json`. Reuse `engine/uiautomation/pipeline/scripts/extract-anatomy.mjs` — it already handles the three readers and the seven real-library traps (see PLAYBOOK §5). Don't reinvent a template-only reader; it returns confident, empty answers.

```bash
node scripts/extract-anatomy.mjs node_modules/bits-ui/dist/bits/accordion --component Accordion
node scripts/extract-all.mjs            # every namespace at once; failures isolate per-namespace
```

Anatomy is **machine-authored, never hand-edited.** Conform hand-written anatomy (own mode) to [`engine/uiautomation/pipeline/schemas/anatomy.schema.json`](./engine/uiautomation/pipeline/schemas/anatomy.schema.json).

## Step 2 — Write the role taxonomy once

`roles.json` is the design system's aesthetics, written one time. Use the full-declaration shape ([`engine/uiautomation/pipeline/roles.json`](./engine/uiautomation/pipeline/roles.json)): each role = `tokens` (base declarations) + `states` (selector→declarations) + `when` (axis-value→declarations) + `behavior` (lint-only flags). Discipline:

- **One visual channel per state** (hover→bg, active→shadow, focus→outline, disabled→opacity/cursor, data-state→colour). Two states writing the same property at equal specificity is a cascade tie.
- **Interactive roles must declare `:focus-visible`** (the taxonomy gate enforces it).
- **State overlays compose** (`control.expanded`, `control.selected`) — list them *after* the base control role in a recipe; source order is the composition order.

## Step 3 — Write the token adapter (one per theme)

`tokens/<adapter>.json` is the **only** file with raw values (hex/px/rem/ms). Roles name tokens bare (`bg-raised`); the adapter maps `--bg-raised → #121212`. For multi-theme, give each token `{ "light": ..., "dark": ... }` (affedo's schema) or ship a whole separate adapter (`neobrutalist.json`). A token no role reaches is a lint finding — carry only what the taxonomy uses, plus a `$chromeOnly` allowlist for playground-only values.

## Step 4 — Write a recipe per component (the only agentic step)

`recipes/<name>.json` assigns a role (or composed roles) to each anatomy part, names the import source, and lists exposed axes. This is small — ~15 lines — and is **multiple-choice only**: every value is a role name from the closed taxonomy. Conform to [`engine/uiautomation/pipeline/schemas/recipe.schema.json`](./engine/uiautomation/pipeline/schemas/recipe.schema.json).

```json
{ "component": "Separator", "importFrom": "bits-ui", "importName": "Separator",
  "parts": { "root": ["layout.divider"] }, "source": "bits-ui" }
```

This is the step an agent can do (or a preset map can bypass). Restrict the agent to picking from the closed list — nothing else.

## Step 5 — Run the pure compiler

`pnpm gen` resolves recipe + anatomy + roles + axes + adapter into a plan, then emits: `<Name>/*.svelte` wrappers (zero `<style>`), indented `styles/<name>.sass`, and `plan/<name>.json`. Reuse `engine/uiautomation/pipeline/src/compose.mjs`. **`pnpm gen --check`** refuses to write and compares bytes — the "is the output clean?" CI gate.

Wrapper rules the emitter must hold (PLAYBOOK §5): forward snippets as props (`children={childrenProp}`), re-declare `$bindable` props, destructure only what you own, pass the rest through `...restProps`.

## Step 6 — Wire the eleven gates

`pnpm check` runs the verifier and writes `report.json`. The gates are catalogued in [`canonical/gates.md`](./canonical/gates.md). Verify by hand that they actually bite: a hand edit to a generated file must fail byte-stability with a line number; a styleable part left out of a recipe must fail coverage *before* anything is written; deleting a role reference must fail referential integrity.

```bash
pnpm verify        # extract → gen → check, in order
pnpm verify:clean  # gen --check + check: the CI "output is clean" gate
```

## Step 7 — Add the agent-coach linter for consumer code

The gates keep *generated* output on-system. `cui-lint` keeps *hand-written consumer* code on-system, and coaches the agent doing the writing. Reuse `engine/affedo/scripts/lib/*` + `cui-lint.mjs`; configure via `cui.config.json` (token sources, styles/components/routes dirs, allow/deny style properties, spacing+radius scales). Rules and diagnostic format: [`canonical/cui-lint-rules.md`](./canonical/cui-lint-rules.md).

```bash
pnpm lint:agent          # human-readable, three-part diagnostics
pnpm lint:agent:json     # machine mode for agent contexts
node scripts/cui-lint.mjs --fix    # auto-apply exact-match fixes
```

Then add the design-system directive to `CLAUDE.md` / `.cursorrules` telling agents to run `lint:agent:json` and apply the prescriptive fix until 0 violations. Put `pnpm lint:agent && pnpm check && pnpm build` in CI.

## Step 8 — Build the playground from the plan data

The playground renders its whole inspector from `plan/<name>.json` and reads Sass from disk with `?raw` — no copy re-derived in the browser, so what's on screen is what the compiler resolved. Discover components with `import.meta.glob` over `plan/*.json` so a new recipe appears on reload with no hand-maintained list. Add live token overrides written straight to `:root` to prove the theming seam.

---

## The invariant to protect above all

**The emitter must contain zero per-component logic.** The moment you're tempted to write `if (component === 'X')` or a hand-authored `&[data-size="sm"]` block inside the compiler, stop: that decision belongs in `roles.json` (`when`) or `axes.json`. Losing this invariant collapses the whole thesis back into "the model authored CSS," which is the thing this system exists to prevent.
