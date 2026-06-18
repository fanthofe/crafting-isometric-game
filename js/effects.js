"use strict";
/* Papillons, particules, textes flottants, météo et cycle jour/nuit. */

/* ====================== Papillons, particules, textes ====================== */
const butterflies = [];
for(let i=0;i<10;i++) butterflies.push({
  x: 2+rnd()*(MAP-4), y: 2+rnd()*(MAP-4),
  a: rnd()*6.28, ph: rnd()*6.28,
  c: ["#f4c542","#e89bd0","#9bd0f4"][i%3]
});
const particles = []; // {sx,sy,vx,vy,t,c}
const floats = [];    // {sx,sy,t,str,c}
function burst(sx,sy,color,n){
  for(let i=0;i<n;i++) particles.push({
    sx, sy: sy-6, vx:(Math.random()-0.5)*40, vy:-30-Math.random()*30,
    t:0.5+Math.random()*0.3, c:color
  });
}

/* ====================== Météo & cycle jour/nuit ====================== */
const DAY_LEN = 120;                 // durée d'un cycle complet (secondes)
let dayT = DAY_LEN*0.10;             // on commence le matin
let weather = "soleil", weatherT = 35+Math.random()*25;
let rainI = 0, fogI = 0;             // intensités lissées (transitions douces)
function dayPhase(){ return (dayT%DAY_LEN)/DAY_LEN; }
function lightLevel(){               // 1 = plein jour, 0 = nuit noire
  const p = dayPhase();
  if(p<0.40) return 1;
  if(p<0.50) return 1-(p-0.40)/0.10; // crépuscule
  if(p<0.80) return 0;               // nuit
  if(p<0.95) return (p-0.80)/0.15;   // aube
  return 1;
}
function duskGlow(){                 // lueur orangée au couchant / levant
  const p = dayPhase();
  return Math.max(0, 1-Math.abs(p-0.45)/0.07) + Math.max(0, 1-Math.abs(p-0.875)/0.07);
}
function mixC(a,b,k){ return [a[0]+(b[0]-a[0])*k, a[1]+(b[1]-a[1])*k, a[2]+(b[2]-a[2])*k]; }
function cssC(c){ return `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`; }

