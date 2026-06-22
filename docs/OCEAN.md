# OCEAN — Zones maritimes, poissons & prédateurs
*Voir [NAVIGATION.md](NAVIGATION.md) pour les bateaux · [RESOURCES.md](RESOURCES.md) pour les drops · [GDD.md](GDD.md) pour le contexte général.*

---

## 1. Les trois zones maritimes

L'océan se divise en trois environnements distincts, chacun accessible selon le bateau et débloquant faune, ressources et dangers différents.

```
[ ÎLE ]──lagon──[ BARRIÈRE DE CORAIL ]──haute mer──[ HAUTE MER ]
   Tier 1-2       Tier 2-3                           Tier 4-5
```

| Zone | Accès minimum | Visuel | Caractéristique |
|------|--------------|--------|-----------------|
| **Lagon** | Radeau (Tier 1) | Eau turquoise claire, fonds sableux/herbeux | Zone protégée, eaux calmes, peu profondes |
| **Barrière de corail** | Pirogue (Tier 2) | Eau plus sombre, relief corallien, vagues | Courant modéré, richesse biologique maximale |
| **Haute mer** | Va'a / Waka (Tier 3+) | Eau bleu profond, absence de fond visible | Dangereuse, tempêtes fréquentes, grandes espèces |

### 1.1 Barrière de corail — largeur variable par île

Chaque île génère une barrière de largeur aléatoire, créant des passes navigables naturelles.

| Largeur | Effet jeu |
|---------|-----------|
| Étroite (2–4 tuiles) | Passe facile, peu de loches de tombant, corail fragile |
| Moyenne (5–9 tuiles) | Équilibré — espèces les plus variées |
| Large (10–15 tuiles) | Densité de napoléons/rascasses haute, passage difficile par gros temps |

---

## 2. Poissons pêchables

La pêche s'active en maintenant **[E]** immobile depuis un bateau. Le lancer prend **3 s**, puis la ligne attend une touche. Les espèces accessibles dépendent de la **zone** et du **type de canne**.

### Cannes à pêche

| Item | Zone | Bonus espèce rare | Craft |
|------|------|-------------------|-------|
| `canne_bambou` | Lagon uniquement | — | bambou x2 + fibre_coco x1 |
| `canne_os` | Lagon + récif | +15 % loches, carangues | bois x1 + os x2 + fibre_coco x2 |
| `canne_fer` | Toutes zones | +20 % espèces hauturières | planche x2 + fer x3 + fibre_coco x3 |

---

### 2.1 Lagon

| Espèce | ID item | Taille | Rareté drop | PV cuisine | Notes |
|--------|---------|--------|-------------|------------|-------|
| **Bec de cane** | `bec_de_cane` | 50–80 cm | Peu commune | +18 | Chair fine, ingrédient du soyo |
| **Communard** | `communard` | 10–20 cm | Commune | +8 | Abondant, drop x2–4 par pêche |
| **Picot** | `picot` | 20–40 cm | Commune | +10 | Épines dorsales venimeuses : inflige 1 dégât au joueur s'il ramasse sans gants |
| **Mulet** | `mulet` | 30–60 cm | Peu commune | +14 | Soumis à fermeture saisonnière (voir §6) |
| **Poisson-crocodile** | `poisson_crocodile` | 20–35 cm | Rare | +12 | Peu chassé ; drop `huile_poisson` en bonus |

> **Picot** : si pêché sans `gants_cuir` équipés → `player.hp -= 1` + flottant "piqûre !"

---

### 2.2 Près de la barrière de corail

| Espèce | ID item | Taille | Rareté drop | PV cuisine | Notes |
|--------|---------|--------|-------------|------------|-------|
| **Loche** | `loche` | 20 cm – 1 m+ | Peu commune | +20 | Espèce phare ; variante « loche de tombant » = drop x2 |
| **Napoléon** | `napoleon` | 60 cm – 2 m | Rare | +25 | Poisson emblématique ; protégé (voir §6) |
| **Poisson-perroquet** | `poisson_perroquet` | 30–70 cm | Commune | +12 | Drop bonus `sable_corail` (déféquer du sable = fun) |
| **Rascasse** | `rascasse` | 15–40 cm | Peu commune | +14 | Mêmes épines venimeuses que le picot : 1 dégât sans gants |
| **Carangue** | `carangue` | 40–80 cm | Peu commune | +16 | Rapide ; tire fort → mini-animation de résistance (ralentit la collecte) |

