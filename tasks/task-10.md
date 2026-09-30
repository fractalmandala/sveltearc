# Task 10: Standards, Site Decisions & Docs-Close

> **Lead note:** durable decisions live here. Task 9 is the guide build; Tasks 7–8 are
> archives. New instructions go in new task docs, not appended to old ones.

## 1. Locked standards

| Decision | Value |
| --- | --- |
| **Name** | `svelteArc` — lowercase `s`, capital `A`. Exactly this casing, everywhere. |
| **npm package** | `sveltearc` (npm names are lowercase; display name stays `svelteArc`). |
| **Distribution** | **npm registry**, one package. |
| **No shadcn** | shadcn/shadcn-svelte pulls in **Tailwind** as a dependency — we ship Tailwind-free (Bits UI + CSS Modules). No shadcn CLI, no `@arcui/*` namespace. |
| **Package manager** | **pnpm** for every command, script, and doc example. |
| **Install command** | `pnpm add sveltearc` |

## 2. Done this pass (Lead)

- **True 404s** — `+page.ts` loaders throw `error(404)` for unknown slugs on **both**
  `/components/[name]` and `/docs/[slug]`; added `src/routes/+error.svelte`.
  Verified: `/docs/nope` → 404, `/components/nope` → 404, valid slugs → 200.
- **Brand** — shell `<title>` and sidebar brand are `svelteArc`; index `h1` and the
  guide `<title>` updated.
- **Install default** — `[name]/+page.svelte` fallback is now `pnpm add sveltearc`
  (was the shadcn CLI).

## 3. Docs-close sweep — LAST, deliberately not now

The human's directive: **the docs do not yet represent current reality; they close last.**
Do not churn doc content until this sweep is scheduled. Files that still carry the old
reality (grep-confirmed):

- `src/site/docs/*.ts` — `install.cli` = `pnpm dlx shadcn-svelte@latest add @arcui/<name>`
  (35 files; two use `npx`) → `pnpm add sveltearc`.
- `src/site/markdown.ts` — the same shadcn default in `docToMarkdown`.
- `src/site/demos/*` — e.g. `@arcui • Design System Primitives`, `copy-button` installCmd.
- Guide prose — `Sveltarc` / `Sveltearc` → `svelteArc`; the `fractalsvelte.in/mcp` URL is
  **not live** → mark aspirational or remove; A's intro edits; the registry URL assumption.
- `docs/installation.md` — assumes `https://fractalsvelte.in/r/{name}.json` (pending §4).

## 4. Domain — DECIDED: `sveltearc.fractalsvelte.dev`

Human ruling: canonical site is **`sveltearc.fractalsvelte.dev`**; wired up **last**.

- **DNS:** CNAME `sveltearc` → `cname.vercel-dns.com` on the `fractalsvelte.dev` zone
  (or let Vercel create it if the zone's nameservers are Vercel's).
- **Vercel:** Project → Settings → Domains → add `sveltearc.fractalsvelte.dev`; TLS is
  auto-provisioned. `.dev` is HSTS-preloaded, so HTTPS is mandatory — the page won't load
  until the cert issues.
- **No code change:** `adapter-auto` detects Vercel, and `event.url.origin` makes every
  markdown/`llms.txt` URL correct on the chosen host automatically.
- `sveltearc.vercel.app` stays as a free preview alias.
- **Pin in the docs-close sweep:** the registry URL in `docs/installation.md` (and Phase 4
  registry output) becomes `https://sveltearc.fractalsvelte.dev/r/{name}.json`.

## 5. Next

- Human: pick the domain (§4). Then the registry URL in `installation.md` and Phase 4
  registry output can be pinned.
- The docs-close sweep (§3) is scheduled **last**, as one pass, once components/blocks land.

---

```agent-lead
// ════════════════════════════════════════════════════════════════════════════
// LEAD DISPATCH — TASK 10
// ════════════════════════════════════════════════════════════════════════════
// Locked: name `svelteArc` · npm package `sveltearc` · pnpm · npm registry ·
// NO shadcn (Tailwind-free) · install `pnpm add sveltearc`.
//
// Landed this pass (Lead): true 404s on /components/[name] + /docs/[slug]
// (+error.svelte); brand standardized in the shell; install fallback fixed.
//
// DO NOT sweep docs content yet — the human ruled docs close LAST (§3 lists the
// exact files for that single later pass).
//
// Awaiting human: the domain pick (§4). Recommend sveltearc.fractalsvelte.dev.
//   → DECIDED: sveltearc.fractalsvelte.dev; human wires it up LAST. §4 updated.
//
// Open Task 9 audits still owed: C→B (theming/motion), B→A (installation + intro
// review), D→C (changelog + ai-and-mcp). Those run on the Task 9 board.
```