const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const storage=new Map();
const context={window:{},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},Date,console};
vm.createContext(context);
for(const file of ['content.js','legacy-content.js','store.js','practice-logic.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context);
const D=context.window.SAMVAD_DATA,store=context.window.SamvadStore,logic=context.window.SamvadPracticeLogic;
const plain=o=>JSON.parse(JSON.stringify(o));
test('authored inventory is connected with original availability',()=>{
 assert.equal(D.modules.length,7);assert.equal(D.modules.filter(m=>!m.comingSoon).length,3);assert.equal(D.modules.filter(m=>m.comingSoon).length,4);assert.equal(Object.keys(D.lessons).length,10);assert.equal(Object.keys(D.deep).length,3);assert.equal(Object.values(D.deep).flatMap(d=>d.sections).length,9);assert.equal(Object.values(D.scenarios).flat().length,6);
 for(const m of D.modules.filter(m=>!m.comingSoon)){assert.ok(D.deep[m.deep]);assert.equal(D.scenarios[m.id].length,2);for(const id of m.lessons){const l=D.lessons[id];assert.ok(l);assert.ok(l.answers[l.correct]);assert.ok(l.dialogue.length&&l.principles.length);}}
});
test('partial localisation is preserved without inventing translations',()=>{assert.deepEqual(Object.keys(D.localizedFirst),['hi','te']);for(const locale of Object.values(D.localizedFirst)){assert.equal(locale.dialogue.length,D.lessons['comfort-1'].dialogue.length);assert.equal(locale.answers.length,3)}assert.equal(D.lessons['boundaries-1'].title,'Recognize your limit');});
test('earlier preview preferences, sample completions and draft migrate without counting as authored lessons',()=>{
 const old={preferences:{language:'Telugu',subtitles:'Subtitles off',goals:['Listen better'],confidence:'Getting comfortable'},completed:['first-move','clear-message'],draft:'What got you interested?'};
 const u=store.normalize(old);assert.equal(u.language,'te');assert.equal(u.captions,false);assert.deepEqual(plain(u.goals),['Listen better']);assert.deepEqual(plain(u.completed),[]);assert.deepEqual(plain(u.legacyCompleted),old.completed);assert.equal(u.draft,old.draft);assert.equal(context.window.SAMVAD_LEGACY.length,3);
});
test('authored completion, voice setting and continuation survive storage reload',()=>{
 const u=store.normalize({schema:2,language:'hi',voice:false,completed:['comfort-1','comfort-1','bad'],deepCompleted:['comfort-deep'],activity:['2026-11-06'],currentLesson:{lessonId:'comfort-2',segment:'examples',line:1}});assert.equal(store.save(u),true);const reloaded=store.load();assert.deepEqual(plain(reloaded.completed),['comfort-1']);assert.equal(reloaded.voice,false);assert.equal(reloaded.currentLesson.segment,'examples');assert.deepEqual(plain(reloaded.deepCompleted),['comfort-deep']);
});
test('malformed local data falls back safely',()=>{storage.set(store.KEY,'not json');assert.equal(store.load().language,'en');assert.deepEqual(plain(store.normalize({goals:'bad',completed:'bad',sessions:[null],preferences:null}).sessions),[]);});
test('a partial practice is not marked complete',()=>{const a={moduleId:'comfort',scenario:D.scenarios.comfort[0],messages:[{role:'user',text:'Hello'}]};assert.equal(logic.evaluateLocal(a).status,'insufficient');});
test('local review cites the actual submitted words',()=>{for(const [id,answers] of Object.entries({comfort:["Don't worry, just apply for another job.",'You need to move on.'],boundaries:['Maybe, I guess I can.','Perhaps I can somehow do it.'],conversation:['Hi','Okay']})){const a={moduleId:id,scenario:D.scenarios[id][0],messages:answers.map(text=>({role:'user',text}))};const r=logic.evaluateLocal(a);assert.equal(r.status,'completed');assert.ok(r.issues.length);for(const issue of r.issues)assert.ok(answers.some(answer=>answer.includes(issue.evidence)));assert.ok(r.notAssessed.includes('Spoken fluency and accent'));}});
test('demo reply preserves authored fallbacks for all six scenarios',()=>{for(const [moduleId,scenarios] of Object.entries(D.scenarios)){for(const scenario of scenarios){const a={moduleId,scenario,messages:[{role:'user',text:'Tell me more.'},{role:'user',text:'What happened next?'}]};assert.equal(logic.demoReply('What happened next?',a),scenario.followups[1]);}}});
test('no legacy visual theme or external stylesheet is imported',()=>{const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),engine=fs.readFileSync(path.join(root,'home.js'),'utf8');assert.ok(!/fonts.googleapis|Nunito|DM.Sans|iframe/i.test(html));assert.ok(!/data:image|Nunito|#2478ed|#16254c/.test(engine));});
test('every shipped script compiles',()=>{for(const file of ['app.js','content.js','legacy-content.js','store.js','practice-logic.js','home.js'])assert.doesNotThrow(()=>new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file}));});
