# CONVENTIONS — svelte-arcui porting law

Owner: Agent A. Briefing for every component-port task (human or subagent).
If this file and any other doc disagree, this file loses to `tasks/bits-ui-mapping.md` on
bits-ui specifics and wins on everything Svelte-side. Deviations go in the component's
manifest `gaps` — never silent, never in CSS.

Reference implementation: `src/lib/components/accordion/accordion.svelte` (+ its route,
types file, and manifest in tasks/task-4.md). Pattern-check every port against it.

## 1. Pinned decisions — do not improvise, do not re-decide

| Item | Pin |
| --- | --- |
| Alias | `$lib/` for library, `$site/` for demo/site helpers. `@/` is dead. Nothing demo-related ever goes in `$lib` (it ships in the package). |
| svelte | 5.57.1, runes mode forced project-wide (`runes: true` except node_modules) |
| primitives | bits-ui **2.19.3** only. No Tailwind. No shadcn-svelte. No vaul-svelte (evidence: tasks/task-1.md). |
| motion (Phase 2) | `@humanspeak/svelte-motion` 1.5.0, per-component fallback to `svelte/transition`/`svelte/motion` allowed, recorded in gaps |
| icons | `@lucide/svelte` — `import ChevronDown from "@lucide/svelte/icons/chevron-down"` (kebab-case file) |
| IDs | `$props.id()` — never hand-rolled counters |
| versions source | package.json is the truth; these pins recorded in tasks/task-1.md |

## 2. React → Svelte 5 translation table (ARC-specific column)

| React source | Svelte target |
| --- | --- |
| `interface Props` + fn args destructure | `let { ... }: Props = $props();` types in `<name>.types.ts` when non-trivial |
| `useState(seed)` | `let x = $state(seed)`. When seed comes from props (React seeds once), keep the initial-capture and silence the warning deliberately: `// svelte-ignore state_referenced_locally` + one-line why (see accordion). |
| `useMemo(() => v, [..])` | `let v = $derived(...)` |
| `useRef` (DOM) | plain HTML: `bind:this`; **bits-ui parts: `bind:ref={el}`** (task-4 ruling) |
| `useEffect` | `$effect(() => { ...; return cleanup })`. No top-level `window`/`document`/observers. ResizeObserver → Svelte `resizeObserver` action where possible. |
| `useCallback` | plain function |
| `useId()` | `$props.id()` |
| `createPortal` | mount point in the app shell, or component-local sibling node; decide per component, record in manifest |
| `children: ReactNode` (incl. inside item arrays) | `children?: Snippet` / `content?: Snippet`. FORWARD the snippet (`{@render item.content?.()}`); never redeclare a same-named snippet — that drops the caller's args and fakes "children always passed". This IS a documented consumer-API delta → gap entry. |
| `"use client"` | delete |
| `className` | `class`; conditional classes: `class={size === 'lg' ? \`${styles.a} ${styles.b}\` : styles.a}` (keep it boring) |
| `{cond && <X/>}` | `{#if cond}` — EXCEPT mounted-by-design nodes, see §3 |

## 3. The DOM-parity rule (Phase 1 law)

Phase 1 = mounted element contract parity + static end-states. NEVER `{#if}` a node the
React original kept mounted. 7 components use Radix `forceMount` (accordion, bottom-sheet,
card, dialog, drawer, hover-card, tabs) precisely so Phase 2 can retarget mid-flight.

- bits-ui: keep `forceMount` on presence-layer parts (Content/Overlay). The shared `Portal`
  has NO forceMount — render `<X.Portal>` unconditionally + forceMount on `<X.Content>`.
- Closed content is NOT auto-hidden by bits-ui under forceMount (that's `hiddenUntilFound`,
  which would block height springs in Phase 2). Carry the motion **end-states** as inline
  style exactly as accordion does: open → `height: auto; opacity: 1; visibility: visible`,
  closed → `height: 0px; opacity: 0; visibility: hidden`. Phase 2 replaces the style carrier
  with `<Motion>` variants — that swap must be structural no-op.
- `data-state`/`aria-*`/ids/focus/keyboard come FROM bits-ui. Nobody hand-writes them.
  Arc CSS Modules' `[data-state=...]` selectors keep working verbatim.
