"use strict";
/* Tuiles isométriques pré-rendues : herbe, eau, sable, bords. */

function diamondPath(g){ g.beginPath(); g.moveTo(TW/2,0); g.lineTo(TW,TH/2); g.lineTo(TW/2,TH); g.lineTo(0,TH/2); g.closePath(); }

const GRASS = ["#79c061","#6fb759","#83c96b"].map(base=>
  makeCanvas(TW,TH,g=>{
    diamondPath(g); g.fillStyle=base; g.fill();
    g.save(); diamondPath(g); g.clip();
    // Touffes d'herbe structurées
    for(let i=0;i<6;i++){
      const x=4+Math.floor(rnd()*(TW-8)), y=2+Math.floor(rnd()*(TH-4));
      g.fillStyle = "rgba(30,70,30,0.18)";
      g.fillRect(x,y,1,2); g.fillRect(x-1,y+1,1,1); g.fillRect(x+1,y+1,1,1);
      g.fillStyle = "rgba(255,255,255,0.12)";
      g.fillRect(x,y,1,1);
    }
    g.restore();
    diamondPath(g); g.strokeStyle="rgba(40,80,40,0.25)"; g.lineWidth=1; g.stroke();
  })
);
const WATER = [0,1].map(f=>
  makeCanvas(TW,TH,g=>{
    diamondPath(g); g.fillStyle="#4f9fd6"; g.fill();
    g.save(); diamondPath(g); g.clip();
    // Vagues animées plus définies
    g.fillStyle="#73badf";
    for(let i=0;i<6;i++){
      const x=2+Math.floor(rnd()*(TW-6)), y=2+Math.floor(rnd()*(TH-4));
      const off = f ? (i%2?2:-2) : 0;
      g.fillRect(x+off, y, 5,1);
      g.fillStyle="rgba(255,255,255,0.2)";
      g.fillRect(x+off+1, y, 2,1);
      g.fillStyle="#73badf";
    }
    g.fillStyle="rgba(255,255,255,0.4)";
    g.fillRect(6+(f?4:-2),5,4,1); g.fillRect(20+(f?-4:2),10,4,1);
    g.restore();
    diamondPath(g); g.strokeStyle="rgba(30,70,110,0.4)"; g.stroke();
  })
);
const SAND = makeCanvas(TW,TH,g=>{
  diamondPath(g); g.fillStyle="#e8d49a"; g.fill();
  g.save(); diamondPath(g); g.clip();
  for(let i=0;i<30;i++){
    const x=Math.floor(rnd()*TW), y=Math.floor(rnd()*TH);
    g.fillStyle = rnd()<0.3 ? "rgba(255,255,255,0.4)" : "rgba(150,120,60,0.2)";
    g.fillRect(x,y,1,1);
  }
  g.restore();
  diamondPath(g); g.strokeStyle="rgba(150,120,60,0.25)"; g.lineWidth=1; g.stroke();
});
const EDGE_L = makeCanvas(TW/2, TH+12, g=>{
  g.beginPath(); g.moveTo(0,0); g.lineTo(TW/2,TH/2); g.lineTo(TW/2,TH/2+12); g.lineTo(0,12); g.closePath();
  g.fillStyle="#8a6240"; g.fill();
  // Highlights
  g.fillStyle="rgba(255,255,255,0.15)"; g.fillRect(0,0,TW/2,1); g.fillRect(0,0,1,12);
  g.fillStyle="#6f4c30"; g.fillRect(0,9,TW/2,1); g.fillRect(4,4,3,1);
});
const EDGE_R = makeCanvas(TW/2, TH+12, g=>{
  g.beginPath(); g.moveTo(TW/2,0); g.lineTo(0,TH/2); g.lineTo(0,TH/2+12); g.lineTo(TW/2,12); g.closePath();
  g.fillStyle="#7a5536"; g.fill();
  // Highlights
  g.fillStyle="rgba(255,255,255,0.15)"; g.fillRect(0,0,TW/2,1); g.fillRect(TW/2-1,0,1,12);
  g.fillStyle="#5f4128"; g.fillRect(0,10,TW/2,1); g.fillRect(8,5,3,1);
});
