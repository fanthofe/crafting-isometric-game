"use strict";
/* Interface DOM : grille inventaire, équipement, fabrication par onglets. */

const elInv          = document.getElementById("inv");
const elGrid         = document.getElementById("grid");
const elRecipes      = document.getElementById("invRecipes");
const elEquip        = document.getElementById("equipRow");
const elWeightTxt    = document.getElementById("weightTxt");
const elWeightFill   = document.getElementById("weightFill");
const elStats        = document.getElementById("statsRow");
const elCraftFilters = document.getElementById("craftFilters");

let craftFilter = null; // null = contextuel, "" = main, "etabli"|"marmite"|… = forcé
let activeTab   = "inv";

/* ─── Génère les 36 slots de la grille ─── */
for(let i = 0; i < SLOT_COUNT; i++){
  const d = document.createElement("div");
  d.className = "islot"; d.dataset.i = i;
  elGrid.appendChild(d);
}
function slotAt(e){ const c = e.target.closest(".islot"); return c ? +c.dataset.i : -1; }
elGrid.addEventListener("click",       e=>{ const i=slotAt(e); if(i>=0) onSlot(i,false); });
elGrid.addEventListener("contextmenu", e=>{ const i=slotAt(e); if(i>=0){ e.preventDefault(); onSlot(i,true); } });
elGrid.addEventListener("dblclick",    e=>{ const i=slotAt(e); if(i>=0) useSlot(i); });
elGrid.addEventListener("mouseover",   e=>{ const i=slotAt(e); if(i>=0) showTip(i); });
elGrid.addEventListener("mouseout",    ()=>{ elTip.style.display="none"; });

function onSlot(i, right){
  const s = slots[i];
  if(!held){
    if(!s) return;
    if(right){ const take=Math.ceil(s.qty/2); held={id:s.id,qty:take}; s.qty-=take; if(s.qty<=0) slots[i]=null; }
    else { held=s; slots[i]=null; }
  } else {
    if(!s){
      if(right){ slots[i]={id:held.id,qty:1}; held.qty--; if(held.qty<=0) held=null; }
      else { slots[i]=held; held=null; }
    } else if(s.id===held.id){
      const can = Math.min(right?1:held.qty, ITEMS[s.id].stack - s.qty);
      s.qty+=can; held.qty-=can; if(held.qty<=0) held=null;
    } else if(!right){ slots[i]=held; held=s; }
  }
  refreshUI(); updateHeld(); showTip(i);
}
function useSlot(i){
  const s = slots[i]; if(!s) return;
  const it = ITEMS[s.id];
  if(it.food||it.potion) eatSlot(i);
  else if(it.equip) equipFromGrid(i);
}
function equipFromGrid(i){
  const s = slots[i];
  const k = ITEMS[s.id].equip;
  const cur = equip[k];
  equip[k] = {id:s.id, qty:1};
  s.qty--; if(s.qty<=0){ slots[i]=null; elTip.style.display="none"; }
  if(cur){ const left=addItem(cur.id,1); if(left>0) dropOnGround(cur.id,1); }
  const ps = toScreen(player.x, player.y);
  floats.push({sx:ps.x, sy:ps.y-24, t:1.2, str:`${ITEMS[equip[k].id].name} équipé(e)`, c:"#c8a050"});
  refreshUI();
}
function eatSlot(i){
  const s = slots[i]; if(!s) return;
  const it = ITEMS[s.id];
  const dur = it.food||0, heal = it.heal||(it.food?2:0);
  s.qty--; if(s.qty<=0){ slots[i]=null; elTip.style.display="none"; }
  if(dur>0)  boostT = Math.max(boostT, dur);
  if(heal>0) player.hp = Math.min(player.maxHp, player.hp+heal);
  const ps = toScreen(player.x, player.y);
  const msg = heal>10 ? `+${heal} ♥ · +vitesse` : it.potion ? `${it.name} !` : "miam ! +♥";
  floats.push({sx:ps.x, sy:ps.y-24, t:1.3, str:msg, c:"#c0473f"});
  refreshUI();
}

