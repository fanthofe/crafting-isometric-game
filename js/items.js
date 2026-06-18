"use strict";
/* Données des objets (ITEMS), compétences (SKILLS) et gain d'expérience. */

/* ====================== Inventaire & craft (façon Valheim) ====================== */
const ITEMS = {
  bois:      {name:"Bois",             c:"#8a6240", stack:50, w:2},
  pierre:    {name:"Pierre",           c:"#9aa2a6", stack:50, w:4},
  planche:   {name:"Planche",          c:"#d2a763", stack:50, w:1.5},
  feu:       {name:"Feu de camp",      c:"#e8743f", stack:5,  w:6},
  pomme:     {name:"Pomme",            c:"#e0463f", stack:20, w:0.5, food:8},
  prune:     {name:"Prune",            c:"#8e5bc8", stack:20, w:0.5, food:8},
  cerise:    {name:"Cerise",           c:"#c22b48", stack:20, w:0.3, food:6},
  poire:     {name:"Poire",            c:"#c9c440", stack:20, w:0.5, food:8},
  orange:    {name:"Orange",           c:"#f08c1d", stack:20, w:0.5, food:10},
  peche:     {name:"Pêche",            c:"#f2a07b", stack:20, w:0.5, food:10},
  salade:    {name:"Salade de fruits", c:"#f4a3b8", stack:10, w:1,   food:20},
  viande:    {name:"Viande",           c:"#b5483a", stack:20, w:1},
  cuir:      {name:"Cuir",             c:"#a3754d", stack:30, w:1},
  plume:     {name:"Plume",            c:"#e8e4da", stack:30, w:0.1},
  brochette: {name:"Brochette",        c:"#d97f5e", stack:10, w:1,   food:16},
  hache_pierre: {name:"Hache de pierre",   c:"#9aa2a6", stack:1, w:3,   equip:"arme",  bonus:"+1 dégât de bûcheron"},
  lance:        {name:"Lance",             c:"#c4cacd", stack:1, w:2.5, equip:"arme",  bonus:"+1 dégât de chasse"},
  chapeau:      {name:"Chapeau de plumes", c:"#e8e4da", stack:1, w:1,   equip:"tete",  def:1, bonus:"défense +1 · les animaux fuient moins loin"},
  tunique:      {name:"Tunique de cuir",   c:"#a3754d", stack:1, w:4,   equip:"torse", def:2, bonus:"défense +2 · +25 de charge max"},
  bottes:       {name:"Bottes de cuir",    c:"#7c5836", stack:1, w:2,   equip:"pieds", def:1, bonus:"défense +1 · +15% de vitesse"},
  os:              {name:"Os",               c:"#ddd8c8", stack:30, w:0.5},
  griffe:          {name:"Griffe de kobold", c:"#8ab0c0", stack:10, w:0.3},
  fourrure_lunaire:{name:"Fourrure lunaire", c:"#7080b0", stack:5,  w:1.5},
  plume_noire:     {name:"Plume noire",      c:"#2e2e42", stack:30, w:0.1},
  torche:          {name:"Torche",           c:"#e8a030", stack:10, w:0.8},
  dague:           {name:"Dague de griffes", c:"#8ab0c0", stack:1,  w:1.5, equip:"arme", def:0, bonus:"+2 dégâts · attaque rapide contre les kobolds"},
};

/* ---------- Compétences (montent en pratiquant, comme dans Valheim) ---------- */
const SKILLS = {
  bucheron:  {name:"Bûcheron",   xp:0, lvl:1},
  cueillette:{name:"Cueillette", xp:0, lvl:1},
  chasse:    {name:"Chasse",     xp:0, lvl:1},
};
function xpNeed(lvl){ return 8 + lvl*6; }
function gainXP(id, n){
  const s = SKILLS[id];
  s.xp += n;
  while(s.xp >= xpNeed(s.lvl)){
    s.xp -= xpNeed(s.lvl); s.lvl++;
    const ps = toScreen(player.x, player.y);
    floats.push({sx:ps.x, sy:ps.y-28, t:1.8, str:`${s.name} niveau ${s.lvl} !`, c:"#b8860b"});
    burst(ps.x, ps.y-12, "#f4c542", 12);
  }
  if(elInv.classList.contains("open")) refreshUI();
}
