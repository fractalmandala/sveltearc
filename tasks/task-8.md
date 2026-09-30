# Task 8: Docs Close-Out & Section 1 Guides — fresh board

> **Lead note:** Task 7 reached 1,360 lines. This is the fresh working board.
> `tasks/task-7.md` stays as the **evidence archive** — link to it, do not append.
> Everything below is the live state; nothing in Task 7 is lost.

## 0. Where we are (carry-forward)

The four documented gaps (`DOCUMENTATION.md`) are **built, wired, and audited**:

| Gap | Lane | Owner | Audit |
| --- | --- | --- | --- |
| G3 canonical grouping | `groups.ts`, migration, registry, index | A | B → APPROVED |
| G1 right-side ToC | `toc.ts`, `OnThisPage.svelte` | B | C → PASS-FULL (runtime re-run) |
| G2 page actions + markdown | `markdown.ts`, `PageActions.svelte`, `/markdown`, `/llms.txt` | C | D → FIX-FIRST → F1–F6 applied, **D re-audit pending** |
| G4 search | `search.ts`, `SearchPalette.svelte`, `SearchTrigger.svelte` | D | A → PASS |
| Wave 2 shell wiring | `+layout.svelte`, `[name]/+page.svelte`, `site.css` | **Lead** | C → PASS + 1 finding (fixed) |

**Lead's shell fix (done this pass):** C's narrow-viewport overflow finding —
`.shell` is now `280px minmax(0, 1fr) 280px`, and the ToC rail collapses under
1100px (`site.css:28`, `site.css:55`). `npm run check` 0/0, `npm run build` ✓.

Current gates: `check` 0/0 · `lint:agent` 0 · `check-port` 35 / 0 errors · `build` ✓.

## 1. Open items — the only work left before Task 7 seals

| # | Item | Owner | Acceptance |
| - | --- | --- | --- |
| **O1** | Re-audit Lane C (F1–F6) | **D** | F1: table-cell re-count = 0 across all 35 docs. F2: each of the 4 copy paths shows a visible confirmation. F3: Escape closes + returns focus to the chevron; chevron toggles `aria-expanded`; no label-in-name mismatch. Then **seal Lane C REAL & SHIPPED**. |
| **O2** | Co-sign layout/nav audit | **A** | Co-sign C's shell-audit evidence (Task 7 blocks) or re-run; note the overflow fix landed at `site.css:28/55`. |
| **O3** | ToC runtime — final single record | **B or C** | One headless pass on a wired doc page: scroll-spy highlights on scroll, ToC click scrolls + sets hash, empty state renders nothing. C already reproduced this in Task 7; record once and close. |
| **O4** | Overflow fix verify | **C** | At 764px viewport: no horizontal page scroll on `/components/button` or `/` (was 428px / 86px). |

When O1–O4 are green, Task 7's four gaps are **shipped** and Task 8's second half opens.

## 2. Next wave: Section 1 guides (the post-core stretch, now in scope)

`DOCUMENTATION.md` §"Full docs structure" — Section 1: **Introduction, Installation,
Theming, Motion, AI and MCP, Changelog**. These are standalone guides, not components.
The sidebar already reserves the six slots (currently inert `<p>` placeholders).

### 2.1 Frozen content model — `src/site/guides.ts` (Lead)

```ts
export interface GuideSection { id: string; title: string; body: string } // body = markdown
export interface Guide {
  slug: string; title: string; description: string; order: number;
  sections: GuideSection[]; source?: string;
}
export const GUIDES: Guide[];
export const GUIDE_BY_SLUG: Record<string, Guide>;
```

### 2.2 Renderer — `src/routes/docs/[slug]/+page.svelte` (owner: D)

Renders `GUIDE_BY_SLUG[slug]`: title, description, each section as `<h2 id data-toc>`
(reuses the existing `OnThisPage` rail for free), markdown body rendered to HTML.
Unknown slug → not-found block. Same 3-column shell; rail works with no new code.

### 2.3 Content — one or two guides per agent (each owns its own files)

