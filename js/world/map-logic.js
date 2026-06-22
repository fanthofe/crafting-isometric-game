"use strict";
/* Logique du monde : cible la plus proche, action principale, feu de camp. */

function nearestTarget(){
  let best=null, bd=REACH;
  for(const d of decor){
    const hittable = ((d.type==="tree"||d.type==="rock"||d.type==="palmier") && d.alive) || d.type==="fruittree";
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
function placeFire(){
  if(countItem("feu")<=0){
    const ps = toScreen(player.x, player.y);
    floats.push({sx:ps.x, sy:ps.y-22, t:1.2, str:"pas de feu de camp", c:"#8a3030"});
    refreshUI(); return;
  }
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
