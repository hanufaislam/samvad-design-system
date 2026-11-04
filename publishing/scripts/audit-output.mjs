import assert from 'node:assert/strict';
import {readFileSync,readdirSync,statSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,relative,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const directory=resolve(root,process.env.SAMVAD_AUDIT_DIR||'website/dist');
const base=(process.env.SAMVAD_BASE_PATH||'/').replace(/\/?$/,'/');
const walk=p=>readdirSync(p).flatMap(n=>statSync(join(p,n)).isDirectory()?walk(join(p,n)):[join(p,n)]);
const files=walk(directory),html=files.filter(p=>p.endsWith('.html'));assert.equal(html.length,84);
const idMap=new Map(html.map(p=>[p,new Set([...readFileSync(p,'utf8').matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]))]));
const found=[];let links=0,assets=0,examples=0;
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
function local(url,source,anchor=true){url=decode(url);if(/^(?:https?:|mailto:|tel:|data:|blob:|javascript:|\/\/)/.test(url))return;let target,hash;
 if(url.startsWith('#')){target=source;hash=url.slice(1);}else {const full=new URL(url,'https://audit.invalid'+base+relative(directory,source).replaceAll('\\','/'));assert(full.pathname.startsWith(base),'Link escapes deployment base: '+relative(directory,source)+' '+url);const rel=decodeURIComponent(full.pathname.slice(base.length));target=join(directory,rel);if(existsSync(target)&&statSync(target).isDirectory())target=join(target,'index.html');hash=full.hash.slice(1);}
 assert(existsSync(target),'Missing local target '+relative(directory,source)+' '+url);if(hash&&anchor&&target.endsWith('.html'))assert(idMap.get(target)?.has(decodeURIComponent(hash)),'Missing destination anchor '+url);links++;}
for(const p of html){const text=readFileSync(p,'utf8');assert.equal((text.match(/<h1(?:\s|>)/g)||[]).length,1);for(const m of text.matchAll(/\b(?:href|src)="([^"]+)"/g))local(m[1],p);examples+=(text.match(/data-copy-label="code example"/g)||[]).length;assert(text.includes('aria-current="page"'));assert(text.includes('data-pagefind-body'));const ids=[...text.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,'Duplicate IDs '+relative(directory,p));for(const m of text.matchAll(/\s(?:for|aria-describedby|aria-controls|aria-labelledby)="([^"]+)"/g))for(const id of m[1].split(' '))assert(idMap.get(p).has(id),'Broken ARIA/label reference '+relative(directory,p)+' '+id);}
for(const p of files.filter(p=>p.endsWith('.css')))for(const m of readFileSync(p,'utf8').matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)){local(m[1],p,false);assets++;}
const privatePattern=/\/Users\/[\w.-]+\/|(?:^|[\s"'=])\/home\/[\w.-]+\/|file:\/\/\/|(?:session[_-]?id|workspace[_-]?id)\s*["']?\s*:\s*["'][\w-]{8,}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|sk-(?:proj-)?[A-Za-z0-9_-]{24,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i;
for(const p of files.filter(p=>/\.(?:html|css|js|json|ts|txt)$/.test(p)))assert(!privatePattern.test(readFileSync(p,'utf8')),'Operational/private signature in production output '+relative(directory,p));
assert(existsSync(join(directory,'pagefind/pagefind.js')));assert(existsSync(join(directory,'licenses/geist-OFL.txt')));assert(existsSync(join(directory,'icons/LICENSE')));
const result={base,routes:html.length,localReferences:links,cssAssetReferences:assets,codeCopyControls:examples,privateSignatures:0,passed:true};const output=resolve(root,'publishing/audit');mkdirSync(output,{recursive:true});writeFileSync(join(output,base==='/'?'root-output.json':'project-output.json'),JSON.stringify(result,null,2)+'\n');console.log('PASS: '+JSON.stringify(result));
