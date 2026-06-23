# VISUAL UPGRADE — Direction HD-2D style Octopath Traveler

*Document de direction artistique et technique — Kaimana Engine*

---

## 1. Vision & Philosophie

> « Octopath Traveler ne cherche pas à copier la 3D — il glorifie le pixel tout en l'habillant de lumière. »

L'objectif : transformer Kaimana en un jeu qui paraît **impossible à avoir été fait en Canvas 2D**. Le pixel art reste roi, mais chaque frame est baignée dans une lumière vivante, des profondeurs qui respirent, et une atmosphère qui raconte l'île avant même que le joueur ne bouge.

### 1.1 Piliers HD-2D (extraits du brief Octopath)

| Pilier | Description | Impact ressenti |
|--------|-------------|-----------------|
| **Pixel Art Glorifié** | Sprites pixel + post-processing 3D | Nostalgie × modernité |
| **Lumière Volumétrique** | Point lights, god rays, bloom chaud | Immersion, heure du jour tactile |
| **Profondeur de Champ** | Bokeh sur premier/arrière-plan | Effet diorama "miniature vivante" |
| **Animation Ambiante** | Herbe, eau, feuilles, lucioles | Le monde respire |
| **Color Grading Fort** | Teintes chaudes/froides selon cycle | Émotion par la couleur |

---

## 2. Analyse Octopath — Ce qui crée la magie

```
┌──────────────────────────────────────────────────────────────┐
│  COUCHE 7 : Post-process (vignette, grain, bloom, chromab)   │
│  COUCHE 6 : UI & HUD                                         │
│  COUCHE 5 : Particules avant-plan (feuilles, bokeh)          │
│  COUCHE 4 : Personnages + ombres douces                       │
│  COUCHE 3 : Décor & props (avec shadow blobs)                 │
│  COUCHE 2 : Sol (tuiles animées, caustics eau)                │
│  COUCHE 1 : Ciel / Parallaxe arrière-plan                     │
└──────────────────────────────────────────────────────────────┘
```

**Ce qui différencie Octopath visuellement :**

1. **Chaque source de lumière est physique** — une torche peint le sol de chaleur orange, un rayon de lune bleuit les ombres
2. **Tilt-shift assumé** — les bords du canvas sont flous, forçant le regard vers le centre de l'action
3. **Bokeh "faux-3D"** — des particules lumineuses devant et derrière les personnages simulent une caméra avec ouverture
4. **Contraste extrême** — noirs très profonds, blancs très brillants, pas de demi-mesures
5. **La météo change tout** — même paysage, lumière différente = tableau différent

---

## 3. Palette & Direction Artistique Kaimana

### 3.1 Palette Jour (Soleil Pacifique)

```
Ambiant ciel    #a8d8f0  ←  Bleu pastel turquoise
Lumière soleil  #fff4c2  ←  Jaune d'or très chaud
Ombre midi      #2d4a3e  ←  Vert-noir tropical profond
Sol herbe lit.  #a8e05f  ←  Vert citron vivant
Sol herbe omb.  #4a7a3a  ←  Vert sombre sous feuillage
Eau lagon       #38b4c8  ←  Cyan turquoise transparent
Sable           #f2d98a  ←  Sable chaud doré
```

### 3.2 Palette Coucher de Soleil (Dusk)

```
Ambiant ciel    #e07040  ←  Orange brûlé
Lumière rasante #ffb060  ←  Or rougeoyant
Ombre longue    #1a1a38  ←  Bleu nuit profond
Horizon         #c03060  ←  Rose-violet dramatique
```

### 3.3 Palette Nuit

```
Ambiant lune    #203060  ←  Bleu nuit froid
Lumière lune    #8090c0  ←  Argent lunaire
Lucioles        #c8ff80  ←  Vert fluo bioluminescent
Feu de camp     #ff8020  ←  Orange feu chaud
```

---

## 4. Système d'Éclairage Dynamique (Light Engine)

### 4.1 Architecture des passes de lumière

```js
// Ordre de rendu (nouveau pipeline)
function draw(t){
  drawSky(t);           // [1] Fond dégradé animé
  drawTiles(t);         // [2] Tuiles avec caustics
  drawDecor(t);         // [3] Props avec ombres projetées
  drawEntities(t);      // [4] PNJ / animaux + shadow blobs
  drawHero(t);          // [5] Héros + outline glow
  applyLights(t);       // [6] ★ NOUVEAU : passe lumière additive
  drawParticlesFG(t);   // [7] Particules avant-plan (bokeh)
  applyPostProcess(t);  // [8] ★ NOUVEAU : post-traitement
  drawUI();             // [9] HUD / inventaire
}
```

