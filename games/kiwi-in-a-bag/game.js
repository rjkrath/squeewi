import {fresh,restore,serialize,SAVE_KEY,bags,near,interact,move,advance,bagSpot,busy,antics,play,leave,stations,stationAt,travel,roomNames,cameraTravel,sharePose,peekPose,leftBagScales,tinyPose} from './engine.js';
const $=id=>document.getElementById(id),canvas=$('scene'),ctx=canvas.getContext('2d');
let state=fresh(),storage=true,heard=false,audio=null,target=null,time=0,last=0,moving=false,hop=0;
try{state=restore(localStorage.getItem(SAVE_KEY));}catch{storage=false;}
const keys=new Set(), reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const names={sock:'A very soft sock',crumbs:'Three biscuit crumbs',worm:'A comfortable worm','tiny bag':'A bag inside a bag'};
const icons={sock:'🧦',crumbs:'· • ·',worm:'〰','tiny bag':'▱'};
function save(){try{localStorage.setItem(SAVE_KEY,serialize(state));}catch{storage=false;} $('save-note').textContent=storage?'Saved in this browser.':'Storage unavailable. Playing for this visit.';}
function say(text){if(text)$('message').textContent=text;}
function update(){
 $('room-label').textContent=roomNames[state.room];
 $('walk-left').hidden=state.room===-1;
 $('walk-right').hidden=state.room===1;
 const completed=[state.hopped,state.slid,state.found.includes('tiny bag')];
 for(const [i,button] of [...document.querySelectorAll('[data-bag]')].entries()){
  button.disabled=busy(state)&&!state.activity;
  button.classList.toggle('done',completed[i]);
 }
 $('antics-count').textContent=(state.played.length+completed.filter(Boolean).length)+' / 9 tried';
 for(const b of document.querySelectorAll('[data-antic]')){b.setAttribute('aria-pressed',String(state.activity===b.dataset.antic));b.classList.toggle('done',state.played.includes(b.dataset.antic));}
 $('activity-controls').hidden=!state.activity;
 $('again').disabled=state.mode==='playing';
 $('count').textContent=state.found.length+' / 4';
 $('finds').replaceChildren(...Object.keys(names).map(n=>{const d=document.createElement('div');d.className='find'+(state.found.includes(n)?'':' missing');const icon=document.createElement('span');icon.className='icon';icon.textContent=state.found.includes(n)?icons[n]:'○';const label=document.createElement('span');label.textContent=state.found.includes(n)?names[n]:'Still tucked away';d.append(icon,label);return d;}));
 document.querySelector('[data-bag="0"]').textContent=state.mode==='inside'?'Hop out':state.mode==='wearing'?'Shake it off':'Hop in';
 document.querySelector('[data-bag="1"]').textContent='Run & slide';
}
function crinkle(){if(!heard)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();audio.resume();const b=audio.createBuffer(1,audio.sampleRate*.18,audio.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2);const src=audio.createBufferSource(),filter=audio.createBiquadFilter(),gain=audio.createGain();src.buffer=b;filter.type='highpass';filter.frequency.value=900;gain.gain.value=.13;src.connect(filter).connect(gain).connect(audio.destination);src.start();}catch{heard=false;$('sound').textContent='Sound unavailable';}}
function act(){const nearby=stations.find(s=>s.room===state.room&&Math.hypot(state.x-s.x,state.y-s.y)<85);const original=near(state);if(state.mode==='free'&&nearby&&(!original||Math.hypot(state.x-nearby.x,state.y-nearby.y)<Math.hypot(state.x-original.x,state.y-original.y))){startAntic(nearby.id);return;}target=null;say(interact(state));hop=time;crinkle();update();save();canvas.focus({preventScroll:true});}
function chooseBag(index){
 if(state.activity){leave(state);target=null;}
 if(busy(state))return;
 if(index===0&&(state.mode==='inside'||state.mode==='wearing')){act();return;}
 if(state.mode==='inside')interact(state);
 if(state.mode==='wearing'){say(interact(state));hop=time;}
 state.room=0;const b=bagSpot(state,bags[index]);
 target={x:b.x,y:b.y+45,bag:index};
 say('On your way…');
 update();canvas.focus({preventScroll:true});
}
function cameraExit(direction){target=null;keys.clear();const message=cameraTravel(state,direction);if(!message)return;if(reduced)advance(state,.45);say(message);update();save();canvas.focus({preventScroll:true});}
 $('walk-left').onclick=()=>cameraExit(-1);$('walk-right').onclick=()=>cameraExit(1);
 for(const button of document.querySelectorAll('[data-bag]'))button.onclick=()=>chooseBag(Number(button.dataset.bag));
