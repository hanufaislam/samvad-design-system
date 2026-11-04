# Actions — category review

Checkpoint 2 web implementation: complete for review. Stop before Inputs and forms.
No Figma changes, publication or GitHub push occurred.

| Component | Local route | Source under website/src/components/actions/ |
| --- | --- | --- |
| Button | http://127.0.0.1:4321/components/actions/button/ | Button.astro |
| Icon button | http://127.0.0.1:4321/components/actions/icon-button/ | IconButton.astro |
| Button group | http://127.0.0.1:4321/components/actions/button-group/ | ButtonGroup.astro |
| Text link | http://127.0.0.1:4321/components/actions/text-link/ | TextLink.astro |

Every route includes actual component previews, matching copyable examples,
variants, sizes, applicable states, real properties, usage/avoid guidance,
accessibility notes, implementation notes and foundation references. Preview
select controls are documentation tooling, not new form-library components.

## Composition and behaviour

- Button uses native semantics, defaults to type=button and owns busy appearance.
- IconButton composes Button, requires a label and supports optional aria-pressed.
  It emits samvad:toggle with detail.pressed; the label stays stable.
- ButtonGroup uses a labelled role=group and Button children. It is not a toolbar
  or segmented selection control. Tab visits enabled children normally.
- TextLink uses a real anchor. New tabs include noopener/noreferrer, an icon and
  an accessible announcement. Disabled links have no destination or Tab stop.
- setButtonLoading changes busy appearance/ARIA together. The shared runtime
  blocks repeat click and submit activation while busy, retaining focus.
- Astro bundles behaviour once. No client framework or published package is implied.
- Required styles/fonts are included. An ancestor data-theme=light or dark sets
  the preview theme; default without an ancestor is Light.
- Examples target source pages in website/src/pages and actual local imports.

## Provisional preview mappings — not production tokens

| Role | Existing foundations / preview assignment |
| --- | --- |
| Primary Light | mulberry/600 → /700 hover → /800 pressed; neutral/50 label |
| Primary Dark | mulberry/200 → /100 hover → /300 pressed; neutral/950 label |
| Destructive Light | error/600 → /700 → /800; neutral/50 label |
| Destructive Dark | error/200 → /100 → /300; neutral/950 label |
| Secondary | Neutral canvas, neutral/500 boundary, neutral surface on hover |
| Ghost | Transparent; primary foreground; neutral interaction surface |
| Disabled | neutral/600 Light or neutral/300 Dark on neutral surface |
| Small | Minimum 44px, 8 × 16px padding, 14/20 label at 600 |
| Medium | Minimum 48px, 12 × 20px padding, same label |
| Large | Minimum 56px, 16 × 24px padding, same label |
| Icon button | 20px Phosphor artwork in 44/48/56px square targets |
| Group | space/8 separated gap; space/4 joined focus clearance |
| Shape / focus | radius/md 8; 1px boundary; 2px ring + 2px offset |
| Link | Body S/M/L: 14/22, 16/24, 18/28; persistent underline |
| Motion | fast 120ms transition; spinner loop = 3 × slow = 960ms |

Private --_sa-* adapters are implementation details, not a public token API.
Final semantic aliases, component size/state assignments and toggle-selected
styling remain pending. Reduced motion removes transitions and spinner rotation.
The local 1200ms demo is not a design token or remote operation.

## Verification and limits

Passed: Astro type checking; nine static routes and links; 157 example
configurations compiled with the installed Astro compiler; 16 primary/destructive
and muted-text contrast pairs; 32 rendered geometry checks covering all four pages
at 320/768/1024/1440 in Light/Dark, without document overflow.

Browser checks confirmed pointer/Enter activation, busy Space suppression and
focus retention, finite loading completion, pointer/Space icon toggles, group Tab
order, real link navigation, disabled-link semantics and configured code copying.
Accessibility-tree names and states were inspected. Local evidence is stored in
website/review/ (ignored operational output).

Full manual screen-reader, cross-browser and physical-device validation is not
claimed. Other categories, production token binding, packaging and library-wide
QA remain outside this checkpoint.
