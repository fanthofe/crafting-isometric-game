# Ressources
*Voir [GDD.md](GDD.md) pour le contexte général.*

---

## Ressources organiques

| Ressource | Source | Rareté | Notes |
|-----------|--------|--------|-------|
| `bois` | Arbres (frêne, chêne, pin, bouleau, saule, érable, bouleau) | Commune | 7 espèces, rendement 1–5 selon espèce |
| `bois_dur` | Craft établi : bois x3 → bois_dur x1 | Commune | Chêne uniquement comme source idéale |
| `pierre` | Rochers (60 sur la carte) | Commune | 1–2 pierres par rocher |
| `planche` | Craft : bois x2 → planche x1 | Commune | — |
| `plume` | Faisan | Commune | 1–2 par faisan |
| `plume_noire` | Corbeau (à ajouter — oiseau rare) | Rare | Utile pour potions et armes |
| `viande` | Lapin (1), faisan (1), renard (1), cerf (2–3), sanglier (2–3) | Commune | — |
| `viande_requin` | Requin (1–2 par requin) | Peu commune | Valeur nutritive élevée |
| `cuir` | Renard (1), cerf (1–2), sanglier (1) / Kobold guerrier (1–2), chef (2–3) | Peu commune | — |
| `os` | Kobold éclaireur (1), guerrier (1–2) | Peu commune | — |
| `griffe` | Kobold éclaireur (0–1), guerrier (1), chef (2–3) | Peu commune | — |
| `fourrure_lunaire` | Kobold chef (1, boss) | Rare | Ressource endgame |
| `fibre_coco` | Palmier cocotier (bûcheronnage) | Peu commune | Nouveau type d'arbre à ajouter |
| `noix_coco` | Palmier cocotier (cueillette) | Commune | Nourriture directe +15 PV |
| `dent_requin` | Requin (2–4 par requin) | Peu commune | Matériau d'arme Tier 4 |
| `graisse` | Sanglier (1 chance/3), cerf (rare) | Peu commune | Ingrédient cuisine |
| `poisson` | Pêche depuis bateau | Commune | +10 PV, +5 vigueur |
| `poisson_rare` | Pêche (va'a, waka taua) | Peu commune | +20 PV, +10 vigueur |
| Fruits | Arbres fruitiers : pomme, poire, cerise, orange, pêche, prune | Commune | 6 variétés, 5 arbres chacune |

### Animaux — rappel des drops

| Animal | PV | Comportement | Drops |
|--------|-----|-------------|-------|
| Lapin | 1 | Fuit | viande x1 |
| Faisan | 1 | Fuit | viande x1, plume x1–2 |
| Renard | 2 | Fuit | viande x1, cuir x1 |
| Cerf | 3 | Fuit | viande x2–3, cuir x1–2 |
| Sanglier | 4 | **Agressif** (1 dmg) | viande x2–3, cuir x1, graisse (chance) |
| **Requin** | 5 | **Agressif en eau** (3 dmg) | viande_requin x1–2, dent_requin x2–4 |

### Kobolds — rappel des drops

| Type | PV | Drops |
|------|-----|-------|
| Éclaireur | 3 | os x1, griffe x0–1 |
| Guerrier | 6 | os x1–2, griffe x1, cuir x1–2 |
| Chef | 12 | griffe x2–3, fourrure_lunaire x1, cuir x2–3 |

---

## Minéraux volcaniques

> **Pas de métal** dans cet univers — la progression minérale suit la géologie volcanique du Pacifique.

| Ressource | Outil requis | Source | Rareté | Propriété |
|-----------|--------------|--------|--------|-----------|
| `charbon` | Pioche pierre | Veines noires dans rochers | Peu commune | Combustible (forge, cuisine) |
| `obsidienne` | Pioche pierre | Affleurements volcaniques noirs | Peu commune | Tranchant extrême |
| `basalte` | Pioche pierre | Formations rocheuses sombres | Commune | Pierre volcanique dense |
| `serpentine` | Pioche basalte | Veines vertes en profondeur | Rare | Pierre semi-précieuse verte |
| `jade` / `pounamu` | Pioche obsidienne | Veines vertes profondes | Très rare | Plus dure que le basalte, prestige absolu |
| `cristal_lunaire` | Pioche obsidienne | Rochers brillants — **nuit uniquement** | Très rare | Énergie magique |

### Progression de minage

```
Pioche pierre ──────────► pierre, charbon, obsidienne, basalte
Pioche basalte ─────────► + serpentine
Pioche obsidienne ──────► + jade / pounamu, cristal lunaire
```

### Note culturelle — le jade pounamu

Le *pounamu* (jade néphrite) est la ressource la plus précieuse du jeu. Dans la culture māori, chaque pièce est un taonga (trésor) transmis de génération en génération. Dans le jeu :
- Chaque **arme en jade est unique** (1 seule par partie)
- L'équipement en jade ne se répare pas — il se conserve
- Construire le **waka taua** nécessite du jade pour sculpter la proue

---

## Ressources transformées (crafts simples)

| Ressource | Recette | Prérequis |
|-----------|---------|-----------|
| `planche` | bois x2 | — |
| `bois_dur` | bois x3 | établi |
| `voile` | fibre_coco x4 + bois x2 | établi |
| `rame` | bois x2 + cuir x1 | — |

---

## Arbres — rendement

| Espèce | PV | Rendement bois | Note |
|--------|-----|----------------|------|
| Bouleau | 2 | 1–2 | Très rapide à couper |
| Frêne, Orme, Saule, Érable | 3 | 2–3 | Standard |
| Chêne | 4 | 3–5 | Source de `bois_dur` |
| Pin | 4 | 3–4 | Commun |
| **Palmier** | 3 | fibre_coco x2–3 | Nouveau — plage/sable |

> Le bûcheronnage bénéficie du bonus de compétence : +1 bois tous les 2 niveaux de `bucheron`.
