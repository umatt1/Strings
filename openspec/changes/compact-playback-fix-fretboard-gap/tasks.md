# Tasks

---

## 1. Rewrite PlaybackControls component

- [ ] 1.1 Remove `isCollapsed` state and `toggleCollapse` from `PlaybackControls.tsx`.
- [ ] 1.2 Remove the panel wrapper (`<div className="playback-controls">`), header (`<div className="playback-header">`), and collapse button entirely.
- [ ] 1.3 Return `null` when `!selectedChordScale` (no chord/scale selected).
- [ ] 1.4 When `selectedChordScale` is set: render a `<div className="playback-bar">` containing:
  - 0–1 notes selected: a muted hint `<span>Select 2 notes to play {rootNote} {type}</span>`
  - 2 notes selected: play button (▶) + clear button (✕) inline
- [ ] 1.5 Keep the existing `playBetweenSelectedNotes` audio logic unchanged.

---

## 2. Simplify PlaybackControls.css

- [ ] 2.1 Remove all panel, header, collapse, shadow, and gradient styles (`.playback-header`, `.playback-controls` panel rules, `.collapse-button`, `.playback-content`, `.playback-controls.collapsed`).
- [ ] 2.2 Add a `.playback-bar` style: slim row, muted background similar to `.queue-empty-bar` but lighter; `padding: 8px 16px; display: flex; align-items: center; gap: 8px; font-size: 13px;`.
- [ ] 2.3 Keep `.play-button.compact` and `.clear-button.compact` styles (the actual action buttons).
- [ ] 2.4 Keep `.selection-count`, `.instruction-text` styles for the hint text.

---

## 3. Fix fretboard gap in App.css

- [ ] 3.1 Change `.fretboard-panel` from `flex: 1; min-height: 400px` to `height: auto; min-height: 300px` (base rule).
- [ ] 3.2 In the `@media (min-width: 768px)` block, change `.fretboard-panel` from `min-height: 500px; flex: 1` to `height: auto; min-height: 300px`.
- [ ] 3.3 Remove `min-height: 70vh` from `.main-content` in the `@media (min-width: 1024px)` block (or change to `min-height: 0`).

---

## 4. Manual verification

- [ ] 4.1 Confirm no gap below fretboard rows on desktop viewport.
- [ ] 4.2 Select C major — confirm PlaybackControls shows the "Select 2 notes to play" hint (no panel header visible).
- [ ] 4.3 Tap 2 notes — confirm play (▶) and clear (✕) appear inline.
- [ ] 4.4 Clear selection — confirm PlaybackControls disappears when no chord is selected.
- [ ] 4.5 `npm run build` passes with no type errors.
