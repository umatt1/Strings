import React from 'react';
import type { NoteName } from '../types/music';
import { NOTES, shouldUseSharp, toEnharmonic } from '../types/music';
import type {
  ChordType,
  ScaleType,
  ChordScale,
  MajorModeType,
  SeventhChordType,
} from '../utils/musicTheory';
import {
  CHORD_CATEGORIES,
  SCALE_CATEGORIES,
  CHORD_LABELS,
  SCALE_LABELS,
  getMusicTheoryNotes,
  getMusicTheoryLabel,
  getModesForKey,
  getDiatonicChords,
} from '../utils/musicTheory';
import type { QueueItem } from '../types/practice';
import './MusicTheoryControls.css';

interface MusicTheoryControlsProps {
  selectedChordScale?: ChordScale;
  onChordScaleChange: (chordScale: ChordScale | undefined) => void;
  onAddChordsToQueue?: (items: QueueItem[]) => void;
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const MODE_SHORT: Record<MajorModeType, string> = {
  ionian: 'Ionian', dorian: 'Dorian', phrygian: 'Phrygian', lydian: 'Lydian',
  mixolydian: 'Mixolydian', aeolian: 'Aeolian', locrian: 'Locrian',
};
const CHORD_COMPACT: Record<SeventhChordType, string> = {
  'maj7': 'maj7', 'min7': 'm7', 'dom7': '7', 'half-dim7': 'm7♭5',
  'dim7': 'dim7', 'min-maj7': 'mM7', 'aug-maj7': '+M7',
};

export const MusicTheoryControls: React.FC<MusicTheoryControlsProps> = ({
  selectedChordScale,
  onChordScaleChange,
  onAddChordsToQueue,
}) => {
  const [rootNote, setRootNote] = React.useState<NoteName>('C');
  const [keyType, setKeyType] = React.useState<'major' | 'minor'>('major');
  const [keyPopoutOpen, setKeyPopoutOpen] = React.useState(false);
  const [showChordDropdown, setShowChordDropdown] = React.useState(true);
  const [showScaleDropdown, setShowScaleDropdown] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // Relative major root for minor key pop-out content
  const relRootNote: NoteName = keyType === 'minor'
    ? NOTES[(NOTES.indexOf(rootNote) + 3) % 12]
    : rootNote;
  const useFlats = !shouldUseSharp(relRootNote);

  function displayNote(note: NoteName): string {
    if (!useFlats) return note;
    const enharmonic = toEnharmonic(note);
    return (enharmonic !== note ? enharmonic : note) as string;
  }

  const modeData = React.useMemo(
    () => getModesForKey(rootNote, keyType),
    [rootNote, keyType]
  );
  const chordData = React.useMemo(
    () => getDiatonicChords(rootNote, keyType),
    [rootNote, keyType]
  );

  const handleSelect = (type: ChordType | ScaleType, root: NoteName = rootNote) => {
    const notes = getMusicTheoryNotes(root, type);
    onChordScaleChange({ type, rootNote: root, notes });
  };

  const handleKeyTypeChange = (kt: 'major' | 'minor') => {
    setKeyType(kt);
    handleSelect(kt === 'major' ? 'ionian' : 'aeolian');
  };

  const handleRootNoteChange = (note: NoteName) => {
    setRootNote(note);
    if (selectedChordScale) {
      const notes = getMusicTheoryNotes(note, selectedChordScale.type);
      onChordScaleChange({ type: selectedChordScale.type, rootNote: note, notes });
    }
  };

  const handleAddAllChordsToQueue = () => {
    if (!onAddChordsToQueue) return;
    const items: QueueItem[] = chordData.map(({ root, chordType }, i) => ({
      id: `queue-chord-${root}-${chordType}-${i}`,
      chordScale: { type: chordType, rootNote: root, notes: getMusicTheoryNotes(root, chordType) },
      positionSystem: 'caged',
      positionIndex: 0,
      displayMode: 'arpeggios',
    }));
    onAddChordsToQueue(items);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setKeyPopoutOpen(false);
  };

  return (
    <div className={`music-theory-controls ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="theory-header" onClick={toggleCollapse}>
        <h3>🎼 Music Theory</h3>
        <button className="collapse-button">{isCollapsed ? '▶' : '◀'}</button>
      </div>

      {!isCollapsed && (
        <div className="theory-content">
          {/* Root note + Major / Minor toggle */}
          <div className="root-key-row">
            <select
              className="root-note-select"
              value={rootNote}
              onChange={(e) => handleRootNoteChange(e.target.value as NoteName)}
            >
              {NOTES.map((note) => (
                <option key={note} value={note}>{note}</option>
              ))}
            </select>
            <div className="key-type-toggle">
              <button
                className={`key-type-btn ${keyType === 'major' ? 'active' : ''}`}
                onClick={() => handleKeyTypeChange('major')}
              >
                Major
              </button>
              <button
                className={`key-type-btn ${keyType === 'minor' ? 'active' : ''}`}
                onClick={() => handleKeyTypeChange('minor')}
              >
                Minor
              </button>
            </div>
          </div>

          {/* Current Selection */}
          <div className="current-selection">
            {selectedChordScale ? (
              <div className="selection-display">
                <span className="selection-text">
                  {selectedChordScale.rootNote} {getMusicTheoryLabel(selectedChordScale.type)}
                </span>
                <button
                  className="clear-button"
                  onClick={() => onChordScaleChange(undefined)}
                  title="Clear selection"
                >
                  ✕
                </button>
              </div>
            ) : (
              <span className="no-selection">Select a chord or scale</span>
            )}
          </div>

          {/* All Chords dropdown */}
          <div className="dropdown-section">
            <div className="dropdown-container">
              <button
                className="dropdown-toggle"
                onClick={() => setShowChordDropdown(!showChordDropdown)}
              >
                All Chords {showChordDropdown ? '▲' : '▼'}
              </button>
              {showChordDropdown && (
                <div className="dropdown-content">
                  {Object.entries(CHORD_CATEGORIES).map(([category, chords]) => (
                    <div key={category} className="chord-category">
                      <div className="category-label">{category}</div>
                      <div className="category-items">
                        {chords.map((chord) => (
                          <button
                            key={chord}
                            className={selectedChordScale?.type === chord ? 'active' : ''}
                            onClick={() => handleSelect(chord)}
                          >
                            {CHORD_LABELS[chord]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                {displayNote(rootNote)} {keyType === 'major' ? 'Major' : 'Minor'}
                {keyType === 'minor' && (
                  <span className="popout-subheader"> (from {displayNote(relRootNote)} Major)</span>
                )}
              </div>

              {/* Mode buttons */}
              <div className="popout-section-label">Modes</div>
              <div className="mode-grid">
                {modeData.map(({ degree, modeRoot, scaleType }) => (
                  <button
                    key={degree}
                    className={`mode-btn ${selectedChordScale?.type === scaleType && selectedChordScale?.rootNote === modeRoot ? 'active' : ''}`}
                    onClick={() => handleSelect(scaleType, modeRoot)}
                    title={`${displayNote(modeRoot)} ${MODE_SHORT[scaleType]}`}
                  >
                    <span className="mode-roman">{ROMAN[degree - 1]}</span>
                    <span className="mode-root">{displayNote(modeRoot)}</span>
                  </button>
                ))}
              </div>

              {/* Diatonic 7th chord buttons */}
              <div className="popout-section-label">Diatonic 7th Chords</div>
              <div className="chord-grid">
                {chordData.map(({ degree, root, chordType }) => (
                  <button
                    key={degree}
                    className={`chord-btn-sm ${selectedChordScale?.type === chordType && selectedChordScale?.rootNote === root ? 'active' : ''}`}
                    onClick={() => handleSelect(chordType, root)}
                  >
                    {displayNote(root)}{CHORD_COMPACT[chordType]}
                  </button>
                ))}
              </div>

              {/* Add all to queue */}
              {onAddChordsToQueue && (
                <button className="add-queue-btn" onClick={handleAddAllChordsToQueue}>
                  + Add all 7th chords to queue
                </button>
              )}

              {/* Explicit scale picker */}
              <div className="popout-section-label">All Scales</div>
              <div className="dropdown-container">
                <button
                  className="dropdown-toggle"
                  onClick={() => setShowScaleDropdown(!showScaleDropdown)}
                >
                  Pick scale type {showScaleDropdown ? '▲' : '▼'}
                </button>
                {showScaleDropdown && (
                  <div className="dropdown-content">
                    {Object.entries(SCALE_CATEGORIES).map(([category, scales]) => (
                      <div key={category} className="scale-category">
                        <div className="category-label">{category}</div>
                        <div className="category-items">
                          {scales.map((scale) => (
                            <button
                              key={scale}
                              className={selectedChordScale?.type === scale ? 'active' : ''}
                              onClick={() => handleSelect(scale)}
                            >
                              {SCALE_LABELS[scale]}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
