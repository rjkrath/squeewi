const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('games/kiwi-archaeology-society/game.js','utf8');
function setup(saved){let storage=saved||null;const els=new Map(),listeners={};function el(id){if(!els.has(id))els.set(id,{textContent:'',innerHTML:'',style:{},open:false,classList:{add(){},remove(){}},setAttribute(){},addEventListener(){},querySelectorAll(){return[]},showModal(){this.open=true},close(){this.open=false},focus(){},getContext(){return{}},clientWidth:1100,clientHeight:660});return els.get(id)}const c={listeners,console,Image:class{},document:{querySelector:s=>s==='dialog[open]'?[...els.values()].find(e=>e.open):el(s),querySelectorAll:()=>[],addEventListener:(type,fn)=>listeners[type]=fn},window:{matchMedia:()=>({matches:false}),addEventListener(){}},localStorage:{getItem:()=>storage,setItem:(k,v)=>storage=v},setTimeout:()=>0,clearTimeout(){},requestAnimationFrame(){}};vm.createContext(c);vm.runInContext(source,c);return{run:s=>vm.runInContext(s,c),tick:n=>{for(let i=0;i<n*60;i++)vm.runInContext('step(1/60)',c)},el,storage:()=>storage}}

let g=setup();g.run('requestPoke(440)');g.tick(2);g.run('requestPoke(440)');g.tick(8);assert.equal(g.run('cargo.length'),1);
g.run('requestPortal(1200)');g.tick(12);assert.equal(g.run('level'),1);assert.equal(g.run('cargo.length'),1);assert.equal(g.run('returnX'),1133);assert.equal(g.run('nearestHole(440)'),null);
for(let i=16;i<22;i++){g.run(`requestPoke(treasures[${i}].x)`);g.tick(6);g.run(`requestPoke(treasures[${i}].x)`);g.tick(6);if(g.run(`digsNeeded(treasures[${i}])`)>2){g.run(`requestPoke(treasures[${i}].x)`);g.tick(6)}assert.equal(g.run(`found.has(${i})`),true)}
assert.equal(g.run('cargo.length'),9);g.run('save()');const r=setup(g.storage());assert.equal(r.run('level'),1);assert.equal(r.run('found.size'),7);assert.equal(r.run('returnX'),1133);
r.run('requestPortal(210)');r.tick(35);assert.equal(r.run('level'),0);assert.equal(r.run('pip.x'),1133);assert.equal(r.run('cargo.length'),9);assert.equal(r.run('cargo.every(c=>c.status==="stored")'),true);
r.run('requestPortal(1200)');r.tick(30);assert.equal(r.run('level'),1);assert.equal(r.run('holes.filter(h=>h.level===1).every(h=>h.hits===digsNeeded(h))'),true);r.run('requestPortal(210)');r.tick(8);assert.equal(r.run('pip.x'),1133);
r.el('#confirm-reset').onclick();assert.equal(r.run('level'),0);assert.equal(r.run('found.size'),0);assert.equal(r.run('pendingPortal'),null);
console.log('PASS: pyramid entrance, six chamber finds, Bean pickup, cargo preservation, saved interior, same-door return, shared complex, re-entry persistence, reset.');
const repeated=setup();
repeated.run('pip.x=373;digHeld=true;pokeAhead()');repeated.tick(3);
assert.equal(repeated.run('found.size'),1,'holding dig uncovers a find');
assert.equal(repeated.run('cargo.length'),1,'continued digging does not duplicate treasure');
repeated.run('digHeld=false');repeated.tick(1);
assert.equal(repeated.run('action'),null,'release finishes the current poke and stops');
repeated.run('pokeAhead()');repeated.tick(.1);repeated.run('pokeAhead()');
assert.equal(repeated.run('queuedDig'),true,'a rapid second press is buffered');
repeated.tick(1);assert.equal(repeated.run('action'),null);
assert.equal(repeated.run('cargo.length'),1);

// Aligning the beak can require a backwards shuffle; it must not turn the bird or cart.
for(const [x,face] of [[400,1],[480,-1],[160,-1],[5420,1]]){
 const stable=setup();stable.run(`pip.x=${x};pip.face=${face};cart.x=pip.x-pip.face*155;digHeld=true;pokeAhead()`);
 for(let n=0;n<180;n++){
  stable.run('step(1/60)');
  assert.equal(stable.run('pip.face'),face,'digging keeps its facing through alignment and repeats');
  assert.ok(stable.run('(pip.x-cart.x)*pip.face')>0,'cart stays on the same side');
 }
}
const turning=setup();turning.run('pip.target=pip.x-100');turning.tick(.1);
assert.equal(turning.run('pip.face'),-1,'ordinary walking still turns Pip');

