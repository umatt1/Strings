# Tasks

---

## 1. Bugs — trivial fixes

- [x] 1.1 Delete `src/components/Controls_backup.tsx` (empty dead file).
- [x] 1.2 Fix `QueueEditor.addItem()` dead conditional: change `displayMode: suggested ? 'scales' : 'scales'` to `displayMode: isChordType(addType) ? 'arpeggios' : 'scales'`.
- [x] 1.3 Fix chord-name button truncation: in `MusicTheoryControls.css`, adjust `.chord-btn-sm` so labels do not clip (reduce font-size, allow wrapping, or increase min-width).

---

## 2. Add `label` field to `QueueItem`

- [x] 2.1 In `src/types/practice.ts`, add `label?: string` to the `QueueItem` interface.
- [x] 2.2 In `src/components/QueueEditor.tsx`, update `itemLabel(item)` to return `item.label` when it is a non-empty string, falling back to `"${item.chordScale.rootNote} ${item.chordScale.type} · pos ${item.positionIndex + 1}"`.
- [x] 2.3 In `src/components/PracticeBar.tsx`, update card label rendering to use the same resolved label logic (import the helper or duplicate the two-line fallback).

---

## 3. Update presets with labels

- [x] 3.1 In `src/data/presets.ts`, update `G_MAJOR_FLAT_ITEMS` to add `label: "G Ionian · Flat I"` through `"G Ionian · Flat VII"` (use `.map((i) => ({ ..., label: \`G Ionian · Flat \${romanFromIndex(i)}\` }))` or inline).
- [x] 3.2 Update `G_MAJOR_3NPS_ITEMS` with `label: "G Ionian · 3NPS I"` through `"G Ionian · 3NPS VII"`.
- [x] 3.3 Update `G_MAJOR_ARPEGGIOS` items with labels e.g., `"Gmaj7 · CAGED"`, `"Am7 · CAGED"`, etc.
- [x] 3.4 Update `AUTUMN_LEAVES` items with labels: `"Cm7 (C Dorian)"`, `"F7 (F Mixolydian)"`, `"Bb Ionian"`, `"Eb Ionian"`, `"Am7b5 (A Locrian)"`, `"D7 (D Mixolydian)"`, `"Gm7 (G Dorian)"`.
- [x] 3.5 Update `G_BLUES` items with labels: `"G Major Pent (I)"`, `"C Major Pent (IV)"`, `"G Major Pent (I)"`, `"D Major Pent (V)"`, `"C Major Pent (IV)"`, `"G Major Pent (I)"`.

---

## 4. Queue item in-place editing

- [x] 4.1 Add `editingId: string | null` state to `QueueEditor` (tracks which item row is expanded).
- [x] 4.2 Add a draft-state object `draftItem: Partial<QueueItem>` that is populated from the item when edit is opened.
- [x] 4.3 Add an "Edit" button (pencil icon or text) to each `queue-list-item` row. Clicking it sets `editingId` to that item's id and populates `draftItem`.
- [x] 4.4 When `item.id === editingId`, render an expanded inline form with:
  - Root note `<select>` (all 12 NOTES)
  - Type `<select>` (same grouped options as Add Item picker — reuse CHORD_CATEGORIES / SCALE_CATEGORIES)
  - Position system `<select>` (none, flat, 3nps, caged)
  - Position index `<input type="number" min={0}>` 
  - Display mode `<select>` (scales, arpeggios, chords)
  - Label `<input type="text" placeholder="Custom label (optional)">` pre-filled with `item.label ?? ''`
- [x] 4.5 "Confirm" button: merges `draftItem` into the queue item, recomputes `notes` from the new root+type, sets `editingId` to `null`.
- [x] 4.6 "Cancel" button: sets `editingId` to `null` with no changes.
- [x] 4.7 Opening a new edit row while one is already open closes the previous (sets `editingId` to the new id; draft state is reset from the new item).
- [x] 4.8 Add CSS for `.qli-edit-form` expanded state (compact grid layout inside the list row).

---

## 5. Visually differentiate CHORDS vs SCALES degree rows

- [x] 5.1 In `MusicTheoryControls.tsx`, add a `scale-mode-btn` CSS class to the degree buttons rendered in the SCALES section's `scale-row` div (not the CHORDS section row).
- [x] 5.2 In `MusicTheoryControls.css`, add `.scale-mode-btn` with a visually distinct style (e.g., lighter background, blue tint, or subtle border change) that is clearly different from the default `.mode-btn` but not jarring.
- [x] 5.3 Verify: clicking a button in the CHORDS row activates chord selection (tension buttons appear); clicking the visually-distinct button in the SCALES row activates scale selection (no tension buttons).

---

## 6. Practice bar scroll-into-view on entry

- [x] 6.1 In `App.tsx`, add a `practiceBarRef = useRef<HTMLDivElement>(null)` and attach it to the `<PracticeBar>` wrapper div.
- [x] 6.2 Add a `useEffect` that fires when `practiceMode` becomes `true`: call `practiceBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })`.
- [x] 6.3 Verify: clicking "Practice" causes the PracticeBar to scroll into view on a standard 1280×800 viewport without the user touching the scrollbar.

---

## 7. Extract `usePracticeMode` hook

- [x] 7.1 Create `src/hooks/usePracticeMode.ts`.
- [x] 7.2 Move into the hook: `practiceMode`, `queue`, `queueIndex`, `timer`, `queueEditorOpen`, `refSnapshot` state declarations.
- [x] 7.3 Move into the hook: `setQueueFromItem`, `advanceQueue`, `retreatQueue`, `handlePracticeModeToggle`, `handleAddChordsToQueue`, `handleAddCurrentToQueue` handlers.
- [x] 7.4 The hook's signature: `usePracticeMode(getCurrentSnapshot: () => RefSnapshot)` — the callback lets the hook capture app state at the moment practice mode is entered without needing direct access to all App state.
- [x] 7.5 Return from the hook: all state values and all handlers that `App.tsx` needs to pass to child components.
- [x] 7.6 In `App.tsx`, replace the moved state/handlers with the hook call. Verify the spacebar `useEffect` and timer `useEffect` continue to work (both reference `advanceQueue` from the hook's return).
- [x] 7.7 Run `npm run build` to confirm no type errors or regressions.

---

## 8. Manual verification

- [x] 8.1 C Major: chord-name row shows `Cmaj7` (not `Cm...`); all 7 names fully visible.
- [x] 8.2 C Minor: chord-name row shows `Ebmaj7` and `Abmaj7` fully.
- [x] 8.3 Adding a chord type (e.g., Am7) via "+ Add Item" → new item has `displayMode: arpeggios`.
- [x] 8.4 Load Autumn Leaves preset → items 3 and 4 show `"Bb Ionian"` and `"Eb Ionian"` in QueueEditor.
- [x] 8.5 Load G Major Scale Workout → PracticeBar cards show labels like `"G Ionian · Flat I"`.
- [x] 8.6 SCALES degree row buttons look visually distinct from CHORDS degree row buttons.
- [x] 8.7 Clicking Practice → PracticeBar scrolls into view automatically.
- [x] 8.8 Edit a queue item: change root, confirm → label updates; cancel → no change.
- [x] 8.9 `npm run build` passes with no errors.
