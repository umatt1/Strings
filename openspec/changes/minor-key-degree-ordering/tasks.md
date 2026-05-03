# Tasks

---

## 1. Fix `getModesForKey` for minor key

- [x] 1.1 In `musicTheory.ts`, after computing the 7-element `modes` array in `getModesForKey`, add: if `keyType === 'minor'`, rotate by `[...modes.slice(5), ...modes.slice(0, 5)]` and re-map each element to `{ ...m, degree: i + 1 }`.
- [x] 1.2 Verify by inspection: `getModesForKey('G', 'minor')` returns `[{degree:1, modeRoot:'G', scaleType:'aeolian'}, {degree:2, modeRoot:'A', scaleType:'locrian'}, {degree:3, modeRoot:'A#', scaleType:'ionian'}, ...]`.

---

## 2. Fix `getDiatonicChords` for minor key

- [x] 2.1 In `musicTheory.ts`, after computing the 7-element `chords` array in `getDiatonicChords`, add: if `keyType === 'minor'`, rotate by `[...chords.slice(5), ...chords.slice(0, 5)]` and re-map each element to `{ ...c, degree: i + 1 }`.
- [x] 2.2 Verify: `getDiatonicChords('G', 'minor')` returns `[{degree:1, root:'G', chordType:'min7'}, {degree:2, root:'A', chordType:'half-dim7'}, {degree:3, root:'A#', chordType:'maj7'}, ...]`.

---

## 3. Remove subheader from UI

- [x] 3.1 In `MusicTheoryControls.tsx`, remove the `{keyType === 'minor' && <span className="popout-subheader">...</span>}` fragment from the panel header area. The header should just show `{displayNote(keyRoot)} {keyType === 'major' ? 'Major' : 'Minor'}`.
- [x] 3.2 Verify `getDiatonicPentatonics('G', 'minor')` now correctly returns pentatonics starting from G (minor pent at degree i, etc.) — no code change needed, it inherits the fix automatically.

---

## 4. Manual verification

- [ ] 4.1 Select root = G, click [Minor]. Degree row shows: `i·G  ii°·A  III·Bb  iv·C  v·D  VI·Eb  VII·F` (with correct casing).
- [ ] 4.2 Chord row shows: `Gm7  Am7b5  Bbmaj7  Cm7  Dm7  Ebmaj7  F7`.
- [ ] 4.3 Pentatonic row shows: `Gm♦  Am♦  Bb♦  Cm♦  Dm♦  Eb♦  F♦` (minor pent for min7 degrees, major pent for maj7/dom7).
- [ ] 4.4 Click `ii°·A` → Am7b5 selected on fretboard.
- [ ] 4.5 Header reads "G Minor" with no relative-major reference.
- [ ] 4.6 Select root = A, click [Minor]. Degree row shows: `i·A  ii°·B  III·C  iv·D  v·E  VI·F  VII·G`.
