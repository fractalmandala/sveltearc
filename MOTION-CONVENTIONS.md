# Motion Conventions — Phase 2 (v0.9, preliminary)

> **Lead-owned.** Frozen from the `switch` (plain spring) and `dialog` (enter/exit +
> forceMount) spike reps. The **`layoutId` section is PENDING the `card` rep.**
> Non-layoutId components may start now. layoutId components — **tabs, card,
> segmented-control, notification-center** — stay `still-port` until §8 is frozen.

## 1. Imports

```ts
import { AnimatePresence, motion, useReducedMotion, animate, useMotionValue } from '@humanspeak/svelte-motion';
import { motionTokens } from '$lib/motion-tokens';
```

## 2. Reduced motion (mandatory, per component)

```ts
const reduced = useReducedMotion(); // read reduced.current — a boolean, NOT the object
```

Every `transition`/`exit` branches on it:

```svelte
transition={reduced.current ? { duration: 0 } : { /* spring or ease */ }}
```

The end state under `prefers-reduced-motion: reduce` must be **identical**, with no travel.

## 3. Token types (do not cast)

- `motionTokens.ease.*` are `Bezier = [number, number, number, number]` — pass directly or spread.
- `motionTokens.spring.*` are `SpringConfig` — pass directly.
- Never inline magic numbers; never `as` casts.

## 4. Pattern — plain spring (transform / opacity)

```svelte
<motion.span
  initial={false}
  animate={{ x: on ? travel : 0 }}
  transition={reduced.current ? { duration: 0 } : { x: motionTokens.spring.snappy }}
/>
```

## 5. Pattern — enter/exit over a bits-ui primitive (overlays)

Keep the Phase 1 DOM contract: `forceMount` stays; drive motion through the `child` snippet.

```svelte
<AnimatePresence present={open}>
  {#snippet child()}
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay forceMount class={styles.overlay}>
        {#snippet child({ props })}
          <motion.div {...props} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={reduced.current ? { opacity: 0, transition: fade } : { opacity: 0, transition: leave }} />
        {/snippet}
      </DialogPrimitive.Overlay>
      <DialogPrimitive.Content forceMount …>
        {#snippet child({ props })}<motion.div {...props} …>{@render inner()}</motion.div>{/snippet}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  {/snippet}
</AnimatePresence>
```

**⚠ ScrollLock gotcha (learned in the dialog rep):** bits-ui's *default* children path mounts
`ScrollLock` unconditionally — under `forceMount`, a **closed** dialog would hold
`body { pointer-events:none; overflow:hidden }` and the whole page goes input-dead. Use the
`child` snippet path (as `dialog-content.svelte` does) and gate the lock on `open`.

## 6. Pattern — text swap

```svelte
<AnimatePresence mode="popLayout" initial={false}>
  {#key text}<motion.span key={text} initial={…} animate={…} exit={…}>{text}</motion.span>{/key}
</AnimatePresence>
```

## 7. Pattern — multi-channel transition

```svelte
transition={{ default: motionTokens.spring.smooth,
              opacity: { duration: motionTokens.duration.fast, ease: motionTokens.ease.enter } }}
```

## 8. PENDING — layoutId shared layout

The `card` rep decides svelte-motion `layoutId` vs a FLIP fallback. Until then, do **not**
touch `tabs`, `card`, `segmented-control`, `notification-center`.

## 9. Bare-root fallback (do not invent state)

If a component can sit under a bare bits-ui root (open state unknown), keep the CSS-keyframes
fallback (the `keyframes` class on the layers). Do not fabricate an open signal.

## 10. Interruption parity

Port ARC's ref + timestamp bookkeeping with `$effect` + `performance.now()` (browser-only) so a
reopen mid-exit retargets the springs instead of remounting.

## 11. Manifest

Update `<name>.manifest.json`: `"status": "complete"`; drop the Phase 1 gap; add a Phase 2 note
(what was wired, any honest fidelity gap).
