## ADDED Requirements

### Requirement: Diatonic pentatonic row in Scales section

The Scales section of the music theory panel SHALL display a second row of 7 buttons, one per diatonic degree, positioned directly below the corresponding diatonic mode scale button. Each button selects the pentatonic scale that best fits that degree:

- Degrees with **major or dominant quality** (I, IV, V) → **major pentatonic** on that degree's root
- Degrees with **minor or diminished quality** (ii, iii, vi, vii°) → **minor pentatonic** on that degree's root

The pentatonic buttons are visually distinct from the mode scale buttons (different color). Clicking a pentatonic button:
1. Sets `selectedChordScale` to `{ type: 'pentatonic-major' | 'pentatonic-minor', rootNote: degreeRoot, notes: [...] }`
2. Sets `displayMode = 'scales'`
3. Clears `activeDegree` (tension row hidden)
4. Does NOT change the key root dropdown

#### Scenario: C major pentatonic row
- **WHEN** key = C Major
- **THEN** the pentatonic row shows: `C♦` `Dm♦` `Em♦` `F♦` `G♦` `Am♦` `Bm♦`
  - C♦ = C major pentatonic (I is maj7 quality)
  - Dm♦ = D minor pentatonic (ii is min7 quality)
  - Em♦ = E minor pentatonic (iii is min7 quality)
  - F♦ = F major pentatonic (IV is maj7 quality)
  - G♦ = G major pentatonic (V is dom7 quality)
  - Am♦ = A minor pentatonic (vi is min7 quality)
  - Bm♦ = B minor pentatonic (vii° is half-dim7 quality → minor pent)

#### Scenario: Clicking a pentatonic button selects the scale
- **WHEN** key = G Major and user clicks the `Am♦` button (vi degree)
- **THEN** selectedChordScale becomes A minor pentatonic (A, C, D, E, G), displayMode = scales

#### Scenario: Pentatonic row aligns with mode scale row
- **WHEN** the Scales section is rendered
- **THEN** each pentatonic button is in the same column as the corresponding mode scale button above it (same grid column alignment)
