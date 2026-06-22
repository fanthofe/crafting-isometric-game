"use strict";
/* Placement du décor : arbres, rochers, fleurs, palmiers. */

function freeSpot(minDistSpawn){
  for(let tries=0;tries<200;tries++){
    const x = 1+Math.floor(rnd()*(MAP-2)), y = 1+Math.floor(rnd()*(MAP-2));
    if(blocked[y][x] || ground[y][x]>=3) continue;
    if(Math.hypot(x+0.5-spawn.x, y+0.5-spawn.y) < minDistSpawn) continue;
    if(decor.some(d=>d.tx===x && d.ty===y)) continue;
    return {x,y};
  }
  return null;
}
for(let i=0;i<150;i++){ const s=freeSpot(3.5); if(s){ decor.push({type:"tree", tx:s.x, ty:s.y, v:Math.floor(rnd()*7), alive:true, hp:3, regrow:0, shake:0}); blocked[s.y][s.x]=true; } }
for(let i=0;i<60;i++){ const s=freeSpot(2.5); if(s){ decor.push({type:"rock", tx:s.x, ty:s.y, v:Math.floor(rnd()*2), alive:true, hp:2, regrow:0, shake:0}); blocked[s.y][s.x]=true; } }
for(let k=0;k<6;k++)for(let i=0;i<5;i++){
  const s=freeSpot(3);
  if(s){ decor.push({type:"fruittree", tx:s.x, ty:s.y, kind:k, fruits:3, regrowF:0, shake:0}); blocked[s.y][s.x]=true; }
}
function sandSpot(){
  for(let tries=0;tries<300;tries++){
    const x = 1+Math.floor(rnd()*(MAP-2)), y = 1+Math.floor(rnd()*(MAP-2));
    if(ground[y][x]!==4) continue;
    if(!blocked[y][x] && !decor.some(d=>d.tx===x&&d.ty===y)){
      blocked[y][x]=true; return {x,y};
    }
  }
  return null;
}
for(let i=0;i<20;i++){
  const s=sandSpot();
  if(s) decor.push({type:"palmier", tx:s.x, ty:s.y, v:Math.floor(rnd()*2), alive:true, hp:2, regrow:0, fruits:2, regrowF:0, shake:0});
}
const FLOWER_COLORS = ["#e85f6a","#f4c542","#bfe3ff","#c77ddb"];
for(let i=0;i<300;i++){ const s=freeSpot(0); if(s) decor.push({type:"flower", tx:s.x, ty:s.y, c:FLOWER_COLORS[Math.floor(rnd()*4)], ph:rnd()*6.28, ox:(rnd()-0.5)*14, oy:(rnd()-0.5)*5}); }
for(let i=0;i<420;i++){ const s=freeSpot(0); if(s) decor.push({type:"tuft", tx:s.x, ty:s.y, ph:rnd()*6.28, ox:(rnd()-0.5)*16, oy:(rnd()-0.5)*6}); }
