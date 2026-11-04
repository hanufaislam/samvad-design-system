// Adapted from the bundled createDocumentationPage helper: named page,
// auto-layout root/header/sections. Uses approved Samvad styles and fixed
// wrapping text widths; page creation is separate to respect Starter limits.
const createdNodeIds=[],pending=[];
const rgb=h=>({r:parseInt(h.slice(1,3),16)/255,g:parseInt(h.slice(3,5),16)/255,b:parseInt(h.slice(5,7),16)/255});
const getColor=ref=>{const [f,n]=ref.split('/');return rgb(DATA.colors[f][n]);};
const track=n=>{createdNodeIds.push(n.id);return n;};
function paint(n,ref,stroke=false){
 const p=[{type:'SOLID',color:getColor(ref)}];
 if(stroke){n.strokes=p;pending.push(n.setStrokeStyleIdAsync(STATE.paintStyles[ref]));}
 else{n.fills=p;pending.push(n.setFillStyleIdAsync(STATE.paintStyles[ref]));}
}
function box(parent,name,w,dir='VERTICAL',gap=16,bg=null,pad=0){
 const n=track(figma.createAutoLayout(dir));n.name=name;n.resize(w,80);
 n.layoutSizingHorizontal='FIXED';n.layoutSizingVertical='HUG';n.itemSpacing=gap;
 n.paddingTop=n.paddingBottom=n.paddingLeft=n.paddingRight=pad;n.fills=[];n.clipsContent=false;
 if(parent)parent.appendChild(n);if(bg)paint(n,bg);return n;
}
function rect(parent,name,w,h,ref,radius=0){
 const n=track(figma.createRectangle());n.name=name;n.resize(w,h);n.cornerRadius=radius;parent.appendChild(n);paint(n,ref);return n;
}
function text(parent,chars,role='body/m',w=1312,ref='neutral/950'){
 const n=track(figma.createText());n.name='Text/'+chars.split('\n')[0].slice(0,60);
 const t=DATA.typography.find(t=>t.name===role)||{size:role==='mono/s'?12:16,lineHeight:role.startsWith('script')?28:20,weight:400,trackingEm:0};
 n.fontName={family:role.startsWith('mono')?'Geist Mono':role==='script/devanagari'?'Noto Sans Devanagari':role==='script/telugu'?'Noto Sans Telugu':'Geist',style:t.weight===600?'SemiBold':'Regular'};
 n.fontSize=t.size;n.lineHeight={unit:'PIXELS',value:t.lineHeight};n.letterSpacing={unit:'PERCENT',value:t.trackingEm*100};
 n.textAutoResize='HEIGHT';n.resize(w,t.lineHeight);n.characters=chars;parent.appendChild(n);n.layoutSizingHorizontal='FIXED';
 paint(n,ref);pending.push(n.setTextStyleIdAsync(STATE.textStyles[role]));return n;
}
function line(parent,w=1312){return rect(parent,'Divider',w,1,'neutral/200');}
function section(parent,title,desc=null){const n=box(parent,'Section/'+title,1312,'VERTICAL',16);text(n,title,'heading/3');if(desc)text(n,desc,'body/m',1312,'neutral/600');return n;}
function svg(parent,source,name,size){const n=track(figma.createNodeFromSvg(source.replace('fill="currentColor"','fill="'+DATA.colors.neutral['950']+'"')));n.name=name;n.resize(size,size);parent.appendChild(n);for(const c of n.findAll())createdNodeIds.push(c.id);return n;}
await Promise.all([{family:'Geist',style:'Regular'},{family:'Geist',style:'SemiBold'},{family:'Geist Mono',style:'Regular'},{family:'Noto Sans Devanagari',style:'Regular'},{family:'Noto Sans Telugu',style:'Regular'}].map(f=>figma.loadFontAsync(f)));
const page=await figma.getNodeByIdAsync(PAGE_ID);await figma.setCurrentPageAsync(page);
const existing=page.children.find(n=>n.name==='Foundation/'+KIND);
if(existing)return {skipped:true,rootId:existing.id,name:existing.name};
const board=box(page,'Foundation/'+KIND,1440,'VERTICAL',48,'neutral/50',64);
board.x=POSITION.x;board.y=POSITION.y;
text(board,'SAMVAD  /  FOUNDATIONS  /  '+KIND.toUpperCase(),'mono/s',1312,'mulberry/600');
text(board,TITLE,'display');
text(board,SUBTITLE,'body/l',1200,'neutral/600');
line(board);

