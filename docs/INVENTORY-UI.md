# INVENTORY UI — Refonte style Valheim

*Voir [RECIPES.md](RECIPES.md) pour le détail des recettes · [GDD.md](GDD.md) pour le contexte général.*

---

## 1. Problèmes actuels

| Problème | Cause |
|----------|-------|
| Scroll infini | 103 recettes affichées en liste plate |
| Overflow horizontal | Panel trop étroit, texte long |
| Recettes hors contexte | Recettes atelier/marmite affichées même sans l'atelier |
| Compétences noyées | Scrollées avec les recettes |
| Équipement peu lisible | Slots en ligne sans hiérarchie visuelle |

---

## 2. Référence Valheim

Éléments retenus de l'UX Valheim :

- **Grille d'inventaire** — icônes + chiffre, aucun texte dans la case
- **Panel équipement latéral** — slots nommés, toujours visibles
- **Fabrication contextuelle** — seules les recettes disponibles *maintenant* s'affichent
- **Fond sombre texturé** — lisibilité des icônes, ambiance
- **Onglets** — sépare Inventaire / Fabrication / Compétences
- **Barre de poids** discrète en pied de panel

---

## 3. Nouveau layout

```
┌──────────────────────────────────────────────────────────────┐
│  ✕  KAIMANA — INVENTAIRE              [INV] [CRAFT] [SKILLS] │
├─────────────────────────────┬────────────────────────────────┤
│  ÉQUIPEMENT                 │  SACS  (36 slots)              │
│                             │                                │
│  [🗡 Arme     ][……………]      │  [·][·][·][·][·][·][·][·][·]  │
│  [🪖 Tête     ][……………]      │  [·][·][·][·][·][·][·][·][·]  │
│  [🧥 Torse    ][……………]      │  [·][·][·][·][·][·][·][·][·]  │
│  [👟 Pieds    ][……………]      │  [·][·][·][·][·][·][·][·][·]  │
│  [🪓 Bucheron ][……………]      │                                │
│  [⛏  Minage   ][……………]      │  ⚖ ████████░░░░  24 / 120 kg │
│  [🌿 Cueille  ][……………]      │                                │
│  [🎯 Carquois ][……………]      │  🗑 Jeter l'objet tenu        │
│                             │                                │
├─────────────────────────────┴────────────────────────────────┤
│  FABRICATION  [À la main ▼]          ← filtre actif          │
│                                                              │
│  [Planche  ·bois×2]  [Feu  ·pl×2 pierre×2]  [Brochette…]   │
│  [Torche   ·bois×1]  [Sagaie         ·…   ]  [Radeau  …]   │
│                  → 28 recettes · scroll horizontal           │
└──────────────────────────────────────────────────────────────┘
```

### 3.1 Onglets (header)

| Onglet | Contenu |
|--------|---------|
| **INV** | Grille 9×4 + équipement latéral |
| **CRAFT** | Recettes filtrées (voir §4) |
| **SKILLS** | Tableau des compétences + XP |

Raccourcis : `I` ouvre sur l'onglet actif · `C` va directement sur CRAFT.

---

## 4. Fabrication contextuelle (anti-overflow)

### 4.1 Règle de filtrage

Seules les recettes dont le `req` correspond à un atelier **présent dans le décor à moins de 6 tuiles du joueur** sont affichées. Par défaut (aucun atelier à portée) → recettes sans `req`.

```
req = undefined         → toujours visible (main libre)
req = "etabli"          → visible si etabli dans decor ≤ 6 tuiles
req = "atelier_taille"  → visible si atelier_taille dans decor ≤ 6 tuiles
req = "atelier_alchimie"→ idem
req = "marmite"         → visible si marmite dans decor ≤ 6 tuiles
req = "embarcadere"     → visible si embarcadere dans decor ≤ 6 tuiles
```

### 4.2 Filtre explicite (dropdown)

Le joueur peut aussi forcer l'affichage d'une catégorie :

| Filtre | Recettes montrées |
|--------|-------------------|
| **À la main** | sans `req` — 28 recettes |
| **Établi** | `req:"etabli"` |
| **Atelier taille** | `req:"atelier_taille"` |
| **Alchimie** | `req:"atelier_alchimie"` |
| **Marmite** | `req:"marmite"` |
| **Embarcadère** | `req:"embarcadere"` |

### 4.3 Recettes indisponibles

Les recettes dont il manque des ingrédients s'affichent en **opacité 0.4** (grayed out) mais restent visibles dans la liste courante — le joueur sait ce qu'il peut viser.

---

## 5. Style visuel (palette)

### 5.1 Couleurs

