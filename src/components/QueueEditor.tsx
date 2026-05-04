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

export function itemLabel(item: QueueItem): string {
  if (item.label) return item.label;
  return `${item.chordScale.rootNote} ${item.chordScale.type} · pos ${item.positionIndex + 1}`;
}

function makeId(): string {
  return `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface DraftState {
  rootNote: NoteName;
  type: ChordType | ScaleType;
  positionSystem: QueueItem['positionSystem'];
  positionIndex: number;
  displayMode: QueueItem['displayMode'];
  label: string;
}

function draftFromItem(item: QueueItem): DraftState {
  return {
    rootNote: item.chordScale.rootNote,
    type: item.chordScale.type as ChordType | ScaleType,
    positionSystem: item.positionSystem,
    positionIndex: item.positionIndex,
    displayMode: item.displayMode,
    label: item.label ?? '',
  };
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
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<DraftState | null>(null);

  const openEdit = (item: QueueItem) => {
    setEditingId(item.id);
    setDraft(draftFromItem(item));
  };

  const closeEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const confirmEdit = (id: string) => {
    if (!draft) return;
    const notes = getMusicTheoryNotes(draft.rootNote, draft.type as never);
    onQueueChange(queue.map((item) =>
      item.id === id
        ? {
            ...item,
            chordScale: { type: draft.type as never, rootNote: draft.rootNote, notes },
            positionSystem: draft.positionSystem,
            positionIndex: draft.positionIndex,
            displayMode: draft.displayMode,
            label: draft.label.trim() || undefined,
          }
        : item
    ));
    closeEdit();
  };

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
    const newItem: QueueItem = {
      id: makeId(),
      chordScale: { type: addType as never, rootNote: addRoot, notes },
      positionSystem: 'none',
      positionIndex: 0,
      displayMode: isChordType(addType) ? 'arpeggios' : 'scales',
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
        <div className="qe-section qe-section-list">
          <label className="qe-section-label">Queue ({queue.length} items)</label>
          {queue.length === 0 ? (
            <p className="qe-empty">Queue is empty. Add items or load a preset.</p>
          ) : (
            <ol className="queue-list">
              {queue.map((item, i) => (
                <li key={item.id} className={`queue-list-item ${editingId === item.id ? 'editing' : ''}`}>
                  {editingId === item.id && draft ? (
                    <div className="qli-edit-form">
                      <div className="qli-edit-row">
                        <select
                          className="qli-edit-select qli-edit-root"
                          value={draft.rootNote}
                          onChange={(e) => setDraft({ ...draft, rootNote: e.target.value as NoteName })}
                        >
                          {NOTES.map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                        <select
                          className="qli-edit-select qli-edit-type"
                          value={draft.type}
                          onChange={(e) => setDraft({ ...draft, type: e.target.value as ChordType | ScaleType })}
                        >
                          <optgroup label="Chords">
                            {Object.entries(CHORD_CATEGORIES).map(([cat, types]) => (
                              <optgroup key={cat} label={`  ${cat}`}>
                                {types.map((t) => <option key={t} value={t}>{CHORD_LABELS[t]}</option>)}
                              </optgroup>
                            ))}
                          </optgroup>
                          <optgroup label="Scales">
                            {Object.entries(SCALE_CATEGORIES).map(([cat, types]) => (
                              <optgroup key={cat} label={`  ${cat}`}>
                                {types.map((t) => <option key={t} value={t}>{SCALE_LABELS[t]}</option>)}
                              </optgroup>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                      <div className="qli-edit-row">
                        <select
                          className="qli-edit-select"
                          value={draft.positionSystem}
                          onChange={(e) => setDraft({ ...draft, positionSystem: e.target.value as QueueItem['positionSystem'] })}
                        >
                          <option value="none">No position</option>
                          <option value="flat">Flat</option>
                          <option value="3nps">3NPS</option>
                          <option value="caged">CAGED</option>
                        </select>
                        <input
                          type="number"
                          className="qli-edit-pos"
                          min={0}
                          value={draft.positionIndex}
                          onChange={(e) => setDraft({ ...draft, positionIndex: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                          title="Position index (0-based)"
                        />
                        <select
                          className="qli-edit-select"
                          value={draft.displayMode}
                          onChange={(e) => setDraft({ ...draft, displayMode: e.target.value as QueueItem['displayMode'] })}
                        >
                          <option value="scales">All Notes</option>
                          <option value="arpeggios">Chord Tones</option>
                          <option value="chords">Triad</option>
                        </select>
                      </div>
                      <div className="qli-edit-row">
                        <input
                          type="text"
                          className="qli-edit-label"
                          placeholder="Custom label (optional)"
                          value={draft.label}
                          onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                        />
                      </div>
                      <div className="qli-edit-actions">
                        <button className="qli-confirm" onClick={() => confirmEdit(item.id)}>✓ Confirm</button>
                        <button className="qli-cancel" onClick={closeEdit}>✕ Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="qli-num">{i + 1}</span>
                      <span className="qli-label">{itemLabel(item)}</span>
                      <span className="qli-meta">{item.positionSystem} · {item.displayMode}</span>
                      <div className="qli-actions">
                        <button onClick={() => openEdit(item)} title="Edit">✎</button>
                        <button onClick={() => moveUp(i)} disabled={i === 0} title="Move up">↑</button>
                        <button onClick={() => moveDown(i)} disabled={i === queue.length - 1} title="Move down">↓</button>
                        <button onClick={() => removeItem(item.id)} title="Remove" className="qli-remove">×</button>
                      </div>
                    </>
                  )}
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