if(KIND==='overview'){
 const s=section(board,'A little character. A lot of clarity.');
 text(s,'Quiet structure. Lively details.','heading/1');
 text(s,'Warm neutrals and purposeful mulberry. Friendly, readable typography.\nGenerous space, deliberate geometry and a little unexpected warmth.','body/l',1150);
 const row=box(s,'Palette/Identity',1312,'HORIZONTAL',16);
 for(const [name,ref] of [['Canvas','neutral/50'],['Ink','neutral/950'],['Primary','mulberry/600'],['Warmth','apricot/300'],['Accent','lime/200']]){
  const c=box(row,'Identity/'+name,240);const sw=rect(c,name,240,96,ref,8);if(name==='Canvas'){paint(sw,'neutral/200',true);sw.strokeWeight=1;}text(c,name,'label',240);text(c,ref,'mono/s',240,'neutral/600');
 }
 const cols=box(board,'Overview/Columns',1312,'HORIZONTAL',48);
 const left=box(cols,'Overview/Principles',632,'VERTICAL',12);
 text(left,'01  Clarity leads\n02  Character in small doses\n03  Space creates structure\n04  Colour has a job\n05  Consistency earns trust\n06  Access is foundational','body/l',632);
 const right=box(cols,'Overview/Navigation',632,'VERTICAL',12);
 text(right,'Explore the foundation boards','heading/4',632);
 text(right,'Colour and Typography have dedicated pages.\nThis page: Spacing · Layout · Radius · Elevation\nBorders · Iconography · Illustration · Motion','body/m',632);
 text(right,'88 colours · 14 text styles · 10 effect styles\n3 grid styles · 22 verified contrast pairs','mono/m',632,'mulberry/600');
 }
if(KIND==='colour'){
 for(const [family,ramp] of Object.entries(DATA.colors)){
  const s=section(board,family.charAt(0).toUpperCase()+family.slice(1));
  const row=box(s,'Ramp/'+family,1312,'HORIZONTAL',8);
  for(const step of DATA.steps){const c=box(row,'Swatch/'+family+'/'+step,112,'VERTICAL',8);const r=rect(c,'Color/'+family+'/'+step,112,64,family+'/'+step,4);if(step===50){paint(r,'neutral/200',true);r.strokeWeight=1;}text(c,String(step),'label',112);text(c,ramp[step].toUpperCase(),'mono/s',112,'neutral/600');}
 }
 const row=box(board,'Theme/Pairs',1312,'HORIZONTAL',32);
 for(const theme of ['Light','Dark']){const dark=theme==='Dark';const bg=dark?'neutral/950':'neutral/100',fg=dark?'neutral/50':'neutral/950';const p=box(row,'Theme/'+theme,640,'VERTICAL',16,bg,32);p.cornerRadius=12;
 text(p,theme+' / selected contrast pairs','heading/3',576,fg);
 for(const x of DATA.contrast.filter(x=>x.theme===theme&&['Primary text','Action label','Focus ring'].includes(x.role))){text(p,x.role+'  '+x.ratio.toFixed(2)+':1','body/m',576,fg);}
 text(p,'Palette specimens; variable modes begin in Phase 3.','caption',576,dark?'neutral/300':'neutral/600');}
 }
