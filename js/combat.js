"use strict";
/* Combat RPG tour par tour (type Chrono Trigger) : déclenchement à l'approche
   d'un kobold, placement des combattants, zone éclairée façon Wakfu, menu de
   commandes (Attaquer / Compétences / Défendre / Objets / Fuir), IA, fin de combat. */

/* ====================== État global ====================== */
let gameMode = "explore";          // "explore" | "battle"

const battle = {
  active: false,
  phase: "done",                   // intro | player | enemy | action | victory | defeat | flee | done
  allies: [],
  enemies: [],
  order: [],
  turnIx: -1,
  cursor: 0,
  menu: "root",                    // root | target | skill | item
  pendingSkill: null,
  anchor: null,                    // {x,y} centre de la zone (tuiles)
  radius: 80,                      // rayon écran (px) de la zone de combat
  zoneK: 0,                        // 0..1 facteur d'apparition de la pénombre
  timer: 0,
  banner: null,                    // {text, t}
  actor: null,
  enemyDelay: 0,
};

/* Compétences de combat (≠ SKILLS passifs). Débloquées via le niveau de chasse. */
const TECHNIQUES = {
  coup_puissant: {name:"Coup puissant", cost:1, power:2.0, target:"one"},
  tourbillon:    {name:"Tourbillon",    cost:2, power:1.1, target:"all", reqChasse:3},
};

/* ====================== Outils ====================== */
function combatAll(){ return battle.allies.concat(battle.enemies); }
function combatantAlive(c){ return c.side==="ally" ? player.hp>0 : (!c.ref.dead && c.ref.hp>0); }
function aliveEnemyList(){ return battle.enemies.filter(combatantAlive); }
function availableTechniques(){
  return Object.keys(TECHNIQUES).filter(id=>{ const r=TECHNIQUES[id].reqChasse; return !r || SKILLS.chasse.lvl>=r; });
}
function consumableSlots(){
  const a=[]; for(let i=0;i<slots.length;i++){ const s=slots[i]; if(s && ITEMS[s.id].food) a.push(i); } return a;
}
function clampFree(x,y){
  if(!isBlocked(x,y)) return {x,y};
  for(let r=1;r<=5;r++) for(let a=0;a<8;a++){
    const nx=x+Math.cos(a/8*6.283)*r*0.6, ny=y+Math.sin(a/8*6.283)*r*0.6;
    if(!isBlocked(nx,ny)) return {x:nx,y:ny};
  }
  return {x,y};
}
function floatAt(c,str,col){ const s=toScreen(c.home.x,c.home.y); floats.push({sx:s.x, sy:s.y-24, t:1.1, str, c:col}); }
function miniMsg(str){ battle.banner={text:str, t:0.9}; }

function makeCombatant(ref, side){
  const c = { ref, side, alive:true,
    home:{x:ref.x,y:ref.y}, start:{x:ref.x,y:ref.y},
    anim:{kind:"idle", t:0, dur:0}, lunge:{x:1,y:0}, guard:false };
  if(side==="ally"){
    c.name="Toi"; c.maxHp=player.maxHp;
    c.atk=statForce(); c.def=statDefense(); c.spd=4+(equip.pieds?1:0);
    c.ptMax=3+Math.floor((SKILLS.chasse.lvl-1)/2); c.pt=c.ptMax;
  } else {
    const T=KOBOLD_TYPES[ref.type];
    c.name=T.name; c.maxHp=T.hp; c.atk=T.dmg; c.def=0; c.spd=T.speed;
  }
  return c;
}

/* ====================== Déclenchement ====================== */
function battleTriggerGroup(){
  let trigger=null, bd=TRIGGER_RADIUS;
  for(const k of kobolds){ if(k.dead) continue; const d=Math.hypot(k.x-player.x,k.y-player.y); if(d<bd){ bd=d; trigger=k; } }
  if(!trigger) return null;
  const grp=[];
  for(const k of kobolds){ if(k.dead) continue; if(Math.hypot(k.x-trigger.x,k.y-trigger.y)<3.2) grp.push(k); }
  return grp.slice(0,4);            // 4 ennemis max
}

