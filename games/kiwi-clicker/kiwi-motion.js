// Deform one continuous illustration: no rotating cutout or visible neck seam.
export function createKiwiMotion(canvas) {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true });
  if (!gl) return null;
  const shader = (type, source) => {
    const item = gl.createShader(type); gl.shaderSource(item, source); gl.compileShader(item);
    if (!gl.getShaderParameter(item, gl.COMPILE_STATUS)) return null;
    return item;
  };
  const vertex = shader(gl.VERTEX_SHADER, `
    attribute vec2 position; varying vec2 uv; uniform float dip;
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
      gl_Position=vec4(bent.x/768.0-1.0,1.0-bent.y/512.0,0.0,1.0);
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
  if (!vertex || !fragment) return null;
  const program = gl.createProgram(); gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  const vertices = [], columns = 64, rows = 48;
  for(let y=0;y<rows;y++) for(let x=0;x<columns;x++) {
    const x0=x*1536/columns,x1=(x+1)*1536/columns,y0=y*1024/rows,y1=(y+1)*1024/rows;
    vertices.push(x0,y0,x1,y0,x0,y1,x0,y1,x1,y0,x1,y1);
  }
  const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'position'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const dip=gl.getUniformLocation(program,'dip'),polish=gl.getUniformLocation(program,'polish');
  let polished=false;
  const texture=gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D,texture);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
  let ready=false,current=0;
  function draw(amount){current=amount;if(!ready)return;gl.viewport(0,0,1536,1024);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(dip,amount);gl.uniform1f(polish,polished?1:0);gl.drawArrays(gl.TRIANGLES,0,vertices.length/2);}
  const image=new Image(); image.onload=()=>{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);ready=true;canvas.closest('svg').classList.add('motion-ready');draw(current);};
  image.src=new URL('./assets/kiwi-idle.png',import.meta.url).href;
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();ready=false;canvas.closest('svg').classList.remove('motion-ready');});
  draw.setPolish=value=>{if(polished===value)return;polished=value;draw(current);};
  return draw;
}
