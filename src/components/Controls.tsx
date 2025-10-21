import React from 'react';
import type { InstrumentConfig, NoteName } from '../types/music';
import { STANDARD_GUITAR, STANDARD_BASS, NOTES } from '../types/music';
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
  orientation: 'horizontal' | 'vertical';
  onOrientationChange: (orientation: 'horizontal' | 'vertical') => void;
  selectedChordScale?: ChordScale;
  onChordScaleChange: (chordScale: ChordScale | undefined) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  instrument,
  onInstrumentChange,
  numFrets,
  onNumFretsChange,
  orientation,
  onOrientationChange,
  selectedChordScale,
  onChordScaleChange,
}) => {
  const [rootNote, setRootNote] = React.useState<NoteName>('C');
  const [viewType, setViewType] = React.useState<'chord' | 'scale'>('chord');
  const [chordType, setChordType] = React.useState<ChordType>('major');
  const [scaleType, setScaleType] = React.useState<ScaleType>('pentatonic-major');

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
        <h3>Instrument</h3>
        <div className="button-group">
          <button
            className={instrument.name === STANDARD_GUITAR.name ? 'active' : ''}
            onClick={() => onInstrumentChange(STANDARD_GUITAR)}
          >
            Guitar
          </button>
          <button
            className={instrument.name === STANDARD_BASS.name ? 'active' : ''}
            onClick={() => onInstrumentChange(STANDARD_BASS)}
          >
            Bass
          </button>
        </div>
      </div>

      <div className="control-section">
        <h3>Number of Frets</h3>
        <input
          type="range"
          min="12"
          max="24"
          value={numFrets}
          onChange={(e) => onNumFretsChange(parseInt(e.target.value))}
        />
        <span className="value-display">{numFrets}</span>
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
