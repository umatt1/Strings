## Why

Two related layout problems appeared after moving Settings below the fretboard:

1. **PlaybackControls is too bulky.** The "Listen" collapsible panel occupies a prominent full-width section for what amounts to at most 2 small buttons (play + clear) and a line of instructional text. Its green gradient header and full panel treatment is disproportionate to its utility.

2. **Fretboard has a large empty gap at the bottom.** The `.fretboard-panel` has `flex: 1` and `min-height: 500px`, causing it to stretch to fill the right column's remaining height even when the fretboard content is shorter than that space. This creates obvious dead whitespace below the fret rows.

## What Changes

- **PlaybackControls** is reduced to a compact inline toolbar row — no panel chrome, no collapsible header. It sits as a slim bar between the fretboard and the settings panel. When nothing is selected, it shows nothing (or disappears entirely). When a chord/scale is selected, it shows a one-line hint. When 2 notes are selected, it shows the play and clear buttons inline.
- **Fretboard gap** is fixed by removing `flex: 1` from `.fretboard-panel` so the panel sizes to its content rather than stretching to fill available height.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `ui`: PlaybackControls renders as a compact bar, not a collapsible panel. Fretboard panel no longer stretches to fill container height.

## Impact

- `src/components/PlaybackControls.tsx`: Remove the collapsible panel wrapper and header; render as a flat compact row.
- `src/components/PlaybackControls.css`: Remove panel/header/collapse styles; keep only the compact inline styles.
- `src/App.css`: Remove `flex: 1` from `.fretboard-panel` (and the associated `min-height`); let it size to content.
