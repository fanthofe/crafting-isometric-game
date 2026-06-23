"use strict";
/* Tuiles isométriques HD — blocs 3D avec face supérieure + flancs latéraux.
   Chaque sprite fait TW × (TH + SIDE_H) = 32 × 22 px.
   L'eau reste plate (32 × 16) — pas de flancs (niveau marin). */

// ── Utilitaires ───────────────────────────────────────────────────────────────

function diamondPath(g){
  g.beginPath();
  g.moveTo(TW/2, 0); g.lineTo(TW, TH/2); g.lineTo(TW/2, TH); g.lineTo(0, TH/2);
  g.closePath();
}

/* Dessine les deux flancs de terre visibles sous le losange.
   Flanc gauche  (SW) : (0,TH/2) → (TW/2,TH) → (TW/2,TH+SIDE_H) → (0,TH/2+SIDE_H)
   Flanc droit   (SE) : (TW/2,TH) → (TW,TH/2) → (TW,TH/2+SIDE_H) → (TW/2,TH+SIDE_H) */
function drawSideFaces(g, leftCol, leftHi, rightCol, rightHi){
  // Flanc gauche — demi-ombre (reçoit un peu de lumière latérale)
  g.beginPath();
  g.moveTo(0,      TH/2);
  g.lineTo(TW/2,   TH);
  g.lineTo(TW/2,   TH + SIDE_H);
  g.lineTo(0,      TH/2 + SIDE_H);
  g.closePath();
  g.fillStyle = leftCol; g.fill();
  g.strokeStyle = leftHi; g.lineWidth = 1;
  g.beginPath(); g.moveTo(0, TH/2); g.lineTo(TW/2, TH); g.stroke();

  // Flanc droit — ombre (face opposée à la lumière NW)
  g.beginPath();
  g.moveTo(TW/2,   TH);
  g.lineTo(TW,     TH/2);
  g.lineTo(TW,     TH/2 + SIDE_H);
  g.lineTo(TW/2,   TH + SIDE_H);
  g.closePath();
  g.fillStyle = rightCol; g.fill();
  g.strokeStyle = rightHi; g.lineWidth = 1;
  g.beginPath(); g.moveTo(TW/2, TH); g.lineTo(TW, TH/2); g.stroke();
}

// ── HERBE (3 variantes) ───────────────────────────────────────────────────────

const GRASS = ["#5fb830", "#68c438", "#56ae2c"].map(base =>
  makeCanvas(TW, TH + SIDE_H, g => {

    // Face supérieure : remplissage de base
    diamondPath(g); g.fillStyle = base; g.fill();
    g.save(); diamondPath(g); g.clip();

    // Highlight arête NW (haut-gauche et haut-droite du losange)
    g.strokeStyle = "rgba(190,255,90,0.32)"; g.lineWidth = 1;
    g.beginPath(); g.moveTo(TW/2, 1); g.lineTo(1, TH/2 - 1); g.stroke();
    g.beginPath(); g.moveTo(TW/2, 1); g.lineTo(TW - 1, TH/2 - 1); g.stroke();

    // Ombre arête SE (bas-gauche et bas-droite)
    g.strokeStyle = "rgba(0,50,0,0.30)"; g.lineWidth = 1;
    g.beginPath(); g.moveTo(1, TH/2 + 1); g.lineTo(TW/2, TH - 1); g.stroke();
    g.beginPath(); g.moveTo(TW - 1, TH/2 + 1); g.lineTo(TW/2, TH - 1); g.stroke();

    // Texture bruit — pixels NW plus clairs, SE plus sombres
    for(let i = 0; i < 44; i++){
      const x = Math.floor(rnd() * TW), y = Math.floor(rnd() * TH);
      const nw = (x / TW + y / TH) < 0.90;
      g.fillStyle = rnd() < 0.5
        ? (nw ? "rgba(200,255,100,0.14)" : "rgba(240,255,180,0.07)")
        : (nw ? "rgba(20,80,10,0.12)"   : "rgba(0,40,0,0.22)");
      g.fillRect(x, y, 1, 1);
    }

    // Brins d'herbe sur l'arête nord (petits traits lumineux)
    g.fillStyle = "rgba(180,255,80,0.60)";
    for(let i = 0; i < 5; i++){
      const bx = Math.floor(TW/5 + i * (TW * 0.6) / 5);
      const by2 = Math.round(Math.abs(bx - TW/2) * TH / TW);
      if(by2 >= 0 && by2 < TH - 3) g.fillRect(bx, by2, 1, 2);
    }

    g.restore();
    drawSideFaces(g, "#7a4c28", "#9a6840", "#4e2c14", "#683c1e");
  })
);

// ── EAU (2 frames animées) ────────────────────────────────────────────────────
// L'eau reste plate (ras du sol) — pas de flancs, hauteur = TH seul.

