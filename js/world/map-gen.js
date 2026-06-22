"use strict";
/* Génération procédurale de l'île : sols, eau, plages, lacs. */

/* sols : 0-2 herbe · 3 eau · 4 sable */
const ground = [], blocked = [];
for(let y=0;y<MAP;y++){ ground.push(new Array(MAP).fill(3)); blocked.push(new Array(MAP).fill(true)); }
const phA=rnd()*6.28, phB=rnd()*6.28, phC=rnd()*6.28;
function islandR(ang){
  return 0.80 + 0.10*Math.sin(ang*3+phA) + 0.06*Math.sin(ang*5+phB) + 0.04*Math.sin(ang*8+phC);
}
for(let y=0;y<MAP;y++)for(let x=0;x<MAP;x++){
  const dx=(x-MAP/2+0.5)/(MAP/2), dy=(y-MAP/2+0.5)/(MAP/2);
  const d=Math.hypot(dx,dy), ang=Math.atan2(dy,dx);
  const r=islandR(ang);
  if(d>r) continue;
  blocked[y][x]=false;
  if(d>r-0.07){ ground[y][x]=4; }
  else { const g=rnd(); ground[y][x] = g<0.62?0 : g<0.86?1 : 2; }
}
for(let i=0;i<4;i++){
  const lx=MAP*0.25+rnd()*MAP*0.5, ly=MAP*0.25+rnd()*MAP*0.5, lr=1.8+rnd()*2.6;
  if(Math.hypot(lx-MAP/2, ly-MAP/2)<6) continue;
  for(let y=0;y<MAP;y++)for(let x=0;x<MAP;x++){
    if(ground[y][x]>=3) continue;
    if(Math.hypot(x-lx, y-ly) < lr+(rnd()-0.5)*0.8){ ground[y][x]=3; blocked[y][x]=true; }
  }
}

const decor = [];
const spawn = {x:MAP/2+0.5, y:MAP/2+0.5};
