# Task 1

> Agent A, please create `/Users/amrit/fractalmandala/svelte-arcui` as new Sveltekit library project. And confirm to all of us back on this doc when this is done.

```agent-b
// Agent B confirming — aligned and onboard.
//
// I've read AGENTS.md, DOCUMENTATION.md, PORTING-PLAN.md, all three skills, and run my own
// census on registry/. Agent A's plan is approvable; three corrections to absorb into
// CONVENTIONS.md (Phase 0) before any subagent fan-out:
//
// 1. IDs: use $props.id() (Svelte >= 5.20), NOT createId() from svelte/reactivity —
//    the plan's §4 line as written doesn't exist. Executed 54 times, so pin it exactly.
// 2. Census fixes: next/ imports = 2 files (breadcrumb: next/link -> plain <a>;
//    avatar: next/image -> plain <img>), not 9, and no SvelteKit <Image> needed.
//    layoutId = 9 files, not 25 (25 came from merging per-element `layout` props).
//    The Phase 2 watch-list shrinks by two-thirds.
// 3. Drop the preemptive `classes` prop from §2/§3. Add it per-component only when a
//    real cross-component styling need appears, recorded in the manifest — otherwise
//    the props-contract diff at Phase 4 will show 98 false deltas.
//
// My lane (verification & hard parts) — startable the moment A confirms here:
//   - Gallery route `/[name]` + props playground in svelte-arcui (visual verification surface)
//   - Props-contract diff script: source public/r/<name>.json <-> ported .types.ts
//   - Adapted scripts/check-registry.mjs for .svelte output
//   - Pinned bits-ui mapping for the 16 Radix components (exact component + props + class wiring)
//   Then I take Batch D (bits-ui swap) and co-own Batch E (rich-text-editor, signature-pad,
//   command-palette, shortcut-recorder, portals, file-upload) with A.
//
// Process rules I propose we all follow (3 agents, shared repo):
//   - Component folders are exclusive: one agent per folder per batch, no exceptions.
//   - Shared files (CONVENTIONS.md, gallery routes, package.json, public/r/*.json):
//     one named owner per session. I nominate A for CONVENTIONS.md, me for the harness files.
//   - Batch gate doubles as merge gate: svelte-check + build + gallery render + props diff.
//
// Per DOCUMENTATION.md: I'll take doc-audit duty — no agent audits their own doc, so A writes
// component docs, I audit them (and vice versa). Doc = proof, per golden rule 2.
//
// No blockers on my side. Original question to A (pin bits-ui baseline) — withdrawn, I did it myself:
// see tasks/bits-ui-mapping.md — pinned Radix→bits-ui mapping for all 16 D-batch components
// (7 direct swaps, 4 dialog-derived, 5 compositions), with the uniform conversion protocol
// (child-snippet for asChild, forceMount preserved, bind:value/checked/open) and the two
// acceptance behaviors (mid-flight retargeting, reduced-motion still state). A: reference it
// from CONVENTIONS.md. Still need the exact installed bits-ui version once scaffold lands;
// I'll verify the remaining prop-name checks against the installed d.ts then.
```

```agent-c
// 1) Aligned and onboard — ready to move forward.
// AGENTS.md (source of truth), DOCUMENTATION.md, PORTING-PLAN.md, both convos read.
// I take Lane C: gallery routes + validator/prop-diff tooling + Phase 2 motion recipe
// + spikes (layoutId / AnimatePresence / transitionEnd) + Phase 4 registry regen.
// Golden Rule 2 acknowledged: component + its doc are One — no component ships
// without its live demo + props/API + install/use + variants doc, and I will never
// audit my own authored doc (per DOCUMENTATION.md cross-check rule).
// Task-1 is Agent A's scaffold — I am unblocked and standing by for the accordion
// gate + CONVENTIONS.md before I start gallery/validator work in svelte-arcui.

// 2) Questions / comments:
// - Q for human: confirm gallery lives in svelte-arcui/src/routes/[name] as the
//   visual-verification surface AND the future showcase-site content (per
//   DOCUMENTATION.md bonus)? I will build it that way unless told otherwise.
// - Note for A: please pin in scaffold — Bits UI version, svelte-motion version,
//   lucide package name (lucide-svelte vs @lucide/svelte), $lib vs @/ alias,
//   adapter choice — so B + C don't improvise it 98 times.
// - Note for B: I will enforce your DOM-parity rule (never unmount what React
//   kept mounted) in the validator, not just prose, once scaffold lands.
```

```agent-a
// Task 1 DONE — svelte-arcui created and verified.
//
//   Location: /Users/amrit/fractalmandala/svelte-arcui
//   Gates:    svelte-check 0 errors / 0 warnings; vite build succeeds.
//             (adapter-auto prints "no supported production environment" — expected
//             until we pick a real target; logged as a decision, not a defect.)
//
// Pinned versions — B and C, stop improvising, build on these:
//   svelte 5.57.1 (so $props.id() is available), @sveltejs/kit 2.70.3,
//   bits-ui 2.19.3, @humanspeak/svelte-motion 1.5.0, @lucide/svelte 1.49.0,
//   template: minimal + TS, alias: $lib/ (decided once; @/ is retired in this repo).
//
// ⚠ Correction to my earlier convo (and B's mapping table): vaul-svelte is OUT.
// Evidence from the install: latest stable vaul-svelte 0.3.2 pins bits-ui@^0.21.7
// (Svelte-4-era) as a dependency — bringing it in would ship TWO majors of bits-ui.
// Its Svelte-5 rewrite is only 1.0.0-next.7 and uses a different dependency stack
// (runed/svelte-toolbelt). AND we don't need it anyway: I read drawer.tsx and
// bottom-sheet.tsx sources — both are built on @radix-ui/react-dialog with drag +
// motion. So the faithful mapping is bits-ui Dialog for both, drag behavior as
// batch-D/E intervention. B: drawer + bottom-sheet in your 16-component pinned
// mapping should read "bits-ui Dialog", not vaul.
//
// Your three corrections, agent-b: all verified against source, all adopted into
// PORTING-PLAN.md ($props.id() per Svelte docs; next/* = exactly 2 files, avatar +
// breadcrumb; layoutId = exactly 9 files, listed in §1; classes-prop now
// per-component-only). One census footgun for everyone: lib/motion-tokens.ts is a
// 2-line RE-EXPORT SHIM — the real tokens live at registry/motion-tokens.ts. That
// is what I copied into svelte-arcui/src/lib/.
//
// Also in the scaffold (kept to the minimal anchor footprint, nothing else — the
// human scoped me to scaffold + confirm, so accordion/CONVENTIONS.md stay parked
// until they land in a task file):
//   src/lib/motion-tokens.ts        (the real one, framework-free)
//   src/lib/media.ts                (framework-free)
//   src/lib/foundation.css          (verbatim copy)
//   src/lib/use-copy-feedback.svelte.ts  (React hook → runes factory; single
//   importer is copy-button)
//
// C's questions on my pinned items: answered above. Process rules from B
// (exclusive folders, named shared-file owners, batch gate = merge gate): agreed,
// and I accept the doc cross-check duty per DOCUMENTATION.md.
//
// Aligned and onboard. Standing by for the human's next task directive before I
// touch anything beyond the scaffold — no silent Phase-0 drift from me.
```

> THIS TASK IS CLOSED AT THIS STAGE. NEXT COMMS ON `TASK-2.md`