## MODIFIED Requirements

### Requirement: addItem() defaults displayMode correctly by type

When a user adds an item via the QueueEditor "+ Add Item" picker, the `displayMode` SHALL default to `'arpeggios'` when a chord type is selected, and `'scales'` when a scale type is selected.

#### Scenario: Adding a chord type defaults to arpeggios
- **WHEN** the user opens the Add Item picker, selects root C and type `min7`, and clicks Add
- **THEN** the new queue item has `displayMode: 'arpeggios'`

#### Scenario: Adding a scale type defaults to scales
- **WHEN** the user opens the Add Item picker, selects root G and type `ionian`, and clicks Add
- **THEN** the new queue item has `displayMode: 'scales'`

### Requirement: Autumn Leaves preset uses correct enharmonic labels

The Autumn Leaves preset items SHALL display with their conventional flat enharmonic names regardless of how the root is stored internally.

#### Scenario: Bb Ionian shows as Bb not A#
- **WHEN** the Autumn Leaves preset is loaded and the queue is viewed
- **THEN** item 3 shows as `"Bb Ionian"` (not `"A# Ionian"`) in both QueueEditor and PracticeBar

#### Scenario: Eb Ionian shows as Eb not D#
- **WHEN** the Autumn Leaves preset is loaded and the queue is viewed
- **THEN** item 4 shows as `"Eb Ionian"` (not `"D# Ionian"`) in both QueueEditor and PracticeBar

### Requirement: QueueEditor itemLabel uses label field when present

The `itemLabel()` helper SHALL return `item.label` when it is a non-empty string, and fall back to a formatted string `"${rootNote} ${type} · pos ${positionIndex + 1}"` otherwise.

#### Scenario: Label present
- **WHEN** a queue item has `label: "G Shape"`
- **THEN** `itemLabel(item)` returns `"G Shape"`

#### Scenario: Label absent
- **WHEN** a queue item has no `label` field
- **THEN** `itemLabel(item)` returns a string containing the root note, type, and 1-based position index
