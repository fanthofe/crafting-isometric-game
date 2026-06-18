"use strict";
/* Kobolds (Fils de la Lune Brisée) : sprites et types d'ennemis. */

/* ====================== Kobolds — Fils de la Lune Brisée ====================== */
const KOBOLD_IMG = {
  eclaireur: frames2(12,18,(g,f)=>{
    g.fillStyle="#7a7a8a"; g.fillRect(3,0,6,5);
    g.fillStyle="#6a6a7a"; g.fillRect(4,3,4,3);
    g.fillStyle="#8a8a9a"; g.fillRect(2,0,2,3); g.fillRect(8,0,2,3);
    g.fillStyle="#ffe040"; g.fillRect(4,1,1,2); g.fillRect(7,1,1,2);
    g.fillStyle="#f0f0e0"; g.fillRect(5,5,1,1); g.fillRect(7,5,1,1);
    g.fillStyle="#6a6a7a"; g.fillRect(3,6,6,5); g.fillRect(1,6,2,5); g.fillRect(9,6,2,5);
    g.fillStyle="#b0c0c8"; g.fillRect(1,11,1,2); g.fillRect(2,11,1,2); g.fillRect(9,11,1,2); g.fillRect(10,11,1,2);
    g.fillStyle="#5a5a6a";
    if(f){ g.fillRect(4,11,2,5); g.fillRect(7,11,2,5); }
    else  { g.fillRect(3,11,2,5); g.fillRect(8,11,2,5); }
    g.fillStyle="#4a4a5a"; g.fillRect(3,15,3,2); g.fillRect(7,15,3,2);
  }),
  guerrier: frames2(14,18,(g,f)=>{
    g.fillStyle="#5a5a68"; g.fillRect(3,0,8,5);
    g.fillStyle="#4a4a58"; g.fillRect(4,3,6,3);
    g.fillStyle="#6a6a78"; g.fillRect(2,0,3,3); g.fillRect(9,0,3,3);
    g.fillStyle="#ff8020"; g.fillRect(4,1,2,2); g.fillRect(8,1,2,2);
    g.fillStyle="#3a2a28"; g.fillRect(7,2,1,3);
    g.fillStyle="#f0f0e0"; g.fillRect(5,5,1,2); g.fillRect(8,5,1,2);
    g.fillStyle="#4a4a58"; g.fillRect(2,6,10,6); g.fillRect(1,9,2,4); g.fillRect(11,9,2,4);
    g.fillStyle="#d0c8b0"; g.fillRect(1,6,2,3); g.fillRect(11,6,2,3);
    g.fillStyle="#b0c0c8"; g.fillRect(1,13,1,2); g.fillRect(2,13,1,2); g.fillRect(11,13,1,2); g.fillRect(12,13,1,2);
    g.fillStyle="#3a3a48";
    if(f){ g.fillRect(4,12,3,5); g.fillRect(8,12,3,5); }
    else  { g.fillRect(3,12,3,5); g.fillRect(9,12,3,5); }
    g.fillStyle="#2a2a38"; g.fillRect(3,16,4,2); g.fillRect(8,16,4,2);
  }),
  chef: frames2(16,20,(g,f)=>{
    g.fillStyle="#1a1a28"; g.fillRect(1,7,14,8); g.fillRect(0,8,2,7); g.fillRect(14,8,2,7);
    g.fillStyle="#3a3a48"; g.fillRect(3,0,10,6);
    g.fillStyle="#2a2a38"; g.fillRect(4,4,8,4);
    g.fillStyle="#4a4a58"; g.fillRect(2,0,3,4); g.fillRect(11,0,3,4);
    g.fillStyle="#ff2020"; g.fillRect(4,1,3,2); g.fillRect(9,1,3,2);
    g.fillStyle="#ff8080"; g.fillRect(4,1,1,1); g.fillRect(9,1,1,1);
    g.fillStyle="#f0f0e0"; g.fillRect(5,7,1,2); g.fillRect(8,7,2,2); g.fillRect(11,7,1,2);
    g.fillStyle="#8ab0c8";
    g.fillRect(0,15,1,3); g.fillRect(1,15,1,3); g.fillRect(2,14,1,3);
    g.fillRect(14,15,1,3); g.fillRect(15,15,1,3); g.fillRect(13,14,1,3);
    g.fillStyle="#12121e";
    if(f){ g.fillRect(4,15,4,5); g.fillRect(9,15,4,5); }
    else  { g.fillRect(3,15,4,5); g.fillRect(10,15,4,5); }
    g.fillStyle="#0a0a14"; g.fillRect(3,19,5,2); g.fillRect(9,19,5,2);
  }),
};
const KOBOLD_TYPES = {
  eclaireur: {name:"Éclaireur kobold", hp:3,  speed:3.8, detect:5, drops:{os:[1,1],griffe:[0,1]},                         xp:5,  dmg:1, w:12, h:18},
  guerrier:  {name:"Guerrier kobold",  hp:6,  speed:2.5, detect:4, drops:{os:[1,2],griffe:[1,1],cuir:[1,2]},              xp:10, dmg:2, w:14, h:18},
  chef:      {name:"Chef kobold",      hp:12, speed:2.8, detect:6, drops:{griffe:[2,3],fourrure_lunaire:[1,1],cuir:[2,3]},xp:20, dmg:3, w:16, h:20},
};
const kobolds = [];
function spawnKobold(typeHint){
  const type = typeHint || (Math.random()<0.6?"eclaireur":"guerrier");
  const T = KOBOLD_TYPES[type];
  let x = MAP*0.6, y = MAP*0.3;
  for(let i=0;i<150;i++){
    const cx2 = MAP*0.52 + rnd()*(MAP*0.40);
    const cy2 = MAP*0.08 + rnd()*(MAP*0.38);
    if(blocked[Math.floor(cy2)][Math.floor(cx2)] || ground[Math.floor(cy2)][Math.floor(cx2)]>=3) continue;
    if(Math.hypot(cx2-spawn.x, cy2-spawn.y)<14) continue;
    x=cx2; y=cy2; break;
  }
  kobolds.push({type, x, y, hp:T.hp, state:"patrol", t:1+rnd()*2,
    vx:0, vy:0, animT:0, hurtT:0, dead:false, flip:false,
    respawn:0, atkCd:0, alertT:0,
    patrolTx:x+(rnd()-0.5)*4, patrolTy:y+(rnd()-0.5)*4});
}
for(let i=0;i<8;i++) spawnKobold("eclaireur");
for(let i=0;i<4;i++) spawnKobold("guerrier");
spawnKobold("chef");

const CLOUD = makeCanvas(64,24,g=>{
  g.fillStyle="rgba(255,255,255,0.85)";
  g.fillRect(8,10,48,8); g.fillRect(16,4,20,8); g.fillRect(38,7,16,6);
  g.fillStyle="rgba(255,255,255,0.55)"; g.fillRect(4,14,56,4);
});
const clouds = [];
for(let i=0;i<8;i++) clouds.push({x:rnd()*900-200, y:18+rnd()*70, s:0.5+rnd()*0.8, v:3+rnd()*5});

