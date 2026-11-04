import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {transform} from '@astrojs/compiler-rs/async';
import {batchCatalog} from '../src/components/forms/catalog.ts';
let snippets=0;
const decode=s=>s.replace(/&#(?:x([0-9a-f]+)|(\d+));/gi,(_,h,d)=>String.fromCodePoint(parseInt(h||d,h?16:10))).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&');
for(const entry of batchCatalog){
 const html=readFileSync(`dist/components/${entry.group}/${entry.slug}/index.html`,'utf8');
 for(const id of ['preview','configuration','usage','accessibility','implementation','foundations'])assert.ok(html.includes(`id="${id}"`),entry.slug+': missing section '+id);
 assert.ok(html.includes('data-batch-preview'),entry.slug+': missing reusable preview');
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,entry.slug+': duplicate ids');
 for(const m of html.matchAll(/\s(?:for|aria-describedby|aria-controls)="([^"]+)"/g))for(const id of m[1].split(' '))assert.ok(ids.includes(id),entry.slug+': broken relationship '+id);
 for(const match of html.matchAll(/<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g)){const result=await transform(decode(match[1]),{filename:entry.slug+'.astro'});assert.ok(!result.errors?.length,entry.slug+': snippet did not compile');snippets++;}
}
const result={pages:batchCatalog.length,compiledExamples:snippets,passed:true};mkdirSync('review',{recursive:true});writeFileSync('review/batch-static-qa.json',JSON.stringify(result,null,2));console.log(`PASS: ${result.pages} component pages; ${snippets} compiled examples; unique IDs, labels and description relationships.`);