function beginAntic(id){target=null;keys.clear();say(play(state,id));hop=-10;crinkle();update();}
function startAntic(id){
 const station=stations.find(s=>s.id===id);if(!station)return;
 if(state.activity)leave(state);if(busy(state))state.mode='free';
 if(state.room!==station.room){state.room=station.room;state.x=150;state.y=440;}
 const offsets={tiny:-72,peek:-114,tunnel:-129,pounce:-144,nap:0,share:-120};
 keys.clear();target={x:station.x+offsets[id],y:station.y+(id==='nap'?11:0),antic:id};
 say('On your way…');update();canvas.focus({preventScroll:true});
}
 for(const button of document.querySelectorAll('[data-antic]'))button.onclick=()=>startAntic(button.dataset.antic);
 $('again').onclick=()=>{const id=state.activity;leave(state);startAntic(id);};
 $('leave-activity').onclick=()=>{leave(state);target=null;say('Back to the bags. What next?');update();save();canvas.focus({preventScroll:true});};
 $('sound').onclick=()=>{heard=!heard;$('sound').textContent=heard?'Sound on':'Sound off';$('sound').setAttribute('aria-pressed',String(heard));crinkle();};
$('reset').onclick=()=>{$('reset-dialog').showModal();keys.clear();target=null;};
$('cancel-reset').onclick=()=>$('reset-dialog').close();
$('confirm-reset').onclick=()=>{state=fresh();save();update();say('A fresh afternoon. Nine bags await.');$('reset-dialog').close();canvas.focus();};
const controls=['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'];
window.addEventListener('keydown',e=>{if($('reset-dialog').open||e.target instanceof HTMLButtonElement)return;const k=e.key.toLowerCase();if(controls.includes(k)){e.preventDefault();keys.add(k);target=null;}if((k===' '||k==='e')&&!e.repeat){e.preventDefault();if(state.mode!=='free'||near(state)||stations.some(s=>s.room===state.room&&Math.hypot(state.x-s.x,state.y-s.y)<85))act();else if(state.room!==0){const closest=stations.filter(s=>s.room===state.room).sort((a,b)=>Math.hypot(state.x-a.x,state.y-a.y)-Math.hypot(state.x-b.x,state.y-b.y))[0];startAntic(closest.id);}else chooseBag(bags.reduce((best,b,i)=>Math.hypot(state.x-b.x,state.y-b.y)<Math.hypot(state.x-bags[best].x,state.y-bags[best].y)?i:best,0));}});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>{keys.clear();target=null;});
document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();save();}});
window.addEventListener('pagehide',save);
canvas.addEventListener('pointerdown',e=>{
 if($('reset-dialog').open)return;
 const previousActivity=state.activity;
 if(state.activity){leave(state);update();}
 canvas.focus({preventScroll:true});const r=canvas.getBoundingClientRect();
 const p={x:(e.clientX-r.left)*1000/r.width,y:(e.clientY-r.top)*600/r.height};
 if(p.y>375&&p.y<500&&p.x<90&&state.room>-1){cameraExit(-1);return;}
 if(p.y>375&&p.y<500&&p.x>910&&state.room<1){cameraExit(1);return;}
 if(busy(state)&&!state.activity)return;
 if((state.mode==='inside'||state.mode==='wearing')&&Math.abs(p.x-state.x)<80&&p.y>state.y-140&&p.y<state.y+45){act();return;}
 const hit=state.room!==0?-1:bags.map(b=>bagSpot(state,b)).findIndex(b=>p.x>b.x-(b.type==='slide'?145:80)&&p.x<b.x+80&&p.y>b.y-140&&p.y<b.y+45);
 const tunnel=stations.find(s=>s.id==='tunnel');
 if(previousActivity==='tunnel'&&Math.abs(p.x-(tunnel.x+180))<65&&Math.abs(p.y-tunnel.y)<55){startAntic('tunnel');return;}
 const station=stationAt(p.x,p.y,state.room);
 if(station){startAntic(station.id);}
 else if(hit>=0)chooseBag(hit);
 else if(p.y>=280)target={x:Math.max(70,Math.min(930,p.x)),y:Math.max(305,Math.min(505,p.y))};
});
function path(points,fill,stroke){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}}
function ellipse(x,y,rx,ry,color){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
function line(x,y,xx,yy,color,width=2){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();}
function text(t,x,y,size=15,color='#73634b'){ctx.fillStyle=color;ctx.font=`${size}px Trebuchet MS, sans-serif`;ctx.textAlign='center';ctx.fillText(t,x,y);}
function bag(x,y,type,scale=1,angle=0,inhabited=false){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(scale,scale);const bulge=inhabited?(reduced?5:Math.sin(time*7)*4+7):0;
 ellipse(0,13,66+bulge,13,'#483c2920');
 path([[-53,-112],[42,-119],[61+bulge,-55],[61,-20],[47,8],[-51,8],[-64,-18],[-64-bulge,-55]],'#b98d55','#947043');
 path([[42,-119],[61,-20],[47,8],[29,-7],[25,-102]],'#a17a47');
 path([[-53,-112],[-43,-8],[-51,8],[-64,-18]],'#c89f65');
 path([[-53,-112],[-24,-127],[42,-119],[25,-102],[-28,-101]],'#ddbb82','#947043');
 path([[-39,-111],[-22,-119],[27,-113],[17,-105],[-26,-106]],'#584633');
 line(-42,-87,-35,-25,'#d6af73');line(-35,-25,-47,-5,'#a67d48');line(25,-92,33,-25,'#896840');line(-28,-3,24,-3,'#d6ac71');
 if(type==='rummage'){path([[-25,-70],[14,-73],[15,-41],[-25,-38]],'#d8b378');text('?',-5,-49,23,'#98703e');}
 if(inhabited){line(-29,-57,-14,-49,'#a67d48');line(-14,-49,-24,-37,'#d9b77f');if(moving&&!reduced){line(-79,-68,-88,-75,'#9b855f');line(77,-56,86,-62,'#9b855f');}ellipse(-20,12,9,5,'#b78a52');ellipse(20,12,9,5,'#b78a52');line(-22,11,-33,16,'#ad8048',3);line(18,11,30,16,'#ad8048',3);}
 ctx.restore();}
function kiwi(x,y,dir=1){const wobble=moving&&!reduced?Math.sin(time*13):0;const bounce=!reduced&&time-hop<.5?Math.sin((time-hop)*Math.PI*2)*16:0;ellipse(x,y+12,41,10,'#453d3022');ctx.save();ctx.translate(x,y-Math.abs(wobble)*4-bounce);ctx.scale(dir,1);ctx.rotate(wobble*.025);
 line(-12,6,-17,17,'#ae7d42',5);line(9,6,14,17,'#ae7d42',5);line(-17,17,-30,18,'#ae7d42',3);line(14,17,27,18,'#ae7d42',3);
 ellipse(-3,-23,39,37,'#73573d');ellipse(-10,-25,31,31,'#8c6c49');ellipse(20,-42,24,24,'#96754e');ellipse(19,-44,19,18,'#a07f56');
 path([[36,-42],[90,-30],[39,-34]],'#ceac76','#a68554');
 if(time%5.1<.13){line(24,-47,32,-47,'#2d2b22',2);}else{ellipse(28,-47,4,5,'#2d2b22');ellipse(29,-49,1.4,1.5,'#fff9e4');}
 for(let i=0;i<18;i++){const a=i*2.4;line(-10+Math.cos(a)*25,-26+Math.sin(a)*25,-14+Math.cos(a)*29,-29+Math.sin(a)*29,'#ac8b6055',1.5);}
 line(-33,-36,-45,-40,'#806040');line(-30,-39,-38,-49,'#806040');
 ctx.restore();}
function sock(x,y){ctx.save();ctx.translate(x,y);ctx.rotate(-.3);path([[-13,-30],[8,-30],[8,0],[28,5],[29,17],[3,20],[-13,8]],'#8d9b83','#6f8068');line(-12,-22,8,-22,'#b8c3a8',4);ctx.restore();}
function worm(x,y){ctx.beginPath();ctx.moveTo(x-22,y);ctx.bezierCurveTo(x-5,y-19,x+3,y+15,x+22,y-3);ctx.strokeStyle='#bd7d77';ctx.lineWidth=8;ctx.lineCap='round';ctx.stroke();ctx.lineCap='butt';ellipse(x+21,y-5,1.5,1.5,'#494334');}
function room(){
 ctx.fillStyle=state.room===-1?'#e5e7d8':state.room===1?'#ece0cf':'#e9e3d3';ctx.fillRect(0,0,1000,600);ctx.fillStyle='#dad0b8';ctx.fillRect(0,280,1000,320);
 for(let y=295;y<600;y+=54){line(0,y,1000,y,'#cbbfa633',1);for(let x=(y%108)*3;x<1000;x+=270)line(x,y,x,y+54,'#cbbfa633',1);}
 ctx.fillStyle='#bdb599';ctx.fillRect(0,269,1000,12);ctx.fillStyle='#f6f0de';ctx.fillRect(0,263,1000,6);
 // Daylight, curtain, and a plant.
 ctx.fillStyle='#c9c1a8';ctx.fillRect(115,40,190,176);ctx.fillStyle='#f8f4df';ctx.fillRect(122,47,176,160);ctx.fillStyle='#cedac6';ctx.fillRect(132,57,156,138);
 path([[132,156],[177,128],[214,153],[250,139],[288,160],[288,195],[132,195]],'#aebda2');
 line(210,52,210,202,'#f7f1df',8);line(125,125,296,125,'#f7f1df',8);
 path([[105,38],[132,38],[133,228],[105,221]],'#b9bea0');path([[289,38],[316,38],[319,221],[290,228]],'#b9bea0');
 path([[136,280],[310,280],[470,600],[55,600]],'#f4e9c344');
 ctx.fillStyle='#827b5e';ctx.fillRect(845,183,5,94);ellipse(835,198,25,10,'#7f9570');ellipse(861,175,26,10,'#8c9e79');ellipse(837,159,22,10,'#9aa782');path([[817,234],[875,234],[865,279],[827,279]],'#b98065');
 // Woven rug.
 ellipse(474,436,365,115,'#abb299');ellipse(474,436,351,104,'#bdc3aa');ctx.save();ctx.beginPath();ctx.ellipse(474,436,347,100,0,0,Math.PI*2);ctx.clip();for(let x=100;x<850;x+=13)line(x,325,x,552,'#8e9c7f22',1);for(let y=337;y<550;y+=9)line(90,y,855,y,'#e1e3c933',2);ctx.restore();
 // Low shelf and framed drawing.
 ctx.fillStyle='#b79b73';ctx.fillRect(446,219,255,14);ctx.fillRect(466,232,10,47);ctx.fillRect(676,232,10,47);
 ctx.fillStyle='#d2bb93';ctx.fillRect(485,163,65,56);ctx.fillStyle='#eee6d2';ctx.fillRect(490,168,55,46);ellipse(516,192,15,12,'#948569');path([[529,189],[542,195],[529,195]],'#bea47e');
 ctx.fillStyle='#b9ab87';ctx.fillRect(588,199,75,20);line(596,205,655,205,'#e5d6b3',2);
 drawStations();drawCarets();
 const occupied=state.mode==='inside';
 for(const original of state.room===0?bags:[]){const b=bagSpot(state,original);if(b.type==='empty'&&occupied)continue;
  if(b.type==='slide'){bag(b.x,b.y,'slide',.8,-Math.PI/2);if(state.mode==='sliding'){ellipse(b.x-97,b.y+18,9,5,'#b78a52');ellipse(b.x-98,b.y-18,9,5,'#b78a52');if(!reduced){line(b.x-142,b.y-15,b.x-172,b.y-15,'#b09f7e');line(b.x-145,b.y+10,b.x-190,b.y+10,'#b09f7e');}}}
  else bag(b.x,b.y,b.type,1,b.type==='rummage'&&state.mode==='rummaging'&&!reduced?Math.sin(time*22)*.05:0);
 }
 if(state.room===0&&state.mode==='rummaging'&&state.rummage>.4)bag(743,300-(state.rummage-.4)*70,'empty',.35,-.2);
 else if(state.room===0&&state.found.includes('tiny bag'))bag(805,440,'empty',.35,.15);
 if(occupied)bag(state.x,state.y,'empty',1, moving&&!reduced?Math.sin(time*9)*.08:0,true);
 else if(state.mode!=='sliding'&&!state.activity){kiwi(state.x,state.y,facing);if(state.mode==='wearing')bag(state.x+15,state.y-25,'empty',.58,.35+(!reduced?Math.sin(time*12)*.07:0));}
 if(state.mode==='free'){for(const [i,original]of (state.room===0?bags:[]).entries()){const b=bagSpot(state,original);text(['Hop in','Run & slide','Peek inside'][i],b.x,b.y+38,18);}}
 const b=near(state);if(b&&state.mode==='free'){ctx.strokeStyle='#fbf7e7';ctx.lineWidth=2;ctx.setLineDash([4,6]);ctx.beginPath();ctx.ellipse(b.x,b.y+15,80,27,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
}
function drawCarets(){for(const direction of [-1,1]){if(state.room+direction<-1||state.room+direction>1)continue;const x=direction<0?40:960;ellipse(x,440,26,30,'#f8f2e3');line(x-direction*7,428,x+direction*7,440,'#667958',4);line(x+direction*7,440,x-direction*7,452,'#667958',4);}}
function drawStations(){
 for(const station of stations.filter(s=>s.room===state.room)){
  const {id,x,y}=station;
  if(state.activity===id){ctx.save();ctx.translate(x,y);const scale=.6;ctx.scale(scale,scale);ctx.translate(-500,-455);drawAntic();ctx.restore();}
  else if(id==='tunnel'){for(const offset of [-60,0,60])bag(x+offset,y,'slide',.4,-Math.PI/2);}
  else if(id==='tiny')bag(x,y,'empty',leftBagScales.tiny);
  else if(id==='peek'){ctx.save();ctx.translate(x,y);ctx.scale(.6,.6);ctx.translate(-500,-455);drawPeekBag();ctx.restore();}
  else if(id==='nap'){bag(x,y,'empty',leftBagScales.nap);}
  else if(id==='share')bag(x,y,'empty',.85);
  else{bag(x,y,'empty',.7);line(x-65,y-70,x-78,y-80,'#9b855f');line(x+58,y-60,x+70,y-70,'#9b855f');}
  text(antics[id].label,x,y+35,17);
 }
}
const peekHoles=[[467,385],[525,410],[508,344]];
function drawPeekBag(){bag(500,455,'empty',leftBagScales.peek/.6);for(const [x,y] of peekHoles)ellipse(x,y,12,11,'#584633');}
function drawAntic(){
 const actor=(x,y,dir)=>{ctx.save();ctx.translate(x,y);ctx.scale(1/.6,1/.6);kiwi(0,0,dir);ctx.restore();};
 const id=state.activity,t=reduced?antics[state.activity].duration:state.elapsed,rest=state.mode==='resting',wiggle=reduced?0:Math.sin(time*16),clamp=(v)=>Math.max(0,Math.min(1,v));

 if(id==='tiny'){
  const pose=tinyPose(t);
  bag(500,455,'empty',leftBagScales.tiny/.6);
  if(pose.phase==='approach'||pose.phase==='hop'){
   const wasMoving=moving;moving=pose.phase==='approach';actor(pose.x,pose.y,1);moving=wasMoving;
  }else{
   // The kiwi overflows the opening: its body stays full-size, never vanishes into the paper.
   ctx.save();ctx.beginPath();ctx.rect(360,180,290,181);ctx.clip();
   actor(pose.x+(reduced?0:wiggle*(pose.phase==='squeeze'?3:0)),pose.y,1);ctx.restore();
   line(470,360,481,355,'#ae7d42',5);line(516,357,530,361,'#ae7d42',5);
   line(465,361,476,362,'#ae7d42',3);line(526,361,537,359,'#ae7d42',3);
   line(466,363,521,363,'#ddbb82',3);
  }
 }
 if(id==='peek'){
  const pose=peekPose(t);drawPeekBag();
  if(pose.phase==='approach'){const wasMoving=moving;moving=true;actor(310+100*clamp(t/1.2),455,1);moving=wasMoving;}
  else if(pose.phase==='hop'){
   const p=clamp((t-1.2)/.75);const y=455-Math.sin(p*Math.PI)*160;
   ctx.save();if(p>.65){ctx.beginPath();ctx.rect(350,190,300,146);ctx.clip();}actor(410+90*p,y,1);ctx.restore();
  }else{
   const h=peekHoles[pose.hole];
   if(pose.hole===1){ellipse(h[0],h[1],7,8,'#a07f56');ellipse(h[0]+2,h[1],3,4,'#2d2b22');ellipse(h[0]+3,h[1]-2,1,1,'#fff');}
   else path([[h[0]-5,h[1]-5],[h[0]+53,h[1]+8],[h[0]-5,h[1]+3]],'#ceac76','#a68554');
  }
 }
 if(id==='tunnel'){
  const p=clamp(t/3.3),x=285+465*p;
  for(const bx of [400,500,600]){if(bx===600&&x>550)continue;bag(bx,455,'slide',.4/.6,-Math.PI/2);}
  if(x<290||x>410&&x<430){actor(x,455,1);}else if(x<550){ellipse(x-35,464,8,4,'#b78a52');}
  if(x>=550){bag(x+50,455,'slide',.4/.6,-Math.PI/2);ellipse(x-19,470,10,4,'#b78a52');ellipse(x-20,430,10,4,'#b78a52');}
 }
 if(id==='pounce'){
  if(t<1.8){bag(500,455,'empty',.7/.6,wiggle*.02);ctx.save();ctx.translate(260,455);ctx.scale(1, .8);actor(0,0,1);ctx.restore();}
  else if(t<2.5){const p=(t-1.8)/.7;bag(500,455,'empty',.7/.6);actor(260+240*p,455-(reduced?0:Math.sin(p*Math.PI)*110),1);}
  else{ctx.save();ctx.translate(500,455);ctx.scale(1,.18);bag(0,0,'empty',.7/.6,-.1);ctx.restore();actor(500,440,1);}
 }
 if(id==='nap'){
  if(t<2.4){bag(500,455,'empty',leftBagScales.nap/.6);actor(500+Math.sin(t*6)*60,455+Math.cos(t*6)*18,Math.cos(t*6)>0?1:-1);}
  else if(t<3.15){bag(500,455,'empty',leftBagScales.nap/.6);const p=(t-2.4)/.75;actor(500+Math.sin(2.4*6)*60*(1-p),455-Math.sin(p*Math.PI)*165,1);}
  else{const p=clamp((t-3.15)/1.2);bag(500,455,'empty',leftBagScales.nap/.6,p*Math.PI/2,true);text('z',550,360-(reduced?0:Math.sin(time)*5),24);text('z',570,338,16);}
 }
 if(id==='share'){
  const pose=sharePose(t),full=t>=5.3,secondInside=t>=4.55;
  const tip=clamp((t-5.3)/1.1)*.95;
  ctx.save();ctx.translate(500,455);ctx.rotate(tip);ctx.scale(1+.28*clamp((t-4.7)/.6),1);bag(0,0,'empty',.85/.6,secondInside&&!reduced?wiggle*.025:0,secondInside);
  if(full){ellipse(-38,16,8,4,'#b78a52');ellipse(38,16,8,4,'#b78a52');}ctx.restore();
  if(pose.firstVisible){
   let x=300+95*clamp(t),y=455;
   if(t>=1&&t<4.7){x=395+(reduced?0:Math.sin(t*7)*5);y=455-(reduced?0:Math.sin(t*7)*3);}
   if(t>=4.7){const p=clamp((t-4.7)/.6);x=395+105*p;y=455-(reduced?0:Math.sin(p*Math.PI)*130);}
   const wasMoving=moving;moving=pose.phase==='approach';actor(x,y,1);moving=wasMoving;
   if(pose.phase==='sniff'&&!reduced){ellipse(486+Math.sin(t*6)*3,421,3,2,'#b09f7e77');ellipse(493,411,2,2,'#b09f7e55');}
  }
  if(pose.friendVisible){
   const p=clamp((t-2.4)/1.6);let x=1020-440*p,y=455;
   if(t>=4){const jump=clamp((t-4)/.55);x=580-80*jump;y=455-(reduced?0:Math.sin(jump*Math.PI)*145);}
   const wasMoving=moving;moving=t<4;actor(x,y,-1);moving=wasMoving;
  }
 }

}
let facing=1,stepNoise=0;
function frame(ms){time=ms/1000;const dt=Math.min(.04,last?(ms-last)/1000:0);last=ms;
 let dx=Number(keys.has('arrowright')||keys.has('d'))-Number(keys.has('arrowleft')||keys.has('a'));
 let dy=Number(keys.has('arrowdown')||keys.has('s'))-Number(keys.has('arrowup')||keys.has('w'));
 if(target){const dist=Math.hypot(target.x-state.x,target.y-state.y);if(dist<7){const pending=target.bag,antic=target.antic;target=null;if(antic)beginAntic(antic);else if(pending!==undefined)act();}else{dx=(target.x-state.x)/dist;dy=(target.y-state.y)/dist;}}
 const occupiedAction=busy(state);
 moving=!!(dx||dy)&&!$('reset-dialog').open&&!occupiedAction;if(moving){if(dx)facing=dx>0?1:-1;const message=move(state,dx,dy,dt);if(message){target=null;say(message);save();update();}if((state.mode==='inside'||state.mode==='wearing'||state.mode==='sliding')&&time-stepNoise>.3){crinkle();stepNoise=time;}}
 if(occupiedAction&&!$('reset-dialog').open){facing=state.mode==='entering'?state.entryDirection:state.mode==='runup'?-1:1;moving=state.mode==='runup'||state.mode==='running'||state.mode==='entering';const message=advance(state,dt);if(message){say(message);save();crinkle();}else if(time-stepNoise>.3){crinkle();stepNoise=time;}}
 ctx.clearRect(0,0,1000,600);room();updateAction();requestAnimationFrame(frame);
}
let previous='';function updateAction(){const current=[state.room,state.mode,state.activity,state.played.length,state.slid,near(state)?.type,state.found.length].join('|');if(current!==previous){previous=current;update();}}
update();save();requestAnimationFrame(frame);
