'use strict';
(() => {
const $=s=>document.querySelector(s), canvas=$('#game'), ctx=canvas.getContext('2d');
const W=1100,H=680, HOME={x:175,y:350}, POKE_REACH=80;
// Separate painted assets keep every interaction in the existing simulation.
const painted={};
if(typeof Image!=='undefined'){
 for(const [id,path] of Object.entries({lawn:'assets/painted/lawn.png',sheet:'assets/painted/lawn-sprites-v2.png',snail:'assets/painted/sleeping-snail-leaf-v2.png',twig:'assets/painted/ground-stick.png',exploration:'assets/painted/lawn-exploration.png',turning:'assets/painted/kiwi-turning.png',hedgehog:'assets/painted/orchard-hedgehog.png',treasures:'assets/painted/small-treasures.png'})){
  const img=new Image();painted[id]=img;
  if(id==='sheet')img.onload=()=>{
   const layer=document.createElement('canvas');layer.width=img.naturalWidth;layer.height=img.naturalHeight;
   const c=layer.getContext('2d');c.drawImage(img,0,0);
   const cells=[];
   for(let n=0;n<16;n++){
    const x=Math.round(n%4*img.naturalWidth/4),y=Math.round(Math.floor(n/4)*img.naturalHeight/4);
    cells.push(paintedBounds(c,x,y,Math.round(img.naturalWidth/4),Math.round(img.naturalHeight/4)));
   }
   painted.cells=cells;
   if(cells[0]){const home=cells[0];painted.homeMask=c.getImageData(home.x,home.y,home.w,home.h).data;}
   painted.profileRig=beakRig(img,3,2,4,4,'right');
  };
  if(id==='exploration')img.onload=()=>{
   const layer=document.createElement('canvas');layer.width=img.naturalWidth;layer.height=img.naturalHeight;
   const c=layer.getContext('2d');c.drawImage(img,0,0);
   painted.explorationCells=Array.from({length:6},(_,n)=>paintedBounds(c,Math.round(n%3*img.naturalWidth/3),Math.round(Math.floor(n/3)*img.naturalHeight/2),Math.round(img.naturalWidth/3),Math.round(img.naturalHeight/2)));
  };
  if(id==='hedgehog')img.onload=()=>{
   const layer=document.createElement('canvas');layer.width=img.naturalWidth;layer.height=img.naturalHeight;
   const c=layer.getContext('2d');c.drawImage(img,0,0);
   painted.hedgehogCells=Array.from({length:2},(_,n)=>paintedBounds(c,Math.round(n*img.naturalWidth/2),0,Math.round(img.naturalWidth/2),img.naturalHeight));
  };
  if(id==='treasures')img.onload=()=>{
   const layer=document.createElement('canvas');layer.width=img.naturalWidth;layer.height=img.naturalHeight;
   const c=layer.getContext('2d');c.drawImage(img,0,0);
   painted.treasureCells=Array.from({length:15},(_,n)=>paintedBounds(c,Math.round(n%4*img.naturalWidth/4),Math.round(Math.floor(n/4)*img.naturalHeight/4),Math.round(img.naturalWidth/4),Math.round(img.naturalHeight/4)));
  };
  if(id==='turning')img.onload=()=>{
   const layer=document.createElement('canvas');layer.width=img.naturalWidth;layer.height=img.naturalHeight;
   const c=layer.getContext('2d');c.drawImage(img,0,0);
   painted.turnCells=Array.from({length:3},(_,n)=>paintedBounds(c,Math.round(n*img.naturalWidth/3),0,Math.round(img.naturalWidth/3),img.naturalHeight));
   painted.turnRigs=['quarter-right','front','quarter-left'].map((kind,n)=>beakRig(img,n,0,3,1,kind));
  };
  if(id==='snail'||id==='twig')img.onload=()=>{
   const layer=document.createElement('canvas');layer.width=img.naturalWidth;layer.height=img.naturalHeight;
   const c=layer.getContext('2d');c.drawImage(img,0,0);
   painted[id+'Bounds']=paintedBounds(c,0,0,img.naturalWidth,img.naturalHeight);
  };
  img.src=path;
 }
}
// Rig the existing painting in memory: the beak keeps its painted shape and length.
// A small deformation around the head supplies neck movement while the back stays still.
function beakRig(img,col,row,cols,rows,kind){
 const w=Math.round(img.naturalWidth/cols),h=Math.round(img.naturalHeight/rows),x=Math.round(col*img.naturalWidth/cols),y=Math.round(row*img.naturalHeight/rows);
 const shapes={
  right:{root:[.798,.56],tip:[.974,.818],polygon:[[.796,.529],[.833,.542],[.984,.813],[.974,.831],[.753,.586],[.766,.553]],face:1},
  'quarter-right':{root:[.845,.544],tip:[.989,.766],polygon:[[.84,.502],[.873,.518],[.997,.754],[.991,.782],[.804,.583],[.794,.548]],face:1},
  front:{root:[.496,.548],tip:[.496,.789],polygon:[[.478,.518],[.512,.519],[.538,.547],[.529,.706],[.514,.783],[.496,.796],[.478,.775],[.45,.548]],face:0}
 };
 const shape=kind==='quarter-left'?{...shapes['quarter-right'],root:shapes['quarter-right'].root.map((v,i)=>i?v:1-v),tip:shapes['quarter-right'].tip.map((v,i)=>i?v:1-v),polygon:shapes['quarter-right'].polygon.map(([u,v])=>[1-u,v]),face:-1}:shapes[kind];
 const body=document.createElement('canvas'),beak=document.createElement('canvas');
 for(const layer of [body,beak]){layer.width=w;layer.height=h;layer.kiwiPart=layer===body?'body':'beak';layer.pose=kind;}
 const cut=c=>{c.beginPath();shape.polygon.forEach(([u,v],i)=>i?c.lineTo(u*w,v*h):c.moveTo(u*w,v*h));c.closePath();};
 const b=body.getContext('2d');b.drawImage(img,x,y,w,h,0,0,w,h);b.globalCompositeOperation='destination-out';cut(b);b.fill();b.globalCompositeOperation='source-over';
 const q=beak.getContext('2d');q.save();cut(q);q.clip();q.drawImage(img,x,y,w,h,0,0,w,h);q.restore();
 const root=shape.root.map((v,i)=>v*(i?h:w)),tip=shape.tip.map((v,i)=>v*(i?h:w));beak.tip=tip;beak.root=root;
 const bodyBounds=paintedBounds(b,0,0,w,h),pixels=b.getImageData(0,0,w,h).data;
 let weight=0,center=0;
 // Anchor each view on the lower torso, rather than on its projecting beak.
 for(let j=Math.round(h*.6);j<Math.round(h*.78);j++)for(let i=0;i<w;i++){
  const a=pixels[(j*w+i)*4+3];if(a<128)continue;weight+=a;center+=i*a;
 }
 return {body,beak,root,tip,face:shape.face,x,y,w,h,bodyBounds,anchorX:weight?center/weight:w/2};
}
function paintedBounds(c,x,y,w,h){
 const data=c.getImageData(x,y,w,h).data;
 // Ignore disconnected alpha specks when finding the object's contact edge.
 const visited=new Uint8Array(w*h),queue=new Int32Array(w*h),parts=[];
 for(let at=0;at<w*h;at++){
  if(visited[at]||data[at*4+3]<128)continue;
  let head=0,tail=1,l=w,t=h,r=-1,b=-1;queue[0]=at;visited[at]=1;
  while(head<tail){
   const q=queue[head++],i=q%w,j=Math.floor(q/w);l=Math.min(l,i);t=Math.min(t,j);r=Math.max(r,i);b=Math.max(b,j);
   for(const next of [i>0?q-1:-1,i<w-1?q+1:-1,j>0?q-w:-1,j<h-1?q+w:-1]){
    if(next>=0&&!visited[next]&&data[next*4+3]>=128){visited[next]=1;queue[tail++]=next;}
   }
  }
  parts.push({l,t,r,b,count:tail});
 }
 const biggest=Math.max(0,...parts.map(part=>part.count));let l=w,t=h,r=-1,b=-1;
 for(const part of parts)if(part.count>=Math.max(16,biggest*.025)){l=Math.min(l,part.l);t=Math.min(t,part.t);r=Math.max(r,part.r);b=Math.max(b,part.b);}
 l=Math.max(0,l-2);t=Math.max(0,t-2);r=Math.min(w-1,r+2);b=Math.min(h-1,b+2);
 return biggest?{x:x+l,y:y+t,w:r-l+1,h:b-t+1}:null;
}
function paintedSprite(n,x,bottom,w,h=w){
 const c=painted.cells?.[n];if(!c)return false;
 const scale=Math.min(w/c.w,h/c.h),dw=n===4?w:c.w*scale,dh=n===4?Math.min(h,w*.28):c.h*scale;
 ctx.drawImage(painted.sheet,c.x,c.y,c.w,c.h,x-dw/2,bottom-dh,dw,dh);return true;
}
function explorationSprite(n,x,bottom,w,h){
 const c=painted.explorationCells?.[n];if(!c)return false;
 const scale=Math.min(w/c.w,h/c.h),dw=c.w*scale,dh=c.h*scale;
 ctx.drawImage(painted.exploration,c.x,c.y,c.w,c.h,x-dw/2,bottom-dh,dw,dh);return true;
}
function explorationSpot(s){
 if(!['seedpod','dandelion','dewleaf','papercup'].includes(s.type))return false;
 ctx.save();
 if(s.type==='seedpod'){
  if(!explorationSprite(s.done?1:0,0,12,68,28))ellipse(0,6,27,8,'#82694c');
  const t=(now-(s.openedAt??-10))/1.8;
  if(s.done&&t>=0&&t<1){
   const x=t*48,y=10+t*19,step=Math.sin(now*50)*2;
   for(let j=-1;j<=1;j++){line(x-4,y+j*3,x-8-step,y+j*5,'#466056',1.4);line(x+3,y+j*3,x+8+step,y+j*5,'#466056',1.4);}
   ellipse(x,y,4,6,'#30493e');ellipse(x,y-4,2.5,3,'#728c61');
  }
 }
 if(s.type==='dandelion'){
  const left=s.puffLeft??1;
  if(painted.explorationCells){explorationSprite(3,0,13,54,67);ctx.globalAlpha=left;explorationSprite(2,0,13,54,67);ctx.globalAlpha=1;}
  else{line(0,12,3,-35,'#8b9f72',2);if(left>0)ellipse(3,-35,12*left,12*left,'#d8d8b4');}
 }
 if(s.type==='dewleaf'){
  if(!explorationSprite(4,0,13,72,32))ellipse(0,7,30,8,'#66856a');
  const t=now-(s.dewAt??-10);
  if(t>=0&&t<.65){for(let i=0;i<5;i++)waterDab(Math.sin(i*6)*(10+t*22),3-Math.sin(t/.65*Math.PI)*24+i*2,1.8,3.5,i,(1-t/.65)*.7,i);}
 }
 if(s.type==='papercup'){
  const t=now-(s.flipAt??-10),b=t>=0&&t<1?Math.sin(t*Math.PI)*(s.flipPower??.45):0;
  ctx.translate(b*30,-b*7);ctx.rotate(b*.9);
  if(!explorationSprite(5,0,13,61,38)){ctx.fillStyle='#c8bea3';ctx.fillRect(-20,-12,40,23);ellipse(-20,0,7,12,'#666753');}
 }
 ctx.restore();return true;
}
function groundStick(x,bottom,w){
 const c=painted.twigBounds;if(!c)return false;
 const h=c.h*w/c.w;
 // The contact shading is part of this ground-plane painting, with no oval below it.
 ctx.drawImage(painted.twig,c.x,c.y,c.w,c.h,x-w/2,bottom-h,w,h);return true;
}
function treasureSprite(id,x,bottom,w,h){
 const n=treasures.findIndex(t=>t.id===id),c=painted.treasureCells?.[n];if(!c)return false;
 const scale=Math.min(w/c.w,h/c.h);
 ctx.drawImage(painted.treasures,c.x,c.y,c.w,c.h,x-c.w*scale/2,bottom-c.h*scale,c.w*scale,c.h*scale);return true;
}
const treasureSizes={stick:[39,14],button:[23,15],bell:[23,21],stone:[26,16],cap:[24,13],shell:[23,19],whistle:[34,12],thimble:[21,18],acorn:[21,17],pip:[14,11],ribbon:[33,17],cork:[25,14],spool:[25,21],label:[34,13],marble:[18,18]};
function drawFind(id,x,y){
 const size=treasureSizes[id];
 if(!(id==='stick'&&groundStick(x,y+12,39))&&!treasureSprite(id,x,y+12,...size))ellipse(x,y+9,size[0]*.3,3,'#9c9773');
 if(started&&!ended&&!transition&&canPoke({x,y})){txt(treasures.find(t=>t.id===id).name,x,y+32,11,'#c4cba7');}
}
function paintedHedgehog(s){
 const cells=painted.hedgehogCells;if(!cells?.every(Boolean))return false;
 const age=now-(s.huffAt??-10),curled=age>=0&&age<1.2;
 const c=cells[curled?1:0],scale=Math.min(83/c.w,53/c.h);
 const breath=Math.sin(now*1.8)*.009;
 ctx.save();ctx.scale(1+breath,1-breath*.5);
 ctx.drawImage(painted.hedgehog,c.x,c.y,c.w,c.h,-c.w*scale/2,14-c.h*scale,c.w*scale,c.h*scale);
 ctx.restore();
 if(!curled){const fade=.25+.18*Math.sin(now*1.7);ctx.save();ctx.globalAlpha=fade;txt('z',16,-43+Math.sin(now*1.7)*2,11,'#b7b99e');ctx.restore();}
 return true;
}
function paintedSpot(s){
 if(isConcealed(s)&&fullyCoveredSpots.has(s.id))return true;
 if(explorationSpot(s))return true;
 if(s.type==='hedgehog'&&paintedHedgehog(s))return true;
 if(s.type==='hose')return true; // The kink belongs to the continuous ground hose.
 if(!painted.cells)return false;
 const n={mushroom:1,rock:2,hole:3,stick:4,leaves:5,snail:6,sprinkler:7,soil:8,clod:8,ball:9,fence:10}[s.type];
 if(n===undefined)return false;
 if(s.type==='stick'){if(s.done)return true;if(groundStick(0,14,76))return true;}
 ctx.save();
 if(s.type==='rock'){const r=s.done?Math.min(1,(now-(s.rollAt??-10))/1.2):0;ctx.translate(r*83,r*43);}
 if(s.type==='snail'&&s.done)ctx.translate(Math.sin(now*.8)*9,0);
 const size={mushroom:[79,65],rock:[67,48],hole:[55,32],stick:[76,24],leaves:[80,43],snail:[62,48],sprinkler:[43,44],soil:[65,37],clod:[62,36],ball:[44,44],fence:[72,53]}[s.type];
 const bottom=14;
 if(!['soil','clod','hole','stick'].includes(s.type))ellipse(0,bottom-1,size[0]*.4,s.type==='stick'?2:3,'#153b304d');
 if(s.type==='rock'&&s.done){const r=Math.min(1,(now-(s.rollAt??-10))/1.2);ctx.translate(0,-8);ctx.rotate(r*2);ctx.translate(0,8);}
 if(s.type==='ball'){const b=Math.max(0,1-(now-(s.bounceAt??-10))/1.2)*(s.bouncePower??.45);ctx.translate(Math.sin(now*20)*b*12,-Math.abs(Math.sin(now*10))*b*24);}
 if(s.type==='snail'&&painted.snailBounds){
  const c=painted.snailBounds,scale=Math.min(size[0]/c.w,size[1]/c.h);
  ctx.drawImage(painted.snail,c.x,c.y,c.w,c.h,-c.w*scale/2,bottom-c.h*scale,c.w*scale,c.h*scale);
 }else paintedSprite(n,0,bottom,...size);
 if(s.type==='soil'&&!s.done){ctx.strokeStyle='#b6987b';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-8,0);ctx.quadraticCurveTo(0,-7+Math.sin(now*3)*3,8,0);ctx.stroke();}
 if(s.type==='clod'&&(lawn.dug||s.done))ellipse(0,4,s.done?18:8,6,'#393629');
 if(s.type==='hole'&&s.done){ellipse(-6,4,2,2,'#c2c78e');ellipse(5,4,2,2,'#c2c78e');}
 if(s.type==='snail'&&!s.done)txt('z',25,-31+Math.sin(now)*3,13,'#9bb395');
 ctx.restore();return true;
}

const treasures=[{id:'stick',name:'Very good stick',icon:'╱',desc:'A very good stick. No further questions.'},{id:'button',name:'Lost button',icon:'⊙',desc:'A moon with four tiny windows.'},{id:'bell',name:'Tiny bell',icon:'♧',desc:'A small noise you can own.'},{id:'stone',name:'Round pebble',icon:'●',desc:'An egg with no ambition.'},{id:'cap',name:'Bottle cap',icon:'✺',desc:'A crown for somebody extremely small.'},{id:'shell',name:'Empty shell',icon:' spiral',desc:'A house. The tenant has moved out.'}];
const firstTreasures=treasures.map(t=>t.id);
treasures.push({id:'whistle',name:'Reed whistle',icon:'Ⅱ',desc:'A reed with one extremely strong opinion.'},{id:'thimble',name:'Tiny thimble',icon:'∩',desc:'A hat for the end of your beak.'},{id:'acorn',name:'Polished acorn',icon:'◆',desc:'A tree, still in its original packaging.'});
treasures.push(
{id:'pip',name:'Heart-shaped pip',icon:'♥',desc:'A very small apple with very big plans.'},
{id:'ribbon',name:'Faded ribbon',icon:'⋈',desc:'A formal occasion for your beak.'},
{id:'cork',name:'Bottle cork',icon:'▰',desc:'A tiny log that has retired from bottling.'},
{id:'spool',name:'Wooden spool',icon:'↕',desc:'A wheel. An axle. Absolutely no vehicle.'},
{id:'label',name:'Plant label',icon:'▱',desc:'It says CARROTS. You cannot verify this.'},
{id:'marble',name:'Blue marble',icon:'◉',desc:'A pocket-sized planet. Beak-sized, actually.'});
const areaOrder=['patch','pond','orchard','shed'];
const areaNames={patch:'The Moonlit Lawn',pond:'Reedwater Hollow',orchard:'Windfall Orchard',shed:'The Midnight Potting Shed'};
const areaFinds={patch:firstTreasures,pond:['whistle','thimble','acorn'],orchard:['pip','ribbon','cork'],shed:['spool','label','marble']};
function areaOpen(name){return name==='patch'||(areaOrder.includes(name)&&unlocked());}
const unlocked=()=>firstTreasures.every(id=>saved.collection.includes(id));
let area='patch',returningHome=false,transition=null;
let saved={night:1,collection:[],known:[]};try{const s=JSON.parse(localStorage.getItem('kiwi-night-v1'));if(s&&Number.isInteger(s.night)&&s.night>0&&Array.isArray(s.collection)&&Array.isArray(s.known))saved={night:s.night,collection:s.collection.filter(x=>treasures.some(t=>t.id===x)),known:s.known.filter(x=>typeof x==='string'),carried:treasures.some(t=>t.id===s.carried)&&!s.collection.includes(s.carried)?s.carried:null,loose:s.loose};}catch{}
saved.lawn={};try{const v=JSON.parse(localStorage.getItem('kiwi-night-v1'));for(const [id,n] of Object.entries(v?.lawn||{}))if(Number.isInteger(n)&&n>=0)saved.lawn[id]=Math.min(n,99);}catch{}
let diggingAt=-10;let lawn={spraying:false,wet:false,dug:false,splashes:0,hoseFreedAt:null},wetUntil=0,splashAt=-10;
let hoverPoint=null,pokeTarget=null;
let started=false,ended=false,sound=false,audio,now=0,last=0,keys=new Set(),destination=null,charge=null,sniffAt=-10,pokeAt=-10,pokePower=0,probeLean=0,wiggleAt=-10,surpriseAt=-10,snacks=0,nightPokes=0,nightNew=0,carried=saved.carried||null,particles=[],drops=[],ripples=[],bursts=[],walk=0;
const kiwi={x:HOME.x+40,y:HOME.y+30,angle:0};
const gait={vx:0,vy:0,phase:0,amount:0,face:1,turn:0};
function stopWaddle(){gait.vx=0;gait.vy=0;}
function advanceGait(dt,distance=0){
 const facing=Math.cos(kiwi.angle);
 // Direction has a dead band for vertical travel; the body never scales through zero.
 if(Math.abs(facing)>.3)gait.face=facing>=0?1:-1;
 const target=gait.face===1?0:1,previous=gait.turn;
 gait.turn+=clamp(target-gait.turn,-dt/.38,dt/.38);
 const pivoting=Math.abs(gait.turn-previous)>.0001;
 gait.phase+=distance*.105+(pivoting?dt*9:0);
 const speed=Math.hypot(gait.vx,gait.vy),blend=1-Math.exp(-14*dt);
 gait.amount+=(Math.max(Math.min(1,speed/125),pivoting?.42:0)-gait.amount)*blend;
}

const patchSpots=[
{id:'worm',x:390,y:400,type:'soil',label:'Wiggly soil',hint:'snff… something wriggly',note:'Worms are stretchier than expected.',done:false},
{id:'mushroom',x:535,y:230,type:'mushroom',label:'Moon mushrooms',hint:'a soft, rather musical hum',note:'Mushrooms have excellent acoustics.',done:false},
{id:'rock',x:765,y:390,type:'rock',label:'Loose rock',hint:'a tiny rattle beneath the rock',note:'Rocks prefer going downhill.',done:false},
{id:'hole',x:886,y:225,type:'hole',label:'Suspicious hole',hint:'tap… tap… from underground',note:'Some holes poke back.',done:false},
{id:'stick',x:340,y:540,type:'stick',label:'Very good stick',hint:'snff… premium woody notes',note:'This is a very good stick.',done:false},
{id:'leaves',x:630,y:510,type:'leaves',label:'Rustly leaves',hint:'a metallic smell in the leaves',note:'Leaves conceal tiny, useless riches.',done:false},
{id:'snail',x:917,y:504,type:'snail',label:'Sleeping snail',hint:'a very small snore',note:'Snails dislike unscheduled doorbells.',done:false}
];
patchSpots.push(
{id:'sprinkler',x:735,y:280,type:'sprinkler',label:'Clicking sprinkler',hint:'tik… tik… a damp metallic nose',note:'A sprinkler pokes back with water. Its clicking warns me.',done:false},
{id:'hose',x:560,y:385,type:'hose',label:'Kinked hose',hint:'hiss… trapped water under rubber',note:'A few firm pokes unfold a kink and wake the sprinkler.',done:false},
{id:'clod',x:430,y:215,type:'clod',label:'Dry soil',hint:'snff… a worm beneath a hard crust',note:'Wet soil yields to my feet and beak. Dry crust needs patience.',done:false},
{id:'ball',x:960,y:355,type:'ball',label:'Abandoned squeaky ball',hint:'rubber, dog, and questionable music',note:'The ball squeaks. I squeak. Nobody learns anything.',done:false},
{id:'seedpod',x:230,y:590,type:'seedpod',label:'Rattling seedpod',hint:'tik-tik… a tiny visitor inside',note:'Seedpods rattle. Sometimes the rattle has six feet.',done:false},
{id:'dandelion',x:465,y:575,type:'dandelion',label:'Dandelion puff',hint:'a soft dry whisper, ready to drift',note:'A beak can make a very small snowfall.',done:false,puffLeft:1},
{id:'dewleaf',x:790,y:565,type:'dewleaf',label:'Dew-filled leaf',hint:'cool water folded inside a leaf',note:'Leaves keep cold water in surprisingly rude places.',done:false},
{id:'papercup',x:1010,y:580,type:'papercup',label:'Forgotten paper cup',hint:'sweet fruit… and distant market smells',note:'A paper cup rolls. Beyond the hedge: fruit and tiny footsteps.',done:false},
);
const pondSpots=[
{id:'reeds',x:390,y:250,type:'reeds',label:'Whistling reeds',hint:'fweee… a breeze with opinions',note:'Reeds whistle louder when personally offended.',done:false},
{id:'log',x:770,y:235,type:'log',label:'Hollow log',hint:'clink… something inside the wood',note:'A hollow log is a very long treasure box.',done:false},
{id:'acorns',x:390,y:505,type:'acorns',label:'Acorn pile',hint:'snff… a nutty little secret',note:'Acorns roll. Kiwi dignity rolls with them.',done:false},
{id:'lily',x:685,y:475,type:'lily',label:'Bouncy lily pad',hint:'plop… a suspiciously springy leaf',note:'Lily pads are tiny wet trampolines.',done:false},
{id:'frog',x:925,y:415,type:'frog',label:'Pond critic',hint:'a thoughtful little croak',note:'The frog gave my beak a mixed review.',done:false}
];
const orchardSpots=[
{id:'apple',x:360,y:305,type:'apple',label:'Wobbly windfall',hint:'snff… apple crumble, without the crumble',note:'Apples are mostly gravity in a red coat.',find:'pip',done:false},
{id:'ribbonbush',x:845,y:270,type:'ribbonbush',label:'Dressed-up bramble',hint:'flutter… something caught on a twig',note:'Bramble couture is surprisingly stretchy.',find:'ribbon',done:false},
{id:'bottle',x:385,y:500,type:'bottle',label:'Humming bottle',hint:'whoooo… a very bottled breeze',note:'An empty bottle has a full singing voice.',find:'cork',done:false},
{id:'hedgehog',x:800,y:525,type:'hedgehog',label:'Sleepy hedgehog',hint:'a snore with suspiciously many spikes',note:'That pear was a hedgehog. My apologies.',done:false},
{id:'windchime',x:560,y:365,type:'windchime',label:'Wind chimes',hint:'ting… a breeze waiting for a beak',note:'The orchard has a doorbell but no door.',done:false}
];
const shedSpots=[
{id:'thread',x:355,y:300,type:'thread',label:'Runaway thread',hint:'a soft wooden rolling sound',note:'Thread has more ends than expected.',find:'spool',done:false},
{id:'seedtray',x:850,y:280,type:'seedtray',label:'Unmarked seedlings',hint:'snff… very ambitious dirt',note:'The sign says carrots. The dirt says nothing.',find:'label',done:false},
{id:'flowerpot',x:380,y:500,type:'flowerpot',label:'Rattling flowerpot',hint:'clink… a tiny planet in a pot',note:'Flowerpots sometimes grow marbles.',find:'marble',done:false},
{id:'wateringcan',x:830,y:475,type:'wateringcan',label:'Sleepy watering can',hint:'a drip with excellent timing',note:'Watering cans sneeze through their noses.',done:false},
{id:'moth',x:555,y:355,type:'moth',label:'Lamp enthusiast',hint:'flff… a very fluffy orbit',note:'Moths think the moon is a desk lamp.',done:false}
];
const areaSpots={patch:patchSpots,pond:pondSpots,orchard:orchardSpots,shed:shedSpots};
const allSpots=Object.values(areaSpots).flat();
let spots=patchSpots;
const areaDrops={patch:[],pond:[],orchard:[],shed:[]};
// A saved treasure has one location: the shelf, the beak, or loose on the ground.
const restoredFinds=new Set([...saved.collection,...(carried?[carried]:[])]);
for(const a of areaOrder)if(areaOpen(a)&&Array.isArray(saved.loose?.[a])){
 for(const d of saved.loose[a])if(d&&treasures.some(t=>t.id===d.id)&&!restoredFinds.has(d.id)&&Number.isFinite(d.x)&&Number.isFinite(d.y)&&d.x>=0&&d.x<=1100&&d.y>=0&&d.y<=680){
  areaDrops[a].push({id:d.id,x:d.x,y:d.y});restoredFinds.add(d.id);
 }
}
// Move earlier saves' rock reveals clear of the large rock as well.
const treasureRock=patchSpots.find(s=>s.id==='rock');
for(const d of areaDrops.patch)if((d.id==='stone'||d.id==='cap')&&Math.abs(d.x-(treasureRock.x+32))<.01&&Math.abs(d.y-(treasureRock.y+26))<.01){d.x=treasureRock.x-55;d.y=treasureRock.y+35;}
const treasureHole=patchSpots.find(s=>s.id==='hole');
for(const d of areaDrops.patch)if(d.id==='bell'&&Math.abs(d.x-(treasureHole.x+32))<.01&&Math.abs(d.y-(treasureHole.y+26))<.01){d.x=treasureHole.x-55;d.y=treasureHole.y+20;}
const treasureLeaves=patchSpots.find(s=>s.id==='leaves');
for(const d of areaDrops.patch)if(['button','shell'].includes(d.id)&&Math.abs(d.x-(treasureLeaves.x+32))<.01&&Math.abs(d.y-(treasureLeaves.y+26))<.01){d.x=treasureLeaves.x-60;d.y=treasureLeaves.y+35;}
drops=areaDrops.patch;
function treasureLocated(id){return saved.collection.includes(id)||carried===id||Object.values(areaDrops).some(list=>list.some(d=>d.id===id));}
function restoreTreasureSpots(){for(const s of allSpots)if(s.type==='stick'||s.find)s.done=treasureLocated(s.type==='stick'?'stick':s.find);}
restoreTreasureSpots();
const edgePaths={
 west:{x:95,y:465,dx:-1,dy:0,opposite:'east'},
 east:{x:1005,y:465,dx:1,dy:0,opposite:'west'},
 south:{x:675,y:590,dx:0,dy:1,opposite:'north'},
 north:{x:675,y:180,dx:0,dy:-1,opposite:'south'}
};
const areaLinks={patch:{west:'orchard',east:'shed',south:'pond'},pond:{north:'patch'},orchard:{east:'patch'},shed:{west:'patch'}};
function routes(includeLocked=false){return Object.entries(areaLinks[area]).map(([direction,to])=>({id:'passage',direction,to,...edgePaths[direction],open:areaOpen(to)})).filter(r=>includeLocked||r.open);}
function passage(direction){return direction?routes().find(r=>r.direction===direction):routes().find(r=>r.to==='patch');}
function targets(){return [...drops.map(d=>({...d,drop:true,hint:treasures.find(t=>t.id===d.id).name+' lying in the grass'})),...spots.filter(s=>!(s.type==='stick'&&s.done)),...(area==='patch'?[{id:'home',...HOME}]:[])];}
function travel(route=passage()){
 if(!route||!areaOpen(route.to)||transition)return;
 stopWaddle();const from=area,fromPosition={...kiwi};
 areaDrops[area]=drops;area=route.to;spots=areaSpots[area];drops=areaDrops[area];
 keys.clear();releaseProbe();pokeRuns.clear();destination=null;hoverPoint=null;particles=[];ripples=[];bursts=[];sniffAt=-10;
 const arrival=edgePaths[route.opposite];
 kiwi.x=arrival.x+route.dx*75;kiwi.y=arrival.y+route.dy*55;kiwi.angle=Math.atan2(route.dy,route.dx);
 transition={from,to:area,dx:route.dx,dy:route.dy,fromPosition,toPosition:{...kiwi},at:now,duration:1.8};
 if(returningHome){returningHome=false;destination={x:HOME.x+45,y:HOME.y+15};}
 const greetings={patch:'Back in the moonlit patch. Your burrow is just a waddle away.',pond:'Reedwater Hollow. New smells. Damp toes. Deeply important things.',orchard:'Windfall Orchard. The apples are asleep. The hedgehog would like to remain so.',shed:'The Midnight Potting Shed. Nobody is gardening. Everybody is up to something.'};
 say(greetings[area]);ui();
}
function headThroughPassage(direction){if(!started||ended||transition)return;const t=passage(direction);if(!t)return;destination={x:t.x,y:t.y};canvas.focus();}
function onPath(p,r){return r.direction==='west'?p.x<145&&Math.abs(p.y-r.y)<65:r.direction==='east'?p.x>955&&Math.abs(p.y-r.y)<65:r.direction==='south'?p.y>545&&Math.abs(p.x-r.x)<100:p.y<220&&Math.abs(p.x-r.x)<100;}
// Ground footprints include room for the kiwi's body. Flat litter, soil, hoses
// and concealing foliage remain walkable; tall artwork can still occlude a bird behind it.
function solidObjects(){
 const sizes={sprinkler:[52,29],rock:[51,30],mushroom:[45,25],snail:[43,23],ball:[36,24],log:[64,35],apple:[48,31],bottle:[33,24],hedgehog:[51,29],seedtray:[57,31],flowerpot:[45,31],wateringcan:[63,34]};
 const solids=spots.filter(s=>sizes[s.type]).map(s=>{
  let x=s.x,y=s.y-10;
  if(s.type==='rock'&&s.done){const r=clamp((now-(s.rollAt??-10))/1.2,0,1);x+=r*83;y+=r*43;}
  if(s.type==='apple'&&s.done){const r=clamp((now-(s.hit??now))/.8,0,1);x+=r*45;y+=r*18;}
  if(s.type==='snail'&&s.done)x+=Math.sin(now*.8)*9;
  const [rx,ry]=sizes[s.type];return {id:s.id,x,y,rx,ry};
 });
 if(area==='patch')solids.push({id:'home',x:171,y:318,rx:120,ry:48});
 return solids;
}
function insideSolid(p,o){return ((p.x-o.x)/o.rx)**2+((p.y-o.y)/o.ry)**2<1-1e-6;}
function clearWalk(a,b,solids){
 return solids.every(o=>{
  const x=(a.x-o.x)/o.rx,y=(a.y-o.y)/o.ry,dx=(b.x-a.x)/o.rx,dy=(b.y-a.y)/o.ry;
  const t=clamp(-(x*dx+y*dy)/(dx*dx+dy*dy||1),0,1);
  return (x+dx*t)**2+(y+dy*t)**2>=1-1e-5;
 });
}
function walkGoal(from,to,solids){
 const goal={...to};
 for(const o of solids)if(insideSolid(goal,o)){
  let x=(from.x-o.x)/o.rx,y=(from.y-o.y)/o.ry,n=Math.hypot(x,y);
  if(!n){y=1;n=1;}
  goal.x=clamp(o.x+x/n*(o.rx+2),80,1020);goal.y=clamp(o.y+y/n*(o.ry+2),165,595);
 }
 return goal;
}
function planWalk(from,to,solids){
 const goal=walkGoal(from,to,solids);
 if(clearWalk(from,goal,solids))return [goal];
 // A small visibility graph chooses a short path around rounded footprints.
 const nodes=[{...from},goal];
 for(const o of solids)for(let i=0;i<16;i++){
  const a=i*Math.PI/8,p={x:o.x+Math.cos(a)*(o.rx+8),y:o.y+Math.sin(a)*(o.ry+8)};
  if(p.x>=80&&p.x<=1020&&p.y>=165&&p.y<=595&&!solids.some(o=>insideSolid(p,o)))nodes.push(p);
 }
 const costs=nodes.map(()=>Infinity),previous=[],visited=new Set();costs[0]=0;
 while(visited.size<nodes.length){
  let at=-1;for(let i=0;i<nodes.length;i++)if(!visited.has(i)&&(at<0||costs[i]<costs[at]))at=i;
  if(at<0||!Number.isFinite(costs[at]))break;
  if(at===1){const path=[];for(let i=1;i!==0;i=previous[i])path.unshift(nodes[i]);return path;}
  visited.add(at);
  for(let i=1;i<nodes.length;i++)if(!visited.has(i)){
   const cost=costs[at]+dist(nodes[at],nodes[i]);
   if(cost<costs[i]&&clearWalk(nodes[at],nodes[i],solids)){costs[i]=cost;previous[i]=at;}
  }
 }
 return [];
}
let walkDestination=null,walkWaypoints=[];
function steeringPoint(solids){
 if(walkDestination!==destination||!walkWaypoints.length||!clearWalk(kiwi,walkWaypoints[0],solids)){
  walkDestination=destination;walkWaypoints=planWalk(kiwi,destination,solids);
 }
 while(walkWaypoints.length>1&&dist(kiwi,walkWaypoints[0])<5)walkWaypoints.shift();
 return walkWaypoints[0];
}
function moveKiwi(dx,dy,solids=solidObjects()){
 // Short steps prevent a scurry from jumping through a narrow object.
 const steps=Math.max(1,Math.ceil(Math.hypot(dx,dy)/3));
 for(let step=0;step<steps;step++){
  kiwi.x=clamp(kiwi.x+dx/steps,80,1020);kiwi.y=clamp(kiwi.y+dy/steps,165,595);
  for(let pass=0;pass<3;pass++)for(const o of solids)if(insideSolid(kiwi,o)){
   let x=(kiwi.x-o.x)/o.rx,y=(kiwi.y-o.y)/o.ry,n=Math.hypot(x,y);
   if(!n){y=1;n=1;}
   kiwi.x=o.x+x/n*o.rx*1.00001;kiwi.y=o.y+y/n*o.ry*1.00001;
   if(kiwi.x<80||kiwi.x>1020){kiwi.x=clamp(kiwi.x,80,1020);kiwi.y=o.y+Math.sign(y||dy||1)*o.ry*Math.sqrt(Math.max(0,1-((kiwi.x-o.x)/o.rx)**2))*1.00001;}
   if(kiwi.y<165||kiwi.y>595){kiwi.y=clamp(kiwi.y,165,595);kiwi.x=o.x+Math.sign(x||dx||1)*o.rx*Math.sqrt(Math.max(0,1-((kiwi.y-o.y)/o.ry)**2))*1.00001;}
   const nx=x/o.rx,ny=y/o.ry,dot=gait.vx*nx+gait.vy*ny;
   if(dot<0){const q=dot/(nx*nx+ny*ny);gait.vx-=q*nx;gait.vy-=q*ny;}
  }
 }
}
const rand=(a,b)=>a+Math.random()*(b-a), dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y), clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
let seed=802;const seeded=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
const grass=Array.from({length:180},()=>({x:80+seeded()*960,y:150+seeded()*450,s:4+seeded()*9}));
const stars=Array.from({length:55},()=>({x:seeded()*1100,y:seeded()*260,r:.5+seeded()*1.1}));
const trees=[[-20,230,1.7],[75,160,1.2],[190,120,1.1],[310,90,1.35],[460,55,1.2],[610,80,1.5],[760,60,1.5],[965,95,1.8],[1100,195,1.7],[-35,510,1.8],[1110,490,1.7]];
function save(){try{localStorage.setItem('kiwi-night-v1',JSON.stringify({...saved,carried,loose:Object.fromEntries(areaOrder.map(a=>[a,areaDrops[a].filter(d=>d.id!==carried&&!saved.collection.includes(d.id))]))}));}catch{say('Your shelf is safe for this visit. This browser cannot save it between visits.');}}
function say(t){$('#speech').textContent=t;}
function tone(freq=330,dur=.12,type='sine',vol=.03){if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(freq*.65,audio.currentTime+dur);g.gain.setValueAtTime(vol,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+dur);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+dur);}catch{}}
function ui(){
 $('#area-name').textContent=areaNames[area].toUpperCase();
 const paths=routes(),arrows={west:'←',east:'→',south:'↓',north:'↑'};
 $('#routes').hidden=!paths.length;
 for(const direction of Object.keys(edgePaths)){
  const path=paths.find(r=>r.direction===direction),button=$('#route-'+direction);
  button.hidden=!path;button.disabled=!started||ended||!!transition;
  button.textContent=path?arrows[direction]+' '+areaNames[path.to]:'';
 }
 $('#collection').innerHTML=treasures.filter(t=>areaOrder.some(a=>areaOpen(a)&&areaFinds[a].includes(t.id))).map(t=>{
  const found=saved.collection.includes(t.id),n=treasures.indexOf(t);
  return `<div class="slot ${found?'found':''}" title="${found?t.desc:'An empty place for something unimportant'}">${found?`<span class="treasure-icon" role="img" aria-label="${t.name}" style="background-position:${n%4*100/3}% ${Math.floor(n/4)*100/3}%"></span><small>${t.name}</small>`:'·'}</div>`;
 }).join('');$('#count').textContent=`${saved.collection.length} / ${areaOrder.filter(areaOpen).reduce((n,a)=>n+areaFinds[a].length,0)} discoveries tucked away`;$('#status').textContent=carried?`In beak: ${treasures.find(t=>t.id===carried).name}`:'';}
