import React from 'react';
import type { NoteName } from '../types/music';
import { NOTES, shouldUseSharp, toEnharmonic } from '../types/music';
import type {
  ChordType,
  ScaleType,
  ChordScale,
  MajorModeType,
  SeventhChordType,
  TriadType,
} from '../utils/musicTheory';
import {
  getMusicTheoryNotes,
  getMusicTheoryLabel,
  getModesForKey,
  getDiatonicChords,
  degreeLabel,
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

type Extension = 'triad' | 'add6' | '7th' | 'add9' | 'add11';

const TRIAD_FROM_SEVENTH: Record<SeventhChordType, TriadType> = {
  'maj7': 'major', 'min7': 'minor', 'dom7': 'major',
  'half-dim7': 'diminished', 'dim7': 'diminished',
  'min-maj7': 'minor', 'aug-maj7': 'augmented',
};

const CHORD_COMPACT: Record<SeventhChordType, string> = {
  'maj7': 'maj7', 'min7': 'm7', 'dom7': '7', 'half-dim7': 'ø7',
  'dim7': 'dim7', 'min-maj7': 'mM7', 'aug-maj7': '+M7',
};

const MODE_SHORT: Record<MajorModeType, string> = {
  ionian: 'Ionian', dorian: 'Dorian', phrygian: 'Phrygian', lydian: 'Lydian',
  mixolydian: 'Mixolydian', aeolian: 'Aeolian', locrian: 'Locrian',
};

const OTHER_TYPES: Array<{ type: ChordType | ScaleType; label: string }> = [
  // TODO: future "common substitutions" panel (tritone sub, bIII, bVII) — see separate proposal
  { type: 'augmented',        label: 'aug'    },
  { type: 'dim7',             label: 'dim7'   },
  { type: 'half-dim7',        label: 'ø7'     },
  { type: 'min-maj7',         label: 'mM7'    },
  { type: 'sus2',             label: 'sus2'   },
  { type: 'sus4',             label: 'sus4'   },
  { type: 'pentatonic-major', label: 'pent-M' },
  { type: 'pentatonic-minor', label: 'pent-m' },
  { type: 'harmonic-minor',   label: 'harm-m' },
  { type: 'melodic-minor',    label: 'mel-m'  },
  { type: 'blues-major',      label: 'blues-M'},
  { type: 'blues-minor',      label: 'blues-m'},
];

export const MusicTheoryControls: React.FC<MusicTheoryControlsProps> = ({
  selectedChordScale,
  onChordScaleChange,
  onDisplayModeChange,
  onAddChordsToQueue,
  onAddCurrentToQueue,
}) => {
  // keyRoot = the root shown in the dropdown (the KEY root, not the active chord root)
  const [keyRoot, setKeyRoot] = React.useState<NoteName>('C');
  const [keyType, setKeyType] = React.useState<'major' | 'minor'>('major');
  const [keyPopoutOpen, setKeyPopoutOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  // activeDegree: which diatonic degree (1-7) is selected; null = non-degree selection
  const [activeDegree, setActiveDegree] = React.useState<number | null>(null);
  const [activeExtension, setActiveExtension] = React.useState<Extension>('7th');

  const relRootNote: NoteName = keyType === 'minor'
    ? NOTES[(NOTES.indexOf(keyRoot) + 3) % 12]
    : keyRoot;
  const useFlats = !shouldUseSharp(relRootNote);

  function displayNote(note: NoteName): string {
    if (!useFlats) return note;
    const enharmonic = toEnharmonic(note);
    return (enharmonic !== note ? enharmonic : note) as string;
  }

  const modeData = React.useMemo(() => getModesForKey(keyRoot, keyType), [keyRoot, keyType]);
  const chordData = React.useMemo(() => getDiatonicChords(keyRoot, keyType), [keyRoot, keyType]);

  const selectDegreeWithExtension = (degree: number, ext: Extension) => {
    const { root, chordType: seventhType } = chordData[degree - 1];
    let type: ChordType;
    switch (ext) {
      case 'triad': type = TRIAD_FROM_SEVENTH[seventhType]; break;
      case 'add6':  type = 'add6'; break;
      case '7th':   type = seventhType; break;
      case 'add9':  type = 'add9'; break;
      case 'add11': type = 'add11'; break;
      // TODO: minor-quality extensions (minor add6, minor add9) need dedicated chord types
    }
    const notes = getMusicTheoryNotes(root, type);
    onChordScaleChange({ type, rootNote: root, notes });
    onDisplayModeChange?.('arpeggios');
    setActiveDegree(degree);
    setActiveExtension(ext);
  };

  const handleShowScale = () => {
    if (activeDegree === null) return;
    const { modeRoot, scaleType } = modeData[activeDegree - 1];
    onChordScaleChange({ type: scaleType, rootNote: modeRoot, notes: getMusicTheoryNotes(modeRoot, scaleType) });
    onDisplayModeChange?.('scales');
    // keep activeDegree so the extension row stays visible
  };

  const handleKeyTypeChange = (kt: 'major' | 'minor') => {
    setKeyType(kt);
    setActiveDegree(null);
    const type = kt === 'major' ? 'ionian' : 'aeolian';
    onChordScaleChange({ type, rootNote: keyRoot, notes: getMusicTheoryNotes(keyRoot, type) });
    onDisplayModeChange?.('scales');
  };

  const handleKeyRootChange = (note: NoteName) => {
    setKeyRoot(note);
    setActiveDegree(null);
    if (selectedChordScale) {
      onChordScaleChange({ type: selectedChordScale.type, rootNote: note, notes: getMusicTheoryNotes(note, selectedChordScale.type) });
    }
  };

  const handleOtherSelect = (type: ChordType | ScaleType) => {
    setActiveDegree(null);
    onChordScaleChange({ type, rootNote: keyRoot, notes: getMusicTheoryNotes(keyRoot, type) });
  };

  const handleAddAllChordsToQueue = () => {
    if (!onAddChordsToQueue) return;
    const items: QueueItem[] = chordData.map(({ root, chordType }, i) => ({
      id: `queue-chord-${root}-${chordType}-${i}-${Date.now()}`,
      chordScale: { type: chordType, rootNote: root, notes: getMusicTheoryNotes(root, chordType) },
      positionSystem: 'caged',
      positionIndex: 0,
      displayMode: 'arpeggios',
    }));
    onAddChordsToQueue(items);
  };

  const handleAddAllModesToQueue = () => {
    if (!onAddChordsToQueue) return;
    const items: QueueItem[] = modeData.map(({ modeRoot, scaleType }, i) => ({
      id: `queue-mode-${modeRoot}-${scaleType}-${i}-${Date.now()}`,
      chordScale: { type: scaleType, rootNote: modeRoot, notes: getMusicTheoryNotes(modeRoot, scaleType) },
      positionSystem: '3nps',
      positionIndex: 0,
      displayMode: 'scales',
    }));
    onAddChordsToQueue(items);
  };

  const isDegreeActive = (degree: number) => activeDegree === degree;
  const showScaleBtn = activeDegree !== null && selectedChordScale && selectedChordScale.rootNote === chordData[activeDegree - 1]?.root;

  return (
    <div className={`music-theory-controls ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="theory-header" onClick={() => { setIsCollapsed(!isCollapsed); setKeyPopoutOpen(false); }}>
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
                  {selectedChordScale.rootNote} {getMusicTheoryLabel(selectedChordScale.type)}
                </span>
                {showScaleBtn && (
                  <button className="show-scale-btn" onClick={handleShowScale} title="Switch to mode scale">
                    Scale
                  </button>
                )}
                {onAddCurrentToQueue && (
                  <button className="add-to-queue-btn-sm" onClick={onAddCurrentToQueue} title="Add to queue">
                    + Queue
                  </button>
                )}
                <button className="clear-button" onClick={() => { onChordScaleChange(undefined); setActiveDegree(null); }} title="Clear selection">✕</button>
              </div>
            ) : (
              <span className="no-selection">Select a chord or scale</span>
            )}
          </div>

          {/* Key pop-out toggle */}
          <button
            className={`key-popout-toggle ${keyPopoutOpen ? 'open' : ''}`}
            onClick={() => setKeyPopoutOpen(!keyPopoutOpen)}
          >
            Key ▸
          </button>

          {keyPopoutOpen && (
            <div className="key-popout">
              <div className="popout-header">
                {displayNote(keyRoot)} {keyType === 'major' ? 'Major' : 'Minor'}
                {keyType === 'minor' && (
                  <span className="popout-subheader"> ({displayNote(relRootNote)} Major)</span>
                )}
              </div>

              {/* Mode row — arpeggio-first on click */}
              <div className="popout-section-label">Modes</div>
              <div className="mode-grid">
                {modeData.map(({ degree, modeRoot, scaleType }) => {
                  const { chordType } = chordData[degree - 1];
                  return (
                    <button
                      key={degree}
                      className={`mode-btn ${isDegreeActive(degree) ? 'active' : ''}`}
                      onClick={() => selectDegreeWithExtension(degree, '7th')}
                      title={`${displayNote(modeRoot)} ${MODE_SHORT[scaleType]}`}
                    >
                      <span className="mode-roman">{degreeLabel(degree, chordType)}</span>
                      <span className="mode-root">{displayNote(modeRoot)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Diatonic 7th chord row */}
              <div className="chord-grid">
                {chordData.map(({ degree, root, chordType }) => (
                  <button
                    key={degree}
                    className={`chord-btn-sm ${isDegreeActive(degree) ? 'active' : ''}`}
                    onClick={() => selectDegreeWithExtension(degree, '7th')}
                  >
                    {displayNote(root)}{CHORD_COMPACT[chordType]}
                  </button>
                ))}
              </div>

              {/* Extension row — only when a degree is active */}
              {activeDegree !== null && (
                <div className="extension-row">
                  {(['triad', 'add6', '7th', 'add9', 'add11'] as Extension[]).map((ext) => (
                    <button
                      key={ext}
                      className={`extension-btn ${activeExtension === ext ? 'active' : ''}`}
                      onClick={() => selectDegreeWithExtension(activeDegree, ext)}
                    >
                      {ext === 'triad' ? 'triad' : ext === '7th' ? '7' : ext === 'add6' ? '6' : ext === 'add9' ? '9' : '11'}
                    </button>
                  ))}
                </div>
              )}

              {/* Add all buttons */}
              {onAddChordsToQueue && (
                <div className="add-all-row">
                  <button className="add-queue-btn-sm" onClick={handleAddAllModesToQueue}>+ All modes</button>
                  <button className="add-queue-btn-sm" onClick={handleAddAllChordsToQueue}>+ All 7ths</button>
                </div>
              )}
            </div>
          )}

          {/* Other / non-diatonic section */}
          <div className="other-section">
            <div className="other-section-label">Other</div>
            <div className="other-grid">
              {OTHER_TYPES.map(({ type, label }) => (
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
        </div>
      )}
    </div>
  );
};
