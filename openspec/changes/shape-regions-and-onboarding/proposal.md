## Why

The position system (CAGED, 3NPS, Flat, Positions) is confusing and buggy: the ghosting approach hides musically useful context, Flat and Positions are near-identical algorithms with opaque labels, and the Positions mode labels positions by fret-sort order rather than musical logic. New users also have no guidance on the queue system, which is the app's core differentiator.

## What Changes

- **Remove** the Flat position system entirely (redundant with Positions, different labeling, no clear purpose distinction)
- **Shape region fills**: replace the current ghost/dim approach with colored fret-span background highlights; all tiled instances shown faintly, active instance bright — keeping all note dots visible at all times
- **Fix Positions labeling**: sort positions starting from the tonic (not lowest fret), label by starting note name + Roman numeral (e.g. "I — C") rather than "Position 6 (Ionian)"
- **Tile Positions**: box positions repeat every 12 frets like CAGED; show all instances
- **Onboarding popup**: first-visit modal explaining the queue system, spacebar to advance, and adding items to the queue

## Capabilities

### New Capabilities

- `shape-region-display`: Fret-span background region fills for position visualization — all instances faintly visible, active instance highlighted; replaces ghosting/dimming
- `onboarding-modal`: First-visit modal explaining the queue system and key shortcuts

### Modified Capabilities

- `positions`: Remove Flat; fix Positions (Mode) labeling and tiling behavior
- `ui`: Remove Flat button from position system selector; add onboarding modal trigger

## Impact

- `src/utils/positions.ts` — remove `calculateFlatPositions`, `isFlatEligible`; fix `calculateModePositions` labeling and add tiling
- `src/components/Fretboard.tsx` — add region fill rendering layer
- `src/components/FretboardNote.tsx` — remove ghosting/dimming logic
- `src/components/PositionControls.tsx` — remove Flat button
- `src/App.tsx` — remove Flat-related state guards; add onboarding modal state
- New component: `src/components/OnboardingModal.tsx`
- `src/types/positions.ts` (or inline) — remove `'flat'` from `PositionSystem` union
