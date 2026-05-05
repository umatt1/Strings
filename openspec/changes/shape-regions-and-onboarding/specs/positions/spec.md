## REMOVED Requirements

### Requirement: Flat 2-octave positions
**Reason:** The Flat position system produces nearly identical output to the Mode (Positions) box system. Having two options that look the same creates confusion. Flat is removed; Positions (mode boxes) is the canonical box-position system.
**Migration:** Any stored state with `positionSystem: 'flat'` silently falls back to `'none'` on next load. No user data is lost (positions are computed, not stored).

## MODIFIED Requirements

### Requirement: Mode positions

Mode positions create one ~5-fret box per scale degree, anchored on where that degree appears on the lowest string. Positions tile across octaves (same as CAGED). For 7-note scales, each position is labeled with its Roman numeral degree and starting note name (e.g. `"I — C"`). Positions are ordered with the tonic position first, then the remaining degrees ascending by fret from the tonic.

#### Scenario: C Ionian positions are labeled by degree and note name
- **WHEN** C Ionian is selected and positionSystem is `'modes'`
- **THEN** the first position is labeled `"I — C"` (the tonic)
- **AND** subsequent positions are labeled `"II — D"`, `"III — E"`, `"IV — F"`, `"V — G"`, `"VI — A"`, `"VII — B"` in ascending fret order from the tonic

#### Scenario: Tonic position is always index 0
- **WHEN** any diatonic scale is selected and positionSystem is `'modes'`
- **THEN** positionIndex 0 always corresponds to the tonic (I) box position

#### Scenario: Positions tile across two octaves
- **WHEN** C Ionian is selected and positionSystem is `'modes'`
- **THEN** positions exist for both the first octave (frets 0–11) and second octave (frets 12–23)
- **AND** navigating past the 7th position wraps to the octave-higher I position

#### Scenario: Mode name suffix removed
- **WHEN** any scale is selected and positionSystem is `'modes'`
- **THEN** position labels do NOT include mode name suffixes like "(Ionian)" or "(Phrygian)"
- **AND** labels follow the format `"<Roman numeral> — <note name>"`

#### Scenario: Near-nut stubs discarded
- **WHEN** positions are computed for any key
- **THEN** any position instance with fewer than 12 highlighted notes is discarded
- **AND** only complete box positions (at least 2 notes per string on all 6 strings) are shown
