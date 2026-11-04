# Colour

Warm neutral surfaces and mulberry actions establish the identity. Apricot and lime are supporting accents, not feedback statuses. Success, warning, error and info have distinct semantic intent.

| Family | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| neutral | #FCF9F6 | #F5EEEA | #E9DDD8 | #D7C6C1 | #BAA4A1 | #997F80 | #776368 | #635058 | #4D3B46 | #3B2935 | #291B25 |
| mulberry | #FCF3F8 | #F8E4EF | #EFBFD9 | #E8A0C6 | #D271A9 | #AB477F | #742653 | #601E45 | #4C1939 | #3D162F | #290D20 |
| success | #F0FAF4 | #DDF3E5 | #BCE5CC | #8ACFA7 | #54AF7D | #328E5D | #24734B | #205C3E | #1C4934 | #183C2C | #0C241A |
| warning | #FFF9E8 | #FFF0C2 | #FFE08A | #FFCA52 | #EDAC20 | #BB810D | #946000 | #784B08 | #623D0D | #513210 | #301C06 |
| error | #FFF2F3 | #FFE2E6 | #FFC5CE | #F89CAA | #EC6C81 | #D64C64 | #B83446 | #96293B | #7B2636 | #662431 | #3C101C |
| info | #F0F7FF | #E0EDFC | #BED9F5 | #91BEEB | #609AD8 | #3E7DBD | #2D659E | #27517F | #244369 | #223957 | #132239 |
| apricot | #FFF7EF | #FFEADB | #FFD8BC | #FFC59E | #F4A475 | #DF8050 | #B75D32 | #934728 | #763B25 | #603222 | #381B10 |
| lime | #FAFCEB | #F1F7CB | #DEEC86 | #C9DC61 | #ABC33F | #8AA128 | #697D1C | #52621B | #424F1B | #38421B | #1D250B |

## Usage
Neutral/50 is the light canvas; neutral/950 is ink and dark canvas. Mulberry/600 is the light primary; mulberry/200 is the dark primary. Light semantic feedback uses family/600 on family/50; dark uses family/200 on family/950. These are foundation contrast examples, not the final semantic alias table.
Do not infer contrast from ramp indices. Light primary hover/pressed can use mulberry/700 and /800; dark hover/pressed can use /100 and /300, subject to contextual checks in Phase 3. Use neutral/500 for a meaningful input boundary; pale decorative dividers must not be the sole control boundary.
Use dark ink on apricot and lime. Do not use the pale lime concept-board focus ring as the only focus indicator against a light canvas. Use mulberry/600 (light) and /200 (dark) with a contrasting 2-unit gap.

## Verification
See verification/contrast.md. Opaque sRGB contrast pairs are computed reproducibly. Hover, pressed, overlays, alpha composites and full component states require contextual checks in later phases. Dark specimen boards use explicit palette values/styles, not functioning Figma modes yet.
