# Combat — Armes & Armures
*Voir [GDD.md](GDD.md) · [RESOURCES.md](RESOURCES.md) pour les matériaux · [RECIPES.md](RECIPES.md) pour les recettes JS.*

> **Note culturelle** : L'arc est principalement mélanésien (Papouasie, Îles Salomon). En Polynésie et Micronésie, l'armement est dominé par les massues, lances, frondes et armes à dents de requin. Pas de métal — jade, obsidienne et basalte tiennent ce rôle.

---

## Slots d'équipement combat

```
┌────────────────────────────────────────────────────────────────┐
│  ARME        │  TÊTE    │  TORSE   │  PIEDS   │  CARQUOIS     │
└────────────────────────────────────────────────────────────────┘
```

---

## Armes — Tier 1 : Primitif (bois / pierre brute)

Disponibles dès le début, sans atelier.

| ID | Nom & Origine | Coût | Dégâts | Bonus |
|----|---------------|------|--------|-------|
| `massue_bois` | Massue — universel Pacifique | bois x4 | 2 | Étourdit 1 tour |
| `sagaie` | Sagaie — Kanak/Mélanésie | bois x2 + pierre x1 + plume x1 | 2 | Jet portée 4 cases, récupérable |
| `fronde` | Fronde polynésienne | cuir x2 + bois x1 | 2 | Tir de `pierre` (illimité), portée 4 cases |
| `pieu_affute` | Pieu affûté | bois x2 + pierre x1 | 2 | Plantable comme piège décor |

---

## Armes — Tier 2 : Pierre & Os (établi requis)

Inspiré du *patu* maori, des casse-têtes kanaks et des clubs fidjiens.

| ID | Nom & Origine | Coût | Dégâts | Bonus |
|----|---------------|------|--------|-------|
| `patu_pierre` | **Patu** en pierre — Māori (NZ) | pierre x3 + cuir x1 | 3 | Frappe d'estoc ultrarapide, cooldown 0.4s |
| `patu_os` | **Patu** en os — Māori (NZ) | os x3 + cuir x1 | 3 | Saigne −1 PV/tour × 2 tours |
| `casse_tete_bec` | Casse-tête **bec d'oiseau** — Kanak (NC) | bois x2 + pierre x2 | 3 | Ignore 1 point de défense |
| `casse_tete_champ` | Casse-tête **champignon** — Kanak (NC) | bois x1 + pierre x3 | 4 | Étourdit 2 tours |
| `ula` | **Ula** — massue de jet fidjienne | bois x3 + pierre x1 | 3 | Jet portée 3 cases, récupérable |
| `pahoa` | **Pāhoa** — dague hawaïenne | pierre x2 + cuir x1 | 3 | Très rapide, cooldown 0.35s |
| `ihe` | **Ihe** — lance de jet hawaïenne | bois x2 + pierre x1 + cuir x1 | 3 | Jet portée 4 cases, récupérable |
| `arc` | Arc mélanésien | bois x3 + cuir x2 | 3 | Distance (munition `fleche`) |

---

## Armes — Tier 3 : Bois sculpté & Obsidienne (établi + bois_dur)

