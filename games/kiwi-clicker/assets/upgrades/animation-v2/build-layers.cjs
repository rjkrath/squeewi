// Native SVG registration and export. Source bitmaps remain unchanged.
const fs = require('fs'), path = require('path');
const sharp = require('/Users/becca/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = __dirname;
const sizes = { 'salad-bar':[1774,887], slide:[1536,1024], trampoline:[1536,1024], seesaw:[1774,887], staircase:[1536,1024], carousel:[1536,1024], conga:[2172,724], common:[1536,1024] };
const dims = { conga:[2172,724], support:[1774,887], board:[1774,887], salad:[1774,887], 'salad-static':[1774,887], 'salad-kiwi':[1774,887] };
const image = (name, transform='') => { const [w,h]=dims[name]||[1536,1024]; return `<image href="../sources/${name}.png" width="${w}" height="${h}" transform="${transform}"/>`; };
const clip = (content,shape,id='cut') => `<defs><clipPath id="${id}">${shape}</clipPath></defs><g clip-path="url(#${id})">${content}</g>`;
const rect = (x,y,w,h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;
const pose = (s, anchor, target, flip=false) => `translate(${target[0]} ${target[1]}) scale(${flip?-s:s} ${s}) translate(${-anchor[0]} ${-anchor[1]})`;
async function out(key,name,content) {
  const [w,h]=sizes[key]; const dir=path.join(root,key); fs.mkdirSync(dir,{recursive:true});
  // Suppress low-opacity matte remnants using a native SVG alpha transfer.
  // RGB is unchanged. Applied once to exported layers, never per animation frame.
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><defs><filter id="edge" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncA type="table" tableValues="0 0 0.55 0.9 1"/></feComponentTransfer></filter></defs><g filter="url(#edge)">${content}</g></svg>`;
  fs.writeFileSync(path.join(dir,name+'.svg'),svg);
  let embedded=svg; for(const ref of new Set([...svg.matchAll(/href="([^"]+)"/g)].map(m=>m[1]))) embedded=embedded.replaceAll(`href="${ref}"`,`href="data:image/png;base64,${fs.readFileSync(path.resolve(dir,ref)).toString('base64')}"`);
  await sharp(Buffer.from(embedded)).png().toFile(path.join(dir,name+'.png'));
}
async function registered(key,name,source,transform='',shape=null) { let art=image(source); if(shape) art=clip(art,shape); if(transform)art=`<g transform="${transform}">${art}</g>`; await out(key,name,art); }
(async()=>{
  await registered('common','housing','housing');
  await registered('common','housing-front','housing','',rect(0,580,1536,444));
  for(const [name,dy] of [['up',0],['down',135]]) {
    const cap=image('cap',`translate(768 ${250+dy}) scale(.75) translate(-768 -250)`);
    await out('common','cap-'+name,cap);
    await out('common','button-'+name,image('housing')+cap+clip(image('housing'),rect(0,580,1536,444)));
  }
  await registered('common','surface','cap','',rect(0,0,1536,505));
  await registered('common','kiwi','kiwi');
  await registered('common','body','kiwi-body'); await registered('common','head','kiwi-head');
  await registered('salad-bar','static','salad-static');
  await registered('slide','background','slide');
  await registered('slide','kiwi','seated',pose(.38,[640,785],[630,365]));
  await registered('trampoline','base','trampoline-base');
  await registered('trampoline','base-front','trampoline-base','',rect(0,778,1536,246));
  const springBoxes=[[488,552,98,185],[716,515,105,106],[953,552,96,186],[613,644,102,135],[826,644,100,138]];
  for(let i=0;i<springBoxes.length;i++) await registered('trampoline','spring-'+i,'springs','',rect(...springBoxes[i]));
  await registered('trampoline','kiwi','kiwi',pose(.43,[540,910],[720,480]));
  await registered('seesaw','support','support');
  await registered('seesaw','support-front','support','',rect(700,555,400,332));
  await registered('seesaw','board','board','rotate(9 887 619)');
  await registered('seesaw','kiwi-left','kiwi',pose(.38,[540,910],[280,388]));
  await registered('seesaw','kiwi-right','kiwi',pose(.38,[540,910],[1494,368],true));
  await registered('staircase','background','staircase');
  const fronts=[[85,471,375,620],[360,562,650,715],[640,650,934,802],[913,740,1206,900],[1190,832,1536,980]].map(([l,y,r,b])=>`<path d="M${l} ${y} Q${(l+r)/2} ${y+105} ${r} ${y} V${b} H${l} Z"/>`).join('');
  await registered('staircase','foreground','staircase','',fronts);
  await registered('staircase','kiwi','kiwi',pose(.26,[540,910],[230,425]));
  await registered('carousel','base','carousel-base');
  await registered('carousel','base-front','carousel-base','',rect(0,718,1536,306));
  await registered('carousel','platform','carousel-base','', '<ellipse cx="1105" cy="620" rx="369" ry="94"/>');
  const carouselPose=pose(.61,[540,910],[315,705]);
  await registered('carousel','body','kiwi-body',carouselPose);
  await registered('carousel','head','kiwi-head',carouselPose);
  await require('./build-conga.cjs')();
  console.log('Exported native registered layers for all seven scenes.');
})();
