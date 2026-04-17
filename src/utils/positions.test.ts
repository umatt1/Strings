import { describe, it, expect } from 'vitest';
import type { InstrumentConfig } from '../types/music';
import { getNoteAtFret } from '../types/music';
import type { ChordScale } from './musicTheory';
import { calculatePositions } from './positions';

/**
 * Standard guitar tuning: strings array is high-to-low (index 0 = high E).
 * String indices: 0=E4, 1=B3, 2=G3, 3=D3, 4=A2, 5=E2
 */
const STANDARD_GUITAR: InstrumentConfig = {
  name: 'Standard Guitar',
  strings: [
    { openNote: 'E', octave: 4 },
    { openNote: 'B', octave: 3 },
    { openNote: 'G', octave: 3 },
    { openNote: 'D', octave: 3 },
    { openNote: 'A', octave: 2 },
    { openNote: 'E', octave: 2 },
  ],
};

/**
 * Convert string number (1=high E ... 6=low E) to our array index (0=high E ... 5=low E)
 * Guitar string 1 (high E) = array index 0, string 6 (low E) = array index 5
 */
function strIdx(guitarString: number): number {
  return guitarString - 1;
}

/**
 * Build a Set<"stringIndex-fret"> from a shape definition.
 * Input format: { [guitarStringNumber]: fret[] }
 */
function makeHighlightSet(shape: Record<number, number[]>): Set<string> {
  const set = new Set<string>();
  for (const [str, frets] of Object.entries(shape)) {
    for (const fret of frets) {
      set.add(`${strIdx(Number(str))}-${fret}`);
    }
  }
  return set;
}

// ============================================================
//  CAGED TEST DATA — verified against multiple online sources
//  (altguitar.com, appliedguitartheory.com, deftdigits.com)
// ============================================================

const C_IONIAN: ChordScale = {
  type: 'ionian',
  rootNote: 'C',
  notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
};

const G_IONIAN: ChordScale = {
  type: 'ionian',
  rootNote: 'G',
  notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'],
};

const A_IONIAN: ChordScale = {
  type: 'ionian',
  rootNote: 'A',
  notes: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'],
};

/**
 * Expected CAGED positions from verified sources.
 * Each entry: { shapeName, notes: { guitarString: frets[] } }
 */
const CAGED_C_MAJOR = [
  {
    shapeName: 'E Shape',
    notes: { 6: [8, 10], 5: [7, 8, 10], 4: [7, 9, 10], 3: [7, 9, 10], 2: [8, 10], 1: [7, 8, 10] },
  },
  {
    shapeName: 'D Shape',
    notes: { 6: [10, 12, 13], 5: [10, 12, 14], 4: [10, 12], 3: [9, 10, 12], 2: [10, 12, 13], 1: [10, 12, 13] },
  },
  {
    shapeName: 'C Shape',
    notes: { 6: [12, 13, 15], 5: [12, 14, 15], 4: [12, 14, 15], 3: [12, 14], 2: [12, 13, 15], 1: [12, 13, 15] },
  },
  {
    shapeName: 'A Shape',
    notes: { 6: [3, 5], 5: [2, 3, 5], 4: [2, 3, 5], 3: [2, 4, 5], 2: [3, 5], 1: [3, 5] },
  },
  {
    shapeName: 'G Shape',
    notes: { 6: [5, 7, 8], 5: [5, 7, 8], 4: [5, 7, 9], 3: [5, 7], 2: [5, 6, 8], 1: [5, 7, 8] },
  },
];

const CAGED_G_MAJOR = [
  {
    shapeName: 'E Shape',
    notes: { 6: [3, 5], 5: [2, 3, 5], 4: [2, 4, 5], 3: [2, 4, 5], 2: [3, 5], 1: [2, 3, 5] },
  },
  {
    shapeName: 'D Shape',
    notes: { 6: [5, 7, 8], 5: [5, 7, 9], 4: [5, 7], 3: [4, 5, 7], 2: [5, 7, 8], 1: [5, 7, 8] },
  },
  {
    shapeName: 'C Shape',
    notes: { 6: [7, 8, 10], 5: [7, 9, 10], 4: [7, 9, 10], 3: [7, 9], 2: [7, 8, 10], 1: [7, 8, 10] },
  },
  {
    shapeName: 'A Shape',
    notes: { 6: [10, 12], 5: [9, 10, 12], 4: [9, 10, 12], 3: [9, 11, 12], 2: [10, 12], 1: [10, 12] },
  },
  {
    shapeName: 'G Shape',
    notes: { 6: [12, 14, 15], 5: [12, 14, 15], 4: [12, 14, 16], 3: [12, 14], 2: [12, 13, 15], 1: [12, 14, 15] },
  },
];