function burst(x,y,text,color='#e4e4ad'){bursts.push({x,y,text,color,t:now});}
function puff(x,y,color='#b7ce8f',n=14,water=false){for(let i=0;i<n;i++)particles.push({x,y,vx:rand(-75,75),vy:rand(-100,20),life:rand(.5,1.1),color,water,seed:i});}
function sniff(){if(!started||ended||transition)return;sniffAt=now;tone(620,.09);const list=[...spots.filter(s=>!s.done),...drops];list.sort((a,b)=>dist(kiwi,a)-dist(kiwi,b));const near=list[0];say(near?((saved.lawn[near.id]>=2?({sprinkler:'tik… water is coming. Give that nose room.',clod:lawn.wet?'Soft damp soil. A patient dig will find supper.':'Hard crust. The hose smells of water.',hose:'That rubber bend holds the water back.',ball:'The rubber thing will squeak. This remains irresistible.',leaves:'Metal beneath leaves. A little poke uncovers it.'}[near.id]||near.hint):near.hint)||'snff… a lovely abandoned thing'):'Everything smells thoroughly investigated. Home smells like home.');for(const s of list)ripples.push({x:s.x,y:s.y,t:now});}
function pointerTarget(p){
 // A nearby find's visible name is also a pickup target; distant clicks still only walk.
 const ts=targets().filter(t=>{
  if(!t.drop){
   // The slender flower does not own the surrounding empty grass.
   if(t.type==='dandelion')return Math.abs(p.x-t.x)<27&&p.y>=t.y-54&&p.y<=t.y+14;
   return dist(p,t)<53;
  }
  const name=treasures.find(find=>find.id===t.id).name;
  const label=canPoke(t)&&Math.abs(p.x-t.x)<name.length*3+7&&Math.abs(p.y-(t.y+32))<9;
  return dist(p,t)<28||label;
 }).sort((a,b)=>dist(p,a)-dist(p,b));
 return ts[0]||null;
}
function canPoke(t){return t&&dist(kiwi,t)<POKE_REACH;}
function updateCursor(){
 if(!hoverPoint||!started||ended||transition){canvas.setAttribute('data-cursor','walk');return;}
 const t=pointerTarget(hoverPoint),near=canPoke(t);
 canvas.setAttribute('data-cursor',charge?'probing':near?'poke':'walk');
}
canvas.addEventListener('pointermove',e=>{hoverPoint=e.pointerType==='touch'?null:point(e);updateCursor();});
canvas.addEventListener('pointerleave',()=>{hoverPoint=null;updateCursor();});
function target(){
 const dx=Math.cos(kiwi.angle),dy=Math.sin(kiwi.angle);
 // A keyboard poke occupies a narrow forward reach, with no sideways/backward fallback.
 const ahead=targets().filter(t=>{
  const x=t.x-kiwi.x,y=t.y-kiwi.y,forward=x*dx+y*dy,sideways=-x*dy+y*dx;
  return canPoke(t)&&forward>0&&Math.abs(sideways)<18;
 });
 ahead.sort((a,b)=>dist(kiwi,a)-dist(kiwi,b));return ahead[0]||null;
}
const pressureTargets=new Set(['hose','clod','mushroom','ball','lily','windchime','reeds','seedpod','dandelion','dewleaf','papercup']);
const pokeRuns=new Map();
function beginProbe(t=target()){
 if(!started||ended||transition||charge||t&&!canPoke(t))return;
 charge={at:now,target:t,stage:0,power:0};
 if(t)kiwi.angle=Math.atan2(t.y-kiwi.y,t.x-kiwi.x);
 stopWaddle();destination=null;
 let power=0;
 if(t&&!carried&&!t.drop&&pressureTargets.has(t.id)){
  const id=area+':'+t.id,last=pokeRuns.get(id);
  const count=last&&now-last.at<2.5?Math.min(5,last.count+1):1;
  pokeRuns.set(id,{at:now,count});power=(count-1)*.2;
 }
 charge.power=power;
 applyPoke(t,power);
 if(ended||transition)releaseProbe();
}
function releaseProbe(){charge=null;}
function advanceProbe(){
 if(!charge||!started||ended||transition||carried)return;
 const t=charge.target;if(!t||!pressureTargets.has(t.id))return;
 const s=spots.find(s=>s.id===t.id);
 if(!s||(['clod','seedpod','dandelion'].includes(s.id)&&s.done)||(s.id==='hose'&&lawn.hoseFreedAt!==null))return;
 const age=now-charge.at;
 if(age>=.45&&charge.stage<1){charge.stage=1;applyPoke(t,Math.max(.55,charge.power),true);}
 if(age>=.9&&charge.stage<2){charge.stage=2;applyPoke(t,1,true);}
}
function pokeReach(){
 const age=now-pokeAt,extent=18+pokePower*9,ease=t=>t*t*(3-2*t);
 let jab=0;
 if(age>=0&&age<.04)jab=-2*ease(age/.04);
 else if(age<.12&&age>=.04)jab=-2+(extent+2)*ease((age-.04)/.08);
 else if(age<.16&&age>=.12)jab=extent;
 else if(age<.34&&age>=.16)jab=extent*(1-ease((age-.16)/.18));
 return probeLean+jab;
}
function give(id,x,y,power,{showPuff=true,offsetX=32,offsetY=26}={}){
 if(saved.collection.includes(id)){burst(x,y,'already admired');return;}
 if(treasureLocated(id))return;
 const find=treasures.find(t=>t.id===id),d={id,x:clamp(x+offsetX,85,1015),y:clamp(y+offsetY,155,600)};
 drops.push(d);save();say(`${find.desc} It rests in the grass. Poke it to pick it up.`);tone(440,.15);if(showPuff)puff(d.x,d.y);ui();
}
function pickup(id,x,y){if(carried){say('Your beak is full. Put this down, or bring it home first.');return false;}carried=id;save();say(`${treasures.find(t=>t.id===id).desc} Carry it home in your beak.`);tone(580,.2);ui();return true;}
function applyPoke(t,power,held=false){pokeAt=now;pokePower=power;pokeTarget=t?{x:t.x,y:t.y}:null;if(!held)nightPokes++;if(!t&&carried){drops.push({id:carried,x:kiwi.x+Math.cos(kiwi.angle)*55,y:kiwi.y+Math.sin(kiwi.angle)*35});carried=null;save();say('Set down gently. One beak, one thing.');ui();return;}if(!t){ui();return;}if(t.id==='passage'){travel();return;}if(t.id==='home'){endNight();return;}if(t.drop){const d=drops.find(d=>d.id===t.id&&d.x===t.x&&d.y===t.y);if(d&&pickup(d.id,d.x,d.y))drops.splice(drops.indexOf(d),1);ui();return;}
const s=spots.find(s=>s.id===t.id);if(carried){say('Your beak is full. Bring this home, or poke clear ground to put it down.');if(!held)nightPokes--;ui();return;}if(area==='patch'&&!held){saved.lawn[s.id]=(saved.lawn[s.id]||0)+1;save();}if(!saved.known.includes(s.id)){saved.known.push(s.id);save();}if(isConcealed(s)){s.revealedAt=now;puff(s.x,s.y,'#73926a',9);}
s.hit=now;if(s.id!=='rock'&&s.id!=='hole'&&s.id!=='stick')puff(s.x,s.y,s.type==='soil'?'#8a8260':'#b3c888',8);tone(200+power*200,.12);
if(s.id==='sprinkler'){lawn.spraying=!lawn.spraying;s.done=false;burst(s.x,s.y-35,lawn.spraying?'tik… FSSSH!':'click.');say(lawn.spraying?'A beak meets a button. The lawn answers with a rotating shower.':'One more nose-poke. The rain takes a break.');}
if(s.id==='hose'){if(lawn.hoseFreedAt!==null){say('The rubber lies loose. The water has a clear path.');}else if(power<.3){s.done=false;burst(s.x,s.y-20,'boop');say('The folded rubber gives a little. A few more pokes, or a steady probe, could open it.');}else{s.done=true;lawn.hoseFreedAt=now;lawn.spraying=true;lawn.wet=true;burst(s.x,s.y-30,'fwump!');say('Your beak presses the fold open. Water races toward the sprinkler. Dry soil darkens.');}}
if(s.id==='clod'){diggingAt=now;if(s.done)say('A small empty dig. There will be more wriggles tomorrow.');else if(!lawn.wet&&!lawn.dug){lawn.dug=true;burst(s.x,s.y-30,'scritch scritch');say('Feet scratch. Beak probes. The crust cracks a little; something wriggles below.');}else{s.done=true;snacks++;puff(s.x,s.y,'#8e7658',25);burst(s.x,s.y-30,'dig… slurp!');say(lawn.wet?'Soft wet earth, two busy feet, one delighted beak. Supper.':'Another patient dig breaks the crust. A worm, at last.');}}
if(s.id==='ball'){s.done=false;s.bounceAt=now;s.bouncePower=.45+power*.55;wiggleAt=now;surpriseAt=-10;burst(s.x,s.y-40,'SQUEEE!');tone(990,.3,'triangle');say(power>.5?'A firm poke. An enormous squeak. The ball hops; you fluff up and squeak back.':'The ball squeaks. You fluff up and squeak back. Another poke could make it hop higher.');}
if(s.id==='fence'){s.done=true;burst(s.x,s.y-30,'snff…');say('Your beak fits. Your bottom does not. Beyond: night-market smells and the patter of tiny feet. Another route, another night.');}
if(s.id==='worm'){if(!s.done){if(power>.82){burst(s.x,s.y-25,'FWIP!');say('The worm achieved flight. Briefly. You remain firmly flightless.');particles.push({x:s.x,y:s.y,vx:-230,vy:-230,life:1.6,color:'#dda38e',worm:true});}else{snacks++;burst(s.x,s.y-25,'slurp!');say('A stretchy snack. Five stars. Distinctly earthy.');}s.done=true;}else say('Only worm-shaped memories remain. Try again tomorrow.');}
if(s.id==='mushroom'){burst(s.x,s.y-40,power>.7?'BWOooONG':'plip ♪','#b6d9ed');ripples.push({x:s.x,y:s.y,t:now});tone(power>.7?130:620,.7,'sine',.06);say(power>.7?'The entire mushroom choir has opinions.':'One mushroom. One very small note.');s.done=true;}
if(s.id==='rock'){if(!s.done){s.done=true;s.rollAt=now;give(saved.collection.includes('stone')?'cap':'stone',s.x,s.y,power,{showPuff:false,offsetX:-55,offsetY:35});burst(s.x,s.y-35,'rrrrumble');}else{say('You poke the stone. The stone declines to elaborate.');if(!drops.some(d=>d.id==='stone'||d.id==='cap'))burst(s.x+83,s.y-15,'tink');tone(800,.08);}}
if(s.id==='hole'){wiggleAt=now;surpriseAt=now;if(!s.done){s.done=true;if(saved.night>1){give('bell',s.x,s.y,power,{showPuff:false,offsetX:-55,offsetY:20});}else{say('Something poked back. A professional courtesy, probably.');burst(s.x,s.y-30,'!!!');moveKiwi(-Math.cos(kiwi.angle)*35,-Math.sin(kiwi.angle)*35);}}else say('From below: “We are closed.” Perhaps another night.');}
if(s.id==='stick'){if(!s.done){s.done=true;if(!saved.collection.includes('stick'))pickup('stick',s.x,s.y);else burst(s.x,s.y,'already admired');}else say('The stick-shaped absence is also quite good.');}
if(s.id==='leaves'){if(!s.done){s.done=true;give(saved.collection.includes('button')?'shell':'button',s.x,s.y,power,{offsetX:-60,offsetY:35});}else{say('Rustle rustle. An excellent sound even without a prize.');burst(s.x,s.y-30,'rustle');}}
if(s.id==='reeds'){tone(power>.7?860:430,.5);burst(s.x,s.y-50,power>.7?'FWEEEE!':'fwee ♪');if(!s.done){s.done=true;give('whistle',s.x,s.y,power);}else say('The reeds have formed a very small brass band.');}
if(s.id==='log'){burst(s.x,s.y-40,'tok tok… CLINK');if(!s.done){s.done=true;give('thimble',s.x,s.y,power);}else{tone(180,.3);say('You knock. Your echo says nobody is home.');}}
if(s.id==='acorns'){puff(s.x,s.y,'#c5a16d',22);burst(s.x,s.y-30,'rattle-rattle');if(!s.done){s.done=true;give('acorn',s.x,s.y,power);}else say('A tiny avalanche. The local squirrel will be writing to you.');}
if(s.id==='lily'){s.done=true;wiggleAt=now;surpriseAt=now;sniffAt=now;for(let i=0;i<3;i++)ripples.push({x:s.x+i*22,y:s.y,t:now});puff(s.x,s.y,'#a4d1d2',26);tone(240,.4);burst(s.x,s.y-40,power>.7?'SPLOING!':'plop!');say(power>.7?'The lily pad returns your enthusiasm. Your face is now a pond.':'A polite poke. An impolite little splash.');}
if(s.id==='frog'){s.done=true;burst(s.x,s.y-35,'croak. 6/10.');tone(95,.4,'triangle');say('The frog reviews your technique: “Good length. Needs more pond.”');}
if(s.find){
 const fresh=!s.done;s.done=true;
 const beats={apple:['bonk… plop!','Gravity has harvested the apple. You supervised.'],ribbonbush:['twang!','The bramble has politely returned your accessories.'],bottle:['wooooo ♪','The bottle sings one haunting note. It knows no others.'],thread:['unravel…','You have discovered that thread is mostly more thread.'],seedtray:['pfft!','One small sneeze. Three confused seedlings.'],flowerpot:['clink-a-dink','A marble! The pot is very proud of its crop.']};
 const [noise,remark]=beats[s.id];burst(s.x,s.y-40,noise);puff(s.x,s.y,area==='orchard'?'#d4aa77':'#b4b89e',20);tone(s.id==='bottle'?160:370,.35);
 if(fresh)give(s.find,s.x,s.y,power);else say(remark);
}
if(s.id==='hedgehog'){s.done=true;s.huffAt=now;wiggleAt=now;surpriseAt=now;burst(s.x,s.y-38,'huff.');say('The hedgehog curls into a prickly ball, huffs, and settles back to sleep. Five more minutes.');tone(120,.3);}
if(s.id==='windchime'){s.done=true;burst(s.x,s.y-40,power>.7?'CLANGALANG!':'ting… ting…');for(let i=0;i<3;i++)ripples.push({x:s.x+i*16,y:s.y,t:now});tone(power>.7?850:540,.8);say(power>.7?'Every apple is now awake. A magnificent performance.':'An unsolicited lullaby for the orchard.');}
if(s.id==='wateringcan'){s.done=true;wiggleAt=now;surpriseAt=now;puff(kiwi.x,kiwi.y-25,'#a2ccda',28);burst(s.x,s.y-35,'a-CHOO!');tone(220,.3);say('The watering can sneezed. You have been thoroughly gardened.');}
if(s.id==='moth'){s.done=true;burst(s.x,s.y-40,'flff-flff!');puff(s.x,s.y,'#e3d5a1',18);tone(720,.15);say('The moth begins a new orbit. You are briefly the moon.');}
if(s.id==='seedpod'){
 if(s.done){say('The little tenant has already scuttled into the fern.');}
 else if(power<.3){burst(s.x,s.y-25,'tik-tik');say('Something taps back inside the pod. Another poke, or a steady probe.');}
 else{s.done=true;s.openedAt=now;burst(s.x,s.y-28,'pop!');puff(s.x,s.y,'#a18e62',7);say('The seam opens. Six extremely busy feet hurry toward the fern.');tone(360,.18);}
}
if(s.id==='dandelion'){
 const left=s.puffLeft??1,amount=Math.min(left,.35+power*.6);s.puffLeft=Math.max(0,left-amount);s.done=s.puffLeft===0;
 if(amount>0){
  for(let i=0;i<Math.ceil(amount*28);i++)particles.push({x:s.x,y:s.y-35,vx:rand(15,48),vy:rand(-25,-5),life:rand(2,3.5),color:'#d5d9bc',seedFluff:true});
  burst(s.x,s.y-50,'boop');say('A soft poke. Seeds drift away like a tiny snowfall.');tone(690,.1);
 }else{burst(s.x,s.y-33,'boop');say('The bare stem nods. Tomorrow will bring another little cloud.');}
}
if(s.id==='dewleaf'){
 s.done=false;s.dewAt=now;wetUntil=now+2;wiggleAt=now;surpriseAt=now;puff(kiwi.x,kiwi.y-12,'#9bbfba',8,true);burst(s.x,s.y-32,'plip!');say('A folded leaf flicks cold dew onto your nose. Astonishing manners.');tone(510,.12);
}
if(s.id==='papercup'){
 s.done=false;s.flipAt=now;s.flipPower=.4+power*.6;burst(s.x,s.y-32,power>.5?'flop!':'tok…');say('A beak meets a paper cup. It rolls, flops, and smells faintly of fruit. Beyond the hedge: a night market, perhaps.');tone(170,.16);
}
if(s.id==='snail'){s.done=true;burst(s.x,s.y-35,'…excuse me?');say('You rang the snail. It has filed a very slow complaint.');tone(110,.4);}
ui();}
function beakTouchesHome(root,tip){
 // Follow the visible beak across the painted silhouette, including the mound's sides.
 const c=painted.cells?.[0],mask=painted.homeMask;
 const scale=c?Math.min(190/c.w,137/c.h):1,left=c?171-c.w*scale/2:0,top=c?366-c.h*scale:0;
 const steps=Math.max(1,Math.ceil(dist(root,tip)/2));
 for(let i=0;i<=steps;i++){
  const x=root.x+(tip.x-root.x)*i/steps,y=root.y+(tip.y-root.y)*i/steps;
  if(c&&mask){
   // A small rim accounts for the beak's width and soft painted edges.
   for(const [dx,dy] of [[0,0],[-3,0],[3,0],[0,-3],[0,3]]){
    const u=Math.floor((x+dx-left)/scale),v=Math.floor((y+dy-top)/scale);
    if(u>=0&&u<c.w&&v>=0&&v<c.h&&mask[(v*c.w+u)*4+3]>=128)return true;
   }
  }else if(((x-171)/95)**2+((y-325)/70)**2<=1)return true;
 }
 return false;
}
function deposit(force=false,beak=null){if(area==='patch'&&carried&&(force||(started&&!ended&&!transition&&beak&&beakTouchesHome(beak.root,beak.tip)))){const openBefore=areaOrder.filter(areaOpen);const id=carried;carried=null;if(!saved.collection.includes(id)){saved.collection.push(id);nightNew++;save();}burst(HOME.x,HOME.y-65,'home, treasured home');say('Safely on your shelf. Poke the burrow to curl up, or keep exploring.');tone(760,.3);const newlyOpen=areaOrder.filter(a=>areaOpen(a)&&!openBefore.includes(a));if(newlyOpen.length){say('The grass parts: orchard to the west, shed to the east, hollow to the south. Follow any path.');for(const path of routes())puff(path.x,path.y,'#a8b589',9);}ui();}}
function endNight(){stopWaddle();deposit(true);ended=true;keys.clear();destination=null;$('#night-summary').textContent=`${nightPokes} curious pokes. ${snacks} worm${snacks===1?'':'s'} enjoyed. ${nightNew} new treasure${nightNew===1?'':'s'} brought home. ${saved.night===1?'Tomorrow, the forest will have a few new things to say.':'An excellent night to have a beak.'}`;ui();$('#summary').showModal();}
function nextNight(){stopWaddle();gait.amount=0;gait.face=1;gait.turn=0;pokeRuns.clear();probeLean=0;pokeAt=-10;saved.night++;lawn={spraying:false,wet:false,dug:false,splashes:0,hoseFreedAt:null};wetUntil=0;ended=false;nightPokes=0;snacks=0;nightNew=0;carried=null;area='patch';spots=patchSpots;for(const a of areaOrder)areaDrops[a]=[];drops=areaDrops.patch;returningHome=false;kiwi.x=HOME.x;kiwi.y=HOME.y+28;kiwi.angle=0;destination={x:HOME.x+68,y:HOME.y+35};allSpots.forEach(s=>{s.done=false;s.hit=-10;s.rollAt=-10;s.puffLeft=1;s.revealedAt=-10;s.openedAt=-10;s.dewAt=-10;s.flipAt=-10;s.huffAt=-10;});restoreTreasureSpots();save();$('#summary').close();$('#home').textContent='⌂ Head home';say('A new night. Familiar smells. The suspicious hole sounds a little different.');ui();canvas.focus();}
$('#begin').onclick=()=>{started=true;kiwi.x=HOME.x;kiwi.y=HOME.y+28;destination={x:HOME.x+68,y:HOME.y+35};$('#welcome').style.display='none';ui();say('Under the lawn: a wriggle. By the hose: a hiss. Your nose has plans for tonight.');canvas.focus();};$('#sound').onclick=()=>{sound=!sound;$('#sound').textContent=sound?'♫ Sound on':'♫ Sound off';$('#sound').setAttribute('aria-pressed',sound);tone(440,.2);};$('#sniff').onclick=sniff;for(const direction of Object.keys(edgePaths))$('#route-'+direction).onclick=()=>headThroughPassage(direction);$('#home').onclick=()=>{if(!started||transition)return;if(ended){$('#summary').showModal();return;}if(area!=='patch'){returningHome=true;headThroughPassage();say('Homeward waddle, through the firefly path.');return;}destination={x:HOME.x+45,y:HOME.y+15};say('Homeward waddle. Poke the burrow when you are ready to end the night.');};$('#next').onclick=nextNight;$('#stay').onclick=()=>{$('#summary').close();$('#home').textContent='☾ Begin another night';say('Tucked in. Admire your shelf, then choose “Begin another night.”');};$('#summary').addEventListener('cancel',()=>{$('#home').textContent='☾ Begin another night';});$('#reset').onclick=()=>{if(confirm('Clear your shelf and discoveries, and begin again at night one?')){try{localStorage.removeItem('kiwi-night-v1');}catch{}location.reload();}};
window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code)&&e.target.tagName!=='BUTTON')e.preventDefault();if(e.target.tagName==='BUTTON'||$('#summary').open||transition)return;keys.add(e.code);if(e.repeat)return;if(e.code==='Space')beginProbe();if(e.code==='KeyS')sniff();});window.addEventListener('keyup',e=>{keys.delete(e.code);if(e.code==='Space')releaseProbe();});window.addEventListener('blur',()=>{keys.clear();stopWaddle();releaseProbe();pokeRuns.clear();});
function point(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};}
canvas.addEventListener('pointerdown',e=>{if(!started||ended||transition)return;e.preventDefault();canvas.focus();canvas.setPointerCapture(e.pointerId);const p=point(e);const route=routes().find(r=>onPath(p,r));if(route){headThroughPassage(route.direction);return;}const t=pointerTarget(p);if(canPoke(t)){kiwi.angle=Math.atan2(t.y-kiwi.y,t.x-kiwi.x);beginProbe(t);}else{destination={x:clamp(p.x,90,1010),y:clamp(p.y,170,590)};burst(p.x,p.y,'·','#a9bba5');}});canvas.addEventListener('pointerup',()=>releaseProbe());canvas.addEventListener('pointercancel',releaseProbe);
function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}function line(x,y,x2,y2,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();}function txt(t,x,y,size=14,color='#d7dcb8'){ctx.fillStyle=color;ctx.font=`${size}px Georgia`;ctx.textAlign='center';ctx.fillText(t,x,y);}
function fern(x,y,s=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);for(let j=-1;j<=1;j++){line(0,0,j*25,-42,'#416b54',2);for(let i=1;i<6;i++){let yy=-i*7,xx=j*i*4;line(xx,yy,xx-12,yy-8,'#355f4d',3);line(xx,yy,xx+10,yy-10,'#355f4d',3);}}ctx.restore();}
// Irregular layered paint marks keep moving water in the lawn's gouache palette.
function waterDab(x,y,width,length,angle,opacity,seed=0){
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.globalAlpha=opacity;
 const notch=Math.sin(seed*2.3)*.16;
 function mark(w,h){
  ctx.beginPath();ctx.moveTo(-h,-w*.15);
  ctx.bezierCurveTo(-h*.6,-w,h*.25,-w*(.8+notch),h,-w*.15);
  ctx.bezierCurveTo(h*1.12,w*.35,h*.15,w,-h*.55,w*.64);
  ctx.bezierCurveTo(-h*.95,w*.5,-h*1.1,w*.2,-h,-w*.15);ctx.closePath();ctx.fill();
 }
 ctx.fillStyle='#88b7b42b';mark(width*1.35,length*1.15);
 ctx.fillStyle=seed%3?'#79a8a5':'#9cbbaf';mark(width,length);
 // Uneven pigment patches rather than a bright vector outline.
 ctx.globalAlpha=opacity*.38;ctx.fillStyle='#c5d5c0';
 ctx.beginPath();ctx.ellipse(-length*.18,-width*.23,length*.4,width*.3,.1,0,Math.PI*2);ctx.fill();
 ctx.restore();
}
function sprinklerWater(ex,ey){
 const ox=735,oy=256,angle=now*1.8;
 // Three narrow arcs open into a loose shower. Individual dabs travel outward.
 for(let strand=-1;strand<=1;strand++){
  const count=strand===0?28:16,spread=strand*.14;
  const tx=735+Math.cos(angle+spread)*155,ty=280+Math.sin(angle+spread)*90;
  for(let i=0;i<count;i++){
   const t=(i/count+now*1.35+strand*.17)%1,seed=i+strand*31;
   const drift=Math.sin(seed*4.7)*t*2;
   const x=ox+(tx-ox)*t+drift,y=oy+(ty-oy)*t-Math.sin(t*Math.PI)*46;
   const tangent=Math.atan2(ty-oy-Math.cos(t*Math.PI)*46*Math.PI,tx-ox);
   const fade=Math.min(1,t*14)*(1-t*.45),main=strand===0;
   waterDab(x,y,(main?2.6:1.5)+t*.9,(main?4.5:3)*(1-t*.3),tangent,fade*(main?.72:.44),seed);
  }
 }
 // A soft contact patch and little broken splashes where the shower meets grass.
 ellipse(ex,ey+2,15,5,'#244b4433');
 for(let i=0;i<7;i++){
  const t=(now*2.2+i/7)%1,a=i*2.4;
  waterDab(ex+Math.cos(a)*(4+t*12),ey+Math.sin(a)*(2+t*5)-Math.sin(t*Math.PI)*8,1.4,2.8,a,(1-t)*.55,i);
 }
}
const lawnFoliage=[
 {cell:12,x:94,y:238,w:110,h:68},{cell:13,x:305,y:192,w:118,h:58},
 {cell:12,x:601,y:190,w:86,h:47},{cell:13,x:1038,y:455,w:109,h:73},
 {cell:12,x:98,y:567,w:118,h:65},
 {cell:14,x:252,y:618,w:80,h:57,conceals:'seedpod'},
 {cell:13,x:819,y:607,w:140,h:76,conceals:'dewleaf'},
 {cell:12,x:1014,y:378,w:108,h:50,conceals:'ball'},
 {cell:13,x:1042,y:604,w:103,h:61,conceals:'papercup'}
];
const coveredSpots=new Set(lawnFoliage.filter(f=>f.conceals).map(f=>f.conceals));
const fullyCoveredSpots=new Set(['seedpod','papercup']);
function isConcealed(s){return area==='patch'&&coveredSpots.has(s.id)&&!(s.revealedAt>=0);}
function foliageDraw(f){
 const s=f.conceals&&patchSpots.find(s=>s.id===f.conceals);
 const reveal=s?.revealedAt>=0?clamp((now-s.revealedAt)/.5,0,1):0,ease=reveal*reveal*(3-2*reveal);
 ctx.save();ctx.translate(f.x,f.y);
 ellipse(0,-2,f.w*.38,8,'#173d3338');
 // The roots stay planted while the canopy bends aside under a beak poke.
 ctx.rotate(ease*.6);ctx.scale(1-ease*.12,1-ease*.08);
 if(!paintedSprite(f.cell,0,0,f.w,f.h)){
  if(f.cell===14)fern(0,0,f.h/51);
  else{ellipse(0,-f.h*.42,f.w*.46,f.h*.42,'#315c49');ellipse(-f.w*.18,-f.h*.48,f.w*.25,f.h*.3,'#426c50');ellipse(f.w*.17,-f.h*.35,f.w*.27,f.h*.34,'#386450');}
 }
 ctx.restore();
}
function gardenContents(showKiwi=false,activeDrops=drops){
 // Flat ground details belong beneath every foot and body, regardless of approach direction.
 const onGround=s=>s.type==='soil'||s.type==='clod'||s.type==='hole';
 spots.filter(onGround).forEach(spotDraw);
 const layers=spots.filter(s=>!onGround(s)).map(s=>({y:s.y+14,draw:()=>spotDraw(s)}));
 if(area==='patch'){
  layers.push({y:366,draw:homeDraw});
  for(const f of lawnFoliage)layers.push({y:f.y,draw:()=>foliageDraw(f)});
 }
 for(const d of activeDrops)layers.push({y:d.y+12,draw:()=>{
  drawFind(d.id,d.x,d.y);
 }});
 if(showKiwi)layers.push({y:kiwi.y+24,draw:kiwiDraw});
 layers.sort((a,b)=>a.y-b.y).forEach(layer=>layer.draw());
}
function lawnDraw(){
 if(area!=='patch')return;
 if(!(painted.lawn?.complete&&painted.lawn.naturalWidth)){
 // Weathered timber along the garden edge: broad rails and pointed posts.
 const fenceY=x=>185+Math.sin((x-290)*.006)*9;
 for(let i=0;i<10;i++){
  const x=290+i*65,y=fenceY(x),nextY=fenceY(x+65);
  line(x,y-21,x+65,nextY-21,'#5e6650',6);
  line(x,y-7,x+65,nextY-7,'#555d48',6);
 }
 for(let i=0;i<=10;i++){
  const x=290+i*65,y=fenceY(x),lean=Math.sin(i*7)*2;
  ellipse(x,y+3,11,4,'#18352c');
  ctx.fillStyle=i%2?'#727359':'#686b50';ctx.beginPath();
  ctx.moveTo(x-5,y);ctx.lineTo(x-5+lean,y-35);
  ctx.lineTo(x+lean,y-42);ctx.lineTo(x+5+lean,y-35);
  ctx.lineTo(x+5,y);ctx.closePath();ctx.fill();
  line(x-2,y-3,x-2+lean,y-32,'#92907166',1);
  ellipse(x,y-21,1.3,1.3,'#353d31');ellipse(x,y-7,1.3,1.3,'#353d31');
 }

 }
 // A crushed hairpin in the same tube, with a contact shadow and rounded rubber.
 const loose=lawn.hoseFreedAt===null?0:Math.min(1,(now-lawn.hoseFreedAt)/.55);
 const bend=(tight,open)=>tight+(open-tight)*loose;
 function hosePath(){
  ctx.beginPath();ctx.moveTo(W+55,265);
  ctx.bezierCurveTo(1000,265,900,468,790,398);
  ctx.bezierCurveTo(691,343,617,346,578,383);
  ctx.bezierCurveTo(bend(565,563),bend(398,399),bend(550,545),bend(386,419),bend(556,552),bend(380,421));
  ctx.bezierCurveTo(bend(563,574),bend(374,430),bend(574,618),bend(385,419),bend(564,630),bend(398,384));
  ctx.bezierCurveTo(bend(547,633),bend(429,377),617,429,640,360);
  ctx.bezierCurveTo(660,290,710,310,735,280);
 }
 ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
 ctx.translate(0,3);hosePath();ctx.strokeStyle='#102b2759';ctx.lineWidth=11;ctx.stroke();ctx.translate(0,-3);
 hosePath();ctx.strokeStyle='#2b5148';ctx.lineWidth=10;ctx.stroke();
 hosePath();ctx.strokeStyle='#648b76';ctx.lineWidth=7;ctx.stroke();
 ctx.translate(-.8,-1.2);hosePath();ctx.strokeStyle='#a4b89766';ctx.lineWidth=1.7;ctx.stroke();ctx.restore();
 if(loose<1){
  ctx.save();ctx.globalAlpha=1-loose;
  // The crease interrupts the highlight where the rubber has flattened shut.
  line(554,383,560,387,'#2b5148',3);line(555,382,560,384,'#b1ba9566',1);
  ctx.restore();
 }
 if(lawn.wet)ellipse(430,215,57,24,'#41504488');
 if(lawn.spraying){const a=now*1.8,ex=735+Math.cos(a)*155,ey=280+Math.sin(a)*90;sprinklerWater(ex,ey);
 if(started&&!ended&&!transition&&Math.hypot((kiwi.x-ex)/1.6,kiwi.y-ey)<48&&now-splashAt>2){splashAt=now;wetUntil=now+3;lawn.splashes++;lawn.wet=true;wiggleAt=now;surpriseAt=now;puff(kiwi.x,kiwi.y,'#9bbfba',22,true);burst(kiwi.x,kiwi.y-55,'pffft!');say('Cold toes! Feathers puff. Running away is a perfectly respectable kiwi response.');}}
}
function background(){if(area==='patch'&&painted.lawn?.complete&&painted.lawn.naturalWidth){const img=painted.lawn,cut=img.naturalHeight*.38;ctx.drawImage(img,0,0,img.naturalWidth,cut,0,0,W,180);ctx.drawImage(img,0,cut,img.naturalWidth,img.naturalHeight-cut,0,180,W,H-180);return;}if(area==='orchard'||area==='shed'){newBackground();return;}if(area==='pond'){pondBackground();return;}const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#10262e');g.addColorStop(.55,'#203e38');g.addColorStop(1,'#1b3530');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);stars.forEach(s=>ellipse(s.x,s.y,s.r,s.r,`rgba(210,230,194,${.3+.25*Math.sin(now+s.x)})`));const halo=ctx.createRadialGradient(817,91,3,817,91,130);halo.addColorStop(0,'#dce4ad2e');halo.addColorStop(1,'#cdddac00');ctx.fillStyle=halo;ctx.fillRect(680,0,280,240);ellipse(817,91,28,28,'#dee6b8');ellipse(827,80,25,25,'#1a3337');
ctx.fillStyle='#142d30';ctx.beginPath();ctx.moveTo(0,210);for(let x=0;x<=W;x+=40)ctx.lineTo(x,180+Math.sin(x*.013)*24);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();ellipse(560,385,498,226,'#27433a');ellipse(560,400,439,187,'#2b493c');const light=ctx.createRadialGradient(550,340,20,550,340,490);light.addColorStop(0,'#80956310');light.addColorStop(1,'#18333266');ctx.fillStyle=light;ctx.fillRect(0,160,W,500);
ctx.strokeStyle='#6b77501b';ctx.lineWidth=48;ctx.beginPath();ctx.moveTo(180,375);ctx.bezierCurveTo(440,300,425,590,705,457);ctx.bezierCurveTo(860,400,750,270,877,230);ctx.stroke();
for(const t of trees){let[x,y,s]=t;line(x,y+135*s,x+6,y-120*s,'#152e2d',21*s);line(x,y+40*s,x-50*s,y-40*s,'#152e2d',12*s);for(let j=0;j<4;j++)ellipse(x+(j%2?35:-30)*s,y-j*39*s,72*s,59*s,j%2?'#183530':'#1c3b32');}
ellipse(817,91,25,25,'#dee6b8');ellipse(828,81,23,23,'#193530');
grass.forEach(g=>{line(g.x,g.y,g.x-3,g.y-g.s,'#5a755343',1);line(g.x,g.y,g.x+5,g.y-g.s*.7,'#63805438',1);});
// A little pond at the edge of the patch.
ellipse(1050,347,90,63,'#19393d');ellipse(1050,344,72,42,'#254a48');for(let i=0;i<5;i++)line(1000+i*8,324+i*10,1040+i*12,324+i*10,'#73998544',1);
fern(74,515,1.4);fern(243,595,1.1);fern(1010,580,1.5);fern(1014,190,.9);fern(420,180,.7);fern(630,613,1.2);fern(88,268,.9);
for(let i=0;i<16;i++){const x=140+(i*163%830)+Math.sin(now*.7+i)*16,y=180+(i*97%365)+Math.cos(now*.9+i)*10;ellipse(x,y,2,2,`rgba(215,226,141,${.3+.3*Math.sin(now*2+i)})`);}
}
function newBackground(){
 const shed=area==='shed',g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,shed?'#252936':'#292738');g.addColorStop(1,shed?'#464339':'#374331');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 if(shed){
  ctx.fillStyle='#384040';ctx.fillRect(60,90,980,480);for(let x=80;x<1040;x+=65)line(x,90,x,570,'#505049',3);
  ctx.fillStyle='#514e3c';ctx.fillRect(60,290,980,320);for(let y=310;y<620;y+=52)line(60,y,1040,y,'#302f2c',3);
  ctx.fillStyle='#182a38';ctx.fillRect(120,120,130,120);line(185,120,185,240,'#9b926e',6);line(120,180,250,180,'#9b926e',6);ellipse(218,144,13,13,'#e3dcad');
  line(790,160,1000,160,'#938064',12);for(let i=0;i<4;i++){ellipse(820+i*49,145,17,10,'#9c7757');line(820+i*49,139,817+i*49,108,'#88a078',3);}
  line(555,70,555,180,'#9a946e',2);ellipse(555,193,30,17,'#8c8060');ellipse(555,209,18,23,'#e4ce81');
  const glow=ctx.createRadialGradient(555,220,0,555,220,230);glow.addColorStop(0,'#efd79a28');glow.addColorStop(1,'#efd79a00');ctx.fillStyle=glow;ctx.fillRect(300,0,510,480);
 }else{
  stars.forEach(s=>ellipse(s.x,s.y,s.r,s.r,'#e0ceb655'));ellipse(840,92,26,26,'#ecdbb0');ellipse(852,82,24,24,'#292738');ellipse(555,390,505,230,'#43503a');
  for(const [x,y,r] of [[130,245,82],[355,190,72],[820,190,76],[1020,320,85]]){line(x,y+80,x,y-25,'#66513e',18);ellipse(x,y-44,r,r*.85,'#526040');ellipse(x-28,y-63,r*.7,r*.65,'#617047');for(let j=0;j<7;j++)ellipse(x+Math.sin(j*5)*r*.7,y-48+Math.cos(j*4)*r*.5,7,8,'#bf8562');}
  grass.forEach(g=>line(g.x,g.y,g.x+5,g.y-g.s,'#b3ab6630',1));fern(70,540,1.4);fern(1040,570,1.4);
  for(let i=0;i<20;i++)ellipse(110+i*47,350+Math.sin(i*4+now*.2)*140,4,2,'#cbaa6455');
 }
}
function pondBackground(){
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#151d37');g.addColorStop(1,'#25474b');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 stars.forEach(s=>ellipse(s.x,s.y,s.r,s.r,'#adbbcf66'));ellipse(813,88,28,28,'#e1dfbd');ellipse(824,77,24,24,'#18273c');
 ellipse(570,384,510,245,'#304c47');ellipse(681,362,251,136,'#172f42');ellipse(680,354,232,118,'#254b59');
 for(let i=0;i<13;i++){let x=500+(i*71%350),y=270+i*14;line(x+Math.sin(now+i)*8,y,x+55,y,'#8eb7b535',2);}
 for(let i=0;i<12;i++){const x=70+i*88;line(x,205,x-12,60,'#1a353b',18);ellipse(x-18,73,78,72,'#213b42');}
 ellipse(813,88,25,25,'#e1dfbd');ellipse(824,77,23,23,'#213b42');
 for(let i=0;i<28;i++){const x=450+i*16,y=230+Math.sin(i*.25)*38;line(x,y,x+Math.sin(now+i)*3,y-34,'#748b68',2);ellipse(x,y-36,3,9,'#a48e65');}
 grass.forEach(g=>line(g.x,g.y,g.x+4,g.y-g.s,'#91aa6a28',1));fern(80,550,1.6);fern(1030,540,1.5);fern(550,600,1.3);fern(235,180,1);
 for(let i=0;i<24;i++)ellipse(140+(i*137%860)+Math.sin(now+i)*8,180+(i*71%375)+Math.cos(now*.7+i)*9,2,2,'#cee5ae77');
 txt('a little further from home',570,625,13,'#9db8b2');
}
function passageDraw(){for(const route of routes(true)){
 const nearby=dist(kiwi,route)<90,sensed=now-sniffAt<3;
 ctx.save();ctx.translate(route.x,route.y);ctx.rotate(Math.atan2(route.dy,route.dx));
 const length=route.direction==='north'?180:95;
 // Broken pigment and flattened grass, with no hard-edged road or widening wedge.
 for(let i=0;i<24;i++){
  const t=i/23,x=-58+t*(length+58),y=Math.sin(i*2.7)*5;
  ctx.globalAlpha=(route.open ? .045 : .015)*(.45+.55*Math.sin(t*Math.PI));
  ellipse(x,y,9+Math.sin(i*3)*2,10+Math.cos(i*2)*3,'#92a080');
  ellipse(x+3,y+2,7,6,'#415e49');
  line(x-2,y-5,x+3,y-8,'#a0ac85',1.2);
 }
 ctx.restore();
 if(!route.open){
  for(let i=0;i<3;i++){
   const across=(i-1)*22,along=Math.sin(i*4)*10;
   const x=route.x+route.dy*across+route.dx*along,y=route.y+route.dx*across+route.dy*along;
   if(!paintedSprite(14,x,y,29,32))fern(x,y,.5);
  }
 }else if(nearby||sensed){
  for(let i=0;i<3;i++)ellipse(route.x+route.dy*(i%2?1:-1)*(24+i*5),route.y+route.dx*(i%2?1:-1)*(24+i*5)+Math.sin(now+i)*4,1.5,1.5,'#bdcd9f55');
  txt(areaNames[route.to],route.x-route.dx*65,route.y-route.dy*45-24,12,'#aebd9b');
 }
}}
function homeDraw(){if(area!=='patch')return;if(paintedSprite(0,171,366,190,137)){if(started&&!ended&&!transition&&dist(kiwi,HOME)<110)txt('home, sweet hole',174,405,12,'#b6b995');return;}ellipse(175,355,102,35,'#162f2b');ellipse(171,325,92,67,'#3a4f39');ellipse(162,305,83,40,'#496044');ellipse(181,330,51,46,'#142825');ellipse(183,343,38,36,'#101f20');const glow=ctx.createRadialGradient(181,343,3,181,343,55);glow.addColorStop(0,'#daa45b62');glow.addColorStop(1,'#d4a45b00');ctx.fillStyle=glow;ctx.fillRect(120,285,125,115);line(120,349,115,294,'#928667',4);line(115,294,140,294,'#928667',3);ellipse(139,308,6,9,'#e2cf87');ellipse(145,273,18,7,'#6d8050');ellipse(198,279,23,8,'#607c4d');if(started&&!ended&&!transition&&dist(kiwi,HOME)<110)txt('home, sweet hole',174,405,12,'#b6b995');}
function spotDraw(s){if(s.type==='stick'&&s.done)return;let jig=now-(s.hit??-10)<.6?Math.sin((now-s.hit)*35)*5:0;ctx.save();ctx.translate(s.x+jig,s.y);if(!paintedSpot(s)){if(s.type!=='hose')ellipse(0,10,35,11,'#17332b60');if(s.type==='sprinkler'){ellipse(0,0,18,9,'#819a97');line(0,0,0,-20,'#9db4ad',7);line(-13,-20,15,-20,'#b4c5ae',5);ellipse(4,-24,4,3,'#d7c88d');}
if(s.type==='clod'){ellipse(0,0,29,16,lawn.wet?'#655640':'#93815b');if(lawn.dug||s.done){line(-18,-3,12,4,'#302c25',3);ellipse(0,2,s.done?18:8,6,'#393629');}}
if(s.type==='ball'){const b=Math.max(0,1-(now-(s.bounceAt??-10))/1.2)*(s.bouncePower??.45);ctx.translate(Math.sin(now*20)*b*12,-Math.abs(Math.sin(now*10))*b*24);ellipse(0,0,21,19,'#cd9a88');line(-17,-6,18,5,'#e2b39a',3);ellipse(8,-4,4,4,'#705e5a');}
if(s.type==='fence'){line(-25,-20,-25,12,'#8b9272',9);line(25,-20,25,12,'#8b9272',9);line(-32,-14,32,-14,'#8b9272',5);ellipse(0,10,21,8,'#132925');}
if(s.type==='soil'){ellipse(0,0,31,18,'#5b5941');for(let i=0;i<9;i++)ellipse(-22+i*5,Math.sin(i*8)*9,3,2,'#7b7351');if(!s.done){ctx.strokeStyle='#b6987b';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-8,0);ctx.quadraticCurveTo(0,-7+Math.sin(now*3)*3,8,0);ctx.stroke();}}
if(s.type==='mushroom'){for(let i=0;i<3;i++){let x=(i-1)*24,y=i===1?-13:5;line(x,y,x,y-24,'#a6b7a0',7);ellipse(x,y-28,18,12,i===1?'#9dc9bf':'#79a8a4');ellipse(x-5,y-33,3,2,'#d0e4c8');ellipse(x+6,y-28,2,2,'#d0e4c8');}}
if(s.type==='rock'){let r=s.done?Math.min(1,(now-(s.rollAt??-10))/1.2):0;ctx.translate(r*83,r*43);ctx.rotate(r*2);ellipse(0,0,33,23,'#7d8977');ellipse(-8,-8,22,12,'#939c87');line(-15,-12,8,-17,'#a6ad91',2);}
if(s.type==='hole'){ellipse(0,0,27,17,'#576249');ellipse(0,0,22,12,'#102724');if(s.done){ellipse(-6,0,2,2,'#c2c78e');ellipse(5,0,2,2,'#c2c78e');}line(17,-9,32,-18,'#688054');}
if(s.type==='stick'&&!s.done){line(-30,9,29,-13,'#b9a16d',7);line(5,-4,7,-20,'#b9a16d',4);line(-18,5,-21,-7,'#b9a16d',3);line(-26,8,22,-10,'#d4bd81',2);}
if(s.type==='leaves'){for(let i=0;i<9;i++){ctx.save();ctx.translate(Math.sin(i*5)*29,Math.cos(i*4)*13);ctx.rotate(i);ellipse(0,0,14,6,['#8e8050','#b09659','#657449'][i%3]);line(-10,0,10,0,'#c0ac6644',1);ctx.restore();}}
if(s.type==='reeds'){for(let i=0;i<7;i++){let x=(i-3)*10;line(x,10,x+Math.sin(now+i)*5,-35-(i%3)*8,'#b1ba7e',3);ellipse(x,-40-(i%3)*8,4,11,'#b7a16a');}}
if(s.type==='log'){ellipse(0,0,48,24,'#76654c');line(-35,-11,28,-11,'#a08b60',3);line(-37,5,20,5,'#514c3c',2);ellipse(34,0,18,24,'#ba9e70');ellipse(35,0,12,17,'#283931');}
if(s.type==='acorns'){for(let i=0;i<7;i++){let x=Math.sin(i*7)*26,y=Math.cos(i*4)*12;ellipse(x,y,8,10,'#bd965a');ellipse(x,y-6,9,5,'#7e6947');}}
if(s.type==='lily'){ellipse(0,Math.sin(now*2)*2,36,17,'#729876');line(-30,0,21,0,'#a9bd81',1);ellipse(5,-6,9,5,'#d6bfbc');}
if(s.type==='frog'){let hop=now-(s.hit??-10)<.7?Math.sin((now-s.hit)/.7*Math.PI)*24:0;ctx.translate(0,-hop);ellipse(-14,9,12,7,'#647f60');ellipse(14,9,12,7,'#647f60');ellipse(0,0,20,16,'#99ad77');ellipse(-11,-13,7,8,'#adbd87');ellipse(11,-13,7,8,'#adbd87');ellipse(-10,-14,2,3,'#213a38');ellipse(12,-14,2,3,'#213a38');line(-7,3,8,3,'#536c50',2);}
if(s.type==='apple'){const roll=s.done?Math.min(1,(now-(s.hit??now))/.8):0;ctx.translate(roll*45,roll*18);ellipse(-7,0,24,23,'#bf7960');ellipse(10,0,21,23,'#d18b69');line(1,-20,6,-33,'#756646',4);ellipse(13,-28,10,4,'#a4b17b');}
if(s.type==='ribbonbush'){for(let i=0;i<6;i++){line(-30+i*12,12,Math.sin(i)*25,-40,'#85916b',3);}if(!s.done){line(-24,-27,22,-20,'#d4a5a0',5);line(0,-23,-3,8,'#d4a5a0',4);}}
if(s.type==='bottle'){ctx.fillStyle='#85aaa0';ctx.fillRect(-11,-21,22,38);ellipse(0,12,16,9,'#85aaa0');ctx.fillRect(-6,-41,12,23);if(!s.done){ctx.fillStyle='#b99d71';ctx.fillRect(-7,-48,14,10);}}
if(s.type==='hedgehog'){for(let i=0;i<10;i++){const a=Math.PI+i/9*Math.PI;line(Math.cos(a)*20,Math.sin(a)*18,Math.cos(a)*34,Math.sin(a)*31,'#b2a27e',4);}ellipse(0,0,29,20,'#9b8b6b');ellipse(23,7,13,10,'#c6b28a');ellipse(34,7,3,3,'#263933');if(!s.done)txt('z',10,-40,15,'#bdc2a0');}
if(s.type==='windchime'){line(-27,-45,27,-45,'#b5a87e',3);for(let i=0;i<4;i++){const x=-21+i*14+Math.sin(now*2+i)*(s.done?5:1);line(x,-45,x,-20,'#a8ac8f',1);line(x,-20,x,10+i*4,'#c2c3a2',5);}}
if(s.type==='thread'){ctx.strokeStyle='#c2a699';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-35,12);ctx.bezierCurveTo(-65,-20,30,40,22,-5);ctx.stroke();if(!s.done&&!treasureSprite('spool',0,14,38,29)){ellipse(0,-12,19,6,'#c7af7e');ctx.fillStyle='#aa8e76';ctx.fillRect(-13,-12,26,28);ellipse(0,16,19,6,'#c7af7e');}}
if(s.type==='seedtray'){ctx.fillStyle='#8a7758';ctx.fillRect(-39,-10,78,32);for(let i=0;i<4;i++){ellipse(-27+i*18,1,7,5,'#3e4536');line(-27+i*18,0,-27+i*18,-15,'#9cac71',3);ellipse(-22+i*18,-16,7,3,'#b3bb83');}if(!s.done){line(22,0,27,-30,'#dfd5ac',5);}}
if(s.type==='flowerpot'){ctx.fillStyle='#af7e60';ctx.beginPath();ctx.moveTo(-25,-14);ctx.lineTo(25,-14);ctx.lineTo(17,21);ctx.lineTo(-17,21);ctx.closePath();ctx.fill();ellipse(0,-14,29,10,'#c29671');ellipse(0,-15,21,6,'#3b3930');}
if(s.type==='wateringcan'){ellipse(0,2,27,24,'#819d9c');line(20,2,50,-16,'#9cb1a7',10);ellipse(51,-17,7,11,'#b6c2ac');ctx.strokeStyle='#a0b2a5';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(-25,-6,17,20,0,0,Math.PI*2);ctx.stroke();}
if(s.type==='moth'){const flutter=Math.sin(now*18)*5;ctx.translate(Math.sin(now*(s.done?2:.7))*22,Math.cos(now)*12);ellipse(-10,0,12+flutter,17,'#c8bc99');ellipse(10,0,12+flutter,17,'#d6cca8');ellipse(0,0,4,13,'#92856b');line(-1,-10,-8,-21,'#d6cca8',1);line(1,-10,8,-21,'#d6cca8',1);}
if(s.type==='snail'){let move=s.done?Math.sin(now*.8)*9:0;ctx.translate(move,0);ellipse(0,9,29,9,'#8d9d76');ellipse(0,-2,19,18,'#bdad7a');ctx.strokeStyle='#786e51';ctx.lineWidth=2;ctx.beginPath();for(let a=0;a<Math.PI*5;a+=.15){const r=a*.9;const x=Math.cos(a)*r,y=-2+Math.sin(a)*r;a===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();line(20,6,26,-9,'#a4b68b',2);ellipse(26,-10,2,2,'#d0d3a0');if(!s.done)txt('z',25,-31+Math.sin(now)*3,13,'#9bb395');}
}ctx.restore();if(s.type==='stick'&&s.done)return;const d=dist(kiwi,s);if(isConcealed(s)&&now-sniffAt>=3)return;if(started&&!ended&&!transition&&d<110&&!drops.some(item=>dist(item,s)<70&&canPoke(item))){txt(s.label,s.x,s.y+47,12,'#d6d8b4');}
}
function riggedPoke(rig,scale,x,y,reach,mirror=1){
 const ease=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
 // A front-facing neck can compress only so far before its strips fold over.
 const frontReach=Math.min(reach*.65,(.83*rig.h-rig.root[1])*scale*.5);
 const warp=v=>rig.face?rig.face*reach*ease(rig.face>0?(v/rig.w-.34)/(rig.root[0]/rig.w-.34):(.66-v/rig.w)/(.66-rig.root[0]/rig.w)):frontReach*ease((.83-v/rig.h)/(.83-rig.root[1]/rig.h));
 // Overlapping strips keep fractional pixel edges sealed while the neck stretches.
 const vertical=!!rig.face,span=vertical?rig.w:rig.h,overlap=1.25/scale;
 for(let i=0;i<18;i++){
  const a=Math.max(0,span*i/18-overlap),b=Math.min(span,span*(i+1)/18+overlap),da=warp(a),db=warp(b);
  if(vertical)ctx.drawImage(rig.body,a,0,b-a,rig.h,x+a*scale+da,y,(b-a)*scale+db-da,rig.h*scale);
  else ctx.drawImage(rig.body,0,a,rig.w,b-a,x,y+a*scale+da,rig.w*scale,(b-a)*scale+db-da);
 }
 const rootX=x+rig.root[0]*scale+(vertical?warp(rig.root[0]):0),rootY=y+rig.root[1]*scale+(vertical?0:warp(rig.root[1]));
 const rest=Math.atan2(rig.tip[1]-rig.root[1],rig.tip[0]-rig.root[0]);
 const aim=pokeTarget?Math.atan2(pokeTarget.y-kiwi.y-rootY,(pokeTarget.x-kiwi.x)*mirror-rootX):Math.atan2(Math.max(.4,Math.sin(kiwi.angle)),Math.cos(kiwi.angle)*mirror);
 const blend=clamp(Math.max(0,reach)/(18+pokePower*9),0,1),rotation=clamp(Math.atan2(Math.sin(aim-rest),Math.cos(aim-rest)),-.85,.85)*blend;
 ctx.save();ctx.translate(rootX,rootY);ctx.rotate(rotation);
 ctx.drawImage(rig.beak,0,0,rig.w,rig.h,x-rootX+(vertical?warp(rig.root[0]):0),y-rootY+(vertical?0:warp(rig.root[1])),rig.w*scale,rig.h*scale);
 ctx.restore();
 const vx=(rig.tip[0]-rig.root[0])*scale,vy=(rig.tip[1]-rig.root[1])*scale;
 return {x:rootX+vx*Math.cos(rotation)-vy*Math.sin(rotation),y:rootY+vx*Math.sin(rotation)+vy*Math.cos(rotation),root:{x:rootX,y:rootY}};
}
// One opaque profile/quarter/front pose at a time avoids double faces and beaks.
function turningBody(reach=0){
 const n=painted.turnCells?Math.round(gait.turn*4):(gait.turn<.5?0:4),profile=n===0||n===4,mirror=n===4?-1:1;
 const c=profile?painted.cells[11]:painted.turnCells[n-1],rig=profile?painted.profileRig:painted.turnRigs?.[n-1],img=profile?painted.sheet:painted.turning;
 ctx.save();ctx.scale(mirror,1);
 let end=null;
 if(rig?.bodyBounds){
  const bounds=rig.bodyBounds,scale=74/bounds.h,x=-rig.anchorX*scale,y=14-(bounds.y+bounds.h)*scale;
  if(Math.abs(reach)>.05)end=riggedPoke(rig,scale,x,y,reach,mirror);
  else{
   ctx.drawImage(img,c.x,c.y,c.w,c.h,x+(c.x-rig.x)*scale,y+(c.y-rig.y)*scale,c.w*scale,c.h*scale);
   end={x:x+rig.tip[0]*scale,y:y+rig.tip[1]*scale,root:{x:x+rig.root[0]*scale,y:y+rig.root[1]*scale}};
  }
 }else if(profile)paintedSprite(11,19,14,116,74);
 else{const scale=74/c.h,center=(n-.5)*painted.turning.naturalWidth/3;ctx.drawImage(img,c.x,c.y,c.w,c.h,(c.x-center)*scale,14-74,c.w*scale,74);}
 ctx.restore();return end?{x:end.x*mirror,y:end.y,root:{x:end.root.x*mirror,y:end.root.y}}:null;
}
function kiwiDraw(){
 const digging=now-diggingAt<.8,amount=digging?1:gait.amount,phase=digging?now*12:gait.phase;
 const turn=gait.turn,front=Math.sin(turn*Math.PI),direction=Math.cos(turn*Math.PI);
 const bob=Math.sin(phase*2)*(painted.cells ? .65 : 1.5)*amount+Math.sin(now*2)*.45*(1-amount),reach=pokeReach(),support=reach*.14;
 ctx.save();ctx.translate(kiwi.x,kiwi.y);ellipse(0,16,29,9,'#10292266');
 // The painted foot includes its ankle: draw exactly two, without extra calf lines.
 const movingSpeed=Math.hypot(gait.vx,gait.vy);
 const headingX=movingSpeed>.2?gait.vx/movingSpeed:Math.cos(kiwi.angle);
 const headingY=movingSpeed>.2?gait.vy/movingSpeed:Math.sin(kiwi.angle);
 const stance=.6,halfStride=Math.PI/.105*stance;
 for(let i=0;i<2;i++){
  const cycle=((phase/(Math.PI*2)+i*.5)%1+1)%1,root=i===0?-9-front*3:6+front*6;
  // The support foot stays on the ground while the bird advances over it.
  // The raised foot returns from behind the body to the next forward contact.
  const swing=Math.max(0,(cycle-stance)/(1-stance));
  const stride=(cycle<stance?halfStride*(1-2*cycle/stance):-halfStride*Math.cos(swing*Math.PI))*amount;
  const lift=Math.sin(swing*Math.PI)*6*amount;
  const footX=root+stride*headingX,ground=26+stride*headingY*.45-lift;
  const footFacing=turn<.375?1:turn>.625?-1:(i===0?-1:1);
  ctx.save();if(i===0)ctx.globalAlpha=.75;
  if(painted.cells){ctx.translate(footX,0);ctx.scale(footFacing,1);paintedSprite(15,4,ground,20,18);}
  else{line(root,7,footX,ground-4,'#ae8055',3);line(footX,ground,footX+direction*7,ground,'#b29a68',3);}
  ctx.restore();
 }
 // The torso gives a little support; the head/beak deliver the visible jab.
 const offsetX=Math.cos(kiwi.angle)*support,offsetY=bob+Math.sin(kiwi.angle)*support*.55+(now-wiggleAt<.7?Math.sin(now*50)*2:0),tilt=Math.sin(phase)*.022*amount;
 ctx.translate(offsetX,offsetY);
 ctx.rotate(tilt);
 if(now<wetUntil)ctx.scale(1.12,.95);
 let beakTip=null;
 if(painted.cells)beakTip=turningBody(reach);
 else{
  ellipse(-3,-6,29,31,'#846e4f');ellipse(-7,-12,25,25,'#9d855f');ellipse(-13,-17,16,17,'#ad946c');
  for(let i=0;i<12;i++){const x=-24+(i*11%39),y=-27+(i*17%40);line(x,y,x+4,y+6,'#76624766',1.5);}
  ctx.save();ctx.translate(Math.cos(kiwi.angle)*reach,Math.sin(kiwi.angle)*reach*.55);
  const headX=14*direction,headY=-20+front*5;
  ellipse(headX,headY,18,19,'#a68d65');ellipse(headX+5*direction,headY-4,4.5,5,'#172728');
  if(front>.4)ellipse(headX-5*direction-7*front,headY-4,3*front,4,'#172728');
  ctx.fillStyle='#d5bb7d';ctx.beginPath();ctx.moveTo(headX+12*direction,headY);ctx.lineTo(69*direction,-9+front*22);ctx.quadraticCurveTo(51*direction,-7+front*22,headX+12*direction,headY+7);ctx.closePath();ctx.fill();
  ctx.restore();
 }
 if(carried){
  // Use this frame's pose, jab, bob and wet scale, so contact also works while probing.
  const dx=Math.cos(kiwi.angle)*reach,dy=Math.sin(kiwi.angle)*reach*.55;
  const beak=beakTip??{x:69*direction+dx,y:-9+front*22+dy,root:{x:26*direction+dx,y:-20+front*5+dy}};
  const world=p=>{const x=p.x*(now<wetUntil?1.12:1),y=p.y*(now<wetUntil?.95:1);return {x:kiwi.x+offsetX+x*Math.cos(tilt)-y*Math.sin(tilt),y:kiwi.y+offsetY+x*Math.sin(tilt)+y*Math.cos(tilt)};};
  deposit(false,{root:world(beak.root),tip:world(beak)});
 }
 if(carried){
  const size=treasureSizes[carried],x=beakTip?.x??(72*direction+Math.cos(kiwi.angle)*reach),y=beakTip?beakTip.y+size[1]*.3:8+front*13+Math.sin(kiwi.angle)*reach*.55;
  if(!treasureSprite(carried,x,y,size[0]*.85,size[1]*.85))ellipse(x,y-3,6,3,'#c3b895');
 }
 ctx.restore();if(now-surpriseAt<1)txt('!!!',kiwi.x,kiwi.y-60,19,'#efe2a8');
}
// Render adjoining clearings in one moving view. The kiwi stays visible on the path.
function transitionScene(name,offsetX,offsetY){
 const currentArea=area,currentSpots=spots;area=name;spots=areaSpots[name];
 ctx.save();ctx.translate(offsetX,offsetY);ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();
 background();lawnDraw();passageDraw();gardenContents(false,areaDrops[name]);
 ctx.restore();area=currentArea;spots=currentSpots;
}
function drawTransition(){
 const t=transition,u=clamp((now-t.at)/t.duration,0,1),ease=u*u*(3-2*u);
 ctx.fillStyle='#203b37';ctx.fillRect(0,0,W,H);
 transitionScene(t.from,-t.dx*W*ease,-t.dy*H*ease);transitionScene(t.to,t.dx*W*(1-ease),t.dy*H*(1-ease));
 const position={...kiwi};kiwi.x=t.fromPosition.x+(t.toPosition.x-t.fromPosition.x)*ease;kiwi.y=t.fromPosition.y+(t.toPosition.y-t.fromPosition.y)*ease;walk=1;kiwiDraw();Object.assign(kiwi,position);
 canvas.setAttribute('data-cursor','walk');
 if(u===1){transition=null;walk=0;keys.clear();ui();}
}
function frame(ms){
 now=ms/1000;const dt=Math.min(.04,now-last||.016);last=now;walk=0;
 if(transition){advanceGait(dt,125*dt);gait.amount+=(1-gait.amount)*(1-Math.exp(-14*dt));drawTransition();requestAnimationFrame(frame);return;}
 advanceProbe();
 const lean=charge&&!carried?Math.min(12,(now-charge.at)*14):0;
 probeLean+=(lean-probeLean)*(1-Math.exp(-18*dt));
 if(started&&!ended&&!charge){
  const solids=solidObjects();
  let dx=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0);
  let dy=(keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0);
  let speed=keys.has('ShiftLeft')||keys.has('ShiftRight')?210:125;
  if(dx||dy){destination=null;}
  else if(destination){
   const steering=steeringPoint(solids),d=steering?dist(kiwi,steering):0;
   if(d<3){
    stopWaddle();destination=null;
   }else{dx=(steering.x-kiwi.x)/d;dy=(steering.y-kiwi.y)/d;speed=Math.min(speed,d*9);}
  }
  const len=Math.hypot(dx,dy),blend=1-Math.exp(-(len?18:22)*dt);
  gait.vx+=((len?dx/len*speed:0)-gait.vx)*blend;
  gait.vy+=((len?dy/len*speed:0)-gait.vy)*blend;
  if(Math.hypot(gait.vx,gait.vy)<.2)stopWaddle();
  const oldX=kiwi.x,oldY=kiwi.y;
  moveKiwi(gait.vx*dt,gait.vy*dt,solids);
  const distance=Math.hypot(kiwi.x-oldX,kiwi.y-oldY);
  if(distance>.01){
   const angle=Math.atan2(gait.vy,gait.vx),delta=Math.atan2(Math.sin(angle-kiwi.angle),Math.cos(angle-kiwi.angle));
   kiwi.angle+=delta*(1-Math.exp(-18*dt));walk=1;
  }
  advanceGait(dt,distance);
  const crossing=routes().find(r=>dist(kiwi,r)<24);if(crossing)travel(crossing);
 }else{stopWaddle();advanceGait(dt);}

