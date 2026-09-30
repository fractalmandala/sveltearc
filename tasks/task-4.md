# Task 4

> Sveltebois, outstanding alignment on Task 3. The 9-step runbook from Agent C, verified and sharpened by Agent B and Agent A, is now the law of the land.

> Here are my rulings and directives for Task 4:

> ### 1. Assignment Split & Swap Approval
> The card ↔ tabs swap proposed by Agent A is **APPROVED**. It makes total sense for Agent C to handle `card` alongside their LayoutGroup / layoutId spike lane, keeping Agent A's pilot wake clean.
> 
> Here is the locked Batch D allocation (16 components):
> - **Agent A**: `accordion` (Pilot reference) + `dialog`, `drawer`, `bottom-sheet`, `tooltip`, `tabs`
> - **Agent B**: `dropdown-menu`, `split-button`, `swipe-actions`, `hover-card`, `select`
> - **Agent C**: `popover`, `notification-center`, `switch`, `checkbox`, `card`

> ### 2. Locked Technical Amendments (from B and A)
> - **Refs**: Plain HTML elements use `bind:this={el}`. Bits UI parts expose a bindable `ref` prop and **must use `bind:ref={el}`**.
> - **Anatomy Object**: `parts` in anatomy JSON is an object keyed by name (`parts.<name>.exportName`).
> - **CSS & Fidelity**: Verbatim `.module.css` always. If closed panels need end-state hiding with `forceMount` + still-state, achieve it with the existing selectors or document in manifest `gaps`.
> - **HoverCard**: Confirmed mapping to `LinkPreview`.

> ### 3. Immediate Directives — Full Parallel Execution (No Waiting)
> We do NOT need artificial serial bottlenecks. The folder exclusivity rule protects us, the 9-step recipe is verified, and the mapping is pinned. **All 3 of you start porting your components in parallel right now.**
> 
> **Agent A**:
> - Port **`accordion`** first as reference + author `CONVENTIONS.md`, then proceed directly into your cluster (`dialog`, `drawer`, `bottom-sheet`, `tooltip`, `tabs`).
> - Golden Rule 2 in full effect: component + doc page + demo land together.
> 
> **Agent B**:
> - Start your 5 immediately (**`dropdown-menu`** first, then `split-button`, `swipe-actions`, `hover-card`, `select`).
> - Spec the demo requirements for the gallery as you go.
> - You will audit Agent A's accordion doc per our cross-audit rule.
> 
> **Agent C**:
> - Start your 5 immediately (**`switch`** or **`popover`** first, then `notification-center`, `checkbox`, `card`).
> - Build the gallery shell + validator tooling in parallel (routes in `src/routes/`, site helpers in `$site`, never `$lib`).
> 
> **Execution determines all.** Zero waiting. Confirm your start and which component you're touching first below in your respective agent blocks.

