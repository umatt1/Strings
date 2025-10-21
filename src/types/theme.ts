export interface ColorTheme {
  name: string;
  fretboardBackground: string;
  gridBackground: string;
  stringBorder: string;
  fretBorder: string;
  nutBorder: string;
  noteDefault: string;
  noteBorder: string;
  noteText: string;
  scaleColors: {
    root: string;           // Degree 1 (most important)
    third: string;          // Degree 3
    fifth: string;          // Degree 5
    otherImportant: string; // Other important degrees
    second: string;         // Degree 2
    fourth: string;         // Degree 4
    sixth: string;          // Degree 6
    seventh: string;        // Degree 7
    others: string;         // Other degrees
  };
}

export const COLOR_THEMES: Record<string, ColorTheme> = {
  indigo: {
    name: 'Indigo (Default)',
    fretboardBackground: '#f5f5f5',
    gridBackground: '#ffffff',
    stringBorder: '#ddd',
    fretBorder: '#ddd',
    nutBorder: '#666',
    noteDefault: '#e8eaf6',
    noteBorder: '#9fa8da',
    noteText: '#333',
    scaleColors: {
      root: '#1a237e',
      third: '#3f51b5',
      fifth: '#5c6bc0',
      otherImportant: '#7986cb',
      second: '#9fa8da',
      fourth: '#c5cae9',
      sixth: '#e8eaf6',
      seventh: '#b39ddb',
      others: '#d1c4e9',
    },
  },
  warm: {
    name: 'Warm (Red/Orange)',
    fretboardBackground: '#fff3e0',
    gridBackground: '#fffaf0',
    stringBorder: '#ffe0b2',
    fretBorder: '#ffcc80',
    nutBorder: '#e65100',
    noteDefault: '#fff3e0',
    noteBorder: '#ff9800',
    noteText: '#333',
    scaleColors: {
      root: '#b71c1c',
      third: '#d32f2f',
      fifth: '#f44336',
      otherImportant: '#ef5350',
      second: '#ff5722',
      fourth: '#ff7043',
      sixth: '#ff8a65',
      seventh: '#ffab91',
      others: '#ffccbc',
    },
  },
  cool: {
    name: 'Cool (Teal/Cyan)',
    fretboardBackground: '#e0f2f1',
    gridBackground: '#f0fffe',
    stringBorder: '#b2dfdb',
    fretBorder: '#80cbc4',
    nutBorder: '#004d40',
    noteDefault: '#e0f7fa',
    noteBorder: '#4dd0e1',
    noteText: '#333',
    scaleColors: {
      root: '#006064',
      third: '#00838f',
      fifth: '#0097a7',
      otherImportant: '#00acc1',
      second: '#26c6da',
      fourth: '#4dd0e1',
      sixth: '#80deea',
      seventh: '#b2ebf2',
      others: '#e0f7fa',
    },
  },
  forest: {
    name: 'Forest (Green)',
    fretboardBackground: '#e8f5e9',
    gridBackground: '#f1f8f4',
    stringBorder: '#c8e6c9',
    fretBorder: '#a5d6a7',
    nutBorder: '#1b5e20',
    noteDefault: '#e8f5e9',
    noteBorder: '#66bb6a',
    noteText: '#333',
    scaleColors: {
      root: '#1b5e20',
      third: '#2e7d32',
      fifth: '#388e3c',
      otherImportant: '#43a047',
      second: '#66bb6a',
      fourth: '#81c784',
      sixth: '#a5d6a7',
      seventh: '#c8e6c9',
      others: '#e8f5e9',
    },
  },
  sunset: {
    name: 'Sunset (Purple/Pink)',
    fretboardBackground: '#fce4ec',
    gridBackground: '#fff5f8',
    stringBorder: '#f8bbd0',
    fretBorder: '#f48fb1',
    nutBorder: '#880e4f',
    noteDefault: '#f3e5f5',
    noteBorder: '#ba68c8',
    noteText: '#333',
    scaleColors: {
      root: '#4a148c',
      third: '#6a1b9a',
      fifth: '#7b1fa2',
      otherImportant: '#8e24aa',
      second: '#ab47bc',
      fourth: '#ba68c8',
      sixth: '#ce93d8',
      seventh: '#e1bee7',
      others: '#f3e5f5',
    },
  },
  classic: {
    name: 'Classic (Wood)',
    fretboardBackground: '#8B4513',
    gridBackground: '#2C1810',
    stringBorder: '#654321',
    fretBorder: '#8B4513',
    nutBorder: '#2C1810',
    noteDefault: '#CD853F',
    noteBorder: '#8B4513',
    noteText: '#fff',
    scaleColors: {
      root: '#D73027',
      third: '#FC8D59',
      fifth: '#FEE08B',
      otherImportant: '#E0F3F8',
      second: '#FDAE61',
      fourth: '#FFFFBF',
      sixth: '#ABD9E9',
      seventh: '#74ADD1',
      others: '#4575B4',
    },
  },
};