if(KIND==='typography'){
 const s=section(board,'Geist + Geist Mono','Available fallback selected after native font inspection. General Sans and Satoshi are unavailable through MCP.');
 for(const t of DATA.typography){const row=box(s,'Specimen/'+t.name,1312,'HORIZONTAL',32);const meta=box(row,'Meta/'+t.name,288,'VERTICAL',4);text(meta,t.name,'mono/m',288,'mulberry/600');text(meta,t.size+' / '+t.lineHeight+' · '+t.weight+' · '+t.trackingEm+'em','mono/s',288,'neutral/600');text(row,t.name==='display'?'Friendly by nature.':t.name.startsWith('heading')?'Room for a little character.':'Make the next step feel simple. Give useful things space.',t.name,992);line(s);}
 const mono=section(board,'Technical type');text(mono,'space/24   radius/md   color/action/primary','mono/m');
 const script=section(board,'Native-script companions','Script samples demonstrate rendering and line boxes, not a launch-language decision or linguistic validation.');
 text(script,'संवाद — सीखें, अभ्यास करें, आगे बढ़ें।','script/devanagari');text(script,'సంవాద్ — నేర్చుకోండి, సాధన చేయండి.','script/telugu');
 text(script,'16 / 28 · Regular · zero tracking · allow natural wrapping','mono/s',1312,'neutral/600');
 }
if(KIND==='spacing'){
 const s=section(board,'A steady 4-unit rhythm','2 units handle optical adjustments. These bars show actual logical widths, not proportional illustrations.');
 for(const v of DATA.spacing){const row=box(s,'Space/'+v,1312,'HORIZONTAL',24);row.counterAxisAlignItems='CENTER';text(row,'space/'+v,'mono/m',160);if(v>0)rect(row,'Measure/'+v,v,16,'mulberry/600',2);text(row,v===0?'0 — intentional absence of space':v+' logical units','body/s',600,'neutral/600');}
 const row=box(board,'Spacing/Applications',1312,'HORIZONTAL',32);
 for(const [title,desc] of [['2–8','Tightly related details'],['12–24','Controls and related content'],['32–48','Between sections'],['64–96','Large compositions']]){const c=box(row,title,304,'VERTICAL',12);text(c,title,'heading/2',304);text(c,desc,'body/m',304);}
 }
if(KIND==='layout'){
 for(const g of DATA.layout){const s=section(board,g.name+' / '+g.columns+' columns',g.gutter+' gutter · '+g.margin+' minimum margin · '+(g.max===null?'≥'+g.min:g.min+'–'+g.max)+' logical units');
 const frame=box(s,'Grid/'+g.name,g.specimenWidth,'HORIZONTAL',g.gutter,'neutral/100',0);frame.paddingLeft=frame.paddingRight=g.margin;frame.paddingTop=frame.paddingBottom=16;
 const cw=(g.specimenWidth-2*g.margin-(g.columns-1)*g.gutter)/g.columns;
 for(let i=0;i<g.columns;i++)rect(frame,'Column/'+(i+1),cw,112,'mulberry/100',2);
 pending.push(frame.setGridStyleIdAsync(STATE.gridStyles[g.name]));text(s,'Specimen width '+g.specimenWidth+' · native column grid attached','mono/s',1312,'neutral/600');}
 const s=section(board,'Containers and reading measure');text(s,'Maxima 640 / 960 / 1200. Reading measure approximately 60–70 characters.\nUse available width, safe areas and content-driven heights. Text scales; layout reflows.','body/l',1312);
 }
if(KIND==='radius'){
 const row=box(board,'Radius/Scale',1312,'HORIZONTAL',24);
 for(const [name,value] of Object.entries(DATA.radius)){const c=box(row,'Radius/'+name,160,'VERTICAL',16);rect(c,'Shape/'+name,144,96,'mulberry/100',Math.min(value,48));text(c,name,'label',160);text(c,value===9999?'capsule / clamped':String(value),'mono/m',160,'neutral/600');}
 const s=section(board,'Gentle geometry, used deliberately');text(s,'md / routine controls     lg–xl / larger surfaces     full / capsules and circles','body/l');
 text(s,'Full is 9999 in Figma/web, clamped by geometry. Use native capsule shapes on mobile.\nDo not turn every container into a pill.','body/m',1312,'neutral/600');
 }
