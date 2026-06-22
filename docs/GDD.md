# GDD — Game Design Document
## Crafting Isometric — Île du Pacifique

---

## Concept

Jeu de survie/crafting en vue isométrique. Le joueur est naufragé sur une île volcanique du Pacifique, générée procéduralement. Il doit survivre, explorer, construire et s'équiper en puisant dans les ressources et les traditions des cultures polynésiennes, mélanésiennes et micronésiennes — sans aucun métal. La progression passe par la taille de la pierre, l'obsidienne volcanique, le jade sacré et la maîtrise de la mer.

---

## Pilliers de gameplay

| Pilier | Description |
|--------|-------------|
| **Survie** | PV, vigueur, faim — gérer ses ressources au quotidien |
| **Récolte & Crafting** | Collecter, transformer, fabriquer outils/armes/constructions |
| **Combat** | Kobolds hostiles, animaux agressifs, requins en mer |
| **Exploration** | Île procédurale, zones cachées, navigation maritime |
| **Progression** | Compétences, tiers d'équipement, prestige jade |

---

## Univers & Lore

L'île est habitée par des **kobolds** — créatures territoriales organisées en éclaireurs, guerriers et un chef. Ils défendent leur territoire la nuit et attaquent les installations du joueur. Des **esprits alliés** peuvent être convoqués pour aider le joueur en échange d'offrandes.

La faune locale (lapins, faisans, renards, cerfs, sangliers) fournit viande, cuir et plumes. En mer, les **requins** sont une menace et une ressource à la fois — leurs dents sont parmi les matériaux de combat les plus redoutables.

La nuit amplifie les dangers : les kobolds deviennent plus agressifs, mais certaines ressources rares (cristal lunaire, fourrure lunaire) n'apparaissent qu'à la faveur de l'obscurité.

---

## Systèmes en place (code existant)

| Système | Fichier | État |
|---------|---------|------|
| Génération procédurale de l'île | `world-logic.js` | ✅ |
| Cycle jour/nuit | `world-logic.js` | ✅ |
| Météo | `world-logic.js` | ✅ |
| Kobolds (3 types, IA, drops) | `kobolds.js` | ✅ |
| Animaux (5 espèces, drops, respawn) | `sprites.js` | ✅ |
| Inventaire + poids | `inventory.js` | ✅ |
| Compétences (bûcheron, chasse, cueillette) | `inventory.js` | ✅ |
| Armes de base (hache_pierre, lance, dague) | `items.js` | ✅ |
| Arbres fruitiers (6 variétés) | `sprites.js` | ✅ |
| Placement de feu | `world-logic.js` | ✅ |

---

## Roadmap de progression (6 phases)

```
PHASE 1 — Naufrage
  ├─ Récolte mains nues + pioche de pierre
  ├─ Armes     : massue → sagaie → fronde
  ├─ Nourriture: fruits, brochette, noix de coco
  ├─ Défense   : clôture en bois
  └─ Bateau    : radeau (traversée d'eau, pêche basique)

PHASE 2 — Installation
  ├─ Établi construit → déblocage Tier 2
  ├─ Minerais  : obsidienne, basalte
  ├─ Armes     : patu (pierre/os), casse-tête kanak, ula, pahoa, ihe
  ├─ Nourriture: ragoût et soupe à l'os (marmite sur feu)
  ├─ Défense   : palissade + portail
  └─ Bateau    : pirogue monoxyle

PHASE 3 — Sculpture & Obsidienne
  ├─ Bois dur (traitement au chêne)
  ├─ Armes     : taiaha, u'u marquisien, totokia fidjien, lame d'obsidienne
  ├─ Minerais  : serpentine (pioche basalte)
  ├─ Armure    : casque poisson-globe (Kiribati)
  ├─ Défense   : mur de basalte
  └─ Bateau    : va'a à balancier (mer ouverte, inter-îles)

PHASE 4 — Requin & Mer
  ├─ Chasse maritime (dent_requin, viande_requin)
  ├─ Armes     : leiomano, épée/dague/lance à dents de requin (Kiribati)
  ├─ Armure    : armure en fibre de coco (Kiribati)
  ├─ Cuisine   : poisson grillé, soupe requin
  ├─ Potions   : force, rapidité
  └─ Bateau    : proa micronésien (×2.5 vitesse, shunting)

PHASE 5 — Jade
  ├─ Atelier de taille construit
  ├─ Minerais  : jade/pounamu (pioche obsidienne)
  ├─ Armes     : mere serpentine, patu jade (prestige maori), hache-ostensoir kanak
  ├─ Potions   : vision nocturne, vigueur
  └─ Bateau    : waka taua (bélier, pêche passive, intimidation kobolds)

PHASE 6 — Endgame
  ├─ Boss : kobold chef → fourrure lunaire
  ├─ Cristal lunaire (nuit uniquement)
  ├─ Armes     : taiaha lunaire, leiomano lunaire, u'u lunaire, arc lunaire
  ├─ Potions   : bombe de feu
  └─ Cuisine   : élixir polynésien
```

---

## Compétences (système existant)

| Compétence | Déclencheur XP | Effet par niveau |
|-----------|----------------|------------------|
| `bucheron` | Couper un arbre | +1 bois tous les 2 niveaux |
| `cueillette` | Cueillir un fruit | +1 fruit tous les 3 niveaux |
| `chasse` | Tuer un animal | +1 drop tous les 5 niveaux |

---

## Références culturelles

| Culture | Éléments présents dans le jeu |
|---------|-------------------------------|
| **Māori (NZ)** | Patu (pierre/os/jade), taiaha, tewhatewha, jade pounamu |
| **Kanak (NC)** | Casse-tête bec/champignon, sagaie, hache-ostensoir |
| **Hawaï** | Leiomano, pahoa, ihe, arc |
| **Fidji** | Ula, totokia, waka taua (drua) |
| **Tonga/Samoa** | Akau tau |
| **Marquises** | U'u sculpté (visages tiki) |
| **Kiribati** | Armes à dents de requin, armure fibre de coco, casque poisson-globe |
| **Micronésie** | Proa (flying proa), korkor/tipnol/walap |

---

## Index des fichiers de design

| Fichier | Contenu |
|---------|---------|
| [RESOURCES.md](RESOURCES.md) | Toutes les ressources — organiques, minérales, maritimes |
| [TOOLS.md](TOOLS.md) | Slots d'outils, animations de récolte, crafts d'outils |
| [COMBAT.md](COMBAT.md) | Armes Pacific (Tiers 1–6), gameplay arc, armures |
| [CONSTRUCTIONS.md](CONSTRUCTIONS.md) | Barrières, ateliers, mécanique de placement |
| [NAVIGATION.md](NAVIGATION.md) | 5 bateaux, système de pêche, mécanique maritime |
| [FOOD.md](FOOD.md) | Cuisine (marmite), potions (alchimie), buffs |
| [RECIPES.md](RECIPES.md) | Toutes les recettes au format JS (à copier dans `inventory.js`) |
