import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {batchCatalog} from '../src/components/forms/catalog.ts';
import {libraryCatalog} from '../src/components/library/catalog.ts';
const paths=[...['button','icon-button','button-group','text-link'].map(s=>`components/actions/${s}/`),...batchCatalog.map(e=>`components/${e.group}/${e.slug}/`),...libraryCatalog.map(e=>`components/${e.group}/${e.slug}/`)];
assert.equal(paths.length,49);assert.equal(new Set(paths).size,49);
let sidebarChecks=0;
for(const path of paths){
 const html=readFileSync(`dist/${path}index.html`,'utf8');
 const navs=[...html.matchAll(/<nav aria-label="Documentation"[\s\S]*?<\/nav>/g)].map(m=>m[0]);assert.equal(navs.length,2,path+': desktop/mobile sidebar');
 for(const nav of navs){for(const destination of paths){const count=nav.split(`href="/${destination}"`).length-1;assert.equal(count,1,path+': missing/duplicate sidebar '+destination);sidebarChecks++;}}
 for(const section of ['preview','usage','accessibility','implementation','foundations'])assert.ok(html.includes(`id="${section}"`),path+': missing shared documentation section');
 assert.ok(html.includes('component-docs')&&html.includes('component-preview-notice')&&html.includes('component-stage')&&html.includes('component-code'),path+': missing shared docs structure');
}
for(const [slug,url,label] of [['card','colour','colour'],['empty-state','typography','typography']]){const group=slug==='card'?'data-display':'feedback';const html=readFileSync(`dist/components/${group}/${slug}/index.html`,'utf8');assert.ok(html.includes(`href=&quot;/foundations/${url}/&quot;`)||html.includes(`href="/foundations/${url}/"`));assert.ok(html.includes('import TextLink'));assert.ok(html.includes('Explore '+label));}
const result={families:49,sidebarLinkChecks:sidebarChecks,desktopAndMobileSidebars:true,sharedStructure:true};mkdirSync('review',{recursive:true});writeFileSync('review/components-static-qa.json',JSON.stringify(result,null,2));console.log(`PASS: 49 documentation pages; ${sidebarChecks} sidebar link assertions; shared structure and corrected examples.`);
