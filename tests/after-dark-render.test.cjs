// Exercise the actual painted renderer with a loaded atlas and recorded draw calls.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
let callback,time=0,draws=[];const events={},els={};
let transform=[1,0,0,1,0,0],stack=[];
const context=new Proxy({
 globalAlpha:1,
 save(){stack.push({transform:[...transform],alpha:this.globalAlpha});},restore(){const state=stack.pop();transform=state.transform;this.globalAlpha=state.alpha;},
 translate(x,y){transform[4]+=transform[0]*x+transform[2]*y;transform[5]+=transform[1]*x+transform[3]*y;},
 scale(x,y){transform[0]*=x;transform[1]*=x;transform[2]*=y;transform[3]*=y;},
 rotate(a){const [x,y,u,v]=transform,c=Math.cos(a),s=Math.sin(a);transform[0]=x*c+u*s;transform[1]=y*c+v*s;transform[2]=u*c-x*s;transform[3]=v*c-y*s;},
 drawImage(...args){if(args.length===9){const x=args[5]+args[7]/2,y=args[6]+args[8]/2;args.world={x:transform[0]*x+transform[2]*y+transform[4],y:transform[1]*x+transform[3]*y+transform[5]};if(args[0].kiwiPart==='beak'){const tx=args[5]+args[0].tip[0]/args[0].width*args[7],ty=args[6]+args[0].tip[1]/args[0].height*args[8];args.tip={x:transform[0]*tx+transform[2]*ty+transform[4],y:transform[1]*tx+transform[3]*ty+transform[5]};const rx=args[5]+args[0].root[0]/args[0].width*args[7],ry=args[6]+args[0].root[1]/args[0].height*args[8];args.root={x:transform[0]*rx+transform[2]*ry+transform[4],y:transform[1]*rx+transform[3]*ry+transform[5]};}args.transform=[...transform];args.alpha=this.globalAlpha;}draws.push(args);},
 createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})
},{get:(o,k)=>o[k]??(()=>{})});
function el(id){return els[id]??={style:{},textContent:'',innerHTML:'',open:false,tagName:id==='#game'?'CANVAS':'BUTTON',handlers:{},addEventListener(k,f){this.handlers[k]=f;},setAttribute(){},focus(){},setPointerCapture(){},getContext:()=>context,getBoundingClientRect:()=>({left:0,top:0,width:1100,height:680}),showModal(){this.open=true;},close(){this.open=false;}};}
class LoadedImage{naturalWidth=400;naturalHeight=400;complete=true;set src(value){this.path=value;if(value.endsWith('ground-stick.png'))this.naturalHeight=80;this.onload?.();}}
const makeLayer=()=>({getContext:()=>new Proxy({drawImage(){},getImageData(x,y,w,h){const data=new Uint8ClampedArray(w*h*4);for(let i=3;i<data.length;i+=4)data[i]=255;
// A stray opaque speck below the stick must not become its contact edge.
if(x===0&&y===100){data.fill(0);for(let j=20;j<80;j++)for(let i=20;i<80;i++)data[(j*w+i)*4+3]=255;data[(95*w+95)*4+3]=255;}
return {data};}},{get:(o,k)=>o[k]??(()=>{})})});
const w={addEventListener:(k,f)=>events[k]=f};
vm.runInNewContext(fs.readFileSync('games/kiwi-after-dark/game.js','utf8'),{document:{querySelector:el,createElement:makeLayer},window:w,Image:LoadedImage,localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,console});
function advance(seconds){for(let i=0;i<Math.ceil(seconds*60);i++){time+=1000/60;draws=[];callback(time);}}
const key=(type,code)=>events[type]({code,repeat:false,target:el('#game'),preventDefault(){}});
const feet=()=>draws.filter(d=>d.length===9&&d[1]===300&&d[2]===300);
advance(.02);el('#begin').onclick();advance(2);
const initialExploration=draws.filter(d=>d[0].path?.endsWith('lawn-exploration.png'));
assert(initialExploration.length>0,'Exploration art is loaded');
assert(!initialExploration.some(d=>d[1]===0&&d[2]===0),'The seedpod is fully concealed');
assert(!initialExploration.some(d=>d[1]===267&&d[2]===200),'The paper cup is fully concealed');
const ballIndex=draws.findIndex(d=>d[0].path?.endsWith('lawn-sprites-v2.png')&&d[1]===100&&d[2]===200);
const coverIndex=draws.findIndex(d=>d[1]===0&&d[2]===300&&Math.abs(d.world?.x-1014)<1);
assert(ballIndex>=0&&coverIndex>ballIndex,'Foreground leaves render in front of the ball');
let idle=feet();assert.equal(idle.length,2);assert(Math.abs(idle[0][6]-idle[1][6])<.1);
key('keydown','KeyD');let raisedLeft=false,raisedRight=false;
for(let i=0;i<40;i++){advance(1/60);const f=feet();assert.equal(f.length,2);raisedLeft ||= f[0][6]<f[1][6]-.5;raisedRight ||= f[1][6]<f[0][6]-.5;}
assert(raisedLeft&&raisedRight,'Both feet must take turns lifting during a walk');
key('keyup','KeyD');advance(1);idle=feet();assert(Math.abs(idle[0][6]-idle[1][6])<.1,'Feet settle when the kiwi stops');
const planted=feet().map(d=>d.world),bodyBefore=draws.find(d=>d[1]===300&&d[2]===200).world;
key('keydown','Space');key('keyup','Space');advance(.035);const drawnBeak=()=>draws.find(d=>d[0].kiwiPart==='beak');const withdrawn=drawnBeak().tip;advance(.1);
const during=feet();for(let i=0;i<2;i++)assert(Math.hypot(during[i].world.x-planted[i].x,during[i].world.y-planted[i].y)<.1,'Poking leaves both feet planted');
const jab=drawnBeak();assert(jab.tip.x>withdrawn.x+12,'The beak tip thrusts forward independently of the torso');const torso=draws.find(d=>d[0].kiwiPart==='body');assert(torso.transform[4]<w.kiwiSnapshot().kiwi.x+4,'The back only gives a small supporting lean');const jabbedTip={...jab.tip};advance(.14);assert(drawnBeak().tip.x<jabbedTip.x-8,'The beak visibly recoils after contact');
key('keyup','Space');advance(.8);
const stick=draws.find(d=>d[0].path?.endsWith('ground-stick.png'));assert(stick&&stick[8]<stick[7]/2,'Use the flat ground-plane twig for the resting stick');assert(!w.kiwiSnapshot().spots.some(s=>s.id==='fence'),'Removed gate is not an interaction target');
assert(draws.some(d=>d[1]===0&&d[2]===300),'Painted bushes are present');
el('#game').handlers.pointerdown({clientX:340,clientY:540,pointerId:1,preventDefault(){}});el('#game').handlers.pointerup({});advance(3);assert.equal(w.kiwiSnapshot().carried,null,'Approaching the twig does not pick it up');el('#game').handlers.pointerdown({clientX:340,clientY:540,pointerId:1,preventDefault(){}});el('#game').handlers.pointerup({});advance(.1);
assert.equal(w.kiwiSnapshot().carried,'stick','The resting twig is still picked up with the beak');
assert(!draws.some(d=>d[0].path?.endsWith('ground-stick.png')),'The ground twig disappears on pickup');
const held=draws.find(d=>d[0].path?.endsWith('small-treasures.png')&&d[1]===0&&d[2]===0);assert(held&&held[7]<=34,'The held twig uses its matching painted treasure asset');
console.log('PASS: fully concealed props and foreground cover, planted feet and forward poke, walking feet, flat ground twig, beak pickup removes ground art, alpha bounds, and foliage.');
// A reversal must pass through painted turning poses without flattening the body.
const bodyDraws=()=>draws.filter(d=>d[0].path?.endsWith('kiwi-turning.png')||(d[0].path?.endsWith('lawn-sprites-v2.png')&&d[1]===300&&d[2]===200));
key('keydown','KeyD');advance(.8);key('keyup','KeyD');advance(.7);
key('keydown','KeyA');let turningFrames=0,frontFrames=0;
for(let i=0;i<48;i++){
 advance(1/60);const poses=bodyDraws();assert.equal(poses.length,1,'A turn draws one solid bird, with no overlapping faces or beaks');
 for(const d of poses){const m=d.transform;assert(Math.abs(m[0]*m[3]-m[1]*m[2])>.99,'Turning never squeezes or collapses the bird');assert.equal(d.alpha,1,'Turning never fades the entire bird');}
 if(poses.some(d=>d[0].path?.endsWith('kiwi-turning.png')))turningFrames++;
 if(poses.some(d=>d[0].path?.endsWith('kiwi-turning.png')&&d[1]===133))frontFrames++;
 assert.equal(w.kiwiSnapshot().carried,'stick','Turning retains the find in the beak');
}
assert(turningFrames>=15&&frontFrames>=5,'A visible pivot passes through the intermediate and front poses');
assert(bodyDraws().some(d=>d[0].path?.endsWith('lawn-sprites-v2.png')&&d.transform[0]<0),'The turn settles into the left profile');
key('keyup','KeyA');advance(.7);key('keydown','KeyW');advance(1);
assert(!bodyDraws().some(d=>d[0].path?.endsWith('kiwi-turning.png')),'Vertical travel retains its facing without repeated turns');
key('keyup','KeyW');advance(.7);key('keydown','KeyD');advance(.24);key('keyup','KeyD');key('keydown','KeyA');advance(.8);key('keyup','KeyA');advance(.7);
assert.equal(w.kiwiSnapshot().carried,'stick');
assert.equal(bodyDraws().length,1,'An interrupted pivot still draws only one bird');assert(bodyDraws().every(d=>d.alpha===1&&Math.abs(d.transform[0]*d.transform[3]-d.transform[1]*d.transform[2])>.99),'An interrupted pivot also keeps its full opaque body volume');
console.log('PASS: painted intermediate/front turn poses, full body volume, left/right settling, vertical-facing stability, interrupted pivots, and beak carry through turns.');
// Rapid direction changes retain a single opaque, consistently anchored bird.
for(const [code,seconds] of [['KeyD',.07],['KeyA',.11],['KeyD',.15],['KeyA',.08],['KeyD',.6],['KeyA',.6]]){
 key('keydown',code);
 for(let frame=0;frame<Math.ceil(seconds*60);frame++){
  advance(1/60);const poses=bodyDraws();assert.equal(poses.length,1);const d=poses[0];assert.equal(d.alpha,1);assert(Math.abs(d.world.x-w.kiwiSnapshot().kiwi.x)<1,'The torso stays centered over the feet through every pose');assert.equal(feet().length,2);
  const profile=d[0].path.endsWith('lawn-sprites-v2.png'),index=profile?0:Math.round(d[1]/(400/3)),tipX=profile?397.4:Math.round(index*400/3)+[.989,.496,.011][index]*133,tipY=profile?281.8:[.766,.789,.766][index]*400;
  const x=d[5]+(tipX-d[1])/d[3]*d[7],y=d[6]+(tipY-d[2])/d[4]*d[8],m=d.transform,tip={x:m[0]*x+m[2]*y+m[4],y:m[1]*x+m[3]*y+m[5]},find=draws.find(d=>d[0].path?.endsWith('small-treasures.png'));
  assert(Math.hypot(find.world.x-tip.x,find.world.y-tip.y)<6,'The treasure remains at the single visible beak tip');
 }
 key('keyup',code);
}
advance(.7);console.log('PASS: no doubled or faded birds, stable torso alignment, two feet and attached treasures during rapid left/right reversals.');

