/** Shared component behaviour. Included once by Astro even with many instances. */
const previousDisabled=new WeakMap<HTMLButtonElement,string|null>();
export function setButtonLoading(button: HTMLButtonElement, loading: boolean) {
  if(loading&&button.dataset.loading!=='true')previousDisabled.set(button,button.getAttribute('aria-disabled'));
  button.dataset.loading=String(loading);
  if(loading) { button.setAttribute('aria-busy','true'); button.setAttribute('aria-disabled','true'); }
  else { button.removeAttribute('aria-busy'); const original=previousDisabled.get(button);if(button.disabled||original==='true')button.setAttribute('aria-disabled','true');else button.removeAttribute('aria-disabled');previousDisabled.delete(button); }
}
document.addEventListener('click',event=>{
  const target=event.target instanceof Element?event.target.closest<HTMLButtonElement>('button.sv-action'):null;
  if(!target)return;
  if(target.disabled||target.dataset.loading==='true'||target.getAttribute('aria-disabled')==='true'){
    event.preventDefault();event.stopImmediatePropagation();return;
  }
  if(target.dataset.actionToggle==='true'){
    const pressed=target.getAttribute('aria-pressed')!=='true';
    target.setAttribute('aria-pressed',String(pressed));
    target.dispatchEvent(new CustomEvent('samvad:toggle',{bubbles:true,detail:{pressed}}));
  }
},true);
document.addEventListener('submit',event=>{
  const button=(event as SubmitEvent).submitter;
  if(button instanceof HTMLButtonElement&&button.matches('.sv-action')&&(button.dataset.loading==='true'||button.getAttribute('aria-disabled')==='true'))event.preventDefault();
},true);
