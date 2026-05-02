## MODIFIED Requirements

### Requirement: Music theory selector — primary view
The primary selector SHALL default to root note + **Major** or **Minor** radio/toggle (replacing the current full mode list as the default). Selecting Major gives Ionian; selecting Minor gives Aeolian. The chord category remains accessible. This covers the majority use case and reduces visual clutter.

#### Scenario: Default selector shows major/minor toggle
- **WHEN** the selector panel is open in its default state
- **THEN** the user sees: root note picker, [Major] [Minor] toggle, and chord categories — but NOT the full 7-mode list

#### Scenario: Selecting major sets Ionian
- **WHEN** root = G and the user clicks [Major]
- **THEN** selectedChordScale becomes G Ionian (G A B C D E F#)

## ADDED Requirements

### Requirement: Key pop-out panel
A key pop-out (slide-in panel or expandable section) SHALL expose:
1. **Mode positions** — all 7 mode degrees for the selected key, each shown as `[I·G] [II·A] [III·B]...` buttons that set the selectedChordScale to that mode when clicked
2. **Diatonic 7th chords** — all 7 diatonic 7th chords for the key, shown as `[Gmaj7] [Am7] [Bm7]...` buttons
3. **"Add all to queue"** — one-click to add all 7 positions or all 7 chords to the practice queue
4. **Explicit mode picker** — shows all 7 mode types for users who want to pick Dorian explicitly by name

The pop-out is opened from a `[Key ▸]` or `[Modes ▸]` expander in the primary selector panel.

#### Scenario: Key pop-out for G major
- **WHEN** root = G, type = Major, user opens key pop-out
- **THEN** the pop-out shows mode buttons [I·G Ionian] [II·A Dorian] [III·B Phrygian] [IV·C Lydian] [V·D Mixolydian] [VI·E Aeolian] [VII·F# Locrian] and chord buttons [Gmaj7] [Am7] [Bm7] [Cmaj7] [D7] [Em7] [F#m7b5]

#### Scenario: Clicking a diatonic chord from pop-out
- **WHEN** user clicks [Am7] in the G major key pop-out
- **THEN** selectedChordScale becomes A min7 and the fretboard highlights Am7 notes

#### Scenario: "Add all 7th chords to queue" from pop-out
- **WHEN** user clicks "Add all 7th chords" in the G major pop-out
- **THEN** 7 queue items are appended, one per diatonic chord of G major, each with chord-scale suggestion pre-populated

---

### Requirement: Practice mode UI — PracticeBar
A `PracticeBar` component SHALL appear at the bottom of the fretboard area when practice mode is active. It shows:
- The current queue item's chord/scale name and display mode
- Surrounding items for context (scrollable horizontal strip)
- Prev / Next buttons and a spacebar indicator
- Timer control (set seconds or disable)
- "Edit Queue" button that opens the queue editor

#### Scenario: PracticeBar is visible in practice mode
- **WHEN** practiceMode = true and queue.length > 0
- **THEN** the PracticeBar is rendered below the fretboard with the current item highlighted in the strip

#### Scenario: PracticeBar hidden in reference mode
- **WHEN** practiceMode = false
- **THEN** the PracticeBar is not rendered; layout matches current behavior

---

### Requirement: Flat position button in position controls
A `'flat'` button SHALL appear in the position system selector alongside `3NPS`, `CAGED`, and `All`. It is only shown when a major or natural minor scale is selected (same eligibility as 3NPS).

#### Scenario: Flat button visible for major scale
- **WHEN** G Ionian is selected
- **THEN** the position system selector shows: [All] [3NPS] [Flat] [CAGED] [Positions]

#### Scenario: Flat button hidden for pentatonic
- **WHEN** G Major Pentatonic is selected
- **THEN** the [Flat] button is not shown in the position system selector
