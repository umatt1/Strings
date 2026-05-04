# Tasks

---

## 1. Restructure `App.tsx` DOM order

- [x] 1.1 Remove the `<div className="top-settings">` block (and the `<Controls />` inside it) from `main-content` — it will no longer be needed.
- [x] 1.2 Move the PracticeBar / queue-empty-bar conditional out of `fretboard-area` and make it the first child of `right-content` (before `fretboard-area`).
- [x] 1.3 Move the `<div className="desktop-settings">` block (with `<Controls />`) to after `fretboard-playback`, as the last child of `right-content`. Rename the class to `settings-panel`.
- [x] 1.4 Verify the JSX renders only one `<Controls />` instance in the DOM tree.

---

## 2. Update CSS

- [x] 2.1 In `App.css`, remove the `.top-settings` rule entirely.
- [x] 2.2 Rename `.desktop-settings` to `.settings-panel` and remove `display: none` — the settings block should be visible on all breakpoints (no toggling needed).
- [x] 2.3 Remove the media-query overrides for `.top-settings` and `.desktop-settings` (the `display: block` in the ≥768px breakpoint block).
- [x] 2.4 Remove the `order` CSS properties from `.fretboard-area` and `.fretboard-playback` — DOM order now matches visual order, flex ordering is no longer needed.
- [x] 2.5 Add any margin/padding to `.settings-panel` to visually separate it from PlaybackControls (e.g., a subtle top border or extra top margin), matching the existing panel style.

---

## 3. Manual verification

- [x] 3.1 On desktop (≥768px): confirm queue bar appears above the fretboard, Settings panel appears below PlaybackControls.
- [x] 3.2 On mobile (<768px): confirm the same order — queue bar at top of right column, Settings below PlaybackControls — and that only one Controls instance is in the DOM (inspect element).
- [x] 3.3 Confirm the queue bar (both PracticeBar and queue-empty-bar states) is flush with the fretboard above it with only the standard 12px gap.
- [x] 3.4 `npm run build` passes with no type errors.
