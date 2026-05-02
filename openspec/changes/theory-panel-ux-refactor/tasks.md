# Tasks

---

## 1. Music theory data additions

- [x] 1.1 Add `'add6'` to `ChordType` union in `musicTheory.ts`. Intervals: `[0, 4, 7, 9]`.
- [x] 1.2 Add `'add11'` to `ChordType` union in `musicTheory.ts`. Intervals: `[0, 4, 5, 7, 10]`.
- [x] 1.3 Add display labels for `'add6'` and `'add11'` to `CHORD_LABELS`.
- [x] 1.4 Add `degreeLabel(degree, chordType): string` helper in `musicTheory.ts` — returns correct Roman numeral casing (uppercase maj/dom, lowercase min, lowercase + ° for half/full dim).
- [x] 1.5 Verify: `degreeLabel(1, 'maj7')` = `'I'`, `degreeLabel(2, 'min7')` = `'ii'`, `degreeLabel(7, 'half-dim7')` = `'vii°'`.

---

## 2. MusicTheoryControls restructure

- [x] 2.1 Remove the "All Chords" collapsible dropdown from the primary view. The `showChordDropdown` state and associated JSX can be deleted.
- [x] 2.2 Add `activeDegree: number | null` and `activeExtension: 'triad' | 'add6' | '7th' | 'add9' | 'add11'` as local state (default: `null`, `'7th'`).
- [x] 2.3 Rewrite the mode grid to use `degreeLabel()` for Roman numeral labels. Each button click: set `activeDegree = degree`, `activeExtension = '7th'`, then call `selectDegreeWithExtension(degree, '7th')`.
- [x] 2.4 Implement `selectDegreeWithExtension(degree, extension)` — picks the correct chord type for the degree + extension combo, sets `selectedChordScale` to the chord (not scale), sets `displayMode = 'arpeggios'`, updates `onChordScaleChange`.
- [x] 2.5 Implement the chord extension row (visible only when `activeDegree !== null`): buttons `[triad] [6] [7] [9] [11]`, each calls `selectDegreeWithExtension(activeDegree, extension)` and sets `activeExtension`.
- [x] 2.6 Add `[Show Scale]` button in the selection bar (visible when `activeDegree !== null`). Clicking it sets `selectedChordScale` to the mode scale and `displayMode = 'scales'`.
- [x] 2.7 Remove the nested "Pick scale type" dropdown from inside the Key pop-out.
- [x] 2.8 Add "Other" section below the Key pop-out: a compact grid of non-diatonic chord/scale types. Clicking uses `keyRoot` (not degree root); clears `activeDegree`.
- [x] 2.9 Add a `// TODO: future "common substitutions" panel (tritone sub, bIII, bVII) — see separate proposal` comment above the Other section.
- [x] 2.10 Ensure `handleKeyRootChange` still works: changing root updates selected scale/chord to new root.

---

## 3. Queue shortcut

- [x] 3.1 Add `onAddCurrentToQueue?: () => void` prop to `MusicTheoryControls` (simpler callback; App.tsx creates the QueueItem).
- [x] 3.2 Add `[+ Queue]` button to the current selection bar (visible when `selectedChordScale` is defined and `onAddCurrentToQueue` is provided).
- [x] 3.3 In `App.tsx`, implement `handleAddCurrentToQueue()` — captures current selectedChordScale + positionSystem + positionIndex + displayMode and appends a QueueItem to `queue`.
- [x] 3.4 Pass `onAddCurrentToQueue={handleAddCurrentToQueue}` to `MusicTheoryControls`. Also added `onDisplayModeChange` prop so degree/scale selection can set display mode.
- [x] 3.5 Practice mode activation only auto-loads default preset when `queue.length === 0` — verified correct.

---

## 4. CSS updates

- [x] 4.1 Remove styles for `.dropdown-toggle`, `.dropdown-content`, `.chord-category`, `.category-label`, `.category-items` from `MusicTheoryControls.css` (these were for the removed All Chords dropdown).
- [x] 4.2 Add styles for `.extension-row`, `.extension-btn`, `.extension-btn.active`.
- [x] 4.3 Add styles for `.show-scale-btn` (appears in selection bar next to selection text).
- [x] 4.4 Add styles for `.other-section`, `.other-section-label`, `.other-grid`, `.other-btn`.
- [x] 4.5 Add styles for `.add-to-queue-btn-sm` (the `[+ Queue]` button in selection bar).

---

## 5. Manual verification

- [ ] 5.1 G major: click `ii·A` → fretboard shows Am7 arpeggio; root updates to A; extension row shows [7 ●].
- [ ] 5.2 With Am7 active: click [Show Scale] → fretboard shows A Dorian scale.
- [ ] 5.3 With Am7 active: click [9] → fretboard shows Am9 (add9) arpeggio.
- [ ] 5.4 Click different degree → extension resets to [7].
- [ ] 5.5 Mode row in G major shows: `I·G  ii·A  iii·B  IV·C  V·D  vi·E  vii°·F#`.
- [ ] 5.6 Other section: root = C, click [pent-maj] → C Major Pentatonic; root selector stays C.
- [ ] 5.7 [+ Queue] button appears when a chord/scale is selected; clicking it adds to queue without entering Practice mode.
- [ ] 5.8 Enter Practice mode with pre-populated queue → existing queue used; no preset overwrite.