### 4.2 Lumières ponctuelles

Chaque feu de camp, torche, ou luciole émet une lumière additive :

```js
// js/render/lighting.js (nouveau fichier)
const lights = [];

function addLight(x, y, radius, r, g, b, intensity){
  lights.push({ x, y, radius, r, g, b, intensity });
}

function applyLights(t){
  // Couche de lumière additive par-dessus la scène
  cx.save();
  cx.globalCompositeOperation = "lighter";
  for(const L of lights){
    const sc = toScreen(L.x, L.y);
    const sx = sc.x + ox, sy = sc.y + oy;
    const flicker = 1 + 0.08 * Math.sin(t * 7.3 + L.x);
    const rad = L.radius * flicker;
    const gr = cx.createRadialGradient(sx, sy, 0, sx, sy, rad);
    gr.addColorStop(0,   `rgba(${L.r},${L.g},${L.b},${L.intensity * flicker})`);
    gr.addColorStop(0.4, `rgba(${L.r},${L.g},${L.b},${L.intensity * 0.3})`);
    gr.addColorStop(1,   `rgba(${L.r},${L.g},${L.b},0)`);
    cx.fillStyle = gr;
    cx.fillRect(sx - rad, sy - rad, rad*2, rad*2);
  }
  cx.restore();
  cx.globalCompositeOperation = "source-over";
  lights.length = 0; // reset chaque frame
}
```

**Sources de lumière à connecter :**

| Source | Couleur | Rayon | Intensité | Flicker |
|--------|---------|-------|-----------|---------|
| Feu de camp | `255,130,40` | 60px | 0.45 | fort |
| Torche | `255,160,60` | 40px | 0.35 | moyen |
| Luciole | `180,255,80` | 18px | 0.55 | pulsé |
| Lune | `100,130,200` | 220px | 0.08 | aucun |
| Soleil (god ray) | `255,240,180` | 300px | 0.06 | aucun |

### 4.3 Ombres douces sous les entités

```js
// Shadow blob isométrique sous chaque entité vivante
function drawShadowBlob(sx, sy, scale = 1){
  cx.save();
  cx.globalAlpha = 0.35;
  cx.translate(sx, sy + 2);
  cx.scale(scale, TH/TW * scale * 0.5);
  const gr = cx.createRadialGradient(0, 0, 1, 0, 0, 10);
  gr.addColorStop(0, "rgba(0,20,10,0.9)");
  gr.addColorStop(1, "rgba(0,20,10,0)");
  cx.fillStyle = gr;
  cx.beginPath(); cx.arc(0, 0, 10, 0, Math.PI*2); cx.fill();
  cx.restore();
}
```

### 4.4 God Rays (rayons du soleil)

```js
// Rayons volumétriques depuis le haut lors des matins/soirs
function drawGodRays(t){
  if(lightLevel() < 0.3) return;
  const alpha = lightLevel() * 0.12;
  const sunX = LW * 0.7, sunY = -20;
  cx.save();
  cx.globalCompositeOperation = "screen";
  for(let i = 0; i < 5; i++){
    const angle = -0.3 + i * 0.15 + Math.sin(t * 0.3 + i) * 0.04;
    const len = LH * 1.8;
    const w = 20 + i * 8;
    cx.globalAlpha = alpha * (1 - i * 0.15);
    cx.fillStyle = duskGlow() > 0.3 ? "#ff9040" : "#fff8d0";
    cx.save();
    cx.translate(sunX, sunY);
    cx.rotate(angle);
    cx.fillRect(-w/2, 0, w, len);
    cx.restore();
  }
  cx.restore(); cx.globalAlpha = 1;
}
```

---

## 5. Amélioration des Tiles

### 5.1 Herbe — micro-animation

Ajouter des "brins d'herbe" qui ondulent avec le vent :

```js
// js/render/tiles.js — ajout dans drawGrass()
function drawGrassBlades(g, windT){
  g.strokeStyle = "#5fb050";
  g.lineWidth = 1;
  for(let i = 0; i < 6; i++){
    const bx = 6 + i * 4, by = TH/2 + 1;
    const sway = Math.sin(windT * 2.1 + i * 1.4) * 1.5;
    g.beginPath();
    g.moveTo(bx, by);
    g.quadraticCurveTo(bx + sway, by - 4, bx + sway * 1.5, by - 6);
    g.stroke();
  }
}
```

