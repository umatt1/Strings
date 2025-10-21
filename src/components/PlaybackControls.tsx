import React from 'react';
import type { InstrumentConfig } from '../types/music';
import { getNoteAtFret } from '../types/music';
import type { ChordScale } from '../utils/musicTheory';
import { isNoteInChord } from '../utils/musicTheory';
import { audioPlayer } from '../utils/audio';
import './PlaybackControls.css';

interface PlaybackControlsProps {
  instrument: InstrumentConfig;
  numFrets: number;
  selectedChordScale?: ChordScale;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  instrument,
  numFrets,
  selectedChordScale,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const playHighlightedNotes = async () => {
    if (!selectedChordScale || isPlaying) return;

    setIsPlaying(true);

    const frequencies: number[] = [];

    // Collect all highlighted notes from the fretboard
    for (let stringIndex = 0; stringIndex < instrument.strings.length; stringIndex++) {
      const stringConfig = instrument.strings[stringIndex];
      for (let fret = 0; fret <= numFrets; fret++) {
        const note = getNoteAtFret(stringConfig.openNote, stringConfig.octave, fret);
        if (isNoteInChord(note.name, selectedChordScale)) {
          frequencies.push(note.frequency);
        }
      }
    }

    // Remove duplicates and sort by frequency
    const uniqueFrequencies = Array.from(new Set(frequencies)).sort((a, b) => a - b);

    await audioPlayer.playSequence(uniqueFrequencies, 0.3, 0.05);
    setIsPlaying(false);
  };

  const playScale = async () => {
    if (!selectedChordScale || isPlaying) return;

    setIsPlaying(true);

    // Play notes in the first octave they appear
    const frequencies: number[] = [];
    const seenNotes = new Set<string>();

    for (let fret = 0; fret <= numFrets; fret++) {
      for (let stringIndex = 0; stringIndex < instrument.strings.length; stringIndex++) {
        const stringConfig = instrument.strings[stringIndex];
        const note = getNoteAtFret(stringConfig.openNote, stringConfig.octave, fret);
        
        if (isNoteInChord(note.name, selectedChordScale) && !seenNotes.has(note.name)) {
          frequencies.push(note.frequency);
          seenNotes.add(note.name);
        }
      }
    }

    await audioPlayer.playSequence(frequencies, 0.4, 0.1);
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
      <div className="playback-buttons">
        <button
          onClick={playHighlightedNotes}
          disabled={isPlaying}
          className="play-button"
        >
          {isPlaying ? '🎵 Playing...' : '▶️ Play All Highlighted'}
        </button>
        <button
          onClick={playScale}
          disabled={isPlaying}
          className="play-button"
        >
          {isPlaying ? '🎵 Playing...' : '▶️ Play Scale (Ascending)'}
        </button>
      </div>
      <p className="playback-info">
        Selected: <strong>{selectedChordScale.rootNote} {selectedChordScale.type}</strong>
      </p>
    </div>
  );
};
