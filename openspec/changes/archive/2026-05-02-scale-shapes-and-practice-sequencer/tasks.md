# Tasks

This change is intentionally split into three independent chunks. Each chunk can be implemented in a separate session and committed independently. Implement Chunk 1 first (it has no UI dependencies), then Chunk 2, then Chunk 3.

---

## CHUNK 1 — Flat 2-Octave Position System

### 1. Extract and verify flat position interval templates

- [x] 1.1 Algorithmic approach confirmed: flat positions use window [rootFret-1, rootFret+3] on each string. Verified against reference image for all 7 modes of G major. No hard-coded templates needed.
- [x] 1.2 G major Ionian verified: loE F#(7)·G(1)·A(2), A: B(3)·C(4)·D(5), D: E(6)·F#(7)·G(1), etc. ✓
- [x] 1.3 Dorian (A) verified via script output — correct notes, 2–3 per string. ✓
- [x] 1.4 Aeolian (E) verified — open strings handled, labeled VI. ✓

### 2. Implement `calculateFlatPositions` in `positions.ts`

- [x] 2.1 Add `'flat'` to the `PositionSystem` type union.
- [x] 2.2 `DIATONIC_3NPS_TYPES` reused (same whitelist covers flat eligibility).
- [x] 2.3 No template interface needed — algorithmic window approach.
- [x] 2.4 No template constant needed — algorithm computes positions directly.
- [x] 2.5 `calculateFlatPositions` implemented: window [modeFret-1, modeFret+3] per string, same Roman numeral labels and natural minor offset as 3NPS.
- [x] 2.6 Added `'flat'` case to `calculatePositions` dispatch.
- [x] 2.7 Exported `isFlatEligible(chordScale)`.
- [x] 2.8 Also: unified CAGED templates (removed separate pentatonic set; updated E/D/A shape intervals to correctly produce 2-per-string pentatonic patterns via filtering).

### 3. Tests for flat positions

- [x] 3.1 Test: G major flat returns 7 positions labeled VII, I, II, III, IV, V, VI.
- [x] 3.2 Test: all highlighted notes are in G major scale.
- [x] 3.3 Test: each position has highlights on all 6 strings (≥ 2 per string).
- [x] 3.4 Test: 3NPS and flat position I share same startFret region (within ±2 frets).
- [x] 3.5 All 48 tests passing.

### 4. Wire flat into UI (minimal)

- [x] 4.1 Added `isFlatEligible` prop to `PositionControls.tsx`.
- [x] 4.2 Added `['flat', 'Flat']` to `SYSTEM_OPTIONS`, filtered by `isFlatEligible`.
- [x] 4.3 `App.tsx` imports and passes `isFlatEligible`, flat fallback reset added.
- [x] 4.4 Manual verify: select G major, enable Flat, navigate positions — patterns are correct 2-octave boxes.

---

## CHUNK 2 — Key-Centric Selector and UI Simplification

### 5. Music theory helpers

- [x] 5.1 In `musicTheory.ts`, add `getModesForKey(keyRoot: NoteName, keyType: 'major' | 'minor'): { degree: number, modeRoot: NoteName, scaleType: ScaleType }[]`. Returns all 7 mode positions for a key, in ascending degree order.
- [x] 5.2 Add `getDiatonicChords(keyRoot: NoteName, keyType: 'major' | 'minor'): { degree: number, root: NoteName, chordType: ChordType }[]`. Returns the 7 diatonic triads and 7th chords for a key.
- [x] 5.3 Add `CHORD_SCALE_MAP: Partial<Record<ChordType, ScaleType[]>>` — the chord-to-scale suggestion table from the design doc.
- [x] 5.4 Add `suggestScale(chordType: ChordType): ScaleType | undefined` — returns first entry from `CHORD_SCALE_MAP`.

### 6. Selector refactor

- [x] 6.1 Refactor `MusicTheoryControls.tsx`: primary view shows root note picker + [Major] [Minor] toggle + chord categories. Remove the 7-mode list from primary view.
- [x] 6.2 Add a `[Key ▸]` expander that reveals the key pop-out panel (in-line expansion, not a separate modal).
- [x] 6.3 The key pop-out shows mode buttons (I–VII with root label) and diatonic 7th chord buttons, computed from `getModesForKey` and `getDiatonicChords`. Clicking a mode button sets `selectedChordScale` to that mode's notes.
- [x] 6.4 Add "Add all 7th chords to queue" button in pop-out — pushes 7 items to the practice queue (requires queue state from App.tsx, passed as prop or via context).
- [x] 6.5 Preserve existing behavior: explicit scale type selection (Dorian, etc.) still works via the pop-out's explicit mode picker section.
- [ ] 6.6 Manual verify: select G, Major, open pop-out → see all 7 modes and 7 chords correctly labeled.

