"use strict";
/* Compétences du joueur : définitions, progression et gain d'XP. */

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
