"use strict";
/* Prédateurs marins : types, comportement et combat (structure miroir de animals.js). */

// zone: 1=lagon 2=recif 3=haute_mer
const SEA_PREDATOR_TYPES = {
  requin_bouledogue:   {name:"Requin bouledogue",     hp:8,  speed:3.2, dmg:2, detect:6, zone:1, h:8,
                        drops:{viande_requin:[1,2], dent_requin:[2,3], foie_requin:[0,1]}, xp:18, aggressive:true},
  requin_tigre:        {name:"Requin tigre",          hp:12, speed:2.8, dmg:3, detect:5, zone:1, h:8,
                        drops:{viande_requin:[2,3], dent_requin:[3,5], foie_requin:[1,2]}, xp:25, aggressive:false},
  requin_gris:         {name:"Requin gris",           hp:6,  speed:3.5, dmg:2, detect:4, zone:2, h:8,
                        drops:{viande_requin:[1,2], dent_requin:[1,3]}, xp:14, aggressive:false},
  requin_pointes_noires:{name:"Requin pointes noires",hp:5,  speed:4.0, dmg:1, detect:3, zone:2, h:8,
                        drops:{viande_requin:[1,1], dent_requin:[1,2]}, xp:10, aggressive:true},
  requin_dorsale:      {name:"Requin à haute dorsale",hp:9,  speed:2.6, dmg:2, detect:5, zone:2, h:8,
                        drops:{viande_requin:[1,2], dent_requin:[2,4], aileron_requin:[0,1]}, xp:20, aggressive:true},
  requin_blanc:        {name:"Grand requin blanc",    hp:25, speed:3.0, dmg:5, detect:8, zone:3, h:8,
                        drops:{viande_requin:[3,4], dent_requin:[4,6], cartilage_requin:[1,2]}, xp:60, aggressive:true},
  orque:               {name:"Orque",                hp:30, speed:3.6, dmg:4, detect:7, zone:3, h:10,
                        drops:{graisse_baleine:[2,3], os_baleine:[1,2]}, xp:50, aggressive:true},
  espadon:             {name:"Espadon",               hp:15, speed:5.0, dmg:3, detect:4, zone:3, h:8,
                        drops:{viande_espadon:[2,3], bec_espadon:[1,1]}, xp:35, aggressive:true},
};

const SEA_PREDATOR_LIST = Object.keys(SEA_PREDATOR_TYPES);

const seaPredators = [];

function isBlockedWater(tx, ty){
  if(tx < 0.3 || ty < 0.3 || tx > MAP-0.3 || ty > MAP-0.3) return true;
  return ground[Math.floor(ty)]?.[Math.floor(tx)] !== 3;
}

function resetSeaPredator(sp){
  const T = SEA_PREDATOR_TYPES[sp.type];
  let x = MAP/2, y = 2;
  for(let i=0; i<120; i++){
    const cx2 = 0.5+Math.random()*(MAP-1), cy2 = 0.5+Math.random()*(MAP-1);
    const ix = Math.floor(cx2), iy = Math.floor(cy2);
    if(ground[iy]?.[ix] !== 3) continue;
    if(waterZone[iy]?.[ix] !== T.zone) continue;
    if(Math.hypot(cx2-player.x, cy2-player.y) < 12) continue;
    x = cx2; y = cy2; break;
  }
  Object.assign(sp, {x, y, hp:T.hp, state:"idle", t:1+Math.random()*3,
                      vx:0, vy:0, animT:0, hurtT:0, dead:false, flip:false, respawn:0, atkCd:0});
}

function hitSeaPredator(sp){
  const s = toScreen(sp.x, sp.y), p = toScreen(player.x, player.y);
  player.dir = s.x < p.x ? "left" : "right";
  sp.hp -= statForce();
  sp.hurtT = 0.35;
  burst(s.x, s.y-4, "#4a6878", 6);
  gainXP("chasse", 2);
  if(sp.hp <= 0){
    const T = SEA_PREDATOR_TYPES[sp.type];
    gainXP("chasse", T.xp);
    const bonus = Math.floor((SKILLS.chasse.lvl-1)/5);
    for(const [id,[mn,mx]] of Object.entries(T.drops)){
      const n = mn + Math.floor(Math.random()*(mx-mn+1)) + bonus;
      groundItems.push({id, qty:n, x:sp.x+(Math.random()-0.5)*0.6, y:sp.y+(Math.random()-0.5)*0.6,
                        ph:Math.random()*6.28, cool:0.6});
    }
    floats.push({sx:s.x, sy:s.y-18, t:1.4, str:`${T.name} tué !`, c:"#4a6878"});
    burst(s.x, s.y-4, "#4a6878", 12);
    sp.dead = true; sp.respawn = 40 + Math.random()*40;
  } else {
    sp.state = "charge"; sp.t = 5;
  }
}

for(let i=0; i<10; i++){
  const type = SEA_PREDATOR_LIST[i % SEA_PREDATOR_LIST.length];
  const sp = {type};
  resetSeaPredator(sp);
  seaPredators.push(sp);
}
