import React from 'react';
import type { Note } from '../types/music';
import { getNoteName } from '../types/music';
import { audioPlayer } from '../utils/audio';
import './FretboardNote.css';

interface FretboardNoteProps {
  note: Note;
  stringIndex: number;
  fretNumber: number;
  isHighlighted: boolean;
  onSelect?: (note: Note, stringIndex: number, fretNumber: number) => void;
}

export const FretboardNote: React.FC<FretboardNoteProps> = ({
  note,
  stringIndex,
  fretNumber,
  isHighlighted,
  onSelect,
}) => {
  const handleClick = () => {
    audioPlayer.playNote(note.frequency);
    if (onSelect) {
      onSelect(note, stringIndex, fretNumber);
    }
  };

  return (
    <button
      className={`fretboard-note ${isHighlighted ? 'highlighted' : ''}`}
      onClick={handleClick}
      title={`${getNoteName(note)} - ${note.frequency.toFixed(2)} Hz`}
    >
      <span className="note-name">{note.name}</span>
    </button>
  );
};
