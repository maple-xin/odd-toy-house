'use strict';
// Animate the existing pixel artwork in parts; the DOM buttons own input and accessibility.
window.toyMotion=(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const images={},surfaces={},state={stretch:0,velocity:0,held:false,charge:0,dispense:0,omega:0,angle:0,blink:1,time:0,frame:0};let handle;
 const names=['monster','gacha','top'];
 names.forEach(name=>{const button=document.getElementById(name),img=button.querySelector('img'),canvas=document.createElement('canvas');canvas.width=360;canvas.height=460;canvas.setAttribute('aria-hidden','true');canvas.className='toy-canvas';button.insertBefore(canvas,img);images[name]=img;surfaces[name]=canvas.getContext('2d');img.classList.add('sprite-source')});
 const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
 function part(c,img,sx,sy,sw,sh,dx,dy,dw,dh){c.drawImage(img,sx,sy,sw,sh,Math.round(dx),Math.round(dy),dw,dh)}
 function head(c,img,x,y,angle){c.save();c.translate(x,y);c.rotate(angle);part(c,img,165,0,340,330,-85,-95,170,165);c.restore()}
 function drawMonster(c,t){const im=images.monster;if(!im.complete||!im.naturalWidth)return;c.clearRect(0,0,360,460);c.imageSmoothingEnabled=false;const idle=reduce?0:Math.sin(t*2.4)*8,stretch=state.stretch+idle;const hy=155+stretch,feet=385;c.fillStyle='#092a9c';c.globalAlpha=.45;c.fillRect(84,405,190,12);c.globalAlpha=1;
  // Shoes stay planted while the head, independent arms, and spring respond.
  part(c,im,105,530,475,155,60,feet-38,240,78);
  const bottom=feet-34,top=hy+59,height=bottom-top;c.lineJoin='miter';c.lineCap='square';c.beginPath();for(let j=0;j<=10;j++){const x=180+(j%2?-38:38);const yy=top+height*j/10;if(!j)c.moveTo(x,yy);else c.lineTo(x,yy)}c.strokeStyle='#111b32';c.lineWidth=13;c.stroke();c.strokeStyle='#adb7c7';c.lineWidth=8;c.stroke();c.strokeStyle='#fff6df';c.lineWidth=2;c.stroke();
  const wave=reduce?0:Math.sin(t*3.1)*.12;c.save();c.translate(119,hy+82);c.rotate(-.15-wave-state.velocity*.0005);part(c,im,35,225,235,180,-106,-45,120,92);c.restore();c.save();c.translate(238,hy+73);c.rotate(.15+wave+state.velocity*.0005);part(c,im,425,190,220,185,-3,-53,112,94);c.restore();head(c,im,180,hy,clamp(state.velocity*.0003,-.15,.15));
  if(!reduce&&t%4.5>4.36){c.fillStyle='#111b32';c.fillRect(117,hy-61,52,8);c.fillRect(190,hy-63,48,8)}
 }
 const balls=Array.from({length:6},(_,i)=>({x:145+i%3*30,y:125+Math.floor(i/3)*40,vx:(i%2?1:-1)*22,vy:0}));
 function capsule(c,x,y,r,spin=0){const im=images.gacha;c.save();c.translate(Math.round(x),Math.round(y));c.rotate(spin);c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.clip();part(c,im,303,182,107,107,-r,-r,r*2,r*2);c.restore()}
 function drawGacha(c,dt,t){const im=images.gacha;if(!im.complete||!im.naturalWidth)return;c.clearRect(0,0,360,460);c.imageSmoothingEnabled=false;part(c,im,140,0,400,740,55,25,250,400);
  // The transparent bowl contains six independently simulated capsules.
  c.save();c.beginPath();c.ellipse(180,160,103,86,0,0,Math.PI*2);c.clip();c.fillStyle='#2467d8';c.fillRect(74,73,215,180);for(let i=0;i<balls.length;i++){const b=balls[i];if(!reduce){b.vy+=180*dt;if(state.charge>0){b.vx+=Math.sin(t*11+i)*650*dt;b.vy-=Math.cos(t*8+i)*420*dt}b.x+=b.vx*dt;b.y+=b.vy*dt;const rx=(b.x-180)/77,ry=(b.y-160)/62;if(rx*rx+ry*ry>1){const a=Math.atan2(ry,rx);b.x=180+Math.cos(a)*76;b.y=160+Math.sin(a)*61;b.vx=-b.vx*.75;b.vy=-Math.abs(b.vy)*.75}b.vx*=Math.exp(-.6*dt)}capsule(c,b.x,b.y,23,(t*.2+i)*(state.charge>0?4:1))}c.fillStyle='#ffffff65';c.fillRect(98,105,9,45);c.fillRect(111,90,23,8);c.restore();
  // Rotate the actual handle around a stationary pivot.
  c.fillStyle='#1952d5';c.fillRect(117,263,151,95);c.fillStyle='#111b32';c.fillRect(138,268,88,87);c.fillStyle='#99a2b0';c.fillRect(146,277,72,70);
  if(!handle){handle=document.createElement('canvas');handle.width=165;handle.height=99;const h=handle.getContext('2d');h.drawImage(im,310,437,165,99,0,0,165,99);const data=h.getImageData(0,0,165,99);for(let i=0;i<data.data.length;i+=4){const r=data.data[i],g=data.data[i+1],b=data.data[i+2];if(!(r>b*1.3&&r>g*1.1))data.data[i+3]=0}h.putImageData(data,0,0)}
  c.save();c.translate(180,311);c.rotate(state.charge*2.7);c.shadowColor='#111b32';c.shadowBlur=0;c.shadowOffsetX=3;c.shadowOffsetY=3;c.drawImage(handle,-8,-28,103,60);c.restore();
  if(state.dispense>0){const p=clamp((2.5-state.dispense)/1.1,0,1);capsule(c,180+p*60,365+Math.sin(p*Math.PI/2)*56-Math.abs(Math.sin(p*Math.PI*3))*20,25,p*8);if(p>.8){c.font='bold 15px Arial';c.fillStyle='#fff6df';c.fillText('惊喜出炉！',137,451)}}
 }
 function drawTop(c){const im=images.top;if(!im.complete||!im.naturalWidth)return;c.clearRect(0,0,360,460);c.imageSmoothingEnabled=false;part(c,im,0,0,im.naturalWidth,im.naturalHeight,35,75,290,330)}
 let last=performance.now();function render(now){const dt=Math.min((now-last)/1000,.032);last=now;state.time=reduce?0:now/1000;state.frame++;if(!state.held&&!reduce){state.velocity+=(-120*state.stretch-8.5*state.velocity)*dt;state.stretch+=state.velocity*dt;if(Math.abs(state.stretch)<.1&&Math.abs(state.velocity)<.5){state.stretch=0;state.velocity=0}}state.charge=Math.max(0,state.charge-dt);state.dispense=Math.max(0,state.dispense-dt);state.angle+=state.omega*dt;state.omega*=Math.exp(-.33*dt);if(state.omega<.15)state.omega=0;drawMonster(surfaces.monster,state.time);drawGacha(surfaces.gacha,dt,state.time);drawTop(surfaces.top,state.time);requestAnimationFrame(render)}requestAnimationFrame(render);
 return {drag(value){state.held=true;state.stretch=clamp(value,-80,95)},release(){state.held=false;state.velocity=reduce?0:-state.stretch*3;if(reduce)state.stretch=0},bounce(){state.held=false;state.stretch=reduce?0:60;state.velocity=reduce?0:-520},gacha(){if(reduce)return;state.charge=2.6;setTimeout(()=>{state.dispense=2.5},1000)},spin(){window.top3D?.spin();state.omega=0;state.angle=0},probe:()=>({...state,balls:balls.map(b=>({...b}))})};
})();



