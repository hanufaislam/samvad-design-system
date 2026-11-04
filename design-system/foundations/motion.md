# Motion and interaction

| Name | Value | Purpose |
| --- | --- | --- |
| duration/fast | 120 ms | Direct action acknowledgement |
| duration/base | 200 ms | State transition |
| duration/slow | 320 ms | Larger spatial transition |
| easing/standard | cubic-bezier(0.2, 0, 0, 1) | Routine state change |
| easing/enter | cubic-bezier(0, 0, 0, 1) | Arrival |
| easing/exit | cubic-bezier(0.3, 0, 1, 1) | Departure |

Respond to input immediately; transition timing must not delay input acknowledgement. Use motion to explain change, not to decorate every action. Avoid bounce and looping background motion. Voice state must say Ready, Listening, Thinking, Speaking, Paused or Connection issue; animation is supplementary. Never imply recording merely through a waveform.
Reduced motion: remove travel/scale; update state immediately, with optional short opacity change only where comfortable. Audio, captions and status continue to function. No live prototype animation is claimed: Phase 2 supplies timing tracks and easing diagrams as native documentation; operational component interactions belong to later implementation.