---

## CHUNK 3 — Practice Sequencer

### 7. Types and state

- [x] 7.1 Create `src/types/practice.ts` with `QueueItem` and `PracticePreset` types (see design doc).
- [x] 7.2 In `App.tsx`, add state: `practiceMode: boolean`, `queue: QueueItem[]`, `queueIndex: number`, `timer: number | null`.
- [x] 7.3 Add `advanceQueue()` function: increment `queueIndex` mod `queue.length`.
- [x] 7.4 Add `setQueueFromItem(item: QueueItem)` that applies a queue item to the fretboard state (`selectedChordScale`, `positionSystem`, `positionIndex`, `displayMode`).
- [x] 7.5 Add `useEffect` that calls `setQueueFromItem(queue[queueIndex])` whenever `practiceMode && queueIndex` changes.
- [x] 7.6 Add spacebar `keydown` listener in `App.tsx` (guarded: skip if focus is on input/button).
- [x] 7.7 Add timer `setInterval` effect keyed to `timer` value (clears on unmount or timer change).

### 8. Presets data

- [x] 8.1 Create `src/data/presets.ts`. Define `PRESETS: PracticePreset[]`.
- [x] 8.2 Add preset: "G Major Diatonic Scale Workout" — 7 flat positions (I–VII) then 7 3NPS positions of G major, displayMode = 'scales'.
- [x] 8.3 Add preset: "G Major Diatonic 7th Arpeggios" — 7 diatonic 7th chords, one CAGED position each, displayMode = 'arpeggios', chord-scale suggestions pre-populated.
- [x] 8.4 Add preset: "Autumn Leaves (G minor)" — Cm7→C Dorian, F7→F Mixolydian, Bbmaj7→Bb Ionian, Ebmaj7→Eb Ionian, Am7b5→A Locrian, D7→D Mixolydian, Gm7→G Dorian; each 3NPS position, displayMode = 'scales'.

### 9. PracticeBar component

- [x] 9.1 Create `src/components/PracticeBar.tsx`. Props: `queue`, `queueIndex`, `onAdvance`, `onRetreat`, `timer`, `onTimerChange`, `onEditQueue`.
- [x] 9.2 Render horizontal strip of queue items; highlight current item. Show prev/next buttons and "Press Space" hint.
- [x] 9.3 Render timer control: number input (seconds) + enable/disable toggle.
- [x] 9.4 Add CSS: `PracticeBar.css`.
- [x] 9.5 Wire into `App.tsx`: render `<PracticeBar>` below fretboard when `practiceMode && queue.length > 0`.

### 10. QueueEditor component

- [x] 10.1 Create `src/components/QueueEditor.tsx`. Props: `queue`, `onQueueChange`, `presets`, `onClose`.
- [x] 10.2 Render ordered list of queue items with remove (×) and reorder (drag or up/down arrows) controls.
- [x] 10.3 Add "Add Item" flow: root + chord/scale type picker → appends new QueueItem with `suggestScale` pre-populated.
- [x] 10.4 Add preset picker dropdown: loads selected preset into queue (overwrites).
- [x] 10.5 Add disabled "Share" button with a `// TODO: URL encoding` comment.
- [x] 10.6 Add CSS: `QueueEditor.css`.
- [x] 10.7 Wire "Edit Queue" button in PracticeBar to open/close QueueEditor (toggle in App.tsx state).

### 11. Practice mode toggle

- [x] 11.1 Add [Practice] toggle button in the header or toolbar area of `App.tsx`.
- [x] 11.2 When activating practice mode with an empty queue, auto-load the "G Major Diatonic Scale Workout" preset as a default starting point (show a brief hint).
- [ ] 11.3 Manual verify end-to-end: load Autumn Leaves preset → advance through 7 chords with spacebar → fretboard updates correctly for each chord.
- [ ] 11.4 Manual verify: timer at 8 seconds auto-advances through the queue.
- [ ] 11.5 Manual verify: pop-out "Add all 7th chords" adds items to queue and they display correctly in PracticeBar.