| Guide | Route | Owner | Source |
| --- | --- | --- | --- |
| Introduction | `/docs/introduction` | A | `uiarc.dev/docs/introduction` |
| Installation | `/docs/installation` | A | `sample-installation-doc.md` + `uiarc.dev/docs/installation` |
| Theming | `/docs/theming` | B | `foundation.css` + uiarc theming |
| Motion | `/docs/motion` | B | `motion-tokens.ts` + Phase 1/2 doctrine |
| AI and MCP | `/docs/ai-mcp` | C | `llms.txt` + registry + MCP notes |
| Changelog | `/docs/changelog` | C | repo CHANGELOG / task history |

### 2.4 Sidebar wiring (Lead)

The six placeholder `<p>` items in `+layout.svelte` become real links to the guide
routes, driven by `GUIDES` order. Lead owns the layout; agents own content files.

### 2.5 Ownership (disjoint)

| Path | Owner |
| --- | --- |
| `src/site/guides.ts` | Lead |
| `src/routes/docs/[slug]/+page.svelte` | D |
| `src/site/guides/<slug>.ts` (6 files) | A (2) · B (2) · C (2) |
| `src/routes/+layout.svelte` (sidebar links) | Lead |

## 3. Roster

- **Lead** — frozen model, layout wiring, audit seal, conflict arbitration.
- **A** — Introduction + Installation.
- **B** — Theming + Motion.
- **C** — AI and MCP + Changelog (+ close-out O4).
- **D** — guide renderer + O1 re-audit.

## 4. Gates (every lane, before reporting)

```bash
node scripts/check-port.mjs   # 0 errors
npm run check                 # 0 errors / 0 warnings
npm run lint:agent            # 0 violations
npm run build                 # ✓ built
```
Plus the lane's own acceptance. Reproduced output only — intent is not evidence.

## 5. Cross-audit (Golden Rule 2 — no self-audit)

| Authored by | Audited by |
| --- | --- |
| A (Introduction, Installation) | B |
| B (Theming, Motion) | C |
| C (AI and MCP, Changelog) | D |
| D (guide renderer) | A |
| Lead (`guides.ts`, sidebar wiring) | B + D |

## 6. Comms

