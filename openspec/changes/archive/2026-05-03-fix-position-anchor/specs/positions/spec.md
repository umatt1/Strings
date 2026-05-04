## MODIFIED Requirements

### Requirement: 3NPS and flat positions always occupy the lowest available fret range

For any key, the 7 positions in both the 3NPS and flat systems SHALL be anchored at their lowest possible occurrence on the low E string (fret 0–11). No position SHALL be shown at fret 12 or above when an equivalent lower-fret occurrence exists.

#### Scenario: C major 3NPS positions cover frets 0–10
- **WHEN** the user selects C major and activates 3NPS
- **THEN** the 7 positions have anchor frets: III=0, IV=1, V=3, VI=5, VII=7, I=8, II=10
- **AND** no position anchor is at fret 12 or above

#### Scenario: C major flat positions cover frets 0–10
- **WHEN** the user selects C major and activates Flat positions
- **THEN** the 7 positions have anchor (modeFret) values: III=0, IV=1, V=3, VI=5, VII=7, I=8, II=10
- **AND** no position anchor is at fret 12 or above

#### Scenario: G major 3NPS positions include the open-string box
- **WHEN** the user selects G major and activates 3NPS
- **THEN** position VI (E degree, the lowest open-string note) has anchor fret 0
- **AND** position VII (F#) has anchor fret 2
- **AND** position I (G/root) has anchor fret 3

#### Scenario: E major 3NPS starts from position I at open
- **WHEN** the user selects E major and activates 3NPS
- **THEN** position I (E/root) has anchor fret 0 (open string)
- **AND** positions proceed: I=0, II=2, III=4, IV=5, V=7, VI=9, VII=11

#### Scenario: Position VII is always just below the root
- **WHEN** any major key is selected and 3NPS is activated
- **THEN** position VII's anchor fret is exactly `rootFret - 1` (mod 12)
- **AND** this means VII always appears one fret below position I in the navigation sequence
