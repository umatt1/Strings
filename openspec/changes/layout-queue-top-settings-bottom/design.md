## Context

The right-column (`right-content`) currently renders in this order:
1. `desktop-settings` — instrument, tuning, accidentals, color theme (hidden on mobile)
2. `fretboard-area` — position controls + fretboard + PracticeBar/queue-empty-bar
3. `fretboard-playback` — play buttons

On mobile, a duplicate `top-settings` block sits above `theory-panel` in `main-content`. Both `top-settings` and `desktop-settings` render the same `<Controls />` component; CSS show/hide switches between them at the 768px breakpoint.

The queue bar is the last thing inside `fretboard-area`, making it visually far from the top and separated from the fretboard by invisible whitespace when the queue is empty.

## Goals / Non-Goals

**Goals:**
- Queue bar (PracticeBar or queue-empty-bar) becomes the first visible element in the right column on all breakpoints
- Settings panel (Controls) moves to the bottom of the right column below PlaybackControls on all breakpoints
- No visual gap between fretboard and queue

**Non-Goals:**
- Changing any Controls, PracticeBar, or Fretboard component internals
- Changing the left theory panel position
- Changing responsive breakpoints

## Decisions

### Decision 1 — Move queue bar out of `fretboard-area`, into top of `right-content`

Extract PracticeBar/queue-empty-bar from `fretboard-area` and place it as the first child of `right-content`. This eliminates the gap because `right-content` uses `gap: 12px` — queue bar will be flush with the fretboard below it (only 12px gap).

### Decision 2 — Consolidate mobile settings into `right-content`

Remove the `top-settings` block from `main-content`. Instead, make the single `desktop-settings` block visible on both mobile and desktop by renaming it (or adjusting its CSS) and placing it as the last child of `right-content`. This simplifies the DOM (one Controls instance instead of two) and puts settings below the fretboard on mobile too.

The `<Controls />` component is rendered twice today purely as a CSS hack. We can eliminate the duplicate by removing `top-settings` from the JSX and making the single instance always-visible in its new position.

### Decision 3 — CSS `order` properties are no longer needed

`fretboard-area` currently has `order: 3` and `fretboard-playback` has `order: 3`. After the restructure the DOM order matches the visual order on all breakpoints, so flex `order` overrides can be removed from those elements.

## Risks / Trade-offs

- **Mobile settings discoverability**: Settings at the bottom require scrolling on small screens. Acceptable trade-off — settings are rarely changed mid-session, and the queue (now at top) is the primary interaction surface.
- **DOM simplification removes a safety net**: The duplicate-Controls pattern was a workaround for responsive layout. Removing it means a single Controls component must look correct at all widths — straightforward since Controls is self-contained.
