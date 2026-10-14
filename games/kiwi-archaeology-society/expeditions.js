// Two more fictional archaeological sites. IDs append to keep older saves intact.
const laterAreas=[
 {name:'The Aqueduct Garden',width:2300,regions:['The Landing','The Broken Aqueduct','The Bath Gate']},
 {name:'The Mosaic Baths',width:2400,regions:['The Changing Rooms','The Great Pool','The Warm Stair']},
 {name:'Under the Baths',width:2300,regions:['The Furnace','The Little Pillars','The Boiler Room']},
 {name:'The Cliffside Castle',width:2300,regions:['The Harbour Path','The Wind Garden','The Castle Gate']},
 {name:'The Clockwork Hall',width:2400,regions:['The Silent Clocks','The Grand Mechanism','The Star Stair']},
 {name:'The Stargazer’s Tower',width:2300,regions:['Above the Clouds','The Telescope','The Last Lost Thing']}
];
const laterCatalogue=[
 ['The water inspector’s whistle','Water whistle','rWhistle',1,'Used to tell the water to hurry up. The water filed a complaint.'],
 ['A remarkably small amphora','Pocket amphora','rAmphora',3,'Enough olive oil for one extremely well-dressed worm.'],
 ['The mosaic gardener','Mosaic trowel','rTrowel',2,'Every handle tile depicts a different weed. A specialist instrument.'],
 ['A senator’s emergency snack','Marble olive','rOlive',4,'A convincing olive. A disappointing lunch.'],
 ['The aqueduct’s spare elbow','Terracotta elbow','rPipe',2,'The water used to turn left here. It now goes wherever it likes.'],
 ['A bath reservation for two','Bath token','rToken',1,'Two guests. One towel. No mention of the cart.'],
 ['The emperor’s squeaking fleet','Bath ducks ×3','rDuck',3,'Three ceremonial duck boats, all pointing importantly in different directions.'],
 ['The slippers of supreme relaxation','Bath slippers','rSlippers',2,'Made for padded feet and absolutely no official business.'],
 ['The mosaic of a very clean kiwi','Kiwi mosaic','rMosaic',4,'Proof that this civilization understood both hygiene and roundness.'],
 ['The sponge of public office','Official sponge','rSponge',1,'Awarded to the deputy undersecretary of wiping things.'],
 ['A tiny brass bath tap','Brass tap','rTap',3,'Marked warm, cold, and surprise. Pip is resisting temptation.'],
 ['The soap that outlasted an empire','Ancient soap','rSoap',2,'Still lavender scented. Bean has wrapped it separately from the biscuits.'],
 ['The furnace attendant’s mitt','Oven mitt','rMitt',2,'Protects one foot. The other foot must make its own arrangements.'],
 ['The most patient kettle','Bronze kettle','rKettle',4,'Waiting for the boil since the last dynasty.'],
 ['A signed apology from the plumber','Plumber’s tablet','rTablet',3,'I shall return shortly. The date has worn away.'],
 ['The official indoor weather machine','Tiny bellows','rBellows',2,'Produces a small breeze with a tremendous sense of achievement.'],
 ['The chief engineer’s rubber plug','Bath plug','rPlug',1,'The chain leads nowhere. A fitting summary of the project.'],
 ['The boiler room’s missing sun','Golden radiator','rSun',4,'A sun-shaped heater. Its shipping label points to a castle above the clouds.'],
 ['A knight’s gardening helmet','Flowerpot helmet','cHelmet',3,'A peaceful second career for a very small helmet.'],
 ['The royal wind measurement device','Wind sock','cSock',1,'Reports the wind as windy. An accurate and tireless servant.'],
 ['A ceremonial bread defence','Toast shield','cShield',4,'Protects the toast from butter until negotiations are complete.'],
 ['The gardener’s heraldic friend','Stone hedgehog','cHedgehog',2,'A round guardian of the herb garden. Has never frightened anybody.'],
 ['The spare key to a very small kingdom','Castle key','cKey',2,'Opens the biscuit cupboard. All other doors were considered secondary.'],
 ['The king’s extremely portable throne','Folding throne','cChair',3,'A throne for a ruler who enjoys sitting down somewhere else.'],
 ['The clockmaker’s lunch hour','Sandwich clock','cClock',4,'All twelve numbers have been replaced by lunch.'],
 ['The gear of unnecessary complexity','Bronze gear','cGear',2,'Turns three other gears, which turn this one. A busy department.'],
 ['The official rewind handle','Clockwork crank','cCrank',1,'For yesterday. Unfortunately nobody kept the instructions.'],
 ['A cuckoo with the day off','Sleeping cuckoo','cBird',3,'The spring is wound. The employee is not.'],
 ['The music of the royal laundry','Music box','cMusic',4,'Plays a dignified tune about a missing sock.'],
 ['The stairs inspector’s certificate','Star ticket','cTicket',2,'Admits one astronomer and an unreasonable quantity of luggage.'],
 ['The telescope’s spare moon','Moon lens','cLens',3,'Makes distant objects look closer and close objects look alarming.'],
 ['The royal emergency constellation','Pocket stars ×3','cStars',2,'Three spare stars, for cloudy evenings and minor astronomical repairs.'],
 ['The chart of wandering crumbs','Star chart','cChart',4,'A new constellation: the Big Biscuit. Several stars may be stains.'],
 ['The astronomer’s bedtime equipment','Night cap','cCap',1,'For studying the insides of one’s eyelids.'],
 ['The compass that points to home','Home compass','cCompass',3,'The needle follows Bean. Home is where somebody remembers the luggage.'],
 ['The society’s first lost-and-found','Founding badge','cBadge',4,'Across deserts, temples, gardens and stars: a tiny badge bearing two kiwis and a cart. Apparently this has happened before.']
];
const laterFinds=laterCatalogue.map(([name,short,shape,effort,desc],i)=>({
 level:12+Math.floor(i/6),name,short,shape,effort,desc,
 note:i<18?'BATHHOUSE DIVISION · TOWELS NOT PROVIDED':'HIGHLAND DIVISION · MIND THE DRAUGHT',
 rarity:[3,6,9,11,16,20,24,27,31,33].includes(i)?'ABSURD · WELL PRESERVED':i===35?'IMPOSSIBLE · FAMILIAR':'ANCIENT · UNEXPECTED',
 x:[[410,605,1030,1370,1735,2080],[460,790,985,1440,1820,2170],[430,685,1120,1320,1770,2050]][Math.floor(i/6)%3][i%6],
 count:i===6||i===31?3:1,wall:[8,10,12,14,25,28,30,34].includes(i)
}));
// Each find has its own silhouette, drawn in the same small, warm museum style.
const laterArt={
 rWhistle:'<path d="M25 42H73L102 31V57L74 67Q65 101 35 88Q12 76 25 42Z" fill="#b99c55" stroke="#806f43" stroke-width="3"/><circle cx="48" cy="65" r="14" fill="#e4c983"/><rect x="68" y="43" width="12" height="9" fill="#5a675d"/>',
 rAmphora:'<path d="M43 18H77L72 41Q99 56 89 82L62 108 33 84Q18 56 48 41Z" fill="#c78667" stroke="#8e644f" stroke-width="3"/><path d="M40 38Q13 31 23 61L33 70M79 38Q105 31 98 61L88 70" fill="none" stroke="#af7356" stroke-width="7"/><path d="M33 65H89M42 85H80" stroke="#ead0a0" stroke-width="6"/>',
 rTrowel:'<path d="M65 61L92 21" stroke="#b68b57" stroke-width="13"/><path d="M61 54L79 68 36 107 21 106 22 89Z" fill="#93a79a" stroke="#657f77" stroke-width="3"/><path d="M81 39L94 25M73 50L81 39" stroke="#e5c28b" stroke-width="5"/>',
 rOlive:'<ellipse cx="60" cy="68" rx="32" ry="42" transform="rotate(28 60 68)" fill="#8e9b68" stroke="#637454" stroke-width="3"/><path d="M53 31Q60 11 87 17Q82 34 53 31" fill="#a9b584"/><path d="M43 45Q28 64 39 83" fill="none" stroke="#c4c39b" stroke-width="5"/>',
 rPipe:'<path d="M25 24H61V60H98V96H43Q25 96 25 78Z" fill="#bc8466" stroke="#89674f" stroke-width="4"/><ellipse cx="43" cy="24" rx="21" ry="8" fill="#e1b58c"/><ellipse cx="43" cy="24" rx="13" ry="4" fill="#795e4c"/><path d="M92 57V99" stroke="#d6a37b" stroke-width="9"/>',
 rToken:'<circle cx="60" cy="62" r="43" fill="#c2a35f" stroke="#8e794b" stroke-width="4"/><circle cx="60" cy="62" r="34" fill="none" stroke="#ebd396" stroke-width="3"/><path d="M37 60Q48 48 59 60T82 60M37 73Q48 61 59 73T82 73" fill="none" stroke="#857744" stroke-width="5"/>',
 rDuck:'<path d="M20 65Q40 80 59 62Q48 27 76 22Q100 20 96 46L108 53 91 59Q100 94 65 103Q24 109 16 77Z" fill="#e4c16a" stroke="#b1944d" stroke-width="3"/><circle cx="82" cy="38" r="3" fill="#465247"/><path d="M36 77Q49 91 66 79" fill="none" stroke="#bf9e50" stroke-width="4"/>',
 rSlippers:'<path d="M20 30Q45 18 49 45L49 95Q18 109 14 88Z" fill="#d1b89b" stroke="#967960" stroke-width="3"/><path d="M70 22Q95 11 99 37L99 88Q69 102 64 81Z" fill="#bbceba" stroke="#799887" stroke-width="3"/><path d="M17 64L47 60M66 57L97 52" stroke="#f2e7ca" stroke-width="18"/>',
 rMosaic:'<rect x="15" y="15" width="90" height="94" rx="4" fill="#9ab5b0" stroke="#dfc7a0" stroke-width="7"/><ellipse cx="53" cy="66" rx="25" ry="28" fill="#e0bd83"/><path d="M71 51L99 78 72 61" fill="#e8d9ae"/><circle cx="64" cy="48" r="3" fill="#586e67"/>',
 rSponge:'<path d="M18 44Q31 22 51 33Q69 18 95 37L103 82Q82 109 30 99L16 78Z" fill="#d3b36f" stroke="#a88d56" stroke-width="3"/><g fill="#ac955e"><ellipse cx="38" cy="53" rx="7" ry="5"/><ellipse cx="77" cy="48" rx="9" ry="6"/><ellipse cx="60" cy="79" rx="8" ry="6"/><circle cx="87" cy="81" r="4"/><circle cx="32" cy="81" r="4"/></g>',
 rTap:'<path d="M30 106V61Q30 45 51 45H78Q97 45 97 62V76H77V66H51V106" fill="#c3a165" stroke="#927a4d" stroke-width="3"/><path d="M62 44V25M43 25H81" stroke="#dcca8d" stroke-width="10"/><ellipse cx="40" cy="106" rx="21" ry="7" fill="#b39761"/>',
 rSoap:'<rect x="16" y="36" width="88" height="61" rx="19" fill="#c2b6ca" stroke="#958d9f" stroke-width="3"/><path d="M33 52Q60 44 86 52" fill="none" stroke="#eee3dc" stroke-width="5"/><path d="M44 77L60 57 77 77" fill="none" stroke="#a08fa8" stroke-width="3"/>',
 rMitt:'<path d="M35 108L25 62Q9 30 27 28Q38 27 44 53L43 26Q43 10 59 18L87 34Q101 46 95 65L81 107Z" fill="#b97968" stroke="#875d52" stroke-width="3"/>',
 rKettle:'<path d="M32 48Q17 78 34 100H88Q102 72 83 48Z" fill="#a8a776" stroke="#737a59" stroke-width="3"/><path d="M83 63L112 41 104 80 92 87" fill="#a8a776"/><path d="M30 59Q3 37 17 89L30 91" fill="none" stroke="#94905e" stroke-width="8"/><path d="M37 47H79M57 43V32" stroke="#d5bc7f" stroke-width="8"/><ellipse cx="58" cy="74" rx="17" ry="24" fill="#bdba85"/>',
 rTablet:'<path d="M20 18H100V104H20Z" fill="#d0b998" stroke="#9d886e" stroke-width="4"/><path d="M33 35H84M33 51H76M33 67H87" stroke="#a0886b" stroke-width="4"/><path d="M49 93L61 79 74 93" fill="none" stroke="#829989" stroke-width="4"/>',
 rBellows:'<path d="M53 22L95 73 62 98 20 50Z" fill="#b07a5c" stroke="#7c634d" stroke-width="4"/><path d="M48 37L83 77M37 43L73 86" stroke="#d8b583" stroke-width="5"/><path d="M24 49L8 19 47 24M68 99L86 112" fill="#a7aaa0" stroke="#777e71" stroke-width="5"/>',
 rPlug:'<ellipse cx="58" cy="82" rx="36" ry="20" fill="#5f7775" stroke="#415c59" stroke-width="4"/><path d="M50 70V54H68V70" fill="none" stroke="#b7bba2" stroke-width="5"/><path d="M64 56Q98 45 81 23Q75 13 97 13" fill="none" stroke="#c8b273" stroke-width="5" stroke-dasharray="7 4"/>',
 rSun:'<path d="M60 8V24M60 98V113M9 61H25M96 61H111M23 24L34 35M86 86L99 99M23 99L35 86M86 35L99 22" stroke="#d8b56b" stroke-width="9"/><circle cx="60" cy="61" r="31" fill="#ddbf79" stroke="#ae9459" stroke-width="3"/><path d="M42 52Q47 58 52 52M68 52Q73 58 78 52M48 76Q60 84 72 76" fill="none" stroke="#8a7b4d" stroke-width="3"/>',
 cHelmet:'<path d="M25 93V54Q27 23 59 25Q92 25 94 55V93Z" fill="#97a9b1" stroke="#687c87" stroke-width="4"/><path d="M25 62H94" stroke="#d0d4cc" stroke-width="8"/><path d="M60 29V10M60 20L42 9M60 23L82 10" stroke="#819a6b" stroke-width="4"/><circle cx="60" cy="11" r="9" fill="#c4979a"/><path d="M37 78H82" stroke="#526b77" stroke-width="6"/>',
 cSock:'<path d="M27 18V108" stroke="#b5986a" stroke-width="6"/><path d="M29 22L108 37 92 60 29 57Z" fill="#cf9990" stroke="#99736c" stroke-width="3"/><path d="M47 27L43 58M73 32L68 59M97 37L91 57" stroke="#eddbb9" stroke-width="11"/>',
 cShield:'<path d="M26 24Q60 8 94 24V70Q88 95 60 110Q29 94 26 70Z" fill="#91a6ad" stroke="#d4bd88" stroke-width="7"/><path d="M42 79V50Q32 34 48 32H74Q91 34 80 51V79Z" fill="#d6b07b" stroke="#987a53" stroke-width="3"/>',
 cHedgehog:'<path d="M16 82L21 59 34 64 39 41 52 48 64 30 73 48 91 41 93 65 107 82Z" fill="#9ba592" stroke="#6e8076" stroke-width="3"/><ellipse cx="64" cy="83" rx="33" ry="22" fill="#c4c2a6"/><circle cx="76" cy="77" r="3" fill="#4d665e"/><ellipse cx="94" cy="86" rx="7" ry="4" fill="#657c70"/>',
 cKey:'<circle cx="43" cy="34" r="23" fill="none" stroke="#bca976" stroke-width="10"/><path d="M58 51L98 100M77 75L89 64M89 89L102 78" stroke="#bca976" stroke-width="10"/><path d="M32 34H54M43 23V45" stroke="#dacc9f" stroke-width="4"/>',
 cChair:'<path d="M30 16H89V65H30Z" fill="#ac7e83" stroke="#bca173" stroke-width="5"/><path d="M30 72L91 109M89 72L29 109" stroke="#aa9269" stroke-width="7"/><path d="M47 32L59 45 72 32 68 55H51Z" fill="#dcc28c"/>',
 cClock:'<path d="M25 28Q60 9 96 28L91 102H30Z" fill="#c9a170" stroke="#977856" stroke-width="4"/><circle cx="60" cy="64" r="27" fill="#e7d6ac"/><path d="M60 44V65L79 74" fill="none" stroke="#71858b" stroke-width="4"/><path d="M27 91H94" stroke="#89a078" stroke-width="6"/>',
 cGear:'<path d="M50 9H72V25L87 32 100 23 111 42 97 54V70L111 80 99 99 83 90 72 96V111H50V97L34 89 20 98 9 78 24 66V51L10 40 22 21 37 31 50 25Z" fill="#b39b6c" stroke="#857a5a" stroke-width="3"/><circle cx="60" cy="61" r="24" fill="#e0c894"/><circle cx="60" cy="61" r="13" fill="#6b8182"/>',
 cCrank:'<path d="M23 94V56H75V24H99" fill="none" stroke="#b8a476" stroke-width="12" stroke-linejoin="round"/><path d="M99 14V41M23 82V108" stroke="#71888d" stroke-width="14" stroke-linecap="round"/>',
 cBird:'<ellipse cx="53" cy="70" rx="30" ry="34" fill="#af906b"/><circle cx="76" cy="44" r="19" fill="#bca17a"/><path d="M92 43L110 54 91 53" fill="#d5b87c"/><path d="M70 42Q76 49 82 42" fill="none" stroke="#655d4d" stroke-width="3"/><path d="M32 98L45 109 58 99 72 108" fill="none" stroke="#a7aaa0" stroke-width="5"/>',
 cMusic:'<path d="M19 48H102V102H19Z" fill="#a58070" stroke="#715f57" stroke-width="3"/><path d="M19 48L33 18H99L102 48Z" fill="#b89b83"/><path d="M28 57H94V90H28Z" fill="#d6bd92"/><path d="M54 82V65L75 60V78" fill="none" stroke="#708482" stroke-width="4"/><ellipse cx="48" cy="83" rx="7" ry="5" fill="#708482"/><ellipse cx="69" cy="79" rx="7" ry="5" fill="#708482"/>',
 cTicket:'<path d="M16 27H105V47Q90 58 105 69V96H16V69Q31 58 16 47Z" fill="#c9ba95" stroke="#9b8f71" stroke-width="3"/><path d="M40 36V87" stroke="#8b9584" stroke-width="2" stroke-dasharray="4 4"/><path d="M72 40L77 54 92 54 80 63 85 78 72 69 60 78 64 63 52 54 67 54Z" fill="#8c9fa1"/>',
 cLens:'<circle cx="60" cy="61" r="42" fill="#8daebc" stroke="#c4ad7a" stroke-width="8"/><path d="M72 30Q38 32 39 60Q40 85 76 88Q16 83 27 49Q39 22 72 30Z" fill="#e1dcb8"/><path d="M72 42L87 58M67 54L83 70" stroke="#d1e1d4" stroke-width="3"/>',
 cStars:'<path d="M60 10L73 43 110 44 81 67 91 104 60 82 27 104 39 67 10 44 47 43Z" fill="#dfc17b" stroke="#a48e5a" stroke-width="3"/><path d="M59 26L64 47 87 49" fill="none" stroke="#f0dfac" stroke-width="4"/>',
 cChart:'<path d="M16 21L47 15 77 24 105 18V101L76 109 46 100 16 106Z" fill="#677f91" stroke="#b2baa9" stroke-width="3"/><path d="M29 75L47 44 69 63 90 37M69 63L82 88" fill="none" stroke="#d1c397" stroke-width="2"/><g fill="#f0d99d"><circle cx="29" cy="75" r="4"/><circle cx="47" cy="44" r="4"/><circle cx="69" cy="63" r="4"/><circle cx="90" cy="37" r="4"/><circle cx="82" cy="88" r="4"/></g>',
 cCap:'<path d="M21 88Q27 28 69 18Q100 19 96 59L83 65Q83 38 67 44L83 88Z" fill="#919cbb" stroke="#647890" stroke-width="3"/><path d="M20 89H85" stroke="#e3d9bb" stroke-width="14" stroke-linecap="round"/><circle cx="90" cy="65" r="11" fill="#e7dfca"/>',
 cCompass:'<circle cx="60" cy="65" r="38" fill="#d3be8e" stroke="#9c8c66" stroke-width="5"/><circle cx="60" cy="65" r="28" fill="#e9dfbb"/><path d="M60 39L70 70 60 90 50 60Z" fill="#8c9e98"/><path d="M49 25V14H72V25" fill="none" stroke="#a08e65" stroke-width="5"/>',
 cBadge:'<path d="M33 80L26 113 48 104 60 114 72 83" fill="#a87877"/><circle cx="60" cy="53" r="39" fill="#d7bd80" stroke="#998557" stroke-width="4"/><ellipse cx="46" cy="52" rx="15" ry="18" fill="#8a9c8c"/><path d="M56 43L73 61 57 51" fill="#f0dca6"/><ellipse cx="77" cy="63" rx="11" ry="13" fill="#a48663"/><path d="M84 56L98 69 85 63" fill="#ebd098"/>'
};

