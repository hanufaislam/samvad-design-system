import {containerStyle,gridStyle,space,type ContainerWidth,type Space} from '../components/layout/values';
for(const root of document.querySelectorAll<HTMLElement>('[data-layout-playground]')){
 const kind=root.dataset.layoutPlayground!;
 const controls=[...root.querySelectorAll<HTMLSelectElement>('[data-layout-control]')];
 const status=root.querySelector<HTMLElement>('[data-layout-status]')!;
 function update(announce=false){
  const v=Object.fromEntries(controls.map(c=>[c.dataset.layoutControl!,c.value]));
  const target=root.querySelector<HTMLElement>('[data-layout-target]');
  if(kind==='container'&&target){const max=(['full','reading'].includes(v.max)?v.max:Number(v.max)) as ContainerWidth;target.dataset.width=v.max;target.dataset.padding=v.padding;target.setAttribute('style',containerStyle(max,v.padding==='responsive'?'responsive':Number(v.padding) as Space));}
  if(kind==='stack'&&target){for(const key of ['direction','align','justify','wrap','collapse'])target.dataset[key]=v[key];target.style.setProperty('--_svl-gap',space(Number(v.gap)));}
  if(kind==='grid'&&target){target.dataset.align=v.align;target.dataset.responsive=v.responsive;target.setAttribute('style',gridStyle(Number(v.gap) as Space,Number(v.columns),Number(v.medium),Number(v.wide)));}
  if(kind==='divider'){
   root.querySelectorAll<HTMLElement>('.sv-divider').forEach(divider=>{
    const orientation=divider.dataset.orientation!;divider.hidden=orientation!==v.orientation;divider.style.setProperty('--_svl-inset',space(Number(v.inset)));
    divider.removeAttribute('role');divider.removeAttribute('aria-orientation');divider.removeAttribute('aria-hidden');
    if(v.decorative==='decorative'){if(orientation==='horizontal')divider.setAttribute('role','presentation');else divider.setAttribute('aria-hidden','true');}else if(orientation==='vertical'){divider.setAttribute('role','separator');divider.setAttribute('aria-orientation','vertical');}
   });
   root.querySelector<HTMLElement>('.layout-divider-example')!.dataset.orientation=v.orientation;
  }
  const name=kind[0].toUpperCase()+kind.slice(1);
  const numeric=['gap','inset','columns','medium','wide'];const boolean=['wrap','collapse','responsive'];
  const props=Object.entries(v).map(([k,value])=>k==='decorative'?`decorative={${value==='decorative'}}`:numeric.includes(k)||boolean.includes(k)||k==='max'&&!['reading','full'].includes(value)||k==='padding'&&value!=='responsive'?`${k}={${value}}`:`${k}=${JSON.stringify(value)}`).join(' ');
  const code=`---\nimport ${name} from '../components/layout/${name}.astro';\n---\n<${name} ${props}${kind==='divider'?' />':`>\n  <div>First item</div>\n  <div>Second item</div>\n</${name}>`}`;
  const copy=root.querySelector<HTMLButtonElement>('[data-copy-current]')!;copy.dataset.copy=code;root.querySelector('[data-live-code]')!.textContent=code;
  if(announce)status.textContent=`${name} updated. ${Object.entries(v).map(([k,value])=>`${k}: ${value}`).join('; ')}.`;
 }
 controls.forEach(c=>c.addEventListener('change',()=>update(true)));update();
}
