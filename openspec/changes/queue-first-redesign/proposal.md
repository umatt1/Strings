## Why

The current design has three friction points that fight the app's core purpose: (1) a "Practice Mode" toggle creates a confusing two-state app where the queue feels like a hidden bonus feature rather than the main thing; (2) adding chords to the queue inherits whatever position system is active, dumping position highlights everywhere unexpectedly; (3) the "Chord Tones" and "Triad" display mode tabs in PositionControls are redundant now that chord selection from the left panel already shows exactly the notes you chose — they add visual noise with no clear payoff.

The fix is to make the queue always-on, make positions explicitly opt-in per item, and strip the display mode selector down to what's actually useful.

## What Changes

**Remove Practice Mode toggle**
- The "Practice" / "Exit Practice" button is removed entirely.
- The queue is always visible as a persistent bar below the fretboard (shown when queue is non-empty; a subtle empty-state prompt otherwise).
- The `refSnapshot` / restore-on-exit behavior is removed (no longer needed — there's no mode to exit).
- `usePracticeMode` hook is simplified: `practiceMode` state goes away; queue, queueIndex, timer, and navigation handlers remain.
- The spacebar advance shortcut remains active whenever the queue is non-empty.

**Positions default to none when adding to queue**
- `handleAddCurrentToQueue` saves `positionSystem: 'none'` and `positionIndex: 0` regardless of current position state.
- `handleAddChordsToQueue` (called by "+ All 7ths to queue" and "+ All modes to queue") also defaults to `positionSystem: 'none'`.
- All built-in presets that currently use flat/3nps/caged positions are updated to `positionSystem: 'none'` — the user can opt into positions manually via the PositionControls bar.
- The `QueueEditor` "+ Add Item" picker defaults to `positionSystem: 'none'`.
- Queue item editing still lets the user change position system per item if they want it.

**Remove Chord Tones and Triad display mode tabs**
- The "Chord Tones" (`arpeggios`) and "Triad" (`chords`) tabs are removed from `PositionControls`.
- The `DisplayMode` type retains `'arpeggios'` and `'chords'` values internally (used by position filtering logic) but they are no longer user-selectable from the UI.
- The fretboard defaults to `'scales'` (All Notes) display mode.
- `onDisplayModeChange` callbacks that set `'scales'` remain; calls that set `'arpeggios'` or `'chords'` are reviewed — chord selection from the left panel continues to call `onDisplayModeChange?.('scales')`.
- The display mode tab row is removed or collapses to a single "All Notes" label (no toggle needed).

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `practice-queue`: Always-on queue replaces practice mode toggle; `positionSystem` defaults to `'none'` when adding items; spacebar active when queue non-empty.
- `ui`: Practice Mode toggle removed; PositionControls display mode tabs reduced to All Notes only; queue bar shown as persistent UI below fretboard.

## Impact

- `src/hooks/usePracticeMode.ts` — remove `practiceMode` / `refSnapshot` state; simplify toggle handler
- `src/App.tsx` — remove Practice toggle button and conditional; queue bar always rendered when non-empty; spacebar guard changes from `practiceMode` to `queue.length > 0`
- `src/components/PositionControls.tsx` — remove Chord Tones and Triad tabs
- `src/components/PositionControls.css` — related style cleanup
- `src/App.css` — remove `.practice-toggle-row` styles
- `src/data/presets.ts` — set all `positionSystem: 'none'` across all preset items
- `src/components/QueueEditor.tsx` — default new items to `positionSystem: 'none'`
- `src/components/MusicTheoryControls.tsx` — `handleAddChordsToQueue` items get `positionSystem: 'none'`