const packed=setup();
packed.run(`found=new Set([0,1,2,3,4,5,6,7,8,9,10,11]);cargo=Array.from(found,(tid)=>({id:nextCargo++,tid,level:0,status:'cart',x:cart.x,y:GROUND-60,vx:0,vy:0}));`);
assert.equal(packed.run('orderedPile()[0].tid'),9,'sarcophagus loads below light objects');
packed.tick(25);
assert.equal(packed.run('cargo.filter(c=>c.secured).length'),12,'a pause secures every item');
packed.run('save()');const savedPacking=setup(packed.storage());
assert.equal(savedPacking.run('cargo.filter(c=>c.secured).length'),12,'rope protection persists in saved progress');
packed.run('orderedPile().at(-1).secured=false;pip.target=pip.x+300');packed.tick(2.5);
assert.ok(packed.run('spills')>0,'over-tall loose cargo still falls');
assert.equal(packed.run('cargo.filter(c=>c.secured).every(c=>c.status==="cart")'),true,'tied cargo never spills');
packed.run('stopWalking()');packed.tick(20);
assert.equal(packed.run('cargo.length'),12);assert.equal(packed.run('cargo.every(c=>c.status==="cart")'),true,'Bean recovers missed catches');
const catcher=setup();catcher.run(`cargo=Array.from({length:5},(_,tid)=>({id:nextCargo++,tid,level:0,status:'cart',x:cart.x,y:GROUND-60}));spillDistance=161;held=1;`);catcher.tick(.15);catcher.run('held=0');catcher.tick(1);
assert.equal(catcher.run('catchCount'),1,'available Bean catches a reachable top item');assert.equal(catcher.run('spills'),0);
const interrupted=setup();interrupted.run(`cargo=[{id:1,tid:0,level:0,status:'cart',x:cart.x,y:GROUND-60}];`);for(let i=0;i<600&&interrupted.run('bean.state')!=='pack';i++)interrupted.tick(1/60);assert.equal(interrupted.run('bean.state'),'pack');interrupted.run('held=1');interrupted.tick(.1);assert.notEqual(interrupted.run('bean.state'),'pack');assert.equal(interrupted.run('!!cargo[0].secured'),false,'moving interrupts unfinished packing');

for(const face of [1,-1]){
 const free=setup();free.run(`pip.x=373;pip.face=${face};pokeAhead()`);free.tick(.4);
 free.run(`pip.x+=${face}*19`);const here=free.run('pip.x');
 free.run('pokeAhead()');assert.equal(free.run('action.impactX'),here+face*67);
 free.tick(.4);assert.equal(free.run('pip.x'),here,'peck after a small step never snaps back');
 free.run('digHeld=true;pokeAhead()');free.tick(2);assert.equal(free.run('pip.x'),here,'holding dig remains stationary');
}

const victory=setup();
victory.run(`level=1;found=new Set(treasures.filter(t=>t.level===1).map(t=>t.id));cargo=treasures.filter(t=>t.level===1).flatMap(t=>Array.from({length:t.count},()=>({id:nextCargo++,tid:t.id,level:1,status:'cart',x:cart.x,y:GROUND-60})));`);
victory.tick(.5);assert.equal(victory.run('completedLevels.has(1)'),false,'finding everything does not finish the level');
victory.run(`cargo[0].status='ground';cargo[0].x=cart.x+100;`);victory.tick(.2);assert.equal(victory.run('completedLevels.has(1)'),false,'loose cargo prevents victory');
victory.tick(25);assert.equal(victory.run('completedLevels.has(1)'),true,'all items retrieved and tied awards level success');
assert.equal(victory.run('cargo.every(c=>c.secured&&c.status==="cart")'),true);
assert.equal(victory.el('#note-label').textContent,'INSIDE THE PYRAMID COMPLETE');
victory.run('save()');assert.equal(setup(victory.storage()).run('completedLevels.has(1)'),true,'completion persists');
victory.el('#confirm-reset').onclick();assert.equal(victory.run('completedLevels.size'),0);

