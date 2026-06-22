"use strict";
/* Esprits de la Nature : lueurs, apparition et dialogues. */

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
spiritSay("ao", "Je suis Ao, esprit de la forêt. Coupe un arbre pour commencer.", 7);
