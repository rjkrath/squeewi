'use strict';
const $=s=>document.querySelector(s),canvas=$('#scene'),ctx=canvas.getContext('2d');
const W=1100,H=660,GROUND=477,WORLD=5520,KEY='kiwi-desert-expedition-v2';
const treasures=[
 ['Scarab of modest importance','Scarab','EGYPTIAN · UNCOMMON','scarab','A blue faience scarab. A symbol of renewal, protection, and being quite good at rolling things. Bean recognises a fellow logistics professional.','Circa a very long time ago. Still more organised than us.'],
 ['Cache of rubber chickens','Chickens ×5','ABSURD · SQUEAKING','chicken','Five rubber chickens, carefully sealed for the afterlife. The inscription translates loosely as “you never know”. Each chicken has to go on the cart.','Conservation method: do not squeeze. Bean has squeezed all five.'],
 ['Canopic snack jar','Canopic jar','EGYPTIAN-ISH · UNUSUAL','jar','A jackal-headed jar of impressive workmanship. This particular example contains one suspiciously recent biscuit.','The biscuit is not part of the accession. Apparently.'],
 ['The royal golden sandal','Gold sandal','EGYPTIAN · RARE','sandal','A golden sandal for a person with considerably more toes than Pip. The matching shoe is presumably in another museum.','One previous owner. Some sand.'],
 ['Emergency garden gnomes','Gnomes ×3','ABSURD · PREPARED','gnome','Three gnomes buried with a sign reading IN CASE OF GARDEN. No garden has been observed within several thousand waddles.','They look as surprised to be here as we are.'],
 ['Horus, carry-on edition','Horus','EGYPTIAN · RARE','horus','A small falcon statuette. Its wings are rather showy. Pip has classified this as an unnecessary design flourish.','Divine protection does not cover improper stacking.'],
 ['The ceremonial toaster','Toaster','ABSURD · ANACHRONISTIC','toaster','Two slots. No socket. Traces of toast indicate that somebody was making breakfast approximately four thousand years too early.','Crumb tray contains more archaeology.'],
 ['An extremely long scroll','Scroll','EGYPTIAN · UNCOMMON','scroll','A papyrus inventory detailing offerings of bread, linen, and one hundred and six ducks. The last line says “bring a bigger cart”.','The ancients had the same problem.'],
 ['Inflatable pharaoh','Pool pharaoh','ABSURD · BUOYANT','flamingo','A pink pool flamingo wearing a nemes headdress. Was it a sacred vessel? Was the Nile more fun than previously thought?','Inflation date disputed by all three reviewers.'],
 ['A perfectly ordinary sarcophagus','Sarcophagus','EGYPTIAN · MONUMENTAL','coffin','A magnificent gilded miniature sarcophagus. Pip knocked politely. Something inside knocked back, then asked for five more minutes.','Bean would prefer this at the bottom of the pile.'],
 ['The second chicken cache','Chickens ×4','ABSURD · INEVITABLE','chicken','Four more rubber chickens. Of course there are. Scholars now believe the first cache was merely the emergency reserve.','Our working theory is poultry.'],
 ['The improbable pyramid','Pyramid','EGYPTIAN-ISH · IMPOSSIBLE','pyramid','A pyramid the size of a picnic basket. Inside is a smaller pyramid. Inside that is a note saying “keep going”.','The note may also refer to the expedition.'],
 ['Royal bathroom plunger','Plunger','ABSURD · CEREMONIAL','plunger','An object of immense ritual significance, provided the ritual involved a blocked drain. A falcon is engraved on the handle.','The curator declines to demonstrate its use.'],
 ['Anubis, off duty','Anubis','EGYPTIAN · RARE','anubis','A seated jackal figure, guardian of the necropolis. Now also guardian of the precarious rubber chicken tower.','This is outside the original job description.'],
 ['The disco sun','Disco sun','ABSURD · RADIANT','disco','A mirrored sphere. A portable sun? A ritual object? Either way, the excavation has become significantly more festive.','Handle with care. Dance with abandon.'],
 ['The founding kiwi','Kiwi mask','IMPOSSIBLE · FAMILIAR','mask','A golden funerary mask with a very long beak. The inscription reads: PIP AND BEAN, DEPARTMENT OF LOST LUGGAGE. Beneath it: “YOU ARE LATE.”','The cart is nearly a monument. Bean still needs to tie it down.']
].map((f,i)=>({id:i,name:f[0],short:f[1],rarity:f[2],shape:f[3],desc:f[4],note:f[5],x:440+i*309,count:i===1?5:i===4?3:i===10?4:1}));
function svg(shape){const parts={
scarab:'<path d="M34 41L17 32M31 59L11 62M35 77L20 91M85 41L102 32M89 59L109 62M85 77L100 91" stroke="#967440" stroke-width="5"/><ellipse cx="60" cy="62" rx="30" ry="35" fill="#378f92" stroke="#d9b867" stroke-width="4"/><path d="M60 31V96M33 49Q60 61 87 49" fill="none" stroke="#a5d3be" stroke-width="3"/><ellipse cx="60" cy="27" rx="13" ry="9" fill="#32777c"/>',
chicken:'<path d="M46 65Q27 95 65 99Q88 96 73 67L73 40Q77 20 62 19Q47 18 51 41Z" fill="#f4c950" stroke="#c99b38" stroke-width="2"/><path d="M52 20Q46 4 54 8L60 14Q63 0 68 9L70 20M54 42L52 54 64 49" fill="#c9593d"/><path d="M72 30L89 37 73 43" fill="#e78b3e"/><circle cx="66" cy="28" r="3" fill="#453c30"/><path d="M45 69Q59 71 55 87M49 98L38 107M68 98L77 108" fill="none" stroke="#d7803a" stroke-width="5"/>',
jar:'<path d="M35 44Q18 88 36 103H85Q101 83 85 44Z" fill="#cda46c" stroke="#92754b" stroke-width="3"/><path d="M39 44L35 18 47 7 57 23 76 22 87 12 85 45Z" fill="#647978"/><path d="M40 27L70 27 91 37 62 40" fill="#8e9b88"/><circle cx="67" cy="29" r="3" fill="#343d36"/><path d="M32 68H90M33 89H89" stroke="#508f91" stroke-width="7"/>',
sandal:'<path d="M41 16Q82 1 87 36L80 97Q55 116 34 94L28 45Q28 25 41 16" fill="#d9b25d" stroke="#ae8339" stroke-width="3"/><path d="M60 24V57L35 80M60 57L82 78" fill="none" stroke="#f7da85" stroke-width="9"/><path d="M40 90Q59 100 76 89" fill="none" stroke="#a77636" stroke-width="2"/>',
gnome:'<path d="M33 59L60 8 85 59" fill="#c65c45"/><ellipse cx="59" cy="65" rx="22" ry="22" fill="#f4d8a4"/><path d="M37 68Q60 105 83 68L88 100H32Z" fill="#ebe3c7"/><circle cx="60" cy="65" r="8" fill="#dbac83"/><path d="M35 98L29 112H52L61 101 70 112H94L87 98" fill="#466a68"/>',
horus:'<path d="M37 100Q26 66 49 43L45 23Q67 2 80 25L79 46 94 100Z" fill="#477f88" stroke="#b8954d" stroke-width="4"/><path d="M72 24L99 34 78 41" fill="#e9c26e"/><circle cx="70" cy="23" r="3" fill="#f3dda1"/><path d="M50 51L45 87 69 71M77 53L83 87" fill="none" stroke="#80b1a7" stroke-width="3"/><path d="M31 104H101" stroke="#c5a059" stroke-width="8"/>',
toaster:'<rect x="15" y="42" width="90" height="57" rx="15" fill="#94b1af" stroke="#587d7e" stroke-width="3"/><path d="M30 46V26Q41 16 52 27V47M64 47V25Q77 15 88 26V47" fill="#dfb27b" stroke="#ad7d4e" stroke-width="4"/><path d="M27 98V109M88 98V109" stroke="#4b6664" stroke-width="6"/><path d="M96 60V84M89 71H106" stroke="#4c7274" stroke-width="4"/><path d="M29 60H66" stroke="#c9d8c4" stroke-width="5"/>',
scroll:'<path d="M30 19H89V93H31Z" fill="#e7ce91"/><path d="M28 19H91M27 95H93" stroke="#a47847" stroke-width="12" stroke-linecap="round"/><path d="M42 37H76M44 49L53 55 63 45 78 55M41 69H75M48 82H68" fill="none" stroke="#9f8152" stroke-width="3"/>',
flamingo:'<ellipse cx="51" cy="78" rx="38" ry="21" fill="#e7988e"/><ellipse cx="51" cy="74" rx="24" ry="10" fill="#bf7069"/><path d="M79 78Q103 61 87 43Q63 16 86 14Q108 14 103 29" fill="none" stroke="#e7988e" stroke-width="13"/><path d="M99 23L113 36 101 40" fill="#454f48"/><path d="M73 15L82 4 99 4 109 22" fill="#4e9396"/><path d="M77 13L104 13M81 6L99 6" stroke="#e8c25f" stroke-width="4"/><circle cx="98" cy="22" r="2" fill="#373e32"/>',
coffin:'<path d="M39 18Q60 0 81 18L92 54 80 109H40L28 54Z" fill="#d6ac51" stroke="#997639" stroke-width="3"/><path d="M37 25L48 24V57H32M72 24H83L89 57H73" fill="#3e838b"/><ellipse cx="60" cy="31" rx="12" ry="17" fill="#efd18a"/><path d="M48 66L76 87M74 65L47 88M40 99H80" stroke="#3d7d80" stroke-width="7"/><path d="M51 28H56M64 28H69" stroke="#514b36" stroke-width="2"/>',
pyramid:'<path d="M10 99L63 13 112 98Z" fill="#dbb36b" stroke="#af894c" stroke-width="3"/><path d="M63 13L64 100H112Z" fill="#b89355"/><path d="M34 60H87M22 80H100M47 40H77" stroke="#efcc87" stroke-width="2"/>',
plunger:'<path d="M60 12V79" stroke="#b78c53" stroke-width="10" stroke-linecap="round"/><path d="M36 76Q61 58 83 77L96 103H23Z" fill="#b76049" stroke="#8f4f3e" stroke-width="3"/><path d="M20 103H98" stroke="#d78360" stroke-width="8"/>',
anubis:'<path d="M46 54L34 28 34 5 46 19 58 6 61 29 95 39 67 47 68 72 83 94H97V106H24L35 81Z" fill="#465b58" stroke="#283e3e" stroke-width="3"/><path d="M41 59L67 60M42 69L67 69" stroke="#d4b25f" stroke-width="7"/><ellipse cx="56" cy="31" rx="5" ry="4.5" fill="#d9c48c"/><circle cx="57" cy="31" r="2.8" fill="#293f3e"/><circle cx="58" cy="30" r=".9" fill="#fff0cb"/>',
disco:'<circle cx="60" cy="62" r="40" fill="#96b4b2" stroke="#dae4cc" stroke-width="3"/><path d="M22 50H98M21 70H99M32 89H88M37 29L33 91M59 23V102M80 29L85 91" stroke="#f9e6b1" stroke-width="3"/><path d="M60 22V9" stroke="#9f8056" stroke-width="3"/><path d="M12 20V35M5 28H20M100 11V28M92 20H109" stroke="#e9bd60" stroke-width="3"/>',
mask:'<path d="M25 29Q60-3 95 29L104 101H18Z" fill="#49868b" stroke="#b9984c" stroke-width="4"/><path d="M28 40H93M25 58H98M21 79H102M20 97H103" stroke="#d0ad59" stroke-width="7"/><ellipse cx="60" cy="50" rx="23" ry="29" fill="#e6c773"/><path d="M61 51L86 94 57 66" fill="#eed695" stroke="#bd954c" stroke-width="2"/><ellipse cx="48" cy="42" rx="6" ry="6.5" fill="#f1d995"/><ellipse cx="71" cy="42" rx="6" ry="6.5" fill="#f1d995"/><circle cx="48" cy="42" r="3.5" fill="#41483e"/><circle cx="71" cy="42" r="3.5" fill="#41483e"/><circle cx="49" cy="41" r="1.1" fill="#fff0cb"/><circle cx="72" cy="41" r="1.1" fill="#fff0cb"/>'};Object.assign(parts,{"mat": "<path d=\"M17 30H103V94H17Z\" fill=\"#b98755\"/><path d=\"M22 38H98V86H22Z\" fill=\"none\" stroke=\"#e2c58b\" stroke-width=\"4\"/><path d=\"M28 58L38 47 48 58 58 47 68 58 78 47 90 58M28 72H90\" fill=\"none\" stroke=\"#705a40\" stroke-width=\"3\"/>", "slipper": "<path d=\"M17 78Q13 51 32 40Q47 33 63 46L72 65L99 68Q108 71 107 85Q69 100 23 90Z\" fill=\"#729f9b\" stroke=\"#476f6d\" stroke-width=\"3\"/><path d=\"M20 84Q58 96 106 80L107 88Q65 104 22 93Z\" fill=\"#c5ac7a\" stroke=\"#8c7957\" stroke-width=\"2\"/><path d=\"M61 49Q82 48 99 64L101 77Q85 86 68 79Z\" fill=\"#3e6566\" stroke=\"#f1e5c9\" stroke-width=\"6\" stroke-linejoin=\"round\"/><path d=\"M59 48Q72 59 68 79\" fill=\"none\" stroke=\"#fbefd4\" stroke-width=\"7\" stroke-linecap=\"round\"/><path d=\"M24 61Q30 46 43 48\" fill=\"none\" stroke=\"#a7c7b9\" stroke-width=\"3\" stroke-linecap=\"round\"/><path d=\"M28 82Q44 87 58 85\" fill=\"none\" stroke=\"#d8e2ca\" stroke-width=\"2\" stroke-dasharray=\"3 4\"/>", "moonTile": "<rect x=\"23\" y=\"18\" width=\"74\" height=\"87\" rx=\"5\" fill=\"#49657d\" stroke=\"#c6a761\" stroke-width=\"5\"/><path d=\"M72 32A25 25 0 1 0 80 72A25 25 0 0 1 72 32\" fill=\"#efd69a\"/><path d=\"M37 32V42M32 37H42M77 85V95M72 90H82\" stroke=\"#ebce8a\" stroke-width=\"2\"/>", "ibis": "<path d=\"M31 96Q21 55 61 57Q47 34 65 21Q83 11 89 26L72 32 77 61Q92 82 74 96Z\" fill=\"#ece4ce\" stroke=\"#a99a79\" stroke-width=\"3\"/><path d=\"M87 25Q108 32 99 55\" fill=\"none\" stroke=\"#565956\" stroke-width=\"7\"/><circle cx=\"76\" cy=\"24\" r=\"2\" fill=\"#333\"/><path d=\"M42 97V107M66 97V107\" stroke=\"#aa874e\" stroke-width=\"4\"/>", "clock": "<path d=\"M25 104V40L60 10 95 40V104Z\" fill=\"#9f744f\" stroke=\"#71563c\" stroke-width=\"3\"/><circle cx=\"60\" cy=\"60\" r=\"24\" fill=\"#f0dfb7\"/><path d=\"M60 43V60L75 66\" fill=\"none\" stroke=\"#526d67\" stroke-width=\"4\"/><path d=\"M48 94H72\" stroke=\"#d6b57b\" stroke-width=\"4\"/>", "key": "<circle cx=\"43\" cy=\"37\" r=\"22\" fill=\"none\" stroke=\"#d4b05d\" stroke-width=\"12\"/><path d=\"M56 55L94 95M74 74L85 63M84 85L98 74\" stroke=\"#d4b05d\" stroke-width=\"12\"/><path d=\"M41 22L35 31\" stroke=\"#f6dc8b\" stroke-width=\"3\"/>", "duck": "<path d=\"M23 69Q41 78 60 56Q50 25 77 21Q99 20 99 43Q97 62 82 64Q101 100 54 103Q17 103 15 73Z\" fill=\"#edc453\" stroke=\"#b99238\" stroke-width=\"3\"/><path d=\"M96 38L113 45 96 52\" fill=\"#da8550\"/><circle cx=\"85\" cy=\"36\" r=\"3\" fill=\"#3e4237\"/><path d=\"M36 79Q58 67 66 86\" fill=\"none\" stroke=\"#c79d38\" stroke-width=\"3\"/>", "dates": "<path d=\"M19 51H102L91 105H30Z\" fill=\"#b59054\" stroke=\"#7e633c\" stroke-width=\"3\"/><path d=\"M24 67H99M28 83H94M43 54L47 102M64 54V104M85 54L80 102\" stroke=\"#ddbc7d\" stroke-width=\"3\"/><ellipse cx=\"40\" cy=\"46\" rx=\"12\" ry=\"19\" fill=\"#82533e\"/><ellipse cx=\"62\" cy=\"39\" rx=\"12\" ry=\"20\" fill=\"#a36543\"/><ellipse cx=\"82\" cy=\"46\" rx=\"13\" ry=\"19\" fill=\"#89543b\"/>", "float": "<ellipse cx=\"60\" cy=\"65\" rx=\"47\" ry=\"31\" fill=\"#78b8ab\" stroke=\"#467e77\" stroke-width=\"3\"/><ellipse cx=\"60\" cy=\"63\" rx=\"24\" ry=\"14\" fill=\"#f6edd5\"/><path d=\"M20 47L38 54M83 45L75 53M20 82L39 73M84 86L77 76\" stroke=\"#efcf8f\" stroke-width=\"12\"/>", "fan": "<path d=\"M60 90Q1 61 22 20Q43 14 60 28Q78 9 101 27Q112 69 60 90Z\" fill=\"#83a573\" stroke=\"#536f50\" stroke-width=\"3\"/><path d=\"M60 110V31M60 87L27 29M60 87L91 33M60 74L22 53M60 74L97 56\" stroke=\"#d1c793\" stroke-width=\"3\"/>", "fish": "<path d=\"M80 54L110 34V91L82 74Q45 113 14 65Q41 18 80 54Z\" fill=\"#7fb5be\" stroke=\"#477e89\" stroke-width=\"3\"/><path d=\"M50 44L66 25 73 51M48 85L63 100 68 79\" fill=\"#d7b578\"/><circle cx=\"30\" cy=\"60\" r=\"4\" fill=\"#314f59\"/><path d=\"M44 48Q32 66 45 82\" fill=\"none\" stroke=\"#cae0ca\" stroke-width=\"3\"/>", "mirror": "<ellipse cx=\"59\" cy=\"46\" rx=\"30\" ry=\"35\" fill=\"#91c7c7\" stroke=\"#c69d56\" stroke-width=\"8\"/><path d=\"M59 81V110\" stroke=\"#c69d56\" stroke-width=\"13\"/><path d=\"M43 53L69 25M53 64L76 38\" stroke=\"#e3f0d9\" stroke-width=\"4\"/>", "seal": "<path d=\"M41 14H79L72 66H48Z\" fill=\"#596d72\" stroke=\"#bd9b59\" stroke-width=\"4\"/><path d=\"M31 65H89L99 96H21Z\" fill=\"#d6b568\" stroke=\"#997942\" stroke-width=\"4\"/><ellipse cx=\"60\" cy=\"97\" rx=\"39\" ry=\"10\" fill=\"#b9934c\"/>", "lamp": "<path d=\"M37 100H85M60 98V74\" stroke=\"#c2a35c\" stroke-width=\"8\"/><path d=\"M28 29H92L81 76H39Z\" fill=\"#e2b872\" stroke=\"#b09053\" stroke-width=\"4\"/><path d=\"M48 62Q36 44 60 26Q57 44 74 53Q70 71 48 62\" fill=\"#fff0ab\"/><path d=\"M34 18Q60 0 86 18\" fill=\"none\" stroke=\"#c2a35c\" stroke-width=\"5\"/>", "bell": "<path d=\"M24 87Q39 65 37 39Q60 11 83 39Q83 66 99 87Z\" fill=\"#d5ae58\" stroke=\"#9f793e\" stroke-width=\"4\"/><path d=\"M19 90H104\" stroke=\"#ebcf86\" stroke-width=\"8\"/><circle cx=\"61\" cy=\"100\" r=\"9\" fill=\"#9b783f\"/><circle cx=\"60\" cy=\"25\" r=\"8\" fill=\"#d5ae58\"/>", "chariot": "<path d=\"M20 38H70V73H33Z\" fill=\"#9c6260\" stroke=\"#d8b063\" stroke-width=\"4\"/><path d=\"M68 67L106 43M101 43L111 46\" stroke=\"#d8b063\" stroke-width=\"6\"/><circle cx=\"47\" cy=\"84\" r=\"23\" fill=\"#c7a364\" stroke=\"#7d684b\" stroke-width=\"4\"/><path d=\"M47 64V104M27 84H67M33 70L61 98M33 98L61 70\" stroke=\"#f3d591\" stroke-width=\"3\"/>", "crown": "<path d=\"M23 40L40 57 60 21 79 57 99 40 87 97H34Z\" fill=\"#d7b45f\" stroke=\"#a08243\" stroke-width=\"4\"/><path d=\"M32 81H91\" stroke=\"#6b9894\" stroke-width=\"10\"/><path d=\"M60 65L68 74 60 83 52 74Z\" fill=\"#a35451\"/>", "egg": "<path d=\"M59 13Q89 38 89 76Q88 106 59 108Q29 106 29 76Q29 39 59 13Z\" fill=\"#d6bd7b\" stroke=\"#9c844c\" stroke-width=\"4\"/><path d=\"M33 69H86M31 83H89\" stroke=\"#5e9792\" stroke-width=\"7\"/><path d=\"M53 39L66 46 57 55\" fill=\"none\" stroke=\"#f6df9b\" stroke-width=\"4\"/>"});return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" aria-hidden="true">${parts[shape]||greekArt[shape]||jungleArt[shape]||laterArt[shape]}</svg>`}
// Level two is a shared burial complex beneath the single desert entrance.
treasures.forEach(t=>t.level=0);
const chamberFinds=[
 ['The welcome mat of eternity','Welcome mat','EGYPTIAN-ISH · HOSPITABLE','scroll','A woven mat reading PLEASE WIPE YOUR FEET. It has waited four thousand years for a visitor with feet this small.','Bean wipes all available feet.'],
 ['The sacred squeak reserve','Chickens ×3','ABSURD · RESTRICTED ACCESS','chicken','Three rubber chickens in a sealed royal chamber. Their squeaks echo for approximately six dynasties.','This explains the curse, probably.'],
 ['Moonlight scarab','Moon scarab','EGYPTIAN · RARE','scarab','A luminous scarab buried beneath a painted night sky. Its wings carry traces of blue glaze and a truly unreasonable number of stars.','Please do not use as a reading lamp.'],
 ['Anubis’s night shift','Night guardian','EGYPTIAN · RARE','anubis','A jackal guardian beside a tiny staff room. A tablet records four thousand years without a tea break.','Bean has filed a concern with management.'],
 ['The pharaoh’s spare toaster','Spare toaster','ABSURD · ROYAL WARRANTY','toaster','A second toaster, entombed with its original packaging. The warranty expired in 1324 BCE.','The crumb tray contains a smaller warranty.'],
 ['The keeper of the little door','Bean’s mask','IMPOSSIBLE · PERSONAL','mask','A golden mask with a baby-sized beak. The smallest archaeologist has been expected all along.','Bean requests a biscuit once every last treasure is safely packed.']
];
chamberFinds.forEach((f,i)=>treasures.push({id:16+i,name:f[0],short:f[1],rarity:f[2],shape:f[3],desc:f[4],note:f[5],x:520+i*330,count:i===1?3:1,level:1}));
const areas=[
 {name:'The Desert',width:5520,regions:['The Outskirts','Valley of Questionable Kings','The Great Chicken Necropolis']},
 {name:'Inside the Pyramid',width:2700,regions:['Hall of Small Footsteps','The Squeaking Chambers','The Keeper’s Sanctum']},
 {name:'The Oasis',width:2850,regions:['The Reed Beds','Lagoon of Lost Property','The Date-Palm Grove']},
 {name:'The Great Tomb',width:2900,regions:['The Descending Passage','The Hall of Watchers','The Royal Resting Room']}
];
const newFinds=[
 [2,'The floating royal duck','Royal duck','chicken','A yellow bath bird wearing the expression of someone who owns this oasis.','Its reign has been largely buoyant.',1],
 [2,'The jar of exceptional dates','Date jar','jar','Dates preserved in a sealed jar. The label gives a best-before date in a calendar nobody uses.','Bean is not allowed to open it.',1],
 [2,'Lifeguards of the lagoon','Pool birds ×3','flamingo','Three inflatable birds waiting patiently for a pool party that ended several dynasties ago.','No running beside the sacred pool.',3],
 [2,'The palm-leaf picnic list','Picnic list','scroll','Bread, figs, water, and fourteen rubber chickens. At last, documentary support for our theory.','The sandwiches have not survived.',1],
 [2,'The sunken garden supervisor','Wet gnome','gnome','A small bearded official discovered under a reed bed. An excellent place to avoid gardening duties.','His hat contains a tiny fish.',1],
 [2,'The moon over the watering hole','Moon mirror','disco','A mirrored sphere reflecting the palms in a hundred tiny fragments. A portable oasis for the homesick.','The fish are very impressed.',1],
 [3,'Key to the long sleep','Tomb seal','scarab','A heavy scarab seal from the innermost doorway. Its underside reads DO NOT DISTURB, EXCEPT FOR BISCUITS.','Pip has brought neither permission nor biscuits.',1],
 [3,'The royal nightlight','Nightlight','horus','A falcon lamp watching over the great tomb. Even the king preferred a little light in the corridor.','Fear of the dark is not a modern invention.',1],
 [3,'The royal squeak orchestra','Chickens ×4','chicken','Four rubber chickens arranged as a formal musical ensemble. The acoustics here are catastrophic.','Bean declines the encore.',4],
 [3,'The eternal breakfast machine','Royal toaster','toaster','Gold fittings. Two slots. A crumb tray bearing the royal cartouche. The monarch took breakfast seriously.','One side still burns the toast.',1],
 [3,'The little keeper’s crown','Bean’s crown','mask','A tiny golden face with a familiar beak. The inscription honours the one who remembers where everything goes.','Bean is trying very hard to look modest.',1],
 [3,'The sarcophagus of the first kiwi','First kiwi','coffin','The great stone bed held a smaller golden coffin. A note inside asks that all personal effects be delivered to the warehouse.','Even eternity has a luggage policy.',1]
];
for(const [area,name,short,shape,desc,note,count] of newFinds){const i=treasures.filter(t=>t.level===area).length;treasures.push({id:treasures.length,level:area,name,short,shape,desc,note,count,rarity:shape==='chicken'||shape==='toaster'||shape==='flamingo'?'ABSURD · EXCEPTIONAL':'ANCIENT · RARE',x:500+i*365})}

// Stable catalogue IDs preserve saves while each area gets its own collection.
Object.assign(treasures[16],{"shape": "mat", "name": "The welcome mat of eternity", "short": "Welcome mat", "desc": "A woven mat asks visitors to wipe their feet before entering eternity.", "note": "Bean has four thousand years of dust to consider."});
Object.assign(treasures[17],{"shape": "slipper", "name": "The emergency slipper reserve", "short": "Slippers ×3", "desc": "Three royal slippers. The inventory insists this is one complete pair.", "note": "Our theory requires a third foot."});
Object.assign(treasures[18],{"shape": "moonTile", "name": "The midnight calendar tile", "short": "Moon tile", "desc": "A glazed moon chart recording the best nights for finding worms.", "note": "Peer reviewed by several hungry kiwis."});
Object.assign(treasures[19],{"shape": "ibis", "name": "The corridor inspector", "short": "Ivory ibis", "desc": "An ibis appointed to inspect the corridors. It has never left its shelf.", "note": "Perfect attendance. Limited initiative."});
Object.assign(treasures[20],{"shape": "clock", "name": "The clock of eternal teatime", "short": "Tea clock", "desc": "A wooden clock permanently set to biscuit o’clock.", "note": "The most accurate clock in the complex."});
Object.assign(treasures[21],{"shape": "key", "name": "The key to the little door", "short": "Little key", "desc": "A golden key with a beak-shaped tooth, sized for the keeper of lost luggage.", "note": "Bean has finally been given responsibilities and a key."});
Object.assign(treasures[22],{"shape": "duck", "name": "The floating royal duck", "short": "Royal duck", "desc": "A bath duck claiming hereditary ownership of the oasis.", "note": "Its reign has been largely buoyant."});
Object.assign(treasures[23],{"shape": "dates", "name": "The basket of exceptional dates", "short": "Date basket", "desc": "A woven basket of dates, each individually catalogued by a very bored scribe.", "note": "The dates are ancient. The dating is excellent."});
Object.assign(treasures[24],{"shape": "float", "name": "The sacred swimming rings", "short": "Swim rings ×3", "desc": "Three flotation rings issued to officials who could not swim.", "note": "The paperwork also floats."});
Object.assign(treasures[25],{"shape": "fan", "name": "The palm-leaf air conditioner", "short": "Palm fan", "desc": "A broad fan powered by whichever assistant was nearest.", "note": "Bean has requested batteries."});
Object.assign(treasures[26],{"shape": "fish", "name": "The fish that missed the water", "short": "Glass fish", "desc": "A glass fish buried beside its pond, apparently waiting for rain.", "note": "A remarkably patient species."});
Object.assign(treasures[27],{"shape": "mirror", "name": "The moon over the watering hole", "short": "Hand mirror", "desc": "A bronze hand mirror used to check for sand in royal eyebrows.", "note": "Pip has discovered several new eyebrows."});
Object.assign(treasures[28],{"shape": "seal", "name": "The seal of do not disturb", "short": "Royal seal", "desc": "A heavy stamp used to reject visitors, petitions, and premature awakenings.", "note": "Except anyone carrying biscuits."});
Object.assign(treasures[29],{"shape": "lamp", "name": "The royal nightlight", "short": "Oil lamp", "desc": "A tiny lamp left burning for a monarch who disliked the dark.", "note": "Eternity is a long bedtime."});
Object.assign(treasures[30],{"shape": "bell", "name": "The orchestra of dinner bells", "short": "Bells ×4", "desc": "Four golden bells arranged to summon four different snacks.", "note": "Bean considers this a major technological advance."});
Object.assign(treasures[31],{"shape": "chariot", "name": "The royal miniature chariot", "short": "Tiny chariot", "desc": "A ceremonial vehicle with enough room for one extremely important beetle.", "note": "The parking permit is larger than the chariot."});
Object.assign(treasures[32],{"shape": "crown", "name": "The little keeper’s crown", "short": "Bean’s crown", "desc": "A small crown honouring the one who remembers where everything goes.", "note": "Bean is trying very hard to look modest."});
Object.assign(treasures[33],{"shape": "egg", "name": "The golden egg of the first kiwi", "short": "Golden egg", "desc": "A gilded egg inscribed: every great civilization begins with a small, round idea.", "note": "Pip requests that nobody sit on the evidence."});
treasures[19].rarity='EGYPTIAN · RARE';treasures[21].rarity='IMPOSSIBLE · PERSONAL';treasures[26].rarity='CURIOUS · RARE';treasures[33].rarity='IMPOSSIBLE · FOUNDATIONAL';
areas.push(
 {name:'The Olive Grove',width:2500,regions:['Naxos Harbour','The Olive Terraces','Wild Thyme Hill']},
 {name:'The Temple Courtyard',width:2500,regions:['The Marble Steps','Fountain of Lost Things','The Oracle’s Door']},
 {name:'The Oracle’s Chamber',width:2500,regions:['The Listening Hall','Predictions & Biscuits','The Sealed Stair']},
 {name:'The Temple Below',width:2500,regions:['The Forgotten Storeroom','Department of Misplaced Things','The Last Collection']}
);
for(const f of greekFinds)treasures.push({...f,id:treasures.length});
areas.push(...jungleAreas);
for(const f of jungleFinds)treasures.push({...f,id:treasures.length});
areas.push(...laterAreas);
for(const f of laterFinds)treasures.push({...f,id:treasures.length});
// Deliberately uneven clusters and quieter stretches; stable across visits and saves.
const findLocations=[
 [440,620,970,1460,1635,2090,2320,2490,2960,3190,3585,3780,4220,4415,4790,5075],
 [480,675,1190,1435,1920,2235],
 [450,730,1270,1480,2030,2360],
 [470,670,1100,1510,1740,2380]
];
for(let area=0;area<findLocations.length;area++)treasures.filter(t=>t.level===area).forEach((t,i)=>t.x=findLocations[area][i]);
// Half of each area's finds leave no surface clue until sniffed.
for(const area of areas.keys())treasures.filter(t=>t.level===area).forEach((t,i)=>t.buried=i%2===1);
const entrances=[1200];
let level=0,returnX=1133,pendingPortal=null,entering=null;
for(const id of [18,20,28,32]){treasures[id].wall=true;treasures[id].buried=false}
// Each alcove has its own blocking-stone firmness, stable across reloads.
const alcoveEffort=[2,4,5,1,3,2,5,1];
treasures.filter(t=>t.wall).forEach((t,i)=>t.effort=t.level>=8?t.effort:alcoveEffort[i%alcoveEffort.length]);
// Consistent effort per find: loose trinkets lift quickly; heavy relics need persistence.
const excavationEffort={scarab:2,chicken:3,jar:4,sandal:1,gnome:3,horus:2,toaster:4,scroll:1,flamingo:2,coffin:5,pyramid:5,plunger:1,anubis:3,disco:2,mask:4,mat:2,slipper:1,moonTile:3,ibis:2,clock:4,key:1,duck:1,dates:4,float:2,fan:1,fish:3,mirror:2,seal:5,lamp:2,bell:3,chariot:4,crown:3,egg:5};
const digsNeeded=h=>Math.min(4,(treasures[h.id]?.rooted?Math.max(2,treasures[h.id].effort):treasures[h.id]?.effort)??excavationEffort[treasures[h.id]?.shape]??2);
let celebrationUntil=0,confetti=[],findLabel=null;
function celebrate(){
 celebrationUntil=time+4;tone(180,.18,'triangle',.05);
 const colors=['#e8b64f','#ec826f','#65b9af','#f7eed1','#a69bd2'];
 for(let i=0;i<(reduced?24:90);i++)confetti.push({x:cart.x+44,y:GROUND-60,vx:(Math.random()-.5)*240,vy:-180-Math.random()*210,life:3+Math.random(),angle:Math.random()*6,spin:(Math.random()-.5)*9,color:colors[i%colors.length]});
 say('Bean packed a confetti cannon. Naturally.');
}
const findY=h=>treasures[h.id]?.wall?GROUND-52:GROUND-8;
const worldWidth=()=>areas[level].width;
const sameSite=(a,b)=>a===b||([1,3].includes(a)&&[1,3].includes(b))||(a>=4&&a<8&&b>=4&&b<8)||(a>=8&&a<12&&b>=8&&b<12)||(a>=12&&a<15&&b>=12&&b<15)||(a>=15&&a<18&&b>=15&&b<18);
const boundaryDestination=gate=>gate.boundaryExit===1?worldWidth()+300:-300;
const boundaryWaitingPoint=gate=>gate.boundaryExit===1?worldWidth()-180:250;
const currentCargo=()=>cargo.filter(c=>sameSite(c.level,level)&&c.status!=='stored');
function stairDirection(gate){if(gate.lift)return 0;if(level>=12)return gate.stairs||0;if(level>=8)return level>=9&&gate.to===level+1?1:level>=10&&gate.to===level-1?-1:0;if(level>=4)return gate.to===level+1&&level>=5?1:gate.to===level-1&&level>=6?-1:0;return level===1&&gate.to===0||level===3&&gate.to===1?-1:level===0&&gate.to===1||level===1&&gate.to===3?1:0}
function liftExit(to,spawn,label,down=false){return {x:880,to,spawn,label:"Lift · "+label+(down?" ↓":" ↑"),lift:true,down}}
function exits(){
 if(level===0)return [...entrances.map(x=>({x,to:1,spawn:285,label:'Pyramid ↓'})),{x:5390,to:2,spawn:285,label:'Oasis →',sign:true,signDrop:46,boundaryExit:1}];
 if(level===1)return [{x:210,to:0,spawn:returnX,label:'Desert ↑'},{x:2500,to:3,spawn:285,label:'Great Tomb ↓'}];
 if(level===2)return [{x:210,to:0,spawn:5243,label:'← Desert',sign:true,boundaryExit:-1},...([0,1,2,3].every(n=>completedLevels.has(n))?[{x:2650,to:4,spawn:285,label:'Naxos →',sign:true}]:[])];
 if(level===3)return [{x:210,to:1,spawn:2433,label:'Chambers ↑'},liftExit(0,returnX,'Desert') ];
 if(level===4)return [{x:210,to:2,spawn:2500,label:'Harbour ←',sign:true},{x:2330,to:5,spawn:285,label:'Temple →',sign:true},...([4,5,6,7].every(n=>completedLevels.has(n))?[{x:1650,to:8,spawn:285,label:'Jungle →',sign:true}]:[])];
 if(level===5)return [{x:210,to:4,spawn:2250,label:'Olive grove ←',sign:true},{x:2330,to:6,spawn:285,label:'Oracle ↓'}];
 if(level===6)return [{x:210,to:5,spawn:2250,label:'Courtyard ↑'},{x:2330,to:7,spawn:285,label:'Temple Below ↓'}];
 if(level===7)return [{x:210,to:6,spawn:2250,label:'Oracle ↑'},liftExit(4,1490,'Olive grove')];
 if(level===8)return [{x:210,to:4,spawn:1560,label:'← Naxos',sign:true},{x:2330,to:9,spawn:285,label:'Temple →',sign:true},...([8,9,10,11].every(n=>completedLevels.has(n))?[{x:1630,to:12,spawn:285,label:'Baths →',sign:true}]:[])];
 if(level===9)return [{x:210,to:8,spawn:2250,label:'← Canopy',sign:true},{x:2330,to:10,spawn:285,label:'Root Vault ↓'}];
 if(level===10)return [{x:210,to:9,spawn:2250,label:'Courtyard ↑'},{x:2330,to:11,spawn:285,label:'Heart ↓'}];
 if(level===11)return [{x:210,to:10,spawn:2250,label:'Root Vault ↑'},liftExit(8,1470,'Canopy')];
 if(level===12)return [{x:210,to:8,spawn:1550,label:'← Jungle',sign:true},{x:2130,to:13,spawn:285,label:'Baths →',sign:true},...([12,13,14].every(n=>completedLevels.has(n))?[{x:1620,to:15,spawn:285,label:'Castle →',sign:true}]:[])];
 if(level===13)return [{x:210,to:12,spawn:2050,label:'← Garden',sign:true},{x:2230,to:14,spawn:285,label:'Furnace ↓',stairs:1}];
 if(level===14)return [{x:210,to:13,spawn:2150,label:'Baths ↑',stairs:-1},liftExit(12,1460,'Garden')];
 if(level===15)return [{x:210,to:12,spawn:1540,label:'← Baths',sign:true},{x:2130,to:16,spawn:285,label:'Clock Hall →',sign:true}];
 if(level===16)return [{x:210,to:15,spawn:2050,label:'← Castle',sign:true},{x:2230,to:17,spawn:285,label:'Stargazer ↑',stairs:-1}];
 return [{x:210,to:16,spawn:2150,label:'Clock Hall ↓',stairs:1},liftExit(15,1460,'Castle',true)];
}
const images=Object.fromEntries([...new Set(treasures.map(f=>f.shape))].map(shape=>{let im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg(shape));return[shape,im]}));
let found=new Set(),holes=treasures.map(t=>({x:t.x,hits:0,id:t.id,level:t.level})),cargo=[],spills=0,nextCargo=1;
let pip={x:330,face:1,target:null,pokeX:null,jab:0},cart={x:155,v:0},bean={x:83,state:'follow',item:null,toss:0};
let completedLevels=new Set(),celebratedAreas=new Set();
const packDuration=()=>.85;
function levelReady(which){return treasures.filter(t=>t.level===which).every(t=>found.has(t.id)&&cargo.filter(c=>c.tid===t.id&&(c.status==='cart'||c.status==='stored')&&c.secured).length===t.count)&&currentCargo().every(c=>c.status==='cart'&&c.secured)}
function checkDiscoveryCelebration(){
 if(celebratedAreas.has(level)||!treasures.filter(t=>t.level===level).every(t=>found.has(t.id)))return;
 celebratedAreas.add(level);celebrate();
 if(level>=4&&level<8&&treasures.filter(t=>t.level>=4&&t.level<8).every(t=>found.has(t.id)))tone(220,1,'sine',.09);
}
function checkLevelSuccess(){
 checkDiscoveryCelebration();
 if(completedLevels.has(level)||!levelReady(level))return;
 completedLevels.add(level);
 $('#note-label').textContent=`${areas[level].name.toUpperCase()} COMPLETE`;
 $('#note-title').textContent=`${areas[level].name}: safely packed.`;
 $('#note-text').textContent='Every treasure found. Every piece aboard. Bean has restacked and tied down the whole collection.';
 if([0,1,2,3].every(n=>completedLevels.has(n))&&level<4)$('#note-text').textContent+=' A passage to Naxos is now open: click the Naxos sign at the far end of the oasis.';
 if(level>=4&&level<8&&[4,5,6,7].every(n=>completedLevels.has(n))){$('#note-title').textContent='Every lost thing, found.';$('#note-text').textContent='Bean rings the collection bell. The pigeons object. A Jungle → sign is now waiting in the olive grove. Follow the river to the rainkeepers’ temple.';}
 if(level>=8&&level<12&&[8,9,10,11].every(n=>completedLevels.has(n))){$('#note-title').textContent='The rainkeepers have their belongings back.';$('#note-text').textContent='Every treasure recovered. Every biscuit missing. A Baths → sign is now waiting on the Canopy Trail. A Roman bathhouse needs investigating, and Bean needs a towel.';}
 if(level>=12&&level<15&&[12,13,14].every(n=>completedLevels.has(n)))$('#note-text').textContent='The bathhouse collection is complete. Follow the Castle → sign in the Aqueduct Garden to the highlands.';
 if(level>=15&&[15,16,17].every(n=>completedLevels.has(n))){$('#note-title').textContent='Two kiwis. One cart. A very long story.';$('#note-text').textContent='Every highland treasure recovered. The founding badge belongs to a society suspiciously like ours. Take the collection back to the baths, or revisit a favourite dig.';}
 [440,554,660,880].forEach((f,i)=>setTimeout(()=>tone(f,.25),i*100));save();updateUI(true);
}
const cargoWeight=c=>({egg:9,seal:7,chariot:6,lamp:4,crown:4,dates:5,bell:2,duck:1,float:1,coffin:9,pyramid:8,jar:7,anubis:6,horus:6,toaster:5,mask:4,gnome:3,scarab:2,scroll:2,chicken:1,flamingo:1}[treasures[c.tid].shape]||3);
function orderedPile(extra=[]){return [...currentCargo().filter(c=>c.status==='cart'),...extra].sort((a,b)=>(0)||(cargoWeight(b)-cargoWeight(a)||a.id-b.id))}
function packedSpacing(c){
 const tightening=bean.state==='pack'&&bean.packItem===c.id?Math.min(1,(bean.packTime||0)/packDuration()):0;
 return 13.8-3.8*(c.secured?1:tightening);
}
function pileRise(pile,index){return pile.slice(0,index).reduce((sum,c)=>sum+packedSpacing(c),0)}
function packingPerch(item){
 const pile=orderedPile(),index=pile.indexOf(item),support=pile[index-1];
 return support?{x:support.x-pip.face*7,lift:GROUND-1-(support.y-18)}:{x:cart.x-pip.face*24,lift:51};
}
let quietTime=0,catchCount=0,brakes=false,unstableTime=0;
let digHeld=false,queuedDig=false,runHeld=false;
const walkingSpeed=()=>runHeld||keys.has("Shift")||pip.runTo&&pip.target!==null?360:135;
let camera=0,time=0,last=0,held=0,keys=new Set(),action=null,particles=[],sound=false,audio,toastTimer,speechTimer,sniff=0,travel=0,spillDistance=0,autosave=0,lastUI='',reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false;
function load(){try{
 const s=JSON.parse(localStorage.getItem(KEY));if(!s)return;
 brakes=s.brakes===true;
 completedLevels=new Set((s.completedLevels||[]).filter(n=>Number.isInteger(n)&&areas[n]));
 found=new Set((s.found||[]).filter(i=>Number.isInteger(i)&&treasures[i]));
 celebratedAreas=new Set(s.celebratedAreas||areas.map((_,i)=>i).filter(i=>treasures.filter(t=>t.level===i).every(t=>found.has(t.id))));
 level=Number.isInteger(s.level)&&areas[s.level]?s.level:0;
 returnX=entrances.includes(s.returnDoor)?s.returnDoor-67:1133;
 pip.x=Math.max(160,Math.min(worldWidth()-100,Number(s.x)||330));cart.x=pip.x-155;bean.x=cart.x-65;
 holes=treasures.map(t=>({x:t.x,id:t.id,level:t.level,hits:found.has(t.id)?digsNeeded(t):Math.min(digsNeeded(t)-1,Math.max(0,Number(s.hits?.[t.id])||0))}));
 cargo=(s.cargo||[]).filter(c=>Number.isInteger(c.tid)&&found.has(c.tid)).map(c=>{
  const home=treasures[c.tid].level,stored=c.status==='stored'||!sameSite(home,level);
  return {id:nextCargo++,tid:c.tid,secured:stored||c.secured===true,level:home,status:stored?'stored':c.status==='cart'?'cart':'ground',x:Number(c.x)||cart.x,y:GROUND-18,vx:0,vy:0,angle:0};
 });
 spills=Math.max(0,Number(s.spills)||0);catchCount=Math.max(0,Number(s.catchCount)||0);
 for(const id of found){const t=treasures[id],count=cargo.filter(c=>c.tid===id).length;for(let j=count;j<t.count;j++)cargo.push({id:nextCargo++,tid:id,level:t.level,secured:t.level!==level,status:t.level===level?'cart':'stored',x:cart.x,y:GROUND-40,angle:0,vx:0,vy:0})}
}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify({brakes,celebratedAreas:[...celebratedAreas],completedLevels:[...completedLevels],level,returnDoor:returnX+67,found:[...found],x:pip.x,hits:holes.filter(h=>h.id>=0).map(h=>h.hits),cargo:cargo.map(c=>({tid:c.tid,secured:!!c.secured,level:c.level,status:c.status,x:c.x})),spills,catchCount}))}catch(e){$('#instruction').textContent='Browser storage unavailable; this expedition lasts until you close the page.'}}
function say(text){$('#speech').textContent=text;$('#speech').style.opacity='1';clearTimeout(speechTimer);speechTimer=setTimeout(()=>$('#speech').style.opacity='0',5000)}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3500)}
function tone(freq,duration=.1,type='sine',volume=.04){if(!sound)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(freq*.5,audio.currentTime+duration);g.gain.setValueAtTime(volume,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration)}catch(e){}}
function specimenCards(list){return list.map(f=>found.has(f.id)?`<button class="specimen found" data-id="${f.id}" aria-label="Read about ${f.name}">${svg(f.shape)}<small>${f.short}</small></button>`:`<div class="specimen empty"><span>?</span><small>UNDISCOVERED</small></div>`).join('')}
const warehouseGroups=[
 {id:'egypt',name:'Egypt',levels:[0,1,2,3]},
 {id:'naxos',name:'Naxos',levels:[4,5,6,7]},
 {id:'jungle',name:'Jungle Temple',levels:[8,9,10,11]},
 {id:'baths',name:'Roman Baths',levels:[12,13,14]},
 {id:'castle',name:'Cliffside Castle',levels:[15,16,17]}
];
function updateUI(force=false){
 const active=currentCargo(),aboard=active.filter(c=>c.status==='cart').length,loose=active.length-aboard,secured=active.filter(c=>c.status==='cart'&&c.secured).length;
 const local=treasures.filter(t=>t.level===level),discovered=local.filter(t=>found.has(t.id)).length;
 const key=[level,found.size,aboard,loose,spills,bean.state,brakes,secured,catchCount,[...completedLevels].join(',')].join(':');
 const routes=exits();$('#portal').textContent=routes[0].label;$('#portal').hidden=!!routes[0].sign;$('#onward').hidden=routes.length===1||!!routes.at(-1).sign;$('#onward').textContent=routes.at(-1).label;
 $('#level-tag').textContent=areas[level].name.toUpperCase();
 if(key===lastUI&&!force)return;lastUI=key;
 const inHighlands=level>=15,inBaths=level>=12&&level<15,inJungle=level>=8&&level<12,inGreece=level>=4&&level<8;
 document.title='Kiwi Archaeology Society · '+(inHighlands?'Highland Expedition':inBaths?'Bathhouse Expedition':inJungle?'Jungle Expedition':inGreece?'Naxos Expedition':'Desert Division');
 $('.header-note').textContent=inHighlands?'Highland Division. Lofty expectations.':inBaths?'Bathhouse Division. Bring a towel.':inJungle?'Rainforest Division. Damp paperwork.':inGreece?'Naxos Division. Divine lost property.':'Desert Division. Questionable supervision.';
 $('.eyebrow').innerHTML='<i></i> '+(inHighlands?'EXPEDITION 006 · THE KEEPERS OF THE STARS':inBaths?'EXPEDITION 005 · THE EXTREMELY LATE BATH':inJungle?'EXPEDITION 004 · THE TEMPLE OF GENTLE RAIN':inGreece?'EXPEDITION 003 · THE TEMPLE OF MISPLACED THINGS':'EXPEDITION 002 · A MOST INCONVENIENT DESERT');
 $('#probe b').textContent=level>=4?'Poke the earth':'Poke the sand';
 canvas.setAttribute('aria-label',areas[level].name+'. Arrow keys to walk, Shift to run, Space to dig, S to sniff. Click signs to travel.');

 $('#packing-status').textContent=brakes?'Brakes on · Bean is reloading and tying down each item':bean.state==='pack'?`Bean is tying item ${secured+1} of ${aboard} · each knot stays tied`:`${secured} tied down · ${aboard-secured} waiting for rope · ${catchCount} caught`;
 $('#aboard').textContent=aboard;$('#loose').textContent=loose;$('#spills').textContent=spills;
 $('#rank-count').textContent=discovered+'/'+local.length;$('#find-count').textContent=String(discovered).padStart(2,'0')+' / '+local.length;
 $('#progress').style.width=discovered/local.length*100+'%';$('#rank-title').textContent=completedLevels.has(level)?'Collection secured':aboard>10?'Architecturally unsound':aboard>4?'Optimistically stacked':'Reasonably packed';
 $('#manifest-area').textContent=areas[level].name;
 $('#milestone').innerHTML=completedLevels.has(level)?'<b>Area complete.</b> Ready for the warehouse.':discovered===local.length?'<b>All finds discovered.</b> Let Bean collect everything and finish each knot to succeed.':`Find all <b>${local.length} treasures</b>, then let Bean tie down each item.`;
 $('#collection').innerHTML=specimenCards(local);
 const archive=$('#archive');
 const openGroups=new Set([...archive.querySelectorAll('details[data-expedition][open]')].map(d=>d.dataset.expedition));
 const openLevels=new Set([...archive.querySelectorAll('details[data-area][open]')].map(d=>Number(d.dataset.area)));
 archive.innerHTML=warehouseGroups.map(group=>{
  const levels=group.levels.filter(i=>i!==level),finds=treasures.filter(t=>group.levels.includes(t.level));
  if(!levels.length)return '';
  const discovered=finds.filter(t=>found.has(t.id)).length,complete=group.levels.every(i=>completedLevels.has(i));
  return `<details class="warehouse-area" data-expedition="${group.id}" ${openGroups.has(group.id)?'open':''}><summary>${group.name} <span>${discovered}/${finds.length} finds${complete?' · ✓':''}</span></summary><div class="warehouse-levels">${levels.map(i=>{
   const items=treasures.filter(t=>t.level===i),count=items.filter(t=>found.has(t.id)).length;
   return `<details data-area="${i}" ${openLevels.has(i)?'open':''}><summary>${areas[i].name} <span>${count}/${items.length} finds${completedLevels.has(i)?' · ✓':''}</span></summary><div class="collection">${specimenCards(items)}</div></details>`;
  }).join('')}</div></details>`;
 }).join('');
 $('#warehouse-count').textContent=cargo.filter(c=>c.status==='stored').length+' items safely warehoused';
 for(const container of ['#collection','#archive'])$(container).querySelectorAll('button').forEach(b=>b.onclick=()=>showFind(+b.dataset.id));
}
function showFind(id){const f=treasures[id];$('#discovery-type').textContent=f.rarity;$('#discovery-art').innerHTML=svg(f.shape);$('#catalogue').textContent=(f.level>=15?'HIGHLAND DIVISION / ':f.level>=12?'BATHHOUSE DIVISION / ':f.level>=8?'RAINFOREST DIVISION / ':f.level>=4?'NAXOS DIVISION / ':'DESERT DIVISION / ')+String(id+1).padStart(3,'0');$('#discovery-name').textContent=f.name;$('#discovery-desc').textContent=f.desc;$('#curator-note').textContent=f.note;$('#discovery').showModal();stopWalking()}
function reveal(h){if(h.id<0||found.has(h.id))return;const f=treasures[h.id];found.add(h.id);findLabel={id:h.id,x:h.x,area:level,until:time+4.5};for(let i=0;i<f.count;i++)cargo.push({id:nextCargo++,tid:h.id,level,status:'fall',x:h.x+(i-(f.count-1)/2)*18,y:(f.wall?GROUND-52:GROUND-40)-i*13,vx:(i-(f.count-1)/2)*14,vy:-(f.shape==='chicken'?240:150)-i*12,angle:(i-2)*.1});$('#note-label').textContent='NEW FIND · '+f.rarity;$('#note-title').textContent=f.name;$('#note-text').textContent=f.desc;[440,550,660].forEach((f,i)=>setTimeout(()=>tone(f,.2),i*85));checkDiscoveryCelebration();save();updateUI(true)}
function sniffReveals(h){return h.level===level&&sniff>time&&Math.abs(h.x-pip.x)<=420}
function surfaceVisible(h){return h.hits>0||!treasures[h.id]?.buried||sniffReveals(h)}
function nearestHole(x,range=58){return holes.filter(h=>h.level===level).reduce((best,h)=>Math.abs(h.x-x)<range&&(!best||Math.abs(h.x-x)<Math.abs(best.x-x))?h:best,null)}
function requestPoke(x,facing=null){if(action||entering||brakes)return;pip.runTo=false;let h=nearestHole(x);if(!h){h={x:Math.max(180,Math.min(worldWidth()-90,x)),hits:0,id:-1,level};holes.push(h)}pip.face=facing??(h.x>=pip.x?1:-1);pip.target=Math.max(160,Math.min(worldWidth()-100,h.x-pip.face*67));pip.pokeX=h.x;}
function startJab(){const h=nearestHole(pip.pokeX,5);if(!h)return;action={elapsed:0,h};pip.target=null;pip.pokeX=null;}
function burst(x,y=GROUND-3){
 const palette=level===9?['#b5b28a','#d4cba4','#98a181','#ece0ba']:level===10?['#9b805b','#bd9e71','#736145','#d2b386']:level===11?['#72928c','#a2b3a0','#526e74','#c3c9a8']:level>=15?['#98a69b','#bac1a6','#81938f','#d0d1b3']:level>=12?['#baa282','#d3b893','#978469','#e4d2ad']:level>=8?['#708558','#97a978','#a39163','#bbc899']:level>=4?['#b6b8a5','#d6d2ba','#969d91','#ece2c7']:level===1?['#b59b6f','#8e7957','#cab087','#a58c62']:['#c49a5c','#dab376','#b68d51','#edd097'];
 for(let i=0;i<34;i++){
  const life=.35+Math.random()*.35;
  particles.push({x:x+(Math.random()-.5)*9,y,vx:(Math.random()-.5)*155,vy:-30-Math.random()*85,life,size:.6+Math.random()*1.5,color:palette[i%palette.length],angle:Math.random()*Math.PI,spin:(Math.random()-.5)*9,settled:false});
 }
}
// Longer exit journeys get a quicker sprint, easing to a run near the door.
function exitRunSpeed(distance){return 360+240*Math.min(1,Math.max(0,(distance-180)/1800))}
function updateLooseCargo(dt){
currentCargo().forEach(c=>{if(c.status==='fall'){c.x+=c.vx*dt;c.y+=c.vy*dt;c.vy+=410*dt;c.angle+=dt*2.5;if(c.y>=GROUND-18){c.y=GROUND-18;c.x=Math.max(70,Math.min(worldWidth()-60,c.x));c.status='ground';c.vx=0;c.vy=0;c.angle=(c.id%3-1)*.25;burst(c.x)}}});
}
function updateBean(dt){
// Bean chases loose objects, carries one home, then physically tosses it onto the pile.
const speed=pendingPortal?Math.max(430,exitRunSpeed(Math.abs(pendingPortal.target-pip.x))+70):walkingSpeed()>135?430:260;bean.lift=bean.lift||0;function walkBean(target){if(pendingPortal)target=Math.max(160,Math.min(worldWidth()-100,target));const d=target-bean.x;const distance=Math.min(Math.abs(d),speed*dt);bean.moving=distance>2*dt;bean.x+=Math.sign(d)*distance;return Math.abs(d)<9}
if(bean.state==='pack'){
 if(pendingPortal||!brakes&&(quietTime===0||currentCargo().some(c=>c.status!=='cart'))){bean.state='follow';bean.packTime=0;bean.packItem=null;bean.hop=null;bean.settle=0}
 else{
  const item=orderedPile().find(c=>!c.secured&&c.tip===undefined);
  if(!item){bean.state='follow';bean.packItem=null;checkLevelSuccess()}
  else{
   if(bean.packItem!==item.id){bean.packItem=item.id;bean.packTime=0}
   const perch=packingPerch(item),targetLift=perch.lift,targetX=perch.x;
   bean.settle=Math.max(0,(bean.settle||0)-dt);
   if(!bean.hop&&!bean.settle&&(Math.abs(bean.lift-targetLift)>3||Math.abs(bean.x-targetX)>3)){
    bean.hop={t:0,from:bean.lift,to:targetLift,fromX:bean.x,toX:targetX};
   }
   if(bean.hop){
    const h=bean.hop;h.t+=dt;const p=Math.min(1,h.t/.32),ease=p*p*(3-2*p);
    bean.x=h.fromX+(h.toX-h.fromX)*ease;
    bean.lift=h.from+(h.to-h.from)*ease+(reduced?0:Math.sin(p*Math.PI)*17);
    if(p===1){bean.lift=h.to;bean.hop=null;bean.settle=.12}
   }else if(!bean.settle&&Math.abs(bean.lift-targetLift)<3)bean.packTime+=dt;
   if(bean.packTime>=packDuration()){item.secured=true;bean.packTime=0;bean.packItem=null;tone(390,.08,'triangle',.02);save();if(orderedPile().every(c=>c.secured||c.tip!==undefined)){bean.state='follow';checkLevelSuccess()}}
  }
 }
}else if(bean.state==='catch'){bean.catchTime+=dt;bean.lift=Math.sin(Math.min(1,bean.catchTime/.6)*Math.PI)*65;walkBean(cart.x-pip.face*35)}else if(bean.state==='follow'||bean.state==='fetch'){let target=currentCargo().filter(c=>c.status==='ground').sort((a,b)=>Math.abs(a.x-bean.x)-Math.abs(b.x-bean.x))[0];if(target){bean.state='fetch';if(walkBean(target.x)){bean.item=target.id;target.status='carry';bean.state='carry';tone(treasures[target.tid].shape==='chicken'?620:340,.07,'triangle',.025)}}else{bean.state='follow';const running=pip.moving&&(pendingPortal||walkingSpeed()>135);walkBean(pendingPortal?Math.max(160,Math.min(worldWidth()-100,pendingPortal.x-pip.face*75)):cart.x-pip.face*(running?115:83))}}else if(bean.state==='carry'){const c=cargo.find(c=>c.id===bean.item);if(!c){bean.state='follow';bean.item=null}else{c.x=bean.x+22;c.y=GROUND-54;c.angle=-.15;if(walkBean(cart.x-pip.face*50)){bean.state='toss';bean.toss=0;c.startX=c.x;c.startY=c.y}}}else if(bean.state==='toss'){const c=cargo.find(c=>c.id===bean.item);if(!c){bean.state='follow';bean.item=null}else{bean.toss+=dt;const p=Math.min(1,bean.toss/.65),height=GROUND-67-pileRise(orderedPile([c]),orderedPile([c]).findIndex(item=>item.id===c.id));c.x=c.startX+(cart.x-c.startX)*p;c.y=c.startY+(height-c.startY)*p-Math.sin(p*Math.PI)*85;c.angle=p*1.8;if(p>=1){c.status='cart';bean.state=brakes?'pack':'follow';bean.packTime=0;bean.packItem=null;bean.item=null;tone(300,.08,'triangle',.025);save()}}}
if(!pendingPortal&&bean.state==='follow'&&quietTime>1.2&&(brakes||currentCargo().every(c=>c.status==='cart'))&&orderedPile().some(c=>!c.secured&&c.tip===undefined)&&Math.abs(bean.x-cart.x)<110){bean.state='pack';bean.packTime=0;}
if(brakes&&currentCargo().every(c=>c.status==='cart'&&c.secured)&&bean.state==='follow'){
 brakes=false;unstableTime=0;stopWalking();save();
}
if(!['pack','catch'].includes(bean.state))bean.lift=Math.max(0,bean.lift-140*dt);
}
function step(dt){bean.moving=false;time+=dt;confetti=confetti.filter(p=>p.life>0);for(const p of confetti){
 if(p.settled){p.life-=dt;continue}
 p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=160*dt;p.vx*=Math.exp(-.8*dt);p.angle+=p.spin*dt;
 const bottom=3*Math.abs(Math.sin(p.angle))+2*Math.abs(Math.cos(p.angle));
 if(p.vy>=0&&p.y+bottom>=GROUND){p.y=GROUND-2;p.angle=0;p.vx=0;p.vy=0;p.spin=0;p.settled=true;p.life=1.1}
 }if(entering?.lift){stepLift(dt);return}if(entering){entering.elapsed+=dt;pip.x=entering.from+(pendingPortal.x-entering.from)*Math.min(1,entering.elapsed/.3);pip.moving=entering.elapsed<.3;const oldCartX=cart.x;const cartProgress=Math.min(1,entering.elapsed/1.1),cartEase=cartProgress*cartProgress*(3-2*cartProgress);cart.x=entering.cartFrom+(pendingPortal.x-entering.cartFrom)*cartEase;for(const c of currentCargo())if(c.status==='cart')c.x+=cart.x-oldCartX;updateLooseCargo(dt);updateBean(dt);if(entering.elapsed>=1.65){entering=null;changeLevel()}return}if($('dialog[open]')){digHeld=false;queuedDig=false;held=0;keys.clear();return}const direction=held||(keys.has('ArrowRight')||keys.has('d')?1:0)-(keys.has('ArrowLeft')||keys.has('a')?1:0);const oldX=pip.x;if(pendingPortal?.boundaryExit){pendingPortal.target=boundaryDestination(pendingPortal);pip.target=pendingPortal.target}if(!action&&!brakes){if(direction){pip.runTo=false;pendingPortal=null;pip.face=direction;pip.target=null;pip.pokeX=null;pip.x+=direction*walkingSpeed()*dt}else if(pip.target!==null){let d=pip.target-pip.x;if(Math.abs(d)<2){pip.x=pip.target;pip.target=null;pip.runTo=false;if(pip.pokeX!==null)startJab()}else{if(pip.pokeX===null)pip.face=Math.sign(d);pip.x+=Math.sign(d)*Math.min(Math.abs(d),(pendingPortal?exitRunSpeed(Math.abs(d)):walkingSpeed())*dt)}}}pip.x=Math.max(pendingPortal?.boundaryExit===-1&&pendingPortal.target===boundaryDestination(pendingPortal)?-300:160,Math.min(pendingPortal?.boundaryExit===1&&pendingPortal.target===boundaryDestination(pendingPortal)?worldWidth()+300:worldWidth()-100,pip.x));const moved=Math.abs(pip.x-oldX);pip.moving=moved>.01;travel+=moved;spillDistance+=moved;
if(action){action.elapsed+=dt;
const t=action.elapsed;
// A brief ground probe; the 280 ms timing is tuned for play, not a biological measurement.
pip.jab=t<.09?Math.sin(t/.09*Math.PI/2):t<.14?1-.025*Math.sin((t-.09)*90):t<.28?(1-(t-.14)/.14)**2:0;
if(t>=.09&&!action.contacted){action.contacted=true;burst(action.impactX??action.h.x,findY(action.h));tone(treasures[action.h.id]?.rooted&&action.h.hits===0?270:145,.12,'triangle',.06)}
if(t>=.28){const h=action.h;const wasClear=h.hits>=digsNeeded(h);h.hits=Math.min(digsNeeded(h),h.hits+1);if(!wasClear&&h.hits===digsNeeded(h)){if(h.id>=0)reveal(h);else{save()}}pip.jab=0;action=null;save();if(digHeld||queuedDig){queuedDig=false;pokeAhead()}}}
// The cart trails Pip in either direction, with a damped suspension.
const cartTarget=pip.x-pip.face*155;const oldCart=cart.x;if(brakes)cart.v=0;else{cart.v+=(cartTarget-cart.x)*18*dt;cart.v*=Math.exp(-6*dt);cart.x+=cart.v*dt;}cart.x=Math.max(pendingPortal?.boundaryExit===-1?-350:50,Math.min(pendingPortal?.boundaryExit===1?worldWidth()+350:worldWidth()-30,cart.x));
const pile=orderedPile();const wobble=reduced?0:Math.sin(time*3.6)*Math.min(.14,pile.length*.004)+Math.max(-.11,Math.min(.11,cart.v*.0006));const tiedSway=reduced?0:Math.sin(time*4.2)*Math.min(.065,Math.abs(cart.v)*.00022)+Math.max(-.045,Math.min(.045,cart.v*.00012));
pile.forEach((c,i)=>{
 const height=pileRise(pile,i),y=GROUND-67-height,offset=Math.sin(i*2.3)*18;
 if(c.secured){
  // The ropes hold the load together as one gently rocking stack.
  c.x=cart.x+offset*Math.cos(tiedSway)+height*Math.sin(tiedSway);
  c.y=GROUND-67+offset*Math.sin(tiedSway)-height*Math.cos(tiedSway);
  c.angle=Math.sin(i*3.3)*.22+tiedSway;
 }else{
  c.x=cart.x+offset+Math.sin(time*3.6+i*.18)*Math.min(i*1.5,20)+(GROUND-y)*wobble;
  c.x-=Math.max(0,c.tip||0)*pip.face*24;
  c.y=y;c.angle=Math.sin(i*3.3)*.22+wobble*(1+i*.06)-Math.max(0,c.tip||0)*pip.face;
 }
});
quietTime=moved<.01&&Math.abs(cart.v)<4?quietTime+dt:0;
for(const c of pile){if(c.secured){c.tip=undefined;continue}if(c.tip===undefined)continue;c.tip+=dt;if(c.tip<.6)continue;
 const canCatch=!brakes&&bean.state==='catch'&&bean.item===c.id&&Math.abs(bean.x-cart.x)<100&&pile.indexOf(c)<10;
 if(canCatch){catchCount++;tone(650,.1,'triangle');toast('Bean caught it! A pause would let him tie down the load.');c.tip=undefined;}
 else{c.tip=undefined;c.status='fall';c.vx=-pip.face*80;c.vy=-30;c.secured=false;spills++;tone(180,.15);}
 if(bean.state==='catch'){bean.state='follow';bean.item=null}save();
}
if(!brakes&&!pendingPortal&&moved>.01&&pile.length>=5&&spillDistance>160&&!pile.some(c=>c.tip!==undefined)&&currentCargo().filter(c=>c.status!=='cart').length<7){
 const c=[...pile].reverse().find(c=>!c.secured);
 if(c){spillDistance=0;c.tip=0;if(bean.state==='follow'&&Math.abs(bean.x-cart.x)<110){bean.state='catch';bean.item=c.id;bean.catchTime=0;tone(760,.08,'triangle',.02)}}
}
// A top-heavy loose stack can give way while parked, too.
const looseTop=pile.filter((c,i)=>i>=4&&!c.secured);
unstableTime=!brakes&&quietTime>.5&&pile.length>=10&&looseTop.length>=3?unstableTime+dt:0;
if(unstableTime>.85){
 brakes=true;unstableTime=0;stopWalking();pendingPortal=null;cart.v=0;
 action=null;pip.jab=0;pip.moving=false;
 for(let i=0;i<looseTop.length;i++)looseTop[i].tip=-i*.08;
 if(bean.state==='pack'||bean.state==='catch'){bean.state='follow';bean.item=null;bean.packItem=null;bean.hop=null;bean.packTime=0;bean.settle=0}
 save();
}
updateLooseCargo(dt);
updateBean(dt);
particles=particles.filter(p=>p.life>0);particles.forEach(p=>{
 p.life-=dt;p.x+=p.vx*dt;
 if(!p.settled){p.y+=p.vy*dt;p.vy+=650*dt;p.vx*=Math.exp(-2*dt);p.angle+=p.spin*dt;
  if(p.y>=GROUND-1){p.y=GROUND-1;p.settled=true;p.vy=0;p.vx*=.2}
 }else p.vx*=Math.exp(-18*dt);
});camera+=(Math.max(0,Math.min(worldWidth()-W,pip.x-W*.59))-camera)*Math.min(1,dt*5);if(pendingPortal&&(!pendingPortal.boundaryExit||pendingPortal.target===boundaryDestination(pendingPortal))&&Math.abs(pip.x-pendingPortal.target)<3&&!action){if(pendingPortal.lift){startLift()}else if(stairDirection(pendingPortal)){entering={elapsed:0,from:pip.x,cartFrom:cart.x,direction:stairDirection(pendingPortal)};bean.lift=0;bean.hop=null;bean.settle=0;if(bean.state==='pack'){bean.state='follow';bean.packItem=null;bean.packTime=0}stopWalking()}else changeLevel()};if(bean.state!=='pack')checkLevelSuccess();autosave+=dt;if(autosave>3){autosave=0;save()}updateUI();}
function stopWalking(){pip.runTo=false;runHeld=false;digHeld=false;queuedDig=false;held=0;keys.clear();pip.target=null;pip.pokeX=null}
function pointer(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width+camera,y:(e.clientY-r.top)*H/r.height}}
function walkToGround(x,run=false){
 if(action)return;
 pendingPortal=null;pip.runTo=run;pip.target=Math.max(160,Math.min(worldWidth()-100,x));pip.pokeX=null;
}
function clickScene(p){
 if(entering)return;
 const wall=holes.find(h=>h.level===level&&treasures[h.id]?.wall&&h.hits<digsNeeded(h)&&Math.abs(h.x-p.x)<45&&Math.abs(findY(h)-p.y)<35);
 if(wall){if(brakes)return;pendingPortal=null;requestPoke(wall.x);return}
 const door=exits().find(g=>g.lift?Math.abs(g.x-p.x)<170&&p.y>=GROUND-205:g.sign?Math.abs(g.x-p.x)<=72&&p.y>=GROUND-146+(g.signDrop||0)&&p.y<=GROUND-100+(g.signDrop||0):Math.abs(g.x-p.x)<60&&p.y>=GROUND-155);
 if(door){requestPortal(door,!!door.sign);return}
 if(brakes)return;
 if(p.y<GROUND-85){walkToGround(p.x);return}
 pendingPortal=null;const h=nearestHole(p.x,65);
 if(h&&h.hits<digsNeeded(h)&&surfaceVisible(h))requestPoke(h.x);else walkToGround(p.x);
}
function runToSpot(p){
 if(entering||brakes)return;
 action=null;pip.jab=0;digHeld=false;queuedDig=false;held=0;keys.clear();
 walkToGround(p.x,true);
}
canvas.addEventListener('dblclick',e=>{e.preventDefault();runToSpot(pointer(e))});
canvas.addEventListener('pointerdown',e=>{e.preventDefault();canvas.focus({preventScroll:true});clickScene(pointer(e))});

