## MODIFIED Requirements

### Requirement: Music theory selection panel (`MusicTheoryControls`) — restructured

The panel is reorganized around the Key pop-out as the primary selection mechanism. The separate "All Chords" dropdown is removed. The root note selector and Major/Minor toggle serve as the key header.

**Structure:**

```
Root [G ▼]  [Major ●] [Minor]

┌─ Key of G Major ──────────────────────────────────┐
│  I·G  ii·A  iii·B  IV·C  V·D  vi·E  vii°·F#      │  ← Roman numeral casing
│  [Gmaj7][Am7][Bm7][Cmaj7][D7][Em7][F#ø7]          │  ← 7th by default
│  Extension: [triad][6][7 ●][9][11]                 │  ← only when degree active
│  [+ All modes to queue]  [+ All 7ths to queue]    │
└────────────────────────────────────────────────────┘

Other:
[aug][dim7][ø7][mM7]  [pent-maj][pent-min][harm-min][blues-min]
           ↑ TODO: future "common subs" (tritone sub, bIII, bVII)

Selected: Am7  [Show Scale]  [+ Queue]  [✕]
```

**Behavior changes:**
- Degree buttons (mode row) set the **arpeggio** (chord tones) by default, with displayMode = 'arpeggios'. Root note updates to degree root.
- A `[Show Scale]` toggle appears in the selection bar when a degree arpeggio is active. Clicking it switches to the corresponding mode scale.
- Roman numerals use correct music-theory casing: uppercase for major/dominant degrees, lowercase for minor, lowercase + ° for half-diminished.
- The "Other" row handles all non-diatonic picks (augmented, diminished, pentatonic, blues, harmonic minor). These use the top-level root dropdown (not the degree root).
- The nested "All Scales" dropdown inside the pop-out is removed.
- The "All Chords" dropdown in the primary view is removed.

#### Scenario: Degree click → arpeggio default
- **WHEN** user clicks `ii·A` in the G major key pop-out
- **THEN** selectedChordScale becomes Am7, displayMode = 'arpeggios', root selector updates to A

#### Scenario: Show Scale companion button
- **WHEN** Am7 is active (from clicking ii·A) and user clicks [Show Scale]
- **THEN** selectedChordScale becomes A Dorian, displayMode = 'scales'

#### Scenario: Roman numeral casing in G major
- **WHEN** Key = G Major
- **THEN** mode row shows: `I·G  ii·A  iii·B  IV·C  V·D  vi·E  vii°·F#`
- **AND** chord row shows: `Gmaj7  Am7  Bm7  Cmaj7  D7  Em7  F#ø7`

#### Scenario: Other section uses top-level root
- **WHEN** root dropdown = C and user clicks [pent-maj] in Other section
- **THEN** selectedChordScale becomes C Major Pentatonic (not the last degree root)

#### Scenario: Selecting from Other clears [Show Scale]
- **WHEN** an Other pick is active
- **THEN** [Show Scale] is not shown (it only applies to diatonic degree selections)
