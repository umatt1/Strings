// Musical note types and utilities

export type NoteName = 'C' | 'C#' | 'Db' | 'D' | 'D#' | 'Eb' | 'E' | 'F' | 'F#' | 'Gb' | 'G' | 'G#' | 'Ab' | 'A' | 'A#' | 'Bb' | 'B' | 'Cb';

export interface Note {
  name: NoteName;
  octave: number;
  frequency: number;
}

export interface StringConfig {
  openNote: NoteName;
  octave: number;
}

export interface TuningPreset {
  id: string;
  name: string;
  category: 'guitar' | 'bass';
  strings: StringConfig[];
}

export interface InstrumentConfig {
  name: string;
  strings: StringConfig[];
}

// Default chromatic scale with sharps (for internal calculations)
export const NOTES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Chromatic scale with flats (alternative)
export const NOTES_FLAT: NoteName[] = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Guitar tuning presets (high to low string order)
export const GUITAR_TUNINGS: TuningPreset[] = [
  {
    id: 'standard',
    name: 'Standard (E-A-D-G-B-E)',
    category: 'guitar',
    strings: [
      { openNote: 'E', octave: 4 },
      { openNote: 'B', octave: 3 },
      { openNote: 'G', octave: 3 },
      { openNote: 'D', octave: 3 },
      { openNote: 'A', octave: 2 },
      { openNote: 'E', octave: 2 },
    ],
  },
  {
    id: 'drop-d',
    name: 'Drop D (D-A-D-G-B-E)',
    category: 'guitar',
    strings: [
      { openNote: 'E', octave: 4 },
      { openNote: 'B', octave: 3 },
      { openNote: 'G', octave: 3 },
      { openNote: 'D', octave: 3 },
      { openNote: 'A', octave: 2 },
      { openNote: 'D', octave: 2 },
    ],
  },
  {
    id: 'dadgad',
    name: 'DADGAD (D-A-D-G-A-D)',
    category: 'guitar',
    strings: [
      { openNote: 'D', octave: 4 },
      { openNote: 'A', octave: 3 },
      { openNote: 'G', octave: 3 },
      { openNote: 'D', octave: 3 },
      { openNote: 'A', octave: 2 },
      { openNote: 'D', octave: 2 },
    ],
  },
  {
    id: 'open-g',
    name: 'Open G (D-G-D-G-B-D)',
    category: 'guitar',
    strings: [
      { openNote: 'D', octave: 4 },
      { openNote: 'B', octave: 3 },
      { openNote: 'G', octave: 3 },
      { openNote: 'D', octave: 3 },
      { openNote: 'G', octave: 2 },
      { openNote: 'D', octave: 2 },
    ],
  },
  {
    id: 'open-d',
    name: 'Open D (D-A-D-F#-A-D)',
    category: 'guitar',
    strings: [
      { openNote: 'D', octave: 4 },
      { openNote: 'A', octave: 3 },
      { openNote: 'F#', octave: 3 },
      { openNote: 'D', octave: 3 },
      { openNote: 'A', octave: 2 },
      { openNote: 'D', octave: 2 },
    ],
  },
  {
    id: 'half-step-down',
    name: 'Half Step Down (Eb-Ab-Db-Gb-Bb-Eb)',
    category: 'guitar',
    strings: [
      { openNote: 'D#', octave: 4 },
      { openNote: 'A#', octave: 3 },
      { openNote: 'F#', octave: 3 },
      { openNote: 'C#', octave: 3 },
      { openNote: 'G#', octave: 2 },
      { openNote: 'D#', octave: 2 },
    ],
  },
];

// Bass tuning presets (high to low string order)
export const BASS_TUNINGS: TuningPreset[] = [
  {
    id: 'bass-standard',
    name: '4-String Standard (G-D-A-E)',
    category: 'bass',
    strings: [
      { openNote: 'G', octave: 2 },
      { openNote: 'D', octave: 2 },
      { openNote: 'A', octave: 1 },
      { openNote: 'E', octave: 1 },
    ],
  },
  {
    id: 'bass-drop-d',
    name: '4-String Drop D (G-D-A-D)',
    category: 'bass',
    strings: [
      { openNote: 'G', octave: 2 },
      { openNote: 'D', octave: 2 },
      { openNote: 'A', octave: 1 },
      { openNote: 'D', octave: 1 },
    ],
  },
  {
    id: 'bass-5-string',
    name: '5-String Standard (G-D-A-E-B)',
    category: 'bass',
    strings: [
      { openNote: 'G', octave: 2 },
      { openNote: 'D', octave: 2 },
      { openNote: 'A', octave: 1 },
      { openNote: 'E', octave: 1 },
      { openNote: 'B', octave: 0 },
    ],
  },
  {
    id: 'bass-5-string-high-c',
    name: '5-String High C (C-G-D-A-E)',
    category: 'bass',
    strings: [
      { openNote: 'C', octave: 3 },
      { openNote: 'G', octave: 2 },
      { openNote: 'D', octave: 2 },
      { openNote: 'A', octave: 1 },
      { openNote: 'E', octave: 1 },
    ],
  },
  {
    id: 'bass-half-step-down',
    name: '4-String Half Step Down (Gb-Db-Ab-Eb)',
    category: 'bass',
    strings: [
      { openNote: 'F#', octave: 2 },
      { openNote: 'C#', octave: 2 },
      { openNote: 'G#', octave: 1 },
      { openNote: 'D#', octave: 1 },
    ],
  },
];

