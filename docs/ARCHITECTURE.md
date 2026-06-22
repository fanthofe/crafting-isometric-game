# Architecture — Réorganisation des fichiers

> Document de référence pour restructurer le projet.  
> Objectif : lisibilité, séparation des responsabilités, convention web standard.

---

## 1. Nom du jeu & fichier HTML

### Problème actuel

```
index.html   →  <meta>redirect vers la-plaine.html
la-plaine.html  →  le jeu réel
```

Deux anti-patterns : redirection inutile + nom de fichier sans rapport avec le contenu.

### Règle web design

> L'URL d'entrée d'une application web est **toujours `index.html`**. Le titre dans `<title>` et les balises `<h1>` portent l'identité du jeu, pas le nom de fichier.

### Propositions de noms

| Nom | Fichier | Sens | Pour |
|-----|---------|------|------|
| **Kaimana** ★ | `index.html` | kai (mer) + mana (puissance) = puissance de la mer · aussi "diamant" en hawaïen | Court, fluide, résonne avec les ressources rares du jeu. **Choix retenu.**s du Pacifique | Court, fort, mémorable. Un seul mot qui résume l'essence du jeu. |
| **Pasifika** | `index.html` | "Pacifique" en langue vernaculaire — terme utilisé par les communautés elles-mêmes | Pan-régional, respectueux, original. |
| **Tapu** | `index.html` | La loi sacrée du Pacifique — l'interdit, l'exploration de l'inconnu | Évoque l'aventure et les zones à conquérir. |
| **Atoll** | `index.html` | Île annulaire corallienne, géographie emblématique | Direct, immédiatement visuel, connu en français. |
| **Vaka** | `index.html` | Pirogue / embarcation — le voyage inter-îles | Met en avant la navigation, cœur du jeu. |

### Recommandation

> **Kaimana** — hawaïen : *kai* (mer) + *mana* (puissance) = **la puissance de la mer**. Aussi "diamant" en hawaïen — résonne avec les ressources rares du jeu (jade, cristal lunaire). Un seul mot, fluide, sans ambiguïté culturelle.

**Action :**
1. Supprimer la redirection dans `index.html`
2. Déplacer `la-plaine.html` → `index.html`
3. Changer `<title>Kaimana</title>` et `<h1>KAIMANA</h1>`

---

## 2. Réorganisation CSS

### Problème actuel

```
css/
└── style.css   ← 122 lignes, tout mélangé
```

### Règle CSS

> La cascade doit être **intentionnelle** : `reset → base → layout → composants → variantes`.  
> Un fichier = une responsabilité. Le nom dit ce qu'il contient.

### Structure proposée

```
css/
├── base.css        (1) Variables, reset, html/body/canvas
├── hud.css         (2) Éléments HUD permanents à l'écran
├── inventory.css   (3) Panneau inventaire complet
├── tooltip.css     (4) Infobulle + objet draggé
└── controls.css    (5) D-pad tactile, boutons touch, @media
```

### Détail du contenu de chaque fichier

**`base.css`** — fondations, ne dépend de rien
```
:root { variables }
* { reset box-model }
html, body { fond dégradé ciel, overflow:hidden }
canvas { image-rendering:pixelated }
```

**`hud.css`** — éléments toujours visibles pendant la partie
```
#hud     (titre + instruction de contrôles)
#bar     (barre de ressources top-right)
.slot    (case ressource dans la barre)
.slot .sw
```

**`inventory.css`** — panneau inventaire (affiché/caché)
```
#inv, #inv.open, #inv h2, #inv h3
#grid, .islot, .islot .ic, .islot .q
#weightRow, #weightBar, #weightFill
#dropZone
.recipe, .recipe button, .recipe button:disabled
.hint
.skrow, .skname, .sklvl, .skbar, .skfill
#equipRow, .eqwrap, .eqslot, .eqslot.filled
#statsRow
#closeInv
```

**`tooltip.css`** — overlay pointer-events:none
```
#tip  (infobulle flottante)
#held (fantôme de l'objet tenu à la souris)
#held .ic, #held .q
```

**`controls.css`** — uniquement tactile, isolé
```
#dpad, #touchBtns
.db, .db:active, .db.empty
.tb, .tb:active
@media (pointer:coarse)
```

