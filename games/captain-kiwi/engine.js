export const KEY='squeewi:captain-kiwi:v1';
export const port={x:260,y:480};
export const grounds=[{x:650,y:410,r:130,name:'Silver shoal',value:8,unlock:0},{x:1170,y:780,r:145,name:'Coral banks',value:14,unlock:1},{x:1630,y:290,r:150,name:'Deepwater drift',value:24,unlock:2}];
export const upgrades=[{id:'hold',name:'Larger hold',base:180,detail:'+20 cargo capacity'},{id:'engine',name:'Engine refit',base:220,detail:'More speed; opens new grounds'},{id:'nets',name:'Crew & cranes',base:160,detail:'Faster hauls, more fish'}];
export const orders=[{amount:30,reward:180,label:'Deliver 30 fish to Featherport'},{amount:100,reward:500,label:'Deliver 100 fish in total'},{amount:220,reward:1000,label:'Deliver 220 fish in total'}];
export const fresh=()=>({version:1,x:port.x,y:port.y,credits:0,hull:100,cargo:0,cargoValue:0,sold:0,order:0,discoveries:[],owned:{hold:0,engine:0,nets:0}});
export const capacity=s=>30+s.owned.hold*20;
export const price=(s,u)=>Math.round(u.base*1.6**s.owned[u.id]);
export const atPort=s=>Math.hypot(s.x-port.x,s.y-port.y)<110;
export function buy(s,id){const u=upgrades.find(u=>u.id===id);if(!u||!atPort(s)||s.owned[id]>=8||s.credits<price(s,u))return false;s.credits-=price(s,u);s.owned[id]++;return true;}
export function sell(s){if(!atPort(s))return 0;let money=s.cargoValue;s.sold+=s.cargo;s.cargo=s.cargoValue=0;s.hull=100;while(s.order<orders.length&&s.sold>=orders[s.order].amount){money+=orders[s.order].reward;s.order++;}s.credits+=money;return money;}
export function restore(raw){try{const s=JSON.parse(raw);if(s.version!==1||!s.owned)throw 0;for(const k of ['x','y','credits','hull','cargo','cargoValue','sold','order'])if(!Number.isFinite(s[k])||s[k]<0)throw 0;for(const u of upgrades)if(!Number.isInteger(s.owned[u.id])||s.owned[u.id]<0||s.owned[u.id]>8)throw 0;if(s.x>1900||s.y>1200||s.hull>100||s.cargo>capacity(s)||!Number.isInteger(s.order)||s.order>3)throw 0;s.discoveries=Array.isArray(s.discoveries)?[...new Set(s.discoveries.filter(id=>landmarks.some(l=>l.id===id)))]:[];return s;}catch{return fresh();}}

export const landmarks=[{id:'light',x:480,y:150,name:'Old Gull Lighthouse',reward:90},{id:'wreck',x:1060,y:1050,name:'The Teacup Wreck',reward:140},{id:'isles',x:1760,y:650,name:'Sleeping Giant Isles',reward:220}];
export function discover(s,l){if(!landmarks.includes(l)||s.discoveries.includes(l.id)||Math.hypot(s.x-l.x,s.y-l.y)>95)return false;s.discoveries.push(l.id);s.credits+=l.reward;return true;}
export function haulCatch(s,g,boost=false){const amount=Math.min(capacity(s)-s.cargo,Math.floor((8+s.owned.nets*4)*(boost?1.5:1)));s.cargo+=amount;s.cargoValue+=amount*g.value;return amount;}
export function rescue(s){const before=s.cargo;s.cargo=Math.floor(before/2);s.cargoValue=before?Math.floor(s.cargoValue*s.cargo/before):0;s.x=port.x;s.y=port.y;s.hull=100;}