export const ALL_TUNINGS = [...GUITAR_TUNINGS, ...BASS_TUNINGS];

// Helper functions to create instruments from tuning presets
export function createInstrumentFromTuning(tuning: TuningPreset): InstrumentConfig {
  return {
    name: tuning.name,
    strings: tuning.strings,
  };
}

export function getTuningById(id: string): TuningPreset | undefined {
  return ALL_TUNINGS.find(tuning => tuning.id === id);
}

export function getTuningsByCategory(category: 'guitar' | 'bass'): TuningPreset[] {
  return ALL_TUNINGS.filter(tuning => tuning.category === category);
}

// Default instruments for backward compatibility
export const STANDARD_GUITAR: InstrumentConfig = createInstrumentFromTuning(
  GUITAR_TUNINGS.find(t => t.id === 'standard')!
);

export const STANDARD_BASS: InstrumentConfig = createInstrumentFromTuning(
  BASS_TUNINGS.find(t => t.id === 'bass-standard')!
);

export function getNoteAtFret(openNote: NoteName, openOctave: number, fret: number): Note {
  const noteIndex = NOTES.indexOf(openNote);
  const newNoteIndex = (noteIndex + fret) % 12;
  const octaveOffset = Math.floor((noteIndex + fret) / 12);
  const newOctave = openOctave + octaveOffset;
  
  const noteName = NOTES[newNoteIndex];
  const frequency = calculateFrequency(noteName, newOctave);
  
  return {
    name: noteName,
    octave: newOctave,
    frequency,
  };
}

export function calculateFrequency(note: NoteName, octave: number): number {
  const A4 = 440;
  const A4_INDEX = 57; // MIDI note number for A4
  
  // Calculate MIDI note number
  const noteIndex = NOTES.indexOf(note);
  const midiNote = (octave + 1) * 12 + noteIndex;
  
  // Calculate frequency using equal temperament
  const semitoneOffset = midiNote - A4_INDEX;
  return A4 * Math.pow(2, semitoneOffset / 12);
}

export function getNoteName(note: Note): string {
  return `${note.name}${note.octave}`;
}

// Enharmonic equivalents (sharps to flats and vice versa)
export const ENHARMONIC_MAP: Record<string, string> = {
  'C#': 'Db',
  'Db': 'C#',
  'D#': 'Eb',
  'Eb': 'D#',
  'F#': 'Gb',
  'Gb': 'F#',
  'G#': 'Ab',
  'Ab': 'G#',
  'A#': 'Bb',
  'Bb': 'A#',
};

// Keys that traditionally use sharps
export const SHARP_KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'];

// Keys that traditionally use flats
export const FLAT_KEYS = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];

export type EnharmonicPreference = 'auto' | 'sharps' | 'flats';

/**
 * Determines if a key should use sharps or flats based on music theory
 */
export function shouldUseSharp(rootNote: NoteName): boolean {
  return SHARP_KEYS.includes(rootNote);
}

/**
 * Converts a note name to its enharmonic equivalent
 */
export function toEnharmonic(note: NoteName): NoteName {
  return (ENHARMONIC_MAP[note] || note) as NoteName;
}

/**
 * Gets the appropriate note name based on preference and key
 */
export function getDisplayNoteName(
  note: NoteName, 
  preference: EnharmonicPreference,
  rootNote?: NoteName
): NoteName {
  // If it's a natural note, no conversion needed
  if (!note.includes('#') && !note.includes('b')) {
    return note;
  }

  // Determine which to use
  let useSharp: boolean;
  
  if (preference === 'sharps') {
    useSharp = true;
  } else if (preference === 'flats') {
    useSharp = false;
  } else { // 'auto' mode
    useSharp = rootNote ? shouldUseSharp(rootNote) : note.includes('#');
  }

  // Convert if necessary
  if (useSharp && note.includes('b')) {
    return toEnharmonic(note);
  } else if (!useSharp && note.includes('#')) {
    return toEnharmonic(note);
  }

  return note;
}
