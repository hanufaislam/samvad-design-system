# Layout — Batch 4

Status: four reusable implementations and documentation pages complete locally;
complete Components section review pending. Do not start Design Tokens, patterns
or other sections until approved. No Figma changes or product screens.

## Reuse and preservation

Batch 1 was verified before implementation: 16 pages and 32 compiled snippets.
SHA-256 comparisons confirm website/src/components/forms sources are unchanged.
Existing LibraryPage, DocsLayout, CodeBlock, preview control styles, navigation,
search index and route verification are reused. No completed component was rebuilt.

## Implementations

- Container: 640/960/1200 content maximum, reading 65ch, or full; responsive
  gutters 16/24/32 at the approved <600 / 600–1023 / ≥1024 breakpoints.
- Divider: horizontal hr or vertical separator; decorative mode; approved inset.
- Stack: direction, scale-based gap, alignment, distribution, wrap and optional
  collapse below 600px. No DOM reordering or implicit ARIA semantics.
- Grid: 1–12 equal columns, per-breakpoint counts and gap/alignment; optional
  fixed count. Defaults 1/2/3 are provisional component assignments, not a change
  to the foundation’s 4/8/12 page grid.

Sources: website/src/components/layout. values.ts reads the approved foundation
specification and validates spacing/counts; it is not an official token export.
Layout requires no client JavaScript. The documentation controller adjusts the
actual rendered instances and updates matching copyable code. Divider previews
show/hide two genuine orientation instances, preserving each component’s markup.
Extreme configurations can scroll inside a named, keyboard-reachable preview
canvas; real consumers must choose sensible counts/gaps and fitting children.

## Review and limits

Four new direct routes; all 49 component families / 54 site routes available.
Check with npm run check, build, verify, verify:actions, verify:batch and
verify:library. Browser geometry evidence includes breakpoint boundary checks in
both themes, plus control changes and copy feedback. Review artifacts live under
website/review/layout-*-qa.json. Public semantic/component token mappings and
standalone packaging remain pending. No complete cross-device or screen-reader
certification is claimed.
