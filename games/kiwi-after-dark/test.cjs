// Deterministic simulation of the actual game, with a minimal canvas/DOM adapter.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const code=fs.readFileSync(__dirname+'/game.js','utf8');
function boot(store={}){let callback,time=0;const events={},els={};const context=new Proxy({createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]??(()=>{})});function el(id){return els[id]??=( {style:{},textContent:'',innerHTML:'',open:false,tagName:id==='#game'?'CANVAS':'BUTTON',onclick:null,handlers:{},addEventListener(k,f){this.handlers[k]=f;},setAttribute(){},focus(){},setPointerCapture(){},getContext:()=>context,getBoundingClientRect:()=>({left:0,top:0,width:1100,height:680}),showModal(){this.open=true;},close(){this.open=false;}} );}const w={addEventListener:(k,f)=>events[k]=f};vm.runInNewContext(code,{document:{querySelector:el},window:w,localStorage:{getItem:k=>store[k],setItem:(k,v)=>store[k]=v,removeItem:k=>delete store[k]},requestAnimationFrame:f=>callback=f,Math,JSON,Number,Set,console,confirm:()=>false,location:{reload(){}}});const advance=sec=>{for(let i=0;i<Math.ceil(sec*60);i++){time+=1000/60;callback(time);}};advance(.02);const key=(type,code)=>events[type]({code,repeat:false,target:el('#game'),preventDefault(){}});const click=(x,y)=>{el('#game').handlers.pointerdown({clientX:x,clientY:y,pointerId:1,preventDefault(){}});el('#game').handlers.pointerup({});};const state=()=>w.kiwiSnapshot();const visit=(x,y)=>{const before=state();click(x,y);advance(10);if(state().area===before.area&&state().pokes===before.pokes&&!state().ended){click(x,y);advance(.1);}};const start=()=>el('#begin').onclick();const home=()=>{el('#home').onclick();advance(20);};const end=()=>{home();click(175,350);advance(.1);assert(state().ended);};const collect=(x,y,id)=>{visit(x,y);assert.equal(state().carried,null,"Uncovered treasure stays on the ground");const d=state().drops.find(d=>d.id===id);assert(d,"Find is available on the ground");visit(d.x,d.y);assert.equal(state().carried,id,"Separate poke picks it up");assert(!state().drops.some(d=>d.id===id));};return{state,advance,key,click,visit,collect,start,home,end,el,store};}
// Reloading preserves the single location of each treasure, including unfinished carries.
{
 const game=boot();game.start();game.visit(340,540);assert.equal(game.state().carried,'stick');
 let reload=boot(game.store);assert.equal(reload.state().carried,'stick');assert(reload.state().spots.find(s=>s.id==='stick').done,'A carried stick cannot reappear at its original location');
 game.click(900,590);game.advance(5);game.key('keydown','Space');game.key('keyup','Space');assert.equal(game.state().carried,null);const dropped=game.state().drops.find(d=>d.id==='stick');assert(dropped);
 reload=boot(game.store);assert.equal(reload.state().carried,null);assert.equal(reload.state().drops.filter(d=>d.id==='stick').length,1,'A set-down treasure reloads once at its ground location');assert(reload.state().spots.find(s=>s.id==='stick').done);
 reload.start();reload.visit(dropped.x,dropped.y);assert.equal(reload.state().carried,'stick');assert.equal(reload.state().drops.length,0);
 reload=boot(reload.store);assert.equal(reload.state().carried,'stick');assert.equal(reload.state().drops.length,0,'Pickup removes the saved ground duplicate');
 reload.start();reload.home();assert(reload.state().collection.includes('stick'));reload=boot(reload.store);assert.equal(reload.state().carried,null);assert(reload.state().spots.find(s=>s.id==='stick').done,'A shelved stick stays absent after reload');
 reload.start();reload.end();reload.el('#next').onclick();assert(reload.state().spots.find(s=>s.id==='stick').done,'A new night cannot respawn a shelved stick');
 const oldSave=boot({'kiwi-night-v1':JSON.stringify({night:2,collection:['stick'],known:[]})});assert(oldSave.state().spots.find(s=>s.id==='stick').done,'Existing saves also hide collected sticks');
 const fullSave=boot({'kiwi-night-v1':JSON.stringify({night:3,collection:['stick','button','bell','stone','cap','shell','ribbon','cork','spool','label'],known:[]})});fullSave.start();fullSave.el('#route-west').onclick();fullSave.advance(12);assert(fullSave.state().spots.find(s=>s.id==='ribbonbush').done);assert(fullSave.state().spots.find(s=>s.id==='bottle').done,'Collected ornaments remain absent while their scenery stays');
 console.log('PASS: treasure pickup, set-down, repickup, shelf and new-night persistence, existing saves, and collected scenery ornaments.');
}
let g=boot();g.start();g.visit(340,540);assert.equal(g.state().carried,'stick');g.home();assert.deepEqual(Array.from(g.state().collection),['stick']);g.visit(390,400);assert.equal(g.state().snacks,1);g.visit(535,230);g.visit(886,225);assert(g.state().known.includes('hole'));g.visit(917,504);g.collect(630,510,'button');assert.equal(g.state().carried,'button');g.home();g.collect(765,390,'stone');assert.equal(g.state().carried,'stone');g.home();g.end();g.el('#next').onclick();assert.equal(g.state().night,2);assert(!g.state().ended);g.collect(886,225,'bell');assert.equal(g.state().carried,'bell');g.home();g.collect(630,510,'shell');assert.equal(g.state().carried,'shell');g.home();g.collect(765,390,'cap');assert.equal(g.state().carried,'cap');assert.equal(g.state().routes.length,0,'The last find must reach home before paths open');g.home();assert.equal(g.state().routes.length,3);for(const direction of ['west','east','south']){assert(!g.el('#route-'+direction).hidden);assert(!g.el('#route-'+direction).disabled);}assert.equal(g.state().collection.length,6);g.end();const restored=boot(g.store);assert.equal(restored.state().collection.length,6);assert.equal(restored.state().known.length,7);
// Contact happens on press; holding a collected item never flings it backwards.
g=boot();g.start();g.visit(290,510);g.key('keydown','Space');assert.equal(g.state().carried,'stick');const pressCount=g.state().pokes;g.advance(1.3);assert.equal(g.state().carried,'stick');assert.equal(g.state().drops.length,0);g.key('keyup','Space');assert.equal(g.state().pokes,pressCount);
// Putting an item down and recovering it still works with one occupied beak.
g.key('keydown','Space');assert.equal(g.state().carried,null);g.key('keyup','Space');let d=g.state().drops[0];g.visit(d.x,d.y);assert.equal(g.state().carried,'stick');g.home();assert(g.state().collection.includes('stick'));
// A held probe opens the hose while still pressed; release has no second impact.
g=boot();g.start();g.visit(490,385);g.key('keydown','Space');assert.equal(g.state().lawn.spraying,false);g.advance(.5);assert(g.state().lawn.spraying);assert.equal(g.state().pokes,1);g.key('keyup','Space');assert(g.state().lawn.spraying);assert.equal(g.state().pokes,1);
// Three nearby taps build pressure, without requiring a hold.
g=boot();g.start();g.visit(490,385);for(let i=0;i<2;i++){g.key('keydown','Space');assert.equal(g.state().lawn.spraying,false);g.key('keyup','Space');g.advance(.1);}g.key('keydown','Space');assert(g.state().lawn.spraying);g.key('keyup','Space');assert.equal(g.state().pokes,3);
// Pointer cancellation cannot turn a little contact into a later strong probe.
g=boot();g.start();g.visit(490,385);g.el('#game').handlers.pointerdown({clientX:560,clientY:385,pointerId:1,preventDefault(){}});assert.equal(g.state().pokes,1);g.el('#game').handlers.pointercancel();g.advance(3);assert.equal(g.state().lawn.spraying,false);
for(let i=0;i<2;i++){g.click(560,385);g.advance(.1);assert.equal(g.state().lawn.spraying,false);}g.el('#game').handlers.pointerdown({clientX:560,clientY:385,pointerId:1,preventDefault(){}});assert(g.state().lawn.spraying);g.el('#game').handlers.pointerup({});assert(g.state().lawn.spraying);
// Hold pressure does not repeatedly toggle a sprinkler button.
g=boot();g.start();g.visit(675,280);g.key('keydown','Space');assert(g.state().lawn.spraying);g.advance(1.2);g.key('keyup','Space');assert(g.state().lawn.spraying);g.key('keydown','Space');assert.equal(g.state().lawn.spraying,false);g.key('keyup','Space');
console.log('PASS: contact on press, held pressure before release, repeated-tap pressure, pointer cancellation, pressure timeout, single button contacts, occupied beak, and find recovery.');
// An uncollected first-night prize is still available on subsequent nights.
g=boot();g.start();g.end();g.el('#next').onclick();g.collect(765,390,'stone');assert.equal(g.state().carried,'stone');
// Keyboard movement, pause on blur, and empty-air pokes remain functional.
g=boot();g.start();const x=g.state().kiwi.x;g.key('keydown','KeyD');g.advance(.3);g.key('keyup','KeyD');assert(g.state().kiwi.x>x);g.key('keydown','Space');g.advance(.1);g.key('keyup','Space');assert.equal(g.state().pokes,1);
console.log('PASS: seven interactions, six collectibles, beak carry/deposit, press contact, probing, recovery, keyboard movement, night transitions, persistence, missed-find recovery.');
// Completing the lawn opens all three branches at once, with no prescribed order.
const original=['stick','button','bell','stone','cap','shell'];
const unlockedStore=()=>({'kiwi-night-v1':JSON.stringify({night:3,collection:original,known:[]})});
const go=(game,direction)=>{game.el('#route-'+direction).onclick();game.advance(12);};
g=boot({'kiwi-night-v1':JSON.stringify({night:3,collection:original.slice(0,5),known:[]})});g.start();
assert.equal(g.state().routes.length,0);for(const direction of ['west','east','south']){assert(g.el('#route-'+direction).hidden);go(g,direction);assert.equal(g.state().area,'patch');}
for(const [x,y] of [[20,465],[1090,465],[675,660]]){g.visit(x,y);assert.equal(g.state().area,'patch','Incomplete lawn cannot be left via an edge');}
g=boot(unlockedStore());g.start();assert.deepEqual(Array.from(g.state().openAreas),['patch','pond','orchard','shed']);assert.deepEqual(Array.from(g.state().routes,r=>r.direction),['west','east','south']);
for(const direction of ['west','east','south'])assert.equal(g.el('#route-'+direction).hidden,false);
// Start with the east branch, before collecting anything in the pond or orchard.
go(g,'east');assert.equal(g.state().area,'shed');assert.deepEqual(Array.from(g.state().routes,r=>r.direction),['west']);
g.collect(355,300,'spool');assert.equal(g.state().carried,'spool');g.home();assert.equal(g.state().area,'patch');assert(g.state().collection.includes('spool'));
go(g,'west');assert.equal(g.state().area,'orchard');g.collect(360,305,'pip');assert.equal(g.state().carried,'pip');g.home();assert(g.state().collection.includes('pip'));
go(g,'south');assert.equal(g.state().area,'pond');g.collect(390,250,'whistle');assert.equal(g.state().carried,'whistle');g.home();assert(g.state().collection.includes('whistle'));
assert.equal(boot(g.store).state().routes.length,3,'Existing saves keep every lawn branch available');
console.log('PASS: incomplete-lawn boundary gates, three simultaneous branch unlocks, free choice of first area, reciprocal returns, beak carry/home deposit, and save reload.');
// The paths work through pointer clicks and normal keyboard movement.
for(const [direction,to,x,y,backX,backY,keyCode,arrivalX,arrivalY] of [
 ['west','orchard',20,465,1090,465,'KeyA',930,465],
 ['east','shed',1090,465,20,465,'KeyD',170,465],
 ['south','pond',700,660,675,80,'ArrowDown',675,235]
]){
 g=boot(unlockedStore());g.start();g.click(x,y);for(let i=0;i<120&&!g.state().transitioning;i++)g.advance(.1);
 assert(g.state().transitioning);g.key('keydown','Space');g.key('keyup','Space');assert.equal(g.state().pokes,0,'No poke is needed to cross a path');g.advance(2);
 assert.equal(g.state().area,to);assert.equal(g.state().transitioning,false);assert.equal(g.state().kiwi.x,arrivalX);assert.equal(g.state().kiwi.y,arrivalY);
 assert(!g.el('#route-'+({west:'east',east:'west',south:'north'}[direction])).disabled,'Return control is ready after travel');
 g.visit(backX,backY);assert.equal(g.state().area,'patch');assert.equal(g.state().pokes,0);
 g.key('keydown',keyCode);g.advance(1);g.key('keyup',keyCode);g.advance(2);assert.equal(g.state().area,to,'Keyboard movement crosses the matching side');
}
console.log('PASS: west/east/south pointer and keyboard exits, reciprocal edge returns, horizontal/vertical camera travel, stable arrivals, and input protection.');
// All existing area interactions and finds still work in any order.
g=boot(unlockedStore());g.start();
for(const [direction,name,finds,extras] of [
 ['east','shed',[[355,300,'spool'],[850,280,'label'],[380,500,'marble']],[[830,475],[555,355]]],
 ['south','pond',[[390,250,'whistle'],[770,235,'thimble'],[390,505,'acorn']],[[685,475],[925,415]]],
 ['west','orchard',[[360,305,'pip'],[845,270,'ribbon'],[385,500,'cork']],[[800,525],[560,365]]]
]){
 for(const [x,y,id] of finds){go(g,direction);assert.equal(g.state().area,name);g.collect(x,y,id);assert.equal(g.state().carried,id);g.home();assert.equal(g.state().area,'patch');assert(g.state().collection.includes(id));}
 go(g,direction);for(const [x,y] of extras)g.visit(x,y);assert(g.state().spots.every(s=>s.done));g.home();
}
assert.equal(g.state().collection.length,15);assert.equal(boot(g.store).state().collection.length,15);g.end();g.el('#next').onclick();
for(const [direction,name] of [['east','shed'],['west','orchard'],['south','pond']]){go(g,direction);assert.equal(g.state().area,name);assert(g.state().spots.every(s=>s.done===['thread','seedtray','flowerpot','apple','ribbonbush','bottle'].includes(s.id)),'A new night resets scenery responses while keeping collected ornaments absent');g.home();}
console.log('PASS: arbitrary area order, all 15 finds, existing interactions, per-area state within a night, safe home paths, persistence, and nightly reset.');
// Lawn is part of the starting clearing, with physical consequences and learned smells.
g=boot();g.start();g.visit(430,215);assert(g.state().lawn.dug);assert.equal(g.state().snacks,0);g.click(430,215);g.advance(.1);assert.equal(g.state().snacks,1);
g.visit(560,385);assert.equal(g.state().lawn.spraying,false);g.key('keydown','Space');g.advance(.5);g.key('keyup','Space');assert(g.state().lawn.spraying);assert(g.state().lawn.wet);
g.visit(735,280);assert.equal(g.state().lawn.spraying,false);g.click(735,280);g.advance(.1);assert(g.state().lawn.spraying);
g.click(735,280);g.advance(.1);assert.equal(g.state().lawn.spraying,false);g.visit(960,355);assert.equal(g.state().carried,null);assert(g.el('#speech').textContent.includes('squeak'));g.click(960,355);g.advance(.1);assert(g.state().lawnKnowledge.ball>=2);g.visit(1018,355);g.key('keydown','KeyS');g.key('keyup','KeyS');assert(g.el('#speech').textContent.includes('squeak'));
assert(!g.state().spots.some(s=>s.id==='fence'));g.visit(340,540);assert.equal(g.state().carried,'stick');g.visit(630,510);assert.equal(g.state().carried,'stick');assert.equal(g.state().spots.find(s=>s.id==='leaves').done,false);g.home();g.collect(630,510,'button');assert.equal(g.state().carried,'button');g.home();g.end();g.el('#next').onclick();assert.equal(g.state().lawn.wet,false);assert.equal(g.state().lawn.spraying,false);assert(g.state().lawnKnowledge.ball>=2);assert(boot(g.store).state().lawnKnowledge.ball>=2);
g=boot();g.start();g.visit(735,280);g.visit(430,215);g.click(430,215);g.advance(.1);assert.equal(g.state().snacks,1);
g=boot();g.start();const sx=g.state().kiwi.x;g.key('keydown','ShiftLeft');g.key('keydown','KeyD');g.advance(.3);g.key('keyup','KeyD');g.key('keyup','ShiftLeft');assert(g.state().kiwi.x-sx>45);
console.log('PASS: lawn digging, hose poke pressure, sprinkler toggle, funny repeatable ball, occupied beak, gate removal, learned scents/save reload, nightly reset, and flightless scurry.');

