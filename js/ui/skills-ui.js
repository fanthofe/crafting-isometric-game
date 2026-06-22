"use strict";
/* Interface DOM : onglet compétences. */

const elSkills = document.getElementById("skills");
function refreshSkills(){
  elSkills.innerHTML = "";
  for(const s of Object.values(SKILLS)){
    const need = xpNeed(s.lvl);
    const r = document.createElement("div"); r.className = "skrow";
    r.innerHTML = `<span class="skname">${s.name}</span>
      <div class="skbar"><div class="skfill" style="width:${Math.min(100, s.xp/need*100)}%"></div></div>
      <span class="sklvl">Nv.${s.lvl} · ${s.xp}/${need}</span>`;
    elSkills.appendChild(r);
  }
}
