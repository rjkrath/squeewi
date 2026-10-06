export const KEY = 'squeewi:kiwi-clicker:v1';
export const upgrades = [
 {id:'beak', name:'Beak polish', description:'+1 peck per press.', base:15, click:1},
 {id:'intern', name:'Kiwi intern', description:'+1 peck / second.', base:30, rate:1},
 {id:'snacks', name:'Worm snack tin', description:'+3 pecks per press. A well-fed professional.', base:80, click:3, scene:'🪱 Snack tin'},
 {id:'clockwork', name:'Clockwork button poker', description:'+5 pecks / second. Tick, tock, peck.', base:150, rate:5, scene:'⚙️ Clockwork poker'},
 {id:'flock', name:'Night-shift flock', description:'+50 pecks / second. They brought snacks.', base:1200, rate:50},
 {id:'factory', name:'Button factory', description:'+300 pecks / second.', base:7500, rate:300},
 {id:'large', name:'Comically large button', description:'+20 pecks per press. A bigger target for big ambitions.', base:600, click:20, scene:'🔴 Large button'},
 {id:'double', name:'Double button', description:'+15 pecks per press. Combines with Large button for two large buttons.', base:450, click:15, scene:'🔴🔴 Double button'},
 {id:'worms', name:'Worm farm', description:'+15 pecks / second. Fresh snacks, around the clock.', base:450, rate:15, scene:'🪱 Worm farm'},
 {id:'gold', name:'Golden beak sleeve', description:'+120 pecks per press. Impractical. Magnificent.', base:10000, click:120, scene:'✨ Golden beak sleeve'}
];
const LIMIT=1e100;
const originalIds=new Set(['beak','intern','flock','factory']);
export function fresh(now=Date.now()){return {version:1,balance:0,total:0,owned:Object.fromEntries(upgrades.map(u=>[u.id,0])),savedAt:now,legacyPower:0,legacyRate:0};}
export function restore(raw,now=Date.now()){
 try{const s=JSON.parse(raw); if(s.version!==1 || !Number.isFinite(s.balance)||s.balance<0||s.balance>LIMIT||!Number.isFinite(s.total)||s.total<s.balance||s.total>LIMIT||!Number.isFinite(s.savedAt)||s.savedAt<0) return fresh(now);
 const state=fresh(now);state.balance=s.balance;state.total=s.total;state.savedAt=Math.min(s.savedAt,now);
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
export function buy(s,id){const u=upgrades.find(u=>u.id===id);if(!u||s.owned[id]>=1000)return false;const price=cost(s,u);if(s.balance<price)return false;s.balance-=price;s.owned[id]++;return true;}
export function catchUp(s,now=Date.now()){const seconds=Math.max(0,Math.min(8*3600,(now-s.savedAt)/1000));const amount=seconds*rate(s);earn(s,amount);s.savedAt=now;return amount;}
