const state={step:0,language:'English',subtitles:'',goals:[],confidence:''};
const goals=['Start conversations','Speak with confidence','Listen better'];
const screen=document.querySelector('#screen'),next=document.querySelector('#next'),skip=document.querySelector('#skip'),back=document.querySelector('.back');
const character='<img class="character" src="assets/guide.png" alt="Friendly Samvad guide waving">';
const prompts=['','Which language feels like you?','Would you like subtitles?','What brings you here?','How do conversations feel?','A little plan, just for you.'];
function guide(text){return `<div class="guide">${character}<div class="bubble"><h1 id="prompt" tabindex="-1">${text}</h1></div></div>`}
function options(name,items,multi=false){return `<fieldset><legend class="sr-only">${prompts[state.step]}</legend><div class="options">${items.map((item,i)=>{const chosen=multi?state[name].includes(item):state[name]===item;return `<label class="option">${name==='language'?'':`<span class="symbol" aria-hidden="true"><img src="assets/${['chat-circle-regular','microphone-regular','book-open-regular'][i]}.svg" alt=""></span>`}<span class="label">${item}</span><input type="${multi?'checkbox':'radio'}" name="${name}" value="${item}" ${chosen?'checked':''}></label>`}).join('')}</div></fieldset>`}
function canContinue(){return state.step===1?!!state.language:state.step===2?!!state.subtitles:state.step===3?state.goals.length>0:state.step===4?!!state.confidence:true}
function render(focus=false){
 document.querySelector('.app').dataset.step=state.step;back.disabled=state.step===0;document.querySelector('progress').value=state.step;document.querySelector('.step-count').textContent=`${state.step+1} / 7`;skip.hidden=state.step!==4;
 if(state.step===0)screen.innerHTML=`<div class="welcome">${character}<h1 id="prompt" tabindex="-1">A little practice.<br>A little more you.</h1><p>Find your voice, one conversation at a time.</p></div>`;
 if(state.step===1)screen.innerHTML=guide(prompts[1])+options('language',['English','Hindi','Telugu'])+'<p class="note">English is selected by default. You can choose another language.</p>';
 if(state.step===2)screen.innerHTML=guide(prompts[2])+options('subtitles',['Subtitles on','Subtitles off'])+'<p class="helper">Your words, a little easier to follow.</p>';
 if(state.step===3)screen.innerHTML=guide(prompts[3])+options('goals',goals,true)+'<p class="helper">Choose up to 3</p>';
 if(state.step===4)screen.innerHTML=guide(prompts[4])+options('confidence',['A little daunting','Getting comfortable','Feeling confident'])+'<p class="helper">No right answer. You can skip this.</p>';
 if(state.step===5)screen.innerHTML=guide(prompts[5])+`<dl class="summary"><div><dt>Learning language</dt><dd>${state.language}</dd></div><div><dt>Subtitles</dt><dd>${state.subtitles==='Subtitles on'?'On':'Off'}</dd></div><div><dt>Your focus</dt><dd>${state.goals.join(' · ')}</dd></div>${state.confidence?`<div><dt>How you feel</dt><dd>${state.confidence}</dd></div>`:''}</dl><p class="helper">Learn a little. Practise. Reflect. Try again.</p>`;
 if(state.step===6)screen.innerHTML=`<div class="completion">${character}<h1 id="prompt" tabindex="-1">You’re ready to begin.</h1><p>One conversation at a time.</p><button type="button" class="primary go-home">Go to Home <span aria-hidden="true">→</span></button><button type="button" class="restart">Review from the start</button></div>`;
 next.hidden=state.step===6;next.innerHTML=`${state.step===0?'Get started':state.step===5?'Let’s begin':'Continue'} <span aria-hidden="true">→</span>`;next.disabled=!canContinue();
 screen.querySelectorAll('input').forEach(input=>input.addEventListener('change',()=>{if(input.name==='goals'){state.goals=Array.from(screen.querySelectorAll('input:checked'),x=>x.value)}else state[input.name]=input.value;next.disabled=!canContinue()}));
 screen.querySelector('.go-home')?.addEventListener('click',()=>window.SamvadHome.open({...state}));
 screen.querySelector('.restart')?.addEventListener('click',()=>{state.step=0;render(true)});if(focus)screen.querySelector('#prompt').focus();
}
next.addEventListener('click',()=>{if(canContinue()&&state.step<6){state.step++;render(true)}});back.addEventListener('click',()=>{if(state.step>0){state.step--;render(true)}});skip.addEventListener('click',()=>{state.confidence='';state.step=5;render(true)});render();
