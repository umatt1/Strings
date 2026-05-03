import React from 'react';
import type { QueueItem } from '../types/practice';
import { getMusicTheoryLabel } from '../utils/musicTheory';
import './PracticeBar.css';

interface PracticeBarProps {
  queue: QueueItem[];
  queueIndex: number;
  onAdvance: () => void;
  onRetreat: () => void;
  timer: number | null;
  onTimerChange: (seconds: number | null) => void;
  onEditQueue: () => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

function itemLabel(item: QueueItem): string {
  if (item.label) return item.label;
  return `${item.chordScale.rootNote} ${getMusicTheoryLabel(item.chordScale.type)} · pos ${item.positionIndex + 1}`;
}

export const PracticeBar: React.FC<PracticeBarProps> = ({
  queue,
  queueIndex,
  onAdvance,
  onRetreat,
  timer,
  onTimerChange,
  onEditQueue,
  containerRef,
}) => {
  const stripRef = React.useRef<HTMLDivElement>(null);

  // Scroll active item into view
  React.useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const active = strip.querySelector<HTMLElement>('.queue-item.active');
    if (active) {
      active.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
  }, [queueIndex]);

  return (
    <div className="practice-bar" ref={containerRef}>
      <div className="practice-bar-top">
        {/* Navigation */}
        <button className="pb-nav-btn" onClick={onRetreat} title="Previous (Shift+Space)">◀</button>

        {/* Queue strip */}
        <div className="queue-strip" ref={stripRef}>
          {queue.map((item, i) => (
            <div
              key={item.id}
              className={`queue-item ${i === queueIndex ? 'active' : ''}`}
              title={itemLabel(item)}
            >
              <span className="queue-item-label">{itemLabel(item)}</span>
              <span className="queue-item-mode">{item.displayMode}</span>
            </div>
          ))}
        </div>

        <button className="pb-nav-btn" onClick={onAdvance} title="Next (Space)">▶</button>
      </div>

      <div className="practice-bar-bottom">
        <span className="space-hint">Press Space to advance</span>

        {/* Timer control */}
        <div className="timer-control">
          <label className="timer-label">Auto:</label>
          <input
            type="number"
            className="timer-input"
            min={1}
            max={300}
            value={timer ?? ''}
            placeholder="—"
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              onTimerChange(isNaN(v) || v < 1 ? null : v);
            }}
          />
          <span className="timer-unit">s</span>
          {timer !== null && (
            <button className="timer-clear" onClick={() => onTimerChange(null)} title="Disable timer">✕</button>
          )}
        </div>

        <span className="queue-progress">
          {queueIndex + 1} / {queue.length}
        </span>

        <button className="edit-queue-btn" onClick={onEditQueue}>Edit Queue</button>
      </div>
    </div>
  );
};
