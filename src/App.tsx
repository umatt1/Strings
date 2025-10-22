import { useState } from 'react';
import type { InstrumentConfig, Note, EnharmonicPreference } from './types/music';
import { GUITAR_TUNINGS, createInstrumentFromTuning } from './types/music';
import type { ChordScale } from './utils/musicTheory';
import type { ColorTheme } from './types/theme';
import { COLOR_THEMES } from './types/theme';
import { Controls } from './components/Controls';
import { MusicTheoryControls } from './components/MusicTheoryControls';
import { Fretboard } from './components/Fretboard';
import { PlaybackControls } from './components/PlaybackControls';
import './App.css';

function App() {
  const [instrument, setInstrument] = useState<InstrumentConfig>(
    createInstrumentFromTuning(GUITAR_TUNINGS.find(t => t.id === 'standard')!)
  );
  const [mirrorStrings, setMirrorStrings] = useState(false);
  const [selectedChordScale, setSelectedChordScale] = useState<ChordScale | undefined>(undefined);
  const [selectedNotes, setSelectedNotes] = useState<Note[]>([]);
  const [colorTheme, setColorTheme] = useState<ColorTheme>(COLOR_THEMES.indigo);
  const [enharmonicPreference, setEnharmonicPreference] = useState<EnharmonicPreference>('auto');

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

  return (
    <div className="app">
      <main className="app-main">
        {/* Main Content Area - Responsive Layout: Mobile = Settings First, Desktop = Old Layout */}
        <div className="main-content">
          {/* Settings shown on top for mobile only */}
          <div className="top-settings">
            <Controls
              instrument={instrument}
              onInstrumentChange={setInstrument}
              mirrorStrings={mirrorStrings}
              onMirrorStringsChange={setMirrorStrings}
              colorTheme={colorTheme}
              onColorThemeChange={setColorTheme}
              enharmonicPreference={enharmonicPreference}
              onEnharmonicPreferenceChange={setEnharmonicPreference}
            />
          </div>

          <div className="theory-panel">
            <MusicTheoryControls
              selectedChordScale={selectedChordScale}
              onChordScaleChange={setSelectedChordScale}
            />
          </div>

          <div className="right-content">
            {/* Settings shown here for desktop */}
            <div className="desktop-settings">
              <Controls
                instrument={instrument}
                onInstrumentChange={setInstrument}
                mirrorStrings={mirrorStrings}
                onMirrorStringsChange={setMirrorStrings}
                colorTheme={colorTheme}
                onColorThemeChange={setColorTheme}
                enharmonicPreference={enharmonicPreference}
                onEnharmonicPreferenceChange={setEnharmonicPreference}
              />
            </div>

            <div className="fretboard-area">
              <div className="fretboard-panel">
                <Fretboard
                  instrument={instrument}
                  selectedChordScale={selectedChordScale}
                  selectedNotes={selectedNotes}
                  mirrorStrings={mirrorStrings}
                  onNoteSelect={handleNoteSelect}
                  colorTheme={colorTheme}
                  enharmonicPreference={enharmonicPreference}
                />
              </div>
            </div>
            
            <div className="fretboard-playback">
              <PlaybackControls
                instrument={instrument}
                selectedChordScale={selectedChordScale}
                selectedNotes={selectedNotes}
                onClearSelection={handleClearSelection}
              />
            </div>
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
