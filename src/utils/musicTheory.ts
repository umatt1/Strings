import type { NoteName } from '../types/music';
import { NOTES } from '../types/music';

// Chord Types - Organized by category
export type TriadType = 'major' | 'minor' | 'diminished' | 'augmented';
export type SeventhChordType = 'maj7' | 'min7' | 'dom7' | 'half-dim7' | 'dim7' | 'min-maj7' | 'aug-maj7';
export type ExtendedChordType = 'add9' | 'sus2' | 'sus4';
export type ChordType = TriadType | SeventhChordType | ExtendedChordType;

// Scale/Mode Types - Organized by system
export type PentatonicScaleType = 'pentatonic-major' | 'pentatonic-minor';
export type MajorModeType = 'ionian' | 'dorian' | 'phrygian' | 'lydian' | 'mixolydian' | 'aeolian' | 'locrian';
export type MinorScaleType = 'natural-minor' | 'harmonic-minor' | 'melodic-minor';
export type BluesScaleType = 'blues-major' | 'blues-minor';
export type ScaleType = PentatonicScaleType | MajorModeType | MinorScaleType | BluesScaleType;

// Combined type for any chord or scale
export type MusicTheoryType = ChordType | ScaleType;

// Intervals in semitones
export const CHORD_INTERVALS: Record<ChordType, number[]> = {
  // Triads
  'major': [0, 4, 7],           // Root, Major 3rd, Perfect 5th
  'minor': [0, 3, 7],           // Root, Minor 3rd, Perfect 5th
  'diminished': [0, 3, 6],      // Root, Minor 3rd, Diminished 5th
  'augmented': [0, 4, 8],       // Root, Major 3rd, Augmented 5th
  
  // Seventh Chords
  'maj7': [0, 4, 7, 11],        // Major 7th
  'min7': [0, 3, 7, 10],        // Minor 7th
  'dom7': [0, 4, 7, 10],        // Dominant 7th
  'half-dim7': [0, 3, 6, 10],   // Half-diminished 7th (m7♭5)
  'dim7': [0, 3, 6, 9],         // Fully diminished 7th
  'min-maj7': [0, 3, 7, 11],    // Minor-major 7th
  'aug-maj7': [0, 4, 8, 11],    // Augmented major 7th
  
  // Extended/Suspended
  'add9': [0, 2, 4, 7],         // Add 9 (major 2nd)
  'sus2': [0, 2, 7],            // Suspended 2nd
  'sus4': [0, 5, 7],            // Suspended 4th
};

export const SCALE_INTERVALS: Record<ScaleType, number[]> = {
  // Pentatonic Scales
  'pentatonic-major': [0, 2, 4, 7, 9],      // Major pentatonic
  'pentatonic-minor': [0, 3, 5, 7, 10],     // Minor pentatonic
  
  // Major Modes (7-note scales)
  'ionian': [0, 2, 4, 5, 7, 9, 11],         // Major scale (mode 1)
  'dorian': [0, 2, 3, 5, 7, 9, 10],         // Dorian mode (mode 2)
  'phrygian': [0, 1, 3, 5, 7, 8, 10],       // Phrygian mode (mode 3)
  'lydian': [0, 2, 4, 6, 7, 9, 11],         // Lydian mode (mode 4)
  'mixolydian': [0, 2, 4, 5, 7, 9, 10],     // Mixolydian mode (mode 5)
  'aeolian': [0, 2, 3, 5, 7, 8, 10],        // Natural minor (mode 6)
  'locrian': [0, 1, 3, 5, 6, 8, 10],        // Locrian mode (mode 7)
  
  // Minor Scale Variations
  'natural-minor': [0, 2, 3, 5, 7, 8, 10],  // Same as Aeolian
  'harmonic-minor': [0, 2, 3, 5, 7, 8, 11], // Raised 7th
  'melodic-minor': [0, 2, 3, 5, 7, 9, 11],  // Raised 6th and 7th
  
  // Blues Scales
  'blues-major': [0, 2, 3, 4, 7, 9],        // Major blues scale
  'blues-minor': [0, 3, 5, 6, 7, 10],       // Minor blues scale
};

