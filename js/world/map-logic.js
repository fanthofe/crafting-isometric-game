"use strict";
/* Logique du monde : cible la plus proche, action principale, feu de camp. */

function _getBestBoat(){
  const boats = ["waka_taua","proa","vaa_balancier","pirogue","radeau"];
  for(const b of boats) if(countItem(b)>0) return b;
  return null;
}

function _isAdjacentToWater(){
  const ix=Math.floor(player.x), iy=Math.floor(player.y);
  return [[0,1],[0,-1],[1,0],[-1,0]].some(([dx2,dy2])=>ground[iy+dy2]?.[ix+dx2]===3);
}

function nearestTarget(){
  let best=null, bd=REACH;
  for(const d of decor){
    const hittable = ((d.type==="tree"||d.type==="rock"||d.type==="palmier") && d.alive)
                   || d.type==="fruittree" || DESTRUCTIBLE.has(d.type);
    if(!hittable) continue;
    const dist = Math.hypot(d.tx+0.5-player.x, d.ty+0.5-player.y);
    if(dist<bd){ bd=dist; best={kind:"decor", d}; }
  }
  for(const a of animals){
    if(a.dead) continue;
    const dist = Math.hypot(a.x-player.x, a.y-player.y);
    if(dist<bd){ bd=dist; best={kind:"animal", a}; }
  }
  for(const k of kobolds){
    if(k.dead) continue;
    const dist = Math.hypot(k.x-player.x, k.y-player.y);
    if(dist<bd){ bd=dist; best={kind:"kobold", k}; }
  }
  // Prédateurs marins : attaquables depuis un bateau
  if(player.boat) for(const sp of seaPredators){
    if(sp.dead) continue;
    const dist = Math.hypot(sp.x-player.x, sp.y-player.y);
    if(dist<bd){ bd=dist; best={kind:"seapred", sp}; }
  }
  return best;
}