### 5.2 Eau — caustics et reflets

```js
// Caustics : petites ellipses lumineuses animées sur l'eau
const WATER_CAUSTIC_COUNT = 8;
function drawWaterCaustics(g, t, tileX, tileY){
  g.save();
  diamondPath(g); g.clip();
  g.globalCompositeOperation = "lighter";
  for(let i = 0; i < WATER_CAUSTIC_COUNT; i++){
    const cx2 = 4 + (i * 7 + tileX * 3) % (TW - 8);
    const cy2 = 3 + (i * 5 + tileY * 2) % (TH - 6);
    const phase = t * 1.8 + i * 0.9;
    const alpha = 0.15 + 0.10 * Math.sin(phase);
    const rw = 2 + Math.sin(phase * 1.3) * 1;
    g.fillStyle = `rgba(180,240,255,${alpha})`;
    g.beginPath(); g.ellipse(cx2, cy2, rw, rw * 0.5, 0, 0, Math.PI*2); g.fill();
  }
  g.restore();
}
```

### 5.3 Sol — bords éclairés (ambient occlusion)

```js
// Assombrir les bords nord/ouest d'une tuile (simule AO)
const EDGE_AO = makeCanvas(TW, TH, g => {
  diamondPath(g); g.clip();
  // gradient nord-ouest → transparent au centre
  const gr = g.createLinearGradient(0, 0, TW*0.6, TH*0.6);
  gr.addColorStop(0,   "rgba(0,20,10,0.18)");
  gr.addColorStop(1,   "rgba(0,20,10,0)");
  g.fillStyle = gr; g.fillRect(0, 0, TW, TH);
});
```

---

## 6. Post-Traitement (Nouvelle passe finale)

### 6.1 Pipeline complet

```js
// js/render/postprocess.js (nouveau fichier)
function applyPostProcess(t){
  applyBloom(t);
  applyColorGrade(t);
  applyVignette();
  applyFilmGrain(t);
  applyTiltShift();
}
```

### 6.2 Bloom

Les pixels très lumineux (feu, lucioles) "saignent" sur les voisins :

```js
function applyBloom(t){
  // Snapshot du canvas → flou → recomposite en "screen"
  const offscreen = document.createElement("canvas");
  offscreen.width = LW; offscreen.height = LH;
  const octx = offscreen.getContext("2d");
  octx.filter = "blur(3px) brightness(1.4)";
  octx.drawImage(cv, 0, 0);
  cx.save();
  cx.globalCompositeOperation = "screen";
  cx.globalAlpha = 0.18;
  cx.drawImage(offscreen, 0, 0);
  cx.restore(); cx.globalAlpha = 1;
}
```

### 6.3 Color Grading par heure

```js
function applyColorGrade(t){
  const p = dayPhase();
  let col, alpha;
  if(p < 0.08 || p > 0.95){        // Aube / Crépuscule
    col = "#ff6030"; alpha = 0.12;
  } else if(p < 0.45){              // Journée
    col = "#fff8d8"; alpha = 0.05;
  } else if(p < 0.85){              // Nuit
    col = "#102050"; alpha = 0.22;
  } else {                          // Retour jour
    col = "#ff8040"; alpha = 0.10;
  }
  cx.save();
  cx.globalCompositeOperation = "multiply";
  cx.fillStyle = col; cx.globalAlpha = alpha;
  cx.fillRect(0, 0, LW, LH);
  cx.restore(); cx.globalAlpha = 1;
}
```

### 6.4 Vignette Cinématique

```js
function applyVignette(){
  const gr = cx.createRadialGradient(LW/2, LH/2, LH*0.3, LW/2, LH/2, LW*0.8);
  gr.addColorStop(0,   "rgba(0,0,0,0)");
  gr.addColorStop(0.6, "rgba(0,0,0,0)");
  gr.addColorStop(1,   "rgba(0,0,0,0.55)");
  cx.fillStyle = gr;
  cx.fillRect(0, 0, LW, LH);
}
```

### 6.5 Film Grain

