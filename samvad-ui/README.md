# Samvad UI

The complete application preserved from https://samvad-onboarding-review.vercel.app, verified on 6 November 2026. Includes onboarding, Home, Library, lessons, local demo practice, progress and profile/settings. Later world-preview and design variations are excluded.

This is an independent static application within the Samvad Design System repository. It does not require the documentation website or npm dependencies. Source HTML, CSS, JavaScript, fonts and illustrations are in this folder; attribution is retained under assets/.

## Run locally

From this folder, run `npm start`, then open http://127.0.0.1:4174/. Python 3 is required for this local server. Hash routes such as `/#home` and `/#lesson/comfort-1` work on any static host.

## Verify and build

Node 18 or later is required. Run `npm test`, then `npm run build`. The build checks each source asset against published-baseline.json before producing dist/. No npm install is necessary.

The manifest records SHA-256 hashes compared against the live website, not an inferred reconstruction. All 51 published files were identical to the retained local release artifact. Hosting metadata, local reviews, original external curriculum fixtures and experimental previews are excluded. The portable runtime tests cover curriculum inventory, persistence/migration, malformed data handling, local practice feedback and script syntax.

## Hosting

For an independent hosting project, select this same repository, set Root Directory to `samvad-ui`, Build Command to `npm run build`, and Output Directory to `dist`. This folder addition does not modify the existing Vercel deployment or the design-system publishing workflow. The repository folder has its own GitHub URL; a new hosted website URL requires a separate hosting project.

## Prototype boundaries

Practice uses local demo rules, not a live AI service. Accounts, cloud sync and backend services are not connected. Progress and preferences are stored in the browser. Speech features depend on browser support and permissions; translations are partial. This is the existing published behavior, preserved without redesign.
