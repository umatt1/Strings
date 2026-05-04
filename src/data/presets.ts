import { getMusicTheoryNotes } from '../utils/musicTheory';
import type { QueueItem, PracticePreset } from '../types/practice';

function item(
  root: string,
  type: string,
  positionSystem: QueueItem['positionSystem'],
  positionIndex: number,
  displayMode: QueueItem['displayMode'],
  id: string,
  label?: string
): QueueItem {
  const notes = getMusicTheoryNotes(root as never, type as never);
  return {
    id,
    chordScale: { type: type as never, rootNote: root as never, notes },
    positionSystem,
    positionIndex,
    displayMode,
    ...(label !== undefined ? { label } : {}),
  };
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'] as const;

const G_MAJOR_NOTES = getMusicTheoryNotes('G', 'ionian');

const G_MAJOR_FLAT_ITEMS: QueueItem[] = [0, 1, 2, 3, 4, 5, 6].map((i) => ({
  id: `g-major-flat-${i}`,
  chordScale: { type: 'ionian', rootNote: 'G', notes: G_MAJOR_NOTES },
  positionSystem: 'none',
  positionIndex: 0,
  displayMode: 'scales',
  label: `G Ionian · Flat ${ROMAN[i]}`,
}));

const G_MAJOR_3NPS_ITEMS: QueueItem[] = [0, 1, 2, 3, 4, 5, 6].map((i) => ({
  id: `g-major-3nps-${i}`,
  chordScale: { type: 'ionian', rootNote: 'G', notes: G_MAJOR_NOTES },
  positionSystem: 'none',
  positionIndex: 0,
  displayMode: 'scales',
  label: `G Ionian · 3NPS ${ROMAN[i]}`,
}));

const G_MAJOR_ARPEGGIOS: QueueItem[] = [
  item('G', 'maj7',     'none', 0, 'arpeggios', 'g-arp-0', 'Gmaj7'),
  item('A', 'min7',     'none', 0, 'arpeggios', 'g-arp-1', 'Am7'),
  item('B', 'min7',     'none', 0, 'arpeggios', 'g-arp-2', 'Bm7'),
  item('C', 'maj7',     'none', 0, 'arpeggios', 'g-arp-3', 'Cmaj7'),
  item('D', 'dom7',     'none', 0, 'arpeggios', 'g-arp-4', 'D7'),
  item('E', 'min7',     'none', 0, 'arpeggios', 'g-arp-5', 'Em7'),
  item('F#','half-dim7','none', 0, 'arpeggios', 'g-arp-6', 'F#ø7'),
];

// Autumn Leaves: each chord shown as its suggested scale in a 3NPS position.
// Cm7→C Dorian, F7→F Mixolydian, Bbmaj7→Bb Ionian, Ebmaj7→Eb Ionian,
// Am7b5→A Locrian, D7→D Mixolydian, Gm7→G Dorian
const AUTUMN_LEAVES: QueueItem[] = [
  item('C',  'dorian',     'none', 0, 'scales', 'al-0', 'Cm7 (C Dorian)'),
  item('F',  'mixolydian', 'none', 0, 'scales', 'al-1', 'F7 (F Mixolydian)'),
  item('A#', 'ionian',     'none', 0, 'scales', 'al-2', 'Bb Ionian'),
  item('D#', 'ionian',     'none', 0, 'scales', 'al-3', 'Eb Ionian'),
  item('A',  'locrian',    'none', 0, 'scales', 'al-4', 'Am7b5 (A Locrian)'),
  item('D',  'mixolydian', 'none', 0, 'scales', 'al-5', 'D7 (D Mixolydian)'),
  item('G',  'dorian',     'none', 0, 'scales', 'al-6', 'Gm7 (G Dorian)'),
];

function bluesItem(root: string, id: string, label: string): QueueItem {
  return item(root, 'pentatonic-major', 'none', 0, 'scales', id, label);
}

// I-IV-I-V-IV-I in G: condensed 12-bar blues, each using major pentatonic in CAGED position
const G_BLUES: QueueItem[] = [
  bluesItem('G', 'blues-1', 'G Major Pent (I)'),
  bluesItem('C', 'blues-2', 'C Major Pent (IV)'),
  bluesItem('G', 'blues-3', 'G Major Pent (I)'),
  bluesItem('D', 'blues-4', 'D Major Pent (V)'),
  bluesItem('C', 'blues-5', 'C Major Pent (IV)'),
  bluesItem('G', 'blues-6', 'G Major Pent (I)'),
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
  {
    id: 'g-blues',
    name: 'G Blues (I–IV–I–V–IV–I)',
    items: G_BLUES,
  },
];
