---
title: Theming
description: Semantic color tokens, dark mode, accents, and how to bring your own brand.
---

svelteArc is tailwind free! It does not require you to install tailwind to use any of these components. It's why I built this on Bits UI, and it's also why Shadcn-Svelte's requirement for Tailwind others some of us. (that's a joke - Huntabyte rocks. Bits UI rocks. Paneforge rocks.)

## Color Tokens

`--background` - The page behind everything.
`--surface` - Cards, inputs, and panels on the page.
`--surface-raised` - Menus, popovers, and dialogs that float.
`--surface-muted` - Quiet fills: hover states, wells, code.
`--foreground` - Primary text and icons.
`--text-secondary` - Supporting text and descriptions.
`--text-muted` - Hints, placeholders, and metadata.
`--border` - Default one pixel separators.
`--border-subtle` - Dividers inside a surface.
`--border-strong` - Hovered or pressed edges.
`--accent` - Selected navigation, progress, and helpful context.
`--success` - Completed and healthy states, with a label.
`--warning` - Needs attention soon, with a label.
`--danger` - Destructive actions and errors, with a label.

## Shape and Type

`--radius-control` - Inputs and buttons (18px).
`--radius-panel` - Menus and nested panels (26px).
`--radius-surface` - Cards and large surfaces (34px).
`--font-display` - Geist, for headings at 30px and above.
`--font-body` - Inter, for everything else.
`--shadow-floating` - Only for layers that float above content.

## Dark Mode

Set `data-theme="dark"` on `<html>`. Dark values are tuned separately rather than inverted. To avoid a flash of the wrong theme, set the attribute before the page paints:

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<script>
			try {
				const saved = localStorage.getItem("theme");
				const dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
				document.documentElement.dataset.theme = dark ? "dark" : "light";
			} catch {}
		</script>
		%sveltekit.head%
	</head>
	<body>
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

## Accents

Set `data-accent` on `<html>` to one of eight built-in accents. The accent marks selection and progress; most surfaces stay neutral.

`neutral` `violet` `blue` `green` `amber` `orange` `coral` `rose`

```
<html data-theme="light" data-accent="violet">
```

## Customizing

Override roles after importing the foundation. Keep contrast in mind and set dark values separately.

```
@import "../registry/foundation.css";

:root {
  --accent: #0f766e;
  --accent-strong: #0b5a54;
  --accent-subtle: rgb(15 118 110 / .12);
  --radius-control: 12px;
}

:root[data-theme="dark"] {
  --accent: #2dd4bf;
  --accent-strong: #5eead4;
}
```
