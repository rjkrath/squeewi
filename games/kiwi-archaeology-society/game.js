'use strict';
const $=s=>document.querySelector(s),canvas=$('#scene'),ctx=canvas.getContext('2d');
const W=1100,H=660,GROUND=477,WORLD=5520,KEY='kiwi-desert-expedition-v2';
const treasures=[
 ['Scarab of modest importance','Scarab','EGYPTIAN · UNCOMMON','scarab','A blue faience scarab. A symbol of renewal, protection, and being quite good at rolling things. Bean recognises a fellow logistics professional.','Circa a very long time ago. Still more organised than us.'],
 ['Cache of rubber chickens','Chickens ×5','ABSURD · SQUEAKING','chicken','Five rubber chickens, carefully sealed for the afterlife. The inscription translates loosely as “you never know”. Each chicken has to go on the cart.','Conservation method: do not squeeze. Bean has squeezed all five.'],
 ['Canopic snack jar','Canopic jar','EGYPTIAN-ISH · UNUSUAL','jar','A jackal-headed jar of impressive workmanship. This particular example contains one suspiciously recent biscuit.','The biscuit is not part of the accession. Apparently.'],
 ['The royal golden sandal','Gold sandal','EGYPTIAN · RARE','sandal','A golden sandal for a person with considerably more toes than Pip. The matching shoe is presumably in another museum.','One previous owner. Some sand.'],
 ['Emergency garden gnomes','Gnomes ×3','ABSURD · PREPARED','gnome','Three gnomes buried with a sign reading IN CASE OF GARDEN. No garden has been observed within several thousand waddles.','They look as surprised to be here as we are.'],
 ['Horus, carry-on edition','Horus','EGYPTIAN · RARE','horus','A small falcon statuette. Its wings are rather showy. Pip has classified this as an unnecessary design flourish.','Divine protection does not cover improper stacking.'],
 ['The ceremonial toaster','Toaster','ABSURD · ANACHRONISTIC','toaster','Two slots. No socket. Traces of toast indicate that somebody was making breakfast approximately four thousand years too early.','Crumb tray contains more archaeology.'],
 ['An extremely long scroll','Scroll','EGYPTIAN · UNCOMMON','scroll','A papyrus inventory detailing offerings of bread, linen, and one hundred and six ducks. The last line says “bring a bigger cart”.','The ancients had the same problem.'],
 ['Inflatable pharaoh','Pool pharaoh','ABSURD · BUOYANT','flamingo','A pink pool flamingo wearing a nemes headdress. Was it a sacred vessel? Was the Nile more fun than previously thought?','Inflation date disputed by all three reviewers.'],
 ['A perfectly ordinary sarcophagus','Sarcophagus','EGYPTIAN · MONUMENTAL','coffin','A magnificent gilded miniature sarcophagus. Pip knocked politely. Something inside knocked back, then asked for five more minutes.','Bean would prefer this at the bottom of the pile.'],
 ['The second chicken cache','Chickens ×4','ABSURD · INEVITABLE','chicken','Four more rubber chickens. Of course there are. Scholars now believe the first cache was merely the emergency reserve.','Our working theory is poultry.'],
 ['The improbable pyramid','Pyramid','EGYPTIAN-ISH · IMPOSSIBLE','pyramid','A pyramid the size of a picnic basket. Inside is a smaller pyramid. Inside that is a note saying “keep going”.','The note may also refer to the expedition.'],
 ['Royal bathroom plunger','Plunger','ABSURD · CEREMONIAL','plunger','An object of immense ritual significance, provided the ritual involved a blocked drain. A falcon is engraved on the handle.','The curator declines to demonstrate its use.'],
 ['Anubis, off duty','Anubis','EGYPTIAN · RARE','anubis','A seated jackal figure, guardian of the necropolis. Now also guardian of the precarious rubber chicken tower.','This is outside the original job description.'],
 ['The disco sun','Disco sun','ABSURD · RADIANT','disco','A mirrored sphere. A portable sun? A ritual object? Either way, the excavation has become significantly more festive.','Handle with care. Dance with abandon.'],
 ['The founding kiwi','Kiwi mask','IMPOSSIBLE · FAMILIAR','mask','A golden funerary mask with a very long beak. The inscription reads: PIP AND BEAN, DEPARTMENT OF LOST LUGGAGE. Beneath it: “YOU ARE LATE.”','The cart is nearly a monument. Bean still needs to tie it down.']
].map((f,i)=>({id:i,name:f[0],short:f[1],rarity:f[2],shape:f[3],desc:f[4],note:f[5],x:440+i*309,count:i===1?5:i===4?3:i===10?4:1}));
function svg(shape){const parts={
scarab:'<path d="M34 41L17 32M31 59L11 62M35 77L20 91M85 41L102 32M89 59L109 62M85 77L100 91" stroke="#967440" stroke-width="5"/><ellipse cx="60" cy="62" rx="30" ry="35" fill="#378f92" stroke="#d9b867" stroke-width="4"/><path d="M60 31V96M33 49Q60 61 87 49" fill="none" stroke="#a5d3be" stroke-width="3"/><ellipse cx="60" cy="27" rx="13" ry="9" fill="#32777c"/>',
chicken:'<path d="M46 65Q27 95 65 99Q88 96 73 67L73 40Q77 20 62 19Q47 18 51 41Z" fill="#f4c950" stroke="#c99b38" stroke-width="2"/><path d="M52 20Q46 4 54 8L60 14Q63 0 68 9L70 20M54 42L52 54 64 49" fill="#c9593d"/><path d="M72 30L89 37 73 43" fill="#e78b3e"/><circle cx="66" cy="28" r="3" fill="#453c30"/><path d="M45 69Q59 71 55 87M49 98L38 107M68 98L77 108" fill="none" stroke="#d7803a" stroke-width="5"/>',
jar:'<path d="M35 44Q18 88 36 103H85Q101 83 85 44Z" fill="#cda46c" stroke="#92754b" stroke-width="3"/><path d="M39 44L35 18 47 7 57 23 76 22 87 12 85 45Z" fill="#647978"/><path d="M40 27L70 27 91 37 62 40" fill="#8e9b88"/><circle cx="67" cy="29" r="3" fill="#343d36"/><path d="M32 68H90M33 89H89" stroke="#508f91" stroke-width="7"/>',
sandal:'<path d="M41 16Q82 1 87 36L80 97Q55 116 34 94L28 45Q28 25 41 16" fill="#d9b25d" stroke="#ae8339" stroke-width="3"/><path d="M60 24V57L35 80M60 57L82 78" fill="none" stroke="#f7da85" stroke-width="9"/><path d="M40 90Q59 100 76 89" fill="none" stroke="#a77636" stroke-width="2"/>',
gnome:'<path d="M33 59L60 8 85 59" fill="#c65c45"/><ellipse cx="59" cy="65" rx="22" ry="22" fill="#f4d8a4"/><path d="M37 68Q60 105 83 68L88 100H32Z" fill="#ebe3c7"/><circle cx="60" cy="65" r="8" fill="#dbac83"/><path d="M35 98L29 112H52L61 101 70 112H94L87 98" fill="#466a68"/>',
horus:'<path d="M37 100Q26 66 49 43L45 23Q67 2 80 25L79 46 94 100Z" fill="#477f88" stroke="#b8954d" stroke-width="4"/><path d="M72 24L99 34 78 41" fill="#e9c26e"/><circle cx="70" cy="23" r="3" fill="#f3dda1"/><path d="M50 51L45 87 69 71M77 53L83 87" fill="none" stroke="#80b1a7" stroke-width="3"/><path d="M31 104H101" stroke="#c5a059" stroke-width="8"/>',
toaster:'<rect x="15" y="42" width="90" height="57" rx="15" fill="#94b1af" stroke="#587d7e" stroke-width="3"/><path d="M30 46V26Q41 16 52 27V47M64 47V25Q77 15 88 26V47" fill="#dfb27b" stroke="#ad7d4e" stroke-width="4"/><path d="M27 98V109M88 98V109" stroke="#4b6664" stroke-width="6"/><path d="M96 60V84M89 71H106" stroke="#4c7274" stroke-width="4"/><path d="M29 60H66" stroke="#c9d8c4" stroke-width="5"/>',
scroll:'<path d="M30 19H89V93H31Z" fill="#e7ce91"/><path d="M28 19H91M27 95H93" stroke="#a47847" stroke-width="12" stroke-linecap="round"/><path d="M42 37H76M44 49L53 55 63 45 78 55M41 69H75M48 82H68" fill="none" stroke="#9f8152" stroke-width="3"/>',
flamingo:'<ellipse cx="51" cy="78" rx="38" ry="21" fill="#e7988e"/><ellipse cx="51" cy="74" rx="24" ry="10" fill="#bf7069"/><path d="M79 78Q103 61 87 43Q63 16 86 14Q108 14 103 29" fill="none" stroke="#e7988e" stroke-width="13"/><path d="M99 23L113 36 101 40" fill="#454f48"/><path d="M73 15L82 4 99 4 109 22" fill="#4e9396"/><path d="M77 13L104 13M81 6L99 6" stroke="#e8c25f" stroke-width="4"/><circle cx="98" cy="22" r="2" fill="#373e32"/>',
coffin:'<path d="M39 18Q60 0 81 18L92 54 80 109H40L28 54Z" fill="#d6ac51" stroke="#997639" stroke-width="3"/><path d="M37 25L48 24V57H32M72 24H83L89 57H73" fill="#3e838b"/><ellipse cx="60" cy="31" rx="12" ry="17" fill="#efd18a"/><path d="M48 66L76 87M74 65L47 88M40 99H80" stroke="#3d7d80" stroke-width="7"/><path d="M51 28H56M64 28H69" stroke="#514b36" stroke-width="2"/>',
pyramid:'<path d="M10 99L63 13 112 98Z" fill="#dbb36b" stroke="#af894c" stroke-width="3"/><path d="M63 13L64 100H112Z" fill="#b89355"/><path d="M34 60H87M22 80H100M47 40H77" stroke="#efcc87" stroke-width="2"/>',
plunger:'<path d="M60 12V79" stroke="#b78c53" stroke-width="10" stroke-linecap="round"/><path d="M36 76Q61 58 83 77L96 103H23Z" fill="#b76049" stroke="#8f4f3e" stroke-width="3"/><path d="M20 103H98" stroke="#d78360" stroke-width="8"/>',
anubis:'<path d="M46 54L34 28 34 5 46 19 58 6 61 29 95 39 67 47 68 72 83 94H97V106H24L35 81Z" fill="#465b58" stroke="#283e3e" stroke-width="3"/><path d="M41 59L67 60M42 69L67 69" stroke="#d4b25f" stroke-width="7"/><circle cx="56" cy="31" r="3" fill="#ead080"/>',
disco:'<circle cx="60" cy="62" r="40" fill="#96b4b2" stroke="#dae4cc" stroke-width="3"/><path d="M22 50H98M21 70H99M32 89H88M37 29L33 91M59 23V102M80 29L85 91" stroke="#f9e6b1" stroke-width="3"/><path d="M60 22V9" stroke="#9f8056" stroke-width="3"/><path d="M12 20V35M5 28H20M100 11V28M92 20H109" stroke="#e9bd60" stroke-width="3"/>',
mask:'<path d="M25 29Q60-3 95 29L104 101H18Z" fill="#49868b" stroke="#b9984c" stroke-width="4"/><path d="M28 40H93M25 58H98M21 79H102M20 97H103" stroke="#d0ad59" stroke-width="7"/><ellipse cx="60" cy="50" rx="23" ry="29" fill="#e6c773"/><path d="M61 51L86 94 57 66" fill="#eed695" stroke="#bd954c" stroke-width="2"/><path d="M43 40L52 42M66 40L76 39" stroke="#4c5141" stroke-width="4"/>'};return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" aria-hidden="true">${parts[shape]}</svg>`}
// Level two is a shared burial complex beneath the single desert entrance.
treasures.forEach(t=>t.level=0);
const chamberFinds=[
 ['The welcome mat of eternity','Welcome mat','EGYPTIAN-ISH · HOSPITABLE','scroll','A woven mat reading PLEASE WIPE YOUR FEET. It has waited four thousand years for a visitor with feet this small.','Bean wipes all available feet.'],
 ['The sacred squeak reserve','Chickens ×3','ABSURD · RESTRICTED ACCESS','chicken','Three rubber chickens in a sealed royal chamber. Their squeaks echo for approximately six dynasties.','This explains the curse, probably.'],
 ['Moonlight scarab','Moon scarab','EGYPTIAN · RARE','scarab','A luminous scarab buried beneath a painted night sky. Its wings carry traces of blue glaze and a truly unreasonable number of stars.','Please do not use as a reading lamp.'],
 ['Anubis’s night shift','Night guardian','EGYPTIAN · RARE','anubis','A jackal guardian beside a tiny staff room. A tablet records four thousand years without a tea break.','Bean has filed a concern with management.'],
 ['The pharaoh’s spare toaster','Spare toaster','ABSURD · ROYAL WARRANTY','toaster','A second toaster, entombed with its original packaging. The warranty expired in 1324 BCE.','The crumb tray contains a smaller warranty.'],
 ['The keeper of the little door','Bean’s mask','IMPOSSIBLE · PERSONAL','mask','A golden mask with a baby-sized beak. The inscription reads BEAN, KEEPER OF EVERYTHING THAT FALLS. The smallest archaeologist has been expected all along.','Bean requests a biscuit once every last treasure is safely packed.']
];
chamberFinds.forEach((f,i)=>treasures.push({id:16+i,name:f[0],short:f[1],rarity:f[2],shape:f[3],desc:f[4],note:f[5],x:520+i*330,count:i===1?3:1,level:1}));
const areas=[
 {name:'The Desert',width:5520,regions:['The Outskirts','Valley of Questionable Kings','The Great Chicken Necropolis']},
 {name:'Inside the Pyramid',width:2700,regions:['Hall of Small Footsteps','The Squeaking Chambers','The Keeper’s Sanctum']},
 {name:'The Oasis',width:2850,regions:['The Reed Beds','Lagoon of Lost Property','The Date-Palm Grove']},
 {name:'The Great Tomb',width:2900,regions:['The Descending Passage','The Hall of Watchers','The Royal Resting Room']}
];
const newFinds=[
 [2,'The floating royal duck','Royal duck','chicken','A yellow bath bird wearing the expression of someone who owns this oasis.','Its reign has been largely buoyant.',1],
 [2,'The jar of exceptional dates','Date jar','jar','Dates preserved in a sealed jar. The label gives a best-before date in a calendar nobody uses.','Bean is not allowed to open it.',1],
 [2,'Lifeguards of the lagoon','Pool birds ×3','flamingo','Three inflatable birds waiting patiently for a pool party that ended several dynasties ago.','No running beside the sacred pool.',3],
 [2,'The palm-leaf picnic list','Picnic list','scroll','Bread, figs, water, and fourteen rubber chickens. At last, documentary support for our theory.','The sandwiches have not survived.',1],
 [2,'The sunken garden supervisor','Wet gnome','gnome','A small bearded official discovered under a reed bed. An excellent place to avoid gardening duties.','His hat contains a tiny fish.',1],
 [2,'The moon over the watering hole','Moon mirror','disco','A mirrored sphere reflecting the palms in a hundred tiny fragments. A portable oasis for the homesick.','The fish are very impressed.',1],
 [3,'Key to the long sleep','Tomb seal','scarab','A heavy scarab seal from the innermost doorway. Its underside reads DO NOT DISTURB, EXCEPT FOR BISCUITS.','Pip has brought neither permission nor biscuits.',1],
 [3,'The royal nightlight','Nightlight','horus','A falcon lamp watching over the great tomb. Even the king preferred a little light in the corridor.','Fear of the dark is not a modern invention.',1],
 [3,'The royal squeak orchestra','Chickens ×4','chicken','Four rubber chickens arranged as a formal musical ensemble. The acoustics here are catastrophic.','Bean declines the encore.',4],
 [3,'The eternal breakfast machine','Royal toaster','toaster','Gold fittings. Two slots. A crumb tray bearing the royal cartouche. The monarch took breakfast seriously.','One side still burns the toast.',1],
 [3,'The little keeper’s crown','Bean’s crown','mask','A tiny golden face with a familiar beak. The inscription honours the one who remembers where everything goes.','Bean is trying very hard to look modest.',1],
 [3,'The sarcophagus of the first kiwi','First kiwi','coffin','The great stone bed held a smaller golden coffin. A note inside asks that all personal effects be delivered to the warehouse.','Even eternity has a luggage policy.',1]
];
for(const [area,name,short,shape,desc,note,count] of newFinds){const i=treasures.filter(t=>t.level===area).length;treasures.push({id:treasures.length,level:area,name,short,shape,desc,note,count,rarity:shape==='chicken'||shape==='toaster'||shape==='flamingo'?'ABSURD · EXCEPTIONAL':'ANCIENT · RARE',x:500+i*365})}
// Half of each area's finds leave no surface clue until sniffed.
for(const area of areas.keys())treasures.filter(t=>t.level===area).forEach((t,i)=>t.buried=i%2===1);
const entrances=[1200];
let level=0,returnX=1133,pendingPortal=null,entering=null;
for(const id of [18,20,28,32]){treasures[id].wall=true;treasures[id].buried=false}
const digsNeeded=h=>treasures[h.id]?.wall?3:['coffin','jar','pyramid'].includes(treasures[h.id]?.shape)?4:2;
let celebrationUntil=0,confetti=[];
function celebrate(){
 celebrationUntil=time+4;tone(180,.18,'triangle',.05);
 const colors=['#e8b64f','#ec826f','#65b9af','#f7eed1','#a69bd2'];
 for(let i=0;i<(reduced?24:90);i++)confetti.push({x:cart.x+44,y:GROUND-53,vx:(Math.random()-.5)*240,vy:-180-Math.random()*210,life:3+Math.random(),angle:Math.random()*6,spin:(Math.random()-.5)*9,color:colors[i%colors.length]});
 say('Bean packed a confetti cannon. Naturally.');
}
const findY=h=>treasures[h.id]?.wall?GROUND-52:GROUND-8;
const worldWidth=()=>areas[level].width;
const currentCargo=()=>cargo.filter(c=>c.level===level&&c.status!=='stored');
function exits(){
 if(level===0)return [...entrances.map(x=>({x,to:1,spawn:285,label:'Enter pyramid'})),{x:5310,to:2,spawn:285,label:'To the oasis'}];
 if(level===1)return [{x:210,to:0,spawn:returnX,label:'Back to the desert'},{x:2500,to:3,spawn:285,label:'Deeper into the tomb'}];
 if(level===2)return [{x:210,to:0,spawn:5243,label:'Back to the desert'}];
 return [{x:210,to:1,spawn:2433,label:'Back to the chambers'}];
}
const images=Object.fromEntries([...new Set(treasures.map(f=>f.shape))].map(shape=>{let im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg(shape));return[shape,im]}));
let found=new Set(),holes=treasures.map(t=>({x:t.x,hits:0,id:t.id,level:t.level})),cargo=[],spills=0,nextCargo=1;
let pip={x:330,face:1,target:null,pokeX:null,jab:0},cart={x:155,v:0},bean={x:83,state:'follow',item:null,toss:0};
let completedLevels=new Set();
const packDuration=()=>.85;
function levelReady(which){return treasures.filter(t=>t.level===which).every(t=>found.has(t.id)&&cargo.filter(c=>c.tid===t.id&&(c.status==='cart'||c.status==='stored')&&c.secured).length===t.count)&&currentCargo().every(c=>c.status==='cart'&&c.secured)}
function checkLevelSuccess(){
 if(completedLevels.has(level)||!levelReady(level))return;
 completedLevels.add(level);celebrate();
 $('#note-label').textContent=`${areas[level].name.toUpperCase()} COMPLETE`;
 $('#note-title').textContent=`${areas[level].name}: safely packed.`;
 $('#note-text').textContent='Every treasure found. Every piece aboard. Bean has restacked and tied down the whole collection.';
 [440,554,660,880].forEach((f,i)=>setTimeout(()=>tone(f,.25),i*100));save();updateUI(true);
}
const cargoWeight=c=>({coffin:9,pyramid:8,jar:7,anubis:6,horus:6,toaster:5,mask:4,gnome:3,scarab:2,scroll:2,chicken:1,flamingo:1}[treasures[c.tid].shape]||3);
function orderedPile(extra=[]){return [...currentCargo().filter(c=>c.status==='cart'),...extra].sort((a,b)=>(0)||(cargoWeight(b)-cargoWeight(a)||a.id-b.id))}
let quietTime=0,catchCount=0;
let digHeld=false,queuedDig=false,runHeld=false;
const walkingSpeed=()=>runHeld||keys.has("Shift")?360:135;
let camera=0,time=0,last=0,held=0,keys=new Set(),action=null,particles=[],sound=false,audio,toastTimer,speechTimer,sniff=0,travel=0,spillDistance=0,autosave=0,lastUI='',reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
function load(){try{
 const s=JSON.parse(localStorage.getItem(KEY));if(!s)return;
 completedLevels=new Set((s.completedLevels||[]).filter(n=>Number.isInteger(n)&&areas[n]));
 found=new Set((s.found||[]).filter(i=>Number.isInteger(i)&&treasures[i]));
 level=Number.isInteger(s.level)&&areas[s.level]?s.level:0;
 returnX=entrances.includes(s.returnDoor)?s.returnDoor-67:1133;
 pip.x=Math.max(160,Math.min(worldWidth()-100,Number(s.x)||330));cart.x=pip.x-155;bean.x=cart.x-65;
 holes=treasures.map(t=>({x:t.x,id:t.id,level:t.level,hits:found.has(t.id)?digsNeeded(t):Math.min(digsNeeded(t)-1,Math.max(0,Number(s.hits?.[t.id])||0))}));
 cargo=(s.cargo||[]).filter(c=>Number.isInteger(c.tid)&&found.has(c.tid)).map(c=>{
  const home=treasures[c.tid].level,stored=c.status==='stored'||home!==level;
  return {id:nextCargo++,tid:c.tid,secured:stored||c.secured===true,level:home,status:stored?'stored':c.status==='cart'?'cart':'ground',x:Number(c.x)||cart.x,y:GROUND-18,vx:0,vy:0,angle:0};
 });
 spills=Math.max(0,Number(s.spills)||0);catchCount=Math.max(0,Number(s.catchCount)||0);
 for(const id of found){const t=treasures[id],count=cargo.filter(c=>c.tid===id).length;for(let j=count;j<t.count;j++)cargo.push({id:nextCargo++,tid:id,level:t.level,secured:t.level!==level,status:t.level===level?'cart':'stored',x:cart.x,y:GROUND-40,angle:0,vx:0,vy:0})}
}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify({completedLevels:[...completedLevels],level,returnDoor:returnX+67,found:[...found],x:pip.x,hits:holes.filter(h=>h.id>=0).map(h=>h.hits),cargo:cargo.map(c=>({tid:c.tid,secured:!!c.secured,level:c.level,status:c.status,x:c.x})),spills,catchCount}))}catch(e){$('#instruction').textContent='Browser storage unavailable; this expedition lasts until you close the page.'}}
function say(text){$('#speech').textContent=text;$('#speech').style.opacity='1';clearTimeout(speechTimer);speechTimer=setTimeout(()=>$('#speech').style.opacity='0',5000)}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3500)}
function tone(freq,duration=.1,type='sine',volume=.04){if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(freq*.5,audio.currentTime+duration);g.gain.setValueAtTime(volume,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration)}catch(e){}}
function specimenCards(list){return list.map(f=>found.has(f.id)?`<button class="specimen found" data-id="${f.id}" aria-label="Read about ${f.name}">${svg(f.shape)}<small>${f.short}</small></button>`:`<div class="specimen empty"><span>?</span><small>UNDISCOVERED</small></div>`).join('')}
function updateUI(force=false){
 const active=currentCargo(),aboard=active.filter(c=>c.status==='cart').length,loose=active.length-aboard,secured=active.filter(c=>c.status==='cart'&&c.secured).length;
 const local=treasures.filter(t=>t.level===level),discovered=local.filter(t=>found.has(t.id)).length;
 const key=[level,found.size,aboard,loose,spills,bean.state,secured,catchCount,[...completedLevels].join(',')].join(':');
 $('#portal').textContent=exits()[0].label+' ↗';$('#onward').hidden=exits().length===1;$('#onward').textContent=level===0?'To the oasis →':'Deeper into the tomb →';
 $('#level-tag').textContent=areas[level].name.toUpperCase();$('#distance').textContent=String(Math.round(pip.x/10)).padStart(3,'0')+' m';
 $('#terrain-label').textContent=areas[level].regions[Math.min(2,Math.floor(pip.x/worldWidth()*3))];
 if(key===lastUI&&!force)return;lastUI=key;
 $('#packing-status').textContent=bean.state==='pack'?`Bean is tying item ${secured+1} of ${aboard} · each knot stays tied`:`${secured} tied down · ${aboard-secured} waiting for rope · ${catchCount} caught`;
 $('#aboard').textContent=aboard;$('#loose').textContent=loose;$('#spills').textContent=spills;
 $('#rank-count').textContent=discovered+'/'+local.length;$('#find-count').textContent=String(discovered).padStart(2,'0')+' / '+local.length;
 $('#progress').style.width=discovered/local.length*100+'%';$('#rank-title').textContent=completedLevels.has(level)?'Collection secured':aboard>10?'Architecturally unsound':aboard>4?'Optimistically stacked':'Reasonably packed';
 $('#manifest-area').textContent=areas[level].name;
 $('#milestone').innerHTML=completedLevels.has(level)?'<b>Area complete.</b> Ready for the warehouse.':discovered===local.length?'<b>All finds discovered.</b> Let Bean collect everything and finish each knot to succeed.':`Find all <b>${local.length} treasures</b>, then let Bean tie down each item.`;
 $('#collection').innerHTML=specimenCards(local);
 const openAreas=new Set([...$('#archive').querySelectorAll('details[open]')].map(d=>Number(d.dataset.area)));
 $('#archive').innerHTML=areas.map((a,i)=>i===level?'':`<details data-area="${i}" ${openAreas.has(i)?'open':''}><summary>${a.name} <span>${treasures.filter(t=>t.level===i&&found.has(t.id)).length}/${treasures.filter(t=>t.level===i).length} finds${completedLevels.has(i)?' · ✓':''}</span></summary><div class="collection">${specimenCards(treasures.filter(t=>t.level===i))}</div></details>`).join('');
 $('#warehouse-count').textContent=cargo.filter(c=>c.status==='stored').length+' items safely warehoused';
 for(const container of ['#collection','#archive'])$(container).querySelectorAll('button').forEach(b=>b.onclick=()=>showFind(+b.dataset.id));
}
function showFind(id){const f=treasures[id];$('#discovery-type').textContent=f.rarity;$('#discovery-art').innerHTML=svg(f.shape);$('#catalogue').textContent='DESERT DIVISION / '+String(id+1).padStart(3,'0');$('#discovery-name').textContent=f.name;$('#discovery-desc').textContent=f.desc;$('#curator-note').textContent=f.note;$('#discovery').showModal();stopWalking()}
function reveal(h){if(h.id<0||found.has(h.id))return;const f=treasures[h.id];found.add(h.id);for(let i=0;i<f.count;i++)cargo.push({id:nextCargo++,tid:h.id,level,status:'fall',x:h.x+(i-(f.count-1)/2)*18,y:(f.wall?GROUND-52:GROUND-40)-i*13,vx:(i-(f.count-1)/2)*14,vy:-(f.shape==='chicken'?240:150)-i*12,angle:(i-2)*.1});$('#note-label').textContent='NEW FIND · '+f.rarity;$('#note-title').textContent=f.name;$('#note-text').textContent=f.desc;[440,550,660].forEach((f,i)=>setTimeout(()=>tone(f,.2),i*85));save();updateUI(true)}
function sniffReveals(h){return h.level===level&&sniff>time&&Math.abs(h.x-pip.x)<=420}
function surfaceVisible(h){return h.hits>0||!treasures[h.id]?.buried||sniffReveals(h)}
function nearestHole(x,range=58){return holes.filter(h=>h.level===level).reduce((best,h)=>Math.abs(h.x-x)<range&&(!best||Math.abs(h.x-x)<Math.abs(best.x-x))?h:best,null)}
function requestPoke(x,facing=null){if(action||entering)return;let h=nearestHole(x);if(!h){h={x:Math.max(180,Math.min(worldWidth()-90,x)),hits:0,id:-1,level};holes.push(h)}pip.face=facing??(h.x>=pip.x?1:-1);pip.target=Math.max(160,Math.min(worldWidth()-100,h.x-pip.face*67));pip.pokeX=h.x;}
function startJab(){const h=nearestHole(pip.pokeX,5);if(!h)return;action={elapsed:0,h};pip.target=null;pip.pokeX=null;}
function burst(x,y=GROUND-3){
 const palette=level===1?['#b59b6f','#8e7957','#cab087','#a58c62']:['#c49a5c','#dab376','#b68d51','#edd097'];
 for(let i=0;i<34;i++){
  const life=.35+Math.random()*.35;
  particles.push({x:x+(Math.random()-.5)*9,y,vx:(Math.random()-.5)*155,vy:-30-Math.random()*85,life,size:.6+Math.random()*1.5,color:palette[i%palette.length],angle:Math.random()*Math.PI,spin:(Math.random()-.5)*9,settled:false});
 }
}
// Longer exit journeys get a quicker sprint, easing to a run near the door.
function exitRunSpeed(distance){return 360+240*Math.min(1,Math.max(0,(distance-180)/1800))}
function step(dt){bean.moving=false;time+=dt;confetti=confetti.filter(p=>p.life>0);for(const p of confetti){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=160*dt;p.vx*=Math.exp(-.8*dt);p.angle+=p.spin*dt}if(entering){entering.elapsed+=dt;pip.x=entering.from+(pendingPortal.x-entering.from)*Math.min(1,entering.elapsed/.3);pip.moving=entering.elapsed<.3;if(entering.elapsed>=1.2){entering=null;changeLevel()}return}if($('dialog[open]')){digHeld=false;queuedDig=false;held=0;keys.clear();return}const direction=held||(keys.has('ArrowRight')||keys.has('d')?1:0)-(keys.has('ArrowLeft')||keys.has('a')?1:0);const oldX=pip.x;if(!action){if(direction){pendingPortal=null;pip.face=direction;pip.target=null;pip.pokeX=null;pip.x+=direction*walkingSpeed()*dt}else if(pip.target!==null){let d=pip.target-pip.x;if(Math.abs(d)<2){pip.x=pip.target;pip.target=null;if(pip.pokeX!==null)startJab()}else{if(pip.pokeX===null)pip.face=Math.sign(d);pip.x+=Math.sign(d)*Math.min(Math.abs(d),(pendingPortal?exitRunSpeed(Math.abs(d)):walkingSpeed())*dt)}}}pip.x=Math.max(160,Math.min(worldWidth()-100,pip.x));const moved=Math.abs(pip.x-oldX);pip.moving=moved>.01;travel+=moved;spillDistance+=moved;
if(action){action.elapsed+=dt;
const t=action.elapsed;
// A brief ground probe; the 280 ms timing is tuned for play, not a biological measurement.
pip.jab=t<.09?Math.sin(t/.09*Math.PI/2):t<.14?1-.025*Math.sin((t-.09)*90):t<.28?(1-(t-.14)/.14)**2:0;
if(t>=.09&&!action.contacted){action.contacted=true;burst(action.impactX??action.h.x,findY(action.h));tone(145,.12,'triangle',.06)}
if(t>=.28){const h=action.h;const wasClear=h.hits>=digsNeeded(h);h.hits=Math.min(digsNeeded(h),h.hits+1);if(!wasClear&&h.hits===digsNeeded(h)){if(h.id>=0)reveal(h);else{save()}}pip.jab=0;action=null;save();if(digHeld||queuedDig){queuedDig=false;pokeAhead()}}}
// The cart trails Pip in either direction, with a damped suspension.
const cartTarget=pip.x-pip.face*155;const oldCart=cart.x;cart.v+=(cartTarget-cart.x)*18*dt;cart.v*=Math.exp(-6*dt);cart.x+=cart.v*dt;cart.x=Math.max(50,Math.min(worldWidth()-30,cart.x));
const pile=orderedPile();const wobble=reduced?0:Math.sin(time*3.6)*Math.min(.14,pile.length*.004)+Math.max(-.11,Math.min(.11,cart.v*.0006));pile.forEach((c,i)=>{const spacing=c.secured?10:13.8;const y=GROUND-67-i*spacing;c.x=cart.x+Math.sin(i*2.3)*18+(c.secured?0:Math.sin(time*3.6+i*.18)*Math.min(i*1.5,20)+(GROUND-y)*wobble);c.y=y;c.angle=Math.sin(i*3.3)*.22+(c.secured?0:wobble*(1+i*.06))+(c.tip||0)*pip.face});
quietTime=moved<.01&&Math.abs(cart.v)<4?quietTime+dt:0;
for(const c of pile){if(c.tip===undefined)continue;c.tip+=dt;if(c.tip<.6)continue;
 const canCatch=bean.state==='catch'&&bean.item===c.id&&Math.abs(bean.x-cart.x)<100&&pile.indexOf(c)<10;
 if(canCatch){catchCount++;tone(650,.1,'triangle');toast('Bean caught it! A pause would let him tie down the load.');c.tip=undefined;}
 else{c.tip=undefined;c.level=level;c.status='fall';c.vx=-pip.face*80;c.vy=-30;c.secured=false;spills++;tone(180,.15);if(spills===1)say('Bean can only catch so much archaeology.');}
 if(bean.state==='catch'){bean.state='follow';bean.item=null}save();
}
if(!pendingPortal&&moved>.01&&pile.length>=5&&spillDistance>160&&!pile.some(c=>c.tip!==undefined)&&currentCargo().filter(c=>c.status!=='cart').length<7){
 const c=[...pile].reverse().find(c=>!c.secured);
 if(c){spillDistance=0;c.tip=0;if(bean.state==='follow'&&Math.abs(bean.x-cart.x)<110){bean.state='catch';bean.item=c.id;bean.catchTime=0;tone(760,.08,'triangle',.02)}}
}
currentCargo().forEach(c=>{if(c.status==='fall'){c.x+=c.vx*dt;c.y+=c.vy*dt;c.vy+=410*dt;c.angle+=dt*2.5;if(c.y>=GROUND-18){c.y=GROUND-18;c.x=Math.max(70,Math.min(worldWidth()-60,c.x));c.status='ground';c.vx=0;c.vy=0;c.angle=(c.id%3-1)*.25;burst(c.x)}}});
// Bean chases loose objects, carries one home, then physically tosses it onto the pile.
const speed=pendingPortal?Math.max(430,exitRunSpeed(Math.abs(pendingPortal.target-pip.x))+70):walkingSpeed()>135?430:260;bean.lift=bean.lift||0;function walkBean(target){const d=target-bean.x;const distance=Math.min(Math.abs(d),speed*dt);bean.moving=distance>2*dt;bean.x+=Math.sign(d)*distance;return Math.abs(d)<9}
if(bean.state==='pack'){
 if(quietTime===0||currentCargo().some(c=>c.status!=='cart')){bean.state='follow';bean.packTime=0;bean.packItem=null;bean.hop=null;bean.settle=0}
 else{
  const item=orderedPile().find(c=>!c.secured);
  if(!item){bean.state='follow';bean.packItem=null;checkLevelSuccess()}
  else{
   if(bean.packItem!==item.id){bean.packItem=item.id;bean.packTime=0}
   const targetLift=Math.min(370,GROUND-item.y-10),targetX=cart.x-pip.face*36;
   bean.settle=Math.max(0,(bean.settle||0)-dt);
   if(!bean.hop&&!bean.settle&&(Math.abs(bean.lift-targetLift)>3||Math.abs(bean.x-targetX)>3)){
    bean.hop={t:0,from:bean.lift,to:bean.lift+Math.sign(targetLift-bean.lift)*Math.min(42,Math.abs(targetLift-bean.lift)),fromX:bean.x,toX:targetX};
   }
   if(bean.hop){
    const h=bean.hop;h.t+=dt;const p=Math.min(1,h.t/.32),ease=p*p*(3-2*p);
    bean.x=h.fromX+(h.toX-h.fromX)*ease;
    bean.lift=h.from+(h.to-h.from)*ease+(reduced?0:Math.sin(p*Math.PI)*17);
    if(p===1){bean.lift=h.to;bean.hop=null;bean.settle=.12}
   }else if(!bean.settle&&Math.abs(bean.lift-targetLift)<3)bean.packTime+=dt;
   if(bean.packTime>=packDuration()){item.secured=true;bean.packTime=0;bean.packItem=null;tone(390,.08,'triangle',.02);save();if(orderedPile().every(c=>c.secured)){bean.state='follow';checkLevelSuccess()}}
  }
 }
}else if(bean.state==='catch'){bean.catchTime+=dt;bean.lift=Math.sin(Math.min(1,bean.catchTime/.6)*Math.PI)*65;walkBean(cart.x-pip.face*35)}else if(bean.state==='follow'||bean.state==='fetch'){let target=currentCargo().filter(c=>c.status==='ground').sort((a,b)=>Math.abs(a.x-bean.x)-Math.abs(b.x-bean.x))[0];if(target){bean.state='fetch';if(walkBean(target.x)){bean.item=target.id;target.status='carry';bean.state='carry';tone(treasures[target.tid].shape==='chicken'?620:340,.07,'triangle',.025)}}else{bean.state='follow';const running=pip.moving&&(pendingPortal||walkingSpeed()>135);walkBean(cart.x-pip.face*(running?115:83))}}else if(bean.state==='carry'){const c=cargo.find(c=>c.id===bean.item);if(!c){bean.state='follow';bean.item=null}else{c.x=bean.x+22;c.y=GROUND-54;c.angle=-.15;if(walkBean(cart.x-pip.face*50)){bean.state='toss';bean.toss=0;c.startX=c.x;c.startY=c.y}}}else if(bean.state==='toss'){const c=cargo.find(c=>c.id===bean.item);if(!c){bean.state='follow';bean.item=null}else{bean.toss+=dt;const p=Math.min(1,bean.toss/.65),height=GROUND-67-orderedPile([c]).findIndex(item=>item.id===c.id)*13.8;c.x=c.startX+(cart.x-c.startX)*p;c.y=c.startY+(height-c.startY)*p-Math.sin(p*Math.PI)*85;c.angle=p*1.8;if(p>=1){c.status='cart';bean.state='follow';bean.item=null;tone(300,.08,'triangle',.025);save()}}}
if(bean.state==='follow'&&quietTime>1.2&&currentCargo().every(c=>c.status==='cart')&&orderedPile().some(c=>!c.secured)&&Math.abs(bean.x-cart.x)<110){bean.state='pack';bean.packTime=0;}
if(!['pack','catch'].includes(bean.state))bean.lift=Math.max(0,bean.lift-140*dt);
particles=particles.filter(p=>p.life>0);particles.forEach(p=>{
 p.life-=dt;p.x+=p.vx*dt;
 if(!p.settled){p.y+=p.vy*dt;p.vy+=650*dt;p.vx*=Math.exp(-2*dt);p.angle+=p.spin*dt;
  if(p.y>=GROUND-1){p.y=GROUND-1;p.settled=true;p.vy=0;p.vx*=.2}
 }else p.vx*=Math.exp(-18*dt);
});camera+=(Math.max(0,Math.min(worldWidth()-W,pip.x-W*.59))-camera)*Math.min(1,dt*5);if(time>=celebrationUntil&&pendingPortal&&Math.abs(pip.x-pendingPortal.target)<3&&!action&&currentCargo().every(c=>c.status==='cart'&&c.secured)&&bean.state!=='pack'){if(pendingPortal.to===1||pendingPortal.to===3){entering={elapsed:0,from:pip.x};stopWalking()}else changeLevel()};if(bean.state!=='pack')checkLevelSuccess();autosave+=dt;if(autosave>3){autosave=0;save()}updateUI();}
function stopWalking(){runHeld=false;digHeld=false;queuedDig=false;held=0;keys.clear();pip.target=null;pip.pokeX=null}
function pointer(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width+camera,y:(e.clientY-r.top)*H/r.height}}
canvas.addEventListener('pointerdown',e=>{e.preventDefault();canvas.focus({preventScroll:true});const p=pointer(e);if(entering)return;const wall=holes.find(h=>h.level===level&&treasures[h.id]?.wall&&h.hits<digsNeeded(h)&&Math.abs(h.x-p.x)<45&&Math.abs(findY(h)-p.y)<35);if(wall){pendingPortal=null;requestPoke(wall.x);return}if(p.y<GROUND-155)return;const door=exits().find(g=>Math.abs(g.x-p.x)<60);if(door!==undefined){requestPortal(door);return}if(p.y<GROUND-85)return;pendingPortal=null;const h=nearestHole(p.x,65);if(h&&h.hits<digsNeeded(h)&&surfaceVisible(h))requestPoke(h.x);else{if(action)return;pip.target=Math.max(160,Math.min(worldWidth()-100,p.x));pip.pokeX=null}});
function pokeAhead(){
 if(entering)return;
 pendingPortal=null;
 if(action){queuedDig=true;return}
 // Keyboard/button probing is stationary. Nearby treasure detection never repositions Pip.
 const x=pip.x+pip.face*67;
 let h=holes.filter(h=>h.level===level&&h.id>=0&&h.hits<digsNeeded(h)&&Math.abs(h.x-x)<=34)
  .sort((a,b)=>Math.abs(a.x-x)-Math.abs(b.x-x))[0];
 if(!h)h=holes.find(h=>h.level===level&&Math.abs(h.x-x)<6&&h.hits>0);
 if(!h){h={x,hits:0,id:-1,level};holes.push(h)}
 pip.target=null;pip.pokeX=null;action={elapsed:0,h,impactX:x};
}
$('#portal').onclick=()=>requestPortal(exits()[0]);$('#onward').onclick=()=>requestPortal(exits().at(-1));$('#probe').onclick=pokeAhead;function sniffMessage(){
 const remaining=treasures.filter(t=>t.level===level&&!found.has(t.id)).sort((a,b)=>Math.abs(a.x-pip.x)-Math.abs(b.x-pip.x));
 if(!remaining.length)return 'All the treasures here are accounted for. Excellent nostril work.';
 const nearest=remaining[0],distance=Math.abs(nearest.x-pip.x);
 if(distance<=420)return 'A scent nearby… look for the warm glow in the ground.';
 return `A faint scent ${nearest.x<pip.x?'← to the left':'to the right →'}. About ${Math.round(distance/10)} m away. Keep going, then sniff again.`;
}
function doSniff(){sniff=time+6;tone(440,.13);say(sniffMessage());};$('#sniff').onclick=doSniff;
const runButton=$('#run');
runButton.addEventListener('pointerdown',e=>{e.preventDefault();runButton.setPointerCapture(e.pointerId);runHeld=true});
for(const event of ['pointerup','pointercancel','lostpointercapture'])runButton.addEventListener(event,()=>runHeld=false);
for(const [id,dir]of[['left',-1],['right',1]]){const b=$('#'+id);b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);held=dir});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,()=>held=0));b.addEventListener('keydown',e=>{if(e.key==='Enter'){held=dir;e.preventDefault()}});b.addEventListener('keyup',()=>held=0)}
document.addEventListener('keydown',e=>{if($('dialog[open]')||e.target?.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName))return;const k=e.key.length===1?e.key.toLowerCase():e.key;if(['ArrowLeft','ArrowRight','a','d',' ','p','s','e','Shift'].includes(k)){e.preventDefault();if(k===' '){digHeld=true;if(!e.repeat)pokeAhead()}else if(k==='p'&&!e.repeat)pokeAhead();else if(k==='e'&&!e.repeat)requestPortal();else if(k==='s'&&!e.repeat)doSniff();else if(['ArrowLeft','ArrowRight','a','d','Shift'].includes(k))keys.add(k)}});document.addEventListener('keyup',e=>{if(e.key===' ')digHeld=false;keys.delete(e.key.length===1?e.key.toLowerCase():e.key)});window.addEventListener('blur',stopWalking);document.addEventListener('visibilitychange',()=>{if(document.hidden){stopWalking();save()}});
$('#sound').onclick=()=>{sound=!sound;$('#sound span').textContent=sound?'Sound on':'Sound off';$('#sound').setAttribute('aria-label',sound?'Disable sound':'Enable sound');$('#sound').setAttribute('aria-pressed',String(sound));tone(520,.18)};$('#help').onclick=()=>{stopWalking();$('#guide').showModal()};$('.brand').onclick=e=>{e.preventDefault();$('#help').click()};$('#start').onclick=()=>$('#guide').close();document.querySelectorAll('.close').forEach(b=>b.onclick=()=>b.closest('dialog').close());$('#keep').onclick=()=>$('#discovery').close();$('#reset').onclick=()=>{stopWalking();$('#confirm').showModal()};$('#cancel-reset').onclick=()=>$('#confirm').close();$('#confirm-reset').onclick=()=>{celebrationUntil=0;confetti=[];found.clear();holes=treasures.map(t=>({x:t.x,hits:0,id:t.id,level:t.level}));cargo=[];spills=0;catchCount=0;quietTime=0;completedLevels.clear();nextCargo=1;level=0;pendingPortal=null;entering=null;returnX=1133;pip={x:330,face:1,target:null,pokeX:null,jab:0};cart={x:155,v:0};bean={x:83,state:'follow',item:null,toss:0};action=null;particles=[];spillDistance=0;camera=0;sniff=0;save();updateUI(true);$('#confirm').close();$('#note-label').textContent='A NOTE FROM THE EXPEDITION';$('#note-title').textContent='Please keep all wings inside the vehicle.';$('#note-text').textContent='Tap the sand to set off. Poke a promising mound twice. Your assistant will do the heavy lifting.';say('Bean, we are professionals. Probably.')};
function ellipse(x,y,rx,ry,fill,rot=0){ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill()}
function path(points,fill,stroke,width=1){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));if(fill){ctx.closePath();ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function line(x,y,x2,y2,color,width){path([[x,y],[x2,y2]],null,color,width)}
function imageItem(c,size=58){const im=images[treasures[c.tid].shape];if(!im?.complete||!im.naturalWidth)return;ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.angle||0);ctx.drawImage(im,-size/2,-size/2,size,size);ctx.restore()}
function palm(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);path([[0,0],[10,-115],[17,-116],[9,0]],'#9b7848');for(let j=0;j<5;j++){let a=-Math.PI+j*.66;ctx.save();ctx.translate(13,-113);ctx.rotate(a);ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(25,-23,75,9);ctx.quadraticCurveTo(25,-6,0,0);ctx.fillStyle=j%2?'#6e8963':'#82936a';ctx.fill();ctx.restore()}ctx.restore()}
function background(){if(level===2){oasisScene();return}if(level===1||level===3){interior();return}const sky=ctx.createLinearGradient(0,0,0,GROUND);sky.addColorStop(0,'#efdab4');sky.addColorStop(.65,'#edc58a');sky.addColorStop(1,'#e5b779');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);ellipse(858-camera*.035,109,48,48,'#fff0b9');ellipse(858-camera*.035,109,64,64,'#fff1c523');

