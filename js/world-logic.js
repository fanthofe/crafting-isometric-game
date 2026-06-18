"use strict";
/* Logique du monde : joueur, animaux, kobolds, combat et interactions. */

/* ====================== Logique du monde ====================== */
const player = {x:spawn.x, y:spawn.y, dir:"down", walking:false, animT:0, swing:0,
                hp:10, maxHp:10, hurtT:0};
let camX=0, camY=0, camInit=false;

/* ---------- Les animaux ---------- */
const animals = [];
function resetAnimal(a){
  const type = a.nextType || ANIMAL_LIST[Math.floor(Math.random()*ANIMAL_LIST.length)];
  let x = spawn.x+6, y = spawn.y-6;
  for(let i=0;i<80;i++){
    const cx2 = 1.5+Math.random()*(MAP-3), cy2 = 1.5+Math.random()*(MAP-3);
    if(blocked[Math.floor(cy2)][Math.floor(cx2)] || ground[Math.floor(cy2)][Math.floor(cx2)]===3) continue;
    if(Math.hypot(cx2-player.x, cy2-player.y)<6) continue;
    x=cx2; y=cy2; break;
  }
  Object.assign(a, {type, x, y, hp:ANIMAL_TYPES[type].hp, state:"idle", t:1+Math.random()*2,
                    vx:0, vy:0, animT:0, hurtT:0, dead:false, flip:false, respawn:0, atkCd:0});
  delete a.nextType;
}
for(let i=0;i<22;i++){                     // l'île est peuplée : ~4 de chaque espèce
  const a = {nextType: ANIMAL_LIST[i % ANIMAL_LIST.length]};
  resetAnimal(a); animals.push(a);
}
function hitAnimal(a){
  const p = toScreen(player.x, player.y), s = toScreen(a.x, a.y);
  player.dir = s.x<p.x ? "left" : "right";
  a.hp -= statForce();
  a.hurtT = 0.35;
  const T0 = ANIMAL_TYPES[a.type];
  if(T0.aggressive && a.hp > Math.ceil(T0.hp*0.35)){ a.state="charge"; a.t=5; }  // il riposte…
  else { a.state="flee"; a.t = Math.max(a.t, 2.5); }                             // …sauf s'il est blessé : il fuit
  burst(s.x, s.y-6, "#c0473f", 6);
  gainXP("chasse", 1);
  if(a.hp<=0){
    const T = ANIMAL_TYPES[a.type];
    gainXP("chasse", T.xp);
    const bonus = Math.floor((SKILLS.chasse.lvl-1)/5);
    for(const [id,[mn,mx]] of Object.entries(T.drops)){
      const n = mn + Math.floor(Math.random()*(mx-mn+1)) + bonus;
      groundItems.push({id, qty:n, x:a.x+(Math.random()-0.5)*0.6, y:a.y+(Math.random()-0.5)*0.6,
                        ph:Math.random()*6.28, cool:0.6});
    }
    floats.push({sx:s.x, sy:s.y-18, t:1.4, str:`${T.name} chassé !`, c:"#8a3030"});
    burst(s.x, s.y-4, "#8a3030", 10);
    a.dead = true; a.respawn = 20 + Math.random()*25;
  }
}

function hitKobold(k){
  const p = toScreen(player.x, player.y), s = toScreen(k.x, k.y);
  player.dir = s.x<p.x ? "left" : "right";
  const dmg = statForce();
  k.hp -= dmg; k.hurtT = 0.3; k.alertT = 3;
  const T = KOBOLD_TYPES[k.type];
  if(k.hp > Math.ceil(T.hp*0.25)){ k.state="charge"; k.t=6; }
  else { k.state="flee"; k.t=3; }
  burst(s.x, s.y-6, "#8ab0c8", 6);
  gainXP("chasse", 1);
  if(k.hp<=0){
    gainXP("chasse", T.xp);
    for(const [id,[mn,mx]] of Object.entries(T.drops)){
      const n = mn + Math.floor(Math.random()*(mx-mn+1));
      if(n>0) groundItems.push({id, qty:n, x:k.x+(Math.random()-0.5)*0.6,
        y:k.y+(Math.random()-0.5)*0.6, ph:Math.random()*6.28, cool:0.6});
    }
    floats.push({sx:s.x, sy:s.y-18, t:1.5, str:`${T.name} vaincu !`, c:"#6080a0"});
    burst(s.x, s.y-4, "#4a6a88", 10);
    k.dead=true; k.respawn=60+Math.random()*40;
    if(!raka.visible){ raka.visible=true; }
    spiritSay("raka","Bien. Mais d'autres viendront.",4);
  }
}

function toScreen(tx,ty){ return { x:(tx-ty)*(TW/2), y:(tx+ty)*(TH/2) }; }
function isBlocked(tx,ty){
  if(tx<0.3||ty<0.3||tx>MAP-0.3||ty>MAP-0.3) return true;
  const ix=Math.floor(tx), iy=Math.floor(ty);
  return blocked[iy]?.[ix] ?? true;
}
function nearestTarget(){
  let best=null, bd=REACH;
  for(const d of decor){
    const hittable = ((d.type==="tree"||d.type==="rock") && d.alive) || d.type==="fruittree";
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
  return best;
}
function doAction(){
  if(player.swing>0) return;
  const tgt = nearestTarget();
  player.swing = SWING_TIME;
  if(!tgt) return;
  if(tgt.kind==="animal"){ hitAnimal(tgt.a); return; }
  if(tgt.kind==="kobold"){ hitKobold(tgt.k); return; }
  const t = tgt.d;
  // tourner le héros vers la cible (gauche/droite à l'écran)
  const s = toScreen(t.tx+0.5, t.ty+0.5), p = toScreen(player.x, player.y);
  player.dir = (s.x < p.x) ? "left" : "right";
  t.shake=0.25;
  const sp = toScreen(t.tx+0.5, t.ty+0.5);
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
function placeFire(){
  if(countItem("feu")<=0){
    const ps = toScreen(player.x, player.y);
    floats.push({sx:ps.x, sy:ps.y-22, t:1.2, str:"pas de feu de camp", c:"#8a3030"});
    refreshUI(); return;
  }
  // tuile devant le personnage (selon la direction écran)
  const DIRV = { up:[-0.75,-0.75], down:[0.75,0.75], left:[-0.75,0.75], right:[0.75,-0.75] };
  const v = DIRV[player.dir];
  const tx = Math.floor(player.x+v[0]), ty = Math.floor(player.y+v[1]);
  if(tx<0||ty<0||tx>=MAP||ty>=MAP || blocked[ty][tx] || ground[ty][tx]===3 ||
     decor.some(d=>d.tx===tx&&d.ty===ty&&(d.type==="tree"||d.type==="rock"||d.type==="fire"))){
    const ps = toScreen(player.x, player.y);
    floats.push({sx:ps.x, sy:ps.y-22, t:1.2, str:"pas la place ici", c:"#8a3030"});
    return;
  }
  removeItem("feu",1); refreshUI();
  decor.push({type:"fire", tx, ty, ph:Math.random()*6.28});
  blocked[ty][tx]=true;
  const sp = toScreen(tx+0.5, ty+0.5);
  burst(sp.x, sp.y-6, "#e8743f", 8);
}

