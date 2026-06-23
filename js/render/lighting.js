"use strict";
/* Lumières ponctuelles additives — style HD-2D.
   Appelez addLight() pendant le rendu des décors, puis flushLights() une fois
   toutes les sources enregistrées (après les entités, avant le post-traitement). */

const _pointLights = [];

function addLight(sx, sy, radius, r, g, b, intensity) {
  _pointLights.push({ sx, sy, radius, r, g, b, intensity });
}

function flushLights(t) {
  if (!_pointLights.length) return;
  cx.save();
  cx.globalCompositeOperation = "lighter";
  for (const L of _pointLights) {
    const flicker = 1 + 0.07 * Math.sin(t * 6.8 + L.sx * 0.03 + L.sy * 0.02);
    const rad = L.radius * flicker;
    const alpha = Math.min(0.88, L.intensity * flicker);
    const gr = cx.createRadialGradient(L.sx, L.sy, 0, L.sx, L.sy, rad);
    gr.addColorStop(0,   `rgba(${L.r},${L.g},${L.b},${alpha.toFixed(3)})`);
    gr.addColorStop(0.38,`rgba(${L.r},${L.g},${L.b},${(alpha * 0.32).toFixed(3)})`);
    gr.addColorStop(1,   `rgba(${L.r},${L.g},${L.b},0)`);
    cx.fillStyle = gr;
    cx.fillRect(L.sx - rad, L.sy - rad, rad * 2, rad * 2);
  }
  cx.restore();
  _pointLights.length = 0;
}
