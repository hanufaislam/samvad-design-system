import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';import {resolve,dirname,join} from 'node:path';import assert from 'node:assert/strict';
const home=resolve(dirname(fileURLToPath(import.meta.url)),'..');const root=resolve(home,'../..');
const layers=['Primitives','Semantic','Component'];const files=['primitives','semantic','components'];
const sources=Object.fromEntries(layers.map((layer,i)=>[layer,JSON.parse(readFileSync(join(home,'source',files[i]+'.json'),'utf8'))]));
const all=Object.fromEntries(layers.flatMap(layer=>Object.entries(sources[layer]).map(([key,entry])=>[layer+'/'+key,entry])));
export const cssName=id=>'--samvad-'+id.replace(/^Primitives\//,'primitive/').replace(/^Semantic\//,'semantic/').replace(/^Component\//,'component/').replaceAll('/','-');
const alias=/\{([^{}]+)\}/g;
function modeValue(entry,mode){return typeof entry.$value==='object'&&!Array.isArray(entry.$value)?entry.$value[mode]:entry.$value;}
function literal(entry,value){if(entry.$type==='cubicBezier'&&Array.isArray(value))return `cubic-bezier(${value.join(',')})`;return String(value);}
function refs(value){return [...String(value).matchAll(alias)].map(m=>m[1]);}
function resolveValue(id,mode,trail=[]){assert.ok(all[id],`Unknown token ${id}`);assert.ok(!trail.includes(id),`Alias cycle: ${[...trail,id].join(' -> ')}`);const entry=all[id],value=modeValue(entry,mode);assert.notEqual(value,undefined,`${id}: missing ${mode}`);return literal(entry,value).replace(alias,(_,target)=>resolveValue(target,mode,[...trail,id]));}
const names=new Set();
for(const [id,e] of Object.entries(all)){
 assert.ok(['color','dimension','number','fontFamily','duration','cubicBezier','string','shadow'].includes(e.$type),`${id}: unknown type`);
 if(id.startsWith('Primitives/')){
  if(e.$type==='color')assert.match(e.$value,/^#[0-9a-f]{6}$/i,`${id}: invalid colour`);
  if(e.$type==='dimension')assert.match(e.$value,/^-?[\d.]+(?:px|rem|em|ch)$/,`${id}: invalid dimension`);
  if(e.$type==='number')assert.ok(Number.isFinite(e.$value),`${id}: invalid number`);
  if(e.$type==='duration')assert.match(e.$value,/^[\d.]+ms$/,`${id}: invalid duration`);
  if(e.$type==='cubicBezier')assert.ok(Array.isArray(e.$value)&&e.$value.length===4&&e.$value.every(Number.isFinite),`${id}: invalid easing`);
 }
 assert.match(id,/^(Primitives|Semantic|Component)\/[a-z0-9]+(?:[/-][a-z0-9]+)*$/);assert.ok(!names.has(cssName(id)),`CSS name collision ${id}`);names.add(cssName(id));
 for(const mode of ['Light','Dark']){const value=modeValue(e,mode);const targets=refs(value);const layer=id.split('/')[0];if(layer==='Primitives')assert.equal(targets.length,0,`${id}: primitive must be raw`);else {assert.ok(targets.length,`${id}: aliases required`);for(const target of targets){assert.ok(target.startsWith(layer==='Semantic'?'Primitives/':'Semantic/'),`${id}: invalid tier reference ${target}`);assert.ok(all[target],`${id}: missing ${target}`);assert.equal(all[target].$type,e.$type,`${id}: mismatched type ${target}`);}}resolveValue(id,mode);}
 for(const value of Object.values(e.$responsive||{}))for(const target of refs(value)){assert.ok(target.startsWith('Primitives/'));assert.ok(all[target]);}
}
function cssValue(entry,mode){return literal(entry,modeValue(entry,mode)).replace(alias,(_,id)=>`var(${cssName(id)})`);}
const primitives=Object.entries(sources.Primitives).map(([k,e])=>`${cssName('Primitives/'+k)}:${cssValue(e,'Light')};`).join('\n');
const components=Object.entries(sources.Component).map(([k,e])=>`${cssName('Component/'+k)}:${cssValue(e,'Light')};`).join('\n');
let css='/* Generated from source/*.json. Local token API; candidate role mappings are explicitly tagged in registry.json. */\n';
css+=':root,[data-theme="light"],[data-theme="dark"]{\n'+primitives+'\n'+components+'\n}\n';
for(const mode of ['Light','Dark'])css+=(mode==='Light'?':root,[data-theme="light"]':'[data-theme="dark"]')+'{\n'+Object.entries(sources.Semantic).map(([k,e])=>`${cssName('Semantic/'+k)}:${cssValue(e,mode)};`).join('\n')+'\n}\n';
const foundation=JSON.parse(readFileSync(resolve(root,'design-system/foundations/foundation-spec.json'),'utf8'));
for(const breakpoint of ['medium','wide']){const minimum=foundation.layout.find(l=>l.name.toLowerCase()===breakpoint).min;css+=`@media(min-width:${minimum}px){:root,[data-theme="light"],[data-theme="dark"]{\n`+Object.entries(sources.Semantic).filter(([,e])=>e.$responsive?.[breakpoint]).map(([k,e])=>`${cssName('Semantic/'+k)}:${e.$responsive[breakpoint].replace(alias,(_,id)=>`var(${cssName(id)})`)};`).join('\n')+'\n}}\n';}
const registry=Object.entries(all).map(([id,e])=>({id,tier:id.split('/')[0],name:id.split('/').slice(1).join('/'),css:cssName(id),type:e.$type,values:e.$value,resolved:{Light:resolveValue(id,'Light'),Dark:resolveValue(id,'Dark')},responsive:e.$responsive||null,...e.$extensions.samvad}));
const tokens=Object.fromEntries(registry.map(e=>[e.id,e.css]));
const pending=JSON.parse(readFileSync(join(home,'source/pending.json'),'utf8'));
const coverage=JSON.parse(readFileSync(join(home,'verification/component-coverage.json'),'utf8'));
const outputs={'tokens.css':css,'registry.json':JSON.stringify(registry,null,2)+'\n','resolved.json':JSON.stringify(Object.fromEntries(registry.map(e=>[e.id,e.resolved])),null,2)+'\n','css-variables.ts':'// Generated local API. Status metadata remains authoritative in registry.json.\nexport const tokenCssNames = '+JSON.stringify(tokens,null,2)+' as const;\nexport type TokenId = keyof typeof tokenCssNames;\nexport const tokenVar = (id:TokenId) => `var(${tokenCssNames[id]})`;\n','responsive.json':JSON.stringify({breakpoints:foundation.layout.map(({name,min,max,columns,gutter,margin})=>({name,min,max,columns,gutter,margin})),containerMaxima:foundation.containerMaxima},null,2)+'\n','pending.json':JSON.stringify(pending,null,2)+'\n','component-coverage.json':JSON.stringify(coverage,null,2)+'\n'};
for(let i=0;i<layers.length;i++)outputs[files[i]+'.json']=JSON.stringify(sources[layers[i]],null,2)+'\n';
let checked=0;for(const [name,content] of Object.entries(outputs)){for(const dir of [join(home,'dist'),join(root,'website/public/tokens')]){const path=join(dir,name);if(process.argv.includes('--check')){assert.ok(existsSync(path),`Missing export ${path}`);assert.equal(readFileSync(path,'utf8'),content,`Stale generated export ${path}`);}else{mkdirSync(dir,{recursive:true});writeFileSync(path,content);}checked++;}}
console.log(`${process.argv.includes('--check')?'Verified':'Generated'} ${registry.length} tokens, ${checked} deterministic export files; aliases/types/modes/cycles validated.`);
