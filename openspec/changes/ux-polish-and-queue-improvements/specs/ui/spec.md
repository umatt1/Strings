## MODIFIED Requirements

### Requirement: Chord-name buttons do not truncate

Chord-name buttons in the CHORDS section SHALL display their full label without truncation. Currently `Cmaj7` renders as `Cm...` and `Ebmaj7` renders as `Eb...`.

#### Scenario: Long chord name rendered fully
- **WHEN** the user selects C Major key
- **THEN** the chord-name row shows `Cmaj7` (not `Cm...`) in the first button
- **AND** all seven chord buttons show their full label

#### Scenario: Flat-key chord names rendered fully
- **WHEN** the user selects C Minor key
- **THEN** buttons for `Ebmaj7` and `Abmaj7` show their full labels without truncation

### Requirement: CHORDS and SCALES degree rows are visually distinct

The degree-button row in the CHORDS section and the degree-button row in the SCALES section SHALL be visually distinguishable at a glance. Both rows use identical button text (Roman numeral + root note), so visual differentiation is required to prevent accidental mis-clicks.

#### Scenario: Scale degree row has distinct styling
- **WHEN** the theory panel is expanded and C Major is selected
- **THEN** the degree buttons in the SCALES section have a visually distinct appearance from those in the CHORDS section (different background tint, border, or opacity)
- **AND** the CHORDS degree buttons retain their existing appearance

#### Scenario: Clicking the correct row selects the right thing
- **WHEN** the user clicks degree `V` in the CHORDS section
- **THEN** G7 is selected as a chord (tension rows appear)
- **WHEN** the user clicks degree `V` in the SCALES section
- **THEN** G Mixolydian is selected as a scale (no tension rows)

### Requirement: PracticeBar is visible without manual scrolling on practice-mode entry

When the user enters practice mode, the PracticeBar SHALL be scrolled into view automatically. The user SHALL NOT have to manually scroll down to see the practice bar.

#### Scenario: Entering practice mode scrolls PracticeBar into view
- **WHEN** the user clicks the Practice button
- **THEN** the PracticeBar becomes visible in the viewport within 500ms (smooth scroll)
- **AND** the fretboard position highlight is already loaded before the scroll completes

#### Scenario: Exiting practice mode does not force a scroll
- **WHEN** the user clicks "Exit Practice"
- **THEN** the viewport position is not forcibly changed
