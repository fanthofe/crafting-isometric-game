# TILES HD — Analyse de la référence & implémentation Canvas 2D

*Basé sur `assets/images/pixel-art-isometric.jpg` — 4 scènes analysées*

---

## 1. Analyse de l'image de référence

### 1.1 Ce qui différencie visuellement cette image de Kaimana actuel

| Aspect | Kaimana actuel | Image de référence |
|--------|---------------|---------------------|
| Structure tuile | Diamant plat 32×16 | **Bloc 3D** : face top + 2 faces latérales |
| Palette herbe | `#79c061` monotone | 4-5 verts par tuile, dégradé lumière/ombre |
| Texture | 26 pixels aléatoires | Dithering ordonné + bruit guidé par lumière |
| Bordure | Contour uni `rgba(40,80,40,0.25)` | Highlight NW brillant, ombre SE sombre |
| Sol visible | Non | Flancs de terre brune/sombre visibles sous la tuile |
| Eau | 2 barres statiques | Reflets animés + bulles + mousse de bord |

### 1.2 Scène par scène

**Scène 1 — Plage côtière :**
- Sable chaud ambre `#d4a66a`, dithering fin grain de sable
- Eau océan turquoise `#3ab8c8` avec mousse blanche aux bords de tuile
- Rochers : gris `#9aa8b0` avec face supérieure claire `#c8d0d4`, ombre portée profonde
- Flancs de sable visibles : `#a07040` (gauche) / `#7a5028` (droite)

**Scène 2 — Village / Prairie :**
- Herbe très saturée : `#5cae24` base, `#7fd438` highlight, `#3a7a14` ombre
- Rivière teal vif `#4cc4a8` avec reflets `#7de8d8`
- Fleurs et touffes d'herbe sur les tuiles — jamais vide
- Bâtiments avec toits en chaume, murs en bois chaud `#a87840`

**Scène 3 — Forêt automnale :**
- Sol brun chaud `#8c6a3c`, feuilles mortes dispersées `#c85020` `#d07820` `#e8a030`
- Troncs grands et tordus, écorce détaillée
- Atmosphère brumeuse : éléments d'arrière-plan légèrement désaturés

**Scène 4 — Désert / Ruines :**
- Sable pâle presque blanc `#c8b080`, chaleur aride
- Pierres craquelées, ruines en arc
- Ombres portées plus longues (soleil rasant)

---

## 2. Palette extraite par biome

### Herbe tropicale (Kaimana)
```
Face supérieure  #5fb830  base verte vibrante
Highlight NW     #8ed848  lisière lumineuse (1px)
Ombre SE         #3a8016  lisière sombre (1px)
Noise clair      rgba(200,255,100,0.14)
Noise sombre     rgba(10,50,10,0.20)
Flanc gauche     #7a4c28  terre brune, lumière latérale
Flanc droit      #4e2c14  terre sombre, ombre
Bordure top      rgba(40,90,20,0.30)
```

### Eau (teal tropical)
```
Base             #4abeaa  teal vif
Reflet 1         #72d8c8  highlight animé
Reflet 2         #2a9488  creux sombre
Contour          rgba(20,80,70,0.40)
Mousse bord      rgba(255,255,255,0.55)
```

### Sable (plage)
```
Face supérieure  #d4a96a  or chaud
Highlight        #e8c880  crête lumineuse
Ombre            #b08050  creux sombres
Noise            rgba(255,255,200,0.18) / rgba(120,80,30,0.16)
Flanc gauche     #9a6a38
Flanc droit      #6a4420
```

### Sol automnal (future extension)
```
Base             #8c6a3c  brun chaud
Feuilles         #c85020 / #d07820 / #e8a030 / #f0c060
Flanc gauche     #6a4824
Flanc droit      #4a3018
```

---

## 3. Architecture des tuiles 3D

La clé visuelle de la référence : les tuiles ne sont **pas des losanges plats** — ce sont des **blocs isométriques** avec deux faces latérales visibles en dessous du losange.