// A lifted foot travels forward; a supporting foot holds its place on the ground.
for(const [code,sign] of [['KeyD',1],['KeyA',-1]]){
 key('keydown',code);advance(.7);let previous=null,swingSamples=0,plantedSamples=0;
 for(let frame=0;frame<65;frame++){
  advance(1/60);const bird=w.kiwiSnapshot().kiwi,current=feet().map(d=>({x:d.world.x,relativeX:d.world.x-bird.x,lifted:d.world.y+d[8]/2<bird.y+25.999}));
  assert.equal(current.length,2,'Exactly two painted ankle-and-foot sprites are drawn');
  if(previous)for(let i=0;i<2;i++){
   if(current[i].lifted&&previous[i].lifted){assert((current[i].relativeX-previous[i].relativeX)*sign>0,'The airborne foot swings in the direction of walking');swingSamples++;}
   if(!current[i].lifted&&!previous[i].lifted){assert(Math.abs(current[i].x-previous[i].x)<.12,'A planted foot does not skate forward over the grass');plantedSamples++;}
  }
  previous=current;
 }
 assert(swingSamples>15&&plantedSamples>25,'Both swing and support phases are exercised');key('keyup',code);advance(.8);
}
console.log('PASS: exactly two feet, forward airborne steps and planted ground contact when walking right and left.');
// Exercise the orchard's painted resident through its poke response and return to sleep.
vm.runInNewContext(fs.readFileSync('games/kiwi-after-dark/game.js','utf8'),{document:{querySelector:el,createElement:makeLayer},window:w,Image:LoadedImage,localStorage:{getItem:()=>JSON.stringify({night:3,collection:['stick','button','bell','stone','cap','shell'],known:[]}),setItem(){}},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,console});
el('#begin').onclick();advance(2);el('#route-west').onclick();advance(12);
assert.equal(w.kiwiSnapshot().area,'orchard');
const hedgehog=()=>draws.find(d=>d[0].path?.endsWith('orchard-hedgehog.png'));
assert.equal(hedgehog()?.[1],0,'The orchard resident starts asleep');
el('#game').handlers.pointerdown({clientX:730,clientY:525,pointerId:1,preventDefault(){}});el('#game').handlers.pointerup({});advance(10);
el('#game').handlers.pointerdown({clientX:800,clientY:525,pointerId:1,preventDefault(){}});el('#game').handlers.pointerup({});advance(.1);
assert.equal(hedgehog()?.[1],200,'A poke makes the hedgehog tuck its nose and curl up');
assert.equal(w.kiwiSnapshot().carried,null,'The hedgehog remains an animal, not a collectible');
advance(1.4);assert.equal(hedgehog()?.[1],0,'It settles back to sleep');
console.log('PASS: orchard hedgehog art, poke/curl response, return to sleep, and no beak pickup.');

