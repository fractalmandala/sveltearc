---
title: Introduction
description: What is svelteArc, how it's organized, and how to use.
---

svelteArc is a port of ArcUI to Sveltekit. It's love for Sveltekit, and a small attempt to bring to it goodies usually more available for React. It's a library of components and blocks, with previews and source you own. Install by direct CLI, or copy files by hand, or clone the repo and do with it whatever you like. 

Every preview runs the same source you install, so the keyboard behavior, loading states, and motion you try on a page are what you get.

## Structure

1. Components - Single jobs, grouped by what they do: actions, inputs, disclosure, feedback, data, and text. Close relatives such as the four theme switches share one page.
2. Special Components - Motion-forward pieces with layered interaction, like the dock, cover flow, and liquid tab bar.
3. Blocks - Complete flows built from components: sign in, billing, settings, analytics. Families such as Login and Sidebar show their variants on one page.
4. Coming Soon - Layouts - Full app shells and containers.

Everything shares one foundation of color, radius, type, and motion tokens, so items look and move alike wherever you drop them.

## Reading a Page

Each component and block page follows the same order, so you can jump straight to what you need:

1. Preview and Code: try it, then read the exact source.
2. Installation: one CLI command, or manual steps with every file.
3. Usage and API reference: a copyable example and every prop with its type and default.
4. Keyboard, accessibility, and motion: what it does for people using a keyboard, a screen reader, or reduced motion.
5. Notes for AI: when to pick it and a Markdown version for your assistant. Use Copy page to paste the whole page into a chat.

