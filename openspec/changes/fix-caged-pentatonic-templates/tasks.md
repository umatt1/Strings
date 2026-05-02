## 1. Add pentatonic CAGED template constant

- [x] 1.1 In `src/utils/positions.ts`, add `CAGED_PENTATONIC_TEMPLATES: CAGEDShapeTemplate[]` after `CAGED_TEMPLATES`
- [x] 1.2 Define E Shape (baseOff=-1): hi E [1,3], B [1,3], G [0,2], D [0,3], A [0,3], loE [1,3]
- [x] 1.3 Define D Shape (baseOff=1): hi E [1,3], B [1,4], G [0,3], D [1,3], A [1,3], loE [1,3]
- [x] 1.4 Define C Shape (baseOff=4): hi E [0,3], B [1,3], G [0,2], D [0,2], A [0,3], loE [0,3]
- [x] 1.5 Define A Shape (baseOff=6): hi E [1,3], B [1,3], G [0,3], D [0,3], A [1,3], loE [1,3]
- [x] 1.6 Define G Shape (baseOff=9): hi E [0,3], B [0,3], G [0,2], D [0,2], A [0,2], loE [0,3]
- [x] 1.7 Add a comment documenting the derivation source (verified from C major pentatonic reference image, checked for G and A major)

## 2. Route pentatonic scales to pentatonic templates

- [x] 2.1 In `calculateCAGED`, before the tiling loop, select the template set: `const templates = scaleNotes.length === 5 ? CAGED_PENTATONIC_TEMPLATES : CAGED_TEMPLATES`
- [x] 2.2 Replace the `for (const tmpl of CAGED_TEMPLATES)` loop reference with `for (const tmpl of templates)`
- [x] 2.3 Run `npx tsc --noEmit` to confirm no type errors

## 3. Add pentatonic CAGED tests

- [x] 3.1 In `positions.test.ts`, add C major pentatonic test data constant (5 notes: C, D, E, G, A)
- [x] 3.2 Add test: C major pentatonic A Shape near nut contains G(3) and A(5) on low E and high E strings
- [x] 3.3 Add test: C major pentatonic E Shape contains C(8) and D(10) on high E string
- [x] 3.4 Add test: C major pentatonic D Shape contains E(9) and G(12) on G string (not F at fret 10)
- [x] 3.5 Add test: for each C major pentatonic shape instance, every 6 strings has exactly 2 highlighted notes
- [x] 3.6 Add test: C major (7-note Ionian) CAGED shapes still match existing verified data (regression guard)

## 4. Run tests and verify

- [x] 4.1 Run `npx vitest run --reporter=verbose` and confirm all tests pass (0 failures)
- [ ] 4.2 Start dev server (`npm run dev`), select C Major Pentatonic, enable CAGED
- [ ] 4.3 Navigate shapes and verify A Shape near fret 2 shows 2 notes per string including A(5) on high E
- [ ] 4.4 Verify E Shape near fret 7 shows C(8) and D(10) on high E
- [ ] 4.5 Verify D Shape near fret 9 shows E(9) and G(12) on G string
- [ ] 4.6 Verify G Major Pentatonic also produces correct 2-notes-per-string patterns
