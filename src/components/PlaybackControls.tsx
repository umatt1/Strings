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
  minFret: number;
  selectedChordScale?: ChordScale;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  instrument,
  numFrets,
  minFret,
  selectedChordScale,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const playHighlightedNotes = async () => {
    if (!selectedChordScale || isPlaying) return;

    setIsPlaying(true);

    const frequencies: number[] = [];

    // Collect ALL highlighted notes from the fretboard (every instance)
    for (let stringIndex = 0; stringIndex < instrument.strings.length; stringIndex++) {
      const stringConfig = instrument.strings[stringIndex];
      for (let fret = minFret; fret <= numFrets; fret++) {
        const note = getNoteAtFret(stringConfig.openNote, stringConfig.octave, fret);
        if (isNoteInChord(note.name, selectedChordScale)) {
          frequencies.push(note.frequency);
        }
      }
    }

    // Sort by frequency but keep all instances (no deduplication)
    frequencies.sort((a, b) => a - b);

    await audioPlayer.playSequence(frequencies, 0.2, 0.05);
    setIsPlaying(false);
  };

  const playScale = async () => {
    if (!selectedChordScale || isPlaying) return;

    setIsPlaying(true);

    // Play the scale pattern in order, using the lowest octave notes
    const scaleNotes = selectedChordScale.notes;
    const frequencies: number[] = [];

    // Find the lowest occurrence of each scale note
    for (const scaleName of scaleNotes) {
      let lowestFreq = Infinity;
      
      for (let stringIndex = 0; stringIndex < instrument.strings.length; stringIndex++) {
        const stringConfig = instrument.strings[stringIndex];
        for (let fret = minFret; fret <= numFrets; fret++) {
          const note = getNoteAtFret(stringConfig.openNote, stringConfig.octave, fret);
          if (note.name === scaleName && note.frequency < lowestFreq) {
            lowestFreq = note.frequency;
          }
        }
      }
      
      if (lowestFreq !== Infinity) {
        frequencies.push(lowestFreq);
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
