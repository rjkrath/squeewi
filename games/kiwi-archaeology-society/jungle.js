// A fictional jungle ruin: the rainkeepers catalogued everything the river brought.
const jungleAreas=[
 {name:'The Canopy Trail',width:2500,regions:['River Landing','Fern Country','The Green Gate']},
 {name:'The Rain Courtyard',width:2500,regions:['The Moss Steps','Fountain of Small Frogs','The Root Stair']},
 {name:'The Root Vault',width:2500,regions:['Under the Fig Tree','The Tangled Archive','The Listening Door']},
 {name:'The Heart of the Temple',width:2500,regions:['The Rainkeepers’ Hall','The Great Seed','The Last Umbrella']}
];
const jungleCatalogue=[
 ['A frog of considerable dignity','Carved frog','jFrog',2,'A stone frog appointed to supervise the rain. Its attendance record is perfect.'],
 ['The ceremonial hot chocolate','Cacao cup','jCup',3,'Traces of cacao, cinnamon, and an assistant’s unusually optimistic fingerprint.'],
 ['A thoroughly impractical umbrella','Inside-out umbrella','jUmbrella',2,'Buried for centuries. Turned inside out within four seconds of excavation.'],
 ['The expedition’s spare feet','Tiny boots','jBoots',1,'Waterproof boots for somebody round and very close to the ground. Bean has opinions about the colour.'],
 ['Emergency rubber tree frogs','Rubber frogs ×3','jRubber',3,'Three squeaking frogs. Scholars believe they were used to annoy the real ones.'],
 ['A map that prefers the scenic route','Leaf map','jMap',4,'Every marked shortcut passes a snack tree. We respect the cartographer.'],
 ['The rainkeeper’s measuring jug','Rain jug','jJug',3,'Graduations read: damp, wet, very wet, and perhaps stay indoors.'],
 ['The mosaic of perpetual drizzle','Rain mosaic','jMosaic',4,'A tiny kiwi under a very large cloud. The artist understood the assignment.'],
 ['The official puddle inspector','Jade snail','jSnail',1,'Responsible for checking every puddle. Has reached the second one.'],
 ['The spoon of ceremonial chocolate','Cacao spoon','jSpoon',2,'A long spoon with a frog on the handle. Pip regards it as unnecessary competition.'],
 ['An ancient automatic sprinkler','Watering can','jCan',3,'Fully automatic if you persuade Bean to carry it around.'],
 ['The gong of inconvenient weather','Rain gong','jGong',4,'One strike requests rain. Two strikes also request rain. There is a design flaw.'],
 ['The archive of things with roots','Root tablet','jTablet',3,'An inventory of objects swallowed by the tree. The tree disputes ownership.'],
 ['A very patient gardener','Seed jar','jSeeds',2,'Seeds saved for a sunny day. Nobody remembers the last one.'],
 ['The forgotten pruning department','Bronze shears','jShears',4,'A serious solution to the roots. Unfortunately sized for a beetle.'],
 ['The world’s least useful compass','Worm compass','jCompass',1,'Always points to the nearest worm. Pip considers it flawless.'],
 ['An official mushroom umbrella','Mushroom parasol','jMushroom',3,'A carved mushroom used as a tiny sunshade. Some optimism survived here.'],
 ['The receipt for an Egyptian delivery','River receipt','jReceipt',2,'Received: nine rubber chickens. Forwarded: a box of teaspoons. The mystery gets wetter.'],
 ['The mask of the gentle rainkeeper','Rainkeeper mask','jMask',4,'A kindly round face with a long beak. Its inscription asks visitors to wipe their feet.'],
 ['The great seed of small beginnings','Golden seed','jSeed',3,'A gilded seed promising a mighty forest. Bean has asked whether it grows biscuits.'],
 ['The crown of temporary shelter','Leaf crown','jCrown',2,'A royal crown that doubles as a hat in a shower. Finally, sensible government.'],
 ['The boat of returning belongings','Tiny canoe','jCanoe',4,'A miniature cargo boat. Its manifest reads: if found, please return everything.'],
 ['The key to the dry cupboard','Fern key','jKey',1,'The most coveted office in the entire temple. Contents: one damp towel.'],
 ['The first keeper’s lunch box','Sacred lunch box','jLunch',4,'At the heart of the temple: a beautifully preserved lunch box. Somebody has already eaten the biscuits.']
];
const jungleFinds=jungleCatalogue.map(([name,short,shape,effort,desc],i)=>({
 level:8+Math.floor(i/6),name,short,shape,effort,desc,
 note:'RAINFOREST DIVISION · PLEASE KEEP THE PAPERWORK DRY',
 rarity:[2,3,4,10,15,23].includes(i)?'ABSURD · WATERPROOF-ISH':'ANCIENT · RAIN-WORN',
 x:[440,695,1080,1390,1825,2180][i%6],count:i===4?3:1,
 wall:[7,12,17,18].includes(i),rooted:[1,5,8,10,13,14,16,19,21,23].includes(i)
}));
const jungleArt={
 jFrog:'<ellipse cx="60" cy="76" rx="36" ry="25" fill="#87a58b"/><circle cx="39" cy="45" r="16" fill="#a9bda0"/><circle cx="79" cy="45" r="16" fill="#a9bda0"/><path d="M23 98L37 83M96 98L81 83" stroke="#65846f" stroke-width="12"/><circle cx="40" cy="44" r="4" fill="#365d50"/><circle cx="78" cy="44" r="4" fill="#365d50"/><path d="M44 70Q59 80 76 70" fill="none" stroke="#4e7861" stroke-width="3"/>',
 jCup:'<path d="M24 31H87L79 103H33Z" fill="#b47c56" stroke="#765d43" stroke-width="3"/><path d="M85 42Q117 40 104 69L83 74" fill="none" stroke="#ad8356" stroke-width="8"/><ellipse cx="55" cy="31" rx="31" ry="8" fill="#654e3e"/><path d="M29 59H83M32 84H81" stroke="#dcba7e" stroke-width="8"/><path d="M48 66L59 57 70 66 59 75Z" fill="#769b79"/>',
 jUmbrella:'<path d="M61 51V97Q61 114 44 103" fill="none" stroke="#99734d" stroke-width="5"/><path d="M11 25Q28 79 60 59Q90 79 111 25L87 40 61 18 33 40Z" fill="#d1a07d" stroke="#917554" stroke-width="3"/><path d="M61 18V59M33 40L60 59 87 40" fill="none" stroke="#ead3a1" stroke-width="3"/>',
 jBoots:'<path d="M23 23H49V75Q69 75 66 99H16V78L23 72Z" fill="#d5b660" stroke="#927c48" stroke-width="3"/><path d="M69 18H95V70Q115 70 112 94H63V72L69 67Z" fill="#a0ad79" stroke="#6a845e" stroke-width="3"/><path d="M17 95H64M64 90H110" stroke="#6a6e4d" stroke-width="5"/>',
 jRubber:'<ellipse cx="60" cy="75" rx="34" ry="28" fill="#b5bd5d"/><circle cx="39" cy="44" r="16" fill="#c7cc72"/><circle cx="82" cy="44" r="16" fill="#c7cc72"/><circle cx="40" cy="44" r="5" fill="#395a43"/><circle cx="80" cy="44" r="5" fill="#395a43"/><ellipse cx="61" cy="70" rx="11" ry="7" fill="#be7859"/><path d="M21 101L38 87M100 101L83 87" stroke="#8da358" stroke-width="10"/>',
 jMap:'<path d="M14 28L42 18 76 29 106 15V98L78 107 43 98 14 108Z" fill="#cfcc9c" stroke="#8c9c70" stroke-width="3"/><path d="M42 18V98M76 29V107" stroke="#a3af83" stroke-width="2"/><path d="M27 85Q85 72 51 49Q34 37 85 41" fill="none" stroke="#6d9779" stroke-width="4" stroke-dasharray="6 5"/><path d="M78 32L94 48M94 32L78 48" stroke="#bd805c" stroke-width="4"/>',
 jJug:'<path d="M35 21H80L75 41Q101 58 86 102H29Q17 60 40 40Z" fill="#7fa69b" stroke="#55786c" stroke-width="3"/><path d="M83 45Q111 35 105 73L92 79" fill="none" stroke="#719588" stroke-width="8"/><path d="M39 59H54M37 74H58M37 89H65" stroke="#e2d4a6" stroke-width="4"/>',
 jMosaic:'<rect x="14" y="16" width="92" height="92" rx="8" fill="#7b9584"/><rect x="23" y="25" width="74" height="74" fill="#bcc9ac"/><path d="M29 49Q20 30 43 36Q56 16 70 36Q99 27 91 51Z" fill="#7caaa5"/><path d="M39 57L34 68M59 57L54 68M80 57L75 68" stroke="#638e8c" stroke-width="3"/><ellipse cx="54" cy="83" rx="18" ry="12" fill="#af9164"/><path d="M69 77L89 90 70 82" fill="#d3b779"/>',
 jSnail:'<path d="M14 94H101Q115 68 92 73L78 88H14Z" fill="#98b598"/><circle cx="49" cy="65" r="31" fill="#6e9c87" stroke="#c2caa0" stroke-width="4"/><path d="M39 82Q18 54 51 48Q77 53 60 71Q47 82 42 64" fill="none" stroke="#aec6a4" stroke-width="4"/><path d="M95 77L91 54M101 79L109 59" stroke="#668c76" stroke-width="4"/>',
 jSpoon:'<path d="M58 102V41" stroke="#b5a170" stroke-width="9"/><ellipse cx="59" cy="27" rx="18" ry="23" fill="#d0bb82"/><ellipse cx="59" cy="28" rx="11" ry="15" fill="#ac985f"/><path d="M44 89Q60 75 76 89L69 106H48Z" fill="#7c9c7b"/><circle cx="49" cy="86" r="6" fill="#a8b98d"/><circle cx="71" cy="86" r="6" fill="#a8b98d"/>',
 jCan:'<path d="M32 44H89V99H32Z" fill="#7d9f8c" stroke="#52796a" stroke-width="3"/><path d="M86 51Q118 25 108 77L88 83M34 57L10 40 14 65 34 85" fill="none" stroke="#759384" stroke-width="9"/><path d="M43 44Q60 10 79 44" fill="none" stroke="#52796a" stroke-width="5"/><path d="M10 36L3 47" stroke="#c4c3a0" stroke-width="9"/>',
 jGong:'<path d="M18 108V20H102V108" fill="none" stroke="#9b8154" stroke-width="8"/><path d="M46 20V40M75 20V40" stroke="#c8b781" stroke-width="3"/><circle cx="60" cy="68" r="32" fill="#b6a267" stroke="#ddca8d" stroke-width="4"/><circle cx="60" cy="68" r="12" fill="#89976b"/><path d="M75 88L104 108" stroke="#8d7651" stroke-width="5"/>',
 jTablet:'<path d="M22 17H97V104H22Z" fill="#a3ac8a" stroke="#718570" stroke-width="4"/><path d="M31 31H81M35 49H83M37 69H71M35 88H80" stroke="#6d8873" stroke-width="4"/><path d="M19 13Q52 50 21 110M100 16Q68 56 102 106" fill="none" stroke="#8b7957" stroke-width="6"/>',
 jSeeds:'<path d="M37 24H81L79 42Q105 62 84 105H35Q16 63 41 43Z" fill="#bc9766" stroke="#886e4e" stroke-width="3"/><path d="M33 23H86" stroke="#d1b17c" stroke-width="9"/><ellipse cx="60" cy="72" rx="23" ry="19" fill="#e1cc96"/><path d="M60 89V62Q43 47 40 62Q42 73 59 72Q66 51 80 54Q83 70 60 76" fill="#80996b"/>',
 jShears:'<path d="M37 74L84 15M78 73L33 15" stroke="#9fa98e" stroke-width="10"/><circle cx="35" cy="90" r="17" fill="none" stroke="#ae8b5b" stroke-width="8"/><circle cx="83" cy="90" r="17" fill="none" stroke="#ae8b5b" stroke-width="8"/><circle cx="59" cy="49" r="7" fill="#d0b77b"/>',
 jCompass:'<circle cx="60" cy="63" r="40" fill="#cfbd86" stroke="#96835b" stroke-width="5"/><circle cx="60" cy="63" r="31" fill="#e3dfbc"/><path d="M60 30L72 70 60 91 48 58Z" fill="#699488"/><path d="M47 58Q37 47 43 41Q53 35 57 45" fill="none" stroke="#b48276" stroke-width="6"/>',
 jMushroom:'<path d="M53 55H69L78 108H44Z" fill="#cec39b"/><path d="M12 62Q18 9 62 12Q103 13 109 63Q61 79 12 62Z" fill="#b97559" stroke="#8e614c" stroke-width="3"/><ellipse cx="43" cy="36" rx="10" ry="7" fill="#e1cba2"/><ellipse cx="77" cy="48" rx="12" ry="8" fill="#e1cba2"/>',
 jReceipt:'<path d="M24 16H96L89 107 76 101 60 109 44 101 26 108Z" fill="#c5bf92"/><path d="M35 35H80M35 50H83M35 65H66" stroke="#6f8971" stroke-width="4"/><path d="M59 94L76 74 92 94Z" fill="#b29560"/>',
 jMask:'<path d="M27 23Q60 5 93 23L87 90 61 109 32 91Z" fill="#729a7f" stroke="#b9ba86" stroke-width="5"/><ellipse cx="59" cy="52" rx="25" ry="31" fill="#c8c49a"/><path d="M40 46Q47 53 53 46M66 46Q72 53 79 46" fill="none" stroke="#647d61" stroke-width="3"/><path d="M59 54L78 93 55 65" fill="#e1cf97"/><path d="M30 31L37 82M88 31L83 83" stroke="#a2b18a" stroke-width="4"/>',
 jSeed:'<path d="M61 11Q106 43 90 85Q79 113 49 105Q15 96 24 57Q32 26 61 11Z" fill="#c4aa63" stroke="#8e824f" stroke-width="3"/><path d="M60 22Q40 69 68 99" fill="none" stroke="#ead39b" stroke-width="5"/><path d="M60 18Q82 1 98 20Q85 35 60 18" fill="#789870"/>',
 jCrown:'<path d="M25 91L18 41 40 60 60 21 80 60 104 40 96 91Z" fill="#83a178" stroke="#536f58" stroke-width="3"/><path d="M24 83H97" stroke="#c4b77e" stroke-width="9"/><path d="M60 31V79M27 54L45 80M94 54L78 80" stroke="#b6c493" stroke-width="3"/>',
 jCanoe:'<path d="M9 56Q59 94 111 55L96 92Q61 114 24 91Z" fill="#a77e50" stroke="#745e42" stroke-width="3"/><ellipse cx="61" cy="62" rx="44" ry="12" fill="#6f7755"/><path d="M25 31L91 86" stroke="#c8b47b" stroke-width="6"/><ellipse cx="27" cy="33" rx="12" ry="21" transform="rotate(-48 27 33)" fill="#c8b47b"/>',
 jKey:'<path d="M58 44V108M58 84H79M58 98H72" stroke="#bba56d" stroke-width="9"/><path d="M59 56Q16 40 35 13Q64 6 59 56Q66 8 92 19Q106 44 59 56" fill="#83a387" stroke="#bdc092" stroke-width="3"/>',
 jLunch:'<rect x="18" y="37" width="85" height="67" rx="9" fill="#b28b58" stroke="#7d704d" stroke-width="4"/><path d="M18 51Q60 33 103 51" fill="none" stroke="#d5be80" stroke-width="7"/><path d="M42 36V22H78V36" fill="none" stroke="#779374" stroke-width="7"/><path d="M53 54H69V73H53Z" fill="#d5be80"/><path d="M31 86Q59 101 91 85" fill="none" stroke="#789471" stroke-width="5"/>'
};

