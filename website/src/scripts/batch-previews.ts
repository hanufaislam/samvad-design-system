import {validateField,validateForm} from '../components/forms/runtime';
for(const preview of document.querySelectorAll<HTMLElement>('[data-batch-preview]')){
 const form=preview.querySelector<HTMLFormElement>('[data-batch-form]')!;
 const controls=preview.querySelector<HTMLFieldSetElement>('[data-batch-controls]')!;
 const status=preview.querySelector<HTMLElement>('[data-batch-status]')!;
 const chips=preview.querySelector<HTMLElement>('[data-removable-chips] .sv-choices__options');
 const initialChips=chips?.innerHTML;
 const state=preview.querySelector<HTMLSelectElement>('[data-batch-state]')!;
 function clearErrors(){form.querySelectorAll<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>('input,textarea,select').forEach(c=>{c.setCustomValidity('');delete c.dataset.demoError;c.removeAttribute('aria-invalid');});form.querySelectorAll<HTMLElement>('[data-field-error],[data-choice-error]').forEach(e=>{e.hidden=true;e.textContent='';});}
 state.addEventListener('change',()=>{
  clearErrors();controls.disabled=state.value==='disabled';
  controls.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('input,textarea').forEach(c=>c.readOnly=state.value==='readonly');
  form.querySelectorAll<HTMLButtonElement>('[data-remove-chip]').forEach(b=>b.disabled=controls.disabled);
  status.textContent=controls.disabled?'Preview control disabled.':state.value==='readonly'?'Read-only. Value can be focused and copied.':state.value==='error'?'Demonstration error. Edit the field or make a selection to recover.':'Ready. Try this component.';
  if(state.value==='error'){
   const c=controls.querySelector<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>('[data-field] input,[data-field] textarea,[data-field] select');
   if(c){c.setCustomValidity('Please review this value.');c.dataset.demoError='true';validateField(c);}
   else {controls.querySelectorAll<HTMLInputElement>('input').forEach(i=>i.checked=false);validateForm(form);}
  }
 });
 preview.querySelector<HTMLSelectElement>('[data-batch-size]')?.addEventListener('change',event=>{controls.querySelectorAll<HTMLElement>('.sv-field').forEach(f=>f.dataset.size=(event.target as HTMLSelectElement).value);});
 form.addEventListener('submit',event=>{event.preventDefault();if(controls.disabled){status.textContent='Control is disabled. Choose Default to try it.';return;}const valid=validateForm(form);status.textContent=valid?'Local check passed. No data was sent.':'Please review the indicated field or selection.';if(!valid)form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();});
 form.addEventListener('change',event=>{const c=event.target as HTMLInputElement;if(c.type==='file'){const count=c.files?.length??0;status.textContent=`${count} file${count===1?'':'s'} selected locally. Nothing uploaded.`;}else if(c.type==='checkbox'||c.type==='radio'){status.textContent=`${c.closest('label')?.textContent?.trim()||'Option'} ${c.checked?'selected':'cleared'}.`;}});
 form.addEventListener('reset',()=>{if(chips&&initialChips)chips.innerHTML=initialChips;clearErrors();controls.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('input,textarea').forEach(c=>c.readOnly=false);controls.querySelectorAll<HTMLButtonElement>('[data-password-toggle]').forEach(b=>{const c=document.getElementById(b.getAttribute('aria-controls')!) as HTMLInputElement;c.type='password';b.textContent='Show';b.setAttribute('aria-pressed','false');b.setAttribute('aria-label',b.getAttribute('aria-label')!.replace('Hide','Show'));});controls.disabled=false;state.value='default';form.querySelectorAll<HTMLButtonElement>('[data-remove-chip]').forEach(b=>b.disabled=false);status.textContent='Reset to initial values.';});
}
