"use strict";
/* Boucle de jeu : mise à jour, rendu de la scène et amorçage. */

/* ====================== Boucle de jeu ====================== */
let last = performance.now();
function loop(now){
  pollGamepad();
  const dt = Math.min(0.05, (now-last)/1000); last = now;
  const t = now/1000;

  /* ---- mise à jour ---- */
  if(gameMode==="battle") updateBattle(dt, t);

  if(gameMode==="explore"){
    let sx = (keys.right?1:0)-(keys.left?1:0);
    let sy = (keys.down?1:0)-(keys.up?1:0);
    if(player.swing>0){ sx=0; sy=0; }      // réaliser une action fige le personnage
    player.walking = (sx!==0||sy!==0);
    if(player.walking){
      if(sy>0) player.dir="down"; else if(sy<0) player.dir="up";
      if(sx<0) player.dir="left"; else if(sx>0) player.dir="right";
      let dx = (sx+sy), dy = (sy-sx);
      const len = Math.hypot(dx,dy)||1; dx/=len; dy/=len;
      const boatMult = player.boat ? (BOAT_STATS[player.boat]?.speed ?? 1) : 1;
      const spd = SPEED * (overweight()?0.5:1) * (boostT>0?1.3:1) * (equip.pieds?1.15:1) * boatMult;
      const nx = player.x + dx*spd*dt;
      const ny = player.y + dy*spd*dt;
      if(!isBlocked(nx, player.y)) player.x = nx;
      if(!isBlocked(player.x, ny)) player.y = ny;
      player.animT += dt;
      // Annule la pêche si le joueur bouge en mer
      if(player.boat && fishing.state && fishing.state !== "bite") cancelFishing();
    } else player.animT = 0;
  }
  // Débarquement automatique en atteignant la terre
  if(player.boat){
    const tileG = ground[Math.floor(player.y)]?.[Math.floor(player.x)];
    if(tileG === 3) player._wasOnWater = true;
    else if(player._wasOnWater){
      const ps4 = toScreen(player.x, player.y);
      floats.push({sx:ps4.x, sy:ps4.y-22, t:1.2, str:"Débarqué", c:"#4a8fa0"});
      player.boat = null; player._wasOnWater = false;
      cancelFishing();
    }
  }
  const frame = Math.floor(player.animT*8)%4;

  if(actionQueued){ actionQueued=false; if(gameMode==="explore") doAction(); }
  if(player.swing>0) player.swing = Math.max(0, player.swing-dt);
  if(boostT>0) boostT = Math.max(0, boostT-dt);
  if(player.hurtT>0) player.hurtT = Math.max(0, player.hurtT-dt);

  // pêche
  if(gameMode==="explore" && player.boat) updateFishing(dt);

  // repousse des arbres / rochers / fruits
  for(const d of decor){
    if(d.shake>0) d.shake = Math.max(0, d.shake-dt);
    if(d.type==="fruittree" && d.fruits<3){
      d.regrowF -= dt;
      if(d.regrowF<=0){
        d.fruits++;
        d.regrowF = 12 + rnd()*10;
        if(d.fruits===3){
          const sp = toScreen(d.tx+0.5, d.ty+0.5);
          burst(sp.x, sp.y-26, FRUIT_KINDS[d.kind].fc, 5);
        }
      }
    }
    if((d.type==="tree"||d.type==="rock") && !d.alive){
      d.regrow -= dt;
      if(d.regrow<=0){
        // ne repousse pas sur le joueur
        if(Math.floor(player.x)===d.tx && Math.floor(player.y)===d.ty){ d.regrow=1; }
        else {
          d.alive=true; blocked[d.ty][d.tx]=true;
          const sp = toScreen(d.tx+0.5, d.ty+0.5);
          burst(sp.x, sp.y-10, "#67bd72", 8);
        }
      }
    }
    if(d.type==="palmier"){
      if(!d.alive){
        d.regrow -= dt;
        if(d.regrow<=0){
          if(Math.floor(player.x)===d.tx && Math.floor(player.y)===d.ty){ d.regrow=1; }
          else { d.alive=true; blocked[d.ty][d.tx]=true; }
        }
      } else if(d.fruits<2){
        d.regrowF -= dt;
        if(d.regrowF<=0){ d.fruits++; d.regrowF = 20+rnd()*15; }
      }
    }
  }
  // animaux : errance, fuite, réapparition (figés pendant un combat)
  if(gameMode==="explore") for(const a of animals){
    if(a.hurtT>0) a.hurtT = Math.max(0, a.hurtT-dt);
    if(a.dead){ a.respawn-=dt; if(a.respawn<=0) resetAnimal(a); continue; }
    const T = ANIMAL_TYPES[a.type];
    const pd = Math.hypot(player.x-a.x, player.y-a.y);
    const fleeR = T.flee * (equip.tete ? 0.65 : 1);   // chapeau de plumes : plus discret
    if(a.atkCd>0) a.atkCd -= dt;
    const scared = a.hp <= Math.ceil(T.hp*0.35);      // blessé : il préfère fuir
    if(pd < fleeR && a.state!=="charge"){
      if(T.aggressive && !scared && a.atkCd<=0){ a.state="charge"; a.t=5; }
      else { a.state="flee"; a.t = Math.max(a.t, 0.6); }
    }
    if(a.state==="charge" && scared){ a.state="flee"; a.t=2.5; }
    if(a.state==="charge"){
      a.t -= dt;
      const ang = Math.atan2(player.y-a.y, player.x-a.x);
      a.vx = Math.cos(ang)*T.speed*1.25; a.vy = Math.sin(ang)*T.speed*1.25;
      if(pd<0.7 && player.hurtT<=0 && a.atkCd<=0){
        const dmg = Math.max(1, (T.dmg||2) - statDefense());
        player.hp -= dmg; player.hurtT = 1.2;
        const ps2 = toScreen(player.x, player.y);
        floats.push({sx:ps2.x, sy:ps2.y-26, t:1.2, str:`-${dmg} PV`, c:"#c0473f"});
        burst(ps2.x, ps2.y-10, "#c0473f", 8);
        // recul du joueur
        const kx = player.x + Math.cos(ang)*0.9, ky = player.y + Math.sin(ang)*0.9;
        if(!isBlocked(kx, player.y)) player.x = kx;
        if(!isBlocked(player.x, ky)) player.y = ky;
        a.atkCd = 3;                                   // il souffle avant de réattaquer
        a.state="idle"; a.t=2.2; a.vx=a.vy=0;
        if(player.hp<=0){                              // K.O. : retour au camp
          player.hp = player.maxHp; player.hurtT = 2.5;
          player.x = spawn.x; player.y = spawn.y;
          const ps3 = toScreen(spawn.x, spawn.y);
          floats.push({sx:ps3.x, sy:ps3.y-30, t:2.2, str:"Assommé ! Retour au camp…", c:"#8a3030"});
          for(const an of animals) if(an.state==="charge"){ an.state="idle"; an.t=2; an.vx=an.vy=0; }
        }
        if(elInv.classList.contains("open")) refreshUI();
      } else if(a.t<=0 || pd>9){ a.state="idle"; a.t=1+Math.random()*2; a.vx=a.vy=0; }
    } else if(a.state==="flee"){
      a.t -= dt;
      const ang = Math.atan2(a.y-player.y, a.x-player.x);
      a.vx = Math.cos(ang)*T.speed; a.vy = Math.sin(ang)*T.speed;
      if(a.t<=0 && pd>fleeR+1){ a.state="idle"; a.t=1+Math.random()*2; a.vx=a.vy=0; }
    } else if(a.state==="wander"){
      a.t -= dt;
      if(a.t<=0){ a.state="idle"; a.t=1+Math.random()*3; a.vx=a.vy=0; }
    } else {
      a.t -= dt;
      if(a.t<=0){
        a.state="wander"; a.t=0.8+Math.random()*1.5;
        const ang = Math.random()*6.28;
        a.vx = Math.cos(ang)*T.speed*0.45; a.vy = Math.sin(ang)*T.speed*0.45;
      }
    }
    if(a.vx||a.vy){
      const nx2=a.x+a.vx*dt, ny2=a.y+a.vy*dt;
      if(!isBlocked(nx2,a.y)) a.x=nx2; else a.vx*=-0.7;
      if(!isBlocked(a.x,ny2)) a.y=ny2; else a.vy*=-0.7;
      a.animT += dt;
      const sdx = a.vx - a.vy;             // direction horizontale à l'écran (iso)
      if(Math.abs(sdx)>0.05) a.flip = sdx<0;
    }
  }
  // kobolds : patrouille, détection, charge, fuite (figés pendant un combat)
  if(gameMode==="explore") for(const k of kobolds){
    if(k.hurtT>0) k.hurtT=Math.max(0,k.hurtT-dt);
    if(k.alertT>0) k.alertT-=dt;
    if(k.dead){ k.respawn-=dt; continue; }
    const T=KOBOLD_TYPES[k.type];
    const pd=Math.hypot(player.x-k.x, player.y-k.y);
    if(k.alertT>0 && k.state==="charge"){
      for(const k2 of kobolds){
        if(k2===k||k2.dead) continue;
        if(Math.hypot(k2.x-k.x,k2.y-k.y)<4 && k2.state==="patrol"){ k2.state="charge"; k2.t=5; }
      }
    }
    if(pd<T.detect && k.state==="patrol"){
      k.state="charge"; k.t=6; k.alertT=3;
      const ks=toScreen(k.x,k.y);
      floats.push({sx:ks.x, sy:ks.y-14, t:0.9, str:"*hrrrk*", c:"#5a3a5a"});
      if(!raka.visible){ raka.visible=true; }
    }
    if(k.state==="flee"){
      k.t-=dt;
      const ang=Math.atan2(k.y-player.y, k.x-player.x);
      k.vx=Math.cos(ang)*T.speed*0.8; k.vy=Math.sin(ang)*T.speed*0.8;
      if(k.t<=0 && pd>T.detect+2){ k.state="patrol"; k.t=2+Math.random()*2; k.vx=k.vy=0; }
    } else if(k.state==="charge"){
      k.t-=dt;
      const ang=Math.atan2(player.y-k.y, player.x-k.x);
      k.vx=Math.cos(ang)*T.speed; k.vy=Math.sin(ang)*T.speed;
      k.atkCd=Math.max(0,k.atkCd-dt);
      if(pd<0.75 && player.hurtT<=0 && k.atkCd<=0){
        const dmg=Math.max(1, T.dmg-statDefense());
        player.hp-=dmg; player.hurtT=1.2;
        const ps2=toScreen(player.x,player.y);
        floats.push({sx:ps2.x, sy:ps2.y-26, t:1.2, str:`-${dmg} PV`, c:"#c0473f"});
        burst(ps2.x, ps2.y-10, "#c0473f", 8);
        const kx=player.x+Math.cos(ang)*0.8, ky=player.y+Math.sin(ang)*0.8;
        if(!isBlocked(kx,player.y)) player.x=kx;
        if(!isBlocked(player.x,ky)) player.y=ky;
        k.atkCd=2.5;
        if(!raka.emerged){
          raka.emerged=true; raka.visible=true;
          spiritSay("raka","Je suis Raka. Méfie-toi de leurs griffes.", 5);
        }
        if(player.hp<=0){
          player.hp=player.maxHp; player.hurtT=2.5;
          player.x=spawn.x; player.y=spawn.y;
          const ps3=toScreen(spawn.x,spawn.y);
          floats.push({sx:ps3.x, sy:ps3.y-30, t:2.2, str:"Assommé ! Retour au camp…", c:"#8a3030"});
          for(const kk of kobolds) if(kk.state==="charge"){ kk.state="patrol"; kk.t=2; kk.vx=kk.vy=0; }
        }
        if(elInv.classList.contains("open")) refreshUI();
      }
      if(k.t<=0 || pd>T.detect+4){ k.state="patrol"; k.t=2+Math.random()*3; k.vx=k.vy=0; }
    } else {
      k.t-=dt; k.atkCd=Math.max(0,k.atkCd-dt);
      if(k.t<=0){
        const ang=Math.random()*6.28;
        k.patrolTx=k.x+Math.cos(ang)*3+Math.random()*2;
        k.patrolTy=k.y+Math.sin(ang)*3+Math.random()*2;
        k.t=2+Math.random()*3;
      }
      const ddx=k.patrolTx-k.x, ddy=k.patrolTy-k.y, d2=Math.hypot(ddx,ddy);
      if(d2>0.2){ k.vx=(ddx/d2)*T.speed*0.4; k.vy=(ddy/d2)*T.speed*0.4; }
      else { k.vx=0; k.vy=0; }
    }
    if(k.vx||k.vy){
      const nx2=k.x+k.vx*dt, ny2=k.y+k.vy*dt;
      if(!isBlocked(nx2,k.y)) k.x=nx2; else k.vx*=-0.5;
      if(!isBlocked(k.x,ny2)) k.y=ny2; else k.vy*=-0.5;
      k.animT+=dt;
      const sdx=k.vx-k.vy; if(Math.abs(sdx)>0.05) k.flip=sdx<0;
    }
  }

  // respawn kobolds (hors boucle pour éviter splice pendant for..of ; suspendu en combat)
  if(gameMode==="explore") for(let i=kobolds.length-1;i>=0;i--){
    if(kobolds[i].dead && kobolds[i].respawn<=0){ const tp=kobolds[i].type; kobolds.splice(i,1); spawnKobold(tp); }
  }

  // prédateurs marins
  if(gameMode==="explore") for(const sp of seaPredators){
    if(sp.hurtT>0) sp.hurtT = Math.max(0, sp.hurtT-dt);
    if(sp.dead){ sp.respawn-=dt; continue; }
    const T = SEA_PREDATOR_TYPES[sp.type];
    const pd = Math.hypot(player.x-sp.x, player.y-sp.y);
    if(sp.atkCd>0) sp.atkCd-=dt;
    const playerOnWater = ground[Math.floor(player.y)]?.[Math.floor(player.x)]===3;
    if(T.aggressive && playerOnWater && pd<T.detect && sp.state==="idle"){ sp.state="charge"; sp.t=5; }
    if(sp.state==="charge"){
      sp.t-=dt;
      const ang = Math.atan2(player.y-sp.y, player.x-sp.x);
      sp.vx=Math.cos(ang)*T.speed; sp.vy=Math.sin(ang)*T.speed;
      if(playerOnWater && pd<0.8 && player.hurtT<=0 && sp.atkCd<=0){
        const dmg = Math.max(1, T.dmg-statDefense());
        player.hp-=dmg; player.hurtT=1.2;
        const ps2=toScreen(player.x,player.y);
        floats.push({sx:ps2.x, sy:ps2.y-26, t:1.2, str:`-${dmg} PV`, c:"#4a6878"});
        burst(ps2.x, ps2.y-10, "#4a6878", 8);
        sp.atkCd=2.5;
        if(player.hp<=0){
          player.hp=player.maxHp; player.hurtT=2.5;
          player.x=spawn.x; player.y=spawn.y;
          player.boat=null; player._wasOnWater=false; cancelFishing();
          const ps3=toScreen(spawn.x,spawn.y);
          floats.push({sx:ps3.x, sy:ps3.y-30, t:2.2, str:"Attaqué en mer ! Retour au camp…", c:"#8a3030"});
          for(const s2 of seaPredators) if(s2.state==="charge"){ s2.state="idle"; s2.t=2; s2.vx=s2.vy=0; }
        }
        if(elInv.classList.contains("open")) refreshUI();
      }
      if(sp.t<=0||pd>T.detect+4||!playerOnWater){ sp.state="idle"; sp.t=2+Math.random()*3; sp.vx=sp.vy=0; }
    } else {
      sp.t-=dt;
      if(sp.t<=0){
        const ang=Math.random()*6.28;
        sp.vx=Math.cos(ang)*T.speed*0.3; sp.vy=Math.sin(ang)*T.speed*0.3;
        sp.t=2+Math.random()*4;
      }
    }
    if(sp.vx||sp.vy){
      const nx2=sp.x+sp.vx*dt, ny2=sp.y+sp.vy*dt;
      if(!isBlockedWater(nx2,sp.y)) sp.x=nx2; else sp.vx*=-0.7;
      if(!isBlockedWater(sp.x,ny2)) sp.y=ny2; else sp.vy*=-0.7;
      sp.animT+=dt;
      const sdx=sp.vx-sp.vy; if(Math.abs(sdx)>0.05) sp.flip=sdx<0;
    }
  }
  // respawn prédateurs marins
  if(gameMode==="explore") for(let i=seaPredators.length-1;i>=0;i--){
    if(seaPredators[i].dead && seaPredators[i].respawn<=0){
      const tp=seaPredators[i].type; seaPredators.splice(i,1);
      const ns={type:tp}; resetSeaPredator(ns); seaPredators.push(ns);
    }
  }

  // déclenchement automatique du combat à l'approche d'un kobold
  if(gameMode==="explore"){
    if(player.battleCD>0) player.battleCD-=dt;
    else { const grp=battleTriggerGroup(); if(grp) startBattle(grp); }
  }

  // esprits de la nature
  {
    // Ao suit le joueur en orbite douce
    if(ao.visible){
      const targX=player.x+Math.cos(t*0.7)*1.9, targY=player.y+Math.sin(t*0.5)*1.2-0.6;
      ao.x+=(targX-ao.x)*Math.min(1,dt*2.5);
      ao.y+=(targY-ao.y)*Math.min(1,dt*2.5);
      ao.ph+=dt;
      if(Math.random()<dt*10){ const sp=toScreen(ao.x,ao.y); ao.trail.push({sx:sp.x,sy:sp.y-18,t:0.7,maxT:0.7}); }
      ao.cooldown-=dt; ao.talkTimer-=dt;
      if(ao.cooldown<=0 && ao.talkTimer<=0 && !spiritBubbles.some(b=>b.speaker==="ao")){
        if(!ao.seenBois && countItem("bois")<1){
          spiritSay("ao","Coupe un arbre. Le bois est la base de tout craft.",5); ao.seenBois=true; ao.cooldown=25;
        } else if(!ao.seenPlanche && countItem("bois")>=2 && countItem("planche")<1){
          spiritSay("ao","Tu as du bois ! Ouvre l'inventaire (I) et fabrique des planches.",5); ao.seenPlanche=true; ao.cooldown=20;
        } else if(!ao.seenFeu && countItem("planche")>=2 && countItem("pierre")>=2){
          spiritSay("ao","Planches et pierre — construis un feu de camp avec F (ou le menu 🔨).",5); ao.seenFeu=true; ao.cooldown=20;
        } else if(player.hp<=player.maxHp*0.4){
          spiritSay("ao","Tu es blessé. Mange un fruit pour récupérer.",4); ao.cooldown=15;
        } else if(kobolds.some(k=>!k.dead && Math.hypot(k.x-player.x,k.y-player.y)<10)){
          spiritSay("ao","Des kobolds rôdent dans cette direction.",4); ao.cooldown=18;
        }
        if(ao.cooldown>0) ao.talkTimer=ao.cooldown+10;
      }
    }
    for(let i=ao.trail.length-1;i>=0;i--){ ao.trail[i].t-=dt; if(ao.trail[i].t<=0) ao.trail.splice(i,1); }

    // Raka : radar kobold, se positionne entre joueur et danger
    if(raka.visible){
      raka.ph+=dt*1.4;
      let nearestK=null, nearestDist=999;
      for(const k of kobolds){ if(k.dead) continue; const d2=Math.hypot(k.x-player.x,k.y-player.y); if(d2<nearestDist){nearestDist=d2;nearestK=k;} }
      if(nearestK && nearestDist<14){
        const ang=Math.atan2(nearestK.y-player.y, nearestK.x-player.x);
        raka.targetX=player.x+Math.cos(ang)*2.5; raka.targetY=player.y+Math.sin(ang)*2.5;
        if(nearestDist<5 && raka.cooldown<=0 && !spiritBubbles.some(b=>b.speaker==="raka")){
          spiritSay("raka", nearestDist<3?"Attention ! Il est sur toi !":"Un kobold à portée. Garde tes distances.",3);
          raka.cooldown=9;
        }
      } else {
        raka.targetX=player.x-2.5; raka.targetY=player.y-2.5;
      }
      raka.x+=(raka.targetX-raka.x)*Math.min(1,dt*3);
      raka.y+=(raka.targetY-raka.y)*Math.min(1,dt*3);
      raka.cooldown=Math.max(0,raka.cooldown-dt);
      if(Math.random()<dt*9){ const sp=toScreen(raka.x,raka.y); raka.trail.push({sx:sp.x,sy:sp.y-15,t:0.5,maxT:0.5}); }
    }
    for(let i=raka.trail.length-1;i>=0;i--){ raka.trail[i].t-=dt; if(raka.trail[i].t<=0) raka.trail.splice(i,1); }
    for(let i=spiritBubbles.length-1;i>=0;i--){ spiritBubbles[i].t-=dt; if(spiritBubbles[i].t<=0) spiritBubbles.splice(i,1); }
  }

  // ramassage des objets au sol
  for(let i=groundItems.length-1;i>=0;i--){
    const g = groundItems[i];
    if(g.cool>0){ g.cool-=dt; continue; }
    if(Math.hypot(g.x-player.x, g.y-player.y)<0.7){
      const left = addItem(g.id, g.qty);
      const got = g.qty - left;
      if(got>0){
        const sp = toScreen(g.x, g.y);
        floats.push({sx:sp.x, sy:sp.y-14, t:1.1, str:`+${got} ${ITEMS[g.id].name.toLowerCase()}`, c:"#5f4128"});
        refreshUI();
      }
      if(left>0){ g.qty=left; g.cool=2; }   // inventaire plein : on réessaiera
      else groundItems.splice(i,1);
    }
  }
  // particules & textes
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.t-=dt; p.sx+=p.vx*dt; p.sy+=p.vy*dt; p.vy+=140*dt;
    if(p.t<=0) particles.splice(i,1);
  }
  for(let i=floats.length-1;i>=0;i--){
    const f=floats[i]; f.t-=dt; f.sy-=14*dt;
    if(f.t<=0) floats.splice(i,1);
  }
  // papillons
  for(const b of butterflies){
    b.a += (Math.sin(t*0.7+b.ph))*0.8*dt*3;
    b.x += Math.cos(b.a)*0.8*dt; b.y += Math.sin(b.a)*0.8*dt;
    if(b.x<2||b.x>MAP-2) b.a = Math.PI - b.a;
    if(b.y<2||b.y>MAP-2) b.a = -b.a;
  }
  for(const c of clouds){ c.x += c.v*dt; if(c.x>LW+260) c.x=-260; }

  // météo & cycle jour/nuit
  dayT += dt;
  weatherT -= dt;
  if(weatherT<=0){
    const others = ["soleil","pluie","brume"].filter(w=>w!==weather);
    weather = others[Math.floor(Math.random()*others.length)];
    weatherT = 30 + Math.random()*35;
  }
  rainI += ((weather==="pluie"?1:0)-rainI)*Math.min(1, dt/2.5);
  fogI  += ((weather==="brume"?1:0)-fogI)*Math.min(1, dt/2.5);
  const light = lightLevel();
  if(rainI>0.02) for(const d of drops){
    d.y += d.s*dt; d.x -= d.s*0.25*dt;
    if(d.y>LH){ d.y = -6; d.x = Math.random()*(LW+60); }
  }
  for(const f of fogs){ f.x += f.v*dt; if(f.x>LW+120) f.x = -180; }
  for(const fl of fireflies){
    fl.a += Math.sin(t*0.9+fl.ph)*1.2*dt;
    fl.x += Math.cos(fl.a)*0.6*dt; fl.y += Math.sin(fl.a)*0.6*dt;
    if(fl.x<2||fl.x>MAP-2) fl.a = Math.PI-fl.a;
    if(fl.y<2||fl.y>MAP-2) fl.a = -fl.a;
  }
  if(light>0.7 && rainI<0.4 && Math.random()<dt*7){
    // étincelles seulement autour de la caméra
    sparkles.push({tx:player.x+(Math.random()-0.5)*28, ty:player.y+(Math.random()-0.5)*28, t:0.8, max:0.8});
  }
  for(let i=sparkles.length-1;i>=0;i--){ sparkles[i].t-=dt; if(sparkles[i].t<=0) sparkles.splice(i,1); }
  const lbl = `${light>0.65?"☀ jour":light>0.15?(dayPhase()<0.6?"🌇 crépuscule":"🌄 aube"):"🌙 nuit"} · ${weather==="soleil"?"ciel dégagé":weather}`;
  if(elMeteo.textContent!==lbl) elMeteo.textContent = lbl;

  // caméra (centrée sur la zone de combat le cas échéant, sinon sur le joueur)
  const ps = toScreen(player.x, player.y);
  let targX, targY;
  if(gameMode==="battle" && battle.anchor){
    const ac = toScreen(battle.anchor.x, battle.anchor.y);
    targX = ac.x - LW/2; targY = ac.y - LH/2 - 8;
  } else {
    targX = ps.x - LW/2; targY = ps.y - LH/2 - 8;
  }
  if(!camInit){ camX=targX; camY=targY; camInit=true; }
  camX += (targX-camX)*Math.min(1, dt*6);
  camY += (targY-camY)*Math.min(1, dt*6);
  const ox = Math.round(-camX), oy = Math.round(-camY);

  /* ---- rendu ---- */
  // ciel interpolé jour / crépuscule / nuit, grisé sous la pluie
  const duskK = Math.min(1, duskGlow());
  let topC = mixC([16,22,48],[168,220,236], light);
  let botC = mixC([40,54,82],[231,243,207], light);
  topC = mixC(topC,[244,150,90], duskK*0.6); botC = mixC(botC,[232,200,122], duskK*0.45);
  topC = mixC(topC,[110,120,134], rainI*0.55); botC = mixC(botC,[146,154,162], rainI*0.5);
  const sky = cx.createLinearGradient(0,0,0,LH);
  sky.addColorStop(0,cssC(topC)); sky.addColorStop(1,cssC(botC));
  cx.fillStyle = sky; cx.fillRect(0,0,LW,LH);
  // soleil ou lune en arc dans le ciel
  const ph2 = dayPhase();
  if(ph2<0.52){
    const u = Math.min(1, ph2/0.5);
    const sxp = 26+(LW-52)*u, syp = 64-Math.sin(u*Math.PI)*40;
    cx.fillStyle="rgba(255,236,150,0.35)"; cx.beginPath(); cx.arc(sxp,syp,9,0,7); cx.fill();
    cx.fillStyle="#ffe27a"; cx.beginPath(); cx.arc(sxp,syp,5,0,7); cx.fill();
    cx.fillStyle="#fff3bd"; cx.fillRect(sxp-2,syp-2,2,2);
  } else if(ph2<0.97){
    const u = (ph2-0.52)/0.45;
    const mxp = 26+(LW-52)*u, myp = 60-Math.sin(Math.min(1,u)*Math.PI)*36;
    cx.fillStyle="rgba(230,238,255,0.85)"; cx.beginPath(); cx.arc(mxp,myp,5,0,7); cx.fill();
    cx.fillStyle = cssC(topC); cx.beginPath(); cx.arc(mxp+2,myp-1,4,0,7); cx.fill();
  }
  cx.save(); cx.globalAlpha = 0.35+0.65*light;
  for(const c of clouds){
    cx.save(); cx.translate(Math.round(c.x + ox*0.15), Math.round(c.y + oy*0.1));
    cx.scale(c.s,c.s); cx.drawImage(CLOUD,0,0); cx.restore();
  }
  cx.restore();

  const wf = Math.floor(t*2)%2;
  // caméra restreinte : on ne parcourt que la fenêtre de tuiles visibles à l'écran
  const ulo = (-ox-TW)/(TW/2),     uhi = (LW-ox+TW/2)/(TW/2);   // u = x-y
  const vlo = (-oy-TH-14)/(TH/2),  vhi = (LH-oy)/(TH/2);        // v = x+y
  const xlo = Math.max(0, Math.floor((ulo+vlo)/2)), xhi = Math.min(MAP-1, Math.ceil((uhi+vhi)/2));
  const ylo = Math.max(0, Math.floor((vlo-uhi)/2)), yhi = Math.min(MAP-1, Math.ceil((vhi-ulo)/2));
  for(let y=ylo;y<=yhi;y++)for(let x=xlo;x<=xhi;x++){
    const s = toScreen(x,y);
    const dx = s.x+ox-TW/2, dy = s.y+oy;
    if(dx<-TW||dx>LW||dy<-TH-12||dy>LH) continue;
    const g = ground[y][x];
    cx.drawImage(g===3 ? WATER[wf] : g===4 ? SAND : GRASS[g], dx, dy);
  }

  // surbrillance de la cible à portée (désactivée pendant un combat)
  const target = gameMode==="explore" ? nearestTarget() : null;
  if(target && target.kind==="decor"){
    const s = toScreen(target.d.tx, target.d.ty);
    cx.save();
    cx.translate(s.x+ox-TW/2, s.y+oy);
    cx.beginPath(); cx.moveTo(TW/2,0); cx.lineTo(TW,TH/2); cx.lineTo(TW/2,TH); cx.lineTo(0,TH/2); cx.closePath();
    cx.strokeStyle = `rgba(255,244,200,${0.55+0.3*Math.sin(t*6)})`;
    cx.lineWidth = 1; cx.stroke();
    cx.restore();
  } else if(target){
    const tEnt = target.a || target.k;   // animal ou kobold : même surbrillance
    const s = toScreen(tEnt.x, tEnt.y);
    cx.beginPath(); cx.ellipse(Math.round(s.x+ox), Math.round(s.y+oy)+1, 8, 3.5, 0, 0, 7);
    cx.strokeStyle = `rgba(255,180,150,${0.6+0.3*Math.sin(t*6)})`;
    cx.lineWidth = 1; cx.stroke();
  }

  // entités triées — seules celles proches de l'écran sont retenues (culling)
  const vis = (tx,ty)=>{
    const s = toScreen(tx,ty), sx2 = s.x+ox, sy2 = s.y+oy;
    return sx2>-70 && sx2<LW+70 && sy2>-80 && sy2<LH+40;
  };
  const ents = [];
  for(const d of decor) if(vis(d.tx+0.5, d.ty+0.5)) ents.push({depth:d.tx+d.ty, d});
  ents.push({depth:player.x+player.y, d:{type:"hero"}});
  for(const g of groundItems) if(vis(g.x,g.y)) ents.push({depth:g.x+g.y+0.005, d:{type:"gitem", g}});
  for(const a of animals) if(!a.dead && vis(a.x,a.y)) ents.push({depth:a.x+a.y, d:{type:"animal", a}});
  for(const k of kobolds) if(!k.dead && vis(k.x,k.y)) ents.push({depth:k.x+k.y+0.002, d:{type:"kobold", k}});
  for(const sp of seaPredators) if(!sp.dead && vis(sp.x,sp.y)) ents.push({depth:sp.x+sp.y+0.001, d:{type:"seapred", sp}});
  for(const b of butterflies) if(vis(b.x,b.y)) ents.push({depth:b.x+b.y+0.01, d:{type:"bf", b}});
  ents.sort((a,b)=>a.depth-b.depth);

  // boîtes écran des éléments « cachables » : un arbre qui en recouvre un (en passant
  // devant) devient translucide. Profondeur = x+y (plus petite = dessiné avant = derrière).
  const occludees = [{depth:player.x+player.y, x:ps.x+ox, y:ps.y+oy, hw:6, h:18}];
  for(const a of animals) if(!a.dead && vis(a.x,a.y)){
    const s=toScreen(a.x,a.y), im=ANIMAL_IMG[a.type][0];
    occludees.push({depth:a.x+a.y, x:s.x+ox, y:s.y+oy, hw:im.width/2, h:im.height});
  }
  for(const k of kobolds) if(!k.dead && vis(k.x,k.y)){
    const s=toScreen(k.x,k.y), im=KOBOLD_IMG[k.type][0];
    occludees.push({depth:k.x+k.y+0.002, x:s.x+ox, y:s.y+oy, hw:im.width/2, h:im.height});
  }
  for(const r of decor) if(r.type==="rock" && r.alive && vis(r.tx+0.5,r.ty+0.5)){
    const s=toScreen(r.tx+0.5,r.ty+0.5);
    occludees.push({depth:r.tx+r.ty, x:s.x+ox, y:s.y+oy, hw:11, h:11});
  }

  for(const e of ents){
    const d = e.d;
    if(d.type==="hero"){
      if(player.hurtT>0 && Math.floor(t*16)%2) cx.globalAlpha=0.5;
      drawHero(cx, Math.round(ps.x+ox-5), Math.round(ps.y+oy-12), player.dir, frame, player.walking, player.swing/SWING_TIME);
      cx.globalAlpha=1;
    } else if(d.type==="bf"){
      const b=d.b, s=toScreen(b.x,b.y);
      const fl = Math.floor(t*10+b.ph)%2;
      const bx=Math.round(s.x+ox), by=Math.round(s.y+oy-14+Math.sin(t*2+b.ph)*3);
      cx.fillStyle=b.c;
      if(fl){ cx.fillRect(bx-2,by,2,2); cx.fillRect(bx+1,by,2,2); }
      else  { cx.fillRect(bx-1,by-1,1,2); cx.fillRect(bx+1,by-1,1,2); }
      cx.fillStyle="#2b2026"; cx.fillRect(bx,by,1,2);
    } else if(d.type==="gitem"){
      const g2=d.g, s=toScreen(g2.x, g2.y);
      const gx=Math.round(s.x+ox), gy=Math.round(s.y+oy);
      const bob=Math.round(Math.sin(t*3+g2.ph)*1.5);
      cx.fillStyle="rgba(20,40,20,0.25)";
      cx.beginPath(); cx.ellipse(gx, gy+1, 4, 1.6, 0, 0, 7); cx.fill();
      cx.drawImage(ICON_SRC[g2.id], gx-5, gy-11+bob, 10, 10);
    } else if(d.type==="animal"){
      const a=d.a, s=toScreen(a.x, a.y);
      const img = ANIMAL_IMG[a.type][(a.vx||a.vy) ? Math.floor(a.animT*10)%2 : 0];
      const axp = Math.round(s.x+ox), ayp = Math.round(s.y+oy);
      cx.fillStyle="rgba(20,40,20,0.25)";
      cx.beginPath(); cx.ellipse(axp, ayp+1, img.width/2-1, 2.2, 0, 0, 7); cx.fill();
      cx.save();
      cx.translate(axp, ayp);
      if(a.flip) cx.scale(-1,1);
      if(a.hurtT>0 && Math.floor(t*16)%2) cx.globalAlpha=0.45;
      cx.drawImage(img, -Math.round(img.width/2), -img.height+2);
      cx.restore();
    } else if(d.type==="kobold"){
      const k=d.k, TK=KOBOLD_TYPES[k.type];
      const s=toScreen(k.x,k.y);
      const img=KOBOLD_IMG[k.type][(k.vx||k.vy)?Math.floor(k.animT*10)%2:0];
      const kxp=Math.round(s.x+ox), kyp=Math.round(s.y+oy);
      cx.fillStyle="rgba(10,5,20,0.35)";
      cx.beginPath(); cx.ellipse(kxp, kyp+1, img.width/2, 2.5, 0, 0, 7); cx.fill();
      cx.save(); cx.translate(kxp, kyp);
      if(k.flip) cx.scale(-1,1);
      if(k.hurtT>0 && Math.floor(t*16)%2) cx.globalAlpha=0.4;
      cx.drawImage(img, -Math.round(img.width/2), -img.height+2);
      cx.restore();
      // barre de vie
      const hpFrac=k.hp/TK.hp, bw=img.width+4;
      cx.fillStyle="rgba(0,0,0,0.55)"; cx.fillRect(kxp-bw/2-1, kyp-TK.h-3, bw+2, 4);
      cx.fillStyle=hpFrac>0.5?"#5db858":hpFrac>0.25?"#e8a030":"#c0473f";
      cx.fillRect(kxp-bw/2, kyp-TK.h-2, Math.max(0,Math.round(bw*hpFrac)), 2);
    } else if(d.type==="seapred"){
      const sp=d.sp, T=SEA_PREDATOR_TYPES[sp.type];
      const s=toScreen(sp.x,sp.y);
      const img=SEA_PREDATOR_IMG[sp.type][(sp.vx||sp.vy)?Math.floor(sp.animT*10)%2:0];
      const sxp=Math.round(s.x+ox), syp=Math.round(s.y+oy);
      cx.fillStyle="rgba(20,50,80,0.28)";
      cx.beginPath(); cx.ellipse(sxp, syp+1, img.width/2, 2.5, 0, 0, 7); cx.fill();
      cx.save(); cx.translate(sxp, syp);
      if(sp.flip) cx.scale(-1,1);
      if(sp.hurtT>0 && Math.floor(t*16)%2) cx.globalAlpha=0.45;
      cx.drawImage(img, -Math.round(img.width/2), -img.height+2);
      cx.restore();
      if(sp.state==="charge"){
        const hpFracS=sp.hp/T.hp, bwS=img.width+4;
        cx.fillStyle="rgba(0,0,0,0.55)"; cx.fillRect(sxp-bwS/2-1, syp-T.h-3, bwS+2, 4);
        cx.fillStyle=hpFracS>0.5?"#5db858":hpFracS>0.25?"#e8a030":"#c0473f";
        cx.fillRect(sxp-bwS/2, syp-T.h-2, Math.max(0,Math.round(bwS*hpFracS)), 2);
      }
    } else {
      const s = toScreen(d.tx+0.5, d.ty+0.5);
      const shk = d.shake>0 ? Math.round(Math.sin(d.shake*40)*1.5) : 0;
      const bx = s.x+ox+shk, by = s.y+oy;
      // un arbre devient translucide uniquement s'il masque un élément situé derrière lui
      if((d.type==="tree" && d.alive) || d.type==="fruittree" || (d.type==="palmier" && d.alive)){
        const td = d.tx+d.ty;
        const tx0=bx-18, tx1=bx+18, ty0=by-46, ty1=by+2;
        let hides = false;
        for(const o of occludees){
          if(o.depth>=td) continue;                          // pas derrière l'arbre
          if(o.x-o.hw<tx1 && o.x+o.hw>tx0 && o.y-o.h<ty1 && o.y+2>ty0){ hides=true; break; }
        }
        const target = hides ? TREE_FADE_MIN : 1;
        if(d.fadeA===undefined) d.fadeA = target;
        d.fadeA += (target-d.fadeA)*Math.min(1, dt*TREE_FADE_SPEED);
        cx.globalAlpha = d.fadeA;
      }
      if(d.type==="tree"){
        if(d.alive) cx.drawImage(TREE_IMG[d.v], Math.round(bx-20), Math.round(by-46));
        else cx.drawImage(STUMP, Math.round(bx-8), Math.round(by-8));
      }
      else if(d.type==="fruittree"){
        cx.drawImage(FRUIT_TREES_IMG[d.kind], Math.round(bx-20), Math.round(by-46));
        const fc = FRUIT_KINDS[d.kind].fc;
        for(let i=0;i<d.fruits;i++){
          const fx = Math.round(bx-20+FRUIT_POS[i][0]), fy = Math.round(by-46+FRUIT_POS[i][1]);
          cx.fillStyle=fc; cx.fillRect(fx,fy,3,3);
          cx.fillStyle="rgba(255,255,255,.45)"; cx.fillRect(fx,fy,1,1);
        }
      }
      else if(d.type==="palmier"){
        if(d.alive){
          cx.drawImage(PALM_TREE[d.v], Math.round(bx-20), Math.round(by-54));
        } else {
          cx.fillStyle="#a07840"; cx.fillRect(Math.round(bx-3), Math.round(by-6), 6, 6);
        }
      }
      else if(d.type==="rock"){
        if(d.alive) cx.drawImage(ROCKS[d.v], Math.round(bx-11), Math.round(by-9));
        else cx.drawImage(PEBBLES, Math.round(bx-9), Math.round(by-5));
      }
      else if(d.type==="fire"){
        const fx = Math.round(bx), fy = Math.round(by);
        // halo
        const fl2 = 0.85+0.15*Math.sin(t*9+d.ph);
        const deep = Math.max(0, 1-light*2);          // ne s'intensifie qu'en pleine nuit
        cx.fillStyle = `rgba(255,190,90,${(0.13+0.18*deep)*fl2})`;
        cx.beginPath(); cx.ellipse(fx, fy-2, (18+8*deep)*fl2, (9+3*deep)*fl2, 0, 0, 7); cx.fill();
        // pierres autour
        cx.fillStyle="#9aa2a6";
        cx.fillRect(fx-8,fy-1,3,2); cx.fillRect(fx+5,fy-1,3,2);
        cx.fillRect(fx-4,fy+2,3,2); cx.fillRect(fx+1,fy+2,3,2);
        cx.fillRect(fx-2,fy-4,2,2); cx.fillRect(fx+1,fy-4,2,2);
        // bûches
        cx.fillStyle="#5f4128"; cx.fillRect(fx-5,fy-2,10,2);
        // flammes (2 images)
        const ff = Math.floor(t*8+d.ph)%2;
        cx.fillStyle="#e8743f";
        if(ff){ cx.fillRect(fx-3,fy-7,6,5); cx.fillRect(fx-1,fy-9,3,2); }
        else  { cx.fillRect(fx-2,fy-8,5,6); cx.fillRect(fx-3,fy-5,7,3); }
        cx.fillStyle="#f4c542";
        if(ff){ cx.fillRect(fx-1,fy-5,3,3); } else { cx.fillRect(fx-1,fy-6,2,4); }
        // étincelle
        if(Math.floor(t*4+d.ph)%3===0){ cx.fillStyle="#ffd98a"; cx.fillRect(fx+(ff?2:-3), fy-12, 1,1); }
        addLight(fx, fy - 4, 50 + 28*deep, 255, 140, 50, (0.20 + 0.28*deep) * fl2);
        // indice d'interaction (grillades) quand le joueur est à portée
        if(gameMode==="explore" && !player.boat &&
           Math.hypot(d.tx+0.5-player.x, d.ty+0.5-player.y) < 1.7){
          cx.font = "5px monospace"; cx.textAlign="center";
          const lbl = "Feu de camp", tw2 = cx.measureText(lbl).width, ly = fy-14;
          cx.fillStyle="rgba(10,8,6,0.7)"; cx.fillRect(fx-tw2/2-2, ly-7, tw2+4, 7);
          cx.fillStyle="#e8c870"; cx.fillText(lbl, fx, ly-1.5);
          cx.fillStyle="#b8d898"; cx.fillRect(fx-1, ly+1, 2, 2);
          cx.textAlign="left";
        }
      }
      else if(STATION_IMG[d.type]){
        const img = STATION_IMG[d.type];
        const sxp = Math.round(bx), syp = Math.round(by);
        cx.fillStyle="rgba(20,30,20,0.28)";
        cx.beginPath(); cx.ellipse(sxp, syp+1, img.width/2-2, 2.4, 0, 0, 7); cx.fill();
        cx.drawImage(img, sxp-Math.round(img.width/2), syp-img.height+4);
        // vapeur animée si marmite active
        if(d.type==="marmite" && marmiteActive(d) && Math.floor(t*3+d.tx)%2){
          cx.fillStyle="rgba(220,220,230,0.4)";
          cx.fillRect(sxp-2, syp-img.height-2, 2, 2);
        }
        // indice d'interaction quand le joueur est à portée
        if(gameMode==="explore" && !player.boat &&
           Math.hypot(d.tx+0.5-player.x, d.ty+0.5-player.y) < 1.7){
          const lbl = ITEMS[STATION_KINDS[d.type]].name;
          cx.font = "5px monospace"; cx.textAlign="center";
          const tw2 = cx.measureText(lbl).width;
          const ly = syp-img.height-2;
          cx.fillStyle="rgba(10,8,6,0.7)"; cx.fillRect(sxp-tw2/2-2, ly-7, tw2+4, 7);
          cx.fillStyle="#e8c870"; cx.fillText(lbl, sxp, ly-1.5);
          cx.fillStyle="#b8d898"; cx.fillRect(sxp-1, ly+1, 2, 2);
          cx.textAlign="left";
        }
      }
      else if(d.type==="flower"){
        const sw = Math.round(Math.sin(t*2+d.ph)*1.2);
        const fx = Math.round(bx+d.ox), fy = Math.round(by+d.oy);
        cx.fillStyle="#3f8f4f"; cx.fillRect(fx, fy-4, 1, 4);
        cx.fillStyle=d.c; cx.fillRect(fx-1+sw, fy-7, 3, 3);
        cx.fillStyle="#fff6d8"; cx.fillRect(fx+sw, fy-6, 1, 1);
      } else if(d.type==="tuft"){
        const sw = Math.round(Math.sin(t*1.7+d.ph)*1.2);
        const fx = Math.round(bx+d.ox), fy = Math.round(by+d.oy);
        cx.fillStyle="#5fae4e";
        cx.fillRect(fx, fy-3, 1, 3);
        cx.fillRect(fx-2+sw, fy-4, 1, 4);
        cx.fillRect(fx+2+sw, fy-4, 1, 4);
      }
      cx.globalAlpha = 1;   // on rétablit l'opacité après un éventuel fondu d'arbre
    }
  }

  // fantôme du mode construction (devant le joueur : vert = posable, rouge = interdit)
  if(gameMode==="explore" && build.active && build.item){
    const tiles = buildTiles();
    const ok = buildValid();
    const c = ok ? [120,210,120] : [220,70,60];
    for(const tl of tiles){
      const s = toScreen(tl.tx, tl.ty);
      cx.save();
      cx.translate(s.x+ox-TW/2, s.y+oy);
      cx.beginPath(); cx.moveTo(TW/2,0); cx.lineTo(TW,TH/2); cx.lineTo(TW/2,TH); cx.lineTo(0,TH/2); cx.closePath();
      cx.fillStyle   = `rgba(${c[0]},${c[1]},${c[2]},0.28)`; cx.fill();
      cx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},0.9)`; cx.lineWidth=1; cx.stroke();
      cx.restore();
    }
    const gi = (ok ? GHOST_OK : GHOST_BAD)[build.item];
    if(gi){
      const a = tiles[0], s = toScreen(a.tx+0.5, a.ty+0.5);
      const gx = Math.round(s.x+ox) - Math.round(gi.width/2), gy = Math.round(s.y+oy) - gi.height + 4;
      cx.globalAlpha = 0.7; cx.drawImage(gi, gx, gy); cx.globalAlpha = 1;
    }
  }

  // particules
  for(const p of particles){
    cx.fillStyle = p.c;
    cx.fillRect(Math.round(p.sx+ox), Math.round(p.sy+oy), 2, 2);
  }

  // esprits (rendu additif, au-dessus de tout)
  cx.save(); cx.globalCompositeOperation="lighter";
  if(ao.visible){
    for(const pt of ao.trail){
      cx.globalAlpha=pt.t/pt.maxT*0.55;
      cx.fillStyle="#39d353"; cx.fillRect(Math.round(pt.sx+ox)-1, Math.round(pt.sy+oy)-1, 2, 2);
    }
    const sp=toScreen(ao.x,ao.y), axp=Math.round(sp.x+ox), ayp=Math.round(sp.y+oy-18);
    const pulse=0.75+0.25*Math.sin(t*3+ao.ph);
    cx.globalAlpha=pulse; cx.drawImage(SPIRIT_GLOW_AO, axp-18, ayp-18);
  }
  if(raka.visible){
    for(const pt of raka.trail){
      cx.globalAlpha=pt.t/pt.maxT*0.45;
      cx.fillStyle="#c0473f"; cx.fillRect(Math.round(pt.sx+ox)-1, Math.round(pt.sy+oy)-1, 2, 2);
    }
    const sp=toScreen(raka.x,raka.y), rxp=Math.round(sp.x+ox), ryp=Math.round(sp.y+oy-16);
    const nearKob=kobolds.some(k=>!k.dead&&Math.hypot(k.x-player.x,k.y-player.y)<5);
    const pulse=nearKob?0.65+0.35*Math.sin(t*8):0.6+0.2*Math.sin(t*2+raka.ph);
    cx.globalAlpha=pulse; cx.drawImage(SPIRIT_GLOW_RAKA, rxp-18, ryp-18);
  }
  cx.restore(); cx.globalAlpha=1;
  // noyaux des esprits
  if(ao.visible){
    const sp=toScreen(ao.x,ao.y), axp=Math.round(sp.x+ox), ayp=Math.round(sp.y+oy-18);
    cx.fillStyle="#c0ffc8"; cx.fillRect(axp-1,ayp-1,3,3);
    cx.fillStyle="#ffffff"; cx.fillRect(axp,ayp-1,1,1);
  }
  if(raka.visible){
    const sp=toScreen(raka.x,raka.y), rxp=Math.round(sp.x+ox), ryp=Math.round(sp.y+oy-16);
    cx.fillStyle="#ffb0a0"; cx.fillRect(rxp-1,ryp-1,3,3);
    cx.fillStyle="#ffffff"; cx.fillRect(rxp,ryp-1,1,1);
  }
  // bulles de dialogue des esprits
  for(const b of spiritBubbles){
    const spirit = b.speaker==="ao" ? ao : raka;
    const sp=toScreen(spirit.x,spirit.y);
    const bxp=Math.round(sp.x+ox), byp=Math.round(sp.y+oy-(b.speaker==="ao"?34:30));
    const alpha=Math.min(1, b.t/0.5);
    const lines=wrapText(b.msg, 24);
    const bh=lines.length*10+8;
    const bw=Math.max(...lines.map(l=>l.length*5.5))+12;
    const bgC=b.speaker==="ao"?"rgba(15,40,18,0.92)":"rgba(45,10,8,0.92)";
    const borderC=b.speaker==="ao"?"#39d353":"#c0473f";
    const textC=b.speaker==="ao"?"#a0ffb0":"#ffb0a0";
    cx.save(); cx.globalAlpha=alpha;
    cx.fillStyle=bgC;
    roundRect(cx, bxp-bw/2, byp-bh, bw, bh, 4); cx.fill();
    cx.strokeStyle=borderC; cx.lineWidth=1;
    roundRect(cx, bxp-bw/2, byp-bh, bw, bh, 4); cx.stroke();
    cx.fillStyle=bgC;
    cx.beginPath(); cx.moveTo(bxp-3,byp); cx.lineTo(bxp+3,byp); cx.lineTo(bxp,byp+5); cx.closePath(); cx.fill();
    cx.strokeStyle=borderC; cx.lineWidth=1;
    cx.beginPath(); cx.moveTo(bxp-3,byp); cx.lineTo(bxp,byp+5); cx.lineTo(bxp+3,byp); cx.stroke();
    cx.font="bold 7px 'Courier New', monospace"; cx.textAlign="left"; cx.fillStyle=textC;
    lines.forEach((line,i)=>{ cx.fillText(line, bxp-bw/2+5, byp-bh+9+i*10); });
    cx.restore();
  }
  cx.textAlign="center";

  /* ---- ambiance : lumière & météo ---- */
  // rayons de soleil obliques en plein jour
  const rayA = Math.max(0,(light-0.3)/0.7)*(1-rainI)*(1-fogI*0.6);   // s'éteint dès le soir
  if(rayA>0.03){
    cx.save(); cx.globalCompositeOperation="lighter";
    for(let i=0;i<4;i++){
      const a = rayA*(0.045+0.035*Math.sin(t*0.45+i*1.9));
      if(a<=0.005) continue;
      const x0 = ((i*140 + t*7)%(LW+300))-150;
      cx.fillStyle = `rgba(255,246,200,${a})`;
      cx.beginPath();
      cx.moveTo(x0,0); cx.lineTo(x0+46,0); cx.lineTo(x0-64,LH); cx.lineTo(x0-118,LH);
      cx.closePath(); cx.fill();
    }
    cx.restore();
  }
  // brillances scintillantes (jour)
  for(const s of sparkles){
    const sp2 = toScreen(s.tx, s.ty);
    const sxp = Math.round(sp2.x+ox), syp = Math.round(sp2.y+oy);
    if(sxp<2||sxp>LW-2||syp<2||syp>LH-2) continue;
    const k = Math.sin(Math.PI*(1-s.t/s.max));
    cx.globalAlpha = k*0.85*light;
    cx.fillStyle="#ffffff";
    cx.fillRect(sxp-2,syp,5,1); cx.fillRect(sxp,syp-2,1,5);
    cx.fillStyle="#fff7c8"; cx.fillRect(sxp,syp,1,1);
    cx.globalAlpha = 1;
  }
  // pluie
  if(rainI>0.02){
    cx.strokeStyle = `rgba(200,218,240,${0.65*rainI})`;
    cx.lineWidth = 1;
    cx.beginPath();
    for(const d of drops){ cx.moveTo(d.x, d.y); cx.lineTo(d.x-2.2, d.y+9); }
    cx.stroke();
    cx.fillStyle = `rgba(70,82,104,${0.14*rainI})`;
    cx.fillRect(0,0,LW,LH);
  }
  // brume
  if(fogI>0.02){
    cx.save(); cx.globalAlpha = fogI*0.8;
    for(const f of fogs){ cx.save(); cx.translate(f.x,f.y); cx.scale(f.s,f.s); cx.drawImage(FOG,-70,-22); cx.restore(); }
    cx.restore();
    cx.fillStyle = `rgba(222,229,233,${0.10*fogI})`;
    cx.fillRect(0,0,LW,LH);
  }
  // lueur du crépuscule / de l'aube
  if(duskK>0.02){ cx.fillStyle=`rgba(255,138,64,${0.07*duskK})`; cx.fillRect(0,0,LW,LH); }
  // voile de nuit
  if(light<0.98){
    cx.fillStyle = `rgba(16,24,58,${0.46*(1-light)})`;
    cx.fillRect(0,0,LW,LH);
  }
  // lucioles luisantes (glow additif) — uniquement en pleine nuit
  if(light<0.25){
    cx.save(); cx.globalCompositeOperation="lighter";
    for(const fl of fireflies){
      const s2 = toScreen(fl.x, fl.y);
      const fx2 = Math.round(s2.x+ox), fy2 = Math.round(s2.y+oy-10+Math.sin(t*1.6+fl.ph)*4);
      if(fx2<-20||fx2>LW+20||fy2<-20||fy2>LH+20) continue;   // hors champ
      const a = (1-light*4)*(0.35+0.45*Math.sin(t*2.6+fl.ph));
      if(a<=0.03) continue;
      cx.globalAlpha = Math.max(0, Math.min(1, a));
      cx.drawImage(GLOW, fx2-12, fy2-12);
      cx.fillStyle="#f4ffb0"; cx.fillRect(fx2, fy2, 1, 1);
    }
    cx.restore(); cx.globalAlpha = 1;
  }
  // post-traitement HD-2D (lighting → bloom → bokeh → vignette → grain)
  flushLights(t);
  applyBloom();
  drawBokeh(t, dt);
  applyVignette();
  applyFilmGrain(t);
  // textes flottants
  cx.textAlign="center"; cx.font="bold 9px 'Courier New', monospace";
  for(const f of floats){
    const a = Math.min(1, f.t/0.4);
    cx.fillStyle = "rgba(255,255,255,"+(0.85*a)+")";
    cx.fillText(f.str, Math.round(f.sx+ox), Math.round(f.sy+oy)+1);
    cx.fillStyle = f.c.startsWith("#") ? f.c : f.c;
    cx.globalAlpha = a;
    cx.fillText(f.str, Math.round(f.sx+ox), Math.round(f.sy+oy));
    cx.globalAlpha = 1;
  }

  // cœurs de vie (coin haut gauche)
  for(let i=0;i<player.maxHp/2;i++){
    const seg = player.hp - i*2;
    const img = seg>=2 ? HEARTS.full : seg>=1 ? HEARTS.half : HEARTS.empty;
    cx.drawImage(img, 6+i*10, 6);
  }

  // superposition de la scène de combat (zone éclairée façon Wakfu + UI)
  if(gameMode!=="explore") renderBattle(t, ox, oy);

  requestAnimationFrame(loop);
}
refreshUI();
requestAnimationFrame(loop);
