import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {commands} from './renderer.js';
const require=createRequire(import.meta.url);
const sharp=require('/Users/becca/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=path.dirname(fileURLToPath(import.meta.url)),manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json')));
const phases={slide:[0.08,.12,.32,.50,.70,.84,.94],trampoline:[0,.25,.50,.62,.74,.87],seesaw:[0,.125,.25,.50,.625,.75],staircase:[.02,.08,.24,.40,.56,.72,.87],carousel:[0,.08,.112,.142,.172,.20],conga:[0,.2,.42,.6,.78,.95],'salad-bar':[0]};
for(const [key,m]of Object.entries(manifest.scenes)){
 const dir=path.join(root,key,'states');fs.mkdirSync(dir,{recursive:true});const list=[];
 for(const phase of phases[key]){
  const state=commands(key,phase*m.durationMs,manifest),[w,h]=m.canvas;
  const contents=state.nodes.filter(n=>n.alpha>0).map(n=>{
   const file=path.join(root,n.file),ref=path.relative(dir,file);
   return `<image href="${ref}" transform="matrix(${n.matrix.join(' ')})" opacity="${n.alpha}"/>`;
  }).join('');
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${contents}</svg>`;
  let embedded=svg;for(const ref of new Set([...svg.matchAll(/href="([^"]+)"/g)].map(m=>m[1])))embedded=embedded.replaceAll(`href="${ref}"`,`href="data:image/png;base64,${fs.readFileSync(path.resolve(dir,ref)).toString('base64')}"`);
  const name='phase-'+String(Math.round(phase*1000)).padStart(3,'0');
  fs.writeFileSync(path.join(dir,name+'.svg'),svg);
  await sharp(Buffer.from(embedded)).png().toFile(path.join(dir,name+'.png'));
  list.push({phase,file:name+'.png'});
 }
 fs.writeFileSync(path.join(dir,'index.json'),JSON.stringify({canvas:m.canvas,durationMs:m.durationMs,frames:list,note:'Stable inspection states from the same layered renderer. Use continuous renderer paths for playback, not sparse frame swapping.'},null,2));
}
console.log('Exported stable inspection states.');
