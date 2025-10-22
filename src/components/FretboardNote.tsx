import React from 'react';
import type { Note } from '../types/music';
import { getNoteName } from '../types/music';
import type { ScaleDegreeInfo } from '../utils/musicTheory';
import type { ColorTheme } from '../types/theme';
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
  showLabelOnly?: boolean;
  colorTheme: ColorTheme;
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
  showLabelOnly = false,
  colorTheme,
}) => {
  const handleClick = () => {
    audioPlayer.playNote(note.frequency);
    if (onSelect) {
      onSelect(note, stringIndex, fretNumber);
    }
  };

  const getButtonStyle = () => {
    // If showLabelOnly is true (scale is selected but note is not in it), make it invisible
    if (showLabelOnly) {
      return {
        background: 'transparent',
        color: 'transparent',
        borderColor: 'transparent',
        boxShadow: 'none',
        cursor: 'default'
      };
    }
    
    // If highlighted, use theme colors
    if (isHighlighted && scaleDegreeInfo) {
      // Get color from theme based on scale degree
      let backgroundColor: string;
      if (scaleDegreeInfo.isImportant) {
        switch (scaleDegreeInfo.degree) {
          case 1: backgroundColor = colorTheme.scaleColors.root; break;
          case 3: backgroundColor = colorTheme.scaleColors.third; break;
          case 5: backgroundColor = colorTheme.scaleColors.fifth; break;
          default: backgroundColor = colorTheme.scaleColors.otherImportant;
        }
      } else {
        switch (scaleDegreeInfo.degree) {
          case 2: backgroundColor = colorTheme.scaleColors.second; break;
          case 4: backgroundColor = colorTheme.scaleColors.fourth; break;
          case 6: backgroundColor = colorTheme.scaleColors.sixth; break;
          case 7: backgroundColor = colorTheme.scaleColors.seventh; break;
          default: backgroundColor = colorTheme.scaleColors.others;
        }
      }
      
      return {
        background: backgroundColor,
        color: colorTheme.noteText,
        borderColor: scaleDegreeInfo.isImportant ? '#333' : '#666'
      };
    }
    
    // Default: no scale selected, use default styling (let CSS handle it)
    return {};
  };

  const getFretLabelContent = () => {
    if (!showFretLabel) return null;
    
    // Always show numbers mode: show the fret number for all frets (except open)
    return fretNumber > 0 ? fretNumber.toString() : null;
  };

  // Always render the full structure, but make invisible if not in scale
  return (
    <div className="fret-cell-container">
      {showFretLabel && getFretLabelContent() && (
        <div className="fret-label-above">
          {getFretLabelContent()}
        </div>
      )}
      <button
        className={`fretboard-note ${isHighlighted ? 'highlighted' : ''} ${scaleDegreeInfo?.isImportant ? 'important' : ''} ${isSelected ? 'selected' : ''} ${showLabelOnly ? 'hidden' : ''}`}
        style={getButtonStyle()}
        onClick={handleClick}
        title={`${getNoteName(note)} - ${note.frequency.toFixed(2)} Hz${scaleDegreeInfo ? ` (${scaleDegreeInfo.degree}${scaleDegreeInfo.degree === 1 ? 'st' : scaleDegreeInfo.degree === 2 ? 'nd' : scaleDegreeInfo.degree === 3 ? 'rd' : 'th'})` : ''}${isSelected ? ' - SELECTED' : ''}`}
      >
        <span className="note-name">{showLabelOnly ? '' : note.name}</span>
        {scaleDegreeInfo && isHighlighted && (
          <span className="scale-degree">{scaleDegreeInfo.degree}</span>
        )}
      </button>
    </div>
  );
};