export interface ChordScale {
  type: MusicTheoryType;
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
  // Clean blue/purple gradient matching the screenshot aesthetic
  if (isImportant) {
    switch (degree) {
      case 1: return '#1a237e'; // Root - Dark Indigo (most important)
      case 3: return '#3f51b5'; // Third - Indigo
      case 5: return '#5c6bc0'; // Fifth - Light Indigo
      default: return '#7986cb'; // Other important - Lighter Indigo
    }
  } else {
    switch (degree) {
      case 2: return '#9fa8da'; // Second - Very Light Indigo
      case 4: return '#c5cae9'; // Fourth - Pale Indigo
      case 6: return '#e8eaf6'; // Sixth - Very Pale Indigo
      case 7: return '#b39ddb'; // Seventh - Light Purple
      default: return '#d1c4e9'; // Others - Pale Purple
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

export function getMusicTheoryNotes(rootNote: NoteName, type: MusicTheoryType): NoteName[] {
  if (isChordType(type)) {
    return getChordNotes(rootNote, type);
  } else {
    return getScaleNotes(rootNote, type);
  }
}

export function isChordType(type: MusicTheoryType): type is ChordType {
  return Object.keys(CHORD_INTERVALS).includes(type);
}

export function isScaleType(type: MusicTheoryType): type is ScaleType {
  return Object.keys(SCALE_INTERVALS).includes(type);
}

// Organized collections for UI
export const CHORD_CATEGORIES = {
  'Triads': ['major', 'minor', 'diminished', 'augmented'] as ChordType[],
  'Seventh Chords': ['maj7', 'min7', 'dom7', 'half-dim7', 'dim7', 'min-maj7', 'aug-maj7'] as ChordType[],
  'Extended/Sus': ['add9', 'sus2', 'sus4'] as ChordType[],
};

export const SCALE_CATEGORIES = {
  'Pentatonic': ['pentatonic-major', 'pentatonic-minor'] as ScaleType[],
  'Major Modes': ['ionian', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'aeolian', 'locrian'] as ScaleType[],
  'Minor Scales': ['natural-minor', 'harmonic-minor', 'melodic-minor'] as ScaleType[],
  'Blues': ['blues-major', 'blues-minor'] as ScaleType[],
};

// Most commonly used items for quick access
export const COMMON_CHORDS: ChordType[] = ['major', 'minor', 'maj7', 'min7', 'dom7'];
export const COMMON_SCALES: ScaleType[] = ['ionian', 'aeolian', 'pentatonic-major', 'pentatonic-minor', 'dorian'];

export function getMusicTheoryLabel(type: MusicTheoryType): string {
  if (isChordType(type)) {
    return CHORD_LABELS[type];
  } else {
    return SCALE_LABELS[type];
  }
}

export function isNoteInChord(note: NoteName, chord: ChordScale): boolean {
  return chord.notes.includes(note);
}

export const CHORD_LABELS: Record<ChordType, string> = {
  // Triads
  'major': 'Major',
  'minor': 'Minor',
  'diminished': 'Diminished',
  'augmented': 'Augmented',
  
  // Seventh Chords
  'maj7': 'Major 7th',
  'min7': 'Minor 7th',
  'dom7': 'Dominant 7th',
  'half-dim7': 'Half Diminished 7th',
  'dim7': 'Diminished 7th',
  'min-maj7': 'Minor-Major 7th',
  'aug-maj7': 'Augmented Major 7th',
  
  // Extended/Suspended
  'add9': 'Add 9',
  'sus2': 'Suspended 2nd',
  'sus4': 'Suspended 4th',
};

export const SCALE_LABELS: Record<ScaleType, string> = {
  // Pentatonic Scales
  'pentatonic-major': 'Major Pentatonic',
  'pentatonic-minor': 'Minor Pentatonic',
  
  // Major Modes
  'ionian': 'Ionian (Mode 1)',
  'dorian': 'Dorian (Mode 2)',
  'phrygian': 'Phrygian (Mode 3)',
  'lydian': 'Lydian (Mode 4)',
  'mixolydian': 'Mixolydian (Mode 5)',
  'aeolian': 'Aeolian (Mode 6)',
  'locrian': 'Locrian (Mode 7)',
  
  // Minor Scale Variations
  'natural-minor': 'Natural Minor',
  'harmonic-minor': 'Harmonic Minor',
  'melodic-minor': 'Melodic Minor',
  
  // Blues Scales
  'blues-major': 'Major Blues',
  'blues-minor': 'Minor Blues',
};
