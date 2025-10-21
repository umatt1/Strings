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
  CHORD_LABELS, 
  SCALE_LABELS,
  getChordNotes,
  getScaleNotes,
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
  selectedChordScale,
  onChordScaleChange,
}) => {
  const [rootNote, setRootNote] = React.useState<NoteName>('C');
  const [viewType, setViewType] = React.useState<'chord' | 'scale'>('chord');
  const [chordType, setChordType] = React.useState<ChordType>('major');
  const [scaleType, setScaleType] = React.useState<ScaleType>('pentatonic-major');
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

  const handleViewChange = (type: 'none' | ChordType | ScaleType) => {
    if (type === 'none') {
      onChordScaleChange(undefined);
    } else if (['major', 'minor', 'major-triad', 'minor-triad'].includes(type)) {
      const chordT = type as ChordType;
      setViewType('chord');
      setChordType(chordT);
      const notes = getChordNotes(rootNote, chordT);
      onChordScaleChange({
        type: chordT,
        rootNote,
        notes,
      });
    } else {
      const scaleT = type as ScaleType;
      setViewType('scale');
      setScaleType(scaleT);
      const notes = getScaleNotes(rootNote, scaleT);
      onChordScaleChange({
        type: scaleT,
        rootNote,
        notes,
      });
    }
  };

  const handleRootNoteChange = (note: NoteName) => {
    setRootNote(note);
    if (selectedChordScale) {
      if (viewType === 'chord') {
        const notes = getChordNotes(note, chordType);
        onChordScaleChange({
          type: chordType,
          rootNote: note,
          notes,
        });
      } else {
        const notes = getScaleNotes(note, scaleType);
        onChordScaleChange({
          type: scaleType,
          rootNote: note,
          notes,
        });
      }
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
        <h3>View</h3>
        <div className="view-controls">
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
          
          <div className="view-selector">
            <button
              className={!selectedChordScale ? 'active' : ''}
              onClick={() => handleViewChange('none')}
            >
              None
            </button>
            <button
              className={selectedChordScale?.type === 'major' ? 'active' : ''}
              onClick={() => handleViewChange('major')}
            >
              {CHORD_LABELS.major}
            </button>
            <button
              className={selectedChordScale?.type === 'minor' ? 'active' : ''}
              onClick={() => handleViewChange('minor')}
            >
              {CHORD_LABELS.minor}
            </button>
            <button
              className={selectedChordScale?.type === 'major-triad' ? 'active' : ''}
              onClick={() => handleViewChange('major-triad')}
            >
              {CHORD_LABELS['major-triad']}
            </button>
            <button
              className={selectedChordScale?.type === 'minor-triad' ? 'active' : ''}
              onClick={() => handleViewChange('minor-triad')}
            >
              {CHORD_LABELS['minor-triad']}
            </button>
            <button
              className={selectedChordScale?.type === 'pentatonic-major' ? 'active' : ''}
              onClick={() => handleViewChange('pentatonic-major')}
            >
              {SCALE_LABELS['pentatonic-major']}
            </button>
            <button
              className={selectedChordScale?.type === 'pentatonic-minor' ? 'active' : ''}
              onClick={() => handleViewChange('pentatonic-minor')}
            >
              {SCALE_LABELS['pentatonic-minor']}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