// Reveal a button: its atlas image is grounded until a separate pickup.
vm.runInNewContext(fs.readFileSync('games/kiwi-after-dark/game.js','utf8'),{document:{querySelector:el,createElement:makeLayer},window:w,Image:LoadedImage,localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,console});el('#begin').onclick();advance(2);
const click=(x,y)=>{el('#game').handlers.pointerdown({clientX:x,clientY:y,pointerId:1,preventDefault(){}});el('#game').handlers.pointerup({});};
click(630,510);advance(10);assert.equal(w.kiwiSnapshot().drops.length,0,'Approaching leaves does not poke them');click(630,510);advance(.1);let drop=w.kiwiSnapshot().drops[0];assert.equal(drop.id,'button');assert.equal(w.kiwiSnapshot().carried,null);
const buttonDraw=()=>draws.find(d=>d[0].path?.endsWith('small-treasures.png')&&d[1]===100&&d[2]===0);
let button=buttonDraw();assert(button,'The real button art appears on discovery');assert.equal(button.world.y+button[8]/2,drop.y+12,'The painted contact edge rests on the grass');const resting={...button.world};advance(1);assert.deepEqual(buttonDraw().world,resting,'Ground treasures do not bob or follow the kiwi');
click(drop.x,drop.y);advance(2);assert.equal(w.kiwiSnapshot().carried,'button');assert.equal(w.kiwiSnapshot().drops.length,0);button=buttonDraw();assert(button,'The picked-up button retains the matching asset');assert(Math.hypot(button.world.x-drop.x,button.world.y-drop.y)>20,'Pickup moves the treasure from the grass to the beak');
el('#home').onclick();advance(12);assert(w.kiwiSnapshot().collection.includes('button'));assert(el('#collection').innerHTML.includes('class="treasure-icon"'),'The shelf displays matching painted treasures');
console.log('PASS: matching painted button on ground, stable grass contact, separate beak pickup, ground removal, and painted collection shelf.');

