## MODIFIED Requirements

### Requirement: Position controls (`PositionControls`)

- Position system selector: None, 3NPS, CAGED, Positions. (**Flat is removed.**)
- Previous/Next position navigation buttons (only shown when a system is active).
- Current position label (e.g. `"I — C (3/14)"` showing Roman numeral, note name, and instance count).
- 3NPS option is disabled (or auto-hidden) when fewer than 7 scale notes are active.

#### Scenario: Flat button absent from position selector
- **WHEN** a chord or scale is selected and the position toolbar is visible
- **THEN** the position system selector shows only: All, 3NPS, CAGED, Positions
- **AND** there is no Flat button

#### Scenario: Position label shows Roman numeral and note name
- **WHEN** positionSystem is `'modes'` and the active position is the tonic of C Ionian
- **THEN** the position label displays `"I — C"` (plus instance count)

## ADDED Requirements

### Requirement: Settings panel includes onboarding re-trigger

The app settings area SHALL include a link or button labeled "Show intro" (or similar) that re-opens the onboarding modal regardless of the localStorage seen flag.

#### Scenario: Show intro link opens the modal
- **WHEN** the user clicks "Show intro" in the Settings panel
- **THEN** the onboarding modal is displayed
- **AND** the localStorage seen flag is not checked (modal always shows)
