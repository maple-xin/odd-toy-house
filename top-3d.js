import * as THREE from './three.module.js';

const button=document.getElementById('top');
const fallback=button.querySelector('.toy-canvas');
const canvas=document.createElement('canvas');canvas.className='toy-canvas top-webgl';canvas.setAttribute('aria-hidden','true');
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
try {
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(1);renderer.setSize(180,230,false);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0x000000,0);
 const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1.6,1.6,2.05,-2.05,.1,20);camera.position.set(0,1.25,6);camera.lookAt(0,.15,0);
 scene.add(new THREE.AmbientLight(0xffffff,2));const key=new THREE.DirectionalLight(0xffffff,2.5);key.position.set(-3,5,5);scene.add(key);
 const pivot=new THREE.Group(),rotor=new THREE.Group();scene.add(pivot);pivot.add(rotor);pivot.position.y=-.1;
 // The profile is the actual silhouette. Every band and the face shares one rotation.
 const profile=[[0,-1.07],[.16,-.91],[.31,-.73],[.56,-.53],[.79,-.34],[.98,-.15],[1.04,.08],[1.01,.29],[.91,.47],[.72,.59],[.47,.68],[.18,.73],[.13,.78],[.13,1.06],[.20,1.11],[.20,1.26],[.13,1.34],[0,1.35]];
 const geom=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),64).toNonIndexed();
 const palette=['#fff1c9','#f12c37','#1551ed'].map(c=>new THREE.Color(c));const positions=geom.getAttribute('position'),colors=new Float32Array(positions.count*3);
 for(let i=0;i<positions.count;i+=3){const y=(Math.min(positions.getY(i),positions.getY(i+1),positions.getY(i+2))+Math.max(positions.getY(i),positions.getY(i+1),positions.getY(i+2)))/2;let m=0;if(y<-.72||y>.77)m=1;else if(y<-.51)m=2;else if(y<-.33)m=1;else if(y>.48&&y<.62)m=1;else if(y>.30&&y<=.48)m=2;for(let j=0;j<3;j++)palette[m].toArray(colors,(i+j)*3)}geom.setAttribute('color',new THREE.BufferAttribute(colors,3));geom.clearGroups();
 const body=new THREE.Mesh(geom,new THREE.MeshLambertMaterial({vertexColors:true}));rotor.add(body);
 const outline=new THREE.Mesh(geom,new THREE.MeshBasicMaterial({color:'#111b32',side:THREE.BackSide}));outline.scale.setScalar(1.035);rotor.add(outline);
 // Extract the face once onto a transparent texture, then wrap it over the curved surface.
 const image=button.querySelector('img');await image.decode();const atlas=document.createElement('canvas');atlas.width=310;atlas.height=160;const ctx=atlas.getContext('2d');ctx.drawImage(image,214,395,310,160,0,0,310,160);const pixels=ctx.getImageData(0,0,310,160);for(let i=0;i<pixels.data.length;i+=4){const r=pixels.data[i],g=pixels.data[i+1],b=pixels.data[i+2];if(!(Math.max(r,g,b)<100||r>g*1.5&&r>b*1.5&&Math.floor(i/4/310)<120))pixels.data[i+3]=0}ctx.putImageData(pixels,0,0);const texture=new THREE.CanvasTexture(atlas);texture.colorSpace=THREE.SRGBColorSpace;texture.magFilter=THREE.NearestFilter;texture.minFilter=THREE.NearestFilter;texture.generateMipmaps=false;
 const faceProfile=[new THREE.Vector2(.965,-.17),new THREE.Vector2(1.057,.08),new THREE.Vector2(1.027,.29)];const face=new THREE.Mesh(new THREE.LatheGeometry(faceProfile,32,-.74,1.48),new THREE.MeshBasicMaterial({map:texture,alphaTest:.5}));rotor.add(face);
 const shadow=new THREE.Mesh(new THREE.CircleGeometry(.78,32),new THREE.MeshBasicMaterial({color:'#092a9c',transparent:true,opacity:.45,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.set(0,-1.21,0);scene.add(shadow);
 button.insertBefore(canvas,fallback);fallback.hidden=true;
 let yaw=0,speed=0,phase=0,hold=null,last=performance.now(),turns=0;
 const render=now=>{const dt=Math.min((now-last)/1000,.035);last=now;if(document.hidden){requestAnimationFrame(render);return}if(hold!==null){yaw=hold;speed=0}else if(!reduce){yaw+=speed*dt;speed*=Math.exp(-.45*dt);if(speed<.04){speed=0;yaw+=Math.atan2(Math.sin(-yaw),Math.cos(-yaw))*Math.min(1,dt*2)}}phase+=dt;rotor.rotation.y=yaw;const tilt=reduce?0:speed>.5?Math.min(.22,.6/(speed+.8)):0;pivot.rotation.x=tilt*Math.cos(phase*5);pivot.rotation.z=tilt*Math.sin(phase*5);renderer.render(scene,camera);turns=Math.abs(yaw)/(Math.PI*2);requestAnimationFrame(render)};
 window.top3D={spin(){hold=null;speed=reduce?0:12},seek(angle){hold=angle},resume(){hold=null},probe(){return{yaw,speed,turns,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,textures:renderer.info.memory.textures,geometries:renderer.info.memory.geometries,webgl:true}}};
 button.dataset.renderer='webgl';requestAnimationFrame(render);
} catch(error) {
 canvas.remove();fallback.hidden=false;button.dataset.renderer='fallback';console.warn('Top 3D unavailable; using static pixel-art fallback.');
}