```js
// Bruit filmique : texture pré-générée, décalée chaque frame
const GRAIN_SIZE = 64;
const grainCanvas = makeCanvas(GRAIN_SIZE, GRAIN_SIZE, g => {
  for(let i = 0; i < GRAIN_SIZE * GRAIN_SIZE * 0.3; i++){
    const gx = Math.floor(Math.random() * GRAIN_SIZE);
    const gy = Math.floor(Math.random() * GRAIN_SIZE);
    const v = Math.floor(Math.random() * 255);
    g.fillStyle = `rgba(${v},${v},${v},0.04)`;
    g.fillRect(gx, gy, 1, 1);
  }
});
function applyFilmGrain(t){
  const off = Math.floor(t * 30) % GRAIN_SIZE;
  cx.save();
  cx.globalCompositeOperation = "overlay";
  cx.globalAlpha = 0.35;
  for(let y = -off; y < LH; y += GRAIN_SIZE)
    for(let x = -off; x < LW; x += GRAIN_SIZE)
      cx.drawImage(grainCanvas, x, y);
  cx.restore(); cx.globalAlpha = 1;
}
```

### 6.6 Tilt-Shift (effet diorama)

```js
function applyTiltShift(){
  // Flou progressif sur le haut et le bas du canvas
  const offBlur = document.createElement("canvas");
  offBlur.width = LW; offBlur.height = LH;
  const bctx = offBlur.getContext("2d");
  bctx.filter = "blur(2px)";
  bctx.drawImage(cv, 0, 0);

  // Masque : transparent au centre, opaque aux extrémités
  const mask = cx.createLinearGradient(0, 0, 0, LH);
  mask.addColorStop(0,    "rgba(0,0,0,0.7)");
  mask.addColorStop(0.18, "rgba(0,0,0,0)");
  mask.addColorStop(0.82, "rgba(0,0,0,0)");
  mask.addColorStop(1,    "rgba(0,0,0,0.7)");

  cx.save();
  cx.drawImage(offBlur, 0, 0);
  cx.fillStyle = mask;
  cx.globalCompositeOperation = "destination-in"; // ne pas utiliser — voir note
  cx.fillRect(0, 0, LW, LH);
  cx.restore();
}
// Note impl : tilt-shift via CSS filter sur canvas ou offscreen compositing
```

---

## 7. Détails d'Environnement

### 7.1 Particules Bokeh (avant-plan)

```
  ✦  ·  ✦         ← particules floues de premier plan
     ✦     ·   ✦
  · ╔════════╗ ·
    ║ SCÈNE  ║       ← frame principale nette
    ║        ║
    ╚════════╝
  ✦  ·    ✦  ·     ← idem arrière-plan (plus petites)
```

```js
// Particules bokeh flottantes
const bokeh = Array.from({length: 20}, () => ({
  x: Math.random() * LW,
  y: Math.random() * LH,
  r: 1.5 + Math.random() * 3,
  speed: 0.3 + Math.random() * 0.5,
  alpha: 0.2 + Math.random() * 0.4,
  layer: Math.random() < 0.5 ? "fg" : "bg",
  hue: ["#fff8c0","#c0e8ff","#d0ffb0"][Math.floor(Math.random()*3)],
}));
function drawBokeh(layer, t){
  cx.save();
  cx.globalCompositeOperation = "screen";
  for(const b of bokeh){
    if(b.layer !== layer) continue;
    b.y -= b.speed * (layer === "fg" ? 0.8 : 0.3);
    if(b.y < -10) b.y = LH + 10;
    const pulse = b.alpha * (0.7 + 0.3 * Math.sin(t * 1.4 + b.x));
    const blur = layer === "fg" ? b.r * 1.8 : b.r * 0.9;
    const gr2 = cx.createRadialGradient(b.x, b.y, 0, b.x, b.y, blur * 4);
    gr2.addColorStop(0, b.hue.replace(")", `,${pulse})`).replace("rgb", "rgba"));
    gr2.addColorStop(1, "rgba(0,0,0,0)");
    cx.fillStyle = gr2;
    cx.fillRect(b.x - blur*4, b.y - blur*4, blur*8, blur*8);
  }
  cx.restore(); cx.globalAlpha = 1;
}
```

### 7.2 Feuilles tombantes des arbres

