---
title: Introduction: React components you own | Arc UI
description: What Arc is, how the free and Pro libraries are organized, and how to read a component page before you install your first React component.
tags: []
source: https://uiarc.dev/docs/installation
slug: Introduction:-React-components-you-own-|-Arc-UI
---

## [Requirements](https://uiarc.dev/docs/installation#requirements)

A React 19 project with TypeScript and the `@/*` path alias. Arc components use CSS modules and CSS variables, so they work without Tailwind. The steps below use the shadcn CLI; the manual path at the end needs nothing extra.

## [Next.js](https://uiarc.dev/docs/installation#nextjs)

1.  ### Create a project
    
    `pnpm create next-app@latest my-app`
    
    Skip this for an existing app. Accept the default `@/*` import alias.
    
2.  ### Initialize shadcn
    
    `pnpm dlx shadcn@latest init`
    
    This creates `components.json`, which the CLI reads to know where files go.
    

## [Vite](https://uiarc.dev/docs/installation#vite)

1.  ### Create a project
    
    `pnpm create vite my-app --template react-ts`
    
2.  ### Add the path alias
    
    Map `@/*` to the project root in both TypeScript and Vite.
    
    ```
    {  "compilerOptions": {    "baseUrl": ".",    "paths": { "@/*": ["./*"] }  }}
    ```
    
    ```
    import path from "node:path";import react from "@vitejs/plugin-react";import { defineConfig } from "vite"; export default defineConfig({  plugins: [react()],  resolve: { alias: { "@": path.resolve(__dirname, ".") } },});
    ```
    
3.  ### Initialize shadcn
    
    `pnpm dlx shadcn@latest init`
    

## [Add the @uiarc registry](https://uiarc.dev/docs/installation#registry)

Register the namespace once in `components.json`. After that you install Arc items by name.

```
{  "registries": {    "@uiarc": "https://uiarc.dev/r/{name}.json"  }}
```

Prefer not to edit the config? Every item also installs from its full URL, for example `https://uiarc.dev/r/button.json`.

## [Add the foundation](https://uiarc.dev/docs/installation#foundation)

Every Arc item depends on the shared tokens, and the CLI adds them with your first install. To add them up front:

`pnpm dlx shadcn@latest add @uiarc/arc-foundation`

Then import the tokens once, at the root of your app.

app/layout.tsx · src/main.tsx

```
import "@/registry/foundation.css";
```

## [Install components](https://uiarc.dev/docs/installation#install)

Add one or several items at once. Local dependencies, such as a block's components, come along automatically.

`pnpm dlx shadcn@latest add @uiarc/button @uiarc/dialog`

Files land under `registry/` and `lib/` at the project root and import each other through `@/`. Use them like any local component:

```
import { Button } from "@/registry/components/button/button"; export default function Page() {  return <Button>Save changes</Button>;}
```

## [Manual installation](https://uiarc.dev/docs/installation#manual)

1.  ### Install the packages
    
    Most items use Motion and Lucide; each page lists its exact dependencies.
    
    `pnpm add motion lucide-react`
    
2.  ### Copy the foundation
    
    Copy `registry/foundation.css` and `lib/motion-tokens.ts` from any item's Manual tab, and import the CSS once at the root.
    
3.  ### Copy the item
    
    Open the component page, switch Installation to Manual, and copy each file into the same path in your project.
    

Pro items install the same way once you are signed in with a Pro plan: the install command and source appear on their page. [See what is in Pro](https://uiarc.dev/pro).
