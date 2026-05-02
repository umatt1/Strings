# Audio Playback

## Overview

Sound is generated via the Web Audio API — no audio files are used. The system supports single-note playback on click and two playback modes for highlighted notes: play all simultaneously and play ascending in sequence.

---

## Requirements

### REQ-AUD-01: Single note playback on click

Clicking any fretboard note cell plays that note's frequency immediately using the Web Audio API. The note's frequency is pre-computed by `getNoteAtFret` using equal temperament (A4 = 440 Hz).

**Scenario:**
- GIVEN the user clicks a fret cell showing A4
- WHEN the click handler fires
- THEN the Web Audio context plays a tone at 440 Hz

### REQ-AUD-02: Play all highlighted notes

The "Play All" playback control triggers all currently highlighted notes simultaneously (or in rapid arpeggiated succession — implementation detail). Only notes passing the current display mode filter are included.

### REQ-AUD-03: Play ascending scale

The "Play Ascending" control plays highlighted notes in ascending pitch order, one at a time with a short delay between each note. Only notes passing the current display mode filter are included.

**Scenario:**
- GIVEN C Major is selected and displayMode = `'scales'`
- WHEN "Play Ascending" is triggered
- THEN notes play in the order: C, D, E, F, G, A, B (ascending by pitch)

### REQ-AUD-04: Selected note display

Up to 2 notes can be simultaneously selected (clicked). When 2 notes are selected, the interval between them (e.g., "Perfect 5th") is displayed in the playback controls area.

### REQ-AUD-05: Clear selection

A "Clear" action resets `selectedNotes` to an empty array.