// Left-facing taps jab with a rigid painted beak, rather than translating the torso.
vm.runInNewContext(fs.readFileSync('games/kiwi-after-dark/game.js','utf8'),{document:{querySelector:el,createElement:makeLayer},window:w,Image:LoadedImage,localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,console});el('#begin').onclick();advance(2);click(490,470);advance(4);key('keydown','KeyA');advance(.15);key('keyup','KeyA');advance(.7);
const leftFeet=feet().map(d=>d.world);key('keydown','Space');key('keyup','Space');advance(.035);let leftBeak=draws.find(d=>d[0].kiwiPart==='beak');const leftRest={...leftBeak.tip},beakLength=Math.hypot(leftBeak.tip.x-leftBeak.root.x,leftBeak.tip.y-leftBeak.root.y);advance(.1);leftBeak=draws.find(d=>d[0].kiwiPart==='beak');assert(leftBeak.tip.x<leftRest.x-12,'The mirrored beak thrusts to the left');assert(Math.abs(Math.hypot(leftBeak.tip.x-leftBeak.root.x,leftBeak.tip.y-leftBeak.root.y)-beakLength)<.01,'The beak rotates and moves without growing or telescoping');for(let i=0;i<2;i++)assert(Math.hypot(feet()[i].world.x-leftFeet[i].x,feet()[i].world.y-leftFeet[i].y)<.1);advance(.3);assert(!draws.some(d=>d[0].kiwiPart==='beak'),'A completed tap restores the normal painted idle pose');
key('keydown','Space');advance(.6);assert(draws.some(d=>d[0].kiwiPart==='beak'),'A held probe retains the independent head and beak pose');key('keyup','Space');advance(.8);assert(!draws.some(d=>d[0].kiwiPart==='beak'),'Releasing a held probe settles the head and beak');
console.log('PASS: right and left beak thrust/recoil, planted feet, small torso support, constant beak length, held probe and return to idle.');

// A turn interrupted by a poke still has just one painted head/beak.
key('keydown','KeyD');advance(.6);key('keyup','KeyD');advance(.7);key('keydown','KeyA');advance(.15);key('keyup','KeyA');key('keydown','Space');
for(let frame=0;frame<30;frame++){
 advance(1/60);const beaks=draws.filter(d=>d[0].kiwiPart==='beak'),bodies=new Set(draws.filter(d=>d[0].kiwiPart==='body').map(d=>d[0]));assert(beaks.length<=1,'Turning during a probe never doubles the beak');assert.equal(bodies.size||bodyDraws().length,1,'Only one body pose is rendered during a turning probe');assert(beaks.every(d=>d.alpha===1));
}
key('keyup','Space');advance(.8);console.log('PASS: a probe during a reversal keeps one opaque body and beak.');

