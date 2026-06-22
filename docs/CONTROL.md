# CONTROL — Schéma de contrôle de Kaimana

## 1. Vue d'ensemble

Le jeu a deux modes distincts qui consomment les entrées différemment :

| Mode | Variable | Entrée principale |
|------|----------|-------------------|
| **Exploration** | `gameMode === "explore"` | `keys` (continu) + `actionQueued` (impulsion) |
| **Combat** | `gameMode === "battle"` | `battleInput(b)` (impulsion par impulsion) |

---

## 2. Contrôles actuels

### Exploration

| Action | Clavier | Tactile |
|--------|---------|---------|
| Se déplacer | `← ↑ → ↓` ou `Z Q S D` | D-pad |
| Couper / cueillir / chasser | `E` ou `Espace` | Bouton 🪓 |
| Ouvrir / fermer l'inventaire | `I` | Bouton 🎒 |
| Poser un feu de camp | `F` | — |
| Fermer l'inventaire | `Échap` | — |

### Combat (menu tour par tour)

| Action | Clavier | Tactile |
|--------|---------|---------|
| Naviguer dans le menu | `← ↑ → ↓` ou `Z Q S D` | D-pad |
| Confirmer | `E`, `Espace` ou `Entrée` | Bouton 🪓 |
| Annuler / retour | `Échap` | — |

---

## 3. Architecture des entrées (code existant)

### Mode exploration — `js/input.js`

```js
// État continu des touches directionnelles
const keys = { up: false, down: false, left: false, right: false };

// Impulsion d'action (remis à false après consommation dans game.js)
let actionQueued = false;
```

`game.js` lit `keys` à chaque frame dans `loop()` :
```js
let sx = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
let sy = (keys.down  ? 1 : 0) - (keys.up   ? 1 : 0);
// ...
if (actionQueued) { actionQueued = false; if (gameMode === "explore") doAction(); }
```

### Mode combat — `js/combat.js`

```js
// Toutes les entrées combat passent par cette fonction
function battleInput(b) {
  // b = { up, down, left, right, ok, back }
  // up/left   → curseur - 1
  // down/right → curseur + 1
  // ok        → confirmer le choix
  // back      → retour au menu précédent
}
```

Le listener clavier de combat :
```js
addEventListener("keydown", e => {
  const o = {
    up:    e.code === "ArrowUp"    || e.code === "KeyW",
    down:  e.code === "ArrowDown"  || e.code === "KeyS",
    left:  e.code === "ArrowLeft"  || e.code === "KeyA",
    right: e.code === "ArrowRight" || e.code === "KeyD",
    ok:    e.code === "KeyE"       || e.code === "Space" || e.code === "Enter",
    back:  e.code === "Escape",
  };
  if (o.up || o.down || o.left || o.right || o.ok || o.back) battleInput(o);
}, true); // capture : priorité sur le listener d'exploration
```

---

## 4. Support manette — Gamepad API

### 4.1 Mapping (Standard Gamepad — Xbox / DualShock / Switch Pro)

#### Mode exploration

| Bouton / Axe | Index | Action |
|--------------|-------|--------|
| **Stick gauche X** | axe 0 | ← → Se déplacer |
| **Stick gauche Y** | axe 1 | ↑ ↓ Se déplacer |
| **D-pad Haut** | bouton 12 | ↑ Se déplacer |
| **D-pad Bas** | bouton 13 | ↓ Se déplacer |
| **D-pad Gauche** | bouton 14 | ← Se déplacer |
| **D-pad Droite** | bouton 15 | → Se déplacer |
| **A / Croix** | bouton 0 | ⚒ Action (impulsion) |
| **B / Rond** | bouton 1 | 📦 Inventaire (toggle, impulsion) |
| **X / Carré** | bouton 2 | 🔥 Poser un feu (impulsion) |
| **Start / Options** | bouton 9 | 📦 Inventaire (toggle, impulsion) |

#### Mode combat

| Bouton / Axe | Index | Action |
|--------------|-------|--------|
| **Stick gauche Y** | axe 1 | Naviguer haut / bas |
| **D-pad Haut / Bas** | bouton 12 / 13 | Naviguer dans le menu |
| **A / Croix** | bouton 0 | ✔ Confirmer |
| **B / Rond** | bouton 1 | ✖ Annuler / retour |

> **Zone morte du stick** : `|axe| > 0.25`
> **Répétition directionnelle** : déclenchement initial immédiat, puis toutes les 180 ms (évite le défilement involontaire).

---

### 4.2 Implémentation — Option B (recommandée)

Fichier dédié `js/input/gamepad.js`, chargé après `js/input.js`.
Écrit dans les mêmes globals que le clavier : **aucun autre fichier modifié**
sauf deux lignes dans `game.js`.

#### `js/input/gamepad.js`