```agent-b
// Agent B — STARTED, parallel execution confirmed. First component: dropdown-menu —
// and it has cleared every static gate.
//
// DELIVERED (all 4 files, gates below):
//   src/lib/components/dropdown-menu/dropdown-menu.svelte        (runbook steps 5-6)
//   src/lib/components/dropdown-menu/dropdown-menu.types.ts      (step 4; ReactNode→Snippet deltas documented)
//   src/lib/components/dropdown-menu/dropdown-menu.module.css    (step 3; cmp-verified byte-identical)
//   src/routes/dropdown-menu/+page.svelte                        (step 7; every state + keyboard checklist)
//   src/lib/components/dropdown-menu/manifest.json               (step 9; status still-port)
//
// GATES: npm run check → 0 errors 0 warnings · npm run build → exit 0 · CSS cmp → identical.
// Wiring followed mapping §0 + anatomy contract (extractor run for dropdown-menu: 18 parts
// exported, exactly the source's 6 consumed). Contract checks done in d.ts before writing:
// loop/sideOffset/align/collisionPadding/onSelect all exist 1:1. Native capture attrs
// (onpointermovecapture/onkeydowncapture) replaced React's onPointerMoveCapture/
// onKeyDownCapture — same capture semantics, no listeners.
//
// DOM-PARITY CATCH on myself, for the record: I first wrote the highlight span inside
// {#if highlight} — wrong. React keeps that span mounted and animates opacity to 0.
// Fixed: span is always mounted, top/height hold the last target, opacity carries the
// hidden state. This is exactly the trap the rule exists for; worth a traps-list entry.
//
// TWO LEARNINGS FOR CONVENTIONS.md (A) — both cost me a gate cycle each:
//   1. Snippets are TEMPLATE constructs: declare at template top level, reference from
//      the instance script (the accordion reference route does exactly this — should have
//      checked it first). Never declare {#snippet} inside <script>.
//   2. FocusEvent is a GLOBAL DOM type in svelte 5.57 (svelte/elements exports only
//      FocusEventHandler; no generic FocusEvent<T> — that's a React-ism).
//
// ⚠ ESCALATION to C — validator bug (blocks cui-lint for everyone, file = C's lane):
//   scripts/cui-lib/svelte-ast-linter.mjs (a) doesn't index `let {...} = $props()`
//   destructures, so local components contribute zero props; (b) merges bits-ui anatomy
//   PART NAMES into the local component's allowed-props set (step-2 augmentation, ~line
//   89: `if (data.parts) ... info.props.add(partName)`). Net effect: correct usage of a
//   correctly-ported Arc component is flagged as hallucinated props (my accordion-route
//   false positives that A then saw too were this, not an API error). Suggested fix:
//   parse $props() destructuring in the step-1 scanner; namespace anatomy parts as
//   `<ns>.<part>` instead of merging into the component's props set.
//   Note: pipeline/anatomy/<ns>.json uses `parts` as an OBJECT keyed by part name
//   (task-4 amendment #2 has it right; older tooling reading it as array will break).
//
// UIARC-DOC NOTE (golden rule 2): the dropdown-menu doc page does not exist yet — I read
//   mapping + source + anatomy only. Per task-2's cross-audit split I write component
//   docs, another agent audits. I'll author the dropdown-menu doc alongside the demo
//   route once C's gallery shell lands (it hosts the doc surface); flagging now so the
//   doc debt is visible and scheduled, not silent.
//
// NEXT: split-button → swipe-actions → hover-card (LinkPreview — first-of-kind wiring,
//   expect a d.ts check for openDelay passthrough) → select (half-intervention). Per the
//   directive, continuing without waiting.
```

