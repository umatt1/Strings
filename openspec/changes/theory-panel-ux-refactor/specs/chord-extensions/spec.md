## ADDED Requirements

### Requirement: Chord extension selector
When a diatonic degree is selected in arpeggio mode, a row of extension buttons SHALL appear below the chord/mode grids. The extension selector modifies the selected chord's type without changing its root or degree context.

Extensions available:
- **Triad** — selects the 3-note triad (major, minor, or diminished depending on degree)
- **6** — adds major 6th (add6 type)
- **7** — adds 7th (default; the diatonic 7th type for that degree: maj7, min7, dom7, half-dim7)
- **9** — adds 9th (add9 type)
- **11** — adds 11th (add11 type)

New chord types to add to `CHORD_INTERVALS` in `musicTheory.ts`:
- `'add6'`: `[0, 4, 7, 9]` — major triad + major 6th
- `'add11'`: `[0, 4, 5, 7, 10]` — dominant 11th voicing (simplified)

The **7** button is selected by default whenever a degree is clicked. Selecting a new degree resets the extension to **7**.

The extension selector is only visible when a diatonic degree is active (not when an "Other" chord or scale is selected).

#### Scenario: Extension defaults to 7th on degree click
- **WHEN** the user clicks degree `ii` (A in G major)
- **THEN** Am7 is shown on the fretboard (displayMode = arpeggios), and the [7] button is highlighted in the extension row

#### Scenario: Switching to triad
- **WHEN** the user clicks [triad] in the extension row while Am7 is selected
- **THEN** Am is selected (type = 'minor'), displayMode = arpeggios

#### Scenario: Switching to add9
- **WHEN** the user clicks [9] while Am7 is active
- **THEN** type becomes 'add9', rootNote = A, displayMode = arpeggios

#### Scenario: Extension resets on degree change
- **WHEN** the user selects [9] and then clicks a different degree button
- **THEN** the extension resets to [7] for the new degree