ctx.beginPath();ctx.moveTo(0,315);for(let x=0;x<=W+40;x+=20)ctx.lineTo(x,305+Math.sin((x+camera*.25)/270)*40+Math.sin(x/470)*19);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fillStyle='#e5bc80';ctx.fill();
ctx.beginPath();ctx.moveTo(0,385);for(let x=0;x<=W+40;x+=20)ctx.lineTo(x,380+Math.sin((x+camera*.48)/220)*32);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fillStyle='#d9aa68';ctx.fill();
for(let i=0;i<8;i++){const x=160+i*760-camera*.54;if(x>-100&&x<W+100)palm(x,383,.45+(i%2)*.17)}
ctx.fillStyle='#e4bc7c';ctx.fillRect(0,GROUND-7,W,H-GROUND+7);line(0,GROUND-7,W,GROUND-7,'#f8dca1',3);for(let i=0;i<90;i++){const x=((i*139-camera*.94)%(W+30)+W+30)%(W+30),y=GROUND+18+(i*41)%155;line(x,y,x+8+(i%4)*4,y,'#cba26850',1)}
// A cool oasis waits at the eastern end of the route.
const oasis=5150-camera;if(oasis<W+200&&oasis>-200){ellipse(oasis,GROUND-9,150,20,'#8fa99a');ellipse(oasis+4,GROUND-14,113,10,'#b6c4a1');palm(oasis-110,GROUND-10,1.45);palm(oasis+150,GROUND-7,1.1)}
}
function kiwi(x,y,scale=1,face=1,baby=false,moving=false,jab=0){ctx.save();ctx.translate(x,y);ctx.scale(face*scale,scale);const probing=!baby&&!!action,wallPeck=probing&&!!treasures[action.h.id]?.wall;const bounce=moving&&!probing&&!reduced?Math.sin(time*(pendingPortal||walkingSpeed()>135?29:18))*2.5:Math.sin(time*2)*.6;ctx.translate(0,bounce);ellipse(-4,2,34,7,'#80613a25');const step=moving&&!probing?Math.sin(time*(pendingPortal||walkingSpeed()>135?29:18))*7:0;line(-15,-13,-17+step,0,'#ba7d38',4);line(9,-13,12-step,0,'#ba7d38',4);line(-17+step,0,-25+step,1,'#ba7d38',3);line(12-step,0,21-step,1,'#ba7d38',3);ctx.translate(jab*8,-32+jab*(wallPeck?0:4));ellipse(-8,-2,35,30,baby?'#b28e58':'#987547',-.14);ellipse(-13,-8,27,23,baby?'#c5a36b':'#b18a52',-.2);ellipse(-22,-1,13,20,'#a27c48',-.3);for(let i=0;i<12;i++){let xx=-31+(i%4)*10,yy=-15+Math.floor(i/4)*11;line(xx,yy,xx-3,yy+5,'#d4ad705a',1.3)}ctx.save();ctx.translate(12,-15);ctx.rotate(jab*(wallPeck?-.85:.30));ctx.translate(-12,15);ellipse(20,-19,21,20,baby?'#cfb078':'#b9935e');ellipse(28,-20,5.4,5.4,'#ecd49c');ellipse(29,-21,3.4,3.4,'#3f3c2d');ellipse(30,-22,1,1,'#fff4d0');path([[35,-13],[66,19],[37,-5]],'#dfb471');line(40,-6,66,19,'#b4894b',1);if(!baby){path([[1,-11],[8,1],[29,4],[33,-3]],'#a9583d');path([[4,-1],[-4,10],[13,7]],'#ba6946');ellipse(15,-37,30,6,'#dfcda1',-.06);path([[-3,-38],[0,-54],[25,-56],[34,-39]],'#cdb987');path([[-2,-42],[33,-44],[35,-38],[-3,-36]],'#7e8b70')}else{path([[7,-38],[1,-50],[12,-45],[20,-51],[24,-39]],'#c5a36b');path([[1,-11],[8,-1],[28,1],[31,-5]],'#60918b')}ctx.restore();ctx.restore()}
function drawLashing(c,progress){
 const wide=treasures[c.tid].shape==='coffin'?25:19;
 ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.angle||0);ctx.lineCap='round';ctx.lineJoin='round';
 // A single low sling leaves the artifact's face and silhouette readable.
 ctx.beginPath();ctx.moveTo(-wide,-8);ctx.bezierCurveTo(-wide-3,13,wide-4,21,wide,0);
 ctx.globalAlpha=.35+.65*progress;ctx.strokeStyle='#735334';ctx.lineWidth=3;ctx.stroke();ctx.strokeStyle='#dfbd83';ctx.lineWidth=1.6;ctx.stroke();
 if(progress>.65){
  ctx.globalAlpha=Math.min(1,(progress-.65)/.35);ctx.translate(wide-5,8);
  ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-12,-12,-13,3,0,0);ctx.bezierCurveTo(11,-10,12,5,0,0);
  ctx.moveTo(0,0);ctx.quadraticCurveTo(-2,7,-7,10);ctx.moveTo(1,0);ctx.quadraticCurveTo(7,6,5,11);
  ctx.strokeStyle='#775839';ctx.lineWidth=2.8;ctx.stroke();ctx.strokeStyle='#e5c999';ctx.lineWidth=1.4;ctx.stroke();ellipse(0,0,2.5,2,'#b99159');
 }
 ctx.restore();
}
function drawDescendingPip(){
 const progress=Math.max(0,Math.min(1,(entering.elapsed-.45)/.75));
 const drop=progress*progress*(3-2*progress)*110;
 ctx.save();ctx.beginPath();ctx.rect(pip.x-65,GROUND-130,130,130);ctx.clip();
 ctx.translate(pip.x,GROUND-4+drop);ctx.scale(1.08,1.08);
 // Rear view: rounded feathers, the back of his scarf and hat, no visible beak.
 line(-13,-12,-15,0,'#ba7d38',4);line(13,-12,15,0,'#ba7d38',4);
 line(-15,0,-23,1,'#ba7d38',3);line(15,0,23,1,'#ba7d38',3);
 ellipse(0,-33,33,31,'#987547');ellipse(-5,-36,26,26,'#b18a52');
 for(let i=0;i<15;i++){const x=-22+(i%5)*10,y=-46+Math.floor(i/5)*12;line(x,y,x-2,y+6,'#cba16b',1.4)}
 ellipse(0,-54,20,19,'#b9935e');
 path([[-17,-46],[16,-46],[14,-39],[-15,-39]],'#a9583d');path([[1,-41],[13,-25],[3,-28],[-4,-41]],'#ba6946');
 ellipse(0,-69,29,6,'#dfcda1');path([[-19,-70],[-16,-86],[12,-87],[20,-70]],'#cdb987');path([[-18,-75],[18,-75],[20,-70],[-19,-70]],'#7e8b70');
 line(-35,3,35,3,'#a78c60',5);ctx.restore();
}
function render(){const dpr=Math.min(window.devicePixelRatio||1,2);if(canvas.width!==Math.round(canvas.clientWidth*dpr)||canvas.height!==Math.round(canvas.clientHeight*dpr)){canvas.width=Math.round(canvas.clientWidth*dpr);canvas.height=Math.round(canvas.clientHeight*dpr)}ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);background();ctx.save();ctx.translate(-camera,0);
drawDoors();drawBoundaries();
// Footprints and subtle terrain clues make the desert an actual traversable place.
for(let x=230;x<pip.x-80;x+=46){if(x<camera||x>camera+W)continue;ellipse(x,GROUND+8,4,1.5,'#b38e5844');ellipse(x+15,GROUND+14,4,1.5,'#b38e5844')}
holes.filter(h=>h.level===level).forEach(original=>{
 const h=original;
 if(h.x<camera-70||h.x>camera+W+70||!surfaceVisible(original))return;
 if(treasures[h.id]?.wall){
  const y=findY(h);ellipse(original.x,y,29,25,'#172724');
  path([[original.x-30,y-8],[original.x-39,y-19],[original.x-34,y-34]],null,'#b1a079',2);
  if(h.hits<digsNeeded(h)){imageItem({tid:h.id,x:original.x,y,angle:h.hits?.12:0},42);path([[original.x-27,y+11],[original.x+24,y+16],[original.x+29,y+27],[original.x-25,y+24]],'#82765d');
   for(let crack=0;crack<h.hits;crack++)path([[original.x-22+crack*19,y-18],[original.x-13+crack*14,y-2],[original.x-20+crack*21,y+17]],null,'#e4cba1',2);
  }
  return;
 }
 if(h.hits){
  if(h.id>=0&&h.hits<digsNeeded(h)){ctx.save();ctx.globalAlpha=.35+h.hits/digsNeeded(h)*.45;imageItem({tid:h.id,x:original.x,y:GROUND-12,angle:Math.sin(h.hits*2)*.08},30+h.hits*4);ctx.restore()}
  ellipse(h.x,GROUND,32,9,'#a17a45');ellipse(h.x,GROUND-1,24,6,'#795c35');
  ellipse(h.x-27,GROUND-6,13,5,'#dfba7c');ellipse(h.x+25,GROUND-5,11,5,'#dfba7c');
 }else{
  const style=Math.abs(h.id)%3,inside=level===1||level===3;
  if(style===0){
   // A low, wind-shaped rise rather than a target marker.
   ctx.beginPath();ctx.moveTo(h.x-34,GROUND-6);
   ctx.bezierCurveTo(h.x-16,GROUND-8,h.x-14,GROUND-20,h.x+6,GROUND-15);
   ctx.bezierCurveTo(h.x+20,GROUND-12,h.x+22,GROUND-6,h.x+37,GROUND-5);
   ctx.closePath();ctx.fillStyle=inside?'#918060':'#e9c58b';ctx.fill();
  }else if(style===1){
   ellipse(h.x-9,GROUND-6,21,5,inside?'#8d7c5b':'#dfb77a');
   ellipse(h.x+12,GROUND-9,9,5,inside?'#9b8c70':'#c6a574',-.2);
   ellipse(h.x-13,GROUND-8,5,3,inside?'#afa083':'#d1b281',.3);
  }else{
   path([[h.x-25,GROUND-4],[h.x-7,GROUND-8],[h.x+3,GROUND-4],[h.x+20,GROUND-9]],null,inside?'#655c46':'#bb965e',1.4);
   path([[h.x-7,GROUND-8],[h.x-3,GROUND-14],[h.x+9,GROUND-16]],null,inside?'#655c46':'#bb965e',1);
   ellipse(h.x+26,GROUND-6,4,2,inside?'#ad9870':'#d1ad76');
  }
 }
 // Sniffing briefly warms the sand itself; no circles, symbols, or labels.
 if(h.hits<digsNeeded(h)&&h.id>=0&&sniffReveals(original)){
  // The scent belongs to the buried find, not the latest beak impact.
  const hint=ctx.createRadialGradient(original.x,GROUND-8,1,original.x,GROUND-8,32);
  hint.addColorStop(0,'#fff3bf66');hint.addColorStop(1,'#fff3bf00');
  ctx.fillStyle=hint;ctx.fillRect(original.x-32,GROUND-40,64,64);
 }
});
// Tow rope and wooden cart, with turning wheels and a genuinely stacked load.
line(pip.x-pip.face*24,GROUND-25,cart.x+pip.face*54,GROUND-36,'#9b7746',2);const bounce=Math.abs(cart.v)>15&&!reduced?Math.sin(time*19)*1.7:0;ctx.save();ctx.translate(cart.x,GROUND+bounce);ellipse(0,1,65,8,'#99733e25');for(const wx of[-37,37]){ellipse(wx,-10,18,18,'#8f6c40');ellipse(wx,-10,12,12,'#ccab6b');ctx.save();ctx.translate(wx,-10);ctx.rotate(cart.x/18);for(let j=0;j<6;j++){ctx.rotate(Math.PI/3);line(0,0,12,0,'#88683f',2)}ctx.restore();ellipse(wx,-10,4,4,'#775a35')}path([[-57,-52],[57,-52],[50,-21],[-50,-21]],'#bb874e','#896338',3);line(-52,-38,52,-38,'#e1b371',2);line(-34,-51,-31,-23,'#98713f',3);line(33,-51,31,-23,'#98713f',3);ctx.fillStyle='#f2d39c';ctx.font='9px Georgia';ctx.textAlign='center';ctx.fillText('K. A. S.',0,-28);ctx.restore();
orderedPile().forEach(c=>imageItem(c,treasures[c.tid].shape==='coffin'?70:58));currentCargo().filter(c=>c.status==='ground'||c.status==='fall').forEach(c=>{ellipse(c.x,GROUND+2,18,3,'#a7814722');imageItem(c,50)});
// Soft jute slings hug the finds instead of boxing them in.
for(const c of orderedPile())if(c.secured||c.id===bean.packItem&&bean.state==='pack')drawLashing(c,c.secured?1:Math.min(1,(bean.packTime||0)/packDuration()));
// A little coil on the cart feeds Bean's working rope.
ctx.save();ctx.translate(cart.x-42,GROUND-48);for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,-i*2,8-i,3,0,0,Math.PI*2);ctx.strokeStyle='#b99660';ctx.lineWidth=1.7;ctx.stroke()}ctx.restore();
if(bean.state==='pack'){
 const item=cargo.find(c=>c.id===bean.packItem);
 if(item){const p=Math.min(1,(bean.packTime||0)/packDuration()),face=Math.sign(cart.x-bean.x)||1;
  const bx=bean.x+face*39,by=GROUND-29-bean.lift,slack=(1-p)*19;
  ctx.beginPath();ctx.moveTo(item.x+11,item.y+7);ctx.quadraticCurveTo((item.x+bx)/2,(item.y+by)/2+slack,bx,by);
  ctx.strokeStyle='#775d3b';ctx.lineWidth=2.6;ctx.lineCap='round';ctx.stroke();ctx.strokeStyle='#e1c28d';ctx.lineWidth=1.2;ctx.stroke();
 }
}
// A brass party popper bolted to the cart gives the confetti a visible source.
ctx.save();ctx.translate(cart.x+44,GROUND-45);ctx.rotate(-.35);ctx.fillStyle='#548c85';ctx.fillRect(-6,-21,12,23);ctx.fillStyle='#dabb75';ctx.fillRect(-8,-24,16,5);ctx.restore();
if(time<celebrationUntil){ctx.fillStyle='#fff0c9';ctx.font='bold 18px Georgia';ctx.textAlign='center';ctx.fillText('Collection complete!',cart.x,GROUND-135-orderedPile().length*10)}
for(const p of confetti){ctx.save();ctx.globalAlpha=Math.min(1,p.life);ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.fillStyle=p.color;ctx.fillRect(-3,-2,6,4);ctx.restore()}
const moving=!!pip.moving;if(entering&&entering.elapsed>=.3)drawDescendingPip();else kiwi(pip.x,GROUND-4,1.08,pip.face,false,!!moving,pip.jab);const bf=bean.state==='fetch'?Math.sign((currentCargo().filter(c=>c.status==='ground').sort((a,b)=>Math.abs(a.x-bean.x)-Math.abs(b.x-bean.x))[0]?.x||cart.x)-bean.x)||1:Math.sign(cart.x-bean.x)||1;kiwi(bean.x,GROUND-1-(bean.lift||0)-(time<celebrationUntil&&!reduced?Math.abs(Math.sin((celebrationUntil-time)*7))*12:0),.62,bf,true,!!bean.moving,bean.state==='pack'?(bean.hop?0:bean.settle?.32:.2+.15*Math.sin(time*12)):0);cargo.filter(c=>c.status==='carry').forEach(c=>imageItem(c,45));
particles.forEach(p=>{ctx.globalAlpha=Math.min(1,Math.max(0,p.life/.18));ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);path([[-p.size,-p.size*.4],[p.size*.3,-p.size*.7],[p.size,p.size*.3],[-p.size*.5,p.size*.6]],p.color);ctx.restore()});ctx.globalAlpha=1;ctx.restore();
}
function frame(timestamp){const dt=Math.min(.04,(timestamp-last)/1000||.016);last=timestamp;step(dt);render();requestAnimationFrame(frame)}
function requestPortal(door){
 if(action||entering)return;
 stopWalking();const choices=exits();
 let gate=typeof door==='object'?door:typeof door==='number'?choices.find(g=>g.x===door):null;
 gate=gate||choices.reduce((a,b)=>Math.abs(a.x-pip.x)<Math.abs(b.x-pip.x)?a:b);
 pendingPortal={...gate,target:gate.x===210?250:gate.x-67};pip.target=pendingPortal.target;
 $('#note-label').textContent='WAREHOUSE RUN';$('#note-title').textContent=gate.label;
 $('#note-text').textContent='Pip is running for the exit. Bean will collect and individually secure any remaining finds before the warehouse unloads the cart.';
}
function changeLevel(){
 if(time<celebrationUntil)return;
 const gate=pendingPortal;if(!gate||!currentCargo().every(c=>c.status==='cart'&&c.secured))return;
 checkLevelSuccess();const deposited=currentCargo().length;
 for(const c of currentCargo()){c.status='stored';c.tip=undefined}
 if(level===0&&gate.to===1)returnX=gate.x-67;
 level=gate.to;pip.x=gate.spawn;
 pendingPortal=null;pip.target=null;pip.pokeX=null;pip.face=1;pip.jab=0;action=null;digHeld=false;queuedDig=false;
 cart.x=pip.x-145;cart.v=0;bean={x:pip.x-215,state:'follow',item:null,toss:0};
 camera=Math.max(0,Math.min(worldWidth()-W,pip.x-W*.59));particles=[];spillDistance=0;quietTime=0;sniff=0;
 $('#note-label').textContent='ARRIVED · '+areas[level].name.toUpperCase();
 $('#note-title').textContent=level===2?'Shade. Water. Suspicious flotation devices.':level===3?'The largest tomb. The smallest visitors.':'A fresh cart for a familiar mystery.';
 $('#note-text').textContent=`${deposited} cargo pieces delivered safely to the warehouse. The cart is empty; your discoveries remain in the other-area collections below the manifest.`;
 tone(440,.25);save();updateUI(true);
}
function interior(){
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,level===3?'#201d30':'#172f35');g.addColorStop(.7,level===3?'#493d45':'#344340');g.addColorStop(1,'#75654a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 for(let row=0;row<7;row++)for(let col=-1;col<12;col++){let x=col*135+(row%2)*67-camera*.7%135,y=50+row*56;ctx.strokeStyle='#b3a57518';ctx.lineWidth=2;ctx.strokeRect(x,y,132,53)}
 for(let i=0;i<8;i++){const x=100+i*370-camera;if(x<-120||x>W+120)continue;path([[x-28,GROUND],[x-22,80],[x+23,80],[x+29,GROUND]],'#596052');path([[x-37,78],[x+36,78],[x+30,111],[x-31,111]],'#827c58');line(x-19,129,x+21,129,'#bb9860',6);line(x-20,147,x+22,147,'#498888',9);for(let j=0;j<5;j++){ctx.fillStyle='#b9a16c55';ctx.font='23px Georgia';ctx.textAlign='center';ctx.fillText(['◈','☀','≋','△','⌁'][j],x,200+j*43)}
 const tx=x+93,ty=246;line(tx,ty+13,tx,ty+47,'#99835e',8);const glow=ctx.createRadialGradient(tx,ty,1,tx,ty,112);glow.addColorStop(0,'#f4bb6750');glow.addColorStop(1,'#f4bb6700');ctx.fillStyle=glow;ctx.fillRect(tx-112,ty-112,224,224);ellipse(tx,ty,8,17+Math.sin(time*9+i)*2,'#edb761');ellipse(tx,ty+4,4,10,'#ffe4a0')}
 ctx.fillStyle='#847454';ctx.fillRect(0,GROUND-7,W,H-GROUND+7);line(0,GROUND-7,W,GROUND-7,'#b2a075',3);for(let i=-1;i<12;i++){let x=i*130-camera%130;line(x,GROUND+6,x-30,H,'#564e3b55',2)}line(0,GROUND+73,W,GROUND+73,'#b2a07533',2);
 if(level===3)drawGreatTomb();const altar=2230-camera;if(level===1&&altar>-150&&altar<W+150){path([[altar-95,GROUND-5],[altar-75,GROUND-45],[altar+75,GROUND-45],[altar+95,GROUND-5]],'#b69c64');ctx.fillStyle='#d5b876';ctx.font='15px Georgia';ctx.textAlign='center';ctx.fillText('KEEPER OF EVERYTHING THAT FALLS',altar,165);ctx.drawImage(images.mask,altar-56,190,112,112)}
}
function drawBoundaries(){
 if(level===1||level===3)return;
 // Both ends are closed paths; the doorways remain inside these barriers.
 for(const [x,side] of [[105,-1],[worldWidth()-45,1]]){
  if(x<camera-100||x>camera+W+100)continue;
  const stone=level===1||level===3;
  for(let i=0;i<4;i++){
   const bx=x+side*(i%2)*23,by=GROUND-i*24;
   path([[bx-30,by],[bx-32,by-21],[bx-19,by-31],[bx+24,by-27],[bx+33,by-4]],stone?'#817861':'#bba075',stone?'#aaa080':'#ddc397',2);
  }
  line(x-side*26,GROUND-2,x-side*26,GROUND-78,'#876944',5);
  ctx.fillStyle='#f0d8aa';ctx.fillRect(x-side*26-35,GROUND-88,70,24);
  ctx.fillStyle='#735939';ctx.font='9px sans-serif';ctx.textAlign='center';ctx.fillText('PATH ENDS',x-side*26,GROUND-72);
 }
}
function drawDoors(){for(const gate of exits()){const x=gate.x;if(x<camera-190||x>camera+W+190)continue;
 if(level===0&&gate.to===1){path([[x-173,GROUND-5],[x,GROUND-248],[x+182,GROUND-5]],'#c19a5c','#e5c38a',3);path([[x,GROUND-248],[x+37,GROUND-5],[x+182,GROUND-5]],'#a5804b')}
 ctx.fillStyle=gate.to===0?'#eac58b':gate.to===2?'#568d7d':'#253638';ctx.fillRect(x-38,GROUND-95,76,91);path([[x-48,GROUND-5],[x-48,GROUND-108],[x+48,GROUND-108],[x+48,GROUND-5]],null,'#c0a36b',9);
 ctx.fillStyle='#e8cf92';ctx.textAlign='center';ctx.font='23px Georgia';ctx.fillText(gate.to===2?'≈':gate.to===3?'↓':'↗',x,GROUND-53);ctx.font='10px monospace';ctx.fillStyle=level===1||level===3?'#f8dfab':'#634e30';ctx.fillText(gate.label,x,GROUND+28);
 // Every route includes a small warehouse drop-off point.
 ctx.fillStyle='#ac8150';ctx.fillRect(x+65,GROUND-36,33,30);ctx.strokeStyle='#efd09b';ctx.strokeRect(x+65,GROUND-36,33,30);line(x+65,GROUND-36,x+98,GROUND-6,'#efd09b',2);ctx.font='7px sans-serif';ctx.fillText('DEPOT',x+81,GROUND-43);
 }}