**Dans `index.html` :**
```html
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/hud.css">
<link rel="stylesheet" href="css/inventory.css">
<link rel="stylesheet" href="css/tooltip.css">
<link rel="stylesheet" href="css/controls.css">
```

---

## 3. Réorganisation JavaScript

### Problème actuel

```
js/   ← 14 fichiers à plat, noms parfois ambigus
├── config.js        — constantes moteur
├── world.js         — génération terrain + décor
├── items.js         — définitions ITEMS + SKILLS + gainXP
├── inventory.js     — slots + poids + RECIPES + canCraft
├── ui.js            — DOM inventaire complet + equipement + tooltip
├── sprites.js       — tuiles + décor + entités + icônes (trop de choses)
├── kobolds.js       — types ennemis
├── hero.js          — sprite héros
├── effects.js       — particules / floats
├── spirits.js       — esprits compagnons
├── input.js         — clavier / souris
├── world-logic.js   — interactions terrain + spawning + actions joueur
├── combat.js        — système de combat
└── game.js          — boucle principale + rendu
```

### Règle JS (vanilla sans build)

> **Un fichier = une responsabilité.**  
> Les **données** (ITEMS, RECIPES, SKILLS) ne doivent pas cohabiter avec la **logique** (gainXP, craft) ni avec l'**UI** (refreshUI).  
> Les **sous-dossiers** organisent par domaine — sans framework ni bundler, la hiérarchie reste lisible.

### Structure proposée

```
js/
├── core/
│   ├── config.js          Constantes moteur (MAP, TW, TH, REACH, MAX_WEIGHT…)
│   └── utils.js           Helpers partagés (rnd(), toScreen(), isBlocked()…)
│
├── data/
│   ├── items.js           Définitions ITEMS (données pures, pas de logique)
│   ├── skills.js          SKILLS, xpNeed(), gainXP()
│   └── recipes.js         RECIPES, canCraft(), craft(), costText()
│
├── world/
│   ├── map-gen.js         Génération procédurale (sols, eau, plage, lacs, spawn)
│   ├── map-decor.js       Placement décor (arbres, rochers, fleurs, palmiers)
│   └── map-logic.js       Interactions terrain (couper/miner/cueillir/poser feu)
│
├── entities/
│   ├── player.js          État player, stats (statForce, statDefense, statForceBois)
│   ├── inventory.js       slots[], equip, poids (addItem, removeItem, dropOnGround)
│   ├── animals.js         ANIMAL_TYPES, resetAnimal(), hitAnimal()
│   ├── kobolds.js         KOBOLD_TYPES, hitKobold()
│   └── spirits.js         Esprits compagnons (raka, luna…)
│
├── render/
│   ├── tiles.js           Tuiles isométriques (GRASS, WATER, SAND, EDGE_L/R)
│   ├── decor.js           Sprites décor (TREES, ROCKS, PALM_TREE, fire…)
│   ├── entities.js        Sprites animaux, kobolds (ANIMAL_IMG, KOBOLD_IMG…)
│   ├── hero.js            Spritesheet héros (frames de marche + swing)
│   ├── icons.js           ICON_SRC + ICON + fallback auto-généré
│   └── effects.js         Particules (burst), textes flottants (floats)
│
├── ui/
│   ├── hud.js             Barre de ressources + #hud (titre, météo)
│   ├── inventory-ui.js    Grille slots + drag & drop + équipement + recettes
│   ├── skills-ui.js       Barres de compétences
│   └── tooltip.js         Infobulle dynamique + objet draggé
│
├── input.js               Clavier / souris / tactile (aucune dépendance jeu)
├── combat.js              Système de combat (swing, portée, projectiles)
└── game.js                Boucle principale requestAnimationFrame + rendu
```

### Ordre de chargement dans `index.html`

