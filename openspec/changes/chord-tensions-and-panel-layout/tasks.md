# Tasks

---

## 1. Tension computation helper

- [ ] 1.1 Add `getModeTensionNotes(degreeRoot: NoteName, modeScale: NoteName[], tensions: Set<Tension>): NoteName[]` in `musicTheory.ts`. Maps each active tension string ('9', 'b9', '#9', '11', '#11', '13', 'b13') to the correct note from the mode scale (or chromatic offset for altered tensions). Returns deduplicated note names.
- [ ] 1.2 Add `buildTensionedChord(degreeRoot, baseChordType, sevenOn, tensions, modeScale): ChordScale` — returns a ChordScale with `type = baseChordType` and `notes = triad/7th notes + tension notes`. This is called on every tension toggle.
- [ ] 1.3 Add `tensionLabel(baseType: ChordType, sevenOn: boolean, tensions: Set<Tension>): string` — returns the display label like "Minor 7th·9·11" or "Major·b9·#11".

---

## 2. MusicTheoryControls restructure

- [ ] 2.1 Remove `keyPopoutOpen` state and the "Key ▸" toggle button entirely.
- [ ] 2.2 Add `type Tension = '9' | 'b9' | '#9' | '11' | '#11' | '13' | 'b13'` locally (or export from musicTheory.ts).
- [ ] 2.3 Add `activeTensions: Set<Tension>` and `sevenOn: boolean` as local state (defaults: empty set, true).
- [ ] 2.4 Implement `toggleTension(t: Tension)` — adds or removes from `activeTensions`, then calls `buildTensionedChord` and `onChordScaleChange`. Does NOT reset other tensions.
- [ ] 2.5 Implement `toggleSeven()` — flips `sevenOn`, then calls `buildTensionedChord` and `onChordScaleChange`.
- [ ] 2.6 Update `selectDegreeWithExtension` → rename to `selectDegree(degree)`. On call: reset `activeTensions = new Set()`, set `sevenOn = true`, set `activeDegree = degree`, then call `buildTensionedChord` and `onChordScaleChange` with `displayMode = 'arpeggios'`.
- [ ] 2.7 Remove `activeExtension` state and the old extension type enum (triad/add6/7th/add9/add11). The new system replaces it.
- [ ] 2.8 Remove the [Scale] companion button from the selection bar JSX.
- [ ] 2.9 Render the **natural tension row** (`[7] [9] [11] [13]`) below the chord grid, visible only when `activeDegree !== null`.
- [ ] 2.10 Render the **altered tension row** (`[b9] [#9] [#11] [b13]`) below the natural row, visible only when `activeDegree !== null` AND the active degree's chord type is `'dom7'`.
- [ ] 2.11 Update selection bar label to use `tensionLabel()` instead of `getMusicTheoryLabel()`.
- [ ] 2.12 Restructure JSX into three labeled sections: **Chords** (degree buttons + chord buttons + tension rows + add-all), **Scales** (mode scale buttons + non-diatonic scale grid + add-all), **Other Chords** (compact grid: aug, dim7, half-dim7, mM7, sus2, sus4).
- [ ] 2.13 In the Scales section, add 7 mode scale buttons (clicking selects the scale, clears `activeDegree`, sets `displayMode = 'scales'`). Use same degree labels for the root but clear tensions on click.
- [ ] 2.14 In the Scales section, add a compact non-diatonic scale grid: pentatonic-major, pentatonic-minor, blues-major, blues-minor, harmonic-minor, melodic-minor. These use `keyRoot` (not degree root) and clear `activeDegree`.
- [ ] 2.15 Move [+ All modes to queue] button to the Scales section; keep [+ All 7ths to queue] in the Chords section.

---

## 3. CSS updates

- [ ] 3.1 Remove `.key-popout`, `.key-popout-toggle`, `.popout-header`, `.popout-subheader` styles (the pop-out is gone).
- [ ] 3.2 Add `.theory-section` divider/label styles for the three sections (Chords, Scales, Other).
- [ ] 3.3 Update `.extension-row` → now used for the natural tension row; add `.altered-row` for altered tensions.
- [ ] 3.4 Add `.scale-grid` for the diatonic mode scale buttons (7 buttons, same style as mode-grid but selecting scales).
- [ ] 3.5 Update `.other-grid` to show only chord types (fewer items, may use 3 columns instead of 4).

---

## 4. Remove legacy code

- [ ] 4.1 Remove `add6` and `add11` chord types from `musicTheory.ts` (they were added in the previous change and are superseded by the tension system). Remove their intervals from `CHORD_INTERVALS` and labels from `CHORD_LABELS`. Remove from `ChordType` union.
- [ ] 4.2 Remove `degreeLabel` export from `musicTheory.ts` if it's only used in the component — inline it or keep it (judgment call; keep if cleaner).

---

## 5. Manual verification

- [ ] 5.1 Select G major → click `ii·A` → selection shows "Am7", fretboard shows Am7 arpeggio. Tension row shows [7●] [9] [11] [13].
- [ ] 5.2 Click [9] → selection shows "Am7·9", fretboard adds B. [7●] and [9●] both highlighted.
- [ ] 5.3 Click [11] → selection shows "Am7·9·11", fretboard adds D. Three tensions active.
- [ ] 5.4 Click [9] again → removes B. Selection shows "Am7·11". Demonstrates toggle-off.
- [ ] 5.5 Click [7] → toggles 7th off. Shows Am triad + 11th (A, C, E, D). Selection shows "Am·11".
- [ ] 5.6 Click `V·D` (dom7) → tension row shows [7] [9] [11] [13] AND altered row [b9] [#9] [#11] [b13].
- [ ] 5.7 Click `I·G` (maj7) → NO altered row shown.
- [ ] 5.8 Panel shows all three sections (Chords, Scales, Other Chords) without any toggle click.
- [ ] 5.9 Scales section: click [pent-maj] with root G → G Major Pentatonic selected; tension row hidden.
- [ ] 5.10 [+ Queue] button still works; adds tensioned chord to queue correctly.
