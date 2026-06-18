"use strict";
/* Interface DOM : grille d'inventaire, équipement, compétences, infobulles, rendu HUD. */

/* ---------- Interface DOM ---------- */
const elBar = document.getElementById("bar");
const elMeteo = document.getElementById("meteo");
const elInv = document.getElementById("inv");
const elGrid = document.getElementById("grid");
const elRecipes = document.getElementById("invRecipes");
const elHeld = document.getElementById("held");
const elTip = document.getElementById("tip");
const elWeightTxt = document.getElementById("weightTxt");
const elWeightFill = document.getElementById("weightFill");
const elSkills = document.getElementById("skills");
const elStats = document.getElementById("statsRow");

// construit la grille une fois ; refreshUI ne fait que mettre à jour le contenu
for(let i=0;i<SLOT_COUNT;i++){
  const d = document.createElement("div");
  d.className = "islot"; d.dataset.i = i;
  elGrid.appendChild(d);
}
function slotAt(e){ const c = e.target.closest(".islot"); return c ? +c.dataset.i : -1; }
elGrid.addEventListener("click", e=>{ const i=slotAt(e); if(i>=0) onSlot(i,false); });
elGrid.addEventListener("contextmenu", e=>{ const i=slotAt(e); if(i>=0){ e.preventDefault(); onSlot(i,true); } });
elGrid.addEventListener("dblclick", e=>{ const i=slotAt(e); if(i>=0) useSlot(i); });
elGrid.addEventListener("mouseover", e=>{ const i=slotAt(e); if(i>=0) showTip(i); });
elGrid.addEventListener("mouseout", ()=>{ elTip.style.display="none"; });

function onSlot(i, right){
  const s = slots[i];
  if(!held){
    if(!s) return;
    if(right){          // clic droit : prendre la moitié
      const take = Math.ceil(s.qty/2);
      held = {id:s.id, qty:take};
      s.qty -= take; if(s.qty<=0) slots[i]=null;
    } else { held = s; slots[i]=null; }
  } else {
    if(!s){
      if(right){        // clic droit : poser un seul
        slots[i] = {id:held.id, qty:1};
        held.qty--; if(held.qty<=0) held=null;
      } else { slots[i]=held; held=null; }
    } else if(s.id===held.id){
      const can = Math.min(right?1:held.qty, ITEMS[s.id].stack - s.qty);
      s.qty += can; held.qty -= can;
      if(held.qty<=0) held=null;
    } else if(!right){  // échange
      slots[i]=held; held=s;
    }
  }
  refreshUI(); updateHeld(); showTip(i);
}
function useSlot(i){
  const s = slots[i]; if(!s) return;
  if(ITEMS[s.id].food) eatSlot(i);
  else if(ITEMS[s.id].equip) equipFromGrid(i);
}
function equipFromGrid(i){
  const s = slots[i];
  const k = ITEMS[s.id].equip;
  const cur = equip[k];
  equip[k] = {id:s.id, qty:1};
  s.qty--; if(s.qty<=0){ slots[i]=null; elTip.style.display="none"; }
  if(cur){ const left = addItem(cur.id, 1); if(left>0) dropOnGround(cur.id, 1); }
  const ps = toScreen(player.x, player.y);
  floats.push({sx:ps.x, sy:ps.y-24, t:1.2, str:`${ITEMS[equip[k].id].name} équipé(e)`, c:"#5f4128"});
  refreshUI();
}
function eatSlot(i){
  const s = slots[i];
  if(!s || !ITEMS[s.id].food) return;
  const dur = ITEMS[s.id].food;
  s.qty--; if(s.qty<=0){ slots[i]=null; elTip.style.display="none"; }
  boostT = Math.max(boostT, dur);
  player.hp = Math.min(player.maxHp, player.hp+2);
  const ps = toScreen(player.x, player.y);
  floats.push({sx:ps.x, sy:ps.y-24, t:1.3, str:"miam ! +vitesse +♥", c:"#c0473f"});
  refreshUI();
}
function showTip(i){
  const s = slots[i];
  if(!s){ elTip.style.display="none"; return; }
  const it = ITEMS[s.id];
  elTip.innerHTML = `<b>${it.name}</b> × ${s.qty}<br>Poids : ${(it.w*s.qty).toFixed(1)} (${it.w}/u) · Pile max : ${it.stack}`
    + (it.food ? `<br><i>Double-clic pour manger (+vitesse ${it.food}s · +1 ♥)</i>` : "")
    + (it.equip ? `<br>${it.bonus}<br><i>Double-clic pour équiper</i>` : "");
  elTip.style.display = "block";
}

