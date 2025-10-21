import React from 'react';
import type { NoteName } from '../types/music';
import { NOTES } from '../types/music';
import type { 
  ChordType, 
  ScaleType,
  ChordScale
} from '../utils/musicTheory';
import { 
  CHORD_CATEGORIES,
  SCALE_CATEGORIES,
  COMMON_CHORDS,
  COMMON_SCALES,
  CHORD_LABELS, 
  SCALE_LABELS,
  getMusicTheoryNotes,
  getMusicTheoryLabel,
} from '../utils/musicTheory';
import './MusicTheoryControls.css';

interface MusicTheoryControlsProps {
  selectedChordScale?: ChordScale;
  onChordScaleChange: (chordScale: ChordScale | undefined) => void;
}

export const MusicTheoryControls: React.FC<MusicTheoryControlsProps> = ({
  selectedChordScale,
  onChordScaleChange,
}) => {
  const [rootNote, setRootNote] = React.useState<NoteName>('C');
  const [showChordDropdown, setShowChordDropdown] = React.useState(false);
  const [showScaleDropdown, setShowScaleDropdown] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const handleMusicTheorySelection = (type: ChordType | ScaleType) => {
    const notes = getMusicTheoryNotes(rootNote, type);
    onChordScaleChange({
      type,
      rootNote,
      notes,
    });
    setShowChordDropdown(false);
    setShowScaleDropdown(false);
  };

  const handleClearSelection = () => {
    onChordScaleChange(undefined);
    setShowChordDropdown(false);
    setShowScaleDropdown(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    setShowChordDropdown(false);
    setShowScaleDropdown(false);
  };

  const handleRootNoteChange = (note: NoteName) => {
    setRootNote(note);
    if (selectedChordScale) {
      const notes = getMusicTheoryNotes(note, selectedChordScale.type);
      onChordScaleChange({
        type: selectedChordScale.type,
        rootNote: note,
        notes,
      });
    }
  };

  return (
    <div className={`music-theory-controls ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="theory-header" onClick={toggleCollapse}>
        <h3>🎼 Music Theory</h3>
        <button className="collapse-button">
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="theory-content">
          <div className="root-note-selector">
            <label>Root Note:</label>
            <select value={rootNote} onChange={(e) => handleRootNoteChange(e.target.value as NoteName)}>
              {NOTES.map((note) => (
                <option key={note} value={note}>
                  {note}
                </option>
              ))}
            </select>
          </div>

        {/* Current Selection Display */}
        <div className="current-selection">
          {selectedChordScale ? (
            <div className="selection-display">
              <span className="selection-text">
                {rootNote} {getMusicTheoryLabel(selectedChordScale.type)}
              </span>
              <button 
                className="clear-button"
                onClick={handleClearSelection}
                title="Clear selection"
              >
                ✕
              </button>
            </div>
          ) : (
            <span className="no-selection">Select a chord or scale</span>
          )}
        </div>

        {/* Quick Access - Most Common */}
        <div className="quick-access">
          <h4>Quick Access</h4>
          <div className="quick-buttons">
            {COMMON_CHORDS.map((chord) => (
              <button
                key={chord}
                className={selectedChordScale?.type === chord ? 'active' : ''}
                onClick={() => handleMusicTheorySelection(chord)}
              >
                {CHORD_LABELS[chord]}
              </button>
            ))}
          </div>
          <div className="quick-buttons">
            {COMMON_SCALES.map((scale) => (
              <button
                key={scale}
                className={selectedChordScale?.type === scale ? 'active' : ''}
                onClick={() => handleMusicTheorySelection(scale)}
              >
                {SCALE_LABELS[scale]}
              </button>
            ))}
          </div>
        </div>

        {/* Comprehensive Dropdowns */}
        <div className="comprehensive-selectors">
          <div className="dropdown-section">
            <div className="dropdown-container">
              <button 
                className="dropdown-toggle"
                onClick={() => {
                  setShowChordDropdown(!showChordDropdown);
                  setShowScaleDropdown(false);
                }}
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
                            onClick={() => handleMusicTheorySelection(chord)}
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

          <div className="dropdown-section">
            <div className="dropdown-container">
              <button 
                className="dropdown-toggle"
                onClick={() => {
                  setShowScaleDropdown(!showScaleDropdown);
                  setShowChordDropdown(false);
                }}
              >
                All Scales {showScaleDropdown ? '▲' : '▼'}
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
                            onClick={() => handleMusicTheorySelection(scale)}
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
          </div>
        </div>
        )}
    </div>
  );
};