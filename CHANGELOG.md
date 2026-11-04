# Changelog

## Final audit and publishing preparation — 2026-11-04

- All six sections approved; audited 84 routes and the complete component/token library.
- Corrected project-base links and outdated status/specification wording without changing approved styling or token values.
- Added reproducible local release checks, repository staging/privacy tools, licensing notices and inactive GitHub Pages workflow instructions.
- Passed root/project builds, responsive/theme/browser/copy checks and isolated source preflight.
- Public release remains unapproved; see FINAL_AUDIT.md for exact next steps and limitations.

## Get Started + Foundations — implemented for review — 2026-11-04

- Patterns and Resources approved before this batch. Audited all sixteen requested pages: four existing pages and twelve missing routes.
- Completed both sections with source-backed specimens, onboarding, final token guidance, cross-links and fourteen copyable examples.
- Passed type/build, all84 routes, 290 browser checks, five mobile checks, eight keyboard/search/palette checks and fourteen copy controls.
- Preserved 136 protected files; no completed component/token/pattern/resource source, Figma, publishing or deployment changes.
- Full findings and limitations: QA_REPORT.md; pre-implementation audit: design-system/foundations/site-review/AUDIT.md.

## Patterns + Resources — implemented for review — 2026-11-04

- Design Tokens formally approved and closed before this batch.
- Added six pattern and three resource routes with composed examples, accessibility/usage guidance, local source examples and cross-references.
- Enabled the existing Patterns/Resources sidebar groups and Pagefind indexing; retained the shell structure, styling and runtime.
- Validated 72 routes, 168 browser checks, 12 keyboard/search/mobile checks, eight copy interactions and source-preservation hashes.
- Fixed three issues within the new composition layer: summary link rendering, loading completion accessibility state, and narrow inline-path wrapping.
- No completed component/token, Figma, deployment or publication changes. See QA_REPORT.md.

## Approved token decisions and final regression QA — 2026-11-04

- Implemented only the five approved visual decision packages with explicit approved-exception provenance.
- Current architecture: 629 tokens, 435 CSS bindings, 49 families; 39 retained declarations remain explicit.
- Full type/build/token/component/example/63-route checks pass; 528 responsive/theme, 108 approved-value/motion, 9 keyboard/input and 5 mobile shell checks pass.
- Corrected stale focus documentation; no component behaviour, shell or Figma edits.
- Evidence and limitations: design-system/tokens/QA_REPORT.md. Patterns and Resources not started.

## Consolidated Design Tokens QA — 2026-11-04

- Verified source tiers, deterministic exports, both modes and 391 actual CSS bindings across 49 families.
- Corrected one stale documentation-only border entry: 75 active retained declarations remain, each with a specific reason.
- Added reproducible token QA and duplicate-value inventory; no visual styles, token values or pending approvals changed.
- Type/build, 63-route and component navigation checks passed. See design-system/tokens/QA_REPORT.md.
- Figma, Patterns and Resources unchanged.

## Design Tokens — 2026-11-04

- Completed ten token documentation pages and reusable three-tier source/export architecture for review.
- Added 192 Primitive, 130 Semantic and 274 Component tokens with provenance and Light/Dark resolution.
- Connected supported properties across all 49 component families; registered 76 retained declarations and pending mapping decisions.
- Passed type/build, 63-route validation, token/export checks, 528 responsive/theme checks and six live propagation/mode checks.
- Review and limitations: design-system/tokens/REVIEW_REPORT.md.
- Figma unchanged; Patterns and Resources not started.

## Consolidated Components QA — 2026-11-03

- Complete Components section approved for now; audited all 49 families.
- Unified documentation selector styling; corrected Card/Empty state examples.
- Fixed final-chip, pagination-boundary and fast menu-opening keyboard focus.
- Passed type/build, 54-route checks, 4,802 sidebar assertions, 121 browser
  interaction/configuration checks and 448 responsive/theme checks.
- Scope and remaining decisions recorded in design-system/components/QA_REPORT.md.
- No redesign, Figma mutation or Design Tokens work. Await next-phase approval.


## Batch 4 — Layout — 2026-11-03

- Batches 2 + 3 approved. Implemented Container, Divider, Stack and Grid, using
  existing shared documentation, code-copy controls and foundation values.
- Added four routes and live configuration examples; all 49 component families
  and 54 website routes are now available for complete Components review.
