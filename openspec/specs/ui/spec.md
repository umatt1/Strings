# UI, Controls & Theming

## Overview

The UI consists of a left theory panel, a right fretboard area, and settings controls. Controls are rendered twice in the DOM (mobile-first and desktop) with CSS media queries toggling visibility. All app state lives in `App.tsx`.

---

## Requirements

### REQ-UI-01: Responsive layout

The layout has two breakpoints:
- **Mobile**: Settings appear above the fretboard; the theory panel stacks vertically.
- **Desktop**: Settings appear in a sidebar to the right of the theory panel.

The `Controls` component is rendered in both `.top-settings` (mobile) and `.desktop-settings` (desktop). CSS `display: none` / `display: block` controls which is visible at each breakpoint.

### REQ-UI-02: Music theory selection panel (`MusicTheoryControls`)

Provides chord/scale selection UI:
- Root note dropdown (all 12 chromatic notes).
- Chord buttons grouped by category (Triads, Seventh Chords, Extended/Sus).
- Scale buttons grouped by category (Pentatonic, Major Modes, Minor Scales, Blues).
- Selecting a chord/scale sets `selectedChordScale` in App state.
- Selecting the same item a second time deselects it (toggles off).

### REQ-UI-03: Instrument controls (`Controls`)

- Tuning preset selector grouped by category (Guitar, Bass).
- Mirror strings toggle.
- Color theme selector (indigo, warm, cool, forest, sunset, classic).
- Enharmonic preference selector (Auto, Sharps, Flats).

### REQ-UI-04: Color themes

Six themes are available. Each theme defines a `ColorTheme` object with fretboard background/grid colors and a `scaleColors` map for degrees root, third, fifth, second, fourth, sixth, seventh, otherImportant, others.

| Theme ID | Display Name |
|---|---|
| indigo | Indigo (Default) |
| warm | Warm (Red/Orange) |
| cool | Cool (Teal/Cyan) |
| forest | Forest (Green) |
| sunset | Sunset (Purple/Pink) |
| classic | Classic (Wood) |

The default theme on load is `indigo`. The `indigo` theme uses blue/orange/purple designed for colorblind accessibility.

### REQ-UI-05: Position controls (`PositionControls`)

- Position system selector: None, 3NPS, CAGED, Modes.
- Display mode selector: Scales, Arpeggios, Chords.
- Previous/Next position navigation buttons (only shown when a system is active).
- Current position label (e.g., "Position 3 / 7" or "E Shape").
- 3NPS option is disabled (or auto-hidden) when fewer than 7 scale notes are active.

### REQ-UI-06: Playback controls (`PlaybackControls`)

- "Play All" button: plays all highlighted notes.
- "Play Ascending" button: plays highlighted notes in ascending pitch order.
- Selected notes display: shows up to 2 selected note names and the interval between them.
- "Clear" button: clears selected notes.

### REQ-UI-07: App state ownership

All state lives in `App.tsx`. No external state library is used. State variables:
- `instrument: InstrumentConfig`
- `mirrorStrings: boolean`
- `selectedChordScale: ChordScale | undefined`
- `selectedNotes: Note[]` (max 2)
- `colorTheme: ColorTheme`
- `enharmonicPreference: EnharmonicPreference`
- `positionSystem: PositionSystem`
- `positionIndex: number`
- `displayMode: DisplayMode`
