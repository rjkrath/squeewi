const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('games/kiwi-archaeology-society/game.js','utf8');
function setup(saved){let storage=saved||null;const els=new Map(),listeners={};function el(id){if(!els.has(id))els.set(id,{textContent:'',innerHTML:'',style:{},open:false,classList:{add(){},remove(){}},setAttribute(){},addEventListener(){},querySelectorAll(){return[]},showModal(){this.open=true},close(){this.open=false},focus(){},getContext(){return{}},clientWidth:1100,clientHeight:660});return els.get(id)}const c={listeners,console,Image:class{},document:{querySelector:s=>s==='dialog[open]'?[...els.values()].find(e=>e.open):el(s),querySelectorAll:()=>[],addEventListener:(type,fn)=>listeners[type]=fn},window:{matchMedia:()=>({matches:false}),addEventListener(){}},localStorage:{getItem:()=>storage,setItem:(k,v)=>storage=v},setTimeout:()=>0,clearTimeout(){},requestAnimationFrame(){}};vm.createContext(c);vm.runInContext(fs.readFileSync('games/kiwi-archaeology-society/greek.js','utf8'),c);vm.runInContext(fs.readFileSync('games/kiwi-archaeology-society/jungle.js','utf8'),c);vm.runInContext(fs.readFileSync('games/kiwi-archaeology-society/expeditions.js','utf8'),c);vm.runInContext(source,c);return{run:s=>vm.runInContext(s,c),tick:n=>{for(let i=0;i<n*60;i++)vm.runInContext('step(1/60)',c)},el,storage:()=>storage}}

let g=setup();g.run('requestPoke(440)');g.tick(2);g.run('requestPoke(440)');g.tick(8);assert.equal(g.run('cargo.length'),1);
g.run('requestPortal(1200)');g.tick(12);assert.equal(g.run('level'),1);assert.equal(g.run('cargo.length'),1);assert.equal(g.run('returnX'),1133);assert.equal(g.run('nearestHole(440,5)'),null);
for(let i=16;i<22;i++){for(let poke=0;poke<g.run(`digsNeeded(treasures[${i}])`);poke++){g.run(`requestPoke(treasures[${i}].x)`);g.tick(6)}assert.equal(g.run(`found.has(${i})`),true)}
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
packed.tick(70);
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
journey.run('clickScene({x:5390,y:GROUND-77})');journey.tick(.5);
assert.ok(journey.run('pip.x')>500,'Pip runs at more than walking speed');
journey.tick(15);assert.equal(journey.run('level'),2);
journey.run('listeners.keydown({key:"S",preventDefault(){}})');assert.ok(journey.run('sniff>time'),'S triggers sniff');
journey.run('clickScene({x:210,y:GROUND-123})');journey.tick(4);assert.equal(journey.run('level'),0);
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
 restored.run('doSniff();requestPortal(exits()[0],true)');restored.tick(20);
 assert.equal(restored.run('sniff'),0,'a scent reveal must not carry into another area');
}

const sprint=setup();
assert.equal(sprint.run('exitRunSpeed(100)'),360);
assert.equal(sprint.run('exitRunSpeed(5000)'),600);
assert.ok(sprint.run('exitRunSpeed(1200)>exitRunSpeed(400)'));
sprint.run('clickScene({x:5390,y:GROUND-77})');sprint.tick(1);
assert.ok(sprint.run('pip.x')>900,'distant exit triggers a faster sprint');
sprint.tick(15);assert.equal(sprint.run('level'),2,'sprint arrives without overshooting the door');

const edges=setup();
edges.run('found=new Set(treasures.filter(t=>t.level===0&&! [5,6,7,15].includes(t.id)).map(t=>t.id));pip.x=4510');
assert.equal(edges.run('sniffMessage()'),'');
edges.run('pip.x=5300');assert.equal(edges.run('sniffMessage()'),'');
for(let area=0;area<4;area++){
 edges.run(`level=${area};pip.x=160;held=-1`);edges.tick(1);assert.equal(edges.run('pip.x'),160);assert.equal(edges.run('pip.moving'),false);
 edges.run('pip.x=worldWidth()-100;held=1');edges.tick(1);assert.equal(edges.run('pip.x===worldWidth()-100'),true);assert.equal(edges.run('pip.moving'),false);
}

const forgiving=setup();forgiving.run('pip.x=440-67-30;pokeAhead()');forgiving.tick(.4);assert.equal(forgiving.run('holes[0].hits'),1);assert.equal(forgiving.run('pip.x'),343,'wide peck does not snap Pip');
const running=setup();running.run('keys.add("Shift");held=1');running.tick(1);assert.equal(running.run('pip.x'),690);running.run('stopWalking()');assert.equal(running.run('walkingSpeed()'),135);assert.equal(running.run('exits().filter(e=>e.to===1).length'),1);

