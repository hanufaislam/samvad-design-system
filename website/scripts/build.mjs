import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const website=resolve(dirname(fileURLToPath(import.meta.url)),'..');
function bin(name){const dir=resolve(website,'node_modules',name),p=JSON.parse(readFileSync(resolve(dir,'package.json'),'utf8'));return resolve(dir,typeof p.bin==='string'?p.bin:p.bin[name]);}
function run(name,args){const result=spawnSync(process.execPath,[bin(name),...args],{cwd:website,env:process.env,stdio:'inherit'});if(result.error)throw result.error;if(result.status!==0)process.exit(result.status||1);}
run('astro',['build']);
run('pagefind',['--site',resolve(website,process.env.SAMVAD_OUTPUT_DIR||'dist')]);
