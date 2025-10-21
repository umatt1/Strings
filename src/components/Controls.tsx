import React from 'react';
import type { InstrumentConfig, NoteName, TuningPreset } from '../types/music';
import { 
  NOTES, 
  GUITAR_TUNINGS, 
  BASS_TUNINGS, 
  createInstrumentFromTuning 
} from '../types/music';
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
import './Controls.css';

interface ControlsProps {
  instrument: InstrumentConfig;
  onInstrumentChange: (instrument: InstrumentConfig) => void;
  numFrets: number;
  onNumFretsChange: (numFrets: number) => void;
  minFret: number;
  onMinFretChange: (minFret: number) => void;
  orientation: 'horizontal' | 'vertical';
  onOrientationChange: (orientation: 'horizontal' | 'vertical') => void;
  fretMarkerMode: 'dots' | 'numbers';
  onFretMarkerModeChange: (mode: 'dots' | 'numbers') => void;
  selectedChordScale?: ChordScale;
  onChordScaleChange: (chordScale: ChordScale | undefined) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onInstrumentChange,
  numFrets,
  onNumFretsChange,
  minFret,
  onMinFretChange,
  orientation,
  onOrientationChange,
  fretMarkerMode,
  onFretMarkerModeChange,
  selectedChordScale,
  onChordScaleChange,
}) => {
  const [rootNote, setRootNote] = React.useState<NoteName>('C');
  const [selectedTuning, setSelectedTuning] = React.useState<TuningPreset>(
    GUITAR_TUNINGS.find(t => t.id === 'standard')!
  );
  const [showChordDropdown, setShowChordDropdown] = React.useState(false);
  const [showScaleDropdown, setShowScaleDropdown] = React.useState(false);
  
  const isGuitarSelected = selectedTuning.category === 'guitar';
  const availableTunings = isGuitarSelected ? GUITAR_TUNINGS : BASS_TUNINGS;

  const handleInstrumentCategoryChange = (category: 'guitar' | 'bass') => {
    const defaultTuning = category === 'guitar' 
      ? GUITAR_TUNINGS.find(t => t.id === 'standard')!
      : BASS_TUNINGS.find(t => t.id === 'bass-standard')!;
    
    setSelectedTuning(defaultTuning);
    onInstrumentChange(createInstrumentFromTuning(defaultTuning));
  };

  const handleTuningChange = (tuningId: string) => {
    const tuning = availableTunings.find(t => t.id === tuningId);
    if (tuning) {
      setSelectedTuning(tuning);
      onInstrumentChange(createInstrumentFromTuning(tuning));
    }
  };

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
    <div className="controls">
      <div className="control-section">
        <h3>Instrument & Tuning</h3>
        <div className="instrument-controls">
          <div className="button-group">
            <button
              className={isGuitarSelected ? 'active' : ''}
              onClick={() => handleInstrumentCategoryChange('guitar')}
            >
              Guitar
            </button>
            <button
              className={!isGuitarSelected ? 'active' : ''}
              onClick={() => handleInstrumentCategoryChange('bass')}
            >
              Bass
            </button>
          </div>
          
          <div className="tuning-selector">
            <label>Tuning:</label>
            <select 
              value={selectedTuning.id} 
              onChange={(e) => handleTuningChange(e.target.value)}
            >
              {availableTunings.map((tuning) => (
                <option key={tuning.id} value={tuning.id}>
                  {tuning.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="control-section">
        <h3>Fret Range</h3>
        <div className="fret-range-controls">
          <div className="fret-control">
            <label>Minimum Fret:</label>
            <input
              type="range"
              min="0"
              max={numFrets}
              value={minFret}
              onChange={(e) => onMinFretChange(parseInt(e.target.value))}
            />
            <span className="value-display">{minFret}</span>
          </div>
          <div className="fret-control">
            <label>Maximum Frets:</label>
            <input
              type="range"
              min={minFret}
              max="24"
              value={numFrets}
              onChange={(e) => onNumFretsChange(parseInt(e.target.value))}
            />
            <span className="value-display">{numFrets}</span>
          </div>
        </div>
      </div>

      <div className="control-section">
        <h3>Orientation</h3>
        <div className="button-group">
          <button
            className={orientation === 'horizontal' ? 'active' : ''}
            onClick={() => onOrientationChange('horizontal')}
          >
            Horizontal
          </button>
          <button
            className={orientation === 'vertical' ? 'active' : ''}
            onClick={() => onOrientationChange('vertical')}
          >
            Vertical
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>Fret Markers</h3>
        <div className="button-group">
          <button
            className={fretMarkerMode === 'dots' ? 'active' : ''}
            onClick={() => onFretMarkerModeChange('dots')}
          >
            Dots
          </button>
          <button
            className={fretMarkerMode === 'numbers' ? 'active' : ''}
            onClick={() => onFretMarkerModeChange('numbers')}
          >
            Numbers
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>Music Theory</h3>
        <div className="music-theory-controls">
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
              <span className="no-selection">No chord or scale selected</span>
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
              <h4>All Chords</h4>
              <div className="dropdown-container">
                <button 
                  className="dropdown-toggle"
                  onClick={() => {
                    setShowChordDropdown(!showChordDropdown);
                    setShowScaleDropdown(false);
                  }}
                >
                  Browse Chords {showChordDropdown ? '▲' : '▼'}
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
              <h4>All Scales & Modes</h4>
              <div className="dropdown-container">
                <button 
                  className="dropdown-toggle"
                  onClick={() => {
                    setShowScaleDropdown(!showScaleDropdown);
                    setShowChordDropdown(false);
                  }}
                >
                  Browse Scales {showScaleDropdown ? '▲' : '▼'}
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
      </div>
    </div>
  );
};