```js
const fallingLeaves = [];
function spawnLeaf(treeX, treeY){
  fallingLeaves.push({
    x: treeX + (Math.random()-0.5)*10,
    y: treeY,
    vx: (Math.random()-0.5)*8,
    vy: 8 + Math.random()*6,
    rot: Math.random()*Math.PI*2,
    rotV: (Math.random()-0.5)*3,
    alpha: 1,
    col: ["#5db850","#79c061","#f0a030","#d04020"][Math.floor(Math.random()*4)],
  });
}
function updateLeaves(dt){
  for(const l of fallingLeaves){
    l.x += l.vx * dt; l.y += l.vy * dt;
    l.vx *= 0.98; l.rot += l.rotV * dt;
    l.alpha -= dt * 0.4;
  }
  fallingLeaves.splice(0, fallingLeaves.length,
    ...fallingLeaves.filter(l => l.alpha > 0));
}
function drawLeaves(){
  for(const l of fallingLeaves){
    cx.save();
    cx.globalAlpha = l.alpha;
    cx.translate(l.x, l.y); cx.rotate(l.rot);
    cx.fillStyle = l.col;
    cx.fillRect(-2, -1, 4, 2);
    cx.restore();
  }
}
```

### 7.3 Brume de chaleur (effet shimmer)

```js
// Ondulation horizontale légère sur les pixels du bas
function applyHeatHaze(t){
  if(dayPhase() < 0.2 || dayPhase() > 0.7) return;
  const strip = 40; // px du bas de l'écran affectés
  const imageData = cx.getImageData(0, LH - strip, LW, strip);
  // décaler chaque ligne de ±1px selon une sinusoïde
  const out = cx.createImageData(LW, strip);
  for(let y = 0; y < strip; y++){
    const shift = Math.round(Math.sin(t * 2.5 + y * 0.4) * 0.8);
    for(let x = 0; x < LW; x++){
      const srcX = Math.min(LW-1, Math.max(0, x + shift));
      const di = (y * LW + x) * 4, si = (y * LW + srcX) * 4;
      out.data[di]   = imageData.data[si];
      out.data[di+1] = imageData.data[si+1];
      out.data[di+2] = imageData.data[si+2];
      out.data[di+3] = imageData.data[si+3];
    }
  }
  cx.putImageData(out, 0, LH - strip);
}
```

---

## 8. Rendu des Personnages

### 8.1 Outline lumineux du héros

```js
// Dessiner le sprite une fois en agrandissant d'1px avec teinte colorée
function drawHeroOutline(sx, sy, frame, color = "#ffe080"){
  const offsets = [[-1,0],[1,0],[0,-1],[0,1]];
  cx.save();
  cx.globalAlpha = 0.6;
  for(const [dx, dy] of offsets){
    cx.globalCompositeOperation = "source-over";
    // coloriser le sprite en monochrome
    const tmp = makeCanvas(HERO_W, HERO_H, g => {
      g.drawImage(frame, 0, 0);
      g.globalCompositeOperation = "source-in";
      g.fillStyle = color;
      g.fillRect(0, 0, HERO_W, HERO_H);
    });
    cx.drawImage(tmp, sx + dx - HERO_W/2, sy + dy - HERO_H);
  }
  cx.restore(); cx.globalAlpha = 1;
}
```

### 8.2 Traîne de mouvement (motion blur pixel)

```js
// Enregistrer 3 positions passées et les dessiner en fondu
const heroTrail = [];
function updateHeroTrail(){
  heroTrail.push({x: player.x, y: player.y, t: performance.now()});
  while(heroTrail.length > 3) heroTrail.shift();
}
function drawHeroTrail(frame){
  const now = performance.now();
  for(let i = 0; i < heroTrail.length; i++){
    const h = heroTrail[i];
    const age = (now - h.t) / 120;
    const sc = toScreen(h.x, h.y);
    cx.globalAlpha = Math.max(0, 0.3 - age * 0.15) * (i / heroTrail.length);
    cx.drawImage(frame, sc.x + ox - HERO_W/2, sc.y + oy - HERO_H);
  }
  cx.globalAlpha = 1;
}
```

---

## 9. Améliorations Combat

### 9.1 Intro dramatique (Cinematic bars)

```js
// Bandes noires qui se ferment lors du déclenchement du combat
function drawCinematicBars(progress){
  // progress : 0→1 pendant l'entrée en combat
  const h = LH * 0.12 * progress;
  cx.fillStyle = "#000000";
  cx.fillRect(0, 0, LW, h);
  cx.fillRect(0, LH - h, LW, h);
}
```

### 9.2 Éclair de compétence

