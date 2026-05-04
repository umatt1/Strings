## Context

Both `calculate3NPS` and `calculateFlatPositions` share the same anchor-fret formula:

```typescript
let startFret = rootFret + semitoneOffset;
if (startFret > rootFret + 10) startFret -= 12;
if (startFret < 0) startFret += 12;
```

`rootFret` = where the root note falls on the lowest string (frets 0–11).  
`semitoneOffset` = distance in semitones from the root to the degree that starts this position (0–11).

The intent: keep the 7th-degree position (offset=11) just below the root rather than one octave above. But the threshold `rootFret + 10` only wraps position VII. For roots at high frets (C=8, D=10, C#/Db=9), positions III–VI have offsets 4–9, putting them at frets 12–17 — never wrapping. The low-fret versions of those boxes (frets 0–5) are skipped entirely.

## Goals / Non-Goals

**Goals:**
- All 7 positions always cover the lowest available fret range (0–12 approximately)
- Position VII stays just below the root (the `% 12` formula preserves this: `(rootFret + 11) % 12 = rootFret - 1` for all roots except E where it wraps to 11)
- Fix applies identically to 3NPS and flat position calculations
- Existing test suite updated, no behavior regressions for already-correct keys

**Non-Goals:**
- Changing the Roman numeral labeling system
- Changing the sort order of positions
- Changing how positions are displayed on the fretboard

## Decisions

### Decision 1 — `% 12` replaces the threshold condition

```typescript
// Before
let startFret = rootFret + semitoneOffset;
if (startFret > rootFret + 10) startFret -= 12;
if (startFret < 0) startFret += 12;

// After
const startFret = (rootFret + semitoneOffset) % 12;
```

`(rootFret + semitoneOffset) % 12` maps every anchor to its lowest possible fret. For semitoneOffset=0–11, the result is always in 0–11. This is correct because every scale degree appears in the first octave of the fretboard.

Proof that VII stays below root: `(rootFret + 11) % 12`. For any rootFret > 0, this equals `rootFret - 1` (one fret below root). For rootFret=0 (E major), it gives 11 — correctly placing the leading tone (D#) at fret 11, below the next octave of E.

### Decision 2 — Same fix applied to `calculateFlatPositions`

The flat position function uses `modeFret` for the same purpose. The fix is `const modeFret = (rootFret + semitoneOffset) % 12;` replacing the existing three lines.

### Decision 3 — Tests updated, not just passing

The existing tests in `positions.test.ts` test specific fret ranges. After the fix, keys like C major will return positions at different (lower) frets. Tests should be updated to match the corrected expected values rather than forcing the old incorrect behavior.

## Risks / Trade-offs

- **Tests will change**: Any test asserting specific fret numbers for high-root keys (C, D, Db, etc.) will need updating. This is expected — the old values were wrong.
- **Keys already correct are unaffected**: For E, F, G, Ab, A (where rootFret ≤ 4), the `> rootFret + 10` condition fired for more positions, and most positions were already in the low range. The `% 12` formula gives the same result for these keys.
- Verify: for G major (`rootFret=3`), current formula gives VI(E) at fret 12 (since 3+9=12, 12 ≤ 13). Fixed formula gives VI(E) at 12%12=0 (open E). This IS a change for G major too — and it's correct (E is the open string).
