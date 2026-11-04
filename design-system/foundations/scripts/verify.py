"""Meaningful local Phase 2 checks; does not replace live Figma QA."""
import hashlib
import json
import xml.etree.ElementTree as ET
from pathlib import Path

BASE=Path(__file__).resolve().parents[1]
data=json.loads((BASE/'foundation-spec.json').read_text())
state=json.loads((BASE/'verification/figma-state.json').read_text())
def lum(h):
 c=[int(h[i:i+2],16)/255 for i in (1,3,5)]
 c=[v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in c]
 return sum(v*w for v,w in zip(c,[.2126,.7152,.0722]))
def resolve(ref):
 f,n=ref.split('/');return data['colors'][f][n]
assert len(data['colors'])==8
for family,ramp in data['colors'].items():
 assert list(map(int,ramp))==data['steps'],family
 levels=[lum(h) for h in ramp.values()]
 assert all(a>b for a,b in zip(levels,levels[1:])),family
for p in data['contrast']:
 a,b=sorted([lum(resolve(p['foreground'])),lum(resolve(p['background']))])
 ratio=(b+.05)/(a+.05)
 assert ratio>=p['minimum'],p
 assert abs(ratio-p['ratio'])<.001,p
assert len(state['paintStyles'])==88
assert len(state['textStyles'])==14
assert len(state['effectStyles'])==10
assert len(state['gridStyles'])==3
assert len(set(state['createdStyleIds']))==115
expected={'overview','colour','typography','spacing','layout','radius','elevation','borders','iconography','illustration','motion'}
assert set(state['boards'])==expected
assert all(not b['overflow'] for b in state['boards'].values())
assert all(b['width']==1440 and b['height']>0 for b in state['boards'].values())
all_ids=[n for b in state['boards'].values() for n in b['createdNodeIds']]
assert len(set(all_ids))==len(all_ids)
assets={}
for p in (BASE/'assets/icons').glob('*.svg'):
 tree=ET.fromstring(p.read_text())
 assert tree.tag.endswith('svg') and tree.get('viewBox')=='0 0 256 256',p
 assets[p.name]=hashlib.sha256(p.read_bytes()).hexdigest()
assert len(assets)==6
assert 'MIT' in (BASE/'assets/icons/LICENSE').read_text()
report={
 'localChecks':'PASS','colorFamilies':8,'colorValues':88,'monotonicRamps':True,
 'contrastPairs':len(data['contrast']),'contrastPassed':True,
 'nativeStyleCreationEvidence':{'paint':88,'text':14,'effect':10,'grid':3,'total':115},
 'nativeBoardCreationEvidence':len(expected),'nativeCreatedBoardNodes':len(all_ids),
 'structuralOverflowReports':0,'boardGeometry':'11 boards, each 1440 units wide',
 'assetSha256':assets,
 'visualReviewCompleted':['overview','typography'],
 'visualReviewPending':sorted(expected-{'overview','typography'}),
 'liveStyleReadback':'Pending: Figma Starter MCP call limit reached after construction.',
 'variables': 'None created; Phase 3 deferred.',
 'components':'None created; Phase 4 inventory and Phase 5 construction deferred.',
 'limitations':['Three-page Figma Starter limit; foundation boards grouped within three pages.','Geist fallback used; General Sans/Satoshi unavailable through connected font API.','No production token aliases, working theme modes, live component interactions, or native application rendering verification in Phase 2.'],
}
(BASE/'verification/local-qa.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['assetSha256','visualReviewPending']},indent=2))
