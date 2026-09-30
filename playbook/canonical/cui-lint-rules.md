# The Agent-Coach Linter (`cui-lint`) — Rules & Diagnostic Contract

Source: `engine/affedo/scripts/cui-lint.mjs` + `scripts/lib/{token-linter,svelte-ast-linter,fuzzy,agent-reporter}.mjs`. Configured by `cui.config.json`. Runs ~240ms over a 38-component project; baseline is 0 violations.

Where the eleven gates keep *generated* output on-system, `cui-lint` keeps *hand-written consumer* code on-system — and, critically, coaches the **agent** that's writing it.

## Why a second, differently-shaped verifier

A terse compiler error gives an LLM nothing to act on:

```
TS2353: Object literal may only specify known properties, and 'padding'
does not exist in type 'Pick<CSSProperties, "margin" | "width">'.
```

Faced with this, an agent thrashes: `as any` casts, redundant wrapper `<div>`s, inverted slots, hallucinated class names and props. The fix is not a better error *code* — it's a diagnostic shaped for a context window.

## The three-part diagnostic contract

Every violation is emitted as:

```
┌─ [RULE VIOLATION]           file:line:col + the exact offending snippet
├─ [DESIGN SYSTEM RATIONALE]  the architectural contract — WHY this pattern is prohibited
└─ [PRESCRIPTIVE AGENT FIX]   the exact replacement to use now, backed by fuzzy matching
```

Human mode prints this as a boxed, coloured block; `--json` emits the diagnostic objects for agent parsing; `--fix` auto-applies exact-match replacements (deprecated tokens, exact hex→token). The claim to steal: **structured diagnostics let an agent resolve design-system violations in a single correction round** instead of a thrash loop.

## The four rules

### 1. `cui/token-purity` — `.sass` under `stylesDir`
- **Raw hex** (`#3b82f6`) → suggests the semantic token that maps to that value, else a sample set (`var(--bg)`, `var(--color-primary)`…).
- **Hardcoded px > 2px** → suggests the closest scale token via numeric distance (13px → `var(--space-3)`; radius props check `radiusScale`). ≤2px allowed for hairline borders.
- **Unmapped `var(--x)`** → Levenshtein against the registered token set → "did you mean `var(--…)`?".
- **Deprecated tokens** (`--bg-surface`) → prescribes the replacement (`var(--bg)`), auto-fixable.

### 2. `cui/no-in-component-styles` — components under `componentsDir`
- Parses `ast.css` via `svelte/compiler`. Any `<style>` / `<style lang="sass">` block is flagged; prescribes moving it to `src/lib/styles/components/<name>.sass`. Auto-fix removes the block.

### 3. `cui/no-component-restyle` — consumer templates under `routesDir`
- Detects design-system component invocations, inspects inline `style="…"`, flags denied internal properties (`padding`, `background`, `border`, `border-radius`, `color`, `font-*` — from `config.defaultContract.denyStyleProperties`).
- Prescribes: use a visual variant prop, or a size prop, or control placement via parent layout `gap`/`margin` (the allowed properties: `margin`, `width`, `flex`, `grid-column`, `z-index`…).

### 4. `cui/strict-props-and-slots` — consumer templates under `routesDir`
- Reads the component's `interface Props` (regex over the source) **and** `anatomy/<component>.json`, unions the allowed props + `data-slot` names.
- Catches hallucinated props (`<Button color="blue">`, `<Input helpText="…">`); Levenshtein-suggests the intended one ("did you mean `hint`? Allowed props: value, label, hint…").
- Skips genuinely-common attributes (`class`, `id`, `on*`, `aria-*`, `data-*`, `bind:`).

## What it caught in practice (real, not fixtures)

On existing routes, `cui-lint` surfaced 5 latent API mismatches that TypeScript passed over: `helpText`→`hint`, `closable/onclose`→`withRemove/onremove`, Card `variant`→`appearance`, `ToastItem message=` → default snippet, and an inline `border-radius` restyle → `data-radius="round"` container. This is the payoff of validating against the *anatomy contract* rather than just the type — the type was satisfied; the design system wasn't.

## `cui.config.json` — the knobs

```jsonc
{
  "tokens": ["tokens/createui.json", "tokens/neobrutalist.json"], // token registry sources
  "anatomyDir": "anatomy",
  "stylesDir": "src/lib/styles/components",
  "componentsDir": "src/lib/components/generated",
  "routesDir": "src/routes",
  "rules": { "cui/token-purity": "error", "cui/no-in-component-styles": "error",
             "cui/no-component-restyle": "error", "cui/strict-props-and-slots": "error" },
  "defaultContract": {
    "allowStyleProperties": ["margin","width","flex","grid-column","z-index", "..."],
    "denyStyleProperties":  ["padding","background","border","border-radius","color","font-*"]
  },
  "spacingScale": { "4px": "var(--space-1)", "12px": "var(--space-3)", "16px": "var(--space-4)", "..." : "" },
  "radiusScale":  { "2px": "var(--radius-xs)", "8px": "var(--radius-lg)", "9999px": "var(--radius-full)" }
}
```

## The agent directive (drop into `CLAUDE.md` / `.cursorrules`)

> **Design System Verification & Quality Gate.** Whenever you create or modify Svelte components, routes, or Sass:
> 1. Use external single-tab indented `.sass` under `src/lib/styles/components/`. Never add `<style>` blocks to library components.
> 2. Consume semantic tokens exclusively (`var(--space-*)`, `var(--bg)`, `var(--stroke-*)`, `var(--radius-*)`). No raw hex, no arbitrary px > 2px.
> 3. Before finishing, run `pnpm lint:agent:json`.
> 4. For each violation: read the `[DESIGN SYSTEM RATIONALE]`, apply the exact `[PRESCRIPTIVE AGENT FIX]`, and re-run `pnpm lint:agent` until 0 violations.
