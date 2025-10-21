import React from 'react';
import type { InstrumentConfig, TuningPreset } from '../types/music';
import { 
  GUITAR_TUNINGS, 
  BASS_TUNINGS, 
  createInstrumentFromTuning 
} from '../types/music';
import './Controls.css';

interface ControlsProps {
  instrument: InstrumentConfig;
  onInstrumentChange: (instrument: InstrumentConfig) => void;
  numFrets: number;
  onNumFretsChange: (numFrets: number) => void;
  minFret: number;
  onMinFretChange: (minFret: number) => void;
  fretMarkerMode: 'dots' | 'numbers';
  onFretMarkerModeChange: (mode: 'dots' | 'numbers') => void;
  mirrorStrings: boolean;
  onMirrorStringsChange: (mirror: boolean) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  onInstrumentChange,
  numFrets,
  onNumFretsChange,
  minFret,
  onMinFretChange,
  fretMarkerMode,
  onFretMarkerModeChange,
  mirrorStrings,
  onMirrorStringsChange,
}) => {
  const [selectedTuning, setSelectedTuning] = React.useState<TuningPreset>(
    GUITAR_TUNINGS.find(t => t.id === 'standard')!
  );
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  
  const isGuitarSelected = selectedTuning.category === 'guitar';
  const availableTunings = isGuitarSelected ? GUITAR_TUNINGS : BASS_TUNINGS;

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

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

  return (
    <div className={`controls ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="controls-header" onClick={toggleCollapse}>
        <h3>⚙️ Settings</h3>
        <button className="collapse-button">
          {isCollapsed ? '▼' : '▲'}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="controls-content">
          <div className="controls-horizontal-layout">
            {/* Instrument & Tuning Section */}
            <div className="control-group">
              <h4>Instrument</h4>
              <div className="button-group compact">
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
              <div className="tuning-selector compact">
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

        {/* Fret Range Section */}
        <div className="control-group">
          <h4>Fret Range</h4>
          <div className="range-controls">
            <div className="range-item">
              <label>Min:</label>
              <input
                type="range"
                min="0"
                max={numFrets}
                value={minFret}
                onChange={(e) => onMinFretChange(parseInt(e.target.value))}
              />
              <span className="value-display">{minFret}</span>
            </div>
            <div className="range-item">
              <label>Max:</label>
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

        {/* Display Options Section */}
        <div className="control-group">
          <h4>Display</h4>
          <div className="display-grid">
            <div className="option-subgroup">
              <label>Markers:</label>
              <div className="button-group compact">
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

            <div className="option-subgroup">
              <label>Strings:</label>
              <div className="button-group compact">
                <button
                  className={!mirrorStrings ? 'active' : ''}
                  onClick={() => onMirrorStringsChange(false)}
                >
                  Normal
                </button>
                <button
                  className={mirrorStrings ? 'active' : ''}
                  onClick={() => onMirrorStringsChange(true)}
                >
                  Mirror
                </button>
              </div>
            </div>
          </div>
        </div>
          </div>
        </div>
      )}
    </div>
  );
};
