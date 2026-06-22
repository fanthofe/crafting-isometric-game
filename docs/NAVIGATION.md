# Navigation — Bateaux & Pêche
*Voir [GDD.md](GDD.md) · [CONSTRUCTIONS.md](CONSTRUCTIONS.md) pour l'embarcadère · [RESOURCES.md](RESOURCES.md) pour les drops maritimes.*

---

## Ressources de navigation

| Ressource | Obtention | Usage |
|-----------|-----------|-------|
| `voile` | Craft établi : fibre_coco x4 + bois x2 | Proa micronésien |
| `rame` | Craft : bois x2 + cuir x1 | Composant de pirogue, boost pagayage |
| `embarcadere` | Construction sur rive | Débloque Tier 3+ (voir [CONSTRUCTIONS.md](CONSTRUCTIONS.md)) |

---

## Les 5 bateaux

### Tier 1 — Radeau
**Inspiration** : radeaux en troncs liés — usage quotidien dans les lagons, passage de chenaux

| Propriété | Valeur |
|-----------|--------|
| **Coût** | bois x8 + planche x4 + fibre_coco x3 |
| **Vitesse** | ×0.5 (très lent) |
| **Durabilité** | 20 PV |
| **Portage bonus** | 0 |
| **Pêche** | poisson 40%, rien 60% |
| **Prérequis** | Aucun |

**Gameplay** :
- Le plus rapide à construire — posé n'importe où en bord d'eau
- Fragile : requin inflige 3 dégâts/attaque (~7 attaques pour couler)
- Mauvais temps : vitesse ×0.2
- Pas de protection ni de stockage

---

### Tier 2 — Pirogue monoxyle
**Inspiration** : pirogue creusée dans un seul tronc — lagons, estuaires, déplacements courts

| Propriété | Valeur |
|-----------|--------|
| **Coût** | bois_dur x5 + planche x3 + cuir x1 + rame x1 |
| **Vitesse** | ×0.9 |
| **Durabilité** | 35 PV |
| **Portage bonus** | +20 |
| **Pêche** | poisson 65%, rien 35% |
| **Prérequis** | `etabli` + `hache_obsidienne` minimum (pour creuser) |

**Gameplay** :
- Instable hors de 4 cases de la rive : vitesse ÷2
- Peut servir d'**abri flottant la nuit** (kobolds ne sortent pas de l'eau)
- Pêche basique : tenir [E] immobile → ligne lancée → collecte auto après 3s

---

### Tier 3 — Va'a à balancier
**Inspiration** : va'a (Tahiti), wa'a (Hawaï), waka (NZ), vaka (Polynésie) — le cheval de bât du Pacifique

| Propriété | Valeur |
|-----------|--------|
| **Coût** | bois_dur x8 + planche x5 + fibre_coco x6 + bois x4 + rame x1 |
| **Vitesse** | ×1.3 |
| **Durabilité** | 60 PV |
| **Portage bonus** | +50 |
| **Pêche** | poisson 80%, dent_requin 25% |
| **Prérequis** | `embarcadere` |

**Gameplay** :
- Balancier latéral : stable en mer ouverte, **aucune pénalité** hors de la rive
- Peut tuer un requin depuis le bateau si `sagaie` ou `ihe` équipé en `slot_chasse` → drop complet
- Navigation inter-îles : atteint zones inaccessibles à pied
- Peut transporter un **coffre mobile** (+50 portage si coffre construit)

---

### Tier 4 — Proa micronésien *(flying proa)*
**Inspiration** : proa des Îles Carolines et Marshall — *korkor* (petit), *tipnol* (moyen), *walap* (hauturier) — le voilier le plus rapide avant l'ère moderne

| Propriété | Valeur |
|-----------|--------|
| **Coût** | bois_dur x10 + planche x6 + fibre_coco x8 + voile x1 + cuir x4 |
| **Vitesse** | ×2.5 — le plus rapide |
| **Durabilité** | 45 PV |
| **Portage bonus** | +30 (sacrifié pour la vitesse) |
| **Pêche** | Non (doit s'arrêter 3s immobile avant) |
| **Prérequis** | `embarcadere` + `voile` |

**Gameplay** :
- **Shunting** : inverse proue/poupe instantanément → changement de direction sans perte de vitesse
- **Vent** : ×3.5 vent arrière, ×1.5 vent de travers, ×0.8 vent debout (direction vent visible dans l'UI)
- **Fragile** : requin inflige le double (6 dmg/attaque) — coque fine asymétrique
- Idéal pour fuir, explorer rapidement, course-poursuite

---

### Tier 5 — Waka taua *(grande pirogue de guerre)*
**Inspiration** : *waka taua* maori (40m, proue sculptée), *drua* fidjienne (30m+, double coque), *tomako* des Îles Salomon (*nguzunguzu* en proue), *kalia* tongien

| Propriété | Valeur |
|-----------|--------|
| **Coût** | bois_dur x15 + planche x10 + fibre_coco x6 + jade x1 + os x4 + plume x6 |
| **Vitesse** | ×1.0 |
| **Durabilité** | 120 PV — le plus résistant |
| **Portage bonus** | +100 |
| **Pêche** | poisson 90%, dent_requin 50%, poisson_rare 15% |
| **Prérequis** | `embarcadere` + `atelier_taille` (proue sculptée en jade) |

**Gameplay** :
- **Attaque bélier** : charge en ligne droite → 8 dégâts à tout ennemi/requin percuté
- **Sculptures intimidantes** : proue jade repousse kobolds côtiers (zone 3 cases) — n'attaquent pas le bateau à quai
- **Filet passif** : laisser un filet en mer, revenir le récupérer → 1–3 poissons + 0–1 dent_requin/minute
- **Résistance requin** : 1 dégât/attaque seulement (cuir durci + robustesse)
- **Prestige** : construire ce bateau confère un titre visible dans l'UI

---

## Récapitulatif

| Bateau | Vitesse | PV | +Portage | Pêche | Prérequis |
|--------|---------|----|----------|-------|-----------|
| Radeau | ×0.5 | 20 | 0 | Basique | Rien |
| Pirogue | ×0.9 | 35 | +20 | Basique | Établi |
| Va'a | ×1.3 | 60 | +50 | Avancée + requin | Embarcadère |
| Proa | ×2.5 | 45 | +30 | À l'arrêt | Embarcadère + voile |
| Waka taua | ×1.0 | 120 | +100 | Passive + filet | Embarcadère + atelier taille |

---

## Système de pêche

```
1. Bateau à l'arrêt sur tuile eau
2. [E] → animation ligne lancée
3. Attendre 2–5s (durée aléatoire)
4. Icône clignote → [E] rapide → capture
   └─ Trop lent → poisson relâché, recommencer

Résultat selon outil slot_chasse :
  ├─ Sans outil   → poisson uniquement
  ├─ Sagaie / ihe → poisson ou tir actif sur requin visible
  └─ Filet (waka) → collecte passive automatique
```

### Ressources pêchées

| Ressource | Valeur nutritive | Usage craftable |
|-----------|-----------------|-----------------|
| `poisson` | +10 PV, +5 vigueur | `poisson_grille` (marmite) |
| `poisson_rare` | +20 PV, +10 vigueur | Potion rare possible |
| `viande_requin` | +15 PV, +8 vigueur | `soupe_requin` (marmite) |
| `dent_requin` | — | Armes Tier 4 (leiomano, épée/dague/lance requin) |
