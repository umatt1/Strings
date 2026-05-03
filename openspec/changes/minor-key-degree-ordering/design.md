## Context

`getModesForKey` and `getDiatonicChords` compute from the relative major root (`keyRoot + 3 semitones`), then return degrees in I–VII order of that relative major. For `keyType === 'minor'` they need to rotate the result by 5 positions (degrees VI–VII then I–V), reassigning degrees 1–7 starting from the minor tonic.

The rotation offset is 5 (0-based index of Aeolian = degree VI−1). After rotation, `degree` values are reassigned 1–7 from the minor tonic.

`degreeLabel(degree, chordType)` already applies correct casing: half-dim7→lowercase+°, min7→lowercase, maj7/dom7→uppercase. No change needed there.

`getDiatonicPentatonics` calls `getDiatonicChords` + `getModesForKey` internally — it corrects automatically.

## Goals / Non-Goals

**Goals:**
- Minor key panel starts with the minor tonic at degree i (position 1)
- Correct degree ordering: i, ii°, III, iv, v, VI, VII for natural minor
- Correct enharmonics: Bb shown as Bb (not A#), Eb shown as Eb — already handled by existing `useFlats` logic
- Remove "(from Bb Major)" subheader

**Non-Goals:**
- Changing 3NPS/flat position labels (those use the scale type's internal `labelOffset`, separate concern)
- Harmonic or melodic minor chord degrees

---

## Decisions

### Decision 1 — Rotate by slicing at index 5

```typescript
// Before rotation (relative major order for G minor):
// idx: [0=Bbmaj7, 1=Cm7, 2=Dm7, 3=Ebmaj7, 4=F7, 5=Gm7, 6=Am7b5]

// After rotation (minor-tonic order):
// idx: [5=Gm7, 6=Am7b5, 0=Bbmaj7, 1=Cm7, 2=Dm7, 3=Ebmaj7, 4=F7]

function rotateForMinor<T>(arr: T[]): T[] {
  return [...arr.slice(5), ...arr.slice(0, 5)];
}
```

Applied inside both `getModesForKey` and `getDiatonicChords` when `keyType === 'minor'`, followed by re-mapping `degree` to `i + 1`.

### Decision 2 — Verification: G minor chord degrees

| Degree | Root | Type | Label |
|--------|------|------|-------|
| i | G | min7 | i·G |
| ii° | A | half-dim7 | ii°·A |
| III | Bb (A#) | maj7 | III·Bb |
| iv | C | min7 | iv·C |
| v | D | min7 | v·D |
| VI | Eb (D#) | maj7 | VI·Eb |
| VII | F | dom7 | VII·F |

All match natural minor theory. Enharmonics (A#→Bb, D#→Eb) handled by the existing `useFlats` display logic since G minor's relative major (Bb) is a flat key.

### Decision 3 — No change to handleKeyTypeChange

`handleKeyTypeChange('minor')` sets `type = 'aeolian'` on keyRoot. After the fix, degree i of the minor key is the Aeolian mode at keyRoot — consistent. No change needed.

## Risks / Trade-offs

- **Tests**: `positions.test.ts` has a test for A Aeolian flat positions checking for label "VI" on the tonic position. That test uses the position system, not the UI grid, so it's unaffected. The musicTheory helpers aren't directly tested.
- **Minor scope**: This only affects the UI panel ordering. The underlying scale data (G Aeolian notes) does not change — only what order the 7 degree buttons appear in.
