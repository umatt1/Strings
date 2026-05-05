## 1. Remove grid-level fills infrastructure

- [x] 1.1 Remove `firstCellOffset` state and its `setFirstCellOffset` call from `Fretboard.tsx`
- [x] 1.2 Remove the `firstCellOffset` measurement line from the ResizeObserver effect (keep `cellWidth` measurement)
- [x] 1.3 Remove the `region-fills-layer` div and its `positions.map(...)` render block from `Fretboard.tsx`
- [x] 1.4 Remove `.region-fills-layer` and `.region-fill` CSS rules from `Fretboard.css`

## 2. Add per-string fills inside each `.frets` container

- [x] 2.1 In `renderFretboard`, for each string row, before rendering fret cells, compute per-string fill data: for each position, filter `pos.highlights` to `instrumentStringIndex`, find `minFret` and `maxFret`
- [x] 2.2 Render one `<div className="string-region-fill">` per `(position, string)` pair that has at least one highlight, with `left: minFret * cellWidth` and `width: (maxFret - minFret + 1) * cellWidth`
- [x] 2.3 Apply inline `background` using `positionRgb(pos.name, posIdx)` at active opacity (0.45) or inactive opacity (0.12)
- [x] 2.4 Apply inline `border` on the active position fill (same as before)
- [x] 2.5 Add `.string-region-fill` CSS rule: `position: absolute; top: 0; bottom: 0; pointer-events: none; z-index: 0; border-radius: 3px`

## 3. Verify

- [x] 3.1 Check A Shape for C major: outer strings (High E, B, Low E) fill spans frets 3–5; inner strings (G, D, A) fill spans frets 2–5
- [x] 3.2 Check G Shape: D string extends one fret further than other strings (fret 9 vs 8)
- [x] 3.3 Check that ghosting still works — notes outside the active position remain dimmed
- [x] 3.4 Run `npm run build` to confirm no TypeScript errors
