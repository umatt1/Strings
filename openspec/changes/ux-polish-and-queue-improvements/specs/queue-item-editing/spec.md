## New Capability: Queue Item Editing

### Requirement: Each queue item can be edited in-place

Each item in the `QueueEditor` list SHALL have an edit affordance (button or icon). Activating it expands the row into an inline edit form. The user can modify the item's properties and either confirm or cancel.

#### Scenario: Expand edit form
- **WHEN** the user clicks the edit button on a queue item row
- **THEN** the row expands to show editable fields: root note, chord/scale type, position system, position index, display mode
- **AND** the current values are pre-filled into each field

#### Scenario: Confirm edit
- **WHEN** the user changes one or more fields and clicks Confirm (or a checkmark button)
- **THEN** the queue item is updated with the new values
- **AND** the row collapses back to compact view showing the updated label

#### Scenario: Cancel edit
- **WHEN** the user clicks Cancel (or an X button) without confirming
- **THEN** the queue item is unchanged
- **AND** the row collapses back to its original compact view

#### Scenario: Only one row expanded at a time
- **WHEN** an edit form is already open for item N
- **AND** the user clicks edit on item M
- **THEN** item N's form closes (discarding uncommitted changes)
- **AND** item M's form opens with its current values

### Requirement: Edit form fields

The edit form SHALL include all fields that define a QueueItem's playback behavior.

#### Scenario: Root note field
- **WHEN** the edit form is open
- **THEN** a dropdown or picker shows all 12 chromatic note names
- **AND** selecting a note updates the draft root note

#### Scenario: Type field (chord or scale)
- **WHEN** the edit form is open
- **THEN** a grouped dropdown shows all available `ChordType` and `ScaleType` values (same grouping as the QueueEditor's Add Item picker)
- **AND** selecting a type updates the draft type

#### Scenario: Position system field
- **WHEN** the edit form is open
- **THEN** a selector shows the available position systems: `none`, `flat`, `3nps`, `caged`
- **AND** selecting a system updates the draft position system

#### Scenario: Position index field
- **WHEN** the edit form is open
- **THEN** a number input or small selector allows entering the position index (0-based integer)
- **AND** entering a value updates the draft position index

#### Scenario: Display mode field
- **WHEN** the edit form is open
- **THEN** a toggle or selector shows the available display modes: `scales`, `arpeggios`, `chords`
- **AND** selecting a mode updates the draft display mode

### Requirement: Label field is editable

The edit form SHALL include an optional text input for the item's label.

#### Scenario: Edit label
- **WHEN** the edit form is open
- **THEN** a text input shows the current label (or empty if none)
- **AND** the user can type a custom label
- **AND** confirming saves the typed label to `QueueItem.label`

#### Scenario: Clear label to restore fallback
- **WHEN** the user clears the label text input and confirms
- **THEN** `QueueItem.label` is set to `undefined` (or deleted)
- **AND** the fallback computed label is shown in the compact row