function startBattle(group){
  if(gameMode!=="explore" || !group || !group.length) return;
  gameMode="battle";
  battle.active=true; battle.phase="intro"; battle.timer=0; battle.zoneK=0;
  battle.menu="root"; battle.cursor=0; battle.pendingSkill=null; battle.actor=null;
  battle.banner={text:"Combat !", t:1.6};
  battle.allies=[ makeCombatant(player,"ally") ];
  battle.enemies=group.map(k=>{ k.inBattle=true; k.vx=k.vy=0; k.state="battle"; k.hurtT=0; return makeCombatant(k,"enemy"); });
  placeCombatants();
  if(raka.visible) spiritSay("raka","En garde !",2.5);
}

function placeCombatants(){
  const en=battle.enemies;
  let ex=0, ey=0; for(const c of en){ ex+=c.ref.x; ey+=c.ref.y; } ex/=en.length; ey/=en.length;
  const ax=(player.x+ex)/2, ay=(player.y+ey)/2;
  battle.anchor={x:ax, y:ay};
  let dx=player.x-ax, dy=player.y-ay; const dl=Math.hypot(dx,dy);
  if(dl<0.3){ dx=1; dy=0; } else { dx/=dl; dy/=dl; }
  const px=-dy, py=dx;               // perpendiculaire
  const allyDist=2.0, enemyDist=2.0, spread=1.35;
  const hero=battle.allies[0];
  hero.start={x:player.x, y:player.y};
  hero.home=clampFree(ax+dx*allyDist, ay+dy*allyDist);
  const n=en.length;
  en.forEach((c,i)=>{
    const off=(i-(n-1)/2)*spread;
    c.start={x:c.ref.x, y:c.ref.y};
    c.home=clampFree(ax-dx*enemyDist+px*off, ay-dy*enemyDist+py*off);
  });
  const a=toScreen(ax,ay); let R=0;
  for(const c of combatAll()){ const s=toScreen(c.home.x,c.home.y); R=Math.max(R, Math.hypot(s.x-a.x,s.y-a.y)); }
  battle.radius=R+BATTLE_ZONE_MARGIN;
}

/* ====================== Boucle de combat ====================== */
function updateBattle(dt, t){
  if(battle.banner && (battle.banner.t-=dt)<=0) battle.banner=null;
  applyPositions();
  const ph=battle.phase;
  if(ph==="intro"){
    battle.zoneK=Math.min(1, battle.zoneK+dt*BATTLE_ZONE_FADE);
    battle.timer+=dt;
    if(battle.timer>=0.6){ buildOrder(); startTurn(); }
  } else if(ph==="enemy"){
    battle.enemyDelay-=dt;
    if(battle.enemyDelay<=0) enemyAct();
  } else if(ph==="action"){
    stepAction(dt);
  } else if(ph==="victory" || ph==="defeat" || ph==="flee"){
    battle.zoneK=Math.max(0, battle.zoneK-dt*BATTLE_ZONE_FADE);
    battle.timer-=dt;
    if(battle.timer<=0) finishBattle();
  }
  // ph==="player" : on attend l'input (listeners)
}

function applyPositions(){
  const intro=battle.phase==="intro";
  const k=Math.min(1, battle.timer/0.6);
  for(const c of combatAll()){
    if(c.side==="enemy" && c.ref.dead) continue;
    let bx=c.home.x, by=c.home.y;
    if(intro){ bx=c.start.x+(c.home.x-c.start.x)*k; by=c.start.y+(c.home.y-c.start.y)*k; }
    else if(c.anim.kind==="lunge"){
      const u=c.anim.dur?c.anim.t/c.anim.dur:1, bump=Math.sin(Math.min(1,u)*Math.PI)*0.6;
      bx+=c.lunge.x*bump; by+=c.lunge.y*bump;
    }
    c.ref.x=bx; c.ref.y=by;
  }
}

function buildOrder(){
  battle.order=combatAll().slice().sort((a,b)=>b.spd-a.spd);
  battle.turnIx=-1;
}

