---
title: AI and MCP
description: Svelte ArcUI provides copy-paste components, complete interface blocks, machine-readable registry metadata, AI skills, and MCP compatibility.
---

## MCP server

Planned — not live yet. Intended as a remote, read only server. No account or key.
https://fractalsvelte.in/mcp

```
claude mcp add --transport http sveltearc https://fractalsvelte.in/mcp
```

Add --scope project to share the server with your team through .mcp.json.

## Tools

`search_components`

Find components and blocks by intent, such as “confirm a destructive action”.

`list_components`

Browse by category, tag, tier, or kind.

`get_component`

When to use it and when not to, usage, props, accessibility, motion, responsive, and performance notes, and the install command.

`get_install_command`

One shadcn command for several items, with setup notes.

`get_skill`

One Sveltarc skill file: the entry point, design, copy, components, composition, motion, accessibility, responsive, the review checklist, or a worked example.

## Skills

Teaches the agent when to reach for Sveltarc, how to install it, and the design rules to keep.

Install to .claude/skills/sveltarc

```
npx add @fractaldesign/sveltearc-ui
```


Other agents can read it directly, or paste instructions into AGENTS.md, CLAUDE.md, or Cursor rules.


<!--
-   [SKILL.md<small>Entry point: workflow, principles, never-do list, and quick decisions</small>](https://uiarc.dev/r/skills/arc/SKILL.md)
-   [INSTRUCTIONS.md<small>Short always-on rules for AGENTS.md, CLAUDE.md, or Cursor rules</small>](https://uiarc.dev/r/skills/arc/INSTRUCTIONS.md)
-   [checklist.md<small>The review loop to run before finishing, with grep sweeps</small>](https://uiarc.dev/r/skills/arc/checklist.md)
-   [components.md<small>Choosing the right component or block by job, with ids</small>](https://uiarc.dev/r/skills/arc/components.md)
-   [composition.md<small>Page containers, dashboards, marketing sections, states, React correctness</small>](https://uiarc.dev/r/skills/arc/composition.md)
-   [copy.md<small>Sentence case, no eyebrows or em dashes, verbs on buttons, honest claims</small>](https://uiarc.dev/r/skills/arc/copy.md)
-   [design.md<small>Color, type, surfaces, concentric radii, spacing, and icons</small>](https://uiarc.dev/r/skills/arc/design.md)
-   [motion.md<small>Motion tokens, spring choice, patterns with code, reduced motion</small>](https://uiarc.dev/r/skills/arc/motion.md)
-   [accessibility.md<small>Focus without rings, semantics, keyboard, and announcements</small>](https://uiarc.dev/r/skills/arc/accessibility.md)
-   [responsive.md<small>Widths to check, overflow, tables, and touch targets</small>](https://uiarc.dev/r/skills/arc/responsive.md)
-   [example-settings.md<small>A worked account settings page</small>](https://uiarc.dev/r/skills/arc/example-settings.md)
-   [example-pricing.md<small>A worked pricing section with plans, comparison, and FAQ</small>](https://uiarc.dev/r/skills/arc/example-pricing.md)
-   [example-dashboard.md<small>A worked analytics overview with KPIs, chart, and table</small>](https://uiarc.dev/r/skills/arc/example-dashboard.md)
-->


## Readable context

Every component page on this site ships machine-readable output today:

- `/llms.txt` — a plain-text index of all component docs with page and Markdown URLs.
- `/components/<name>/markdown` — any component's full documentation as deterministic Markdown (`text/markdown`), the same bytes as the "Copy page as Markdown" action on each page.
- Each component page's page-actions menu can open ChatGPT, Claude, Cursor, or v0 with a prompt pointing at that Markdown URL.

## Install with CLI

Every free item is a registry item. Shared tokens and Sveltearc dependencies come along automatically.

<!--
```
npx add https://uiarc.dev/r/button.json
```

```
{  "registries": {    "@uiarc": "https://uiarc.dev/r/{name}.json"  }}
```

```
npx shadcn@latest add @uiarc/button @uiarc/dialog @uiarc/signup-form
```

Import `@/registry/foundation.css` once in your root layout. Arc files use the `@/*` alias for the project root.

## [Pro access](https://uiarc.dev/docs/ai#pro-access)

Pro members connect AI tools and the CLI with a personal access token. Without one, everything above keeps working, free and anonymous.

1.  ### Create a token
    
    Open [Pro access in your account](https://uiarc.dev/account#pro-access), name the token after the tool or machine, and copy it. It is shown once.
    
2.  ### Connect the MCP server with the token
    
    `get_component` then returns the full source of Pro items, `get_install_command` returns `@uiarc-pro` commands, and `get_skill` returns Pro skills.
    
    ```
    claude mcp add --transport http --scope user arc https://uiarc.dev/api/mcp \  --header "Authorization: Bearer arc_pro_..."
    ```
    
    Paste your token in place of arc\_pro\_... The user scope keeps it out of project files.
    
3.  ### Install Pro items with the shadcn CLI
    
    99 Pro components, blocks, and templates install from the `@uiarc-pro` registry. Pieces that ship photos are copied from their docs page instead.
    
    ```
    {  "registries": {    "@uiarc": "https://uiarc.dev/r/{name}.json",    "@uiarc-pro": {      "url": "https://uiarc.dev/r/pro/{name}.json",      "headers": {        "Authorization": "Bearer ${ARC_PRO_TOKEN}"      }    }  }}
    ```
    
    ```
    ARC_PRO_TOKEN=arc_pro_...
    ```
    
    ```
    npx shadcn@latest add @uiarc-pro/dock @uiarc-pro/arc-saas
    ```
    

The shadcn CLI expands `${ARC_PRO_TOKEN}` from your environment or `.env.local`; never commit the token. Each account can hold 10 active tokens, each allows 120 requests a minute, and a token stops working when you revoke it or Pro ends. Free dependencies come from the public registry and Pro dependencies through `@uiarc-pro`, so keep both entries.

## [Readable context](https://uiarc.dev/docs/ai#context)

Plain text and JSON for agents, search, and your own tooling.

## [Try a prompt](https://uiarc.dev/docs/ai#prompt)

Name the job, not the markup. The agent searches Arc before it writes anything.

```
Build a settings page with Arc. Use the Arc MCP server to findcomponents for the profile form, notification switches, and adestructive delete action. Install them with the shadcn CLI andcheck the page in light and dark themes.
```
-->