```js
// Flash blanc + secousse d'écran lors d'une attaque puissante
function skillFlash(intensity = 1){
  cx.save();
  cx.globalAlpha = 0.6 * intensity;
  cx.fillStyle = "#ffffff";
  cx.fillRect(0, 0, LW, LH);
  cx.restore(); cx.globalAlpha = 1;
  // screen shake : décaler ox/oy de quelques px pendant 0.2s
}
```

### 9.3 Numéros de dégâts stylisés

```js
function spawnDamageFloat(x, y, dmg, isCrit){
  floats.push({
    sx: x, sy: y - 20,
    t: isCrit ? 1.8 : 1.2,
    str: isCrit ? `✦${dmg}✦` : `−${dmg}`,
    c: isCrit ? "#ffdd00" : "#ff5040",
    scale: isCrit ? 1.4 : 1.0,
    bold: true,
  });
}
```

---

## 10. Plan d'Implémentation

### Phase 1 — Impact Immédiat (≈ 2-3h)

| # | Tâche | Fichier | Gain visuel |
|---|-------|---------|-------------|
| 1.1 | Vignette cinématique | `js/render/postprocess.js` (nouveau) | ⭐⭐⭐⭐⭐ |
| 1.2 | Shadow blobs sous entités | `js/render/entities.js` | ⭐⭐⭐⭐ |
| 1.3 | Color grading par cycle jour/nuit | `js/render/postprocess.js` | ⭐⭐⭐⭐⭐ |
| 1.4 | Lumière de feu de camp (point light) | `js/world/map-logic.js` + `lighting.js` | ⭐⭐⭐⭐⭐ |
| 1.5 | Particules bokeh avant-plan | `js/render/effects.js` | ⭐⭐⭐ |

### Phase 2 — Immersion Profonde (≈ 4-6h)

| # | Tâche | Fichier | Gain visuel |
|---|-------|---------|-------------|
| 2.1 | Bloom sur sources lumineuses | `js/render/postprocess.js` | ⭐⭐⭐⭐⭐ |
| 2.2 | Tilt-shift (flou bords canvas) | `js/render/postprocess.js` | ⭐⭐⭐⭐ |
| 2.3 | Caustics animés sur l'eau | `js/render/tiles.js` | ⭐⭐⭐⭐ |
| 2.4 | Feuilles tombantes depuis les arbres | `js/render/effects.js` | ⭐⭐⭐ |
| 2.5 | God rays / rayons de soleil | `js/render/postprocess.js` | ⭐⭐⭐⭐⭐ |

### Phase 3 — Finitions Squenix (≈ 4-5h)

| # | Tâche | Fichier | Gain visuel |
|---|-------|---------|-------------|
| 3.1 | Film grain | `js/render/postprocess.js` | ⭐⭐⭐ |
| 3.2 | Outline lumineux du héros | `js/render/hero.js` | ⭐⭐⭐⭐ |
| 3.3 | Brins d'herbe animés | `js/render/tiles.js` | ⭐⭐⭐ |
| 3.4 | Intro cinématique de combat | `js/combat.js` | ⭐⭐⭐⭐ |
| 3.5 | Brume de chaleur (shimmer) | `js/render/postprocess.js` | ⭐⭐ |

---

## 11. Nouveaux Fichiers à Créer

```
js/render/
  postprocess.js    ← vignette, bloom, color grade, grain, tilt-shift
  lighting.js       ← point lights, god rays, shadow blobs
  environment.js    ← bokeh, feuilles, shimmer, brins d'herbe
```

Ajouter dans `index.html` **après** `effects.js` :

```html
<script src="js/render/lighting.js"></script>
<script src="js/render/environment.js"></script>
<script src="js/render/postprocess.js"></script>
```

---

## 12. Référence Visuelle Cible

```
AVANT                         APRÈS
──────────────────────────    ──────────────────────────────────────
Tuiles vertes plates          Herbe texturée avec AO sur les bords
Eau statique bleue            Eau avec caustics lumineux animés
Nuit noire uniforme           Nuit bleutée avec lucioles + feu chaud
Combat simple                 Barres cinéma + flash + lumière éclate
Personnages sans ombre        Shadow blobs doux + outline doré
Bords canvas nets             Tilt-shift progressif (effet diorama)
Pas de post-process           Vignette + grain + color grade chaud
──────────────────────────    ──────────────────────────────────────
```

> **Objectif final** : un joueur qui ouvre le jeu sans connaître la technologie doit se demander
> si c'est un jeu édité chez Square Enix — et ne pas trouver la réponse.
