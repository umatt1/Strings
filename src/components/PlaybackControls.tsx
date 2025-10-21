import React from 'react';
import type { InstrumentConfig, Note } from '../types/music';
import { getNoteAtFret } from '../types/music';
import type { ChordScale } from '../utils/musicTheory';
import { isNoteInChord } from '../utils/musicTheory';
import { audioPlayer } from '../utils/audio';
import './PlaybackControls.css';

interface PlaybackControlsProps {
  instrument: InstrumentConfig;
  selectedChordScale?: ChordScale;
  selectedNotes: Note[];
  onClearSelection: () => void;
}

const MAX_FRETS_FOR_PLAYBACK = 24; // Reasonable range for audio playback

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  instrument,
  selectedChordScale,
  selectedNotes,
  onClearSelection,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const playBetweenSelectedNotes = async () => {
    if (selectedNotes.length !== 2 || isPlaying) return;

    setIsPlaying(true);

    const [note1, note2] = selectedNotes;
    const startFreq = Math.min(note1.frequency, note2.frequency);
    const endFreq = Math.max(note1.frequency, note2.frequency);
    
    const frequencies: number[] = [];

    // Collect all highlighted notes between the selected frequencies
    for (let stringIndex = 0; stringIndex < instrument.strings.length; stringIndex++) {
      const stringConfig = instrument.strings[stringIndex];
      for (let fret = 0; fret <= MAX_FRETS_FOR_PLAYBACK; fret++) {
        const note = getNoteAtFret(stringConfig.openNote, stringConfig.octave, fret);
        
        // Include note if it's highlighted and within the frequency range
        if (selectedChordScale && 
            isNoteInChord(note.name, selectedChordScale) &&
            note.frequency >= startFreq && 
            note.frequency <= endFreq) {
          frequencies.push(note.frequency);
        }
      }
    }

    // Sort by frequency and remove duplicates
    const uniqueFrequencies = Array.from(new Set(frequencies)).sort((a, b) => a - b);

    await audioPlayer.playSequence(uniqueFrequencies, 0.3, 0.1);
    setIsPlaying(false);
  };

  return (
    <div className={`playback-controls ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="playback-header" onClick={toggleCollapse}>
        <h3>🎵 Listen</h3>
        <button className="collapse-button">
          {isCollapsed ? '▲' : '▼'}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="playback-content">
          {/* No chord/scale selected message */}
          {!selectedChordScale && (
            <div className="no-selection-info">
              <span className="no-selection-text">
                Select a chord or scale to enable playback
              </span>
              <button 
                className="play-button compact disabled"
                disabled
                title="Select a chord or scale first"
              >
                ▶
              </button>
            </div>
          )}

          {/* Two-Note Selection Info */}
          {selectedNotes.length > 0 && selectedChordScale && (
            <div className="selection-info compact">
              <span className="selection-count">
                {selectedNotes.length === 1 ? '1 note selected' : `${selectedNotes.length} notes selected`}
              </span>
              {selectedNotes.length === 2 && (
                <button 
                  className="play-button compact"
                  onClick={playBetweenSelectedNotes}
                  disabled={isPlaying}
                  title="Play notes between selection"
                >
                  {isPlaying ? '♪' : '▶'}
                </button>
              )}
              <button 
                className="clear-button compact"
                onClick={onClearSelection}
                title="Clear note selection"
              >
                ✕
              </button>
            </div>
          )}
          
          {selectedNotes.length === 0 && selectedChordScale && (
            <div className="chord-info compact">
              <span className="instruction-text">
                Select two notes to play {selectedChordScale.rootNote} {selectedChordScale.type}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