```js
"use strict";
/* Support manette via la Gamepad API (Standard Gamepad layout). */

const GAMEPAD_DEADZONE  = 0.25;  // seuil de déclenchement du stick
const GAMEPAD_REPEAT_MS = 180;   // délai de répétition directionnelle (ms)

// État précédent pour détecter les fronts montants (évite les doubles déclenchements)
const _prev = {};
// Horodatage de la dernière impulsion directionnelle (répétition)
const _dirT = { up: 0, down: 0, left: 0, right: 0 };

function _rising(idx, pressed) {
  const was = !!_prev[idx];
  _prev[idx] = pressed;
  return pressed && !was;   // true uniquement au front montant
}

function pollGamepad() {
  const gp = navigator.getGamepads?.()[0];
  if (!gp) return;

  const now = performance.now();

  /* ─── MODE EXPLORATION ─── */
  if (gameMode === "explore") {
    // Mouvement continu (stick gauche + D-pad)
    keys.left  = gp.axes[0] < -GAMEPAD_DEADZONE || !!gp.buttons[14]?.pressed;
    keys.right = gp.axes[0] >  GAMEPAD_DEADZONE || !!gp.buttons[15]?.pressed;
    keys.up    = gp.axes[1] < -GAMEPAD_DEADZONE || !!gp.buttons[12]?.pressed;
    keys.down  = gp.axes[1] >  GAMEPAD_DEADZONE || !!gp.buttons[13]?.pressed;

    // A (0) : action — impulsion
    if (_rising(0, gp.buttons[0]?.pressed)) actionQueued = true;

    // B (1) ou Start (9) : inventaire — impulsion
    const invNow = gp.buttons[1]?.pressed || gp.buttons[9]?.pressed;
    if (_rising(10, invNow)) toggleInv();

    // X (2) : feu de camp — impulsion
    if (_rising(2, gp.buttons[2]?.pressed)) placeFire();
  }

  /* ─── MODE COMBAT ─── */
  if (gameMode === "battle" && battle.phase === "player") {
    // Navigation directionnelle avec répétition
    const dirs = {
      up:    gp.axes[1] < -GAMEPAD_DEADZONE || !!gp.buttons[12]?.pressed,
      down:  gp.axes[1] >  GAMEPAD_DEADZONE || !!gp.buttons[13]?.pressed,
      left:  gp.axes[0] < -GAMEPAD_DEADZONE || !!gp.buttons[14]?.pressed,
      right: gp.axes[0] >  GAMEPAD_DEADZONE || !!gp.buttons[15]?.pressed,
    };
    for (const [d, active] of Object.entries(dirs)) {
      const wasActive = !!_prev["dir_" + d];
      if (active && (!wasActive || now - _dirT[d] >= GAMEPAD_REPEAT_MS)) {
        battleInput({ [d]: true });
        _dirT[d] = now;
      }
      _prev["dir_" + d] = active;
    }

    // A (0) : confirmer — impulsion
    if (_rising(20, gp.buttons[0]?.pressed)) battleInput({ ok: true });

    // B (1) : annuler — impulsion
    if (_rising(21, gp.buttons[1]?.pressed)) battleInput({ back: true });
  }
}

// Feedback console à la connexion / déconnexion
window.addEventListener("gamepadconnected",    e => console.info("[Gamepad] connectée :", e.gamepad.id));
window.addEventListener("gamepaddisconnected", e => console.info("[Gamepad] déconnectée :", e.gamepad.id));
```

#### Modification de `js/game.js` (1 ligne)

```js
function loop(now) {
  pollGamepad();   // ← ajouter en tête de loop()
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  // ... suite inchangée
}
```

#### Modification de `index.html` (1 ligne)

```html
<script src="js/input.js"></script>
<script src="js/input/gamepad.js"></script>  <!-- NEW -->
<script src="js/combat.js"></script>
```

---

### 4.3 Compatibilité navigateurs

| Navigateur | Support |
|------------|---------|
| Chrome / Edge 21+ | ✅ Complet |
| Firefox 29+ | ✅ Complet |
| Safari 10.1+ | ✅ (iOS 14.5+) |
| Opera | ✅ |

> La Gamepad API est disponible dans tous les navigateurs modernes.
> `navigator.getGamepads?.()` — l'opérateur `?.` protège contre les
> environnements sans support (le polling échoue silencieusement).

---

### 4.4 Cas particuliers

**Plusieurs manettes** : `getGamepads()[0]` cible uniquement la première
manette connectée. Pour gérer plusieurs joueurs, itérer sur le tableau
`getGamepads()` et attribuer un index par joueur.

**Conflits clavier ↔ manette** : en mode exploration, `keys` est écrasé
chaque frame par `pollGamepad()`. Si le joueur lâche la manette en plein
mouvement, les `keys` restent à leur dernière valeur — ajouter une remise à
zéro de `keys` en début de `pollGamepad()` si `gp` est null :
```js
if (!gp) return; // ne pas toucher à keys — le clavier reste actif
```

**Inventaire ouvert** : `toggleInv()` et `placeFire()` vérifient déjà
`gameMode === "explore"`, aucun garde supplémentaire nécessaire.

---

## 5. Récapitulatif des fichiers à créer / modifier

| Fichier | Changement |
|---------|------------|
| `js/input/gamepad.js` | **Créer** (code complet §4.2) |
| `js/game.js` | Ajouter `pollGamepad();` en tête de `loop()` |
| `index.html` | Ajouter `<script src="js/input/gamepad.js">` après `input.js` |
