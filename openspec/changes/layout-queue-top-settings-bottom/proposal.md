## Why

The queue bar currently sits below the fretboard with a visual gap that makes it feel disconnected from the content above. Meanwhile, the Settings panel occupies prime real estate at the top of the right column — a location that should belong to the most-used control surface. Since the queue is central to the practice workflow, it should be immediately visible and easy to reach, not pushed to the bottom where the eye lands last.

## What Changes

- The queue bar (PracticeBar / queue-empty-bar) moves from below the fretboard to the top of the right column, replacing the current position of the Settings panel.
- The Settings panel (instrument, tuning, accidentals, color theme) moves to below the fretboard, after the PlaybackControls area.
- On mobile, the top-settings Controls block likewise moves below the fretboard/playback area.
- The visual gap between fretboard and queue is eliminated.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `ui`: Layout order of queue bar and settings panel is swapped — queue goes top, settings go bottom.

## Impact

- `src/App.tsx`: Reorder DOM elements — move PracticeBar/queue-empty-bar before the fretboard-area block, move desktop-settings after fretboard-playback.
- `src/App.css`: Update any flex/grid ordering, margin/padding that assumes current order (queue below fretboard, settings above).
- Mobile layout (`top-settings`) moves below fretboard as well — CSS show/hide rules may need updating to accommodate the new position.