function pokeAhead(){
 if(entering||brakes)return;pip.runTo=false;
 pendingPortal=null;
 if(action){queuedDig=true;return}
 // Keyboard/button probing is stationary. Nearby treasure detection never repositions Pip.
 const x=pip.x+pip.face*67;
 let h=holes.filter(h=>h.level===level&&h.id>=0&&h.hits<digsNeeded(h)&&Math.abs(h.x-x)<=34)
  .sort((a,b)=>Math.abs(a.x-x)-Math.abs(b.x-x))[0];
 if(!h)h=holes.find(h=>h.level===level&&Math.abs(h.x-x)<6&&h.hits>0);
 if(!h){h={x,hits:0,id:-1,level};holes.push(h)}
 pip.target=null;pip.pokeX=null;action={elapsed:0,h,impactX:x};
}
$('#portal').onclick=()=>requestPortal(exits()[0]);$('#onward').onclick=()=>requestPortal(exits().at(-1));$('#probe').onclick=pokeAhead;function sniffMessage(){return '';}
function doSniff(){sniff=time+6;tone(440,.13);if(treasures.filter(t=>t.level===level).every(t=>found.has(t.id)))celebrate();const message=sniffMessage();if(message)say(message);else{clearTimeout(speechTimer);$('#speech').textContent='';$('#speech').style.opacity='0'}};$('#sniff').onclick=doSniff;
const runButton=$('#run');
runButton.addEventListener('pointerdown',e=>{e.preventDefault();runButton.setPointerCapture(e.pointerId);runHeld=true});
for(const event of ['pointerup','pointercancel','lostpointercapture'])runButton.addEventListener(event,()=>runHeld=false);
for(const [id,dir]of[['left',-1],['right',1]]){const b=$('#'+id);b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);held=dir});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,()=>held=0));b.addEventListener('keydown',e=>{if(e.key==='Enter'){held=dir;e.preventDefault()}});b.addEventListener('keyup',()=>held=0)}
document.addEventListener('keydown',e=>{if($('dialog[open]')||e.target?.isContentEditable||['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName))return;const k=e.key.length===1?e.key.toLowerCase():e.key;if(['ArrowLeft','ArrowRight','a','d',' ','p','s','e','Shift'].includes(k)){e.preventDefault();if(k===' '){digHeld=true;if(!e.repeat)pokeAhead()}else if(k==='p'&&!e.repeat)pokeAhead();else if(k==='e'&&!e.repeat)requestPortal();else if(k==='s'&&!e.repeat)doSniff();else if(['ArrowLeft','ArrowRight','a','d','Shift'].includes(k))keys.add(k)}});document.addEventListener('keyup',e=>{if(e.key===' ')digHeld=false;keys.delete(e.key.length===1?e.key.toLowerCase():e.key)});window.addEventListener('blur',stopWalking);document.addEventListener('visibilitychange',()=>{if(document.hidden){stopWalking();save()}});
$('#sound').onclick=()=>{sound=!sound;$('#sound span').textContent=sound?'Sound on':'Sound off';$('#sound').setAttribute('aria-label',sound?'Disable sound':'Enable sound');$('#sound').setAttribute('aria-pressed',String(sound));tone(520,.18)};$('#help').onclick=()=>{stopWalking();$('#guide').showModal()};$('.brand').onclick=e=>{e.preventDefault();$('#help').click()};$('#start').onclick=()=>$('#guide').close();document.querySelectorAll('.close').forEach(b=>b.onclick=()=>b.closest('dialog').close());$('#keep').onclick=()=>$('#discovery').close();$('#new-game').onclick=$('#reset').onclick=()=>{stopWalking();$('#confirm').showModal()};$('#cancel-reset').onclick=()=>$('#confirm').close();$('#confirm-reset').onclick=()=>{brakes=false;unstableTime=0;celebrationUntil=0;confetti=[];findLabel=null;found.clear();holes=treasures.map(t=>({x:t.x,hits:0,id:t.id,level:t.level}));cargo=[];spills=0;catchCount=0;quietTime=0;completedLevels.clear();celebratedAreas.clear();nextCargo=1;level=0;pendingPortal=null;entering=null;returnX=1133;pip={x:330,face:1,target:null,pokeX:null,jab:0};cart={x:155,v:0};bean={x:83,state:'follow',item:null,toss:0};action=null;particles=[];spillDistance=0;camera=0;sniff=0;save();updateUI(true);$('#confirm').close();$('#note-label').textContent='A NOTE FROM THE EXPEDITION';$('#note-title').textContent='Please keep all wings inside the vehicle.';$('#note-text').textContent='Tap the sand to set off. Poke a promising mound until its treasure comes free. Your assistant will do the heavy lifting.';clearTimeout(speechTimer);$('#speech').textContent='';$('#speech').style.opacity='0'};
function ellipse(x,y,rx,ry,fill,rot=0){ctx.beginPath();ctx.ellipse(x,y,rx,ry,rot,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill()}
function path(points,fill,stroke,width=1){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));if(fill){ctx.closePath();ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function line(x,y,x2,y2,color,width){path([[x,y],[x2,y2]],null,color,width)}
function imageItem(c,size=58){const im=images[treasures[c.tid].shape];if(!im?.complete||!im.naturalWidth)return;ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.angle||0);ctx.drawImage(im,-size/2,-size/2,size,size);ctx.restore()}
function palm(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);path([[0,0],[10,-115],[17,-116],[9,0]],'#9b7848');for(let j=0;j<5;j++){let a=-Math.PI+j*.66;ctx.save();ctx.translate(13,-113);ctx.rotate(a);ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(25,-23,75,9);ctx.quadraticCurveTo(25,-6,0,0);ctx.fillStyle=j%2?'#6e8963':'#82936a';ctx.fill();ctx.restore()}ctx.restore()}
function background(){if(level>=12){laterScene();return}if(level>=8){jungleScene();return}if(level>=4){greekScene();return}if(level===2){oasisScene();return}if(level===1||level===3){interior();return}const sky=ctx.createLinearGradient(0,0,0,GROUND);sky.addColorStop(0,'#efdab4');sky.addColorStop(.65,'#edc58a');sky.addColorStop(1,'#e5b779');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);ellipse(858-camera*.035,109,48,48,'#fff0b9');ellipse(858-camera*.035,109,64,64,'#fff1c523');

ctx.beginPath();ctx.moveTo(0,315);for(let x=0;x<=W+40;x+=20)ctx.lineTo(x,305+Math.sin((x+camera*.25)/270)*40+Math.sin(x/470)*19);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fillStyle='#e5bc80';ctx.fill();
ctx.beginPath();ctx.moveTo(0,385);for(let x=0;x<=W+40;x+=20)ctx.lineTo(x,380+Math.sin((x+camera*.48)/220)*32);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fillStyle='#d9aa68';ctx.fill();
for(let i=0;i<8;i++){const x=160+i*760-camera*.54;if(x>-100&&x<W+100)palm(x,383,.45+(i%2)*.17)}
ctx.fillStyle='#e4bc7c';ctx.fillRect(0,GROUND-7,W,H-GROUND+7);line(0,GROUND-7,W,GROUND-7,'#f8dca1',3);for(let i=0;i<90;i++){const x=((i*139-camera*.94)%(W+30)+W+30)%(W+30),y=GROUND+18+(i*41)%155;line(x,y,x+8+(i%4)*4,y,'#cba26850',1)}
// A cool oasis waits at the eastern end of the route.
const oasis=5150-camera;if(oasis<W+200&&oasis>-200){ellipse(oasis,GROUND-9,150,20,'#8fa99a');ellipse(oasis+4,GROUND-14,113,10,'#b6c4a1');palm(oasis-110,GROUND-10,1.45);palm(oasis+150,GROUND-7,1.1)}
}
function kiwi(x,y,scale=1,face=1,baby=false,moving=false,jab=0){ctx.save();ctx.translate(x,y);ctx.scale(face*scale,scale);const probing=!baby&&!!action,wallPeck=probing&&!!treasures[action.h.id]?.wall;const bounce=moving&&!probing&&!reduced?Math.sin(time*(pendingPortal||walkingSpeed()>135?29:18))*2.5:Math.sin(time*2)*.6;ctx.translate(0,bounce);ellipse(-4,2,34,7,'#80613a25');const step=moving&&!probing?Math.sin(time*(pendingPortal||walkingSpeed()>135?29:18))*7:0;line(-15,-13,-17+step,0,'#ba7d38',4);line(9,-13,12-step,0,'#ba7d38',4);line(-17+step,0,-25+step,1,'#ba7d38',3);line(12-step,0,21-step,1,'#ba7d38',3);ctx.translate(jab*8,-32+jab*(wallPeck?0:4));ellipse(-8,-2,35,30,baby?'#b28e58':'#987547',-.14);ellipse(-13,-8,27,23,baby?'#c5a36b':'#b18a52',-.2);ellipse(-22,-1,13,20,'#a27c48',-.3);for(let i=0;i<12;i++){let xx=-31+(i%4)*10,yy=-15+Math.floor(i/4)*11;line(xx,yy,xx-3,yy+5,'#d4ad705a',1.3)}ctx.save();ctx.translate(12,-15);ctx.rotate(jab*(wallPeck?-.85:.30));ctx.translate(-12,15);ellipse(20,-19,21,20,baby?'#cfb078':'#b9935e');ellipse(28,-20,5.4,5.4,'#ecd49c');ellipse(29,-21,3.4,3.4,'#3f3c2d');ellipse(30,-22,1,1,'#fff4d0');path([[35,-13],[66,19],[37,-5]],baby?'#d8ad70':'#d2a367','#ae824b',.8);line(36,-12,64,16,'#e7c58d',1);line(40,-6,66,19,'#b4894b',1);if(!baby){path([[0,-10],[15,-3],[33,-7],[29,5],[20,18],[5,4]],'#b95340','#8e4034',1);
path([[6,-3],[19,12],[28,1]],null,'#edc9a0',1.2);
line(9,-6,29,-3,'#d87a5c',1.4);
path([[1,-4],[-15,-8],[-10,2],[-17,8],[0,4]],'#c9684c','#8e4034',1);
path([[0,1],[-6,17],[5,12],[7,3]],'#b95340','#8e4034',1);
ellipse(1,0,4.5,3.5,'#d27a59');
for(const [dx,dy]of [[12,0],[20,4],[24,-1]])path([[dx,dy-1.5],[dx+1.5,dy],[dx,dy+1.5],[dx-1.5,dy]],'#f3d9b0');ellipse(15,-37,30,6,'#dfcda1',-.06);path([[-3,-38],[0,-54],[25,-56],[34,-39]],'#cdb987');path([[-2,-42],[33,-44],[35,-38],[-3,-36]],'#7e8b70')}else{path([[7,-38],[1,-50],[12,-45],[20,-51],[24,-39]],'#c5a36b');path([[1,-11],[8,-1],[28,1],[31,-5]],'#60918b')}ctx.restore();ctx.restore()}
// Rope cross-sections follow each illustration in its native 120-unit coordinates.
const ropeFits={
 scarab:[31,89,67,6],chicken:[40,78,79,5],jar:[28,93,78,5],
 sandal:[29,84,66,3],gnome:[34,86,90,4],horus:[34,90,84,4],
 toaster:[15,105,76,3],scroll:[30,89,62,2],flamingo:[14,88,80,7],
 coffin:[31,89,68,4],pyramid:[29,92,70,2],plunger:[36,83,79,4],
 anubis:[37,72,78,3],disco:[20,100,66,9],mask:[22,99,74,4]
};
Object.assign(ropeFits,{"mat": [17, 103, 64, 2], "slipper": [17, 107, 78, 5], "moonTile": [23, 97, 74, 2], "ibis": [29, 85, 77, 5], "clock": [25, 95, 82, 2], "key": [53, 81, 73, 2], "duck": [22, 92, 85, 5], "dates": [24, 98, 72, 3], "float": [14, 106, 76, 6], "fan": [28, 95, 63, 4], "fish": [23, 86, 66, 5], "mirror": [30, 89, 54, 6], "seal": [27, 93, 83, 3], "lamp": [34, 86, 53, 3], "bell": [28, 94, 78, 4], "chariot": [24, 70, 63, 2], "crown": [30, 92, 78, 3], "egg": [30, 88, 77, 6]});
for(const f of [...greekFinds,...jungleFinds,...laterFinds])ropeFits[f.shape]=[22,98,77,4];
function ropeFit(c){const [left,right,y,curve]=ropeFits[treasures[c.tid].shape];return {left,right,y,curve,scale:(treasures[c.tid].shape==='coffin'?70:58)/120}}
function ropeKnot(c){const f=ropeFit(c),x=(f.right-64)*f.scale,y=(f.y-60)*f.scale,a=c.angle||0;return {x:c.x+x*Math.cos(a)-y*Math.sin(a),y:c.y+x*Math.sin(a)+y*Math.cos(a)}}
function drawLashing(c,progress){
 const f=ropeFit(c),slack=(1-progress)*5,bell=['bell','oracleBells','greatBell'].includes(treasures[c.tid].shape);
 ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.angle||0);ctx.scale(f.scale,f.scale);ctx.translate(-60,-60);ctx.lineCap='round';ctx.lineJoin='round';
 ctx.beginPath();ctx.moveTo(f.left-slack,f.y);ctx.bezierCurveTo(f.left+5,f.y+f.curve+slack,f.right-5,f.y+f.curve+slack,f.right+slack,f.y);
 ctx.strokeStyle=bell?'#554737':'#765536';ctx.lineWidth=bell?6:3.3;ctx.stroke();ctx.strokeStyle=bell?'#f3dfb6':'#dfbd83';ctx.lineWidth=bell?3.5:1.8;ctx.stroke();
 if(bell){
  // Two longitudinal straps loop over the crown and beneath the flared rim.
  ctx.beginPath();
  ctx.moveTo(45-slack,94);ctx.bezierCurveTo(49-slack,70,46-slack,36,54,26);ctx.quadraticCurveTo(60,20-slack,66,26);ctx.bezierCurveTo(74+slack,36,71+slack,70,76+slack,94);
  ctx.strokeStyle='#554737';ctx.lineWidth=6;ctx.stroke();ctx.strokeStyle='#f3dfb6';ctx.lineWidth=3.5;ctx.stroke();
 }

 if(progress>.65){
  ctx.globalAlpha=Math.min(1,(progress-.65)/.35);ctx.translate(f.right-4,f.y);if(bell)ctx.scale(1.45,1.45);
  ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(-6,-7,-8,2,0,0);ctx.bezierCurveTo(5,-6,7,3,0,0);
  ctx.moveTo(0,0);ctx.quadraticCurveTo(-1,5,-4,7);ctx.moveTo(1,0);ctx.quadraticCurveTo(4,4,3,7);
  ctx.strokeStyle='#775839';ctx.lineWidth=3;ctx.stroke();ctx.strokeStyle='#e5c999';ctx.lineWidth=1.6;ctx.stroke();ellipse(0,0,2,1.6,'#b99159');
 }
 ctx.restore();
}
function stairPose(delay=0){
 const progress=Math.max(0,Math.min(1,(entering.elapsed-.45-delay)/.75));
 const steps=progress*5,stepIndex=Math.floor(steps),phase=steps-stepIndex;
 const landing=Math.min(1,phase/.7),ease=landing*landing*(3-2*landing);
 const drop=(stepIndex+ease)*22*entering.direction;
 return {x:pip.x+(reduced?0:Math.sin(steps*Math.PI)*1.5),y:GROUND-4+drop,foot:progress>0&&progress<1?Math.sin(steps*Math.PI*2)*4:0};
}
function towHitch(){
 if(entering&&!entering.lift&&entering.elapsed>=.3){const pose=stairPose();return {x:pose.x,y:pose.y-44*1.08}}
 const bob=pip.moving&&!action&&!reduced?Math.sin(time*(pendingPortal||walkingSpeed()>135?29:18))*2.5:Math.sin(time*2)*.6;
 const lift=treasures[action?.h.id]?.wall?0:4;
 return {x:pip.x+pip.face*(-39+pip.jab*8*1.08),y:GROUND-48+(bob+pip.jab*lift)*1.08};
}
function clipStairOpening(){ctx.beginPath();ctx.rect((pendingPortal?.x??pip.x)-38,GROUND-104,76,100);ctx.clip()}
function drawTowRope(){
 const hitch=towHitch(),onStairs=entering&&!entering.lift&&entering.elapsed>=.3;
 ctx.save();
 if(onStairs)clipStairOpening();
 line(hitch.x,hitch.y,onStairs?cart.x:cart.x+pip.face*54,GROUND-36,'#9b7746',2);
 ctx.restore();
}
function drawStairTravel(){
 const pose=stairPose(),foot=pose.foot;
 ctx.save();clipStairOpening();
 // Fixed stone treads disappear into the dark opening; Pip walks down them.
 
 ctx.save();ctx.translate(pose.x,pose.y);ctx.scale(1.08,1.08);
 // Rear view: rounded feathers, the back of his scarf and hat, no visible beak.
 line(-13,-12,-15,foot,'#ba7d38',4);line(13,-12,15,-foot,'#ba7d38',4);
 line(-15,foot,-23,foot+1,'#ba7d38',3);line(15,-foot,23,1-foot,'#ba7d38',3);
 ellipse(0,-33,33,31,'#987547');ellipse(-5,-36,26,26,'#b18a52');
 for(let i=0;i<15;i++){const x=-22+(i%5)*10,y=-46+Math.floor(i/5)*12;line(x,y,x-2,y+6,'#cba16b',1.4)}
 ellipse(0,-54,20,19,'#b9935e');
 path([[-18,-46],[0,-42],[17,-46],[15,-38],[-15,-38]],'#b95340','#8e4034',1);
line(-13,-42,12,-42,'#edc9a0',1);
path([[0,-40],[-13,-32],[-7,-29],[-10,-21],[2,-35]],'#c9684c','#8e4034',1);
path([[1,-40],[14,-31],[8,-28],[11,-20],[-1,-35]],'#b95340','#8e4034',1);
ellipse(0,-38,4.5,3.5,'#d27a59');
ellipse(-7,-31,1,1,'#f3d9b0');ellipse(7,-30,1,1,'#f3d9b0');
 ellipse(0,-69,29,6,'#dfcda1');path([[-19,-70],[-16,-86],[12,-87],[20,-70]],'#cdb987');path([[-18,-75],[18,-75],[20,-70],[-19,-70]],'#7e8b70');
 ctx.restore();
 // The tow line lies over Pip's back, so his body cannot hide its moving end.
 drawTowRope();
 const hitch=towHitch();ellipse(hitch.x,hitch.y,2.8,2,'#d9b779');
 ctx.restore();
}
function drawFindLabel(){
 if(!findLabel||findLabel.area!==level||time>=findLabel.until)return;
 const f=treasures[findLabel.id],remaining=findLabel.until-time;
 ctx.save();ctx.font='17px Georgia';
 const subtitle=f.rarity+(f.count>1?' · '+f.count+' pieces':'');
 const nameWidth=ctx.measureText(f.name).width;ctx.font='10px sans-serif';
 const width=Math.max(180,nameWidth+32,ctx.measureText(subtitle).width+32);
 const x=Math.max(camera+width/2+14,Math.min(camera+W-width/2-14,findLabel.x));
 const y=GROUND-185;
 ctx.globalAlpha=Math.min(1,remaining/.65,(4.5-remaining)/.15);
 ctx.fillStyle='#fff1d9';ctx.strokeStyle='#bd9865';ctx.lineWidth=1;
 ctx.beginPath();ctx.roundRect(x-width/2,y,width,57,7);ctx.fill();ctx.stroke();
 path([[x-5,y+57],[x,y+63],[x+5,y+57]],'#fff1d9');
 ctx.textAlign='center';ctx.fillStyle='#604a32';ctx.font='17px Georgia';ctx.fillText(f.name,x,y+23);
 ctx.fillStyle='#927349';ctx.font='10px sans-serif';ctx.fillText(subtitle,x,y+42);
 ctx.restore();
}
const alcoveScentVisible=h=>!!treasures[h.id]?.wall&&!found.has(h.id)&&h.hits<digsNeeded(h)&&sniffReveals(h);
function drawWallAlcove(h){
 const x=h.x,y=findY(h),greek=level>=4,remaining=h.hits<digsNeeded(h);
 const stone=greek?'#b4b7a1':'#94866a',edge=greek?'#d8d5ba':'#c5b18b';
 ctx.save();ctx.translate(x,y);
 // An arched recess with thick stone jambs and a shaded inner reveal.
 ctx.beginPath();ctx.moveTo(-32,25);ctx.lineTo(-32,-8);
 ctx.bezierCurveTo(-32,-42,32,-42,32,-8);ctx.lineTo(32,25);ctx.closePath();
 ctx.fillStyle=stone;ctx.fill();
 ctx.beginPath();ctx.moveTo(-24,19);ctx.lineTo(-24,-7);
 ctx.bezierCurveTo(-24,-31,24,-31,24,-7);ctx.lineTo(24,19);ctx.closePath();
 ctx.fillStyle=greek?'#3d514f':'#243b38';ctx.fill();
 line(-30,21,-30,-7,edge,2);line(27,-6,27,22,'#5b6254',3);
 path([[-31,24],[32,24],[36,29],[-35,29]],stone);
 line(-31,24,32,24,edge,2);
 if(remaining){
  imageItem({tid:h.id,x:0,y:-1,angle:0},37);
  // A half-height blocking stone chips down with each peck.
  const chipped=h.hits/digsNeeded(h),top=-2+chipped*11;
  path([[-30,25],[-29,top+5],[-19,top],[0,top+2],[13,top-1],[29,top+4],[32,25]],stone,'#686854',1.5);
  path([[-28,top+5],[-19,top],[0,top+2],[13,top-1],[28,top+4]],null,edge,2);
  for(let i=0;i<h.hits;i++){const cx=-18+i*11;path([[cx,top+3],[cx+3,top+10],[cx-2,22]],null,'#666854',1.3)}
 }else{
  path([[-30,25],[-24,18],[-15,25]],stone);
  path([[17,25],[24,20],[31,25]],stone);
 }
 if(alcoveScentVisible(h)){
  const glow=ctx.createRadialGradient(0,-6,4,0,-6,47);
  glow.addColorStop(0,'#ffe4a15c');glow.addColorStop(.65,'#ffe4a12b');glow.addColorStop(1,'#ffe4a100');
  ctx.fillStyle=glow;ctx.fillRect(-47,-53,94,94);
  ctx.beginPath();ctx.moveTo(-32,25);ctx.lineTo(-32,-8);ctx.bezierCurveTo(-32,-42,32,-42,32,-8);ctx.lineTo(32,25);
  ctx.strokeStyle='#ffe8ae99';ctx.lineWidth=2;ctx.stroke();
 }
 ctx.restore();
}
function render(){const dpr=Math.min(window.devicePixelRatio||1,2);if(canvas.width!==Math.round(canvas.clientWidth*dpr)||canvas.height!==Math.round(canvas.clientHeight*dpr)){canvas.width=Math.round(canvas.clientWidth*dpr);canvas.height=Math.round(canvas.clientHeight*dpr)}ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);background();ctx.save();ctx.translate(-camera,0);
drawDoors();drawBoundaries();
// Footprints and subtle terrain clues make the desert an actual traversable place.
for(let x=230;x<pip.x-80;x+=46){if(x<camera||x>camera+W)continue;ellipse(x,GROUND+8,4,1.5,'#b38e5844');ellipse(x+15,GROUND+14,4,1.5,'#b38e5844')}
holes.filter(h=>h.level===level).forEach(original=>{
 const h=original;
 if(h.x<camera-70||h.x>camera+W+70||!surfaceVisible(original))return;
 if(treasures[h.id]?.wall){
  drawWallAlcove(h);
  return;
 }
 if(h.hits){
  if(h.id>=0&&h.hits<digsNeeded(h)){ctx.save();ctx.globalAlpha=.35+h.hits/digsNeeded(h)*.45;imageItem({tid:h.id,x:original.x,y:GROUND-12,angle:Math.sin(h.hits*2)*.08},30+h.hits*4);ctx.restore()}
  ellipse(h.x,GROUND,32,9,level>=15?'#768980':level>=12?'#a58d6b':level>=8?'#627551':'#a17a45');ellipse(h.x,GROUND-1,24,6,level>=15?'#566c66':level>=12?'#776951':level>=8?'#435d43':'#795c35');
  ellipse(h.x-27,GROUND-6,13,5,level>=15?'#b3bea4':level>=12?'#d0bb95':level>=8?'#a3ad7b':'#dfba7c');ellipse(h.x+25,GROUND-5,11,5,level>=15?'#b3bea4':level>=12?'#d0bb95':level>=8?'#a3ad7b':'#dfba7c');
 }else{
  const style=Math.abs(h.id)%3,inside=level===1||level===3||level>=5;
  if(style===0){
   // A low, wind-shaped rise rather than a target marker.
   ctx.beginPath();ctx.moveTo(h.x-34,GROUND-6);
   ctx.bezierCurveTo(h.x-16,GROUND-8,h.x-14,GROUND-20,h.x+6,GROUND-15);
   ctx.bezierCurveTo(h.x+20,GROUND-12,h.x+22,GROUND-6,h.x+37,GROUND-5);
   ctx.closePath();ctx.fillStyle=level>=15?'#b0b99f':level>=12?'#c3b08c':level>=8?'#8e9b6d':inside?'#918060':'#e9c58b';ctx.fill();
  }else if(style===1){
   ellipse(h.x-9,GROUND-6,21,5,inside?'#8d7c5b':'#dfb77a');
   ellipse(h.x+12,GROUND-9,9,5,inside?'#9b8c70':'#c6a574',-.2);
   ellipse(h.x-13,GROUND-8,5,3,inside?'#afa083':'#d1b281',.3);
  }else{
   path([[h.x-25,GROUND-4],[h.x-7,GROUND-8],[h.x+3,GROUND-4],[h.x+20,GROUND-9]],null,inside?'#655c46':'#bb965e',1.4);
   path([[h.x-7,GROUND-8],[h.x-3,GROUND-14],[h.x+9,GROUND-16]],null,inside?'#655c46':'#bb965e',1);
   ellipse(h.x+26,GROUND-6,4,2,inside?'#ad9870':'#d1ad76');
  }
 }
 if(level>=8&&level<12)drawJungleRoots(h);
 // Sniffing briefly warms the sand itself; no circles, symbols, or labels.
 if(h.hits<digsNeeded(h)&&h.id>=0&&sniffReveals(original)){
  // The scent belongs to the buried find, not the latest beak impact.
  const hint=ctx.createRadialGradient(original.x,GROUND-8,1,original.x,GROUND-8,32);
  hint.addColorStop(0,'#fff3bf66');hint.addColorStop(1,'#fff3bf00');
  ctx.fillStyle=hint;ctx.fillRect(original.x-32,GROUND-40,64,64);
 }
});
// Pip goes behind the cart as it rolls across the doorway at ground level.
ctx.save();if(entering?.lift){ctx.translate(0,liftOffset());drawLiftPlatform(pendingPortal.x);kiwi(pip.x,GROUND-4,1.08,pip.face,false,!!pip.moving,0)}
if(entering&&!entering.lift){if(entering.elapsed>=.3)drawStairTravel();else kiwi(pip.x,GROUND-4,1.08,pip.face,false,!!pip.moving,pip.jab)}
ctx.save();
// Tow rope and wooden cart, with turning wheels and a genuinely stacked load.
if(!entering||entering.lift||entering.elapsed<.3)drawTowRope();const bounce=!entering&&Math.abs(cart.v)>15&&!reduced?Math.sin(time*19)*1.7:0;ctx.save();ctx.translate(cart.x,GROUND+bounce);ellipse(0,1,65,8,'#99733e25');for(const wx of[-37,37]){ellipse(wx,-10,18,18,'#8f6c40');ellipse(wx,-10,12,12,'#ccab6b');ctx.save();ctx.translate(wx,-10);ctx.rotate(-cart.x/18);for(let j=0;j<6;j++){ctx.rotate(Math.PI/3);line(0,0,12,0,'#88683f',2)}ctx.restore();ellipse(wx,-10,4,4,'#775a35')}path([[-57,-52],[57,-52],[50,-21],[-50,-21]],'#bb874e','#896338',3);line(-52,-38,52,-38,'#e1b371',2);line(-34,-51,-31,-23,'#98713f',3);line(33,-51,31,-23,'#98713f',3);ctx.fillStyle='#f2d39c';ctx.font='9px Georgia';ctx.textAlign='center';ctx.fillText('K. A. S.',0,-28);ctx.restore();
if(level>=8&&level<12)drawCartLeafUmbrella();
// Wheel chocks and a lowered lever make Bean's emergency brake visible.
if(brakes){
 for(const side of [-1,1])path([[cart.x+side*54,GROUND+3],[cart.x+side*40,GROUND+3],[cart.x+side*49,GROUND-9]],'#8b633d','#ceab71',1);
 line(cart.x-53,GROUND-42,cart.x-71,GROUND-28,'#735439',4);ellipse(cart.x-72,GROUND-27,4,3,'#aa684b');
}
orderedPile().forEach(c=>imageItem(c,treasures[c.tid].shape==='coffin'?70:58));currentCargo().filter(c=>c.status==='ground'||c.status==='fall').forEach(c=>{ellipse(c.x,GROUND+2,18,3,'#a7814722');imageItem(c,50)});
// Soft jute slings hug the finds instead of boxing them in.
for(const c of orderedPile())if(c.secured||c.id===bean.packItem&&bean.state==='pack')drawLashing(c,c.secured?1:Math.min(1,(bean.packTime||0)/packDuration()));
// A little coil on the cart feeds Bean's working rope.
ctx.save();ctx.translate(cart.x-42,GROUND-48);for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(0,-i*2,8-i,3,0,0,Math.PI*2);ctx.strokeStyle='#b99660';ctx.lineWidth=1.7;ctx.stroke()}ctx.restore();
if(bean.state==='pack'){
 const item=cargo.find(c=>c.id===bean.packItem);
 if(item){const p=Math.min(1,(bean.packTime||0)/packDuration()),face=Math.sign(cart.x-bean.x)||1;
  const bx=bean.x+face*39,by=GROUND-29-bean.lift,slack=(1-p)*19;
  ctx.beginPath();const knot=ropeKnot(item);ctx.moveTo(knot.x,knot.y);ctx.quadraticCurveTo((knot.x+bx)/2,(knot.y+by)/2+slack,bx,by);
  ctx.strokeStyle='#775d3b';ctx.lineWidth=2.6;ctx.lineCap='round';ctx.stroke();ctx.strokeStyle='#e1c28d';ctx.lineWidth=1.2;ctx.stroke();
 }
}
// The party popper resembles a wooden corner post with an aged brass collar.
ctx.save();ctx.translate(cart.x+44,GROUND-39+bounce);
ctx.fillStyle='#896338';ctx.fillRect(-6,-21,12,25);
ctx.fillStyle='#bb874e';ctx.fillRect(-4,-20,8,23);
line(-1,-17,-1,-2,'#d4a469',1);
ctx.fillStyle='#a88a55';ctx.fillRect(-6,-21,12,3);ctx.fillRect(-5,-3,10,3);
ellipse(0,-21,4,1.3,'#705437');ellipse(0,1,1,1,'#d0b077');ctx.restore();
ctx.restore();
if(time<celebrationUntil){ctx.fillStyle='#fff0c9';ctx.font='bold 18px Georgia';ctx.textAlign='center';ctx.fillText('Collection complete!',cart.x,GROUND-135-orderedPile().length*10)}
for(const p of confetti){ctx.save();ctx.globalAlpha=Math.min(1,p.life);ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.fillStyle=p.color;ctx.fillRect(-3,-2,6,4);ctx.restore()}
const moving=!!pip.moving;if(!entering)kiwi(pip.x,GROUND-4,1.08,pip.face,false,!!moving,pip.jab);const bf=bean.state==='fetch'?Math.sign((currentCargo().filter(c=>c.status==='ground').sort((a,b)=>Math.abs(a.x-bean.x)-Math.abs(b.x-bean.x))[0]?.x||cart.x)-bean.x)||1:Math.sign(cart.x-bean.x)||1;ctx.save();kiwi(bean.x,GROUND-1-(bean.lift||0)-(time<celebrationUntil&&!reduced?Math.abs(Math.sin((celebrationUntil-time)*7))*12:0),.62,bf,true,!!bean.moving,bean.state==='pack'?(bean.hop?0:bean.settle?.32:.2+.15*Math.sin(time*12)):0);ctx.restore();cargo.filter(c=>c.status==='carry').forEach(c=>imageItem(c,45));
if(pendingPortal?.boundaryExit)drawBoundaries();
particles.forEach(p=>{ctx.globalAlpha=Math.min(1,Math.max(0,p.life/.18));ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);path([[-p.size,-p.size*.4],[p.size*.3,-p.size*.7],[p.size,p.size*.3],[-p.size*.5,p.size*.6]],p.color);ctx.restore()});ctx.globalAlpha=1;drawFindLabel();ctx.restore();ctx.restore();
}
// Follow the onward route, including newly unlocked expeditions on outdoor scenes.
function exitGuide(){
 const routes=exits(),forward=routes.filter(g=>g.to>level);
 const gate=pendingPortal||forward.find(g=>!completedLevels.has(g.to))||forward.find(g=>!sameSite(level,g.to))||(!completedLevels.has(level)&&forward[0])||routes.find(g=>g.lift)||routes[0];
 const margin=Math.min(W/2,76*W/canvas.clientWidth),screenX=gate.x-camera,direction=screenX<margin?'left':screenX>W-margin?'right':'down';
 return {gate,x:Math.max(margin,Math.min(W-margin,screenX)),direction,label:gate.label.replace(/[←→↑↓]/g,'').trim()};
}
let lastExitGuide='';
function updateExitGuide(){
 const hint=exitGuide(),el=$('#exit-guide');
 el.style.left=(hint.x/W*100)+'%';el.hidden=!!entering;
 const key=hint.gate.to+':'+hint.direction;
 if(key!==lastExitGuide){lastExitGuide=key;el.dataset.direction=hint.direction;el.querySelector('span').textContent=hint.label;el.setAttribute('aria-label','Next area: '+hint.label+'. Exit '+(hint.direction==='down'?'below the arrow':hint.direction)+'.');}
}
// A shared freight platform carries the whole expedition, without stair poses.
function startLift(){
 entering={lift:true,elapsed:0,from:pip.x,cartFrom:cart.x,beanFrom:bean.x};
 stopWalking();pip.face=1;bean.lift=0;bean.hop=null;bean.settle=0;bean.packItem=null;bean.state='follow';
}
function liftOffset(){
 const t=Math.max(0,Math.min(1,(entering.elapsed-.8)/1.15)),ease=t*t*(3-2*t);
 return (pendingPortal.down?1:-1)*ease*(H+80);
}
function stepLift(dt){
 entering.elapsed+=dt;
 const t=Math.min(1,entering.elapsed/.75),ease=t*t*(3-2*t),x=pendingPortal.x,oldCart=cart.x;
 pip.x=entering.from+(x+62-entering.from)*ease;cart.x=entering.cartFrom+(x-65-entering.cartFrom)*ease;
 bean.x=entering.beanFrom+(x-135-entering.beanFrom)*ease;pip.moving=bean.moving=t<1;cart.v=0;
 for(const c of currentCargo())if(c.status==='cart')c.x+=cart.x-oldCart;
 camera+=(Math.max(0,Math.min(worldWidth()-W,x-W*.5))-camera)*Math.min(1,dt*5);
 if(entering.elapsed>=2){entering=null;changeLevel()}
}
function drawLiftPlatform(x){
 path([[x-170,GROUND+3],[x+154,GROUND+3],[x+154,GROUND+15],[x-170,GROUND+15]],'#a78050','#705e42',2);
 for(let i=0;i<8;i++)line(x-159+i*42,GROUND+5,x-159+i*42,GROUND+12,'#d0b17a',1);
 line(x-160,GROUND-225,x-160,GROUND+2,'#b5a579',3);line(x+143,GROUND-225,x+143,GROUND+2,'#b5a579',3);
}
function drawLift(gate){
 const x=gate.x,active=entering?.lift&&pendingPortal?.to===gate.to;
 ctx.fillStyle='#31473c55';ctx.fillRect(x-176,GROUND-239,340,239);
 for(const side of [-1,1]){const bx=x+(side<0?-180:165);line(bx,GROUND,bx,GROUND-268,'#8c7955',12);line(bx+2,GROUND-263,bx+2,GROUND-4,'#cfb88a',2)}
 line(x-185,GROUND-267,x+171,GROUND-267,'#9e875b',17);
 for(const dx of [-158,143]){ellipse(x+dx,GROUND-251,12,12,'#ba9c62');ellipse(x+dx,GROUND-251,5,5,'#6a684a')}
 ctx.fillStyle='#ebd8af';ctx.fillRect(x-90,GROUND-296,180,27);ctx.strokeStyle='#a58b5d';ctx.lineWidth=1.5;ctx.strokeRect(x-90,GROUND-296,180,27);
 ctx.fillStyle='#625639';ctx.font='16px Georgia';ctx.textAlign='center';ctx.fillText(gate.label,x,GROUND-278);
 // A little brass call lever, within reach of a long beak.
 line(x+172,GROUND-74,x+193,GROUND-94,'#a48b58',5);ellipse(x+194,GROUND-95,6,6,'#d6b16b');
 if(!active)drawLiftPlatform(x);
}
function frame(timestamp){const dt=Math.min(.04,(timestamp-last)/1000||.016);last=timestamp;step(dt);render();updateExitGuide();requestAnimationFrame(frame)}
function requestPortal(door,signClicked=false){
 if(action||entering)return;
 stopWalking();const choices=exits();
 let gate=typeof door==='object'?door:typeof door==='number'?choices.find(g=>g.x===door):null;
 gate=gate||choices.reduce((a,b)=>Math.abs(a.x-pip.x)<Math.abs(b.x-pip.x)?a:b);
 if(gate.sign&&!signClicked)return;
 brakes=false;unstableTime=0;
 pendingPortal={...gate,target:gate.lift?gate.x+62:gate.boundaryExit?boundaryWaitingPoint(gate):gate.x===210?250:gate.x-67};pip.target=pendingPortal.target;
 $('#note-label').textContent=sameSite(level,gate.to)?(level>=15?'EXPLORING THE HIGHLANDS':level>=12?'EXPLORING THE BATHS':level>=8?'EXPLORING THE RAINFOREST':level>=4?'EXPLORING NAXOS':'EXPLORING THE PYRAMID'):'WAREHOUSE RUN';$('#note-title').textContent=gate.label;
 $('#note-text').textContent=sameSite(level,gate.to)?'Bean will bring the unfinished collection along and keep working in the next room.':'Pip is running for the exit. The whole discovered collection will be handed over to the warehouse.';
}
function changeLevel(){
 const gate=pendingPortal;if(!gate)return;
 checkLevelSuccess();const keepLoad=sameSite(level,gate.to),load=currentCargo(),oldCartX=cart.x,deposited=keepLoad?0:load.length;
 for(const c of load){
  if(!keepLoad){c.status='stored';c.secured=true}
  else if(c.status!=='cart'){c.status='ground';c.secured=false;c.vx=0;c.vy=0}
  c.tip=undefined;
 }
 // A warehouse handoff finishes the departed area's collection without holding Pip at the exit.
 if(!keepLoad)for(const area of areas.keys())if(sameSite(area,level)&&levelReady(area))completedLevels.add(area);
 brakes=false;unstableTime=0;
 if(level===0&&gate.to===1)returnX=gate.x-67;
 level=gate.to;pip.x=gate.spawn;findLabel=null;
 pendingPortal=null;pip.target=null;pip.pokeX=null;pip.face=1;pip.jab=0;action=null;digHeld=false;queuedDig=false;
 cart.x=pip.x-145;cart.v=0;if(keepLoad)for(const [i,c] of load.entries()){if(c.status==='cart')c.x+=cart.x-oldCartX;else{c.x=cart.x+35+(i%4)*18;c.y=GROUND-18}}bean={x:pip.x-215,state:'follow',item:null,toss:0};
 camera=Math.max(0,Math.min(worldWidth()-W,pip.x-W*.59));particles=[];spillDistance=0;quietTime=0;sniff=0;
 $('#note-label').textContent='ARRIVED · '+areas[level].name.toUpperCase();
 $('#note-title').textContent=level>=12?['A bath is several centuries overdue.','Please leave the cart out of the pool.','Central heating. Very decentralised plumbing.','A castle with an excellent view of the wind.','Nobody has wound the lunch clock.','The stars appear to have lost something.'][level-12]:level>=8?['Please keep your biscuits dry.','The rainkeepers have left the tap on.','The tree has reorganised the archive.','At last. Somewhere to keep a lunch box.'][level-8]:level>=4?['Olives. Marble. Something misplaced.','A temple to everything nobody could find.','The oracle was expecting someone rounder.','Egyptian forwarding address. Greek return postage.'][level-4]:level===2?'Shade. Water. Suspicious flotation devices.':level===3?'The largest tomb. The smallest visitors.':keepLoad?'Onward, treasures in tow.':'A fresh cart for a familiar mystery.';
 $('#note-text').textContent=keepLoad?`${load.length} cargo pieces came along. Bean will finish collecting and tying any loose items here. The whole collection travels together until you leave the site.`:`${deposited} cargo pieces delivered safely to the warehouse. The cart is empty; your discoveries remain in the other-area collections below the manifest.`;
 tone(440,.25);save();updateUI(true);
}
function interior(){
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,level===3?'#201d30':'#172f35');g.addColorStop(.7,level===3?'#493d45':'#344340');g.addColorStop(1,'#75654a');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 for(let row=0;row<7;row++)for(let col=-1;col<12;col++){let x=col*135+(row%2)*67-camera*.7%135,y=50+row*56;ctx.strokeStyle='#b3a57518';ctx.lineWidth=2;ctx.strokeRect(x,y,132,53)}
 for(let i=0;i<8;i++){const x=100+i*370-camera;if(x<-120||x>W+120)continue;path([[x-28,GROUND],[x-22,80],[x+23,80],[x+29,GROUND]],'#596052');path([[x-37,78],[x+36,78],[x+30,111],[x-31,111]],'#827c58');line(x-19,129,x+21,129,'#bb9860',6);line(x-20,147,x+22,147,'#498888',9);for(let j=0;j<5;j++){ctx.fillStyle='#b9a16c55';ctx.font='23px Georgia';ctx.textAlign='center';ctx.fillText(['◈','☀','≋','△','⌁'][j],x,200+j*43)}
 const tx=x+93,ty=246;line(tx,ty+13,tx,ty+47,'#99835e',8);const glow=ctx.createRadialGradient(tx,ty,1,tx,ty,112);glow.addColorStop(0,'#f4bb6750');glow.addColorStop(1,'#f4bb6700');ctx.fillStyle=glow;ctx.fillRect(tx-112,ty-112,224,224);ellipse(tx,ty,8,17+Math.sin(time*9+i)*2,'#edb761');ellipse(tx,ty+4,4,10,'#ffe4a0')}
 ctx.fillStyle='#847454';ctx.fillRect(0,GROUND-7,W,H-GROUND+7);line(0,GROUND-7,W,GROUND-7,'#b2a075',3);for(let i=-1;i<12;i++){let x=i*130-camera%130;line(x,GROUND+6,x-30,H,'#564e3b55',2)}line(0,GROUND+73,W,GROUND+73,'#b2a07533',2);
 if(level===3)drawGreatTomb();const altar=2230-camera;if(level===1&&altar>-150&&altar<W+150){path([[altar-95,GROUND-5],[altar-75,GROUND-45],[altar+75,GROUND-45],[altar+95,GROUND-5]],'#b69c64');drawKeeperSarcophagus(altar,GROUND-45)}
}
function drawBoundaryStone(x,y,width,height,shade){
 ctx.save();ctx.translate(x,y);
 // Broad rounded planes use the same flat, warm palette as the dunes.
 ctx.beginPath();ctx.moveTo(-width*.48,0);
 ctx.bezierCurveTo(-width*.57,-height*.18,-width*.47,-height*.77,-width*.23,-height*.94);
 ctx.bezierCurveTo(-width*.08,-height*1.04,width*.21,-height,width*.35,-height*.76);
 ctx.bezierCurveTo(width*.48,-height*.55,width*.57,-height*.14,width*.45,0);
 ctx.closePath();ctx.fillStyle=shade;ctx.fill();ctx.clip();
 path([[width*.1,-height],[width*.23,-height*.57],[width*.16,-height*.12],[width*.5,2],[width*.7,-height*.8]],'#a8855540');
 ctx.beginPath();ctx.moveTo(-width*.42,-height*.51);ctx.quadraticCurveTo(-width*.32,-height*.91,-width*.1,-height*.9);ctx.quadraticCurveTo(width*.06,-height*.91,width*.2,-height*.79);ctx.quadraticCurveTo(-width*.12,-height*.89,-width*.42,-height*.51);ctx.fillStyle='#f1d7a466';ctx.fill();
 ctx.restore();
}
function drawBoundaries(){
 if(level===1||level===3||level>=4)return;
 // The supported piles extend away from the path at both ends.
 for(const [x,side] of [[105,-1],[worldWidth()-45,1]]){
  if(x<camera-190||x>camera+W+190)continue;
  ellipse(x+side*55,GROUND+3,88,7,'#99733e20');
  for(let column=3;column>=0;column--){
   const bx=x+side*column*40;
   drawBoundaryStone(bx,GROUND,58,35,column%2?'#c4a16c':'#cfad77');
   drawBoundaryStone(bx+side*3,GROUND-28,49,32,column%2?'#d4b582':'#c9a875');
   if(column<3)drawBoundaryStone(bx+side*5,GROUND-54,42,29,'#d9bb87');
   if(column<2)drawBoundaryStone(bx+side*7,GROUND-77,34,24,'#dec18f');
  }
  ellipse(x+side*40,GROUND+1,70,3,level===2?'#cdb57e':'#dfb77a');
 }
}
function drawDoors(){for(const gate of exits()){const x=gate.x;if(x<camera-190||x>camera+W+190)continue;
 if(gate.lift){drawLift(gate);continue}
 if(gate.sign){
 const signDrop=gate.signDrop||0;
 line(x-5,GROUND-5,x-5,GROUND-132+signDrop,'#967047',8);
 ctx.save();ctx.translate(0,signDrop);
 const left=gate.label.includes('←');path((left?[[-70,-123],[-54,-143],[69,-143],[69,-103],[-54,-103]]:[[-69,-143],[54,-143],[70,-123],[54,-103],[-69,-103]]).map(([dx,dy])=>[x+dx,GROUND+dy]),'#e8c997','#9c794c',2);
 line(x-59,GROUND-137,x+49,GROUND-137,'#f5ddb2',1);
 ctx.fillStyle='#60472f';ctx.font='20px Georgia';ctx.textAlign='center';ctx.fillText(gate.label,x-3,GROUND-116);
 ctx.restore();continue;
 }
 if(level===0&&gate.to===1){path([[x-173,GROUND-5],[x,GROUND-248],[x+182,GROUND-5]],'#c19a5c','#e5c38a',3);path([[x,GROUND-248],[x+37,GROUND-5],[x+182,GROUND-5]],'#a5804b')}
 const direction=stairDirection(gate),up=direction===-1,dimChamber=level===3&&gate.to===1||level===14&&gate.to===13,starView=level===16&&gate.to===17;
 const view=ctx.createLinearGradient(0,GROUND-104,0,GROUND-5);
 view.addColorStop(0,up?(starView?'#263e60':gate.to===0?'#fff0bd':dimChamber?'#536153':'#d5b06b'):'#15282e');view.addColorStop(1,up?(starView?'#829caa':dimChamber?'#414c43':'#7f775b'):'#354344');
 ctx.fillStyle=direction?view:'#568d7d';ctx.fillRect(x-38,GROUND-104,76,100);
 if(direction){
  if(up){ctx.fillStyle=starView?'#b9cbd0':gate.to===0?'#f9e4a8':dimChamber?'#7b7958':'#efc987';ctx.fillRect(x-18,GROUND-104,36,24)}
  if(up)for(let i=0;i<6;i++){const y=GROUND-9-i*13,w=34-i*3;ctx.fillStyle=i%2?'#a59570':'#897b5e';ctx.fillRect(x-w,y,w*2,7);line(x-w,y,x+w,y,'#d3bb89',1.5)}
 }else{ctx.fillStyle='#e8cf92';ctx.font='23px Georgia';ctx.textAlign='center';ctx.fillText('≈',x,GROUND-53)}
 path([[x-48,GROUND-5],[x-48,GROUND-108],[x+48,GROUND-108],[x+48,GROUND-5]],null,'#c0a36b',9);
 ctx.textAlign='center';ctx.font='10px monospace';ctx.fillStyle=level===1||level===3?'#f8dfab':'#634e30';if(level>=4||level===3&&gate.to===1||level===0&&gate.to===1||level===1&&(gate.to===0||gate.to===3)){
 ctx.fillStyle='#e8c997';ctx.strokeStyle='#9c794c';ctx.lineWidth=1.5;
 const signWidth=level>=4?166:110;ctx.fillRect(x-signWidth/2,GROUND-146,signWidth,27);ctx.strokeRect(x-signWidth/2,GROUND-146,signWidth,27);
 ctx.fillStyle='#60472f';ctx.font='16px Georgia';ctx.fillText(gate.label,x,GROUND-127);
 }else ctx.fillText(gate.label,x,GROUND+28);

 }}