```agent-c
// CONFIRMED — started. First component: `switch`. Gallery shell + validator built in parallel.
// All three Task-4 amendments applied (bind:ref on bits parts; anatomy parts object;
// verbatim .module.css; hover-card→LinkPreview not mine but noted).

// ── DONE THIS SESSION ──────────────────────────────────────────────────────────
// 1. `switch` PORTED (component + types + verbatim css + manifest):
//    src/lib/components/switch/{switch.svelte, switch.types.ts, switch.module.css,
//    switch.manifest.json}
//    - bits-ui `Switch.Root` + `bind:ref`; controlled (checked + onCheckedChange) and
//      uncontrolled (defaultChecked via untrack) both work; label rendered + used as
//      aria-label; hidden input via bits-ui when `name` is set.
//    - Phase 1 still-state: thumb at end position (translateX 0/18), no spring.
//    - GAP (manifest): press-stretch (scaleX) + spring glide → Phase 2.
//    - GAP (manifest): bits-ui `Switch.Thumb` intentionally unused — ARC hand-rolls its
//      motion thumb inside a `.track` span; a plain span preserves DOM parity.
//
// 2. GALLERY SHELL (routes in src/routes, helpers in $site, nothing in $lib):
//    src/routes/+layout.svelte           shell: sidebar nav + theme tokens (foundation.css)
//    src/routes/+page.svelte             index, cards grouped by category
//    src/routes/components/[name]/+page.svelte   live demo + usage + install + API table
//                                                + motion + notes-for-ai (doc = proof)
//    src/site/{registry.ts, site.css, docs/switch.ts, demos/switch.svelte}
//    Docs are auto-discovered (import.meta.glob over $site/docs + $site/demos) — a new
//    component page appears with no hand-maintained list.
//    VERIFIED at runtime: dev server 200 on `/` and `/components/switch`; SSR markup shows
//    5 role="switch" with correct data-state/aria-checked (2 checked, 3 unchecked, 1
//    disabled) — controlled, uncontrolled-default, callback and disabled all correct.
//
// 3. VALIDATOR TOOLING (Lane C):
//    scripts/check-port.mjs + npm run check:port — per-component gates:
//      files (.svelte + .module.css + manifest) · no-style · verbatim-css byte compare
//      · prop parity vs the ARC .tsx interface · manifest shape.
//    scripts/cui-lint.mjs repointed + npm run lint:agent[:json]; linter patched to read
//    `<name>.types.ts` for `interface Props` (PORTING-PLAN §4 convention).
//    package.json scripts added: check:port, lint:agent, lint:agent:json.
//
// ── EVIDENCE (switch) ─────────────────────────────────────────────────────────
//    npm run check   → 0 errors / 0 warnings in all my files (project-wide run is red
//                      only on peers' in-progress accordion/dropdown-menu files)
//    npm run build   → ✓ built
//    cui-lint        → 0 violations in my files
//    check-port      → `ok switch` (0 errors, 0 warnings)
//
// ── FINDINGS FOR A + B (the validator already bites, on your WIP) ─────────────
//    A / accordion:  check-port FAIL — missing accordion.manifest.json; ARC props
//                    `items`, `defaultOpen`, `size` not on the port yet.
//                    Also: src/routes/accordion/+page.svelte has a syntax/type error
//                    (`<h2>size="md" (default)</h2>` + `{faqs: never}`) and imports
//                    accordion.svelte with no default export. Suggest your demo route
//                    live under the gallery (`/components/accordion`) or keep `/accordion`
//                    as a scratch page — your call, but two conventions will confuse.
//    B / dropdown-menu: check-port FAIL — missing dropdown-menu.manifest.json; ARC prop
//                    `label` not on the port yet.
//
// ── NEXT (my remaining 4, in order) ──────────────────────────────────────────
//    checkbox → popover → notification-center → card. Starting checkbox now.
//
// ── ASK ──────────────────────────────────────────────────────────────────────
//    Status field: PORTING-PLAN §4.3 says manifest `status: still-port`, but the skill's
//    output-contract schema enum is planned|complete|partial|blocked. I used `partial`
//    and recorded the phase in `gaps`. Confirm, or approve extending the schema enum
//    with `still-port` so all three of us are consistent.
```

```agent-c
// UPDATE — `checkbox` PORTED (2 of 5 done: switch, checkbox).
//
// Files: src/lib/components/checkbox/{checkbox.svelte, checkbox.types.ts,
//        checkbox.module.css (verbatim), checkbox.manifest.json}
//        src/site/{docs/checkbox.ts, demos/checkbox.svelte}
//
// Notes:
//  - bits-ui splits Radix's `checked` union into boolean `checked` + `indeterminate`.
//    Public API keeps the Radix union (`boolean | 'indeterminate'`) and translates
//    internally, so the ARC consumer contract is preserved.
//  - `useId()` → `$props.id()`; label `for=` + `aria-describedby` wired to the same id.
//  - Phase 1 still-state: fill opacity/scale and the check↔dash path render end values
//    only; spring scale + path morph are Phase 2 (manifest gaps).
//
// EVIDENCE (checkbox):
//   npm run check   → 0 errors / 0 warnings (whole project, all three of us clean now)
//   npm run build   → ✓ built in 3.00s
//   cui-lint        → 0 violations in my files (project has 3 in A's /accordion route)
//   check-port      → `ok checkbox`
//   runtime         → /components/checkbox 200; 5 role="checkbox" with correct
//                     aria-checked/data-state: unchecked, indeterminate(mixed), unchecked,
//                     checked, disabled. Index lists both Switch + Checkbox.
//
// NEXT: `popover` (8 bits-ui parts), then `notification-center` (Popover + list),
// then `card` (Dialog host). Continuing.
```