// Fractional strip edges must overlap instead of showing lawn-colored seams.
vm.runInNewContext(fs.readFileSync('games/kiwi-after-dark/game.js','utf8'),{document:{querySelector:el,createElement:makeLayer},window:w,Image:LoadedImage,localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,console});el('#begin').onclick();advance(2);click(630,510);advance(10);click(630,510);advance(.7);drop=w.kiwiSnapshot().drops[0];click(drop.x,drop.y);advance(1);assert.equal(w.kiwiSnapshot().carried,'button');
for(const code of ['KeyD','KeyA']){
 key('keydown',code);advance(.06);key('keyup',code);advance(.8);el('#game').handlers.pointerdown({clientX:630,clientY:510,pointerId:1,preventDefault(){}});
 let checked=0;
 for(let frame=0;frame<18;frame++){
  advance(1/60);assert.equal(w.kiwiSnapshot().carried,'button','A blocked poke retains the carried find');
  const strips=draws.filter(d=>d[0].kiwiPart==='body');if(strips.length!==18)continue;
  const vertical=strips[1][1]!==strips[0][1],axis=vertical?5:6,size=vertical?7:8;
  for(let i=1;i<strips.length;i++){assert(strips[i][size]>0,'Neck deformation never folds a strip over');assert(strips[i-1][axis]+strips[i-1][size]-strips[i][axis]>.5,'Adjacent body strips overlap enough to seal subpixel seams');}checked++;
 }
 assert(checked>8,'The withdrawal, thrust and recoil all render the sealed body');el('#game').handlers.pointerup({});advance(.8);
}
console.log('PASS: deliberate carried-item pokes keep their treasure and seal body-strip seams during withdrawal, thrust and recoil.');

// Verify the largest held-probe deformation for every painted view, without changing production APIs.
vm.runInNewContext(fs.readFileSync('games/kiwi-after-dark/game.js','utf8').replace('ui();requestAnimationFrame(frame);','window.seamCheck=(turn,reach)=>{gait.turn=turn;pokePower=1;turningBody(reach)};ui();requestAnimationFrame(frame);'),{document:{querySelector:el,createElement:makeLayer},window:w,Image:LoadedImage,localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,console});
for(const turn of [0,.25,.5,.75,1])for(const reach of [-2,18,39]){
 draws=[];w.seamCheck(turn,reach);const strips=draws.filter(d=>d[0].kiwiPart==='body'),vertical=!!strips[0][0].pose.includes('right')||strips[0][0].pose==='quarter-left',axis=vertical?5:6,size=vertical?7:8;
 assert.equal(strips.length,18);for(let i=1;i<18;i++){assert(strips[i][size]>0);assert(strips[i-1][axis]+strips[i-1][size]-strips[i][axis]>.5,'All views remain sealed under maximum pressure');}
}
console.log('PASS: sealed, positive-size deformation strips in all five views from withdrawal to maximum held pressure.');

// A shelf save must not redraw the original collected twig on a fresh visit.
vm.runInNewContext(fs.readFileSync('games/kiwi-after-dark/game.js','utf8'),{document:{querySelector:el,createElement:makeLayer},window:w,Image:LoadedImage,localStorage:{getItem:()=>JSON.stringify({night:2,collection:['stick'],known:[]}),setItem(){}},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,console});
el('#begin').onclick();advance(.2);
assert(!draws.some(d=>d[0].path?.endsWith('ground-stick.png')),'A collected twig has no original ground art after reload');
assert(w.kiwiSnapshot().spots.find(s=>s.id==='stick').done);
console.log('PASS: collected stick remains absent from the painted lawn after reload.');

// Flat dirt and the hole cannot cover a kiwi from any approach or at the centre.
vm.runInNewContext(fs.readFileSync('games/kiwi-after-dark/game.js','utf8').replace('ui();requestAnimationFrame(frame);','window.groundLayerCheck=(x,y)=>{kiwi.x=x;kiwi.y=y;gardenContents(true)};ui();requestAnimationFrame(frame);'),{document:{querySelector:el,createElement:makeLayer},window:w,Image:LoadedImage,localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,console});
for(const [x,y,sx,sy] of [[390,400,0,200],[430,215,0,200],[886,225,300,0]])for(const [dx,dy] of [[0,-30],[0,0],[0,30],[-25,0],[25,0]]){
 draws=[];w.groundLayerCheck(x+dx,y+dy);
 const soil=draws.findIndex(d=>d[0].path?.endsWith('lawn-sprites-v2.png')&&d[1]===sx&&d[2]===sy&&Math.abs(d.world.x-x)<1);
 const firstFoot=draws.findIndex(d=>d[0].path?.endsWith('lawn-sprites-v2.png')&&d[1]===300&&d[2]===300);
 assert(soil>=0&&firstFoot>soil,'The soil patches and suspicious hole render underneath the feet and body from every approach');
}
console.log('PASS: wiggly soil, dry dirt and suspicious hole remain under the kiwi from above, below, both sides and the centre.');

