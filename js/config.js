"use strict";
/* Réglages globaux, canvas, mise à l'échelle, générateur aléatoire déterministe. */

/* ====================== Réglages ====================== */
const TW = 32, TH = 16;
const MAP = 96;                  // une grande île
const LW = 432, LH = 270;
const SPEED = 3.4;
const REACH = 1.35;          // portée de l'action
const SWING_TIME = 0.3;      // durée d'un coup

// Transparence d'un arbre qui masque un élément situé derrière lui
const TREE_FADE_MIN = 0.6;   // opacité quand l'arbre cache quelque chose (reste visible)
const TREE_FADE_SPEED = 9;   // vitesse de transition opaque <-> translucide

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

/* ============ Aléatoire déterministe ============ */
let seed = 20260610;
function rnd(){ seed = (seed*1664525 + 1013904223) >>> 0; return seed/4294967296; }

