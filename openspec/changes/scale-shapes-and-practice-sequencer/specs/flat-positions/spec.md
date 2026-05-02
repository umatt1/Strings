## ADDED Requirements

### Requirement: Flat 2-octave position system
The system SHALL provide a `'flat'` position system alongside `'3nps'` and `'caged'`. Flat positions produce 7 box patterns for 7-note diatonic scales, each spanning 2 complete octaves within a compact fret window (~4–5 frets). Each pattern is anchored on the fret where that scale degree's root appears on the lowest string — identical anchoring to 3NPS, but with a box (vertical-first) shape instead of a diagonal (horizontal-first) shape.

- Only valid for major (Ionian) and natural minor (Aeolian) scale types, same restriction as 3NPS. Falls back to `'none'` for other types.
- Templates are hard-coded verified interval tables (semitone offsets per string from `baseFret`), derived from reference material. Not algorithmically calculated.
- Positions are labeled I–VII (Roman numerals) by scale degree, with natural minor tonic labeled VI — same convention as 3NPS.
- The `positionIndex` is shared with 3NPS: position I in flat and position I in 3NPS cover the same fret region.
- Flat positions tile the neck the same way as 3NPS: 7 positions ascending from the lowest root occurrence on the low E string.

#### Scenario: G major flat produces 7 positions in VII–VI neck order
- **WHEN** G Ionian is selected and positionSystem = `'flat'`
- **THEN** exactly 7 positions are returned, sorted ascending by startFret, labeled VII, I, II, III, IV, V, VI

#### Scenario: Switching from 3NPS to flat preserves position index
- **WHEN** positionSystem changes from `'3nps'` to `'flat'` while positionIndex = 2
- **THEN** positionIndex remains 2 and the fretboard scrolls to the same fret region

#### Scenario: Each flat position covers all 6 strings with 2–3 notes per string
- **WHEN** any major scale is selected with positionSystem = `'flat'`
- **THEN** each position has highlights on all 6 strings, with 2 or 3 notes per string, and total highlights sufficient to cover 2 full octaves (≥13 notes per position)

#### Scenario: Flat unavailable for non-diatonic scales
- **WHEN** a pentatonic or non-diatonic scale is selected and positionSystem = `'flat'`
- **THEN** positionSystem falls back to `'none'`
