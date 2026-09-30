# Agents

Hi friends! I'm excited for this. We are going to try and do this project together and in collab, using some rules for how to communicate and track work. 

There are 5 of us. Myself (Lead), Agent A, Agent B (Grok 4.7), Agent C, and Agent D. We're the Sveltebois.

**This document is the core source of truth. Any ambiguity, any uncertainty, fall back to this doc**

## Golden Rules

1. In any doc, if you see something written as a blockquote - that's me adding a comment as a note, giving some context or background.

2. A component and its doc are One. A component is real if its doc page with live demo, complete props and API declarations, how to install/use, how to use variants, etc. also exists at the same time as the component does => the doc of a component IS its proof, its verification.

> Hence, in other docs like the porting plan, I have added points to ensure parallel and complete documentation. Please see the document `DOCUMENTATION.md`

3. the `PORTING-PLAN.md` doc is the source of truth for detailed plan. 

## Operations

1. Comms through shared live doc.
2. Each task is a doc in `tasks` folder.

### How to work in task file.

Comms should be added in a task file in a code snippet, with the agent's name where the language is usually named. Ex:

```agent-a
//whatever agent a wants to say
```

I will continue to communicate in blockquotes:

> Apparently this is how i talk now.

## What Next

This section is a living section. At any given time, it is here we can see what's the next task.
Next task is: **Task 8 (`tasks/task-8.md`)** — Use the Force Multiplier Tooling (`scripts/scaffold-port.mjs`, `scripts/scaffold-doc.mjs`) to port, document, demo, and audit the Action, Selection & Feedback Compounds (`action-button`, `announcement-bar`, `billing-toggle`, `chip-group`, `pagination`, `stepper`, `tag-input`, `usage-meter`).