- Reduced motion: the still-state IS the Phase 1 render, so Phase 1 passes by construction.
  Phase 2 must keep a `duration: 0` branch per component — verify under emulation.

## 4. Anatomy first, memory never

Before wiring any bits-ui namespace: `node pipeline/extract-all.mjs --only <ns>` then READ
`pipeline/anatomy/<ns>.json`. `parts` is an OBJECT keyed by lowercase part name
(`parts.content.exportName`, not `parts[].exportName`). Props/bindables/snippets/`states`
in that file are the contract; docs and memory are not. Template-only reads of .tsx give
confidently wrong answers — that is what the extractor exists to prevent.

## 5. Styling law

- `.module.css` copied verbatim from the reference registry. NEVER edited. A needed CSS
  change = STOP, record in manifest `gaps`, escalate in the task file.
- No `<style>` blocks in components. Demo-page chrome belongs in the route file.
- Bits UI `classes` prop: NOT preemptively. Only when a real cross-component need appears,
  and then gap-recorded (else Phase 4 props-diff shows ~98 false deltas).
- Tokens come from `$lib/foundation.css` (imported by routes/shell, not by components).

## 6. Per-component deliverables (golden rule 2: doc = proof)

1. `src/lib/components/<name>/<name>.svelte` (+ `.types.ts` — the props interface MUST be
   named exactly `Props`: check-port's `portProps()` matches `interface Props`, not
   `<Name>Props`. Pilot-caught. React's `AccordionProps` → `Props` in the port file.)
2. `<name>.module.css` copied verbatim
3. `<name>.manifest.json` PERSISTED in the component folder (C's check-port gate; schema-
   shaped JSON: `status` from the schema enum — `"still-port"` for phase 1 — and record
   the "1-still-port" phase sentence in `gaps`. NO extra top-level keys: the schema is
   `additionalProperties: false`; a top-level `phase` field fails it, C's dropdown-menu
   audit set this precedent — schema: `skills/react-to-sveltekit/references/output-contract.schema.json`)
4. Demo + doc land via C's gallery harness — `src/site/demos/<name>.svelte` +
   `src/site/docs/<name>.ts` (DocMeta shape; auto-discovered, appears at
   `/components/<name>`). Do NOT create scratch routes in `src/routes/<name>/` —
   two conventions confuse (pilot went through this; the gallery demo loads lazily
   client-side, static-HTML evidence of the COMPONENT comes from its SSR contract).
   Demo pattern for data-driven Snippet content: `{#snippet}` blocks + script-level
   `const items = [{ content: snippetVar }]` — compiles to hoisted function decls, verified safe.
5. Doc content quality per DOCUMENTATION.md structure; authored-by-X, audited-by-Y, never
   self-audit; the gallery page IS the live-demo proof surface

## 7. Gates (batch gate = merge gate)

```
npm run check            # 0 errors, 0 warnings (warnings silenced only §2 with reason)
npm run build            # clean
node scripts/cui-lint.mjs --json   # [] + exit 0 (your files at minimum)
npm run check:port       # ok <name>
```
+ manual per mapping §5: mid-flight retarget (rapid toggling), reduced-motion emulation,
DOM diff sanity (mounted nodes, data-state), props-contract diff vs
`arc-library-main/public/r/<name>.json` (only documented deltas allowed).

Known harness gap (A→C): cui-lint matches tag NAME against anatomy namespaces, so a demo
route importing an ARC component called `<Accordion>` gets flagged as bits-ui Accordion.
Until the linter scopes to imports-from-'bits-ui' only, alias the tag in demo routes
(`ArcAccordion`) and note it in the manifest.

## 8. Ownership (task-1 process rules, reaffirmed)

- One agent per component folder per batch, no exceptions, no cross-editing even to
  "help" — flag in the fence instead.
- CONVENTIONS.md: A. bits-ui mapping: B. harness/validator/gallery shell: C.
  package.json / vite.config / svelte.config: shared — change only via task-file note.
  Current config truth: kit options in `vite.config.ts` WIN (svelte.config.js is ignored
  by the plugin while options are passed there) but `svelte.config.js` is still required
  for svelte-check's preprocess of `lang="ts"`. Consolidation is an open human decision
  (noted task-4); both files are kept mirroring-identical meanwhile.
