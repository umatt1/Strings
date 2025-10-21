// Musical note types and utilities

export type NoteName = 'C' | 'C#' | 'D' | 'D#' | 'E' | 'F' | 'F#' | 'G' | 'G#' | 'A' | 'A#' | 'B';

export interface Note {
  name: NoteName;
  octave: number;
  frequency: number;
}

export interface StringConfig {
  openNote: NoteName;
  octave: number;
}

export interface InstrumentConfig {
  name: string;
  strings: StringConfig[];
}

export const NOTES: NoteName[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Standard tunings
export const STANDARD_GUITAR: InstrumentConfig = {
  name: 'Guitar (Standard)',
  strings: [
    { openNote: 'E', octave: 4 },
    { openNote: 'B', octave: 3 },
    { openNote: 'G', octave: 3 },
    { openNote: 'D', octave: 3 },
    { openNote: 'A', octave: 2 },
    { openNote: 'E', octave: 2 },
  ],
};

export const STANDARD_BASS: InstrumentConfig = {
  name: 'Bass (Standard)',
  strings: [
    { openNote: 'G', octave: 2 },
    { openNote: 'D', octave: 2 },
    { openNote: 'A', octave: 1 },
    { openNote: 'E', octave: 1 },
  ],
};

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