Inspiré du *taiaha*/*tewhatewha* maori, du *u'u* marquisien, de l'*akau tau* tongien, du *totokia* fidjien.

| ID | Nom & Origine | Coût | Dégâts | Bonus |
|----|---------------|------|--------|-------|
| `taiaha` | **Taiaha** — arme d'hast maorie, ~1.8m | bois_dur x3 + pierre x2 + plume x2 | 4 | Portée 2 cases, +1 dmg si combo |
| `tewhatewha` | **Tewhatewha** — hache longue maorie | bois_dur x2 + pierre x2 + plume x3 | 4 | Coup de zone arc 180° |
| `u_u` | **U'u** — masse marquisienne sculptée (tiki), ~1.5m | bois_dur x3 + os x2 + plume_noire x1 | 5 | Étourdit 2 tours, coup de masse |
| `akau_tau` | **Akau tau** — massue tongienne (motifs géométriques) | bois_dur x2 + basalte x2 | 4 | +1 dégât par coup consécutif (max +3) |
| `totokia` | **Totokia** — casse-crâne fidjien à bec | basalte x3 + bois x1 | 4 | Perce armure, ignore 2 défense |
| `lame_obsidienne` | Lame d'obsidienne — Mélanésie/Hawaï | obsidienne x3 + bois x1 | 4 | Saigne 3 tours, +2 vs cuir ennemi |

### Flèches Tier 3

| ID | Coût | Portée | Dégâts | Récupérable | Effet |
|----|------|--------|--------|-------------|-------|
| `fleche` | bois x1 + pierre x1 + plume x2 → ×5 | 6 | 3 | 70% | — |
| `fleche_obsidienne` | bois x1 + obsidienne x1 + plume x1 → ×5 | 8 | 5 | 80% | Saigne 1 tour |

---

## Armes — Tier 4 : Dents de requin (établi + dent_requin)

Inspiré du *leiomano* hawaïen et des armes de Kiribati (Micronésie).

| ID | Nom & Origine | Coût | Dégâts | Bonus |
|----|---------------|------|--------|-------|
| `leiomano` | **Leiomano** — spatule à dents (Hawaï) | bois x2 + dent_requin x4 + fibre_coco x1 | 5 | Saigne 3 tours, +2 vs armure cuir |
| `epee_requin` | **Épée à dents** — Kiribati | planche x2 + dent_requin x6 + fibre_coco x2 | 6 | Arc de coupe, touche 2 ennemis adjacents |
| `dague_requin` | **Dague à dents** — Kiribati | planche x1 + dent_requin x3 + cuir x1 | 4 | Rapide (0.4s), saigne 2 tours |
| `lance_requin` | **Lance à dents** — Kiribati | bois x2 + dent_requin x3 + fibre_coco x1 | 5 | Portée 2 cases, saigne |

---

## Armes — Tier 5 : Jade & Serpentine (atelier de taille requis)

Le jade (*pounamu*) est un objet de prestige — chaque arme en jade est **unique**.

| ID | Nom & Origine | Coût | Dégâts | Bonus |
|----|---------------|------|--------|-------|
| `mere_serpentine` | **Mere** en serpentine — Māori (NZ) | serpentine x2 + os x1 | 5 | Estoc dévastateur, repousse ennemi 1 case |
| `totokia_basalte` | **Totokia** de basalte — Fidji | basalte x3 + cuir x1 | 5 | Perce toute armure |
| `patu_jade` | **Patu pounamu** — jade néphrite, Māori | jade x2 + cuir x1 | 6 | Attaque éclair (0.3s), prestige |
| `hache_ostensoir` | **Hache-ostensoir** — Kanak (NC) | jade x1 + serpentine x1 + bois x1 | 6 | Zone, kobolds hésitent 1s |
| `totokia_jade` | **Totokia** en jade — Fidji élite | jade x1 + basalte x2 | 7 | Ignore toute défense/armure |

---

## Armes — Tier 6 : Lunaire (boss drop — endgame)

| ID | Nom | Coût | Dégâts | Bonus |
|----|-----|------|--------|-------|
| `taiaha_lunaire` | Taiaha lunaire | fourrure_lunaire x1 + bois_dur x2 + jade x1 | 8 | +4 la nuit, portée 3 cases |
| `leiomano_lunaire` | Leiomano lunaire | fourrure_lunaire x1 + dent_requin x5 + cristal_lunaire x1 | 9 | Magique, saigne + poison |
| `u_u_lunaire` | U'u lunaire (tiki brillant) | fourrure_lunaire x2 + bois_dur x2 + cristal_lunaire x1 | 8 | Étourdit 3 tours, zone 2×2 |
| `arc_lunaire` | Arc lunaire | fourrure_lunaire x1 + bois x2 + cristal_lunaire x1 | 7 | Distance magique, traînée bleue |

### Flèches Tier 6

| ID | Portée | Dégâts | Effet |
|----|--------|--------|-------|
| `fleche_noire` | 6 | 3 | Poison −1 PV/tour × 3 tours, **non récupérable** |
| `fleche_lunaire` | 10 | 7 | Dégâts magiques, ignore armure, **non récupérable** |

---

## Gameplay Arc — Mécanique de tir

### Carquois (slot dédié)

| ID | Capacité | Coût |
|----|----------|------|
| *(sans carquois)* | 5 flèches (inventaire) | — |
| `carquois_cuir` | 20 flèches | cuir x3 + bois x1 |
| `carquois_os` | 30 flèches + swap rapide | os x3 + cuir x2 |

### Cycle de tir

```
[Appui touche attaque maintenu]
  ├─ Joueur IMMOBILE (bouger annule sans consommer)
  ├─ Animation : bras tendu arrière, corde étirée
  ├─ Charge 0% → 100% en 1 seconde
  │    ├─ < 30%   → tir annulé au relâché
  │    ├─ 30–79%  → tir faible : 50% dégâts, portée −2 cases
  │    └─ 80–100% → tir plein
  └─ > 2s → fatigue : sprite tremble, précision −50%

[Relâché]
  └─ Flèche en vol (sprite 4-directionnel, ~12 cases/s)
       ├─ Impact ennemi → dégâts, disparaît
       ├─ Impact barrière → se plante (non récupérable)
       └─ Impact sol → flèche plantée visible (récupérable, 60s avant disparition)

Cooldown : 0.8s (arc) / 1.2s (arc lunaire)
```

### Arc en slot_chasse vs slot_arme

| | `slot_arme` | `slot_chasse` |
|--|-------------|----------------|
| Tir silencieux | Non (alerte kobolds) | Oui (si hors aggro) |
| Bonus dégâts | — | +1 vs animaux |
| Bonus loot | — | ×2 loot animaux |
| Utilisable en combat | Oui | Non |

### Fronde — comparaison

| | Arc | Fronde |
|--|-----|--------|
| Munition | `fleche` consommable | `pierre` illimitée |
| Charge | 1s | 0.4s |
| Portée max | 6–10 cases | 4 cases |
| Dégâts | 3–7 | 2 |
| Récupération | 70–80% | Non |

---

## Armures

### Progression par slot

| Slot | Niveau 1 | Niveau 2 | Niveau 3 |
|------|----------|----------|----------|
| Tête | `chapeau` *(existant)* — plumes | `casque_poisson` — fibre+os | `cape_plumes` — prestige |
| Torse | `tunique` *(existant)* — cuir | `armure_fibre_coco` — Kiribati | — |
| Pieds | `bottes` *(existantes)* — cuir | `jupe_fibre` — fibre+cuir | — |

### Détails

| ID | Nom & Origine | Slot | Coût | Défense | Bonus |
|----|---------------|------|------|---------|-------|
| `chapeau` | Chapeau de plumes *(existant)* | tête | plume x4 + cuir x1 | +1 | Animaux fuient plus loin |
| `casque_poisson` | **Casque poisson-globe** — Kiribati | tête | fibre_coco x2 + os x2 | +3 | Dégâts tête −50% |
| `cape_plumes` | **Cape de plumes** — Polynésie | tête | plume x8 + cuir x2 | +1 | Animaux fuient plus loin, XP +10% |
| `tunique` | Tunique en cuir *(existante)* | torse | cuir x4 | +2 | +25 capacité portage |
| `armure_fibre_coco` | **Armure fibre tressée** — Kiribati | torse | fibre_coco x6 + os x2 | +5 | Meilleure armure non-magique |
| `bottes` | Bottes *(existantes)* | pieds | cuir x2 | +1 | +15% vitesse |
| `jupe_fibre` | **Jupe de combat** — Polynésie | pieds | fibre_coco x3 + cuir x1 | +2 | +10% vitesse, résiste eau |