if(KIND==='elevation'){
 for(const theme of ['Light','Dark']){const dark=theme==='Dark',fg=dark?'neutral/50':'neutral/950';const s=box(board,'Elevation/'+theme,1312,'VERTICAL',32,dark?'neutral/950':'neutral/100',32);s.cornerRadius=12;text(s,theme+' / depth that stays quiet','heading/3',1248,fg);
 const row=box(s,theme+'/Levels',1248,'HORIZONTAL',24);
 for(const sh of DATA.shadows){const c=box(row,'Elevation/'+theme+'/'+sh.level,224,'VERTICAL',12,dark?'neutral/900':'neutral/50',24);c.cornerRadius=12;paint(c,dark?'neutral/700':'neutral/200',true);c.strokeWeight=1;pending.push(c.setEffectStyleIdAsync(STATE.effectStyles[theme+'/'+sh.level]));text(c,'Level '+sh.level,'heading/4',176,fg);text(c,['Flat','Raised','Popover','Overlay','Dialog'][sh.level],'body/m',176,fg);text(c,'y '+sh.y+' · blur '+sh.blur+'\nspread '+sh.spread,'mono/s',176,dark?'neutral/300':'neutral/600');}
 }
 text(board,'Dark depth also relies on surface and border separation. Native platform adapters must be visually checked.','body/m',1312,'neutral/600');
 }
if(KIND==='borders'){
 const s=section(board,'Quiet structure. Visible boundaries.');
 for(const width of [0,1,2]){const row=box(s,'Border/'+width,1312,'HORIZONTAL',32);text(row,'border/'+['none','default','strong'][width],'mono/m',288);const r=rect(row,'Boundary/'+width,520,48,'neutral/100',8);if(width){paint(r,'neutral/500',true);r.strokeWeight=width;}text(row,width+' logical units','body/m',360);}
 const row=box(board,'Focus/Themes',1312,'HORIZONTAL',32);
 for(const theme of ['Light','Dark']){const dark=theme==='Dark',fg=dark?'neutral/50':'neutral/950';const p=box(row,'Focus/'+theme,640,'VERTICAL',24,dark?'neutral/950':'neutral/100',32);p.cornerRadius=12;text(p,theme+' / focus geometry','heading/3',576,fg);
 const outer=box(p,'Focus/Ring',280,'VERTICAL',0,dark?'neutral/950':'neutral/100',2);paint(outer,dark?'mulberry/200':'mulberry/600',true);outer.strokeWeight=2;outer.cornerRadius=12;
 const inner=box(outer,'Focus/Shape',276,'VERTICAL',0,dark?'mulberry/200':'mulberry/600',16);inner.cornerRadius=8;text(inner,'2 ring / 2 gap','label',244,dark?'neutral/950':'neutral/50');
 text(p,'A foundation geometry sample, not a component.\nShared target ≥44 · Android ≥48 dp.','body/m',576,fg);}
 text(board,'Use a contrasting offset. Pale lime is an accent, not the sole focus ring on a light surface.','body/m',1312,'neutral/600');
 }
if(KIND==='iconography'){
 for(const size of [16,20,24]){const s=section(board,size+' / Phosphor Regular');const row=box(s,'Icons/'+size,1312,'HORIZONTAL',48);
 for(const name of ['chat-circle','arrow-right','microphone','check-circle','warning-circle']){const c=box(row,'Icon/'+name+'/'+size,208,'VERTICAL',16);svg(c,ICONS[name+'-regular'],'Vector/'+name,size);text(c,name,'mono/s',208,'neutral/600');}}
 const s=section(board,'Selected weight / Fill');svg(s,ICONS['chat-circle-fill'],'Vector/chat-circle-fill',24);
 text(s,'Use one family and consistent weight. Preserve native path geometry.\nNominal Regular weight: 1 / 1.25 / 1.5 units at 16 / 20 / 24.','body/m');
 text(s,'Visible artwork is independent from the ≥44 / Android ≥48 dp hit area.\nActual upstream SVGs, imported as native vectors; component wrappers come later.','body/m',1312,'neutral/600');
 }
