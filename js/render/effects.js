"use strict";
/* Papillons, particules, textes flottants, météo, cycle jour/nuit, lucioles, pluie, brume. */

const butterflies = [];
for(let i=0;i<10;i++) butterflies.push({
  x: 2+rnd()*(MAP-4), y: 2+rnd()*(MAP-4),
  a: rnd()*6.28, ph: rnd()*6.28,
  c: ["#f4c542","#e89bd0","#9bd0f4"][i%3]
});
const particles = [];
const floats = [];
function burst(sx,sy,color,n){
  for(let i=0;i<n;i++) particles.push({
    sx, sy: sy-6, vx:(Math.random()-0.5)*40, vy:-30-Math.random()*30,
    t:0.5+Math.random()*0.3, c:color
  });
}

const DAY_LEN = 120;
let dayT = DAY_LEN*0.10;
let weather = "soleil", weatherT = 35+Math.random()*25;
let rainI = 0, fogI = 0;
function dayPhase(){ return (dayT%DAY_LEN)/DAY_LEN; }
function lightLevel(){
  const p = dayPhase();
  if(p<0.40) return 1;
  if(p<0.50) return 1-(p-0.40)/0.10;
  if(p<0.80) return 0;
  if(p<0.95) return (p-0.80)/0.15;
  return 1;
}
function duskGlow(){
  const p = dayPhase();
  return Math.max(0, 1-Math.abs(p-0.45)/0.07) + Math.max(0, 1-Math.abs(p-0.875)/0.07);
}
function mixC(a,b,k){ return [a[0]+(b[0]-a[0])*k, a[1]+(b[1]-a[1])*k, a[2]+(b[2]-a[2])*k]; }
function cssC(c){ return `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`; }

const GLOW = makeCanvas(24,24,g=>{
  const gr = g.createRadialGradient(12,12,1,12,12,12);
  gr.addColorStop(0,"rgba(220,255,150,0.9)");
  gr.addColorStop(0.4,"rgba(180,230,90,0.32)");
  gr.addColorStop(1,"rgba(180,230,90,0)");
  g.fillStyle=gr; g.fillRect(0,0,24,24);
});
const fireflies = [];
for(let i=0;i<40;i++) fireflies.push({
  x:2+rnd()*(MAP-4), y:2+rnd()*(MAP-4), a:rnd()*6.28, ph:rnd()*6.28
});
const drops = [];
for(let i=0;i<110;i++) drops.push({x:Math.random()*LW, y:Math.random()*LH, s:150+Math.random()*70});
const FOG = makeCanvas(140,44,g=>{
  const gr = g.createRadialGradient(70,22,4,70,22,66);
  gr.addColorStop(0,"rgba(235,240,243,0.5)"); gr.addColorStop(1,"rgba(235,240,243,0)");
  g.fillStyle=gr; g.fillRect(0,0,140,44);
});
const fogs = [];
for(let i=0;i<6;i++) fogs.push({x:Math.random()*LW, y:20+Math.random()*(LH-60), v:3+Math.random()*5, s:1.2+Math.random()*1.4});
const sparkles = [];
