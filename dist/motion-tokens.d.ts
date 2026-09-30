/**
 * Motion presets are shared by the gallery and future registry consumers.
 *
 * Types matter here: svelte-motion's `ease` wants a mutable cubic-bezier tuple
 * `[number, number, number, number]`, not a readonly const array. `satisfies`
 * keeps the tokens correctly typed for every consumer without widening springs.
 */
export type Bezier = [number, number, number, number];
export interface SpringConfig {
    type: 'spring';
    stiffness?: number;
    damping?: number;
    visualDuration?: number;
    bounce?: number;
}
export declare const motionTokens: {
    duration: {
        instant: number;
        fast: number;
        exit: number;
        standard: number;
        considered: number;
    };
    ease: {
        enter: [number, number, number, number];
        exit: [number, number, number, number];
        standard: [number, number, number, number];
        /** For elements that move while already on screen. */
        inOut: [number, number, number, number];
    };
    spring: {
        responsive: {
            type: "spring";
            stiffness: number;
            damping: number;
        };
        gentle: {
            type: "spring";
            stiffness: number;
            damping: number;
        };
        /** Presses, toggles, thumbs, and small indicators. Settles fast with a hint of life. */
        snappy: {
            type: "spring";
            visualDuration: number;
            bounce: number;
        };
        /** Panels, height changes, and layout shifts. Critically damped, never overshoots. */
        smooth: {
            type: "spring";
            visualDuration: number;
            bounce: number;
        };
        /** Shape morphs, shared layout highlights, and width changes that follow new content. */
        morph: {
            type: "spring";
            visualDuration: number;
            bounce: number;
        };
    };
    /** Stagger steps in seconds. Keep total stagger under roughly 0.4s. */
    stagger: {
        char: number;
        word: number;
        line: number;
        item: number;
    };
    /** Blur radii in px for text and content crossfades. Keep blur small and brief. */
    blur: {
        subtle: number;
        soft: number;
        text: number;
    };
};
