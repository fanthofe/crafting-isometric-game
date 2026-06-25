"use strict";
/* Interface DOM : grille inventaire, équipement, fabrication par onglets. */

const elInv          = document.getElementById("inv");
const elGrid         = document.getElementById("grid");
const elEquip        = document.getElementById("equipRow");
const elWeightTxt    = document.getElementById("weightTxt");
const elWeightFill   = document.getElementById("weightFill");
const elStats        = document.getElementById("statsRow");

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
document.getElementById("handCraftBtn").addEventListener("click", ()=>openHandCraft());

/* ─── Onglets (inventaire / compétences) ─── */
function switchTab(name){
  if(name === "craft") name = "inv";   // l'onglet craft n'existe plus
  activeTab = name;
  document.querySelectorAll(".itab").forEach(b => b.classList.toggle("active", b.dataset.tab===name));
  document.querySelectorAll(".itabpanel").forEach(p => {
    p.style.display = p.dataset.panel === name ? "flex" : "none";
  });
}
document.querySelectorAll(".itab").forEach(b => b.addEventListener("click", ()=>switchTab(b.dataset.tab)));

/* ════════════════════════════════════════════════════════════════
   Fabrication diégétique : une fenêtre par outil de construction.
   Plus aucune recette dans l'inventaire — on craft AU pied de l'outil.
   ════════════════════════════════════════════════════════════════ */
const elCraftWin     = document.getElementById("craftWin");
const elCraftTitle   = document.getElementById("craftWinTitle");
const elCraftSub     = document.getElementById("craftWinSub");
const elCraftRecipes = document.getElementById("craftRecipes");

let craftStation = null;  // null = fermé ; "" = mains nues ; sinon id d'outil
let craftCold    = false; // marmite sans feu actif

const STATION_LABELS = {
  "":               {title:"ARTISANAT — MAINS NUES", sub:"Survie & constructions à poser"},
  feu:              {title:"FEU DE CAMP",            sub:"Grillades"},
  marmite:          {title:"MARMITE",                sub:"Cuisine élaborée"},
  etabli:           {title:"ÉTABLI",                 sub:"Armes, outils & matériaux"},
  atelier_taille:   {title:"ATELIER DE TAILLE",      sub:"Pierre noble & armes lunaires"},
  atelier_alchimie: {title:"ATELIER D'ALCHIMIE",     sub:"Potions & bombes"},
  embarcadere:      {title:"EMBARCADÈRE",            sub:"Grands navires & harpon"},
};

function openHandCraft(){ if(gameMode==="explore") openCraft(""); }

function openStationCraft(d){
  const id = STATION_KINDS[d.type];
  craftCold = (id === "marmite" && !marmiteActive(d));
  openCraft(id);
}

function openCraft(stationId){
  if(elInv.classList.contains("open")) toggleInv(false);
  if(stationId !== "marmite") craftCold = false;
  craftStation = stationId;
  const meta = STATION_LABELS[stationId] || {title:"FABRICATION", sub:""};
  elCraftTitle.textContent = meta.title;
  elCraftSub.textContent   = craftCold ? "⚠ marmite froide — allume un feu juste à côté" : meta.sub;
  elCraftWin.classList.add("open");
  elTip.style.display = "none";
  renderCraftWin();
}

function closeCraft(){ craftStation = null; elCraftWin.classList.remove("open"); }

