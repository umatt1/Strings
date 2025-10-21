import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { InstrumentConfig, Note } from '../types/music';
import { getNoteAtFret } from '../types/music';
import { FretboardNote } from './FretboardNote';
import type { ChordScale } from '../utils/musicTheory';
import { isNoteInChord, getScaleDegreeInfo } from '../utils/musicTheory';
import './Fretboard.css';

interface FretboardProps {
  instrument: InstrumentConfig;
  fretMarkerMode: 'dots' | 'numbers';
  selectedChordScale?: ChordScale;
  selectedNotes?: Note[];
  mirrorStrings?: boolean;
  onNoteSelect?: (note: Note, stringIndex: number, fretNumber: number) => void;
}

const INITIAL_FRETS = 24;
const FRETS_TO_LOAD = 12;
const MAX_FRETS = 500; // Reasonable maximum

export const Fretboard: React.FC<FretboardProps> = ({
  instrument,
  fretMarkerMode,
  selectedChordScale,
  selectedNotes = [],
  mirrorStrings = false,
  onNoteSelect,
}) => {
  const [numFrets, setNumFrets] = useState(INITIAL_FRETS);
  const fretboardRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleScroll = useCallback(() => {
    if (!fretboardRef.current || isLoading || numFrets >= MAX_FRETS) return;

    const { scrollLeft, scrollWidth, clientWidth } = fretboardRef.current;
    const scrollPercentage = (scrollLeft + clientWidth) / scrollWidth;

    // Load more frets when user scrolls to 80% of the content
    if (scrollPercentage > 0.8) {
      setIsLoading(true);
      // Small delay to simulate loading and prevent rapid firing
      setTimeout(() => {
        setNumFrets(prev => Math.min(prev + FRETS_TO_LOAD, MAX_FRETS));
        setIsLoading(false);
      }, 100);
    }
  }, [numFrets, isLoading]);

  useEffect(() => {
    const fretboard = fretboardRef.current;
    if (!fretboard) return;

    fretboard.addEventListener('scroll', handleScroll);
    return () => fretboard.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!fretboardRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await fretboardRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };
  const renderFretboard = () => {
    const stringsToRender = mirrorStrings ? [...instrument.strings].reverse() : instrument.strings;
    const strings = stringsToRender.map((stringConfig, stringIndex) => {
      const frets = [];
      
      // Add frets from 0 to numFrets (infinite scroll loads more)
      for (let fret = 0; fret <= numFrets; fret++) {
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

        // If a scale is selected and this note is not in it, show only the fret label
        const showLabelOnly = selectedChordScale && !isHighlighted;

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
              showLabelOnly={showLabelOnly}
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
    <div className="fretboard" ref={fretboardRef}>
      <button 
        className="fullscreen-button"
        onClick={toggleFullscreen}
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? '⤓' : '⛶'}
      </button>
      <div className="fretboard-grid">
        {renderFretboard()}
      </div>
      {isLoading && numFrets < MAX_FRETS && (
        <div className="fretboard-loading">Loading more frets...</div>
      )}
    </div>
  );
};
