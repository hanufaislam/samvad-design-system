import {exampleFor,type ActionKind,type ExampleOptions} from '../components/actions/examples';
import {setButtonLoading} from '../components/actions/runtime';

document.querySelectorAll<HTMLElement>('[data-action-playground]').forEach(root=>{
  const kind=root.dataset.actionPlayground as ActionKind;
  const status=root.querySelector<HTMLElement>('[data-preview-status]')!;
  const controls=[...root.querySelectorAll<HTMLSelectElement>('[data-preview-control]')];
  const buttons=[...root.querySelectorAll<HTMLButtonElement>('[data-preview-stage] button.sv-action')];
  let activations=0;
  function configuration(){return Object.fromEntries(controls.map(c=>[c.dataset.previewControl,c.value])) as ExampleOptions;}
  function update(){
    const o=configuration(),size=o.size||'medium',variant=o.variant||'primary';
    for(const button of buttons){
      button.dataset.size=size;
      if(kind!=='button-group')button.dataset.variant=variant;
      button.disabled=o.state==='disabled';
      setButtonLoading(button,o.state==='loading');
      if(o.state==='disabled')button.setAttribute('aria-disabled','true');
      else if(o.state!=='loading')button.removeAttribute('aria-disabled');
      if(kind==='icon-button'){
        if(o.mode==='toggle'){button.dataset.actionToggle='true';if(!button.hasAttribute('aria-pressed'))button.setAttribute('aria-pressed','false');}
        else{delete button.dataset.actionToggle;button.removeAttribute('aria-pressed');}
      }
    }
    const group=root.querySelector<HTMLElement>('.sv-button-group');
    if(group){group.dataset.groupVariant=variant;group.dataset.layout=o.layout||'horizontal';}
    if(kind==='text-link'){
      const internal=root.querySelector<HTMLElement>('[data-preview-enabled-link]')!;
      const external=root.querySelector<HTMLElement>('[data-preview-external-link]')!;
      const disabled=root.querySelector<HTMLElement>('.sv-text-link[aria-disabled=true]')!;
      internal.classList.toggle('preview-hidden',o.state==='disabled'||o.mode==='external');
      external.classList.toggle('preview-hidden',o.state==='disabled'||o.mode!=='external');
      disabled.classList.toggle('preview-hidden',o.state!=='disabled');
      disabled.textContent=o.mode==='external'?'Figma workspace':'Explore colour';
      root.querySelectorAll<HTMLElement>('.sv-text-link').forEach(link=>{link.dataset.linkVariant=variant;link.dataset.size=size;});
    }
    const code=exampleFor(kind,o);
    root.querySelector('[data-live-code]')!.textContent=code;
    root.querySelector<HTMLButtonElement>('[data-copy-current]')!.dataset.copy=code;
    status.textContent=o.state==='disabled'?'Disabled: activation is unavailable.':o.state==='loading'?'Loading: repeat activation is blocked; return State to default to continue.':kind==='text-link'?'This is a real navigation link.':`Ready. ${kind==='icon-button'&&o.mode==='toggle'?'Activate to toggle the pressed state.':'Activate the component to try it.'}`;
  }
  controls.forEach(control=>control.addEventListener('change',update));
  root.addEventListener('click',event=>{
    const target=event.target instanceof Element?event.target.closest<HTMLButtonElement>('button[data-demo-activate]'):null;
    if(!target||target.disabled||target.dataset.loading==='true')return;
    ++activations;
    status.textContent=target.dataset.actionToggle==='true'?`Mark complete: ${target.getAttribute('aria-pressed')==='true'?'on':'off'}.`:`${target.textContent?.trim()||target.getAttribute('aria-label')} activated ${activations} time${activations===1?'':'s'}. No data is sent.`;
  });
});

document.querySelectorAll<HTMLButtonElement>('[data-demo-async]').forEach(button=>{
  button.addEventListener('click',async()=>{
    const status=button.parentElement!.querySelector<HTMLElement>('[data-async-status]')!;
    setButtonLoading(button,true);status.textContent='Local demonstration in progress. Repeat activation is blocked.';
    try{await new Promise(resolve=>setTimeout(resolve,1200));status.textContent='Demonstration complete. The button is available again.';}
    finally{setButtonLoading(button,false);}
  });
});
document.querySelectorAll<HTMLButtonElement>('[data-example-activation]').forEach(button=>button.addEventListener('click',()=>{
  const status=button.closest('[data-action-document]')!.querySelector<HTMLElement>('[data-example-status]')!;
  status.textContent=button.dataset.actionToggle==='true'?`Mark complete: ${button.getAttribute('aria-pressed')==='true'?'on':'off'}.`:`${button.textContent?.trim()||button.getAttribute('aria-label')} activated. This is a local component demonstration.`;
}));