- Report and audit in **this** file, in ```` ```agent-<name> ```` blocks. Blockquotes are the human's.
- One lane per agent; folder/file exclusivity per §2.5.
- Interface changes: post and wait for the Lead's ack.
- Task 7 is the archive — reference it by path, never append to it.

---

```agent-lead
// ════════════════════════════════════════════════════════════════════════════
// LEAD DISPATCH — TASK 8
// ════════════════════════════════════════════════════════════════════════════
// Fresh board. Task 7 = archive. Two halves: close-out (O1–O4), then Section 1.
//
// ROSTER — LOCKED:
//   A = Introduction + Installation · B = Theming + Motion ·
//   C = AI and MCP + Changelog (+ O4) · D = guide renderer + O1 re-audit ·
//   Lead = guides.ts model, sidebar wiring, seal.
//
// ─── CLOSE-OUT FIRST (before any Section 1 code) ────────────────────────────
//   D: O1 — re-audit Lane C on F1–F6 (table re-count 0; copy confirmation on all
//      4 paths; Escape/focus/aria-expanded; no label-in-name mismatch). Seal it.
//   A: O2 — co-sign the layout/nav audit (C's evidence in Task 7; overflow fix
//      now live at site.css:28/55).
//   B or C: O3 — one headless ToC runtime record, then close.
//   C: O4 — verify no horizontal scroll at 764px post-fix.
//
// ─── THEN SECTION 1 ─────────────────────────────────────────────────────────
//   Lead freezes src/site/guides.ts + wires the six sidebar links.
//   D builds src/routes/docs/[slug]/+page.svelte (reuses OnThisPage for free).
//   A/B/C author their two guides each, per §2.3 sources.
//
// Post close-out results here; I'll flip to Section 1 the moment O1–O4 are green.
// Lane E is now Task 8's §2 — no longer a maybe.
```

```agent-b
// ════════════════════════════════════════════════════════════════════════════
// O3 — TOC RUNTIME, SINGLE RECORD — CLOSED
// ════════════════════════════════════════════════════════════════════════════
// Headless Chrome, 1440×900, against vite dev http://localhost:5174.
// Wide viewport on purpose: under 1100px the rail is display:none (site.css:55),
// which is the overflow fix, not the empty state. Prior pass lives in
// tasks/task-7.md (agent-c doc-page audit). This is the Task 8 record.
//
// /components/button
//   nav.toc ready. 16 [data-toc] headings, 16 links, same order.
//   rightbar computed display: block.
//   Scroll, one aria-current="location" each time, matching the offset rule
//   (last heading whose document-top has crossed scrollY+96):
//     live-specimen  scrollY 212  → #live-specimen
//     installation   scrollY 740  → #installation
//     api-reference  scrollY 1975 → #api-reference
//   Click the "Usage" rail link:
//     location.hash = #usage
//     #usage at 0px from the viewport top
//     aria-current = #usage
//
// Empty state, same viewport, after the client effect:
//   /                          toc nodes 0, links 0, data-toc 0, rightbar text empty
//   /components/not-a-component   same
//   The rightbar element stays in the grid; OnThisPage renders nothing inside it.
//
// O3 is closed. Theming and Motion stay put until the Lead flips to Section 1.
```
```agent-d
// ════════════════════════════════════════════════════════════════════════════
// O1 — RE-AUDIT, LANE C (page actions + markdown I/O) — auditor: D
// Archive of the original FIX-FIRST findings: tasks/task-7.md (my §8 block).
// ════════════════════════════════════════════════════════════════════════════
// Method: fresh vite dev (:5199), curl for endpoints, real DOM clicks for the UI with
// navigator.clipboard stubbed (captures writes, can be forced to throw). Lane C files
// not edited by me.
//
// VERDICT: PASS — F1, F2, F3, F4, F5, F6 all verified fixed. Lane C = REAL & SHIPPED.
//
//   F1 table pipes — 35/35 endpoints 200; 303 table rows across Props + Keyboard
//      sections, 40 escaped `\|`, rows whose cell count != header: 0 (was 13 docs).
//      Two GETs of /button/markdown: identical md5. 404 for unknown slug unchanged.
//   F2 visible confirmation — all four copy paths show it and it survives the menu
//      closing: Copy page -> "✓ page copied"; menu "Copy page as Markdown" -> "✓ page as
//      Markdown copied"; link -> "✓ link copied"; install -> "✓ install command copied".
//      Shown on the primary button AND the aria-live span; both reset after ~2s. Forced
//      clipboard rejection -> "Copy failed", resets to "Copy page" (R5 executed, not just
//      read). Clipboard contents: Copy page and menu-Markdown are byte-equal to the endpoint
//      (fetched no-store); link = origin + /components/dialog; install = the doc's CLI line.
//   F3 disclosure/a11y — panel has no role=menu and items have no menuitem roles (disclosure
//      list); chevron aria-expanded false->true->false, aria-controls="pa-panel-dialog"
//      resolves to a real element; Escape closes, aria-expanded=false, focus lands on the
//      chevron (Escape pressed while focus was on the primary button); outside click closes;
//      primary button has no aria-label, so accessible name === visible "Copy page".
//   F4 AI links — prompt is now "Read <abs markdown URL> and help me use the Dialog
//      component…"; hrefs are 195-220 chars (was ~8,060). All four target=_blank with
//      rel=noopener noreferrer.
//   F5 llms.txt — 200 text/plain; 35 entries; URLs use the request origin (0 occurrences
//      of the old vercel domain); header now describes the real layout.
//   F6 — install subtitle resolves from the CLI string ("pnpm" for the dialog).
//
// REMAINING NITS (not blocking the seal):
//   · Status copy reads awkwardly: "✓ page copied" / "✓ page as Markdown copied".
//     "✓ Copied" or "✓ Markdown copied" would read better. Lane C's call.
//   · Because F4's prompt embeds the page origin, AI links made on a dev/local origin hand
//     the AI a localhost URL it cannot fetch. Fine in production; don't judge the links
//     from dev. (This is inherent to F4's design, not a defect.)
//   · markdown endpoint Cache-Control is max-age=3600: my own browser served a stale
//     pre-F1 body until I fetched with no-store. Correct for production; expect staleness
//     for anyone testing through a browser against a long-lived origin.
//   · Not verified: real pasteboard; whether the four AI sites honour the prefilled query;
//     pixel match to ref-pageoptions.png.
//
// GATES (this pass):
//   npm run check   -> 0 errors / 0 warnings
//   lint:agent      -> 0 violations
//   check-port      -> 35 components, 0 errors, 14 warnings
//   npm run build   -> ✓ built
//
// O1 CLOSED. Lane C sealed. Moving to §2.2: the guide renderer — waiting on Lead's
// frozen src/site/guides.ts (not in the tree yet) before I write the route.
```

```agent-a
// ════════════════════════════════════════════════════════════════════════════
// O2 CLOSE-OUT — CO-SIGN: LAYOUT/NAV AUDIT + OVERFLOW FIX VERIFIED
// ════════════════════════════════════════════════════════════════════════════
// Read-only verification; no file edits. FYI: the running :4173 preview had to
// be RESTARTED — the old process (started 16:35) predated the Lead's build
// (manifest 16:51); `vite preview` serves the build snapshot it loaded, not the
// new output. Anyone pointing at :4173 next: it now serves the post-fix build
// (I restarted it, HTTP 200 verified).
//
// CO-SIGN, explicit: I co-sign C's Task 7 shell-wiring evidence (blocks 1136 /
// 1326) now that its one finding is fixed — my own Task 7 audit (agent-a block
// in tasks/task-7.md) found the same issue from the other side (worst case I
// measured: /dialog +696 @764). O2 satisfied on my side.
//
// FIX, source-read: site.css:28 → `grid-template-columns: 280px minmax(0, 1fr)
// 280px`; site.css:55-63 → @media (max-width: 1100px): 2 tracks (280px +
// minmax(0,1fr)) and .rightbar { display: none }.
//
// RE-RUN @764, fresh loads on the restarted preview (sW−cW):
//   /          grid "280px 484px" · rail display:none · sW 764 == cW →  0   (was +86)  ✓
//   /button    grid "280px 484px" · rail display:none · sW 771       → +7   (was +428)
//   /dialog    grid "280px 484px" · rail display:none · sW 818       → +54  (was +696)
//
// SHELL-LEVEL OVERFLOW: CLOSED. The min-content floor is gone (track model:
// minmax(0,1fr) cannot floor), the rail collapses as designed, index is
// literally 0, and both doc pages dropped from hundreds of px to ≤54.
//
// RESIDUAL (content-level, NOT shell): the remaining pixels on both doc pages
// are the API props TABLE. Offender list = TABLE/THEAD/TR/TH/TBODY/TD only;
// sW equals the table's right edge exactly. Table parent = SECTION.panel,
// overflow visible; nothing wraps tables in a scroll container (site.css's
// `pre { overflow:auto }` covers code only). Table min-content ≈ 466 (button)
// / 513 (dialog) > the 434px mobile content column.
//   → O4 decision input, C: "/button" is NOT literally 0 post-fix — it is +7.
//     If "no horizontal page scroll" must be literal, one content-level touch
//     is needed: wrap .page-content tables in an overflow-x:auto container
//     (Lead-owned files). If +7 counts as closed (shell fixed; content
//     cosmetic), record as-is. Lead's call.
//
// ≥1101 BRANCH — not runtime-measurable in this pane, and provably so: media
// queries ignore `zoom` (verified — matchMedia('(max-width:1100px)') stays
// true at zoom 0.5, layout 1528; grid stays 2-track). Source+model instead:
// 3-track minmax(0,1fr) cannot floor, so no shell regression is possible; at
// ≥1460 behavior is identical to pre-fix desktop; model-only note: in the
// 1101–~1140 band the dialog table (513) could still overflow ~20px
// (unmeasured — flag for whoever gets a resizable browser).
//
// b–e: unaffected by this fix (layout-only change). Full runtime evidence for
// b/c/d/e lives in the Task 7 archive (my agent-a block) — per §6, referenced,
// not repeated.
// — Agent A
```

```agent-c
// ════════════════════════════════════════════════════════════════════════════
// O4 — OVERFLOW FIX VERIFY (C) — plus O3 corroboration + Lane C seal ack
// Throwaway dev :5222; browser pane viewport 765px (≈764 acceptance width).
// Read-only; the two live DOM style-injections noted below were probe
// instrumentation, not file edits. Server stopped after; temp logs removed.
// ════════════════════════════════════════════════════════════════════════════
//
// O4 VERDICT: shell-level CLOSED; LITERAL acceptance = +6/+53 residual on doc
// pages. Same numbers A measured independently (+7/+54 @764 — 1px apart, same
// pane-width epsilon). Index is literally 0.
//
//   /                   overflow 0    (was +86)   grid "280px 485px" ✓
//   /components/button  overflow +6   (was +428)  rightbar display:none ✓
//   /components/dialog  overflow +53  (was …)     rail collapses <1100 ✓
//   Cause of residual: API props TABLE min-content > shrunk content track;
//   parent SECTION.panel overflow-x visible; site.css `pre{overflow:auto}`
//   covers code only. Offender scan (scrollX normalised to 0) lists
//   TABLE/THEAD/TR/TH/TBODY only — de.scrollWidth === table right edge.
//
//   TESTED REMEDY (injected live, both pages to literal 0):
//     @media (max-width: 1100px) {
//       .main table { display: block; max-width: 100%; overflow-x: auto; }
//     }
//   → /dialog +53 → 0; /button +6 → 0. Files are Lead-owned (§5 Task 7) —
//   formal DIFF REQUEST. My O4 stamps green only when applied; if Lead records
//   "+7 counts as closed" instead, mark O4 CLOSED-EXCEPTION and this residual
//   becomes a shipped known-issue, not a silent pass.
//
// O3: B already landed the single record (wide-viewport headless, full
// scroll-spy + click + empty-state table). Not re-recorded. My pass today
// CORROBORATES it on the post-fix build: 16 rail items in order; click
// #usage → hash #usage, aria-current=Usage, #usage lands 1px from viewport
// top (verified via a recording shim around scrollIntoView — handler requests
// behavior:'smooth' on the right element — then instant-resolve geometry;
// plain smooth in this hidden pane starves on rAF, documented env artifact).
// O3 stays CLOSED by B.
//
// Lane C seal: noted with thanks — the parallel C session applied F1–F6 and D
// re-audited to REAL & SHIPPED. My session never wrote those files after that
// session went live (no collision, per my Task 7 comms block). D's remaining
// nits (status copy "✓ page as Markdown copied" reads awkward) — one-line
// polish in PageActions, my lane; I'll take it ONLY if the Lead wants it before
// the next Lane C file touch, to avoid a sixth writer story.
//
// READY: Section 1 — AI and MCP + Changelog content files (§2.3/§2.5).
// Blocked on Lead's src/site/guides.ts freeze (not in tree yet as of this
// pass). Model lands → I author immediately.
// — Agent C (O4 pass)
```

```agent-lead
// ════════════════════════════════════════════════════════════════════════════
// LEAD — CLOSE-OUT ACCEPTED · SECTION 1 REFRAMED AROUND THE HUMAN'S /docs
// ════════════════════════════════════════════════════════════════════════════
// CLOSE-OUT — all four closed:
//   O1 D→C PASS; Lane C sealed REAL & SHIPPED (F1–F6 verified; nits noted).
//   O2 A co-signed; shell overflow fix confirmed.
//   O3 B closed (single runtime record); C corroborated on the post-fix build.
//   O4 shell-level closed. I applied C's tested table remedy (site.css) so the
//      literal residual is gone:
//        @media (max-width: 1100px) { .main table { display:block; max-width:100%; overflow-x:auto } }
//      C/A measured +7/+54 @764 from the API table; this wraps it. C: re-measure
//      and stamp O4 literally green (or record the number if a pixel remains).
//   D's Lane C nits: status copy wording is optional polish — C may take it in
//   their next Lane C touch, not blocking. Dev-origin AI links + 1h cache are
//   inherent/by-design; recorded, not defects.
//
// ── THE HUMAN WROTE /docs (Section 1 source of truth) ───────────────────────
//   docs/introduction.md · docs/theming.md · docs/motion.md · docs/ai-and-mcp.md
//   (YAML frontmatter: title, description; markdown body). Two are missing:
//   installation, changelog. The plan below is re-cut around this reality.
//
// ── LEAD WORK LANDED THIS PASS ──────────────────────────────────────────────
//   · src/site/guides.ts — FROZEN model: globs ../../docs/*.md (?raw, eager),
//     parses frontmatter, strips it from body, orders by a canonical map
//     (introduction, installation, theming, motion, ai-and-mcp, changelog).
//     Exports GUIDES · GUIDE_BY_SLUG · getGuide(slug).
//   · +layout.svelte — sidebar "Docs" nav now loops GUIDES (real links, active
//     state). No more inert placeholders; only authored guides appear.
//   · Renamed docs/themeing.md → docs/theming.md and fixed the frontmatter title
//     ("Themeing" → "Theming"). Flagging the typo fix; content untouched.
//   · Added `marked` (^18) as a dependency — the guide renderer's markdown parser.
//   · site.css table remedy (above). check 0/0 · build ✓ on all of it.
//
// ── SECTION 1 — REVISED ROSTER (content is now human-authored markdown) ─────
//   D  — build src/routes/docs/[slug]/+page.svelte: render getGuide(slug) —
//        frontmatter title/description + marked.parse(guide.body) via {@html}.
//        FROZEN REQUIREMENT: every rendered h2/h3 must carry id + data-toc
//        (slugified) so the existing OnThisPage rail works with no new code.
//        Unknown slug → not-found block. Lead owns layout/nav; you own the route.
//   A  — author docs/installation.md (source: sample-installation-doc.md +
//        uiarc installation); review docs/introduction.md for Svelte accuracy.
//   B  — review/adapt docs/theming.md + docs/motion.md: their code samples are
//        React/Next (a RootLayout theme script; a motion/react example). Port
//        them to SvelteKit/Svelte 5 (app.html inline script; svelte-motion).
//        Keep the human's prose; fix only what is framework-wrong.
//   C  — author docs/changelog.md; review docs/ai-and-mcp.md (it has commented
//        uiarc blocks + a fractalsvelte.in/mcp URL — keep the human's intent).
//
//   Content files (docs/*.md) are owned by their authoring agent; guides.ts and
//   the layout stay Lead-owned. Disjoint, as before.
//
//   Gates as §4. Audit per §5: D's renderer audited by A; each guide by the next
//   agent in rotation (A→B, B→C, C→D).
//
// D: the model is frozen — start the renderer now. A/B/C: content per above.
```

```agent-b
// ════════════════════════════════════════════════════════════════════════════
// SECTION 1 — THEMING + MOTION — CONTENT ADAPTED
// ════════════════════════════════════════════════════════════════════════════
// docs/theming.md and docs/motion.md only. Prose left as written.
// guides.ts, the layout, and the other four guides were not touched.
//
// THEMING
//   The dark-mode sample was a Next RootLayout with dangerouslySetInnerHTML.
//   It is now src/app.html: the same script, inline in <head>, before
//   %sveltekit.head%, writing data-theme on <html>. %sveltekit.body% is the
//   body. The eight accent names were one glued run of code spans; they are
//   spaced so each name is its own span. The customizing CSS block is
//   unchanged, including @import "../registry/foundation.css".
//
// MOTION
//   The usage sample was motion/react plus @/lib/motion-tokens.
//   It is now a Svelte 5 component:
//     motion.span and useReducedMotion from @humanspeak/svelte-motion
//     motionTokens from $lib/motion-tokens
//   useReducedMotion() returns { current }, so the reduced branch reads
//   reduce.current. A bare object would always be truthy.
//   The five spring lines had the description glued to the number
//   ("0.12Presses"). A sentence break is in each line. The numbers match
//   src/lib/motion-tokens.ts. The CSS transition and reduced-motion blocks
//   are unchanged.
//
// NOT OPENED: src/routes/docs/[slug]/+page.svelte is not in the tree, so
//   /docs/theming and /docs/motion were not rendered.
//
// GATES
//   check-port: 35 component(s), 0 error(s), 14 warning(s) — existing extra
//     props on hover-card, password-field, search-field, swipe-actions.
//   npm run lint:agent: 0 violations.
//   npm run check: 0 errors, 0 warnings.
//   npm run build: ✓ built in 10.62s. adapter-auto could not detect a
//     production environment, then ✔ done.
//
// Ready for C's audit of Theming and Motion.
```
