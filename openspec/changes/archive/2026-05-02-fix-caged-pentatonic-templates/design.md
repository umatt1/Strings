## Context

The existing `calculateCAGED` function uses a single set of 5 shape templates (`CAGED_TEMPLATES`) with `stringIntervals` derived from verified full major-scale positions. When a pentatonic scale is selected, the function filters the highlighted frets to only those in `scaleNotes`. This produces mostly correct results but misses notes at the edges of some shapes:

- **A Shape** (baseFret=1 for C major): High E intervals `[0,2]` → frets 1(F) and 3(G). F is filtered out, leaving only G(3). But pentatonic requires G(3) **and** A(5) — A is at interval 4, which is not in the template.
- **E Shape** (baseFret=7): High E intervals `[0,1]` → frets 7(B) and 8(C). B filtered, only C(8) shown. Pentatonic requires C(8) **and** D(10) — D is at interval 3, absent from template.
- **D Shape** (baseFret=10): G string intervals `[0,2]` → frets 10(F) and 12(G). F is filtered, only G(12) shown. Pentatonic requires E(9) **and** G(12) — E at interval -1 from baseFret=10 is unreachable without changing baseFret.

The D Shape issue is structural: no interval extension can reach E(9) when baseFret=10. A different baseFret (9, baseOff=1 instead of 2) is required for the pentatonic D Shape.

## Goals / Non-Goals

**Goals:**
- 5-note pentatonic scales produce correct 2-notes-per-string CAGED patterns
- Patterns verified against reference materials for C major (image provided by user), spot-checked for G and A major
- Full 7-note scale patterns remain unchanged

**Non-Goals:**
- Blues scales (6-note) or other non-7, non-5 note scales — no change to CAGED behavior for these
- Changing the UI or pattern navigation order

## Decisions

### Decision 1: Separate pentatonic template set, not extended full-scale templates

**Chosen**: Add a `CAGED_PENTATONIC_TEMPLATES` constant with 5 shapes, each using 2 interval offsets per string. Route to this set when `scaleNotes.length === 5`.

**Why not extend the full-scale templates**: Adding interval 4 to A Shape high E and interval 3 to E Shape high E would add valid full-scale notes (A and D respectively are in all major scales), so those extensions could technically apply to both sets. However, the D Shape requires a different `baseOff` (1 vs 2), which changes the full-scale shape boundaries significantly. Keeping separate template sets avoids any risk of regressing the full-scale CAGED patterns, which already pass verified tests.

### Decision 2: Pentatonic template derivation methodology

All 5 pentatonic shape intervals were derived from the C major reference image and verified algebraically for G major (rootFret=3) and A major (rootFret=5):

| Shape | baseOff (pent) | baseOff (full) | Change? |
|-------|---------------|----------------|---------|
| E     | -1            | -1             | No      |
| D     | 1             | 2              | Yes     |
| C     | 4             | 4              | No      |
| A     | 6             | 5              | Yes     |
| G     | 9             | 9              | No      |

**Verified pentatonic interval tables** (string index 0 = high E, 5 = low E):

```
E Shape (baseOff=-1):
  [0] hi E: [1,3]  [1] B: [1,3]  [2] G: [0,2]  [3] D: [0,3]  [4] A: [0,3]  [5] loE: [1,3]

D Shape (baseOff=1):
  [0] hi E: [1,3]  [1] B: [1,4]  [2] G: [0,3]  [3] D: [1,3]  [4] A: [1,3]  [5] loE: [1,3]

C Shape (baseOff=4):
  [0] hi E: [0,3]  [1] B: [1,3]  [2] G: [0,2]  [3] D: [0,2]  [4] A: [0,3]  [5] loE: [0,3]

A Shape (baseOff=6):
  [0] hi E: [1,3]  [1] B: [1,3]  [2] G: [0,3]  [3] D: [0,3]  [4] A: [1,3]  [5] loE: [1,3]

G Shape (baseOff=9):
  [0] hi E: [0,3]  [1] B: [0,3]  [2] G: [0,2]  [3] D: [0,2]  [4] A: [0,2]  [5] loE: [0,3]
```

**Sample verification — C major pentatonic (C,D,E,G,A), rootFret=8:**
- E Shape baseFret=7: hi E → 8(C)✓, 10(D)✓ | B → 8(G)✓, 10(A)✓ | G → 7(D)✓, 9(E)✓ | D → 7(A)✓, 10(C)✓ | A → 7(E)✓, 10(G)✓ | loE → 8(C)✓, 10(D)✓
- A Shape baseFret=2: hi E → 3(G)✓, 5(A)✓ | B → 3(D)✓, 5(E)✓ | G → 2(A)✓, 5(C)✓ | D → 2(E)✓, 5(G)✓ | A → 3(C)✓, 5(D)✓ | loE → 3(G)✓, 5(A)✓

### Decision 3: Detection condition is `scaleNotes.length === 5`

Rather than checking scale type strings (which would need updating for every pentatonic variant), checking note count is simpler and correctly routes all 5-note scales. If a non-pentatonic 5-note scale ever existed, it would also use pentatonic templates — acceptable given no such scale types are currently defined.

## Risks / Trade-offs

- **Separate template maintenance burden** → Two template sets must be kept consistent. Low risk: pentatonic templates are stable reference data, not derived algorithmically.
- **D Shape baseOff change (1 vs 2)** → The pentatonic D Shape positions at a 1-fret-lower baseFret than the full-scale D Shape. For C major: full scale D starts at fret 10, pentatonic D starts at fret 9. This matches the reference image (G string shows E at fret 9) and is intentional.
- **Minor scale pentatonic (5-note)** → A minor pentatonic would also route to pentatonic templates. The same 5 shapes apply; the templates are key-agnostic. Acceptable.
