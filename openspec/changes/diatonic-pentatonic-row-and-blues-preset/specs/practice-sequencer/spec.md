## MODIFIED Requirements

### Requirement: Blues preset — G Blues I–IV–I–V–IV–I

A new practice preset SHALL be available: **"G Blues (I–IV–I–V–IV–I)"**. It contains 6 queue items representing the condensed 12-bar blues pattern in G. Each item uses the major pentatonic scale for the corresponding chord, in CAGED position, `displayMode = 'scales'`:

| Stop | Chord | Scale            | Position |
|------|-------|-----------------|---------|
| 1    | I (G7) | G major pent   | CAGED 0 |
| 2    | IV (C7) | C major pent  | CAGED 0 |
| 3    | I (G7) | G major pent   | CAGED 0 |
| 4    | V (D7) | D major pent   | CAGED 0 |
| 5    | IV (C7) | C major pent  | CAGED 0 |
| 6    | I (G7) | G major pent   | CAGED 0 |

The CAGED system is used because it produces the familiar 2-note-per-string pentatonic box shapes. Starting positionIndex = 0 for all items.

#### Scenario: Loading the G Blues preset
- **WHEN** the user selects "G Blues (I–IV–I–V–IV–I)" from the preset picker in QueueEditor
- **THEN** the queue is populated with 6 items; the first item shows G major pentatonic in a CAGED position