function startTurn(){
  if(!battle.enemies.some(combatantAlive)){ beginEnd("victory","Victoire !"); return; }
  if(player.hp<=0){ beginEnd("defeat","Vaincu…"); return; }
  let guard=0;
  do { battle.turnIx=(battle.turnIx+1)%battle.order.length; guard++; }
  while(!combatantAlive(battle.order[battle.turnIx]) && guard<=battle.order.length);
  const c=battle.order[battle.turnIx];
  c.guard=false;                     // la garde tombe au tour suivant du défenseur
  if(c.side==="ally"){ battle.phase="player"; battle.menu="root"; battle.cursor=0; battle.pendingSkill=null; }
  else { battle.phase="enemy"; battle.enemyDelay=0.45; }
}

function beginEnd(kind, text){
  battle.phase=kind; battle.banner={text, t:2.2}; battle.timer=0.7;
  if(kind==="victory" && raka.visible) spiritSay("raka","Bien joué.",3);
}

function startLunge(actor, target, onHit){
  const a=toScreen(actor.home.x,actor.home.y), b=toScreen(target.home.x,target.home.y);
  const face = b.x<a.x ? -1 : 1;
  if(actor.side==="ally") player.dir = face<0 ? "left" : "right";
  else actor.ref.flip = face<0;
  let dx=target.home.x-actor.home.x, dy=target.home.y-actor.home.y; const l=Math.hypot(dx,dy)||1;
  actor.lunge={x:dx/l, y:dy/l};
  actor.anim={kind:"lunge", t:0, dur:0.5};
  actor._onHit=onHit; actor._hit=false;
  battle.actor=actor; battle.phase="action";
}

function stepAction(dt){
  const c=battle.actor; if(!c){ startTurn(); return; }
  c.anim.t+=dt;
  if(!c._hit && c.anim.t>=c.anim.dur*0.45){ c._hit=true; if(c._onHit) c._onHit(); }
  if(c.anim.t>=c.anim.dur){ c.anim={kind:"idle",t:0,dur:0}; c._onHit=null; battle.actor=null; startTurn(); }
}

function enemyAct(){
  const c=battle.order[battle.turnIx];
  if(!combatantAlive(c)){ startTurn(); return; }
  const target=battle.allies[0];
  startLunge(c, target, ()=>applyAttack(c, target));
}

/* ====================== Dégâts ====================== */
function applyAttack(src, dst, mult){
  mult=mult||1;
  let dmg=Math.max(1, Math.round(src.atk*mult - dst.def + (Math.random()<0.2?1:0)));
  if(dst.guard) dmg=Math.ceil(dmg/2);
  const crit=Math.random()<0.06; if(crit) dmg=Math.round(dmg*1.6);
  dealDamage(dst, dmg, crit);
}
function dealDamage(dst, dmg, crit){
  const s=toScreen(dst.home.x, dst.home.y);
  if(dst.side==="ally"){
    player.hp=Math.max(0, player.hp-dmg); player.hurtT=0.6;
    if(elInv.classList.contains("open")) refreshUI();
  } else {
    dst.ref.hp-=dmg; dst.ref.hurtT=0.4;
  }
  floats.push({sx:s.x, sy:s.y-22, t:1.1, str:(crit?"CRIT ":"")+`-${dmg}`, c:dst.side==="ally"?"#ff6a5a":"#ffe27a"});
  burst(s.x, s.y-8, dst.side==="ally"?"#c0473f":"#8ab0c8", crit?10:6);
  if(dst.side!=="ally" && dst.ref.hp<=0) koEnemy(dst);
}
function koEnemy(c){
  const k=c.ref, T=KOBOLD_TYPES[k.type];
  gainXP("chasse", T.xp);
  for(const [id,[mn,mx]] of Object.entries(T.drops)){
    const n=mn+Math.floor(Math.random()*(mx-mn+1));
    if(n>0) groundItems.push({id, qty:n, x:k.x+(Math.random()-0.5)*0.6, y:k.y+(Math.random()-0.5)*0.6, ph:Math.random()*6.28, cool:0.6});
  }
  const s=toScreen(k.x,k.y);
  floats.push({sx:s.x, sy:s.y-18, t:1.4, str:`${T.name} vaincu !`, c:"#6080a0"});
  burst(s.x, s.y-4, "#4a6a88", 10);
  k.dead=true; k.respawn=60+Math.random()*40; k.inBattle=false;
}

