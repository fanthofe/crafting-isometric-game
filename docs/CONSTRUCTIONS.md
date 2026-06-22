# Constructions
*Voir [GDD.md](GDD.md) · [NAVIGATION.md](NAVIGATION.md) pour l'embarcadère.*

---

## Mécanique de placement

Les constructions se posent sur la **case devant le joueur** (même système que le `feu` existant) en utilisant l'item depuis l'inventaire. Elles bloquent la case et persistent dans le monde.

- **Barrières** : cassables, ont des PV visibles quand attaquées
- **Ateliers** : permanents, non cassables par les ennemis
- **Pose** : 1 tile devant le joueur, en fonction de sa direction

---

## Barrières

| ID | Nom | Coût | PV | Cassable par | Notes |
|----|-----|------|----|--------------|-------|
| `cloture_bois` | Clôture en bois | bois x2 | 5 | Kobolds, sanglier | La plus rapide à poser |
| `palissade` | Palissade | planche x3 + bois x1 | 20 | Kobolds (lent) | Bloque aussi les animaux |
| `mur_basalte` | Mur de basalte | basalte x5 | 50 | Kobold chef seulement | Roc volcanique indestructible |
| `portail_bois` | Portail en bois | planche x4 + cuir x1 | 15 | Kobolds | Ouvert/fermé par le joueur — ennemi peut forcer |
| `pieu_piege` | Piège à pieu | bois x3 + pierre x1 | — | Détruit à usage | Inflige 5 dégâts à tout être qui passe dessus |
| `filet_chasse` | Filet de fibres | fibre_coco x3 + bois x1 | — | Se dénoue après usage | Immobilise animal ou kobold 10s, récupérable |

### Tactiques défensives

```
Périmètre basique : cloture_bois (rapide, peu coûteux)
Fortification     : palissade + portail_bois (entrée contrôlée)
Reduit de pierre  : mur_basalte (seul le chef kobold peut briser)
Défense passive   : pieu_piege sur les couloirs d'approche
Contrôle animal   : filet_chasse sur les zones de passage
```

---

## Ateliers

Les ateliers sont des structures permanentes — les ennemis ne peuvent pas les détruire. Ils débloquent des catégories de recettes entières.

| ID | Nom | Coût | Débloque |
|----|-----|------|----------|
| `etabli` | Établi | bois x8 + pierre x3 | Recettes Tier 2-3 (armes, outils), bois_dur, voile |
| `atelier_taille` | Atelier de taille de pierre | basalte x8 + pierre x6 + charbon x2 | Armes Tier 5 (obsidienne façonnée, serpentine, jade) |
| `atelier_alchimie` | Atelier d'alchimie | bois x6 + pierre x4 + griffe x2 | Potions (voir [FOOD.md](FOOD.md)) |
| `marmite` | Marmite | pierre x6 + os x2 | Cuisine avancée — doit être posée **adjacente à un feu actif** |

### Notes sur les ateliers

> **Atelier de taille** — remplace la forge. Il n'y a pas de métal dans cet univers. On taille, on abrade, on polit. Le charbon sert à durcir les lames d'obsidienne par chauffe. Le jade se façonne par abrasion à l'eau et à la pierre.

> **Marmite** — la dépendance au `feu` existant est vérifiée en temps réel : si le feu s'éteint, la marmite cesse de fonctionner. La marmite garde sa chaleur 60 secondes après extinction.

### Dépendances entre ateliers

```
Établi ──────────────────────────► Tier 2-3 armes + outils
  └──► bois_dur ──────────────────► Tier 3 armes (taiaha, u'u…)
  └──► voile ─────────────────────► Proa (voir NAVIGATION.md)

Atelier de taille ───────────────► Tier 5 armes (jade, serpentine)
  └──► waka taua ──────────────────► (voir NAVIGATION.md)

Feu + Marmite ───────────────────► Cuisine avancée
Atelier alchimie ────────────────► Potions
```

---

## Embarcadère

L'embarcadère est une construction spéciale posée **sur la rive** (tuile de terre adjacente à l'eau). Il débloque la construction des bateaux Tier 3+.

| ID | Coût | Prérequis | Débloque |
|----|------|-----------|----------|
| `embarcadere` | planche x10 + bois x8 + pierre x4 | — | Va'a, proa, waka taua (voir [NAVIGATION.md](NAVIGATION.md)) |

> L'embarcadère sert aussi de point d'amarrage — un bateau amarré ici régénère 1 PV/minute.
