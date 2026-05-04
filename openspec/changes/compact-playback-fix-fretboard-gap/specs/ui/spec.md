## MODIFIED Requirements

### Requirement: Playback controls render as a compact inline bar

**REQ-UI-06 updated** — PlaybackControls is a slim contextual bar, not a collapsible panel.

- When no chord/scale is selected: renders nothing (no DOM presence)
- When a chord/scale is selected and fewer than 2 notes are tapped: renders a single muted text hint ("Select 2 notes to play")
- When exactly 2 notes are selected: renders a play button (▶) and a clear button (✕) inline

There is no panel header, no collapse/expand toggle, and no "Listen" label.

#### Scenario: No output when nothing is selected
- **WHEN** no chord or scale is selected
- **THEN** PlaybackControls renders nothing (returns null)

#### Scenario: Hint when chord selected, no notes tapped
- **WHEN** a chord or scale is selected and 0 or 1 note is tapped
- **THEN** a compact one-line hint is shown: "Select 2 notes to play [chord name]"

#### Scenario: Play + clear when 2 notes selected
- **WHEN** exactly 2 notes are tapped
- **THEN** a play button and a clear button appear inline; clicking play triggers audio playback

### Requirement: Fretboard panel sizes to content

**REQ-UI-01 addendum** — The fretboard panel does not stretch to fill available column height. It sizes to the natural height of the fretboard rows with a minimum floor of 300px.

#### Scenario: No empty gap below fretboard rows
- **WHEN** the app is viewed at any viewport width
- **THEN** the fretboard panel has no visible empty space below the last string row