```
          Top vertex (TW/2, 0)
               ◆
              /|\ 
    Left    / | \    Right
   vertex  /  |  \  vertex
  (0,TH/2)◆  |   ◆(TW, TH/2)
           \  |  /
            \ | /  ← FACE SUPÉRIEURE (losange 32×16)
             \|/
    Bottom vertex (TW/2, TH)
              |
    ┌─────────┴─────────┐
    │   Flanc GAUCHE    │   Flanc DROIT   │
    │   (0,TH/2)→       │   ←(TW,TH/2)   │
    │   (TW/2,TH)       │   (TW/2,TH)    │
    │   +SIDE_H         │   +SIDE_H       │
    └───────────────────┴────────────────┘
              ↑
         SIDE_H = 6px
```

**Dimensions de la nouvelle tuile :**
- Largeur : `TW = 32px` (inchangé)
- Hauteur : `TH + SIDE_H = 16 + 6 = 22px`

Le moteur de rendu (`game.js`) ne change PAS — les pixels supplémentaires en bas du canvas sont automatiquement peints en dessous de la tuile, et le tri par profondeur (y outer loop, x inner loop) garantit que les tuiles profondes couvrent correctement les flancs des tuiles de devant.

---

## 4. Code Canvas 2D — `js/render/tiles.js` (remplacement complet)