// Starts ramp up, releases settle, and click arrival stays stable.
g=boot();g.start();g.advance(2);let before=g.state().kiwi.x;g.key('keydown','KeyD');g.advance(.05);const firstStep=g.state().kiwi.x-before;assert(firstStep>0&&firstStep<6);g.advance(.3);before=g.state().kiwi.x;g.advance(.05);assert(g.state().kiwi.x-before>firstStep);g.key('keyup','KeyD');before=g.state().kiwi.x;g.advance(.1);assert(g.state().kiwi.x>before);g.advance(.6);before=g.state().kiwi.x;g.advance(.3);assert(Math.abs(g.state().kiwi.x-before)<.1);
g.visit(460,450);assert(Math.hypot(g.state().kiwi.x-460,g.state().kiwi.y-450)<7);
console.log('PASS: gentle acceleration, bounded settling after release, and stable click arrival.');


// The freed foreground contains optional physical discoveries, with nightly reset.
g=boot();g.start();g.visit(230,590);assert.equal(g.state().spots.find(s=>s.id==='seedpod').done,false);g.key('keydown','Space');g.advance(.5);assert(g.state().spots.find(s=>s.id==='seedpod').done);g.key('keyup','Space');
g.visit(465,575);assert.equal(g.state().spots.find(s=>s.id==='dandelion').done,false);g.key('keydown','Space');g.advance(.5);assert(g.state().spots.find(s=>s.id==='dandelion').done);g.key('keyup','Space');
g.visit(790,565);g.click(790,565);assert(g.state().wet);g.advance(2.1);assert.equal(g.state().wet,false);g.visit(1010,580);g.click(1010,580);assert(g.state().known.includes('papercup'));assert(g.state().lawnKnowledge.papercup>=2);assert.equal(g.state().carried,null);
const extra=['seedpod','dandelion','dewleaf','papercup'];for(const id of extra)assert(g.state().known.includes(id));assert.equal(boot(g.store).state().known.filter(id=>extra.includes(id)).length,4);
g.end();g.el('#next').onclick();for(const id of extra)assert.equal(g.state().spots.find(s=>s.id===id).done,false);assert.equal(g.state().collection.length,0);assert.equal(g.state().unlocked,false);
console.log('PASS: seedpod and beetle discovery, dandelion scattering, dew splash/drying, paper cup encounters, learned notes/save reload, optional exploration, and nightly reset.');


