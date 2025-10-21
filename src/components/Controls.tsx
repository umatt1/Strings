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
  orientation: 'horizontal' | 'vertical';
  onOrientationChange: (orientation: 'horizontal' | 'vertical') => void;
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
  orientation,
  onOrientationChange,
  fretMarkerMode,
  onFretMarkerModeChange,
  mirrorStrings,
  onMirrorStringsChange,
}) => {
  const [selectedTuning, setSelectedTuning] = React.useState<TuningPreset>(
    GUITAR_TUNINGS.find(t => t.id === 'standard')!
  );
  
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

  return (
    <div className="controls basic-controls-layout">
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
        <h3>Display Options</h3>
        <div className="display-options">
          <div className="option-group">
            <h4>Orientation</h4>
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

          <div className="option-group">
            <h4>Fret Markers</h4>
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

          <div className="option-group">
            <h4>String Order</h4>
            <div className="button-group">
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
                Mirrored
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
