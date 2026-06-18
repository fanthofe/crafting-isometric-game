"use strict";
/* Génération procédurale de l'île : sols, eau, plages, lacs, décor. */

/* ====================== Carte : une grande île ====================== */
/* sols : 0-2 herbe · 3 eau · 4 sable */
const ground = [], blocked = [];
for(let y=0;y<MAP;y++){ ground.push(new Array(MAP).fill(3)); blocked.push(new Array(MAP).fill(true)); }
const phA=rnd()*6.28, phB=rnd()*6.28, phC=rnd()*6.28;
function islandR(ang){            // rayon de la côte, irrégulier selon l'angle
  return 0.80 + 0.10*Math.sin(ang*3+phA) + 0.06*Math.sin(ang*5+phB) + 0.04*Math.sin(ang*8+phC);
}
for(let y=0;y<MAP;y++)for(let x=0;x<MAP;x++){
  const dx=(x-MAP/2+0.5)/(MAP/2), dy=(y-MAP/2+0.5)/(MAP/2);
  const d=Math.hypot(dx,dy), ang=Math.atan2(dy,dx);
  const r=islandR(ang);
  if(d>r) continue;                                        // océan
  blocked[y][x]=false;
  if(d>r-0.07){ ground[y][x]=4; }                          // plage de sable
  else { const g=rnd(); ground[y][x] = g<0.62?0 : g<0.86?1 : 2; }
}
// quelques lacs intérieurs
for(let i=0;i<4;i++){
  const lx=MAP*0.25+rnd()*MAP*0.5, ly=MAP*0.25+rnd()*MAP*0.5, lr=1.8+rnd()*2.6;
  if(Math.hypot(lx-MAP/2, ly-MAP/2)<6) continue;           // pas sur le camp de départ
  for(let y=0;y<MAP;y++)for(let x=0;x<MAP;x++){
    if(ground[y][x]>=3) continue;
    if(Math.hypot(x-lx, y-ly) < lr+(rnd()-0.5)*0.8){ ground[y][x]=3; blocked[y][x]=true; }
  }
}

const decor = [];
const spawn = {x:MAP/2+0.5, y:MAP/2+0.5};
function freeSpot(minDistSpawn){
  for(let tries=0;tries<200;tries++){
    const x = 1+Math.floor(rnd()*(MAP-2)), y = 1+Math.floor(rnd()*(MAP-2));
    if(blocked[y][x] || ground[y][x]>=3) continue;          // ni eau ni sable
    if(Math.hypot(x+0.5-spawn.x, y+0.5-spawn.y) < minDistSpawn) continue;
    if(decor.some(d=>d.tx===x && d.ty===y)) continue;
    return {x,y};
  }
  return null;
}
for(let i=0;i<150;i++){ const s=freeSpot(3.5); if(s){ decor.push({type:"tree", tx:s.x, ty:s.y, v:Math.floor(rnd()*7), alive:true, hp:3, regrow:0, shake:0}); blocked[s.y][s.x]=true; } }
for(let i=0;i<60;i++){ const s=freeSpot(2.5); if(s){ decor.push({type:"rock", tx:s.x, ty:s.y, v:Math.floor(rnd()*2), alive:true, hp:2, regrow:0, shake:0}); blocked[s.y][s.x]=true; } }
// arbres fruitiers : 5 de chaque sorte (pommier / prunier / cerisier / poirier / oranger / pêcher)
for(let k=0;k<6;k++)for(let i=0;i<5;i++){
  const s=freeSpot(3);
  if(s){ decor.push({type:"fruittree", tx:s.x, ty:s.y, kind:k, fruits:3, regrowF:0, shake:0}); blocked[s.y][s.x]=true; }
}
const FLOWER_COLORS = ["#e85f6a","#f4c542","#bfe3ff","#c77ddb"];
for(let i=0;i<300;i++){ const s=freeSpot(0); if(s) decor.push({type:"flower", tx:s.x, ty:s.y, c:FLOWER_COLORS[Math.floor(rnd()*4)], ph:rnd()*6.28, ox:(rnd()-0.5)*14, oy:(rnd()-0.5)*5}); }
for(let i=0;i<420;i++){ const s=freeSpot(0); if(s) decor.push({type:"tuft", tx:s.x, ty:s.y, ph:rnd()*6.28, ox:(rnd()-0.5)*16, oy:(rnd()-0.5)*6}); }

