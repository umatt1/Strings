import { getMusicTheoryNotes } from '../utils/musicTheory';
import type { QueueItem, PracticePreset } from '../types/practice';

function item(
  root: string,
  type: string,
  positionSystem: QueueItem['positionSystem'],
  positionIndex: number,
  displayMode: QueueItem['displayMode'],
  id: string
): QueueItem {
  const notes = getMusicTheoryNotes(root as never, type as never);
  return {
    id,
    chordScale: { type: type as never, rootNote: root as never, notes },
    positionSystem,
    positionIndex,
    displayMode,
  };
}

const G_MAJOR_NOTES = getMusicTheoryNotes('G', 'ionian');

const G_MAJOR_FLAT_ITEMS: QueueItem[] = [0, 1, 2, 3, 4, 5, 6].map((i) => ({
  id: `g-major-flat-${i}`,
  chordScale: { type: 'ionian', rootNote: 'G', notes: G_MAJOR_NOTES },
  positionSystem: 'flat',
  positionIndex: i,
  displayMode: 'scales',
}));

const G_MAJOR_3NPS_ITEMS: QueueItem[] = [0, 1, 2, 3, 4, 5, 6].map((i) => ({
  id: `g-major-3nps-${i}`,
  chordScale: { type: 'ionian', rootNote: 'G', notes: G_MAJOR_NOTES },
  positionSystem: '3nps',
  positionIndex: i,
  displayMode: 'scales',
}));

const G_MAJOR_ARPEGGIOS: QueueItem[] = [
  item('G', 'maj7',     'caged', 0, 'arpeggios', 'g-arp-0'),
  item('A', 'min7',     'caged', 0, 'arpeggios', 'g-arp-1'),
  item('B', 'min7',     'caged', 0, 'arpeggios', 'g-arp-2'),
  item('C', 'maj7',     'caged', 0, 'arpeggios', 'g-arp-3'),
  item('D', 'dom7',     'caged', 0, 'arpeggios', 'g-arp-4'),
  item('E', 'min7',     'caged', 0, 'arpeggios', 'g-arp-5'),
  item('F#','half-dim7','caged', 0, 'arpeggios', 'g-arp-6'),
];

// Autumn Leaves: each chord shown as its suggested scale in a 3NPS position.
// Cm7→C Dorian, F7→F Mixolydian, Bbmaj7→Bb Ionian, Ebmaj7→Eb Ionian,
// Am7b5→A Locrian, D7→D Mixolydian, Gm7→G Dorian
const AUTUMN_LEAVES: QueueItem[] = [
  item('C',  'dorian',     '3nps', 0, 'scales', 'al-0'),
  item('F',  'mixolydian', '3nps', 0, 'scales', 'al-1'),
  item('A#', 'ionian',     '3nps', 0, 'scales', 'al-2'),  // Bb Ionian
  item('D#', 'ionian',     '3nps', 0, 'scales', 'al-3'),  // Eb Ionian
  item('A',  'locrian',    '3nps', 0, 'scales', 'al-4'),
  item('D',  'mixolydian', '3nps', 0, 'scales', 'al-5'),
  item('G',  'dorian',     '3nps', 0, 'scales', 'al-6'),
];

export const PRESETS: PracticePreset[] = [
  {
    id: 'g-major-scale-workout',
    name: 'G Major Diatonic Scale Workout',
    items: [...G_MAJOR_FLAT_ITEMS, ...G_MAJOR_3NPS_ITEMS],
  },
  {
    id: 'g-major-arpeggios',
    name: 'G Major Diatonic 7th Arpeggios',
    items: G_MAJOR_ARPEGGIOS,
  },
  {
    id: 'autumn-leaves',
    name: 'Autumn Leaves (G minor)',
    items: AUTUMN_LEAVES,
  },
];
