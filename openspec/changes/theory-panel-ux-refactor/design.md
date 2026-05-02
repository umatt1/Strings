## Context

`MusicTheoryControls.tsx` drives all chord/scale selection. It currently has: a root note dropdown, a Major/Minor toggle, an "All Chords" collapsible dropdown, and a "Key ▸" pop-out that shows mode buttons and diatonic chord buttons plus a nested "All Scales" dropdown. Both the All Chords dropdown and the Key pop-out select chords — redundant paths with no clear priority. Mode buttons silently change the root note. Roman numerals are all uppercase. There is no way to add a selection to the practice queue without entering Practice mode first.

The `QueueItem` type (`src/types/practice.ts`) is already fully defined and covers all fields needed (`chordScale`, `positionSystem`, `positionIndex`, `displayMode`). `getMusicTheoryNotes` and `suggestScale` already exist in `musicTheory.ts`. The chord extension intervals (add6=`[0,4,7,9]`, add9=`[0,2,4,7]`) need to be added to `CHORD_INTERVALS`.

## Goals / Non-Goals

**Goals:**
- Single path to chord/scale selection: Key pop-out is primary; "Other" section handles everything else
- Degree click → arpeggio (chord tones) by default; companion [Scale] button switches to mode scale
- Chord extension buttons (triad / add6 / 7th / add9 / add11) visible when a degree is selected; 7th on by default
- Correct Roman numeral casing (I IV V uppercase; ii iii vi lowercase; vii° half-dim notation)
- `[+ Queue]` button always visible next to the current selection, no Practice mode required
- "Other" section: compact grid of non-diatonic picks (pentatonic, blues, harmonic minor, aug, dim)

**Non-Goals:**
- Common substitution suggestions (tritone sub, bIII, etc.) — separate proposal / TODO marker
- Drag-to-reorder in the queue editor
- Mobile layout changes beyond what naturally follow

---

## Decisions

### Decision 1 — Degree button click → arpeggio first, scale companion button

When a user clicks `ii·A` (A Dorian), they more often want to hear the Am7 arpeggio in position than all 7 Dorian notes. The scale is a secondary view on the same "harmonic object." Implementation:

- Clicking a degree button sets `selectedChordScale = { type: chordType, rootNote: degreeRoot, notes: chordNotes }` (e.g., Am7) and sets `displayMode = 'arpeggios'`
- A **[Show Scale]** button appears inline — clicking it replaces `chordScale` with `{ type: modeType, rootNote: degreeRoot }` and sets `displayMode = 'scales'`
- The two states are mutually exclusive; no simultaneous display

This means clicking `ii·A` sets the active root to A. The root dropdown at the top updates to reflect this (two-way binding). This resolves the "silent root change" confusion.

```
User clicks [ii·A]:
  selectedChordScale = { type: 'min7', rootNote: 'A', notes: [A,C,E,G] }
  displayMode = 'arpeggios'
  rootNote (local state) = 'A'         ← top root dropdown updates

User then clicks [Show Scale]:
  selectedChordScale = { type: 'dorian', rootNote: 'A', notes: [A,B,C,D,E,F#,G] }
  displayMode = 'scales'
```

### Decision 2 — Chord extensions row

When a degree is active (arpeggio mode), a single row of small buttons appears below the mode/chord grids:

```
[triad] [6] [7 ●] [9] [11]
```

- `[7 ●]` is selected by default (shows the 7th chord, e.g., Am7)
- `[triad]` → switches to basic triad type (Am)
- `[6]` → Am6 (add6: type `'add6'` — new chord type)
- `[9]` → Am9 simplified as add9 (type `'add9'` — already exists)
- `[11]` → Am11 simplified as add11 (type `'add11'` — new chord type)

New intervals to add to `CHORD_INTERVALS`:
- `'add6'`: `[0, 4, 7, 9]` for major6; minor version handled by selecting minor root
- `'add11'`: `[0, 4, 7, 10, 14 % 12]` → effectively `[0, 4, 5, 7, 10]`

The extension selection is stored as local state in `MusicTheoryControls` (not persisted to App). Changing the degree resets extension to `'7th'`.

### Decision 3 — Roman numeral casing

Computed from the chord quality of each diatonic degree, not hardcoded:

```typescript
function degreeLabel(degree: number, chordType: SeventhChordType): string {
  const roman = ['I','II','III','IV','V','VI','VII'][degree - 1];
  if (chordType === 'half-dim7') return roman.toLowerCase() + '°';
  if (chordType === 'dim7')      return roman.toLowerCase() + '°';
  if (chordType === 'min7')      return roman.toLowerCase();
  return roman; // maj7, dom7 stay uppercase
}
```

For G major: `I  ii  iii  IV  V  vi  vii°`

### Decision 4 — "Other" section

Replaces the "All Chords" and "All Scales" dropdowns. A compact grid of non-diatonic types grouped into two rows:

```
CHORDS:  [aug] [dim] [dim7] [mM7] [+M7] [sus2] [sus4]
SCALES:  [pent-maj] [pent-min] [harm-min] [mel-min] [blues-maj] [blues-min]
```

Clicking any of these uses the current top-level root note (not the degree root) — the root note dropdown in the header governs these picks. This makes the flow unambiguous: Other picks always use the panel's root, degree picks use the degree's own root.

### Decision 5 — `[+ Queue]` button

Appended as a small button in the "Current selection" bar:

```
Selected: Am7    [Show Scale]  [+ Queue]  [✕]
```

`[+ Queue]` creates a `QueueItem` with:
- `chordScale` = current `selectedChordScale`
- `positionSystem` = current `positionSystem`
- `positionIndex` = current `positionIndex`
- `displayMode` = current `displayMode`
- `id` = `Date.now()` string

`App.tsx` passes `onAddToQueue` (a single `QueueItem`) callback. This is distinct from the existing `onAddChordsToQueue` (plural) which adds multiple items from the key pop-out.

---

## Risks / Trade-offs

- **Root note drift**: clicking degree buttons changes the "active root" (local + App state). If the user then clicks `[Major]` in the header, they get the new root's major scale, not the original key root. This is correct but may surprise users. Mitigation: make the "key root" visually distinct from the "current chord root" — header always shows key root, selection bar shows active root.

- **Extension state resets on degree change**: intentional, but means the user can't set "always show 9ths." If this becomes a pain point, extensions can be promoted to persistent App state. Mark as `// TODO: consider persisting extension preference`.

- **`add6` / `add11` new chord types**: `ChordType` union type must be extended. These types will appear in QueueItems saved before this change was added. Backward compatibility: safe, because old presets don't use these types.

- **Display mode coupling**: `[Show Scale]` sets `displayMode = 'scales'`, which affects the position highlighting filter. If the user has CAGED active and switches to scale view, CAGED positions now show scale tones rather than chord tones. This is the correct behavior but could confuse first-time users.