---

### 2.3 Haute mer

| Espèce | ID item | Taille | Rareté drop | PV cuisine | Notes |
|--------|---------|--------|-------------|------------|-------|
| **Thon blanc (germon)** | `thon_blanc` | 70–120 cm | Peu commune | +22 | Drop x1–2, pêche hauturière de base |
| **Thon jaune (albacore)** | `thon_jaune` | 80–180 cm | Peu commune | +28 | Drop x1–2 + `huile_poisson` |
| **Thon obèse** | `thon_obese` | 100–200 cm | Rare | +30 | Résistance élevée au lancer (3 tentatives) |
| **Mahi-mahi** | `mahi_mahi` | 60–150 cm | Peu commune | +24 | Couleurs vives, drop `ecaille_arc_en_ciel` |
| **Tazar** | `tazar` | 60–100 cm | Peu commune | +20 | Très rapide → collecte instantanée ou perte |
| **Baleine** | `baleine` | — | Très rare | — | Non pêchable ; observation uniquement → `parchemin_baleine` |
| **Saumon des dieux** | `saumon_des_dieux` | >200 kg | Très rare | +50 | Uniquement canne_fer, nuit uniquement ; drop `ecaille_argent` (endgame) |

> **Baleine** : entité non hostile, se déplace lentement en haute mer. L'approcher à moins de 3 tuiles → observation → drop `parchemin_baleine` (lore + bonus xp cueillette ×2 pendant 60 s).

> **Saumon des dieux** : vit à -700 m (zone nocturne de haute mer uniquement). Combat de pêche en 3 rounds : lancer → résistance → épuisement → collecte. Récompense endgame.

---

## 3. Prédateurs / ennemis maritimes

Les prédateurs sont des entités actives (comme les kobolds) : ils patrouillent, détectent le joueur et chargent. Attaquer un bateau réduit sa durabilité ; attaquer un joueur tombé à l'eau réduit ses PV.

### 3.1 Lagon

#### Requin bouledogue — `requin_bouledogue`
*Carcharhinus leucas — le prédateur emblématique du lagon calédonien*

| Stat | Valeur |
|------|--------|
| PV | 8 |
| Vitesse | 3.2 |
| Dégâts | 2 / attaque |
| Détection | 6 tuiles |
| Drops | `viande_requin` [1–2], `dent_requin` [2–3], `foie_requin` [0–1] |
| XP chasse | 18 |

**Comportement** : patrouille dans les eaux peu profondes. S'approche des rives à la **saison chaude** (cycle diurne : phase 0.30–0.55). Très agressif, charge dès la détection. Peut s'échouer sur 1 tuile de sable peu profond.

---

#### Requin tigre — `requin_tigre`
*Galeocerdo cuvier — opportuniste des zones profondes du lagon*

| Stat | Valeur |
|------|--------|
| PV | 12 |
| Vitesse | 2.8 |
| Dégâts | 3 / attaque |
| Détection | 5 tuiles |
| Drops | `viande_requin` [2–3], `dent_requin` [3–5], `foie_requin` [1–2] |
| XP chasse | 25 |

**Comportement** : cantonné aux zones profondes du lagon (loin des rives). Opportuniste — attaque si le joueur reste immobile (pêche) plus de 8 s à portée.

---

### 3.2 Près de la barrière de corail

#### Requin gris de récif — `requin_gris`
*Carcharhinus amblyrhynchos — le requin le plus fréquent du récif*

| Stat | Valeur |
|------|--------|
| PV | 6 |
| Vitesse | 3.5 |
| Dégâts | 2 / attaque |
| Détection | 4 tuiles |
| Drops | `viande_requin` [1–2], `dent_requin` [1–3] |
| XP chasse | 14 |

**Comportement** : généralement non agressif — ne charge que si le joueur s'approche à moins de 2 tuiles *ou* effectue une action (coup d'outil) dans sa zone. Sinon il fuit.

