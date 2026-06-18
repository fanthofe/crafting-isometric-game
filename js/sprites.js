"use strict";
/* Pré-rendu des graphismes : tuiles, décor, icônes, cœurs et sprites d'animaux. */

/* ====================== Pré-rendu des tuiles ====================== */
function makeCanvas(w,h,draw){
  const c = document.createElement("canvas"); c.width=w; c.height=h;
  const g = c.getContext("2d"); g.imageSmoothingEnabled=false; draw(g); return c;
}
function diamondPath(g){ g.beginPath(); g.moveTo(TW/2,0); g.lineTo(TW,TH/2); g.lineTo(TW/2,TH); g.lineTo(0,TH/2); g.closePath(); }

const GRASS = ["#79c061","#6fb759","#83c96b"].map(base=>
  makeCanvas(TW,TH,g=>{
    diamondPath(g); g.fillStyle=base; g.fill();
    g.save(); diamondPath(g); g.clip();
    for(let i=0;i<26;i++){
      const x=Math.floor(rnd()*TW), y=Math.floor(rnd()*TH);
      g.fillStyle = rnd()<0.5 ? "rgba(255,255,255,0.10)" : "rgba(30,70,30,0.14)";
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
    g.fillStyle="#73badf";
    for(let i=0;i<7;i++){
      const x=2+Math.floor(rnd()*(TW-6)), y=2+Math.floor(rnd()*(TH-4));
      g.fillRect(x+(f? 2:0), y, 4,1);
    }
    g.fillStyle="rgba(255,255,255,0.35)";
    g.fillRect(6+(f?3:0),5,3,1); g.fillRect(20-(f?3:0),10,3,1);
    g.restore();
    diamondPath(g); g.strokeStyle="rgba(30,70,110,0.4)"; g.stroke();
  })
);
const SAND = makeCanvas(TW,TH,g=>{
  diamondPath(g); g.fillStyle="#e8d49a"; g.fill();
  g.save(); diamondPath(g); g.clip();
  for(let i=0;i<22;i++){
    const x=Math.floor(rnd()*TW), y=Math.floor(rnd()*TH);
    g.fillStyle = rnd()<0.5 ? "rgba(255,255,255,0.18)" : "rgba(150,120,60,0.18)";
    g.fillRect(x,y,1,1);
  }
  g.restore();
  diamondPath(g); g.strokeStyle="rgba(150,120,60,0.25)"; g.lineWidth=1; g.stroke();
});
const EDGE_L = makeCanvas(TW/2, TH+12, g=>{
  g.beginPath(); g.moveTo(0,0); g.lineTo(TW/2,TH/2); g.lineTo(TW/2,TH/2+12); g.lineTo(0,12); g.closePath();
  g.fillStyle="#8a6240"; g.fill();
  g.fillStyle="#6f4c30"; g.fillRect(0,9,TW/2,1); g.fillRect(4,4,3,1);
});
const EDGE_R = makeCanvas(TW/2, TH+12, g=>{
  g.beginPath(); g.moveTo(TW/2,0); g.lineTo(0,TH/2); g.lineTo(0,TH/2+12); g.lineTo(TW/2,12); g.closePath();
  g.fillStyle="#7a5536"; g.fill();
  g.fillStyle="#5f4128"; g.fillRect(0,10,TW/2,1); g.fillRect(8,5,3,1);
});

/* ====================== Pré-rendu du décor ====================== */
const TREES = [0,1].map(v=>
  makeCanvas(40,52,g=>{
    g.fillStyle="#7a5536"; g.fillRect(18,38,4,12);
    g.fillStyle="#5f4128"; g.fillRect(18,38,1,12);
    const greens = v? ["#3f8f4f","#4ea75d","#67bd72"] : ["#37804a","#469a58","#5cb169"];
    const blob=(cxp,cyp,w,h,col)=>{
      g.fillStyle=col; g.beginPath();
      g.moveTo(cxp,cyp-h); g.lineTo(cxp+w,cyp); g.lineTo(cxp,cyp+h); g.lineTo(cxp-w,cyp); g.closePath(); g.fill();
    };
    blob(20,30,17,11,greens[0]);
    blob(20,22,14,10,greens[1]);
    blob(20,14,10,8,greens[2]);
    g.fillStyle="rgba(255,255,255,0.25)";
    g.fillRect(14,12,2,1); g.fillRect(24,19,2,1); g.fillRect(11,27,2,1);
  })
);
const FRUIT_KINDS = [
  {fruit:"pomme",  greens:["#3f8f4f","#4ea75d","#67bd72"], fc:"#e0463f"},
  {fruit:"prune",  greens:["#3c7f56","#4a9a64","#5fb077"], fc:"#8e5bc8"},
  {fruit:"cerise", greens:["#4d9447","#5fae4e","#79c061"], fc:"#c22b48"},
  {fruit:"poire",  greens:["#46915a","#57a76b","#6cbd7e"], fc:"#c9c440"},
  {fruit:"orange", greens:["#3a8a50","#48a05e","#5cb56f"], fc:"#f08c1d"},
  {fruit:"peche",  greens:["#4a9a52","#5cb062","#70c473"], fc:"#f2a07b"},
];
const FRUIT_POS = [[12,24],[26,18],[18,10]];   // positions des fruits sur le feuillage
const FRUIT_TREES_IMG = FRUIT_KINDS.map(k=>
  makeCanvas(40,52,g=>{
    g.fillStyle="#8a6240"; g.fillRect(18,38,4,12);
    g.fillStyle="#6f4c30"; g.fillRect(18,38,1,12);
    const blob=(cxp,cyp,w,h,col)=>{
      g.fillStyle=col; g.beginPath();
      g.moveTo(cxp,cyp-h); g.lineTo(cxp+w,cyp); g.lineTo(cxp,cyp+h); g.lineTo(cxp-w,cyp); g.closePath(); g.fill();
    };
    blob(20,28,16,11,k.greens[0]);
    blob(20,20,13,9,k.greens[1]);
    blob(20,13,9,7,k.greens[2]);
    g.fillStyle="rgba(255,255,255,0.25)";
    g.fillRect(15,11,2,1); g.fillRect(25,18,2,1);
  })
);
/* ---------- 5 essences d'arbres supplémentaires ---------- */
function leafBlob(g,cxp,cyp,w,h,col){
  g.fillStyle=col; g.beginPath();
  g.moveTo(cxp,cyp-h); g.lineTo(cxp+w,cyp); g.lineTo(cxp,cyp+h); g.lineTo(cxp-w,cyp); g.closePath(); g.fill();
}
const CHENE = makeCanvas(40,52,g=>{      // chêne : large couronne, tronc épais
  g.fillStyle="#6f4c30"; g.fillRect(17,34,6,16);
  g.fillStyle="#54371f"; g.fillRect(17,34,2,16);
  leafBlob(g,20,25,19,13,"#2f7a44");
  leafBlob(g,12,20,9,7,"#3f8f4f");
  leafBlob(g,28,20,9,7,"#3f8f4f");
  leafBlob(g,20,13,11,9,"#54a55e");
  g.fillStyle="rgba(255,255,255,0.25)";
  g.fillRect(16,10,2,1); g.fillRect(26,17,2,1); g.fillRect(10,24,2,1);
});
const BOULEAU = makeCanvas(40,52,g=>{    // bouleau : tronc blanc tacheté, feuillage clair
  g.fillStyle="#e8e4da"; g.fillRect(18,28,4,22);
  g.fillStyle="#3e3a36"; g.fillRect(18,32,2,1); g.fillRect(20,38,2,1); g.fillRect(18,44,2,1); g.fillRect(20,47,1,1);
  leafBlob(g,20,21,13,9,"#7fb558");
  leafBlob(g,20,14,10,8,"#94c468");
  leafBlob(g,20,8,7,6,"#a8d378");
  g.fillStyle="rgba(255,255,255,0.3)"; g.fillRect(17,7,2,1); g.fillRect(24,13,2,1);
});
const PIN = makeCanvas(40,52,g=>{        // pin : silhouette conique sombre
  g.fillStyle="#5b3a23"; g.fillRect(18,42,4,8);
  g.fillStyle="#3e2d20"; g.fillRect(18,42,1,8);
  const tri=(yTop,yBot,w,col)=>{ g.fillStyle=col; g.beginPath();
    g.moveTo(20,yTop); g.lineTo(20+w,yBot); g.lineTo(20-w,yBot); g.closePath(); g.fill(); };
  tri(24,44,17,"#235741");
  tri(13,33,13,"#28624a");
  tri(2,21,9,"#2e6e4e");
  g.fillStyle="rgba(255,255,255,0.2)"; g.fillRect(17,9,2,1); g.fillRect(23,18,2,1);
});
const SAULE = makeCanvas(40,52,g=>{      // saule : feuillage tombant
  g.fillStyle="#7a5536"; g.fillRect(18,34,4,16);
  g.fillStyle="#5f4128"; g.fillRect(18,34,1,16);
  leafBlob(g,20,18,17,11,"#6fae62");
  leafBlob(g,20,11,11,7,"#7fbc70");
  [4,9,15,23,29,34].forEach((x,i)=>{
    const ys=16+(i%3)*2, hh=14+(i%2)*4;
    g.fillStyle="#7cc47a"; g.fillRect(x,ys,2,hh);
    g.fillStyle="#5e9a52"; g.fillRect(x,ys+hh-2,2,2);
  });
});
const ERABLE = makeCanvas(40,52,g=>{     // érable : couronne aux couleurs d'automne
  g.fillStyle="#7a5536"; g.fillRect(18,36,4,14);
  g.fillStyle="#5f4128"; g.fillRect(18,36,1,14);
  leafBlob(g,20,27,17,11,"#c25b3a");
  leafBlob(g,20,19,14,10,"#d97f2e");
  leafBlob(g,20,12,10,8,"#e8a23f");
  g.fillStyle="rgba(255,240,200,0.3)"; g.fillRect(15,10,2,1); g.fillRect(25,17,2,1);
});
const ESSENCES = [
  {name:"frêne",   hp:3, yield:[2,3]},
  {name:"orme",    hp:3, yield:[2,3]},
  {name:"chêne",   hp:4, yield:[3,5]},
  {name:"bouleau", hp:2, yield:[1,2]},
  {name:"pin",     hp:4, yield:[3,4]},
  {name:"saule",   hp:3, yield:[2,3]},
  {name:"érable",  hp:3, yield:[2,4]},
];
const TREE_IMG = [TREES[0], TREES[1], CHENE, BOULEAU, PIN, SAULE, ERABLE];
for(const d of decor) if(d.type==="tree") d.hp = ESSENCES[d.v].hp;

const STUMP = makeCanvas(16,10,g=>{
  g.fillStyle="#7a5536"; g.fillRect(4,2,8,6);
  g.fillStyle="#caa173"; g.fillRect(5,2,6,2);
  g.fillStyle="#8a6240"; g.fillRect(7,3,2,1);
  g.fillStyle="#5f4128"; g.fillRect(4,7,8,1);
});
const ROCKS = [0,1].map(v=>
  makeCanvas(22,14,g=>{
    g.fillStyle="#9aa2a6";
    if(v===0){ g.fillRect(4,5,14,7); g.fillRect(7,2,8,4); }
    else { g.fillRect(3,6,10,6); g.fillRect(11,4,8,8); }
    g.fillStyle="#c4cacd"; g.fillRect(7,3,4,2); g.fillRect(5,6,3,2);
    g.fillStyle="#6e767b"; g.fillRect(4,10,14,2);
  })
);
const PEBBLES = makeCanvas(18,8,g=>{
  g.fillStyle="#9aa2a6"; g.fillRect(3,3,4,3); g.fillRect(10,4,5,3);
  g.fillStyle="#6e767b"; g.fillRect(3,5,4,1); g.fillRect(10,6,5,1);
});

/* ---------- Icônes pixel-art des objets d'inventaire ---------- */
function icon12(draw){ return makeCanvas(12,12,draw); }
const ICON_SRC = {
  bois: icon12(g=>{
    g.fillStyle="#8a6240"; g.fillRect(1,4,9,4);
    g.fillStyle="#6f4c30"; g.fillRect(1,7,9,1); g.fillRect(3,5,4,1);
    g.fillStyle="#d2a763"; g.fillRect(10,4,2,4);
    g.fillStyle="#a87e52"; g.fillRect(10,5,1,2);
  }),
  pierre: icon12(g=>{
    g.fillStyle="#9aa2a6"; g.fillRect(2,5,8,5); g.fillRect(4,3,5,2);
    g.fillStyle="#c4cacd"; g.fillRect(4,4,3,2);
    g.fillStyle="#6e767b"; g.fillRect(2,9,8,1);
  }),
  planche: icon12(g=>{
    g.fillStyle="#d2a763"; g.fillRect(1,3,10,3); g.fillRect(1,7,10,3);
    g.fillStyle="#b08144"; g.fillRect(1,5,10,1); g.fillRect(1,9,10,1);
    g.fillStyle="#6f4c30"; g.fillRect(2,4,1,1); g.fillRect(9,4,1,1); g.fillRect(2,8,1,1); g.fillRect(9,8,1,1);
  }),
  feu: icon12(g=>{
    g.fillStyle="#5f4128"; g.fillRect(2,9,8,2);
    g.fillStyle="#e8743f"; g.fillRect(5,2,2,2); g.fillRect(4,4,4,3); g.fillRect(3,6,6,3);
    g.fillStyle="#f4c542"; g.fillRect(5,6,2,3);
  }),
  pomme: icon12(g=>{
    g.fillStyle="#6f4c30"; g.fillRect(5,1,1,3);
    g.fillStyle="#4ea75d"; g.fillRect(6,2,3,1);
    g.fillStyle="#e0463f"; g.fillRect(3,4,6,6); g.fillRect(2,5,8,4);
    g.fillStyle="#f4978e"; g.fillRect(3,5,2,2);
  }),
  prune: icon12(g=>{
    g.fillStyle="#6f4c30"; g.fillRect(6,1,1,3);
    g.fillStyle="#8e5bc8"; g.fillRect(3,4,6,7); g.fillRect(2,6,8,3);
    g.fillStyle="#b692e0"; g.fillRect(4,5,2,2);
  }),
  cerise: icon12(g=>{
    g.fillStyle="#4a7d3a"; g.fillRect(5,1,2,1); g.fillRect(4,2,1,4); g.fillRect(7,2,1,4);
    g.fillStyle="#c22b48"; g.fillRect(2,6,4,4); g.fillRect(7,7,4,4);
    g.fillStyle="#ef7d92"; g.fillRect(3,7,1,1); g.fillRect(8,8,1,1);
  }),
  poire: icon12(g=>{
    g.fillStyle="#6f4c30"; g.fillRect(6,1,1,2);
    g.fillStyle="#c9c440"; g.fillRect(5,3,3,3); g.fillRect(4,6,5,5); g.fillRect(3,7,7,3);
    g.fillStyle="#e4df72"; g.fillRect(4,7,2,2);
  }),
  orange: icon12(g=>{
    g.fillStyle="#3f8f4f"; g.fillRect(7,1,3,2);
    g.fillStyle="#f08c1d"; g.fillRect(3,4,6,6); g.fillRect(2,5,8,4);
    g.fillStyle="#f7b35e"; g.fillRect(3,5,2,2);
  }),
  peche: icon12(g=>{
    g.fillStyle="#4ea75d"; g.fillRect(7,1,3,2);
    g.fillStyle="#f2a07b"; g.fillRect(3,4,6,6); g.fillRect(2,5,8,4);
    g.fillStyle="#d97f5e"; g.fillRect(6,4,1,6);
    g.fillStyle="#fac8ae"; g.fillRect(3,5,2,2);
  }),
  salade: icon12(g=>{
    g.fillStyle="#e0463f"; g.fillRect(3,3,2,2);
    g.fillStyle="#8e5bc8"; g.fillRect(5,2,2,2);
    g.fillStyle="#f08c1d"; g.fillRect(7,3,2,2);
    g.fillStyle="#a3754d"; g.fillRect(2,5,8,4);
    g.fillStyle="#8a6240"; g.fillRect(2,5,8,1);
    g.fillStyle="#6f4c30"; g.fillRect(3,9,6,1);
  }),
  viande: icon12(g=>{
    g.fillStyle="#b5483a"; g.fillRect(2,4,6,6); g.fillRect(1,5,8,4);
    g.fillStyle="#d97f5e"; g.fillRect(2,5,2,2);
    g.fillStyle="#e8e4da"; g.fillRect(8,6,2,2); g.fillRect(10,5,2,2); g.fillRect(10,7,2,2);
  }),
  cuir: icon12(g=>{
    g.fillStyle="#a3754d"; g.fillRect(2,3,8,7); g.fillRect(1,4,10,5);
    g.fillStyle="#c19a6b"; g.fillRect(3,5,5,3);
    g.fillStyle="#7c5836"; g.fillRect(2,9,8,1);
  }),
  plume: icon12(g=>{
    g.fillStyle="#e8e4da";
    for(let i=0;i<7;i++) g.fillRect(2+i, 8-i, 3, 2);
    g.fillStyle="#b9b4a8";
    for(let i=0;i<4;i++) g.fillRect(1+i, 10-i, 1, 1);
  }),
  brochette: icon12(g=>{
    g.fillStyle="#8a6240";
    for(let i=0;i<10;i++) g.fillRect(1+i, 10-i, 1, 1);
    g.fillStyle="#b5483a"; g.fillRect(3,6,3,3); g.fillRect(6,3,3,3);
    g.fillStyle="#d97f5e"; g.fillRect(4,7,1,1); g.fillRect(7,4,1,1);
  }),
  hache_pierre: icon12(g=>{
    g.fillStyle="#7a5536";
    for(let i=0;i<7;i++) g.fillRect(2+i, 9-i, 2, 1);
    g.fillStyle="#9aa2a6"; g.fillRect(6,1,5,4); g.fillRect(5,2,1,2);
    g.fillStyle="#c4cacd"; g.fillRect(7,2,3,2);
  }),
  lance: icon12(g=>{
    g.fillStyle="#8a6240";
    for(let i=0;i<8;i++) g.fillRect(1+i, 10-i, 1, 1);
    g.fillStyle="#c4cacd"; g.fillRect(9,1,2,2); g.fillRect(8,3,1,1);
    g.fillStyle="#e8ecee"; g.fillRect(10,1,1,1);
  }),
  chapeau: icon12(g=>{
    g.fillStyle="#7a5536"; g.fillRect(2,7,8,2); g.fillRect(4,4,4,3);
    g.fillStyle="#5b4128"; g.fillRect(2,8,8,1); g.fillRect(4,6,4,1);
    g.fillStyle="#e0463f"; g.fillRect(7,3,1,3); g.fillRect(8,2,1,2);
  }),
  tunique: icon12(g=>{
    g.fillStyle="#a3754d"; g.fillRect(3,3,6,7); g.fillRect(1,3,2,3); g.fillRect(9,3,2,3);
    g.fillStyle="#7c5836"; g.fillRect(5,3,2,2); g.fillRect(3,9,6,1);
    g.fillStyle="#c19a6b"; g.fillRect(5,5,1,4);
  }),
  bottes: icon12(g=>{
    g.fillStyle="#7c5836"; g.fillRect(2,3,3,5); g.fillRect(2,8,4,2); g.fillRect(7,3,3,5); g.fillRect(7,8,4,2);
    g.fillStyle="#5b4128"; g.fillRect(2,9,4,1); g.fillRect(7,9,4,1);
    g.fillStyle="#a3754d"; g.fillRect(2,3,3,1); g.fillRect(7,3,3,1);
  }),
  os: icon12(g=>{
    g.fillStyle="#ddd8c8"; g.fillRect(4,1,4,10); g.fillRect(3,1,6,2); g.fillRect(3,9,6,2);
    g.fillStyle="#c8c2b0"; g.fillRect(5,3,2,6);
    g.fillStyle="#ede8d8"; g.fillRect(4,2,1,1); g.fillRect(4,9,1,1);
  }),
  griffe: icon12(g=>{
    g.fillStyle="#8ab0c0";
    for(let i=0;i<4;i++) g.fillRect(2+i*2, 2, 1, 7-i);
    g.fillStyle="#c0d4e0"; g.fillRect(2,2,1,1); g.fillRect(4,2,1,1);
    g.fillStyle="#5a7a88"; g.fillRect(2,8,7,1);
    g.fillStyle="#b0c8d8"; g.fillRect(6,2,1,1);
  }),
  fourrure_lunaire: icon12(g=>{
    g.fillStyle="#7080b0"; g.fillRect(2,3,8,7); g.fillRect(1,4,10,5);
    g.fillStyle="#9ab0d0"; g.fillRect(3,4,6,4);
    g.fillStyle="#dde8ff"; g.fillRect(5,5,2,2);
    g.fillStyle="#5060a0"; g.fillRect(2,9,8,1);
  }),
  plume_noire: icon12(g=>{
    g.fillStyle="#2e2e42";
    for(let i=0;i<7;i++) g.fillRect(2+i, 8-i, 3, 2);
    g.fillStyle="#6060a0";
    for(let i=0;i<4;i++) g.fillRect(1+i, 10-i, 1, 1);
    g.fillStyle="#8080c0"; g.fillRect(8,1,1,1);
  }),
  torche: icon12(g=>{
    g.fillStyle="#8a6240"; g.fillRect(5,5,2,7);
    g.fillStyle="#e8743f"; g.fillRect(4,2,4,4); g.fillRect(3,3,6,3);
    g.fillStyle="#f4c542"; g.fillRect(5,3,2,3);
    g.fillStyle="#fff3bd"; g.fillRect(5,2,1,1);
  }),
  dague: icon12(g=>{
    g.fillStyle="#6a4a30";
    for(let i=0;i<4;i++) g.fillRect(3+i, 9-i, 2, 1);
    g.fillStyle="#8ab0c0";
    for(let i=0;i<6;i++) g.fillRect(4+i, 8-i, 1, 1);
    g.fillStyle="#c0d4e0"; g.fillRect(9,3,1,1); g.fillRect(10,2,1,1);
    g.fillStyle="#5a7a88"; g.fillRect(3,9,2,2);
  }),
};
const ICON = {}; for(const k in ICON_SRC) ICON[k] = ICON_SRC[k].toDataURL();

/* ---------- Cœurs de vie ---------- */
function heartCanvas(mode){
  return makeCanvas(8,7,g=>{
    const draw=(c)=>{ g.fillStyle=c;
      g.fillRect(1,1,2,1); g.fillRect(5,1,2,1);
      g.fillRect(0,2,8,2); g.fillRect(1,4,6,1); g.fillRect(2,5,4,1); g.fillRect(3,6,2,1); };
    draw(mode==="empty" ? "rgba(40,20,20,0.45)" : "#e0463f");
    if(mode==="half"){ g.save(); g.beginPath(); g.rect(4,0,4,7); g.clip(); draw("rgba(40,20,20,0.45)"); g.restore(); }
    if(mode!=="empty"){ g.fillStyle="rgba(255,255,255,.5)"; g.fillRect(1,2,1,1); }
  });
}
const HEARTS = {full:heartCanvas("full"), half:heartCanvas("half"), empty:heartCanvas("empty")};

/* ---------- Sprites des animaux (2 images, orientés vers la droite) ---------- */
function frames2(w,h,draw){ return [0,1].map(f=>makeCanvas(w,h,g=>draw(g,f))); }
const ANIMAL_IMG = {
  lapin: frames2(12,10,(g,f)=>{
    g.fillStyle="#cfd2d6"; g.fillRect(2,4,8,4); g.fillRect(8,2,3,4);
    g.fillRect(8,0,1,3); g.fillRect(10,f,1,3);
    g.fillStyle="#e8b4c0"; g.fillRect(8,1,1,1);
    g.fillStyle="#ffffff"; g.fillRect(1,4,2,2);
    g.fillStyle="#2b2026"; g.fillRect(10,3,1,1);
    g.fillStyle="#9fa4ab";
    if(f){ g.fillRect(3,8,2,2); g.fillRect(7,8,2,2); }
    else { g.fillRect(2,8,2,2); g.fillRect(8,8,2,2); }
  }),
  faisan: frames2(12,10,(g,f)=>{
    g.fillStyle="#7a4a2b"; g.fillRect(0,3,4,1); g.fillRect(1,4,3,1);
    g.fillStyle="#a33b2e"; g.fillRect(3,3,6,4);
    g.fillStyle="#2e6e3e"; g.fillRect(8,1,3,3);
    g.fillStyle="#ffffff"; g.fillRect(8,3,2,1);
    g.fillStyle="#e0463f"; g.fillRect(9,1,1,1);
    g.fillStyle="#e3b95c"; g.fillRect(11,2,1,1);
    g.fillStyle="#5b3a23";
    if(f){ g.fillRect(5,7,1,3); g.fillRect(7,7,1,3); }
    else { g.fillRect(4,7,1,3); g.fillRect(8,7,1,3); }
  }),
  renard: frames2(14,10,(g,f)=>{
    g.fillStyle="#f3e8d8"; g.fillRect(0,4,2,2);
    g.fillStyle="#d9762e"; g.fillRect(1,3,4,3); g.fillRect(4,3,7,4); g.fillRect(10,1,3,4);
    g.fillRect(10,0,1,2); g.fillRect(12,0,1,2);
    g.fillStyle="#f3e8d8"; g.fillRect(9,5,2,2);
    g.fillStyle="#2b2026"; g.fillRect(11,2,1,1); g.fillRect(13,3,1,1);
    g.fillStyle="#5b3a23";
    if(f){ g.fillRect(5,7,1,3); g.fillRect(9,7,1,3); }
    else { g.fillRect(4,7,1,3); g.fillRect(10,7,1,3); }
  }),
  cerf: frames2(14,13,(g,f)=>{
    g.fillStyle="#6f4c30"; g.fillRect(9,0,1,3); g.fillRect(12,0,1,3); g.fillRect(8,1,2,1); g.fillRect(11,1,2,1);
    g.fillStyle="#b08968"; g.fillRect(9,3,4,3); g.fillRect(8,5,3,3); g.fillRect(2,6,9,4);
    g.fillStyle="#e8ddcf"; g.fillRect(1,6,1,2); g.fillRect(3,8,6,2);
    g.fillStyle="#2b2026"; g.fillRect(11,4,1,1);
    g.fillStyle="#8a6850";
    if(f){ g.fillRect(4,10,1,3); g.fillRect(9,10,1,3); }
    else { g.fillRect(3,10,1,3); g.fillRect(10,10,1,3); }
  }),
  sanglier: frames2(14,10,(g,f)=>{
    g.fillStyle="#3e2d20"; g.fillRect(2,2,9,1);
    g.fillStyle="#5b4332"; g.fillRect(1,3,10,5); g.fillRect(10,4,3,4);
    g.fillStyle="#8c6a52"; g.fillRect(13,6,1,2);
    g.fillStyle="#e8e4da"; g.fillRect(12,7,1,1);
    g.fillStyle="#2b2026"; g.fillRect(11,5,1,1);
    g.fillStyle="#3e2d20";
    if(f){ g.fillRect(3,8,2,2); g.fillRect(9,8,2,2); }
    else { g.fillRect(2,8,2,2); g.fillRect(10,8,2,2); }
  }),
};
const ANIMAL_TYPES = {
  lapin:    {name:"Lapin",    hp:1, speed:3.0, flee:2.4, drops:{viande:[1,1]},              xp:3},
  faisan:   {name:"Faisan",   hp:1, speed:2.6, flee:2.2, drops:{viande:[1,1], plume:[1,2]}, xp:3},
  renard:   {name:"Renard",   hp:2, speed:3.1, flee:2.8, drops:{viande:[1,1], cuir:[1,1]},  xp:5},
  cerf:     {name:"Cerf",     hp:3, speed:3.6, flee:3.5, drops:{viande:[2,3], cuir:[1,2]},  xp:8},
  sanglier: {name:"Sanglier", hp:4, speed:1.8, flee:1.6, drops:{viande:[2,3], cuir:[1,1]},  xp:10, aggressive:true, dmg:1},
};
const ANIMAL_LIST = Object.keys(ANIMAL_TYPES);

