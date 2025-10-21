import React from 'react';
import type { InstrumentConfig, Note } from '../types/music';
import { getNoteAtFret, getNoteName } from '../types/music';
import type { ChordScale } from '../utils/musicTheory';
import { isNoteInChord } from '../utils/musicTheory';
import { audioPlayer } from '../utils/audio';
import './PlaybackControls.css';

interface PlaybackControlsProps {
  instrument: InstrumentConfig;
  numFrets: number;
  minFret: number;
  selectedChordScale?: ChordScale;
  selectedNotes: Note[];
  onClearSelection: () => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  instrument,
  numFrets,
  minFret,
  selectedChordScale,
  selectedNotes,
  onClearSelection,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

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
      for (let fret = minFret; fret <= numFrets; fret++) {
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

  const playAllHighlighted = async () => {
    if (!selectedChordScale || isPlaying) return;

    setIsPlaying(true);

    const frequencies: number[] = [];

    // Collect ALL highlighted notes from the fretboard
    for (let stringIndex = 0; stringIndex < instrument.strings.length; stringIndex++) {
      const stringConfig = instrument.strings[stringIndex];
      for (let fret = minFret; fret <= numFrets; fret++) {
        const note = getNoteAtFret(stringConfig.openNote, stringConfig.octave, fret);
        if (isNoteInChord(note.name, selectedChordScale)) {
          frequencies.push(note.frequency);
        }
      }
    }

    // Sort by frequency and remove duplicates
    const uniqueFrequencies = Array.from(new Set(frequencies)).sort((a, b) => a - b);

    await audioPlayer.playSequence(uniqueFrequencies, 0.2, 0.05);
    setIsPlaying(false);
  };

  if (!selectedChordScale) {
    return (
      <div className="playback-controls disabled">
        <p>Select a chord or scale to enable playback</p>
      </div>
    );
  }

  return (
    <div className="playback-controls">
      <h3>Playback</h3>
      
      {selectedNotes.length > 0 && (
        <div className="selection-info">
          <p>Selected Notes: {selectedNotes.map(note => getNoteName(note)).join(' → ')}</p>
          <button
            onClick={onClearSelection}
            className="clear-button"
          >
            Clear Selection
          </button>
        </div>
      )}
      
      <div className="playback-buttons">
        {selectedNotes.length === 2 ? (
          <button
            onClick={playBetweenSelectedNotes}
            disabled={isPlaying}
            className="play-button primary"
          >
            {isPlaying ? '🎵 Playing...' : '▶️ Play Between Selected Notes'}
          </button>
        ) : (
          <p className="instruction">
            {selectedNotes.length === 0 
              ? "Click two highlighted notes to play the pattern between them"
              : "Click one more highlighted note to enable playback"
            }
          </p>
        )}
        
        <button
          onClick={playAllHighlighted}
          disabled={isPlaying}
          className="play-button secondary"
        >
          {isPlaying ? '🎵 Playing...' : '▶️ Play All Highlighted'}
        </button>
      </div>
      
      <p className="playback-info">
        Pattern: <strong>{selectedChordScale.rootNote} {selectedChordScale.type}</strong>
      </p>
    </div>
  );
};
