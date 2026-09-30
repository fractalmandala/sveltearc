# The Eleven Verification Gates

The verifier (`engine/uiautomation/pipeline/scripts/check.mjs`) writes `report.json` with per-gate counts. These gates are what make the system's claims *enforced properties* rather than promises. Current reference run: **0 errors / 0 warnings** across all eleven, for 42 anatomies, 15 components, 93 files.

Each gate below: what it proves, and how it fails loudly. The ordering principle throughout — **distinguish "no decision was made" from "a decision was made and recorded."** Only the former is a finding; re-reporting the latter is how a gate trains people to ignore it.

| # | Gate | Proves | Fails when |
| --- | --- | --- | --- |
| 1 | **referential integrity** | recipe parts/roles/axes exist; the adapter satisfies the *whole* taxonomy, not just parts in use | a recipe names a missing part/role/axis, or a role references a token the adapter lacks |
| 2 | **anatomy coverage** | every *styleable* part has a role; every declared state is accounted for — styled, or explicitly `unstyled` in the recipe | a styleable part has no role; a library-declared state is neither styled nor declared `unstyled`. Validated both directions: declaring `unstyled` for a state the anatomy lacks, or that a role *does* style, is also an error (can't rot into a lie) |
| 3 | **taxonomy lint** | interactive roles declare `:focus-visible`; state selectors come from the vocabulary | an `interactive` role omits focus; a role uses a selector not in `vocabulary.stateSelectors` |
| 4 | **token lint** | component Sass is token-only, and every `var(--x)` is reachable from the recipe's roles (and nothing dead) | raw hex/px/rem/ms/`rgb()`/`!important` in component Sass; a `var()` no role reaches, or a role token the Sass never emits |
| 5 | **vocabulary** | every declaration names an allowed property; `transition` is exactly `[property, duration-token, easing-token]` | a property outside `vocabulary.properties`; a malformed transition |
| 6 | **format contract** | single-tab indented Sass only | a brace, a semicolon, or an unexpected indentation level |
| 7 | **prop parity** | every anatomy prop is forwarded by its wrapper; every axis has its data attribute | a prop the anatomy declares isn't referenced in the wrapper; an axis with no `data-*={...}` render |
| 8 | **Svelte compile** | every generated wrapper is valid Svelte 5 | `svelte/compiler` (5.57) fails to compile a wrapper |
| 9 | **Sass compile** | `styles/index.sass` compiles and emits a rule per part | Sass errors, or a part's `.class` produces no rule |
| 10 | **cascade ties** | equal-specificity blocks that both set the same property are reported *with the resolved winner* — but only the *undecided* ones | a pointer state beats a library state, or two same-kind states fight (a tie nobody recorded). A tie resolving the documented way — library state outranking pointer — is silent; axis siblings (`size=sm` vs `size=lg`) never both match, so they're never flagged |
| 11 | **byte stability** | a fresh render is byte-identical to disk; no stale files in `generated/` | any generated file differs from a re-render, is missing its `@generated` banner, or nothing generates it any more |

## Hand-verified failure modes (do this on your own port)

Confidence in a gate comes from watching it bite, not from a green run:

- A hand edit to a generated file → **gate 11** fails with the exact line number.
- A styleable part left out of a recipe → **gate 2** fails and blocks writing (nothing is emitted).
- Two consecutive renders → hash identically (gate 11 silent).
- Deleting a role reference → **gate 1** fails *before* anything is written.
- Adding `background-color` to both `:hover` and `:focus-visible` on one role → **gate 10** warns with the resolved winner.
- Declaring a state the anatomy doesn't have, or one a role already styles, under `unstyled` → **gate 2** errors.

## The `unstyled` escape hatch (why gate 2 has three answers, not two)

Without it, every resting or aria-only state a library declares (26 lines from one library) becomes permanent noise. `recipes.unstyled = { part: [state] }` is where a designer records "this state needs no declaration" — once, in the file that owns the component's decisions. It's validated in both directions so it can never drift into a false claim. Two answers (styled / unanswered) trains people to ignore the gate; three answers (styled / unstyled-on-purpose / genuinely-unanswered) keeps it meaningful.
