## Why

The app is currently a reference tool: you pick one chord or scale and see it on the fretboard. Three limitations block it from serving actual practice:

1. **Only one way to play positions.** 3NPS (diagonal) is implemented, but the "flat" (2-octave box) approach — where you stay in a fret window and cover 2 full octaves — is missing. A musician's teacher might say: "run the diagonal scale up, play the flat box in that position, then run diagonal again." You can't do that drill in the app today.

2. **The mode selector doesn't match how musicians think.** The current UI lists all 7 modes as separate scale types (Ionian, Dorian, Phrygian…). Most musicians think in terms of a *key* — "I'm in G major" — and then navigate positions or chords *within* that key. The 7-mode list takes space and is rarely how people approach scale practice.

3. **No way to practice sequences.** There is no "practice mode" — no way to queue up a set of positions, chords, or changes and step through them. A teacher might assign: "practice all diatonic 7th chord arpeggios in G major." Or a student might want to drill the Autumn Leaves chord changes. The app can't do either.

## What Changes

### Chunk 1 — Flat 2-Octave Position System
- Add `'flat'` to `PositionSystem`. Produces 7 positions ascending the neck, one per scale degree, each a verified 2-octave box pattern (the same fret-window approach as the image the user referenced).
- Each flat position is anchored at the fret where that mode's root appears on the lowest string — identical anchoring to 3NPS, just a different shape (box vs. diagonal).
- Templates are hard-coded intervals derived from a verified reference (not calculated), following the same approach as CAGED and 3NPS.
- The position navigator in `PositionControls` gains a `'flat'` button alongside `3NPS` and `CAGED`.

### Chunk 2 — Key-Centric Selector and UI Simplification
- The primary selector collapses to: **root note** + **Major / Minor** (the two most common cases). This replaces the crowded mode list as the default view.
- A **key pop-out** (modal or slide-out panel) expands the key into two groups: all 7 mode positions (I–VII) and all 7 diatonic 7th chords — both selectable individually or "add all to queue."
- Mode types (Dorian, Phrygian, etc.) are still accessible from the pop-out for explicit selection.
- The relationship between major and minor is reflected: minor = mode VI of major. The pop-out shows this mapping.

### Chunk 3 — Practice Sequencer
- A **Practice Mode** toggle appears alongside the existing reference view.
- In practice mode, a **queue** of items appears below the fretboard. Each item specifies: `{chordScale, positionSystem, positionIndex, displayMode}`.
- The user advances with the **spacebar** (or a timer).
- Each chord/scale item has a **display mode toggle**: show the valid notes *within the chord* (arpeggio) or the *scale that fits* (chord-scale suggestion).
- The app provides a **chord-scale suggestion** per item: given a chord type (e.g., min7), it suggests the most common compatible scale (e.g., Dorian). The user can accept or override.
- **Handcrafted presets** include: diatonic scale positions workout, diatonic 7th arpeggio workout, and Autumn Leaves (G minor) chord changes.
- **TODO** (future session): URL-encodable queue sharing so sequences can be embedded or sent as a link.

## Capabilities

### New Capabilities
- `flat-positions`: The flat 2-octave position system, including verified interval templates per mode and fretboard integration.
- `practice-sequencer`: Queue data model, spacebar/timer navigation, per-item display mode, chord-scale suggestions, handcrafted presets.

### Modified Capabilities
- `positions`: REQ-POS-02 and/or new REQ-POS-05 to add flat position system. The `PositionSystem` type expands.
- `ui`: Selector collapses to major/minor primary with key pop-out. Practice mode toggle added. Significant structural changes to `MusicTheoryControls` and layout.

## Impact

- `src/utils/positions.ts` — add `'flat'` to `PositionSystem`, implement `calculateFlatPositions` with verified templates
- `src/utils/musicTheory.ts` — add chord-scale suggestion map; add key-centric helpers (get diatonic chords, get mode roots for a key)
- `src/types/practice.ts` — new file: `QueueItem`, `PracticeQueue` types
- `src/App.tsx` — add `practiceMode`, `queue`, `queueIndex`, `timer` state; wire spacebar handler
- `src/components/MusicTheoryControls.tsx` — refactor: collapse to major/minor primary, add key pop-out panel
- `src/components/PositionControls.tsx` — add `'flat'` button
- `src/components/PracticeBar.tsx` — new component: queue display, prev/next, spacebar feedback, timer
- `src/components/QueueEditor.tsx` — new component: queue item list, add/remove, preset picker
- Presets data file (e.g., `src/data/presets.ts`) — handcrafted queues for Autumn Leaves, diatonic workouts
- CSS updates throughout
