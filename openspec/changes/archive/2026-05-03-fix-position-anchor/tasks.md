# Tasks

---

## 1. Fix `calculate3NPS` anchor fret formula

- [x] 1.1 In `src/utils/positions.ts`, in `calculate3NPS` (around line 131), replace:
  ```typescript
  let startFret = rootFret + semitoneOffset;
  if (startFret > rootFret + 10) startFret -= 12;
  if (startFret < 0) startFret += 12;
  ```
  with:
  ```typescript
  const startFret = (rootFret + semitoneOffset) % 12;
  ```
- [x] 1.2 Remove the now-stale comment on the lines above: `// Compute canonical starting fret: keep the leading tone (offset=11) just below the root rather than an octave above it.`

---

## 2. Fix `calculateFlatPositions` anchor fret formula

- [x] 2.1 In `src/utils/positions.ts`, in `calculateFlatPositions` (around line 555), replace:
  ```typescript
  let modeFret = rootFret + semitoneOffset;
  if (modeFret > rootFret + 10) modeFret -= 12;
  if (modeFret < 0) modeFret += 12;
  ```
  with:
  ```typescript
  const modeFret = (rootFret + semitoneOffset) % 12;
  ```
- [x] 2.2 Remove or update the adjacent comment `// Same starting fret formula as 3NPS — keeps positions in sync`.

---

## 3. Update test suite

- [x] 3.1 In `src/utils/positions.test.ts`, line ~345: invert the test that asserts `posVI!.startFret` is `12` for G major. Change expected value to `0` and update the test description to `'G major Position VI (E) starts at fret 0 (open string)'`.
- [x] 3.2 Add a new test for C major 3NPS asserting the correct anchor frets: `III=0, IV=1, V=3, VI=5, VII=7, I=8, II=10`.
- [x] 3.3 Add a new test for C major flat positions asserting the same anchor frets.
- [x] 3.4 Add a test asserting that for any major key, Position VII's `startFret` equals `(rootFret - 1 + 12) % 12` (always one fret below Position I).
- [x] 3.5 Run `npm test` and fix any additional test failures caused by the anchor change (update expected fret values in those tests to match the corrected behavior).

---

## 4. Manual verification

- [x] 4.1 Select C major, activate 3NPS: the first position (1/7) should be labeled "III" at fret 0, not "VII" at fret 7. The fretboard should scroll to the open-string area.
- [x] 4.2 Navigate through all 7 positions for C major 3NPS: they should land at frets 0, 1, 3, 5, 7, 8, 10 (III, IV, V, VI, VII, I, II in neck order). No position should jump to fret 12+.
- [x] 4.3 Select G major, activate 3NPS: position VI (E) should appear at fret 0, not fret 12.
- [x] 4.4 Select E major, activate 3NPS: position I (E/root) should appear at fret 0 (open string box).
- [x] 4.5 Select C major, activate Flat: same fret distribution as 3NPS (III=0 through II=10).
- [x] 4.6 Confirm G major Flat position VI also lands at fret 0.
- [x] 4.7 `npm run build` and `npm test` both pass with no errors.
