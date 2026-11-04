// DATA is embedded by the caller from foundation-spec.json.
const pages = {};
const names=['Foundations','Foundations / Colour','Foundations / Typography'];
const createdNodeIds=[],mutatedNodeIds=[];
for(const name of names){
 let p=figma.root.children.find(p=>p.name===name);
 if(!p){
  const blank=name==='Foundations'?figma.root.children.find(p=>p.name==='Page 1'&&p.children.length===0):null;
  p=blank||figma.createPage();p.name=name;
  (blank?mutatedNodeIds:createdNodeIds).push(p.id);
 }
 pages[name]=p.id;
}
const rgb=h=>({r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255});
await Promise.all([{family:'Geist',style:'Regular'},{family:'Geist',style:'SemiBold'},{family:'Geist Mono',style:'Regular'},{family:'Noto Sans Devanagari',style:'Regular'},{family:'Noto Sans Telugu',style:'Regular'}].map(f=>figma.loadFontAsync(f)));
const paintStyles={},textStyles={},effectStyles={},gridStyles={},createdStyleIds=[];
const oldPaint=await figma.getLocalPaintStylesAsync();
for(const [family,ramp] of Object.entries(DATA.colors))for(const [step,hex] of Object.entries(ramp)){
 const name='Samvad/Color/'+family+'/'+step;
 let s=oldPaint.find(x=>x.name===name);if(!s){s=figma.createPaintStyle();s.name=name;createdStyleIds.push(s.id);}
 s.paints=[{type:'SOLID',color:rgb(hex)}];s.description='Phase 2 foundation value. Phase 3 variable binding pending.';
 paintStyles[family+'/'+step]=s.id;
}
const oldText=await figma.getLocalTextStylesAsync();
for(const t of [...DATA.typography,{name:'mono/s',size:12,lineHeight:18,weight:400,trackingEm:0},{name:'mono/m',size:14,lineHeight:20,weight:400,trackingEm:0},{name:'script/devanagari',size:16,lineHeight:28,weight:400,trackingEm:0},{name:'script/telugu',size:16,lineHeight:28,weight:400,trackingEm:0}]){
 const name='Samvad/Type/'+t.name;let s=oldText.find(x=>x.name===name);
 if(!s){s=figma.createTextStyle();s.name=name;createdStyleIds.push(s.id);}
 s.fontName={family:t.name.startsWith('mono')?'Geist Mono':t.name==='script/devanagari'?'Noto Sans Devanagari':t.name==='script/telugu'?'Noto Sans Telugu':'Geist',style:t.weight===600?'SemiBold':'Regular'};
 s.fontSize=t.size;s.lineHeight={unit:'PIXELS',value:t.lineHeight};s.letterSpacing={unit:'PERCENT',value:t.trackingEm*100};
 s.description='Phase 2 reusable text style. Logical size; preserve user font scaling. Variable binding deferred.';textStyles[t.name]=s.id;
}
const oldEffects=await figma.getLocalEffectStylesAsync();
for(const theme of ['Light','Dark'])for(const sh of DATA.shadows){
 const name='Samvad/Elevation/'+theme+'/'+sh.level;let s=oldEffects.find(x=>x.name===name);
 if(!s){s=figma.createEffectStyle();s.name=name;createdStyleIds.push(s.id);}
 s.effects=sh.level===0?[]:[{type:'DROP_SHADOW',color:{...rgb(DATA.colors.neutral['950']),a:theme==='Light'?sh.lightOpacity:sh.darkOpacity},offset:{x:sh.x,y:sh.y},radius:sh.blur,spread:sh.spread,visible:true,blendMode:'NORMAL'}];
 effectStyles[theme+'/'+sh.level]=s.id;
}
const oldGrids=await figma.getLocalGridStylesAsync();
for(const g of DATA.layout){const name='Samvad/Grid/'+g.name;let s=oldGrids.find(x=>x.name===name);if(!s){s=figma.createGridStyle();s.name=name;createdStyleIds.push(s.id);}
 s.layoutGrids=[{pattern:'COLUMNS',alignment:'STRETCH',count:g.columns,gutterSize:g.gutter,offset:g.margin,color:{...rgb(DATA.colors.mulberry['600']),a:.12},visible:true}];gridStyles[g.name]=s.id;}
return {createdNodeIds,mutatedNodeIds,createdStyleIds,pages,paintStyles,textStyles,effectStyles,gridStyles,counts:{paint:88,text:14,effect:10,grid:3},variablesCreated:0,componentsCreated:0};
