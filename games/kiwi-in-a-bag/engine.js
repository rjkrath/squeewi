export const SAVE_KEY = 'squeewi:kiwi-in-a-bag:v1';
export const treasures = ['sock', 'crumbs', 'worm', 'tiny bag'];
export const bags = [{x:230,y:390,type:'empty'}, {x:480,y:390,type:'slide'}, {x:740,y:390,type:'rummage'}];
export const roomNames = {'-1':'The quiet corner',0:'The sitting room',1:'The play room'};
export const stations = [{id:'tiny',x:230,y:440,room:-1},{id:'peek',x:500,y:440,room:-1},{id:'nap',x:770,y:440,room:-1},{id:'tunnel',x:230,y:440,room:1},{id:'pounce',x:500,y:440,room:1},{id:'share',x:770,y:440,room:1}];
export function stationAt(x,y,room=0){return stations.find(s=>s.room===room&&Math.abs(x-s.x)<105&&y>s.y-90&&y<s.y+38)||null;}
export function travel(s,direction){const next=s.room+direction;if(![-1,0,1].includes(next)||busy(s))return '';if(s.activity)leave(s);s.room=next;s.x=direction<0?850:150;s.y=440;return roomNames[next]+'. A few more bags to try.';}
export function cameraTravel(s,direction){if(![-1,0,1].includes(s.room+direction))return '';if(s.activity)leave(s);s.mode='free';const message=travel(s,direction);s.mode='entering';s.elapsed=0;s.entryDirection=direction;s.entryStart=direction>0?-40:1040;s.entryEnd=s.x;s.x=s.entryStart;return message;}
export const antics = {tiny:{label:'Too-small bag',duration:5},peek:{label:'Peekaboo',duration:6},tunnel:{label:'Bag tunnel',duration:4},pounce:{label:'Crinkle pounce',duration:4},nap:{label:'Bag nap',duration:5},share:{label:'Two kiwis, one bag',duration:6.4}};
export const leftBagScales = {tiny:.45,peek:.6,nap:.7};
export function tinyPose(t){if(t<1)return {phase:'approach',x:380+70*t,y:455};if(t<1.85){const p=(t-1)/.85;return {phase:'hop',x:450+50*p,y:455-85*p-125*Math.sin(p*Math.PI)};}const p=Math.min(1,(t-1.85)/2);return {phase:p<1?'squeeze':'settled',x:500,y:370+20*p+14*Math.sin(p*5*Math.PI)*(1-p),inside:true};}
export function peekPose(t){return {phase:t<1.2?'approach':t<1.95?'hop':'peek',inside:t>=1.95,hole:Math.floor(Math.max(0,t-1.95)/1.15)%3};}
export function sharePose(t){return {phase:t<1?'approach':t<2.4?'sniff':t<4?'friend-approach':t<4.55?'friend-hop':t<4.7?'surprise':t<5.3?'first-hop':'settle',friendVisible:t>=2.4&&t<4.55,firstVisible:t<5.3};}
export function play(s,id){if(!antics[id])return '';s.room=stations.find(b=>b.id===id).room;s.activity=id;s.elapsed=0;s.mode='playing';s.x=500;s.y=440;return {tiny:'Surely you can fit in this one.',peek:'Hop inside, then see who is peeking out.',tunnel:'Three bags in a row. Ready?',pounce:'Was that a rustle?',nap:'Finding just the right sleeping spot.',share:'Sniff, sniff. What is in this bag?'}[id];}
export function leave(s){const station=stations.find(b=>b.id===s.activity);s.activity=null;s.mode='free';s.x=station?station.x-90:500;s.y=480;}
export function fresh(){return {version:1,room:0,x:110,y:430,mode:'free',slideBagX:480,slideStart:480,elapsed:0,rummage:0,slid:false,hopped:false,found:[],played:[],activity:null};}
export function restore(raw){try{const a=JSON.parse(raw);if(a?.version!==1)return fresh();const s=fresh();s.room=[-1,0,1].includes(a.room)?a.room:0;if(s.room!==0){s.x=500;s.y=480;}s.slid=a.slid===true;s.hopped=a.hopped===true;s.found=Array.isArray(a.found)?[...new Set(a.found.filter(x=>treasures.includes(x)))]:[];s.played=Array.isArray(a.played)?[...new Set(a.played.filter(id=>Object.hasOwn(antics,id)))]:[];return s;}catch{return fresh();}}
export function serialize(s){return JSON.stringify({version:1,room:s.room,slid:s.slid,hopped:s.hopped,found:s.found,played:s.played});}
export function bagSpot(s,b){return b.type==='slide'?{...b,x:s.slideBagX,y:440}:b;}
export function busy(s){return ['runup','running','sliding','rummaging','playing','entering'].includes(s.mode);}
export function near(s){if(s.room!==0)return null;return bags.map(b=>bagSpot(s,b)).find(b=>Math.hypot(s.x-b.x,s.y-b.y)<105)||null;}
export function discover(s,name){if(!s.found.includes(name))s.found.push(name);}
export function interact(s){
 if(s.mode==='resting'){leave(s);return 'Back to the bags. What next?';}
 if(s.mode==='wearing'){s.mode='free';return 'Off it goes. A kiwi again.';}
 if(s.mode==='inside'){s.mode='wearing';return 'The bag came with you! Tap the kiwi to shake it off.';}
 if(busy(s))return '';
 const b=near(s);if(!b)return 'Tap a bag and the kiwi will walk over.';
 if(b.type==='empty'){s.mode='inside';s.hopped=true;s.x=b.x;s.y=b.y;return 'Hop! Tap the floor to waddle, or tap the bag to hop out.';}
 if(b.type==='slide'){s.mode='runup';s.elapsed=0;s.slideStart=s.slideBagX;s.runFrom=s.x;s.y=440;return 'A little room for a running start…';}
 s.mode='rummaging';s.rummage=0;s.x=b.x-75;s.y=b.y+15;return 'What is tucked in here?';
}
export function advance(s,dt){
 if(s.mode==='entering'){s.elapsed=Math.min(.45,s.elapsed+dt);const t=s.elapsed/.45;s.x=s.entryStart+(s.entryEnd-s.entryStart)*(1-(1-t)**2);if(t===1)s.mode='free';return '';}
 if(s.mode==='playing'){s.elapsed=Math.min(antics[s.activity].duration,s.elapsed+dt);if(s.elapsed>=antics[s.activity].duration){if(!s.played.includes(s.activity))s.played.push(s.activity);s.mode='resting';return {tiny:'A perfect fit. According to the kiwi.',peek:'Beak, eye, beak. You found every hole.',tunnel:'Through all three! The last bag came along.',pounce:'Pounce. One very flat bag.',nap:'Comfortable at last. A quiet little nap.',share:'Two kiwis. Four feet. One rather full bag.'}[s.activity];}return '';}
 if(['runup','running','sliding'].includes(s.mode)){
  s.elapsed+=dt;
  const start=s.slideStart,runX=235;
  if(s.mode==='runup'){
   const t=Math.min(1,s.elapsed/.8);s.x=s.runFrom+(runX-s.runFrom)*t;s.slideBagX=start+(480-start)*t;
   if(t===1){s.mode='running';s.elapsed=0;s.slideStart=480;return 'Go, kiwi, go!';}
  }else if(s.mode==='running'){
   const t=Math.min(1,s.elapsed/.45);s.x=runX+125*t*t;
   if(t===1){s.mode='sliding';s.elapsed=0;return 'Whoosh!';}
  }else{
   const t=Math.min(1,s.elapsed/1.15),distance=Math.min(145,790-start);
   s.slideBagX=start+distance*(1-(1-t)**3);s.x=s.slideBagX-90;
   if(t===1){s.slid=true;s.mode='free';s.x=s.slideBagX+65;return 'A very good slide. Tap the bag for another run.';}
  }
 }
 if(s.mode==='rummaging'){
  s.rummage=Math.min(1,s.rummage+dt*.8);
  if(s.rummage>=1){treasures.forEach(name=>discover(s,name));s.mode='free';return 'A tiny bag! Inside: a sock, crumbs, and one comfortable worm.';}
 }
 return '';
}
export function move(s,dx,dy,dt){
 if(busy(s)||s.mode==='resting')return;
 const speed=s.mode==='wearing'?88:s.mode==='inside'?105:170;
 const len=Math.hypot(dx,dy)||1;
 s.x=Math.max(70,Math.min(930,s.x+dx/len*speed*dt));
 s.y=Math.max(305,Math.min(505,s.y+dy/len*speed*dt));
 if(s.y>385&&s.y<495){if(s.x<=80&&dx<0)return travel(s,-1);if(s.x>=920&&dx>0)return travel(s,1);}
}
