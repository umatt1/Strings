## MODIFIED Requirements

### Requirement: Minor key panel starts from the minor tonic

When `keyType = 'minor'`, the 7 degree buttons in the Chords section and the 7 scale buttons in the Scales section SHALL be ordered starting from the minor tonic (degree i = Aeolian), not from the relative major (degree I = Ionian).

The "(from X Major)" subheader in the panel header is removed.

#### Scenario: G minor degree order
- **WHEN** root = G and [Minor] is selected
- **THEN** the mode/chord degree buttons show (left to right):
  `i·G  ii°·A  III·Bb  iv·C  v·D  VI·Eb  VII·F`
- **AND** the chord buttons below show:
  `Gm7  Am7b5  Bbmaj7  Cm7  Dm7  Ebmaj7  F7`
- **AND** the header reads "G Minor" (no "(from Bb Major)" text)

#### Scenario: A minor degree order
- **WHEN** root = A and [Minor] is selected
- **THEN** the degree buttons show:
  `i·A  ii°·B  III·C  iv·D  v·E  VI·F  VII·G`
- **AND** the chord buttons show:
  `Am7  Bm7b5  Cmaj7  Dm7  Em7  Fmaj7  G7`

#### Scenario: Clicking a minor degree selects the correct scale/chord
- **WHEN** root = G, Minor, and user clicks `ii°·A`
- **THEN** selectedChordScale becomes A half-diminished 7th (Am7b5)
- **AND** displayMode = arpeggios (same as major key degree click behavior)
