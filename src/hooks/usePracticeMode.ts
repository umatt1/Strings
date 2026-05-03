import { useState, useCallback, useEffect, useRef } from 'react';
import type { ChordScale } from '../utils/musicTheory';
import type { PositionSystem, DisplayMode } from '../utils/positions';
import type { QueueItem } from '../types/practice';
import { PRESETS } from '../data/presets';

export interface RefSnapshot {
  selectedChordScale?: ChordScale;
  positionSystem: PositionSystem;
  positionIndex: number;
  displayMode: DisplayMode;
}

interface PracticeModeControls {
  practiceMode: boolean;
  queue: QueueItem[];
  queueIndex: number;
  timer: number | null;
  queueEditorOpen: boolean;
  setQueue: React.Dispatch<React.SetStateAction<QueueItem[]>>;
  setTimer: React.Dispatch<React.SetStateAction<number | null>>;
  setQueueEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  advanceQueue: () => void;
  retreatQueue: () => void;
  handlePracticeModeToggle: () => void;
  handleAddChordsToQueue: (items: QueueItem[]) => void;
  handleAddCurrentToQueue: () => void;
}

export function usePracticeMode(
  getCurrentSnapshot: () => RefSnapshot,
  applySnapshot: (snap: RefSnapshot) => void
): PracticeModeControls {
  const [practiceMode, setPracticeMode] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);
  const [queueEditorOpen, setQueueEditorOpen] = useState(false);
  const [refSnapshot, setRefSnapshot] = useState<RefSnapshot | null>(null);

  const setQueueFromItem = useCallback((item: QueueItem) => {
    applySnapshot({
      selectedChordScale: item.chordScale,
      positionSystem: item.positionSystem,
      positionIndex: item.positionIndex,
      displayMode: item.displayMode,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const advanceQueue = useCallback(() => {
    if (queue.length === 0) return;
    setQueueIndex((prev) => (prev + 1) % queue.length);
  }, [queue.length]);

  const retreatQueue = useCallback(() => {
    if (queue.length === 0) return;
    setQueueIndex((prev) => (prev - 1 + queue.length) % queue.length);
  }, [queue.length]);

  // Apply queue item whenever queueIndex changes in practice mode
  useEffect(() => {
    if (!practiceMode || queue.length === 0) return;
    setQueueFromItem(queue[queueIndex]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practiceMode, queueIndex]);

  // Auto-advance timer — use ref to avoid stale closure
  const advanceQueueRef = useRef(advanceQueue);
  advanceQueueRef.current = advanceQueue;
  useEffect(() => {
    if (!practiceMode || timer === null) return;
    const id = setInterval(() => advanceQueueRef.current(), timer * 1000);
    return () => clearInterval(id);
  }, [practiceMode, timer]);

  const handlePracticeModeToggle = useCallback(() => {
    if (!practiceMode) {
      setRefSnapshot(getCurrentSnapshot());
      let activeQueue = queue;
      if (queue.length === 0) {
        const defaultPreset = PRESETS.find((p) => p.id === 'g-major-scale-workout') ?? PRESETS[0];
        activeQueue = defaultPreset.items;
        setQueue(activeQueue);
      }
      setQueueIndex(0);
      if (activeQueue.length > 0) setQueueFromItem(activeQueue[0]);
      setPracticeMode(true);
    } else {
      setPracticeMode(false);
      if (refSnapshot) applySnapshot(refSnapshot);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [practiceMode, queue, refSnapshot]);

  const handleAddChordsToQueue = useCallback((items: QueueItem[]) => {
    setQueue((prev) => [...prev, ...items]);
  }, []);

  const handleAddCurrentToQueue = useCallback(() => {
    const snap = getCurrentSnapshot();
    if (!snap.selectedChordScale) return;
    const newItem: QueueItem = {
      id: `q-${Date.now()}`,
      chordScale: snap.selectedChordScale,
      positionSystem: snap.positionSystem,
      positionIndex: snap.positionIndex,
      displayMode: snap.displayMode,
    };
    setQueue((prev) => [...prev, newItem]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    practiceMode,
    queue,
    queueIndex,
    timer,
    queueEditorOpen,
    setQueue,
    setTimer,
    setQueueEditorOpen,
    advanceQueue,
    retreatQueue,
    handlePracticeModeToggle,
    handleAddChordsToQueue,
    handleAddCurrentToQueue,
  };
}
