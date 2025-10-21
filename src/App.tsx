import { useState } from 'react';
import type { InstrumentConfig, Note } from './types/music';
import { GUITAR_TUNINGS, createInstrumentFromTuning } from './types/music';
import type { ChordScale } from './utils/musicTheory';
import { Controls } from './components/Controls';
import { MusicTheoryControls } from './components/MusicTheoryControls';
import { Fretboard } from './components/Fretboard';
import { PlaybackControls } from './components/PlaybackControls';
import './App.css';

function App() {
  const [instrument, setInstrument] = useState<InstrumentConfig>(
    createInstrumentFromTuning(GUITAR_TUNINGS.find(t => t.id === 'standard')!)
  );
  const [numFrets, setNumFrets] = useState(15);
  const [minFret, setMinFret] = useState(0);
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [fretMarkerMode, setFretMarkerMode] = useState<'dots' | 'numbers'>('dots');
  const [selectedChordScale, setSelectedChordScale] = useState<ChordScale | undefined>(undefined);
  const [selectedNotes, setSelectedNotes] = useState<Note[]>([]);

  const handleNoteSelect = (note: Note, _stringIndex: number, _fretNumber: number) => {
    setSelectedNotes(prev => {
      // If this note is already selected, remove it
      const existingIndex = prev.findIndex(n => 
        n.frequency === note.frequency && 
        n.name === note.name && 
        n.octave === note.octave
      );
      
      if (existingIndex >= 0) {
        return prev.filter((_, index) => index !== existingIndex);
      }
      
      // If we already have 2 notes, replace the oldest with the new one
      if (prev.length >= 2) {
        return [prev[1], note];
      }
      
      // Add the new note
      return [...prev, note];
    });
  };

  const handleClearSelection = () => {
    setSelectedNotes([]);
  };

  const handleMinFretChange = (newMinFret: number) => {
    // Ensure min fret doesn't exceed max fret
    if (newMinFret <= numFrets) {
      setMinFret(newMinFret);
    }
  };

  const handleMaxFretChange = (newMaxFret: number) => {
    // Ensure max fret is at least the min fret
    if (newMaxFret >= minFret) {
      setNumFrets(newMaxFret);
    }
  };

  return (
    <div className="app">
      <main className="app-main">
        {/* Basic Controls - Always at top */}
        <div className="basic-controls">
          <Controls
            instrument={instrument}
            onInstrumentChange={setInstrument}
            numFrets={numFrets}
            onNumFretsChange={handleMaxFretChange}
            minFret={minFret}
            onMinFretChange={handleMinFretChange}
            orientation={orientation}
            onOrientationChange={setOrientation}
            fretMarkerMode={fretMarkerMode}
            onFretMarkerModeChange={setFretMarkerMode}
          />
        </div>

        {/* Main Content Area - Music Theory + Fretboard */}
        <div className="main-content">
          <div className="theory-panel">
            <div className="music-theory-section">
              <MusicTheoryControls
                selectedChordScale={selectedChordScale}
                onChordScaleChange={setSelectedChordScale}
              />
            </div>
            
            {/* Compact Playback Controls */}
            <div className="compact-playback">
              <PlaybackControls
                instrument={instrument}
                numFrets={numFrets}
                minFret={minFret}
                selectedChordScale={selectedChordScale}
                selectedNotes={selectedNotes}
                onClearSelection={handleClearSelection}
              />
            </div>
          </div>

          <div className="fretboard-panel">
            <Fretboard
              instrument={instrument}
              numFrets={numFrets}
              minFret={minFret}
              orientation={orientation}
              fretMarkerMode={fretMarkerMode}
              selectedChordScale={selectedChordScale}
              onNoteSelect={handleNoteSelect}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Practice chord shapes and scales across the fretboard</p>
      </footer>
    </div>
  );
}

export default App;