// Concealed discoveries stay hidden through sniffing, reveal on a poke, and reset.
g=boot();g.start();const concealed=['seedpod','dewleaf','ball','papercup'];for(const id of concealed)assert(g.state().spots.find(s=>s.id===id).concealed);g.key('keydown','KeyS');g.key('keyup','KeyS');for(const id of concealed)assert(g.state().spots.find(s=>s.id===id).concealed,'Sniffing locates an object without removing its cover');
for(const [id,x,y] of [['seedpod',230,590],['dewleaf',790,565],['ball',960,355],['papercup',1010,580]]){g.visit(x,y);assert.equal(g.state().spots.find(s=>s.id===id).concealed,false,'A beak poke parts the foliage');assert(g.state().known.includes(id));}assert.equal(g.state().carried,null);g.end();g.el('#next').onclick();for(const id of concealed)assert(g.state().spots.find(s=>s.id===id).concealed);
console.log('PASS: four covered discoveries, scent without premature reveal, beak reveal, learned notes, and nightly concealment reset.');

// Sniffing on S must not share the old downward-movement binding.
g=boot();g.start();g.advance(2);const still={...g.state().kiwi};g.key('keydown','KeyS');g.advance(.4);g.key('keyup','KeyS');assert(Math.hypot(g.state().kiwi.x-still.x,g.state().kiwi.y-still.y)<.1);assert(g.el('#speech').textContent.includes('wriggly'));g.el('#speech').textContent='quiet';g.key('keydown','KeyR');g.key('keyup','KeyR');assert.equal(g.el('#speech').textContent,'quiet');g.key('keydown','ArrowDown');g.advance(.3);g.key('keyup','ArrowDown');assert(g.state().kiwi.y>still.y+10);
console.log('PASS: S sniffs without walking, R is unbound, and the down arrow still waddles.');