const CAGED_A_MAJOR = [
  {
    shapeName: 'E Shape',
    notes: { 6: [5, 7], 5: [4, 5, 7], 4: [4, 6, 7], 3: [4, 6, 7], 2: [5, 7], 1: [4, 5, 7] },
  },
  {
    shapeName: 'D Shape',
    notes: { 6: [7, 9, 10], 5: [7, 9, 11], 4: [7, 9], 3: [6, 7, 9], 2: [7, 9, 10], 1: [7, 9, 10] },
  },
  {
    shapeName: 'C Shape',
    notes: { 6: [9, 10, 12], 5: [9, 11, 12], 4: [9, 11, 12], 3: [9, 11], 2: [9, 10, 12], 1: [9, 10, 12] },
  },
  {
    shapeName: 'A Shape',
    notes: { 6: [12, 14], 5: [11, 12, 14], 4: [11, 12, 14], 3: [11, 13, 14], 2: [12, 14], 1: [12, 14] },
  },
  {
    shapeName: 'G Shape',
    notes: { 6: [2, 4, 5], 5: [2, 4, 5], 4: [2, 4, 6], 3: [2, 4], 2: [2, 3, 5], 1: [2, 4, 5] },
  },
];

// ============================================================
//  Helper: find a position by shape name in computed results
// ============================================================

function findShape(positions: ReturnType<typeof calculatePositions>, shapeName: string) {
  // There may be multiple instances (tiled across octaves). Return all.
  return positions.filter((p) => p.name === shapeName);
}

/**
 * Check that the expected notes exist within at least one instance of the
 * named shape. Because CAGED tiles across octaves, we check each tiled
 * instance and pass if ANY instance contains ALL expected notes.
 */
function expectShapeContains(
  positions: ReturnType<typeof calculatePositions>,
  shapeName: string,
  expectedNotes: Record<number, number[]>
) {
  const instances = findShape(positions, shapeName);
  expect(instances.length).toBeGreaterThan(0);

  const expectedSet = makeHighlightSet(expectedNotes);
  const match = instances.some((instance) => {
    const actualSet = new Set(
      instance.highlights.map((h) => `${h.stringIndex}-${h.fretNumber}`)
    );
    for (const key of expectedSet) {
      if (!actualSet.has(key)) return false;
    }
    return true;
  });

  if (!match) {
    // Build detailed failure message
    const expectedArr = [...expectedSet].sort();
    const allActual = instances.map((inst, i) => {
      const s = new Set(inst.highlights.map((h) => `${h.stringIndex}-${h.fretNumber}`));
      const missing = expectedArr.filter((k) => !s.has(k));
      const extra = [...s].filter((k) => !expectedSet.has(k)).sort();
      return `  Instance ${i} (frets ${inst.startFret}-${inst.endFret}): missing=[${missing}], extra=[${extra}]`;
    });
    expect.fail(
      `No instance of "${shapeName}" contains all expected notes.\n` +
        `Expected: [${expectedArr}]\n` +
        allActual.join('\n')
    );
  }
}

// ============================================================
//  Tests
// ============================================================

describe('CAGED positions', () => {
  describe('C major', () => {
    const positions = calculatePositions(STANDARD_GUITAR, C_IONIAN, 'caged');

    it('produces positions with the 5 CAGED shape names', () => {
      const names = new Set(positions.map((p) => p.name));
      expect(names).toContain('E Shape');
      expect(names).toContain('D Shape');
      expect(names).toContain('C Shape');
      expect(names).toContain('A Shape');
      expect(names).toContain('G Shape');
    });

    for (const expected of CAGED_C_MAJOR) {
      it(`${expected.shapeName} contains all verified notes`, () => {
        expectShapeContains(positions, expected.shapeName, expected.notes);
      });
    }
  });

  describe('G major', () => {
    const positions = calculatePositions(STANDARD_GUITAR, G_IONIAN, 'caged');

    for (const expected of CAGED_G_MAJOR) {
      it(`${expected.shapeName} contains all verified notes`, () => {
        expectShapeContains(positions, expected.shapeName, expected.notes);
      });
    }
  });

  describe('A major', () => {
    const positions = calculatePositions(STANDARD_GUITAR, A_IONIAN, 'caged');

    for (const expected of CAGED_A_MAJOR) {
      it(`${expected.shapeName} contains all verified notes`, () => {
        expectShapeContains(positions, expected.shapeName, expected.notes);
      });
    }
  });
});

describe('CAGED — no stray notes outside shape boundary', () => {
  // Each shape instance should only contain notes within its startFret..endFret range
  const keys: [ChordScale, string][] = [
    [C_IONIAN, 'C major'],
    [G_IONIAN, 'G major'],
    [A_IONIAN, 'A major'],
  ];

  for (const [cs, label] of keys) {
    it(`${label}: all highlights within startFret..endFret`, () => {
      const positions = calculatePositions(STANDARD_GUITAR, cs, 'caged');
      for (const pos of positions) {
        for (const h of pos.highlights) {
          expect(h.fretNumber).toBeGreaterThanOrEqual(pos.startFret);
          expect(h.fretNumber).toBeLessThanOrEqual(pos.endFret);
        }
      }
    });
  }
});

