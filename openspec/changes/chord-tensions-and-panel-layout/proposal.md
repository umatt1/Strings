## Why

Two connected problems: (1) the chord extension row treats tensions as mutually exclusive picks ("choose one: triad, 6, 7, 9, or 11"), but jazz harmony requires stacking them — a Cmaj13 has the 7th AND 9th AND 11th AND 13th simultaneously. (2) the music theory panel hides scales behind an "Other" section and a now-deprecated collapsed "Key ▸" toggle, making it awkward to select or queue pentatonics and other scales. A musician should see chords and scales on equal footing in a clean, always-visible layout.

## What Changes

- **Replace extension "pick" with additive tension toggles**: a row of toggle buttons (7 · 9 · 11 · 13, plus common alterations b9 #9 #11 b13 for dominant chords) that can be simultaneously active. The base chord (determined by degree quality: maj7/min7/dom7/half-dim7) provides the 1-3-5-7 foundation; each tension button adds the corresponding note to `ChordScale.notes`. Tensions are computed from the mode scale of the selected degree (natural tensions), or from the chromatic scale (altered tensions).
- **Remove the [Scale] companion button** from the selection bar — it was a symptom of the wrong approach.
- **Restructure the panel into three always-visible sections** (no "Key ▸" toggle):
  1. **Chords** — diatonic degree buttons (with Roman numeral casing) + chord buttons + tension row
  2. **Scales** — diatonic mode scale buttons + common non-diatonic scales (pentatonic, blues, harmonic minor, melodic minor) as a flat grid
  3. **Other** — remaining non-diatonic chord types only (aug, dim7, mM7, sus2, sus4, etc.)
- The "Key ▸" button is removed; the Chords + Scales sections are always shown when the panel is expanded.
- The top-level [Major]/[Minor] toggle + root dropdown remain as the key selector.

## Capabilities

### Modified Capabilities
- `chord-extensions`: tension model changes from mutually-exclusive pick to additive multi-toggle; altered tensions added for dominant chords
- `ui`: panel layout restructured — three sections (Chords, Scales, Other) always visible; Key pop-out removed; Scale button removed from selection bar

## Impact

- `src/components/MusicTheoryControls.tsx` — layout restructure + tension toggle logic
- `src/components/MusicTheoryControls.css` — style updates for tension toggles + section layout
- `src/utils/musicTheory.ts` — `getTensionNotes(degree, baseDegreeMode, activeTensions)` helper to compute tension notes from mode context
