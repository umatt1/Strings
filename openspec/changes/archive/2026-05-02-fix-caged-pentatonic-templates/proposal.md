## Why

The CAGED position system uses full-scale (7-note) shape templates and simply filters out non-scale notes when a pentatonic scale is selected. This produces incorrect patterns: some pentatonic notes that should appear fall just outside the full-scale template boundaries (e.g., A-shape high E shows only G instead of G+A; E-shape high E shows only C instead of C+D; D-shape G string shows F instead of E). The standard 2-notes-per-string pentatonic CAGED patterns require slightly different fret boundaries than the filtered 7-note templates.

## What Changes

- **Add pentatonic CAGED templates**: Define a separate set of 5 shape templates specifically for 5-note scales. Each template uses exactly 2 interval offsets per string, derived and verified against reference pentatonic CAGED materials for C, G, and A major.
- **Route pentatonic scales to pentatonic templates**: In `calculateCAGED`, detect when `scaleNotes.length === 5` and switch to the pentatonic template set instead of the full-scale set.
- **All 5 shapes corrected**: E Shape, D Shape, C Shape, A Shape, G Shape all receive new interval tables. Several shapes also use a different `baseOff` for the pentatonic set (A Shape: 6 instead of 5; D Shape: 1 instead of 2).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `positions`: REQ-POS-03 (CAGED) gains a scenario specifying that pentatonic scales produce 2-notes-per-string patterns matching reference CAGED pentatonic materials.

## Impact

- `src/utils/positions.ts` — add `CAGED_PENTATONIC_TEMPLATES`, update `calculateCAGED` routing logic
- `src/utils/positions.test.ts` — add verified pentatonic CAGED test cases for C major (and G major spot-check)
- No UI or CSS changes required
