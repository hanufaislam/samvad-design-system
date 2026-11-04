# Typography

General Sans was preferred subject to availability; neither it nor Satoshi is exposed by the connected API. Use the approved available fallback **Geist**, with **Geist Mono** for technical labels. Do not label Geist as General Sans. The final checkpoint calls out this substitution.

| Role | Size | Line height | Weight | Tracking em |
| --- | --- | --- | --- | --- |
| display | 48 | 56 | 600 | -0.03 |
| heading/1 | 36 | 44 | 600 | -0.025 |
| heading/2 | 28 | 36 | 600 | -0.02 |
| heading/3 | 24 | 32 | 600 | -0.015 |
| heading/4 | 20 | 28 | 600 | -0.01 |
| body/l | 18 | 28 | 400 | 0 |
| body/m | 16 | 24 | 400 | 0 |
| body/s | 14 | 22 | 400 | 0 |
| label | 14 | 20 | 600 | 0 |
| caption | 12 | 18 | 400 | 0 |

## Application
Use Regular 400 for body and SemiBold 600 for headings/labels (the actual Geist API style is `SemiBold`). Technical labels use Geist Mono Regular, 12/18 or 14/20. No uppercase paragraphs. Restrict tight tracking to Latin headings. Use hierarchy, whitespace and weight before adding colours.
On compact layouts use heading/1 or heading/2 instead of display when appropriate. Do not shrink body copy to fit. Web maps sizes to rem against a 16px default without locking the user's root size; Android uses sp and respects font scale.

## Script fallbacks
Noto Sans Devanagari and Noto Sans Telugu are available and included as specimens. At body size 16 use 28 line height for these script specimens, zero tracking, Regular or SemiBold. This is a safe starting line box, not language-quality approval. Test wrapping, combining marks, shaping and enlarged text with native reviewers. Do not force Latin transliteration or imply a launch-language decision.

## Font delivery
No font binaries are bundled. Use upstream distributions and verify redistribution terms before shipping. Geist: https://vercel.com/font. Noto: https://fonts.google.com/noto. Use platform-specific fallback stacks rather than assuming every family is installed on a user's device.