> ### Human Ruling on Agent C's Ask:
> 
> 1. **Manifest Status Enum**: **APPROVED.** I have updated `skills/react-to-sveltekit/references/output-contract.schema.json` to include `"still-port"` in the status enum. All three of you (A, B, C) should use `"status": "still-port"` for Phase 1 manifests.
> 
> 2. **Canonical Demo & Gallery Structure**: Agent C's setup (`/components/[name]` via auto-discovery in `$site/docs/<name>.ts` + `$site/demos/<name>.svelte`) is the **canonical project standard**. Agent A and Agent B, register your demos and docs in `$site/demos/` and `$site/docs/` so all components land in the same unified gallery without routing collisions.
> 
> Outstanding pace, Agent C — 2 of 5 done (`switch`, `checkbox`) and gates clean. Keep rolling.

```agent-c
// UPDATE — status enum adopted; `popover` PORTED (3 of 5: switch, checkbox, popover).
//
// 1. Manifest status: both switch + checkbox manifests updated to "status": "still-port"
//    (schema enum approved). Status-conflict gaps removed. Thank you.
//
// 2. `popover` — compound component, ported as one file per part + barrel:
//    src/lib/components/popover/
//      popover.svelte           Root  (bind:open, onOpenChange, onOpenChangeComplete)
//      popover-trigger.svelte   Trigger (carries styles.anchor — ARC opts out of press-scale)
//      popover-content.svelte   Portal > Content, defaults align="start" sideOffset={6}
//                               collisionPadding={10}, carries styles.content
//      popover-close.svelte     Close
//      index.ts                 barrel + aliased prop types
//      *.types.ts (4)           one `interface Props` per part (cui-lint reads these)
//      popover.module.css       verbatim · popover.manifest.json
//    src/site/{docs/popover.ts, demos/popover.svelte}
//
//    GAP (manifest): ARC CSS reads `var(--radix-popover-content-transform-origin)`, bits-ui
//    sets `var(--bits-popover-content-transform-origin)`. Inert in Phase 1 (no scale), but
//    Phase 2 must alias them or the scale origin falls back to centre.
//
// 3. GALLERY HARDENING (important for A + B):
//    Demos now load LAZILY (non-eager glob). Reason: with eager imports, ONE broken demo
//    breaks the index and every component page. It did — see the A finding below.
//
// ── FINDING FOR A (blocking shared surfaces) ─────────────────────────────────
//    src/site/demos/accordion.svelte is broken: `{/snippet>` at line 45 (should be
//    `{/snippet}`), plus a `<style>` block. It fails svelte-check AND `vite build`, and
//    (before my lazy-demo change) took down the whole gallery with 500s. With lazy demos
//    only /components/accordion is affected now — but `npm run build` stays red until it
//    is fixed. Please fix the snippet close; a `<style>` in $site is fine (site-only).
//
// ── EVIDENCE (popover) ───────────────────────────────────────────────────────
//    npm run check   → 0 errors / 0 warnings in all popover + gallery files (project has
//                      1 error: A's accordion demo)
//    cui-lint        → 0 violations in my files
//    check-port      → `ok popover`
//    runtime         → `/`, `/components/popover`, `/components/switch`,
//                      `/components/checkbox` all 200; popover trigger renders with
//                      data-state="closed"; index lists all three.
//    npm run build   → SKIPPED (blocked by A's accordion demo; no popover file involved)
//
// NEXT: `notification-center` (Popover + list), then `card` (Dialog host).
```

```agent-a
// PILOT DONE — accordion reference port complete, CONVENTIONS.md authored. Cluster next: dialog.
//
// DELIVERABLES (all gates green on A's surface):
//   src/lib/components/accordion/{accordion.svelte, accordion.types.ts (interface Props!),
//     accordion.module.css verbatim, accordion.manifest.json (status still-port per ruling)}
//   src/site/docs/accordion.ts + src/site/demos/accordion.svelte (canonical gallery shape,
//     auto-discovered — NOT a scratch route; C's finding about `{/snippet>` in my demo was a
//     stale snapshot mid-rebuild — file verified clean, no typo, gallery 200s below)
//   CONVENTIONS.md at repo root — pins, translation table, DOM-parity law, anatomy law,
//     deliverables list (§6 updated with today's harness discoveries), gates §7, ownership §8
//
// EVIDENCE:
//   npm run check   → 0 errors / 0 warnings (whole project, current tree)
//   npm run build   → ✓ built in 3.22s (post-rewrite)
//   cui-lint        → 0 violations in A files
//   check-port      → `ok accordion` (remaining 2 errors = B's WIP dropdown-menu: missing
//                     manifest + `label` prop — C already flagged, don't double-report)
//   SSR contract (scratch route, before migration): open panel data-state="open" +
//     aria-expanded="true" + visibility:visible; closed data-state="closed" height:0px
//     visibility:hidden AND STILL MOUNTED. Compiled demo chunk verified: snippet refs are
//     hoisted function decls — script-level `const items = [{content: snippetVar}]` is safe.
//   Gallery runtime: / , /components/accordion, /components/popover all 200.
//
// PILOT LEARNINGS now law (teammates mid-batch, re-read CONVENTIONS §6 + mapping §8):
//   1. types.ts must name the interface exactly `Props` — check-port's portProps() matches
//      `interface Props`, `<Name>Props` silently FAILS props gate (accordion was red until
//      renamed). Applies to every part file in compound ports too — C discovered barrels, good.
//   2. Accordion.Header: bits-ui default level=2, Radix default h3 → explicit level={3}.
//     Every future Header port: audit the React primitive's default tag/level.
//   3. bits-ui forceMount'd Content is NOT hidden when closed (only hiddenUntilFound hides,
//     via display — which would block Phase 2 height springs). Still-state carrier = inline
//     style mirroring motion end-values. See accordion lines 20-21 + manifest gap 4.
//   4. bits single-mode accordion IS collapsible (toggle-to-close, verified in dist source)
//     — no semantics lost vs Radix type="single" collapsible.
//   5. cui-lint false-positives on ARC components sharing a bits namespace NAME (<Accordion>
//     in demos/routes). Alias the tag in demos (ArcAccordion) until C scopes the linter to
//     imports-from-bits-ui. C: this is yours; note it before B's dropdown-menu demo tags hit it.
//   6. state_referenced_locally silencing pattern for React-seeded useState parity:
//     // svelte-ignore state_referenced_locally + one-line why (CONVENTIONS §2).
//   7. svelte.config.js was MISSING from my task-1 scaffold (minimal template shipped none,
//     and vite.config.ts options shadow it). Added — REQUIRED for svelte-check to parse
//     lang="ts". It now mirrors vite.config.ts. Q for human: consolidate kit options into
//     svelte.config.js (standard) or keep vite.config.ts as the kit-options home? Both files
//     identical today; no behavioral risk either way, just duplicated truth.
//
// For B: your scratch route src/routes/dropdown-menu/+page.svelte is the collision I just
// retreated from — gallery convention is $site/demos/dropdown-menu.svelte + docs/. Also your
// dropdown-menu props (label/items/icon) will trip cui-lint's namespace-name match once
// check-port's manifest gate goes green — learnings 1 and 5 above cover both.
//
// Doc page for accordion: drafted in $site/docs/accordion.ts (usage/API/motion/notes per
// DocMeta). Ready for B's audit whenever you get a gap — audit target = the gallery page's
// doc sections.
//
// A continuing: dialog now (anatomy/dialog.json already extracted by C). Gating each before
// the next, per §7.
```

> ### Task 4 Closed.
> Pilot passed, conventions locked, initial components compiling clean. Transitioning to `task-5.md` for the Documentation Mission & Batch D completion.


