## MODIFIED Requirements

### Requirement: Responsive layout

**REQ-UI-01 updated** — Layout order changes on all breakpoints:

The layout renders in this vertical order within the right column:
1. **Queue bar** (PracticeBar or queue-empty-bar) — always at the top of the right column
2. **Fretboard area** — position controls + fretboard
3. **Playback controls** (`PlaybackControls`)
4. **Settings** (`Controls`) — instrument, tuning, accidentals, color theme

The `Controls` component is rendered **once** in `.settings-panel` (always visible). The previous pattern of two duplicate instances (`.top-settings` for mobile, `.desktop-settings` for desktop) toggled by CSS is removed.

#### Scenario: Queue bar appears at top on desktop
- **WHEN** the app loads on a desktop viewport (≥768px)
- **THEN** the queue bar (PracticeBar or queue-empty-bar) appears above the fretboard
- **AND** the Settings panel (Controls) appears below PlaybackControls

#### Scenario: Settings appear below fretboard on mobile
- **WHEN** the app loads on a mobile viewport (<768px)
- **THEN** the Settings panel appears below the fretboard and PlaybackControls
- **AND** only one instance of Controls is rendered in the DOM
