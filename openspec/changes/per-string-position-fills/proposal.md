## Why

Position fills (CAGED, 3NPS, Positions) render as uniform rectangles spanning the full fretboard height. A real CAGED shape is not a rectangle — each string has notes at different fret offsets, so the shape should step and stagger across strings. A flat rectangle communicates nothing about the shape's actual contour.

## What Changes

- **Replace** the single grid-level rectangle fill with per-string fill strips — one fill per (position, string) pair, spanning only the fret range that string actually uses in that position
- Each string's fill strip is anchored inside that string's `.frets` container, so no global coordinate math is needed
- Colors per shape name remain (green/orange/purple/blue/red for CAGED; degree-index colors for 3NPS and Positions)
- Active vs inactive opacity contrast is preserved

## Capabilities

### Modified Capabilities

- `shape-region-display`: Replace single-rectangle fills with per-string fills that follow the actual shape contour of each position

## Impact

- `src/components/Fretboard.tsx` — move fill rendering from grid-level to per-string inside each `.frets` div; remove `firstCellOffset` state (no longer needed)
- `src/components/Fretboard.css` — replace `.region-fills-layer` / `.region-fill` with `.string-region-fill`
