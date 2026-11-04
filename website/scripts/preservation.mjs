import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
/** Historical hashes stay immutable. Only exact documented audit repairs are accepted. */
export function assertPreserved(path,actual,expected){
 if(actual===expected)return;
 const fixes=JSON.parse(readFileSync(resolve(root,'publishing/audit/fixes.json'),'utf8'));
 const repair=fixes.find(f=>f.path===path&&f.before===expected&&f.after===actual&&f.reason);
 assert(repair,'Unreviewed source drift: '+path);
}
