# Repository preparation — no push or deployment authorized

The owner has created the empty public repository `hanufaislam/samvad-design-system`.
The only authorized remote is `https://github.com/hanufaislam/samvad-design-system.git`.
Local Git preparation on `main` and an initial commit are authorized. Push and
GitHub Pages deployment still require explicit approval.

Future project-site configuration: `SAMVAD_SITE_URL=https://hanufaislam.github.io`
and `SAMVAD_BASE_PATH=/samvad-design-system/`. No deployment workflow is active.
Project licensing remains undecided; retain third-party notices and do not add
an open-source license without the owner's approval.

The connected GitHub integration currently uses another account and has no push
permission. Authenticate as the intended owner before any later push.

## Local verification

```sh
npm --prefix website ci
npm --prefix website run audit:release
```

The repository root contains documentation, `website/`, `design-system/` and
`publishing/`. Dependencies, local review artifacts, environment files, raw Figma
session records and built website output remain untracked. Token exports are
intentional versioned files. See README.md and FINAL_AUDIT.md for architecture
and prior audit limitations.

## After explicit publishing approval

1. Confirm license status, the intentional public Figma link and commit contents.
2. Authenticate as the intended owner; verify the exact remote and empty main history.
3. Push the reviewed main commit only after approval.
4. Separately review and enable the inactive `github-pages.yml.example` template
   and Pages settings only after deployment approval.
5. Smoke-test the deployed routes, assets, search, themes and deep links.
