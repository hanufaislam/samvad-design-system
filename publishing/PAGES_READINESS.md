# GitHub Pages deployment preparation

Status: configuration approved for commit and push. Pages settings, workflow
dispatch and deployment still require the owner’s separate confirmation.

## Target and configuration

- Repository: https://github.com/hanufaislam/samvad-design-system
- Intended site: https://hanufaislam.github.io/samvad-design-system/
- Astro site default: https://hanufaislam.github.io
- Astro base default: /samvad-design-system/
- Existing SAMVAD_SITE_URL, SAMVAD_BASE_PATH and SAMVAD_OUTPUT_DIR overrides remain.
- The development URL now includes /samvad-design-system/. To run at the original
  local root, use `SAMVAD_BASE_PATH=/ npm --prefix website run dev`.

## Workflow

`.github/workflows/pages.yml` is manual-only (`workflow_dispatch`). It accepts
`release_confirmation`, requires the exact value `publish`, and checks the exact
repository and `main` branch. It cannot deploy on push or pull request.

Build: checkout without persisted credentials, Node 24.22.1, locked `npm ci`,
type check, Astro/Pagefind production build, output audit and Pages artifact upload.
The deploy job depends on a successful build and uses the github-pages environment.
Top-level permissions are empty; build has contents:read and pages:read; deploy
has only pages:write and id-token:write. No custom token or secret is needed.
The older publishing/github-pages.yml.example remains inactive historical material;
the new workflow is the deployment configuration prepared for review.

## Validation

- Astro type check: zero errors, warnings or hints.
- Production build: passes with project-base defaults; includes Pagefind index.
- All 84 direct/nested routes, 16,620 local references, 14 CSS asset references and
  105 code-copy controls pass the existing output audit.
- No approved website content, component styling, tokens or Figma changed.
- YAML structure and manual-only/permission/job dependency checks pass locally.
- Real GitHub-hosted installation and deployment remain untested until authorized.

## Owner settings and release sequence — only after approval

The read-only Pages API check returned 404; no configured Pages site was found.
In the repository, open Settings → Pages → Build and deployment → Source and
choose GitHub Actions. Ensure Actions is enabled and the referenced actions are
allowed by repository/organization policy. Keep default workflow permissions
read-only; the workflow declares its own required job permissions.

After approval, commit/push the reviewed configuration. Uploading this workflow
alone will not deploy it. Separately authorize deployment, then open Actions →
Deploy Samvad documentation to Pages → Run workflow, select main and enter publish.
Optional github-pages environment protection can require owner review before the
deploy job. Do not dispatch a default GitHub starter deployment while enabling Pages.

After the first authorized deployment, verify the live homepage, nested routes,
search, token downloads, fonts and Light/Dark behaviour. Project licensing remains
undecided; no open-source license was added by this preparation.
