import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import type { InstrumentConfig, Note, EnharmonicPreference } from './types/music';
import { GUITAR_TUNINGS, createInstrumentFromTuning } from './types/music';
import type { ChordScale } from './utils/musicTheory';
import { isScaleType } from './utils/musicTheory';
import type { ColorTheme } from './types/theme';
import { COLOR_THEMES } from './types/theme';
import type { PositionSystem, DisplayMode } from './utils/positions';
import { calculatePositions, is3npsEligible, isFlatEligible } from './utils/positions';
import type { QueueItem } from './types/practice';
import { PRESETS } from './data/presets';
import { Controls } from './components/Controls';
import { MusicTheoryControls } from './components/MusicTheoryControls';
import { PositionControls } from './components/PositionControls';
import { Fretboard } from './components/Fretboard';
import { PlaybackControls } from './components/PlaybackControls';
import { PracticeBar } from './components/PracticeBar';
import { QueueEditor } from './components/QueueEditor';
import './App.css';

interface RefSnapshot {
  selectedChordScale?: ChordScale;
  positionSystem: PositionSystem;
  positionIndex: number;
  displayMode: DisplayMode;
}

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

  // ── Practice mode state ───────────────────────────────────────────────
  const [practiceMode, setPracticeMode] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);
  const [queueEditorOpen, setQueueEditorOpen] = useState(false);
  const [refSnapshot, setRefSnapshot] = useState<RefSnapshot | null>(null);

  // ── Computed positions ────────────────────────────────────────────────
  const positions = useMemo(() => {
    if (!selectedChordScale || positionSystem === 'none') return [];
    return calculatePositions(instrument, selectedChordScale, positionSystem);
  }, [instrument, selectedChordScale, positionSystem]);

  // Reset positionIndex on chord/scale change (skip in practice mode —
  // the queue item controls the index)
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

  // ── Practice mode helpers ─────────────────────────────────────────────
  const setQueueFromItem = useCallback((item: QueueItem) => {
    setSelectedChordScale(item.chordScale);
    setPositionSystem(item.positionSystem);
    setPositionIndex(item.positionIndex);
    setDisplayMode(item.displayMode);
  }, []);

  const advanceQueue = useCallback(() => {
    if (queue.length === 0) return;
    setQueueIndex((prev) => (prev + 1) % queue.length);
  }, [queue.length]);

  const retreatQueue = useCallback(() => {
    if (queue.length === 0) return;
    setQueueIndex((prev) => (prev - 1 + queue.length) % queue.length);
  }, [queue.length]);

  // Apply queue item whenever queueIndex changes in practice mode
  useEffect(() => {
    if (!practiceMode || queue.length === 0) return;
    setQueueFromItem(queue[queueIndex]);
  }, [practiceMode, queueIndex]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Auto-advance timer
  const advanceQueueRef = useRef(advanceQueue);
  advanceQueueRef.current = advanceQueue;
  useEffect(() => {
    if (!practiceMode || timer === null) return;
    const id = setInterval(() => advanceQueueRef.current(), timer * 1000);
    return () => clearInterval(id);
  }, [practiceMode, timer]);

  // ── Practice mode toggle ──────────────────────────────────────────────
  const handlePracticeModeToggle = () => {
    if (!practiceMode) {
      // Entering practice mode: save reference state, load default preset if queue empty
      setRefSnapshot({ selectedChordScale, positionSystem, positionIndex, displayMode });
      let activeQueue = queue;
      if (queue.length === 0) {
        const defaultPreset = PRESETS.find(p => p.id === 'g-major-scale-workout') ?? PRESETS[0];
        activeQueue = defaultPreset.items;
        setQueue(activeQueue);
      }
      setQueueIndex(0);
      if (activeQueue.length > 0) setQueueFromItem(activeQueue[0]);
      setPracticeMode(true);
    } else {
      // Leaving practice mode: restore reference state
      setPracticeMode(false);
      if (refSnapshot) {
        setSelectedChordScale(refSnapshot.selectedChordScale);
        setPositionSystem(refSnapshot.positionSystem);
        setPositionIndex(refSnapshot.positionIndex);
        setDisplayMode(refSnapshot.displayMode);
      }
    }
  };

  const handleAddChordsToQueue = useCallback((items: QueueItem[]) => {
    setQueue((prev) => [...prev, ...items]);
  }, []);

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
              onAddChordsToQueue={handleAddChordsToQueue}
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
