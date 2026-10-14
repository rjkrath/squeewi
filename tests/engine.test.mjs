import {test} from 'node:test';import assert from 'node:assert/strict';import {fresh,restore,earn,buy,power,rate,cost,upgrades,catchUp,unlocked,empireStage,completeEmpire} from '../games/kiwi-clicker/engine.js';
test('clicking, spending and scaling upgrades',()=>{const s=fresh();assert.equal(buy(s,'beak'),false);earn(s,45);assert.equal(buy(s,'beak'),true);assert.equal(power(s),2);assert.equal(s.balance,30);assert.equal(cost(s,upgrades[0]),18);assert.equal(buy(s,'intern'),true);assert.equal(rate(s),1);assert.equal(s.balance,0);assert.equal(s.total,45);assert.equal(buy(s,'missing'),false);});
test('saves survive reload; malformed saves safely reset',()=>{const s=fresh(100);earn(s,100);buy(s,'intern');assert.deepEqual(restore(JSON.stringify(s),100),s);for(const raw of ['bad','null',JSON.stringify({...s,balance:-1}),JSON.stringify({...s,owned:{}})])assert.deepEqual(restore(raw,100),fresh(100));});
test('offline earnings cap at eight hours and ignore clock reversal',()=>{const s=fresh(1000);s.owned.intern=2;assert.equal(catchUp(s,1000+36000000),57600);assert.equal(catchUp(s,0),0);assert.equal(s.balance,57600);});

test('retired spring purchases keep manual bonuses but cannot be bought again',()=>{const s=fresh(100);s.owned.spring=2;const saved=restore(JSON.stringify(s),100);assert.equal(power(saved),17);assert.equal(rate(saved),0);assert.equal(buy(saved,'spring'),false);assert.deepEqual(restore(JSON.stringify(saved),100),saved);});
test('legacy saves keep their progress when new upgrades are introduced',()=>{const legacy={version:1,balance:120,total:500,owned:{beak:2,intern:3,spring:1,flock:0,factory:0},savedAt:100};const s=restore(JSON.stringify(legacy),100);assert.equal(s.balance,120);assert.equal(s.owned.intern,3);assert.equal(s.owned.snacks,0);assert.equal(power(s),11);assert.equal(rate(s),3);});
test('new manual and automatic upgrades add independently and scale in cost',()=>{const s=fresh();earn(s,100000);for(const id of ['snacks','gold','clockwork'])assert.equal(buy(s,id),true);assert.equal(power(s),12);assert.equal(rate(s),1);assert.equal(cost(s,upgrades.find(u=>u.id==='snacks')),95);});

test('retired upgrades preserve purchased benefits across repeated save reloads',()=>{const s=fresh(100);s.owned.training=2;s.owned.academy=1;s.owned.moon=1;const migrated=restore(JSON.stringify(s),100);assert.equal(power(migrated),51);assert.equal(rate(migrated),1650);assert.equal(buy(migrated,'training'),false);assert.deepEqual(restore(JSON.stringify(migrated),100),migrated);});

test('large and double buttons stack manual rewards while worm farms automate',()=>{const s=fresh();earn(s,10000);for(const id of ['large','double','worms'])assert.equal(buy(s,id),true);assert.equal(power(s),8);assert.equal(rate(s),2);assert.deepEqual(restore(JSON.stringify(s),s.savedAt),s);});

test('milestones unlock permanently after spending and survive reload',()=>{
 const s=fresh(100),flock=upgrades.find(u=>u.id==='flock'),gold=upgrades.find(u=>u.id==='buffet');
 earn(s,999);assert.equal(unlocked(s,flock),false);assert.equal(unlocked(s,gold),false);
 earn(s,1);assert.equal(unlocked(s,flock),true);buy(s,'large');assert.ok(s.balance<1000);assert.equal(unlocked(s,flock),true);
 earn(s,9000);assert.equal(unlocked(s,gold),true);buy(s,'factory');assert.ok(s.balance<10000);
 const saved=restore(JSON.stringify(s),100);assert.equal(unlocked(saved,gold),true);
});
test('later upgrades remain hidden and unbuyable until milestone',()=>{
 const s=fresh();s.balance=40000;assert.equal(buy(s,'buffet'),false);
 s.total=40000;assert.equal(buy(s,'buffet'),true);assert.equal(power(s),13);
});

test('all upgrades above 10000 stay behind the 10000 milestone',()=>{
 const s=fresh();earn(s,9999);
 for(const u of upgrades.filter(u=>u.base>10000)){assert.equal(unlocked(s,u),false);}
 earn(s,1);
 for(const u of upgrades.filter(u=>u.base>10000)){assert.equal(unlocked(s,u),true);}
 buy(s,'factory');
 for(const u of upgrades.filter(u=>u.base>10000)){assert.equal(unlocked(s,u),true);}
});

test('seven activity upgrades stack rewards and preserve prior purchases',()=>{
 const s=fresh(100);earn(s,1000000);
 for(const id of ['buffet','union','inspection','seesaw','staircase','carousel','conga'])assert.equal(buy(s,id),true);
 assert.equal(power(s),68);assert.equal(rate(s),123);
 assert.deepEqual(restore(JSON.stringify(s),100),s);
 const old=fresh(100);old.owned.buffet=2;old.owned.union=1;old.owned.inspection=1;
 const migrated=restore(JSON.stringify(old),100);
 assert.equal(migrated.owned.buffet,2);assert.equal(power(migrated),50);assert.equal(rate(migrated),18);
});

test('empire stages require earnings and the appropriate crew',()=>{const s=fresh();assert.equal(empireStage(s),0);earn(s,1000000);assert.equal(empireStage(s),0);s.owned.intern=1;s.owned.snacks=1;assert.equal(empireStage(s),1);for(const id of ['clockwork','flock','factory'])s.owned[id]=1;assert.equal(empireStage(s),2);assert.equal(completeEmpire(s),false);for(const u of upgrades)s.owned[u.id]=1;assert.equal(empireStage(s),3);s.balance=0;assert.equal(completeEmpire(s),true);assert.equal(completeEmpire(s),false);assert.equal(restore(JSON.stringify(s),s.savedAt).empireComplete,true);});
test('old saves begin with an uncompleted finale and reset clears it',()=>{const s=fresh(100);delete s.empireComplete;assert.equal(restore(JSON.stringify(s),100).empireComplete,false);assert.equal(fresh().empireComplete,false);});
