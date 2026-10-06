import {readFile,mkdir,rm,cp,access} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
const root=resolve(import.meta.dirname,'..'),out=resolve(root,'dist');
const games=JSON.parse(await readFile(resolve(root,'games.json'),'utf8'));
const seen=new Set();
for(const g of games){if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(g.slug)||seen.has(g.slug))throw Error('Invalid or duplicate game slug');seen.add(g.slug);const source=resolve(root,g.source);if(!source.startsWith(root+sep)||source.startsWith(out+sep))throw Error('Game source must be inside project');await access(resolve(source,'index.html'));}
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});await cp(resolve(root,'site'),out,{recursive:true});
for(const g of games)await cp(resolve(root,g.source),resolve(out,'play',g.slug),{recursive:true});
console.log(`Built arcade and ${games.length} game(s) into dist/`);
