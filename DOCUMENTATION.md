# Documentation

## Current Gaps:

current gaps in our docs vs benchmark of uiarc:

1. our docs need to add right side ToC in our docs
2. our docs need to add to each page options to: copy page as markdown, view as markdown in new tab, copy page link, copy install command (see image `ref-pageoptions.png`)
3. need to replicate and follow uiarc's grouping of components. see section `## UI Groups in uiarc` below.
4. need to add component search functionality and ui/ux

Some links of the uiarc doc pages, for reference and context:

1. Intro - `https://uiarc.dev/docs/introduction`
2. Installation - `https://uiarc.dev/docs/installation`
3. The actual installation page in md - `/Users/amrit/fractalmandala/arc-library-main/sample-installation-doc.md`

4. Button page and md - `https://uiarc.dev/components/button`, 	`https://uiarc.dev/components/button/markdown`, and llms.txt - 
5. llms.txt - `https://uiarc.dev/llms.txt`

6. Others:
- `https://uiarc.dev/components/dialog`
- `https://uiarc.dev/components/drawer`

## Full docs structure

- Section 1 - Introduction, Installation, Theming, Motion, AI and MCP, Changelog
- Section 2 - Components, 100
- Section 3 - Blocks, 75
- Section 4 - Special components

> the doc of a component IS its proof. typical structure - one line installation code, ex `pnpm dlx shadcn@latest add @uiarc/button`, live preview view with alt tab to code view, cli and manual instructions for installation, usage, examples, api reference, motion, notes for ai, related components

So a component is real, when its doc is real. The bonus in this? Our library and the content for its showcase website get simultaneously ready :P

**The doc made by one agent, will be checked by another agent. No agent ever audits their own authored doc** 

## UI Groups in uiarc

1. buttons - button, action button, split button, copy button, confirm morph, theme switcher
2. gestures - hold to confirm, swipe actions
3. menus - dropdown menu, context menu, user menu
4. text fields - input, textarea, password field, search field, inline edit
5. special inputs - number field, phone input, tag input, mention input, shortcut recorder
6. selects - select, combobox, multi-select, chip group
7. toggles - radio cards, billing toggle, checkbox, radio group, switch, segmented control
8. sliders - slider
9. pickers - calendar, date picker, date range picker, time picker, color picker
10. editors - rich text editor, signature pad, file dropzone
11. navigation - tabs, breadcrumb, pagination
12. expand - scroll area, accordion, expandable card, resizable panels
13. overlays - dialog, drawer, bottom sheet, popover, hover card, tooltip
14. messages - alert, toast, toast stack, announcement bar
15. progress - progress, skeleton, stepper, usage meter
16. avatars - avatar, avatar group, badge
17. cards - card, metric card, empty stage
18. charts - line chart, bar chart, donut chart, streamgraph, brush chart, waffle chart, slope chart, sparkline, gauge, activity heatmap, animated counter, ridgeline, treemap
19. tables - sortable data table, tree view, filter toolbar, code block
20. activity - timeline, comment thread, chat thread
21. media - image compare, carousel
22. text effects - text reveal, in-view title, text morph, text shimmer