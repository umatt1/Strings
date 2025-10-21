import React from 'react';
import type { Note } from '../types/music';
import { getNoteName } from '../types/music';
import type { ScaleDegreeInfo } from '../utils/musicTheory';
import { getScaleDegreeColor } from '../utils/musicTheory';
import { audioPlayer } from '../utils/audio';
import './FretboardNote.css';

interface FretboardNoteProps {
  note: Note;
  stringIndex: number;
  fretNumber: number;
  isHighlighted: boolean;
  scaleDegreeInfo?: ScaleDegreeInfo | null;
  onSelect?: (note: Note, stringIndex: number, fretNumber: number) => void;
}

export const FretboardNote: React.FC<FretboardNoteProps> = ({
  note,
  stringIndex,
  fretNumber,
  isHighlighted,
  scaleDegreeInfo,
  onSelect,
}) => {
  const handleClick = () => {
    audioPlayer.playNote(note.frequency);
    if (onSelect) {
      onSelect(note, stringIndex, fretNumber);
    }
  };

  const getButtonStyle = () => {
    if (!isHighlighted || !scaleDegreeInfo) {
      return {};
    }
    
    const backgroundColor = getScaleDegreeColor(scaleDegreeInfo.degree, scaleDegreeInfo.isImportant);
    return {
      backgroundColor,
      borderColor: scaleDegreeInfo.isImportant ? '#000' : '#666',
      boxShadow: scaleDegreeInfo.isImportant 
        ? `0 0 10px ${backgroundColor}` 
        : `0 2px 4px rgba(0, 0, 0, 0.3)`
    };
  };

  return (
    <button
      className={`fretboard-note ${isHighlighted ? 'highlighted' : ''} ${scaleDegreeInfo?.isImportant ? 'important' : ''}`}
      style={getButtonStyle()}
      onClick={handleClick}
      title={`${getNoteName(note)} - ${note.frequency.toFixed(2)} Hz${scaleDegreeInfo ? ` (${scaleDegreeInfo.degree}${scaleDegreeInfo.degree === 1 ? 'st' : scaleDegreeInfo.degree === 2 ? 'nd' : scaleDegreeInfo.degree === 3 ? 'rd' : 'th'})` : ''}`}
    >
      <span className="note-name">{note.name}</span>
      {scaleDegreeInfo && (
        <span className="scale-degree">{scaleDegreeInfo.degree}</span>
      )}
    </button>
  );
};