/* ─── Slots équipement ─── */
const EQUIP_SLOTS = [
  {key:"arme",       label:"ARME",    icon:"⚔"},
  {key:"tete",       label:"TÊTE",    icon:"🪖"},
  {key:"torse",      label:"TORSE",   icon:"🧥"},
  {key:"pieds",      label:"PIEDS",   icon:"👟"},
  {key:"bucheron",   label:"BÛCH.",   icon:"🪓"},
  {key:"minage",     label:"MINAGE",  icon:"⛏"},
  {key:"cueillette", label:"CUEILL.", icon:"🌿"},
  {key:"carquois",   label:"CARQUOIS",icon:"🎯"},
];
for(const es of EQUIP_SLOTS){
  const wrap = document.createElement("div"); wrap.className = "eqwrap";
  wrap.innerHTML = `<span class="eqicon">${es.icon}</span><span class="eqlabel">${es.label}</span><div class="islot eqslot" data-k="${es.key}"></div>`;
  elEquip.appendChild(wrap);
}
function eqKeyAt(e){ const c = e.target.closest(".eqslot"); return c ? c.dataset.k : null; }
elEquip.addEventListener("click",     e=>{ const k=eqKeyAt(e); if(k) onEquipSlot(k); });
elEquip.addEventListener("dblclick",  e=>{ const k=eqKeyAt(e); if(k) unequipSlot(k); });
elEquip.addEventListener("mouseover", e=>{ const k=eqKeyAt(e); if(k) showEquipTip(k); });
elEquip.addEventListener("mouseout",  ()=>{ elTip.style.display="none"; });

function onEquipSlot(k){
  const cur = equip[k];
  if(held){
    if(ITEMS[held.id].equip !== k) return;
    if(held.qty===1){ equip[k]={id:held.id,qty:1}; held=cur; }
    else if(!cur){ equip[k]={id:held.id,qty:1}; held.qty--; }
  } else if(cur){ held=cur; equip[k]=null; }
  refreshUI(); updateHeld();
}
function unequipSlot(k){
  const cur = equip[k]; if(!cur) return;
  equip[k] = null;
  const left = addItem(cur.id,1); if(left>0) dropOnGround(cur.id,1);
  refreshUI(); updateHeld();
}

document.getElementById("dropZone").addEventListener("click", ()=>{
  if(!held) return;
  dropOnGround(held.id, held.qty);
  held=null; updateHeld(); refreshUI();
});
document.getElementById("closeInv").onclick = ()=>toggleInv(false);

/* ─── Onglets ─── */
function switchTab(name){
  activeTab = name;
  document.querySelectorAll(".itab").forEach(b => b.classList.toggle("active", b.dataset.tab===name));
  document.querySelectorAll(".itabpanel").forEach(p => {
    p.style.display = p.dataset.panel === name ? "flex" : "none";
  });
  if(name === "craft") refreshCraft();
}
document.querySelectorAll(".itab").forEach(b => b.addEventListener("click", ()=>switchTab(b.dataset.tab)));

/* ─── Filtres fabrication ─── */
const CRAFT_FILTERS = [
  {filter:null,                label:"AUTO"},
  {filter:"",                  label:"MAIN"},
  {filter:"etabli",            label:"ÉTABLI"},
  {filter:"atelier_taille",    label:"TAILLE"},
  {filter:"atelier_alchimie",  label:"ALCHIMIE"},
  {filter:"marmite",           label:"MARMITE"},
  {filter:"embarcadere",       label:"EMBARCAD."},
];
for(const cf of CRAFT_FILTERS){
  const b = document.createElement("button");
  b.className = "cfbtn" + (cf.filter === null ? " active" : "");
  b.dataset.filter = cf.filter === null ? "__auto__" : cf.filter;
  b.textContent = cf.label;
  b.addEventListener("click", ()=>{
    craftFilter = cf.filter;
    document.querySelectorAll(".cfbtn").forEach(x => {
      const isAuto = x.dataset.filter === "__auto__";
      x.classList.toggle("active", cf.filter === null ? isAuto : x.dataset.filter === cf.filter);
    });
    refreshCraft();
  });
  elCraftFilters.appendChild(b);
}

/* ─── Recettes contextuelles ─── */
function nearbyWorkshop(){
  const ws = new Set();
  const WORKSHOP_TYPES = ["etabli","atelier_taille","atelier_alchimie","marmite","embarcadere"];
  for(const d of decor){
    if(!WORKSHOP_TYPES.includes(d.type)) continue;
    if(Math.hypot(d.tx+0.5-player.x, d.ty+0.5-player.y) <= 6) ws.add(d.type);
  }
  return ws;
}

function recipesToShow(){
  if(craftFilter === null){
    const ws = nearbyWorkshop();
    return RECIPES.filter(r => !r.req || ws.has(r.req));
  }
  if(craftFilter === "") return RECIPES.filter(r => !r.req);
  return RECIPES.filter(r => r.req === craftFilter);
}

