"use strict";
/* Constantes moteur, canvas, mise à l'échelle, générateur aléatoire déterministe. */

const TW = 32, TH = 16, SIDE_H = 6; // SIDE_H : hauteur des flancs des blocs 3D
const MAP = 96;
const LW = 432, LH = 270;
const SPEED = 3.4;
const REACH = 1.35;
const SWING_TIME = 0.3;

const TREE_FADE_MIN = 0.6;
const TREE_FADE_SPEED = 9;

const TRIGGER_RADIUS = 2.2;
const BATTLE_ZONE_MARGIN = 30;
const BATTLE_DARK = 0.62;
const BATTLE_ZONE_FADE = 3;

const cv = document.getElementById("game");
const cx = cv.getContext("2d");
cv.width = LW; cv.height = LH;
cx.imageSmoothingEnabled = false;

function fit(){
  const s = Math.max(1, Math.floor(Math.min(innerWidth/LW, innerHeight/LH)));
  cv.style.width = (LW*s)+"px";
  cv.style.height = (LH*s)+"px";
}
addEventListener("resize", fit); fit();

let seed = 20260610;
function rnd(){ seed = (seed*1664525 + 1013904223) >>> 0; return seed/4294967296; }
