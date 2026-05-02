# Instruments & Tunings

## Overview

The instrument system defines which strings are present and their open-note tunings. A tuning preset bundles a name, category, and ordered string configs (high to low). The active instrument drives all fretboard calculations.

---

## Requirements

### REQ-INS-01: String config

Each string is defined by `{ openNote: NoteName, octave: number }`. String order in arrays is high-to-low pitch (index 0 = highest string).

### REQ-INS-02: Guitar tuning presets

The system ships with these guitar presets (category = `'guitar'`, 6 strings):

| ID | Name |
|---|---|
| standard | Standard (E-A-D-G-B-E) |
| drop-d | Drop D (D-A-D-G-B-E) |
| dadgad | DADGAD (D-A-D-G-A-D) |
| open-g | Open G (D-G-D-G-B-D) |
| open-d | Open D (D-A-D-F#-A-D) |
| half-step-down | Half Step Down (Eb-Ab-Db-Gb-Bb-Eb) |

### REQ-INS-03: Bass tuning presets

The system ships with these bass presets (category = `'bass'`):

| ID | Name | Strings |
|---|---|---|
| bass-standard | 4-String Standard (G-D-A-E) | 4 |
| bass-drop-d | 4-String Drop D (G-D-A-D) | 4 |
| bass-5-string | 5-String Standard (G-D-A-E-B) | 5 |
| bass-5-string-high-c | 5-String High C (C-G-D-A-E) | 5 |
| bass-half-step-down | 4-String Half Step Down (Gb-Db-Ab-Eb) | 4 |

### REQ-INS-04: Default instrument

On startup, the active instrument defaults to Standard Guitar (E-A-D-G-B-E, standard).

### REQ-INS-05: Mirror strings toggle

A mirror-strings mode reverses the visual string order on the fretboard (useful for left-handed players or upside-down display preference). Mirroring is purely visual — it does not change the underlying `instrument.strings` array.

**Scenario:**
- GIVEN mirror mode is OFF and standard guitar is active
- WHEN the fretboard renders
- THEN string index 0 (high E) appears at the top

**Scenario:**
- GIVEN mirror mode is ON
- WHEN the fretboard renders
- THEN string index 0 (high E) appears at the bottom

### REQ-INS-06: Note at fret

`getNoteAtFret(openNote, openOctave, fret)` computes the `Note` (name, octave, frequency) sounding at a given fret number. Fret 0 = open string.

**Scenario:**
- GIVEN openNote = `'E'`, openOctave = 2, fret = 5
- WHEN `getNoteAtFret` is called
- THEN result.name = `'A'` and result.octave = 2
