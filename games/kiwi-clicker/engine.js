export const KEY = 'squeewi:kiwi-clicker:v1';
export const upgrades = [
 {id:'beak', name:'Beak polish', description:'+1 peck per press. A shiny beak slips through the air faster.', base:15, click:1},
 {id:'intern', name:'Kiwi intern', description:'+1 peck / second. Small bird. First big job.', base:30, rate:1},
 {id:'snacks', name:'Worm snack tin', description:'+1 peck per press. A well-fed professional.', base:80, click:1, scene:'Snack tin'},
 {id:'clockwork', name:'Clockwork button poker', description:'+1 peck / second. Tick, tock, peck.', base:150, rate:1, scene:'⚙️ Clockwork poker'},
 {id:'flock', name:'Night-shift flock', description:'+5 pecks / second. They brought snacks.', base:1200, rate:5},
 {id:'factory', name:'Button pressing factory', description:'+20 pecks / second. Buttons roll in. Machines press.', base:7500, rate:20},
 {id:'large', name:'Large button', description:'+4 pecks per press. A bigger target for big ambitions.', base:600, click:4, scene:'🔴 Large button'},
 {id:'double', name:'Double button', description:'+3 pecks per press. Twice the buttons. Twice the ambition.', base:450, click:3, scene:'🔴🔴 Double button'},
 {id:'worms', name:'Worm farm', description:'+2 pecks / second. Fresh snacks, around the clock.', base:450, rate:2, scene:'Worm farm'},
 {id:'gold', name:'Golden beak sleeve', description:'+10 pecks per press. Impractical. Magnificent.', base:10000, click:10, scene:'✨ Golden beak sleeve'},
 {id:'buffet',name:'Worm salad bar',description:'+12 pecks per press. All you can peck.',base:14000,click:12},
 {id:'union',name:'Button slide',description:'+18 pecks / second. Wheee. Click. Wheee.',base:22000,rate:18},
 {id:'inspection',name:'Button trampoline',description:'+25 pecks per press. Bounce into button business.',base:35000,click:25},
 {id:'seesaw',name:'Button seesaw',description:'+25 pecks / second. Taking turns is productive.',base:50000,rate:25},
 {id:'staircase',name:'Button staircase',description:'+30 pecks per press. Every step counts.',base:75000,click:30},
 {id:'carousel',name:'Pecking carousel',description:'+35 pecks / second. Another button comes around.',base:110000,rate:35},
 {id:'conga',name:'Button rain machine',description:'+45 pecks / second. Pull the cord. Let the BBs do the rest.',base:160000,rate:45}
];
const LIMIT=1e100;
const originalIds=new Set(['beak','intern','flock','factory']);
export function fresh(now=Date.now()){return {version:1,balance:0,total:0,owned:Object.fromEntries(upgrades.map(u=>[u.id,0])),savedAt:now,legacyPower:0,legacyRate:0,empireComplete:false};}
export function restore(raw,now=Date.now()){
 try{const s=JSON.parse(raw); if(s.version!==1 || !Number.isFinite(s.balance)||s.balance<0||s.balance>LIMIT||!Number.isFinite(s.total)||s.total<s.balance||s.total>LIMIT||!Number.isFinite(s.savedAt)||s.savedAt<0) return fresh(now);
 const state=fresh(now);state.empireComplete=s.empireComplete===true;state.balance=s.balance;state.total=s.total;state.savedAt=Math.min(s.savedAt,now);
 const retired=['training','academy','moon','spring'].map(id=>s.owned?.[id]??0);
 if(retired.some(n=>!Number.isInteger(n)||n<0||n>1000))return fresh(now);
 const legacyPower=s.legacyPower??0,legacyRate=s.legacyRate??0;
 if(!Number.isFinite(legacyPower)||legacyPower<0||legacyPower>LIMIT||!Number.isFinite(legacyRate)||legacyRate<0||legacyRate>LIMIT)return fresh(now);
 state.legacyPower=legacyPower+25*retired[0]+8*retired[3];state.legacyRate=legacyRate+150*retired[1]+1500*retired[2];
 for(const u of upgrades){const n=s.owned?.[u.id]??(originalIds.has(u.id)?undefined:0); if(!Number.isInteger(n)||n<0||n>1000)return fresh(now); state.owned[u.id]=n;}return state;
 }catch{return fresh(now);}
}
export const power=s=>1+(s.legacyPower||0)+upgrades.reduce((n,u)=>n+(u.click||0)*s.owned[u.id],0);
export const rate=s=>(s.legacyRate||0)+upgrades.reduce((n,u)=>n+(u.rate||0)*s.owned[u.id],0);
export const cost=(s,u)=>Math.ceil(u.base*1.18**s.owned[u.id]);
export function earn(s,n){if(Number.isFinite(n)&&n>0){s.balance=Math.min(LIMIT,s.balance+n);s.total=Math.min(LIMIT,s.total+n);}}
export const unlockAt=u=>u.base>10000?10000:u.base>1000?1000:0;
export const unlocked=(s,u)=>s.total>=unlockAt(u)||(s.owned[u.id]||0)>0;
export function buy(s,id){const u=upgrades.find(u=>u.id===id);if(!u||!unlocked(s,u)||s.owned[id]>=1000)return false;const price=cost(s,u);if(s.balance<price)return false;s.balance-=price;s.owned[id]++;return true;}
export function catchUp(s,now=Date.now()){const seconds=Math.max(0,Math.min(8*3600,(now-s.savedAt)/1000));const amount=seconds*rate(s);earn(s,amount);s.savedAt=now;return amount;}

export const empireStages=[
 {name:'Backyard operation',target:1000,helpers:['intern','snacks'],note:'Earn 1,000 pecks and hire an intern with a snack tin.'},
 {name:'Button business',target:10000,helpers:['clockwork','flock','factory'],note:'Earn 10,000 pecks and put a clockwork poker, flock, and factory to work.'},
 {name:'Button domination',target:1000000,helpers:upgrades.map(u=>u.id),note:'Earn 1 million pecks and collect at least one of every upgrade.'},
 {name:'The Big Peck',target:1000000,helpers:[],note:'Gather the whole operation for one magnificently unnecessary button press.'}
];
export function empireStage(s){return empireStages.findIndex((stage,i)=>i===3||s.total<stage.target||stage.helpers.some(id=>!s.owned[id]));}
export function completeEmpire(s){if(s.empireComplete||empireStage(s)!==3)return false;s.empireComplete=true;return true;}
