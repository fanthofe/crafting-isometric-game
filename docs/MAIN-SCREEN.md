# Écran principal — Design & Intégration

> Spécification fonctionnelle et technique du menu titre de **Kaimana**.

---

## 1. Vue d'ensemble

L'écran titre est la première scène visible au démarrage du jeu. Il est rendu entièrement sur le canvas HTML5 (432 × 270 px, pixel art) dans le même `requestAnimationFrame` que la boucle de jeu, sous le mode `gameMode = "menu"`.

### Flux de navigation

```
Démarrage
    │
    ▼
┌─────────────────┐
│   ÉCRAN TITRE   │  menu principal
│  ─────────────  │
│ ▶ Nouvelle partie│──────────────────────────► Jeu (explore)
│   Continuer     │──────► si sauvegarde ────► Jeu (explore)
│   Options       │──┐
└─────────────────┘  │
                     ▼
              ┌──────────────┐
              │   OPTIONS    │
              │ ─────────── │
              │ ▶ Clavier    │──► Remappage clavier
              │   Manette   │──► Affichage manette (si détectée)
              │   Son        │──► Sliders volume
              │   Retour     │──► Menu principal
              └──────────────┘
```

---

## 2. États du menu (`menuState.scene`)

| Valeur     | Description                              |
|-----------|------------------------------------------|
| `"main"`   | Menu principal (Nouvelle partie / Continuer / Options) |
| `"options"` | Sous-menu des options                   |
| `"keys"`    | Remappage des touches clavier           |
| `"gamepad"` | Affichage du mapping manette            |
| `"sound"`   | Réglage des volumes                      |

---

## 3. Éléments visuels (canvas 432 × 270)

### Fond animé
- Dégradé nocturne vertical : `#080d1e` → `#1a2050`
- **80 étoiles** réparties aléatoirement dans les ¾ supérieurs de l'écran
  - Scintillement sinusoïdal individuel (phase aléatoire)
  - 15 % des étoiles sont de taille 2 (croix pixel art)
- **Silhouette d'île** en bas : vaguelettes animées + 2 palmiers pixel art
- Les éléments s'animent en continu même en mode menu

### Titre "KAIMANA"
- Police : `bold 22px 'Courier New', monospace`
- Couleur : dégradé de bleu clair animé (oscillation RGB)
- Effet glow : 4 couches semi-transparentes décalées de 2px
- Sous-titre : `"Île · Survie · Artisanat"` en `7px`, `#6080a0`

### Items de menu
- Police : `bold 9px 'Courier New', monospace`
- Item sélectionné : fond semi-transparent bleu + curseur "gemme" pixel art à gauche + texte `#a0e8ff`
- Item non sélectionné : `#7090b0`
- Item désactivé ("Continuer" sans sauvegarde) : `#3a4050` + mention `(aucune sauvegarde)`

### Indication manette
- Coin bas droit, si une manette est détectée via `navigator.getGamepads()`
- Affiche le nom tronqué de la manette (`6px`, discret)

---

## 4. Contrôles

### Clavier (dans les menus)

| Touche         | Action                             |
|---------------|------------------------------------|
| `↑` / `W`     | Curseur vers le haut               |
| `↓` / `S`     | Curseur vers le bas                |
| `←` / `A`     | Réduire valeur (sliders son)       |
| `→` / `D`     | Augmenter valeur (sliders son)     |
| `Entrée` / `E` / `Espace` | Confirmer              |
| `Échap`       | Retour / Fermer sous-menu          |

### Manette (Standard Gamepad layout)

| Bouton         | Action               |
|---------------|----------------------|
| Axe Y / Croix ↕ | Navigation          |
| Bouton 0 (A)  | Confirmer            |
| Bouton 1 (B)  | Retour               |

La détection manette utilise `navigator.getGamepads()[0]`. La navigation avec manette dans le menu est traitée par `menuTick()` (répétition automatique après 200ms).

---

## 5. Système de remappage clavier

### Principe
Chaque **action** a une liste de codes de touches (`KeyboardEvent.code`).

```js
// Structure dans options.bindings
{
  up:        ["ArrowUp",    "KeyW"],
  down:      ["ArrowDown",  "KeyS"],
  left:      ["ArrowLeft",  "KeyA"],
  right:     ["ArrowRight", "KeyD"],
  action:    ["KeyE",       "Space"],
  inventory: ["KeyI"],
  craft:     ["KeyC"],
  fire:      ["KeyF"],
}
```

### Flux de remappage
1. L'utilisateur navigue jusqu'à une action dans la scène `"keys"`
2. Il appuie sur `Entrée` → la cellule de la touche se met à clignoter (mode écoute)
3. La prochaine touche pressée (sauf `Échap`) remplace la touche principale
4. `Échap` annule sans modifier