/* ====================== Commandes du joueur ====================== */
function battleMenuItems(){
  if(battle.menu==="root")   return ["Attaquer","Compétences","Défendre","Objets","Fuir"];
  if(battle.menu==="target") return aliveEnemyList().map(c=>`${c.name} (${c.ref.hp})`);
  if(battle.menu==="skill")  return availableTechniques().map(id=>`${TECHNIQUES[id].name}  ${TECHNIQUES[id].cost} PT`);
  if(battle.menu==="item")   return consumableSlots().map(i=>`${ITEMS[slots[i].id].name} ×${slots[i].qty}`);
  return [];
}
function battleInput(b){
  if(b.back){
    if(battle.menu!=="root"){ battle.menu="root"; battle.cursor=0; battle.pendingSkill=null; }
    return;
  }
  const items=battleMenuItems();
  if(items.length){
    if(b.up||b.left)   battle.cursor=(battle.cursor-1+items.length)%items.length;
    if(b.down||b.right) battle.cursor=(battle.cursor+1)%items.length;
  }
  if(b.ok) battleConfirm();
}
function battleConfirm(){
  const hero=battle.allies[0];
  if(battle.menu==="root"){
    switch(battle.cursor){
      case 0: battle.menu="target"; battle.cursor=0; battle.pendingSkill=null; break;
      case 1: if(availableTechniques().length){ battle.menu="skill"; battle.cursor=0; } else miniMsg("Aucune compétence"); break;
      case 2: doDefend(); break;
      case 3: if(consumableSlots().length){ battle.menu="item"; battle.cursor=0; } else miniMsg("Aucun objet"); break;
      case 4: doFlee(); break;
    }
  } else if(battle.menu==="target"){
    const tgt=aliveEnemyList()[battle.cursor]; if(!tgt) return;
    if(battle.pendingSkill){ const id=battle.pendingSkill; battle.pendingSkill=null; doSkill(id, tgt); }
    else { battle.menu="root"; startLunge(hero, tgt, ()=>applyAttack(hero, tgt)); }
  } else if(battle.menu==="skill"){
    const id=availableTechniques()[battle.cursor]; const T=TECHNIQUES[id];
    if(hero.pt<T.cost){ miniMsg("PT insuffisants"); return; }
    if(T.target==="all"){ battle.menu="root"; doSkill(id, null); }
    else { battle.pendingSkill=id; battle.menu="target"; battle.cursor=0; }
  } else if(battle.menu==="item"){
    const i=consumableSlots()[battle.cursor]; if(i==null) return;
    battle.menu="root"; doItem(i);
  }
}
function doDefend(){
  const hero=battle.allies[0];
  hero.guard=true; hero.pt=Math.min(hero.ptMax, hero.pt+1);
  floatAt(hero, "Garde !", "#9fd0ff");
  startTurn();
}
function doSkill(id, tgt){
  const hero=battle.allies[0], T=TECHNIQUES[id];
  hero.pt-=T.cost;
  floatAt(hero, T.name+" !", "#ffd98a");
  if(T.target==="all"){
    const list=aliveEnemyList(); const center=list[0]||tgt;
    if(!center){ startTurn(); return; }
    startLunge(hero, center, ()=>{ for(const e of aliveEnemyList()) applyAttack(hero, e, T.power); });
  } else {
    if(!tgt){ startTurn(); return; }
    startLunge(hero, tgt, ()=>applyAttack(hero, tgt, T.power));
  }
}
function doItem(i){
  const s=slots[i]; if(!s) { startTurn(); return; }
  const food=ITEMS[s.id].food||0;
  const heal=Math.max(2, Math.round(food/2));
  player.hp=Math.min(player.maxHp, player.hp+heal);
  if(food) boostT=Math.max(boostT, food);
  s.qty--; if(s.qty<=0) slots[i]=null;
  floatAt(battle.allies[0], `+${heal} PV`, "#7cfc8a");
  refreshUI();
  startTurn();
}
function doFlee(){
  const hero=battle.allies[0];
  let maxE=0; for(const c of battle.enemies) if(combatantAlive(c)) maxE=Math.max(maxE, c.spd);
  const p=Math.max(0.1, Math.min(0.95, 0.45+(hero.spd-maxE)*0.1));
  if(Math.random()<p) beginEnd("flee","Vous fuyez !");
  else { floatAt(hero, "Fuite ratée !", "#ff9a6a"); startTurn(); }
}