const journey=setup();
journey.run('requestPortal(5310)');journey.tick(.5);
assert.ok(journey.run('pip.x')>500,'Pip runs at more than walking speed');
journey.tick(15);assert.equal(journey.run('level'),2);
journey.run('listeners.keydown({key:"S",preventDefault(){}})');assert.ok(journey.run('sniff>time'),'S triggers sniff');
journey.run('requestPortal(210)');journey.tick(2);assert.equal(journey.run('level'),0);
journey.run('requestPortal(1200)');journey.tick(15);assert.equal(journey.run('level'),1);
journey.run('requestPortal(2500)');journey.tick(8);assert.equal(journey.run('level'),3);
journey.run('requestPortal(210)');journey.tick(2);assert.equal(journey.run('level'),1);
assert.equal(journey.el('#manifest-area').textContent,'Inside the Pyramid');
assert.ok(journey.el('#archive').innerHTML.includes('The Oasis'));
const knots=setup();knots.run(`found=new Set([0,1,2]);cargo=[0,1,2].map(tid=>({id:nextCargo++,tid,level:0,status:'cart',x:cart.x,y:GROUND-60}));`);
for(let i=0;i<600&&!knots.run("cargo.some(c=>c.secured)");i++)knots.tick(1/60);const tied=knots.run('cargo.filter(c=>c.secured).length');assert.ok(tied>0&&tied<3,'Bean ties individual items over time');
knots.run('held=1');knots.tick(.2);assert.equal(knots.run('cargo.filter(c=>c.secured).length'),tied,'moving preserves finished knots');
knots.run('held=0');knots.tick(10);assert.equal(knots.run('cargo.filter(c=>c.secured).length'),3);
knots.run('requestPortal(1200)');knots.tick(10);assert.equal(knots.run('currentCargo().length'),0);assert.equal(knots.run('cargo.filter(c=>c.status==="stored").length'),3);
const depot=setup(knots.storage());assert.equal(depot.run('currentCargo().length'),0);depot.run('requestPortal(210)');depot.tick(2);assert.equal(depot.run('currentCargo().length'),0,'returning does not reload warehouse cargo');assert.equal(depot.run('found.size'),3);
console.log('PASS: running, S sniff, oasis and tomb routes, individual knots, warehouse persistence, fresh carts and area manifest.');

const hidden=setup();
for(let area=0;area<4;area++){
 hidden.run(`level=${area};pip.x=treasures.find(t=>t.level===level&&t.buried).x;sniff=0`);
 assert.equal(hidden.run('surfaceVisible(holes.find(h=>h.level===level&&treasures[h.id].buried))'),false);
 assert.equal(hidden.run('surfaceVisible(holes.find(h=>h.level===level&&!treasures[h.id].buried))'),true);
 hidden.run('doSniff()');assert.equal(hidden.run('surfaceVisible(holes.find(h=>h.x===pip.x&&h.level===level))'),true);
 hidden.tick(6.1);assert.equal(hidden.run('surfaceVisible(holes.find(h=>h.x===pip.x&&h.level===level))'),false);
 hidden.run('holes.find(h=>h.x===pip.x&&h.level===level).hits=1');assert.equal(hidden.run('surfaceVisible(holes.find(h=>h.x===pip.x&&h.level===level))'),true);
}
console.log('PASS: buried finds hidden in every area, nearby sniff reveals temporarily, excavated holes stay visible.');

// Every area has exactly half its untouched finds unmarked, including after reload.
for(let area=0;area<4;area++){
 const check=setup();check.run(`level=${area};save()`);const restored=setup(check.storage());
 assert.equal(restored.run('holes.filter(h=>h.level===level&&!surfaceVisible(h)).length'),area===0?8:3);
 restored.run('doSniff();requestPortal(exits()[0])');restored.tick(20);
 assert.equal(restored.run('sniff'),0,'a scent reveal must not carry into another area');
}

const sprint=setup();
assert.equal(sprint.run('exitRunSpeed(100)'),360);
assert.equal(sprint.run('exitRunSpeed(5000)'),600);
assert.ok(sprint.run('exitRunSpeed(1200)>exitRunSpeed(400)'));
sprint.run('requestPortal(5310)');sprint.tick(1);
assert.ok(sprint.run('pip.x')>900,'distant exit triggers a faster sprint');
sprint.tick(15);assert.equal(sprint.run('level'),2,'sprint arrives without overshooting the door');

