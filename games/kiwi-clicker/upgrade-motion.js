import {createRenderer} from './assets/upgrades/animation-v2/renderer.js';
export function startUpgradePreviews(reducedMotion){
 const scenes={union:'slide',inspection:'trampoline',seesaw:'seesaw',staircase:'staircase',carousel:'carousel',conga:'rain-machine'};
 const visible=new Set(),canvases=new Map(),reducedRendered=new Set();
 let renderer=null,loading=null,worker=null,lastFrame=-Infinity,cursor=0;
 function visibleState(){reducedRendered.clear();worker?.postMessage({type:'visible',ids:document.hidden?[]:[...visible],reduced:reducedMotion.matches});}
 function createCanvases(manifest){
  for(const id of Object.keys(scenes)){
   const card=document.getElementById(id+'-scene'),image=card.querySelector('img');
   const canvas=document.createElement('canvas');canvas.className='upgrade-animation';
   canvas.setAttribute('role','img');canvas.setAttribute('aria-label',image.alt);
   const width=768;
   const scene=manifest.scenes[scenes[id]],dimensions=scene.viewport?scene.viewport.slice(2):scene.canvas;
   canvas.width=width;canvas.height=Math.round(width*dimensions[1]/dimensions[0]);image.after(canvas);canvases.set(id,canvas);
  }
 }
 function showCanvases(){for(const id of Object.keys(scenes))document.getElementById(id+'-scene').querySelector('img').hidden=true;}
 async function fallback(manifest){
  worker?.terminate();worker=null;
  for(const [id,old]of canvases){const canvas=old.cloneNode();old.replaceWith(canvas);canvases.set(id,canvas);}
  renderer=await createRenderer(manifest);showCanvases();
 }
 async function prepare(){
  if(loading)return loading;
  loading=(async()=>{
   const response=await fetch(new URL('./assets/upgrades/animation-v2/manifest.json',import.meta.url));
   if(!response.ok)throw new Error('Animation manifest unavailable');
   const manifest=await response.json();createCanvases(manifest);
   if(typeof Worker!=='undefined'&&HTMLCanvasElement.prototype.transferControlToOffscreen){
    try{
     worker=new Worker(new URL('./upgrade-worker.js',import.meta.url),{type:'module'});
     worker.onmessage=({data})=>{if(data.type==='ready'){showCanvases();visibleState();}else if(data.type==='error')fallback(manifest).catch(console.error);};
     worker.onerror=()=>fallback(manifest).catch(console.error);
     const offscreen=Object.fromEntries([...canvases].map(([id,canvas])=>[id,canvas.transferControlToOffscreen()]));
     worker.postMessage({type:'init',manifest,scenes,canvases:offscreen},Object.values(offscreen));visibleState();
    }catch{await fallback(manifest);}
   }else{renderer=await createRenderer(manifest);showCanvases();}
  })().catch(error=>console.warn('Keeping static upgrade artwork:',error));
  return loading;
 }
 const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){const id=entry.target.id.replace('-scene','');
   if(entry.isIntersecting){visible.add(id);prepare();}else visible.delete(id);
  }visibleState();
 });
 for(const id of Object.keys(scenes))observer.observe(document.getElementById(id+'-scene'));
 document.addEventListener('visibilitychange',visibleState);reducedMotion.addEventListener('change',visibleState);
 function frame(now){
  requestAnimationFrame(frame);
  if(!renderer||document.hidden||now-lastFrame<1000/24)return;
  lastFrame=now;
  const ids=[...visible];if(!ids.length)return;
  const id=ids[cursor++%ids.length];if(reducedMotion.matches&&reducedRendered.has(id))return;reducedRendered.add(id);renderer(canvases.get(id),scenes[id],reducedMotion.matches?0:now);
 }
 requestAnimationFrame(frame);
}
