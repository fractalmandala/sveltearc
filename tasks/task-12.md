# Task 12: Component Sprint — Wave 1 (24 components, full docs)

> **Lead note:** back to the initial-momentum loop. Port components in parallel, each with its
> full doc page (Golden Rule 2). Phase 1 (`still-port`) is the target; Phase 2 motion is separate.
> The human is restyling the site — **do not touch `src/site/styles/*`, `src/site/site.css`, or
> `src/routes/+layout.svelte`.**

## 0. Mission

63 components and 18 blocks remain (ARC has 98 components). Wave 1 ports **24** with complete docs,
using the scaffold tooling and the frozen conventions. Every component lands with: `.svelte` +
verbatim `.module.css` + `.types.ts` + `.manifest.json`, plus `$site/docs/<name>.ts` and
`$site/demos/<name>.svelte` — the doc is the proof.

## 1. The SOP (per component)

```bash
node scripts/scaffold-port.mjs <name>     # copies CSS, extracts types, writes manifest + starter,
                                          # and runs scaffold-doc (fetches uiarc markdown → doc + demo)
```

Then refine, in this order:

1. **`<name>.svelte`** — implement against `../arc-library-main/registry/components/<name>/<name>.tsx`.
   Svelte 5 runes (`$props()`, `$state`, `$derived`, `$bindable`, `$props.id()`); Bits UI for Radix
   primitives (`tasks/bits-ui-mapping.md` §0 protocol); keep `.module.css` **verbatim**. Phase 1
   still-states (see `MOTION-CONVENTIONS.md`).
2. **`<name>.types.ts`** — drop the scaffold's `className` (Svelte uses `class`); type `ref` bindable.
3. **`<name>.manifest.json`** — replace the scaffold shape with the output-contract schema shape
   (`contractVersion`/`status: still-port`/`source`/`target`/`dependencies`/`dataFlow`/`ssr`/
   `verification[]`/`gaps`), like the existing 35.
4. **`$site/docs/<name>.ts` + `$site/demos/<name>.svelte`** — verify/refine the generated doc
   (real usage, correct API table, canonical `group` id) and the demo (exercise every state).

After your batch:

```bash
pnpm barrel        # regenerate src/lib/index.ts (package entry)
node scripts/check-port.mjs
npm run check
npm run lint:agent
npm run build
```

## 2. Frozen conventions

- `CONVENTIONS.md` (props/ids/refs/effects/events), `MOTION-CONVENTIONS.md` (Phase 1 still-states).
- `src/site/groups.ts` is **Lead-owned and pre-frozen** for all 98 components — do not edit it; a
  new doc just uses its canonical `group` id.
- `src/lib/index.ts` is generated (`pnpm barrel`) — never hand-edit.

## 3. Wave 1 allocation (24)

| Agent | Components |
| --- | --- |
| **A** | `toast`, `toast-stack`, `announcement-bar`, `stepper`, `usage-meter`, `action-button` |
| **B** | `combobox`, `multi-select`, `chip-group`, `radio-cards`, `billing-toggle`, `avatar-group` |
| **C** | `number-field`, `phone-input`, `tag-input`, `mention-input`, `shortcut-recorder`, `inline-edit` |
| **D** | `in-view-title`, `text-morph`, `text-shimmer`, `slot-text`, `image-compare`, `carousel` |

## 4. Roadmap after Wave 1

- **Wave 2 — pickers & expand & menus:** calendar, date-picker, date-range-picker, time-picker,
  color-picker, expandable-card, resizable-panels, context-menu, user-menu, command-palette.
- **Wave 3 — editors & special:** rich-text-editor, signature-pad, file-dropzone, file-upload,
  otp-input, hold-to-confirm, confirm-morph, metric-card, pagination, code-block, filter-toolbar.
- **Wave 4 — charts (13):** line, bar, donut, streamgraph, brush, waffle, slope, sparkline, gauge,
  activity-heatmap, animated-counter, ridgeline, treemap.
- **Wave 5 — tables & activity:** sortable-data-table, tree-view, timeline, comment-thread,
  chat-thread. **Blocks** last.

## 5. Gates (every lane, before reporting)

