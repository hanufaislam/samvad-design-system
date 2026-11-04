import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
import {libraryCatalog} from '../src/components/library/catalog.ts';

const dist = resolve('dist');
const expected = ['index.html','get-started/principles/index.html','foundations/colour/index.html','foundations/typography/index.html','design-tokens/index.html','components/actions/button/index.html','components/actions/icon-button/index.html','components/actions/button-group/index.html','components/actions/text-link/index.html'];
for(const [group,slugs] of Object.entries({inputs:['text-input','textarea','search-input','password-input','number-input','otp-input','select','multi-select','date-picker','file-upload','form-field'],selection:['checkbox','radio-group','switch','chips','segmented-control']})) for(const slug of slugs) expected.push(`components/${group}/${slug}/index.html`);
for(const entry of libraryCatalog)expected.push(`components/${entry.group}/${entry.slug}/index.html`);
for(const slug of ['primitives','semantic','colour','typography','spacing','radius','elevation','responsive','css-variables'])expected.push(`design-tokens/${slug}/index.html`);
for(const relative of ['patterns/','patterns/forms/','patterns/navigation/','patterns/loading/','patterns/empty-states/','patterns/error-and-success-states/','resources/usage-guidelines/','resources/developer-handoff/','resources/changelog/'])expected.push(relative+'index.html');
for(const relative of ['get-started/for-designers/','get-started/for-developers/','foundations/spacing-and-layout/','foundations/grid/','foundations/shape-and-radius/','foundations/borders-and-focus/','foundations/elevation-and-shadows/','foundations/iconography/','foundations/illustration/','foundations/accessibility/','foundations/interaction-principles/','foundations/motion/'])expected.push(relative+'index.html');
const walk = dir => readdirSync(dir).flatMap(name => statSync(join(dir,name)).isDirectory() ? walk(join(dir,name)) : [join(dir,name)]);
const htmlFiles = walk(dist).filter(p => p.endsWith('.html'));
assert.equal(htmlFiles.length, expected.length, 'Only approved documentation routes may be built');
for (const relative of expected) {
  const path = join(dist, relative);
  assert.ok(existsSync(path), `Missing direct-route output: ${relative}`);
  const html = readFileSync(path,'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length, 1, relative+' must have one h1');
  assert.ok(html.includes('data-pagefind-body'),relative+' must be searchable');
  assert.ok(html.includes('aria-current="page"'),relative+' must identify its active route');
  assert.ok(html.includes('id="search-dialog"'),relative+' must include search');
  assert.ok(html.includes('id="mobile-navigation"'),relative+' must include mobile navigation');
  assert.ok(!/\/Users\/|\.codex\/|sessionId|user_id|API_KEY|ghp_[a-zA-Z0-9]+/.test(html),'Private operational data found in '+relative);
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url=match[1];
    if (/^(https?:|data:|mailto:)/.test(url)) continue;
    if (url.startsWith('#')) { assert.ok(html.includes(`id="${url.slice(1)}"`),`Missing anchor ${url} in ${relative}`); continue; }
    const target=join(dist,url.replace(/^\//,'').split(/[?#]/)[0]);
    assert.ok(existsSync(target),`Broken static link ${url} in ${relative}`);
  }
}
assert.ok(existsSync(join(dist,'pagefind/pagefind.js')),'Search index missing');
const planned=readFileSync(join(dist,'design-tokens/index.html'),'utf8');
assert.ok(planned.includes('Implemented locally'));
assert.ok(planned.includes('implementation-candidate'));assert.ok(planned.includes('tokens/tokens.css'));
const colour=readFileSync(join(dist,'foundations/colour/index.html'),'utf8');
const foundation=JSON.parse(readFileSync('../design-system/foundations/foundation-spec.json','utf8'));
for (const family of ['neutral','mulberry']) for (const hex of Object.values(foundation.colors[family])) assert.ok(colour.includes(`data-copy="${hex}"`),'Palette drift: '+hex);
for(const p of walk(dist).filter(p=>/\.(css|js|html)$/.test(p))) assert.ok(!/\/Users\/|(?:^|[\s"'=])\/home\/[\w.-]+\/|file:\/\/\/|\.codex\/|sessionId\s*["']?\s*:/i.test(readFileSync(p,'utf8')),'Operational data exposed in '+p);
console.log('PASS: 84 direct routes, internal links, anchors, search index, shell landmarks, planned status, 22 core swatch values and operational-data exclusion.');
