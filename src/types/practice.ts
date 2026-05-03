import type { ChordScale } from '../utils/musicTheory';
import type { PositionSystem, DisplayMode } from '../utils/positions';

export interface QueueItem {
  id: string;
  chordScale: ChordScale;
  positionSystem: PositionSystem;
  positionIndex: number;
  displayMode: DisplayMode;
  label?: string;
}

export interface PracticePreset {
  id: string;
  name: string;
  items: QueueItem[];
}
