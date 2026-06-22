"use strict";
/* Entrées clavier et contrôles tactiles (d-pad, boutons). */

/* ====================== Entrées ====================== */
const keys = {up:false, down:false, left:false, right:false};
let actionQueued = false;
const KEYMAP = {
  ArrowUp:"up", ArrowDown:"down", ArrowLeft:"left", ArrowRight:"right",
  KeyW:"up", KeyS:"down", KeyA:"left", KeyD:"right"
};
addEventListener("keydown", e=>{
  const d=KEYMAP[e.code];
  if(d){ keys[d]=true; e.preventDefault(); return; }
  if(e.code==="KeyE" || e.code==="Space"){ actionQueued=true; e.preventDefault(); }
  // inventaire & feu de camp indisponibles pendant un combat (le menu de combat gère ces touches)
  if(e.code==="KeyI"){ if(gameMode==="explore") toggleInv(); e.preventDefault(); }
  if(e.code==="KeyC"){ if(gameMode==="explore"){ toggleInv(true); switchTab("craft"); } e.preventDefault(); }
  if(e.code==="KeyF"){ if(gameMode==="explore") placeFire(); e.preventDefault(); }
  if(e.code==="Escape"){ if(gameMode==="explore") toggleInv(false); }
});
addEventListener("keyup", e=>{ const d=KEYMAP[e.code]; if(d){ keys[d]=false; e.preventDefault(); } });
document.querySelectorAll(".db[data-d]").forEach(b=>{
  const d=b.dataset.d;
  b.addEventListener("pointerdown", e=>{ keys[d]=true; b.setPointerCapture(e.pointerId); });
  b.addEventListener("pointerup",   ()=>keys[d]=false);
  b.addEventListener("pointercancel",()=>keys[d]=false);
});
document.getElementById("btnAct").addEventListener("pointerdown", ()=>{ actionQueued=true; });
document.getElementById("btnInv").addEventListener("pointerdown", ()=>toggleInv());

