## 1. Remove Flat Position System

- [x] 1.1 Remove `'flat'` from the `PositionSystem` union type in `src/utils/positions.ts`
- [x] 1.2 Delete `calculateFlatPositions` function and `isFlatEligible` export from `positions.ts`
- [x] 1.3 Remove the Flat case from the `calculatePositions` switch statement
- [x] 1.4 Remove `isFlatEligible` import and all references from `App.tsx`
- [x] 1.5 Remove the Flat button from `PositionControls.tsx` SYSTEM_OPTIONS array
- [x] 1.6 Remove `isFlatEligible` prop from `PositionControls` interface and all call sites
- [x] 1.7 Delete Flat-related tests from `positions.test.ts`

## 2. Fix Positions (Mode Box) Labeling and Tiling

- [x] 2.1 Update `calculateModePositions` to tile across two octaves (loop `octave = 0, 1`, offset `degreeFret + octave * 12`)
- [x] 2.2 Add minimum-highlights filter: discard any position instance with fewer than 12 notes (matching CAGED behavior)
- [x] 2.3 Change sort order: tonic position (degree index 0) first, then remaining positions ascending by `startFret`
- [x] 2.4 Update labels to `"<Roman numeral> — <note name>"` format (e.g. `"I — C"`, `"V — G"`), removing mode name suffixes
- [x] 2.5 Update `REQ-POS-04` scenario in `openspec/specs/positions/spec.md` to reflect new label format (already done in change spec; archive will merge)
- [x] 2.6 Update or add tests in `positions.test.ts` covering: tiling, tonic-first order, new label format, stub discarding

## 3. Add Region Fill Layer to Fretboard

- [x] 3.1 Add a `--fret-cell-width` CSS custom property (or read it from the DOM) that `Fretboard.tsx` can use for pixel calculations
- [x] 3.2 Add a `RegionFill` component (or inline div) that renders a single absolutely-positioned band given `startFret`, `endFret`, `isActive`, and `fretCellWidth`
- [x] 3.3 In `Fretboard.tsx`, render one `RegionFill` per position instance in `positions` array, passing `isActive={i === positionIndex}`
- [x] 3.4 Apply CSS: inactive fills at ~15% opacity (subtle tint), active fill at ~40% opacity (clear highlight)
- [x] 3.5 Pass the full `positions` array (not just the current position's highlights) down to `Fretboard` from `App.tsx`
- [x] 3.6 Ensure the fill layer has a lower z-index than note buttons so dots remain clickable
- [x] 3.7 Verify region fills work correctly for open-string positions (startFret=0) and high-neck positions

## 4. Onboarding Modal

- [x] 4.1 Create `src/components/OnboardingModal.tsx` with modal overlay, content, and "Got it" dismiss button
- [x] 4.2 Write modal content: what the queue is, how to add items from the left panel, spacebar to advance, × to remove
- [x] 4.3 Add Escape key listener in the modal that triggers dismiss
- [x] 4.4 On dismiss, call `localStorage.setItem('strings-onboarding-seen', 'true')`
- [x] 4.5 In `App.tsx`, initialise `showOnboarding` state as `!localStorage.getItem('strings-onboarding-seen')`
- [x] 4.6 Render `<OnboardingModal>` in `App.tsx` when `showOnboarding` is true
- [x] 4.7 Add a "Show intro" button/link in the Settings section that sets `showOnboarding = true` regardless of localStorage
- [x] 4.8 Add `OnboardingModal.css` with centered overlay, backdrop, and responsive sizing

## 5. Polish and Verification

- [x] 5.1 Verify CAGED region fills for C, G, and A major match the expected fret ranges from `positions.test.ts`
- [x] 5.2 Verify Positions tiling: C Ionian shows I–VII at frets 0–11 and again at 12–23
- [x] 5.3 Verify position label format in the UI: `"I — C (1/14)"` style
- [x] 5.4 Verify onboarding modal does not appear on second load
- [x] 5.5 Verify "Show intro" link re-opens the modal from settings
- [x] 5.6 Run `npm run build` to confirm no TypeScript errors after Flat removal
