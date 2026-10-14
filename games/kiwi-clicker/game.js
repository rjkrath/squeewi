import {startCelebration,stopCelebration} from './celebration.js';
import {startUpgradePreviews} from './upgrade-motion.js';
import {createKiwiMotion} from './kiwi-motion.js';
import {KEY,upgrades,fresh,restore,power,rate,cost,earn,buy,catchUp,unlockAt,unlocked,empireStages,empireStage,completeEmpire} from './engine.js';
const $=id=>document.getElementById(id);
let raw=null,storageOK=true;
try{raw=localStorage.getItem(KEY);}catch{storageOK=false;}
let state=restore(raw);catchUp(state);
const compactNumbers=new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1});
const wholeNumbers=new Intl.NumberFormat('en',{maximumFractionDigits:0});
const fmt=n=>n>=1e6?compactNumbers.format(n):wholeNumbers.format(Math.floor(n));
const text=(id,value)=>{const el=$(id);if(el.textContent!==value)el.textContent=value;};
const locks=new Map();
// One stable price order for the store and every purchased-upgrade display.
const orderedUpgrades=[...upgrades].sort((a,b)=>a.base-b.base);
let purchaseTimer,purchaseTarget=null;
function showPurchase(u){
 clearTimeout(purchaseTimer);
 const sceneIds={intern:'intern-scene',clockwork:'clockwork-scene',flock:'flock-scene',factory:'factory-scene',snacks:'snack-tin',worms:'worm-farm',buffet:'buffet-scene',union:'union-scene',inspection:'inspection-scene',seesaw:'seesaw-scene',staircase:'staircase-scene',carousel:'carousel-scene',conga:'conga-scene'};
 purchaseTarget=sceneIds[u.id]?$(sceneIds[u.id]):$('peck');
 text('purchase-message',`${u.name} added · Owned: ${state.owned[u.id]}`);
 $('purchase-toast').hidden=false;
 purchaseTimer=setTimeout(()=>{$('purchase-toast').hidden=true;},6000);
}
$('view-purchase').addEventListener('click',()=>purchaseTarget?.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'center'}));
const rows=orderedUpgrades.map(u=>{const gate=unlockAt(u);if(gate&&!locks.has(gate)){const lock=document.createElement('div');lock.className='upgrade locked-upgrade';lock.textContent=`🔒 More upgrades unlock at ${gate.toLocaleString('en')} pecks`;locks.set(gate,lock);$('shop').append(lock);}const row=document.createElement('div');row.className='upgrade';const info=document.createElement('div');const title=document.createElement('h3');title.textContent=u.name;const desc=document.createElement('p');desc.textContent=u.description;const owned=document.createElement('p');info.append(title,desc,owned);const button=document.createElement('button');button.addEventListener('click',()=>{settle();if(buy(state,u.id)){render();save();showPurchase(u);}});row.append(info,button);$('shop').append(row);return {u,row,owned,button};});
const illustratedUpgrades=new Set(['beak','intern','snacks','clockwork','flock','factory','large','double','worms','gold','buffet','union','inspection','seesaw','staircase','carousel','conga']);
const extraTools=orderedUpgrades.filter(u=>!illustratedUpgrades.has(u.id)).map(u=>{
 const badge=document.createElement('span');badge.className='tool-badge';if(u.id==='snacks'){const art=document.createElement('img');art.src='./assets/upgrades/snacks/assembled-idle.png';art.alt='Open tin of worm snacks';badge.append(art);}const label=document.createElement('span');badge.append(label);$('extra-tools').append(badge);return {u,badge,label};
});
let sceneSignature='';
const stageLabels=empireStages.map(stage=>{const li=document.createElement('li');li.textContent=stage.name;$('empire-stages').append(li);return li;});
function renderEmpire(){
 const index=empireStage(state),goal=empireStages[index];
 stageLabels.forEach((li,i)=>{li.classList.toggle('reached',i<=index);if(i===index)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});
 text('empire-title',state.empireComplete?'Button empire established!':goal.name);
 text('empire-next',state.empireComplete?'One kiwi. An absurd empire. Keep expanding for the sheer joy of it.':goal.note);
 $('empire-progress').value=Math.min(100,state.total/goal.target*100);
 const missing=goal.helpers.filter(id=>!state.owned[id]).map(id=>upgrades.find(u=>u.id===id).name);
 text('empire-missing',index===3?'':`${fmt(Math.min(state.total,goal.target))} / ${fmt(goal.target)} pecks`);
 text('empire-requirements',index===3?'':missing.length?'Still needed: '+missing.join(', '):'Required upgrades collected');
 $('empire-finale').hidden=index!==3;
 $('finale-press').disabled=index!==3;
 text('finale-note',state.empireComplete?'Every bird and contraption played its part. The button never stood a chance.':"The whole empire is ready. One button. Everyone's big moment.");
 text('finale-result',state.empireComplete?'The Big Peck complete. Long live the button empire!':'');
}
$('finale-press').addEventListener('click',()=>{settle();if(empireStage(state)===3){completeEmpire(state);animatePress();startCelebration(reducedMotion.matches);$('empire-finale').classList.remove('celebrate');void $('empire-finale').offsetWidth;$('empire-finale').classList.add('celebrate');render();save();}});
function render(){
 renderEmpire();
 const signature=upgrades.map(u=>state.owned[u.id]).join(',');
 if(signature!==sceneSignature){
 sceneSignature=signature;
 const large=state.owned.large>0, doubled=state.owned.double>0;
 const scale=large?(doubled?1.1:1.35):1;
 const left=doubled?1242.8:1430,top=doubled?865.8:710;
 const actionTop=top;
 $('main-button-art').setAttribute('transform',doubled?'translate(997.04 785.8) scale(.32)':'translate(1184.24 630) scale(.32)');
 $('main-button-size').setAttribute('transform',`translate(${left} ${top}) scale(${scale}) translate(${-left} ${-top})`);
 $('second-button-size').toggleAttribute('hidden',!doubled);
 $('second-button-size').setAttribute('transform',`translate(1618.8 865.8) scale(${scale}) translate(-1618.8 -865.8)`);
 $('button-linkage').toggleAttribute('hidden',!doubled);
 $('main-kiwi-position').removeAttribute('transform');
 $('button-height').removeAttribute('transform');
 $('button-height').removeAttribute('clip-path');
 for(const id of ['main-plunger-trim','second-plunger-trim']){if(doubled)$(id).setAttribute('clip-path','url(#short-plunger)');else $(id).removeAttribute('clip-path');}
 $('button-height').querySelectorAll('.original-housing').forEach(image=>image.toggleAttribute('hidden',doubled));
 $('button-height').querySelectorAll('.short-housing').forEach(image=>image.toggleAttribute('hidden',!doubled));
 
 $('second-action-lines').toggleAttribute('hidden',!doubled);
 for(const [id,x] of [['main-action-lines',left],['second-action-lines',1618.8]]){
  $(id).querySelector('path').setAttribute('d',`M${x-185*scale} ${actionTop+10}l-25-15m23 40-29 3M${x+185*scale} ${actionTop+10}l25-15m-23 40 29 3`);
  $(id).removeAttribute('transform');
 }
 $('clockwork-scene').hidden=state.owned.clockwork===0;
 // Match the unupgraded main button, irrespective of Large/Double purchases.
 const sceneWidth=$('peck').getBoundingClientRect().width;
 $('clockwork-scene').style.setProperty('--clockwork-art-width',`${sceneWidth*.46}px`);
 $('clockwork-count').textContent='×'+state.owned.clockwork;
 $('peck').classList.toggle('gold-owned',state.owned.gold>0);
 drawKiwi?.setGold(state.owned.gold>0);
 $('peck').querySelector('.kiwi-fallback').setAttribute('href',state.owned.gold>0?'./assets/upgrades/gold/idle.png':'./assets/kiwi-idle.png');
 $('snack-tin').hidden=state.owned.snacks===0;
 $('snack-count').textContent='×'+state.owned.snacks;
 $('worm-farm').hidden=state.owned.worms===0;
 $('worm-count').textContent='×'+state.owned.worms;

 for(const {u,badge,label} of extraTools){badge.hidden=state.owned[u.id]===0||u.id==='clockwork'||u.id==='worms';label.textContent=`${u.name} ×${state.owned[u.id]}`;}
 $('unpictured-upgrades').hidden=!extraTools.some(({u})=>state.owned[u.id]>0);

 for(const id of ['intern','flock','factory','buffet','union','inspection','seesaw','staircase','carousel','conga']){
  $(id+'-scene').hidden=state.owned[id]===0;
  $(id+'-count').textContent='×'+state.owned[id];
 }
 const purchasedSceneIds={intern:'intern-scene',snacks:'snack-tin',clockwork:'clockwork-scene',worms:'worm-farm',flock:'flock-scene',factory:'factory-scene',buffet:'buffet-scene',union:'union-scene',inspection:'inspection-scene',seesaw:'seesaw-scene',staircase:'staircase-scene',carousel:'carousel-scene',conga:'conga-scene'};
 for(const [index,{u}] of rows.entries()){const cardId=purchasedSceneIds[u.id];if(cardId){const card=$(cardId);card.style.order=index;$('workplace').append(card);}}
 $('workplace').hidden=!['intern','snacks','flock','factory','clockwork','worms','buffet','union','inspection','seesaw','staircase','carousel','conga'].some(id=>state.owned[id]>0);
 drawKiwi?.setPolish(state.owned.beak>0);

 }
 text('balance',fmt(state.balance));text('floating-balance',fmt(state.balance));text('power',fmt(power(state)));text('rate',fmt(rate(state)));$('rate-stat').hidden=rate(state)===0;
 let nextLockShown=false;
 for(const [gate,lock] of locks){const open=state.total>=gate||rows.some(({u})=>unlockAt(u)===gate&&state.owned[u.id]>0);lock.hidden=open||nextLockShown;if(!open)nextLockShown=true;}
 for(const {u,row,owned,button} of rows){row.hidden=!unlocked(state,u);const ownedLabel=`Owned: ${state.owned[u.id]}`,priceLabel=`${fmt(cost(state,u))} pecks`;if(owned.textContent!==ownedLabel)owned.textContent=ownedLabel;if(button.textContent!==priceLabel)button.textContent=priceLabel;button.disabled=state.balance<cost(state,u)||state.owned[u.id]>=1000;const label=`Buy ${u.name} for ${fmt(cost(state,u))} pecks`;if(button.getAttribute('aria-label')!==label)button.setAttribute('aria-label',label);}
}
function save(){state.savedAt=Date.now();try{localStorage.setItem(KEY,JSON.stringify(state));storageOK=true;}catch{storageOK=false;}$('save-status').textContent=storageOK?'':'Browser saving is unavailable. Progress lasts only for this session.';}
// A continuous mesh bends the neck while keeping the body and feet anchored.
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const pivot={x:900,y:450},tip={x:1464,y:624},surfaceY=710;
const drawKiwi=createKiwiMotion($('kiwi-canvas'));
const drawIntern=createKiwiMotion($('intern-canvas'),{shared:true});
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
// Interleave the two rows on an offbeat rhythm over a two-second phrase.
const flockRhythm=[0,250,375,750,1000,1250,1375];
const flockHelpers=Array.from({length:14},(_,index)=>(flockRhythm[index%7]+Math.floor(index/7)*125)%2000).map((phase,index)=>{
 const art=$('intern-art').cloneNode(true);art.id='flock-art-'+index;
 art.querySelectorAll('.motion-frame').forEach(frame=>frame.remove());
 for(const element of art.querySelectorAll('[id]')){element.id+='-flock-'+index;}
 for(const element of art.querySelectorAll('[clip-path]'))element.setAttribute('clip-path',`url(#intern-button-front-flock-${index})`);
 art.classList.remove('motion-ready');
 const row=Math.floor(index/7),position=index%7,depth=.66**position;
 art.style.width=`${36*depth}%`;
 art.style.left=`${row===0?3+43*(1-depth):61-15*(1-depth)}%`;
 art.style.top=`${5+30*depth}%`;art.style.zIndex=7-position;
 if(row===1)art.style.transform='scaleX(-1)';
 $('flock-row').append(art);
 return {phase,draw:createKiwiMotion(art.querySelector('canvas'),{shared:true}),cap:art.querySelector('[id^="intern-plunger"]'),lines:art.querySelector('[id^="intern-action-lines"]'),last:-1};
});
let internFrame=0,lastInternAmount=-1,lastHelperFrame=-Infinity;
const visibleScenes=new Set();
const sceneObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting)visibleScenes.add(entry.target.id);else visibleScenes.delete(entry.target.id);}});
for(const id of ['intern-scene','flock-scene'])sceneObserver.observe($(id));
function animateIntern(now){
 internFrame=requestAnimationFrame(animateIntern);
 if(document.hidden||now-lastHelperFrame<1000/30)return;
 lastHelperFrame=now;
 for(const helper of flockHelpers){
  const elapsed=(now-helper.phase+2000)%2000;
  const amount=state.owned.flock>0&&visibleScenes.has('flock-scene')&&!reducedMotion.matches&&!document.hidden&&elapsed<220?peckAmount(elapsed/220):0;
  if(helper.last!==amount){helper.draw?.(amount);helper.last=amount;const travel=buttonTravel(amount);helper.cap.setAttribute('transform',`translate(0 ${travel/.32})`);helper.lines.setAttribute('opacity',travel>1?'1':'0');}
 }

 if(state.owned.intern>0&&visibleScenes.has('intern-scene')&&!reducedMotion.matches&&drawIntern&&!document.hidden){
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
}
internFrame=requestAnimationFrame(animateIntern);

let animationFrame=0,queuedPeck=false;
function pose(amount){
 const depression=buttonTravel(amount);
 drawKiwi?.(amount);
 $('beak-accessories').setAttribute('transform',`translate(0 ${20*amount}) rotate(${9*amount} 900 450)`);
 $('button-plunger').setAttribute('transform',`translate(0 ${depression/(.32*(state.owned.large>0?(state.owned.double>0?1.1:1.35):1))})`);
 $('second-plunger').setAttribute('transform',`translate(0 ${depression/(.32*(state.owned.large>0?(state.owned.double>0?1.1:1.35):1))})`);
 $('button-linkage').setAttribute('transform',`translate(0 ${depression})`);
 $('contact-spark').setAttribute('opacity',depression>1?'1':'0');
 $('contact-spark').setAttribute('transform',`translate(0 ${depression})`);

}
function animatePress(){
 if(!drawKiwi){pose(0);return;}
 if(animationFrame){queuedPeck=true;return;}
 let started=null;

 function frame(now){
  if(started===null)started=now;
  const t=Math.min(1,(now-started)/220);
  pose(peckAmount(t));
  if(t<1){animationFrame=requestAnimationFrame(frame);}
  else{pose(0);animationFrame=0;if(queuedPeck){queuedPeck=false;animatePress();}}
 }
 animationFrame=requestAnimationFrame(frame);
}
let last=Date.now();
function settle(){const now=Date.now();earn(state,rate(state)*Math.max(0,Math.min(28800,(now-last)/1000)));last=now;}
$('peck').addEventListener('click',()=>{settle();earn(state,power(state));animatePress();render();});
$('reset').addEventListener('click',()=>$('reset-dialog').showModal());$('cancel-reset').addEventListener('click',()=>$('reset-dialog').close());$('confirm-reset').addEventListener('click',()=>{state=fresh();last=Date.now();clearTimeout(purchaseTimer);$('purchase-toast').hidden=true;purchaseTarget=null;if(animationFrame)cancelAnimationFrame(animationFrame);animationFrame=0;queuedPeck=false;pose(0);$('empire-finale').classList.remove('celebrate');stopCelebration();$('reset-dialog').close();render();save();});
window.addEventListener('resize',()=>{sceneSignature='';render();});
setInterval(()=>{if(!document.hidden){settle();render();}},250);setInterval(()=>{if(!document.hidden){settle();save();}},5000);
document.addEventListener('visibilitychange',()=>{settle();render();save();});window.addEventListener('pagehide',()=>{settle();save();});
render();save();
const balanceObserver=new IntersectionObserver(([entry])=>{
 $('floating-pecks').hidden=entry.isIntersecting||entry.boundingClientRect.bottom>=0;
});
balanceObserver.observe($('balance'));

startUpgradePreviews(reducedMotion);
