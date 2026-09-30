# Porting Plan: arc-library (React) → svelte-arcui (SvelteKit)

## 1. Inventory (measured, not estimated)

| Artifact | Count | Notes |
| --- | --- | --- |
| Components (`.tsx`) | 98 dirs, ~23,700 LOC | 97 `registry:ui` JSONs |
| Blocks | 22 JSONs / 19 dirs | Multi-file compositions importing components (e.g. `hero-section` = 6 `.tsx` + own CSS Modules + `hero-motion.ts`) |
| Foundation | `arc-foundation.json` → `registry/foundation.css` + `registry/motion-tokens.ts` | Framework-agnostic; port as-is |
| Shared lib | `lib/motion-tokens.ts` (imported by 95 files), `lib/media.ts`, `lib/use-copy-feedback.ts` | Anchor files; port in Phase 0 |
| CSS | 1 `.module.css` per component/block | Copied verbatim |

> Even if the actual number if 92 not 98, or Blocks have 15 JSONs, etc., the EXACT PRECISION of these numbers is a matter of discovery. We will find out by doing. Don't get hung up in precision of a priori planning. Execution determines all.

Dependency census driving the batches:

- `motion/react`: 95/98 components. `AnimatePresence`: 81. `layoutId`: **9** files (tabs, signature-pad, calendar, card, date-range-picker, segmented-control, chat-thread, tree-view, notification-center); broader `layout`/`layout=` appears in ~20 more — Phase 2 watch-list sized on layoutId=9 (agent-b correction, verified).
- `@radix-ui/*`: 16 — accordion, bottom-sheet, card, checkbox, dialog, drawer, dropdown-menu, hover-card, notification-center, popover, select, split-button, swipe-actions, switch, tabs, tooltip.
- No motion at all (pure Tier 3): popover, scroll-area, text-reveal.
- `next/*` imports: **2 files only** (agent-b correction, verified) — avatar (`next/image` → plain `<img>`), breadcrumb (`next/link` → plain `<a>`). No SvelteKit `<Image>` needed.
- `createPortal`: context-menu, user-menu (→ mount-point pattern).
- Canvas: signature-pad, activity-heatmap.
- Hooks: useRef 88, useState 85, useEffect 75, useId 54, useMemo 29, useCallback 27.

---

## 2. Locked decisions

1. **Mirror project**: new sibling folder `/Users/amrit/fractalmandala/svelte-arcui`, SvelteKit + Svelte 5 runes + TS. Source repo untouched.
2. **Primitives**: plain **Bits UI** (headless, style-free) for the 16 Radix components. No Tailwind, no shadcn-svelte wrappers. ARC CSS Modules supply all styling. Verified Bits UI catalog: Accordion, Checkbox, Dialog, DropdownMenu, Popover, Select, Switch, Tabs, Tooltip exist headless. Mapping table (per agent-b review):
   - drawer, bottom-sheet → **vaul-svelte** (`huntabyte/vaul-svelte`, built on Bits UI Dialog by the shadcn-svelte author).
   - split-button → Bits UI DropdownMenu + ARC Button; notification-center → dropdown composition.
   - hover-card → **unverified in Bits docs (404 as of 2026-09-30)**: either Bits Popover configured for hover, or a documented fallback. Pinned as a Phase 0 decision item.

> Add here documentation step for each component. As refered to in AGENTS.md and DOCUMENTATION.md

3. **Motion**: two-phase split.
   - Phase 1 contract is **DOM parity, not visual parity** (agent-b rule, adopted): every port keeps the *mounted element contract* of the React original — what's in the tree, `data-state`/`aria-*`, visibility end-states — with animation end-states applied **statically** (no transitions). Definition of done = the reduced-motion still state renders AND the DOM matches the original.
   - **Never conditionally unmount what React kept mounted.** 7 components use Radix `forceMount` (accordion, bottom-sheet, card, dialog, drawer, hover-card, tabs) precisely so mid-flight toggles *retarget* the spring instead of restarting. Phase 1 keeps those elements mounted (`inert`/`aria-hidden`/visibility for the a11y exit); `{#if}` on a forceMounted node fails the gate even if it looks right.
   - Phase 2 wires `@humanspeak/svelte-motion` by swapping still→spring variants. No structural edits in Phase 2 if Phase 1 held the DOM contract.
   - Escape hatch is **per component, not global** (agent-b): when svelte-motion can't express something (author's own caveat: no 100% API compat), fall back to `svelte/transition`/`svelte/motion` for that component and record it in its manifest. Reduced-motion path must be verified per component — every ARC file encodes it.
