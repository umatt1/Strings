## ADDED Requirements

### Requirement: First-visit onboarding modal

On the very first visit to the app (no prior localStorage record), the app SHALL display a modal overlay explaining the queue system and key shortcuts. The modal SHALL not appear on subsequent visits.

#### Scenario: Modal shown on first visit
- **WHEN** a user opens the app and `localStorage.getItem('strings-onboarding-seen')` is null or absent
- **THEN** an onboarding modal is displayed overlaying the app
- **AND** the modal is centered on screen with a backdrop

#### Scenario: Modal not shown on return visit
- **WHEN** a user opens the app and `localStorage.getItem('strings-onboarding-seen')` is `'true'`
- **THEN** no onboarding modal is displayed

### Requirement: Onboarding modal content

The modal SHALL explain: what the queue is, how to add chords and scales to it, that spacebar advances to the next queue item, and how to remove items.

#### Scenario: Modal contains queue explanation
- **WHEN** the onboarding modal is displayed
- **THEN** the modal contains text explaining that chords and scales are added to a queue from the left panel
- **AND** the modal mentions that the spacebar advances to the next item in the queue
- **AND** the modal mentions how to remove items (the × button)

### Requirement: Onboarding modal dismissal

The modal SHALL be dismissable via a "Got it" button or the Escape key. On dismissal, the seen flag SHALL be persisted to localStorage so the modal does not appear again.

#### Scenario: Dismiss via button
- **WHEN** the user clicks the "Got it" (or equivalent) button in the modal
- **THEN** the modal closes
- **AND** `localStorage.setItem('strings-onboarding-seen', 'true')` is called

#### Scenario: Dismiss via Escape key
- **WHEN** the modal is open and the user presses Escape
- **THEN** the modal closes
- **AND** the seen flag is persisted to localStorage

#### Scenario: Re-show via settings (optional)
- **WHEN** the user clicks a "Show intro" or help link in the app settings
- **THEN** the onboarding modal is displayed regardless of the localStorage flag
