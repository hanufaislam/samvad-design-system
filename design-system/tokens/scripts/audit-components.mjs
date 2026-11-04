import {readFileSync,writeFileSync,existsSync} from 'node:fs';import {resolve,dirname} from 'node:path';import {fileURLToPath} from 'node:url';
const home=resolve(dirname(fileURLToPath(import.meta.url)),'..'),root=resolve(home,'../..');
const inventory=JSON.parse(readFileSync(home+'/verification/pre-token-inventory.json'));const bindings=JSON.parse(readFileSync(home+'/verification/component-bindings.json'));
function inspect(path,seen=new Set()){
 if(seen.has(path)||!existsSync(path))return {files:[],classes:[]};seen.add(path);const source=readFileSync(path,'utf8');let files=[path.replace(root+'/','')],classes=[...source.matchAll(/\b(sv-[\w-]+)/g)].map(m=>m[1]);
 for(const m of source.matchAll(/import .*?from ['"]([^'"]+\.astro)['"]/g)){const child=inspect(resolve(dirname(path),m[1]),seen);files.push(...child.files);classes.push(...child.classes);}
 return {files:[...new Set(files)],classes:[...new Set(classes)]};
}
const actionNames={'button':'Button','icon-button':'IconButton','button-group':'ButtonGroup','text-link':'TextLink'};
const rows=inventory.families.map(f=>{
 const folder=f.group==='actions'?'actions':['inputs','selection'].includes(f.group)?'forms':f.group==='layout'?'layout':'library';const source=`website/src/components/${folder}/${f.component||actionNames[f.slug]}.astro`;const tree=inspect(root+'/'+source);const relevant=bindings.filter(b=>tree.classes.some(cls=>b.selector.includes('.'+cls)));
 const tokens=[...new Set(relevant.map(b=>b.componentToken))].sort();
 return {...f,implementation:source,dependencyFiles:tree.files,styleSource:`website/src/components/${folder}/${folder==='actions'?'actions':folder==='forms'?'forms':folder==='layout'?'layout':'library'}.css`,status:'connected-supported-properties; unresolved literals retained',bindingCount:relevant.length,tokenNamespaces:[...new Set(tokens.map(k=>k.split('/')[0]))],componentTokens:tokens,directSemanticFamilies:f.group==='layout'?['space/scale/*',...(f.slug==='container'?['layout/container/*','layout/reading']:[])]:[]};
});
writeFileSync(home+'/verification/component-coverage.json',JSON.stringify(rows,null,2)+'\n');console.log(`Audited actual Astro dependency classes for ${rows.length} component families.`);
