// The deck view stays in ship coordinates so the tiny crew remains visible while sailing.
export function drawDeck(canvas,s,{time,net,moving,storm,capacity}){
 const c=canvas.getContext('2d'),r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);
 if(canvas.width!==Math.round(r.width*d)||canvas.height!==Math.round(r.height*d)){canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);}
 c.setTransform(d,0,0,d,0,0);const w=r.width,h=r.height;
 const sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,storm?'#24384f':'#86b7b9');sky.addColorStop(.48,storm?'#486777':'#c1d4bf');sky.addColorStop(.49,'#326e7e');sky.addColorStop(1,'#174c64');c.fillStyle=sky;c.fillRect(0,0,w,h);
 const oval=(x,y,rx,ry,color)=>{c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();};
 oval(w*.83,46,22,22,storm?'#738594':'#f5df9e');
 for(let i=0;i<34;i++){const x=((i*83-time*(moving?35:8))% (w+100)+w+100)%(w+100)-50,y=128+(i*37)%140;c.strokeStyle='#b5e0d033';c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(x+18,y-3,x+35,y);c.stroke();}
 c.save();const zoom=Math.min(w/760,1.2);c.translate(w*.5,h*.58+Math.sin(time*1.4)*(storm?4:1.8));c.scale(zoom,zoom);
 // Hull, raised bow, rails, bridge and a long open working deck.
 oval(0,68,350,15,'#092d3c66');c.fillStyle='#173c47';c.beginPath();c.moveTo(-335,20);c.lineTo(320,20);c.lineTo(295,68);c.quadraticCurveTo(-150,86,-310,62);c.closePath();c.fill();
 c.fillStyle='#b24f35';c.fillRect(-297,53,590,9);c.fillStyle='#e8d9aa';c.beginPath();c.moveTo(-335,20);c.lineTo(-305,-8);c.lineTo(285,-8);c.lineTo(325,20);c.closePath();c.fill();
 c.strokeStyle='#eee5c5';c.lineWidth=2;for(let x=-312;x<300;x+=22){c.beginPath();c.moveTo(x,15);c.lineTo(x,-11);c.stroke();}c.beginPath();c.moveTo(-320,-11);c.lineTo(302,-11);c.stroke();
 c.fillStyle='#f1ead1';c.fillRect(185,-60,90,74);c.fillRect(204,-94,70,34);c.fillStyle='#2f6b7b';for(let x=211;x<273;x+=19)c.fillRect(x,-86,13,18);c.fillStyle='#b55c40';c.fillRect(195,-99,84,5);c.fillStyle='#213f4b';c.fillRect(169,-83,16,75);
 for(let i=0;i<3;i++)oval(177-time*7%24-i*16,-95-i*11,9+i*4,5+i*3,'#e0e1d744');
 c.fillStyle='#234652';c.font='bold 14px Trebuchet MS';c.fillText('LITTLE FEATHER',100,45);c.fillStyle='#eec675';for(let x=-270;x<260;x+=80)oval(x,40,5,5,'#eec675');
 // Hold grows visibly with each refit. Fish crates fill as cargo comes aboard.
 const boxes=3+Math.min(s.owned.hold,5);for(let i=0;i<boxes;i++){const x=-45+i*27;c.fillStyle='#748b70';c.fillRect(x,-21,23,34);c.strokeStyle='#b8c2a0';c.strokeRect(x,-21,23,34);if(s.cargo/capacity>(i/boxes)){for(let j=0;j<3;j++)oval(x+5+j*6,-18,4,2,'#e2d8b5');}}
 // Working cranes pull a mesh net out of the sea as the haul progresses.
 const p=net?net.elapsed/net.duration:0;for(let i=0;i<2+Math.min(2,s.owned.nets);i++){const x=-245+i*64;c.strokeStyle='#ddae56';c.lineWidth=6;c.beginPath();c.moveTo(x,8);c.lineTo(x,-66);c.lineTo(x-35,-88+Math.sin(time*2)*2);c.stroke();c.lineWidth=1;c.strokeStyle='#e8d4a1';c.beginPath();c.moveTo(x-35,-88);c.lineTo(x-35,net?42-p*85:0);c.stroke();}
 if(net){const nx=-235,ny=63-p*76;c.fillStyle='#c7cfb266';c.beginPath();c.moveTo(nx-75,ny-22);c.lineTo(nx+75,ny-22);c.quadraticCurveTo(nx+58,ny+28,nx,ny+34);c.quadraticCurveTo(nx-58,ny+28,nx-75,ny-22);c.fill();c.strokeStyle='#d5d3ad';c.lineWidth=1;for(let i=-60;i<=60;i+=15){c.beginPath();c.moveTo(nx+i,ny-22);c.lineTo(nx+i*.6,ny+25);c.stroke();}for(let i=0;i<3;i++){c.beginPath();c.moveTo(nx-62+i*8,ny+i*10);c.lineTo(nx+62-i*8,ny+i*10);c.stroke();}if(p>.4)for(let i=0;i<10;i++)oval(nx-45+(i*31)%90,ny+(i*7)%22,7,3,net.boost?'#f4cd74':'#d3e5d8');}
 function bird(x,y,captain=false){c.strokeStyle='#e3b867';c.lineWidth=2;c.beginPath();c.moveTo(x-3,y+3);c.lineTo(x-5,y+8);c.moveTo(x+3,y+3);c.lineTo(x+5,y+8);c.stroke();oval(x,y-5,9,10,'#9b7854');oval(x+6,y-11,6,6,'#b99a6a');c.strokeStyle='#f0d596';c.beginPath();c.moveTo(x+10,y-11);c.lineTo(x+23,y-7);c.stroke();oval(x+8,y-13,1.4,1.4,'#172d30');if(captain){c.fillStyle='#193b50';c.fillRect(x+1,y-19,12,4);c.fillStyle='#f3d074';c.fillRect(x+6,y-19,3,2);}else{c.fillStyle='#dfad4f';c.fillRect(x+1,y-18,11,3);}}
 const crew=Math.min(15,3+s.owned.nets*2);for(let i=0;i<crew;i++){const base=-276+i*29,x=base+(net?Math.sin(time*3+i)*5:Math.sin(time*.8+i)*15);bird(x,8+Math.sin(time*5+i)*(net?2:1));}bird(243,-58,true);
 if(s.order===3){c.strokeStyle='#d9ceaa';c.beginPath();c.moveTo(286,-10);c.lineTo(286,-105);c.stroke();c.fillStyle='#f1be56';c.beginPath();c.moveTo(286,-105);c.lineTo(319,-99);c.lineTo(286,-87);c.fill();}
 c.restore();if(storm){c.strokeStyle='#d4e3e366';for(let i=0;i<45;i++){const x=(i*79+time*150)%w,y=(i*47+time*220)%h;c.beginPath();c.moveTo(x,y);c.lineTo(x-8,y+17);c.stroke();}}
}
