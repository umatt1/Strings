# Fretboard Rendering

## Overview

The fretboard is the primary visual component. It renders a grid of note cells (strings × frets), computes highlighting based on the active chord/scale and position system, and handles user interaction for note selection.

---

## Requirements

### REQ-FB-01: Infinite scroll rendering

The fretboard starts displaying 24 frets. When the user scrolls past 80% of the rendered area, 12 more frets load automatically. Maximum fret count is 500.

**Scenario:**
- GIVEN the fretboard is at initial state (24 frets)
- WHEN the user scrolls past 80% of the visible area
- THEN 12 additional frets are appended (now 36 total)

### REQ-FB-02: Note cell rendering

Every (string, fret) intersection renders a `FretboardNote` cell showing the note name. Fret 0 is the open string (nut side). Note names are displayed using the active enharmonic preference.

### REQ-FB-03: Note highlighting

When a chord or scale is selected, notes belonging to it are highlighted on every string. Highlighting uses scale-degree colors from the active color theme:
- Degree 1 (root): root color
- Degree 3: third color
- Degree 5: fifth color
- Other degrees: corresponding degree color

Non-highlighted notes appear in the default note style.

**Scenario:**
- GIVEN C Major is selected (notes: C, E, G)
- WHEN the fretboard renders
- THEN every C cell uses root color, every E cell uses third color, every G cell uses fifth color

### REQ-FB-04: Position highlight overlay

When a position system is active (3NPS, CAGED, or Modes) and a position is selected, only the specific (string, fret) cells in that position are highlighted. Other in-scale notes are dimmed or shown in default style.

**Scenario:**
- GIVEN C Major Ionian is selected and position system = 3NPS, position index = 0
- WHEN the fretboard renders
- THEN only the cells in Position 1's highlight set are colored; other in-scale notes appear unhighlighted

### REQ-FB-05: Display mode filter

The display mode filters which notes are highlighted within a chord/scale:
- `scales` → all notes in the chord/scale
- `arpeggios` → only degrees 1, 3, 5, 7
- `chords` → only degrees 1, 3, 5

**Scenario:**
- GIVEN C Ionian (7 notes) is selected and displayMode = `'chords'`
- WHEN the fretboard renders
- THEN only C, E, G positions are highlighted

### REQ-FB-06: Note click / selection

Clicking a note cell plays its audio and toggles it into `selectedNotes`. At most 2 notes can be selected simultaneously; selecting a 3rd replaces the oldest.

**Scenario:**
- GIVEN 2 notes are already selected (A3 and D4)
- WHEN the user clicks E4
- THEN selectedNotes becomes [D4, E4] (A3 is dropped)

### REQ-FB-07: Auto-scroll to position

When the active position changes (position index or system changes), the fretboard scrolls to bring `startFret` of the new position into view.

### REQ-FB-08: Theming via CSS custom properties

The fretboard grid colors (background, string lines, fret lines, nut) are injected as CSS custom properties (`--fretboard-bg`, `--grid-bg`, `--string-border`, `--fret-border`, `--nut-border`) from the active `ColorTheme`. Scale-degree colors are passed as props to `FretboardNote`.