function doAction(){
  if(build.active){ tryPlaceBuild(); return; }   // mode construction : E valide la pose
  if(player.swing>0) return;
  if(craftStation!==null) return;   // fenêtre de fabrication ouverte : E ne frappe pas

  // En bateau : prise du poisson ou lancer de ligne
  if(player.boat){
    if(fishing.state==="bite"){
      fishing.state=null;
      player.swing=SWING_TIME;
      resolveFish();
      return;
    }
    const tgtSea = nearestTarget();
    if(tgtSea && tgtSea.kind==="seapred"){
      player.swing=SWING_TIME;
      hitSeaPredator(tgtSea.sp);
      return;
    }
    if(!fishing.state){
      castLine();
      player.swing=SWING_TIME;
    }
    return;
  }

  // Embarquement : adjacent à l'eau + bateau en inventaire
  if(!player.boat && _isAdjacentToWater()){
    const boat = _getBestBoat();
    if(boat){
      player.boat = boat;
      player._wasOnWater = false;
      player.swing = SWING_TIME;
      const ps2 = toScreen(player.x, player.y);
      floats.push({sx:ps2.x, sy:ps2.y-26, t:1.8, str:`Embarqué : ${ITEMS[boat].name}`, c:"#4a8fa0"});
      return;
    }
  }

  // Atelier posé devant le joueur : ouvrir sa fenêtre de fabrication (pas de coup)
  const st = nearestStation();
  if(st){ openStationCraft(st); return; }

  const tgt = nearestTarget();
  player.swing = SWING_TIME;
  if(!tgt) return;
  if(tgt.kind==="animal"){ hitAnimal(tgt.a); return; }
  if(tgt.kind==="kobold"){ hitKobold(tgt.k); return; }
  if(tgt.kind==="seapred"){ hitSeaPredator(tgt.sp); return; }
  const t = tgt.d;
  const s = toScreen(t.tx+0.5, t.ty+0.5), p = toScreen(player.x, player.y);
  player.dir = (s.x < p.x) ? "left" : "right";
  t.shake=0.25;
  const sp = toScreen(t.tx+0.5, t.ty+0.5);
  if(DESTRUCTIBLE.has(t.type)){ damageBarrier(t, statForce()); return; }   // démolir sa propre barrière
  if(t.type==="fruittree"){
    if(t.fruits>0){
      const id = FRUIT_KINDS[t.kind].fruit;
      const n = t.fruits + Math.floor((SKILLS.cueillette.lvl-1)/3);
      t.fruits = 0; t.regrowF = 30 + rnd()*20;
      const left = addItem(id, n);
      if(left>0) dropOnGround(id, left);
      gainXP("cueillette", 2);
      refreshUI();
      floats.push({sx:sp.x, sy:sp.y-34, t:1.4, str:`+${n} ${ITEMS[id].name.toLowerCase()}`, c:ITEMS[id].c});
      burst(sp.x, sp.y-24, FRUIT_KINDS[t.kind].fc, 8);
    } else {
      floats.push({sx:sp.x, sy:sp.y-30, t:1.1, str:"rien à cueillir…", c:"#8a3030"});
    }
    return;
  }
  if(t.type==="palmier"){
    t.hp -= statForceBois();
    gainXP("bucheron", 1);
    burst(sp.x, sp.y-18, "#c4a46a", 6);
    if(t.fruits>0){
      const nc = Math.min(t.fruits, 1 + Math.floor((SKILLS.cueillette.lvl-1)/3));
      t.fruits -= nc;
      if(t.regrowF<=0) t.regrowF = 40 + rnd()*20;
      const left = addItem("noix_coco", nc);
      if(left>0) dropOnGround("noix_coco", left);
      gainXP("cueillette", 2);
      refreshUI();
      floats.push({sx:sp.x, sy:sp.y-34, t:1.4, str:`+${nc} noix de coco`, c:ITEMS.noix_coco.c});
    }
    if(t.hp<=0){
      t.alive=false; t.regrow=50+rnd()*20; t.hp=2; t.fruits=2;
      blocked[t.ty][t.tx]=false;
      const nf = 2 + Math.floor(Math.random()*3) + Math.floor((SKILLS.bucheron.lvl-1)/2);
      const left = addItem("fibre_coco", nf);
      if(left>0) dropOnGround("fibre_coco", left);
      gainXP("bucheron", 3);
      refreshUI();
      floats.push({sx:sp.x, sy:sp.y-30, t:1.4, str:`+${nf} fibre de coco`, c:ITEMS.fibre_coco.c});
      burst(sp.x, sp.y-14, "#c4a46a", 10);
    }
    return;
  }
  if(t.type==="tree"){
    t.hp -= statForceBois();
    gainXP("bucheron", 1);
    burst(sp.x, sp.y-18, "#8a6240", 6);
    if(t.hp<=0){
      const es = ESSENCES[t.v];
      t.alive=false; t.regrow=40+rnd()*20; t.hp=es.hp;
      blocked[t.ty][t.tx]=false;
      const n = es.yield[0] + Math.floor(Math.random()*(es.yield[1]-es.yield[0]+1))
              + Math.floor((SKILLS.bucheron.lvl-1)/2);
      const left = addItem("bois", n);
      if(left>0) dropOnGround("bois", left);
      gainXP("bucheron", 3);
      refreshUI();
      floats.push({sx:sp.x, sy:sp.y-30, t:1.4, str:`+${n} bois (${es.name})`, c:"#5f4128"});
      burst(sp.x, sp.y-14, "#4ea75d", 10);
    }
  } else {
    t.hp--;
    burst(sp.x, sp.y-4, "#c4cacd", 6);
    if(t.hp<=0){
      t.alive=false; t.regrow=55+rnd()*20; t.hp=2;
      blocked[t.ty][t.tx]=false;
      const n = 1 + (Math.random()<0.5?1:0);
      const left = addItem("pierre", n);
      if(left>0) dropOnGround("pierre", left);
      refreshUI();
      floats.push({sx:sp.x, sy:sp.y-16, t:1.4, str:`+${n} pierre`, c:"#4a5358"});
    }
  }
}
/* ── Stations posables : item → type de décor dans le monde ── */
const PLACEABLES = {
  feu:              "fire",
  marmite:          "marmite",
  etabli:           "etabli",
  atelier_taille:   "atelier_taille",
  atelier_alchimie: "atelier_alchimie",
  embarcadere:      "embarcadere",
  // défenses : le type de décor = l'id de l'objet
  cloture_bois:     "cloture_bois",
  palissade:        "palissade",
  mur_basalte:      "mur_basalte",
  portail_bois:     "portail_bois",
  pieu_piege:       "pieu_piege",
  filet_chasse:     "filet_chasse",
};
/* Murs/portails : bloquent + ont des PV ; pièges : ne bloquent pas, se déclenchent. */
const DESTRUCTIBLE = new Set(["cloture_bois","palissade","mur_basalte","portail_bois"]);
const TRAP_DECOR   = new Set(["pieu_piege","filet_chasse"]);
/* Types de décor reconnus comme stations de fabrication (pour l'interaction). */
const STATION_KINDS = {
  fire:"feu", marmite:"marmite", etabli:"etabli",
  atelier_taille:"atelier_taille", atelier_alchimie:"atelier_alchimie",
  embarcadere:"embarcadere",
};