function renderCraftWin(){
  if(craftStation === null) return;
  // Les constructions (objets posables) passent par le mode construction, pas par le craft.
  const list = RECIPES.filter(r => {
    if(PLACEABLES[Object.keys(r.gives)[0]]) return false;
    return craftStation === "" ? !r.req : r.req === craftStation;
  });
  elCraftRecipes.innerHTML = "";
  for(const rec of list){
    const avail = !craftCold && canCraft(rec);
    const card = document.createElement("div");
    card.className = "rcard " + (avail ? "rcavail" : "rccant");
    const iconId = Object.keys(rec.gives)[0];
    const costStr = Object.entries(rec.cost).map(([k,n]) => `${n}×${ITEMS[k].name.split(" ")[0]}`).join(" ");
    card.innerHTML = `<span class="ricon" style="background-image:url(${ICON[iconId]})"></span>
      <span class="rname">${rec.label}</span>
      <span class="rcost">${costStr}</span>`;
    const b = document.createElement("button");
    b.className = "rbtn"; b.textContent = "Fabriquer"; b.disabled = !avail;
    b.addEventListener("click", ()=>{ craft(rec); renderCraftWin(); });
    card.appendChild(b);
    elCraftRecipes.appendChild(card);
  }
  if(elCraftRecipes.children.length === 0){
    elCraftRecipes.innerHTML = `<span style="font-size:11px;color:#6a5a3a;padding:10px;align-self:center">Aucune recette ici.</span>`;
  }
}
document.getElementById("closeCraftWin").onclick = ()=>closeCraft();

/* ════════════════════════════════════════════════════════════════
   Menu de construction : choisir une construction → entrer en mode fantôme.
   ════════════════════════════════════════════════════════════════ */
const elBuildWin  = document.getElementById("buildWin");
const elBuildList = document.getElementById("buildList");

const BUILD_GROUPS = [
  {label:"ATELIERS", items:["feu","etabli","marmite","atelier_alchimie","atelier_taille","embarcadere"]},
];

function toggleBuildMenu(){
  if(elBuildWin.classList.contains("open")) closeBuildMenu();
  else openBuildMenu();
}
function openBuildMenu(){
  if(gameMode!=="explore") return;
  cancelBuild(); closeCraft();
  if(elInv.classList.contains("open")) toggleInv(false);
  elBuildWin.classList.add("open");
  elTip.style.display = "none";
  renderBuildMenu();
}
function closeBuildMenu(){ elBuildWin.classList.remove("open"); }

function renderBuildMenu(){
  elBuildList.innerHTML = "";
  for(const grp of BUILD_GROUPS){
    const h = document.createElement("div");
    h.className = "seclabel"; h.style.width = "100%"; h.textContent = grp.label;
    elBuildList.appendChild(h);
    for(const id of grp.items){
      const r = RECIPE_BY_ID[id]; if(!r) continue;
      const reqOK = !r.req || hasWorkshopNearby(r.req);
      const ok = reqOK && canCraft(r);
      const card = document.createElement("div");
      card.className = "rcard " + (ok ? "rcavail" : "rccant");
      const costStr = Object.entries(r.cost).map(([k,n]) => `${n}×${ITEMS[k].name.split(" ")[0]}`).join(" ");
      const sub = !reqOK ? `⚑ près d'un ${ITEMS[r.req].name.split(" ")[0].toLowerCase()}` : costStr;
      card.innerHTML = `<span class="ricon" style="background-image:url(${ICON[id]})"></span>
        <span class="rname">${ITEMS[id].name}</span>
        <span class="rcost">${sub}</span>`;
      const b = document.createElement("button");
      b.className = "rbtn"; b.textContent = "Construire"; b.disabled = !ok;
      b.addEventListener("click", ()=>{ startBuild(id); });
      card.appendChild(b);
      elBuildList.appendChild(card);
    }
  }
}
document.getElementById("closeBuildWin").onclick = ()=>closeBuildMenu();

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
}

function toggleInv(force){
  const open = force !== undefined ? force : !elInv.classList.contains("open");
  if(!open && held){
    const left = addItem(held.id, held.qty);
    if(left>0) dropOnGround(held.id, left);
    held = null; updateHeld();
  }
  if(open) closeCraft();   // l'inventaire et la fabrication ne cohabitent pas
  elInv.classList.toggle("open", open);
  elTip.style.display = "none";
  if(open){ switchTab(activeTab); refreshUI(); }
}
