## MODIFIED Requirements

### Requirement: Queue is always active; no practice mode toggle

The queue SHALL be always-on. There is no "Practice Mode" toggle button. The queue bar SHALL be visible at all times below the fretboard: showing the item strip when items are present, and an empty-state prompt when the queue is empty.

#### Scenario: Queue bar visible on load with empty queue
- **WHEN** the app loads for the first time
- **THEN** a slim queue bar is shown below the fretboard
- **AND** it displays a prompt such as "Queue is empty — add chords or scales from the panel"
- **AND** there is no "Practice" button anywhere in the UI

#### Scenario: Queue bar shows items when queue is non-empty
- **WHEN** the user adds one or more items to the queue
- **THEN** the queue bar displays the item strip with labeled cards
- **AND** the current item is highlighted
- **AND** spacebar advances to the next item

#### Scenario: Spacebar active when queue has items
- **WHEN** the queue contains at least one item
- **AND** no interactive element (input, button, select) has focus
- **THEN** pressing spacebar advances to the next queue item

#### Scenario: Spacebar inactive when queue is empty
- **WHEN** the queue is empty
- **THEN** pressing spacebar has no effect

### Requirement: Adding items to the queue defaults positionSystem to none

When any item is added to the queue — via "+ Queue", "+ All 7ths", "+ All modes", or the QueueEditor "+ Add Item" picker — the item's `positionSystem` SHALL be `'none'` and `positionIndex` SHALL be `0` by default.

#### Scenario: Add current to queue — position not inherited
- **WHEN** the user has CAGED position 3 active
- **AND** clicks "+ Queue" next to a chord
- **THEN** the new queue item has `positionSystem: 'none'`
- **AND** the fretboard shows all notes (no position box) when that item is active

#### Scenario: Add all chords to queue — no positions
- **WHEN** the user clicks "+ All 7ths to queue"
- **THEN** all 7 created queue items have `positionSystem: 'none'`

#### Scenario: Add all modes to queue — no positions
- **WHEN** the user clicks "+ All modes to queue"
- **THEN** all 7 created queue items have `positionSystem: 'none'`

#### Scenario: QueueEditor add item — defaults to no position
- **WHEN** the user adds an item via the QueueEditor "+ Add Item" picker
- **THEN** the new item has `positionSystem: 'none'`

### Requirement: All built-in presets use positionSystem none

All items in the four built-in presets (G Major Scale Workout, G Major Arpeggios, Autumn Leaves, G Blues) SHALL have `positionSystem: 'none'`.

#### Scenario: Load G Major Scale Workout — no position highlights
- **WHEN** the user loads the G Major Scale Workout preset
- **THEN** cycling through items shows G Ionian notes across the full fretboard with no position box highlighted
- **AND** item labels (e.g., "G Ionian · Flat I") still describe the intended position for reference