function _flash(msg){
  const ps = toScreen(player.x, player.y);
  floats.push({sx:ps.x, sy:ps.y-22, t:1.2, str:msg, c:"#8a3030"});
}

/* Pose n'importe quelle station sur la case devant le joueur. */
function placeBuildable(itemId){
  const decorType = PLACEABLES[itemId];
  if(!decorType) return false;
  if(countItem(itemId)<=0){ _flash(`pas de ${ITEMS[itemId].name.toLowerCase()}`); refreshUI(); return false; }

  const DIRV = { up:[-0.75,-0.75], down:[0.75,0.75], left:[-0.75,0.75], right:[0.75,-0.75] };
  const v = DIRV[player.dir];
  const tx = Math.floor(player.x+v[0]), ty = Math.floor(player.y+v[1]);
  if(tx<0||ty<0||tx>=MAP||ty>=MAP || blocked[ty][tx]){ _flash("pas la place ici"); return false; }

  const onWater = ground[ty][tx]===3;
  if(itemId==="embarcadere"){
    if(onWater){ _flash("pose-le sur la rive"); return false; }
    const nearWater = [[0,1],[0,-1],[1,0],[-1,0]].some(([dx,dy])=>ground[ty+dy]?.[tx+dx]===3);
    if(!nearWater){ _flash("doit toucher l'eau"); return false; }
  } else if(onWater){ _flash("pas la place ici"); return false; }

  removeItem(itemId,1); refreshUI();
  const nd = {type:decorType, tx, ty};
  if(decorType==="fire") nd.ph=Math.random()*6.28;
  decor.push(nd);
  blocked[ty][tx]=true;
  const sp = toScreen(tx+0.5, ty+0.5);
  burst(sp.x, sp.y-6, decorType==="fire"?"#e8743f":"#c8a050", 8);
  return true;
}
function placeFire(){ startBuild("feu"); }   // F : raccourci vers le mode construction (feu)

/* Station de fabrication la plus proche, à portée d'interaction. */
function nearestStation(){
  let best=null, bd=1.7;
  for(const d of decor){
    if(!(d.type in STATION_KINDS)) continue;
    const dist = Math.hypot(d.tx+0.5-player.x, d.ty+0.5-player.y);
    if(dist<bd){ bd=dist; best=d; }
  }
  return best;
}

