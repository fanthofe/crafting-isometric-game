"use strict";
/* État de l'inventaire : slots, équipement, poids, gestion des items. */

const SLOT_COUNT = 24;
const MAX_WEIGHT = 80;
const slots = new Array(SLOT_COUNT).fill(null);
let held = null;
let boostT = 0;

const equip = {
  arme:null, tete:null, torse:null, pieds:null,
  carquois:null, bucheron:null, cueillette:null, minage:null,
};
function hasEquip(k, id){ return equip[k] && equip[k].id===id; }

function countItem(id){ return slots.reduce((n,s)=> n + (s && s.id===id ? s.qty : 0), 0); }
function totalWeight(){
  let w = slots.reduce((n,s)=> n + (s ? s.qty*ITEMS[s.id].w : 0), 0);
  if(held) w += held.qty*ITEMS[held.id].w;
  for(const k in equip) if(equip[k]) w += ITEMS[equip[k].id].w;
  return w;
}
function maxWeight(){
  let m = MAX_WEIGHT;
  for(const k in equip) if(equip[k]) m += ITEMS[equip[k].id].carryBonus || 0;
  return m;
}
function overweight(){ return totalWeight() > maxWeight(); }
function addItem(id, qty){
  const max = ITEMS[id].stack;
  for(const s of slots){
    if(qty<=0) break;
    if(s && s.id===id && s.qty<max){ const m=Math.min(qty, max-s.qty); s.qty+=m; qty-=m; }
  }
  for(let i=0;i<SLOT_COUNT && qty>0;i++){
    if(!slots[i]){ const m=Math.min(qty,max); slots[i]={id, qty:m}; qty-=m; }
  }
  return qty;
}
function removeItem(id, qty){
  if(countItem(id)<qty) return false;
  for(let i=SLOT_COUNT-1;i>=0 && qty>0;i--){
    const s=slots[i];
    if(s && s.id===id){ const m=Math.min(qty,s.qty); s.qty-=m; qty-=m; if(s.qty<=0) slots[i]=null; }
  }
  return true;
}

const groundItems = [];
function dropOnGround(id, qty){
  groundItems.push({
    id, qty,
    x: player.x+(Math.random()-0.5)*0.9,
    y: player.y+(Math.random()-0.5)*0.9,
    ph: Math.random()*6.28, cool: 1.4,
  });
}

const placedWorkshops = new Set();