function jungleLeaf(x,y,size,angle,color){
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);
 ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-size*.6,-size*.35,-size*.45,-size*.85,0,-size);ctx.bezierCurveTo(size*.45,-size*.85,size*.6,-size*.35,0,0);ctx.fillStyle=color;ctx.fill();
 line(0,0,0,-size*.88,'#c0d29544',1);ctx.restore();
}
function jungleScene(){
 const trail=level===8,court=level===9,vault=level===10,heart=level===11;
 const sky=ctx.createLinearGradient(0,0,0,GROUND);
 sky.addColorStop(0,trail?'#355d53':court?'#a6c7bf':vault?'#3a302c':'#182d41');
 sky.addColorStop(.6,trail?'#9bb89c':court?'#e0dab3':vault?'#635344':'#304b56');
 sky.addColorStop(1,trail?'#648866':court?'#abc0a0':vault?'#817057':'#526969');
 ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 if(trail){
  // Dense layered canopy, a winding river and tall buttress-rooted trees.
  for(let layer=0;layer<3;layer++)for(let i=-1;i<9;i++){
   const x=i*185-camera*(.1+layer*.13),top=50+(i*i*37+layer*41)%160;
   path([[x-17,GROUND],[x-9,top],[x+12,top],[x+28,GROUND]],['#88a88b','#6d9277','#507963'][layer]);
   ellipse(x,top,100-layer*10,46,['#9ab499','#75997d','#527e65'][layer]);
  }
  path([[0,329],[180,308],[390,342],[610,313],[W,333],[W,GROUND],[0,GROUND]],'#79a79a');
  path([[0,GROUND-28],[180,GROUND-49],[410,GROUND-24],[700,GROUND-42],[W,GROUND-20],[W,GROUND],[0,GROUND]],'#8ba47a');
  for(let i=0;i<10;i++)line(i*139-camera*.15%139,338+i%3*13,i*139+53-camera*.15%139,338+i%3*13,'#bfd0ad55',1);
  for(let i=0;i<7;i++){
   const x=50+i*410-camera*.85;if(x<-180||x>W+180)continue;
   path([[x-34,GROUND],[x-11,110],[x+20,100],[x+38,GROUND]],'#5c7353');
   path([[x-30,GROUND],[x-48,GROUND-3],[x-8,GROUND-53],[x+38,GROUND-2],[x+59,GROUND]],'#718261');
   for(let j=0;j<7;j++)jungleLeaf(x+6,134,110+(j%3)*16,(j-3)*.46,'#365f46');
   ctx.beginPath();ctx.moveTo(x+59,80);ctx.bezierCurveTo(x+12,212,x+104,235,x+45,325);ctx.strokeStyle='#90a470';ctx.lineWidth=4;ctx.stroke();
  }
 }else if(court){
  // Open sky and pale stepped terraces replace the forest's vertical tree trunks.
  ellipse(820-camera*.035,93,46,46,'#f8ecc1');
  for(let i=-1;i<6;i++){
   const x=i*570-camera*.3;
   for(let j=0;j<5;j++){ctx.fillStyle=j%2?'#91a994':'#a7b7a0';ctx.fillRect(x-180+j*28,GROUND-73-j*39,360-j*56,39)}
   path([[x-56,GROUND-229],[x-39,GROUND-247],[x+39,GROUND-247],[x+56,GROUND-229]],'#bdd0ac');
  }
  for(let i=-1;i<8;i++){
   const x=i*345-camera*.7;
   ctx.fillStyle='#c5c5a0';ctx.fillRect(x-167,GROUND-117,334,117);
   line(x-160,GROUND-109,x+160,GROUND-109,'#e0d7b4',7);
   for(let j=0;j<7;j++){path([[x-137+j*43,GROUND-90],[x-125+j*43,GROUND-75],[x-137+j*43,GROUND-60],[x-149+j*43,GROUND-75]],j%2?'#8fb1a0':'#abbb99');}
   path([[x-19,GROUND],[x-19,GROUND-160],[x+19,GROUND-160],[x+19,GROUND]],'#b5b990');
   path([[x-34,GROUND-161],[x-28,GROUND-184],[x+28,GROUND-184],[x+34,GROUND-161]],'#ded6b1');
   for(let j=-1;j<=1;j++)jungleLeaf(x+j*19,GROUND-164,31,j*.6,'#749570');
  }
  const x=1250-camera;
  path([[x-220,GROUND],[x-195,GROUND-32],[x+195,GROUND-32],[x+220,GROUND]],'#d4cfaa');
  ellipse(x,GROUND-35,172,25,'#b6bc9b');ellipse(x,GROUND-40,152,17,'#73aaa0');
  path([[x-35,GROUND-42],[x-27,GROUND-137],[x+27,GROUND-137],[x+35,GROUND-42]],'#b1bd97');
  ctx.drawImage(images.jFrog,x-47,GROUND-220,94,89);
  for(let j of [-1,1]){ctx.beginPath();ctx.moveTo(x+j*23,GROUND-148);ctx.quadraticCurveTo(x+j*110,GROUND-189,x+j*137,GROUND-43);ctx.strokeStyle='#d5e3c3aa';ctx.lineWidth=3;ctx.stroke();}
 }else if(vault){
  // Earthen excavation under a living tree, with massive roots instead of columns.
  for(let i=-1;i<8;i++){
   const x=i*370-camera*.65;
   ellipse(x,215,160,211,'#51493b');ellipse(x,246,134,169,'#776149');
   for(let j=0;j<4;j++)line(x-108,134+j*70,x+102,119+j*73,'#a18a6233',3);
  }
  path([[0,0],[W,0],[W,79],[880,52],[645,88],[420,63],[170,99],[0,71]],'#352f29');
  for(let i=-1;i<9;i++){
   const x=i*315-camera*.85;
   ctx.beginPath();ctx.moveTo(x,40);ctx.bezierCurveTo(x-130,145,x+112,278,x+46,GROUND);ctx.strokeStyle='#493c2e';ctx.lineWidth=35;ctx.stroke();ctx.strokeStyle='#a08758';ctx.lineWidth=19;ctx.stroke();ctx.strokeStyle='#c2a37366';ctx.lineWidth=4;ctx.stroke();
   ctx.beginPath();ctx.moveTo(x+1,173);ctx.bezierCurveTo(x+114,180,x+114,250,x+170,292);ctx.strokeStyle='#88724d';ctx.lineWidth=12;ctx.stroke();
   ctx.beginPath();ctx.moveTo(x+42,GROUND-24);ctx.quadraticCurveTo(x-40,GROUND-63,x-120,GROUND);ctx.strokeStyle='#9b8157';ctx.lineWidth=13;ctx.stroke();
  }
  for(let i=0;i<9;i++){
   const x=125+i*277-camera;if(x<-50||x>W+50)continue;
   const glow=ctx.createRadialGradient(x,GROUND-38,2,x,GROUND-38,69);glow.addColorStop(0,'#b2d7c444');glow.addColorStop(1,'#a4d5bb00');ctx.fillStyle=glow;ctx.fillRect(x-70,GROUND-110,140,110);
   line(x,GROUND-2,x,GROUND-38,'#aac4a1',5);ellipse(x,GROUND-39,24,12,'#83b7a1');ellipse(x-7,GROUND-42,7,3,'#d9e4bf');
  }
 }else{
  // A blue stone sanctum: broad ceremonial arches, gold seed murals, still air.
  for(let i=-1;i<7;i++){
   const x=i*450-camera*.75;
   ctx.fillStyle='#263f4a';ctx.fillRect(x-188,96,376,GROUND-96);
   ctx.beginPath();ctx.moveTo(x-164,GROUND);ctx.lineTo(x-164,218);ctx.quadraticCurveTo(x-154,89,x,83);ctx.quadraticCurveTo(x+154,89,x+164,218);ctx.lineTo(x+164,GROUND);ctx.strokeStyle='#7a9994';ctx.lineWidth=21;ctx.stroke();
   ctx.beginPath();ctx.moveTo(x-143,GROUND);ctx.lineTo(x-143,220);ctx.quadraticCurveTo(x-130,116,x,112);ctx.quadraticCurveTo(x+130,116,x+143,220);ctx.lineTo(x+143,GROUND);ctx.strokeStyle='#b6b592';ctx.lineWidth=3;ctx.stroke();
   ellipse(x,248,63,73,'#536f70');ellipse(x,248,53,63,'#334e57');
   ctx.drawImage(images.jSeed,x-30,209,60,77);
   for(let j=0;j<4;j++)path([[x-52+j*34,GROUND-48],[x-42+j*34,GROUND-61],[x-32+j*34,GROUND-48]],null,'#a7ad8877',2);
  }
  for(let i=0;i<5;i++){
   const x=170+i*510-camera*.65;
   path([[x-22,0],[x+22,0],[x+123,GROUND],[x-73,GROUND]],'#d9d4a00b');
  }
  const shrine=1850-camera;
  const glow=ctx.createRadialGradient(shrine,290,8,shrine,290,220);glow.addColorStop(0,'#e6ce9355');glow.addColorStop(1,'#e6ce9300');ctx.fillStyle=glow;ctx.fillRect(shrine-230,60,460,GROUND-60);
  for(let j=0;j<3;j++){ctx.fillStyle=['#8c9a8c','#a5ac91','#c3bc93'][j];ctx.fillRect(shrine-150+j*30,GROUND-(j+1)*24,300-j*60,24)}
  path([[shrine-68,GROUND-72],[shrine-54,292],[shrine+54,292],[shrine+68,GROUND-72]],'#738b81','#c3b784',3);
  ellipse(shrine,293,76,14,'#b7b48d');ctx.drawImage(images.jSeed,shrine-60,174,120,122);
 }
 const floor=trail?'#82946c':court?'#c1c2a0':vault?'#92795b':'#708b87';
 ctx.fillStyle=floor;ctx.fillRect(0,GROUND,W,H-GROUND);line(0,GROUND,W,GROUND,trail?'#bec794':court?'#e4ddbb':vault?'#bfa276':'#b1c3ad',3);
 if(trail||vault){
  for(let i=0;i<30;i++){const x=((i*113-camera)%(W+100)+W+100)%(W+100);ellipse(x,GROUND+12+(i*23)%155,12+i%4*7,2,trail?'#b5c59a25':'#5a493133')}
 }else{
  for(let r=0;r<5;r++)for(let i=-1;i<12;i++){const x=i*119+(r%2)*59-camera%119,y=GROUND+8+r*40;line(x,y,x+114,y,court?'#8e9e7c55':'#415c6255',2);line(x,y,x-10,y+38,court?'#8e9e7c44':'#415c6244',1)}
 }
 if(trail)for(let i=0;i<16;i++){const x=((i*173-camera)%(W+160)+W+160)%(W+160)-80;for(let j=-2;j<=2;j++)jungleLeaf(x,GROUND+2,21+(i%3)*5,j*.45,'#567b50')}
 // The deeper rooms have their own atmosphere: ceiling drips, then fireflies only.
 for(let i=0;i<(trail?65:court?32:vault?9:0);i++){
  const speed=vault?92:180,cycle=GROUND-18,y=reduced?(i*71)%cycle:(time*speed+i*71)%cycle,x=((i*193-camera*.35-y*.12)%(W+40)+W+40)%(W+40)-20;
  line(x,y,x-2,y+9,vault?'#c9d7b825':'#d8e4ce42',1);
 }
 if(heart)for(let i=0;i<24;i++){const x=(i*83-camera*.3+Math.sin(time*.5+i)*12+W*3)%W,y=110+(i*53)%300;ellipse(x,y,1.6,1.6,'#f2df9f99')}
}
function drawJungleRoots(h){
 if(!treasures[h.id]?.rooted||h.hits>=1||!surfaceVisible(h))return;
 ctx.save();ctx.translate(h.x,GROUND-5);ctx.lineCap='round';
 for(let i=0;i<3;i++){
  ctx.beginPath();ctx.moveTo(-31+i*9,4);ctx.bezierCurveTo(-18+i*9,-22,5+i*9,-18,21+i*9,3);
  ctx.strokeStyle='#596346';ctx.lineWidth=6;ctx.stroke();ctx.strokeStyle='#ab9565';ctx.lineWidth=2.5;ctx.stroke();
 }
 jungleLeaf(-24,0,15,-.6,'#8ba16b');jungleLeaf(24,0,13,.8,'#a5b378');ctx.restore();
}
function drawCartLeafUmbrella(){
 const height=Math.max(106,72+pileRise(orderedPile(),orderedPile().length));
 const x=cart.x-42,y=GROUND-height;
 line(x,GROUND-48,x+3,y-18,'#81915c',4);
 ctx.save();ctx.translate(x+3,y-14);ctx.rotate(reduced?-.12:-.12+Math.sin(time*1.9)*.025);
 ctx.beginPath();ctx.moveTo(-53,5);ctx.bezierCurveTo(-26,-29,32,-29,69,7);ctx.quadraticCurveTo(34,-2,12,12);ctx.quadraticCurveTo(-17,1,-53,5);ctx.fillStyle='#819c58';ctx.fill();
 path([[-47,4],[5,-12],[63,6]],null,'#bdc68a',2);line(5,-12,12,10,'#b1bf7a',1.5);ctx.restore();
}
