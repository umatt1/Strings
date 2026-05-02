## Why

The Music Theory panel has grown redundant and confusing: an "All Chords" dropdown and the Key pop-out both select chords, the mode buttons silently change the root note without feedback, Roman numerals are all uppercase (ignoring chord quality), and there is no quick way to add the current selection to the practice queue. A musician should be able to think "I'm in G major — let me hear the ii chord with its scale" in two taps, not six.

## What Changes

- **Remove** the "All Chords" dropdown from the primary view; the Key pop-out becomes the sole selector for chords and scales
- **Degree buttons now select the arpeggio (chord tones)** by default when clicked, with a companion [Scale] button to switch to the mode's scale — this is the "chord + scale pairing" that makes the queue meaningful
- **Chord extension row** appears when a degree is selected: buttons for [no 7th] [add6] [add9] [add11] [maj7/dom7/min7 toggle], letting the musician quickly augment the selected chord
- **7th chord toggle** (triads vs 7th chords) on the degree grid — 7ths on by default
- **Correct Roman numeral casing**: uppercase for major (I, IV, V), lowercase for minor (ii, iii, vi), lowercase + ° for half-diminished (vii°)
- **"Other" section** below the Key pop-out for non-diatonic picks (pentatonic, blues, harmonic minor, augmented, etc.) — a compact grid rather than a deep dropdown
- **Persistent `[+ Queue]` button** next to the current selection; clicking it adds the active chord/scale + current position settings to the queue without entering Practice mode
- **TODO marker** for a future "common non-diatonic substitutions" panel (tritone subs, bIII, bVII, etc.) — separate proposal

## Capabilities

### New Capabilities
- `chord-extensions`: inline extension selector (triad/6th/7th/9th/11th) for a selected chord degree
- `queue-shortcut`: persistent "+ Queue" action that appends current selection to the practice queue from reference mode

### Modified Capabilities
- `ui`: MusicTheoryControls restructured — Key pop-out becomes primary selector; Roman numeral casing; "Other" section replaces all-chords dropdown; degree click behavior changes to arpeggio-first
- `practice-sequencer`: queue can now be populated from reference mode (no mode switch required to add items)

## Impact

- `src/components/MusicTheoryControls.tsx` — major restructure
- `src/components/MusicTheoryControls.css` — style updates
- `src/utils/musicTheory.ts` — chord extension helpers (add6, add9, add11 intervals)
- `src/App.tsx` — `[+ Queue]` wiring; queue state accessible from reference mode
- `src/types/practice.ts` — QueueItem already has all needed fields (no breaking changes)
