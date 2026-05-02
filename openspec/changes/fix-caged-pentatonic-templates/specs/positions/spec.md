## MODIFIED Requirements

### Requirement: CAGED positions
CAGED tiles the five shapes (E, D, C, A, G) across the fretboard for 6-string guitar. Shape templates define per-string semitone interval lists relative to a shape-specific base fret. **Two distinct template sets are used**: full-scale templates (for 6- and 7-note scales) and pentatonic templates (for 5-note scales). The pentatonic templates produce exactly 2 highlighted notes per string per shape instance, matching standard reference CAGED pentatonic patterns.

- Full-scale templates: unchanged from previous behavior (interval-based, 2–3 notes per string).
- Pentatonic templates: used when `scaleNotes.length === 5`. Each shape has exactly 2 interval offsets per string.
- The tiling, shape naming, minimum-highlights filter, and non-6-string fallback are unchanged.

#### Scenario: C major pentatonic A Shape produces 2 notes per string
- **WHEN** C Major Pentatonic is selected and positionSystem = `'caged'`
- **THEN** the A Shape instance near the nut shows G(3) and A(5) on both the low E and high E strings (not only G(3))

#### Scenario: C major pentatonic E Shape high E shows two notes
- **WHEN** C Major Pentatonic is selected and positionSystem = `'caged'`
- **THEN** the E Shape instance shows C(8) and D(10) on the high E string (not only C(8))

#### Scenario: C major pentatonic D Shape G string is correct
- **WHEN** C Major Pentatonic is selected and positionSystem = `'caged'`
- **THEN** the D Shape instance shows E(9) and G(12) on the G string (not F(10) and G(12))

#### Scenario: Pentatonic shapes produce exactly 2 notes per string per instance
- **WHEN** any 5-note scale is selected and positionSystem = `'caged'`
- **THEN** every highlighted shape instance has exactly 2 notes on each of the 6 strings (12 total notes per instance, assuming all notes are in the scale)

#### Scenario: Full major scale CAGED is unaffected
- **WHEN** C Ionian (7 notes) is selected and positionSystem = `'caged'`
- **THEN** shape patterns are identical to the previous implementation (full-scale templates still apply)
