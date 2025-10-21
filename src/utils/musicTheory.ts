import type { NoteName } from '../types/music';
import { NOTES } from '../types/music';

export type ChordType = 'major' | 'minor' | 'major-triad' | 'minor-triad';
export type ScaleType = 'pentatonic-major' | 'pentatonic-minor';

// Intervals in semitones
export const CHORD_INTERVALS: Record<ChordType, number[]> = {
  'major': [0, 4, 7],           // Root, Major 3rd, Perfect 5th
  'minor': [0, 3, 7],           // Root, Minor 3rd, Perfect 5th
  'major-triad': [0, 4, 7],     // Same as major
  'minor-triad': [0, 3, 7],     // Same as minor
};

export const SCALE_INTERVALS: Record<ScaleType, number[]> = {
  'pentatonic-major': [0, 2, 4, 7, 9],      // Major pentatonic
  'pentatonic-minor': [0, 3, 5, 7, 10],     // Minor pentatonic
};

export interface ChordScale {
  type: ChordType | ScaleType;
  rootNote: NoteName;
  notes: NoteName[];
}

export function getChordNotes(rootNote: NoteName, chordType: ChordType): NoteName[] {
  const rootIndex = NOTES.indexOf(rootNote);
  const intervals = CHORD_INTERVALS[chordType];
  
  return intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return NOTES[noteIndex];
  });
}

export function getScaleNotes(rootNote: NoteName, scaleType: ScaleType): NoteName[] {
  const rootIndex = NOTES.indexOf(rootNote);
  const intervals = SCALE_INTERVALS[scaleType];
  
  return intervals.map(interval => {
    const noteIndex = (rootIndex + interval) % 12;
    return NOTES[noteIndex];
  });
}

export function isNoteInChord(note: NoteName, chord: ChordScale): boolean {
  return chord.notes.includes(note);
}

export const CHORD_LABELS: Record<ChordType, string> = {
  'major': 'Major Chord',
  'minor': 'Minor Chord',
  'major-triad': 'Major Triad',
  'minor-triad': 'Minor Triad',
};

export const SCALE_LABELS: Record<ScaleType, string> = {
  'pentatonic-major': 'Major Pentatonic Scale',
  'pentatonic-minor': 'Minor Pentatonic Scale',
};
