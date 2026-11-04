# Samvad Design System

## Current website checkpoint

The documentation website is the primary reference experience; Figma supports
visual decisions. The 49-page inventory is approved. Checkpoint 2 implements
**All 49 component families and consolidated QA are approved.** The code Design
Tokens phase is formally approved and closed: ten pages, three-tier sources, generated
CSS/typed exports and supported component connections. Candidate role assignments
and retained literals are explicit in the [token reference](design-system/tokens/README.md).
The five-area token decision review is approved and implemented; other candidate roles and deferred line heights remain explicit. Figma is unchanged. Patterns and Resources are approved and closed. Get Started (four pages) and Foundations (twelve pages) are approved, with source-backed specimens and final approved token guidance. All84 routes are in final audit and publishing preparation. No publication or deployment is authorized.

The shell is preserved. Live previews and code examples use the same local Astro
sources under website/src/components/actions, website/src/components/forms and
website/src/components/library. These are component previews, not
an official token API, package release or native Figma component library. See
[Actions implementation](design-system/components/actions/README.md) and
[Batch 1 implementation](design-system/components/batch-1/README.md) and
[Batches 2 + 3 implementation](design-system/components/batches-2-3/README.md) and
[Layout implementation](design-system/components/layout/README.md). No Figma
changes, publishing or GitHub push are included. Future Figma work must preserve
existing assets and keep the full system on one page.

**Direction 01:** A little character. A lot of clarity.

**Visual source of truth:** [Samvad Design System in Figma](https://www.figma.com/design/LEIY29pmcSV6CujKqhzVoW/Samvad-Design-System)

## Status and approval boundaries

The table below tracks the original Figma workflow; the current web preview checkpoint is recorded above.
| Phase | Status |
| --- | --- |
| 1 — Principles and design language | Approved |
| 2 — Foundations | Proposal approved; implementation at review checkpoint |
| 3 — Three-tier token architecture | Code approved and closed; remaining candidate mappings explicit; native Figma unchanged |
| 4 — Component inventory | Not started; propose only |
| 5 — Components | Not started |
| 6 — Documentation and QA | Not started; ongoing foundation documentation does not complete Phase 6 |

## Principles
Clarity leads. Character in small doses. Space creates structure. Colour has a job.
Consistency earns trust. Access is foundational.

Samvad is a multilingual, conversation-first communication learning product. Its product spec supplies terminology and functional context, not visual instructions or permission to build screens.

## Foundations
See [the foundation index](design-system/foundations/README.md) and [machine-readable foundation specification](design-system/foundations/foundation-spec.json).
The JSON records Phase 2 values; it is not the reviewed Phase 3 token table or a production token package.
Current Figma colours, typography, elevation and grids use reusable native styles. Figma Starter limits this file to three pages; individually named foundation boards preserve structure within that limit. Construction returns confirm all 11 boards and 115 styles were created. Overview and Typography have passed visual review; remaining visual reviews and final style read-back are pending because the Starter MCP call quota was reached. The code token phase now supplies Primitives → Semantic (Light/Dark) → Component aliases. Native Figma variables and specimen binding changes remain outside the current authorization. Components must never consume primitives directly.

## Accessibility and platform mapping
Target WCAG 2.2 AA; text contrast 4.5:1 (3:1 qualifying large text), required non-text contrast 3:1. Shared hit area 44 logical units, Android 48 dp. Keyboard focus is visible and unobscured; status includes text or icons. Support scalable type, captions, reduced motion and native scripts.
Use rem for web typography and scalable layout where appropriate; dp/sp on Android. Do not disable user font scaling. Logical Figma sizes are not physical pixels.

## Source-of-truth contract
Every foundation has stable slash-based naming and a Markdown specification. Figma node/style IDs are recorded in foundations/verification/figma-state.json. Approved changes update both sources in the same revision. Resolve drift before adding dependents. No automatic bidirectional synchronization is claimed.
