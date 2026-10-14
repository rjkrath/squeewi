let overlay=null,timer=null;
const balloonColors=['coral','gold','green','teal','lavender'];
const colors=['#ed8b79', '#e7bf52', '#92ae80', '#659ca1', '#b09aca'];
export function stopCelebration(){clearTimeout(timer);overlay?.remove();overlay=null;}
export function startCelebration(reduced=false){
 stopCelebration();if(reduced)return;
 overlay=document.createElement('div');overlay.className='screen-celebration';overlay.setAttribute('aria-hidden','true');
 const fragment=document.createDocumentFragment();
 for(let i=0;i<120;i++){
  const piece=document.createElement('img');piece.className='celebration-confetti';piece.alt='';piece.src=new URL(`./assets/celebration/confetti-${balloonColors[i%balloonColors.length]}.svg`,import.meta.url).href;
  piece.style.cssText=`left:${Math.random()*100}%;--drift:${(Math.random()-.5)*240}px;--spin:${(Math.random()-.5)*1440}deg;--delay:${Math.random()*1.3}s;--duration:${3+Math.random()*1.8}s`;
  fragment.append(piece);
 }
 for(let burst=0;burst<5;burst++){
  const x=[22,76,48,30,70][burst],y=[28,36,22,48,24][burst],delay=.35+burst*.65;
  const glow=document.createElement('i');glow.className='celebration-firework-glow';glow.style.cssText=`left:${x}%;top:${y}%;--delay:${delay}s;--spark-color:${colors[burst%colors.length]}`;fragment.append(glow);
  for(let ray=0;ray<20;ray++){
   const spark=document.createElement('img'),angle=ray*Math.PI*2/20,radius=130+Math.random()*70;
   spark.className='celebration-spark';spark.alt='';spark.src=new URL(`./assets/celebration/firework-spark-${balloonColors[burst%balloonColors.length]}.svg`,import.meta.url).href;spark.style.cssText=`left:${x}%;top:${y}%;--x:${Math.cos(angle)*radius}px;--y:${Math.sin(angle)*radius}px;--angle:${angle*180/Math.PI+90}deg;--delay:${delay}s;--spark-color:${colors[burst%colors.length]}`;
   fragment.append(spark);
  }
 }
 for(let i=0;i<8;i++){
  const balloon=document.createElement('img');balloon.className='celebration-balloon';balloon.alt='';balloon.width=256;balloon.height=512;balloon.src=new URL(`./assets/celebration/balloon-${balloonColors[i%balloonColors.length]}.webp`,import.meta.url).href;
  const float=document.createElement('span');float.className='celebration-balloon-float';
  float.style.cssText=`left:${5+i*12}%;--delay:${Math.random()*.8}s;--drift:${(Math.random()-.5)*80}px;--sway:${10+Math.random()*12}px;--tilt:${4+Math.random()*4}deg;--sway-duration:${2.2+Math.random()*1.2}s;--phase:${-Math.random()*3}s`;
  float.append(balloon);fragment.append(float);
 }
 overlay.append(fragment);document.body.append(overlay);timer=setTimeout(stopCelebration,6500);
}
