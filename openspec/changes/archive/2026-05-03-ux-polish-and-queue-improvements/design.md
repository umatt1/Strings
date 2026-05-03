## Context

The app has accumulated a cluster of concrete bugs and UX rough edges since the major theory-panel and practice-sequencer builds. A browser-based exploration session identified: button-label truncation, a silent dead conditional in queue-item creation, a wrong enharmonic in a preset, an empty backup file, and multiple usability gaps in the Practice Queue (unlabeled items, no in-place editing, practice bar off-screen). The focus of this design is SHAPES — navigating between fretboard positions — rather than note memorization, so the queue's position metadata must be visible and editable.

## Goals / Non-Goals

**Goals:**
- All four bugs fixed and no regressions introduced
- `QueueItem.label` field added and surfaced in PracticeBar + QueueEditor
- Queue items editable in-place (root, type, position system, position index, display mode)
- CHORDS and SCALES degree-button rows visually distinct
- PracticeBar visible without scrolling when practice mode is entered
- Practice-mode logic extracted to a custom hook
- Preset definitions updated with human-readable labels

**Non-Goals:**
- Self-quiz / note-hiding mode (separate proposal)
- Fretboard fret-range restriction
- Queue item drag-and-drop reorder
- Persistence / localStorage
- Sharing / URL encoding (noted as TODO in code, stays as TODO)

## Decisions

### Decision 1 — `label?: string` on `QueueItem`, not a computed property

The position label (e.g., "G Shape", "Pos VII") is only knowable at the time the item is created, because `calculatePositions()` depends on the current `instrument` and isn't accessible in `QueueEditor`. Storing it as an optional string on the item is the simplest correct approach. When absent, `itemLabel()` falls back to `"${rootNote} ${scaleType} · pos ${positionIndex + 1}"`.

Alternative considered: compute position labels on the fly by running `calculatePositions()` inside the editor. Rejected because it requires threading `instrument` into the editor and couples the display component to expensive calculations.

### Decision 2 — Edit UI: inline expand, not a separate modal

Each queue row gets an expand toggle (pencil icon or "Edit" text button). Clicking it expands the row into an inline form with dropdowns for root, type, position system, position index, and a display-mode toggle. Confirm/Cancel buttons collapse it. This avoids nested modals and keeps context visible.

Alternative considered: a separate "Edit Item" modal opened from each row. Rejected — it's heavier and loses the list context while editing.

### Decision 3 — `usePracticeMode` hook: state + handlers only, no JSX

The hook owns: `practiceMode`, `queue`, `queueIndex`, `timer`, `queueEditorOpen`, `refSnapshot`. It returns action handlers (`advanceQueue`, `retreatQueue`, `handlePracticeModeToggle`, `handleAddChordsToQueue`, `handleAddCurrentToQueue`) and setters for queue and timer. `App.tsx` retains the `useEffect` for the spacebar listener (it needs `window`) but calls `advanceQueue` from the hook's return value.

The hook does NOT render anything. `App.tsx` and child components remain the render boundary.

### Decision 4 — PracticeBar scroll behavior: `scrollIntoView` on practice mode entry

When `practiceMode` flips from `false` to `true`, `App.tsx` calls `.scrollIntoView({ behavior: 'smooth', block: 'nearest' })` on a ref attached to the `PracticeBar` container. This is simpler than making the bar sticky (sticky positioning requires careful CSS stacking-context work with the existing layout) and preserves the current layout structure.

Alternative: sticky positioning for PracticeBar. Rejected for now — the existing `.fretboard-panel` has `overflow: auto` for infinite scroll; a sticky child inside it would need rework.

### Decision 5 — Differentiate CHORDS vs SCALES degree rows: background tint only

The CHORDS section header already says "CHORDS" and the SCALES section header says "SCALES". The degree buttons themselves will get a subtle background tint: CHORDS buttons get the existing default (no change), SCALES buttons get a lighter blue tint (matching the existing `pent-btn` orange style family but distinguishable). No shape or size change — just color.

This is the lowest-friction change: CSS class addition on the Scales degree row buttons (`mode-btn scale-mode-btn`) with a small `.scale-mode-btn` rule in MusicTheoryControls.css.

### Decision 6 — Autumn Leaves preset: switch rootNote to canonical enharmonic

`item('A#', 'ionian', ...)` for Bb Ionian should be `item('A#', 'ionian', ...)` with a `label: 'Bb Ionian'`. Since `getMusicTheoryNotes` is internally consistent on sharps/flats and display is handled at render time by `displayNote()`, the root stays `'A#'` in the data but the label explicitly reads `'Bb Ionian'`. This makes the queue editor show the right label without changing the internal note calculation.

### Decision 7 — `addItem()` displayMode fix: chord type → arpeggios

`displayMode: suggested ? 'scales' : 'scales'` becomes `displayMode: isChordType(addType) ? 'arpeggios' : 'scales'`. The `suggestScale` check already exists and `suggested` is unused for display mode — cleaner to gate directly on `isChordType`.

## Risks / Trade-offs

- **In-place edit UX complexity**: Inline expansion in a scrollable list can feel cramped. Mitigation: limit the expanded form width to the modal width and use compact select elements.
- **`usePracticeMode` hook migration**: Moving state out of `App.tsx` must not break the spacebar `useEffect` or the timer `useEffect` which both reference `advanceQueue`. Mitigation: the hook returns a stable `advanceQueue` ref (via `useCallback`) that `App.tsx` captures.
- **Preset label maintenance**: Labels are free-text strings and can become stale if positions change. Mitigation: labels are optional; if absent the fallback is still informative.