/* ---------- Emplacements d'équipement ---------- */
const elEquip = document.getElementById("equipRow");
const EQUIP_SLOTS = [
  {key:"arme",  label:"ARME"},
  {key:"tete",  label:"TÊTE"},
  {key:"torse", label:"TORSE"},
  {key:"pieds", label:"PIEDS"},
];
for(const es of EQUIP_SLOTS){
  const wrap = document.createElement("div"); wrap.className="eqwrap";
  wrap.innerHTML = `<div class="islot eqslot" data-k="${es.key}"></div><span>${es.label}</span>`;
  elEquip.appendChild(wrap);
}
function eqKeyAt(e){ const c = e.target.closest(".eqslot"); return c ? c.dataset.k : null; }
elEquip.addEventListener("click", e=>{ const k=eqKeyAt(e); if(k) onEquipSlot(k); });
elEquip.addEventListener("dblclick", e=>{ const k=eqKeyAt(e); if(k) unequipSlot(k); });
elEquip.addEventListener("mouseover", e=>{ const k=eqKeyAt(e); if(k) showEquipTip(k); });
elEquip.addEventListener("mouseout", ()=>{ elTip.style.display="none"; });

function onEquipSlot(k){
  const cur = equip[k];
  if(held){
    if(ITEMS[held.id].equip!==k) return;          // mauvais emplacement
    if(held.qty===1){ equip[k]={id:held.id, qty:1}; held = cur; }
    else if(!cur){ equip[k]={id:held.id, qty:1}; held.qty--; }
  } else if(cur){
    held = cur; equip[k]=null;
  }
  refreshUI(); updateHeld();
}
function unequipSlot(k){
  const cur = equip[k]; if(!cur) return;
  equip[k] = null;
  const left = addItem(cur.id, 1);
  if(left>0) dropOnGround(cur.id, 1);
  refreshUI(); updateHeld();
}
function showEquipTip(k){
  const cur = equip[k];
  if(!cur){
    elTip.innerHTML = `<b>${EQUIP_SLOTS.find(e=>e.key===k).label}</b><br><i>Double-clic sur un objet équipable<br>de l'inventaire pour le porter</i>`;
  } else {
    const it = ITEMS[cur.id];
    elTip.innerHTML = `<b>${it.name}</b><br>${it.bonus}<br><i>Double-clic pour retirer</i>`;
  }
  elTip.style.display = "block";
}
function updateHeld(){
  if(held){
    elHeld.style.display = "block";
    elHeld.querySelector(".ic").style.backgroundImage = `url(${ICON[held.id]})`;
    elHeld.querySelector(".q").textContent = held.qty>1 ? held.qty : "";
  } else elHeld.style.display = "none";
}
addEventListener("pointermove", e=>{
  elHeld.style.left = (e.clientX+8)+"px";  elHeld.style.top = (e.clientY+8)+"px";
  elTip.style.left  = (e.clientX+14)+"px"; elTip.style.top  = (e.clientY+18)+"px";
});
document.getElementById("dropZone").addEventListener("click", ()=>{
  if(!held) return;
  dropOnGround(held.id, held.qty);
  held=null; updateHeld(); refreshUI();
});

