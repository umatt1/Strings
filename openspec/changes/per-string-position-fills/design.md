## Context

The current fill implementation renders one `position: absolute` div per position instance inside `.fretboard-grid`, spanning `top: 0; bottom: 0` (full height of the grid) and a width derived from `startFret` to `endFret`. This produces uniform rectangles regardless of the actual per-string note layout of the shape. A CAGED A Shape, for example, has notes starting at fret 2 on the inner strings but fret 3 on the outer strings — a flat rectangle can't express that.

## Goals / Non-Goals

**Goals:**
- Each fill strip follows the actual fret span of that string's notes within the position
- Outer strings with a narrower span get a narrower fill; inner strings with a wider span get a wider fill
- Same color-per-shape and active/inactive opacity logic is preserved

**Non-Goals:**
- Changing how positions are computed
- Changing colors or opacity values
- Supporting fills for systems other than CAGED, 3NPS, and Positions

## Decisions

### D1: Render fills inside `.frets`, not `.fretboard-grid`

The `.frets` div inside each string row has `position: relative` and starts at the same horizontal origin as fret 0 of that string. Placing fills inside `.frets` with `position: absolute; left: minFret * cellWidth` requires no global offset correction — the left edge of `.frets` IS the left edge of fret 0.

**Rejected alternative:** Keep fills in `.fretboard-grid` but compute per-string top/height by measuring each `.string-row`. This requires additional ResizeObserver entries and is fragile across responsive breakpoints.

### D2: Remove `firstCellOffset` state

`firstCellOffset` was needed to correct for grid padding when fills were inside `.fretboard-grid`. With fills inside `.frets`, the offset is inherently zero. `firstCellOffset` state and its measurement in the ResizeObserver are removed.

### D3: Compute per-string min/max fret from `highlights`

For each `(position, stringIndex)` pair, filter `pos.highlights` to that string and take `Math.min` / `Math.max` of `fretNumber`. Strings with no highlights in a position get no fill strip. This is O(positions × strings × highlights) but positions are small (≤14) and highlights are bounded (≤18 per position), so no memoization is needed.

## Risks / Trade-offs

- **Render count increase:** Grid-level approach: N fills total. Per-string approach: up to N × 6 fills. For 12 CAGED instances × 6 strings = 72 divs. Still trivial for the browser.
- **cellWidth still required:** The fill width is `(maxFret - minFret + 1) * cellWidth`. The ResizeObserver for cellWidth must be kept; only `firstCellOffset` is removed.
