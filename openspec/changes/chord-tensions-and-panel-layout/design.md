## Context

The current extension row lets users pick ONE of: triad / add6 / 7th / add9 / add11. This is wrong for jazz harmony — tensions (9, 11, 13) are layered on top of the 7th, not substitutes for it. A CMaj9 is CMaj7 + 9, not "9 instead of 7."

The current panel hides scales. "Other" is the only home for pentatonic/blues scales. The "Key ▸" toggle means the chord+scale section is hidden on first load.

`ChordScale.notes` already holds an arbitrary array of note names — we can include tension notes there. The `type` field records the base 7th chord type (e.g., `'min7'`). This approach means the label won't automatically reflect the tensions, so we need a computed label.

## Goals / Non-Goals

**Goals:**
- Tension toggles are additive: [7●] [9] [11] [13] — multiple can be ON simultaneously
- Natural tensions computed from degree's mode scale; altered tensions (b9 #9 #11 b13) available for dominant chords
- Panel: three always-open sections — Chords, Scales, Other
- Scales section: 7 diatonic mode scale buttons + flat grid of non-diatonic scales (pentatonics, blues, harm-min, mel-min)
- [Scale] button removed from selection bar; selection label shows tension names when active

**Non-Goals:**
- Altered tensions for non-dominant chords (Lydian #11 exists in theory, but keep scope tight)
- Drag-to-reorder tensions
- Saving custom voicings

---

## Decisions

### Decision 1 — Tension model: additive toggles, notes computed on change

Active tensions are stored as local state in `MusicTheoryControls`:
```typescript
type Tension = '9' | 'b9' | '#9' | '11' | '#11' | '13' | 'b13';
const [activeTensions, setActiveTensions] = useState<Set<Tension>>(new Set());
const [sevenOn, setSevenOn] = useState(true);   // 7th on/off (triad toggle)
```

When a degree is selected, tensions reset to `{}` and sevenOn resets to `true`.

On any tension toggle or 7th toggle, `buildChordNotes()` is called:
```typescript
function buildChordNotes(degreeRoot, baseType, sevenOn, activeTensions, modeScale) {
  const base = sevenOn
    ? getMusicTheoryNotes(degreeRoot, baseType)  // 1 3 5 7
    : getMusicTheoryNotes(degreeRoot, triadOf(baseType));  // 1 3 5

  // Natural tensions (9=modeScale[1], 11=modeScale[3], 13=modeScale[5])
  // Altered tensions: flat/sharp the natural tension by ±1 semitone
  const tensionNotes = tensionsToNotes(degreeRoot, modeScale, activeTensions);
  return dedup([...base, ...tensionNotes]);
}
```

The resulting `ChordScale.notes` is the union. The `type` stays as the base 7th type (e.g., `'min7'`). The selection label is synthesized: "Am7·9·11" or "Am·9" (no 7th).

**Why not new ChordType values like 'min9', 'dom13b9'?** The combinatorial space is too large (8 base types × many tension combos). Dynamic notes arrays are the correct approach for an interactive tension system.

### Decision 2 — Natural vs. altered tension mapping

Natural tensions come from the MODE SCALE of the selected degree:
- For Am7 in G major (A Dorian): 9 = B (2nd of A Dorian), 11 = D (4th), 13 = F# (6th)
- For Gmaj7 (G Ionian): 9 = A, 11 = C, 13 = E

Altered tensions shift by ±1 semitone from the natural:
- b9 = natural 9 - 1 semitone
- #9 = natural 9 + 1 semitone
- #11 = natural 11 + 1 semitone
- b13 = natural 13 - 1 semitone

Altered tensions are only shown in the UI when the active degree is a **dominant 7th** (dom7) chord, since those are the musically common contexts. For other chord types, only natural tensions [9] [11] [13] are shown.

```
Dominant chord (V·D → D7 in G major):
  Natural: 9=E, 11=G (often avoided), 13=B
  Altered: b9=Eb, #9=F, #11=Ab, b13=Bb

Major chord (I·G → Gmaj7):
  Natural only: 9=A, 11=C, 13=E
  (No altered row shown)
```

### Decision 3 — Panel layout: three always-visible sections

Remove the "Key ▸" toggle. The panel content (when not collapsed) is:

```
[G ▼]  [Major ●] [Minor]

━━━ Chords ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  I·G   ii·A  iii·B  IV·C   V·D  vi·E  vii°·F#
[Gmaj7][Am7 ][Bm7  ][Cmaj7][D7 ][Em7 ][F#ø7  ]

[ 7 ● ] [ 9 ] [ 11 ] [ 13 ]      ← natural tensions (always)
[ b9 ] [ #9 ] [ #11 ] [ b13 ]   ← altered tensions (dom7 only)

[+ All 7ths to queue]

━━━ Scales ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mode scales (diatonic):
[G Ion][A Dor][B Phr][C Lyd][D Mix][E Aeo][F# Loc]

Other scales:
[pent-maj][pent-min][blues-maj][blues-min][harm-min][mel-min]

[+ All modes to queue]

━━━ Other Chords ━━━━━━━━━━━━━━━━━━━━━━━
[aug][dim7][ø7][mM7][sus2][sus4]

Selected: Am7·9   [+ Queue]   [✕]
```

The section headers are subtle dividers (not collapsible). The `keyPopoutOpen` state is removed. The collapse button collapses the entire panel as before.

### Decision 4 — Selection label with tensions

Computed in the component, not from `getMusicTheoryLabel`:
```typescript
function tensionLabel(baseType, sevenOn, activeTensions) {
  const base = sevenOn ? getMusicTheoryLabel(baseType) : /* triad label */;
  if (activeTensions.size === 0) return base;
  return base + '·' + [...activeTensions].join('·');
}
// e.g., "Minor 7th·9·11" or "Am·b9·#11"
```

The `selectedChordScale.type` stays as `'min7'` etc. — the label is display-only in the component.

### Decision 5 — [Scale] button removed

The companion [Scale] button in the selection bar is removed. Scale selection now happens by clicking mode scale buttons in the Scales section. There is no "switch from arpeggio to scale" flow — you simply select a different thing (chord → from Chords section, scale → from Scales section).

---

## Risks / Trade-offs

- **Dominant #11 / Lydian-dominant overlap**: the #11 tension on a V7 chord is the same note as the Lydian #4. A musician might be confused why #11 is shown as "altered" for dom7 but the Lydian scale has it naturally. Acceptable for now.

- **Panel height**: three always-visible sections may make the panel tall on mobile. Mitigation: sections are compact (single-row grids); mobile view already scrolls. The previous dropdown-inside-dropdown was actually taller when expanded.

- **`type` field mismatch**: storing a `min7` type but with 9, 11 in the notes means `isScaleType()` / `isChordType()` still work, but the position eligibility checks (3NPS, flat) use `chordScale.type` — they'll correctly skip min7 for 3NPS. Position systems show the full notes array regardless of type.

- **Queue items with tensions**: when a tensioned chord is added via [+ Queue], the QueueItem gets the full notes array. On replay, the fretboard will show all tension notes. The type field won't reflect the tensions in the QueueEditor label — TODO for a future label improvement.
