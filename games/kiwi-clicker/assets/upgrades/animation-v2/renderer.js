// Asset-only reference renderer. No gameplay imports or mutations.
const TAU=Math.PI*2, clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smooth=v=>{v=clamp(v);return v*v*(3-2*v)};
const lerp=(a,b,t)=>a+(b-a)*t;
const I=[1,0,0,1,0,0];
const T=(x,y)=>[1,0,0,1,x,y];
const S=s=>[s,0,0,s,0,0];
const mul=(a,b)=>[a[0]*b[0]+a[2]*b[1],a[1]*b[0]+a[3]*b[1],a[0]*b[2]+a[2]*b[3],a[1]*b[2]+a[3]*b[3],a[0]*b[4]+a[2]*b[5]+a[4],a[1]*b[4]+a[3]*b[5]+a[5]];
const rot=(deg,x,y)=>{const a=deg*Math.PI/180,c=Math.cos(a),s=Math.sin(a);return mul(mul(T(x,y),[c,s,-s,c,0,0]),T(-x,-y))};
const around=(m,p)=>mul(m,p);
const pulse=(p,c,width)=>Math.max(0,1-Math.abs(p-c)/width);
const bell=(p,a,b)=>p<a||p>b?0:Math.sin(Math.PI*(p-a)/(b-a))**2;
const pathAt=(points,p)=>{if(p<=points[0][0])return points[0].slice(1);for(let i=1;i<points.length;i++){if(p<=points[i][0]){const a=points[i-1],b=points[i],t=smooth((p-a[0])/(b[0]-a[0]));return [lerp(a[1],b[1],t),lerp(a[2],b[2],t)];}}return points.at(-1).slice(1)};
export function commands(key,ms,manifest) {
 const m=manifest.scenes[key],p=((ms%m.durationMs)+m.durationMs)%m.durationMs/m.durationMs, nodes=[];
 const add=(file,matrix=I,alpha=1)=>nodes.push({file:file.includes('/')?file:key+'/'+file+'.png',matrix,alpha});
 const jumpingKiwi=(matrix,bend)=>{
  add('kiwi',matrix);
  nodes.at(-1).knees={bend,hip:key==='trampoline'?400:375,ankle:key==='trampoline'?470:418};
 };
 const button=(point,scale,down=0,parent=I)=>{
  const mat=mul(parent,mul(T(...point),mul(S(scale),T(-768,-250))));
  add('common/housing.png',mat);add('common/cap-up.png',mul(mat,T(0,135*down)));add('common/housing-front.png',mat);
 };
 if(key==='salad-bar') {
  add('static');
 } else if(key==='slide') {
  add('background');
  let active=-1,down=0;m.contactPhases.forEach((c,i)=>{const q=pulse(p,c,.035);if(q>down){down=q;active=i}});
  m.contacts.forEach((pt,i)=>button(pt,m.buttonScale,i===active?down:0));
  const [x,y]=pathAt(m.path,p),d=active<0?0:down*135*m.buttonScale;
  add('kiwi',T(x-630,y-365+d));
 } else if(key==='trampoline') {
  const compression=bell(p,.50,.74),drop=m.capTravel*compression;
  const flight=p<.5?-m.bounceHeight*Math.sin(p*Math.PI/.5):drop;
  add('base');
  m.springBottoms.forEach((y,i)=>{
   const sy=1-drop/m.springHeights[i];
   add('spring-'+i,[1,0,0,sy,0,y*(1-sy)]);
  });
  add('common/surface.png',mul(T(768,480+drop),mul(S(.68),T(-768,-250))));
  // Load the legs before takeoff, extend in flight, and absorb the landing.
  const bend=bell(p,.78,1)*.8+bell(p,.46,.72);
  jumpingKiwi(T(0,flight),bend);add('base-front');
 } else if(key==='seesaw') {
  const wave=Math.sin(p*TAU),parent=rot(-8*wave,887,619);
  const ld=Math.max(0,wave),rd=Math.max(0,-wave);
  add('support');add('board',parent);
  button(m.contacts[0],.25,ld,parent);button(m.contacts[1],.25,rd,parent);
  add('kiwi-left',mul(parent,T(0,33.75*ld)));add('kiwi-right',mul(parent,T(0,33.75*rd)));add('support');
 } else if(key==='staircase') {
  add('background');
  let active=-1,down=0;m.contactPhases.forEach((c,i)=>{const q=pulse(p,c,.034);if(q>down){down=q;active=i}});
  m.contacts.forEach(([x,y],i)=>{
   // The existing staircase supplies its housing; only caps move.
   add('common/cap-up.png',mul(T(x,y+135*.35*(i===active?down:0)),mul(S(.35),T(-768,-250))));
  });
  let pt=m.contacts[0],hop=0,bend=0;
  if(p<.08){pt=[lerp(-900,230,smooth(p/.08)),425];}
  else if(p>=.08&&p<=.72){const f=(p-.08)/.16,i=Math.min(3,Math.floor(f)),q=f-i;pt=[lerp(m.contacts[i][0],m.contacts[i+1][0],smooth(q)),lerp(m.contacts[i][1],m.contacts[i+1][1],smooth(q))];hop=-105*Math.sin(q*Math.PI);bend=bell(q,0,.24)*.8+bell(q,.76,1);}
  else if(p>.72){const q=clamp((p-.72)/.16);pt=[lerp(1350,2600,smooth(q)),lerp(790,875,smooth(q))];hop=-60*Math.sin(q*Math.PI);}
  jumpingKiwi(T(pt[0]-230,pt[1]-425+hop+down*47.25),bend);
  add('foreground');
 } else if(key==='carousel') {
  add('base');add('platform');
  const f=p*5,index=Math.floor(f),q=f-index,move=smooth(q/.55),base=2.515+(index+move)*TAU/5;
  const press=bell(q,.58,.84),peck=bell(q,.56,.88);
  const points=Array.from({length:5},(_,i)=>{const a=base+i*TAU/5;return {i,x:1105+300*Math.cos(a),floor:650+75*Math.sin(a),dist:Math.abs(Math.atan2(Math.sin(a-2.515),Math.cos(a-2.515)))}}).sort((a,b)=>a.floor-b.floor);
  points.forEach(b=>button([b.x,b.floor-690*.174],.174,b.dist<.05?press:0));
  add('body');add('head',rot(11.5*peck,534.6,424.4));add('base-front');
 } else if(key==='rain-machine') {
  const time=p*m.durationMs,timing=m.suggestedTimingMs;
  // Release a spaced dribble, then clear every ball
  // offscreen before the next tug. All balls share the decoded BB sprite.
  const releaseEnd=Math.max(...timing.release)+timing.showerDuration;
  const tug=smooth(time/300)*(1-smooth((time-releaseEnd)/300));
  const gates=smooth((time-200)/200)*(1-smooth((time-releaseEnd)/200));
  add('background');
  m.gates.forEach((gate,i)=>add('gate-'+i,T(gate.openTranslation[0]*gates,0)));
  const balls=[];
  m.buttons.contacts.forEach((contact,i)=>{
   const active=[];let down=0;
   for(let offset=0;offset<timing.showerDuration;offset+=timing.releaseInterval){
    const elapsed=time-timing.release[i]-offset;
    if(elapsed<0||elapsed>=timing.fallDuration+timing.pressDuration+timing.rollDuration)continue;
    active.push(elapsed);
    if(elapsed>=timing.fallDuration&&elapsed<timing.fallDuration+timing.pressDuration)
     down=Math.max(down,Math.sin((elapsed-timing.fallDuration)/timing.pressDuration*Math.PI));
   }
   button(contact,m.buttons.scale,down);
   if(down>0)nodes.push({impact:contact,amount:down});
   for(const elapsed of active){
    const start=m.spoutExits[i],radius=m.bb.sceneRadius;
    let x=start[0],y=start[1],scale=1,angle=0;
    if(elapsed<timing.fallDuration){
     const q=elapsed/timing.fallDuration;
     y=lerp(start[1],contact[1]-radius,q*q);
    }else if(elapsed<timing.fallDuration+timing.pressDuration){
     y=contact[1]-radius+m.buttons.capTravel*down;
    }else{
     const roll=clamp((elapsed-timing.fallDuration-timing.pressDuration)/timing.rollDuration);
     // Roll across the cap first, drop off its rim, then roll along
     // the ground toward the foreground until completely out of view.
     const direction=i===0?-1:1,edgeX=contact[0]+direction*100;
     const rimY=contact[1]-radius+18,groundY=m.buttons.groundY-radius;
     if(roll<.3){
      const q=roll/.3;x=lerp(contact[0],edgeX,q);y=lerp(contact[1]-radius,rimY,q);
     }else if(roll<.52){
      const q=(roll-.3)/.22;x=edgeX+direction*24*q;y=lerp(rimY,groundY,q*q);
     }else{
      const q=(roll-.52)/.48;x=lerp(edgeX+direction*24,m.bb.exitCenters[i][0],q);y=lerp(groundY,m.bb.exitCenters[i][1],q);
      scale=lerp(1,m.bb.maxForegroundScale,q);
     }
     angle=direction*roll*720;
    }
    balls.push({x,y,scale,angle});
   }
  });
  for(const b of balls)add('bb',mul(T(b.x,b.y),mul(S(m.bb.scale*b.scale),mul(T(-m.bb.center[0],-m.bb.center[1]),rot(b.angle,...m.bb.center)))));
  add('kiwi-body');
  const head=rot(m.kiwi.safeHeadDegrees[1]*tug,...m.kiwi.neckPivot),tip=m.kiwi.billTipIdle;
  const grip=[head[0]*tip[0]+head[2]*tip[1]+head[4],head[1]*tip[0]+head[3]*tip[1]+head[5]];
  nodes.push({cord:m.cord,grip});
  add('kiwi-head-neck',head);
 } else if(key==='conga') {
  // One connected bird per draw. No independent head/leg rotations or fades.
  const reach=smooth((p-.30)/.13),release=1-smooth((p-.69)/.16);
  const press=bell(p,.43,.69);
  button(m.buttonContact,m.buttonScale,press);
  m.actorOffsets.forEach((x,i)=>{
   let file,angle,pivot;
   if(i===m.actorOffsets.length-1){
    file='pose-step-right';pivot=m.posePivots['step-right'];
    // Approach the released cap, then follow its travel, then lift clear.
    angle=lerp(m.leadAngles.lift,m.leadAngles.touch,reach)*release+m.leadAngles.lift*(1-release)+m.leadAngles.pressTravel*press;
   } else {
    const local=((ms+m.phaseOffsetsMs[i])%m.stepPeriodMs+m.stepPeriodMs)%m.stepPeriodMs;
    const seq=m.stepSequence;let elapsed=0,entry=seq[0],fraction=0;
    for(const item of seq){if(local<elapsed+item.durationMs){entry=item;fraction=(local-elapsed)/item.durationMs;break}elapsed+=item.durationMs}
    file='pose-'+entry.pose;pivot=m.posePivots[entry.pose];
    angle=entry.pose==='stand'?0:Math.sin(fraction*Math.PI)*m.stepRockDegrees*(entry.pose==='step-right'?1:-1);
   }
   const parent=mul(T(x,m.actorY),mul(S(m.actorScale),rot(angle,...pivot)));
   add(file,parent);
  });
 }
 return {phase:p,nodes};
}
export async function createRenderer(manifest,url=new URL('.',import.meta.url)) {
 const files=new Set(['common/housing.png','common/housing-front.png','common/cap-up.png','common/surface.png']);
 for(const [key,m]of Object.entries(manifest.scenes))for(const layer of m.layers)files.add(key+'/'+layer+'.png');
 files.add('staircase/foreground.png');
 const images={};await Promise.all([...files].map(async file=>{if(typeof Image==='undefined'){const response=await fetch(new URL(file,url));if(!response.ok)throw new Error('Missing layer '+file);images[file]=await createImageBitmap(await response.blob());return;}return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{images[file]=im;resolve()};im.onerror=()=>reject(new Error('Missing layer '+file));im.src=new URL(file,url).href});}));
 // Cache only the small leg band, rather than a full kiwi for every bend.
 const legSources=new WeakMap();
 const surface=(w,h)=>{const c=typeof OffscreenCanvas!=='undefined'?new OffscreenCanvas(w,h):document.createElement('canvas');c.width=w;c.height=h;return c;};
 function bentLegs(image,k){
  let source=legSources.get(image);
  if(!source){const c=surface(image.width,k.ankle-k.hip),ctx=c.getContext('2d');ctx.drawImage(image,0,k.hip,image.width,c.height,0,0,c.width,c.height);source={pixels:ctx.getImageData(0,0,c.width,c.height),frames:new Map()};legSources.set(image,source);}
  const bend=Math.round(k.bend*32)/32,depth=(k.ankle-k.hip)*.24*bend;
  if(!source.frames.has(bend)){
   const {width:w,height:h,data:input}=source.pixels,c=surface(w,h),ctx=c.getContext('2d'),output=ctx.createImageData(w,h);
   // Inverse sampling gives one continuous image, with no strip boundaries.
   for(let y=0;y<h;y++){
    const shift=-depth*.65*Math.sin(Math.PI*y/(h-1));
    for(let x=0;x<w;x++){
     const sx=x-shift,x0=Math.floor(sx),fraction=sx-x0,dst=(y*w+x)*4;
     const left=x0>=0&&x0<w?(y*w+x0)*4:-1,right=x0+1>=0&&x0+1<w?(y*w+x0+1)*4:-1;
     const a=left<0?0:input[left+3]/255,b=right<0?0:input[right+3]/255,alpha=a*(1-fraction)+b*fraction;
     output.data[dst+3]=alpha*255;
     if(alpha)for(let channel=0;channel<3;channel++)output.data[dst+channel]=((left<0?0:input[left+channel])*a*(1-fraction)+(right<0?0:input[right+channel])*b*fraction)/alpha;
    }
   }
   ctx.putImageData(output,0,0);source.frames.set(bend,c);
  }
  return {image:source.frames.get(bend),depth};
 }
 return function render(canvas,key,ms,{guides=false}={}) {
  const scene=manifest.scenes[key];
  const [vx,vy,w,h]=scene.viewport||[0,0,...scene.canvas];
  const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';const s=Math.min(canvas.width/w,canvas.height/h),ox=(canvas.width-w*s)/2,oy=(canvas.height-h*s)/2;
  ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.translate(ox-vx*s,oy-vy*s);ctx.scale(s,s);
  const state=commands(key,ms,manifest);
  for(const n of state.nodes){
   if(n.cord){
    const c=n.cord,[x,y]=n.grip;
    ctx.save();ctx.strokeStyle=c.color;ctx.lineWidth=c.strokeWidth;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(...c.anchor);ctx.lineTo(...c.elbow);ctx.quadraticCurveTo(x,c.elbow[1],x,c.elbow[1]+25);ctx.lineTo(x,y-c.ringRadius);ctx.stroke();
    ctx.beginPath();ctx.arc(x,y,c.ringRadius,0,TAU);ctx.stroke();ctx.restore();continue;
   }
   if(n.impact){
    const [x,y]=n.impact;ctx.save();ctx.globalAlpha=n.amount;ctx.strokeStyle='#776f57';ctx.lineWidth=3;ctx.lineCap='round';
    ctx.beginPath();for(const side of [-1,1]){ctx.moveTo(x+side*80,y-5);ctx.lineTo(x+side*95,y-18);ctx.moveTo(x+side*82,y+12);ctx.lineTo(x+side*100,y+12);}ctx.stroke();ctx.restore();continue;
   }
   if(n.alpha<=0)continue;
   ctx.save();ctx.globalAlpha=n.alpha;ctx.transform(...n.matrix);
   const image=images[n.file],k=n.knees;
   if(k&&k.bend>.001){
    // Keep the head and torso rigid. Bend the connected leg region while
    // keeping the toes planted; no separate pieces or head squashing.
    const band=bentLegs(image,k),depth=band.depth;
    ctx.drawImage(image,0,0,image.width,k.hip,0,depth,image.width,k.hip);
    ctx.drawImage(band.image,0,k.hip+depth,image.width,k.ankle-k.hip-depth);
    ctx.drawImage(image,0,k.ankle,image.width,image.height-k.ankle,0,k.ankle,image.width,image.height-k.ankle);
   }else ctx.drawImage(image,0,0);
   ctx.restore();
  }
  if(guides){ctx.strokeStyle='#136dcc';ctx.lineWidth=2/s;const m=manifest.scenes[key];for(const [x,y]of m.contacts||[]){ctx.beginPath();ctx.arc(x,y,8/s,0,TAU);ctx.stroke()}}
  ctx.restore();return state;
 };
}
