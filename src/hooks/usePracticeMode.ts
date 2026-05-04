import { useState, useCallback, useEffect, useRef } from 'react';
import type { ChordScale } from '../utils/musicTheory';
import type { QueueItem } from '../types/practice';

interface QueueControls {
  queue: QueueItem[];
  queueIndex: number;
  timer: number | null;
  queueEditorOpen: boolean;
  setQueue: React.Dispatch<React.SetStateAction<QueueItem[]>>;
  setTimer: React.Dispatch<React.SetStateAction<number | null>>;
  setQueueEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  advanceQueue: () => void;
  retreatQueue: () => void;
  handleAddChordsToQueue: (items: QueueItem[]) => void;
  handleAddCurrentToQueue: () => void;
}

export function usePracticeMode(
  onItemActivated: (item: QueueItem) => void,
  getSelectedChordScale: () => ChordScale | undefined
): QueueControls {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [timer, setTimer] = useState<number | null>(null);
  const [queueEditorOpen, setQueueEditorOpen] = useState(false);

  // Stable refs to avoid stale closures
  const onItemActivatedRef = useRef(onItemActivated);
  onItemActivatedRef.current = onItemActivated;
  const getSelectedChordScaleRef = useRef(getSelectedChordScale);
  getSelectedChordScaleRef.current = getSelectedChordScale;

  const advanceQueue = useCallback(() => {
    if (queue.length === 0) return;
    setQueueIndex((prev) => (prev + 1) % queue.length);
  }, [queue.length]);

  const retreatQueue = useCallback(() => {
    if (queue.length === 0) return;
    setQueueIndex((prev) => (prev - 1 + queue.length) % queue.length);
  }, [queue.length]);

  // Apply queue item whenever queueIndex changes and queue is non-empty
  useEffect(() => {
    if (queue.length === 0) return;
    onItemActivatedRef.current(queue[queueIndex]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueIndex]);

  // When queue goes from empty → non-empty, activate the first item immediately
  const prevQueueLengthRef = useRef(0);
  useEffect(() => {
    const prev = prevQueueLengthRef.current;
    prevQueueLengthRef.current = queue.length;
    if (prev === 0 && queue.length > 0) {
      onItemActivatedRef.current(queue[0]);
      setQueueIndex(0);
    }
  }, [queue.length]);

  // Auto-advance timer
  const advanceQueueRef = useRef(advanceQueue);
  advanceQueueRef.current = advanceQueue;
  useEffect(() => {
    if (timer === null) return;
    const id = setInterval(() => advanceQueueRef.current(), timer * 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleAddChordsToQueue = useCallback((items: QueueItem[]) => {
    setQueue((prev) => [...prev, ...items]);
  }, []);

  const handleAddCurrentToQueue = useCallback(() => {
    const cs = getSelectedChordScaleRef.current();
    if (!cs) return;
    const newItem: QueueItem = {
      id: `q-${Date.now()}`,
      chordScale: cs,
      positionSystem: 'none',
      positionIndex: 0,
      displayMode: 'scales',
    };
    setQueue((prev) => [...prev, newItem]);
  }, []);

  return {
    queue,
    queueIndex,
    timer,
    queueEditorOpen,
    setQueue,
    setTimer,
    setQueueEditorOpen,
    advanceQueue,
    retreatQueue,
    handleAddChordsToQueue,
    handleAddCurrentToQueue,
  };
}
