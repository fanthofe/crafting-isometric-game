"use strict";
/* Icônes pixel-art des objets + cœurs de vie pré-rendus. */

function icon12(draw){ return makeCanvas(12,12,draw); }
const ICON_SRC = {
  bois: icon12(g=>{
    g.fillStyle="#8a6240"; g.fillRect(1,4,9,4);
    g.fillStyle="#6f4c30"; g.fillRect(1,7,9,1); g.fillRect(3,5,4,1);
    g.fillStyle="#d2a763"; g.fillRect(10,4,2,4);
    g.fillStyle="#a87e52"; g.fillRect(10,5,1,2);
    // Bevel 2.5D
    g.fillStyle="rgba(255,255,255,0.2)"; g.fillRect(1,4,9,1); g.fillRect(1,4,1,3);
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
    // Bevel 2.5D
    g.fillStyle="rgba(255,255,255,0.25)"; g.fillRect(1,3,10,1); g.fillRect(1,7,10,1);
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
    // Shine
    g.fillStyle="#ffffff"; g.fillRect(4,5,1,1);
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
    // Shine
    g.fillStyle="#ffffff"; g.fillRect(10,1,1,1);
  }),
  lance: icon12(g=>{
    g.fillStyle="#8a6240";
    for(let i=0;i<8;i++) g.fillRect(1+i, 10-i, 1, 1);
    g.fillStyle="#c4cacd"; g.fillRect(9,1,2,2); g.fillRect(8,3,1,1);
    g.fillStyle="#ffffff"; g.fillRect(10,1,1,1);
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
    // Shine
    g.fillStyle="#ffffff"; g.fillRect(10,2,1,1);
  }),
};
const ICON = {};
for(const k in ICON_SRC) ICON[k] = ICON_SRC[k].toDataURL();
for(const k in ITEMS){
  if(!ICON_SRC[k]){
    ICON_SRC[k] = makeCanvas(12,12,g=>{
      const c = ITEMS[k].c || "#808080";
      g.fillStyle=c; g.fillRect(1,1,10,10);
      g.fillStyle="rgba(255,255,255,0.28)"; g.fillRect(1,1,10,3);
      g.fillStyle="rgba(0,0,0,0.18)"; g.fillRect(1,8,10,3);
    });
    ICON[k] = ICON_SRC[k].toDataURL();
  }
}

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
