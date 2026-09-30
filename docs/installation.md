---
title: Installation
description: Requirements, Sveltekit setup, installing svelteArc, and manual installation.
---

A Svelte 5 project on Sveltekit with TypeScript. svelteArc components use CSS modules and CSS variables, so they work without Tailwind.

## Create a project

```sh
pnpm dlx sv create my-app
```

Pick the minimal template with TypeScript. Skip this for an existing app.

## Install svelteArc

svelteArc ships as one package on the npm registry:

```sh
pnpm add sveltearc
```

The package carries the components and the shared foundation tokens. Each component page lists its exact usage, API, and dependencies.

## Install the packages

Most items use Bits UI, Lucide, and svelte-motion; each page lists its exact dependencies.

```sh
pnpm add bits-ui @lucide/svelte @humanspeak/svelte-motion
```

## Copy the foundation

Copy `foundation.css` and `motion-tokens.ts` from any item's Manual tab, and import the CSS once at the root.

src/routes/+layout.svelte

```svelte
import '$lib/foundation.css';
```

## Copy the item

Open the component page, switch Installation to Manual, and copy each file into the same path in your project. svelteArc files import each other through `$lib/`, so they work like any local component:

```svelte
<script lang="ts">
  import { Button } from '$lib/components/button';
</script>

<Button>Save changes</Button>
```
