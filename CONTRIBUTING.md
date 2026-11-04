# Contributing

## Web component previews

The approved website scope covers Actions, Inputs, Selection, Data display, Feedback, Navigation, Overlays and Layout. Use
website/src/components/actions, website/src/components/forms and
website/src/components/library and website/src/components/layout as implementation sources. Previews must import
those components; do not create look-alike preview markup. Preserve the shell and
foundations. Document provisional size/state assignments; private adapters are not
an approved semantic token API.

From website/, run `npm run check`, `npm run build`, `npm run verify` and
`npm run verify:actions` , `npm run verify:batch` , `npm run verify:library` and `npm run verify:components`. Check relevant keyboard, theme and responsive behaviour.
Update examples and property tables alongside source interfaces. Stop after
final audit and publishing preparation; any public release needs explicit approval.

1. Check the current phase and approval boundary in DESIGN_SYSTEM.md. Propose changes before altering an approved foundation.
2. Explain the use case, existing option considered, visual effect, accessibility impact and Figma/code mapping.
3. Prefer extending the shared system over adding a nearly identical value. Use lower-case slash names for foundation and future token paths; human-readable Figma page titles.
4. Treat foundation-spec.json as the Phase 2 implementation record. Run `python3 design-system/foundations/scripts/prepare.py` after editing its source data in prepare.py. Do not hand-edit generated files without updating their source.
5. Update the corresponding native Figma assets. Preserve existing stable IDs when possible. Record IDs and screenshots after mutation.
6. Check actual contrast pairs, multilingual line heights, text enlargement, vector provenance, layout containment and light/dark examples.
7. In Phase 3 and later, primitives contain raw values; semantic aliases express roles and modes; component aliases express component roles. No raw primitive consumption in components. All variables need explicit scopes and platform code syntax.
8. Record approved changes in CHANGELOG.md. Label implementation refinements pending checkpoint review accurately.

## Required review evidence
- What changed and why, affected names and IDs, and before/after value differences.
- Native Figma screenshot and structural evidence; corresponding Markdown/JSON changes.
- Accessibility results and remaining platform validation limits.
- No new screens, components, patterns or phases without authorization.

## Assets and licenses
Phosphor specimen SVGs are stored under design-system/foundations/assets/icons with the upstream MIT license. Pin exact asset hashes in verification evidence. Font availability is not permission to redistribute font files: use approved upstream distributions and retain their license when bundling in an application. No font binaries are bundled in Phase 2.

## Token changes

Read design-system/tokens/README.md before editing. Change source JSON with
provenance and status; do not edit dist or website/public/tokens by hand. Run
`npm run tokens:build`, `tokens:check` and `verify:tokens` from website/, plus the
existing component checks. Preserve candidate versus foundation-approved status.
No new design value or official role assignment may be inferred from a matching
number alone. Website adapters stay separate; Figma is unchanged in this phase.

## Patterns and Resources

Use website/src/components/patterns/ for composed reference examples and shared
coordination runtime. Import approved components; do not copy their markup or
styles. Content lives in content.json. Raw example imports keep the displayed
source identical to the preview. Treat local simulation as simulation and state
backend, routing and persistence responsibilities explicitly.

From website/, run verify:references alongside the existing checks. Do not alter
closed token sources or completed component families for a documentation pattern.
Keep changelog entries honest about implemented-for-review versus approval.

## Get Started and Foundations documentation

New source-backed guides/specimens live in website/src/components/foundation-docs/.
Use content.json for the twelve added routes; the original Overview, Principles,
Colour and Typography retain their useful specimens and share related guidance.
Run verify:foundations alongside verify, check and build. Do not alter closed
component/token/pattern/resource sources to complete a foundation reference.
Keep illustrative geometry separate from a new production value or asset approval.

## Release preparation

Use publishing/README.md and FINAL_AUDIT.md. Root/source values remain approved.
Final audit link/status repairs are recorded by exact before/after hashes in
publishing/audit/fixes.json; historical preservation manifests are not overwritten.
Do not initialize/push a repository or install a deployment workflow without the
release approval. Never include local session ledgers, dependency/build folders,
review screenshots or environment files in the public repository candidate.