function refreshCraft(){
  const list = recipesToShow();
  elRecipes.innerHTML = "";
  for(const rec of list){
    const avail = canCraft(rec);
    const card = document.createElement("div");
    card.className = "rcard " + (avail ? "rcavail" : "rccant");
    const iconId = Object.keys(rec.gives)[0];
    const costStr = Object.entries(rec.cost).map(([k,n]) => `${n}×${ITEMS[k].name.split(" ")[0]}`).join(" ");
    card.innerHTML = `<span class="ricon" style="background-image:url(${ICON[iconId]})"></span>
      <span class="rname">${rec.label}</span>
      <span class="rcost">${costStr}</span>`;
    const b = document.createElement("button");
    b.className = "rbtn"; b.textContent = "Craft"; b.disabled = !avail;
    b.addEventListener("click", ()=>{ craft(rec); refreshUI(); refreshCraft(); });
    card.appendChild(b);
    elRecipes.appendChild(card);
  }
  // Feu de camp posable
  if(countItem("feu") > 0 && (craftFilter === null || craftFilter === "")){
    const card = document.createElement("div"); card.className = "rcard rcavail";
    card.innerHTML = `<span class="ricon" style="font-size:12px;line-height:16px">🔥</span>
      <span class="rname">Feu de camp</span><span class="rcost">prêt à poser</span>`;
    const b = document.createElement("button"); b.className = "rbtn"; b.textContent = "Poser (F)";
    b.addEventListener("click", ()=>{ toggleInv(false); placeFire(); });
    card.appendChild(b);
    elRecipes.appendChild(card);
  }
  if(elRecipes.children.length === 0){
    elRecipes.innerHTML = `<span style="font-size:9px;color:#6a5a3a;padding:8px;align-self:center">Aucune recette disponible ici.</span>`;
  }
}

/* ─── refreshUI : appelée à chaque changement d'état ─── */
function refreshUI(){
  // HUD bar (toujours mis à jour)
  elBar.innerHTML = "";
  for(const [k,it] of Object.entries(ITEMS)){
    const n = countItem(k); if(n<=0) continue;
    const s = document.createElement("div"); s.className = "slot";
    s.innerHTML = `<span class="sw" style="background-image:url(${ICON[k]})"></span>${n}`;
    s.title = it.name;
    elBar.appendChild(s);
  }
  if(!elInv.classList.contains("open")) return;

  // Grille inventaire
  [...elGrid.children].forEach((d,i)=>{
    const s = slots[i];
    d.innerHTML = s
      ? `<span class="ic" style="background-image:url(${ICON[s.id]})"></span>`+(s.qty>1?`<span class="q">${s.qty}</span>`:"")
      : "";
    d.classList.toggle("filled", !!s);
  });

  // Slots équipement
  for(const c of elEquip.querySelectorAll(".eqslot")){
    const cur = equip[c.dataset.k];
    c.innerHTML = cur ? `<span class="ic" style="background-image:url(${ICON[cur.id]})"></span>` : "";
    c.classList.toggle("filled", !!cur);
  }

  // Stats compactes
  elStats.innerHTML =
    `<div class="statline">⚔ <b>${statForce()}</b> · 🛡 <b>${statDefense()}</b></div>` +
    `<div class="statline">🪓 <b>${statForceBois()}</b></div>` +
    `<div class="statline">♥ <b>${player.hp}/${player.maxHp}</b></div>`;

  // Barre de poids
  const w = totalWeight(), wm = maxWeight();
  elWeightTxt.textContent = `${w.toFixed(1)} / ${wm}${w>wm?" ⚠":""}`;
  elWeightFill.style.width = Math.min(100, w/wm*100) + "%";
  elWeightFill.style.background = w>wm ? "#c0473f" : w>wm*.8 ? "#c8a050" : "#5a9050";

  // Compétences (toujours à jour)
  refreshSkills();

  // Fabrication si onglet actif
  if(activeTab === "craft") refreshCraft();
}

function toggleInv(force){
  const open = force !== undefined ? force : !elInv.classList.contains("open");
  if(!open && held){
    const left = addItem(held.id, held.qty);
    if(left>0) dropOnGround(held.id, left);
    held = null; updateHeld();
  }
  elInv.classList.toggle("open", open);
  elTip.style.display = "none";
  if(open){ switchTab(activeTab); refreshUI(); }
}
