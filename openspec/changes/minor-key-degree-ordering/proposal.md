## Why

When [Minor] is selected in the theory panel, the 7 degree buttons currently show the relative major key in order (I·Bb, II·C, III·D…). A musician thinking in G minor expects to see G as degree i, not buried at position VI. The panel should start from the minor tonic and order all 7 degrees from that root.

## What Changes

- `getModesForKey(keyRoot, 'minor')` — rotate the 7-mode array so Aeolian (degree VI of the relative major) becomes degree i. For G minor the result is: `[i·G Aeolian, ii°·A Locrian, III·Bb Ionian, iv·C Dorian, v·D Phrygian, VI·Eb Lydian, VII·F Mixolydian]`
- `getDiatonicChords(keyRoot, 'minor')` — same rotation so the 7th chords start from the minor tonic: `[Gm7, Am7b5, Bbmaj7, Cm7, Dm7, Ebmaj7, F7]`
- `getDiatonicPentatonics` — no change needed; it delegates to the above two functions and will automatically correct
- Remove the `(from Bb Major)` subheader text from the UI — it was a workaround for the confusing relative-major ordering and is no longer needed
- Roman numeral casing already works correctly via `degreeLabel()`: min7→lowercase, half-dim7→lowercase+°, maj7/dom7→uppercase

## Capabilities

### Modified Capabilities
- `ui`: minor key panel now shows degrees i–VII starting from the minor tonic; subheader removed

## Impact

- `src/utils/musicTheory.ts` — `getModesForKey` and `getDiatonicChords` rotate output for `keyType === 'minor'`
- `src/components/MusicTheoryControls.tsx` — remove `popout-subheader` span (the "from Bb Major" line)
