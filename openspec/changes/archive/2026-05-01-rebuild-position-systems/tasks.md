## 1. Derive verified CAGED shape interval tables

- [x] 1.1 For each of the 5 shapes (E, D, C, A, G), extract `baseFret` and per-string semitone intervals from the existing C major test data in `positions.test.ts`
- [x] 1.2 Verify the derived intervals produce correct notes when applied to G major (rootFret=3) against the G major test data
- [x] 1.3 Verify the derived intervals produce correct notes when applied to A major (rootFret=5) against the A major test data
- [x] 1.4 Record the final `baseOff` and `stringIntervals` table for all 5 shapes (document in a comment in `positions.ts`)

## 2. Rewrite `calculateCAGED`

- [x] 2.1 Update `CAGEDShapeTemplate` interface: replace `stringRanges: [number, number][]` with `stringIntervals: number[][]`
- [x] 2.2 Replace the 5 template objects with interval-based templates derived in task 1
- [x] 2.3 Rewrite the inner highlight loop: for each string, emit `{ stringIndex, fretNumber: baseFret + interval }` for each interval, filtered to notes in `scaleNotes`
- [x] 2.4 Remove the window-based `strStart`/`strEnd` loop logic
- [x] 2.5 Run existing CAGED tests (`npm run test` or vitest) and verify all pass

## 3. Rewrite `calculate3NPS` starting fret logic

- [x] 3.1 Before the per-position loop, compute `rootFret`: scan frets 0–11 on the lowest string for the scale's `rootNote`
- [x] 3.2 For each `posIdx`, compute `semitoneOffset = (NOTES.indexOf(scaleNotes[posIdx]) - NOTES.indexOf(rootNote) + 12) % 12`
- [x] 3.3 Apply the wrap formula: `startFret = rootFret + semitoneOffset; if (startFret > rootFret + 10) startFret -= 12; if (startFret < 0) startFret += 12`
- [x] 3.4 Replace the fret-0-to-14 scan with this computed `startFret` (still validate that the note at that fret matches the expected scale note; assert/throw if not for debugging)
- [x] 3.5 Verify G major produces starting frets [2, 3, 5, 7, 8, 10, 12] for degrees [VII, I, II, III, IV, V, VI]

## 4. Implement 3NPS Roman numeral labels and sorting

- [x] 4.1 Define a `ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']` constant in `positions.ts`
- [x] 4.2 After computing highlights for each position, set `name = ROMAN[posIdx]` (not "Position N")
- [x] 4.3 In `calculatePositions`, remove the block that relabels 3NPS positions to "Position 1–N" after sorting (keep only the CAGED name preservation)
- [x] 4.4 Confirm that for G major sorted by startFret the names read VII, I, II, III, IV, V, VI in order

## 5. Restrict 3NPS to diatonic scale types

- [x] 5.1 Add a `DIATONIC_3NPS_TYPES` whitelist set: `new Set(['ionian', 'major', 'aeolian', 'natural-minor'])`
- [x] 5.2 In `calculate3NPS` (or at the `calculatePositions` dispatch), return `[]` immediately if `chordScale.type` is not in the whitelist
- [x] 5.3 In `PositionControls.tsx`, update the filter condition for the `'3nps'` button to also check that the selected scale type is diatonic (or rely on empty positions array to hide the navigator)

## 6. Natural minor label offset

- [x] 6.1 When `chordScale.type` is `'aeolian'` or `'natural-minor'`, set the label offset so that the tonic (posIdx=0) receives the label "VI" rather than "I"
- [x] 6.2 Implement: `const labelOffset = isNaturalMinor ? 5 : 0; name = ROMAN[(posIdx + labelOffset) % 7]`
- [x] 6.3 Verify A natural minor tonic position is labeled "VI" and the sequence reads VI, VII, I, II, III, IV, V

## 7. Update tests

- [x] 7.1 Update 3NPS tests: verify G major position names are ["VII","I","II","III","IV","V","VI"] in sorted order
- [x] 7.2 Update 3NPS tests: verify G major Position VI (E) starts at fret 12, not fret 0
- [x] 7.3 Add 3NPS test: natural minor tonic labeled "VI"
- [x] 7.4 Add 3NPS test: Dorian scale returns empty (falls back to none)
- [x] 7.5 Add CAGED test: A major G Shape is the first shape encountered when navigating ascending by startFret (GEDAC ascending order)
- [x] 7.6 Run full test suite and confirm all pass

## 8. Manual verification

- [ ] 8.1 Start dev server (`npm run dev`), select G Major scale, enable 3NPS — confirm positions read VII, I, II, III, IV, V, VI with correct fret positions
- [ ] 8.2 Select A Natural Minor, enable 3NPS — confirm tonic position is labeled VI
- [ ] 8.3 Select C Major, enable CAGED — confirm E Shape near fret 7 matches verified reference
- [ ] 8.4 Select A Major, enable CAGED — confirm shapes appear in G, E, D, A, C ascending order
- [ ] 8.5 Select A Major Pentatonic, enable CAGED — confirm pentatonic notes only, same shape positions
