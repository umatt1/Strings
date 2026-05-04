## Context

The app currently has two conceptual modes: "reference mode" (browsing chords/scales) and "practice mode" (cycling a queue). The toggle between them creates friction — users have to mentally switch modes, the queue feels like a hidden feature, and adding to the queue mid-reference-mode requires remembering to activate practice mode. The queue IS the interesting part; making it always visible and always active removes a layer of indirection. Position system inheritance when adding to the queue is a separate but related annoyance: the user's current exploration state (e.g., CAGED position 3) bleeds into queue items, producing unexpected visual noise on playback.

## Goals / Non-Goals

**Goals:**
- Queue is always-on; no "Practice Mode" button
- Spacebar advance works whenever queue has items
- `positionSystem: 'none'` is the default when adding any item to the queue
- Display mode tabs reduced to "All Notes" only (Chord Tones and Triad removed from UI)
- Presets updated to `positionSystem: 'none'`
- Behavior is otherwise unchanged: timer, queue editor, labels, editing all remain

**Non-Goals:**
- Removing or reworking the position system itself (separate proposal)
- Changing how positions display on the fretboard when a user manually selects one
- Removing `DisplayMode` type values from code (only removed from the UI selector)
- Changing how diatonic chord/scale selection or tension system works

## Decisions

### Decision 1 — Always-on queue: persistent bar, empty-state prompt

The `PracticeBar` renders whenever `queue.length > 0`. When the queue is empty, a slim placeholder strip renders below the fretboard saying "Queue is empty — add chords or scales from the panel" (or similar). This replaces the "Practice" button entirely; there is no toggle.

Alternative considered: hide the bar entirely when empty, show only on first add. Rejected — the empty state strip is a useful affordance that teaches the user the queue concept on first load.

### Decision 2 — `usePracticeMode` retains queue/navigation state, drops mode flag

Remove: `practiceMode`, `refSnapshot`, `handlePracticeModeToggle`.  
Keep: `queue`, `queueIndex`, `timer`, `queueEditorOpen`, `advanceQueue`, `retreatQueue`, `handleAddChordsToQueue`, `handleAddCurrentToQueue`, `setQueue`, `setTimer`, `setQueueEditorOpen`.

The hook no longer needs `getCurrentSnapshot` / `applySnapshot` callbacks since there's no restore-on-exit. The signature becomes `usePracticeMode()` with no arguments.

The spacebar `useEffect` in `App.tsx` changes its guard from `if (!practiceMode) return` to `if (queue.length === 0) return`.

### Decision 3 — Position system defaults to none when adding; user opts in via PositionControls

`handleAddCurrentToQueue`: always save `positionSystem: 'none', positionIndex: 0` (ignore current `positionSystem` state).

`handleAddChordsToQueue`: the items array passed in already has `positionSystem` set by the caller (MusicTheoryControls). Change the callers to pass `positionSystem: 'none'` for all items.

`QueueEditor.addItem()`: change default from `positionSystem: '3nps'` to `positionSystem: 'none'`.

All preset items: `positionSystem: 'none'`.

The PositionControls bar remains — the user can still manually set a position system. When they navigate the queue, the queue item's `positionSystem` (which will usually be `'none'`) is applied to the fretboard. If the user then selects CAGED from the bar, that session-level choice applies to the current item view but is NOT saved back to the queue item (queue items are immutable during playback, per existing behavior).

### Decision 4 — Display mode selector: remove Chord Tones and Triad tabs entirely

`PositionControls` currently renders three tabs: "All Notes" | "Chord Tones" | "Triad". Remove the latter two. The tab row can be removed entirely if "All Notes" is the only option, since a single non-interactive label is not useful.

The `DisplayMode` type (`'scales' | 'arpeggios' | 'chords'`) is retained in code — it is still used internally by the fretboard's note-filtering logic and may be used by position systems. Only the user-facing selector is removed.

`onDisplayModeChange?.('scales')` calls remain where they are — they now always set the only valid display mode. The prop stays in the interface for forward-compatibility.

The `displayMode` state in `App.tsx` remains, initialized to `'scales'`, and effectively locked there for UI purposes.

### Decision 5 — No changes to the fretboard, position system logic, or tension system

The position system (flat boxes, 3NPS, CAGED) still works exactly as before when the user explicitly selects it from PositionControls. Queue items that happen to have `positionSystem: 'none'` will show all notes on the fretboard without position highlighting — which is exactly what the user wants as the default experience.

## Risks / Trade-offs

- **Presets lose position context**: The G Major Scale Workout was designed to cycle through flat and 3NPS positions. With `positionSystem: 'none'` on all items, that preset becomes "G Ionian repeated 14 times" with no position changes. The labels still say "G Ionian · Flat I" etc., but the fretboard won't highlight a specific box. **Mitigation**: This is acceptable for now; the preset can be redesigned in a future positions proposal. The label still communicates intent.
- **Power users lose Chord Tones / Triad tabs**: Someone using the app to see only chord tones on the fretboard loses that tab. **Mitigation**: The chord tone filtering still works if a queue item is set to `displayMode: 'arpeggios'` via the queue editor — it's just not a quick tab anymore. This is a conscious simplification.
