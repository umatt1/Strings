# Tasks

---

## 1. Remove practice mode toggle from App.tsx

- [x] 1.1 In `src/App.tsx`, remove the `<div className="practice-toggle-row">` block (the Practice / Exit Practice button).
- [x] 1.2 Remove the `.practice-toggle-row` CSS rule from `src/App.css`.
- [x] 1.3 Remove the `practiceMode` guard from the spacebar `useEffect`: change `if (!practiceMode) return` to `if (queue.length === 0) return`.
- [x] 1.4 Verify: no "Practice" or "Exit Practice" button visible anywhere on the page.

---

## 2. Simplify `usePracticeMode` hook

- [x] 2.1 Remove `practiceMode` and `refSnapshot` state declarations from `src/hooks/usePracticeMode.ts`.
- [x] 2.2 Remove `handlePracticeModeToggle` function.
- [x] 2.3 Remove the `getCurrentSnapshot` and `applySnapshot` parameters from the hook signature (new signature: `usePracticeMode(onItemActivated, getSelectedChordScale)`).
- [x] 2.4 Remove the `setQueueFromItem` helper (its logic inlined into the `queueIndex` effect directly).
- [x] 2.5 Remove from the hook's return value: `practiceMode`, `handlePracticeModeToggle`.
- [x] 2.6 Update `App.tsx` to call `usePracticeMode()` with new signature and remove all references to `practiceMode` and `handlePracticeModeToggle`.
- [x] 2.7 The queue `useEffect` that applies `queueIndex` changes fires unconditionally (no `practiceMode` guard).
- [x] 2.8 Run `npm run build` to verify no type errors.

---

## 3. Always render the queue bar (remove condition)

- [x] 3.1 In `src/App.tsx`, replace the `{practiceMode && queue.length > 0 && (<PracticeBar...>)}` with always-rendered queue bar: PracticeBar when non-empty, empty-state div when empty.
- [x] 3.2 Add `.queue-empty-bar` CSS in `src/App.css`: slim bar, dark blue background matching PracticeBar, muted italic text, centered.

---

## 4. Default positionSystem to none when adding to queue

- [x] 4.1 In `src/hooks/usePracticeMode.ts`, in `handleAddCurrentToQueue`: `positionSystem: 'none'`, `positionIndex: 0`.
- [x] 4.2 In `src/components/MusicTheoryControls.tsx`, in `handleAddAllChordsToQueue`: `positionSystem: 'none'`, `positionIndex: 0`.
- [x] 4.3 In `src/components/MusicTheoryControls.tsx`, in `handleAddAllModesToQueue`: `positionSystem: 'none'`, `positionIndex: 0`.
- [x] 4.4 In `src/components/QueueEditor.tsx`, in `addItem()`: `positionSystem: 'none'`.

---

## 5. Update all presets to positionSystem none

- [x] 5.1 `G_MAJOR_FLAT_ITEMS`: `positionSystem: 'none'`, `positionIndex: 0`.
- [x] 5.2 `G_MAJOR_3NPS_ITEMS`: `positionSystem: 'none'`, `positionIndex: 0`.
- [x] 5.3 `G_MAJOR_ARPEGGIOS`: `positionSystem: 'none'` for all 7 items.
- [x] 5.4 `AUTUMN_LEAVES`: `positionSystem: 'none'` for all 7 items.
- [x] 5.5 `G_BLUES`: `positionSystem: 'none'` for all 6 items (via `bluesItem`).

---

## 6. Remove Chord Tones and Triad tabs from PositionControls

- [x] 6.1 In `src/components/PositionControls.tsx`, remove the display mode tab row entirely. Remove `displayMode`, `onDisplayModeChange`, `isScaleSelected` props from the interface.
- [x] 6.2 Remove unused `DisplayMode` import from PositionControls.tsx.
- [x] 6.3 In `src/App.tsx`, remove `displayMode` and `onDisplayModeChange` props passed to `<PositionControls>`.
- [x] 6.4 Clean up related CSS in `src/components/PositionControls.css`.
- [x] 6.5 `onDisplayModeChange` prop remains wired on `<MusicTheoryControls>` (sets displayMode state in App, fretboard reads it).

---

## 7. Manual verification

- [x] 7.1 No "Practice" or "Exit Practice" button is visible.
- [x] 7.2 On load, the empty-state queue bar is visible below the fretboard.
- [x] 7.3 Adding a chord via "+ Queue" → queue bar shows the card with no position highlight on fretboard.
- [x] 7.4 Spacebar cycles through queue items when queue is non-empty.
- [x] 7.5 Spacebar does nothing when queue is empty.
- [x] 7.6 "+ All 7ths to queue" → 7 items added, no position system active on any of them.
- [x] 7.7 Load G Major Scale Workout preset → fretboard shows full-neck G Ionian with no box position highlight.
- [x] 7.8 No "Chord Tones" or "Triad" tabs visible in PositionControls.
- [x] 7.9 Selecting a chord from the left panel shows all its notes on the fretboard.
- [x] 7.10 Manually selecting CAGED from PositionControls still works (position system is still accessible).
- [x] 7.11 `npm run build` passes with no errors.