/* Une marmite ne cuisine que collée à un feu actif (4-voisinage). */
function marmiteActive(d){
  return decor.some(o=>o.type==="fire" && Math.abs(o.tx-d.tx)+Math.abs(o.ty-d.ty)===1);
}

/* Un atelier requis est-il à portée du joueur ? (déblocage des constructions gatées) */
function hasWorkshopNearby(reqId){
  return decor.some(d=>d.type===reqId && Math.hypot(d.tx+0.5-player.x, d.ty+0.5-player.y) <= 6);
}

/* ════════════════════════════════════════════════════════════════
   MODE CONSTRUCTION — pose au fantôme (devant le joueur, coût à la pose)
   ════════════════════════════════════════════════════════════════ */
const build = { active:false, item:null, rot:0 };

/* Recette par id d'objet produit (pour le coût). */
const RECIPE_BY_ID = Object.fromEntries(RECIPES.map(r => [Object.keys(r.gives)[0], r]));

/* Empreintes au sol (offsets de tuiles avant rotation). Défaut : 1×1. */
const FOOT = {
  embarcadere: [[0,0],[0,1]],
};
function footOf(item, rot){
  let f = (FOOT[item] || [[0,0]]).map(o => o.slice());
  for(let i=0; i<(rot&3); i++) f = f.map(([dx,dy]) => [-dy, dx]);   // rotation 90°
  return f;
}

/* Tuile devant le joueur (ancre de l'empreinte). */
function buildAnchor(){
  const DIRV = { up:[-0.75,-0.75], down:[0.75,0.75], left:[-0.75,0.75], right:[0.75,-0.75] };
  const v = DIRV[player.dir];
  return { tx: Math.floor(player.x+v[0]), ty: Math.floor(player.y+v[1]) };
}
function buildTiles(){
  const a = buildAnchor();
  return footOf(build.item, build.rot).map(([dx,dy]) => ({tx:a.tx+dx, ty:a.ty+dy}));
}

/* Une tuile peut-elle accueillir cette construction ? */
function tilePlaceable(item, tx, ty){
  if(tx<0||ty<0||tx>=MAP||ty>=MAP) return false;
  if(blocked[ty][tx]) return false;
  const onWater = ground[ty][tx]===3;
  if(item==="embarcadere"){ if(onWater) return false; }   // l'embarcadère se pose sur la terre
  else if(onWater) return false;
  if(Math.floor(player.x)===tx && Math.floor(player.y)===ty) return false;
  for(const a of animals) if(!a.dead && Math.floor(a.x)===tx && Math.floor(a.y)===ty) return false;
  for(const k of kobolds) if(!k.dead && Math.floor(k.x)===tx && Math.floor(k.y)===ty) return false;
  return true;
}

/* Verdict global vert/rouge du fantôme courant. */
function buildValid(){
  if(!build.active || !build.item) return false;
  const tiles = buildTiles();
  if(!tiles.every(t => tilePlaceable(build.item, t.tx, t.ty))) return false;
  if(build.item==="embarcadere"){
    const touchesWater = tiles.some(t =>
      [[0,1],[0,-1],[1,0],[-1,0]].some(([dx,dy]) => ground[t.ty+dy]?.[t.tx+dx]===3));
    if(!touchesWater) return false;
  }
  const r = RECIPE_BY_ID[build.item];
  if(r && !canCraft(r)) return false;
  return true;
}

function startBuild(item){
  if(gameMode!=="explore") return;
  if(!PLACEABLES[item]) return;
  build.active = true; build.item = item; build.rot = 0;
  closeCraft();
  if(typeof closeBuildMenu==="function") closeBuildMenu();
  if(elInv.classList.contains("open")) toggleInv(false);
}
function cancelBuild(){ build.active = false; build.item = null; }
function rotateBuild(){ if(build.active) build.rot = (build.rot+1) & 3; }