// Uncovering is separate from picking up, even during a held probe or a long wait.
g=boot();g.start();g.visit(565,510);g.el('#game').handlers.pointerdown({clientX:630,clientY:510,pointerId:1,preventDefault(){}});g.advance(1.5);assert.equal(g.state().carried,null);assert.equal(g.state().drops.length,1);g.el('#game').handlers.pointerup({});g.advance(2);d=g.state().drops[0];assert.equal(d.id,'button');g.visit(d.x,d.y);assert.equal(g.state().carried,'button');assert.equal(g.state().drops.length,0);g.home();g.visit(630,510);assert.equal(g.state().carried,null);assert.equal(g.state().drops.length,0,'Repeated source poke cannot duplicate a find');
// An occupied beak cannot silently replace a carried find with a ground treasure.
g=boot();g.start();g.visit(630,510);d=g.state().drops[0];g.visit(340,540);g.visit(d.x,d.y);assert.equal(g.state().carried,'stick');assert.equal(g.state().drops.length,1);assert.equal(g.state().drops[0].id,'button');g.home();g.visit(d.x,d.y);assert.equal(g.state().carried,'button');g.home();assert.deepEqual(Array.from(g.state().collection),['stick','button']);
// Unclaimed ground finds stay in their area when travelling away and back.
g=boot(unlockedStore());g.start();go(g,'east');g.visit(355,300);d=g.state().drops[0];go(g,'west');go(g,'east');assert.equal(g.state().drops.length,1);assert.equal(g.state().drops[0].id,'spool');g.visit(d.x,d.y);assert.equal(g.state().carried,'spool');g.home();assert(g.state().collection.includes('spool'));
console.log('PASS: ground-first discovery, no pickup on hold/wait, separate deliberate pickup, no duplicate finds, occupied-beak protection, and ground finds retained across area travel.');

