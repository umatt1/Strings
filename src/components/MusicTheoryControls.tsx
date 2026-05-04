import React from 'react';
import type { NoteName } from '../types/music';
import { NOTES, shouldUseSharp, toEnharmonic } from '../types/music';
import type {
  ChordType,
  ScaleType,
  ChordScale,
  MajorModeType,
  SeventhChordType,
  Tension,
} from '../utils/musicTheory';
import {
  getMusicTheoryNotes,
  getMusicTheoryLabel,
  getModesForKey,
  getDiatonicChords,
  getDiatonicPentatonics,
  degreeLabel,
  buildTensionedChord,
  tensionLabel,
} from '../utils/musicTheory';
import type { DisplayMode } from '../utils/positions';
import type { QueueItem } from '../types/practice';
import './MusicTheoryControls.css';

interface MusicTheoryControlsProps {
  selectedChordScale?: ChordScale;
  onChordScaleChange: (chordScale: ChordScale | undefined) => void;
  onDisplayModeChange?: (mode: DisplayMode) => void;
  onAddChordsToQueue?: (items: QueueItem[]) => void;
  onAddCurrentToQueue?: () => void;
}

const CHORD_COMPACT: Record<SeventhChordType, string> = {
  'maj7': 'maj7', 'min7': 'm7', 'dom7': '7', 'half-dim7': 'ø7',
  'dim7': 'dim7', 'min-maj7': 'mM7', 'aug-maj7': '+M7',
};

const MODE_SHORT: Record<MajorModeType, string> = {
  ionian: 'Ionian', dorian: 'Dorian', phrygian: 'Phrygian', lydian: 'Lydian',
  mixolydian: 'Mixolydian', aeolian: 'Aeolian', locrian: 'Locrian',
};

const NATURAL_TENSIONS: Tension[] = ['9', '11', '13'];
const ALTERED_TENSIONS: Tension[] = ['b9', '#9', '#11', 'b13'];

const NON_DIATONIC_SCALES: Array<{ type: ScaleType; label: string }> = [
  { type: 'pentatonic-major', label: 'pent-M'  },
  { type: 'pentatonic-minor', label: 'pent-m'  },
  { type: 'blues-major',      label: 'blues-M' },
  { type: 'blues-minor',      label: 'blues-m' },
  { type: 'harmonic-minor',   label: 'harm-m'  },
  { type: 'melodic-minor',    label: 'mel-m'   },
];

const OTHER_CHORDS: Array<{ type: ChordType; label: string }> = [
  // TODO: future "common substitutions" panel (tritone sub, bIII, bVII) — see separate proposal
  { type: 'augmented',  label: 'aug'   },
  { type: 'dim7',       label: 'dim7'  },
  { type: 'half-dim7',  label: 'ø7'    },
  { type: 'min-maj7',   label: 'mM7'   },
  { type: 'sus2',       label: 'sus2'  },
  { type: 'sus4',       label: 'sus4'  },
];