```js
"use strict";
/* Tuiles isométriques HD — blocs 3D avec faces latérales */

const SIDE_H = 6; // hauteur des flancs visibles sous le losange

function diamondPath(g) {
  g.beginPath();
  g.moveTo(TW/2, 0); g.lineTo(TW, TH/2); g.lineTo(TW/2, TH); g.lineTo(0, TH/2);
  g.closePath();
}

// ─── Flancs communs ──────────────────────────────────────────────────────────
// leftFace  : (0,TH/2) → (TW/2,TH) → (TW/2,TH+SIDE_H) → (0,TH/2+SIDE_H)
// rightFace : (TW/2,TH) → (TW,TH/2) → (TW,TH/2+SIDE_H) → (TW/2,TH+SIDE_H)

function drawSideFaces(g, leftCol, leftHi, rightCol, rightSh) {
  // Flanc gauche (face SW — demi-ombre)
  g.beginPath();
  g.moveTo(0,       TH/2);
  g.lineTo(TW/2,    TH);
  g.lineTo(TW/2,    TH + SIDE_H);
  g.lineTo(0,       TH/2 + SIDE_H);
  g.closePath();
  g.fillStyle = leftCol; g.fill();
  // arête supérieure (jointure avec le dessus)
  g.strokeStyle = leftHi; g.lineWidth = 1;
  g.beginPath(); g.moveTo(0, TH/2); g.lineTo(TW/2, TH); g.stroke();

  // Flanc droit (face SE — ombre)
  g.beginPath();
  g.moveTo(TW/2,    TH);
  g.lineTo(TW,      TH/2);
  g.lineTo(TW,      TH/2 + SIDE_H);
  g.lineTo(TW/2,    TH + SIDE_H);
  g.closePath();
  g.fillStyle = rightCol; g.fill();
  // arête supérieure
  g.strokeStyle = rightSh; g.lineWidth = 1;
  g.beginPath(); g.moveTo(TW/2, TH); g.lineTo(TW, TH/2); g.stroke();
}

// ─── HERBE (3 variantes) ──────────────────────────────────────────────────────
const GRASS_BASES = ["#5fb830", "#68c438", "#56ae2c"];

const GRASS = GRASS_BASES.map(base =>
  makeCanvas(TW, TH + SIDE_H, g => {
    // Face supérieure
    diamondPath(g); g.fillStyle = base; g.fill();
    g.save(); diamondPath(g); g.clip();

    // Highlight NW (arêtes nord-ouest : haut→gauche et haut→droite)
    g.strokeStyle = "rgba(190,255,90,0.32)"; g.lineWidth = 1;
    g.beginPath(); g.moveTo(TW/2, 1); g.lineTo(1, TH/2 - 1); g.stroke(); // NW
    g.beginPath(); g.moveTo(TW/2, 1); g.lineTo(TW - 1, TH/2 - 1); g.stroke(); // NE

    // Ombre SE
    g.strokeStyle = "rgba(0,50,0,0.28)"; g.lineWidth = 1;
    g.beginPath(); g.moveTo(1, TH/2 + 1); g.lineTo(TW/2, TH - 1); g.stroke(); // SW
    g.beginPath(); g.moveTo(TW - 1, TH/2 + 1); g.lineTo(TW/2, TH - 1); g.stroke(); // SE

    // Texture : bruit guidé lumière (NW plus clair, SE plus sombre)
    for (let i = 0; i < 40; i++) {
      const x = Math.floor(rnd() * TW), y = Math.floor(rnd() * TH);
      // pixels NW (x+y < TW/2+TH/2) → plus clairs
      const nw = (x / TW + y / TH) < 0.9;
      g.fillStyle = rnd() < 0.5
        ? (nw ? "rgba(200,255,100,0.14)" : "rgba(255,255,200,0.08)")
        : (nw ? "rgba(20,80,10,0.12)"   : "rgba(0,40,0,0.22)");
      g.fillRect(x, y, 1, 1);
    }

    // Dithering 2×2 le long de l'arête SE (transition herbe→ombre)
    for (let i = 2; i < TW - 2; i += 2) {
      const yEdge = Math.round(TH/2 + (i - TW/2) * (TH/2) / (TW/2));
      if (yEdge >= 0 && yEdge < TH) {
        g.fillStyle = "rgba(0,50,0,0.18)";
        g.fillRect(i, yEdge, 1, 1);
      }
    }

    // Brins d'herbe — petits traits verticaux sur l'arête nord
    g.fillStyle = "rgba(160,255,60,0.55)";
    for (let i = 0; i < 5; i++) {
      const bx = Math.floor(TW/4 + i * TW/9);
      const by = Math.round(TH/4 - Math.abs(bx - TW/2) * TH / TW);
      if (by >= 0 && by < TH - 2) g.fillRect(bx, by, 1, 2);
    }

    g.restore();

    // Flancs latéraux
    drawSideFaces(g, "#7a4c28", "#9a6840", "#4e2c14", "#683c1e");
  })
);

// ─── EAU (2 frames animées) ───────────────────────────────────────────────────
const WATER = [0, 1].map(f =>
  makeCanvas(TW, TH, g => { // eau PLATE — pas de flancs (ras du sol)
    diamondPath(g); g.fillStyle = "#42b8a8"; g.fill();
    g.save(); diamondPath(g); g.clip();

    // Bandes de reflet animées (décalées entre les 2 frames)
    const shift = f ? 3 : 0;
    g.fillStyle = "#72d8c8";
    for (let i = 0; i < 6; i++) {
      const rx = 3 + ((i * 6 + shift) % (TW - 6));
      const ry = 3 + Math.floor(i * TH / 7);
      if (ry < TH - 2) g.fillRect(rx, ry, 3 + (i % 2), 1);
    }

    // Spéculaires blancs
    g.fillStyle = "rgba(255,255,255,0.55)";
    g.fillRect(7 + (f ? 2 : 0), 4, 3, 1);
    g.fillRect(21 - (f ? 2 : 0), 9, 2, 1);
    g.fillRect(14 + (f ? -1 : 1), 12, 2, 1);

    // Ombre profondeur NE/SE
    g.fillStyle = "rgba(20,80,100,0.18)";
    g.fillRect(TW - 6, TH/2 - 1, 4, 1);
    g.fillRect(TW/2 + 2, TH - 3, 5, 1);

    g.restore();
    diamondPath(g); g.strokeStyle = "rgba(20,80,90,0.38)"; g.lineWidth = 1; g.stroke();
  })
);

// ─── SABLE ────────────────────────────────────────────────────────────────────
const SAND = makeCanvas(TW, TH + SIDE_H, g => {
  diamondPath(g); g.fillStyle = "#d4a96a"; g.fill();
  g.save(); diamondPath(g); g.clip();

  // Highlight NW
  g.strokeStyle = "rgba(255,240,180,0.35)"; g.lineWidth = 1;
  g.beginPath(); g.moveTo(TW/2, 1); g.lineTo(1, TH/2 - 1); g.stroke();
  g.beginPath(); g.moveTo(TW/2, 1); g.lineTo(TW - 1, TH/2 - 1); g.stroke();

  // Grain de sable — dithering dense
  for (let i = 0; i < 48; i++) {
    const x = Math.floor(rnd() * TW), y = Math.floor(rnd() * TH);
    g.fillStyle = rnd() < 0.5
      ? "rgba(255,248,210,0.20)"
      : "rgba(140,90,30,0.18)";
    g.fillRect(x, y, 1, 1);
  }

  // Dithering 2×2 fond
  for (let y2 = 0; y2 < TH; y2 += 2) {
    for (let x2 = 0; x2 < TW; x2 += 2) {
      if (rnd() < 0.15) {
        g.fillStyle = "rgba(200,160,80,0.14)";
        g.fillRect(x2 + 1, y2 + 1, 1, 1);
      }
    }
  }

  g.restore();
  drawSideFaces(g, "#9a6a38", "#b88450", "#6a4420", "#8a5c30");
});

// ─── BORDS DE FALAISE (inchangés — compatibles avec les flancs) ───────────────
const EDGE_L = makeCanvas(TW/2, TH + 12, g => {
  g.beginPath(); g.moveTo(0,0); g.lineTo(TW/2,TH/2); g.lineTo(TW/2,TH/2+12); g.lineTo(0,12); g.closePath();
  const gr = g.createLinearGradient(0, 0, TW/2, TH/2);
  gr.addColorStop(0, "#9a7250"); gr.addColorStop(1, "#7a5236");
  g.fillStyle = gr; g.fill();
  g.fillStyle = "#5f4128"; g.fillRect(0, 9, TW/2, 1);
  g.fillStyle = "#b08060"; g.fillRect(4, 3, 3, 1);
});
const EDGE_R = makeCanvas(TW/2, TH + 12, g => {
  g.beginPath(); g.moveTo(TW/2,0); g.lineTo(0,TH/2); g.lineTo(0,TH/2+12); g.lineTo(TW/2,12); g.closePath();
  const gr = g.createLinearGradient(TW/2, 0, 0, TH/2);
  gr.addColorStop(0, "#7a5236"); gr.addColorStop(1, "#5a3820");
  g.fillStyle = gr; g.fill();
  g.fillStyle = "#3e2814"; g.fillRect(0, 10, TW/2, 1);
  g.fillStyle = "#906040"; g.fillRect(8, 4, 3, 1);
});
```

