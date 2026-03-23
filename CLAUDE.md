# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5173/Strings/
npm run build     # Type-check + build to dist/
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

There are no tests in this project.

## Architecture

This is a React 19 + TypeScript + Vite single-page app — an interactive guitar/bass fretboard for chord and scale visualization. It deploys to GitHub Pages under the `/Strings/` base path (configured in `vite.config.ts`).

### State management

All state lives in `App.tsx` (no external state library):
- `instrument` — active `InstrumentConfig` (strings and their open-note tunings)
- `selectedChordScale` — the active `ChordScale` (type + rootNote + computed notes array), or `undefined`
- `selectedNotes` — up to 2 user-clicked notes (for interval display)
- `colorTheme` — active `ColorTheme` object
- `enharmonicPreference` — `'auto' | 'sharps' | 'flats'`

### Domain types (`src/types/music.ts`)

The canonical note array `NOTES` uses sharps (`['C', 'C#', 'D', ...]`). All internal calculations index into this array. Enharmonic conversion (flat display) is purely cosmetic at render time via `getDisplayNoteName()`. `getNoteAtFret(openNote, octave, fret)` computes the `Note` (name, octave, frequency) at any fret position. Tuning presets (`GUITAR_TUNINGS`, `BASS_TUNINGS`) are the source of truth for instruments.

### Music theory (`src/utils/musicTheory.ts`)

`CHORD_INTERVALS` and `SCALE_INTERVALS` define all supported voicings as semitone arrays. `getMusicTheoryNotes(rootNote, type)` computes the note names in a chord/scale. `getScaleDegreeInfo()` maps a note to its scale degree (1–7) and whether it's "important" (1st, 3rd, 5th). Scale degree is used to drive note coloring on the fretboard.

### Rendering pipeline

`Fretboard.tsx` → `FretboardNote.tsx`:
- `Fretboard` iterates over each string and fret (0 to `numFrets`), computes the `Note` at each position, determines `isHighlighted` and `scaleDegreeInfo`, and renders `FretboardNote` cells.
- Fretboard uses **infinite scroll**: starts at 24 frets, loads 12 more when scrolled past 80%, up to 500 max.
- CSS custom properties (`--fretboard-bg`, `--grid-bg`, etc.) are injected inline from `colorTheme` to style the fretboard grid. Scale degree colors are passed as props to `FretboardNote`.

### Theming (`src/types/theme.ts`)

`COLOR_THEMES` maps theme names to `ColorTheme` objects. The `scaleColors` sub-object maps scale degrees (root, third, fifth, second, fourth, sixth, seventh) to hex colors. The default theme ("indigo") uses a blue/orange/purple scheme designed for colorblind accessibility.

### Audio (`src/utils/audio.ts`)

Sound is generated via the Web Audio API (no audio files). `PlaybackControls.tsx` handles "play all" and "play ascending scale" features.

### Responsive layout

`App.tsx` renders `Controls` twice — once in `.top-settings` (mobile) and once in `.desktop-settings` (desktop) — and CSS media queries show/hide each. This avoids prop gymnastics while keeping the layout correct on both breakpoints.