function oasisScene(){
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#b8d6c6');g.addColorStop(.65,'#e9d6aa');g.addColorStop(1,'#b5af7e');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ellipse(850-camera*.05,95,43,43,'#fff0c4');
 for(let i=0;i<5;i++){let x=i*500-camera*.25;path([[x-190,344],[x+80,243],[x+400,344]],'#cfb887')}
 ellipse(W/2,399,W*.64,65,'#59998e');ellipse(W/2,400,W*.49,45,'#71b4a5');
 for(let i=0;i<32;i++){const x=(i*97-camera*.4+Math.sin(time+i)*4)%(W+100);line(x,380+(i*17)%64,x+22,380+(i*17)%64,'#b6d5b06a',1.5)}
 for(let i=0;i<9;i++){const x=i*370-camera*.6;if(x>-120&&x<W+120){palm(x,440,1.1+(i%3)*.25);for(let j=0;j<5;j++)line(x+50+j*5,453,x+48+j*7,397-j%3*9,'#7d955b',2)}}
 ctx.fillStyle='#cdb57e';ctx.fillRect(0,GROUND-7,W,H-GROUND+7);line(0,GROUND-7,W,GROUND-7,'#e9d59c',3);
 for(let i=0;i<70;i++){const x=((i*127-camera)%(W+30)+W+30)%(W+30);ellipse(x,GROUND+15+(i*29)%150,2,1,'#a6915a55')}
}
function drawGreatTomb(){
 const x=2150-camera;if(x<-450||x>W+450)return;
 path([[x-330,GROUND-8],[x-285,GROUND-57],[x+285,GROUND-57],[x+330,GROUND-8]],'#9d835d');
 ctx.fillStyle='#aa8b54';ctx.fillRect(x-235,240,470,175);ctx.strokeStyle='#d4b775';ctx.lineWidth=5;ctx.strokeRect(x-235,240,470,175);
 for(let i=0;i<9;i++){ctx.fillStyle=i%2?'#4e8181':'#d1ac68';ctx.fillRect(x-224+i*51,247,33,155)}
 ellipse(x,245,235,25,'#ceb57a');ctx.drawImage(images.mask,x-67,282,134,134);
 ctx.font='18px Georgia';ctx.textAlign='center';ctx.fillStyle='#e5cca0';ctx.fillText('THE FIRST KEEPER OF LOST THINGS',x,151);
 for(const offset of[-330,330]){ctx.drawImage(images.anubis,x+offset-60,230,120,200)}
}
load();camera=Math.max(0,Math.min(worldWidth()-W,pip.x-W*.59));updateUI(true);requestAnimationFrame(frame);setTimeout(()=>$('#speech').style.opacity=0,6500);
