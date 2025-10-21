import React from 'react';
import type { InstrumentConfig, Note } from '../types/music';
import { getNoteAtFret } from '../types/music';
import { FretboardNote } from './FretboardNote';
import type { ChordScale } from '../utils/musicTheory';
import { isNoteInChord, getScaleDegreeInfo } from '../utils/musicTheory';
import './Fretboard.css';

interface FretboardProps {
  instrument: InstrumentConfig;
  numFrets: number;
  minFret: number;
  fretMarkerMode: 'dots' | 'numbers';
  selectedChordScale?: ChordScale;
  selectedNotes?: Note[];
  mirrorStrings?: boolean;
  onNoteSelect?: (note: Note, stringIndex: number, fretNumber: number) => void;
}

export const Fretboard: React.FC<FretboardProps> = ({
  instrument,
  numFrets,
  minFret,
  fretMarkerMode,
  selectedChordScale,
  selectedNotes = [],
  mirrorStrings = false,
  onNoteSelect,
}) => {
  const renderFretboard = () => {
    const stringsToRender = mirrorStrings ? [...instrument.strings].reverse() : instrument.strings;
    const strings = stringsToRender.map((stringConfig, stringIndex) => {
      const frets = [];
      
      // Add frets in the specified range
      for (let fret = minFret; fret <= numFrets; fret++) {
        const note = getNoteAtFret(stringConfig.openNote, stringConfig.octave, fret);
        const isHighlighted = selectedChordScale
          ? isNoteInChord(note.name, selectedChordScale)
          : false;
        const scaleDegreeInfo = selectedChordScale 
          ? getScaleDegreeInfo(note.name, selectedChordScale)
          : null;

        // Determine if this fret should show a label based on mode
        let showFretLabel = false;
        if (stringIndex === 0) { // Only show on first string to avoid duplication
          if (fretMarkerMode === 'numbers') {
            // Numbers mode: show all fret numbers (except fret 0/open)
            showFretLabel = fret > 0;
          } else if (fretMarkerMode === 'dots') {
            // Dots mode: only standard marker positions
            const isStandardMarker = [3, 5, 7, 9, 15, 17, 19, 21].includes(fret);
            const isOctaveMarker = [12, 24].includes(fret);
            showFretLabel = isStandardMarker || isOctaveMarker;
          }
        }

        // Check if this note is currently selected by the user
        const isSelected = selectedNotes.some(selectedNote => 
          selectedNote.frequency === note.frequency && 
          selectedNote.name === note.name && 
          selectedNote.octave === note.octave
        );

        frets.push(
          <div key={`${stringIndex}-${fret}`} className="fret-cell">
            <FretboardNote
              note={note}
              stringIndex={stringIndex}
              fretNumber={fret}
              isHighlighted={isHighlighted}
              isSelected={isSelected}
              scaleDegreeInfo={scaleDegreeInfo}
              onSelect={onNoteSelect}
              showFretLabel={showFretLabel}
              fretMarkerMode={fretMarkerMode}
            />
          </div>
        );
      }

      return (
        <div key={stringIndex} className="string-row">
          <div className="frets">{frets}</div>
        </div>
      );
    });

    return strings;
  };

  return (
    <div className="fretboard">
      <div className="fretboard-grid">
        {renderFretboard()}
      </div>
    </div>
  );
};
