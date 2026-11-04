import assert from 'node:assert/strict';
import {readFileSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {transform} from '@astrojs/compiler-rs/async';
import {exampleFor,loadingExample} from '../src/components/actions/examples.ts';
import {actionDocs} from '../src/components/actions/catalog.ts';

const foundation=JSON.parse(readFileSync('../design-system/foundations/foundation-spec.json','utf8'));
const slugs=['button','icon-button','button-group','text-link'];
const required=['preview','variants','states','properties','usage','accessibility','implementation','foundations'];
for(const slug of slugs){
 const html=readFileSync(`dist/components/actions/${slug}/index.html`,'utf8');
 for(const id of required)assert.ok(html.includes(`id="${id}"`),`${slug}: missing ${id}`);
 assert.ok(html.includes('Approved component reference')&&html.includes('candidate role names remain explicit'),`${slug}: approval and remaining candidate status missing`);
 assert.ok(html.includes(`data-action-playground="${slug}"`),`${slug}: missing playground`);
 assert.ok(html.includes('data-copy-current="true"'),`${slug}: configured example is not copyable`);
 assert.ok(html.includes(slug==='text-link'?'sv-text-link':slug==='button-group'?'sv-button-group':'sv-action'),`${slug}: real component missing`);
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size,`${slug}: duplicate DOM ids`);
 const doc=actionDocs.find(d=>d.slug===slug);assert.ok(doc);
 assert.ok(doc.properties.length&&doc.states.length&&doc.references.length,`${slug}: incomplete contract`);
}
const icon=readFileSync('dist/components/actions/icon-button/index.html','utf8');
assert.ok(icon.includes('aria-label="Mark complete"'));
assert.ok(icon.includes('aria-pressed="false"'));
const link=readFileSync('dist/components/actions/text-link/index.html','utf8');
assert.ok(link.includes('rel="noopener noreferrer"'));
assert.ok(/<span[^>]+role="link"[^>]+aria-disabled="true"/.test(link));
const button=readFileSync('dist/components/actions/button/index.html','utf8');
assert.ok(button.includes('type="button"'));
assert.ok(button.includes('data-loading="true" aria-busy="true" aria-disabled="true"'));

let snippets=0;
async function checkSnippet(code){
 const result=await transform(code,{filename:'src/pages/action-example.astro'});
 assert.ok(result.code,'Snippet did not compile');
 for(const match of code.matchAll(/from ['"]([^'"]+)['"]/g)){
   const path=resolve('src/pages',match[1]);
   assert.ok(existsSync(path)||existsSync(path+'.ts'),`Snippet import does not exist: ${match[1]}`);
 }
 snippets++;
}
for(const kind of slugs){
 const variants=['button','icon-button'].includes(kind)?['primary','secondary','ghost','destructive']:kind==='button-group'?['separated','joined']:['default','subtle'];
 const states=['button','icon-button'].includes(kind)?['default','disabled','loading']:['default','disabled'];
 const modes=kind==='icon-button'?['action','toggle']:kind==='text-link'?['internal','external']:['action'];
 const layouts=kind==='button-group'?['horizontal','vertical']:['horizontal'];
 for(const variant of variants)for(const size of ['small','medium','large'])for(const state of states)for(const mode of modes)for(const layout of layouts)await checkSnippet(exampleFor(kind,{variant,size,state,mode,layout}));
}
await checkSnippet(loadingExample);
function luminance(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);}
const contrast=(a,b)=>{const [lo,hi]=[luminance(a),luminance(b)].sort((a,b)=>a-b);return(hi+.05)/(lo+.05);};
const pairs=[];
for(const theme of ['Light','Dark'])for(const family of ['mulberry','error'])for(const step of theme==='Light'?['600','700','800']:['200','100','300']){
 const foreground=foundation.colors.neutral[theme==='Light'?'50':'950'];const background=foundation.colors[family][step];const ratio=contrast(foreground,background);assert.ok(ratio>=4.5,`${theme} ${family}/${step}: ${ratio}`);pairs.push({theme,foreground,background,ratio:Number(ratio.toFixed(3))});
}
for(const theme of ['Light','Dark'])for(const step of theme==='Light'?['50','100']:['950','900']){
 const foreground=foundation.colors.neutral[theme==='Light'?'600':'300'];const background=foundation.colors.neutral[step];const ratio=contrast(foreground,background);assert.ok(ratio>=4.5,`Muted ${theme} on ${step}: ${ratio}`);pairs.push({theme,foreground,background,ratio:Number(ratio.toFixed(3))});
}
mkdirSync('review',{recursive:true});
writeFileSync('review/actions-static-qa.json',JSON.stringify({status:'PASS',routes:slugs,compiledExamples:snippets,contrastPairs:pairs,limitations:'Static checks do not replace the recorded browser interaction and screen-reader review.'},null,2)+'\n');
console.log(`PASS: four complete documentation routes; ${snippets} copyable configurations compiled; ${pairs.length} state/foreground contrast pairs passed; semantic names, busy states and link destinations checked.`);
