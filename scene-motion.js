'use strict';
// Event choreography shares the simulation clock, so pause and replay stay coherent.
window.createSceneMotion=ctx=>{
 const ink='#111b32',cream='#fff6df',yellow='#ffcf36',red='#f12c37',blue='#1551ed';
 let flights=[],rings=[],confetti=[],lastLaunch=-10,lastRecover=-10;
 const box=(x,y,w,h,c)=>{ctx.fillStyle=ink;ctx.fillRect(x,y,w,h);ctx.fillStyle=c;ctx.fillRect(x+3,y+3,w-6,h-6)};
 const star=(x,y,r,c,a=0)=>{ctx.save();ctx.translate(x,y);ctx.rotate(a);ctx.fillStyle=c;ctx.fillRect(-r,-3,r*2,6);ctx.fillRect(-3,-r,6,r*2);ctx.fillRect(-r*.5,-r*.5,r,r);ctx.restore()};
 function emit(kind,time,x,y,object){if(kind==='launch')lastLaunch=time;if(kind==='recover'){lastRecover=time;flights.push({...object,x,y,start:time});}rings.push({kind,x,y,start:time});if(kind==='win')for(let i=0;i<70;i++)confetti.push({x:(i*157)%1100,y:-30-(i%9)*35,vx:Math.sin(i*2)*40,vy:80+(i%7)*13,color:[yellow,cream,red][i%3],a:i});}
 function background(s){const {W,H,time:t,phase,chaos,reduce,left}=s,active=phase!=='idle',floor=H-110,clock=reduce?0:t;
  // Hanging bulbs answer the machine and collector; their cables stay quiet.
  ctx.strokeStyle='#082d9c';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(60,123);ctx.quadraticCurveTo(W/2,205,W-60,123);ctx.stroke();
  for(let i=0;i<7;i++){const x=70+(W-140)*i/6,y=126+Math.sin(i/6*Math.PI)*34,on=active&&((Math.floor(clock*4)+i)%7===0||t-lastRecover<.6);ctx.save();ctx.translate(x,y);ctx.rotate(reduce?0:Math.sin(clock*2+i)*.07);ctx.fillStyle=ink;ctx.fillRect(-6,0,12,12);box(-12,9,24,28,on?yellow:'#3c75f6');if(on){ctx.fillStyle='#ffcf3628';ctx.fillRect(-20,5,40,40)}ctx.restore()}
  // Two little residents peek from wall apertures, never across the play path.
  for(let i=0;i<2;i++){const x=W*(i?.80:.29),y=205,h=reduce?24:Math.max(0,Math.sin(clock*.9+i*2))*25;box(x-36,y,72,51,'#0c3fc9');if(h>3){ctx.fillStyle=i?red:yellow;ctx.fillRect(x-27,y+43-h,54,h);ctx.fillStyle=cream;ctx.fillRect(x-18,y+44-h,12,12);ctx.fillRect(x+6,y+44-h,12,12);ctx.fillStyle=ink;const look=Math.sin(clock*1.2)*3;ctx.fillRect(x-14+look,y+47-h,5,7);ctx.fillRect(x+10+look,y+47-h,5,7)}ctx.fillStyle='#3c75f6';ctx.fillRect(x-39,y+49,78,6)}
  // An exposed wind-up clock turns gears at different speeds.
  const cx=W*.53,cy=128;ctx.save();ctx.translate(cx,cy);ctx.rotate(clock*(active?1.8:.35));for(let i=0;i<8;i++){ctx.save();ctx.rotate(i*Math.PI/4);ctx.fillStyle=cream;ctx.fillRect(-5,-29,10,14);ctx.restore()}ctx.fillStyle=ink;ctx.beginPath();ctx.arc(0,0,23,0,Math.PI*2);ctx.fill();ctx.fillStyle=yellow;ctx.beginPath();ctx.arc(0,0,18,0,Math.PI*2);ctx.fill();ctx.fillStyle=ink;ctx.fillRect(-2,-15,4,17);ctx.fillRect(0,-2,12,4);ctx.restore();
  // The little train runs along its own floor track rather than through the toys.
  ctx.fillStyle='#142651';ctx.fillRect(0,H-27,W,4);for(let x=0;x<W;x+=30)ctx.fillRect(x,H-34,4,18);
  const tx=reduce?W*.12:((clock*(active?90:35))%(W+170))-130,ty=H-56;
  ctx.save();ctx.translate(tx,ty);for(let i=0;i<3;i++){const x=-i*47,bob=reduce?0:Math.sin(clock*10+i)*2;box(x-20,-24+bob,40,27,i?cream:red);ctx.fillStyle=i?red:yellow;ctx.fillRect(x-12,-17+bob,12,11);for(const wheel of[-12,12]){ctx.save();ctx.translate(x+wheel,7);ctx.rotate(clock*5);box(-7,-7,14,14,ink);ctx.fillStyle=cream;ctx.fillRect(-5,-2,10,4);ctx.restore()}}ctx.fillStyle=ink;ctx.fillRect(-8,-37,10,16);if(!reduce)for(let i=0;i<3;i++){ctx.globalAlpha=.5-i*.12;ctx.fillStyle=cream;const q=(clock*1.8+i*.3)%1;ctx.fillRect(-5-q*24,-43-q*28,8+q*7,8+q*7)}ctx.restore();
  if(active&&left<10&&phase!=='result'){ctx.fillStyle=Math.floor(clock*4)%2?red:yellow;ctx.fillRect(4,100,10,20);ctx.fillRect(W-14,100,10,20)}
 }
 function foreground(s,drawCapsule){const {W,H,time:t,reduce,ending}=s;
  flights=flights.filter(o=>t-o.start<.5);if(!reduce)for(const o of flights){const p=Math.min(1,(t-o.start)/.5),e=1-(1-p)**3;ctx.save();ctx.translate(o.x+(W-90-o.x)*e,o.y+(H-110-55-o.y)*e-25*Math.sin(p*Math.PI));ctx.scale(1-p*.9,1-p*.9);ctx.globalAlpha=1-p*.7;drawCapsule({...o,x:0,y:0,a:o.a+p*5,held:false,trail:null});ctx.restore()}
  rings=rings.filter(o=>t-o.start<.8);if(!reduce)for(const o of rings){const p=(t-o.start)/.8;ctx.save();ctx.globalAlpha=(1-p)*.75;ctx.strokeStyle=o.kind==='catch'?cream:yellow;ctx.lineWidth=3;ctx.strokeRect(o.x-12-p*35,o.y-12-p*35,24+p*70,24+p*70);for(let i=0;i<4;i++)star(o.x+Math.cos(i*Math.PI/2)*p*70,o.y+Math.sin(i*Math.PI/2)*p*70,5,yellow,p);ctx.restore()}
  if(ending==='rescue'&&!reduce)for(const c of confetti){const age=t-s.endTime;if(age>8)continue;const x=(c.x/1100*W+c.vx*age+W)%W,y=c.y+c.vy*age;ctx.save();ctx.translate(x,y);ctx.rotate(c.a+age*3);ctx.fillStyle=c.color;ctx.fillRect(-4,-8,8,16);ctx.restore()}
 }
 return{emit,background,foreground,reset(){flights=[];rings=[];confetti=[];lastLaunch=lastRecover=-10},launchPulse(t){return Math.max(0,1-(t-lastLaunch)/.22)},recoverPulse(t){return Math.max(0,1-(t-lastRecover)/.35)},probe(){return{flights:flights.length,rings:rings.length,confetti:confetti.length}}};
};
