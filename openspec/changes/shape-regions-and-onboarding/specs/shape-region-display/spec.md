## ADDED Requirements

### Requirement: Fret-span region fills alongside ghosting

When a position system is active and a position is selected, the fretboard SHALL render a colored background fill spanning the active position's fret range across all strings. Existing ghosting behavior (dimming out-of-position notes) is preserved — the region fill adds a spatial "you are here" layer on top of it.

#### Scenario: Active position shows a background fill
- **WHEN** positionSystem is `'caged'` and positionIndex points to the G Shape
- **THEN** a colored background band spans from the G Shape's startFret to endFret across the full height of the fretboard

#### Scenario: Ghosting is preserved alongside fills
- **WHEN** positionSystem is `'caged'` and a position is active
- **THEN** note dots outside the active position remain dimmed (ghosted) as before
- **AND** the region fill is rendered behind all note dots

#### Scenario: No fill when position system is none
- **WHEN** positionSystem is `'none'`
- **THEN** no background region fills are rendered on the fretboard

### Requirement: All tiled instances rendered faintly

When a position system is active, ALL position instances (not just the active one) SHALL render as faint background fills simultaneously. The active instance SHALL render at a higher opacity than inactive instances.

#### Scenario: All CAGED shapes visible as faint fills
- **WHEN** positionSystem is `'caged'` and C Ionian is selected
- **THEN** all tiled CAGED shape instances (across frets 0–24) are visible as faint background bands
- **AND** the currently active shape is visually brighter/more opaque than the others

#### Scenario: Active vs inactive opacity contrast
- **WHEN** any position system is active
- **THEN** inactive instance fills render at approximately 15% opacity
- **AND** the active instance fill renders at approximately 40% opacity

### Requirement: Region fill positioning is pixel-accurate

The background fill for a position instance SHALL align precisely with the fret columns it covers, using the same fret cell width as the note grid.

#### Scenario: Fill covers exactly startFret to endFret columns
- **WHEN** a position with startFret=5 and endFret=8 is rendered
- **THEN** the background fill begins at the left edge of fret column 5
- **AND** ends at the right edge of fret column 8
- **AND** spans the full vertical height of the string rows
