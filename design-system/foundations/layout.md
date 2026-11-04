# Layout

| Range | Columns | Gutter | Minimum side margin | Specimen width |
| --- | --- | --- | --- | --- |
| Compact | 4 | 16 | 16 | 360 |
| Medium | 8 | 24 | 24 | 768 |
| Wide | 12 | 24 | 32 | 1200 |

Compact: <600; Medium: 600–1023; Wide: ≥1024 CSS px/logical design units. Android window sizing may map differently: adapt to available width rather than device names. Content maxima: 640, 960 and 1200, selected by task. Wide content max excludes page margins; the 1200-wide specimen illustrates 12 columns within its own 32-unit margins, not a new container maximum.
Reading width targets roughly 60–70 characters. Use max-width: 65ch as a web starting point, then inspect the actual font. Narrow screens use available width. Honour safe areas, text enlargement and system UI. Use intrinsic content heights, auto layout, wrapping, logical edges and hug/fill relationships. Avoid fixed-height text containers. Grid styles define column structure; auto layout governs content relationships. No product screens are included.
