---
title: Motion
description: Spring presets, easing, duration, reduced motion.
---

svelteArc uses the `svelte-motion` library for the motion language in these components.

## Principles
- Motion explains cause and effect: what opened, what changed, and where it came from.
- Animate `transform` and `opacity`. Nothing resizes in a single frame; widths and heights follow on a spring.
- Actions repeated many times a minute, like keyboard navigation, do not animate.
- Every animation keeps working when interrupted and has a reduced motion branch.

## Springs

Springs live in `lib/motion-tokens.ts` and come with every install:
`spring.snappy` - visualDuration: 0.26, bounce: 0.12. Presses, toggles, thumbs, and small indicators.
`spring.smooth` - visualDuration: 0.4, bounce: 0. Panels, height changes, and layout shifts. Never overshoots.
`spring.morph` - visualDuration: 0.42, bounce: 0.16. Shared highlights, shape changes, and widths that follow content.
`spring.responsive` - stiffness: 520, damping: 38. Direct manipulation that must track the pointer closely.
`spring.gentle` - stiffness: 340, damping: 34. Larger layout changes that should feel calm.

## Easing, Duration

CSS transitions use the matching variables from the foundation.
`--ease-standard` - Default for UI transitions.
`--ease-enter` - Elements arriving on screen.
`--ease-spring` - A gentle settle, paired with --duration-spring.
`--duration-fast` - 160ms. Hover, color, and small state changes.
`--duration-standard` - 240ms. Panels and menus.
`--duration-considered` - 480ms. Rare, introductory reveals.

## Usage

```svelte
<script lang="ts">
	import { motion, useReducedMotion } from '@humanspeak/svelte-motion';
	import { motionTokens } from '$lib/motion-tokens';

	let { on }: { on: boolean } = $props();

	const reduce = useReducedMotion();
</script>

<motion.span
	animate={{ x: on ? 20 : 0 }}
	transition={reduce.current ? { duration: 0 } : motionTokens.spring.snappy}
/>
```

```
.card {
  transition: background var(--duration-fast) var(--ease-standard);
}
```

## Reduced Motion

When someone asks for reduced motion, keep the end state, focus, and feedback, and remove travel, looping, and parallax. A short opacity change is fine. In CSS:

```
@media (prefers-reduced-motion: reduce) {
  .panel {
    transition: opacity var(--duration-fast) var(--ease-standard);
  }
}
```