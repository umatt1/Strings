## Context

**PlaybackControls today:**
- Renders as a white card with a green gradient header ("🎵 Listen"), collapse toggle, and a body with status-dependent content
- Three states: no chord/scale selected → disabled hint; chord selected, no notes → instruction text; 2 notes selected → play + clear buttons
- The collapsed state just hides the body; the header always takes up ~56px
- Component has `isCollapsed` state and a `toggleCollapse` handler — all of this adds complexity for minimal benefit

**Fretboard gap today:**
- `.fretboard-panel` has `flex: 1` + `min-height: 500px` (desktop), causing it to stretch to fill the parent flex container's height
- The right column (`right-content`) itself fills a minimum of 70vh at 1024px+ (from `.main-content { min-height: 70vh }`)
- Fretboard rows are fixed height per string count; on a 6-string guitar ~380px total, leaving ~120-200px empty below

## Goals / Non-Goals

**Goals:**
- PlaybackControls renders as a single compact line — no panel chrome, no expand/collapse
- Fretboard panel sizes to its content; no empty space below the last fret row

**Non-Goals:**
- Changing any playback audio logic
- Changing what triggers playback (2-note selection)
- Removing the "Select 2 notes" instructional hint (keep it, just make it smaller)

## Decisions

### Decision 1 — PlaybackControls becomes a stateless compact bar

Remove `isCollapsed` state and the `toggleCollapse` handler entirely. The component renders a single `<div className="playback-bar">` with conditional content:
- **No chord/scale**: render nothing (return `null`) — no reason to take up space when there's nothing to play
- **Chord selected, 0 notes**: render a tiny muted hint (`Select 2 notes to play`)
- **Chord selected, 2 notes**: render play button + clear button inline

This is consistent with the queue-empty-bar pattern already in the app — a minimal bar when relevant, invisible otherwise.

### Decision 2 — Fretboard panel: `height: auto`, remove `flex: 1`

Change `.fretboard-panel` from `flex: 1; min-height: 500px` to `height: auto`. The fretboard component renders a scrollable div; it will take its natural height. To preserve the horizontal scroll behavior, keep `overflow: hidden` and `display: flex` on the panel.

Also remove `min-height: 70vh` from `.main-content` at 1024px+ — this was the root cause of the column stretching. The layout doesn't need a minimum viewport height; content should define its own height.

### Decision 3 — PlaybackControls.css: strip to minimal styles

Keep only what the compact bar needs. Remove all panel, header, collapse, and shadow styles. This reduces ~250 lines to ~60.

## Risks / Trade-offs

- **Playback bar less discoverable**: Moving from a persistent panel header to "appears when relevant" means users who never select 2 notes won't see any playback UI. Low risk — the feature is secondary and the instructional text still appears once a chord is selected.
- **Fretboard height change feels different**: On very small screens, removing `min-height` could make the fretboard shorter. Mitigated by keeping a reasonable `min-height` on `.fretboard-panel` (e.g., 300px) as a floor.