/* ====================== Fin de combat ====================== */
function finishBattle(){
  const result=battle.phase;
  for(const c of battle.enemies){
    const k=c.ref;
    if(!k.dead){ k.inBattle=false; k.state="patrol"; k.t=2+Math.random()*2; k.alertT=0; k.vx=k.vy=0; }
  }
  if(result==="defeat"){
    player.hp=player.maxHp; player.hurtT=2.0;
    player.x=spawn.x; player.y=spawn.y;
    const s=toScreen(spawn.x,spawn.y);
    floats.push({sx:s.x, sy:s.y-30, t:2.2, str:"Vaincu… retour au camp", c:"#8a3030"});
  } else if(result==="flee"){
    let ex=0, ey=0, n=0; for(const c of battle.enemies){ ex+=c.ref.x; ey+=c.ref.y; n++; }
    if(n){ ex/=n; ey/=n; let dx=player.x-ex, dy=player.y-ey; const l=Math.hypot(dx,dy)||1;
      const f=clampFree(player.x+dx/l*4, player.y+dy/l*4); player.x=f.x; player.y=f.y; }
  }
  player.battleCD=2.0;
  gameMode="explore";
  battle.active=false; battle.anchor=null; battle.phase="done";
  if(elInv.classList.contains("open")) refreshUI();
}

