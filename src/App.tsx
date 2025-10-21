import { useState } from 'react';
import type { InstrumentConfig } from './types/music';
import { STANDARD_GUITAR } from './types/music';
import type { ChordScale } from './utils/musicTheory';
import { Controls } from './components/Controls';
import { Fretboard } from './components/Fretboard';
import { PlaybackControls } from './components/PlaybackControls';
import './App.css';

function App() {
  const [instrument, setInstrument] = useState<InstrumentConfig>(STANDARD_GUITAR);
  const [numFrets, setNumFrets] = useState(15);
  const [minFret, setMinFret] = useState(0);
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [selectedChordScale, setSelectedChordScale] = useState<ChordScale | undefined>(undefined);

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
      <header className="app-header">
        <h1>🎸 Interactive Fretboard</h1>
        <p>Click on notes to play them. Select a chord or scale to highlight patterns.</p>
      </header>

      <main className="app-main">
        <Controls
          instrument={instrument}
          onInstrumentChange={setInstrument}
          numFrets={numFrets}
          onNumFretsChange={handleMaxFretChange}
          minFret={minFret}
          onMinFretChange={handleMinFretChange}
          orientation={orientation}
          onOrientationChange={setOrientation}
          selectedChordScale={selectedChordScale}
          onChordScaleChange={setSelectedChordScale}
        />

        <PlaybackControls
          instrument={instrument}
          numFrets={numFrets}
          minFret={minFret}
          selectedChordScale={selectedChordScale}
        />

        <Fretboard
          instrument={instrument}
          numFrets={numFrets}
          minFret={minFret}
          orientation={orientation}
          selectedChordScale={selectedChordScale}
        />
      </main>

      <footer className="app-footer">
        <p>Practice chord shapes and scales across the fretboard</p>
      </footer>
    </div>
  );
}

export default App;
