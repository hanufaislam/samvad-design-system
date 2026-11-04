# Final website audit and publishing preparation

Date: 2026-11-04. Status: **PASS locally; public release awaits owner approval.**

All six approved documentation sections, 84 routes, 49 component families and the
629-token architecture were audited. No Git initialization, repository creation,
push, public deployment or Figma access occurred.

## Validation results

| Check | Result |
| --- | --- |
| Astro type check | 129 files; zero errors, warnings or hints |
| Production builds | Root `/` and project base `/samvad-design-system/` pass |
| Generated routes and links | 84 routes, 16,620 local references and 14 CSS asset references pass in each build |
| Structural checks | Headings, unique IDs, label/ARIA references, anchors and asset existence pass |
| Browser matrix | 1,400 checks; 320, 768, 1024 and 1440px, Light/Dark, navigation and overlays; no failures |
| Project-base browser checks | All 84 routes visited; all 105 code-copy controls pass |
| Colour copy controls | All 90 values copied and verified against the clipboard |
| Keyboard and integration | Search, Escape/focus return, popover, navigation links, form recovery, switch and manual tabs pass |
| Existing component verification | Actions, forms, selection, display, feedback, navigation, overlays and layout suites pass; 49 families accessible |
| Tokens | 629 tokens; tier/mode contracts, approved mappings and all 20 deterministic exports pass |
| Design preservation | Token source/public exports and all five shell/component CSS files unchanged by SHA-256 |
| Isolated source preflight | Complete release suite passes from an independently copied source tree |

The isolated preflight reused the existing pinned dependencies through a temporary
local symlink. It does not constitute a fresh network `npm ci`, Linux CI run or
actual GitHub Pages deployment. No browser console errors were observed in the
project-base route sweep. Existing regression checks cover focus and reduced-motion
rules; this is not a formal WCAG certification or exhaustive assistive-technology audit.

## Genuine issues corrected

- Fixed 61 root-relative rendered links that escaped a GitHub Pages project base.
  Shared internal-link resolution now preserves base paths, external URLs and hashes.
- Replaced obsolete prototype/unapproved notices with the approved section status.
  Clarified retained field typography, loading cadence and candidate mapping limits.
- Updated stale Actions verification expectations and made shared verification
  scripts create their own output directories for independent clean-source runs.
- Added configurable Astro site/base/output settings and a build helper ensuring
  Astro and Pagefind use the same destination.
- Added original bundled font license notices, public-release instructions, an
  allowlisted repository staging tool and pattern-based privacy checks.
- Kept all approved token values, component styling and shell layout unchanged.
  The exact changed-source hash ledger is `publishing/audit/fixes.json`.

One browser test initially assumed the wrong top-navigation destination; the
expectation was corrected to Home. Palette-copy verification initially inspected
an accessibility diff instead of the full confirmation; clipboard verification
and a focused retry confirmed all values. Neither required product changes.

## Repository and publishing readiness

Git is not initialized and there is no remote. A targeted read-only search of the
connected GitHub account found no Samvad-named repository. This does not establish
absence in other accounts or organizations. The intended owner and repository
name still need confirmation.

`README.md`, `.gitignore`, `.nvmrc`, installation/build instructions, third-party
notices and an inactive manual-release workflow example are prepared. The clean
candidate is staged under `.release-check/public-repo/`; no Git metadata, local
review images, dependencies, built website, environment files or native Figma
session ledger belong in that candidate. `publishing/scripts/scan-candidate.mjs`
passed on all 284 candidate text files with zero findings or credential signatures; its local result is kept outside the candidate.

Recommended deployment: GitHub Pages using Astro's GitHub Actions workflow with
an explicit manual dispatch. Confirm the real origin and base path before enabling
it. The workflow remains an example outside `.github/workflows/` and cannot deploy
from this workspace. See [publishing instructions](publishing/README.md) and the
[official Astro guide](https://docs.astro.build/en/guides/deploy/github/).

## Remaining decisions and limitations

1. Choose the GitHub owner/repository and approve public release explicitly.
2. Choose project reuse/license terms; `LICENSING.md` deliberately does not invent a license.
3. Confirm the intentional Figma reference may remain public; Figma permissions were not tested or changed.
4. Execute a fresh dependency install and the real GitHub-hosted workflow after authorization.
5. Cross-browser, screen-reader and native platform-control coverage remain manual release checks.
6. Previously documented candidate mappings and deferred typography decisions remain pending; no new official mappings were introduced.
7. Privacy scanning is pattern-based and source-reviewed, not a guarantee against every possible secret. Reserved example addresses and documented localhost instructions are intentional.

## Exact next steps after approval

1. Confirm owner, repository name, license and public Figma reference.
2. Review the clean candidate and privacy result; run `npm ci` and `npm run audit:release` in its `website/` directory on a fresh environment.
3. With explicit authorization, initialize Git, create/select the public repository and push the reviewed candidate.
4. Enable GitHub Pages via Actions; activate the reviewed workflow template and confirm site/base settings.
5. Manually dispatch publication, then smoke-test the public routes, Pagefind, fonts, downloads and themes.

Stop here: Patterns, Resources, foundations and tokens remain approved; no further
implementation or public action is authorized by this report.
