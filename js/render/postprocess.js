"use strict";
/* Post-traitement HD-2D : bloom, vignette, film grain, bokeh.
   Appeler après le rendu de scène, avant les textes flottants et le HUD. */

// ── Bloom ─────────────────────────────────────────────────────────────────────
// Snapshot flouté du canvas recomposité en "screen" → lumières qui saignent.
const _bloom = document.createElement("canvas");
_bloom.width = LW; _bloom.height = LH;
const _bloomCtx = _bloom.getContext("2d");

function applyBloom() {
  _bloomCtx.clearRect(0, 0, LW, LH);
  _bloomCtx.filter = "blur(3px) brightness(1.7)";
  _bloomCtx.drawImage(cv, 0, 0);
  _bloomCtx.filter = "none";
  cx.save();
  cx.globalCompositeOperation = "screen";
  cx.globalAlpha = 0.13;
  cx.drawImage(_bloom, 0, 0);
  cx.restore();
  cx.globalAlpha = 1;
}

// ── Vignette ──────────────────────────────────────────────────────────────────
// Dégradé radial sombre autour du cadre — "focalise" le regard vers le centre.
function applyVignette() {
  const gr = cx.createRadialGradient(LW / 2, LH / 2, LH * 0.18, LW / 2, LH / 2, LW * 0.82);
  gr.addColorStop(0,   "rgba(0,0,0,0)");
  gr.addColorStop(0.52,"rgba(0,0,0,0)");
  gr.addColorStop(1,   "rgba(0,0,0,0.60)");
  cx.fillStyle = gr;
  cx.fillRect(0, 0, LW, LH);
}

// ── Film grain ────────────────────────────────────────────────────────────────
// 4 frames de bruit pré-générés, animés à ~18 fps → texture filmique vivante.
const GRAIN_SZ = 64;
const GRAIN_FRAMES = 4;
const _grainFrames = [];

function _buildGrainFrames() {
  for (let f = 0; f < GRAIN_FRAMES; f++) {
    const tmp = document.createElement("canvas");
    tmp.width = GRAIN_SZ; tmp.height = GRAIN_SZ;
    const gctx = tmp.getContext("2d");
    const img = gctx.createImageData(GRAIN_SZ, GRAIN_SZ);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = (Math.random() * 22) | 0;
    }
    gctx.putImageData(img, 0, 0);
    _grainFrames.push(tmp);
  }
}

function applyFilmGrain(t) {
  if (!_grainFrames.length) _buildGrainFrames();
  const frame = _grainFrames[(t * 18 | 0) % GRAIN_FRAMES];
  cx.save();
  cx.globalCompositeOperation = "overlay";
  cx.globalAlpha = 0.25;
  for (let y = 0; y < LH; y += GRAIN_SZ)
    for (let x = 0; x < LW; x += GRAIN_SZ)
      cx.drawImage(frame, x, y);
  cx.restore();
  cx.globalAlpha = 1;
}

// ── Bokeh ─────────────────────────────────────────────────────────────────────
// Particules lumineuses flottantes, hors-focus → simulation d'ouverture de caméra.
const _BOKEH_COLS = [
  [255, 248, 192],
  [200, 240, 255],
  [210, 255, 178],
  [255, 210, 240],
];
const _bokeh = [];
(function _initBokeh() {
  for (let i = 0; i < 16; i++) {
    const c = _BOKEH_COLS[i % _BOKEH_COLS.length];
    _bokeh.push({
      x: Math.random() * LW,
      y: Math.random() * LH,
      r: 1.8 + Math.random() * 3.2,
      vy: -(8 + Math.random() * 18),
      ph: Math.random() * 6.28,
      r0: c[0], g0: c[1], b0: c[2],
      baseAlpha: 0.10 + Math.random() * 0.26,
    });
  }
})();

function drawBokeh(t, dt) {
  for (const b of _bokeh) {
    b.y += b.vy * dt;
    if (b.y < -10) b.y = LH + 8;
  }
  cx.save();
  cx.globalCompositeOperation = "screen";
  for (const b of _bokeh) {
    const pulse = b.baseAlpha * (0.55 + 0.45 * Math.sin(t * 1.4 + b.ph));
    if (pulse < 0.035) continue;
    const rad = b.r * 4;
    const gr = cx.createRadialGradient(b.x, b.y, 0, b.x, b.y, rad);
    gr.addColorStop(0, `rgba(${b.r0},${b.g0},${b.b0},${pulse.toFixed(3)})`);
    gr.addColorStop(1, `rgba(${b.r0},${b.g0},${b.b0},0)`);
    cx.fillStyle = gr;
    cx.fillRect(b.x - rad, b.y - rad, rad * 2, rad * 2);
  }
  cx.restore();
  cx.globalAlpha = 1;
}
