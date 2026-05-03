## New Capability: Queue Item Label

### Requirement: QueueItem has an optional label field

`QueueItem` SHALL include an optional `label?: string` field. When present, this label is used as the human-readable display name for the item in the PracticeBar and QueueEditor. When absent, the display falls back to a computed string.

#### Scenario: Label present — displayed verbatim
- **WHEN** a `QueueItem` has `label: "Flat Pos VII"`
- **THEN** the PracticeBar card shows `"Flat Pos VII"` as the primary line
- **AND** the QueueEditor list row shows `"Flat Pos VII"` as the item label

#### Scenario: Label absent — fallback to computed string
- **WHEN** a `QueueItem` has no `label` field
- **THEN** the display label SHALL be computed as `"${rootNote} ${scaleType} · pos ${positionIndex + 1}"`
- **AND** this fallback is used in both PracticeBar and QueueEditor

### Requirement: Presets populate the label field

All built-in `PracticePreset` items SHALL have a `label` field set to a descriptive, human-readable string that identifies the specific position or musical context.

#### Scenario: G Major Scale Workout flat positions
- **WHEN** the G Major Scale Workout preset is loaded
- **THEN** flat position items have labels like `"G Ionian · Flat I"` through `"G Ionian · Flat VII"`
- **AND** 3NPS position items have labels like `"G Ionian · 3NPS I"` through `"G Ionian · 3NPS VII"`

#### Scenario: G Major Arpeggios preset labels
- **WHEN** the G Major Arpeggios preset is loaded
- **THEN** each item has a label identifying the chord and shape, e.g., `"Gmaj7 · CAGED"`, `"Am7 · CAGED"`

#### Scenario: Autumn Leaves preset labels
- **WHEN** the Autumn Leaves preset is loaded
- **THEN** item 3 (Bb Ionian) has `label: "Bb Ionian"` even though `rootNote` is stored as `'A#'`
- **AND** item 4 (Eb Ionian) has `label: "Eb Ionian"` even though `rootNote` is stored as `'D#'`

### Requirement: PracticeBar shows label as primary card text

The PracticeBar scrollable card row SHALL display each item's resolved label (from `label` field or fallback) as the primary line, replacing the raw `getMusicTheoryLabel(type)` call.

#### Scenario: PracticeBar card shows resolved label
- **WHEN** practice mode is active and the queue has labeled items
- **THEN** each visible card in the PracticeBar scrollable row shows the resolved label text
- **AND** the secondary line continues to show the display mode (e.g., `SCALES`)

#### Scenario: PracticeBar active card is visually distinct
- **WHEN** practice mode is active
- **THEN** the current queue item's card is highlighted (existing behavior preserved)
- **AND** its label text is readable at the highlighted state
