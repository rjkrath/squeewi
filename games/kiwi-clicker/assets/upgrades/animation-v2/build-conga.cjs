// Connected torso and stable leg-pair poses; native SVG registration only.
const fs=require('fs'),path=require('path');
const sharp=require('/Users/becca/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root=__dirname,dir=path.join(root,'conga');
const img=(name,w,h,transform='')=>`<image href="../sources/${name}.png" width="${w}" height="${h}" transform="${transform}"/>`;
async function out(name,content){
 const s=`<svg xmlns="http://www.w3.org/2000/svg" width="2172" height="724" viewBox="0 0 2172 724"><defs><filter id="edge" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncA type="table" tableValues="0 0 0.55 0.9 1"/></feComponentTransfer></filter></defs><g filter="url(#edge)">${content}</g></svg>`;
 fs.writeFileSync(path.join(dir,name+'.svg'),s);let data=s;
 for(const ref of new Set([...s.matchAll(/href="([^"]+)"/g)].map(m=>m[1])))data=data.replaceAll(`href="${ref}"`,`href="data:image/png;base64,${fs.readFileSync(path.resolve(dir,ref)).toString('base64')}"`);
 await sharp(Buffer.from(data)).png().toFile(path.join(dir,name+'.png'));
}
module.exports=async function build(){
 const torso=img('conga-torso',1827,861,'translate(2.6 124) scale(.47)');
 const a=img('conga-step-right',2172,724,'translate(25 198) scale(.69)');
 const b=img('conga-stance',2171,724,'translate(0 -5)');
 const c=img('conga-step-left',2171,724,'translate(-49 95) scale(.87)');
 await out('torso-connected',torso);
 for(const [name,legs]of [['step-right',a],['stand',b],['step-left',c]]){
  await out('legs-'+name,legs);await out('pose-'+name,legs+torso);
 }
 console.log('Exported three connected conga poses.');
};
if(require.main===module)module.exports().catch(e=>{console.error(e);process.exitCode=1});
