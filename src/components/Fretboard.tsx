import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { InstrumentConfig, Note, EnharmonicPreference } from '../types/music';
import { getNoteAtFret } from '../types/music';
import { FretboardNote } from './FretboardNote';
import type { ChordScale } from '../utils/musicTheory';
import { isNoteInChord, getScaleDegreeInfo } from '../utils/musicTheory';
import type { DisplayMode, Position } from '../utils/positions';
import { isAllowedByDisplayMode } from '../utils/positions';
import type { ColorTheme } from '../types/theme';
import './Fretboard.css';

interface FretboardProps {
  instrument: InstrumentConfig;
  selectedChordScale?: ChordScale;
  selectedNotes?: Note[];
  mirrorStrings?: boolean;
  onNoteSelect?: (note: Note, stringIndex: number, fretNumber: number) => void;
  colorTheme: ColorTheme;
  enharmonicPreference: EnharmonicPreference;
  positionHighlights?: Set<string> | null;
  positions?: Position[];
  positionIndex?: number;
  displayMode?: DisplayMode;
  scrollToFret?: number | null;
}

const INITIAL_FRETS = 24;

// RGB values for each CAGED shape and scale degree position
const SHAPE_RGB: Record<string, string> = {
  'E Shape': '76, 175, 80',    // green
  'D Shape': '255, 152, 0',    // orange
  'C Shape': '156, 39, 176',   // purple
  'A Shape': '33, 150, 243',   // blue
  'G Shape': '239, 68, 68',    // red
};
const DEGREE_RGB = [
  '99, 102, 241',   // I  — indigo
  '234, 88, 12',    // II — orange
  '21, 128, 61',    // III — green
  '147, 51, 234',   // IV — purple
  '2, 132, 199',    // V  — blue
  '220, 38, 38',    // VI — red
  '217, 119, 6',    // VII — amber
];

function positionRgb(name: string, index: number): string {
  // CAGED names: "E Shape", "D Shape", etc.
  for (const [key, rgb] of Object.entries(SHAPE_RGB)) {
    if (name.startsWith(key.split(' ')[0] + ' Shape') || name === key) return rgb;
  }
  // Roman-numeral names: "I", "II", "I — C", etc. — use index mod 7
  return DEGREE_RGB[index % 7];
}
const FRETS_TO_LOAD = 12;
const MAX_FRETS = 500; // Reasonable maximum

export const Fretboard: React.FC<FretboardProps> = ({
  instrument,
  selectedChordScale,
  selectedNotes = [],
  mirrorStrings = false,
  onNoteSelect,
  colorTheme,
  enharmonicPreference,
  positionHighlights = null,
  positions = [],
  positionIndex = 0,
  displayMode = 'scales',
  scrollToFret = null,
}) => {
  const [numFrets, setNumFrets] = useState(INITIAL_FRETS);
  const fretboardRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cellWidth, setCellWidth] = useState(60);

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

  // Measure fret cell width for per-string fill positioning
  useEffect(() => {
    const measure = () => {
      const cell = fretboardRef.current?.querySelector('.fret-cell') as HTMLElement | null;
      if (cell) setCellWidth(cell.getBoundingClientRect().width || 60);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (fretboardRef.current) ro.observe(fretboardRef.current);
    return () => ro.disconnect();
  }, []);

  // Auto-scroll to current position when it changes
  useEffect(() => {
    if (scrollToFret === null || scrollToFret === undefined || !fretboardRef.current) return;
    const container = fretboardRef.current;
    const targetScroll = scrollToFret * cellWidth - container.clientWidth / 4;
    container.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
  }, [scrollToFret, cellWidth]);

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
      // Map rendering index back to instrument index for position lookups
      const instrumentStringIndex = mirrorStrings
        ? instrument.strings.length - 1 - stringIndex
        : stringIndex;

      const frets = [];

      // Add frets from 0 to numFrets (infinite scroll loads more)
      for (let fret = 0; fret <= numFrets; fret++) {
        const note = getNoteAtFret(stringConfig.openNote, stringConfig.octave, fret);

        // A note is "highlighted" if it is in the chord/scale AND passes the display-mode filter
        const inScale = selectedChordScale
          ? isNoteInChord(note.name, selectedChordScale)
          : false;
        const passesDisplayFilter = selectedChordScale
          ? isAllowedByDisplayMode(note.name, selectedChordScale, displayMode)
          : true;
        const isHighlighted = inScale && passesDisplayFilter;

        const scaleDegreeInfo = selectedChordScale
          ? getScaleDegreeInfo(note.name, selectedChordScale)
          : null;

        // Is this fret inside the active position?
        const isInPosition =
          !positionHighlights ||
          positionHighlights.has(`${instrumentStringIndex}-${fret}`);

        // Determine if this fret should show a label based on mode
        let showFretLabel = false;
        if (stringIndex === 0) { // Only show on first string to avoid duplication
          // Always show numbers mode: show all fret numbers (except fret 0/open)
          showFretLabel = fret > 0;
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
              isInPosition={isInPosition}
              scaleDegreeInfo={scaleDegreeInfo}
              onSelect={onNoteSelect}
              showFretLabel={showFretLabel}
              showLabelOnly={showLabelOnly}
              colorTheme={colorTheme}
              enharmonicPreference={enharmonicPreference}
              rootNote={selectedChordScale?.rootNote}
            />
          </div>
        );
      }

      // Per-string fills: one strip per position instance, spanning that string's actual fret range
      const stringFills = positions.length > 0
        ? positions.map((pos, posIdx) => {
            const sh = pos.highlights.filter(h => h.stringIndex === instrumentStringIndex);
            if (sh.length === 0) return null;
            const minFret = Math.min(...sh.map(h => h.fretNumber));
            const maxFret = Math.max(...sh.map(h => h.fretNumber));
            const rgb = positionRgb(pos.name, posIdx);
            const isActive = posIdx === positionIndex;
            return (
              <div
                key={`sfill-${posIdx}`}
                className="string-region-fill"
                style={{
                  left: `${minFret * cellWidth}px`,
                  width: `${(maxFret - minFret + 1) * cellWidth}px`,
                  background: `rgba(${rgb}, ${isActive ? 0.45 : 0.12})`,
                  border: isActive ? `1px solid rgba(${rgb}, 0.6)` : 'none',
                }}
              />
            );
          }).filter(Boolean)
        : [];

      return (
        <div key={stringIndex} className="string-row">
          <div className="frets">
            {stringFills}
            {frets}
          </div>
        </div>
      );
    });

    return strings;
  };

  return (
    <div 
      className="fretboard" 
      ref={fretboardRef}
      style={{
        '--fretboard-bg': colorTheme.fretboardBackground,
        '--grid-bg': colorTheme.gridBackground,
        '--string-border': colorTheme.stringBorder,
        '--fret-border': colorTheme.fretBorder,
        '--nut-border': colorTheme.nutBorder,
      } as React.CSSProperties}
    >
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
