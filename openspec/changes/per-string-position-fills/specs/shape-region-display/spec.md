## MODIFIED Requirements

### Requirement: Fret-span region fills alongside ghosting

When a position system is active and a position is selected, the fretboard SHALL render colored fill strips per string. Each fill strip spans from the lowest to highest fret of that string's notes within the position. Strings that have no notes in a given position instance SHALL receive no fill. Ghosting of out-of-position notes is preserved.

#### Scenario: Per-string fills follow the shape contour
- **WHEN** positionSystem is `'caged'` and the active position is the A Shape for C major
- **THEN** the Low E and High E strings have fills spanning frets 3–5
- **AND** the A, D, and G strings have fills spanning frets 2–5
- **AND** no fill spans frets 2–5 uniformly across all strings as a single rectangle

#### Scenario: Active position fills are brighter than inactive
- **WHEN** positionSystem is `'caged'` and any position is active
- **THEN** the active position's per-string fills render at higher opacity than inactive fills

#### Scenario: Strings with no position notes get no fill
- **WHEN** a position instance has no highlights on a given string
- **THEN** that string has no fill strip for that position instance

#### Scenario: No fills when position system is none
- **WHEN** positionSystem is `'none'`
- **THEN** no fill strips are rendered on any string
