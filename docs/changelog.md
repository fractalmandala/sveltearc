---
title: Changelog
description: What has shipped in Svelte ArcUI — components, tooling, and the docs site.
---

All dates are absolute. This library was ported in the open, task-board first: each entry maps to a completed task in `tasks/`, and every claim here is verifiable in the repo or on this site.

## 2026-09-30 — Docs site surface (Tasks 7–8)

The documentation site now matches the craft standard of the benchmark it is modelled on. Four gaps closed, each audited by a second agent:

- **On this page rail** — a right-side ToC on every component page: DOM-scanned headings, scroll-spy highlight, click to smooth-scroll, keyboard reachable, and it renders nothing on pages without sections.
- **Page actions** — a "Copy page" control on every component page: copy the page as Markdown, view it as Markdown in a new tab, copy the page link, copy the install command, and open an AI assistant (ChatGPT, Claude, Cursor, v0) with a prefilled prompt pointing at the component's Markdown URL. Copy states confirm visibly and reset; clipboard failures show a visible fallback instead of a silent lie.
- **Canonical grouping** — all component docs migrated to the 22 canonical UI groups (script-applied, idempotent, verified). Sidebar and index render groups in canonical order; empty groups stay hidden.
- **Search** — a ⌘K / Ctrl-K palette over every component: fuzzy matching across titles, prop names, descriptions, and AI notes, fully keyboard-operable, index built lazily on first open.

Supporting infrastructure that makes the above real:

- `GET /components/<name>/markdown` — every doc, as deterministic Markdown from a single serializer (200 with `text/markdown`, 404 for unknown slugs). The same bytes power "Copy page as Markdown".
- `GET /llms.txt` — a machine-readable index of all 35 component docs with page and Markdown URLs, served as `text/plain`, using the request origin.
- Responsive shell — 3-column grid (sidebar | content | ToC rail); the rail collapses under 1100px and tables scroll horizontally instead of breaking the page. Verified: no horizontal page scroll at narrow widths.
- Gates on every lane: `svelte-check` 0/0, design-system lint 0 violations, port-contract check 35/0, build green.

## 2026-09-30 — Section 1 guides (Task 9)

Human-authored guides live at `/docs/<slug>`, rendered from the `docs/` markdown with the same shell and ToC rail as component pages: Introduction, Installation, Theming, Motion, AI and MCP, and this Changelog. Theming and Motion samples were adapted from the React originals to SvelteKit / Svelte 5.

## 2026-09-30 — Port and tooling (Tasks 1–6)

- **Project set up** — `svelte-arcui` scaffolded as a SvelteKit + Svelte 5 (runes, strict) + TypeScript mirror project; site-only content isolated behind the `$site` alias so nothing docs-related ships in the package.
- **Foundation ported** — `foundation.css` design tokens, `motion-tokens.ts`, `media.ts`, and `use-copy-feedback` carried over as the anchor layer for every component.
- **35 components ported** from the React source library, each shipping its `.module.css` verbatim and its full doc page (live demo, props table, variants, keyboard, accessibility, motion notes) alongside the component — the doc is the proof.
- **16 Radix-based components** rebuilt on plain Bits UI headless primitives (accordion piloted as the reference implementation), including drawer/bottom-sheet on vaul-style Dialog, hover-card on LinkPreview, and split-button/notification-center composed from DropdownMenu.
- **Motion in two phases** — Phase 1 holds the mounted-element DOM contract of each React original with animation end-states applied statically; **this is the current state of all 35 ports**. Phase 2 (still-states → `@humanspeak/svelte-motion` springs) is the next wave. `prefers-reduced-motion` is honored per component.
- **Tooling** — `check-port.mjs` (props-contract diff against the source registry JSONs), `cui-lint.mjs` (design-system token lint), `scaffold-port.mjs` / `scaffold-doc.mjs` (component + doc scaffolds), `normalize-groups.mjs` (group migration). A four-agent swarm process with frozen interfaces, disjoint file ownership, and mandatory cross-audits ran the port and the docs surface in parallel.
