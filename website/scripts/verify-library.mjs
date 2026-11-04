import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {transform} from '@astrojs/compiler-rs/async';
import {libraryCatalog} from '../src/components/library/catalog.ts';
const decode=s=>s.replace(/&#(?:x([0-9a-f]+)|(\d+));/gi,(_,h,d)=>String.fromCodePoint(parseInt(h||d,h?16:10))).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
let snippets=0;
for(const e of libraryCatalog){
 const html=readFileSync(`dist/components/${e.group}/${e.slug}/index.html`,'utf8');
 for(const id of ['preview','properties','states','usage','accessibility','implementation','foundations'])assert.ok(html.includes(`id="${id}"`),e.slug+': missing '+id);
 assert.ok(html.includes(`data-library-example="${e.slug}"`));
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,e.slug+': duplicate ids');
 for(const m of html.matchAll(/\s(?:for|aria-describedby|aria-labelledby|aria-controls|popovertarget)="([^"]+)"/g))for(const id of m[1].split(' '))assert.ok(ids.includes(id),e.slug+': broken reference '+id);
 for(const match of html.matchAll(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g)){const result=await transform(decode(match[1]),{filename:e.slug+'.astro'});assert.ok(!result.errors?.length,e.slug+': snippet compile');snippets++;}
}
const colors=JSON.parse(readFileSync('../design-system/foundations/foundation-spec.json','utf8')).colors;
function lum(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);}
const pairs=[];for(const theme of ['light','dark'])for(const family of ['neutral','info','success','warning','error']){const fg=colors[family][theme==='dark'?'200':family==='warning'?'800':'700'];const bg=colors[family][theme==='dark'?(family==='neutral'?'900':'950'):(family==='neutral'?'100':'50')];const ratio=(Math.max(lum(fg),lum(bg))+.05)/(Math.min(lum(fg),lum(bg))+.05);assert.ok(ratio>=4.5,`${theme} ${family}: ${ratio}`);pairs.push({theme,family,fg,bg,ratio});}
mkdirSync('review',{recursive:true});writeFileSync('review/library-static-qa.json',JSON.stringify({pages:libraryCatalog.length,snippets,toneContrast:pairs},null,2));console.log(`PASS: ${libraryCatalog.length} pages, ${snippets} compiled examples, unique IDs/ARIA references and ${pairs.length} tone contrast pairs.`);
