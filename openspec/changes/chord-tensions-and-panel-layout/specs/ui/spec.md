## MODIFIED Requirements

### Requirement: Music theory panel — three always-visible sections

The panel SHALL display three sections (Chords, Scales, Other) without a "Key ▸" collapsible toggle. All sections are visible when the panel is expanded. The major/minor toggle + root dropdown remain as the key header.

**Section 1 — Chords:**
- Diatonic degree buttons (7 buttons, Roman numeral casing: I ii iii IV V vi vii°)
- Diatonic chord buttons below (7 buttons: Gmaj7 Am7 Bm7 Cmaj7 D7 Em7 F#ø7)
- Tension row: [7] [9] [11] [13] (natural, always visible when a degree is active)
- Altered tension row: [b9] [#9] [#11] [b13] (only when active degree is dom7)
- [+ All 7ths to queue] button

**Section 2 — Scales:**
- 7 diatonic mode scale buttons (same root labels as degree buttons but selecting the scale)
- Compact grid of non-diatonic scales: pentatonic-major, pentatonic-minor, blues-major, blues-minor, harmonic-minor, melodic-minor
- [+ All modes to queue] button

**Section 3 — Other Chords:**
- Compact grid of remaining chord types: aug, dim7, half-dim7, min-maj7, sus2, sus4
- Uses top-level key root (not degree root) for these picks

The [Scale] companion button in the selection bar is REMOVED. The `keyPopoutOpen` state and "Key ▸" toggle are removed.

#### Scenario: Panel shows all three sections without toggling
- **WHEN** the panel is expanded
- **THEN** Chords, Scales, and Other sections are all visible without any additional click

#### Scenario: Scales section allows queuing pentatonics
- **WHEN** root = G and [pent-maj] is clicked in the Scales section
- **THEN** selectedChordScale becomes G Major Pentatonic; displayMode is unaffected

#### Scenario: Tension row only appears when a degree is active
- **WHEN** no degree is selected (e.g., a scale is selected from Scales section)
- **THEN** the tension row is NOT shown

#### Scenario: No [Scale] button in selection bar
- **WHEN** a chord degree (e.g., Am7) is active
- **THEN** the selection bar shows "Am7" (or "Am7·9" with tensions) and [+ Queue] and [✕] only — no [Scale] button