| Rôle | Valeur | Usage |
|------|--------|-------|
| **Fond panel** | `#1a1610` | Background principal |
| **Fond slot** | `#2a2318` | Cases inventaire vides |
| **Slot hover** | `#3a3228` | Survol souris |
| **Slot tenu** | `#5a4820` | Case sélectionnée |
| **Bordure** | `#4a3e28` | Séparateurs, bordures slots |
| **Bordure or** | `#c8a050` | Header, onglets actifs |
| **Texte clair** | `#e8dcc0` | Titres, labels |
| **Texte dim** | `#8a7a5a` | Labels secondaires |
| **Texte indispo** | `#5a4a3a` | Recette manque ingrédients |
| **Fond onglet actif** | `#3a2e1a` | Onglet sélectionné |

### 5.2 Typographie

- Titres sections : `font-size: 9px; letter-spacing: 2px; text-transform: uppercase`
- Quantité slot : `font-size: 7px; color: #e8dcc0; text-shadow: 1px 1px #000`
- Coût recette : `font-size: 7px; color: #8a7a5a`

### 5.3 Géométrie

- Slot inventaire : **20 × 20 px**, gap 2 px, bordure 1 px
- Slot équipement : **22 × 22 px** avec libellé 9 px dessous
- Panel total : **360 × 260 px** (même emprise qu'aujourd'hui, mieux utilisée)
- Scroll recettes : **horizontal uniquement**, sur 2 rangées max

---

## 6. Recettes — affichage compact (carte)

Chaque recette est une **carte 64×44 px** :

```
┌──────────────────────┐
│  [icône 16×16]       │
│  Planche             │  ← nom (8px)
│  bois ×2             │  ← coût (7px, grisé si manque)
│  [CRAFT]             │  ← bouton si disponible
└──────────────────────┘
```

Les cartes scrollent **horizontalement** dans une ligne de hauteur fixe.  
Deux rangées si > 8 recettes dans la catégorie.

---

## 7. Panel équipement — slots nommés

```
┌─────────────────────────────────┐
│  🗡  ARME       [ icône | nom ] │
│  🪖  TÊTE       [ icône | nom ] │
│  🧥  TORSE      [ icône | nom ] │
│  👟  PIEDS      [ icône | nom ] │
│  ─────────────────────────────  │
│  🪓  BÛCHERON   [ icône | nom ] │
│  ⛏   MINAGE     [ icône | nom ] │
│  🌿  CUEILLETTE [ icône | nom ] │
│  🎯  CARQUOIS   [ icône | nom ] │
└─────────────────────────────────┘
```

Clic sur un slot équipé → déséquipe (retour inventaire).  
Slot vide → clic dessus après avoir saisi un objet = équipe direct.

---

## 8. Onglet SKILLS — compact

Tableau 2 colonnes, pas de scroll :

```
  Bûcheronnage   ██████░░░░  Nv.3  180/250 xp
  Chasse         █████░░░░░  Nv.4  320/400 xp
  Cueillette     ███░░░░░░░  Nv.2   80/150 xp
  Minage         ██░░░░░░░░  Nv.1   20/100 xp
```

---

## 9. Fichiers à modifier

| Fichier | Changement |
|---------|------------|
| `css/inventory.css` | Réécriture complète avec la nouvelle palette |
| `js/ui/inventory-ui.js` | `refreshUI()` → filtrage recettes contextuel ; grille 9×4 ; onglets |
| `js/ui/skills-ui.js` | Tableau compact pour onglet SKILLS |
| `index.html` | Ajout `<button>` onglets dans `#inv`, suppression `<h3>` lourds |

### 9.1 Changement clé dans `inventory-ui.js`

```js
// Recettes contextuelles : détecter l'atelier le plus proche
function nearbyWorkshop(){
  const types = ["etabli","atelier_taille","atelier_alchimie","marmite","embarcadere"];
  const nearby = new Set();
  for(const d of decor){
    if(!types.includes(d.type)) continue;
    if(Math.hypot(d.tx+0.5-player.x, d.ty+0.5-player.y) <= 6) nearby.add(d.type);
  }
  return nearby;
}

function recipesForContext(){
  const ws = nearbyWorkshop();
  return RECIPES.filter(r => !r.req || ws.has(r.req));
}
```

### 9.2 Filtre actif

```js
let craftFilter = null; // null = contextuel, sinon "etabli" | "marmite" | etc.

function recipesToShow(){
  if(craftFilter) return RECIPES.filter(r => (r.req || null) === craftFilter);
  return recipesForContext();
}
```

---

## 10. Récapitulatif des gains

| Métrique | Avant | Après |
|----------|-------|-------|
| Recettes affichées (sans atelier) | 103 | 28 |
| Scroll vertical | Infini | Supprimé |
| Overflow horizontal | Fréquent | Supprimé |
| Slots inventaire | Nombre variable | 36 fixes |
| Compétences | Noyées avec recettes | Onglet dédié |
