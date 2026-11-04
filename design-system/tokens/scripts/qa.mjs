import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const home=resolve(dirname(fileURLToPath(import.meta.url)),'..'),root=resolve(home,'../..');
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const registry=read(home+'/dist/registry.json'),known=new Set(registry.map(t=>t.css));
const clean=s=>s.replace(/\/\*[\s\S]*?\*\/|@import[^;]+;/g,'').trim();
const files=['actions/actions','forms/forms','library/library','layout/layout'].map(p=>'website/src/components/'+p+'.css');
const rules=files.flatMap(file=>[...readFileSync(root+'/'+file,'utf8').matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(m=>({file,selector:clean(m[1]),body:m[2]})));
const refs=[];
for(const r of rules)for(const m of r.body.matchAll(/var\((--samvad-[\w-]+)/g)){assert(known.has(m[1]),'Unknown CSS reference '+m[1]);assert(!m[1].startsWith('--samvad-primitive-'),'Direct primitive consumer');refs.push({file:r.file,selector:r.selector,css:m[1]});}
const pending=read(home+'/source/pending.json');assert.equal(pending.items.length,39);
for(const p of pending.items){assert(p.reason.length>50&&p.category);assert(rules.some(r=>r.file===p.file&&r.selector===clean(p.selector)&&r.body.split(';').some(d=>{const i=d.indexOf(':');return d.slice(0,i).trim()===p.property&&d.slice(i+1).trim()===p.value;})), 'Stale pending declaration '+JSON.stringify(p));}
const bindings=read(home+'/verification/component-bindings.json');
for(const b of bindings){const token=registry.find(t=>t.id==='Component/'+b.componentToken);assert(token,'Unknown binding token');assert(refs.some(r=>r.file===b.file&&r.selector===clean(b.selector)&&r.css===token.css),'Stale component binding '+b.componentToken);assert.equal(token.values,'{Semantic/'+b.semanticToken+'}');}
const coverage=read(home+'/verification/component-coverage.json');assert.equal(coverage.length,49);
for(const c of coverage){assert(c.dependencyFiles.length);assert(c.bindingCount>0);for(const id of c.componentTokens)assert(registry.some(t=>t.id==='Component/'+id));}
const duplicates=[];
for(const tier of ['Primitives','Semantic','Component']){const groups=new Map();for(const t of registry.filter(t=>t.tier===tier)){const k=JSON.stringify([t.type,t.resolved.Light,t.resolved.Dark]);groups.set(k,[...(groups.get(k)||[]),t.id]);}for(const ids of groups.values())if(ids.length>1)duplicates.push({tier,ids});}
const css=readFileSync(home+'/dist/tokens.css','utf8');
for(const mode of ['Light','Dark']){const selector=mode==='Light'?':root,[data-theme="light"]':'[data-theme="dark"]';const start=css.indexOf('\n'+selector+'{');assert(start>=0);const block=css.slice(start,css.indexOf('}',start));for(const t of registry.filter(t=>t.tier==='Semantic')){const expected=t.values[mode].replace(/\{([^}]+)\}/g,(_,id)=>'var('+registry.find(r=>r.id===id).css+')');assert(block.includes(t.css+':'+expected+';'),'Mode export mismatch '+t.id+' '+mode);}}
const result={date:'2026-11-04',tokens:registry.length,families:coverage.length,actualCssReferences:refs.length,checkedBindingRecords:bindings.length,retainedDeclarations:pending.items.length,retainedCategories:pending.items.reduce((a,p)=>(a[p.category]=(a[p.category]||0)+1,a),{}),allRetainedDeclarationsExist:true,allBindingsExist:true,lightDarkExportParity:true,unknownCssReferences:0,duplicateResolvedValueGroups:duplicates,duplicatePolicy:'Equal resolved values across named roles are reported, not merged or treated as approval. CSS-name collisions are separately rejected by the generator.',limits:'Static source/export audit; existing live propagation evidence is retained separately. This run does not claim a new full browser accessibility audit.'};
writeFileSync(home+'/verification/consolidated-qa.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,duplicateResolvedValueGroups:duplicates.length},null,2));
