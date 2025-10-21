# Interactive Fretboard 🎸

A React-based interactive fretboard application for practicing guitar and bass. Click on notes to play them and select chords or scales to visualize patterns across the fretboard.

## Features

- **Multiple Instruments**: Switch between standard guitar (6 strings) and bass (4 strings) tunings
- **Interactive Notes**: Click any note on the fretboard to hear it played using Web Audio API
- **Adjustable Fret Range**: Display anywhere from 12 to 24 frets
- **Flexible Display**: Choose between horizontal or vertical fretboard orientations
- **Music Theory Visualization**: Highlight patterns for:
  - Major chords
  - Minor chords
  - Major triads
  - Minor triads
  - Major pentatonic scales
  - Minor pentatonic scales
- **Root Note Selection**: Change the root note (C, C#, D, etc.) for any chord or scale
- **Playback Features**:
  - Play all highlighted notes
  - Play scale in ascending order
- **Responsive Design**: Works on desktop and mobile devices

## Demo

![Initial Fretboard](https://github.com/user-attachments/assets/4aadd520-43a7-409f-aaf8-37bf52a2c967)

![C Major Chord Highlighted](https://github.com/user-attachments/assets/345e9516-aa4b-49c9-8abe-5b1b85e162c7)

![Bass Guitar](https://github.com/user-attachments/assets/6d295112-5a0f-4f23-8ffd-a90aef647c1c)

![C Minor Pentatonic Scale](https://github.com/user-attachments/assets/51643f1e-6681-4115-8f66-904371ec7308)

## Live Demo

The application is automatically deployed to GitHub Pages: [https://umatt1.github.io/Strings/](https://umatt1.github.io/Strings/)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/umatt1/Strings.git
cd Strings

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173/Strings/`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

1. **Select an Instrument**: Choose between Guitar or Bass
2. **Adjust Fret Range**: Use the slider to set how many frets to display (12-24)
3. **Choose Orientation**: Select horizontal or vertical layout
4. **Select a View**: 
   - Choose a root note from the dropdown
   - Click on a chord or scale button to highlight those notes
5. **Play Notes**: Click on any note to hear it
6. **Use Playback**: Click the playback buttons to hear all highlighted notes or play them in sequence

## Technology Stack

- **React 19** with TypeScript
- **Vite** for fast development and building
- **Web Audio API** for sound generation
- **GitHub Actions** for CI/CD
- **GitHub Pages** for hosting

## Development

### Linting

```bash
npm run lint
```

### Preview Production Build

```bash
npm run build
npm run preview
```

## Deployment

The application automatically deploys to GitHub Pages when changes are pushed to the `main` branch via GitHub Actions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