if(KIND==='illustration'){
 const row=box(board,'Illustration/Examples',1312,'HORIZONTAL',32);
 for(const good of [true,false]){const p=box(row,good?'Illustration/Do':'Illustration/Dont',640,'VERTICAL',24,'neutral/100',32);p.cornerRadius=12;
 text(p,good?'DO / Make room for meaning':'DON’T / Compete for attention','heading/3',576);
 const art=box(p,'Artwork',576,'HORIZONTAL',16,null,16);art.counterAxisAlignItems='CENTER';
 if(good){const source='<svg width="240" height="240" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg"><path d="M22 42Q22 24 42 24H152Q172 24 172 44V112Q172 132 152 132H80L48 157V132H42Q22 132 22 112Z" fill="'+DATA.colors.mulberry['600']+'"/><path d="M91 103Q91 88 108 88H204Q222 88 222 106V176Q222 194 204 194H185V218L153 194H108Q91 194 91 176Z" fill="'+DATA.colors.apricot['300']+'"/><circle cx="116" cy="141" r="6" fill="'+DATA.colors.neutral['950']+'"/><circle cx="145" cy="141" r="6" fill="'+DATA.colors.neutral['950']+'"/><circle cx="174" cy="141" r="6" fill="'+DATA.colors.neutral['950']+'"/></svg>';svg(art,source,'Artwork/Abstract exchange',240);}
 else{for(let i=0;i<6;i++)rect(art,'Clutter/'+i,64,100+i%3*24,['mulberry/600','apricot/300','lime/200'][i%3],i%2?32:0);}
 text(p,good?'Simple silhouettes. Controlled asymmetry.\nA few palette colours and generous space.':'Too many competing shapes and accents.\nPlayfulness without hierarchy becomes noise.','body/m',576);
 }
 text(board,'Abstract exchange is a foundation illustration specimen, not a logo or character identity. All colours come from the approved palette.','body/m',1312,'neutral/600');
 }
if(KIND==='motion'){
 const s=section(board,'Responsive, with a little delight','Durations show relative time; these native tracks are documentation, not a running prototype.');
 for(const [name,ms] of [['fast',120],['base',200],['slow',320]]){const row=box(s,'Duration/'+name,1312,'HORIZONTAL',24);row.counterAxisAlignItems='CENTER';text(row,name+' / '+ms+' ms','mono/m',240);rect(row,'Time/'+name,ms*2,20,'mulberry/600',4);}
 const row=box(board,'Easing/Curves',1312,'HORIZONTAL',32);
 for(const [name,vals] of [['standard',DATA.motion.standard],['enter',DATA.motion.enter],['exit',DATA.motion.exit]]){const p=box(row,'Easing/'+name,416,'VERTICAL',16);text(p,name,'heading/4',416);
 const [x1,y1,x2,y2]=vals;const source='<svg width="240" height="240" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg"><path d="M20 20V220H220" stroke="'+DATA.colors.neutral['400']+'" fill="none"/><path d="M20 220 C '+(20+x1*200)+' '+(220-y1*200)+' '+(20+x2*200)+' '+(220-y2*200)+' 220 20" stroke="'+DATA.colors.mulberry['600']+'" stroke-width="3" fill="none"/></svg>';svg(p,source,'Easing curve/'+name,240);text(p,'cubic-bezier('+vals.join(', ')+')','mono/s',416,'neutral/600');}
 const s2=section(board,'Reduced motion and clear state');text(s2,'Remove travel and scale. Preserve immediate state changes.\nVoice feedback always includes a literal label; a waveform is supplementary.','body/l');
 }
line(board);
text(board,'PHASE 2 / FOUNDATION SPECIMENS · Native styles now; variable aliases and bindings after Phase 3 approval.','mono/s',1312,'neutral/600');
await Promise.all(pending);
board.placeholder=false;
const nodes=board.findAll();
const overflow=nodes.filter(n=>{if(!('width' in n)||!n.parent||n.parent.type==='PAGE')return false;const p=n.parent;return 'width' in p&&(n.x < -1||n.y < -1||n.x+n.width>p.width+1||n.y+n.height>p.height+1);}).map(n=>({id:n.id,name:n.name}));
return {createdNodeIds:[...new Set(createdNodeIds)],rootId:board.id,name:board.name,pageId:page.id,width:board.width,height:board.height,descendants:nodes.length,overflow};