/* Validation de la pose (E / clic / bouton ✓). Reste en mode pour la pose en série. */
function tryPlaceBuild(){
  if(!build.active) return;
  if(!buildValid()){
    const r = RECIPE_BY_ID[build.item];
    _flash(r && !canCraft(r) ? "matériaux manquants" : "pas la place ici");
    return;
  }
  const r = RECIPE_BY_ID[build.item];
  for(const [k,n] of Object.entries(r.cost)) removeItem(k,n);   // coût consommé à la pose
  const tiles = buildTiles();
  const anchor = tiles[0];
  const decorType = PLACEABLES[build.item];
  const nd = { type:decorType, tx:anchor.tx, ty:anchor.ty };
  if(decorType==="fire") nd.ph = Math.random()*6.28;
  if(DESTRUCTIBLE.has(decorType)) nd.hp = ITEMS[build.item].placeHp;   // PV des murs/portails
  if(tiles.length>1) nd.foot = tiles.map(t => [t.tx, t.ty]);
  decor.push(nd);
  if(!TRAP_DECOR.has(decorType)) for(const t of tiles) blocked[t.ty][t.tx] = true;  // pièges = non bloquants
  refreshUI();
  const sp = toScreen(anchor.tx+0.5, anchor.ty+0.5);
  burst(sp.x, sp.y-6, decorType==="fire" ? "#e8743f" : "#c8a050", 8);
}

/* ── Barrières destructibles ── */
function barrierAt(tx, ty){
  return decor.find(d => DESTRUCTIBLE.has(d.type) && d.tx===tx && d.ty===ty) || null;
}
function damageBarrier(d, dmg){
  d.hp -= dmg; d.shake = 0.2;
  const s = toScreen(d.tx+0.5, d.ty+0.5);
  burst(s.x, s.y-6, "#8a6240", 5);
  if(d.hp<=0){
    blocked[d.ty][d.tx] = false;
    const i = decor.indexOf(d); if(i>=0) decor.splice(i,1);
    burst(s.x, s.y-6, "#6b4a2d", 12);
  }
}
/* Un kobold chargeur bloqué par une barrière la ronge (sur cooldown). */
function kobAttackBarrier(k, fx, fy){
  if(k.state!=="charge" || k.atkCd>0) return;
  const b = barrierAt(Math.floor(fx), Math.floor(fy));
  if(!b) return;
  damageBarrier(b, KOBOLD_TYPES[k.type].dmg);
  k.atkCd = 1.0;
  const ks = toScreen(k.x, k.y);
  floats.push({sx:ks.x, sy:ks.y-12, t:0.6, str:"*gnac*", c:"#8a6240"});
}

/* ── Pièges au sol (déclenchés par les kobolds qui marchent dessus) ── */
function checkTraps(){
  for(let i=decor.length-1; i>=0; i--){
    const d = decor[i];
    if(d.type!=="pieu_piege" && d.type!=="filet_chasse") continue;
    const k = kobolds.find(e => !e.dead && !e.netT && Math.floor(e.x)===d.tx && Math.floor(e.y)===d.ty);
    if(!k) continue;
    const s = toScreen(d.tx+0.5, d.ty+0.5);
    if(d.type==="pieu_piege"){
      k.hp -= 5; k.hurtT = 0.3; k.alertT = 3; k.state = "charge"; k.t = 5;
      floats.push({sx:s.x, sy:s.y-12, t:1, str:"-5", c:"#c0473f"});
      burst(s.x, s.y-6, "#c0473f", 8);
      decor.splice(i,1);
      if(k.hp<=0) killKobold(k);
    } else {                                   // filet : immobilise, récupérable
      k.netT = 8;
      floats.push({sx:s.x, sy:s.y-12, t:1.2, str:"pris au filet !", c:"#c4a46a"});
      burst(s.x, s.y-6, "#c4a46a", 6);
      decor.splice(i,1);
      groundItems.push({id:"filet_chasse", qty:1, x:d.tx+0.5, y:d.ty+0.5, ph:Math.random()*6.28, cool:1});
    }
  }
}