const WATER = [0, 1].map(f =>
  makeCanvas(TW, TH, g => {
    diamondPath(g); g.fillStyle = "#42b8a8"; g.fill();
    g.save(); diamondPath(g); g.clip();

    // Bandes de reflet animées
    const sh = f ? 3 : 0;
    g.fillStyle = "#72d8c8";
    for(let i = 0; i < 6; i++){
      const rx = 3 + ((i * 6 + sh) % (TW - 6));
      const ry = 2 + Math.floor(i * (TH - 4) / 6);
      if(ry < TH - 1) g.fillRect(rx, ry, 3 + (i % 2), 1);
    }

    // Spéculaires blancs
    g.fillStyle = "rgba(255,255,255,0.58)";
    g.fillRect(7 + (f ? 2 : 0), 4,  3, 1);
    g.fillRect(21 - (f ? 2 : 0), 9, 2, 1);
    g.fillRect(13 + (f ? -1 : 1), 12, 2, 1);

    // Profondeur NE/SE (légèrement plus sombre)
    g.fillStyle = "rgba(10,60,80,0.18)";
    g.fillRect(TW - 6, TH/2 - 1, 4, 1);
    g.fillRect(TW/2 + 2, TH - 3, 5, 1);

    g.restore();
    diamondPath(g);
    g.strokeStyle = "rgba(20,80,90,0.38)"; g.lineWidth = 1; g.stroke();
  })
);

// ── SABLE ─────────────────────────────────────────────────────────────────────

const SAND = makeCanvas(TW, TH + SIDE_H, g => {
  diamondPath(g); g.fillStyle = "#d4a96a"; g.fill();
  g.save(); diamondPath(g); g.clip();

  // Highlight NW
  g.strokeStyle = "rgba(255,240,180,0.38)"; g.lineWidth = 1;
  g.beginPath(); g.moveTo(TW/2, 1); g.lineTo(1, TH/2 - 1); g.stroke();
  g.beginPath(); g.moveTo(TW/2, 1); g.lineTo(TW - 1, TH/2 - 1); g.stroke();

  // Ombre SE
  g.strokeStyle = "rgba(100,60,10,0.25)"; g.lineWidth = 1;
  g.beginPath(); g.moveTo(1, TH/2 + 1); g.lineTo(TW/2, TH - 1); g.stroke();
  g.beginPath(); g.moveTo(TW - 1, TH/2 + 1); g.lineTo(TW/2, TH - 1); g.stroke();

  // Grain de sable dense
  for(let i = 0; i < 52; i++){
    const x = Math.floor(rnd() * TW), y = Math.floor(rnd() * TH);
    g.fillStyle = rnd() < 0.5
      ? "rgba(255,248,210,0.20)"
      : "rgba(140,90,30,0.18)";
    g.fillRect(x, y, 1, 1);
  }

  // Dithering 2×2 creux/crêtes
  for(let y2 = 1; y2 < TH - 1; y2 += 2){
    for(let x2 = 1; x2 < TW - 1; x2 += 2){
      if(rnd() < 0.18){
        g.fillStyle = "rgba(190,150,70,0.14)";
        g.fillRect(x2, y2, 1, 1);
      }
    }
  }

  g.restore();
  drawSideFaces(g, "#9a6a38", "#b88450", "#6a4420", "#8a5c30");
});

// ── BORDS DE FALAISE ──────────────────────────────────────────────────────────

const EDGE_L = makeCanvas(TW/2, TH + 12, g => {
  g.beginPath();
  g.moveTo(0, 0); g.lineTo(TW/2, TH/2); g.lineTo(TW/2, TH/2+12); g.lineTo(0, 12);
  g.closePath();
  const gr = g.createLinearGradient(0, 0, TW/2, 0);
  gr.addColorStop(0, "#9a7250"); gr.addColorStop(1, "#7a5236");
  g.fillStyle = gr; g.fill();
  g.fillStyle = "#5f4128"; g.fillRect(0, 9, TW/2, 1);
  g.fillStyle = "#b08060"; g.fillRect(4, 3, 3, 1); g.fillRect(2, 6, 2, 1);
});

const EDGE_R = makeCanvas(TW/2, TH + 12, g => {
  g.beginPath();
  g.moveTo(TW/2, 0); g.lineTo(0, TH/2); g.lineTo(0, TH/2+12); g.lineTo(TW/2, 12);
  g.closePath();
  const gr = g.createLinearGradient(TW/2, 0, 0, 0);
  gr.addColorStop(0, "#7a5236"); gr.addColorStop(1, "#5a3820");
  g.fillStyle = gr; g.fill();
  g.fillStyle = "#3e2814"; g.fillRect(0, 10, TW/2, 1);
  g.fillStyle = "#906040"; g.fillRect(8, 4, 3, 1); g.fillRect(10, 7, 2, 1);
});
