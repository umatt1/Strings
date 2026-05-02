## Context

The app is a React 19 + TypeScript SPA. All state lives in `App.tsx`. The fretboard renders whatever `selectedChordScale` + `positionHighlights` it receives — it doesn't need to change significantly. The three chunks in this change build on different layers of the app, but the fretboard display pipeline stays stable.

## Goals / Non-Goals

**Goals:**
- Flat 2-octave box positions available alongside 3NPS diagonal
- Major/Minor primary selector with key-centric pop-out for modes and diatonic chords
- Practice queue: step through items with spacebar or timer
- Chord-scale suggestion per queue item
- Handcrafted presets: diatonic workout, Autumn Leaves

**Non-Goals:**
- URL-shareable queues (TODO marker only — left for future session)
- Audio playback changes
- Custom scale creation
- Non-standard tuning changes

---

## Decisions

### Decision 1 — Flat position templates: verified intervals, not calculated

Same approach as CAGED and 3NPS. The 7 flat (2-octave box) patterns are defined as interval tables relative to the root's lowest fret on the low E string — one table per scale degree (mode). They do not change per key; they're applied transposed to any root.

Each template has one interval list per string (6 strings), like CAGED. Each string list has 2–3 semitone offsets from `baseFret`, where `baseFret = rootFret + semitoneOffsetOfDegree + roundingAdjustment`. The exact baseFret calculation mirrors the 3NPS starting-fret formula (rootFret + semitoneOffset, wrapped by ±12).

**During implementation, the exact intervals must be extracted from the reference image (or a verified guitar reference) before coding the templates.** This is intentional — the same discipline that produced correct CAGED and 3NPS patterns. Task 1.1 is dedicated to this extraction.

The flat patterns tile the neck identically to 3NPS: 7 positions, ascending from the lowest occurrence of the root on the low E string.

### Decision 2 — Position index is shared across shape systems

3NPS position I, flat position I, and CAGED position I all start at the same fret region (the root's lowest-fret occurrence on the low E string). The `positionIndex` in state means the same thing regardless of which `positionSystem` is active. This enables the teacher's drill: switch from `3nps` to `flat` without changing `positionIndex` and you stay in the same location on the neck.

### Decision 3 — Practice mode is a parallel state layer, not a replacement

In **reference mode** (current behavior), `App.tsx` holds `selectedChordScale`, `positionSystem`, `positionIndex`, `displayMode`. The fretboard shows that one selection.

In **practice mode**, those same fields are driven by `queue[queueIndex]` — the current queue item. The fretboard still receives the same props; only *who sets them* changes. Switching between modes is a toggle; the reference selection is preserved so you can return to it.

```
practiceMode: boolean
queue: QueueItem[]
queueIndex: number
timer: number | null  // seconds, null = manual spacebar only

QueueItem {
  id: string
  chordScale: ChordScale
  positionSystem: PositionSystem
  positionIndex: number
  displayMode: DisplayMode  // 'scales' | 'arpeggios'
  suggestedScale?: ScaleType  // pre-populated by chord-scale map
}
```

Spacebar fires `advanceQueue()` which increments `queueIndex` (wraps). Timer uses `setInterval` keyed to `timer` value.

### Decision 4 — Chord-scale suggestion: lookup table, not algorithmic

A hard-coded mapping from chord type to ordered list of compatible scale types. The UI shows the first suggestion by default; the user can override. This is music-theory knowledge, not computation:

```typescript
const CHORD_SCALE_MAP: Partial<Record<ChordType, ScaleType[]>> = {
  'maj7':    ['ionian', 'lydian'],
  'min7':    ['dorian', 'aeolian', 'phrygian'],
  'dom7':    ['mixolydian'],
  'm7b5':    ['locrian'],
  'dim7':    ['diminished'],          // future scale addition if needed
  'min-maj7': ['harmonic-minor'],
  'maj':     ['ionian', 'lydian'],
  'min':     ['aeolian', 'dorian'],
  'aug':     ['whole-tone'],          // future
  'dom7b9':  ['phrygian-dominant'],   // future
  // ...
};
```

### Decision 5 — Key pop-out: key-centric view derived from key root + major/minor

A `KeyContext = { keyRoot: NoteName, keyType: 'major' | 'minor' }` drives the pop-out. From it we derive:
- 7 mode roots: `getModesForKey(keyRoot, keyType)` → `{ modeDegree: number, modeRoot: NoteName, scaleType: ScaleType }[]`
- 7 diatonic 7th chords: `getDiatonicChords(keyRoot, keyType)` → `{ degree: number, root: NoteName, chordType: ChordType }[]`

Both return ordered arrays that can be displayed as buttons. "Add all to queue" maps each entry to a `QueueItem`.

The minor key automatically uses the relative major: G minor's modes are derived from Bb major (G = mode VI of Bb).

### Decision 6 — Presets: static data file, typed arrays

```typescript
// src/data/presets.ts
export const PRESETS: PracticePreset[] = [
  {
    id: 'autumn-leaves-g-minor',
    name: 'Autumn Leaves (G minor)',
    items: [
      { chordScale: { root: 'C', type: 'min7', notes: [...] }, positionSystem: '3nps', positionIndex: 1, displayMode: 'arpeggios' },
      { chordScale: { root: 'F', type: 'dom7', notes: [...] }, positionSystem: '3nps', positionIndex: 4, displayMode: 'arpeggios' },
      ...
    ]
  },
  {
    id: 'g-major-diatonic-workout',
    name: 'G Major — Diatonic Scale Positions',
    items: [ /* all 7 3NPS positions, then all 7 flat positions */ ]
  },
  ...
];
```

Presets are read-only and serve as starting points that users can load into their queue and then modify.

### Decision 7 — URL sharing: TODO only

Add a `// TODO: encode queue as URL param for sharing` comment in `QueueEditor`. No implementation this session.

---

## Risks / Trade-offs

- **Flat template accuracy** → If extracted incorrectly, the patterns will be wrong. Mitigation: extract from image carefully, spot-check against known fingerings before coding.
- **App.tsx state complexity** → Adding practice mode state increases the complexity of the root component. Consider extracting a `usePracticeQueue` hook for the queue logic.
- **Selector refactor regression** → The `MusicTheoryControls` rewrite could break existing chord/scale selection. Keep the existing `ChordScale` type and `getMusicTheoryNotes` unchanged; only refactor the UI layer.
- **Spacebar conflicts** → Spacebar could conflict with text input or buttons. Implement with a `keydown` handler that ignores when focus is on an input element.
- **Preset chord notes** → Each preset `QueueItem` needs a computed `notes` array. Use `getMusicTheoryNotes` to populate at load time, not at data-definition time, to keep presets key-agnostic where possible.

## Open Questions

- Should the flat position system show scale degree numbers differently from 3NPS (e.g., highlight the 2-octave root markers more prominently)?
- In the key pop-out, should selecting a diatonic chord automatically switch to arpeggio display mode?
- Timer: should it pause after each item (user sees it, then it advances) or advance continuously?