const edges=setup();
edges.run('found=new Set(treasures.filter(t=>t.level===0&&! [5,6,7,15].includes(t.id)).map(t=>t.id));pip.x=4510');
assert.ok(edges.run('sniffMessage()').includes('right'));
edges.run('pip.x=5300');assert.ok(edges.run('sniffMessage()').includes('nearby'));
for(let area=0;area<4;area++){
 edges.run(`level=${area};pip.x=160;held=-1`);edges.tick(1);assert.equal(edges.run('pip.x'),160);assert.equal(edges.run('pip.moving'),false);
 edges.run('pip.x=worldWidth()-100;held=1');edges.tick(1);assert.equal(edges.run('pip.x===worldWidth()-100'),true);assert.equal(edges.run('pip.moving'),false);
}

const forgiving=setup();forgiving.run('pip.x=440-67-30;pokeAhead()');forgiving.tick(.4);assert.equal(forgiving.run('holes[0].hits'),1);assert.equal(forgiving.run('pip.x'),343,'wide peck does not snap Pip');
const running=setup();running.run('keys.add("Shift");held=1');running.tick(1);assert.equal(running.run('pip.x'),690);running.run('stopWalking()');assert.equal(running.run('walkingSpeed()'),135);assert.equal(running.run('exits().filter(e=>e.to===1).length'),1);

const doorway=setup();doorway.run('pip.x=1133;requestPortal(1200)');doorway.tick(.1);assert.equal(doorway.run('level'),0);assert.equal(doorway.run('!!entering'),true);doorway.tick(.35);assert.ok(doorway.run('pip.x')>1133);doorway.tick(.9);assert.equal(doorway.run('level'),1);
for(const id of [18,20,28,32]){
 const wall=setup();wall.run(`level=treasures[${id}].level;pip.x=treasures[${id}].x-67;pokeAhead()`);wall.tick(.4);assert.equal(wall.run('particles.some(p=>p.y<GROUND-20)'),true);wall.run('pokeAhead()');wall.tick(.4);wall.run('pokeAhead()');wall.tick(6);assert.equal(wall.run(`found.has(${id})`),true);assert.equal(wall.run('cargo.length'),1);
}

const aligned=setup();aligned.run('pip.x=440-67-30;pokeAhead()');aligned.tick(.4);
assert.equal(aligned.run('holes[0].x'),440);assert.equal(aligned.run('holes[0].digX'),undefined,'treasure hole stays at the scent instead of following the beak');
aligned.run('pip.x=440-67+30;pokeAhead()');aligned.tick(.4);assert.equal(aligned.run('holes[0].x'),440);assert.equal(aligned.run('found.has(0)'),true);
const tooFar=setup();tooFar.run('pip.x=440-67-45;pokeAhead()');tooFar.tick(.4);assert.equal(tooFar.run('holes[0].hits'),0,'pecks outside the tighter radius do not excavate the treasure');

const trailing=setup();trailing.run('held=1;keys.add("Shift")');trailing.tick(3);
assert.ok(trailing.run('cart.x-bean.x')>105,'Bean runs a little behind the wagon');
trailing.run('stopWalking()');trailing.tick(3);
assert.ok(trailing.run('Math.abs(cart.x-bean.x-83)')<3,'Bean closes the gap when Pip stops');
assert.equal(trailing.run('bean.moving'),false,'Bean stops running once settled');

const tough=setup();tough.run('pip.x=treasures[2].x-67');for(let i=0;i<3;i++){tough.run('pokeAhead()');tough.tick(.4)}assert.equal(tough.run('found.has(2)'),false);tough.run('pokeAhead()');tough.tick(.4);assert.equal(tough.run('found.has(2)'),true);
const party=setup();party.run(`level=1;found=new Set(treasures.filter(t=>t.level===1).map(t=>t.id));cargo=treasures.filter(t=>t.level===1).flatMap(t=>Array.from({length:t.count},()=>({id:nextCargo++,tid:t.id,level:1,status:'cart',secured:true})));checkLevelSuccess()`);assert.equal(party.run('confetti.length'),90);party.run('checkLevelSuccess()');assert.equal(party.run('confetti.length'),90);party.tick(5);assert.equal(party.run('confetti.length'),0);
