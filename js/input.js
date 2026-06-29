"use strict";
/* Entrées clavier et contrôles tactiles (d-pad, boutons).
   Les bindings de touches sont lus depuis options.bindings (js/core/save.js). */

const keys = {up:false, down:false, left:false, right:false};
let actionQueued = false;

/* Construit dynamiquement le KEYMAP depuis les bindings configurables. */
function _hasDir(code) {
  for (const dir of ["up","down","left","right"])
    if (options.bindings[dir]?.includes(code)) return dir;
  return null;
}

addEventListener("keydown", e => {
  /* ── Interception menu / pause (prioritaire) ── */
  if (gameMode === "menu")  { menuKeyDown(e);  return; }
  if (gameMode === "pause") { pauseKeyDown(e); return; }

  /* ── Directions ── */
  const dir = _hasDir(e.code);
  if (dir) { keys[dir] = true; e.preventDefault(); return; }

  /* ── Actions ── */
  if (options.bindings.action?.includes(e.code))    { actionQueued = true; e.preventDefault(); }
  if (options.bindings.inventory?.includes(e.code)) {
    if (gameMode === "explore") toggleInv();
    e.preventDefault();
  }
  if (options.bindings.craft?.includes(e.code)) {
    if (gameMode === "explore") { toggleInv(true); switchTab("craft"); }
    e.preventDefault();
  }
  if (options.bindings.fire?.includes(e.code)) {
    if (gameMode === "explore") placeFire();
    e.preventDefault();
  }
  if (e.code === "Escape") {
    if (gameMode === "explore") {
      if (elInv.classList.contains("open")) toggleInv(false);
      else { menuState.pauseCursor = 0; gameMode = "pause"; }
    }
  }
});

addEventListener("keyup", e => {
  if (gameMode === "menu") return;
  const dir = _hasDir(e.code);
  if (dir) { keys[dir] = false; e.preventDefault(); }
});

/* ── Contrôles tactiles ── */
document.querySelectorAll(".db[data-d]").forEach(b => {
  const d = b.dataset.d;
  b.addEventListener("pointerdown", e => { keys[d] = true;  b.setPointerCapture(e.pointerId); });
  b.addEventListener("pointerup",    () => keys[d] = false);
  b.addEventListener("pointercancel",() => keys[d] = false);
});
document.getElementById("btnAct").addEventListener("pointerdown", () => { actionQueued = true; });
document.getElementById("btnInv").addEventListener("pointerdown", () => toggleInv());