---

## 5. Adaptation du fond dans `game.js`

La seule modification dans `game.js` est l'ordre de rendu des tuiles eau. L'eau étant **plate** (pas de `SIDE_H`), elle reste à `TH=16`. Les autres tuiles (herbe, sable) sont maintenant à `TH+SIDE_H=22` — mais le code de rendu **ne change pas** :

```js
// game.js — section tuiles (inchangée fonctionnellement)
cx.drawImage(g===3 ? WATER[wf] : g===4 ? SAND : GRASS[g], dx, dy);
```

Les 6 pixels en plus (flancs) se placent automatiquement sous `dy` et sont couverts par les tuiles de profondeur supérieure grâce au tri painter's algorithm (boucle `y outer, x inner`).

---

## 6. Améliorations du décor recommandées depuis la référence

### 6.1 Arbres — passage de blob-diamond à blob-layered

La référence montre des arbres avec **3-4 couches de feuillage** dont les bords sont tracés individuellement (not simple diamond blobs) :

```js
// Remplacer les blobs losange par des ellipses superposées avec variation
function roundBlob(g, cx, cy, rx, ry, col, hlCol) {
  // Base verte
  g.fillStyle = col;
  g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI*2); g.fill();
  // Highlight NW (1/3 supérieur gauche)
  const hlGr = g.createRadialGradient(cx - rx*0.3, cy - ry*0.35, 1, cx, cy, rx*0.85);
  hlGr.addColorStop(0, hlCol);
  hlGr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = hlGr;
  g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI*2); g.fill();
}
```

### 6.2 Rochers — faces 3D

Les rochers de la référence ont clairement une **face supérieure** et une **face frontale** :

```js
// Rocher bloc 3D
const ROCKS_HD = [0, 1].map(v =>
  makeCanvas(22, 18, g => {
    // Face supérieure (légèrement inclinée iso)
    g.fillStyle = "#9aa8b0";
    if(v===0){ g.fillRect(4, 3, 14, 7); g.fillRect(7, 1, 8, 3); }
    else { g.fillRect(3, 4, 10, 6); g.fillRect(11, 2, 8, 8); }
    // Highlight NW
    g.fillStyle = "#c8d4d8"; g.fillRect(7, 2, 5, 2); g.fillRect(5, 4, 3, 2);
    // Face frontale (ombre)
    g.fillStyle = "#6a7880";
    if(v===0) g.fillRect(4, 10, 14, 6);
    else { g.fillRect(3, 10, 10, 6); g.fillRect(11, 10, 8, 6); }
    // Ombre portée
    g.fillStyle = "rgba(0,0,0,0.20)";
    if(v===0) g.fillRect(5, 15, 14, 2);
    else { g.fillRect(4, 15, 10, 2); g.fillRect(12, 15, 8, 2); }
  })
);
```

