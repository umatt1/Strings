## MODIFIED Requirements

### Requirement: Practice Mode toggle is removed

There is no "Practice" / "Exit Practice" button. The queue-based navigation IS the app's primary interaction model and requires no mode activation.

#### Scenario: No practice toggle button visible
- **WHEN** the app loads
- **THEN** there is no "Practice" button in the UI
- **AND** there is no "Exit Practice" button in the UI

#### Scenario: Queue bar always visible below fretboard
- **WHEN** the fretboard area is visible
- **THEN** a queue bar is always present below the fretboard
- **AND** it shows either the item strip (when queue is non-empty) or an empty-state prompt

### Requirement: Display mode selector is removed from PositionControls

The "Chord Tones" (`arpeggios`) and "Triad" (`chords`) tabs are removed from the `PositionControls` display mode selector. The fretboard always shows all highlighted notes ("All Notes" / `scales` mode). The display mode tab row SHALL be removed entirely.

#### Scenario: No Chord Tones or Triad tabs visible
- **WHEN** a chord or scale is selected
- **THEN** the PositionControls bar does NOT show "Chord Tones" or "Triad" tabs
- **AND** the fretboard shows all notes belonging to the selected chord/scale

#### Scenario: Fretboard defaults to All Notes display
- **WHEN** any chord or scale is selected from the theory panel
- **THEN** all notes of that chord or scale are highlighted on the fretboard
- **AND** no filtering to only chord tones or only triad tones occurs automatically