4. **Styling**: `.module.css` files copied verbatim; consumed via `import styles` + `class:` directives. The Bits UI `classes` prop is NOT used preemptively — added per-component only when a real cross-component styling need appears, recorded in that component's manifest (agent-b correction: otherwise the Phase 4 props-contract diff shows ~98 false deltas). Skill's "convert to CUBE SASS" step is deliberately NOT applied (repo-specific deviation).
5. **Verification**: every batch gate = `svelte-check` + `vite build` + gallery route renders + props-contract diff vs the component's `public/r/*.json`.

---

## 3. Target repo shape

```
svelte-arcui/
  src/lib/
    motion-tokens.ts          # ported Phase 0, byte-compatible API
    media.ts
    components/
      <name>/<name>.svelte
      <name>/<name>.module.css   # copied verbatim
      <name>/<name>.types.ts     # when props are non-trivial
    blocks/<name>/...             # Phase 3
  src/routes/
    /+page.svelte                 # gallery index: one card per component
    /[name]/+page.svelte          # per-component demo + props playground (visual verification surface)
  public/r/<name>.json            # Phase 4 regenerated svelte registry items
```

First worked example (gold standard, done by main agent, not a subagent): **accordion** — it exercises every convention: props contract → `$props()`/`$bindable`, ReactNode → `Snippet`, Radix → Bits UI Accordion, still-state motion, CSS Module classes.

> Each step here will be a task we will track together realtime.
> At any given time, this doc is as accurate only as the next pending step. Plans beyond that can always change.

## 4. Phase 0 — Anchor + conventions (~1 session)

1. Scaffold SvelteKit (TS, `svelte@5`, `@sveltejs/adapter-auto`), install `bits-ui`, `vaul-svelte`, `@humanspeak/svelte-motion`, `@lucide/svelte` (verified current package; `lucide-svelte` is deprecated).
2. Port the four external footprints — the only cross-folder imports in the whole registry (agent-b): `motion-tokens.ts` (95 components — not all 98; popover/scroll-area/text-reveal skip it), `media.ts`, `use-copy-feedback.ts` (single importer: copy-button → tiny runes module), and `registry/foundation.css` (token layer, framework-free, copied verbatim).
3. Author `CONVENTIONS.md` in svelte-arcui (the subagent briefing doc) fixing:
   - **Alias policy — decided once here, not improvised 98 times**: `$lib/` replaces `@/` in every import.
   - Props: `interface Props` in `.types.ts`; `children?: Snippet` replaces any `ReactNode` prop; two-way props (`open`, `value`) use `$bindable()`.
   - IDs: `useId()` → **`$props.id()`** (Svelte ≥ 5.20, SSR-hydration-consistent; agent-b correction, verified in Svelte docs).
   - Refs: `useRef` → `bind:this` + `$state<HTMLElement|null>`.
   - Effects: `useEffect` → `$effect` with cleanup return; no top-level `window`/`document`/observers (66 components use ResizeObserver → Svelte `resizeObserver` action preferred).
   - Motion placeholders: **DOM parity rule (§2.3)** — every animated element stays mounted as in the original, carries `data-state` and a stable class from the copied CSS Module; end-states applied statically; a11y exit via `inert`/`aria-hidden`, never `{#if}` on a forceMounted node.
   - Icons: `lucide-react` → `@lucide/svelte`, one name-mapping rule in the recipe (57 components).
   - Events/`className`/conditionals/loops: per react-to-sveltekit skill §§1–3 tables.
   - Output contract: each ported file ships a manifest JSON per skill's `output-contract.md`, with `status: still-port` in Phase 1.
4. Port accordion end-to-end + its gallery route. Gate: svelte-check, build, visual parity vs still-state screenshot of the React original.

Deliverable: repo compiles, one component passes all gates, CONVENTIONS.md exists → fan-out is safe.

---

## 5. Phase 1 — Raw port batches (subagent fan-out)

Each batch runs as parallel subagents, 1 component per task, briefed with: source dir path, target path, its `public/r/<name>.json`, CONVENTIONS.md, and accordion as reference implementation. Batch gates before the next batch starts.