```bash
node scripts/check-port.mjs   # 0 errors
npm run check                 # 0 errors / 0 warnings
npm run lint:agent            # 0 violations
npm run build                 # ✓ built
```

Reproduced output only. A component is not done until its doc + demo exist and the gates are green.

## 6. Cross-audit (Golden Rule 2 — no self-audit)

A → B · B → C · C → D · D → A. Audit the batch: doc completeness, API accuracy, CSS verbatim, gates.

## 7. Ownership

| Path | Owner |
| --- | --- |
| `src/lib/components/<name>/**` | the lane that ports it (exclusive) |
| `$site/docs/<name>.ts`, `$site/demos/<name>.svelte` | same lane |
| `src/site/groups.ts` | Lead (pre-frozen) |
| `src/lib/index.ts` | generated (`pnpm barrel`) |
| `src/site/styles/*`, `src/site/site.css`, `src/routes/+layout.svelte` | **human** — do not touch |

---

```agent-lead
// ════════════════════════════════════════════════════════════════════════════
// LEAD DISPATCH — TASK 12: COMPONENT SPRINT WAVE 1
// ════════════════════════════════════════════════════════════════════════════
// Back to initial momentum: scaffold → refine → docs → gates, 4 lanes in parallel.
//
// Landed by Lead first (do not redo):
//   · src/site/groups.ts — COMPONENT_GROUP pre-frozen for all 98 components
//   · scripts/gen-barrel.mjs + `pnpm barrel` — regenerates the package entry
//
// WAVE 1 (24), one folder each, exclusive:
//   A: toast, toast-stack, announcement-bar, stepper, usage-meter, action-button
//   B: combobox, multi-select, chip-group, radio-cards, billing-toggle, avatar-group
//   C: number-field, phone-input, tag-input, mention-input, shortcut-recorder, inline-edit
//   D: in-view-title, text-morph, text-shimmer, slot-text, image-compare, carousel
//
// SOP per component is §1. Run `node scripts/scaffold-port.mjs <name>` first, then
// refine .svelte / .types.ts / manifest, verify the doc + demo. After your batch:
// `pnpm barrel` + the four gates (§5). Post completion here, then cross-audit (§6).
//
// DO NOT touch the human's site restyle: src/site/styles/*, src/site/site.css,
// src/routes/+layout.svelte. Docs/demos are yours.
//
// Start now. Report per component as it lands; batch gate before moving on.
```

```agent-lead
// ════════════════════════════════════════════════════════════════════════════
// WAVE 1 RESULTS — 17 components shipped (Lead-driven parallel sprint)
// ════════════════════════════════════════════════════════════════════════════
// Executed as 5 parallel subagent packets + 2 Lead ports (agents were idle, so
// the Lead ran the swarm directly). 35 → 52 components.
//
// LANDED (commit 66e2d9a, pushed):
//   toast · toast-stack · announcement-bar (messages)
//   combobox · multi-select · chip-group (selects)
//   number-field · tag-input · inline-edit (special-inputs/text-fields)
//   in-view-title · text-morph · text-shimmer · slot-text (text-effects)
//   animated-counter (charts) · metric-card (cards) — metric-card imports the
//     ported AnimatedCounter; animated-counter moved early as its dependency.
//   avatar-group · stepper (Lead ports).
//
// GATES: check-port 52 / 0 errors · check 0/0 · lint:agent 0 · build ✓ ·
// routes spot-checked 200 (/, toast, combobox, number-field, text-shimmer,
// animated-counter, metric-card). Barrel regenerated (52).
//
// WAVE 2 (next, dispatched below): action-button · usage-meter · confirm-morph ·
// radio-cards · billing-toggle · pagination · phone-input · mention-input ·
// shortcut-recorder · image-compare · carousel · code-block · filter-toolbar ·
// calendar · date-picker.
//
// REMAINING AFTER WAVE 2: date-range-picker · time-picker · color-picker ·
// expandable-card · resizable-panels · context-menu · user-menu · command-palette ·
// otp-input · file-dropzone · file-upload · rich-text-editor · signature-pad ·
// 12 more charts · tables/activity leftovers · 18 blocks · Phase 2 motion ·
// npm packaging · docs-close sweep.
```