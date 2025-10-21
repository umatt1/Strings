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

export interface ScaleDegreeInfo {
  note: NoteName;
  degree: number;
  isImportant: boolean; // 1st, 3rd, 5th are usually important
}

export function getScaleDegreeInfo(note: NoteName, chord: ChordScale): ScaleDegreeInfo | null {
  const noteIndex = chord.notes.indexOf(note);
  if (noteIndex === -1) return null;

  const degree = noteIndex + 1;
  const isImportant = degree === 1 || degree === 3 || degree === 5;

  return {
    note,
    degree,
    isImportant
  };
}

export function getScaleDegreeColor(degree: number, isImportant: boolean): string {
  // Colorblind-friendly gradient: Red (most important) -> Orange -> Yellow -> Blue (least important)
  if (isImportant) {
    switch (degree) {
      case 1: return '#D73027'; // Root - Deep Red (most important)
      case 3: return '#FC8D59'; // Third - Orange-Red
      case 5: return '#FEE08B'; // Fifth - Yellow-Orange
      default: return '#E0F3F8'; // Other important - Light Blue
    }
  } else {
    switch (degree) {
      case 2: return '#FDAE61'; // Second - Light Orange
      case 4: return '#FFFFBF'; // Fourth - Light Yellow
      case 6: return '#ABD9E9'; // Sixth - Light Blue
      case 7: return '#74ADD1'; // Seventh - Medium Blue
      default: return '#4575B4'; // Others - Blue (least important)
    }
  }
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
