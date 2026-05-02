## Context

`MusicTheoryControls` already has a `scale-grid` with 7 diatonic mode scale buttons (from `modeData`). `getDiatonicChords` already returns the 7th chord type per degree, which is what determines the pentatonic quality. No new music theory data is needed — we just map chord quality to pentatonic type.

The blues preset adds to `PRESETS` in `src/data/presets.ts`. Existing preset structure is `{ id, name, items: QueueItem[] }`. QueueItem already has `chordScale`, `positionSystem`, `positionIndex`, `displayMode`. No type changes needed.

## Goals / Non-Goals

**Goals:**
- One row of 7 pentatonic buttons, each visually below its corresponding mode scale button
- Pentatonic type determined by chord quality: maj7/dom7 → `'pentatonic-major'`; min7/half-dim7/dim7 → `'pentatonic-minor'`
- Clicking a pentatonic button selects it exactly like any other scale (clears activeDegree, uses modeRoot as rootNote)
- G Blues preset: 6 items, I-IV-I-V-IV-I pattern, each with major pentatonic + 3NPS position

**Non-Goals:**
- Pentatonic positions via Flat or CAGED (the preset uses 3NPS; user can change position system manually)
- Transposeble blues preset (hardcoded to G for now; user can edit queue)
- Minor blues or other pentatonic scales per degree

---

## Decisions

### Decision 1 — `getDiatonicPentatonics` helper

```typescript
export function getDiatonicPentatonics(
  keyRoot: NoteName,
  keyType: 'major' | 'minor'
): { degree: number; root: NoteName; pentatonicType: 'pentatonic-major' | 'pentatonic-minor' }[] {
  const chords = getDiatonicChords(keyRoot, keyType);
  const modes  = getModesForKey(keyRoot, keyType);
  return chords.map(({ degree, chordType }, i) => ({
    degree,
    root: modes[i].modeRoot,
    pentatonicType: (chordType === 'maj7' || chordType === 'dom7')
      ? 'pentatonic-major'
      : 'pentatonic-minor',
  }));
}
```

Uses existing `getDiatonicChords` (for chord quality) and `getModesForKey` (for mode root). No new data.

### Decision 2 — UI layout: two-row grid using CSS subgrid

The Scales section currently uses `.scale-grid` (7 columns). The pentatonic row should align exactly to those columns. Using a single 7-column grid container with two rows is the cleanest approach:

```
.pent-row + .scale-grid share the same 7-column grid.
```

In practice: wrap both rows in a `.degree-scale-group` div:
```html
<div class="degree-scale-group">
  <!-- row 1: existing mode scale buttons (class=scale-grid becomes a row within the group) -->
  <div class="scale-row"> ... 7 mode buttons ... </div>
  <!-- row 2: new pentatonic buttons -->
  <div class="pent-row"> ... 7 pent buttons ... </div>
</div>
```

Both `.scale-row` and `.pent-row` use `display: grid; grid-template-columns: repeat(7, 1fr)`.

Pentatonic buttons get a distinct visual style — slightly smaller text, a pentagon symbol (♦) or "pent" label, and a different but harmonious color (e.g., amber/gold to signal "pentatonic", vs. the green used for mode scale buttons).

Button label: `{displayNote(root)}♦` with title tooltip `{displayNote(root)} {pentatonicType === 'pentatonic-major' ? 'Major Pent' : 'Minor Pent'}`.

### Decision 3 — Blues preset

```typescript
// In presets.ts
function bluesItem(root: NoteName, posIdx: number, id: string): QueueItem {
  const pentNotes = getMusicTheoryNotes(root, 'pentatonic-major');
  return {
    id,
    chordScale: { type: 'pentatonic-major', rootNote: root, notes: pentNotes },
    positionSystem: 'caged',  // CAGED pentatonic gives clean 2-note-per-string boxes
    positionIndex: 0,
    displayMode: 'scales',
  };
}

// I-IV-I-V-IV-I in G: G · C · G · D · C · G
const G_BLUES: QueueItem[] = [
  bluesItem('G', 0, 'blues-1'),
  bluesItem('C', 0, 'blues-2'),
  bluesItem('G', 0, 'blues-3'),
  bluesItem('D', 0, 'blues-4'),
  bluesItem('C', 0, 'blues-5'),
  bluesItem('G', 0, 'blues-6'),
];
```

Using CAGED (not 3NPS) for the pentatonic positions because CAGED produces the familiar 2-note-per-string box shapes that guitarists know for pentatonics. The position index starts at 0; the user can navigate positions during practice.

---

## Risks / Trade-offs

- **Locrian pentatonic**: Locrian (vii°) maps to minor pentatonic on B (in C major). B minor pentatonic = B D E F# A. These notes all exist in C major, so it's a valid choice even if rarely used in practice.

- **Panel height**: adding a second row to the Scales section makes the panel taller. Acceptable — the panel already scrolls on mobile. Worth monitoring.

- **Blues preset key**: hardcoded to G. A musician in Bb would want the same pattern in Bb. Future work: derive the preset from the active key in the app, or let the user transpose. For now a static G preset is clear and useful.