function refreshUI(){
  // barre de ressources (totaux possédés)
  elBar.innerHTML = "";
  for(const [k,it] of Object.entries(ITEMS)){
    const n = countItem(k); if(n<=0) continue;
    const s = document.createElement("div"); s.className="slot";
    s.innerHTML = `<span class="sw" style="background-image:url(${ICON[k]})"></span>${n}`;
    s.title = it.name;
    elBar.appendChild(s);
  }
  // grille de slots
  [...elGrid.children].forEach((d,i)=>{
    const s = slots[i];
    d.innerHTML = s
      ? `<span class="ic" style="background-image:url(${ICON[s.id]})"></span>` + (s.qty>1?`<span class="q">${s.qty}</span>`:"")
      : "";
  });
  // compétences
  elSkills.innerHTML = "";
  for(const s of Object.values(SKILLS)){
    const need = xpNeed(s.lvl);
    const r = document.createElement("div"); r.className="skrow";
    r.innerHTML = `<span class="skname">${s.name}</span>
      <div class="skbar"><div class="skfill" style="width:${Math.min(100, s.xp/need*100)}%"></div></div>
      <span class="sklvl">niv ${s.lvl}</span>`;
    elSkills.appendChild(r);
  }
  // équipement
  for(const c of elEquip.querySelectorAll(".eqslot")){
    const cur = equip[c.dataset.k];
    c.innerHTML = cur ? `<span class="ic" style="background-image:url(${ICON[cur.id]})"></span>` : "";
    c.classList.toggle("filled", !!cur);
  }
  // stats (force, défense, vie)
  elStats.innerHTML = `<span>⚔ Force : <b>${statForce()}</b></span>
    <span>🪓 Bûcheronnage : <b>${statForceBois()}</b></span>
    <span>🛡 Défense : <b>${statDefense()}</b></span>
    <span>♥ <b>${player.hp}/${player.maxHp}</b></span>`;
  // poids
  const w = totalWeight(), wm = maxWeight();
  elWeightTxt.textContent = `${w.toFixed(1)} / ${wm}` + (w>wm ? " — surchargé !" : "");
  elWeightFill.style.width = Math.min(100, w/wm*100)+"%";
  elWeightFill.style.background = w>wm ? "#c0473f" : "#79c061";
  // recettes
  elRecipes.innerHTML = "";
  for(const rec of RECIPES){
    const r = document.createElement("div"); r.className="recipe";
    r.innerHTML = `<span class="sw" style="background-image:url(${ICON[Object.keys(rec.gives)[0]]});width:16px;height:16px"></span>
      <span><b>${rec.label}</b><br><span style="opacity:.65">${costText(rec.cost)}</span></span>`;
    const b = document.createElement("button");
    b.textContent = "Fabriquer"; b.disabled = !canCraft(rec);
    b.onclick = ()=>craft(rec);
    r.appendChild(b);
    elRecipes.appendChild(r);
  }
  // bouton "poser un feu" si on en a
  if(countItem("feu")>0){
    const r = document.createElement("div"); r.className="recipe";
    r.innerHTML = `<span>🔥 Tu as un feu de camp prêt.</span>`;
    const b = document.createElement("button");
    b.textContent = "Poser (F)";
    b.onclick = ()=>{ toggleInv(false); placeFire(); };
    r.appendChild(b);
    elRecipes.appendChild(r);
  }
}
function toggleInv(force){
  const open = force!==undefined ? force : !elInv.classList.contains("open");
  if(!open && held){   // on referme avec un objet en main : on le range (ou on le lâche)
    const left = addItem(held.id, held.qty);
    if(left>0) dropOnGround(held.id, left);
    held=null; updateHeld();
  }
  elInv.classList.toggle("open", open);
  elTip.style.display="none";
  if(open) refreshUI();
}
document.getElementById("closeInv").onclick = ()=>toggleInv(false);

