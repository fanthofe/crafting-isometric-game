# Nourriture & Potions
*Voir [GDD.md](GDD.md) · [CONSTRUCTIONS.md](CONSTRUCTIONS.md) pour marmite et atelier alchimie.*

---

## Nourriture basique (sans atelier)

Ces recettes sont disponibles dès le début, sans aucun atelier.

| ID | Nom | Coût | Soin | Vigueur |
|----|-----|------|------|---------|
| `brochette` | Brochette *(existante)* | viande x1 + bois x1 | +16 PV | — |
| `salade` | Salade de fruits *(existante)* | pomme x1 + prune x1 + cerise x1 | +20 PV | — |
| `noix_coco` | Noix de coco (direct) | — *(ramassée)* | +15 PV | +5 |

---

## Cuisine avancée — Marmite sur feu

La marmite doit être posée **adjacente à un feu actif**. Elle cesse de fonctionner si le feu s'éteint (garde la chaleur 60s).

| ID | Nom | Coût | Soin | Vigueur | Durée buff | Effet spécial |
|----|-----|------|------|---------|------------|---------------|
| `ragout` | Ragoût de viande | viande x2 + bois x1 | +30 PV | +10 | 3 min | — |
| `bouillon_fruits` | Bouillon de fruits | pomme x1 + poire x1 + orange x1 | +15 PV | +5 | 2 min | Soigne empoisonnement |
| `soupe_os` | Soupe à l'os | os x2 + viande x1 | +20 PV | +15 | 4 min | +10% défense |
| `festin_chasseur` | Festin du chasseur | viande x3 + cuir x1 | +50 PV | +20 | 5 min | +20% vitesse |
| `confit_sanglier` | Confit de sanglier | viande x3 + graisse x1 | +40 PV | +25 | 6 min | Immunité dégâts feu |
| `noix_rotie` | Noix de coco rôtie | noix_coco x2 + charbon x1 | +25 PV | +10 | 3 min | +5% résistance générale |
| `poisson_grille` | Poisson grillé | poisson x2 + charbon x1 | +30 PV | +15 | 4 min | Buff résistance eau |
| `soupe_requin` | Soupe de requin | viande_requin x1 + noix_coco x1 | +35 PV | +20 | 5 min | +15% force au combat |
| `elixir_fruit` | Élixir polynésien | peche x2 + cerise x2 + prune x1 | +10 PV | +30 | 8 min | +15% XP toute récolte |

> **`graisse`** : drop rare du sanglier (1 chance sur 3) ou du cerf (rare).

---

## Potions — Atelier d'alchimie

Les potions sont à usage unique, stackables (max 5 par slot).

### Potions de soin & survie

| ID | Nom | Coût | Effet |
|----|-----|------|-------|
| `potion_soin` | Potion de soin | os x1 + plume x2 + pomme x1 | +25 PV instantané |
| `potion_antivenin` | Antidote | griffe x1 + cerise x2 + prune x1 | Supprime empoisonnement actif |

### Potions de combat

| ID | Nom | Coût | Effet |
|----|-----|------|-------|
| `potion_force` | Potion de force | os x2 + cuir x1 + orange x1 | +4 dégâts, 3 min |
| `potion_rapidite` | Potion de rapidité | griffe x1 + plume x3 + cerise x2 | +30% vitesse, 2 min |
| `potion_vigueur` | Potion de vigueur | fourrure_lunaire x1 + plume_noire x1 | +40 vigueur, 5 min |

### Potions d'exploration

| ID | Nom | Coût | Effet |
|----|-----|------|-------|
| `potion_nuit` | Vision nocturne | plume_noire x2 + cristal_lunaire x1 | Voit dans le noir, 5 min |

### Bombes (armes consommables)

| ID | Nom | Coût | Effet |
|----|-----|------|-------|
| `bombe_fumee` | Bombe de fumée | charbon x2 + cuir x1 | Zone 3×3, kobolds aveugles 5s |
| `bombe_feu` | Fiole de feu | charbon x3 + fourrure_lunaire x1 | Zone 3×3, 8 dégâts instantanés |

---

## Tableau récapitulatif des buffs

| Buff | Source | Durée | Effet |
|------|--------|-------|-------|
| Vigueur +5 | noix_coco | — | Instantané |
| Vitesse +20% | festin_chasseur | 5 min | — |
| Vitesse +30% | potion_rapidite | 2 min | Cumulable avec festin |
| Force +4 | potion_force | 3 min | — |
| Défense +10% | soupe_os | 4 min | — |
| XP récolte +15% | elixir_fruit | 8 min | Toutes compétences |
| Force combat +15% | soupe_requin | 5 min | — |
| Vision nuit | potion_nuit | 5 min | Voir dans le noir |
| Résistance eau | poisson_grille | 4 min | Moins de malus dans l'eau |
| Immunité feu | confit_sanglier | 6 min | — |
