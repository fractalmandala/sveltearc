# Task 2

> Agent B, to your question - "confirm gallery lives in `svelte-arcui/src/routes/[name]` as the visual-verification surface AND the future showcase-site content (perDOCUMENTATION.md bonus)?"

> Answer - yes, the `[...slug]` and dynamic routes etc. for docs will live there. BUT any components, `.ts` files etc created to use on the site, cannot be in `lib` or they end up in the component package. So i have created folder `site` and added it as alias to vite config so that we can use `$site: 'src/site'` 

> Agent C - next task is on you. Please confirm back here when you've brought in the playbook files into this project folder.

```agent-b
// Agent B — confirming workspace access and doc completeness in svelte-arcui.
//
// Verified present and read: AGENTS.md, DOCUMENTATION.md, PORTING-PLAN.md (copied over),
// tasks/task-1.md (A's pinned versions + vaul ruling), tasks/bits-ui-mapping.md, all three
// skills/, sample-installation-doc.md. Scaffold state matches A's task-1 report: svelte
// 5.57.x, bits-ui 2.19.3, @humanspeak/svelte-motion 1.5.0, @lucide/svelte 1.49.0;
// src/lib/{motion-tokens,media,foundation.css,use-copy-feedback.svelte.ts} present;
// $site alias + forced-runes compiler in vite.config.ts. I can access everything.
//
// Update to my mapping doc (tasks/bits-ui-mapping.md → v2), now verified against the
// INSTALLED bits-ui 2.19.3 d.ts, not just web docs — all four open checks closed (§6, §8):
//   1. Outside-click/escape: onInteractOutside + onEscapeKeydown — Radix naming ports 1:1.
//   2. DropdownMenu.Item: onSelect(event) + closeOnSelect — matches Radix.
//   3. There is NO HoverCard in bits-ui; the hover primitive is LinkPreview
//      (openDelay/closeDelay verified) → hover-card maps to LinkPreview, not Popover.
//   4. ⚠ The shared Portal has NO forceMount prop (presence layers do). Radix's
//      <Portal forceMount> ports as unconditional <Portal> + forceMount on <Content>.
//      Pinned in §8.2 so D-batch subagents don't hit the type error mid-batch.
//   Bonus finding: Dialog.Root.onOpenChangeComplete (fires after open/close animation
//   completes) is the likely home for the transitionEnd-style cleanup in Phase 2.
// A's vaul ruling absorbed (§3): drawer + bottom-sheet = bits-ui Dialog; drag-to-dismiss
// becomes Batch D/E intervention.
//
// Process notes:
// - Fence-vs-blockquote rule absorbed — my comms live in agent-b fences (and thanks for
//   fixing my v1 formatting in bits-ui-mapping.md).
// - Lane coordination for C (also pinned in bits-ui-mapping.md footer): gallery routes +
//   validator/prop-diff tooling are C's claimed lane — I am NOT building them. My lane is
//   Batch D execution (with A) + doc audits. C: pin the harness split here before building.
// - No blockers. Standing by for C's playbook confirmation and the next directive.
```

```agent-c
// CONFIRMED — base shifted to svelte-arcui, docs readable, playbook files landed.
// Access: /Users/amrit/fractalmandala/svelte-arcui opens fine.
// Docs read: AGENTS.md, DOCUMENTATION.md, PORTING-PLAN.md (§1-10 incl. agent-b
// corrections + human blockquotes), tasks/task-1.md (A done / B mapping / C lane),
// tasks/bits-ui-mapping.md (§0-7), package.json (bits-ui 2.19.3, svelte-motion 1.5.0,
// @lucide/svelte 1.49.0, $lib alias), vite.config.ts ($site -> src/site confirmed —
// gallery routes in src/routes, site-only helpers in src/site, never in src/lib),
// src/lib/ anchor footprint (motion-tokens.ts, media.ts, foundation.css,
// use-copy-feedback.svelte.ts), skills/ (5 present).
// Gallery Q from task-1: answered YES by human above — [...slug]/dynamic doc routes
// in src/routes + $site alias. Adopted; my gallery work will respect lib/site split.
//
// Playbook intake DONE (Lane C kit, copied verbatim, unadapted yet):
//   playbook/PLAYBOOK.md, playbook/REPLICATION.md,
//   playbook/canonical/gates.md, playbook/canonical/cui-lint-rules.md
//   pipeline/extract-anatomy.mjs, pipeline/extract-all.mjs, pipeline/check.mjs,
//   pipeline/gen.mjs, pipeline/compose.mjs, pipeline/lib.mjs,
//   pipeline/vocabulary.json, pipeline/axes.json, pipeline/schemas/*.schema.json (4)
//   scripts/cui-lint.mjs, scripts/cui-lib/{token-linter,svelte-ast-linter,fuzzy,
//   agent-reporter}.mjs, scripts/cui.config.json (paths still point at affedo
//   layout — repoint to svelte-arcui dirs is my next adaptation step, not done here).
// Deliberately NOT copied: generated/ output, tokens/adapters, recipes, roles.json,
// full affedo library + Tauri shell, harness-ui app code — bloat, wrong doctrine
// (we copy .module.css verbatim; no restyle-through-taxonomy compiler).
// Sources: /Users/amrit/fractalmandala/ui-automation-playbook/{PLAYBOOK.md,
// REPLICATION.md,canonical/,engine/uiautomation/pipeline/{scripts,src,vocabulary.json,
// axes.json,schemas/},engine/affedo/scripts/{cui-lint.mjs,lib/,},cui.config.json}.
// Next (mine, needs no new task file yet): repoint cui.config.json dirs at
// src/lib + src/routes, adapt gates 2/7/11 to manifest validator (coverage + prop
// parity + byte-stability), run extractor once against installed bits-ui 2.19.3
// for the 16 D-batch anatomies. Standing by for directive.
```

```agent-a
// Agent A confirming — working base shift received, access verified against real files,
// not just ls:
//
//   AGENTS.md, DOCUMENTATION.md, PORTING-PLAN.md, sample-installation-doc.md —
//     all present at svelte-arcui root, byte-identical to arc-library copies, and
//     PORTING-PLAN.md (152 lines) IS the corrected version (my $props.id()/next=2/
//     layoutId=9/classes-per-component edits are in it — so no stale-plan risk).
//   tasks/ — bits-ui-mapping.md present + identical to B's.
//   skills/ — all 5 skill folders copied (react-to-sveltekit, agentic-svelte-builder,
//     svelte-5-runes, svelte-components, svelte-runes).
//   vite.config.ts — $site: 'src/site' alias confirmed wired; also noticed runes:true
//     forced project-wide. Good pin, keeping it.
//   src/lib anchors from task-1 intact: motion-tokens.ts (the real one, not the shim),
//     media.ts, foundation.css, use-copy-feedback.svelte.ts.
//
// Noted from the human's answer to B: gallery/showcase content goes in $site, never
// $lib, so site helpers don't leak into the published component package. $lib stays
// 100% library surface — I'll enforce this in review when CONVENTIONS.md lands.
//
// Task-2 assigns work to C only. A has nothing to execute here; standing by for my
// next task directive. arc-library-main = reference area from now on; I will not edit
// files there unless told otherwise.
```