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

// Zone océanique par tuile : 0=non-eau/lac, 1=lagon, 2=récif, 3=haute_mer
const waterZone = [];
for(let y=0;y<MAP;y++) waterZone.push(new Array(MAP).fill(0));
{
  const LAGON_W = 6, RECIF_W_BASE = 7;
  for(let y=0;y<MAP;y++) for(let x=0;x<MAP;x++){
    if(ground[y][x] !== 3) continue;
    const dx2=(x-MAP/2+0.5)/(MAP/2), dy2=(y-MAP/2+0.5)/(MAP/2);
    const dist = Math.hypot(dx2,dy2);
    const ang  = Math.atan2(dy2,dx2);
    const r    = islandR(ang);
    const distToShore = (dist - r) * (MAP/2);
    if(distToShore <= 0) continue; // lac intérieur
    const reefW = RECIF_W_BASE * (0.65 + 0.35 * Math.abs(Math.sin(ang*2.5 + phA)));
    if(distToShore <= LAGON_W)         waterZone[y][x] = 1;
    else if(distToShore <= LAGON_W + reefW) waterZone[y][x] = 2;
    else                               waterZone[y][x] = 3;
  }
}

const decor = [];
const spawn = {x:MAP/2+0.5, y:MAP/2+0.5};
