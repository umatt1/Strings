## ADDED Requirements

### Requirement: Practice mode toggle
The app SHALL offer a Practice Mode alongside the existing Reference Mode. In reference mode, the fretboard shows the single selected chord/scale and position (current behavior). In practice mode, the fretboard is driven by the current item in the active queue.

#### Scenario: Toggling practice mode
- **WHEN** the user activates Practice Mode
- **THEN** the fretboard begins showing the current queue item, and the PracticeBar appears below the fretboard

#### Scenario: Toggling back to reference mode
- **WHEN** the user deactivates Practice Mode
- **THEN** the fretboard reverts to the last reference selection; the PracticeBar disappears

---

### Requirement: Practice queue
The practice queue SHALL be an ordered list of `QueueItem` objects. Each item specifies:
- `chordScale`: the chord or scale to display (root + type + computed notes)
- `positionSystem`: which shape system to use (`'3nps'`, `'flat'`, `'caged'`, `'none'`)
- `positionIndex`: which position within that system (0-based)
- `displayMode`: `'scales'` (valid scale notes in position) or `'arpeggios'` (valid chord-tone notes in position)

The user SHALL be able to add, remove, and reorder queue items.

#### Scenario: Queue item shows arpeggio display
- **WHEN** a queue item has displayMode = `'arpeggios'` and the chord is Cm7
- **THEN** the fretboard shows only C, Eb, G, Bb within the active position (the chord tones)

#### Scenario: Queue item shows scale display
- **WHEN** a queue item has displayMode = `'scales'` and the suggested scale is Dorian
- **THEN** the fretboard shows all 7 Dorian notes within the active position

---

### Requirement: Spacebar and timer navigation
The user SHALL advance the queue by pressing the spacebar. An optional timer SHALL auto-advance the queue at a user-specified interval (in seconds). When the queue reaches the last item, it wraps to the first.

#### Scenario: Spacebar advances queue
- **WHEN** the user presses spacebar in practice mode
- **THEN** queueIndex increments by 1 (wraps at end), and the fretboard updates immediately

#### Scenario: Spacebar ignored when typing
- **WHEN** focus is inside a text input or button during practice mode
- **THEN** spacebar does NOT advance the queue

#### Scenario: Timer auto-advance
- **WHEN** the timer is set to 8 seconds
- **THEN** the queue automatically advances every 8 seconds without user input

---

### Requirement: Chord-scale suggestion
When a chord is added to the queue, the system SHALL suggest a compatible scale type based on a hard-coded chord-scale mapping. The suggested scale is used as the default `displayMode: 'scales'` content for that item. The user may override the suggestion.

Compatible defaults:
- maj7 → Ionian (Lydian as alternative)
- min7 → Dorian (Aeolian, Phrygian as alternatives)
- dom7 → Mixolydian
- m7b5 → Locrian
- maj → Ionian
- min → Aeolian (Dorian as alternative)

#### Scenario: Adding a dom7 chord suggests Mixolydian
- **WHEN** the user adds an F7 chord to the queue
- **THEN** the item's suggested scale is F Mixolydian, pre-populated as the scale display option

---

### Requirement: Handcrafted presets
The system SHALL provide at least three read-only presets that can be loaded into the queue as a starting point:

1. **G Major Diatonic Scale Workout** — all 7 flat positions then all 7 3NPS positions of G major
2. **G Major Diatonic 7th Arpeggios** — all 7 diatonic 7th chords of G major, one CAGED position each, arpeggio display
3. **Autumn Leaves (G minor)** — the Cm7 → F7 → Bbmaj7 → Ebmaj7 → Am7b5 → D7 → Gm chord sequence, each with suggested scale, 3NPS display

#### Scenario: Loading a preset
- **WHEN** the user selects "Autumn Leaves (G minor)" from the preset picker
- **THEN** the queue is populated with 7 items matching the Autumn Leaves chord sequence

---

### Requirement: Queue editor panel
The system SHALL provide a panel (slide-out or modal) where the user can view and edit the full queue, add new items individually, and select presets.

#### Scenario: Adding an item manually
- **WHEN** the user clicks "Add Item" in the queue editor and selects Dm7
- **THEN** a new queue item is appended with Dm7, Dorian as suggested scale, positionSystem = '3nps', positionIndex = 0

#### Scenario: TODO — shareable URL
- **WHEN** the user clicks "Share" (future feature)
- **THEN** the queue is encoded as a URL parameter — NOT IMPLEMENTED, shown as disabled/todo
