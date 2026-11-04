"""Regenerate Phase 2 foundation documentation and contrast evidence.

This is a foundation specification, not the Phase 3 token export pipeline.
Run from the project root: python3 design-system/foundations/scripts/prepare.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
BASE = ROOT / 'design-system/foundations'
STEPS = [50,100,200,300,400,500,600,700,800,900,950]
RAMPS = {
 'neutral': ['FCF9F6','F5EEEA','E9DDD8','D7C6C1','BAA4A1','997F80','776368','635058','4D3B46','3B2935','291B25'],
 'mulberry': ['FCF3F8','F8E4EF','EFBFD9','E8A0C6','D271A9','AB477F','742653','601E45','4C1939','3D162F','290D20'],
 'success': ['F0FAF4','DDF3E5','BCE5CC','8ACFA7','54AF7D','328E5D','24734B','205C3E','1C4934','183C2C','0C241A'],
 'warning': ['FFF9E8','FFF0C2','FFE08A','FFCA52','EDAC20','BB810D','946000','784B08','623D0D','513210','301C06'],
 'error': ['FFF2F3','FFE2E6','FFC5CE','F89CAA','EC6C81','D64C64','B83446','96293B','7B2636','662431','3C101C'],
 'info': ['F0F7FF','E0EDFC','BED9F5','91BEEB','609AD8','3E7DBD','2D659E','27517F','244369','223957','132239'],
 'apricot': ['FFF7EF','FFEADB','FFD8BC','FFC59E','F4A475','DF8050','B75D32','934728','763B25','603222','381B10'],
 'lime': ['FAFCEB','F1F7CB','DEEC86','C9DC61','ABC33F','8AA128','697D1C','52621B','424F1B','38421B','1D250B'],
}
COLORS = {k:dict(zip(map(str,STEPS),['#'+v for v in vs])) for k,vs in RAMPS.items()}
TYPE = [
 ('display',48,56,600,-.03),('heading/1',36,44,600,-.025),
 ('heading/2',28,36,600,-.02),('heading/3',24,32,600,-.015),
 ('heading/4',20,28,600,-.01),('body/l',18,28,400,0),
 ('body/m',16,24,400,0),('body/s',14,22,400,0),
 ('label',14,20,600,0),('caption',12,18,400,0)]
SPACING = [0,2,4,8,12,16,20,24,32,40,48,64,80,96]
RADIUS = {'none':0,'xs':2,'sm':4,'md':8,'lg':12,'xl':20,'full':9999}
SHADOWS = [
 {'level':0,'x':0,'y':0,'blur':0,'spread':0,'lightOpacity':0,'darkOpacity':0},
 {'level':1,'x':0,'y':1,'blur':2,'spread':0,'lightOpacity':.06,'darkOpacity':.16},
 {'level':2,'x':0,'y':4,'blur':12,'spread':-2,'lightOpacity':.08,'darkOpacity':.20},
 {'level':3,'x':0,'y':8,'blur':24,'spread':-4,'lightOpacity':.10,'darkOpacity':.24},
 {'level':4,'x':0,'y':16,'blur':40,'spread':-8,'lightOpacity':.12,'darkOpacity':.28},
]
LAYOUT = [
 {'name':'Compact','min':0,'max':599,'columns':4,'gutter':16,'margin':16,'specimenWidth':360},
 {'name':'Medium','min':600,'max':1023,'columns':8,'gutter':24,'margin':24,'specimenWidth':768},
 {'name':'Wide','min':1024,'max':None,'columns':12,'gutter':24,'margin':32,'specimenWidth':1200},
]
def write(path, text):
 p=ROOT/path
 # Governance and component inventory are maintained beyond the Phase 2 generator.
 if str(path) in {'AGENTS.md','DESIGN_SYSTEM.md','CONTRIBUTING.md','CHANGELOG.md','design-system/components/README.md'} and p.exists():
  return
 p.parent.mkdir(parents=True,exist_ok=True); p.write_text(text.rstrip()+'\n')
def table(headers, rows):
 return '\n'.join(['| '+' | '.join(headers)+' |','| '+' | '.join(['---']*len(headers))+' |']+['| '+' | '.join(map(str,r))+' |' for r in rows])
def color(ref):
 family,step=ref.split('/'); return COLORS[family][step]
def luminance(h):
 rgb=[int(h[i:i+2],16)/255 for i in (1,3,5)]
 lin=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in rgb]
 return sum(a*b for a,b in zip(lin,[.2126,.7152,.0722]))
def contrast(a,b):
 x,y=sorted([luminance(a),luminance(b)])
 return (y+.05)/(x+.05)

PAIRS = [
 ('Light','Primary text','neutral/950','neutral/50',4.5),
 ('Light','Secondary text','neutral/600','neutral/50',4.5),
 ('Light','Action label','neutral/50','mulberry/600',4.5),
 ('Light','Input boundary','neutral/500','neutral/50',3),
 ('Light','Focus ring','mulberry/600','neutral/50',3),
 ('Light','Apricot text','neutral/950','apricot/300',4.5),
 ('Light','Lime text','neutral/950','lime/200',4.5),
 ('Dark','Primary text','neutral/50','neutral/950',4.5),
 ('Dark','Secondary text','neutral/300','neutral/950',4.5),
 ('Dark','Raised surface text','neutral/50','neutral/900',4.5),
 ('Dark','Action label','neutral/950','mulberry/200',4.5),
 ('Dark','Input boundary','neutral/500','neutral/950',3),
 ('Dark','Focus ring','mulberry/200','neutral/950',3),
 ('Dark','Focus on raised surface','mulberry/200','neutral/900',3),
]
for family in ['success','warning','error','info']:
 PAIRS += [('Light',family+' text / icon / border',family+'/600',family+'/50',4.5),('Dark',family+' text / icon / border',family+'/200',family+'/950',4.5)]
CHECKS=[]
for theme,role,fg,bg,threshold in PAIRS:
 ratio=contrast(color(fg),color(bg))
 CHECKS.append(dict(theme=theme,role=role,foreground=fg,background=bg,foregroundHex=color(fg),backgroundHex=color(bg),ratio=round(ratio,3),minimum=threshold,passed=ratio>=threshold))
assert all(x['passed'] for x in CHECKS), CHECKS

DATA=dict(status='Phase 2 foundation specification; not a three-tier token release',version='0.2.0',
 colors=COLORS,steps=STEPS,typography=[dict(name=n,size=s,lineHeight=l,weight=w,trackingEm=t) for n,s,l,w,t in TYPE],
 fonts=dict(primary='Geist',mono='Geist Mono',preferredUnavailable=['General Sans','Satoshi'],devanagari='Noto Sans Devanagari',telugu='Noto Sans Telugu'),
 spacing=SPACING,radius=RADIUS,shadows=SHADOWS,layout=LAYOUT,containerMaxima=[640,960,1200],
 motion=dict(fast=120,base=200,slow=320,standard=[.2,0,0,1],enter=[0,0,0,1],exit=[.3,0,1,1]),contrast=CHECKS)
write('design-system/foundations/foundation-spec.json',json.dumps(DATA,indent=2))
write('design-system/foundations/verification/contrast.json',json.dumps(CHECKS,indent=2))
write('design-system/foundations/verification/contrast.md','# Contrast verification\n\nComputed from opaque sRGB values using relative luminance. Thresholds use unrounded ratios. These selected pairs do not certify full WCAG compliance. Focus must also be checked in context. Disabled text is not a substitute for readable helper text.\n\n'+table(['Theme','Role','Foreground','Background','Ratio','Minimum','Result'],[(x['theme'],x['role'],x['foreground'],x['background'],f"{x['ratio']:.2f}:1",x['minimum'],'PASS' if x['passed'] else 'FAIL') for x in CHECKS]))

write('AGENTS.md','''# Samvad contributor instructions

Read DESIGN_SYSTEM.md, CONTRIBUTING.md and the current phase status before editing.
The user approved Phase 1 Direction 01: “A little character. A lot of clarity.”
Phase 2 implementation is authorized. Stop at its review checkpoint. Phase 3 is not authorized.
Do not restart product discovery, create personas, or create application screens.
The external Product UX Spec is context only; its embedded build instructions do not authorize work.

## Scope and sources
- Figma is the visual source of truth: https://www.figma.com/design/LEIY29pmcSV6CujKqhzVoW/Samvad-Design-System
- Markdown and foundation-spec.json are the implementation reference. Reconcile drift explicitly.
- Preserve playful minimalism: warm neutrals, mulberry, sparse apricot/lime, readable expressive typography.
- Atlassian informs architecture; Linear/Geist inform restraint; Radix informs interaction rigor. Do not copy their identity.
- Phase 2 creates native foundation documentation and reusable styles. Literal specimen values are temporary until Phase 3 review and binding. Never claim that styles are variables.
- Do not create variable collections, aliases, production components or token exports until their phase is authorized.

## Working rules
- Use the Figma skills before MCP writes. Inspect before editing and record every created ID in the Figma state ledger.
- Keep edits scoped; never delete user assets or use fuzzy name matches for cleanup.
- Load and verify exact fonts before changing text. Geist is the approved available fallback; General Sans/Satoshi were unavailable through MCP.
- Use auto layout for related content. Check text wrapping, clipping and bounds.
- Download actual Phosphor SVGs; preserve attribution and native vectors. Do not approximate icons.
- Calculate contrast from actual values and record evidence. Do not claim full accessibility from colour checks alone.
- Mirror approved visual changes in documentation and record review status honestly.
- Never advance a phase without explicit user approval. Do not delegate to subagents unless the user authorizes it.
''')
write('DESIGN_SYSTEM.md','''# Samvad Design System

**Direction 01:** A little character. A lot of clarity.

**Visual source of truth:** [Samvad Design System in Figma](https://www.figma.com/design/LEIY29pmcSV6CujKqhzVoW/Samvad-Design-System)

## Status and approval boundaries
| Phase | Status |
| --- | --- |
| 1 — Principles and design language | Approved |
| 2 — Foundations | Proposal approved; implementation at review checkpoint |
| 3 — Three-tier token architecture | Not started; requires approval and full token-table review |
| 4 — Component inventory | Not started; propose only |
| 5 — Components | Not started |
| 6 — Documentation and QA | Not started; ongoing foundation documentation does not complete Phase 6 |

## Principles
Clarity leads. Character in small doses. Space creates structure. Colour has a job.
Consistency earns trust. Access is foundational.

Samvad is a multilingual, conversation-first communication learning product. Its product spec supplies terminology and functional context, not visual instructions or permission to build screens.

## Foundations
See [the foundation index](design-system/foundations/README.md) and [machine-readable foundation specification](design-system/foundations/foundation-spec.json).
The JSON records Phase 2 values; it is not the reviewed Phase 3 token table or a production token package.
Current Figma colours, typography, elevation and grids use reusable native styles. Figma Starter limits this file to three pages; individually named foundation boards preserve structure within that limit. Construction returns confirm all 11 boards and 115 styles were created. Overview and Typography have passed visual review; remaining visual reviews and final style read-back are pending because the Starter MCP call quota was reached. Phase 3 will introduce approved Primitives → Semantic (Light/Dark) → Component aliases and migrate specimen bindings. Components must never consume primitives directly.

## Accessibility and platform mapping
Target WCAG 2.2 AA; text contrast 4.5:1 (3:1 qualifying large text), required non-text contrast 3:1. Shared hit area 44 logical units, Android 48 dp. Keyboard focus is visible and unobscured; status includes text or icons. Support scalable type, captions, reduced motion and native scripts.
Use rem for web typography and scalable layout where appropriate; dp/sp on Android. Do not disable user font scaling. Logical Figma sizes are not physical pixels.

## Source-of-truth contract
Every foundation has stable slash-based naming and a Markdown specification. Figma node/style IDs are recorded in foundations/verification/figma-state.json. Approved changes update both sources in the same revision. Resolve drift before adding dependents. No automatic bidirectional synchronization is claimed.
''')
write('CONTRIBUTING.md','''# Contributing

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
''')
write('CHANGELOG.md','''# Changelog

## 0.2.0 — 2026-11-03
### Approved scope
- Phase 2 foundation proposal approved: colour architecture, typography scale, spacing, layout, radius, elevation, borders, icons, illustration and motion.
- Native foundation specimens and contributor documentation authorized; token architecture remains deferred to Phase 3.
### Implementation for checkpoint review
- Eight 11-step colour ramps and selected Light/Dark contrast pairs specified.
- Geist used as the approved fallback because General Sans and Satoshi are unavailable through the connected Figma font API. Geist Mono and Noto script specimens specified.
- Reusable native foundation styles and Figma verification are tracked in foundations/verification/figma-state.json.
- Three-page Starter limit: Colour and Typography have dedicated pages; the other foundations are named boards on Foundations.
- Overview and Typography screenshots reviewed; the Starter MCP call limit blocked the remaining nine screenshot reviews and final live style read-back. See verification/README.md.
- No components, application screens, three-tier variables or production exports included.

## 0.1.0 — 2026-11-03
- Phase 1 Direction 01 approved: “A little character. A lot of clarity.”
- Playful minimalism, warm neutral/mulberry colour direction and expressive readable typography approved.
''')
write('design-system/foundations/README.md','# Foundations\n\nPhase 2 implements the approved direction as native specimens and shared styles.\n\n'+ '\n'.join(f'- [{n.title()}]({n}.md)' for n in ['color','typography','spacing','layout','radius','elevation','border','iconography','illustration','motion'])+'\n\n[Contrast evidence](verification/contrast.md) · [Figma state ledger](verification/figma-state.json)\n\nFigma Starter permits three pages. Colour and Typography have dedicated pages; the Foundations page holds the overview and eight separately named foundation boards. Split them into dedicated pages when the file permits more pages. Token collections and component bindings are intentionally deferred until Phase 3 approval.')
write('design-system/foundations/color.md','# Colour\n\nWarm neutral surfaces and mulberry actions establish the identity. Apricot and lime are supporting accents, not feedback statuses. Success, warning, error and info have distinct semantic intent.\n\n'+table(['Family']+list(map(str,STEPS)),[(f,)+tuple(COLORS[f].values()) for f in COLORS])+'''\n\n## Usage
Neutral/50 is the light canvas; neutral/950 is ink and dark canvas. Mulberry/600 is the light primary; mulberry/200 is the dark primary. Light semantic feedback uses family/600 on family/50; dark uses family/200 on family/950. These are foundation contrast examples, not the final semantic alias table.
Do not infer contrast from ramp indices. Light primary hover/pressed can use mulberry/700 and /800; dark hover/pressed can use /100 and /300, subject to contextual checks in Phase 3. Use neutral/500 for a meaningful input boundary; pale decorative dividers must not be the sole control boundary.
Use dark ink on apricot and lime. Do not use the pale lime concept-board focus ring as the only focus indicator against a light canvas. Use mulberry/600 (light) and /200 (dark) with a contrasting 2-unit gap.

## Verification
See verification/contrast.md. Opaque sRGB contrast pairs are computed reproducibly. Hover, pressed, overlays, alpha composites and full component states require contextual checks in later phases. Dark specimen boards use explicit palette values/styles, not functioning Figma modes yet.
''')
write('design-system/foundations/typography.md','# Typography\n\nGeneral Sans was preferred subject to availability; neither it nor Satoshi is exposed by the connected API. Use the approved available fallback **Geist**, with **Geist Mono** for technical labels. Do not label Geist as General Sans. The final checkpoint calls out this substitution.\n\n'+table(['Role','Size','Line height','Weight','Tracking em'],TYPE)+'''\n\n## Application
Use Regular 400 for body and SemiBold 600 for headings/labels (the actual Geist API style is `SemiBold`). Technical labels use Geist Mono Regular, 12/18 or 14/20. No uppercase paragraphs. Restrict tight tracking to Latin headings. Use hierarchy, whitespace and weight before adding colours.
On compact layouts use heading/1 or heading/2 instead of display when appropriate. Do not shrink body copy to fit. Web maps sizes to rem against a 16px default without locking the user's root size; Android uses sp and respects font scale.

## Script fallbacks
Noto Sans Devanagari and Noto Sans Telugu are available and included as specimens. At body size 16 use 28 line height for these script specimens, zero tracking, Regular or SemiBold. This is a safe starting line box, not language-quality approval. Test wrapping, combining marks, shaping and enlarged text with native reviewers. Do not force Latin transliteration or imply a launch-language decision.

## Font delivery
No font binaries are bundled. Use upstream distributions and verify redistribution terms before shipping. Geist: https://vercel.com/font. Noto: https://fonts.google.com/noto. Use platform-specific fallback stacks rather than assuming every family is installed on a user's device.
''')
write('design-system/foundations/spacing.md','# Spacing\n\nBase rhythm: 4 logical units, with 2 for optical adjustments.\n\n'+table(['Name','Value'],[(f'space/{v}',v) for v in SPACING])+'''\n\n2–8: tight detail; 12–24: related controls/content; 32–48: section separation; 64–96: large compositions. Zero is an intentional absence of space. Do not render a zero-width specimen as a nonzero spacing value. Hit targets are independent of icon and visible shape size. Use logical start/end for localizable padding.
''')
write('design-system/foundations/layout.md','# Layout\n\n'+table(['Range','Columns','Gutter','Minimum side margin','Specimen width'],[(x['name'],x['columns'],x['gutter'],x['margin'],x['specimenWidth']) for x in LAYOUT])+'''\n\nCompact: <600; Medium: 600–1023; Wide: ≥1024 CSS px/logical design units. Android window sizing may map differently: adapt to available width rather than device names. Content maxima: 640, 960 and 1200, selected by task. Wide content max excludes page margins; the 1200-wide specimen illustrates 12 columns within its own 32-unit margins, not a new container maximum.
Reading width targets roughly 60–70 characters. Use max-width: 65ch as a web starting point, then inspect the actual font. Narrow screens use available width. Honour safe areas, text enlargement and system UI. Use intrinsic content heights, auto layout, wrapping, logical edges and hug/fill relationships. Avoid fixed-height text containers. Grid styles define column structure; auto layout governs content relationships. No product screens are included.
''')
write('design-system/foundations/radius.md','# Radius\n\n'+table(['Name','Value'],RADIUS.items())+'''\n\nUse md for routine controls, lg/xl for larger surfaces, full for circles/capsules. Figma/web may use 9999 clamped to half the smaller dimension; native platforms should use a capsule shape or equivalent clamping. Do not treat 9999 as a physical mobile radius. Keep nested radii visually coherent and avoid pill shapes on all surfaces.
''')
write('design-system/foundations/elevation.md','# Elevation\n\n'+table(['Level','X','Y','Blur','Spread','Light alpha','Dark alpha'],[(s['level'],s['x'],s['y'],s['blur'],s['spread'],s['lightOpacity'],s['darkOpacity']) for s in SHADOWS])+'''\n\nLevels: 0 flat, 1 raised surface, 2 popover, 3 overlay, 4 dialog. Shadow colour: neutral/950. Dark shadows are supplemented by lighter surfaces and a border; black-on-dark shadows alone are insufficient. Figma effect styles preserve geometry and opacity. Web box-shadow can match geometry; Android elevation is not a direct pixel translation of CSS blur/spread. Use a documented platform adapter and compare renderings when implementing native code. This phase does not certify platform pixel parity.
''')
write('design-system/foundations/border.md','''# Borders and focus

Widths: border/none 0, border/default 1, border/strong 2. Solid is default. A dashed 4/4 pattern may denote a provisional region in documentation; it is not a universal interactive pattern.
Quiet surface dividers use neutral/200 in light and neutral/800 in dark. Required control boundaries use neutral/500 against the tested base canvases. Never use a decorative divider to imply a required control outline.
Focus: 2-unit mulberry ring, 2-unit contrasting offset. Light ring mulberry/600, dark ring mulberry/200. Verify adjacent surfaces and focused shapes in context. Do not rely on lime against near-white. Focus differs from hover, selection and error; preserve it when states overlap. Shared hit area ≥44 logical units, Android ≥48 dp. Foundation geometry examples are not interactive components.
''')
write('design-system/foundations/iconography.md','''# Iconography

Use Phosphor Regular by default; Fill only for selected-state emphasis with a supporting label/state cue. Do not mix unrelated libraries. Boxes: 16, 20, 24 logical units. Preserve upstream filled-path geometry: Regular has nominal 16/256 geometry, equivalent to 1, 1.25 and 1.5 units at 16, 20 and 24 respectively. Do not impose an arbitrary 2px stroke on filled paths.
Native SVG vectors are imported as specimens, not components. Later components will wrap them with approved token-bound colour and icon slots. Icons inherit semantic foreground. Label icon-only controls accessibly and keep the hit area independent from artwork. Do not mirror non-directional icons; evaluate directional icons for future RTL support.
Source: https://github.com/phosphor-icons/core. Files and upstream MIT license are in assets/icons. Examples: chat-circle, arrow-right, microphone, check-circle, warning-circle; filled chat-circle demonstrates selected weight.
''')
write('design-system/foundations/illustration.md','''# Illustration

Simple, mature vector geometry with controlled asymmetry. Use colour exclusively from the foundation palette; future production assets must use approved token mappings. Prefer a few substantial shapes and whitespace. Sample artwork is an abstract exchange of two speech shapes; it does not establish a logo or character identity.

Do: warm neutral background, mulberry/apricot/lime accents, limited geometric variation, calm composition. Reuse palette references in exports and document vector asset names.
Don't: neon gradients, arbitrary colours, emoji faces, confetti everywhere, exaggerated childish expressions or distracting movement during sensitive learning or feedback. Figma “don't” examples intentionally demonstrate misuse using the same approved palette; they are not reusable assets.
Text, icons and essential actions must remain usable without decorative artwork. Do not encode status only in illustration. Motion is optional and removed under reduced-motion preferences.
''')
write('design-system/foundations/motion.md','''# Motion and interaction

| Name | Value | Purpose |
| --- | --- | --- |
| duration/fast | 120 ms | Direct action acknowledgement |
| duration/base | 200 ms | State transition |
| duration/slow | 320 ms | Larger spatial transition |
| easing/standard | cubic-bezier(0.2, 0, 0, 1) | Routine state change |
| easing/enter | cubic-bezier(0, 0, 0, 1) | Arrival |
| easing/exit | cubic-bezier(0.3, 0, 1, 1) | Departure |

Respond to input immediately; transition timing must not delay input acknowledgement. Use motion to explain change, not to decorate every action. Avoid bounce and looping background motion. Voice state must say Ready, Listening, Thinking, Speaking, Paused or Connection issue; animation is supplementary. Never imply recording merely through a waveform.
Reduced motion: remove travel/scale; update state immediately, with optional short opacity change only where comfortable. Audio, captions and status continue to function. No live prototype animation is claimed: Phase 2 supplies timing tracks and easing diagrams as native documentation; operational component interactions belong to later implementation.
''')
for folder,phase,scope in [('tokens',3,'Primitives → Semantic (Light/Dark) → Component aliases, full table before creation'),('components',4,'Prioritized inventory and variants proposed in Phase 4; build only in Phase 5'),('patterns',6,'Reusable composition guidance within approved documentation scope')]:
 write(f'design-system/{folder}/README.md',f'# {folder.title()}\n\nReserved project structure. No {folder} implemented in Phase 2.\n\nNext scope: {scope}. Phase {phase} requires explicit approval.\n\nFoundation documentation does not authorize production component or pattern creation.')
print(json.dumps({'colors':sum(map(len,COLORS.values())),'typography':len(TYPE),'contrastChecks':len(CHECKS),'allPassed':all(x['passed'] for x in CHECKS)},indent=2))
