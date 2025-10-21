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
  orientation: 'horizontal' | 'vertical';
  selectedChordScale?: ChordScale;
  onNoteSelect?: (note: Note, stringIndex: number, fretNumber: number) => void;
}

export const Fretboard: React.FC<FretboardProps> = ({
  instrument,
  numFrets,
  minFret,
  orientation,
  selectedChordScale,
  onNoteSelect,
}) => {
  const renderFretboard = () => {
    const strings = instrument.strings.map((stringConfig, stringIndex) => {
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

        frets.push(
          <div key={`${stringIndex}-${fret}`} className="fret-cell">
            {fret === 0 && <div className="fret-marker open">0</div>}
            {fret > 0 && <div className="fret-marker">{fret}</div>}
            <FretboardNote
              note={note}
              stringIndex={stringIndex}
              fretNumber={fret}
              isHighlighted={isHighlighted}
              scaleDegreeInfo={scaleDegreeInfo}
              onSelect={onNoteSelect}
            />
          </div>
        );
      }

      return (
        <div key={stringIndex} className="string-row">
          <div className="string-label">
            String {stringIndex + 1} ({stringConfig.openNote}{stringConfig.octave})
          </div>
          <div className="frets">{frets}</div>
        </div>
      );
    });

    return strings;
  };

  return (
    <div className={`fretboard ${orientation}`}>
      <div className="fretboard-grid">{renderFretboard()}</div>
    </div>
  );
};
