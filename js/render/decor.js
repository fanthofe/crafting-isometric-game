"use strict";
/* Sprites pré-rendus du décor : arbres, rochers, palmier, arbres fruitiers. */

const TREES = [0,1].map(v=>
  makeCanvas(40,52,g=>{
    g.fillStyle="#7a5536"; g.fillRect(18,38,4,12);
    g.fillStyle="#5f4128"; g.fillRect(18,38,1,12);
    const greens = v? ["#3f8f4f","#4ea75d","#67bd72"] : ["#37804a","#469a58","#5cb169"];
    const blob=(cxp,cyp,w,h,col)=>{
      g.fillStyle=col; g.beginPath();
      g.moveTo(cxp,cyp-h); g.lineTo(cxp+w,cyp); g.lineTo(cxp,cyp+h); g.lineTo(cxp-w,cyp); g.closePath(); g.fill();
    };
    blob(20,30,17,11,greens[0]); blob(20,22,14,10,greens[1]); blob(20,14,10,8,greens[2]);
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
const FRUIT_POS = [[12,24],[26,18],[18,10]];
const FRUIT_TREES_IMG = FRUIT_KINDS.map(k=>
  makeCanvas(40,52,g=>{
    g.fillStyle="#8a6240"; g.fillRect(18,38,4,12);
    g.fillStyle="#6f4c30"; g.fillRect(18,38,1,12);
    const blob=(cxp,cyp,w,h,col)=>{
      g.fillStyle=col; g.beginPath();
      g.moveTo(cxp,cyp-h); g.lineTo(cxp+w,cyp); g.lineTo(cxp,cyp+h); g.lineTo(cxp-w,cyp); g.closePath(); g.fill();
    };
    blob(20,28,16,11,k.greens[0]); blob(20,20,13,9,k.greens[1]); blob(20,13,9,7,k.greens[2]);
    g.fillStyle="rgba(255,255,255,0.25)"; g.fillRect(15,11,2,1); g.fillRect(25,18,2,1);
  })
);
function leafBlob(g,cxp,cyp,w,h,col){
  g.fillStyle=col; g.beginPath();
  g.moveTo(cxp,cyp-h); g.lineTo(cxp+w,cyp); g.lineTo(cxp,cyp+h); g.lineTo(cxp-w,cyp); g.closePath(); g.fill();
}
const CHENE = makeCanvas(40,52,g=>{
  g.fillStyle="#6f4c30"; g.fillRect(17,34,6,16); g.fillStyle="#54371f"; g.fillRect(17,34,2,16);
  leafBlob(g,20,25,19,13,"#2f7a44"); leafBlob(g,12,20,9,7,"#3f8f4f"); leafBlob(g,28,20,9,7,"#3f8f4f"); leafBlob(g,20,13,11,9,"#54a55e");
  g.fillStyle="rgba(255,255,255,0.25)"; g.fillRect(16,10,2,1); g.fillRect(26,17,2,1); g.fillRect(10,24,2,1);
});
const BOULEAU = makeCanvas(40,52,g=>{
  g.fillStyle="#e8e4da"; g.fillRect(18,28,4,22);
  g.fillStyle="#3e3a36"; g.fillRect(18,32,2,1); g.fillRect(20,38,2,1); g.fillRect(18,44,2,1); g.fillRect(20,47,1,1);
  leafBlob(g,20,21,13,9,"#7fb558"); leafBlob(g,20,14,10,8,"#94c468"); leafBlob(g,20,8,7,6,"#a8d378");
  g.fillStyle="rgba(255,255,255,0.3)"; g.fillRect(17,7,2,1); g.fillRect(24,13,2,1);
});
const PIN = makeCanvas(40,52,g=>{
  g.fillStyle="#5b3a23"; g.fillRect(18,42,4,8); g.fillStyle="#3e2d20"; g.fillRect(18,42,1,8);
  const tri=(yTop,yBot,w,col)=>{ g.fillStyle=col; g.beginPath();
    g.moveTo(20,yTop); g.lineTo(20+w,yBot); g.lineTo(20-w,yBot); g.closePath(); g.fill(); };
  tri(24,44,17,"#235741"); tri(13,33,13,"#28624a"); tri(2,21,9,"#2e6e4e");
  g.fillStyle="rgba(255,255,255,0.2)"; g.fillRect(17,9,2,1); g.fillRect(23,18,2,1);
});
const SAULE = makeCanvas(40,52,g=>{
  g.fillStyle="#7a5536"; g.fillRect(18,34,4,16); g.fillStyle="#5f4128"; g.fillRect(18,34,1,16);
  leafBlob(g,20,18,17,11,"#6fae62"); leafBlob(g,20,11,11,7,"#7fbc70");
  [4,9,15,23,29,34].forEach((x,i)=>{
    const ys=16+(i%3)*2, hh=14+(i%2)*4;
    g.fillStyle="#7cc47a"; g.fillRect(x,ys,2,hh);
    g.fillStyle="#5e9a52"; g.fillRect(x,ys+hh-2,2,2);
  });
});
const ERABLE = makeCanvas(40,52,g=>{
  g.fillStyle="#7a5536"; g.fillRect(18,36,4,14); g.fillStyle="#5f4128"; g.fillRect(18,36,1,14);
  leafBlob(g,20,27,17,11,"#c25b3a"); leafBlob(g,20,19,14,10,"#d97f2e"); leafBlob(g,20,12,10,8,"#e8a23f");
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
const PALM_TREE = [0,1].map(v=>
  makeCanvas(40,60,g=>{
    g.fillStyle="#a07840"; g.fillRect(17,44,4,14);
    g.fillStyle="#8a6430"; g.fillRect(17,44,1,14); g.fillRect(17,44,4,1);
    g.fillStyle="#a07840"; g.fillRect(15,36,5,8); g.fillRect(13,28,5,8);
    g.fillStyle="#8a6430"; g.fillRect(13,28,1,8); g.fillRect(15,36,1,8);
    const leaves=[[20,26,-14,-10],[20,26,14,-10],[20,26,0,-16],[20,26,-10,-14],[20,26,10,-14]];
    const lc = v? "#3a8050":"#2e7040", lh = v? "#52a868":"#46966e";
    for(const [ox,oy,dx,dy] of leaves){
      g.strokeStyle=lc; g.lineWidth=2;
      g.beginPath(); g.moveTo(ox,oy); g.lineTo(ox+dx,oy+dy); g.stroke();
      g.strokeStyle=lh; g.lineWidth=1;
      for(let t2=0.2;t2<=0.9;t2+=0.2){
        const px=ox+dx*t2, py=oy+dy*t2, nx=-dy*0.35, ny=dx*0.35;
        g.beginPath(); g.moveTo(px,py); g.lineTo(px+nx,py+ny); g.stroke();
        g.beginPath(); g.moveTo(px,py); g.lineTo(px-nx,py-ny); g.stroke();
      }
    }
    g.fillStyle="#7a5a38"; g.fillRect(18,28,3,3); g.fillRect(22,30,3,3);
    g.fillStyle="#9a7a52"; g.fillRect(18,28,1,1); g.fillRect(22,30,1,1);
    g.fillStyle="rgba(255,255,255,0.22)"; g.fillRect(14,30,2,1); g.fillRect(17,38,1,1);
  })
);
