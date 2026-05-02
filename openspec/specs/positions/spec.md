# Position Systems

## Overview

Position systems divide a scale or chord across the neck into discrete, learnable finger positions. Three systems are supported: 3 Notes Per String (3NPS), CAGED, and Modes. The user can navigate between positions.

---

## Requirements

### REQ-POS-01: No-position default

On startup and when no chord/scale is selected, `positionSystem` = `'none'`. The full chord/scale is highlighted across the entire fretboard without positional restriction.

### REQ-POS-02: 3NPS positions

3 Notes Per String generates one position per scale degree of a diatonic scale, placing exactly 3 consecutive scale tones per string. Each position is labeled with the Roman numeral (I–VII) corresponding to the scale degree on which the position starts on the lowest string.

- Only valid for major (Ionian) and natural minor (Aeolian) scale types. All other scale types (including other modes and pentatonic) cause the system to fall back to `'none'`.
- Starting frets are computed mathematically from the root's lowest fret on the lowest string, not by scanning from fret 0. The formula `rootFret + semitoneOffset` (adjusted by ±12 to keep the leading tone just below the root) ensures no position lands on an open string when a higher-octave fret is correct.
- Positions are sorted ascending by `startFret`. Position labels reflect scale degree: for G major the order on the neck is VII, I, II, III, IV, V, VI.
- For natural minor (Aeolian) scales, the tonic position is labeled VI (Aeolian is the sixth mode). The neck order reads VI, VII, I, II, III, IV, V ascending from the nut.

**Scenario:** G major produces 7 correct positions in VII–VI neck order
- WHEN G Ionian is selected and positionSystem = `'3nps'`
- THEN exactly 7 positions are returned, Position VII starts at fret 2 (F# on low E), Position I starts at fret 3 (G on low E), and they are sorted in that ascending order

**Scenario:** No open-string anchoring for G major Position VI
- WHEN G Ionian is selected and positionSystem = `'3nps'`
- THEN Position VI (E) starts at fret 12 on the low E string, not fret 0

**Scenario:** Labels use Roman numerals
- WHEN any major scale is selected and positionSystem = `'3nps'`
- THEN positions are named "I", "II", "III", "IV", "V", "VI", "VII" (not "Position 1" through "Position 7")

**Scenario:** Natural minor tonic labeled VI
- WHEN A Aeolian (natural minor) is selected and positionSystem = `'3nps'`
- THEN the position starting on A (the tonic) is labeled "VI", not "I"

**Scenario:** 3NPS unavailable for non-diatonic 7-note scales
- WHEN a scale type other than Ionian/major or Aeolian/natural-minor is selected (e.g., Dorian, Harmonic Minor)
- THEN positionSystem falls back to `'none'` and no positions are returned

**Scenario:** 3NPS unavailable for pentatonic
- WHEN a pentatonic scale is selected and positionSystem = `'3nps'`
- THEN positionSystem falls back to `'none'`

### REQ-POS-03: CAGED positions

CAGED tiles the five shapes (E, D, C, A, G) across the fretboard for 6-string guitar. Shape templates define per-string semitone interval lists relative to a shape-specific base fret, where `baseFret = rootFret + baseOff`. Notes to highlight on each string are those whose fret equals `baseFret + interval[i]` for any interval in that string's list, AND whose note name is in the active scale.

- Shape templates are derived from verified reference note positions (not window approximations).
- The shapes tile across octaves so the navigator can cycle through all instances across the neck.
- Shape names (E Shape, D Shape, C Shape, A Shape, G Shape) are preserved and positions are NOT renumbered.
- For non-6-string instruments, the existing rectangular fret window fallback is retained.
- Positions with fewer than 6 highlighted notes are discarded (existing behavior).

**Scenario:** A major E shape produces correct notes
- WHEN A Ionian is selected and positionSystem = `'caged'`
- THEN the "E Shape" instance near the nut contains A(5) and B(7) on the low E string, with all other string notes matching the verified A major scale pattern for that shape

**Scenario:** CAGED order for A major is G, E, D, A, C ascending
- WHEN A Ionian is selected and positionSystem = `'caged'`
- THEN navigating positions in ascending fret order encounters G Shape, then E Shape, then D Shape, then A Shape, then C Shape

**Scenario:** CAGED pentatonic filters correctly
- WHEN A Major Pentatonic is selected and positionSystem = `'caged'`
- THEN each CAGED shape shows only the 5 pentatonic notes (A, B, C#, E, F#) with the same shape positions as the full major scale, simply omitting the non-pentatonic degrees

### REQ-POS-04: Mode positions

Mode positions create one ~5-fret box per scale degree, centred on where that degree appears on the lowest string. For 7-note scales, each position is annotated with the mode name (Ionian, Dorian, etc.).

**Scenario:**
- GIVEN C Ionian and positionSystem = `'modes'`
- WHEN positions are computed
- THEN Position 1 is labeled "Position 1 (Ionian)", Position 2 = "Position 2 (Dorian)", etc.

### REQ-POS-05: Position navigation

The user can step through positions using previous/next controls. The `positionIndex` is 0-based and must clamp to valid range [0, positions.length - 1].

### REQ-POS-06: Position reset on change

When `selectedChordScale` or `positionSystem` changes, `positionIndex` resets to 0.

### REQ-POS-07: Display mode interaction

Position highlighting and display mode filtering are applied together. Only notes that pass the display mode filter AND are in the current position's highlight set are shown as active.