---

#### Requin à pointes noires — `requin_pointes_noires`
*Carcharhinus melanopterus*

| Stat | Valeur |
|------|--------|
| PV | 5 |
| Vitesse | 4.0 |
| Dégâts | 1 / attaque |
| Détection | 3 tuiles |
| Drops | `viande_requin` [1–1], `dent_requin` [1–2] |
| XP chasse | 10 |

**Comportement** : rapide mais peu résistant. Souvent en banc (2–3 individus). Fuit si un compagnon est tué.

---

#### Requin à haute dorsale — `requin_dorsale`
*Carcharhinus plumbeus*

| Stat | Valeur |
|------|--------|
| PV | 9 |
| Vitesse | 2.6 |
| Dégâts | 2 / attaque |
| Détection | 5 tuiles |
| Drops | `viande_requin` [1–2], `dent_requin` [2–4], `aileron_requin` [0–1] |
| XP chasse | 20 |

**Comportement** : plus massif, plus lent. Contourne le bateau avant de frapper.

---

### 3.3 Haute mer

#### Requin blanc — `requin_blanc`
*Carcharodon carcharias — boss de haute mer*

| Stat | Valeur |
|------|--------|
| PV | 25 |
| Vitesse | 3.0 |
| Dégâts | 5 / attaque |
| Détection | 8 tuiles |
| Drops | `viande_requin` [3–4], `dent_requin` [4–6], `cartilage_requin` [1–2] |
| XP chasse | 60 |

**Comportement** : spawn rare, unique par zone. Contourne le bateau 2–3 fois avant de charger (signal : ombre visible sous la coque). Peut couler un radeau en 3 attaques.

---

#### Orque — `orque`
*Orcinus orca — chasseur social*

| Stat | Valeur |
|------|--------|
| PV | 30 |
| Vitesse | 3.6 |
| Dégâts | 4 / attaque |
| Détection | 7 tuiles (son) |
| Drops | `graisse_baleine` [2–3], `os_baleine` [1–2] |
| XP chasse | 50 |

**Comportement** : toujours en groupe de 2–3. Si l'un est blessé, les autres deviennent agressifs. Ne peut pas être soloïsé sans bateau Tier 4+.

---

#### Espadon / Marlin bleu — `espadon`
*Makaira nigricans*

| Stat | Valeur |
|------|--------|
| PV | 15 |
| Vitesse | 5.0 |
| Dégâts | 3 / attaque |
| Détection | 4 tuiles |
| Drops | `viande_espadon` [2–3], `bec_espadon` [1–1] |
| XP chasse | 35 |

