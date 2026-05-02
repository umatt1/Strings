## ADDED Requirements

### Requirement: Persistent add-to-queue shortcut
A `[+ Queue]` button SHALL appear in the current selection bar (next to the ✕ clear button) whenever a chord or scale is selected. This button adds the current selection — including position system, position index, and display mode — to the practice queue without requiring the user to enter Practice mode.

The button is visible in both reference mode and practice mode.

#### Scenario: Adding current selection to queue
- **WHEN** G Ionian is selected, positionSystem = '3nps', positionIndex = 2, displayMode = 'scales', and the user clicks [+ Queue]
- **THEN** a QueueItem is appended to `queue` with those exact values, and the queue length increases by 1

#### Scenario: Button is always visible
- **WHEN** any chord or scale is selected
- **THEN** [+ Queue] appears in the selection bar regardless of whether practiceMode is true or false

#### Scenario: Queue persists when entering practice mode
- **WHEN** items were added via [+ Queue] in reference mode and the user then activates Practice mode
- **THEN** the existing queue (including items added via the shortcut) is used; no default preset is loaded