function oasisScene(){
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#b8d6c6');g.addColorStop(.65,'#e9d6aa');g.addColorStop(1,'#b5af7e');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ellipse(850-camera*.05,95,43,43,'#fff0c4');
 for(let i=0;i<5;i++){let x=i*500-camera*.25;path([[x-190,344],[x+80,243],[x+400,344]],'#cfb887')}
 ellipse(W/2,399,W*.64,65,'#59998e');ellipse(W/2,400,W*.49,45,'#71b4a5');
 for(let i=0;i<32;i++){const x=(i*97-camera*.4+Math.sin(time+i)*4)%(W+100);line(x,380+(i*17)%64,x+22,380+(i*17)%64,'#b6d5b06a',1.5)}
 for(let i=0;i<9;i++){const x=i*370-camera*.6;if(x>-120&&x<W+120){palm(x,440,1.1+(i%3)*.25);for(let j=0;j<5;j++)line(x+50+j*5,453,x+48+j*7,397-j%3*9,'#7d955b',2)}}
 ctx.fillStyle='#cdb57e';ctx.fillRect(0,GROUND-7,W,H-GROUND+7);line(0,GROUND-7,W,GROUND-7,'#e9d59c',3);
 for(let i=0;i<70;i++){const x=((i*127-camera)%(W+30)+W+30)%(W+30);ellipse(x,GROUND+15+(i*29)%150,2,1,'#a6915a55')}
}
function drawKeeperSarcophagus(x,y){
 ctx.save();ctx.translate(x,y);
 ellipse(3,3,63,9,'#253b3430');
 // The deep case and inset lid form a complete upright coffin, seated on its plinth.
 path([[-35,-211],[-56,-172],[-58,-130],[-41,-3],[38,-3],[61,-133],[58,-174],[34,-211]],'#90784b','#6f6245',3);
 path([[-35,-217],[-53,-179],[-55,-141],[-38,-10],[33,-10],[50,-141],[49,-181],[31,-217]],'#d0b579','#ead098',3);
 path([[-28,-204],[-43,-174],[-44,-139],[-30,-22],[25,-22],[40,-139],[38,-174],[25,-204]],'#66908a','#aa8b52',3);
 // A rounded kiwi face carved into the head of the lid.
 ellipse(-2,-174,25,32,'#e2c788');
 // Gently closed eyes give the carved face a peaceful, sleepy expression.
 ctx.beginPath();ctx.moveTo(-17,-178);ctx.quadraticCurveTo(-12,-173,-7,-178);
 ctx.moveTo(5,-178);ctx.quadraticCurveTo(10,-173,15,-178);
 ctx.strokeStyle='#84764f';ctx.lineWidth=2;ctx.lineCap='round';ctx.stroke();
 path([[0,-172],[15,-113],[-5,-155]],'#eed89c','#ae925d',1.5);
 for(let i=0;i<3;i++){const yy=-83+i*19,ww=31-i*3;line(-ww,yy,ww-4,yy,'#d9bd83',6)}
 path([[-13,-63],[-2,-72],[9,-63],[-2,-52]],'#567873','#e5ca90',2);
 line(-30,-28,25,-28,'#ecd39a',3);
 ctx.restore();
}
function drawKiwiGuardian(x,face){
 ctx.save();ctx.translate(x,420);ctx.scale(face,1);
 // A rounded stone kiwi on a small plinth, with a downturned foraging beak.
 path([[-48,0],[-42,-15],[40,-15],[47,0]],'#b99e68','#827451',2);
 line(-18,-25,-18,-15,'#9c8659',7);line(14,-25,14,-15,'#9c8659',7);
 ellipse(-6,-60,38,43,'#73928a',-.12);ellipse(-13,-66,27,32,'#92a89a',-.15);
 ellipse(18,-93,24,25,'#92a89a');
 path([[35,-93],[58,-45],[30,-81]],'#d8bd7d','#a28c59',2);
 ellipse(27,-97,6,6,'#d8cda6');ellipse(28,-97,3,3,'#405b55');ellipse(29,-98,1,1,'#f4e3b5');
 path([[-2,-117],[2,-132],[30,-132],[38,-113]],'#c6ac71','#9a8559',2);
 line(1,-118,34,-118,'#658d85',5);
 path([[-3,-77],[11,-70],[26,-75]],null,'#d9bf80',6);
 for(let i=0;i<3;i++)path([[-28+i*13,-68],[-31+i*13,-57],[-26+i*13,-48]],null,'#b3c0a4',2);
 ctx.restore();
}
function drawGreatTomb(){
 const x=2150-camera;if(x<-450||x>W+450)return;
 path([[x-330,GROUND-8],[x-285,GROUND-57],[x+285,GROUND-57],[x+330,GROUND-8]],'#9d835d');
 ctx.fillStyle='#aa8b54';ctx.fillRect(x-235,240,470,175);ctx.strokeStyle='#d4b775';ctx.lineWidth=5;ctx.strokeRect(x-235,240,470,175);
 for(let i=0;i<9;i++){ctx.fillStyle=i%2?'#4e8181':'#d1ac68';ctx.fillRect(x-224+i*51,247,33,155)}
 // A gently raised, bevelled lid makes the burial chest read as solid stone.
 path([[x-247,246],[x-218,214],[x+218,214],[x+247,246],[x+233,258],[x-233,258]],'#cbb078','#e0c68d',2);
 path([[x-218,214],[x+218,214],[x+232,233],[x-232,233]],'#ddc28b');
 line(x-230,257,x+230,257,'#796b49',3);
 for(const offset of [-151,151]){ctx.fillStyle='#bea06a';ctx.fillRect(x+offset-7,263,14,139);line(x+offset-4,266,x+offset-4,398,'#e3c993',2)}
 ctx.drawImage(images.mask,x-60,278,120,120);
 path([[x-80,405],[x+80,405],[x+87,415],[x-87,415]],'#c4a76b');

 for(const offset of[-330,330])drawKiwiGuardian(x+offset,offset<0?1:-1);
}
load();camera=Math.max(0,Math.min(worldWidth()-W,pip.x-W*.59));updateUI(true);requestAnimationFrame(frame);setTimeout(()=>$('#speech').style.opacity=0,6500);