/* ====================== Rendu (zone + UI) ====================== */
function panel(x,y,w,h){
  cx.fillStyle="rgba(20,24,40,0.88)"; roundRect(cx,x,y,w,h,4); cx.fill();
  cx.strokeStyle="#6a86b8"; cx.lineWidth=1; roundRect(cx,x,y,w,h,4); cx.stroke();
}
function bar(x,y,w,h,frac,col,bg){
  cx.fillStyle=bg||"rgba(0,0,0,0.5)"; cx.fillRect(x,y,w,h);
  cx.fillStyle=col; cx.fillRect(x,y, Math.max(0,Math.round(w*Math.min(1,Math.max(0,frac)))), h);
}
function renderBattle(t, ox, oy){
  if(!battle.anchor) return;
  const ac=toScreen(battle.anchor.x, battle.anchor.y);
  const cxp=ac.x+ox, cyp=ac.y+oy, R=battle.radius, k=battle.zoneK;

  // 1) pénombre extérieure (ellipse iso troue le centre)
  cx.save();
  cx.translate(cxp,cyp); cx.scale(1, TH/TW);
  const g=cx.createRadialGradient(0,0,R*0.6, 0,0,R*1.4);
  g.addColorStop(0,   "rgba(8,10,26,0)");
  g.addColorStop(0.7, "rgba(8,10,26,0)");
  g.addColorStop(1,   `rgba(8,10,26,${BATTLE_DARK*k})`);
  cx.setTransform(1,0,0,1,0,0);
  cx.fillStyle=g; cx.fillRect(0,0,LW,LH);
  cx.restore();

  // 2) anneau lumineux
  cx.save();
  cx.globalCompositeOperation="lighter";
  cx.translate(cxp,cyp); cx.scale(1, TH/TW);
  cx.beginPath(); cx.arc(0,0,R,0,7); cx.strokeStyle=`rgba(120,180,255,${0.5*k})`; cx.lineWidth=2; cx.stroke();
  cx.beginPath(); cx.arc(0,0,R-2,0,7); cx.strokeStyle=`rgba(200,225,255,${(0.25+0.15*Math.sin(t*4))*k})`; cx.lineWidth=1; cx.stroke();
  cx.restore(); cx.globalAlpha=1;

  if(battle.banner) renderBanner(battle.banner.text);
  if(k<0.5) return;                 // pas d'UI pendant les fondus d'entrée/sortie

  // 3) curseur de cible
  if(battle.phase==="player" && (battle.menu==="target")){
    const tgt=aliveEnemyList()[battle.cursor];
    if(tgt){
      const s=toScreen(tgt.ref.x,tgt.ref.y);
      const x=Math.round(s.x+ox), y=Math.round(s.y+oy)-(KOBOLD_TYPES[tgt.ref.type].h)-8;
      cx.fillStyle=`rgba(255,90,80,${0.7+0.3*Math.sin(t*8)})`;
      cx.beginPath(); cx.moveTo(x-4,y-6); cx.lineTo(x+4,y-6); cx.lineTo(x,y); cx.closePath(); cx.fill();
    }
  }

  renderBattleHud();
}
function renderBattleHud(){
  const hero=battle.allies[0];
  // panneau PV/PT
  const x=8, y=LH-56, w=96, h=48;
  panel(x,y,w,h);
  cx.textAlign="left"; cx.font="bold 8px 'Courier New', monospace";
  cx.fillStyle="#f3eeda"; cx.fillText("TOI", x+6, y+11);
  bar(x+6, y+14, 84, 5, player.hp/player.maxHp, "#5db858", "#3a1414");
  cx.fillStyle="#d8efff"; cx.fillText(`PV ${player.hp}/${player.maxHp}`, x+6, y+27);
  bar(x+6, y+30, 84, 4, hero.pt/hero.ptMax, "#56b6ff", "#102438");
  cx.fillStyle="#d8efff"; cx.fillText(`PT ${hero.pt}/${hero.ptMax}`, x+6, y+44);

  // menu de commandes / sous-menu
  if(battle.phase==="player"){
    const items=battleMenuItems();
    const mw=128, mh=items.length*12+12, mx=x+w+8, my=LH-8-mh;
    panel(mx,my,mw,mh);
    if(battle.menu!=="root"){
      cx.fillStyle="#9fb0c8"; cx.font="bold 7px 'Courier New', monospace";
      cx.fillText({target:"CIBLE",skill:"COMPÉTENCE",item:"OBJET"}[battle.menu]||"", mx+6, my-3);
    }
    cx.font="bold 9px 'Courier New', monospace";
    items.forEach((it,i)=>{
      const yy=my+15+i*12, sel=i===battle.cursor;
      cx.fillStyle=sel?"#ffe27a":"#e8e0c8";
      if(sel) cx.fillText("▶", mx+6, yy);
      cx.fillText(it, mx+17, yy);
    });
  }
  cx.textAlign="center";
}
function renderBanner(text){
  cx.textAlign="center"; cx.font="bold 12px 'Courier New', monospace";
  const w=cx.measureText(text).width+24, x=LW/2-w/2, y=12, h=20;
  panel(x,y,w,h);
  cx.fillStyle="#ffe9a8"; cx.fillText(text, LW/2, y+14);
  cx.textAlign="left";
}

/* ====================== Entrées (clavier + tactile) ====================== */
addEventListener("keydown", e=>{
  if(gameMode!=="battle" || battle.phase!=="player") return;
  if(e.repeat) return;               // une frappe = une action (pas d'auto-répétition)
  const c=e.code;
  const o={
    up:   c==="ArrowUp"||c==="KeyW",
    down: c==="ArrowDown"||c==="KeyS",
    left: c==="ArrowLeft"||c==="KeyA",
    right:c==="ArrowRight"||c==="KeyD",
    ok:   c==="KeyE"||c==="Space"||c==="Enter",
    back: c==="Escape",
  };
  if(o.up||o.down||o.left||o.right||o.ok||o.back){ e.preventDefault(); battleInput(o); }
}, true);   // capture : passe avant le gestionnaire d'exploration

for(const b of document.querySelectorAll(".db[data-d]")){
  b.addEventListener("pointerdown", ()=>{
    if(gameMode==="battle" && battle.phase==="player"){
      const d=b.dataset.d;
      battleInput({up:d==="up", down:d==="down", left:d==="left", right:d==="right"});
    }
  });
}
const _btnAct=document.getElementById("btnAct");
if(_btnAct) _btnAct.addEventListener("pointerdown", ()=>{ if(gameMode==="battle" && battle.phase==="player") battleInput({ok:true}); });