| Batch | Members | Count | Recipe / risk |
| --- | --- | --- | --- |
| **A — pure state/CSS** | scroll-area, text-reveal + all components with timers/CSS only, no motion, no primitives | ~3–10 | Trivial; skill Tier 3 tables direct |
| **B — standard motion (still-state)** | everything using `motion/react` WITHOUT `AnimatePresence` first, then with | ~82 | Phase 1 renders still variants; structure must match §4 conventions |
| **C — charts/SVG** | bar, line, donut, sparkline, gauge, treemap, streamgraph, ridgeline, slope, waffle, brush, activity-heatmap (canvas), calendar, date-picker, date-range-picker, time-picker | ~16 | Mostly pure math + SVG attrs → `bind:this`, `$derived`; check numeric formatting and `preserveAspectRatio` |
| **D — Bits UI swap** | the 16 Radix components (list in §1) | 16 | Main-agent review per component; use the §2.2 mapping table (Bits UI / vaul-svelte / composition) as a lookup, no per-component primitive judgment; acceptance criterion is a11y + DOM-contract parity, not markup similarity |
| **E — special cases** | rich-text-editor (contentEditable), signature-pad (canvas), command-palette, shortcut-recorder (keydown capture), context-menu + user-menu (portals), file-upload/file-dropzone (DataTransfer), otp-input, mention-input, phone-input | ~12 | Sequential, 1–2 per session, human-reviewed. Portal → single app-level mount point + `<svelte:component>` or teleport. |

Batch order: A → (B ∥ C) → D → E. Batches A–C are fully scriptable; D needs the pinned recipe; E is the intervention list (revised: ~12 components, not ~20).

ReactNode → Snippet change means the *consumer API differs* from the React library even when markup is identical. Accepted; recorded in each manifest's `gaps`.

---

## 6. Phase 2 — Motion wiring

Per component with `motion/react` (95): swap still definitions for the spring/variant configs, mapping `animate`/`variants`/`initial={false}`/`transitionEnd` to svelte-motion `<Motion>` props. Subagent-able in batches of ~10 with visual verification on the gallery route against the React live demo at uiarc.dev.

Explicit watch-list (known hard mappings — verify against svelte-motion docs before wiring):
- `transitionEnd` (used for `visibility: hidden` / `filter: none` cleanup) — may need `on:animationend` equivalents.
- `AnimatePresence` exit orchestration with `custom` — 81 components; test one representative per exit pattern first.
- `layoutId` shared layout — **9 components** (list in §1); if svelte-motion support proves flaky, fallback = FLIP via `svelte/animate` `fly`/custom action. This is the one place the plan tolerates degraded fidelity with an honest `gaps` entry.
- `useReducedMotion` → `mediaQuery` matchMedia wrapper from `lib/media.ts`.

Definition of done per component: interactive behavior parity on the gallery page, reduced-motion path still correct.

---

## 7. Phase 3 — Blocks

22 blocks, after all their component dependencies pass. Blocks import components (`@/registry/components/button/button` → `$lib/components/button/button.svelte`) and carry their own CSS Modules + `hero-motion.ts`-style helper modules. Same Phase 1 → Phase 2 pattern per block, sequential batches (site-header, page-header, hero-section, …). Highest reuse of already-ported pieces; low new risk.

---

## 8. Phase 4 — Registry regeneration + final gates

1. Emit `public/r/*.json` per component with: `files` → `.svelte` + `.module.css`, `dependencies` → `bits-ui` / `@humanspeak/svelte-motion` / `lucide-svelte`, `registryDependencies` → svelte `arc-foundation`. Adapt `scripts/check-registry.mjs`.
2. Full-project gates: `svelte-check` clean, production build clean, every gallery route renders, props-contract diff report (source JSON props vs ported `.types.ts`) with 0 unexplained deltas.
3. Fidelity report: one table, all ~120 items, status `ship | partial (gaps listed) | blocked`. Nothing marked done without manifest evidence (per skill §0).

---

## 9. Effort & parallelism (honest)

- Phase 0: 1 focused session (main agent).
- Phase 1 A+B+C: ~95 components, subagent fan-out ~10 parallel per batch, batch gate each round → several sessions, low intervention.
- Phase 1 D+E: ~28 components with review gates → the real human time.
- Phase 2: mechanical per the swap recipe but visual-verifying 95 components; expect interventions concentrated in the layoutId/AnimatePresence watch-list.
- Phase 3–4: smaller tails.

Total: feasible, workflow-heavy, with ~30 components and the motion watch-list as the genuine intervention points. Everything else is the script.

---

## 10. Open items needing user (none block Phase 0)

1. Pin the two primitive asterisks from the agent-b review: Bits UI **hover-card** (docs 404 — confirm absent, choose Popper-hover construction) and **vaul-svelte** version/dependency surface for drawer + bottom-sheet.
2. Screenshot source for visual parity: uiarc.dev live demos vs local React build (local dev server needed to run the React side-by-side; confirm you want it launched).
3. `adapter-auto` vs specific adapter / static vs SSR gallery — default: static-SSR gallery, revisit only if build complains.