// Rock contact and its treasure reveal do not emit splash-like particle sprays.
vm.runInNewContext(fs.readFileSync('games/kiwi-after-dark/game.js','utf8').replace('ui();requestAnimationFrame(frame);','window.rockEffects=()=>particles.map(p=>({...p}));window.rockWords=()=>bursts.map(b=>b.text);ui();requestAnimationFrame(frame);'),{document:{querySelector:el,createElement:makeLayer},window:w,Image:LoadedImage,localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,console});
el('#begin').onclick();advance(2);
const rockClick=(x,y)=>{el('#game').handlers.pointerdown({clientX:x,clientY:y,pointerId:1,preventDefault(){}});el('#game').handlers.pointerup({});};
rockClick(695,390);advance(5);rockClick(765,390);advance(.02);
assert(w.kiwiSnapshot().spots.find(s=>s.id==='rock').done,'The rock still rolls');
assert(w.kiwiSnapshot().drops.some(d=>d.id==='stone'),'The treasure still appears on the ground');
assert.equal(w.kiwiSnapshot().carried,null);assert.equal(w.rockEffects().length,0,'First contact and treasure reveal produce no spray');
advance(1.4);rockClick(765,390);advance(.02);assert.equal(w.rockEffects().length,0,'Repeat rock pokes produce no spray');
console.log('PASS: first and repeat rock pokes are spray-free while rolling and grounded treasure discovery remain.');

const looseStone=w.kiwiSnapshot().drops.find(d=>d.id==='stone'),rolledRock=w.kiwiSnapshot().solids.find(s=>s.id==='rock');
assert(((looseStone.x-rolledRock.x)/rolledRock.rx)**2+((looseStone.y-rolledRock.y)/rolledRock.ry)**2>1.5,'The round pebble is well clear of the rolled rock');
assert(!w.rockWords().includes('tink'),'No tink text crowds a waiting treasure');
rockClick(looseStone.x,looseStone.y);advance(.02);assert.equal(w.kiwiSnapshot().carried,'stone','A nearby click directly picks up the unobstructed round pebble');assert.equal(w.kiwiSnapshot().drops.length,0);
vm.runInNewContext(fs.readFileSync('games/kiwi-after-dark/game.js','utf8'),{document:{querySelector:el,createElement:makeLayer},window:w,Image:LoadedImage,localStorage:{getItem:()=>JSON.stringify({night:2,collection:['stick'],known:[],loose:{patch:[{id:'stone',x:797,y:416},{id:'cap',x:900,y:500}]}}),setItem(){}},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,console});
const migrated=w.kiwiSnapshot().drops.find(d=>d.id==='stone');assert.equal(migrated.x,710);assert.equal(migrated.y,425);assert.equal(w.kiwiSnapshot().drops.find(d=>d.id==='cap').x,900,'An intentionally set-down treasure keeps its position');
console.log('PASS: clear rock treasure placement, no obstructing tink text, direct nearby pickup, and existing-save reveal migration.');

// The bell is a separate, reachable find, with no spray on reveal or pickup.
vm.runInNewContext(fs.readFileSync('games/kiwi-after-dark/game.js','utf8').replace('ui();requestAnimationFrame(frame);','window.holeEffects=()=>particles.map(p=>({...p}));ui();requestAnimationFrame(frame);'),{document:{querySelector:el,createElement:makeLayer},window:w,Image:LoadedImage,localStorage:{getItem:()=>JSON.stringify({night:2,collection:[],known:[]}),setItem(){}},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,console});
el('#begin').onclick();advance(2);
const holeClick=(x,y)=>{el('#game').handlers.pointerdown({clientX:x,clientY:y,pointerId:1,preventDefault(){}});el('#game').handlers.pointerup({});};
holeClick(886,195);advance(8);holeClick(886,225);advance(.02);
const bell=w.kiwiSnapshot().drops.find(d=>d.id==='bell');assert(bell);assert.equal(bell.x,831);assert.equal(bell.y,245);assert.equal(w.kiwiSnapshot().carried,null,'Reveal leaves the bell on the ground');assert.equal(w.holeEffects().length,0,'The hole and bell reveal emit no spray');
holeClick(886,225);advance(.02);assert.equal(w.kiwiSnapshot().carried,null,'A repeat source poke does not pick up the bell');assert.equal(w.holeEffects().length,0);
holeClick(bell.x,bell.y+32);advance(.02);assert.equal(w.kiwiSnapshot().carried,'bell','Clicking the nearby bell name picks it up');assert.equal(w.kiwiSnapshot().drops.length,0);assert.equal(w.holeEffects().length,0,'Bell pickup has no spray');
vm.runInNewContext(fs.readFileSync('games/kiwi-after-dark/game.js','utf8'),{document:{querySelector:el,createElement:makeLayer},window:w,Image:LoadedImage,localStorage:{getItem:()=>JSON.stringify({night:2,collection:[],known:[],loose:{patch:[{id:'bell',x:918,y:251}]}}),setItem(){}},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,console});
assert.equal(w.kiwiSnapshot().drops[0].x,831);assert.equal(w.kiwiSnapshot().drops[0].y,245,'Earlier bell reveals migrate to the clear position');
console.log('PASS: reachable bell reveal, separate pickup through its visible name, repeat-source protection, no reveal/pickup spray, and existing-save migration.');

