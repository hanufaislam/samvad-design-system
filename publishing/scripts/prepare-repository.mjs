import {mkdirSync,readdirSync,lstatSync,copyFileSync,readFileSync,writeFileSync,existsSync} from 'node:fs';
import {resolve,relative,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const name=process.argv[2]||'public-repo';if(!/^[a-z0-9-]+$/.test(name))throw new Error('Use a simple local candidate name.');
const output=resolve(root,'.release-check',name);
if(existsSync(output))throw new Error('Candidate already exists. Choose a fresh audit directory or archive it locally; no existing candidate is overwritten.');
const rootFiles=new Set(['README.md','AGENTS.md','CONTRIBUTING.md','DESIGN_SYSTEM.md','CHANGELOG.md','QA_REPORT.md','FINAL_AUDIT.md','LICENSING.md','THIRD_PARTY_NOTICES.md','.gitignore','.nvmrc']);
function include(path){const parts=path.split('/'),name=parts.at(-1);if(parts.some(p=>['node_modules','.git','.astro','__pycache__','.release-check'].includes(p)))return false;if(name==='.DS_Store'||name.endsWith('.log')||name.startsWith('.env'))return false;
 if(parts.length===1)return rootFiles.has(path);
 if(path.startsWith('website/'))return /^(?:website\/(?:src|public|scripts)\/|website\/(?:package(?:-lock)?\.json|astro\.config\.mjs|tsconfig\.json|README\.md|\.gitignore)$)/.test(path);
 if(path.startsWith('design-system/'))return !/\/verification\/(?:figma-state\.json|local-qa\.json)$/.test(path);
 if(path.startsWith('publishing/'))return path==='publishing/README.md'||path==='publishing/github-pages.yml.example'||path==='publishing/audit/fixes.json'||path.startsWith('publishing/scripts/');return false;}
const manifest=[];function walk(dir){for(const name of readdirSync(dir)){const file=join(dir,name),rel=relative(root,file).replaceAll('\\','/');const info=lstatSync(file);if(info.isSymbolicLink())continue;if(info.isDirectory()){if(['node_modules','.git','.astro','.release-check','review','__pycache__'].includes(name)||rel.startsWith('publishing/local-audit'))continue;walk(file);}else if(include(rel)){const destination=join(output,rel);mkdirSync(dirname(destination),{recursive:true});copyFileSync(file,destination);manifest.push({path:rel,bytes:info.size,sha256:createHash('sha256').update(readFileSync(file)).digest('hex')});}}}
walk(root);mkdirSync(resolve(root,'publishing/local-audit'),{recursive:true});writeFileSync(resolve(root,'publishing/local-audit/candidate-manifest.json'),JSON.stringify({files:manifest.length,manifest,excluded:'No Git metadata, dependencies, built website, review images, environment files, raw native Figma session/local QA ledger or local publishing audit files.'},null,2)+'\n');
console.log('Prepared clean local repository candidate with '+manifest.length+' files. No Git initialization or remote action.');
