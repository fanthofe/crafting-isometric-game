"use strict";
/* Esprits de la Nature : lueurs, apparition et dialogues. */

/* ====================== Esprits de la Nature ====================== */
const SPIRIT_GLOW_AO = makeCanvas(36,36,g=>{
  const gr = g.createRadialGradient(18,18,1,18,18,18);
  gr.addColorStop(0,"rgba(100,255,130,0.95)");
  gr.addColorStop(0.4,"rgba(50,200,80,0.38)");
  gr.addColorStop(1,"rgba(30,180,60,0)");
  g.fillStyle=gr; g.fillRect(0,0,36,36);
});
const SPIRIT_GLOW_RAKA = makeCanvas(36,36,g=>{
  const gr = g.createRadialGradient(18,18,1,18,18,18);
  gr.addColorStop(0,"rgba(255,90,60,0.95)");
  gr.addColorStop(0.4,"rgba(200,40,20,0.38)");
  gr.addColorStop(1,"rgba(180,10,0,0)");
  g.fillStyle=gr; g.fillRect(0,0,36,36);
});

function wrapText(str, maxChars){
  const words=str.split(" "); const lines=[]; let cur="";
  for(const w of words){
    if((cur+" "+w).trim().length<=maxChars) cur=(cur+" "+w).trim();
    else { if(cur) lines.push(cur); cur=w; }
  }
  if(cur) lines.push(cur); return lines;
}
function roundRect(g,x,y,w,h,r){
  g.beginPath();
  g.moveTo(x+r,y); g.lineTo(x+w-r,y); g.quadraticCurveTo(x+w,y,x+w,y+r);
  g.lineTo(x+w,y+h-r); g.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  g.lineTo(x+r,y+h); g.quadraticCurveTo(x,y+h,x,y+h-r);
  g.lineTo(x,y+r); g.quadraticCurveTo(x,y,x+r,y); g.closePath();
}

const spiritBubbles = [];
function spiritSay(speaker, msg, duration=5){
  const idx = spiritBubbles.findIndex(b=>b.speaker===speaker);
  if(idx>=0) spiritBubbles.splice(idx,1);
  spiritBubbles.push({speaker, msg, t:duration, maxT:duration});
}

const ao = {
  x:spawn.x+1.8, y:spawn.y-0.5, ph:0,
  visible:true, cooldown:4, talkTimer:12,
  seenBois:false, seenPlanche:false, seenFeu:false,
  trail:[],
};
const raka = {
  x:spawn.x-3, y:spawn.y-3, ph:Math.PI,
  visible:false, emerged:false, cooldown:0,
  targetX:spawn.x-3, targetY:spawn.y-3,
  trail:[],
};
// Message de bienvenue d'Ao
spiritSay("ao", "Je suis Ao, esprit de la forêt. Coupe un arbre pour commencer.", 7);

// lucioles nocturnes avec halo lumineux pré-rendu
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
// pluie (gouttes en coordonnées écran) & nappes de brume
const drops = [];
for(let i=0;i<110;i++) drops.push({x:Math.random()*LW, y:Math.random()*LH, s:150+Math.random()*70});
const FOG = makeCanvas(140,44,g=>{
  const gr = g.createRadialGradient(70,22,4,70,22,66);
  gr.addColorStop(0,"rgba(235,240,243,0.5)"); gr.addColorStop(1,"rgba(235,240,243,0)");
  g.fillStyle=gr; g.fillRect(0,0,140,44);
});
const fogs = [];
for(let i=0;i<6;i++) fogs.push({x:Math.random()*LW, y:20+Math.random()*(LH-60), v:3+Math.random()*5, s:1.2+Math.random()*1.4});
// brillances scintillantes du plein jour
const sparkles = [];

