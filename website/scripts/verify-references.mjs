import {assertPreserved} from './preservation.mjs';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {transform} from '@astrojs/compiler-rs/async';
const entries=JSON.parse(readFileSync('src/components/patterns/content.json','utf8'));
const registry=JSON.parse(readFileSync('../design-system/tokens/dist/registry.json','utf8'));assert.equal(registry.length,629);
const ids=new Set(registry.map(t=>t.id)),cssNames=new Set(registry.map(t=>t.css));
const decode=s=>s.replace(/&#(?:x([0-9a-f]+)|(\d+));/gi,(_,h,d)=>String.fromCodePoint(parseInt(h||d,h?16:10))).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
let examples=0,astroExamples=0,sidebarAssertions=0;const demoNames={overview:'Overview',forms:'Forms',navigation:'Navigation',loading:'Loading',empty:'Empty',feedback:'Feedback'};
for(const e of entries){
 const html=readFileSync('dist/'+e.path+'index.html','utf8');
 for(const section of ['intent','guidelines','accessibility','implementation','related'])assert(html.includes(`id="${section}"`));
 const domIds=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(domIds.length,new Set(domIds).size,e.path+': duplicate IDs');
 for(const match of html.matchAll(/\s(?:for|aria-describedby|aria-controls|aria-labelledby)="([^"]+)"/g))for(const id of match[1].split(' '))assert(domIds.includes(id),e.path+': broken relationship '+id);
 const navs=[...html.matchAll(/<nav aria-label="Documentation"[\s\S]*?<\/nav>/g)].map(m=>m[0]);assert.equal(navs.length,2);
 for(const nav of navs)for(const target of entries){assert.equal(nav.split(`href="/${target.path}"`).length-1,1);sidebarAssertions++;if(target.id===e.id)assert(nav.includes(`href="/${target.path}" aria-current="page"`));}
 for(const id of e.tokens)assert(ids.has(id),'Unknown token '+id);
 const snippets=[...html.matchAll(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g)].map(m=>decode(m[1]));
 if(e.demo){assert(html.includes('data-pattern-example'));const source=readFileSync(`src/components/patterns/${demoNames[e.demo]}Example.astro`,'utf8');assert.equal(snippets[0],source,e.path+': displayed composition differs from actual source');}
 for(const code of snippets){examples++;if(code.startsWith('---')){const r=await transform(code,{filename:e.slug+'.astro'});assert(!r.errors?.length);astroExamples++;}for(const match of code.matchAll(/var\((--samvad-[\w-]+)\)/g))assert(cssNames.has(match[1]));}
 const search=html.match(/<script id="search-pages"[^>]*>([\s\S]*?)<\/script>/);assert(search);const catalog=JSON.parse(search[1]);for(const t of entries)assert(catalog.some(p=>p.path===t.path));
}
for(const m of readFileSync('src/components/patterns/reference.css','utf8').matchAll(/var\((--samvad-[\w-]+)\)/g))assert(cssNames.has(m[1]),m[1]);
const manifest=JSON.parse(readFileSync('../design-system/patterns/preservation-manifest.json','utf8'));for(const [path,hash] of Object.entries(manifest))assertPreserved(path,createHash('sha256').update(readFileSync('../'+path)).digest('hex'),hash);
const result={pages:entries.length,examples,astroExamples,sidebarAssertions,sourceMatchedPreviews:6,protectedFiles:Object.keys(manifest).length,approvedTokenCount:629,passed:true};writeFileSync('../design-system/patterns/static-qa.json',JSON.stringify(result,null,2)+'\n');console.log('PASS: '+JSON.stringify(result));