const doorway=setup();doorway.run('pip.x=1133;requestPortal(1200)');doorway.tick(.1);assert.equal(doorway.run('level'),0);assert.equal(doorway.run('!!entering'),true);doorway.tick(.35);assert.ok(doorway.run('pip.x')>1133);doorway.tick(1.4);assert.equal(doorway.run('level'),1);
for(const id of [18,20,28,32]){
 const wall=setup();wall.run(`level=treasures[${id}].level;pip.x=treasures[${id}].x-67;pokeAhead()`);wall.tick(.4);assert.equal(wall.run('particles.some(p=>p.y<GROUND-20)'),true);
 for(let poke=1;poke<wall.run(`digsNeeded(treasures[${id}])`);poke++){wall.run('pokeAhead()');wall.tick(.4)}wall.tick(6);assert.equal(wall.run(`found.has(${id})`),true);assert.equal(wall.run('cargo.length'),1);
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
const party=setup();party.run(`level=1;found=new Set(treasures.filter(t=>t.level===1).map(t=>t.id));cargo=treasures.filter(t=>t.level===1).flatMap(t=>Array.from({length:t.count},()=>({id:nextCargo++,tid:t.id,level:1,status:'cart',secured:true})));checkLevelSuccess()`);assert.equal(party.run('confetti.length'),90);party.run('checkLevelSuccess()');assert.equal(party.run('confetti.length'),90);party.tick(7);assert.equal(party.run('confetti.length'),0);

// Stair routes, identification, fitted collections, spacing and save compatibility.
for(const [area,destination,direction] of [[0,1,1],[1,0,-1],[1,3,1],[3,1,-1]]){
 const stairs=setup();stairs.run(`level=${area};pip.x=exits().find(e=>e.to===${destination}).x===210?250:exits().find(e=>e.to===${destination}).x-67;requestPortal(exits().find(e=>e.to===${destination}))`);stairs.tick(.1);assert.equal(stairs.run('entering.direction'),direction);stairs.tick(1.8);assert.equal(stairs.run('level'),destination);
}
const identification=setup();identification.run('pip.x=373;pokeAhead()');identification.tick(.4);assert.equal(identification.run('findLabel'),null);identification.run('pokeAhead()');identification.tick(.4);assert.equal(identification.run('findLabel.id'),0);assert.equal(identification.run('findLabel.x'),440);identification.tick(5);assert.ok(identification.run('time>findLabel.until'));identification.el('#confirm-reset').onclick();assert.equal(identification.run('findLabel'),null);
const collections=setup();
for(let a=0;a<4;a++)for(let b=a+1;b<4;b++)assert.equal(collections.run(`treasures.filter(t=>t.level===${a}).some(t=>treasures.some(u=>u.level===${b}&&u.shape===t.shape))`),false);
for(let id=0;id<34;id++){
 assert.equal(collections.run(`svg(treasures[${id}].shape).includes('undefined')`),false);
 assert.equal(collections.run(`Object.values(ropeFit({tid:${id}})).every(Number.isFinite)`),true);
}
collections.run('found=new Set(treasures.map(t=>t.id));save()');const collectionReload=setup(collections.storage());assert.equal(collectionReload.run('found.size'),118);assert.equal(collectionReload.run('cargo.length'),142);
const spacing=setup();
for(let area=0;area<4;area++){
 const positions=Array.from(spacing.run(`treasures.filter(t=>t.level===${area}).map(t=>t.x)`));const gaps=positions.slice(1).map((x,i)=>x-positions[i]);
 assert.ok(new Set(gaps).size>=4);assert.ok(Math.max(...gaps)>Math.min(...gaps)*2);assert.ok(Math.min(...gaps)>130);
 spacing.run(`level=${area}`);assert.equal(spacing.run('treasures.filter(t=>t.level===level).every(t=>t.x>300&&t.x<worldWidth()-180&&exits().every(e=>Math.abs(e.x-t.x)>100))'),true);
}
spacing.run('save()');assert.deepEqual(Array.from(setup(spacing.storage()).run('treasures.map(t=>t.x)')),Array.from(spacing.run('treasures.map(t=>t.x)')));
const swaying=setup();swaying.run(`cargo=Array.from({length:12},(_,tid)=>({id:nextCargo++,tid,level:0,status:'cart',secured:true}));held=1;keys.add('Shift')`);swaying.tick(.5);const angle=swaying.run('orderedPile().at(-1).angle');swaying.tick(.4);assert.notEqual(swaying.run('orderedPile().at(-1).angle'),angle);swaying.run('cargo[0].tip=.7');swaying.tick(3);assert.equal(swaying.run('cargo.every(c=>c.secured&&c.status==="cart")'),true);assert.equal(swaying.run('spills'),0);swaying.run('stopWalking()');swaying.tick(5);assert.ok(swaying.run('Math.abs(orderedPile().at(-1).angle-Math.sin(11*3.3)*.22)')<.001);
const topple=setup();topple.run(`found=new Set([0,1,2,3,4,5,6,7,8,9,10,11]);cargo=Array.from(found,tid=>({id:nextCargo++,tid,level:0,status:'cart',secured:tid===9,x:cart.x,y:GROUND-60}));`);
for(let i=0;i<300&&!topple.run('brakes');i++)topple.tick(1/60);
assert.equal(topple.run('brakes'),true);const stopped=topple.run('pip.x'),parked=topple.run('cart.x');topple.run('held=1;keys.add("Shift");pip.target=pip.x+500;pokeAhead()');topple.tick(1);
assert.equal(topple.run('pip.x'),stopped);assert.equal(topple.run('cart.x'),parked);assert.equal(topple.run('action'),null);assert.equal(topple.run('pendingPortal'),null);assert.ok(topple.run('spills')>1);assert.equal(topple.run('cargo.find(c=>c.tid===9).status'),'cart');
let sawReload=false;for(let i=0;i<6000&&topple.run('brakes');i++){topple.tick(1/60);if(topple.run('bean.state==="toss"'))sawReload=true;if(sawReload&&topple.run('bean.state==="fetch"||bean.state==="carry"'))assert.equal(topple.run('orderedPile().every(c=>c.secured)'),true)}
assert.equal(sawReload,true);assert.equal(topple.run('brakes'),false);assert.equal(topple.run('cargo.length'),12);assert.equal(topple.run('cargo.every(c=>c.status==="cart"&&c.secured)'),true);
const brakeSave=setup();brakeSave.run(`found.add(0);cargo=[{id:1,tid:0,level:0,status:'ground',x:cart.x+30,y:GROUND-18}];brakes=true;save()`);const brakeReload=setup(brakeSave.storage());assert.equal(brakeReload.run('brakes'),true);brakeReload.tick(12);assert.equal(brakeReload.run('brakes'),false);assert.equal(brakeReload.run('cargo[0].secured'),true);

// Lower knots compress the entire pile above, and Bean has a supported perch.
const settling=setup();settling.run(`cargo=Array.from({length:4},(_,tid)=>({id:nextCargo++,tid,level:0,status:'cart'}));cart.x=pip.x-155;cart.v=0;`);settling.tick(.1);
const beforeY=settling.run('orderedPile().at(-1).y');
settling.run(`bean.state='pack';bean.packItem=orderedPile()[0].id;bean.packTime=packDuration()/2;`);settling.tick(1/60);
assert.ok(settling.run('orderedPile().at(-1).y')>beforeY,'tightening a lower item lowers everything above it');
settling.tick(20);assert.equal(settling.run('cargo.every(c=>c.secured)'),true);
assert.ok(settling.run('orderedPile().at(-1).y')>=beforeY+10,'the whole stack compacts');
assert.equal(settling.run('packingPerch(orderedPile()[0]).lift'),51);
assert.equal(settling.run('packingPerch(orderedPile()[1]).lift'),settling.run('GROUND-1-(orderedPile()[0].y-18)'));

// The tow rope follows the same rear-view pose as Pip on both stair directions.
for(const direction of [1,-1]){
 const rope=setup();rope.run(`entering={elapsed:.5,direction:${direction}};`);
 const start=rope.run('towHitch().y');
 rope.run('entering.elapsed=.85');
 assert.equal(rope.run('towHitch().x'),rope.run('stairPose().x'));
 assert.equal(rope.run('towHitch().y'),rope.run('stairPose().y-44*1.08'));
 assert.ok((rope.run('towHitch().y')-start)*direction>0,'rope moves with Pip on the stairs');
}
const desertSign=setup();desertSign.run('level=1;updateUI()');assert.equal(desertSign.run('exits()[0].label'),'Desert ↑');assert.equal(desertSign.el('#portal').textContent,'Desert ↑');

// Every find takes its assigned 1–4 pokes, including after a partial-dig reload.
const efforts=new Set();
for(let id=0;id<34;id++){
 let dig=setup();dig.run(`level=treasures[${id}].level;pip.x=treasures[${id}].x-67`);
 const needed=dig.run(`digsNeeded(treasures[${id}])`);efforts.add(needed);
 for(let poke=1;poke<=needed;poke++){
  dig.run('pokeAhead()');dig.tick(.3);
  assert.equal(dig.run(`found.has(${id})`),poke===needed,`find ${id}, poke ${poke}/${needed}`);
  if(poke===1&&needed>1){dig.run('save()');dig=setup(dig.storage());}
 }
}
assert.deepEqual([...efforts].sort(),[1,2,3,4]);

// The two pyramid floors share a loaded cart; only leaving the complex unloads it.
let expedition=setup();expedition.run(`level=1;found.add(16);cargo=[{id:nextCargo++,tid:16,level:1,status:'cart',secured:true,x:cart.x,y:GROUND-67}];pendingPortal=exits().find(e=>e.to===3);changeLevel()`);
assert.equal(expedition.run('level'),3);assert.equal(expedition.run('orderedPile().length'),1);assert.equal(expedition.run('cargo[0].secured'),true);
expedition.run('save()');expedition=setup(expedition.storage());assert.equal(expedition.run('currentCargo().length'),1,'upstairs finds survive a reload downstairs');
expedition.run(`found.add(29);cargo.push({id:nextCargo++,tid:29,level:3,status:'cart',secured:true,x:cart.x,y:GROUND-77});pendingPortal=exits()[0];changeLevel()`);
assert.equal(expedition.run('level'),1);assert.equal(expedition.run('orderedPile().length'),2);assert.equal(expedition.run('cargo[1].level'),3,'finds retain their catalogue area');
expedition.run('save()');expedition=setup(expedition.storage());assert.equal(expedition.run('currentCargo().length'),2,'both floors remain aboard after reload');
expedition.run('pendingPortal=exits()[0];changeLevel()');assert.equal(expedition.run('level'),0);assert.equal(expedition.run('currentCargo().length'),0);assert.equal(expedition.run('cargo.every(c=>c.status==="stored"&&c.secured)'),true);
expedition.run('pendingPortal=exits()[0];changeLevel()');assert.equal(expedition.run('currentCargo().length'),0,'revisiting does not reload deposited finds');

// Clicking open space projects vertically to the walking surface.
const projected=setup();
for(const y of [0,100,300]){projected.run(`clickScene({x:800,y:${y}})`);assert.equal(projected.run('pip.target'),800);assert.equal(projected.run('pip.pokeX'),null)}
projected.tick(4);assert.equal(projected.run('pip.x'),800);
projected.run('clickScene({x:-20,y:30})');assert.equal(projected.run('pip.target'),160);
projected.run('clickScene({x:1200,y:20})');assert.equal(projected.run('pendingPortal'),null);assert.equal(projected.run('pip.target'),1200);
projected.run('clickScene({x:1200,y:GROUND-50})');assert.equal(projected.run('pendingPortal.to'),1);
projected.run('pendingPortal=null;level=1;clickScene({x:treasures[18].x,y:findY(holes[18])})');assert.equal(projected.run('pip.pokeX'),projected.run('treasures[18].x'));

const oasisSign=setup();
oasisSign.run('pip.x=5300;held=1');oasisSign.tick(2);assert.equal(oasisSign.run('level'),0,'walking past the sign does not travel');
oasisSign.run('stopWalking();clickScene({x:5310,y:GROUND})');assert.equal(oasisSign.run('pendingPortal'),null,'ground below the sign only walks');
oasisSign.run('requestPortal(5310)');assert.equal(oasisSign.run('pendingPortal'),null,'route shortcuts cannot bypass the sign');
oasisSign.run('clickScene({x:5390,y:GROUND-77})');assert.equal(oasisSign.run('pendingPortal.to'),2);oasisSign.tick(3);assert.equal(oasisSign.run('level'),2);

// Naxos unlocks after Egypt, and the complete Greek expedition carries its cargo.
let greek=setup();greek.run('level=2');assert.equal(greek.run('exits().some(e=>e.to===4)'),false);
greek.run('completedLevels=new Set([0,1,2,3]);clickScene({x:2650,y:GROUND-123})');greek.tick(10);assert.equal(greek.run('level'),4);
for(let area=4;area<=7;area++){
 for(const id of Array.from(greek.run(`treasures.filter(t=>t.level===${area}).map(t=>t.id)`))){
  greek.run(`stopWalking();pip.x=treasures[${id}].x-67;pip.face=1;cart.x=pip.x-145;bean.x=cart.x-65`);
  for(let n=0;n<greek.run(`digsNeeded(treasures[${id}])`);n++){greek.run('pokeAhead()');greek.tick(.3)}
  greek.tick(25);assert.equal(greek.run(`found.has(${id})`),true);
  assert.equal(greek.run(`svg(treasures[${id}].shape).includes('undefined')`),false);
 }
 greek.tick(30);assert.equal(greek.run(`completedLevels.has(${area})`),true);
 assert.equal(greek.run('currentCargo().every(c=>c.status==="cart"&&c.secured)'),true);
 greek.run('save()');greek=setup(greek.storage());assert.equal(greek.run('currentCargo().length'),(area-3)*6+2);
 if(area<7){greek.run('requestPortal(exits().at(-1),true)');greek.tick(12);assert.equal(greek.run('level'),area+1)}
}
for(let area=7;area>=4;area--){greek.run('requestPortal(exits()[0],true)');greek.tick(15);assert.equal(greek.run('level'),area===4?2:area-1)}
assert.equal(greek.run('cargo.filter(c=>c.status==="stored").length'),26);assert.equal(greek.run('currentCargo().length'),0);
console.log('PASS: Naxos unlock, all 24 finds, all four Greek completions, shared cargo, reloads, return routes and harbour unloading.');

// Only the oasis sign authorizes running behind the boundary rocks.
const oasisReturn=setup();oasisReturn.run('level=2;pip.x=170;held=-1');oasisReturn.tick(2);assert.equal(oasisReturn.run('pip.x'),160);assert.equal(oasisReturn.run('level'),2);
oasisReturn.run('stopWalking();clickScene({x:20,y:100})');oasisReturn.tick(1);assert.equal(oasisReturn.run('pip.x'),160);
oasisReturn.run('clickScene({x:210,y:GROUND-123})');oasisReturn.tick(.6);assert.equal(oasisReturn.run('level'),2);assert.ok(oasisReturn.run('pip.x')<105,'Pip runs behind the rocks');oasisReturn.tick(2);assert.equal(oasisReturn.run('level'),0);
const departurePacking=setup();departurePacking.run(`level=2;pip.x=285;found.add(22);cargo=[{id:nextCargo++,tid:22,level:2,status:'cart',secured:false,x:cart.x,y:GROUND-67}];clickScene({x:210,y:GROUND-123})`);departurePacking.tick(.5);assert.ok(departurePacking.run('pip.x')<160,'departure does not wait for packing');departurePacking.tick(20);assert.equal(departurePacking.run('level'),0);assert.equal(departurePacking.run('cargo[0].status'),'stored');

const desertDeparture=setup();desertDeparture.run('pip.x=worldWidth()-110;held=1');desertDeparture.tick(1);assert.equal(desertDeparture.run('pip.x'),5420);assert.equal(desertDeparture.run('level'),0);
desertDeparture.run('stopWalking();clickScene({x:5390,y:GROUND-77})');desertDeparture.tick(.6);assert.equal(desertDeparture.run('level'),0);assert.ok(desertDeparture.run('pip.x')>5520,'Pip runs behind the right boundary before departing');assert.equal(desertDeparture.run('pip.face'),1);
desertDeparture.tick(2);assert.equal(desertDeparture.run('level'),2);

// Loaded cart and Bean follow into the same stair opening in both directions.
for(const [area,to,tid] of [[1,3,16],[3,1,29]]){
 const convoy=setup();convoy.run(`level=${area};const gate=exits().find(g=>g.to===${to});pip.x=gate.x===210?250:gate.x-67;cart.x=pip.x-155;bean.x=cart.x-65;found.add(${tid});cargo=[{id:nextCargo++,tid:${tid},level:${area},status:'cart',secured:true,x:cart.x,y:GROUND-67}];requestPortal(gate)`);
 convoy.tick(.1);const oldCart=convoy.run('cart.x');convoy.tick(.35);
 assert.notEqual(convoy.run('cart.x'),oldCart);assert.ok(Math.abs(convoy.run('cart.x')-convoy.run('pendingPortal.x'))>20,'cart is still rolling after the first half second');
 const cargoY=convoy.run('cargo[0].y');convoy.tick(.8);
 assert.equal(convoy.run('cargo[0].y'),cargoY,'cargo stays at its ground-level height while Pip takes the stairs');
 assert.equal(convoy.run('cart.x'),convoy.run('pendingPortal.x'),'cart parks across the doorway');
 convoy.run(`ctx.save=ctx.restore=ctx.beginPath=ctx.clip=ctx.moveTo=ctx.lineTo=ctx.stroke=()=>{};ctx.rect=(...args)=>{ctx.lastClip=args};drawTowRope()`);
 assert.equal(convoy.run('ctx.lastClip[2]'),76,'rope is clipped to actual doorway width');
 convoy.tick(1);assert.equal(convoy.run('level'),to);assert.equal(convoy.run('cargo[0].status'),'cart');assert.equal(convoy.run('cargo[0].secured'),true);
}

const alcoves=setup();assert.deepEqual([...new Set(Array.from(alcoves.run('treasures.filter(t=>t.wall).map(digsNeeded)')))].sort(),[1,2,3,4],'alcove blocking stones span one to four pecks');
alcoves.run('save()');const reloadedAlcoves=setup(alcoves.storage());assert.deepEqual(Array.from(reloadedAlcoves.run('treasures.filter(t=>t.wall).map(digsNeeded)')),Array.from(alcoves.run('treasures.filter(t=>t.wall).map(digsNeeded)')),'alcove firmness stays consistent across reloads');

// Changing rooms never waits for fetching, tossing, or unfinished knots.
for(const status of ['ground','carry','fall','cart']){
 const travel=setup();travel.run(`level=1;pip.x=2433;cart.x=2288;bean.x=400;found.add(16);cargo=[{id:nextCargo++,tid:16,level:1,status:'${status}',secured:false,x:400,y:GROUND-18,vx:0,vy:0}];bean.state='fetch';requestPortal(exits().at(-1))`);
 travel.tick(.1);assert.equal(travel.run('!!entering'),true,`${status} cargo must not block stairs`);
 travel.tick(1.8);assert.equal(travel.run('level'),3);assert.equal(travel.run('cargo.length'),1);assert.equal(travel.run('cargo[0].secured'),false,'travel does not auto-tie cargo inside a site');
 assert.ok(travel.run('cargo[0].x')>0&&travel.run('cargo[0].x')<600,'unfinished finds arrive nearby');
 travel.run('save()');const resumed=setup(travel.storage());resumed.tick(20);assert.equal(resumed.run('cargo[0].status'),'cart');assert.equal(resumed.run('cargo[0].secured'),true,'Bean resumes his work after arrival and reload');
}
const quickExit=setup();quickExit.run(`level=2;pip.x=250;found=new Set(treasures.filter(t=>t.level===2).map(t=>t.id));cargo=treasures.filter(t=>t.level===2).flatMap(t=>Array.from({length:t.count},()=>({id:nextCargo++,tid:t.id,level:2,status:'ground',secured:false,x:2200,y:GROUND-18})));brakes=true;clickScene({x:210,y:GROUND-123})`);quickExit.tick(4);
assert.equal(quickExit.run('level'),0);assert.equal(quickExit.run('cargo.length'),8);assert.equal(quickExit.run('cargo.every(c=>c.status==="stored"&&c.secured)'),true);assert.equal(quickExit.run('completedLevels.has(2)'),true,'warehouse handoff records the complete collection');

// Bean stays on the current floor while Pip and the cart take the stairs.
for(const area of [1,3]){
 const waitingBean=setup();waitingBean.run(`level=${area};const exit=exits().find(e=>e.to===${area===1?3:1});pip.x=exit.x===210?250:exit.x-67;bean.x=900;requestPortal(exit)`);waitingBean.tick(.1);
 const beanX=waitingBean.run('bean.x');waitingBean.tick(.8);
 assert.ok(Math.abs(waitingBean.run('bean.x')-waitingBean.run('pendingPortal.x'))<Math.abs(beanX-waitingBean.run('pendingPortal.x')),'Bean approaches the door');assert.equal(waitingBean.run('bean.lift'),0);assert.equal(waitingBean.run('bean.moving'),true);
 waitingBean.tick(1);assert.equal(waitingBean.run('level'),area===1?3:1);assert.equal(waitingBean.run('bean.state'),'follow');
}

// Cannon fires on discovery, without waiting for fetching or knots, once per area.
const instantParty=setup();instantParty.run(`level=1;found=new Set(treasures.filter(t=>t.level===1&&t.id!==21).map(t=>t.id));reveal(holes[21])`);
assert.equal(instantParty.run('confetti.length'),90);assert.equal(instantParty.run('cargo[0].status'),'fall');assert.equal(instantParty.run('completedLevels.has(1)'),false);
instantParty.run('save()');const partyReload=setup(instantParty.storage());partyReload.tick(.1);assert.equal(partyReload.run('confetti.length'),0,'reload does not replay the cannon');
instantParty.tick(7);instantParty.run('checkLevelSuccess()');assert.equal(instantParty.run('confetti.length'),0,'packing does not fire a second celebration');

// Bean keeps retrieving dropped finds while Pip uses the stairs, then joins him.
const busyBean=setup();busyBean.run(`level=1;pip.x=2433;bean.x=900;found.add(16);cargo=[{id:nextCargo++,tid:16,level:1,status:'ground',secured:false,x:350,y:GROUND-18}];requestPortal(exits().at(-1))`);busyBean.tick(.1);
const fetchingX=busyBean.run('bean.x');busyBean.tick(.4);assert.ok(busyBean.run('bean.x')<fetchingX,'Bean moves toward the dropped item, away from the door');assert.equal(busyBean.run('bean.state'),'fetch');assert.equal(busyBean.run('bean.lift'),0);
busyBean.tick(1.5);assert.equal(busyBean.run('level'),3);assert.ok(busyBean.run('bean.x')<600,'Bean appears with Pip on the destination floor');assert.equal(busyBean.run('currentCargo().length'),1);
busyBean.tick(20);assert.equal(busyBean.run('cargo[0].secured'),true);

const wallScent=setup();wallScent.run('level=1;pip.x=treasures[18].x');assert.equal(wallScent.run('alcoveScentVisible(holes[18])'),false);
wallScent.run('doSniff()');assert.equal(wallScent.run('alcoveScentVisible(holes[18])'),true);
wallScent.run('pip.x-=421');assert.equal(wallScent.run('alcoveScentVisible(holes[18])'),false);
wallScent.run('pip.x=treasures[18].x;holes[18].hits=digsNeeded(holes[18]);found.add(18)');assert.equal(wallScent.run('alcoveScentVisible(holes[18])'),false,'empty alcoves never glow');
wallScent.run('found.delete(18);holes[18].hits=0');wallScent.tick(7);assert.equal(wallScent.run('alcoveScentVisible(holes[18])'),false,'alcove glow expires with sniff');

const sniffParty=setup();sniffParty.run('doSniff()');assert.equal(sniffParty.run('confetti.length'),0);
sniffParty.run('level=1;found=new Set(treasures.filter(t=>t.level===1).map(t=>t.id));doSniff()');assert.equal(sniffParty.run('confetti.length'),90,'sniff celebrates all finds even before packing');
sniffParty.run('doSniff()');assert.equal(sniffParty.run('confetti.length'),180,'another sniff fires the cannon again');
sniffParty.run('level=3;doSniff()');assert.equal(sniffParty.run('confetti.length'),180,'an unfinished area does not celebrate');

const floorConfetti=setup();floorConfetti.run(`confetti=[{x:500,y:GROUND-5,vx:30,vy:100,life:3,angle:0,spin:4,color:'#fff'}]`);floorConfetti.tick(.1);
assert.equal(floorConfetti.run('confetti[0].settled'),true);assert.equal(floorConfetti.run('confetti[0].y'),floorConfetti.run('GROUND-2'));
const restingX=floorConfetti.run('confetti[0].x');floorConfetti.tick(.5);assert.equal(floorConfetti.run('confetti[0].x'),restingX);assert.equal(floorConfetti.run('confetti[0].y'),floorConfetti.run('GROUND-2'));floorConfetti.tick(1);assert.equal(floorConfetti.run('confetti.length'),0);

// Jungle unlock and the entire expedition: roots, wall finds, cargo, saves, and return.
let jungle=setup();jungle.run('level=4');assert.equal(jungle.run('exits().some(e=>e.to===8)'),false);
jungle.run('completedLevels=new Set([0,1,2,3,4,5,6,7]);clickScene({x:1650,y:GROUND-123})');jungle.tick(10);assert.equal(jungle.run('level'),8);
assert.equal(jungle.run('sameSite(4,8)'),false);assert.equal(jungle.run('sameSite(8,11)'),true);
for(let area=8;area<=11;area++){
 assert.equal(jungle.run(`treasures.filter(t=>t.level===${area}&&t.buried).length`),3);
 for(const id of Array.from(jungle.run(`treasures.filter(t=>t.level===${area}).map(t=>t.id)`))){
  jungle.run(`stopWalking();pip.x=treasures[${id}].x-67;pip.face=1;cart.x=pip.x-145;bean.x=cart.x-65`);
  const effort=jungle.run(`digsNeeded(treasures[${id}])`);assert.ok(effort>=1&&effort<=4);
  for(let n=0;n<effort;n++){jungle.run('pokeAhead()');jungle.tick(.3);if(n===0&&jungle.run(`treasures[${id}].rooted`))assert.equal(jungle.run(`found.has(${id})`),false,'first peck removes roots before excavation');}
  jungle.tick(25);assert.equal(jungle.run(`found.has(${id})`),true);assert.equal(jungle.run(`svg(treasures[${id}].shape).includes('undefined')`),false);
 }
 jungle.tick(30);assert.equal(jungle.run(`completedLevels.has(${area})`),true);assert.equal(jungle.run('currentCargo().every(c=>c.secured)'),true);
 jungle.run('save()');jungle=setup(jungle.storage());assert.equal(jungle.run('currentCargo().length'),(area-7)*6+2);
 if(area<11){jungle.run('requestPortal(exits().at(-1),true)');jungle.tick(12);assert.equal(jungle.run('level'),area+1)}
}
for(let area=11;area>=8;area--){jungle.run('requestPortal(exits()[0],true)');jungle.tick(15);assert.equal(jungle.run('level'),area===8?4:area-1)}
assert.equal(jungle.run('currentCargo().length'),0);assert.equal(jungle.run('cargo.filter(c=>c.status==="stored").length'),26);
console.log('PASS: jungle unlock, 24 unique finds, roots, four areas, cart preservation, reload and return to Naxos.');

// Six later scenes form two independent sites, with explicit stair directions.
let later=setup();later.run('level=8');assert.equal(later.run('exits().some(e=>e.to===12)'),false);
later.run('completedLevels=new Set(Array.from({length:12},(_,i)=>i));clickScene({x:1630,y:GROUND-123})');later.tick(12);assert.equal(later.run('level'),12);
assert.equal(later.run('sameSite(8,12)'),false);assert.equal(later.run('sameSite(12,14)'),true);assert.equal(later.run('sameSite(14,15)'),false);assert.equal(later.run('sameSite(15,17)'),true);
assert.equal(later.run('exits().some(e=>e.to===15)'),false);
for(let area=12;area<=17;area++){
 assert.equal(later.run('level'),area);
 assert.equal(later.run(`treasures.filter(t=>t.level===${area}&&t.buried).length`),3);
 later.run('pip.x=160;held=-1');later.tick(.2);assert.equal(later.run('pip.x'),160);later.run('stopWalking()');
 for(const id of Array.from(later.run(`treasures.filter(t=>t.level===${area}).map(t=>t.id)`))){
  later.run(`stopWalking();pip.x=treasures[${id}].x-67;pip.face=1;cart.x=pip.x-145;bean.x=cart.x-65;sniff=0`);
  if(later.run(`treasures[${id}].buried&&!treasures[${id}].wall`)){
   assert.equal(later.run(`surfaceVisible(holes[${id}])`),false);
   later.run('doSniff()');assert.equal(later.run(`surfaceVisible(holes[${id}])`),true);
  }
  const effort=later.run(`digsNeeded(holes[${id}])`);assert.ok(effort>=1&&effort<=4);
  for(let n=0;n<effort;n++){later.run('pokeAhead()');later.tick(.3)}
  assert.equal(later.run(`found.has(${id})`),true);later.tick(25);
  assert.equal(later.run(`svg(treasures[${id}].shape).includes('undefined')`),false);
 }
 later.tick(30);assert.equal(later.run(`completedLevels.has(${area})`),true);assert.equal(later.run('currentCargo().every(c=>c.secured)'),true);
 const cargoCount=later.run('currentCargo().length');later.run('save()');later=setup(later.storage());assert.equal(later.run('currentCargo().length'),cargoCount);
 if(area===14){
  for(const destination of [13,12,15]){later.run(`requestPortal(exits().find(e=>e.to===${destination}),true)`);later.tick(14);assert.equal(later.run('level'),destination)}
  assert.equal(later.run('currentCargo().length'),0);assert.equal(later.run('cargo.filter(c=>c.status==="stored").length'),20);
 }else if(area<17){
  if(area===13)assert.equal(later.run('stairDirection(exits().at(-1))'),1);
  if(area===16)assert.equal(later.run('stairDirection(exits().at(-1))'),-1,'observatory is upstairs');
  later.run('requestPortal(exits().at(-1),true)');later.tick(14);assert.equal(later.run('level'),area+1);
 }
}
for(const destination of [16,15,12,8]){later.run(`requestPortal(exits().find(e=>e.to===${destination}),true)`);later.tick(14);assert.equal(later.run('level'),destination)}
assert.equal(later.run('cargo.filter(c=>c.status==="stored").length'),40);assert.equal(later.run('currentCargo().length'),0);
assert.equal(later.run('areas.length'),18);assert.equal(later.run('new Set(laterFinds.map(f=>f.shape)).size'),36);
console.log('PASS: six new scenes, 36 unique finds, hidden sniff clues, excavation, packing, both stair directions, saves, unlocks and warehouse returns.');


// Exit guide follows real doors, unlocked expeditions, and the current departure.
const guide=setup();
guide.run('level=8;camera=0');assert.equal(guide.run('exitGuide().gate.to'),9);assert.equal(guide.run('exitGuide().direction'),'right');
guide.run('completedLevels=new Set([8,9,10,11]);camera=1200');assert.equal(guide.run('exitGuide().gate.to'),12);assert.equal(guide.run('exitGuide().direction'),'down');assert.equal(guide.run('exitGuide().x'),430);
guide.run('camera=1700');assert.equal(guide.run('exitGuide().direction'),'left');assert.ok(guide.run('exitGuide().x')>0);
guide.run('level=17;camera=0');assert.equal(guide.run('exitGuide().gate.to'),15);assert.equal(guide.run('exitGuide().label'),'Lift · Castle');
guide.run('level=12;completedLevels=new Set([12,13,14]);camera=0');assert.equal(guide.run('exitGuide().gate.to'),15);
guide.run('requestPortal(exits()[0],true)');assert.equal(guide.run('exitGuide().gate.to'),8,'an explicitly chosen departure takes priority');
guide.el('#scene').clientWidth=320;assert.ok(guide.run('exitGuide().x/W*320')>=76,'label stays within a narrow screen');


// Freight lifts skip intermediate stairs and preserve all collected objects.
for(const [from,to,tid,down] of [[3,0,28,false],[7,4,52,false],[11,8,76,false],[14,12,94,false],[17,15,112,true]]){
 let lift=setup();lift.run(`level=${from};pip.x=942;cart.x=797;bean.x=720;found.add(${tid});cargo=[{id:nextCargo++,tid:${tid},level:${from},status:'cart',secured:true,x:cart.x,y:GROUND-67}];clickScene({x:880,y:GROUND-90})`);
 assert.equal(lift.run('pendingPortal.lift'),true);assert.equal(lift.run('pendingPortal.to'),to);assert.equal(lift.run('pendingPortal.down'),down);
 lift.tick(.1);assert.equal(lift.run('entering.lift'),true);lift.tick(1);
 assert.equal(lift.run('level'),from,'lift animates before travel');assert.equal(lift.run('Math.sign(liftOffset())'),down?1:-1);
 assert.equal(lift.run('cargo[0].secured'),true);assert.equal(lift.run('bean.lift'),0);
 lift.tick(1.2);assert.equal(lift.run('level'),to);assert.equal(lift.run('entering'),null);assert.equal(lift.run('cargo.length'),1);
 assert.equal(lift.run('cargo[0].status'),from===3?'stored':'cart');
 lift.run('save()');lift=setup(lift.storage());assert.equal(lift.run('level'),to);assert.equal(lift.run('cargo.length'),1);assert.equal(lift.run('cargo[0].secured'),true);
}
const unfinishedLift=setup();unfinishedLift.run(`level=11;pip.x=942;found.add(76);cargo=[{id:1,tid:76,level:11,status:'ground',secured:false,x:2100,y:GROUND-18}];requestPortal(exits().find(e=>e.lift))`);unfinishedLift.tick(2.4);
assert.equal(unfinishedLift.run('level'),8,'a lift never waits for unfinished packing');assert.equal(unfinishedLift.run('cargo.length'),1);assert.equal(unfinishedLift.run('cargo[0].secured'),false);unfinishedLift.tick(30);assert.equal(unfinishedLift.run('cargo[0].secured'),true,'Bean resumes work at the top');
console.log('PASS: five express lifts, convoy animation, direct travel, loaded carts, warehouse handoff, unfinished cargo and saved arrivals.');


// Double-click running is a destination command, never a persistent speed toggle.
const clickRun=setup();clickRun.run('pip.x=330;runToSpot({x:850,y:80})');clickRun.tick(.5);assert.ok(clickRun.run('pip.x')>=509,'double-click travels at running speed');
assert.equal(clickRun.run('pip.pokeX'),null);clickRun.tick(2);assert.equal(clickRun.run('pip.x'),850);assert.equal(clickRun.run('pip.target'),null);assert.equal(clickRun.run('walkingSpeed()'),135);
clickRun.run('walkToGround(1100)');clickRun.tick(.5);assert.ok(clickRun.run('pip.x')<930,'the next single click walks');
clickRun.run('runToSpot({x:99999,y:40})');assert.equal(clickRun.run('pip.target'),5420,'run destinations respect the rocks');
clickRun.run('held=-1');clickRun.tick(.5);assert.equal(clickRun.run('walkingSpeed()'),135,'keyboard movement cancels destination sprint');
clickRun.run('held=0;runToSpot({x:1500,y:GROUND});pokeAhead()');assert.equal(clickRun.run('pip.runTo'),false);assert.equal(clickRun.run('pip.target'),null);
clickRun.run('action=null;brakes=true;runToSpot({x:2000,y:GROUND})');assert.equal(clickRun.run('pip.target'),null,'Bean’s brakes still stop movement');
