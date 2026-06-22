"use strict";
/* Bateaux, types de poissons et mécanique de pêche. */

const BOAT_STATS = {
  radeau:       {speed:0.5,  hp:20,  carryBonus:0,   fishZone:1},
  pirogue:      {speed:0.9,  hp:35,  carryBonus:20,  fishZone:1},
  vaa_balancier:{speed:1.3,  hp:60,  carryBonus:50,  fishZone:2},
  proa:         {speed:2.5,  hp:45,  carryBonus:30,  fishZone:2},
  waka_taua:    {speed:1.0,  hp:120, carryBonus:100, fishZone:3},
};

// zone: 1=lagon 2=recif 3=haute_mer | canne: 1=bambou 2=os 3=fer
// weight: probabilité relative (0 = protégé)
const FISH_TYPES = {
  bec_de_cane:       {zone:1, canne:1, weight:15, drop:[1,1]},
  communard:         {zone:1, canne:1, weight:40, drop:[2,4]},
  picot:             {zone:1, canne:1, weight:25, drop:[1,1], venimeux:true, seasonClosed:[0.30,0.55]},
  mulet:             {zone:1, canne:1, weight:20, drop:[1,2], seasonClosed:[0.55,0.75]},
  poisson_crocodile: {zone:1, canne:1, weight:10, drop:[1,1], bonus:"huile_poisson"},
  napoleon:          {zone:2, canne:1, weight:0,  drop:[1,1], protected:true},
  loche:             {zone:2, canne:2, weight:20, drop:[1,2]},
  poisson_perroquet: {zone:2, canne:1, weight:30, drop:[1,1], bonus:"sable_corail"},
  rascasse:          {zone:2, canne:2, weight:18, drop:[1,1], venimeux:true},
  carangue:          {zone:2, canne:2, weight:22, drop:[1,2]},
  thon_blanc:        {zone:3, canne:3, weight:25, drop:[1,2]},
  thon_jaune:        {zone:3, canne:3, weight:20, drop:[1,2], bonus:"huile_poisson"},
  thon_obese:        {zone:3, canne:3, weight:10, drop:[1,1]},
  mahi_mahi:         {zone:3, canne:3, weight:20, drop:[1,1], bonus:"ecaille_arc_en_ciel"},
  tazar:             {zone:3, canne:3, weight:25, drop:[1,1]},
  saumon_des_dieux:  {zone:3, canne:3, weight:2,  drop:[1,1], nuit_only:true, bonus:"ecaille_argent"},
};

// État de la ligne de pêche
const fishing = { state: null, timer: 0, biteWindow: 0 };

function getFishingRodTier(){
  const rods = ["canne_fer","canne_os","canne_bambou"];
  for(const r of rods) if(countItem(r)>0) return ITEMS[r].fishZone || 1;
  return 0;
}

function castLine(){
  if(fishing.state) return;
  const rodTier = getFishingRodTier();
  const ps = toScreen(player.x, player.y);
  if(!rodTier){
    floats.push({sx:ps.x, sy:ps.y-24, t:1.4, str:"Pas de canne à pêche !", c:"#8a3030"});
    return;
  }
  fishing.state = "casting";
  fishing.timer = 0.9;
  floats.push({sx:ps.x, sy:ps.y-24, t:1.2, str:"Ligne lancée…", c:"#4a8fa0"});
}

function cancelFishing(){
  fishing.state = null;
  fishing.timer = 0;
  fishing.biteWindow = 0;
}

function resolveFish(){
  const ix = Math.floor(player.x), iy = Math.floor(player.y);
  const zone = (waterZone[iy]?.[ix]) || 1;
  const rodTier = getFishingRodTier();

  const pool = [];
  for(const [id, ft] of Object.entries(FISH_TYPES)){
    if(ft.protected || ft.weight <= 0) continue;
    if(ft.zone > zone) continue;
    if(ft.canne > rodTier) continue;
    if(ft.nuit_only && lightLevel() > 0.3) continue;
    if(ft.seasonClosed){
      const ph = dayPhase();
      if(ph >= ft.seasonClosed[0] && ph <= ft.seasonClosed[1]) continue;
    }
    let w = ft.weight;
    if(rodTier >= 3 && ft.zone === 3) w = Math.ceil(w * 1.2);
    else if(rodTier >= 2 && ft.zone === 2) w = Math.ceil(w * 1.15);
    for(let i=0; i<w; i++) pool.push(id);
  }

  const ps = toScreen(player.x, player.y);
  if(!pool.length){
    floats.push({sx:ps.x, sy:ps.y-22, t:1.2, str:"Rien à pêcher ici…", c:"#8a3030"});
    return;
  }

  const caught = pool[Math.floor(Math.random() * pool.length)];
  const ft = FISH_TYPES[caught];
  const qty = ft.drop[0] + Math.floor(Math.random() * (ft.drop[1] - ft.drop[0] + 1));

  if(ft.venimeux){
    const hasGants = equip.torse && ITEMS[equip.torse.id].c === "#a3754d";
    if(!hasGants){
      player.hp -= 1;
      floats.push({sx:ps.x, sy:ps.y-30, t:1.2, str:"Piqûre !", c:"#e06040"});
    }
  }

  const left = addItem(caught, qty);
  if(left > 0) dropOnGround(caught, left);
  gainXP("chasse", 4 + Math.floor(ft.zone));
  floats.push({sx:ps.x, sy:ps.y-24, t:1.8, str:`+${qty} ${ITEMS[caught].name} !`, c:ITEMS[caught].c});
  burst(ps.x, ps.y-6, "#4a8fa0", 10);

  if(ft.bonus){
    const bl = addItem(ft.bonus, 1);
    if(bl === 0) floats.push({sx:ps.x, sy:ps.y-36, t:1.2, str:`+1 ${ITEMS[ft.bonus].name}`, c:ITEMS[ft.bonus].c});
  }
  refreshUI();
}

function updateFishing(dt){
  if(!fishing.state) return;
  fishing.timer -= dt;
  if(fishing.state === "casting" && fishing.timer <= 0){
    fishing.state = "waiting";
    fishing.timer = 2 + Math.random() * 3;
  }
  if(fishing.state === "waiting" && fishing.timer <= 0){
    fishing.state = "bite";
    fishing.biteWindow = 1.8;
    const ps = toScreen(player.x, player.y);
    floats.push({sx:ps.x, sy:ps.y-30, t:1.8, str:"⚡ Touche ! [E]", c:"#f0d040"});
    burst(ps.x, ps.y-8, "#f0d040", 6);
  }
  if(fishing.state === "bite"){
    fishing.biteWindow -= dt;
    if(fishing.biteWindow <= 0){
      fishing.state = null;
      const ps = toScreen(player.x, player.y);
      floats.push({sx:ps.x, sy:ps.y-24, t:1.2, str:"Raté…", c:"#8a3030"});
    }
  }
}
