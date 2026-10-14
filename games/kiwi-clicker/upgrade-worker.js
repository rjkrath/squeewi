import {createRenderer} from './assets/upgrades/animation-v2/renderer.js';
let render=null,canvases={},scenes={},active=[],reduced=false;
self.onmessage=async({data})=>{
 if(data.type==='init'){
  try{
   canvases=data.canvases;scenes=data.scenes;
   render=await createRenderer(data.manifest,new URL('./assets/upgrades/animation-v2/',import.meta.url));
   for(const [id,canvas]of Object.entries(canvases))render(canvas,scenes[id],0);
   self.postMessage({type:'ready'});
  }catch(error){self.postMessage({type:'error',message:error.message});}
 }else if(data.type==='visible'){
  active=data.ids;reduced=data.reduced;
  if(render&&reduced)for(const id of active)render(canvases[id],scenes[id],0);
 }
};
// Painting upgrades cannot block input or the main kiwi's animation callbacks.
setInterval(()=>{
 if(!render||reduced)return;
 const now=performance.now();
 for(const id of active)render(canvases[id],scenes[id],now);
},1000/24);
