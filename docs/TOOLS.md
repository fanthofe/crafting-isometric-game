# Outils de récolte
*Voir [GDD.md](GDD.md) pour le contexte général · [RESOURCES.md](RESOURCES.md) pour ce qu'on récolte.*

---

## Slots d'équipement

Les outils de récolte occupent des emplacements **dédiés**, séparés des armes et de l'armure. Le joueur a toujours accès aux deux rangées simultanément.

```
┌──────────────────────────────────────────────────────────────────┐
│  ARME        │  TÊTE    │  TORSE   │  PIEDS   │  CARQUOIS        │
├──────────────────────────────────────────────────────────────────┤
│  BÛCHER.     │  CUEILL. │  CHASSE  │  MINAGE                     │
└──────────────────────────────────────────────────────────────────┘
```

| Slot | Nom complet | Mains nues | Avec outil |
|------|-------------|------------|------------|
| `slot_bucheron` | Outil de bûcheronnage | Coups de poing — 1 bois/coup, ×0.4 vitesse | Hache — rapide, bonus bois |
| `slot_cueillette` | Outil de cueillette | Main tendue — fonctionnel | Panier/Serpe — plus de récolte |
| `slot_chasse` | Outil de chasse | Ruée + piétinement — loot réduit 50% | Sagaie/Arc — efficacité + loot |
| `slot_minage` | Outil de minage | **Impossible** — pierre basique seule | Pioche — débloque minerais |

### Règles importantes

- Un outil de **récolte** ne peut pas servir d'**arme** et vice-versa
- **Minage à mains nues** : seule `pierre` brute récupérable, aucun minerai
- La **sagaie** et l'**ihe** peuvent être équipés en `slot_chasse` pour la chasse silencieuse, ou en `slot_arme` pour le combat

---

## Animations de récolte

Chaque animation est **directionnelle** (4 directions : haut, bas, gauche, droite) et **interrompue** si le joueur se déplace pendant l'action.

| Action | Mains nues | Avec outil |
|--------|-----------|------------|
| **Couper un arbre** | Coups de poing répétés (2 frames, bras allongé) | Swing de hache — arc 120°, éclats de bois visuels |
| **Cueillir un fruit** | Bras tendu, main qui saisit | Panier tendu + fruit qui saute dedans |
| **Chasser (corps-à-corps)** | Ruée en avant + piétinement | Jet de sagaie / tir d'arc |
| **Miner** | — impossible — | Pioche levée → frappe → étincelles volcaniques |
| **Ramasser pierre** | Accroupissement + main au sol | Idem (pioche non requise pour `pierre` simple) |

---

## Outils craftables

### Bûcheronnage (`slot_bucheron`)

| ID | Coût | Vitesse | Bonus loot | Note |
|----|------|---------|------------|------|
| `hache_pierre` | bois x3 + pierre x2 | ×1.0 | +0 | Outil existant dans le jeu |
| `hache_obsidienne` | bois x2 + obsidienne x2 | ×1.4 | +1 bois | Lame volcanique tranchante |
| `hache_jade` | bois x1 + jade x2 | ×1.8 | +2 bois | **Ne s'use jamais** — outil de prestige |

### Cueillette (`slot_cueillette`)

| ID | Coût | Bonus |
|----|------|-------|
| `panier` | bois x2 + cuir x1 | Capacité fruits ×1.5, cueillette plus rapide |
| `serpe_pierre` | bois x1 + pierre x2 | +1 fruit par cueillette |
| `serpe_obsidienne` | bois x1 + obsidienne x2 | +2 fruits, régénération de l'arbre accélérée |

### Chasse (`slot_chasse`)

Les armes de jet peuvent être équipées en slot chasse pour bénéficier des bonus spécifiques.

| Outil | Bonus chasse (vs bonus combat) |
|-------|-------------------------------|
| `sagaie` | +1 loot animal, animation de lancer dédiée, tir silencieux |
| `arc` + flèches | Chasse à distance, +1 loot, ne déclenche pas l'aggro kobolds |
| `ihe` | Portée 3 cases, récupérable, +1 loot |

### Minage (`slot_minage`)

| ID | Coût | Minerais débloqués |
|----|------|--------------------|
| `pioche_pierre` | bois x2 + pierre x3 | pierre, charbon, obsidienne, basalte |
| `pioche_basalte` | bois x2 + basalte x3 | + serpentine |
| `pioche_obsidienne` | bois x1 + obsidienne x3 | + jade, cristal_lunaire |

---

## Compétences liées à la récolte

| Compétence | Progression | Bonus max |
|-----------|-------------|-----------|
| `bucheron` | +1 XP par arbre coupé | +1 bois tous les 2 niveaux |
| `cueillette` | +1 XP par fruit cueilli | +1 fruit tous les 3 niveaux |
| `chasse` | +1 XP par animal tué | +1 drop tous les 5 niveaux |