describe('CAGED — shape note counts', () => {
  // Each CAGED shape for a 7-note scale should have exactly 15 notes
  it('C major: each shape instance has exactly the expected note count', () => {
    const positions = calculatePositions(STANDARD_GUITAR, C_IONIAN, 'caged');
    for (const expected of CAGED_C_MAJOR) {
      const expectedCount = Object.values(expected.notes).flat().length;
      const instances = findShape(positions, expected.shapeName);
      const matched = instances.some(
        (inst) => inst.highlights.length === expectedCount
      );
      if (!matched) {
        const counts = instances.map(i => `${i.highlights.length} (frets ${i.startFret}-${i.endFret})`);
        expect.fail(
          `${expected.shapeName}: expected ${expectedCount} notes, got [${counts}]`
        );
      }
    }
  });
});

describe('3NPS positions', () => {
  it('returns 7 positions for a 7-note scale', () => {
    const positions = calculatePositions(STANDARD_GUITAR, C_IONIAN, '3nps');
    expect(positions.length).toBe(7);
  });

  it('returns empty for pentatonic (5-note) scales', () => {
    const cPent: ChordScale = {
      type: 'pentatonic-major',
      rootNote: 'C',
      notes: ['C', 'D', 'E', 'G', 'A'],
    };
    const positions = calculatePositions(STANDARD_GUITAR, cPent, '3nps');
    expect(positions.length).toBe(0);
  });

  it('each position has exactly 3 notes per string (18 total for 6 strings)', () => {
    const positions = calculatePositions(STANDARD_GUITAR, C_IONIAN, '3nps');
    for (const pos of positions) {
      expect(pos.highlights.length).toBe(18);
      // Check each string has exactly 3
      for (let si = 0; si < 6; si++) {
        const count = pos.highlights.filter((h) => h.stringIndex === si).length;
        expect(count).toBe(3);
      }
    }
  });

  it('all highlighted notes are actually in the scale', () => {
    const positions = calculatePositions(STANDARD_GUITAR, G_IONIAN, '3nps');
    // getNoteAtFret imported at top
    for (const pos of positions) {
      for (const h of pos.highlights) {
        const str = STANDARD_GUITAR.strings[h.stringIndex];
        const note = getNoteAtFret(str.openNote, str.octave, h.fretNumber);
        expect(G_IONIAN.notes).toContain(note.name);
      }
    }
  });

  it('positions are sorted by startFret (ascending from nut)', () => {
    const positions = calculatePositions(STANDARD_GUITAR, C_IONIAN, '3nps');
    for (let i = 1; i < positions.length; i++) {
      expect(positions[i].startFret).toBeGreaterThanOrEqual(positions[i - 1].startFret);
    }
  });
});

describe('Mode positions', () => {
  it('returns 7 positions for a 7-note scale with mode names', () => {
    const positions = calculatePositions(STANDARD_GUITAR, C_IONIAN, 'modes');
    expect(positions.length).toBe(7);
    const modeNames = ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'];
    for (const modeName of modeNames) {
      expect(positions.some((p) => p.name.includes(modeName))).toBe(true);
    }
  });

  it('returns 5 positions for pentatonic scale (no mode names)', () => {
    const aPent: ChordScale = {
      type: 'pentatonic-minor',
      rootNote: 'A',
      notes: ['A', 'C', 'D', 'E', 'G'],
    };
    const positions = calculatePositions(STANDARD_GUITAR, aPent, 'modes');
    expect(positions.length).toBe(5);
    // No mode names for non-7-note scales
    for (const pos of positions) {
      expect(pos.name).not.toMatch(/Ionian|Dorian|Phrygian/);
    }
  });

  it('all highlighted notes are in the scale', () => {
    const positions = calculatePositions(STANDARD_GUITAR, C_IONIAN, 'modes');
    // getNoteAtFret imported at top
    for (const pos of positions) {
      for (const h of pos.highlights) {
        const str = STANDARD_GUITAR.strings[h.stringIndex];
        const note = getNoteAtFret(str.openNote, str.octave, h.fretNumber);
        expect(C_IONIAN.notes).toContain(note.name);
      }
    }
  });

  it('positions are sorted by startFret', () => {
    const positions = calculatePositions(STANDARD_GUITAR, C_IONIAN, 'modes');
    for (let i = 1; i < positions.length; i++) {
      expect(positions[i].startFret).toBeGreaterThanOrEqual(positions[i - 1].startFret);
    }
  });
});

describe('calculatePositions edge cases', () => {
  it('returns empty array for system "none"', () => {
    expect(calculatePositions(STANDARD_GUITAR, C_IONIAN, 'none')).toEqual([]);
  });
});
