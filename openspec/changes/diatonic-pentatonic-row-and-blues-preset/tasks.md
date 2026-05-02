# Tasks

---

## 1. Music theory helper

- [x] 1.1 Add `getDiatonicPentatonics(keyRoot: NoteName, keyType: 'major' | 'minor'): { degree: number; root: NoteName; pentatonicType: 'pentatonic-major' | 'pentatonic-minor' }[]` to `musicTheory.ts`. Uses `getDiatonicChords` for chord quality and `getModesForKey` for roots. Maps maj7/dom7 → 'pentatonic-major'; min7/half-dim7/dim7 → 'pentatonic-minor'.

---

## 2. MusicTheoryControls — pentatonic row

- [x] 2.1 Import `getDiatonicPentatonics` in `MusicTheoryControls.tsx`.
- [x] 2.2 Compute `pentData = useMemo(() => getDiatonicPentatonics(keyRoot, keyType), [keyRoot, keyType])`.
- [x] 2.3 Wrap the existing `<div className="scale-grid">` and the new pentatonic row in a `<div className="degree-scale-group">`.
- [x] 2.4 Rename `.scale-grid` → `.scale-row` (both in TSX and CSS) so it's clear it's one row inside the group.
- [x] 2.5 Add the pentatonic row below the scale row:
  ```tsx
  <div className="pent-row">
    {pentData.map(({ degree, root, pentatonicType }) => (
      <button
        key={degree}
        className={`pent-btn ${activeDegree === null && selectedChordScale?.type === pentatonicType && selectedChordScale?.rootNote === root ? 'active' : ''}`}
        onClick={() => handleOtherSelect(pentatonicType, root)}  // see 2.6
        title={`${displayNote(root)} ${pentatonicType === 'pentatonic-major' ? 'Major' : 'Minor'} Pentatonic`}
      >
        {displayNote(root)}♦
      </button>
    ))}
  </div>
  ```
- [x] 2.6 Update `handleOtherSelect` to accept an optional `root` parameter (default `keyRoot`). When `root` is provided, use it instead of `keyRoot`. This allows pentatonic buttons to use the degree root rather than the key root.

---

## 3. CSS

- [x] 3.1 Add `.degree-scale-group` — just `display: flex; flex-direction: column; gap: 3px`.
- [x] 3.2 Rename `.scale-grid` → `.scale-row` (keep same styles: `display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px`).
- [x] 3.3 Add `.pent-row` — identical grid layout to `.scale-row`.
- [x] 3.4 Add `.pent-btn` style: slightly smaller text than `.mode-btn`, amber/gold color scheme (background: #fff8e1, border: #ffe082, color: #e65100 on active: background: #e65100, color: white). Min-width: 0, overflow: hidden, white-space: nowrap.

---

## 4. Blues preset

- [x] 4.1 In `src/data/presets.ts`, add a `bluesItem(root, posIdx, id)` helper that creates a QueueItem with `pentatonic-major` scale type, `positionSystem: 'caged'`, `displayMode: 'scales'`.
- [x] 4.2 Define `G_BLUES: QueueItem[]` = I-IV-I-V-IV-I in G: `['G','C','G','D','C','G']`, each using `bluesItem`.
- [x] 4.3 Add `{ id: 'g-blues', name: 'G Blues (I–IV–I–V–IV–I)', items: G_BLUES }` to `PRESETS`.

---

## 5. Manual verification

- [ ] 5.1 Key = C Major → Scales section shows two rows: mode row on top, pentatonic row below, each with 7 buttons aligned in the same columns.
- [ ] 5.2 Pentatonic labels: `C♦ Dm♦ Em♦ F♦ G♦ Am♦ Bm♦` for C major.
- [ ] 5.3 Click `Am♦` → selectedChordScale = A minor pentatonic (A, C, D, E, G); fretboard shows these notes.
- [ ] 5.4 In G major: clicking `V·D` degree shows D7 arpeggio; clicking `G♦` below the I mode shows G major pent; clicking `D♦` below the V mode shows D major pent.
- [ ] 5.5 G Blues preset loads 6 items: G/C/G/D/C/G major pentatonics in CAGED positions.