function ruinArch(x,base,width,height,color,thickness=16){
 ctx.beginPath();ctx.moveTo(x-width/2,base);ctx.lineTo(x-width/2,base-height+width/2);ctx.arc(x,base-height+width/2,width/2,Math.PI,0);ctx.lineTo(x+width/2,base);ctx.strokeStyle=color;ctx.lineWidth=thickness;ctx.stroke();
}
function ruinGear(x,y,r,angle,color){
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);
 for(let i=0;i<12;i++){ctx.rotate(Math.PI/6);ctx.fillStyle=color;ctx.fillRect(-r*.12,-r*1.12,r*.24,r*.3)}
 ellipse(0,0,r,r,color);ellipse(0,0,r*.73,r*.73,'#485968');
 for(let i=0;i<6;i++){const a=i*Math.PI/3;line(0,0,Math.cos(a)*r*.8,Math.sin(a)*r*.8,color,r*.11)}
 ellipse(0,0,r*.19,r*.19,'#d3b887');ctx.restore();
}
function laterScene(){
 const roman=level<15,night=level===17,inside=[13,14,16].includes(level);
 const skies={12:['#abc4c1','#e5d8b8'],13:['#b0c2b5','#d9c6a3'],14:['#514e47','#8e7760'],15:['#a2b9c4','#d6cfbd'],16:['#596b79','#9da69c'],17:['#253b58','#899da5']};
 const sky=ctx.createLinearGradient(0,0,0,GROUND);sky.addColorStop(0,skies[level][0]);sky.addColorStop(1,skies[level][1]);ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 if(!inside){
  if(night){
   for(let i=0;i<68;i++){const x=(i*167-camera*.06+W*4)%W,y=20+(i*47)%290;ellipse(x,y,i%4?1:1.7,i%4?1:1.7,'#f0e5c3'+(i%3?'99':'dd'))}
   ellipse(854-camera*.02,100,38,38,'#e6dfb9');ellipse(868-camera*.02,89,35,35,'#324962');
  }else ellipse(835-camera*.03,91,43,43,'#f5e7c3');
  for(let layer=0;layer<3;layer++){
   const drift=camera*(.06+layer*.075);
   for(let i=-1;i<5;i++){const x=i*470-drift;path([[x-70,GROUND],[x+130,220+layer*47],[x+250,270+layer*35],[x+420,GROUND]],['#a5b5ae','#91a6a0','#7f9894'][layer])}
  }
  for(let i=0;i<5;i++){const x=(i*317-camera*.08+W*4)%1450-140,y=135+i%3*43;ellipse(x,y,80,13,night?'#c7d2cd18':'#efe9d149');ellipse(x+47,y-8,45,15,night?'#c7d2cd18':'#efe9d149')}
 }else{
  const masonry=roman?(level===14?'#967b61':'#c1ad8b'):'#83918f';
  for(let r=0;r<7;r++)for(let c=-1;c<12;c++){
   const x=c*134+(r%2)*67-camera*.45%134,y=20+r*69;
   ctx.fillStyle=masonry;ctx.globalAlpha=.23+(r+c+20)%3*.05;ctx.fillRect(x,y,130,65);ctx.globalAlpha=1;
  }
 }
 if(level===12){
  // A broken aqueduct, seen beyond an herb garden; its water finally reaches a pool.
  for(let i=-1;i<10;i++){
   const x=i*300-camera*.55;if(x<-250||x>W+250)continue;
   ruinArch(x,GROUND,200,298,'#c4b293',29);
   ctx.fillStyle='#d8c6a3';ctx.fillRect(x-132,GROUND-322,264,22);
   line(x-125,GROUND-299,x+125,GROUND-299,'#a68e70',4);
   for(let j=0;j<5;j++)line(x-115,GROUND-265+j*43,x-84,GROUND-265+j*43,'#e1ceaa',2);
  }
  const fountain=1260-camera;
  ellipse(fountain,GROUND-15,144,25,'#b4b39a');ellipse(fountain,GROUND-22,126,15,'#78aaa1');
  path([[fountain-26,GROUND-26],[fountain-19,GROUND-107],[fountain+19,GROUND-107],[fountain+26,GROUND-26]],'#bdb695');
  ellipse(fountain,GROUND-108,52,11,'#d8c9a5');
  for(let j=-1;j<=1;j++){ctx.beginPath();ctx.moveTo(fountain+j*14,GROUND-111);ctx.quadraticCurveTo(fountain+j*80,GROUND-143,fountain+j*98,GROUND-26);ctx.strokeStyle='#b3d5c5aa';ctx.lineWidth=2;ctx.stroke()}
  for(let i=0;i<8;i++){const x=i*355-camera;ellipse(x,GROUND-8,37,20,'#809477');for(let j=0;j<6;j++)line(x-24+j*9,GROUND-6,x-31+j*12,GROUND-45-(j%3)*8,'#9aa579',3)}
 }
 if(level===13){
  for(let i=0;i<8;i++){
   const x=80+i*330-camera*.8;if(x<-160||x>W+160)continue;
   ruinArch(x,GROUND,225,360,'#d5c09d',22);
   ctx.fillStyle='#a6b2a0';ctx.fillRect(x-95,GROUND-142,190,73);
   for(let r=0;r<4;r++)for(let c=0;c<9;c++){ctx.fillStyle=(r+c)%2?'#e1d2b0':'#829f97';ctx.fillRect(x-88+c*21,GROUND-137+r*16,15,11)}
  }
  const pool=1230-camera;
  path([[pool-340,GROUND-29],[pool-260,GROUND-105],[pool+260,GROUND-105],[pool+340,GROUND-29]],'#dfceae','#a59377',3);
  path([[pool-312,GROUND-37],[pool-250,GROUND-94],[pool+250,GROUND-94],[pool+312,GROUND-37]],'#7ba9a1');
  for(let j=0;j<6;j++)line(pool-220+j%2*30,GROUND-86+j*8,pool+220-j%2*20,GROUND-86+j*8,'#c5d9bf70',1.5);
  for(let j=0;j<7;j++){const x=pool-210+j*70,y=GROUND-130-Math.sin(time*.5+j)*10;ellipse(x,y,27,45,'#eee3c416')}
  ctx.drawImage(images.rMosaic,pool-56,148,112,117);
 }
 if(level===14){
  // The hypocaust: low brick stacks once carried the heated floor overhead.
  ctx.fillStyle='#b19779';ctx.fillRect(0,45,W,22);line(0,68,W,68,'#d0b691',3);
  for(let i=0;i<10;i++){
   const x=i*270-camera*.8;if(x<-130||x>W+130)continue;
   for(let r=0;r<7;r++){ctx.fillStyle=r%2?'#a27658':'#b18866';ctx.fillRect(x-42-r%2*5,GROUND-43-r*49,84+r%2*10,45);line(x-39,GROUND-42-r*49,x+40,GROUND-42-r*49,'#d6b28a',2)}
  }
  const furnace=1250-camera;
  ctx.fillStyle='#57564b';ctx.fillRect(furnace-80,GROUND-125,160,125);ellipse(furnace,GROUND-126, 80,80,'#57564b');
  ruinArch(furnace,GROUND,185,233,'#a38362',24);
  const fire=ctx.createRadialGradient(furnace,GROUND-53,10,furnace,GROUND-65,160);fire.addColorStop(0,'#ecc38280');fire.addColorStop(1,'#e9a66e00');ctx.fillStyle=fire;ctx.fillRect(furnace-170,GROUND-230,340,225);
  for(let i=0;i<5;i++){const x=furnace-42+i*21;path([[x-11,GROUND-20],[x-8,GROUND-57],[x+Math.sin(time*2+i)*5,GROUND-85-i%2*12],[x+13,GROUND-22]],'#dbac7266')}
  line(furnace-57,GROUND-16,furnace+57,GROUND-16,'#574f43',7);
  for(let i=0;i<5;i++)line(furnace-47+i*24,GROUND-73,furnace-47+i*24,GROUND-16,'#776650',5);
 }
 if(level===15){
  // Weathered towers, warm windows, and a sheltered path above a distant sea.
  for(let i=0;i<5;i++){
   const x=150+i*510-camera*.6;if(x<-240||x>W+240)continue;
   ctx.fillStyle='#85948e';ctx.fillRect(x-81,GROUND-235,162,235);
   for(let r=0;r<6;r++){line(x-77,GROUND-23-r*34,x+77,GROUND-23-r*34,'#b7bea833',2);for(let c=0;c<3;c++)line(x-52+c*53+r%2*14,GROUND-23-r*34,x-52+c*53+r%2*14,GROUND-53-r*34,'#b7bea833',1)}
   path([[x-99,GROUND-235],[x,GROUND-347],[x+99,GROUND-235]],'#647d85','#a6b1a4',3);
   for(let j=0;j<3;j++){ctx.fillStyle='#b7bea9';ctx.fillRect(x-66+j*51,GROUND-229,17,28)}
   ruinArch(x,GROUND-96,33,64,'#b0baa7',7);ctx.fillStyle='#cbbd8a';ctx.fillRect(x-12,GROUND-141,24,45);
   line(x,GROUND-343,x,GROUND-385,'#a1a98e',3);path([[x,GROUND-385],[x+51,GROUND-376+Math.sin(time*2+i)*3],[x+36,GROUND-363],[x,GROUND-369]],'#bb8f80');
  }
  const garden=1280-camera;
  for(let i=0;i<8;i++){const x=garden-240+i*68;ellipse(x,GROUND-7,29,15,'#899c82');for(let j=0;j<3;j++){line(x+j*9,GROUND-4,x+j*11,GROUND-36,'#788c72',2);ellipse(x+j*11,GROUND-38,4,7,'#b6a4b2')}}
 }
 if(level===16){
  for(let i=0;i<6;i++){
   const x=150+i*430-camera;if(x<-180||x>W+180)continue;
   ruinArch(x,GROUND,200,370,'#a3ad9d',17);
   ctx.fillStyle='#394f65';ctx.fillRect(x-58,135,116,184);
   for(let j=0;j<4;j++)line(x-54,169+j*37,x+54,169+j*37,'#859888',3);
   line(x,135,x,319,'#b5b7a0',5);
  }
  const clock=1240-camera;
  path([[clock-176,GROUND-20],[clock-176,142],[clock+216,142],[clock+216,GROUND-20]],'#657773','#a8ae97',8);
  line(clock-165,238,clock+204,238,'#a8ae9777',5);line(clock-165,370,clock+204,370,'#a8ae9777',5);
  ruinGear(clock-70,238,84,reduced?0:time*.045,'#b19e78');
  ruinGear(clock+97,267,69,reduced?0:-time*.055,'#c0aa7c');
  ruinGear(clock+5,370,49,reduced?0:-time*.077,'#9e9878');
  const swing=reduced?0:Math.sin(time*1.4)*.14;
  line(clock+185,160,clock+185+Math.sin(swing)*240,400,'#c6b383',5);ellipse(clock+185+Math.sin(swing)*240,401,26,26,'#c7b080');
  path([[clock-190,GROUND],[clock-181,GROUND-20],[clock+225,GROUND-20],[clock+238,GROUND]],'#a1a894');
 }
 if(level===17){
  const tower=1280-camera;
  // Open dome ribs frame the sky, with the telescope on a real tripod.
  ctx.fillStyle='#748c8b';ctx.fillRect(tower-300,GROUND-24,600,24);
  line(tower-285,GROUND-35,tower-285,GROUND,'#9aa9a6',15);line(tower+285,GROUND-35,tower+285,GROUND,'#9aa9a6',15);
  ctx.beginPath();ctx.arc(tower,GROUND-35,285,Math.PI,Math.PI*2);ctx.strokeStyle='#9aa9a6';ctx.lineWidth=15;ctx.stroke();
  for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(tower+i*210,GROUND-35);ctx.quadraticCurveTo(tower+i*120,GROUND-320,tower,GROUND-320);ctx.strokeStyle='#bbc0ac';ctx.lineWidth=5;ctx.stroke()}
  line(tower,GROUND-164,tower-82,GROUND-6,'#b1a787',9);line(tower,GROUND-164,tower+87,GROUND-6,'#b1a787',9);line(tower,GROUND-164,tower+8,GROUND-6,'#8b9587',7);
  ctx.save();ctx.translate(tower,GROUND-172);ctx.rotate(-.38);ctx.fillStyle='#b3a37c';ctx.fillRect(-105,-23,214,46);ctx.fillStyle='#d4c294';ctx.fillRect(87,-31,25,62);ctx.fillRect(-102,-27,19,54);ctx.fillStyle='#6b8998';ctx.fillRect(112,-24,7,48);line(-59,-20,67,-20,'#e3d0a0',3);ctx.restore();
  for(let i=0;i<12;i++){const x=i*230-camera;ctx.fillStyle='#819592';ctx.fillRect(x-23,GROUND-50,46,50)}
 }
 const floor=roman?(level===14?'#a28b6c':level===13?'#baa98a':'#b6b497'):level===15?'#a7af95':level===16?'#9fa796':'#8e9f99';
 ctx.fillStyle=floor;ctx.fillRect(0,GROUND,W,H-GROUND);line(0,GROUND,W,GROUND,roman?'#e1d1ad':'#cbd0b6',3);
 for(let r=0;r<4;r++)for(let c=-1;c<12;c++){
  const x=c*130+(r%2)*65-camera%130,y=GROUND+26+r*43;line(x,y,x+116,y,roman?'#8b81612a':'#5c7c772c',1);line(x+116,y,x+122,y+32,roman?'#8b81612a':'#5c7c772c',1);
 }
 if(level===15||level===17)for(let i=0;i<8;i++){const x=((time*21+i*157-camera*.15)%(W+100)+W+100)%(W+100)-50,y=270+(i*43)%190;line(x,y,x+29,y-3,'#e8e7ce25',1)}
}
