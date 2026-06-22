"use strict";
/* Helpers partagés : rendu canvas, coordonnées isométriques, collision. */

function makeCanvas(w,h,draw){
  const c = document.createElement("canvas"); c.width=w; c.height=h;
  const g = c.getContext("2d"); g.imageSmoothingEnabled=false; draw(g); return c;
}

function frames2(w,h,draw){ return [0,1].map(f=>makeCanvas(w,h,g=>draw(g,f))); }

function toScreen(tx,ty){ return { x:(tx-ty)*(TW/2), y:(tx+ty)*(TH/2) }; }

function isBlocked(tx,ty){
  if(tx<0.3||ty<0.3||tx>MAP-0.3||ty>MAP-0.3) return true;
  const ix=Math.floor(tx), iy=Math.floor(ty);
  return blocked[iy]?.[ix] ?? true;
}
