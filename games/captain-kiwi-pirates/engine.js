export const SAVE_KEY='squeewi:captain-kiwi-pirates:v1';
export const islands=[{name:'Little Beak Harbour',x:150,y:400},{name:'Palm & Pebble',x:510,y:220},{name:'Crescent Cay',x:820,y:430}];
export const clues=[
'Find the bottle washed up at Little Beak Harbour.',
'On Palm & Pebble, find the palm that bends toward the sea. A note waits at its roots.',
'The next keeper lives on Crescent Cay. Find the kiwi by the little trading table.',
'Back on Palm & Pebble, three pale stones form a triangle. Dig in its empty heart.',
'The treasure is found. Bring the chest home to Little Beak Harbour.'
];
export function fresh(){return {version:1,clue:0,stage:0,scene:'shore',island:0,x:150,y:400,px:200,py:330,hull:100,food:6,gold:0,cargo:0,level:0,shots:0,rivalHull:3,escaped:false,voyages:0,message:'A bottle has washed up beside the harbour. Walk over and inspect it.'};}
export function restore(raw){try{const s=JSON.parse(raw);if(s.version!==1||!Number.isInteger(s.stage)||s.stage<0||s.stage>4||!['shore','sea','encounter'].includes(s.scene))return fresh();const n=fresh();for(const k of ['x','y','px','py','hull','food','gold','cargo','level','shots','rivalHull','voyages','island']){if(!Number.isFinite(s[k])||s[k]<0)return fresh();}if(s.x>1000||s.y>620||s.px>1000||s.py>620||s.hull>100||s.food>20||s.level>3||s.island>2||!Number.isInteger(s.island)||!Number.isInteger(s.level))return fresh();const clue=s.clue===undefined?(s.stage===0?0:s.stage===1?1:4):s.clue;if(!Number.isInteger(clue)||clue<0||clue>4)return fresh();return {...n,...s,clue,message:s.clue===undefined&&s.stage===1?'Your bottle map holds the first clue. '+clues[1]:typeof s.message==='string'?s.message:n.message};}catch{return fresh();}}
export function act(s,action){const n={...s};const say=m=>n.message=m;
 if(action==='map'&&s.scene==='shore'&&s.island===0&&s.stage===0){n.stage=1;n.clue=1;say('The bottle holds the first clue: '+clues[1]);}
 if(action==='board'&&s.scene==='shore'&&s.stage>0){n.scene='sea';n.x=islands[s.island].x;n.y=islands[s.island].y;say('Crew aboard. Choose an island on the chart, or steer with arrows / WASD.');}
 if(action==='land'&&s.scene==='sea'){const i=islands.findIndex(i=>Math.hypot(i.x-s.x,i.y-s.y)<85);if(i>=0){n.scene='shore';n.island=i;n.px=200;n.py=330;say(i===1?'Palm & Pebble. Read your current clue and explore the shore.':i===0?'Welcome home. The shipwright is beside the dock.':'A quiet crescent of sand. A merchant waits by the palms.');if(i===0&&s.stage===3&&s.escaped){n.gold+=s.cargo;n.cargo=0;n.stage=4;n.voyages++;say('Treasure delivered! Your crew shares a feast. Spend your 120 coins at the shipwright, then explore Crescent Cay.');}}else say('Sail closer to an island to go ashore.');}
 if(action==='dig'&&s.scene==='shore'&&s.island===1&&Math.hypot(s.px-680,s.py-325)<75){if(s.stage===1&&s.clue===3){n.clue=4;n.stage=2;n.cargo=120;say('A chest! 120 gold coins aboard. Sail home — a rival has spotted your treasure.');}else if(s.stage===4&&s.cargo===0){n.cargo=35;say('You found a smaller chest: 35 coins. Bring it back to harbour.');}else say(s.stage===1?'You have not solved the clue trail yet. Read your current clue.':'Only sand remains in this hole.');}
 if(action==='inspect'&&s.scene==='shore'&&s.stage===1){
  if(s.clue===1&&s.island===1&&Math.hypot(s.px-440,s.py-270)<80){n.clue=2;say('A rolled note sits between the palm roots. '+clues[2]);}
  else if(s.clue===2&&s.island===2&&Math.hypot(s.px-665,s.py-320)<80)say('The merchant asks: “I am three, pale and still. We make a triangle on the sand. What are we?” Choose your answer below.');
  else say('Nothing hidden within beak reach. Walk closer to the landmark in your clue.');
 }
 if(action.startsWith('answer-')&&s.scene==='shore'&&s.island===2&&s.clue===2&&Math.hypot(s.px-665,s.py-320)<80){if(action==='answer-stones'){n.clue=3;say('“Exactly,” says the merchant, sliding a final note into your beak. '+clues[3]);}else say('“Look for three pale things that do not grow or move. Try again.”');}
 if(action==='hint'){say(['Look for the bottle beside the harbour dock.','On Palm & Pebble, walk to the roots of the left palm and inspect nearby.','Sail to Crescent Cay. Walk to the merchant on the right and inspect nearby.','Return to Palm & Pebble. Stand between the three stones on the right and dig.','Sail home and go ashore to bank your chest.'][s.clue]);}
 if(action==='bank'&&s.island===0&&s.scene==='shore'&&s.stage===4&&s.cargo){n.gold+=s.cargo;n.cargo=0;n.voyages++;say('Treasure safely banked at the harbour.');}
 if(action==='upgrade'&&s.scene==='shore'&&s.island===0){const cost=50+30*s.level;if(s.level>=3)say('The ship is fully upgraded.');else if(s.gold>=cost){n.gold-=cost;n.level++;n.hull=100;say('New sails and reinforced planks fitted. Faster sailing, stronger cannons, fresh hull.');}else say(`The shipwright needs ${cost} banked coins for the next upgrade.`);}
 if(action==='trade'&&s.scene==='encounter'){if(s.cargo>=40){n.cargo-=40;n.escaped=true;n.scene='sea';say('You traded 40 coins for safe passage. The rival turns away.');}else say('The rival wants 40 coins. Try the cannons or flee.');}
 if(action==='cannon'&&s.scene==='encounter'){n.rivalHull-=1+(s.level>0?1:0);n.hull=Math.max(15,s.hull-12);n.shots++;if(n.rivalHull<=0){n.scene='sea';n.escaped=true;say('Their sail is down! Your crew cheers. Sail home with the chest.');}else say('Direct hit! The rival fires back. Your repair crew is patching the hull.');}
 if(action==='flee'&&s.scene==='encounter'){n.hull=Math.max(15,s.hull-18);n.food=Math.max(0,s.food-1);n.scene='sea';n.escaped=true;say('Your crew unfurls every sail. You slip past the reef and escape!');}
 if(action==='fish'&&s.scene==='sea'){if(s.food<20){n.food++;say('One small fish for the galley. The cook approves.');}else say('The pantry is full.');}
 if(action==='merchant'&&s.scene==='shore'&&s.island===2){if(s.gold>=15){n.gold-=15;n.food=Math.min(20,s.food+5);n.hull=Math.min(100,s.hull+30);say('15 coins buys provisions and repair timber.');}else say('The merchant offers food and timber for 15 banked coins.');}
 return n;
}
export function sail(s,dx,dy,dt){if(s.scene!=='sea')return s;const speed=85+s.level*22;const n={...s,x:Math.max(45,Math.min(955,s.x+dx*speed*dt)),y:Math.max(70,Math.min(570,s.y+dy*speed*dt)),hull:Math.min(100,s.hull+dt*1.5)};if(s.stage===2&&Math.hypot(n.x-510,n.y-220)>125){n.scene='encounter';n.stage=3;n.message='A rival blocks the channel. Trade some treasure, flee under full sail, or fire your cannons.';}return n;}
