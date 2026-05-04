## Why

Comparing our position system against freta.app revealed a concrete algorithmic bug: for keys like C, D, and C# where the root sits high on the low E string (frets 8–10), our 3NPS and flat position calculations anchor positions III–VI an octave too high (frets 12–17) while leaving frets 0–6 completely uncovered. A student practicing C major 3NPS with our app can never reach the open-string box (where E, the 3rd degree, is at fret 0) — they only see it at fret 12. Meanwhile positions I and II are shown correctly at frets 8 and 10. The result is that 4 of the 7 positions are shown in the wrong octave.

The Roman numeral naming (I = root-start position, III = E-start position, etc.) is correct and meaningful — it tells the player which scale degree anchors the box. The ordering is also correct (VII, I, II, III, IV, V, VI for C major reads as: B-box, C-box, D-box, E-box, F-box, G-box, A-box). The only thing wrong is **where on the neck** those boxes are shown.

## What Changes

- Fix `calculate3NPS` in `positions.ts`: change `startFret = rootFret + semitoneOffset` with the `> rootFret + 10` wraparound to `startFret = (rootFret + semitoneOffset) % 12`. This always anchors each position at its lowest occurrence on the neck (frets 0–11).
- Apply the identical fix to `calculateFlatPositions` (`modeFret` variable, same formula).
- Update the positions test suite (`positions.test.ts`) to reflect the corrected fret ranges for C major and any other affected keys.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `positions`: 3NPS and flat position anchor frets corrected — positions now cover the lowest available range on the neck rather than anchoring relative to the root fret.

## Impact

- `src/utils/positions.ts` — two one-line fixes (lines 131–132 for 3NPS, lines 555–556 for flat)
- `src/utils/positions.test.ts` — expected fret values updated for affected keys
