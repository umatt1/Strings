## Why

Browser exploration revealed a cluster of concrete bugs (truncated button labels, a dead conditional, wrong enharmonic in a preset) alongside UX friction points (unlabeled queue items, no queue-item editing, duplicate degree rows, practice bar buried off-screen) that collectively make the app harder to trust and use during real practice. Fixing them as a single batch keeps scope tight while delivering a meaningfully more polished experience.

## What Changes

**Bugs**
- Fix chord-name button text truncation (`Cmaj7` → `Cm...`, `Ebmaj7` → `Eb...`): tighten CSS so labels render fully or wrap gracefully.
- Fix dead conditional in `QueueEditor.addItem()`: `displayMode: suggested ? 'scales' : 'scales'` always resolves to `'scales'`; should be `'arpeggios'` for chord-type additions.
- Fix `Autumn Leaves` preset: item 3 uses `'A#'` for Bb Ionian — must resolve to `'Bb'` via `displayNote()` or switch root to the canonical flat.
- Delete `src/components/Controls_backup.tsx` (empty dead file).

**UX improvements**
- Add an optional `label` field to `QueueItem` so preset authors and the queue editor can assign human-readable names (e.g., `"Flat Pos VII"`, `"CAGED G Shape"`, `"Autumn Leaves — Cm7→F7"`).
- Update `itemLabel()` in `QueueEditor` to use `item.label` when present, falling back to a formatted string that includes the position index.
- Show the resolved label in the `PracticeBar` cards (replacing the raw `"G Ionian (Mode 1)"` text).
- Add **queue-item editing**: each row in `QueueEditor` gets an edit affordance that lets the user change root, type, position system, position index, and display mode in-place, then confirm.
- Visually differentiate the CHORDS degree-button row from the SCALES degree-button row (currently identical appearance, easily confused). Different background or label style to communicate which section each belongs to.
- Make the `PracticeBar` sticky or scroll into view automatically when practice mode is entered — it must be visible without manual scrolling.
- Reduce fretboard dead space below the last string when using position highlighting.

**Architecture**
- Extract practice-mode state and handlers from `App.tsx` into a `usePracticeMode` custom hook (`src/hooks/usePracticeMode.ts`), accepting a snapshot callback and returning queue controls. Keeps `App.tsx` manageable as complexity grows.
- Update all presets to populate the new `label` field with descriptive position names.

## Capabilities

### New Capabilities
- `queue-item-label`: `QueueItem` gets an optional `label: string` field; `QueueEditor` and `PracticeBar` display it; preset definitions populate it.
- `queue-item-editing`: In-place editing of individual queue items (root, type, position system, position index, display mode) within `QueueEditor`.

### Modified Capabilities
- `ui`: Chord-name button overflow fixed; CHORDS vs SCALES degree rows visually differentiated; practice bar scroll behavior.
- `practice-queue`: `itemLabel()` logic, `PracticeBar` card labels, `addItem()` display-mode default, Autumn Leaves preset root enharmonic.

## Impact

- `src/types/practice.ts` — add `label?: string` to `QueueItem`
- `src/components/QueueEditor.tsx` — `itemLabel()`, `addItem()`, new edit UI
- `src/components/PracticeBar.tsx` — card label rendering
- `src/components/MusicTheoryControls.css` — CHORDS vs SCALES row differentiation
- `src/components/MusicTheoryControls.tsx` — possibly CSS class change on degree rows
- `src/data/presets.ts` — add labels, fix Autumn Leaves root
- `src/App.tsx` — extract `usePracticeMode` hook
- `src/hooks/usePracticeMode.ts` — new file
- `src/components/Controls_backup.tsx` — deleted
