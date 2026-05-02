# Music Theory Domain

## Overview

The music theory domain is the core calculation engine of the app. It computes which notes belong to any chord or scale given a root note, using semitone-interval arithmetic on the canonical 12-note chromatic scale.

---

## Requirements

### REQ-MT-01: Chromatic scale representation

The canonical note array `NOTES` uses sharps: `['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']`. All internal pitch arithmetic indexes into this array. Flat equivalents exist in `NOTES_FLAT` but are used for display only.

### REQ-MT-02: Supported chord types

The system must support exactly these chord categories and types:

| Category | Types |
|---|---|
| Triads | major, minor, diminished, augmented |
| Seventh Chords | maj7, min7, dom7, half-dim7, dim7, min-maj7, aug-maj7 |
| Extended/Suspended | add9, sus2, sus4 |

Each chord type is defined as a semitone-interval array from the root (e.g., major = `[0, 4, 7]`).

### REQ-MT-03: Supported scale types

The system must support exactly these scale categories and types:

| Category | Types |
|---|---|
| Pentatonic | pentatonic-major, pentatonic-minor |
| Major Modes | ionian, dorian, phrygian, lydian, mixolydian, aeolian, locrian |
| Minor Scales | natural-minor, harmonic-minor, melodic-minor |
| Blues | blues-major, blues-minor |

### REQ-MT-04: Note computation

`getMusicTheoryNotes(rootNote, type)` must return the ordered array of note names in that chord or scale. Notes wrap around the chromatic octave using modulo 12 arithmetic.

**Scenario:**
- GIVEN root = `'C'` and type = `'major'`
- WHEN `getMusicTheoryNotes` is called
- THEN result is `['C', 'E', 'G']`

### REQ-MT-05: Scale degree assignment

`getScaleDegreeInfo(note, chordScale)` returns the scale degree (1–7) and whether it is "important" (degrees 1, 3, 5 are important). Returns `null` if the note is not in the chord/scale.

**Scenario:**
- GIVEN a C Major chord (`['C', 'E', 'G']`) and note = `'E'`
- WHEN `getScaleDegreeInfo` is called
- THEN degree = 3, isImportant = true

### REQ-MT-06: Enharmonic display

Enharmonic conversion (sharp ↔ flat) is purely cosmetic and must not affect internal pitch calculations. The `getDisplayNoteName(note, preference, rootNote)` function applies conversion at render time only.

- `preference = 'sharps'` → always show sharps
- `preference = 'flats'` → always show flats
- `preference = 'auto'` → choose based on the key signature (sharp keys use sharps, flat keys use flats)

Sharp keys: C G D A E B F# C#
Flat keys: F Bb Eb Ab Db Gb Cb

### REQ-MT-07: Frequency calculation

`calculateFrequency(note, octave)` computes frequency in Hz using equal temperament, anchored at A4 = 440 Hz.

**Scenario:**
- GIVEN note = `'A'` and octave = 4
- WHEN `calculateFrequency` is called
- THEN result = 440.0 Hz (±0.01)
