// Deform one continuous illustration: no rotating cutout or visible neck seam.
let flockMotion=null;
function presentation(canvas){
 const scene=canvas.closest('svg'),viewport=document.createElement('span'),output=document.createElement('canvas');
 viewport.className='kiwi-motion-viewport';viewport.style.cssText=scene.style.cssText;scene.style.cssText='';
 scene.before(viewport);viewport.append(output,scene);
 output.className='motion-output';output.width=canvas.width;output.height=canvas.height;
 const align=()=>{
  const width=scene.clientWidth,height=scene.clientHeight,box=scene.viewBox.baseVal,scale=Math.min(width/box.width,height/box.height);
  output.style.width=(1536*scale)+'px';output.style.left=((width-box.width*scale)/2)+'px';output.style.top=((height-box.height*scale)/2)+'px';
 };
 new ResizeObserver(align).observe(scene);align();
 scene.classList.add('raster-presentation');
 const ctx=output.getContext('2d');let last=null;
 return image=>{if(!image||image===last)return;last=image;ctx.clearRect(0,0,output.width,output.height);ctx.drawImage(image,0,0,output.width,output.height);scene.classList.add('motion-ready');};
}

// A cached software mesh keeps pecking available when WebGL is disabled/lost.
function createSoftwareMotion(canvas,display=null){
 const scene=canvas.closest('svg'),show=display||presentation(canvas);
 const surface=document.createElement('canvas');surface.width=768;surface.height=600;
 const ctx=surface.getContext('2d'),cache=new Map(),image=new Image(),goldImage=new Image();
 let current=0,golden=false,polished=false;
 const smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
 function draw(amount,present=true){
  amount=Math.round(amount*32)/32;if(present)current=amount;
  if(!image.complete||!image.naturalWidth)return;
  const art=golden&&goldImage.naturalWidth?goldImage:image,key=`${amount}:${art===goldImage}:${polished}`;
  if(!cache.has(key)){
   ctx.clearRect(0,0,768,600);ctx.save();ctx.scale(.5,.5);
   const bend=(x,y)=>{const w=smooth(760,940,x)*(1-smooth(700,880,y)),a=9*Math.PI/180*amount*w;
    return [900+Math.cos(a)*(x-900)-Math.sin(a)*(y-450),450+Math.sin(a)*(x-900)+Math.cos(a)*(y-450)+20*amount*w];};
   const triangle=(a,b,c)=>{
    const [A,B,C]=[a,b,c].map(([x,y])=>bend(x,y));
    const det=(b[0]-a[0])*(c[1]-a[1])-(c[0]-a[0])*(b[1]-a[1]);
    const ux=((B[0]-A[0])*(c[1]-a[1])-(C[0]-A[0])*(b[1]-a[1]))/det;
    const uy=((B[1]-A[1])*(c[1]-a[1])-(C[1]-A[1])*(b[1]-a[1]))/det;
    const vx=((C[0]-A[0])*(b[0]-a[0])-(B[0]-A[0])*(c[0]-a[0]))/det;
    const vy=((C[1]-A[1])*(b[0]-a[0])-(B[1]-A[1])*(c[0]-a[0]))/det;
    ctx.save();ctx.beginPath();ctx.moveTo(...A);ctx.lineTo(...B);ctx.lineTo(...C);ctx.closePath();ctx.clip();
    ctx.transform(ux,uy,vx,vy,A[0]-ux*a[0]-vx*a[1],A[1]-uy*a[0]-vy*a[1]);ctx.drawImage(art,0,0,1536,1024);ctx.restore();
   };
   if(amount===0)ctx.drawImage(art,0,0,1536,1024);
   else for(let y=0;y<24;y++)for(let x=0;x<32;x++){
    const a=[x*48,y*1024/24],b=[(x+1)*48,y*1024/24],c=[x*48,(y+1)*1024/24],d=[(x+1)*48,(y+1)*1024/24];
    triangle(a,b,c);triangle(c,b,d);
   }
   ctx.restore();const snapshot=document.createElement('canvas');snapshot.width=surface.width;snapshot.height=surface.height;snapshot.getContext('2d').drawImage(surface,0,0);cache.set(key,snapshot);
  }
  if(present)show(cache.get(key));return cache.get(key);
 }
 draw.setGold=value=>{golden=value;if(value&&!goldImage.src)goldImage.src=new URL('./assets/upgrades/gold/idle.png',import.meta.url).href;draw(current);};
 draw.setPolish=value=>{polished=value;draw(current);};draw.setGroundOffset=()=>{};
 image.onload=()=>draw(current);goldImage.onload=()=>draw(current);
 image.src=new URL('./assets/kiwi-idle.png',import.meta.url).href;
 return draw;
}
export function createKiwiMotion(canvas,{shared=false}={}) {
  canvas.width=shared?512:768;canvas.height=canvas.width*1200/1536;
  if(shared&&flockMotion){
    const show=presentation(canvas);
    return amount=>show(flockMotion.frame(amount));
  }
  const rasterPresentation=true,scene=canvas.closest('svg');
  const show=presentation(canvas);
  const fallback=()=>{const draw=createSoftwareMotion(canvas,show);if(shared)flockMotion={frame:amount=>draw(amount,false)};return draw;};
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true, preserveDrawingBuffer: rasterPresentation });
  if (!gl) return fallback();
  const shader = (type, source) => {
    const item = gl.createShader(type); gl.shaderSource(item, source); gl.compileShader(item);
    if (!gl.getShaderParameter(item, gl.COMPILE_STATUS)) return null;
    return item;
  };
  const vertex = shader(gl.VERTEX_SHADER, `
    attribute vec2 position; varying vec2 uv; uniform float dip; uniform float groundOffset;
    void main(){
      uv=position/vec2(1536.0,1024.0);
      // Complete the blend before the face: head and bill move as one rigid unit.
      // Lower legs and toes have zero influence.
      float weight=smoothstep(760.0,940.0,position.x)*(1.0-smoothstep(700.0,880.0,position.y));
      float angle=radians(9.0)*dip*weight;
      vec2 local=position-vec2(900.0,450.0);
      vec2 bent=vec2(cos(angle)*local.x-sin(angle)*local.y,
                     sin(angle)*local.x+cos(angle)*local.y)+vec2(900.0,450.0);
      bent.y+=20.0*dip*weight;
      gl_Position=vec4(bent.x/768.0-1.0,1.0-bent.y/600.0,0.0,1.0);
    }`);
  const fragment = shader(gl.FRAGMENT_SHADER, `precision mediump float; varying vec2 uv; uniform sampler2D artwork; uniform float polish;
    void main(){
      vec4 color=texture2D(artwork,uv);
      vec2 pixel=uv*vec2(1536.0,1024.0);
      // Restrict the finish to the slender bill, preserving its texture and alpha.
      float center=400.0+(pixel.x-1180.0)*0.79;
      float mask=smoothstep(1180.0,1210.0,pixel.x)*(1.0-smoothstep(12.0,24.0,abs(pixel.y-center)));
      color.rgb=mix(color.rgb,vec3(1.0,0.96,0.84)*color.a,polish*mask*0.48);
      gl_FragColor=color;
    }`);
  if (!vertex || !fragment) return fallback();
  const program = gl.createProgram(); gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return fallback();
  gl.useProgram(program);
  const vertices = [], columns = 64, rows = 48;
  for(let y=0;y<rows;y++) for(let x=0;x<columns;x++) {
    const x0=x*1536/columns,x1=(x+1)*1536/columns,y0=y*1024/rows,y1=(y+1)*1024/rows;
    vertices.push(x0,y0,x1,y0,x0,y1,x0,y1,x1,y0,x1,y1);
  }
  const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'position'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const dip=gl.getUniformLocation(program,'dip'),polish=gl.getUniformLocation(program,'polish');
  const groundUniform=gl.getUniformLocation(program,'groundOffset');
  let groundOffset=0,polished=false;
  const texture=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,texture);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
  let ready=false,current=0,golden=false,goldReady=false,software=null;
  const frames=new Map();
  const goldTexture=gl.createTexture();
  let currentFrame=null;
  function draw(amount,present=true){
    amount=Math.round(amount*32)/32;if(present)current=amount;
    if(software){currentFrame=software(amount,false);if(present)show(currentFrame);return currentFrame;}
    if(!ready)return null;
    if(frames.has(amount)){currentFrame=frames.get(amount);if(present)show(currentFrame);return currentFrame;}
    gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(dip,amount);gl.uniform1f(groundUniform,groundOffset);gl.uniform1f(polish,polished&&!golden?1:0);
    gl.bindTexture(gl.TEXTURE_2D,golden&&goldReady?goldTexture:texture);gl.drawArrays(gl.TRIANGLES,0,vertices.length/2);
    const snapshot=document.createElement('canvas');snapshot.width=canvas.width;snapshot.height=canvas.height;
    snapshot.getContext('2d').drawImage(canvas,0,0);frames.set(amount,snapshot);currentFrame=snapshot;if(present)show(snapshot);return snapshot;
  }
  const image=new Image(); image.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);ready=true;canvas.closest('svg').classList.add('motion-ready');draw(current);};
  const goldImage=new Image();goldImage.onload=()=>{
    gl.bindTexture(gl.TEXTURE_2D,goldTexture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,goldImage);goldReady=true;frames.clear();draw(current);
  };
  draw.setGold=value=>{if(golden===value)return;golden=value;frames.clear();software?.setGold(value);if(value&&!goldImage.src)goldImage.src=new URL('./assets/upgrades/gold/idle.png',import.meta.url).href;draw(current);};
  image.src=new URL('./assets/kiwi-idle.png',import.meta.url).href;
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();ready=false;canvas.closest('svg').classList.remove('motion-ready');software=createSoftwareMotion(canvas,show);software.setGold(golden);software.setPolish(polished);software(current);});
  draw.setGroundOffset=value=>{if(groundOffset===value)return;groundOffset=value;draw(current);};
  draw.setPolish=value=>{if(polished===value)return;polished=value;frames.clear();software?.setPolish(value);draw(current);};
  if(shared)flockMotion={frame:amount=>draw(amount,false)};
  return draw;
}
