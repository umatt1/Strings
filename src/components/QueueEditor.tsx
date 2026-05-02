import React from 'react';
import type { NoteName } from '../types/music';
import { NOTES } from '../types/music';
import type { ChordType, ScaleType } from '../utils/musicTheory';
import {
  CHORD_CATEGORIES,
  SCALE_CATEGORIES,
  CHORD_LABELS,
  SCALE_LABELS,
  getMusicTheoryNotes,
  suggestScale,
  isChordType,
} from '../utils/musicTheory';
import type { QueueItem, PracticePreset } from '../types/practice';
import './QueueEditor.css';

interface QueueEditorProps {
  queue: QueueItem[];
  onQueueChange: (queue: QueueItem[]) => void;
  presets: PracticePreset[];
  onClose: () => void;
}

function itemLabel(item: QueueItem): string {
  return `${item.chordScale.rootNote} ${item.chordScale.type}`;
}

function makeId(): string {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const QueueEditor: React.FC<QueueEditorProps> = ({
  queue,
  onQueueChange,
  presets,
  onClose,
}) => {
  const [addRoot, setAddRoot] = React.useState<NoteName>('C');
  const [addType, setAddType] = React.useState<ChordType | ScaleType>('min7');
  const [showAddPicker, setShowAddPicker] = React.useState(false);

  const removeItem = (id: string) => {
    onQueueChange(queue.filter((item) => item.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...queue];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onQueueChange(next);
  };

  const moveDown = (index: number) => {
    if (index === queue.length - 1) return;
    const next = [...queue];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onQueueChange(next);
  };

  const addItem = () => {
    const notes = getMusicTheoryNotes(addRoot, addType);
    // For chord types, suggest a scale; default displayMode = 'arpeggios'
    const suggested = isChordType(addType) ? suggestScale(addType as ChordType) : undefined;
    const newItem: QueueItem = {
      id: makeId(),
      chordScale: { type: addType, rootNote: addRoot, notes },
      positionSystem: '3nps',
      positionIndex: 0,
      displayMode: suggested ? 'scales' : 'scales',
    };
    onQueueChange([...queue, newItem]);
    setShowAddPicker(false);
  };

  const loadPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) onQueueChange(preset.items);
  };

  return (
    <div className="queue-editor-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="queue-editor">
        <div className="qe-header">
          <h3>Edit Queue</h3>
          <div className="qe-header-actions">
            {/* TODO: URL encoding for sharing */}
            <button className="share-btn" disabled title="Share (coming soon)">Share</button>
            <button className="qe-close" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Preset picker */}
        <div className="qe-section">
          <label className="qe-section-label">Load preset</label>
          <select
            className="preset-select"
            defaultValue=""
            onChange={(e) => { if (e.target.value) loadPreset(e.target.value); e.target.value = ''; }}
          >
            <option value="" disabled>Choose preset…</option>
            {presets.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Queue list */}
        <div className="qe-section">
          <label className="qe-section-label">Queue ({queue.length} items)</label>
          {queue.length === 0 ? (
            <p className="qe-empty">Queue is empty. Add items or load a preset.</p>
          ) : (
            <ol className="queue-list">
              {queue.map((item, i) => (
                <li key={item.id} className="queue-list-item">
                  <span className="qli-num">{i + 1}</span>
                  <span className="qli-label">{itemLabel(item)}</span>
                  <span className="qli-meta">{item.positionSystem} · {item.displayMode}</span>
                  <div className="qli-actions">
                    <button onClick={() => moveUp(i)} disabled={i === 0} title="Move up">↑</button>
                    <button onClick={() => moveDown(i)} disabled={i === queue.length - 1} title="Move down">↓</button>
                    <button onClick={() => removeItem(item.id)} title="Remove" className="qli-remove">×</button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Add item */}
        <div className="qe-section">
          <button
            className="add-item-toggle"
            onClick={() => setShowAddPicker(!showAddPicker)}
          >
            {showAddPicker ? '▲ Cancel' : '+ Add Item'}
          </button>

          {showAddPicker && (
            <div className="add-item-picker">
              <div className="add-item-row">
                <select
                  value={addRoot}
                  onChange={(e) => setAddRoot(e.target.value as NoteName)}
                  className="add-root-select"
                >
                  {NOTES.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <select
                  value={addType}
                  onChange={(e) => setAddType(e.target.value as ChordType | ScaleType)}
                  className="add-type-select"
                >
                  <optgroup label="Chords">
                    {Object.entries(CHORD_CATEGORIES).map(([cat, types]) => (
                      <optgroup key={cat} label={`  ${cat}`}>
                        {types.map((t) => (
                          <option key={t} value={t}>{CHORD_LABELS[t]}</option>
                        ))}
                      </optgroup>
                    ))}
                  </optgroup>
                  <optgroup label="Scales">
                    {Object.entries(SCALE_CATEGORIES).map(([cat, types]) => (
                      <optgroup key={cat} label={`  ${cat}`}>
                        {types.map((t) => (
                          <option key={t} value={t}>{SCALE_LABELS[t]}</option>
                        ))}
                      </optgroup>
                    ))}
                  </optgroup>
                </select>
                <button className="add-item-confirm" onClick={addItem}>Add</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