// Banking follows the rendered beak, not the collision-blocked body centre.
let bankSaves=[];
const bankHook=`window.bankPose=(x,y,turn,reach=0,mode='active',wet=false)=>{
 started=mode!=='welcome';ended=mode==='ended';transition=mode==='transition'?{}:null;area=mode==='elsewhere'?'pond':'patch';
 kiwi.x=x;kiwi.y=y;kiwi.angle=turn*Math.PI;gait.turn=turn;gait.amount=0;gait.phase=0;stopWaddle();destination=null;
 charge={at:now,target:null};pokeAt=now-.14;pokePower=1;probeLean=reach-27;pokeTarget=null;wetUntil=wet?now+2:0;
 carried='bell';saved.collection=[];kiwiDraw();
};window.bankMask=(opaque=true)=>{painted.cells[0]={x:0,y:0,w:190,h:137};painted.homeMask=new Uint8ClampedArray(190*137*4);if(opaque)painted.homeMask.fill(255)};
window.bankRepeat=()=>kiwiDraw();ui();requestAnimationFrame(frame);`;
vm.runInNewContext(fs.readFileSync('games/kiwi-after-dark/game.js','utf8').replace('ui();requestAnimationFrame(frame);',bankHook),{document:{querySelector:el,createElement:makeLayer},window:w,Image:LoadedImage,localStorage:{getItem:()=>null,setItem:(k,v)=>bankSaves.push(JSON.parse(v))},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,Uint8ClampedArray,bankSaves,console});
// A rectangular painted test silhouette lets us independently check the rendered segment.
w.bankMask();
for(const [x,y,turn] of [[82,284,0],[292,318,1],[171,269,.5],[171,367,.5]])for(const reach of [0,27,39])for(const wet of [false,true]){
 draws=[];w.bankPose(x,y,turn,reach,'active',wet);
 const state=w.kiwiSnapshot(),solid=state.solids.find(s=>s.id==='home');
 assert(((x-solid.x)/solid.rx)**2+((y-solid.y)/solid.ry)**2>=1,'Test approaches stay outside the solid house');
 assert.equal(state.carried,null,'Visible beak contact banks from every side, including held and wet poses');assert.deepEqual([...state.collection],['bell']);
 const beak=draws.find(d=>d[0].kiwiPart==='beak');if(beak)assert(beak.tip.x>=73&&beak.tip.x<=269||beak.root.x>=73&&beak.root.x<=269);
 w.bankRepeat();assert.equal(w.kiwiSnapshot().collection.length,1,'Continued contact never duplicates a treasure');
}
for(const mode of ['welcome','ended','transition','elsewhere']){w.bankPose(292,318,1,27,mode);assert.equal(w.kiwiSnapshot().carried,'bell','Inactive play, transitions and other areas cannot bank');}
w.bankPose(292,318,0);assert.equal(w.kiwiSnapshot().carried,'bell','Facing away from the house retains the treasure');
w.bankPose(328,318,1,0);assert.equal(w.kiwiSnapshot().carried,'bell','An idle beak just short of the mound retains the treasure');
w.bankPose(328,318,1,27);assert.equal(w.kiwiSnapshot().carried,null,'Extending the beak into the house banks without moving the body');
w.bankPose(400,318,1,39);assert.equal(w.kiwiSnapshot().carried,'bell','A distant poke cannot bank');
w.bankMask(false);w.bankPose(292,318,1,27);assert.equal(w.kiwiSnapshot().carried,'bell','Transparent corners do not count as house contact');
w.bankMask();bankSaves=[];w.bankPose(292,318,1,27);assert(bankSaves.some(s=>s.collection.includes('bell')&&s.carried===null),'Contact persists the banked treasure and empty beak');
console.log('PASS: automatic beak-contact banking around the solid house, idle/held/wet poses, silhouette transparency, inactive guards, single deposit and persistence.');

