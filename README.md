# Samvad Design System

**A little character. A lot of clarity.**

A static Astro documentation website for Samvad's approved visual language,
629-token architecture and 49 reusable component families. The six approved
sections cover Get Started, Foundations, Design Tokens, Components, Patterns and
Resources across 84 direct routes.

Public release is not yet authorized. This is local source, not a published npm
component package. Figma was not modified during documentation/release preparation.

## Install and run

Use the Node version in `.nvmrc` (24.22.1). The pinned Astro package requires
Node >=22.23.4 and npm >=9.6.5. Commands below use a POSIX shell.

```sh
cd website
npm ci
npm run dev
```

For production output and full-text Pagefind search:

```sh
npm run check
npm run build
npm run verify
npm run preview -- --port 4321
```

Open http://127.0.0.1:4321/. Development uses the existing route-title/keyword
search fallback; production preview uses the generated full-text index. Fonts,
icons and search are served locally; the site requires no API keys or backend.

## Validation

From website/, run `npm run audit:release` for the complete static/component/token
suite. Browser audit evidence and limitations are recorded in `FINAL_AUDIT.md`.
Repeat real browser checks when changing interactions, routes or deployment base.

Token source is under `design-system/tokens/source/`. Generated token exports in
`dist/` and `website/public/tokens/` are intentionally committed and checked for
parity. Edit approved source, never mirrored exports. Components consume Semantic
or Component aliases; website-only `--docs-*` styling is separate.

## Repository structure

```text
website/                  Astro app, local components, pages, public assets/tests
  src/components/         Reusable components and composed documentation specimens
  public/tokens/          Generated token downloads
  public/icons/           Phosphor SVGs and attribution
  public/licenses/        Original font license notices
  scripts/                Build and verification commands
design-system/
  foundations/            Approved source specification, guidance and assets
  tokens/                 Three-tier source, exports, generator and QA evidence
  components/             Implementation notes and component QA
  patterns/               Composition guidance and QA
  resources/              Resource documentation reference
publishing/               Inactive deployment template and release-prep tooling
```

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), [CONTRIBUTING.md](CONTRIBUTING.md),
[CHANGELOG.md](CHANGELOG.md), [FINAL_AUDIT.md](FINAL_AUDIT.md) and
[publishing instructions](publishing/README.md).

## Publishing

Use GitHub Pages via a reviewed Actions workflow. The Astro application remains
in website/. Set `SAMVAD_SITE_URL` to the approved HTTPS origin and
`SAMVAD_BASE_PATH` to `/REPOSITORY/` for a project site, or `/` for an owner/custom
root site. The approved repository is `hanufaislam/samvad-design-system`. For a future
Pages build use `SAMVAD_SITE_URL=https://hanufaislam.github.io` and
`SAMVAD_BASE_PATH=/samvad-design-system/`; deployment is not yet authorized.

The deployment template remains inactive outside `.github/workflows/` and has no
push trigger. Review the clean repository candidate and explicitly approve public
release before any push or deployment. Local Git preparation is authorized.

## Licensing and limitations

Project licensing needs the owner's decision before release; see
[LICENSING.md](LICENSING.md). Third-party notices are retained in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). No Samvad license is invented.

Remaining candidate mappings, platform/font delivery and browser/assistive-
technology limitations remain explicit. Documentation approval does not claim
full WCAG certification, native Figma/code synchronization or a public package API.
