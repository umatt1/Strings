## MODIFIED Requirements

### Requirement: Queue population from reference mode

The practice queue SHALL be populatable from reference mode without toggling Practice mode. The `[+ Queue]` button (see queue-shortcut spec) enables this.

**Behavior change:** When the user activates Practice mode and the queue is non-empty (including items added via the shortcut), the existing queue is used as-is. The default preset is only auto-loaded when the queue is **empty** at the time Practice mode is activated.

#### Scenario: Non-empty queue preserved on practice activation
- **WHEN** the user has added 3 items via [+ Queue] in reference mode, then clicks [Practice]
- **THEN** practice mode starts with those 3 items; the G Major Diatonic Scale Workout preset is NOT loaded