- Batch 1 verification passed before and after; source SHA-256 hashes unchanged.
- Validation: 99 files checked with no errors/warnings; build and route checks
  pass; eight Layout example fragments compiled; nine browser configuration/copy
  checks and 70 Light/Dark responsive/breakpoint/collapse checks passed.
- No official tokens, Figma mutations, product screens or publication. Stop for
  full Components approval before Design Tokens or other sections.


## Batches 2 + 3 — 2026-11-03

- Completed 25 reusable families across Data display, Feedback, Navigation and
  Overlays; combined review pending. Layout remains unimplemented.
- Shared Notice, NavLinks, ModalPanel and runtime reduce duplicate behaviour.
  Implemented sorting, manual tabs, pagination, toast, tooltip, menu keyboard
  navigation, native modal containment and non-modal popover placement.
- Added 25 searchable documentation pages with 28 compiled example fragments.
- Validation: 90 files type-checked cleanly, 50 website routes verified, 44 final
  browser interaction checks and 248 responsive/theme/open-overlay checks passed;
  10 status-tone text contrast pairs passed AA. Actions and Batch 1 checks pass.
- Production aliases, advanced variants and full device/assistive-technology
  coverage remain pending as documented. No Figma changes or publication.


## Batch 1 — 2026-11-03

- Actions reviewed and ready. Inputs and forms (11) plus Selection (5) implemented
  as reusable Astro/native controls; combined batch review pending.
- Added shared Field, FormField, ChoiceGroup and validation helpers; native date
  and file pickers, paste-friendly OTP, password visibility, removable chips.
- Added 16 linked/searchable documentation routes with real previews and 32
  copyable examples. Preserved the shell and approved foundations.
- Passed type/build, 25-route verification, 32 Batch 1 example compilations,
  60 final browser interaction checks and 128 viewport/theme geometry checks.
- Production mappings remain pending. No Figma changes or publication.


## Actions dropdown-chevron spacing — 2026-11-03

- Inset all preview-control chevrons 12px from the right, matching left text
  padding, with reserved text space and the existing Phosphor caret asset.
- Native selection and keyboard behaviour remain; forced-colour mode restores
  the platform arrow. This is documentation tooling, not a production token.


## Actions field-shadow refinement — 2026-11-03

- Review adjustment: shared preview configuration fields use a soft 0/8/24/-8
  shadow, neutral ink at 12% in Light and black at 24% in Dark. Approximate visible
  falloff is 12–16px; CSS blur has no hard outer edge.
- Documentation tooling only; no official production shadow token added.
- Field geometry and keyboard focus ring remain unchanged. Actions components,
  button shadows, shell, foundations and Figma are unchanged.

## Website Actions preview — 2026-11-03

- Approved: 49-page inventory; Astro/native HTML approach; Actions category only.
- Implemented for review: reusable Button, Icon button, Button group and Text link,
  four documentation routes, live configuration and matching copyable examples.
- Navigation/search include Actions; other categories remain marked Later.
- Busy guards, focus-preserving loading, icon toggle state, native grouping and
  genuine links are implemented. Provisional foundation mappings are documented.
- Validation: clean Astro type checks, nine-route verification, 157 compiled
  example configurations, 16 contrast pairs and 32 responsive/theme geometry checks.
- No production token release, Figma mutation, GitHub push or publication.

## 0.2.0 — 2026-11-03
### Approved scope
- Phase 2 foundation proposal approved: colour architecture, typography scale, spacing, layout, radius, elevation, borders, icons, illustration and motion.
- Native foundation specimens and contributor documentation authorized; token architecture remains deferred to Phase 3.
### Implementation for checkpoint review
- Eight 11-step colour ramps and selected Light/Dark contrast pairs specified.
- Geist used as the approved fallback because General Sans and Satoshi are unavailable through the connected Figma font API. Geist Mono and Noto script specimens specified.
- Reusable native foundation styles and Figma verification are tracked in foundations/verification/figma-state.json.
- Three-page Starter limit: Colour and Typography have dedicated pages; the other foundations are named boards on Foundations.
- Overview and Typography screenshots reviewed; the Starter MCP call limit blocked the remaining nine screenshot reviews and final live style read-back. See verification/README.md.
- No components, application screens, three-tier variables or production exports included.

## 0.1.0 — 2026-11-03
- Phase 1 Direction 01 approved: “A little character. A lot of clarity.”
- Playful minimalism, warm neutral/mulberry colour direction and expressive readable typography approved.
