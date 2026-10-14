import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createKiwiMotion} from '../games/kiwi-clicker/kiwi-motion.js';

test('shared frames never repaint the source kiwi or change its pending pose',()=>{
 const original={document:globalThis.document,Image:globalThis.Image,ResizeObserver:globalThis.ResizeObserver};
 const outputs=[],images=[];
 const context=()=>new Proxy({draws:0,drawImage(){this.draws++;}},{get(target,key){return key in target?target[key]:()=>{};}});
 function canvas(){const ctx=context();return {style:{},width:0,height:0,getContext(type){return type==='webgl'?null:ctx;},ctx};}
 function input(){const c=canvas(),scene={style:{cssText:''},clientWidth:300,clientHeight:200,viewBox:{baseVal:{width:1800,height:1100}},classList:{add(){}},before(){}};c.closest=()=>scene;return c;}
 try{
  globalThis.document={createElement(type){if(type==='canvas'){const c=canvas();outputs.push(c);return c;}return {style:{},append(){}};}};
  globalThis.ResizeObserver=class{observe(){}};
  globalThis.Image=class{constructor(){this.complete=true;this.naturalWidth=1536;images.push(this);}set src(value){this.onload?.();}};
  const intern=createKiwiMotion(input(),{shared:true});
  const flock=createKiwiMotion(input(),{shared:true});
  const displays=outputs.filter(c=>c.className==='motion-output');
  assert.equal(displays.length,2);
  intern(0);
  const idleDraws=displays[0].ctx.draws;
  flock(1);flock(.5);flock(0);
  assert.equal(displays[0].ctx.draws,idleDraws,'flock must not repaint the intern');
  assert.ok(displays[1].ctx.draws>=3,'flock has its own display');
  flock(1);
  images[0].onload();
  assert.equal(displays[0].ctx.draws,idleDraws,'asset reload must retain the intern pose');
  intern(1);
  assert.equal(displays[0].ctx.draws,idleDraws+1);
 }finally{for(const [key,value]of Object.entries(original)){if(value===undefined)delete globalThis[key];else globalThis[key]=value;}}
});
