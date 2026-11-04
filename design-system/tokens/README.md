# Samvad token architecture

Implemented locally for the approved Design Tokens phase. Ten documentation pages
are available at `/design-tokens/`. Figma is unchanged. This is a code-ready local
architecture, not a ratified public package or a claim of native Figma bindings.

## Sources and authority

`source/primitives.json` contains raw values from the approved foundation JSON and
Markdown. Source provenance is stored on every entry. Web type sizes/line heights
use rem against the approved 16px reference; installed Geist variable-family names
are explicit delivery adapters. Noto fallback references do not bundle those fonts.

`source/semantic.json` aliases primitives. `$value.Light` and `$value.Dark` express
mode assignments. Foundation scale aliases retain foundation provenance; existing
component role assignments are tagged `implementation-candidate` where their final
production naming/mapping was previously unresolved. `space/scale/*` is a utility
alias family, not a newly ratified semantic role taxonomy.

`source/components.json` aliases Semantic only. Shared styles intentionally use a
`shared/` namespace; Field, ChoiceGroup, Notice, NavLinks and ModalPanel remain
shared implementations rather than 49 copies. Components never consume primitive
CSS variables directly. Existing role assignments are preserved without promoting
all component-specific mappings to an official production contract.

`source/pending.json` records retained declarations. Some are functional geometry;
others need a design decision. Do not manufacture primitive values to erase this
list. Do not silently normalize a component to a different foundation shadow,
line height or focus offset.

## Local source contract v1

A source is a flat map of slash-based names to entries:

```json
{
  "color/bg/default": {
    "$type": "color",
    "$value": {
      "Light": "{Primitives/color/neutral/50}",
      "Dark": "{Primitives/color/neutral/950}"
    },
    "$extensions": {
      "samvad": {
        "status": "implementation-candidate",
        "source": "Existing inspected component CSS assignment",
        "scope": []
      }
    }
  }
}
```

Primitives hold raw values only. Semantic references Primitives; Component
references Semantic. Loading duration is an explicitly approved retained 960ms exception, independent
of the 320ms slow transition token. `$responsive` optionally supplies
medium/wide primitive aliases; generated media queries use the approved literal
600/1024px conditions because native CSS variables cannot drive media conditions.
This is a local format with `$type`/`$value` notation, not an assertion of external
interchange-standard compliance. Scope metadata is advisory; no Figma scopes or
collections were created.

## Build and consume

From website/:

- `npm run tokens:audit` refreshes 49-family mapping coverage from actual Astro dependencies.
- `npm run tokens:build` validates tiers/types/names/cycles and regenerates exports.
- `npm run tokens:qa` audits actual CSS bindings, retained declarations, mode exports and duplicate resolved values.
- `npm run tokens:check` detects missing/stale deterministic exports.
- `npm run verify:tokens` verifies approved-value parity, component boundaries,
  ten routes, example references and 49-family coverage.
- `npm run build` automatically runs the token generator first.

Generated artifacts in `dist/` are mirrored to website/public/tokens for download:
CSS, source JSON, resolved JSON, registry metadata, typed CSS names, responsive
values, pending declarations and component coverage. Edit sources, not exports.
The generator never edits component implementations or Figma.

```css
/* From website/src/styles/: */
@import "../../../design-system/tokens/dist/tokens.css";
.example { color: var(--samvad-semantic-color-text-primary); }
```

The generated `css-variables.ts` exports `tokenCssNames`, the `TokenId` type and
`tokenVar(id)` for local TypeScript consumers. It does not imply an installed npm
package. Fonts must be loaded separately.

CSS uses `--samvad-primitive-*`, `--samvad-semantic-*` and
`--samvad-component-*`. Website-only `--docs-*` and private `--_*` controls remain
separate and must not be used as a public token API. Theme scopes redeclare alias
chains so nested Light/Dark examples resolve correctly. There are no duplicated
Light/Dark component implementations.

## Mapping and limits

All 49 families and 68 source files were inventoried before assignment; see
verification/pre-token-inventory.json. Supported colours, spacing, radii, font
families/sizes/weights, border widths and motion now connect through Semantic or
Component aliases. Layout helpers use semantic spacing/container references.
This is a partial property migration, not zero hardcoded values.

The five-area visual review is approved and implemented. `decision-approved`
metadata identifies only its scoped roles/exceptions. Field shadows retain their
reviewed geometry, alpha and pigment. Popover uses elevation/2. Toast retains
its geometry/alpha with neutral/950 in Dark. Quiet borders use neutral/800 Dark;
control boundaries remain neutral/500. Field/selection labels use 14/20/600,
helper/error text uses 14/22/400, and OTP tracking is retained. Large controls
retain 56px as a size exception; focus offsets use 2px; equivalent capsules use
full radius. Button transitions use standard easing. Loading retains 960ms with
linear spinner/ease-in-out skeleton easing as explicit exceptions, not inferred
multiples of ordinary state timing. Reduced motion disables those animations.

39 retained declarations remain, including approved OTP tracking, functional
geometry, Badge/Table weight 500, deferred line heights and composite indicators.
Unrelated role/API ratification, package distribution and native adapters remain
pending. See QA_REPORT.md for final evidence. Patterns and Resources are not authorized.

Consolidated QA: [QA_REPORT.md](QA_REPORT.md). The original 76-entry retained register
contained one stale documentation-only border entry; 75 active declarations remained at that checkpoint; 39 remain after approved implementation,
with specific reasons and an archived correction in source/pending.json.
