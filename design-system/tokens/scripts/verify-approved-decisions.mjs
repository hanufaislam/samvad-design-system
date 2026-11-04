import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const home=resolve(dirname(fileURLToPath(import.meta.url)),'..'),root=resolve(home,'../..');
const r=JSON.parse(readFileSync(home+'/dist/registry.json')),get=id=>r.find(t=>t.id===id);
assert.equal(get('Semantic/color/border/default').resolved.Dark,get('Primitives/color/neutral/800').resolved.Dark);
assert.equal(get('Semantic/color/border/control').resolved.Dark,get('Primitives/color/neutral/500').resolved.Dark);
assert.equal(get('Component/popup/shadow/default').resolved.Dark,get('Semantic/elevation/2').resolved.Dark);
assert.equal(get('Component/field/shadow/default').resolved.Dark,'0 8px 24px -8px rgb(0 0 0 / .24)');
assert.equal(get('Component/toast-notification/shadow/default').resolved.Dark,'0 16px 40px -8px rgb(41 27 37 / .24)');
assert.equal(get('Component/shared/type/label/weight').resolved.Light,'600');
assert.equal(get('Component/field/type/helper/size').resolved.Light,'0.875rem');
assert.equal(get('Component/field/type/helper/line-height').resolved.Light,'1.375rem');
assert.equal(get('Component/button/size/large').resolved.Light,'56px');
assert.equal(get('Component/shared/focus/offset').resolved.Light,'2px');
assert.equal(get('Component/shared/radius/full').resolved.Light,'9999px');
assert.equal(get('Component/button/motion/easing/standard').resolved.Light,'cubic-bezier(0.2,0,0,1)');
assert.equal(get('Semantic/motion/duration/spinner').resolved.Light,'960ms');
for(const p of ['actions/actions','forms/forms','library/library']){
 const css=readFileSync(root+'/website/src/components/'+p+'.css','utf8');
 assert(!/outline-offset:3px|border-radius:999px/.test(css));
 assert(css.includes('prefers-reduced-motion:reduce'));
 if(p==='actions/actions')assert(css.includes('.sv-action{transition:none}'));
 if(p==='library/library')assert(css.includes('.sv-loading__spinner,.sv-skeleton__line{animation:none}'));
}
const forms=readFileSync(root+'/website/src/components/forms/forms.css','utf8');assert(forms.includes('letter-spacing:.125em'));assert(forms.includes('line-height:1.5'));
const library=readFileSync(root+'/website/src/components/library/library.css','utf8');assert(library.includes('font-weight:500')); // explicitly deferred Badge/Table
console.log('PASS: approved five-area token contracts, retained exceptions, reduced-motion rules and deferred typography boundaries.');