// Finds from the leaves rest outside the leaves' pointer target, including older saves.
for(const id of ['button','shell']){
 const collection=id==='shell'?['button']:[];
 vm.runInNewContext(fs.readFileSync('games/kiwi-after-dark/game.js','utf8'),{document:{querySelector:el,createElement:makeLayer},window:w,Image:LoadedImage,localStorage:{getItem:()=>JSON.stringify({night:2,collection,known:[]}),setItem(){}},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,console});
 el('#begin').onclick();advance(2);rockClick(630,510);advance(7);rockClick(630,510);advance(.02);
 const find=w.kiwiSnapshot().drops.find(d=>d.id===id);assert(find);assert.equal(find.x,570);assert.equal(find.y,545);assert(Math.hypot(find.x-630,find.y-510)>53,'The find is beyond the leaf pile hit area');assert.equal(w.kiwiSnapshot().carried,null,'Revealing still leaves the find on the grass');
 rockClick(630,510);advance(.02);assert.equal(w.kiwiSnapshot().carried,null,'Poking the source still rustles the leaves');
 rockClick(find.x,find.y);advance(.02);assert.equal(w.kiwiSnapshot().carried,id,'A separate click picks up the nearby exposed find');assert.equal(w.kiwiSnapshot().drops.length,0);
 vm.runInNewContext(fs.readFileSync('games/kiwi-after-dark/game.js','utf8'),{document:{querySelector:el,createElement:makeLayer},window:w,Image:LoadedImage,localStorage:{getItem:()=>JSON.stringify({night:2,collection,known:[],loose:{patch:[{id,x:662,y:536}]}}),setItem(){}},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,console});
 assert.equal(w.kiwiSnapshot().drops[0].x,570);assert.equal(w.kiwiSnapshot().drops[0].y,545,'Existing leaf reveals move clear on reload');
}
console.log('PASS: button and shell reveal clear of leaves, separate direct pickup, source-poke protection, and older-save migration.');

// Empty grass pokes never snap to a sideways, rearward or distant dandelion.
const reachHook=`window.pokePlacement=(x,y,angle)=>{started=true;ended=false;transition=null;kiwi.x=x;kiwi.y=y;kiwi.angle=angle;stopWaddle();destination=null;charge=null;};window.flowerState=()=>({puffLeft:spots.find(s=>s.id==='dandelion').puffLeft,known:[...saved.known]});ui();requestAnimationFrame(frame);`;
function reachGame(){vm.runInNewContext(fs.readFileSync('games/kiwi-after-dark/game.js','utf8').replace('ui();requestAnimationFrame(frame);',reachHook),{document:{querySelector:el,createElement:makeLayer},window:w,Image:LoadedImage,localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,console});}
for(const [x,y,angle] of [[420,525,0],[425,575,Math.PI],[365,575,0],[420,555,0]]){
 reachGame();w.pokePlacement(x,y,angle);key('keydown','Space');advance(1.1);key('keyup','Space');
 assert.equal(w.flowerState().puffLeft,1,'Off-axis, behind and distant flowers remain untouched through a held poke');assert(!w.flowerState().known.includes('dandelion'));
 assert.equal(w.kiwiSnapshot().kiwi.angle,angle,'An empty poke never auto-turns toward the flower');
}
reachGame();w.pokePlacement(420,575,0);key('keydown','Space');advance(.02);key('keyup','Space');assert(w.flowerState().puffLeft<1,'A close forward poke still boops the dandelion');
reachGame();w.pokePlacement(420,555,0);rockClick(430,550);advance(.02);assert.equal(w.flowerState().puffLeft,1,'Clicking empty grass beside the flower cannot poke it');
rockClick(465,545);advance(.02);assert(w.flowerState().puffLeft<1,'A deliberate nearby click on the flower still works');
console.log('PASS: narrow forward poke reach, no side/rear/distant auto-target or auto-turn, held-poke limits, empty-grass click and deliberate flower contact.');

// Treasure transfers are physical and quiet; droplets belong to water encounters.
const transferHook=`window.transferEffects=(id)=>{
 started=true;ended=false;transition=null;area='patch';kiwi.x=700;kiwi.y=580;kiwi.angle=0;carried=null;particles=[];saved.collection=[];drops.length=0;
 const d={id,x:755,y:580};drops.push(d);applyPoke({...d,drop:true},0);const pickupParticles=particles.length,picked=carried;
 applyPoke(null,0);const setDownParticles=particles.length,resting=drops.find(d=>d.id===id);
 applyPoke({...resting,drop:true},0);deposit(true);return {picked,pickupParticles,setDownParticles,homeParticles:particles.length,banked:saved.collection.includes(id)};
};window.stickEffects=()=>{carried=null;saved.collection=[];particles=[];const s=spots.find(s=>s.id==='stick');s.done=false;applyPoke(s,0);return {carried,particles:particles.length}};ui();requestAnimationFrame(frame);`;
vm.runInNewContext(fs.readFileSync('games/kiwi-after-dark/game.js','utf8').replace('ui();requestAnimationFrame(frame);',transferHook),{document:{querySelector:el,createElement:makeLayer},window:w,Image:LoadedImage,localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,console});
for(const id of ['stick','button','bell','stone','cap','shell','whistle','thimble','acorn','pip','ribbon','cork','spool','label','marble']){
 const effect=w.transferEffects(id);assert.equal(effect.picked,id);assert(effect.banked);assert.equal(effect.pickupParticles,0);assert.equal(effect.setDownParticles,0);assert.equal(effect.homeParticles,0,'Banking also emits no droplet-like puff');
}
assert.equal(w.stickEffects().particles,0,'Picking the original twig emits no generic poke or pickup spray');assert.equal(w.kiwiSnapshot().carried,'stick');
console.log('PASS: all treasure pickups, set-downs, repickups and home deposits are particle-free, including original twig pickup.');
