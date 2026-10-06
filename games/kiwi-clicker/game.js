import {createKiwiMotion} from './kiwi-motion.js';
import {KEY,upgrades,fresh,restore,power,rate,cost,earn,buy,catchUp} from './engine.js';
const $=id=>document.getElementById(id);
let raw=null,storageOK=true;
try{raw=localStorage.getItem(KEY);}catch{storageOK=false;}
let state=restore(raw);const welcome=catchUp(state);
const fmt=n=>n>=1e6?new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1}).format(n):Math.floor(n).toLocaleString('en');
const rows=upgrades.map(u=>{const row=document.createElement('div');row.className='upgrade';const info=document.createElement('div');const title=document.createElement('h3');title.textContent=u.name;const desc=document.createElement('p');desc.textContent=u.description;const owned=document.createElement('p');info.append(title,desc,owned);const button=document.createElement('button');button.addEventListener('click',()=>{settle();if(buy(state,u.id)){render();save();}});row.append(info,button);$('shop').append(row);return {u,owned,button};});
const extraTools=upgrades.filter(u=>u.scene).map(u=>{
 const badge=document.createElement('span');badge.className='tool-badge';$('extra-tools').append(badge);return {u,badge};
});
function render(){
 const large=state.owned.large>0, doubled=state.owned.double>0;
 $('main-button-size').setAttribute('transform',large?'translate(1430 710) scale(1.35) translate(-1430 -710)':'');
 $('second-button-size').toggleAttribute('hidden',!doubled);
 $('button-linkage').toggleAttribute('hidden',!doubled);
 $('second-action-lines').toggleAttribute('hidden',!doubled);
 $('main-action-lines').setAttribute('transform',large?'translate(1430 710) scale(1.35) translate(-1430 -710)':'');
 $('second-action-lines').setAttribute('transform',large?'translate(1755.76 710) scale(1.35) translate(-1755.76 -710)':'');
 $('second-button-size').setAttribute('transform',large?'translate(1755.76 710) scale(1.35) translate(-1755.76 -710)':'');
 $('worm-farm').hidden=state.owned.worms===0;
 $('worm-count').textContent='×'+state.owned.worms;

 for(const {u,badge} of extraTools){badge.hidden=state.owned[u.id]===0;badge.textContent=`${u.scene} ×${state.owned[u.id]}`;}
 $('extra-tools').hidden=!extraTools.some(({u})=>state.owned[u.id]>0);

 for(const id of ['intern','flock','factory']){
  $(id+'-scene').hidden=state.owned[id]===0;
  $(id+'-count').textContent='×'+state.owned[id];
 }
 $('workplace').hidden=!['intern','flock','factory'].some(id=>state.owned[id]>0);
 drawKiwi?.setPolish(state.owned.beak>0);

 $('balance').textContent=fmt(state.balance);$('power').textContent=fmt(power(state));$('rate').textContent=fmt(rate(state));$('lifetime').textContent=`${fmt(state.total)} lifetime pecks · ${upgrades.reduce((n,u)=>n+state.owned[u.id],0)} upgrades owned`;
 for(const {u,owned,button} of rows){owned.textContent=`Owned: ${state.owned[u.id]}`;button.textContent=`${fmt(cost(state,u))} pecks`;button.disabled=state.balance<cost(state,u)||state.owned[u.id]>=1000;button.setAttribute('aria-label',`Buy ${u.name} for ${fmt(cost(state,u))} pecks`);}
 $('milestone').textContent=state.total>=100000?'100,000 pecks. That’s quite a flock.':state.total>=10000?'The flock has requested a snack budget.':state.total>=1000?'1,000 pecks earned. Nicely done.':rate(state)>0?'Your helpers are clicking. You can keep clicking too.':state.total>=15?'You can afford your first upgrade.':'Each press earns a peck. Save up for your first upgrade.';
}
function save(){state.savedAt=Date.now();try{localStorage.setItem(KEY,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}$('save-status').textContent=storageOK?'Saved in this browser.':'Browser saving is unavailable. Progress lasts only for this session.';}
// A continuous mesh bends the neck while keeping the body and feet anchored.
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const pivot={x:900,y:450},tip={x:1464,y:624},surfaceY=710;
const drawKiwi=createKiwiMotion($('kiwi-canvas'));
const drawIntern=createKiwiMotion($('intern-canvas'));
const peckStages=[[0,0],[.12,-.04],[.52,1],[.65,1],[1,0]];
function peckAmount(t){
 let i=1;while(i<peckStages.length-1&&t>peckStages[i][0])i++;
 const [from,a]=peckStages[i-1],[to,b]=peckStages[i];
 const fraction=(t-from)/(to-from),ease=fraction*fraction*(3-2*fraction);
 return a+(b-a)*ease;
}
function buttonTravel(amount){
 const radians=9*amount*Math.PI/180;
 const tipY=pivot.y+(tip.x-pivot.x)*Math.sin(radians)+(tip.y-pivot.y)*Math.cos(radians)+20*amount;
 return Math.min(20,Math.max(0,tipY-surfaceY));
}
let internFrame=0,lastInternAmount=-1;
function animateIntern(now){
 if(state.owned.intern>0&&!reducedMotion.matches&&drawIntern&&!document.hidden){
  const elapsed=now%1000;
  const amount=elapsed<220?peckAmount(elapsed/220):0;
  if(amount!==lastInternAmount){drawIntern(amount);lastInternAmount=amount;}
  const travel=buttonTravel(amount);
  $('intern-plunger').setAttribute('transform',`translate(0 ${travel/.32})`);
  $('intern-action-lines').setAttribute('opacity',travel>1?'1':'0');
  $('intern-action-lines').setAttribute('transform',`translate(0 ${travel})`);
 }else{
  if(lastInternAmount!==0){drawIntern?.(0);lastInternAmount=0;$('intern-plunger').removeAttribute('transform');$('intern-action-lines').setAttribute('opacity','0');}
 }
 internFrame=requestAnimationFrame(animateIntern);
}
internFrame=requestAnimationFrame(animateIntern);

let animationFrame=0,queuedPeck=false;
function pose(amount){
 const depression=buttonTravel(amount);
 drawKiwi?.(amount);
 $('beak-accessories').setAttribute('transform',`translate(0 ${20*amount}) rotate(${9*amount} 900 450)`);
 $('button-plunger').setAttribute('transform',`translate(0 ${depression/(.32*(state.owned.large>0?1.35:1))})`);
 $('second-plunger').setAttribute('transform',`translate(0 ${depression/(.32*(state.owned.large>0?1.35:1))})`);
 $('contact-spark').setAttribute('opacity',depression>1?'1':'0');
 $('contact-spark').setAttribute('transform',`translate(0 ${depression})`);

}
function animatePress(){
 if(reducedMotion.matches||!drawKiwi){pose(0);return;}
 if(animationFrame){queuedPeck=true;return;}
 const started=performance.now();

 function frame(now){
  if(reducedMotion.matches){pose(0);animationFrame=0;queuedPeck=false;return;}
  const t=Math.min(1,(now-started)/220);
  pose(peckAmount(t));
  if(t<1){animationFrame=requestAnimationFrame(frame);}
  else{pose(0);animationFrame=0;if(queuedPeck){queuedPeck=false;animatePress();}}
 }
 animationFrame=requestAnimationFrame(frame);
}
let last=Date.now();
function settle(){const now=Date.now();earn(state,rate(state)*Math.max(0,Math.min(28800,(now-last)/1000)));last=now;}
$('peck').addEventListener('click',()=>{settle();earn(state,power(state));animatePress();render();save();});
$('reset').addEventListener('click',()=>$('reset-dialog').showModal());$('cancel-reset').addEventListener('click',()=>$('reset-dialog').close());$('confirm-reset').addEventListener('click',()=>{state=fresh();last=Date.now();$('reset-dialog').close();render();save();});
setInterval(()=>{settle();render();},250);setInterval(save,5000);
document.addEventListener('visibilitychange',()=>{settle();render();save();});window.addEventListener('pagehide',()=>{settle();save();});
render();save();if(welcome>=1)$('save-status').textContent=`Your flock earned ${fmt(welcome)} pecks while you were away. Progress saved.`;
