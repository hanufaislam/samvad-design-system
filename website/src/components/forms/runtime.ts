// Shared field validation, password visibility and removable-selection behaviour.
export function validateGroup(group: HTMLFieldSetElement): boolean {
  const controls=[...group.querySelectorAll<HTMLInputElement>('input:not(:disabled)')];
  const valid=group.dataset.required!=='true'||controls.some(input=>input.checked);
  const error=group.querySelector<HTMLElement>('[data-choice-error]');
  if(error){error.hidden=valid;error.textContent=valid?'':'Choose at least one option.';}
  controls.forEach(input=>input.setAttribute('aria-invalid',String(!valid)));
  return valid;
}
export function validateField(control: HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement): boolean {
  const error=control.closest('[data-field]')?.querySelector<HTMLElement>('[data-field-error]');
  const valid=control.validity.valid;
  control.setAttribute('aria-invalid',String(!valid));
  if(error){error.hidden=valid;error.textContent=valid?'':control.validationMessage;}
  return valid;
}
export function validateForm(form: HTMLFormElement):boolean {
  const fields=[...form.querySelectorAll<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>('[data-field] input,[data-field] textarea,[data-field] select')];
  const fieldResults=fields.filter(c=>!c.matches(':disabled')).map(validateField);
  const groupResults=[...form.querySelectorAll<HTMLFieldSetElement>('[data-choice-group]')].filter(g=>!g.disabled&&!g.closest('fieldset:disabled')).map(validateGroup);
  return [...fieldResults,...groupResults].every(Boolean);
}
document.addEventListener('click',event=>{
  const target=event.target as Element;
  const reveal=target.closest<HTMLButtonElement>('[data-password-toggle]');
  if(reveal){const input=document.getElementById(reveal.getAttribute('aria-controls')!) as HTMLInputElement;const visible=input.type==='password';input.type=visible?'text':'password';reveal.textContent=visible?'Hide':'Show';reveal.setAttribute('aria-pressed',String(visible));reveal.setAttribute('aria-label',reveal.getAttribute('aria-label')!.replace(visible?'Show':'Hide',visible?'Hide':'Show'));}
  const remove=target.closest<HTMLButtonElement>('[data-remove-chip]');
  if(remove){const chip=remove.closest('.sv-removable-chip')!;const group=remove.closest('[data-removable-chips]')!;const buttons=[...group.querySelectorAll<HTMLButtonElement>('[data-remove-chip]')];const i=buttons.indexOf(remove);const label=remove.getAttribute('aria-label')!.replace('Remove ','');chip.remove();const next=buttons[i+1]||buttons[i-1];if(next)next.focus();else{(group as HTMLElement).tabIndex=-1;(group as HTMLElement).focus();}group.querySelector('[data-chip-status]')!.textContent=`${label} removed.`;}
});
document.addEventListener('input',event=>{
  const input=event.target;
  if(input instanceof HTMLInputElement||input instanceof HTMLTextAreaElement||input instanceof HTMLSelectElement){
    if(input.dataset.demoError){input.setCustomValidity('');delete input.dataset.demoError;}
    if(input.getAttribute('aria-invalid')==='true')validateField(input);
    const group=input.closest<HTMLFieldSetElement>('[data-choice-group]');if(group&&group.querySelector<HTMLElement>('[data-choice-error]')?.hidden===false)validateGroup(group);
  }
});
