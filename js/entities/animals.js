"use strict";
/* Animaux : types, données de jeu, comportement et combat. */

const ANIMAL_TYPES = {
  lapin:    {name:"Lapin",    hp:1, speed:3.0, flee:2.4, drops:{viande:[1,1]},                               xp:3},
  faisan:   {name:"Faisan",   hp:1, speed:2.6, flee:2.2, drops:{viande:[1,1], plume:[1,2]},                  xp:3},
  renard:   {name:"Renard",   hp:2, speed:3.1, flee:2.8, drops:{viande:[1,1], cuir:[1,1]},                   xp:5},
  cerf:     {name:"Cerf",     hp:3, speed:3.6, flee:3.5, drops:{viande:[2,3], cuir:[1,2]},                   xp:8},
  sanglier: {name:"Sanglier", hp:4, speed:1.8, flee:1.6, drops:{viande:[2,3], cuir:[1,1], graisse:[0,1]},    xp:10, aggressive:true, dmg:1},
  requin:   {name:"Requin",   hp:5, speed:2.8, flee:0,   drops:{viande_requin:[1,2], dent_requin:[1,3]},     xp:15, aggressive:true, dmg:3, aquatic:true},
  corbeau:  {name:"Corbeau",  hp:1, speed:4.0, flee:3.8, drops:{plume_noire:[1,2]},                          xp:6,  rare:true},
};
const ANIMAL_LIST = Object.keys(ANIMAL_TYPES).filter(k=>!ANIMAL_TYPES[k].aquatic && !ANIMAL_TYPES[k].rare);
const RARE_ANIMAL_LIST = ["corbeau"];

const animals = [];
function resetAnimal(a){
  const type = a.nextType || ANIMAL_LIST[Math.floor(Math.random()*ANIMAL_LIST.length)];
  let x = spawn.x+6, y = spawn.y-6;
  for(let i=0;i<80;i++){
    const cx2 = 1.5+Math.random()*(MAP-3), cy2 = 1.5+Math.random()*(MAP-3);
    if(blocked[Math.floor(cy2)][Math.floor(cx2)] || ground[Math.floor(cy2)][Math.floor(cx2)]===3) continue;
    if(Math.hypot(cx2-player.x, cy2-player.y)<6) continue;
    x=cx2; y=cy2; break;
  }
  Object.assign(a, {type, x, y, hp:ANIMAL_TYPES[type].hp, state:"idle", t:1+Math.random()*2,
                    vx:0, vy:0, animT:0, hurtT:0, dead:false, flip:false, respawn:0, atkCd:0});
  delete a.nextType;
}
for(let i=0;i<22;i++){
  const a = {nextType: ANIMAL_LIST[i % ANIMAL_LIST.length]};
  resetAnimal(a); animals.push(a);
}

function hitAnimal(a){
  const p = toScreen(player.x, player.y), s = toScreen(a.x, a.y);
  player.dir = s.x<p.x ? "left" : "right";
  a.hp -= statForce();
  a.hurtT = 0.35;
  const T0 = ANIMAL_TYPES[a.type];
  if(T0.aggressive && a.hp > Math.ceil(T0.hp*0.35)){ a.state="charge"; a.t=5; }
  else { a.state="flee"; a.t = Math.max(a.t, 2.5); }
  burst(s.x, s.y-6, "#c0473f", 6);
  gainXP("chasse", 1);
  if(a.hp<=0){
    const T = ANIMAL_TYPES[a.type];
    gainXP("chasse", T.xp);
    const bonus = Math.floor((SKILLS.chasse.lvl-1)/5);
    for(const [id,[mn,mx]] of Object.entries(T.drops)){
      const n = mn + Math.floor(Math.random()*(mx-mn+1)) + bonus;
      groundItems.push({id, qty:n, x:a.x+(Math.random()-0.5)*0.6, y:a.y+(Math.random()-0.5)*0.6,
                        ph:Math.random()*6.28, cool:0.6});
    }
    floats.push({sx:s.x, sy:s.y-18, t:1.4, str:`${T.name} chassé !`, c:"#8a3030"});
    burst(s.x, s.y-4, "#8a3030", 10);
    a.dead = true; a.respawn = 20 + Math.random()*25;
  }
}