// Solid props stop both walking and scurrying; clicks route around their footprints.
function assertOutside(game){const s=game.state();for(const o of s.solids)assert(((s.kiwi.x-o.x)/o.rx)**2+((s.kiwi.y-o.y)/o.ry)**2>=1-1e-5,`Kiwi overlaps ${o.id}`);}
function waddle(game,codes,seconds){for(const k of codes)game.key('keydown',k);for(let i=0;i<seconds*60;i++){game.advance(1/60);assertOutside(game);}for(const k of codes)game.key('keyup',k);game.advance(.7);assertOutside(game);}
g=boot();g.start();g.advance(2);assertOutside(g);
g.visit(620,270);waddle(g,['KeyD'],.9);assert(g.state().kiwi.x<=696,'The sprinkler blocks a frontal walk');
waddle(g,['KeyD','ShiftLeft'],1.5); // Every frame must remain outside, even if the round base deflects the bird.
g.visit(665,270);
g.click(735,280);g.advance(.1);assert(g.state().lawn.spraying,'The blocked sprinkler remains within beak reach');assertOutside(g);
waddle(g,['KeyD','ArrowDown'],1.2);assert(g.state().kiwi.x>735,'A diagonal input slides around the sprinkler');
g.visit(650,270);g.click(840,270);for(let i=0;i<300;i++){g.advance(1/60);assertOutside(g);}assert(Math.hypot(g.state().kiwi.x-840,g.state().kiwi.y-270)<7,'Click walking finds a path around the sprinkler');
g.visit(735,180);waddle(g,['ArrowDown','ShiftLeft'],.45);assert(g.state().kiwi.y<270,'The sprinkler blocks an approach from behind');
g.visit(830,270);waddle(g,['KeyA','ShiftLeft'],.45);assert(g.state().kiwi.x>735,'The sprinkler blocks an approach from the right');
g.visit(735,345);waddle(g,['ArrowUp'],.5);assert(g.state().kiwi.y>270,'The sprinkler blocks an approach from below');
g.home();waddle(g,['ArrowUp','ShiftLeft'],.25);assert(g.state().kiwi.y>318,'The burrow blocks walking through its mound');
g.click(175,235);for(let i=0;i<360;i++){g.advance(1/60);assertOutside(g);}assert(Math.hypot(g.state().kiwi.x-175,g.state().kiwi.y-235)<7,'A click behind home goes around the mound');
g.home();g.click(175,350);g.advance(.1);assert(g.state().ended,'The entrance remains reachable to curl up');g.el('#next').onclick();g.advance(2);assertOutside(g);
g=boot();g.start();g.visit(340,540);g.home();assert(g.state().collection.includes('stick'),'A solid home still banks carried finds');assertOutside(g);
g=boot();g.start();g.visit(765,390);for(let i=0;i<80;i++){g.advance(1/60);assertOutside(g);}const movedRock=g.state().solids.find(o=>o.id==='rock');assert.equal(movedRock.x,848,'The footprint follows the rolling rock');
g=boot(unlockedStore());g.start();go(g,'east');g.visit(710,465);waddle(g,['KeyD','ShiftLeft'],.8);assert(g.state().kiwi.x<830,'Bulky shed props block movement too');g.home();assert.equal(g.state().area,'patch');assertOutside(g);
console.log('PASS: solid footprints, four-sided sprinkler contact, scurry protection, diagonal sliding, click detours, home banking/sleep/respawn, moving rock bounds, and shed/route access.');

