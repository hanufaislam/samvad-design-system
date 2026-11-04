import {assertPreserved} from './preservation.mjs';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {transform} from '@astrojs/compiler-rs/async';
const read=p=>JSON.parse(readFileSync(p,'utf8'));const added=read('src/components/foundation-docs/content.json');
const paths=['','get-started/principles/','foundations/colour/','foundations/typography/',...added.map(e=>e.path)];assert.equal(paths.length,16);
const registry=read('../design-system/tokens/dist/registry.json');assert.equal(registry.length,629);const known=new Set(registry.map(t=>t.id)),cssNames=new Set(registry.map(t=>t.css));
const decode=s=>s.replace(/&#(?:x([0-9a-f]+)|(\d+));/gi,(_,h,d)=>String.fromCodePoint(parseInt(h||d,h?16:10))).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
let examples=0,compiled=0,sidebarAssertions=0;
for(const path of paths){const html=readFileSync('dist/'+path+'index.html','utf8');const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,path+': duplicate IDs');for(const m of html.matchAll(/\s(?:for|aria-describedby|aria-controls|aria-labelledby)="([^"]+)"/g))for(const id of m[1].split(' '))assert(ids.includes(id),path+': missing relationship '+id);
 const navs=[...html.matchAll(/<nav aria-label="Documentation"[\s\S]*?<\/nav>/g)].map(m=>m[0]);assert.equal(navs.length,2);for(const nav of navs)for(const target of paths){assert.equal(nav.split(`href="/${target}"`).length-1,1,path+': sidebar '+target);sidebarAssertions++;if(path===target)assert(nav.includes(`href="/${target}" aria-current="page"`));}
 assert(html.includes('id="connections"')||html.includes('id="related"'));assert(!html.includes('five-page prototype'));for(const m of html.matchAll(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g)){const code=decode(m[1]);examples++;if(code.startsWith('---')){const r=await transform(code,{filename:'foundation-example.astro'});assert(!r.errors?.length);compiled++;}for(const v of code.matchAll(/var\((--samvad-[\w-]+)\)/g))assert(cssNames.has(v[1]),v[1]);}
}
for(const entry of added)for(const id of entry.tokens)assert(known.has(id),'Unknown documented token '+id);
const css=readFileSync('src/components/foundation-docs/foundations.css','utf8');for(const v of css.matchAll(/var\((--samvad-[\w-]+)\)/g))assert(cssNames.has(v[1]),v[1]);assert(css.includes('@media(prefers-reduced-motion:reduce)'));
const foundation=read('../design-system/foundations/foundation-spec.json');const colour=readFileSync('dist/foundations/colour/index.html','utf8');for(const [family,ramp] of Object.entries(foundation.colors))for(const [step,hex] of Object.entries(ramp))assert(colour.includes(`Copy ${family}/${step}: ${hex}`),family+'/'+step);
const type=readFileSync('dist/foundations/typography/index.html','utf8');for(const t of foundation.typography)assert(type.includes(`var(--samvad-semantic-type-${t.name.replaceAll('/','-')}-size)`));
const manifest=read('../design-system/foundations/site-review/preservation-manifest.json');for(const [path,hash] of Object.entries(manifest))assertPreserved(path,createHash('sha256').update(readFileSync('../'+path)).digest('hex'),hash);
const result={pages:16,newRoutes:12,examples,compiledAstroExamples:compiled,sidebarAssertions,allEightRamps:true,approvedTokenCount:registry.length,protectedFiles:Object.keys(manifest).length,passed:true};writeFileSync('../design-system/foundations/site-review/static-qa.json',JSON.stringify(result,null,2)+'\n');console.log('PASS: '+JSON.stringify(result));
