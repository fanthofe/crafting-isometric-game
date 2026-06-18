"use strict";
/* État de l'inventaire : slots, poids, ajout/retrait, recettes et fabrication. */

const SLOT_COUNT = 24;
const MAX_WEIGHT = 80;
const slots = new Array(SLOT_COUNT).fill(null);   // chaque slot : {id, qty} ou null
let held = null;                                  // pile tenue à la souris
let boostT = 0;                                   // bonus de vitesse après avoir mangé
const equip = {arme:null, tete:null, torse:null, pieds:null};   // équipement porté
function hasEquip(k, id){ return equip[k] && equip[k].id===id; }
/* ---------- Force & défense (arme + armure + compétences) ---------- */
function statForce(){      // dégâts par coup sur les animaux / kobolds
  return 1 + Math.floor((SKILLS.chasse.lvl-1)/4)
    + (hasEquip("arme","lance") ? 1 : 0)
    + (hasEquip("arme","dague") ? 2 : 0);
}
function statForceBois(){  // dégâts par coup sur les arbres
  return 1 + Math.floor((SKILLS.bucheron.lvl-1)/4) + (hasEquip("arme","hache_pierre") ? 1 : 0);
}
function statDefense(){    // réduit les dégâts reçus
  let d = 0;
  for(const k in equip) if(equip[k]) d += ITEMS[equip[k].id].def || 0;
  return d;
}

function countItem(id){ return slots.reduce((n,s)=> n + (s && s.id===id ? s.qty : 0), 0); }
function totalWeight(){
  let w = slots.reduce((n,s)=> n + (s ? s.qty*ITEMS[s.id].w : 0), 0);
  if(held) w += held.qty*ITEMS[held.id].w;
  for(const k in equip) if(equip[k]) w += ITEMS[equip[k].id].w;
  return w;
}
function maxWeight(){ return MAX_WEIGHT + (equip.torse ? 25 : 0); }
function overweight(){ return totalWeight() > maxWeight(); }
function addItem(id, qty){            // retourne la quantité qui n'a pas tenu
  const max = ITEMS[id].stack;
  for(const s of slots){              // compléter d'abord les piles existantes
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

/* ---------- Objets posés au sol ---------- */
const groundItems = []; // {id, qty, x, y, ph, cool}
function dropOnGround(id, qty){
  groundItems.push({
    id, qty,
    x: player.x+(Math.random()-0.5)*0.9,
    y: player.y+(Math.random()-0.5)*0.9,
    ph: Math.random()*6.28, cool: 1.4,
  });
}

const RECIPES = [
  {id:"planche",   label:"Planche",          cost:{bois:2},                     gives:{planche:1}},
  {id:"feu",       label:"Feu de camp",      cost:{planche:2, pierre:2},        gives:{feu:1}},
  {id:"salade",    label:"Salade de fruits", cost:{pomme:1, prune:1, cerise:1}, gives:{salade:1}},
  {id:"brochette", label:"Brochette",        cost:{viande:1, bois:1},           gives:{brochette:1}},
  {id:"hache_pierre", label:"Hache de pierre",   cost:{bois:3, pierre:2},          gives:{hache_pierre:1}},
  {id:"lance",        label:"Lance",             cost:{bois:2, pierre:1, plume:1}, gives:{lance:1}},
  {id:"chapeau",      label:"Chapeau de plumes", cost:{plume:4, cuir:1},           gives:{chapeau:1}},
  {id:"tunique",      label:"Tunique de cuir",   cost:{cuir:4},                    gives:{tunique:1}},
  {id:"bottes",       label:"Bottes de cuir",    cost:{cuir:2},                    gives:{bottes:1}},
  {id:"torche",       label:"Torche",            cost:{bois:1, cuir:1},            gives:{torche:3}},
  {id:"dague",        label:"Dague de griffes",  cost:{griffe:2, planche:1},       gives:{dague:1}},
];
function canCraft(r){ return Object.entries(r.cost).every(([k,n])=>countItem(k)>=n); }
function craft(r){
  if(!canCraft(r)) return;
  for(const [k,n] of Object.entries(r.cost)) removeItem(k,n);
  for(const [k,n] of Object.entries(r.gives)){
    const left = addItem(k,n);
    if(left>0) dropOnGround(k,left);
  }
  refreshUI();
}
function costText(cost){
  return Object.entries(cost).map(([k,n])=>`${n} ${ITEMS[k].name.toLowerCase()}`).join(" + ");
}