// Distant clicks are movement only, with no queued contact or automatic pickup.
g=boot();g.start();g.click(630,510);g.advance(10);assert.equal(g.state().pokes,0);assert.equal(g.state().spots.find(s=>s.id==='leaves').done,false);assert.equal(g.state().drops.length,0);g.advance(3);assert.equal(g.state().pokes,0,'Arrival and waiting never trigger a queued poke');
g.el('#game').handlers.pointerdown({clientX:630,clientY:510,pointerId:1,preventDefault(){}});g.advance(1.5);assert.equal(g.state().carried,null);assert.equal(g.state().drops.length,1);g.el('#game').handlers.pointerup({});d=g.state().drops[0];const resting={x:d.x,y:d.y};
g.click(630,510);g.advance(.1);assert.equal(g.state().carried,null,'Poking the source again does not select its nearby treasure');g.advance(3);assert.equal(g.state().drops[0].x,resting.x);assert.equal(g.state().drops[0].y,resting.y);
g.visit(400,470);const beforeApproach=g.state().pokes;g.click(d.x,d.y);g.advance(10);assert.equal(g.state().pokes,beforeApproach);assert.equal(g.state().carried,null,'Walking up to a small find does not pick it up');assert.equal(g.state().drops.length,1);g.click(d.x,d.y);g.advance(.1);assert.equal(g.state().carried,'button');assert.equal(g.state().drops.length,0);
g=boot();g.start();g.click(735,280);g.advance(10);assert.equal(g.state().lawn.spraying,false);assert.equal(g.state().pokes,0);g.click(735,280);g.advance(.1);assert(g.state().lawn.spraying,'A new nearby click can poke the sprinkler');
g=boot();g.start();g.click(630,510);g.key('keydown','ArrowUp');g.advance(.4);g.key('keyup','ArrowUp');g.advance(3);assert.equal(g.state().pokes,0);assert.equal(g.state().drops.length,0,'Keyboard steering cancels walking without retaining an object lock');
console.log('PASS: no distant poke locks, no arrival/wait contact, held discovery stays grounded, source pokes do not steal nearby finds, distant treasure approach without pickup, deliberate pickup, and fresh nearby sprinkler contact.');

// A press just outside beak reach remains movement-only even if held until arrival.
g=boot();g.start();g.visit(550,510);assert(Math.hypot(g.state().kiwi.x-630,g.state().kiwi.y-510)>80);g.el('#game').handlers.pointerdown({clientX:630,clientY:510,pointerId:1,preventDefault(){}});g.advance(2);assert.equal(g.state().pokes,0);assert.equal(g.state().drops.length,0);g.el('#game').handlers.pointerup({});g.click(630,510);g.advance(.1);assert.equal(g.state().carried,null);assert.equal(g.state().drops[0].id,'button');
console.log('PASS: out-of-reach holds stay movement-only through arrival, and a fresh close poke reveals a grounded find.');
