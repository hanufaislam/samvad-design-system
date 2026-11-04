# Consolidated Components QA — 2026-11-03

Scope: the approved 49 families, 54 website routes. Components are approved for
now; this pass fixes concrete defects only. No redesign, Figma edit, production
token release, publication or new section is included.

## Audit results

| Check | Result |
| --- | --- |
| Documentation layouts | All 49 use DocsLayout and shared headings, preview, usage, accessibility, implementation, foundation notes and code-copy structure. Actions, forms and display/overlay templates retain purposeful content differences. |
| Visual foundations | Existing Geist, neutral/mulberry/semantic ramps, 4px spacing scale, compact/field radii and role-specific shadows preserved. No new palette or production tokens. |
| Preview controls | Centralized selector font, minimum height, padding/caret, radius, shadow and visible focus treatment. Actual component field/button styles remain separate. |
| Code accuracy | Compiler checks pass. Card/Empty state snippets now use the same TextLink and destination as live previews. Reference versus live-configured examples are explicitly distinguished. |
| Sidebar reachability | 49 destinations, exactly once per desktop/mobile sidebar on all 49 pages: 4,802 assertions. All 54 website routes and internal links pass. |
| Themes and interaction | 121 passing browser interaction/configuration assertions across Light and Dark. Forms, selection, Actions, sorting, tabs, menus, overlays, feedback, layout controls and native links exercised. |
| Responsive and keyboard | 448 geometry checks: all 49 pages × four widths × two themes, plus open overlay and Stack collapse checks. Keyboard checks include native entry/selection, Space/Enter, arrow navigation, Escape, modal containment and focus return. |
| Duplicate/inconsistent patterns | Field/ChoiceGroup, Notice, NavLinks and ModalPanel are reused correctly. Duplicate documentation selector styling was consolidated. No duplicate component family or rebuild was needed. |

## Issues fixed

1. Configuration selectors differed in typography/shadow/focus styling across
   documentation templates. One shared rule now supplies the existing treatment.
2. Card and Empty state copyable child content did not match their live preview
   links. They now import the same TextLink and point to the same destinations.
3. Removing the final removable chip lost focus. Focus now moves to the named
   chip group when no neighbouring remove button remains.
4. Pagination could leave focus on Next/Previous as it became disabled. Focus now
   transfers to the available boundary control. Both-theme regression checks pass.
5. A delayed menu open event could reset focus after a fast arrow-key sequence.
   It now respects focus already inside the menu. Both-theme fast-sequence retests
   pass. Initial failures and their resolutions are retained in browser evidence.

Reference snippets in Forms and Library docs explicitly describe initial props;
Actions and Layout provide configured live examples. No claim is made that a
static reference snippet follows every preview state or edited field value.

## Validation

- Astro type check: 100 files, zero errors/warnings/hints. Build successful.
- 54 direct routes, valid internal links/anchors and search index.
- Actions: 157 configurations compiled, 16 state/foreground contrast checks.
- Forms/Selection: 16 pages and 32 snippets compiled.
- Library/Layout: 29 pages, 36 snippets compiled, 10 semantic tone contrast pairs.
- 49-family structural/sidebar assertions; 121 passing interaction/configuration
  checks; 448 responsive/theme/overlay checks with no geometry failures.

Review evidence: website/review/components-static-qa.json,
components-browser-qa.json, components-responsive-qa.json and
components-qa-controls-light.png. These are local artifacts, not public telemetry.

## Remaining decisions and verification limits

Production token aliases, standalone packaging and final role bindings remain
pending their separately approved phase. Existing 2px versus 3px focus offsets
and differing field/overlay shadows are role-specific preview assignments; no
unapproved global normalization was imposed. Advanced table features, toast
queues/timers, nested overlays and a legacy Popover API fallback policy remain
outside the approved implemented variants.

This pass uses the in-app browser and local responsive harness. Full screen-reader,
physical touch-device, OS picker and cross-browser certification remain pending;
prior implementation checks are not represented as a new full accessibility audit.
No known blocking defect remains in the paths exercised here. Design Tokens and
other sections must not begin without explicit approval.
