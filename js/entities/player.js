"use strict";
/* État du joueur et stats calculées. */

const player = {x:spawn.x, y:spawn.y, dir:"down", walking:false, animT:0, swing:0,
                hp:10, maxHp:10, hurtT:0};
let camX=0, camY=0, camInit=false;

function statForce(){
  const base = 1 + Math.floor((SKILLS.chasse.lvl-1)/4);
  const wId = equip.arme ? equip.arme.id : null;
  return base + (wId ? (ITEMS[wId].dmg || 0) : 0);
}
function statForceBois(){
  const base = 1 + Math.floor((SKILLS.bucheron.lvl-1)/4);
  const tId = equip.bucheron ? equip.bucheron.id
            : (equip.arme && ITEMS[equip.arme.id].woodBonus ? equip.arme.id : null);
  return base + (tId ? (ITEMS[tId].woodBonus || 0) : 0);
}
function statDefense(){
  let d = 0;
  for(const k in equip) if(equip[k]) d += ITEMS[equip[k].id].def || 0;
  return d;
}
