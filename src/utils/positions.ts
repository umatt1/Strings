import type { InstrumentConfig, NoteName } from '../types/music';
import { NOTES, getNoteAtFret } from '../types/music';
import type { ChordScale } from './musicTheory';
import { getScaleDegreeInfo } from './musicTheory';

export type PositionSystem = 'none' | '3nps' | 'caged' | 'modes';
export type DisplayMode = 'scales' | 'arpeggios' | 'chords';

export interface PositionHighlight {
  stringIndex: number;
  fretNumber: number;
}

export interface Position {
  name: string;
  highlights: PositionHighlight[];
  startFret: number;
  endFret: number;
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const;

// All 7 major-system modes (and natural-minor alias) support 3NPS positions.
const DIATONIC_3NPS_TYPES = new Set([
  'ionian', 'major', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian',
  'natural-minor',
]);

/**
 * Get the absolute semitone value of a string's open note
 */
function getStringSemitone(openNote: NoteName, octave: number): number {
  return octave * 12 + NOTES.indexOf(openNote);
}

/**
 * Main entry point: compute all positions for a given system
 */
export function calculatePositions(
  instrument: InstrumentConfig,
  chordScale: ChordScale,
  system: PositionSystem
): Position[] {
  let positions: Position[];
  switch (system) {
    case '3nps':
      positions = calculate3NPS(instrument, chordScale);
      break;
    case 'caged':
      positions = calculateCAGED(instrument, chordScale);
      break;
    case 'modes':
      positions = calculateModePositions(instrument, chordScale);
      break;
    default:
      return [];
  }

  // Mode positions are already sorted (tonic-first then by degree); all others sort by startFret
  if (system !== 'modes') {
    positions.sort((a, b) => a.startFret - b.startFret);
  }

  return positions;
}

/**
 * 3 Notes Per String positions.
 *
 * Only for major (Ionian) and natural minor (Aeolian) scales.
 * Returns 7 positions, one per scale degree, each labeled with a Roman numeral
 * (I–VII) based on the scale degree the position starts on.
 *
 * For natural minor: the tonic gets label VI (Aeolian = mode 6 of relative major).
 *
 * Starting frets are computed mathematically from the root's position on the
 * lowest string, avoiding the open-string anchoring bug.
 */
function calculate3NPS(
  instrument: InstrumentConfig,
  chordScale: ChordScale
): Position[] {
  if (!DIATONIC_3NPS_TYPES.has(chordScale.type)) return [];

  const scaleNotes = chordScale.notes;
  if (scaleNotes.length < 7) return [];

  const strings = instrument.strings; // index 0 = highest pitch
  const numStrings = strings.length;
  const numDegrees = scaleNotes.length;

  const isNaturalMinor = chordScale.type === 'aeolian' || chordScale.type === 'natural-minor';
  // Natural minor tonic is labeled VI (Aeolian position of relative major)
  const labelOffset = isNaturalMinor ? 5 : 0;

  // Process strings from lowest pitch (last index) to highest (index 0)
  const stringOrder = [...Array(numStrings).keys()].reverse();
  const lowestStrIdx = stringOrder[0];
  const lowestStr = strings[lowestStrIdx];

  // Find root's lowest fret on the lowest string (frets 0–11)
  const rootNote = chordScale.rootNote;
  let rootFret = 0;
  for (let f = 0; f <= 11; f++) {
    if (getNoteAtFret(lowestStr.openNote, lowestStr.octave, f).name === rootNote) {
      rootFret = f;
      break;
    }
  }

  const rootNoteIdx = NOTES.indexOf(rootNote);

  const positions: Position[] = [];

  for (let posIdx = 0; posIdx < numDegrees; posIdx++) {
    const degreeNote = scaleNotes[posIdx];
    const degreeNoteIdx = NOTES.indexOf(degreeNote);
    const semitoneOffset = (degreeNoteIdx - rootNoteIdx + 12) % 12;

    // Map each degree to its lowest occurrence on the neck (frets 0–11).
    // % 12 ensures VII (offset=11) lands at rootFret-1 (just below root)
    // while all other positions land at their lowest possible fret.
    const startFret = (rootFret + semitoneOffset) % 12;

    const highlights: PositionHighlight[] = [];
    let degIdx = posIdx;
    let refFret = startFret;
    let minFret = startFret;
    let maxFret = startFret;

    for (let ordinal = 0; ordinal < stringOrder.length; ordinal++) {
      const strIdx = stringOrder[ordinal];
      const strConfig = strings[strIdx];
      const notesFoundOnString: number[] = [];

      for (let noteCount = 0; noteCount < 3; noteCount++) {
        const targetNote = scaleNotes[degIdx % numDegrees];

        // Search for this note near refFret
        let found = -1;
        for (let f = Math.max(0, refFret - 1); f <= refFret + 6; f++) {
          if (getNoteAtFret(strConfig.openNote, strConfig.octave, f).name === targetNote) {
            found = f;
            break;
          }
        }

        if (found !== -1) {
          highlights.push({ stringIndex: strIdx, fretNumber: found });
          notesFoundOnString.push(found);
          refFret = found;
          minFret = Math.min(minFret, found);
          maxFret = Math.max(maxFret, found);
        }

        degIdx++;
      }

      // Adjust refFret for the next (higher-pitched) string
      if (ordinal < stringOrder.length - 1 && notesFoundOnString.length > 0) {
        const nextStrIdx = stringOrder[ordinal + 1];
        const nextStr = strings[nextStrIdx];
        const interval =
          getStringSemitone(nextStr.openNote, nextStr.octave) -
          getStringSemitone(strConfig.openNote, strConfig.octave);
        refFret = notesFoundOnString[0] - interval;
        if (refFret < 0) refFret = 0;
      }
    }

    if (highlights.length > 0) {
      const label = ROMAN[(posIdx + labelOffset) % 7];
      positions.push({
        name: label,
        highlights,
        startFret: minFret,
        endFret: maxFret,
      });
    }
  }

  return positions;
}

/**
 * CAGED positions.
 *
 * Each shape template defines per-string semitone intervals from baseFret,
 * where baseFret = rootFret + baseOff (+ octave * 12 for tiling).
 * Intervals are derived from verified reference data for C, G, and A major.
 *
 * String index convention: 0 = high E, 5 = low E (matches instrument.strings order).
 *
 * Verified interval tables (baseFret is the minimum fret of the shape):
 *
 *   E Shape (baseOff=-1):
 *     [0] hi E: [0,1]  [1] B: [1,3]  [2] G: [0,2,3]  [3] D: [0,2,3]  [4] A: [0,1,3]  [5] loE: [1,3]
 *
 *   D Shape (baseOff=2):
 *     [0] hi E: [0,2,3]  [1] B: [0,2,3]  [2] G: [0,2]  [3] D: [0,2,4]  [4] A: [0,2,4]  [5] loE: [0,2,3]
 *
 *   C Shape (baseOff=4):
 *     [0] hi E: [0,1,3]  [1] B: [0,1,3]  [2] G: [0,2]  [3] D: [0,2,3]  [4] A: [0,2,3]  [5] loE: [0,1,3]
 *
 *   A Shape (baseOff=5):
 *     [0] hi E: [0,2]  [1] B: [2,4]  [2] G: [1,3,4]  [3] D: [1,2,4]  [4] A: [1,2,4]  [5] loE: [2,4]
 *
 *   G Shape (baseOff=9):
 *     [0] hi E: [0,2,3]  [1] B: [0,1,3]  [2] G: [0,2]  [3] D: [0,2,4]  [4] A: [0,2,3]  [5] loE: [0,2,3]
 */

interface CAGEDShapeTemplate {
  name: string;
  /** rootFret + baseOff + octave*12 = baseFret for this shape */
  baseOff: number;
  /** Per-string semitone intervals from baseFret.
   *  Index 0 = high E (string index 0), index 5 = low E (string index 5). */
  stringIntervals: number[][];
}

/**
 * CAGED shape templates — verified against C, G, and A major.
 *
 * Each template defines per-string semitone intervals from baseFret,
 * where baseFret = rootFret + baseOff (+ octave*12 for tiling).
 * Negative intervals are valid (e.g., D Shape G string reaches one fret
 * below baseFret to include the scale tone that would otherwise be missed).
 *
 * These templates work for both full 7-note scales and 5-note pentatonic
 * scales: the scaleNotes filter naturally selects the correct subset,
 * yielding exactly 2 notes per string for pentatonic shapes.
 *
 * Verified interval tables:
 *
 *   E Shape (baseOff=-1):
 *     [0] hi E: [0,1,3]  [1] B: [1,3]  [2] G: [0,2,3]  [3] D: [0,2,3]
 *     [4] A: [0,1,3]  [5] loE: [1,3]
 *
 *   D Shape (baseOff=2):
 *     [0] hi E: [0,2,3]  [1] B: [0,2,3]  [2] G: [-1,0,2]  [3] D: [0,2]
 *     [4] A: [0,2,4]  [5] loE: [0,2,3]
 *
 *   C Shape (baseOff=4):
 *     [0] hi E: [0,1,3]  [1] B: [0,1,3]  [2] G: [0,2]  [3] D: [0,2,3]
 *     [4] A: [0,2,3]  [5] loE: [0,1,3]
 *
 *   A Shape (baseOff=5):
 *     [0] hi E: [2,4]  [1] B: [2,4]  [2] G: [1,3,4]  [3] D: [1,2,4]
 *     [4] A: [1,2,4]  [5] loE: [2,4]
 *
 *   G Shape (baseOff=9):
 *     [0] hi E: [0,2,3]  [1] B: [0,1,3]  [2] G: [0,2]  [3] D: [0,2,4]
 *     [4] A: [0,2,3]  [5] loE: [0,2,3]
 */
const CAGED_TEMPLATES: CAGEDShapeTemplate[] = [
  {
    name: 'E Shape',
    baseOff: -1,
    stringIntervals: [
      [0, 1, 3],    // [0] high E — extends to 2nd degree above root
      [1, 3],       // [1] B
      [0, 2, 3],    // [2] G
      [0, 2, 3],    // [3] D
      [0, 1, 3],    // [4] A
      [1, 3],       // [5] low E
    ],
  },
  {
    name: 'D Shape',
    baseOff: 2,
    stringIntervals: [
      [0, 2, 3],    // [0] high E
      [0, 2, 3],    // [1] B
      [-1, 0, 2],   // [2] G — reaches 1 fret below baseFret for the 6th/7th
      [0, 2],       // [3] D
      [0, 2, 4],    // [4] A
      [0, 2, 3],    // [5] low E
    ],
  },
  {
    name: 'C Shape',
    baseOff: 4,
    stringIntervals: [
      [0, 1, 3],    // [0] high E
      [0, 1, 3],    // [1] B
      [0, 2],       // [2] G
      [0, 2, 3],    // [3] D
      [0, 2, 3],    // [4] A
      [0, 1, 3],    // [5] low E
    ],
  },
  {
    name: 'A Shape',
    baseOff: 5,
    stringIntervals: [
      [2, 4],       // [0] high E — 5th and 6th degrees of shape
      [2, 4],       // [1] B
      [1, 3, 4],    // [2] G
      [1, 2, 4],    // [3] D
      [1, 2, 4],    // [4] A
      [2, 4],       // [5] low E
    ],
  },
  {
    name: 'G Shape',
    baseOff: 9,
    stringIntervals: [
      [0, 2, 3],    // [0] high E
      [0, 1, 3],    // [1] B
      [0, 2],       // [2] G
      [0, 2, 4],    // [3] D
      [0, 2, 3],    // [4] A
      [0, 2, 3],    // [5] low E
    ],
  },
];

function calculateCAGED(
  instrument: InstrumentConfig,
  chordScale: ChordScale
): Position[] {
  const scaleNotes = chordScale.notes;
  const rootNote = chordScale.rootNote;
  const strings = instrument.strings;
  const maxFret = 24;

  // Find root fret on lowest string (first occurrence within fret 0–11)
  const lowestStr = strings[strings.length - 1];
  let rootFret = -1;
  for (let f = 0; f <= 11; f++) {
    if (getNoteAtFret(lowestStr.openNote, lowestStr.octave, f).name === rootNote) {
      rootFret = f;
      break;
    }
  }
  if (rootFret === -1) rootFret = 0;

  const useTemplates = strings.length === 6;
  const positions: Position[] = [];

  // Tile shapes across octaves
  for (let octave = -1; octave <= 2; octave++) {
    for (const tmpl of CAGED_TEMPLATES) {
      const baseFret = rootFret + tmpl.baseOff + octave * 12;

      const highlights: PositionHighlight[] = [];
      let minFret = maxFret;
      let maxFretSeen = 0;

      for (let si = 0; si < strings.length; si++) {
        const str = strings[si];

        if (useTemplates && si < tmpl.stringIntervals.length) {
          // Interval-based: each fret = baseFret + interval
          for (const interval of tmpl.stringIntervals[si]) {
            const fret = baseFret + interval;
            if (fret < 0 || fret > maxFret) continue;
            const note = getNoteAtFret(str.openNote, str.octave, fret);
            if (scaleNotes.includes(note.name)) {
              highlights.push({ stringIndex: si, fretNumber: fret });
              minFret = Math.min(minFret, fret);
              maxFretSeen = Math.max(maxFretSeen, fret);
            }
          }
        } else {
          // Fallback for non-6-string instruments: rectangular fret window
          const allIntervals = tmpl.stringIntervals.flat();
          const overallStart = Math.min(...allIntervals);
          const overallEnd = Math.max(...allIntervals);
          const strStart = Math.max(0, baseFret + overallStart);
          const strEnd = Math.min(maxFret, baseFret + overallEnd);
          for (let f = strStart; f <= strEnd; f++) {
            const note = getNoteAtFret(str.openNote, str.octave, f);
            if (scaleNotes.includes(note.name)) {
              highlights.push({ stringIndex: si, fretNumber: f });
              minFret = Math.min(minFret, f);
              maxFretSeen = Math.max(maxFretSeen, f);
            }
          }
        }
      }

      // Skip shapes with too few notes or partly off the playable range.
      // Pentatonic shapes require all 12 notes (2 per string × 6 strings) to
      // avoid including cut-off high-neck instances where some frets exceed maxFret.
      const minHighlights = scaleNotes.length === 5 ? 2 * strings.length : 6;
      if (highlights.length < minHighlights) continue;

      positions.push({
        name: tmpl.name,
        highlights,
        startFret: minFret,
        endFret: maxFretSeen,
      });
    }
  }

  return positions;
}

/**
 * Mode / box positions.
 *
 * One ~5-fret box per scale degree, tiled across two octaves. Ordered with
 * the tonic (degree 0) first, then remaining degrees in scale order, each
 * with its lower-octave instance before its higher-octave instance.
 *
 * Labels: "I — C", "II — D", ... using Roman numeral + starting note name.
 * Instances with fewer than 2 notes per string are discarded.
 */
function calculateModePositions(
  instrument: InstrumentConfig,
  chordScale: ChordScale
): Position[] {
  const scaleNotes = chordScale.notes;
  const strings = instrument.strings;
  const lowestStr = strings[strings.length - 1];
  const minHighlights = strings.length * 2;

  // Find each degree's base fret on the lowest string (frets 0–11)
  const baseFrets: number[] = scaleNotes.map((degreeNote) => {
    for (let f = 0; f <= 11; f++) {
      if (getNoteAtFret(lowestStr.openNote, lowestStr.octave, f).name === degreeNote) {
        return f;
      }
    }
    return 0;
  });

  const positions: Position[] = [];

  for (let degIdx = 0; degIdx < scaleNotes.length; degIdx++) {
    const degreeNote = scaleNotes[degIdx];
    const roman = ROMAN[degIdx % 7] ?? `${degIdx + 1}`;
    const label = `${roman} — ${degreeNote}`;

    for (const octave of [0, 1]) {
      const degreeFret = baseFrets[degIdx] + octave * 12;
      const startFret = Math.max(0, degreeFret - 1);
      const endFret = degreeFret + 3;

      const highlights: PositionHighlight[] = [];
      for (let si = 0; si < strings.length; si++) {
        const str = strings[si];
        for (let f = startFret; f <= endFret; f++) {
          const note = getNoteAtFret(str.openNote, str.octave, f);
          if (scaleNotes.includes(note.name)) {
            highlights.push({ stringIndex: si, fretNumber: f });
          }
        }
      }

      if (highlights.length < minHighlights) continue;

      positions.push({ name: label, highlights, startFret, endFret });
    }
  }

  return positions;
}

/**
 * Check whether a note name passes the display-mode filter.
 * - scales  → all scale notes
 * - arpeggios → degrees 1, 3, 5, 7
 * - chords   → degrees 1, 3, 5
 */
export function isAllowedByDisplayMode(
  noteName: NoteName,
  chordScale: ChordScale,
  displayMode: DisplayMode
): boolean {
  if (displayMode === 'scales') return true;
  const info = getScaleDegreeInfo(noteName, chordScale);
  if (!info) return false;
  const allowed = displayMode === 'arpeggios' ? [1, 3, 5, 7] : [1, 3, 5];
  return allowed.includes(info.degree);
}

/**
 * Returns true if the given ChordScale supports 3NPS positions.
 * Used by UI to show/hide the 3NPS button.
 */
export function is3npsEligible(chordScale: ChordScale): boolean {
  return DIATONIC_3NPS_TYPES.has(chordScale.type) && chordScale.notes.length >= 7;
}

