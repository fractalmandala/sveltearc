# The UI-Compiler Playbook

A consolidated account of two experiments — `uiautomation/` and `affedo/` — and the replicable system they produced: **deterministic, on-system UI generation where the LLM only ever makes multiple-choice decisions, and "correct" is a gate rather than a hope.**

---

## 1. The problem being solved

LLM UI generation fails predictably because a model is asked to do two incompatible things at once:

1. **Preserve** complex behaviour and accessibility contracts — ARIA, keyboard nav, focus traps, event forwarding, state machines.
2. **Invent** visual styling from scratch — arbitrary class names, guessed colours, 300-line `<style>` blocks full of raw hex and pixels.

The second job is where models hallucinate. But models are *excellent* at the discrete, categorical task hiding inside styling: "this part is a *ghost control*, that part is a *raised surface*." The whole system is built on separating those two jobs so the model only ever does the one it is good at.

---

## 2. Architectural thesis: the inversion of control

Split ownership so no layer does two jobs:

| Layer | Owns 100% of | Authored by |
| --- | --- | --- |
| **Headless library** (bits-ui, or your own primitives) | accessibility, DOM mechanics, state machines | third party / you, once |
| **`anatomy/<name>.json`** | parts, runtime `data-*` attributes, states, props, snippets | the extractor — **never a human** |
| **`roles.*.json`** (the taxonomy) | the aesthetics: declarations, pseudo-states, axis responses, lint flags | a human, **once per system** |
| **`axes.json`** | axis scales (size, tone): values, default, data attribute | a human, once |
| **`vocabulary.json`** | the closed vocabulary: allowed properties, keyword literals, **and the cascade order** | a human, reviewed |
| **`tokens/<adapter>.json`** | **all** raw values — the only file with hex/px/ms | a designer |
| **`recipes/<name>.json`** | part → role(s), exposed axes, import source | **a human or the agent, multiple-choice only** |
| **`generated/**`** | wrappers, resolved plan JSON, Sass | the emitter — **never a human** |

The agent's entire reasoning surface collapses to: *for each part, pick a role from a closed list.* That is classification, not authorship. And because the recipe is ~15 lines, a preset map can bypass the agent entirely.

The flow:

```
headless component ──[AST extractor]──▶ anatomy/<name>.json
                                              │
recipe (part→role) ──┐                        │
roles + axes ────────┼──[pure compiler: planComponent]──▶ resolved plan
tokens/<adapter> ────┘                        │
                                              ▼
                        generated/  ──  <Name>/*.svelte  (zero <style>)
                                    ──  styles/<name>.sass (indented, token-only)
                                    ──  plan/<name>.json  (the resolution, as data)
                                              │
                                              ▼
                                   verifier (11 gates) ──▶ report.json
```

Two invariants make this trustworthy:

- **The emitter has no per-component logic.** `planComponent` is a lookup; `render*` turns a plan into bytes. If a size block ever had to be hand-written in the compiler, "pure compiler" would be a lie — which is exactly why axis responses had to move *out* of the compiler and *into* `roles.json`'s `when` blocks. (This was the original spec's gap; see §5.)
- **Every generated file carries an `@generated` banner**, and the verifier fails if it's missing or if a fresh render isn't byte-identical to disk. A hand edit becomes a loud failure, never a silent revert.

---

## 3. Two lineages, two halves of one system

The user's framing: `uiautomation` = experiments, `affedo` = the formalized system built from them. That's right, but they specialised in different halves, and the strongest go-forward system is the **union** of the two.

### `uiautomation` — the compiler discipline (sharper half)