if(transition){drawTransition();requestAnimationFrame(frame);return;}updateCursor();background();lawnDraw();passageDraw();gardenContents(true);
if(now-sniffAt<3){let r=(now-sniffAt)*135;ctx.strokeStyle=`rgba(212,228,163,${Math.max(0,.4-(now-sniffAt)*.13)})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(kiwi.x,kiwi.y,r,r*.6,0,0,Math.PI*2);ctx.stroke();for(const s of spots.filter(s=>!s.done)){for(let i=0;i<5;i++){const a=i/5;ellipse(kiwi.x+(s.x-kiwi.x)*a,kiwi.y+(s.y-kiwi.y)*a+Math.sin(now*4+i)*4,2,2,'#bdcf8666');}txt(s.hint,s.x,s.y-53,12,'#d4dfa7');}}
ripples=ripples.filter(r=>now-r.t<2);for(const r of ripples){let age=now-r.t;ctx.strokeStyle=`rgba(184,215,165,${.5-age*.25})`;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(r.x,r.y,18+age*23,10+age*13,0,0,7);ctx.stroke();}particles=particles.filter(p=>p.life>0);for(const p of particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=(p.seedFluff?3:180)*dt;p.life-=dt;if(p.seedFluff){p.x+=Math.sin(now*2+p.y)*8*dt;line(p.x,p.y,p.x-3,p.y+4,'#99ac8766',1);ellipse(p.x,p.y,2.8,1.8,p.color);}else if(p.worm)line(p.x,p.y,p.x+12,p.y+Math.sin(now*25)*5,p.color,4);else if(p.water)waterDab(p.x,p.y,1.8,3.3,Math.atan2(p.vy,p.vx),Math.min(1,p.life*2)*.7,p.seed);else ellipse(p.x,p.y,2,2,p.color);}bursts=bursts.filter(b=>now-b.t<1.8);for(const b of bursts){ctx.globalAlpha=Math.min(1,(1.8-(now-b.t))*2);txt(b.text,b.x,b.y-(now-b.t)*20,17,b.color);ctx.globalAlpha=1;}requestAnimationFrame(frame);}
ui();requestAnimationFrame(frame);
// Read-only snapshot for repeatable browser smoke tests.
window.kiwiSnapshot=()=>({area,routes:routes().map(r=>({direction:r.direction,to:r.to,x:r.x,y:r.y})),openAreas:areaOrder.filter(areaOpen),transitioning:!!transition,unlocked:unlocked(),night:saved.night,lawn:{...lawn},lawnKnowledge:{...saved.lawn},collection:[...saved.collection],known:[...saved.known],kiwi:{...kiwi},solids:solidObjects(),carried,wet:now<wetUntil,started,ended,snacks,pokes:nightPokes,drops:drops.map(d=>({...d})),spots:spots.map(s=>({id:s.id,x:s.x,y:s.y,done:s.done,concealed:isConcealed(s)}))});
})();
