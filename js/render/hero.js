"use strict";
/* Dessin du personnage joueur selon direction, animation et équipement. */

function drawHero(g, px, py, dir, frame, walking, swing){
  const P = (x,y,w,h,c)=>{ g.fillStyle=c; g.fillRect(Math.round(px+x), Math.round(py+y), w, h); };
  const bob = walking && (frame===1||frame===3) ? -1 : 0;
  const skin="#c68a5a", skinD="#a8703f", hair="#1d1d22", moko="#6b4a33";
  const hasTorse = !!equip.torse;
  const torseC = hasTorse ? "#8a6240" : skin;
  g.fillStyle="rgba(20,40,20,0.30)";
  g.beginPath(); g.ellipse(px+5, py+15, 5, 2.2, 0, 0, 7); g.fill();

  const legA = walking ? (frame===1? -1 : frame===3? 1 : 0) : 0;
  P(3, 11+bob+ (legA<0?-1:0), 1, 3-(legA<0?-1:0), skin);
  P(6, 11+bob+ (legA>0?-1:0), 1, 3-(legA>0?-1:0), skin);
  if(equip.pieds){ P(3, 12+bob, 1, 2, "#3e2d20"); P(6, 12+bob, 1, 2, "#3e2d20"); }
  else { P(3, 13+bob, 1, 1, skinD); P(6, 13+bob, 1, 1, skinD); }

  P(2, 6+bob, 6, 4, torseC);
  if(hasTorse){ P(2, 8+bob, 6, 1, "#6f4c30"); P(4, 6+bob, 2, 1, "#6f4c30"); }
  else { P(3, 7+bob, 1, 1, moko); P(5, 8+bob, 1, 1, moko); P(6, 7+bob, 1, 1, moko); }
  P(2, 10+bob, 6, 2, "#a3754d");
  P(2, 10+bob, 6, 1, "#6f4c30");
  P(3, 12+bob, 1, 1, "#a3754d"); P(6, 12+bob, 1, 1, "#a3754d");
  const swingArm = swing>0;
  const arm = walking ? (frame===1? 1 : frame===3? -1 : 0) : 0;
  if(!swingArm){
    P(1, 7+bob+arm, 1, 3, torseC); P(1, 9+bob+arm, 1, 1, skin);
    P(8, 7+bob-arm, 1, 3, torseC); P(8, 9+bob-arm, 1, 1, skin);
    if(!hasTorse){ P(1, 7+bob+arm, 1, 1, moko); P(8, 7+bob-arm, 1, 1, moko); }
  } else {
    const up = swing>0.5;
    const side = (dir==="left") ? -1 : 1;
    const ax = side<0 ? -2 : 9;
    P(side<0?1:8, 7+bob, 1, 3, torseC);
    P(ax+ (side<0?2:-1), up? 3+bob : 7+bob, 1, 2, "#f2c79a");
    if(hasEquip("arme","lance")){
      P(ax, up? -2+bob : 3+bob, 1, 7, "#8a6240");
      P(ax, up? -4+bob : 1+bob, 1, 2, "#c4cacd");
    } else {
      P(ax, up? 1+bob : 6+bob, 2, 3, "#7a5536");
      P(ax+(side<0?-1:1), up? 0+bob : 5+bob, 2, 2,
        hasEquip("arme","hache_pierre") ? "#9aa2a6" : "#c4cacd");
      if(hasEquip("arme","hache_pierre"))
        P(ax+(side<0?-1:1), up? -1+bob : 4+bob, 2, 1, "#c4cacd");
    }
  }

  P(3, 1+bob, 5, 5, skin);
  if(dir==="up"){ P(3,1+bob,5,4,hair); }
  else {
    P(3,1+bob,5,2,hair);
    if(dir==="left"){ P(3,3+bob,1,2,hair); }
    if(dir==="right"){ P(7,3+bob,1,2,hair); }
  }
  if(dir==="down"){ P(4,3+bob,1,1,"#1d1d22"); P(6,3+bob,1,1,"#1d1d22"); P(5,4+bob,1,1,moko); }
  if(dir==="left"){ P(4,3+bob,1,1,"#1d1d22"); P(4,4+bob,1,1,moko); }
  if(dir==="right"){ P(6,3+bob,1,1,"#1d1d22"); P(6,4+bob,1,1,moko); }

  if(equip.tete){
    P(2, 0+bob, 6, 1, "#7a5536");
    P(4, -1+bob, 3, 1, "#8a6240");
    P(1, 1+bob, 8, 1, "#5b4128");
    P(8, -1+bob, 1, 1, "#e0463f");
    P(8, -2+bob, 1, 1, "#e0463f");
  } else {
    P(4, 0+bob, 3, 1, hair);
    P(5, -1+bob, 2, 1, hair);
    P(5, -2+bob, 1, 1, hair);
  }
}
