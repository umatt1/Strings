## MODIFIED Requirements

### Requirement: Chord tensions are additive, not mutually exclusive

Tensions (9, 11, 13 and their alterations) SHALL be independent toggles that stack on top of the base chord. Multiple tensions can be active simultaneously. The 7th is always on by default but can be toggled off to reveal the triad.

**Base chord** = 1 · 3 · 5 (± quality determined by degree: maj/min/dim/aug)  
**7th** = on by default (restoring the diatonic 7th type: maj7, min7, dom7, half-dim7)  
**Tensions** = additive notes computed from the degree's mode scale

Natural tension mapping (from degree's mode scale):
- 9 → 2nd degree of the mode scale
- 11 → 4th degree of the mode scale
- 13 → 6th degree of the mode scale

Altered tensions (available for dominant 7th chords only):
- b9 → natural 9 lowered by 1 semitone
- #9 → natural 9 raised by 1 semitone
- #11 → natural 11 raised by 1 semitone
- b13 → natural 13 lowered by 1 semitone

Activating a tension toggles it on; activating again toggles it off.  
Selecting a new degree resets all tension toggles and restores [7 ON].

**Display in selection bar**: base label + active tensions joined by "·" (e.g., "Am7·9·11").

#### Scenario: Stacking 9th on top of min7
- **WHEN** degree `ii·A` (Am7) is selected and [9] is toggled ON
- **THEN** the fretboard shows notes A, C, E, G, B (Am7 + natural 9th of A Dorian)
- **AND** [7●] and [9●] are both highlighted; [11] and [13] are off
- **AND** selection bar reads "Am7·9"

#### Scenario: Adding 9 and 11 simultaneously
- **WHEN** [9] and [11] are both toggled ON for Am7
- **THEN** the fretboard shows A, C, E, G, B, D (Am11 voicing)

#### Scenario: Toggling 7th off to get a triad
- **WHEN** [7] is toggled OFF while Am7 is active
- **THEN** chord becomes Am (A, C, E); [9] [11] [13] can still be added to the triad

#### Scenario: Altered tensions for dominant chord only
- **WHEN** degree `V·D` (D7) is selected
- **THEN** altered tension buttons [b9] [#9] [#11] [b13] are shown below the natural tensions
- **WHEN** degree `I·G` (Gmaj7) is selected
- **THEN** only natural tensions [9] [11] [13] are shown; no altered row

#### Scenario: Tension reset on degree change
- **WHEN** Am7·9·11 is active and the user clicks degree `IV·C` (Cmaj7)
- **THEN** tensions reset: [7●] on, [9] [11] [13] all off; fretboard shows Cmaj7 only
