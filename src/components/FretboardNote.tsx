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
  isSelected?: boolean;
  scaleDegreeInfo?: ScaleDegreeInfo | null;
  onSelect?: (note: Note, stringIndex: number, fretNumber: number) => void;
  showFretLabel?: boolean;
  fretMarkerMode?: 'dots' | 'numbers';
}

export const FretboardNote: React.FC<FretboardNoteProps> = ({
  note,
  stringIndex,
  fretNumber,
  isHighlighted,
  isSelected = false,
  scaleDegreeInfo,
  onSelect,
  showFretLabel = false,
  fretMarkerMode = 'numbers',
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
      background: backgroundColor,
      borderColor: scaleDegreeInfo.isImportant ? '#333' : '#666'
    };
  };

  const getFretLabelContent = () => {
    if (!showFretLabel) return null;
    
    const isMarkerFret = [3, 5, 7, 9, 15, 17, 19, 21].includes(fretNumber);
    const isDoubleMarker = [12, 24].includes(fretNumber);
    const isProminentFret = isMarkerFret || isDoubleMarker;
    
    if (!isProminentFret) return null;
    
    if (fretMarkerMode === 'dots') {
      return isDoubleMarker ? '••' : '•';
    } else {
      return fretNumber.toString();
    }
  };

  return (
    <div className="fret-cell-container">
      {showFretLabel && getFretLabelContent() && (
        <div className="fret-label-above">
          {getFretLabelContent()}
        </div>
      )}
      <button
        className={`fretboard-note ${isHighlighted ? 'highlighted' : ''} ${scaleDegreeInfo?.isImportant ? 'important' : ''} ${isSelected ? 'selected' : ''}`}
        style={getButtonStyle()}
        onClick={handleClick}
        title={`${getNoteName(note)} - ${note.frequency.toFixed(2)} Hz${scaleDegreeInfo ? ` (${scaleDegreeInfo.degree}${scaleDegreeInfo.degree === 1 ? 'st' : scaleDegreeInfo.degree === 2 ? 'nd' : scaleDegreeInfo.degree === 3 ? 'rd' : 'th'})` : ''}${isSelected ? ' - SELECTED' : ''}`}
      >
        <span className="note-name">{note.name}</span>
        {scaleDegreeInfo && (
          <span className="scale-degree">{scaleDegreeInfo.degree}</span>
        )}
      </button>
    </div>
  );
};
