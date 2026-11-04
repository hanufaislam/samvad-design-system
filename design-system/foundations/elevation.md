# Elevation

| Level | X | Y | Blur | Spread | Light alpha | Dark alpha |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 1 | 0 | 1 | 2 | 0 | 0.06 | 0.16 |
| 2 | 0 | 4 | 12 | -2 | 0.08 | 0.2 |
| 3 | 0 | 8 | 24 | -4 | 0.1 | 0.24 |
| 4 | 0 | 16 | 40 | -8 | 0.12 | 0.28 |

Levels: 0 flat, 1 raised surface, 2 popover, 3 overlay, 4 dialog. Shadow colour: neutral/950. Dark shadows are supplemented by lighter surfaces and a border; black-on-dark shadows alone are insufficient. Figma effect styles preserve geometry and opacity. Web box-shadow can match geometry; Android elevation is not a direct pixel translation of CSS blur/spread. Use a documented platform adapter and compare renderings when implementing native code. This phase does not certify platform pixel parity.