**Comportement** : très rapide, se jette sur le bateau en ligne droite (dash). Inflige des dégâts de perçage (ignore 1 point d'armure de coque). Fuit si raté.

---

## 4. Nouveaux items à ajouter dans `data/items.js`

### Poissons bruts (pêche)

```js
// Lagon
bec_de_cane:        {name:"Bec de cane",        c:"#7aacbe", stack:8,  w:2.5, food:6,  heal:18},
communard:          {name:"Communard",           c:"#4a8fa0", stack:12, w:0.5, food:3,  heal:8},
picot:              {name:"Picot",               c:"#e8c840", stack:8,  w:1.2, food:4,  heal:10},
mulet:              {name:"Mulet",               c:"#8ab0c8", stack:8,  w:2.0, food:5,  heal:14},
poisson_crocodile:  {name:"Poisson-crocodile",   c:"#6a7840", stack:6,  w:1.8, food:5,  heal:12},
// Récif
loche:              {name:"Loche",               c:"#c87840", stack:6,  w:3.0, food:8,  heal:20},
napoleon:           {name:"Napoléon",            c:"#4060c8", stack:4,  w:8.0, food:10, heal:25},
poisson_perroquet:  {name:"Poisson-perroquet",   c:"#40c8a0", stack:6,  w:2.5, food:6,  heal:12},
rascasse:           {name:"Rascasse",            c:"#c85028", stack:6,  w:1.5, food:5,  heal:14},
carangue:           {name:"Carangue",            c:"#a0b8c8", stack:6,  w:3.5, food:7,  heal:16},
// Haute mer
thon_blanc:         {name:"Thon blanc",          c:"#d8e8f0", stack:4,  w:6.0, food:9,  heal:22},
thon_jaune:         {name:"Thon jaune",          c:"#f0d840", stack:4,  w:8.0, food:11, heal:28},
thon_obese:         {name:"Thon obèse",          c:"#4060a0", stack:3,  w:10.0,food:12, heal:30},
mahi_mahi:          {name:"Mahi-mahi",           c:"#40c060", stack:4,  w:5.0, food:10, heal:24},
tazar:              {name:"Tazar",               c:"#e0e8f8", stack:4,  w:4.0, food:8,  heal:20},
saumon_des_dieux:   {name:"Saumon des dieux",    c:"#c0c0d8", stack:2,  w:20.0,food:20, heal:50},
```

### Drops et ressources marines

```js
foie_requin:        {name:"Foie de requin",      c:"#8a3030", stack:6,  w:1.5},
aileron_requin:     {name:"Aileron de requin",   c:"#6a8090", stack:4,  w:1.0},
cartilage_requin:   {name:"Cartilage de requin", c:"#e0e0d0", stack:6,  w:0.8},
sable_corail:       {name:"Sable de corail",     c:"#f0e0b8", stack:20, w:0.5},
ecaille_arc_en_ciel:{name:"Écaille arc-en-ciel", c:"#80f0d0", stack:10, w:0.2},
ecaille_argent:     {name:"Écaille d'argent",    c:"#d0d8e8", stack:5,  w:0.5},
huile_poisson:      {name:"Huile de poisson",    c:"#d8c878", stack:8,  w:0.8},
bec_espadon:        {name:"Bec d'espadon",       c:"#a0b0c0", stack:4,  w:2.0},
graisse_baleine:    {name:"Graisse de baleine",  c:"#f0e8d0", stack:4,  w:3.0},
os_baleine:         {name:"Os de baleine",       c:"#ece8de", stack:3,  w:5.0},
viande_espadon:     {name:"Viande d'espadon",    c:"#e8d0c0", stack:6,  w:3.0, food:8, heal:22},
parchemin_baleine:  {name:"Parchemin baleine",   c:"#e8e0c8", stack:1,  w:0.1},
```

---

## 5. Entités à ajouter dans `entities/`

Deux nouveaux fichiers sont nécessaires :

### `entities/fish.js`
Contient les **poissons pêchables** : pas d'IA de déplacement autonome, ils sont générés à la demande lors du lancer de ligne. Structure :

```js
const FISH_TYPES = {
  // zone: "lagon" | "recif" | "haute_mer"
  // canne: "bambou" | "os" | "fer" (canne minimum requise)
  // weight: probabilité relative de tirage
  bec_de_cane:  {zone:"lagon",     canne:"bambou", weight:15, drop:[1,1], size:[50,80]},
  communard:    {zone:"lagon",     canne:"bambou", weight:40, drop:[2,4], size:[10,20]},
  picot:        {zone:"lagon",     canne:"bambou", weight:25, weight_saison_fermee:0, drop:[1,1], venimeux:true},
  mulet:        {zone:"lagon",     canne:"bambou", weight:20, weight_saison_fermee:0, drop:[1,2]},
  // ...
  saumon_des_dieux: {zone:"haute_mer", canne:"fer", weight:1, nuit_only:true, combat_rounds:3, drop:[1,1]},
};
```

### `entities/sea-predators.js`
Reprend la structure de `entities/animals.js` pour les prédateurs marins :

```js
const SEA_PREDATOR_TYPES = {
  requin_bouledogue: {zone:"lagon",     hp:8,  speed:3.2, dmg:2, detect:6,
                     drops:{viande_requin:[1,2], dent_requin:[2,3], foie_requin:[0,1]}, xp:18,
                     aggressive:true, beach:true},
  requin_tigre:      {zone:"lagon",     hp:12, speed:2.8, dmg:3, detect:5,
                     drops:{viande_requin:[2,3], dent_requin:[3,5], foie_requin:[1,2]}, xp:25,
                     aggressive:"idle_player"},
  requin_gris:       {zone:"recif",     hp:6,  speed:3.5, dmg:2, detect:4,
                     drops:{viande_requin:[1,2], dent_requin:[1,3]}, xp:14,
                     aggressive:"provoked"},
  requin_pointes_noires: {zone:"recif", hp:5,  speed:4.0, dmg:1, detect:3,
                     drops:{viande_requin:[1,1], dent_requin:[1,2]}, xp:10,
                     aggressive:true, schooling:true},
  requin_dorsale:    {zone:"recif",     hp:9,  speed:2.6, dmg:2, detect:5,
                     drops:{viande_requin:[1,2], dent_requin:[2,4], aileron_requin:[0,1]}, xp:20,
                     aggressive:true},
  requin_blanc:      {zone:"haute_mer", hp:25, speed:3.0, dmg:5, detect:8,
                     drops:{viande_requin:[3,4], dent_requin:[4,6], cartilage_requin:[1,2]}, xp:60,
                     aggressive:true, boss:true},
  orque:             {zone:"haute_mer", hp:30, speed:3.6, dmg:4, detect:7,
                     drops:{graisse_baleine:[2,3], os_baleine:[1,2]}, xp:50,
                     aggressive:true, schooling:true},
  espadon:           {zone:"haute_mer", hp:15, speed:5.0, dmg:3, detect:4,
                     drops:{viande_espadon:[2,3], bec_espadon:[1,1]}, xp:35,
                     aggressive:true, dash:true},
};
```

---

## 6. Saisonnalité — fermetures de pêche

Certaines espèces sont protégées pendant une partie du cycle jour/nuit étendu (simulant les saisons).

| Espèce | Période de fermeture | Effet |
|--------|----------------------|-------|
| **Picot** | `dayPhase() ∈ [0.30, 0.55]` (été) | `weight` forcé à 0 ; flottant si tenté : *"Picot protégé en ce moment"* |
| **Mulet** | `dayPhase() ∈ [0.55, 0.75]` (automne) | Idem |
| **Napoléon** | Toujours protégé (espèce menacée) | Non pêchable ; flottant : *"Espèce protégée"* |

---

## 7. Recettes marines (à ajouter dans `data/recipes.js`)

| Recette | Ingrédients | Résultat | Effet |
|---------|-------------|----------|-------|
| Poisson grillé | n'importe quel poisson x1 + feu x1 | `poisson_grille` | +15 PV, +vitesse 20 s |
| Sashimi | `bec_de_cane` x1 + `couteau_os` | `sashimi` | +20 PV, +xp chasse ×1.5 (30 s) |
| Soyo | `bec_de_cane` x2 + `noix_coco` x1 + `feu` x1 | `soyo` | +35 PV, full heal si <20 % PV |
| Huile de friture | `huile_poisson` x2 + `pierre` x1 | `huile_friture` | Composant cuisine avancée |
| Onction | `graisse_baleine` x1 + `foie_requin` x1 | `onction_kaimana` | Potion : immunité 60 s dégâts aquatiques |
| Harpon d'os de baleine | `os_baleine` x2 + `bois_dur` x3 + `fibre_coco` x2 | `harpon` | Arme Tier 5 : portée +1, dégâts 6, aquatique ×2 |

---

## 8. Intégration dans l'architecture existante

| Fichier | Action |
|---------|--------|
| `js/data/items.js` | Ajouter les 30+ nouveaux items (§4) |
| `js/data/recipes.js` | Ajouter les 6 recettes marines (§7) |
| `js/entities/fish.js` | Créer : `FISH_TYPES`, `castLine()`, `resolveFish()` |
| `js/entities/sea-predators.js` | Créer : `SEA_PREDATOR_TYPES`, `seaPredators[]`, `spawnSeaPredator()` |
| `js/world/map-gen.js` | Générer les zones `lagon` / `recif` / `haute_mer` par anneau autour de l'île |
| `js/world/map-logic.js` | Étendre `doAction()` : détecter si joueur en bateau + zone → `castLine()` |
| `js/game.js` | Boucle de mise à jour des prédateurs marins (comme les kobolds) |
| `docs/NAVIGATION.md` | Référencer ce fichier dans la section pêche |