- Wraps a **real** third-party headless library (bits-ui 2.19.2), not a fixture. This is what forced honesty (§5).
- **Extractor** reads three sources deterministically (barrel / state module / part source) — because real libraries scatter the three kinds of information across three places.
- **Role taxonomy is principled**: each role is full CSS declarations + `states` (selector→declarations) + `when` (axis→declarations) + lint-only `behavior`. Role *composition* is real: `control.expanded` and `control.selected` are state overlays composed *after* a base control role.
- **Eleven gates**, machine-readable `report.json`, byte-stability, cascade-tie analysis.
- Honest about its limits (15 of 42 namespaces have recipes; prop types stop at the library's `.d.ts` boundary; agent role-picking step not yet automated).

### `affedo` — the product + agent-coach discipline

- A **self-authored 38-component library** (does *not* wrap bits-ui). Components are emitted by wave generators (`scripts/generators/wave2|3|4.mjs`) from anatomy + recipe + roles.
- **Multi-theme tokens**: `createui` (light/dark, 10 categories, 4 scales) + `neobrutalist`, plus live density and corner-geometry modifiers. Same markup, swap token values.
- **`cui-lint`** — the formalized verifier, re-aimed at *agents*: instead of gate output for CI, it emits a three-part diagnostic (location → rationale → prescriptive fix) with Levenshtein suggestions, so an LLM fixes the violation in one round instead of thrashing (`as any`, wrapper divs, hallucinated props). See §6.
- Packaged as a Tauri desktop app with interactive playgrounds (`/generator`, `/playground2`).

### The honest observation

`uiautomation`'s role model is **more advanced** than `affedo`'s (full declaration/state/when/behavior vs. affedo's shorthand `bg/fg/border/pad` keys consumed by hand-written wave generators). The go-forward system should take **`uiautomation`'s compiler + taxonomy + gates** and **`affedo`'s multi-theme tokens + agent-coach linter + product playground**. The canonical files in this folder use the `uiautomation` forms for that reason.

---

## 4. Why each piece exists (the non-obvious design decisions)

- **Closed vocabulary as a gate, not a convention.** A role may only emit a property from `vocabulary.properties` and only name a token in the adapter or a literal in `vocabulary.keywords`. Anything else errors at check time. This is what turns "zero-bloat" from a promise into an enforced property.
- **The state-selector array *is* the cascade contract.** Almost every state selector has equal specificity, so source order decides ties. `vocabulary.stateSelectors` is ordered as priority: `:hover` → `:focus-visible` → `:active` → `[data-*]` states. That's why a pressed control doesn't fall back to its hover look, and why library state (`[data-state="open"]`) outranks pointer state. The alternative — `!important` or nesting tricks — would put the decision inside the emitter, which the thesis forbids.
- **One visual channel per state, on purpose.** Roles give `:hover` `background-color`, `:active` `box-shadow`, `:focus-visible` the outline, `[data-disabled]` opacity+cursor, and data-states colour. Two states writing the *same* property at equal specificity *is* a tie — so roles only create one where library state genuinely must beat pointer state, and the cascade gate reports any tie that isn't already documented.
- **The adapter is the only file with raw values, and dead tokens are a finding too.** A token no role reaches is dead weight; the token lint reports it (plus a `$chromeOnly` escape hatch for values only the playground shell needs).
- **The resolved plan is emitted as data** (`plan/<name>.json`). The playground renders its inspector from that file, so what's on screen is literally what the compiler resolved — a wrong plan is visible, not buried.

---

## 5. What real bits-ui taught the extractor (the most valuable lesson)

The original spec (`engine/uiautomation/CORE-IDEA.md`) assumed Stage 1 was trivial: walk the template, read `data-slot` / `data-state` / `aria-*` off the elements. **Every one of these assumptions was silently wrong against a real library**, and each would have looked fine in a demo and failed in production:

1. **State attributes are built in JS, not markup.** A bits-ui part is one element with `{...mergedProps}`; `data-state` etc. are constructed in `*.svelte.js`. A template-only walk returns an anatomy with *zero states and no error*. Fix: read the state module too (with `acorn`), attribute props objects to parts via the computed key `[attrs.<part>]` — a structural signal from the code, not a class-name guess.
2. **Parts are namespace members, not files.** `Root → components/accordion.svelte`; the filename isn't a usable component tag.
3. **The state module is named after the directory, not the component.** `PinInput.toLowerCase()` = `pininput`, but the file is `pin-input.svelte.js`. Deriving the name loses every multi-word component — so discover it instead.
4. **Not every part is styleable.** `dialog.svelte` is a pure context provider (`{@render children?.()}`); tooltip's `arrow` renders a *component*. Neither is an error — they're re-exported rather than wrapped. A recipe may still claim one explicitly.
5. **Snippet props must be forwarded as props.** `Slider.Root` hands its `children` snippet `{ tickItems, thumbItems }`; `Pagination.Page` renders `{page.value}` *only when it has no children*. A wrapper declaring its own `{#snippet children}` drops the library's args *and* makes `children` defined when nobody passed one — silently deleting default content. Generated wrappers pass `children={childrenProp}` and own attributes only.
6. **`$bindable()` must survive the wrapper**, or `bind:value` silently breaks.
7. **Requiredness can't be claimed through an imported type alias.** `href`/`type` look required but bits-ui marks them optional (`href?: never` on the anchor branch). The extractor claims `required` only when it actually resolved a type — a wrapper must never invent a constraint the library doesn't have.

**The meta-lesson:** *a template-only reader returns a confident, empty answer.* The generalizable rule for any extractor: **prefer structural signals from the code over conventions you hope the library follows, and make "I couldn't resolve this" an explicit `unknown` rather than a guess.** Generated wrappers therefore destructure only what the pipeline owns (role class, axes, `children`, bindables) and forward everything else through `...restProps`, so they never duplicate — and never drift from — the library's own prop defaults.

---

## 6. The agent-coach verifier (affedo's `cui-lint`)

The `uiautomation` gates are written for CI (pass/fail, `report.json`). `cui-lint` re-aims the same verification at **the agent that's writing the code**. The insight: a terse compiler error (`TS2353: 'padding' does not exist in type...`) gives an LLM nothing to act on, so it thrashes — `as any`, wrapper divs, inverted slots, hallucinated props. Every diagnostic is instead formatted in three parts:

```
┌─ [RULE VIOLATION]        file:line:col + the offending snippet
├─ [DESIGN SYSTEM RATIONALE]  the architectural contract — *why* this is prohibited
└─ [PRESCRIPTIVE AGENT FIX]   the exact replacement, backed by fuzzy (Levenshtein) matching
```

The four rules:

1. **`cui/token-purity`** — no raw hex, no hardcoded px >2px, no unmapped/deprecated tokens in `.sass`. Suggests the closest scale token (13px → `var(--space-3)`) or the closest registered token by edit distance.
2. **`cui/no-in-component-styles`** — parse `ast.css`; flag any `<style>` block in a library component; prescribe the external `.sass` path.
3. **`cui/no-component-restyle`** — in consumer routes, flag inline `style="padding|background|border|..."` on a design-system component; prescribe a variant/size prop or parent-layout `gap`/`margin`.
4. **`cui/strict-props-and-slots`** — validate consumer props against the component's `interface Props` + `anatomy/*.json`; catch hallucinated props (`<Button color="blue">`) with a fuzzy "did you mean `variant`?"

This caught **5 real latent API mismatches** in the existing routes (`helpText`→`hint`, `closable`→`withRemove`, `variant`→`appearance`, etc.), runs in ~240ms over the whole project, and — the claim worth stealing — lets an agent resolve design-system violations in a single correction round. The two verifiers are complementary: **gates keep the *generated* output on-system; the coach keeps *hand-written consumer* code on-system.**

---

## 7. Consolidated takeaways (what to replicate going forward)

1. **Invert control.** Behaviour to the headless layer, aesthetics to a data taxonomy, values to a token adapter, wiring to a pure compiler. The agent only classifies.
2. **Make the emitter logic-free.** If any per-component styling has to live in the compiler, that decision belongs in a data file (`roles.when`, `axes.json`) instead. This is the load-bearing discipline; protect it.
3. **A closed vocabulary + a gate is what makes "zero-bloat" real.** Convention alone rots; a check that fails loudly doesn't.
4. **Encode the cascade in data.** Order the state-selector list as a priority contract; give each state one visual channel; report only ties that contradict the contract. No `!important`.
5. **Extract from structural signals, never from hoped-for conventions.** Read the state module, discover file names, resolve `$bindable`, and emit `unknown` instead of guessing. A template-only reader lies confidently.
6. **Generated wrappers own attributes, never content or defaults.** Forward snippets as props, re-declare bindables, pass everything else through `...restProps`.
7. **Emit the resolution as data.** The plan JSON makes the compiler auditable and drives the playground for free.
8. **Ship two verifiers.** Gates (CI, byte-stable, pass/fail) for generated output; an agent-coach linter (rationale + prescriptive fix + fuzzy match) for hand-written consumer code.
9. **Tokens are the theming seam.** One adapter file per theme (light/dark inline, plus whole-theme variants); same roles, same markup, different values. Dead tokens are a finding.
10. **Be honest about the boundary.** Both systems document their real limits. The biggest open item is automating the agent's role-pick step against the closed list — the taxonomy is small enough that it can be a preset map today and an agent tomorrow.

---

## 8. Known gaps / go-forward backlog

Carried verbatim from the two systems, in rough priority:

- **Automate recipe authoring** (the agent's multiple-choice role-pick against the closed list). Currently manual/preset; this is the last un-automated stage.
- **A TypeScript type resolver over the library's shipped `.d.ts`** so prop types don't stop at `unknown` at the import boundary (also unblocks real requiredness).
- **Anatomy-drift gate**: pin the library version and diff the extracted anatomy in CI.
- **Merge the two role models**: adopt `uiautomation`'s full declaration/state/when/behavior role shape inside `affedo`'s multi-theme + generator + linter product.
- **A11y/contrast audit** over tone × role combinations; a dark adapter check; visual regression.
- **Menu-family components** (dropdown-menu, context-menu, menubar, select) are the largest unsupported group in the bits-ui extractor.
