## Why

When practicing in a key, the diatonic pentatonic scales are the most practical everyday tool — especially in blues and jazz. Each diatonic chord has a matching pentatonic (major pent for major/dominant chords, minor pent for minor/diminished chords) that a musician reaches for constantly. Currently there is no way to see or select these from the theory panel without knowing the root and manually picking "pent-M" or "pent-m" from the Other section. There is also no blues practice preset — the most universal practice context.

## What Changes

- **Diatonic pentatonic row**: In the Scales section of `MusicTheoryControls`, add a second row of 7 small buttons aligned one-to-one directly below the existing 7 diatonic mode scale buttons. Each button shows the pentatonic scale for that degree:
  - I, IV, V (major/dominant quality) → major pentatonic on that root
  - ii, iii, vi, vii° (minor/dim quality) → minor pentatonic on that root
  - Clicking selects that pentatonic scale (same behavior as clicking any scale button — sets `selectedChordScale`, `displayMode = 'scales'`, clears `activeDegree`)

- **Blues preset**: Add a `G Blues (I–IV–I–V–IV–I)` preset to `src/data/presets.ts`. Six queue items representing the condensed 12-bar blues pattern in G: G7 · C7 · G7 · D7 · C7 · G7. Each item uses the corresponding **major pentatonic** as the displayed scale (since blues dominant chords pair with major pentatonic), in a 3NPS position, `displayMode = 'scales'`. The key is G but the pattern works for any key by following the same interval logic.

## Capabilities

### New Capabilities
- `diatonic-pentatonics`: per-degree pentatonic buttons derived from the active key

### Modified Capabilities
- `practice-sequencer`: new blues preset added to PRESETS

## Impact

- `src/components/MusicTheoryControls.tsx` — add pentatonic row below scale-grid in Scales section
- `src/utils/musicTheory.ts` — add `getDiatonicPentatonics(keyRoot, keyType)` helper returning pentatonic type + root per degree
- `src/data/presets.ts` — add G blues preset
