## Why

The 3NPS and CAGED position systems have fundamental algorithmic bugs that produce incorrect note patterns for most keys. 3NPS positions anchor on open-string occurrences when the musically correct fret is an octave higher (e.g., for G major, Position VI lands on fret 0 using all open strings instead of fret 12), and labels are stripped of meaning ("Position 1–7" instead of scale-degree Roman numerals). CAGED shape templates produce wrong patterns across a range of root notes. Both systems are currently unreliable for practical guitar education use.

## What Changes

- **3NPS — fix starting fret algorithm**: Replace the open-string search (fret 0 to 14) with a mathematical calculation anchored to the root note's position on the lowest string. Each scale degree's starting fret is computed as `rootFret + semitoneOffset`, wrapping so the leading tone (VII) appears just below the root rather than an octave above it.
- **3NPS — Roman numeral labels**: Positions are labeled I through VII based on the scale degree they start on, not sequential fret order. Navigation shows "VII", "I", "II", etc. For G major this produces the neck order VII → I → II → III → IV → V → VI.
- **3NPS — restrict to diatonic scales**: 3NPS is only valid for major (Ionian) and natural minor (Aeolian) scales. All other scale types (harmonic minor, pentatonic, blues, etc.) fall back to `'none'`. This is a **BREAKING** scope reduction.
- **3NPS — natural minor starts at VI**: A natural minor scale's positions are labeled relative to its parallel major, so the position starting on the tonic of a minor key is labeled "VI" (the Aeolian position). Position labels follow the same I–VII scheme.
- **CAGED — rebuild shape templates**: Replace all existing per-string fret range templates with verified patterns. Shapes produce correct note sets for any root note on standard 6-string guitar. The GEDAC neck order (G, E, D, A, C shapes ascending from the nut) for any given root is preserved.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `positions`: REQ-POS-02 changes significantly (3NPS starting fret logic, labeling, scale type restriction). REQ-POS-03 changes (CAGED template correctness). Existing spec must be updated to reflect new algorithm contracts and the minor-scale treatment of 3NPS.

## Impact

- `src/utils/positions.ts` — core rewrite of `calculate3NPS` and `calculateCAGED`
- `src/utils/positions.test.ts` — all 3NPS tests need updating (new fret positions, new labels); CAGED tests may need shape data verification
- `src/components/PositionControls.tsx` — minimal: label display already uses `position.name`, which will now contain Roman numerals
- `src/components/Fretboard.tsx` — no changes needed
- The `'3nps'` option in `SYSTEM_OPTIONS` will need its visibility condition updated (currently shown for any 7-note scale; must be restricted to major/natural minor only)
