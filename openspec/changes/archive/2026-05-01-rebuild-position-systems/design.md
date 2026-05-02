## Context

Both `calculate3NPS` and `calculateCAGED` in `src/utils/positions.ts` were written with structural bugs that produce wrong results for many keys.

**3NPS root cause**: Starting frets are found by scanning from fret 0 and taking the first match. For any key where a scale note equals an open string (E, A, D, G, B), that position snaps to the open position instead of the correct octave. For G major, Position VI (E) lands at fret 0 using open strings; it should land at fret 12. The positions are also re-labeled "Position 1–7" after sort, discarding the musically meaningful scale-degree information.

**CAGED root cause**: The shape templates use per-string fret *windows* (`[startOffset, endOffset]`) relative to a `baseOff` that is calibrated for C major. For other root notes the windows produce wrong note sets. The `baseOff` for G shape is 9, which for A major (rootFret=5) places the shape at baseFret=14 — the correct position is near the nut.

## Goals / Non-Goals

**Goals:**
- 3NPS produces correct 7 positions for major (Ionian) and natural minor (Aeolian) scales
- 3NPS positions are labeled I–VII (Roman numerals) by scale degree, sorted in ascending neck order
- Natural minor tonic is labeled VI (Aeolian position of its relative major)
- 3NPS unavailable for all other scale types (no silent wrong output)
- CAGED templates produce verified-correct note sets for any root note on 6-string standard guitar
- CAGED shape navigation works for major and pentatonic scales (pentatonic filters naturally via scale note inclusion)

**Non-Goals:**
- 3NPS for non-diatonic 7-note scales (harmonic minor, melodic minor, etc.)
- 3NPS for bass or non-6-string instruments
- CAGED for non-6-string instruments (existing rectangular fallback is acceptable)
- Mode positions (unchanged)

## Decisions

### Decision 1: 3NPS starting frets via math, not string search

**Chosen**: Compute each position's starting fret as `rootFret + semitoneOffset`, where `semitoneOffset` is the chromatic distance from the root to the scale degree. Subtract 12 when the result exceeds `rootFret + 10` (pulls the leading tone below the root rather than an octave above it). If the result is negative, add 12 (handles open-root keys like E major).

```
rootFret = lowest occurrence of rootNote on low E string in frets [0, 11]

For each degree i with offset off[i]:
  startFret = rootFret + off[i]
  if startFret > rootFret + 10: startFret -= 12
  if startFret < 0: startFret += 12
```

**Why not continue searching from 0**: The open-string anchoring is unfixable with the search approach — any time a scale note matches an open string the result is wrong. The math approach produces the correct monotone sequence of starting frets for all keys.

**Result for G major (rootFret=3)**: VII=2, I=3, II=5, III=7, IV=8, V=10, VI=12. Matches reference chart.
**Result for E major (rootFret=0)**: I=0, II=2, III=4, IV=5, V=7, VI=9, VII=11 (VII comes last — correct for E as open string).

### Decision 2: Roman numeral labels tied to scale degree, not sorted index

After sorting by startFret, position names are set from the scale degree they start on (I–VII), not from their sorted rank. The UI already consumes `position.name` directly — the `(1/7)` counter is still shown separately by the navigator.

For natural minor: the tonic gets label VI (it is the Aeolian mode). The sequence reads VI, VII, I, II, III, IV, V from low to high fret. This is musically accurate — minor tonic = degree VI of the relative major.

**Alternative considered**: Label natural minor positions "I–VII" relative to the minor root. Rejected: it would require a separate labeling convention that obscures the relationship to the parallel major and breaks the "position VI = Aeolian" intuition.

### Decision 3: 3NPS restricted to major and natural minor by scale type string

Check `chordScale.type` against a whitelist: `['ionian', 'major', 'aeolian', 'natural-minor']`. All other types return `[]` and the system falls back to `'none'` (existing behavior for empty position array). The 3NPS button in `SYSTEM_OPTIONS` is already filtered by `scaleNoteCount >= 7`; add a type check in `PositionControls` or move filtering entirely into `calculatePositions`.

**Why not allow all 7-note scales**: 3NPS Roman numeral labeling is only meaningful for diatonic modes. Applying it to harmonic minor or other scales produces confusing labels and non-standard patterns that don't match any reference material.

### Decision 4: CAGED shapes defined by per-string semitone intervals from baseFret

Replace the window-based `[startOffset, endOffset]` approach with an explicit list of semitone intervals per string. Each shape template becomes:

```typescript
interface CAGEDShapeTemplate {
  name: string;
  /** rootFret + baseOff = baseFret for this shape */
  baseOff: number;
  /** Per-string arrays of semitone offsets from baseFret.
   *  Index 0 = high E (string index 0), 5 = low E (string index 5). */
  stringIntervals: number[][];
}
```

For each string, the notes to highlight are those at frets `baseFret + interval[i]` that are in the scale. This eliminates the window approximation entirely — each shape has exactly the right notes.

**baseFret derivation**: `baseFret = rootFret + baseOff`, but no octave tiling loop is needed for the primary set of 5 shapes. A single `octave * 12` offset loop can still be used to extend shapes across the neck for the navigator (all 5 shapes × multiple octaves), but the primary display window for a given key is the octave where `baseFret` is in a playable range.

**Why not keep the window approach**: The existing `stringRanges` are calibrated for C major only. The windows are too wide (include off-pattern notes) or too narrow (miss notes) for other roots.

### Decision 5: CAGED shape interval tables derived from verified reference data

The exact `baseOff` and `stringIntervals` for each of the 5 shapes are derived by:
1. Taking the verified test data already in `positions.test.ts` for C major (rootFret=8)
2. Computing `baseFret = lowest fret across all strings in that shape`
3. Computing `baseOff = baseFret - rootFret`
4. Computing `stringIntervals[stringIndex][i] = noteFret - baseFret` for each highlighted fret

Then spot-checking against G major (rootFret=3) and A major (rootFret=5) test data.

This avoids introducing new unverified reference data and grounds the templates in data already passing tests.

## Risks / Trade-offs

- **3NPS Position VI at high frets** → For many keys, Position VI lands at fret 12+. The fretboard auto-scroll handles this, but the position may seem visually distant from the rest. Acceptable per user decision.
- **Natural minor label convention (VI, VII, I, II, III, IV, V)** → Unfamiliar to users expecting "Position 1–7" or "I–VII starting from tonic." Documentation or tooltip may help. Risk is low for now.
- **CAGED interval table accuracy** → If the test data for C major has any errors, those errors propagate to all keys. The existing tests provide some coverage; adding G major and A major verification tests is a mitigation.
- **Breaking change: 3NPS type restriction** → Scales like Mixolydian (7-note, non-diatonic in strict sense) currently show 3NPS. After this change they won't. The user confirmed this is intentional.

## Open Questions

- Should the 3NPS button label change (e.g., show a tooltip explaining which scales support it)?
- Should CAGED shapes be verified and extended for non-standard tunings, or remain 6-string standard only?
