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

const MAX_FRETS_FOR_PLAYBACK = 24;

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  instrument,
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

    for (let stringIndex = 0; stringIndex < instrument.strings.length; stringIndex++) {
      const stringConfig = instrument.strings[stringIndex];
      for (let fret = 0; fret <= MAX_FRETS_FOR_PLAYBACK; fret++) {
        const note = getNoteAtFret(stringConfig.openNote, stringConfig.octave, fret);
        if (
          selectedChordScale &&
          isNoteInChord(note.name, selectedChordScale) &&
          note.frequency >= startFreq &&
          note.frequency <= endFreq
        ) {
          frequencies.push(note.frequency);
        }
      }
    }

    const uniqueFrequencies = Array.from(new Set(frequencies)).sort((a, b) => a - b);
    await audioPlayer.playSequence(uniqueFrequencies, 0.3, 0.1);
    setIsPlaying(false);
  };

  if (!selectedChordScale) return null;

  return (
    <div className="playback-bar">
      {selectedNotes.length === 2 ? (
        <>
          <span className="playback-hint">
            {selectedNotes[0].name} → {selectedNotes[1].name}
          </span>
          <button
            className="play-button compact"
            onClick={playBetweenSelectedNotes}
            disabled={isPlaying}
            title="Play notes between selection"
          >
            {isPlaying ? '♪' : '▶'}
          </button>
          <button
            className="clear-button compact"
            onClick={onClearSelection}
            title="Clear note selection"
          >
            ✕
          </button>
        </>
      ) : (
        <span className="playback-hint muted">
          Select 2 notes on the fretboard to play {selectedChordScale.rootNote} {selectedChordScale.type}
        </span>
      )}
    </div>
  );
};