```html
<!-- 1. Fondations -->
<script src="js/core/config.js"></script>
<script src="js/core/utils.js"></script>

<!-- 2. Données statiques -->
<script src="js/data/items.js"></script>
<script src="js/data/skills.js"></script>
<script src="js/data/recipes.js"></script>

<!-- 3. Monde -->
<script src="js/world/map-gen.js"></script>
<script src="js/world/map-decor.js"></script>

<!-- 4. Entités & état -->
<script src="js/entities/player.js"></script>
<script src="js/entities/inventory.js"></script>
<script src="js/entities/animals.js"></script>
<script src="js/entities/kobolds.js"></script>
<script src="js/entities/spirits.js"></script>

<!-- 5. Rendu -->
<script src="js/render/tiles.js"></script>
<script src="js/render/decor.js"></script>
<script src="js/render/entities.js"></script>
<script src="js/render/hero.js"></script>
<script src="js/render/icons.js"></script>
<script src="js/render/effects.js"></script>

<!-- 6. UI -->
<script src="js/ui/hud.js"></script>
<script src="js/ui/inventory-ui.js"></script>
<script src="js/ui/skills-ui.js"></script>
<script src="js/ui/tooltip.js"></script>

<!-- 7. Systèmes -->
<script src="js/input.js"></script>
<script src="js/combat.js"></script>
<script src="js/world/map-logic.js"></script>

<!-- 8. Boucle principale -->
<script src="js/game.js"></script>
```

---

## 4. Règles de nommage

### Fichiers

| Règle | Exemple |
|-------|---------|
| `kebab-case` pour tous les fichiers | `inventory-ui.js` ✓ / `inventoryUI.js` ✗ |
| Nom = contenu principal, pas technologie | `skills.js` ✓ / `skills-module.js` ✗ |
| Domaine en préfixe si ambiguïté | `map-gen.js` ≠ `map-logic.js` |
| CSS : même racine que ce qu'il style | `inventory.css` style `#inv` |

### Variables / fonctions

| Convention | Usage |
|------------|-------|
| `MAJUSCULES` | Constantes globales de données (`ITEMS`, `RECIPES`, `ANIMAL_TYPES`) |
| `camelCase` | Fonctions et variables (`statForce()`, `boostT`) |
| Verbe + nom | Fonctions d'action (`addItem`, `hitAnimal`, `gainXP`) |
| `elXxx` | Références DOM (`elInv`, `elGrid`, `elBar`) |

---

## 5. Plan de migration

> La migration peut se faire **fichier par fichier**, le jeu restant fonctionnel à chaque étape.

### Ordre recommandé (le moins risqué d'abord)

| Étape | Action | Risque |
|-------|--------|--------|
| 1 | Renommer `la-plaine.html` → `index.html` + titre Kaimana | Très faible |
| 2 | Éclater `style.css` → 5 fichiers CSS | Faible (aucune logique) |
| 3 | Extraire `js/data/skills.js` de `items.js` | Faible |
| 4 | Extraire `js/data/recipes.js` de `inventory.js` | Faible |
| 5 | Séparer `js/entities/inventory.js` du reste d'`inventory.js` | Moyen |
| 6 | Séparer `js/world/map-gen.js` et `map-decor.js` de `world.js` | Moyen |
| 7 | Séparer `js/render/tiles.js`, `decor.js`, `icons.js` de `sprites.js` | Moyen |
| 8 | Séparer `js/ui/*` de `ui.js` | Moyen |
| 9 | Extraire `js/entities/animals.js` de `world-logic.js` | Élevé (interdépendances) |
| 10 | Extraire `js/core/utils.js` de `config.js` | Faible |

### Invariant à maintenir

> À chaque étape, le jeu doit démarrer sans erreur console. Tester dans le navigateur après chaque étape.

---

## 6. Résumé visuel

```
AVANT                         APRÈS
─────────────────────         ────────────────────────────────────────
css/
  style.css                   base.css · hud.css · inventory.css
                              tooltip.css · controls.css

js/
  config.js                   core/config.js
  world.js                    world/map-gen.js · world/map-decor.js
  items.js                    data/items.js
  inventory.js                data/recipes.js · entities/inventory.js
  ui.js                       ui/inventory-ui.js · ui/hud.js
                              ui/skills-ui.js · ui/tooltip.js
  sprites.js                  render/tiles.js · render/decor.js
                              render/entities.js · render/icons.js
  kobolds.js                  entities/kobolds.js
  hero.js                     render/hero.js
  effects.js                  render/effects.js
  spirits.js                  entities/spirits.js
  input.js                    input.js  (inchangé)
  world-logic.js              world/map-logic.js · entities/animals.js
                              entities/player.js
  combat.js                   combat.js  (inchangé)
  game.js                     game.js  (inchangé)

la-plaine.html                index.html  (titre : Kaimana)
index.html (redirect)         ← supprimé
```

---

*Référence : [GDD.md](GDD.md) pour le contexte du jeu · [RESOURCES.md](RESOURCES.md) pour les données items.*
