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
  fretMarkerMode: 'dots' | 'numbers';
  selectedChordScale?: ChordScale;
  mirrorStrings?: boolean;
  onNoteSelect?: (note: Note, stringIndex: number, fretNumber: number) => void;
}

export const Fretboard: React.FC<FretboardProps> = ({
  instrument,
  numFrets,
  minFret,
  orientation,
  fretMarkerMode,
  selectedChordScale,
  mirrorStrings = false,
  onNoteSelect,
}) => {
  const renderFretMarkers = () => {
    const markers = [];
    
    // Add markers for each fret node/wire
    for (let fret = minFret + 1; fret <= numFrets; fret++) {
      const isMarkerFret = [3, 5, 7, 9, 15, 17, 19, 21].includes(fret);
      const isDoubleMarker = [12, 24].includes(fret);
      const isProminentFret = isMarkerFret || isDoubleMarker;
      
      if (isProminentFret) {
        const fretPosition = fret - minFret; // Position relative to displayed frets
        const totalFrets = numFrets - minFret + 1;
        const percentage = (fretPosition / totalFrets) * 100;
        
        markers.push(
          <div 
            key={`marker-${fret}`} 
            className={`fret-marker-node ${orientation}`}
            style={{
              [orientation === 'horizontal' ? 'left' : 'top']: `${percentage}%`
            }}
          >
            <div className="fret-marker-content">
              {fretMarkerMode === 'dots' && isDoubleMarker && (
                <div className="fret-position-marker double">••</div>
              )}
              {fretMarkerMode === 'dots' && isMarkerFret && !isDoubleMarker && (
                <div className="fret-position-marker">•</div>
              )}
              {fretMarkerMode === 'numbers' && (
                <div className={`fret-position-number ${isProminentFret ? 'prominent' : 'subtle'}`}>
                  {fret}
                </div>
              )}
            </div>
          </div>
        );
      }
    }
    
    return <div className={`fret-markers-overlay ${orientation}`}>{markers}</div>;
  };

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

        frets.push(
          <div key={`${stringIndex}-${fret}`} className="fret-cell">
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
          <div className="frets">{frets}</div>
        </div>
      );
    });

    return strings;
  };

  return (
    <div className={`fretboard ${orientation}`}>
      <div className="fretboard-grid">
        {renderFretboard()}
        {renderFretMarkers()}
      </div>
    </div>
  );
};
