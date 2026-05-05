## Context

The position system currently communicates "you are in this position" by dimming every note that isn't in the active position. This hides musical context (you can't see where you're going) and looks broken when adjacent positions share many notes. The Flat system duplicates the Positions (mode box) algorithm with no visible purpose distinction. The Positions mode also labels boxes counter-intuitively — the tonic box appears at index 6 because boxes are sorted by fret, not by musical priority.

New users have no way of discovering the queue system or the spacebar shortcut, which are the app's most powerful practice tools.

## Goals / Non-Goals

**Goals:**
- Add a fret-span background fill layer that communicates position spatially, alongside existing ghosting
- Show all tiled position instances simultaneously (faint) with the active one highlighted (bright)
- Remove Flat; clean up the PositionSystem union and all UI references
- Fix Positions labeling: tonic-first order, note-name labels, tiling across octaves
- First-visit onboarding modal for the queue system

**Non-Goals:**
- Redesigning the fretboard rendering pipeline (no SVG, no canvas)
- Adding shape-region fills for 3NPS (out of scope for this change)
- Changing how CAGED templates are computed

## Decisions

### D1: Region fills as absolutely-positioned divs, not CSS grid manipulation

The fretboard is a scrollable CSS grid where each column is a fret. A region fill spanning frets 5–8 needs to sit behind the note layer across all 6 strings simultaneously.

**Chosen:** A single absolutely-positioned `<div>` per position instance, placed inside the fretboard grid container. Width and left offset are calculated from the fret cell widths (uniform). Z-index sits below note buttons. Opacity varies: inactive instances at ~15%, active instance at ~40%.

**Rejected alternatives:**
- Per-cell background color: requires re-rendering all cells on position change; breaks the grid visual
- SVG overlay: more complex coordinate mapping, harder to clip to scroll container

The fret cell width is fixed by CSS (`--fret-cell-width`). Left offset = `startFret * cellWidth`. Width = `(endFret - startFret + 1) * cellWidth`. A JavaScript `ResizeObserver` on the fret container keeps these pixel values current.

### D2: Keep ghosting; region fills add spatial context on top

Ghosting (dimming out-of-position notes) is preserved. It communicates "these are the scale notes coming up beyond this position" — showing the player what's ahead on the neck. The region fill adds a complementary layer: "this is the spatial zone your hand is currently in."

The two signals are different and non-redundant:
- Ghosted dots → musical context (scale notes outside the position)
- Region fill → spatial context (fret-span of the active shape)

`isInPosition`, `positionHighlights`, and the `dimmed` CSS class are all unchanged.

### D3: Positions tiling — same approach as CAGED

`calculateModePositions` gains an octave loop (`octave = 0, 1`) matching the CAGED approach. Each box position's `degreeFret` is anchored at `(baseDegree + octave * 12)`, producing instances at frets 0–11 and frets 12–23. A minimum-highlights filter discards near-nut stubs with fewer than 12 notes (2 per string × 6 strings).

### D4: Positions sort order — tonic first, then ascending fret

After computing tiled positions, sort by: (1) tonic position first (the one whose `highlights` include the root note on the lowest string at its first occurrence), (2) remaining positions ascending by `startFret`.

Labeling: `"I — C"`, `"II — D"`, ..., `"VII — B"` using the Roman numeral of the degree and the note name. No mode name suffix. This matches the 3NPS label convention (Roman numerals) while adding the note name for quick orientation.

### D5: Onboarding modal — localStorage flag, shown once

A `OnboardingModal` component renders as a centered overlay on first visit. Detection: `localStorage.getItem('strings-onboarding-seen')`. On dismiss (button click or Escape), sets the flag. Content covers: what the queue is, how to add items, spacebar to advance, and the X button to remove items.

## Risks / Trade-offs

- **Region fill pixel math:** Fret cell widths are uniform for most of the neck but the open-string column (fret 0) has a different visual weight. The fill will cover it correctly but may look slightly misaligned at fret 0 if the open column width differs. Mitigation: verify with open-string positions (3NPS III for G major, etc.).
- **Flat removal:** Any queue items saved in localStorage with `positionSystem: 'flat'` will silently fall back to `'none'`. Acceptable for now — saved queues are ephemeral.

## Open Questions

- Should the region fill color be per-shape (5 different colors for CAGED) or a single neutral color for all position systems? Current lean: single neutral (indigo/blue tint) — avoids a new color system conflicting with scale degree colors.
- Should the active region fill suppress the faint fills of overlapping instances (CAGED shapes can overlap at boundary frets)?