### Réinitialisation
Un item `[Réinitialiser]` en bas du tableau restaure `DEFAULT_BINDINGS` et sauvegarde.

### Affichage
- Chaque action : label à gauche, badge "touche principale" au centre, badge "touche secondaire" à droite
- Badge en cours d'écoute : bordure verte clignotante

---

## 6. Système de sauvegarde (`js/core/save.js`)

### Données sauvegardées (`localStorage`, clé `kaimana_save`)

```json
{
  "v": 1,
  "player": { "x": 48.5, "y": 48.5, "hp": 10, "maxHp": 10 },
  "slots": [ { "id": "bois", "qty": 3 }, null, ... ],
  "equip": { "arme": null, "tete": null, ... },
  "skills": { "bucheron": { "lvl": 2, "xp": 4 }, ... }
}
```

### Options (`localStorage`, clé `kaimana_options`)

```json
{
  "bindings": { "up": ["ArrowUp", "KeyW"], ... },
  "sound": { "master": 0.8, "music": 0.6, "sfx": 1.0 }
}
```

### API publique

| Fonction         | Description                                   |
|-----------------|-----------------------------------------------|
| `hasSave()`      | `true` si une sauvegarde existe               |
| `saveGame()`     | Sérialise l'état courant dans localStorage    |
| `loadGame()`     | Désérialise et restaure l'état du jeu         |
| `deleteSave()`   | Supprime la sauvegarde                        |
| `saveOptions()`  | Persiste `options` (bindings + son)           |
| `loadOptions()`  | Charge `options` depuis localStorage (auto au chargement) |

La sauvegarde est **automatiquement déclenchée** à la fermeture de l'onglet (`beforeunload`).

---

## 7. Paramètres son

Trois canaux indépendants, stockés dans `options.sound` :

| Clé       | Libellé          | Défaut |
|----------|------------------|--------|
| `master` | Volume général   | 0.8    |
| `music`  | Musique          | 0.6    |
| `sfx`    | Effets sonores   | 1.0    |

Rendu : barre de progression pixel art + curseur ajustable par `←` / `→`. Les valeurs sont arrondies à 0.1 près. Quand un système audio sera implémenté, ces valeurs alimenteront directement les nœuds `GainNode` de l'API Web Audio.

---

## 8. Intégration dans la boucle de jeu

### Ordre de chargement (index.html)

```
js/core/config.js
js/core/utils.js
js/core/save.js          ← NOUVEAU (avant les entités)
...
js/scenes/main-menu.js   ← NOUVEAU (avant game.js)
js/game.js
```

### game.js — branchement menu

```js
function loop(now) {
  if (gameMode === "menu") {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    menuTick(dt, now / 1000);
    renderMenu(now / 1000);
    requestAnimationFrame(loop);
    return;
  }
  pollGamepad();
  // ... reste de la boucle de jeu
}
```

### Transitions

| Événement            | Action                                               |
|--------------------|------------------------------------------------------|
| "Nouvelle partie"  | Réinitialise player / inventaire / skills, `gameMode = "explore"` |
| "Continuer"        | `loadGame()`, `gameMode = "explore"`                 |
| Fermeture onglet   | `saveGame()` si `gameMode === "explore"`             |

### Visibilité HTML

La classe `in-menu` sur `<body>` masque via CSS les éléments HUD/tactiles :
```css
body.in-menu #hud,
body.in-menu #bar,
body.in-menu #dpad,
body.in-menu #touchBtns { display: none; }
```
`initMenu()` ajoute la classe, `startNewGame()` / `continueGame()` la retirent.

---

## 9. Fichiers concernés

| Fichier                     | Rôle                                          | Statut     |
|---------------------------|-----------------------------------------------|-----------|
| `docs/MAIN-SCREEN.md`     | Ce document                                   | ✅ Créé   |
| `js/core/save.js`         | Save/load + options bindings + son            | ✅ Créé   |
| `js/scenes/main-menu.js`  | Rendu canvas + navigation + remappage         | ✅ Créé   |
| `css/base.css`            | Règles `body.in-menu` pour masquer le HUD     | ✅ Modifié |
| `js/input.js`             | Bindings configurables + interception menu    | ✅ Modifié |
| `js/combat.js`            | `gameMode` initialisé à `"menu"`              | ✅ Modifié |
| `js/game.js`              | Branche menu dans la boucle + `initMenu()`   | ✅ Modifié |
| `index.html`              | Chargement des nouveaux scripts               | ✅ Modifié |

---

*Référence : [ARCHITECTURE.md](ARCHITECTURE.md) · [GDD.md](GDD.md) · [CONTROL.md](CONTROL.md)*