export const MusicTheoryControls: React.FC<MusicTheoryControlsProps> = ({
  selectedChordScale,
  onChordScaleChange,
  onDisplayModeChange,
  onAddChordsToQueue,
  onAddCurrentToQueue,
}) => {
  const [keyRoot, setKeyRoot] = React.useState<NoteName>('C');
  const [keyType, setKeyType] = React.useState<'major' | 'minor'>('major');
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [activeDegree, setActiveDegree] = React.useState<number | null>(null);
  const [activeTensions, setActiveTensions] = React.useState<Set<Tension>>(new Set());
  const [sevenOn, setSevenOn] = React.useState(true);

  const relRootNote: NoteName = keyType === 'minor'
    ? NOTES[(NOTES.indexOf(keyRoot) + 3) % 12]
    : keyRoot;
  const useFlats = !shouldUseSharp(relRootNote);

  function displayNote(note: NoteName): string {
    if (!useFlats) return note;
    const enharmonic = toEnharmonic(note);
    return (enharmonic !== note ? enharmonic : note) as string;
  }

  const modeData  = React.useMemo(() => getModesForKey(keyRoot, keyType), [keyRoot, keyType]);
  const chordData = React.useMemo(() => getDiatonicChords(keyRoot, keyType), [keyRoot, keyType]);
  const pentData  = React.useMemo(() => getDiatonicPentatonics(keyRoot, keyType), [keyRoot, keyType]);

  // Rebuild the tensioned chord and push to parent
  function applyTensionState(
    degree: number,
    newTensions: Set<Tension>,
    newSevenOn: boolean
  ) {
    const { root, chordType } = chordData[degree - 1];
    const { modeRoot, scaleType } = modeData[degree - 1];
    const modeScale = getMusicTheoryNotes(modeRoot, scaleType);
    const cs = buildTensionedChord(root, chordType, newSevenOn, newTensions, modeScale);
    onChordScaleChange(cs);
  }

  const selectDegree = (degree: number) => {
    const newTensions = new Set<Tension>();
    setActiveDegree(degree);
    setActiveTensions(newTensions);
    setSevenOn(true);
    applyTensionState(degree, newTensions, true);
    // Use 'scales' so all chord tones + any active tensions are visible.
    // 'arpeggios' mode only passes degrees 1,3,5,7 and would hide tension notes.
    onDisplayModeChange?.('scales');
  };

  const toggleTension = (t: Tension) => {
    if (activeDegree === null) return;
    const next = new Set(activeTensions);
    if (next.has(t)) next.delete(t); else next.add(t);
    setActiveTensions(next);
    applyTensionState(activeDegree, next, sevenOn);
  };

  const toggleSeven = () => {
    if (activeDegree === null) return;
    const next = !sevenOn;
    setSevenOn(next);
    applyTensionState(activeDegree, activeTensions, next);
  };

  const selectModeScale = (degree: number) => {
    const { modeRoot, scaleType } = modeData[degree - 1];
    setActiveDegree(null);
    setActiveTensions(new Set());
    setSevenOn(true);
    onChordScaleChange({ type: scaleType, rootNote: modeRoot, notes: getMusicTheoryNotes(modeRoot, scaleType) });
    onDisplayModeChange?.('scales');
  };

  const handleKeyTypeChange = (kt: 'major' | 'minor') => {
    setKeyType(kt);
    setActiveDegree(null);
    setActiveTensions(new Set());
    setSevenOn(true);
    const type = kt === 'major' ? 'ionian' : 'aeolian';
    onChordScaleChange({ type, rootNote: keyRoot, notes: getMusicTheoryNotes(keyRoot, type) });
    onDisplayModeChange?.('scales');
  };

  const handleKeyRootChange = (note: NoteName) => {
    setKeyRoot(note);
    setActiveDegree(null);
    setActiveTensions(new Set());
    setSevenOn(true);
    if (selectedChordScale) {
      onChordScaleChange({ type: selectedChordScale.type, rootNote: note, notes: getMusicTheoryNotes(note, selectedChordScale.type) });
    }
  };

  const handleOtherSelect = (type: ChordType | ScaleType, root: NoteName = keyRoot) => {
    setActiveDegree(null);
    setActiveTensions(new Set());
    setSevenOn(true);
    onChordScaleChange({ type, rootNote: root, notes: getMusicTheoryNotes(root, type) });
  };

  const handleAddAllChordsToQueue = () => {
    if (!onAddChordsToQueue) return;
    const items: QueueItem[] = chordData.map(({ root, chordType }, i) => ({
      id: `queue-chord-${root}-${chordType}-${i}-${Date.now()}`,
      chordScale: { type: chordType, rootNote: root, notes: getMusicTheoryNotes(root, chordType) },
      positionSystem: 'none',
      positionIndex: 0,
      displayMode: 'scales',
    }));
    onAddChordsToQueue(items);
  };

  const handleAddAllModesToQueue = () => {
    if (!onAddChordsToQueue) return;
    const items: QueueItem[] = modeData.map(({ modeRoot, scaleType }, i) => ({
      id: `queue-mode-${modeRoot}-${scaleType}-${i}-${Date.now()}`,
      chordScale: { type: scaleType, rootNote: modeRoot, notes: getMusicTheoryNotes(modeRoot, scaleType) },
      positionSystem: 'none',
      positionIndex: 0,
      displayMode: 'scales',
    }));
    onAddChordsToQueue(items);
  };

  const activeChordType = activeDegree !== null ? chordData[activeDegree - 1]?.chordType : null;
  const showAlteredTensions = activeChordType === 'dom7';

  // Compute the display label for the selection bar
  const selectionLabel = React.useMemo(() => {
    if (!selectedChordScale) return '';
    if (activeDegree !== null) {
      const cd = chordData[activeDegree - 1];
      if (cd && selectedChordScale.rootNote === cd.root) {
        return tensionLabel(cd.chordType, sevenOn, activeTensions);
      }
    }
    return getMusicTheoryLabel(selectedChordScale.type);
  }, [selectedChordScale, activeDegree, chordData, sevenOn, activeTensions]);

  return (
    <div className={`music-theory-controls ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="theory-header" onClick={() => setIsCollapsed(!isCollapsed)}>
        <h3>🎼 Music Theory</h3>
        <button className="collapse-button">{isCollapsed ? '▶' : '◀'}</button>
      </div>

      {!isCollapsed && (
        <div className="theory-content">
          {/* Root + key type row */}
          <div className="root-key-row">
            <select
              className="root-note-select"
              value={keyRoot}
              onChange={(e) => handleKeyRootChange(e.target.value as NoteName)}
            >
              {NOTES.map((note) => (
                <option key={note} value={note}>{note}</option>
              ))}
            </select>
            <div className="key-type-toggle">
              <button className={`key-type-btn ${keyType === 'major' ? 'active' : ''}`} onClick={() => handleKeyTypeChange('major')}>Major</button>
              <button className={`key-type-btn ${keyType === 'minor' ? 'active' : ''}`} onClick={() => handleKeyTypeChange('minor')}>Minor</button>
            </div>
          </div>

          {/* Current selection bar */}
          <div className="current-selection">
            {selectedChordScale ? (
              <div className="selection-display">
                <span className="selection-text">
                  {displayNote(selectedChordScale.rootNote)} {selectionLabel}
                </span>
                {onAddCurrentToQueue && (
                  <button className="add-to-queue-btn-sm" onClick={onAddCurrentToQueue} title="Add to queue">
                    + Queue
                  </button>
                )}
                <button className="clear-button" onClick={() => { onChordScaleChange(undefined); setActiveDegree(null); setActiveTensions(new Set()); setSevenOn(true); }} title="Clear selection">✕</button>
              </div>
            ) : (
              <span className="no-selection">Select a chord or scale</span>
            )}
          </div>

          {/* ── CHORDS section ─────────────────────────── */}
          <div className="theory-section-label">Chords</div>

          {/* Degree buttons (Roman numeral row) */}
          <div className="mode-grid">
            {modeData.map(({ degree, modeRoot, scaleType }) => {
              const { chordType } = chordData[degree - 1];
              return (
                <button
                  key={degree}
                  className={`mode-btn ${activeDegree === degree ? 'active' : ''}`}
                  onClick={() => selectDegree(degree)}
                  title={`${displayNote(modeRoot)} ${MODE_SHORT[scaleType]}`}
                >
                  <span className="mode-roman">{degreeLabel(degree, chordType)}</span>
                  <span className="mode-root">{displayNote(modeRoot)}</span>
                </button>
              );
            })}
          </div>

          {/* Chord name buttons */}
          <div className="chord-grid">
            {chordData.map(({ degree, root, chordType }) => (
              <button
                key={degree}
                className={`chord-btn-sm ${activeDegree === degree ? 'active' : ''}`}
                onClick={() => selectDegree(degree)}
              >
                {displayNote(root)}{CHORD_COMPACT[chordType]}
              </button>
            ))}
          </div>

          {/* Tension rows — visible only when a degree is active */}
          {activeDegree !== null && (
            <>
              <div className="extension-row">
                <button
                  className={`extension-btn ${sevenOn ? 'active' : ''}`}
                  onClick={toggleSeven}
                  title="Toggle 7th"
                >
                  7
                </button>
                {NATURAL_TENSIONS.map((t) => (
                  <button
                    key={t}
                    className={`extension-btn ${activeTensions.has(t) ? 'active' : ''}`}
                    onClick={() => toggleTension(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {showAlteredTensions && (
                <div className="extension-row altered-row">
                  {ALTERED_TENSIONS.map((t) => (
                    <button
                      key={t}
                      className={`extension-btn ${activeTensions.has(t) ? 'active' : ''}`}
                      onClick={() => toggleTension(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {onAddChordsToQueue && (
            <button className="add-queue-btn-sm" onClick={handleAddAllChordsToQueue}>+ All 7ths to queue</button>
          )}

          {/* ── SCALES section ──────────────────────────── */}
          <div className="theory-section-label">Scales</div>

          {/* Diatonic mode scale + pentatonic rows */}
          <div className="degree-scale-group">
            <div className="scale-row">
              {modeData.map(({ degree, modeRoot, scaleType }) => {
                const { chordType } = chordData[degree - 1];
                const isActive = activeDegree === null && selectedChordScale?.type === scaleType && selectedChordScale?.rootNote === modeRoot;
                return (
                  <button
                    key={degree}
                    className={`mode-btn scale-mode-btn ${isActive ? 'active' : ''}`}
                    onClick={() => selectModeScale(degree)}
                    title={`${displayNote(modeRoot)} ${MODE_SHORT[scaleType]}`}
                  >
                    <span className="mode-roman">{degreeLabel(degree, chordType)}</span>
                    <span className="mode-root">{displayNote(modeRoot)}</span>
                  </button>
                );
              })}
            </div>
            <div className="pent-row">
              {pentData.map(({ degree, root, pentatonicType }) => {
                const isActive = activeDegree === null && selectedChordScale?.type === pentatonicType && selectedChordScale?.rootNote === root;
                const label = displayNote(root) + (pentatonicType === 'pentatonic-minor' ? 'm' : '');
                return (
                  <button
                    key={degree}
                    className={`pent-btn ${isActive ? 'active' : ''}`}
                    onClick={() => handleOtherSelect(pentatonicType, root)}
                    title={`${displayNote(root)} ${pentatonicType === 'pentatonic-major' ? 'Major' : 'Minor'} Pentatonic`}
                  >
                    {label}♦
                  </button>
                );
              })}
            </div>
          </div>

          {/* Non-diatonic scales */}
          <div className="other-grid">
            {NON_DIATONIC_SCALES.map(({ type, label }) => (
              <button
                key={type}
                className={`other-btn ${selectedChordScale?.type === type && activeDegree === null ? 'active' : ''}`}
                onClick={() => handleOtherSelect(type)}
              >
                {label}
              </button>
            ))}
          </div>

          {onAddChordsToQueue && (
            <button className="add-queue-btn-sm" onClick={handleAddAllModesToQueue}>+ All modes to queue</button>
          )}

          {/* ── OTHER CHORDS section ─────────────────────── */}
          <div className="theory-section-label">Other Chords</div>
          <div className="other-grid">
            {OTHER_CHORDS.map(({ type, label }) => (
              <button
                key={type}
                className={`other-btn ${selectedChordScale?.type === type && activeDegree === null ? 'active' : ''}`}
                onClick={() => handleOtherSelect(type)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