### 6.3 Éléments de sol — intégration avec SIDE_H

Pour les fleurs (`flower`) et touffes (`tuft`), décaler leur position `by` de `+SIDE_H/2` (soit +3) pour qu'elles paraissent posées sur la nouvelle surface surélevée :

```js
// game.js — dans le rendu décor type "flower"
// AVANT :  const fy = Math.round(by + d.oy);
// APRÈS :
const fy = Math.round(by + d.oy - SIDE_H/2); // compensation élévation tuile
```

---

## 7. Couleurs additionnelles pour transition sable/herbe

La référence montre une transition douce entre le sable et l'herbe — une **tuile mixte** :

```js
// Tuile de transition (ground[y][x] === 5 à créer dans map-gen.js)
const GRASS_SAND = makeCanvas(TW, TH + SIDE_H, g => {
  // Moitié NW herbe, moitié SE sable — dégradé diagonal
  diamondPath(g); g.fillStyle = "#a8b868"; g.fill(); // base mixte
  g.save(); diamondPath(g); g.clip();

  // Gradient diagonal herbe→sable
  const tr = g.createLinearGradient(0, 0, TW, TH);
  tr.addColorStop(0,   "#6ac038"); // herbe NW
  tr.addColorStop(0.5, "#a8a858"); // transition
  tr.addColorStop(1,   "#d4a96a"); // sable SE
  g.fillStyle = tr; g.fill();

  // Texture mixte
  for (let i = 0; i < 30; i++) {
    const x = Math.floor(rnd() * TW), y = Math.floor(rnd() * TH);
    const isSand = (x + y) > (TW + TH) * 0.55;
    g.fillStyle = isSand
      ? "rgba(255,240,180,0.16)"
      : "rgba(160,255,60,0.14)";
    g.fillRect(x, y, 1, 1);
  }
  g.restore();
  drawSideFaces(g, "#8c5a30", "#a87248", "#5c3818", "#7a5030");
});
```

---

## 8. Plan d'implémentation

### Étape 1 — Remplacement des tuiles (1h)
Remplacer intégralement le contenu de `js/render/tiles.js` par le code section 4.
Ajouter `const SIDE_H = 6;` en constante globale dans `config.js` pour que le décor puisse l'utiliser.

### Étape 2 — Ajustement décor (30 min)
Dans `game.js`, section rendu décor, décaler `by` de `-SIDE_H/2` pour flowers, tufts et fire.
Optionnel : remplacer `ROCKS` par `ROCKS_HD` dans `decor.js`.

### Étape 3 — Arbres (1-2h)
Remplacer les blobs losange par des ellipses multi-couches dans `decor.js` pour les types `tree` et `fruittree`.

### Étape 4 — Tuile de transition (optionnel, 30 min)
Ajouter `ground[y][x] === 5` = `GRASS_SAND` dans `map-gen.js` pour les tuiles adjacentes sable/herbe.

---

## 9. Avant / Après visuel

```
AVANT (tuile herbe actuelle)         APRÈS (tuile herbe HD)
────────────────────────────         ──────────────────────────────
    ◆◆◆◆◆◆◆◆                            ◆◆◆◆◆◆◆◆      ← highlight NW
   ◆ · ·  · · ◆                         ◆ ░ ▪ · ░ ◆
  ◆ ·  ·    · ◆                        ◆ ░  ▪   ░ ◆
   ◆      ·  ◆                          ◆ ▪   ·  ◆
    ◆◆◆◆◆◆◆◆                            ◆◆◆◆◆◆◆◆      ← ombre SE
                                        ██████████     ← flanc gauche (brun)
                                        ██████████████ ← flanc droit (sombre)

Rendu : losange plat vert uni         Rendu : bloc 3D, lumière NW, flancs terre
```

> **Résultat attendu** : même sans modifier le cycle jour/nuit ni les effets post-process,
> le passage aux tuiles blocs 3D devrait être la plus grande amélioration visuelle
> réalisable en une session de travail.
