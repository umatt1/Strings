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

  // Sort by startFret so Position 1 is always closest to the nut
  positions.sort((a, b) => a.startFret - b.startFret);

  // Relabel after sorting (preserve shape names for CAGED)
  if (system !== 'caged') {
    positions.forEach((pos, i) => {
      // Keep any parenthetical suffix (e.g. mode name)
      const suffix = pos.name.match(/\(.*\)/)?.[0] ?? '';
      pos.name = `Position ${i + 1}${suffix ? ' ' + suffix : ''}`;
    });
  }

  return positions;
}

/**
 * 3 Notes Per String positions.
 * Only meaningful for 7-note scales — returns empty for anything else.
 * One position per scale degree, each starts on that degree on the lowest
 * string and places 3 consecutive scale tones per string going up.
 */
function calculate3NPS(
  instrument: InstrumentConfig,
  chordScale: ChordScale
): Position[] {
  const scaleNotes = chordScale.notes;
  if (scaleNotes.length < 7) return [];

  const strings = instrument.strings; // index 0 = highest pitch
  const numStrings = strings.length;
  const numDegrees = scaleNotes.length;

  // Process strings from lowest pitch (last index) to highest (index 0)
  const stringOrder = [...Array(numStrings).keys()].reverse();

  const positions: Position[] = [];

  for (let posIdx = 0; posIdx < numDegrees; posIdx++) {
    const startNote = scaleNotes[posIdx];

    // Find first occurrence of startNote on the lowest string (frets 0-14)
    const lowestStrIdx = stringOrder[0];
    const lowestStr = strings[lowestStrIdx];
    let startFret = -1;
    for (let f = 0; f <= 14; f++) {
      if (getNoteAtFret(lowestStr.openNote, lowestStr.octave, f).name === startNote) {
        startFret = f;
        break;
      }
    }
    if (startFret === -1) continue;

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
        // Same pitch sits `interval` frets lower on the next string
        refFret = notesFoundOnString[0] - interval;
        if (refFret < 0) refFret = 0;
      }
    }

    if (highlights.length > 0) {
      positions.push({
        name: `Position ${posIdx + 1}`,
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
 * Tiles the five shapes (E, D, C, A, G) across the entire fretboard.
 *
 * Each shape is defined by per-string fret ranges relative to a base fret.
 * The templates are derived from verified CAGED box patterns on standard-tuned
 * 6-string guitar. For non-standard string counts, falls back to a rectangular
 * fret window approach.
 *
 * String indices in templates: 0 = high E, 1 = B, 2 = G, 3 = D, 4 = A, 5 = low E
 */

interface CAGEDShapeTemplate {
  name: string;
  /** Offset from root fret to the base (lowest) fret of this shape */
  baseOff: number;
  /** Per-string [startOffset, endOffset] relative to the base fret.
   *  Index 0 = highest string (high E), index 5 = lowest string (low E). */
  stringRanges: [number, number][];
}

const CAGED_TEMPLATES: CAGEDShapeTemplate[] = [
  {
    name: 'E Shape', baseOff: -1,
    stringRanges: [
      [0, 3], // str 1 (high E)
      [1, 3], // str 2 (B)
      [0, 3], // str 3 (G)
      [0, 3], // str 4 (D)
      [0, 3], // str 5 (A)
      [1, 3], // str 6 (low E)
    ],
  },
  {
    name: 'D Shape', baseOff: 2,
    stringRanges: [
      [0, 3], // str 1
      [0, 3], // str 2
      [-1, 2], // str 3 (G)
      [0, 2],  // str 4 (D)
      [0, 4],  // str 5
      [0, 3], // str 6
    ],
  },
  {
    name: 'C Shape', baseOff: 4,
    stringRanges: [
      [0, 3], // str 1
      [0, 3], // str 2
      [0, 2], // str 3
      [0, 3], // str 4
      [0, 3], // str 5
      [0, 3], // str 6
    ],
  },
  {
    name: 'A Shape', baseOff: 5,
    stringRanges: [
      [2, 4], // str 1 (high E) — mirrors low E, sits at barre position and above
      [2, 4], // str 2
      [1, 4], // str 3
      [1, 4], // str 4
      [1, 4], // str 5
      [2, 4], // str 6
    ],
  },
  {
    name: 'G Shape', baseOff: 9,
    stringRanges: [
      [0, 3], // str 1
      [0, 3], // str 2
      [0, 2], // str 3
      [0, 4], // str 4
      [0, 3], // str 5
      [0, 3], // str 6
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

  // Find root fret on lowest string (first occurrence within fret 0-11)
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

  // Tile shapes across the neck (multiple octaves)
  for (let octave = -1; octave <= 2; octave++) {
    for (const tmpl of CAGED_TEMPLATES) {
      const baseFret = rootFret + tmpl.baseOff + octave * 12;

      const highlights: PositionHighlight[] = [];
      let minFret = maxFret;
      let maxFretSeen = 0;

      for (let si = 0; si < strings.length; si++) {
        const str = strings[si];

        let strStart: number, strEnd: number;
        if (useTemplates && si < tmpl.stringRanges.length) {
          const [sOff, eOff] = tmpl.stringRanges[si];
          strStart = Math.max(0, baseFret + sOff);
          strEnd = Math.min(maxFret, baseFret + eOff);
        } else {
          // Fallback for non-6-string instruments: rectangular window
          const overallStart = tmpl.stringRanges.reduce((m, [s]) => Math.min(m, s), 0);
          const overallEnd = tmpl.stringRanges.reduce((m, [, e]) => Math.max(m, e), 0);
          strStart = Math.max(0, baseFret + overallStart);
          strEnd = Math.min(maxFret, baseFret + overallEnd);
        }

        for (let f = strStart; f <= strEnd; f++) {
          const note = getNoteAtFret(str.openNote, str.octave, f);
          if (scaleNotes.includes(note.name)) {
            highlights.push({ stringIndex: si, fretNumber: f });
            minFret = Math.min(minFret, f);
            maxFretSeen = Math.max(maxFretSeen, f);
          }
        }
      }

      // Skip shapes that are mostly off the playable range
      if (highlights.length < 6) continue;

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
 * One position per scale degree, each a ~5-fret box centred on where that
 * degree sits on the lowest string.
 */
function calculateModePositions(
  instrument: InstrumentConfig,
  chordScale: ChordScale
): Position[] {
  const scaleNotes = chordScale.notes;
  const strings = instrument.strings;
  const lowestStr = strings[strings.length - 1];

  // Mode names only apply to 7-note scales
  const modeNames =
    scaleNotes.length === 7
      ? [
          'Ionian',
          'Dorian',
          'Phrygian',
          'Lydian',
          'Mixolydian',
          'Aeolian',
          'Locrian',
        ]
      : null;

  return scaleNotes.map((degreeNote, idx) => {
    // Find where this degree first appears on the lowest string
    let degreeFret = -1;
    for (let f = 0; f <= 14; f++) {
      if (getNoteAtFret(lowestStr.openNote, lowestStr.octave, f).name === degreeNote) {
        degreeFret = f;
        break;
      }
    }
    if (degreeFret === -1) degreeFret = 0;

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

    const modeSuffix =
      modeNames && idx < modeNames.length ? ` (${modeNames[idx]})` : '';

    return {
      name: `Position ${idx + 1}${modeSuffix}`,
      highlights,
      startFret,
      endFret,
    };
  });
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
