import { useState, useMemo, useEffect, useRef } from 'react';
import type { InstrumentConfig, Note, EnharmonicPreference } from './types/music';
import { GUITAR_TUNINGS, createInstrumentFromTuning } from './types/music';
import type { ChordScale } from './utils/musicTheory';
import { isScaleType } from './utils/musicTheory';
import type { ColorTheme } from './types/theme';
import { COLOR_THEMES } from './types/theme';
import type { PositionSystem, DisplayMode } from './utils/positions';
import { calculatePositions, is3npsEligible, isFlatEligible } from './utils/positions';
import { usePracticeMode } from './hooks/usePracticeMode';
import { Controls } from './components/Controls';
import { MusicTheoryControls } from './components/MusicTheoryControls';
import { PositionControls } from './components/PositionControls';
import { Fretboard } from './components/Fretboard';
import { PlaybackControls } from './components/PlaybackControls';
import { PracticeBar } from './components/PracticeBar';
import { QueueEditor } from './components/QueueEditor';
import { PRESETS } from './data/presets';
import './App.css';

function App() {
  // ── Reference mode state ──────────────────────────────────────────────
  const [instrument, setInstrument] = useState<InstrumentConfig>(
    createInstrumentFromTuning(GUITAR_TUNINGS.find(t => t.id === 'standard')!)
  );
  const [mirrorStrings, setMirrorStrings] = useState(false);
  const [selectedChordScale, setSelectedChordScale] = useState<ChordScale | undefined>(undefined);
  const [selectedNotes, setSelectedNotes] = useState<Note[]>([]);
  const [colorTheme, setColorTheme] = useState<ColorTheme>(COLOR_THEMES.indigo);
  const [enharmonicPreference, setEnharmonicPreference] = useState<EnharmonicPreference>('auto');
  const [positionSystem, setPositionSystem] = useState<PositionSystem>('none');
  const [positionIndex, setPositionIndex] = useState(0);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('scales');

  // ── Practice mode (via hook) ──────────────────────────────────────────
  const practiceBarRef = useRef<HTMLDivElement>(null);

  const getCurrentSnapshot = () => ({
    selectedChordScale,
    positionSystem,
    positionIndex,
    displayMode,
  });

  const applySnapshot = (snap: { selectedChordScale?: ChordScale; positionSystem: PositionSystem; positionIndex: number; displayMode: DisplayMode }) => {
    setSelectedChordScale(snap.selectedChordScale);
    setPositionSystem(snap.positionSystem);
    setPositionIndex(snap.positionIndex);
    setDisplayMode(snap.displayMode);
  };

  const {
    practiceMode,
    queue,
    queueIndex,
    timer,
    queueEditorOpen,
    setQueue,
    setTimer,
    setQueueEditorOpen,
    advanceQueue,
    retreatQueue,
    handlePracticeModeToggle,
    handleAddChordsToQueue,
    handleAddCurrentToQueue,
  } = usePracticeMode(getCurrentSnapshot, applySnapshot);

  // ── Computed positions ────────────────────────────────────────────────
  const positions = useMemo(() => {
    if (!selectedChordScale || positionSystem === 'none') return [];
    return calculatePositions(instrument, selectedChordScale, positionSystem);
  }, [instrument, selectedChordScale, positionSystem]);

  // Reset positionIndex on chord/scale change (skip in practice mode)
  useEffect(() => {
    if (!practiceMode) setPositionIndex(0);
    if (positionSystem === '3nps' && selectedChordScale && !is3npsEligible(selectedChordScale)) {
      setPositionSystem('none');
    }
    if (positionSystem === 'flat' && selectedChordScale && !isFlatEligible(selectedChordScale)) {
      setPositionSystem('none');
    }
  }, [selectedChordScale, positionSystem]); // eslint-disable-line react-hooks/exhaustive-deps

  const positionHighlights = useMemo((): Set<string> | null => {
    if (positionSystem === 'none' || positions.length === 0) return null;
    const pos = positions[positionIndex];
    if (!pos) return null;
    return new Set(pos.highlights.map((h) => `${h.stringIndex}-${h.fretNumber}`));
  }, [positions, positionIndex, positionSystem]);

  const scrollToFret = useMemo((): number | null => {
    if (positionSystem === 'none' || positions.length === 0) return null;
    const pos = positions[positionIndex];
    return pos ? pos.startFret : null;
  }, [positions, positionIndex, positionSystem]);

  // Spacebar advances queue (ignored when an interactive element has focus)
  useEffect(() => {
    if (!practiceMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      const tag = (document.activeElement?.tagName ?? '').toLowerCase();
      if (['input', 'textarea', 'select', 'button'].includes(tag)) return;
      e.preventDefault();
      advanceQueue();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [practiceMode, advanceQueue]);

  // Scroll PracticeBar into view when practice mode is entered
  useEffect(() => {
    if (practiceMode) {
      practiceBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [practiceMode]);

  // ── Note selector (interval tool) ─────────────────────────────────────
  const handleNoteSelect = (note: Note, _stringIndex: number, _fretNumber: number) => {
    setSelectedNotes(prev => {
      const existingIndex = prev.findIndex(n =>
        n.frequency === note.frequency &&
        n.name === note.name &&
        n.octave === note.octave
      );
      if (existingIndex >= 0) return prev.filter((_, i) => i !== existingIndex);
      if (prev.length >= 2) return [prev[1], note];
      return [...prev, note];
    });
  };

  const handleClearSelection = () => setSelectedNotes([]);

  return (
    <div className="app">
      <main className="app-main">
        <div className="main-content">
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
              onDisplayModeChange={setDisplayMode}
              onAddChordsToQueue={handleAddChordsToQueue}
              onAddCurrentToQueue={handleAddCurrentToQueue}
            />
          </div>

          <div className="right-content">
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

            <div className="practice-toggle-row">
              <button
                className={`practice-toggle-btn ${practiceMode ? 'active' : ''}`}
                onClick={handlePracticeModeToggle}
              >
                {practiceMode ? 'Exit Practice' : 'Practice'}
              </button>
            </div>

            <div className="fretboard-area">
              <PositionControls
                positionSystem={positionSystem}
                onPositionSystemChange={setPositionSystem}
                positions={positions}
                positionIndex={positionIndex}
                onPositionIndexChange={setPositionIndex}
                displayMode={displayMode}
                onDisplayModeChange={setDisplayMode}
                hasSelection={!!selectedChordScale}
                isScaleSelected={!!selectedChordScale && isScaleType(selectedChordScale.type)}
                scaleNoteCount={selectedChordScale?.notes.length ?? 0}
                is3npsEligible={!!selectedChordScale && is3npsEligible(selectedChordScale)}
                isFlatEligible={!!selectedChordScale && isFlatEligible(selectedChordScale)}
              />
              <div className="fretboard-panel">
                <Fretboard
                  instrument={instrument}
                  selectedChordScale={selectedChordScale}
                  selectedNotes={selectedNotes}
                  mirrorStrings={mirrorStrings}
                  onNoteSelect={handleNoteSelect}
                  colorTheme={colorTheme}
                  enharmonicPreference={enharmonicPreference}
                  positionHighlights={positionHighlights}
                  displayMode={displayMode}
                  scrollToFret={scrollToFret}
                />
              </div>
              {practiceMode && queue.length > 0 && (
                <PracticeBar
                  queue={queue}
                  queueIndex={queueIndex}
                  onAdvance={advanceQueue}
                  onRetreat={retreatQueue}
                  timer={timer}
                  onTimerChange={setTimer}
                  onEditQueue={() => setQueueEditorOpen(true)}
                  containerRef={practiceBarRef}
                />
              )}
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

      {queueEditorOpen && (
        <QueueEditor
          queue={queue}
          onQueueChange={setQueue}
          presets={PRESETS}
          onClose={() => setQueueEditorOpen(false)}
        />
      )}

      <footer className="app-footer">
        <p>Practice chord shapes and scales across the fretboard</p>
      </footer>
    </div>
  );
}

export default App;
