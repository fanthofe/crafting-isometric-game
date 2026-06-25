# Crafting & Level Design — Le craft est diégétique

*Voir [CONSTRUCTIONS.md](CONSTRUCTIONS.md) · [RECIPES.md](RECIPES.md) · [INVENTORY-UI.md](INVENTORY-UI.md) · [GDD.md](GDD.md)*

> **Statut : implémenté.** L'onglet Fabrication de l'inventaire a été retiré ; le craft se
> fait au pied des outils posés (touche **E**) et à mains nues (touche **C** ou le bouton
> « Artisanat » de l'inventaire). On pose un atelier en double-cliquant l'objet dans le sac.
> Les réaffectations **★** du §4 sont appliquées dans [js/data/recipes.js](../js/data/recipes.js).

---

## 1. Intention

> **Le craft n'est plus une liste dans le sac à dos. Le craft est un lieu.**

Aujourd'hui, l'onglet **Fabrication** de l'inventaire affiche *toutes* les recettes
(filtrées par atelier proche). Le joueur ouvre son sac, clique « Craft », et l'objet
apparaît. C'est pratique mais **anti-diégétique** : on fabrique une pirogue dans son sac.

La direction proposée :

- **L'inventaire ne contient plus aucune recette.** Il ne sert qu'à porter, équiper, manger, poser.
- **Chaque outil de construction posé dans le monde est une interface de craft.** On
  s'approche d'un établi → on interagit → on voit *les recettes de cet établi*, et rien d'autre.
- Les recettes sont donc **rangées par outil**. Un outil = une catégorie de savoir-faire.

Conséquence directe sur le level design : **la base du joueur devient le hub de
progression**. Là où il pose ses ateliers, il définit où il peut fabriquer quoi. La
géographie des stations *est* l'arbre de progression.

---

## 2. Les outils de construction (stations de craft)

Six outils débloquent des familles de recettes. Tous sont des **objets posés sur la case
devant le joueur** (même système que le `feu`), puis interactifs.

| Icône | ID | Nom | Coût de pose | Rôle | Contrainte |
|------|----|-----|------|------|-----------|
| 🔥 | `feu` | Feu de camp | planche ×2 + pierre ×2 | Grillades, lumière | S'éteint avec le temps |
| 🍲 | `marmite` | Marmite | pierre ×6 + os ×2 | Cuisine élaborée | **Doit toucher un feu actif** |
| 🔨 | `etabli` | Établi | bois ×8 + pierre ×3 | Armes/outils Tier 2-4, matériaux | — |
| 🪓 | `atelier_taille` | Atelier de taille | basalte ×8 + pierre ×6 + charbon ×2 | Armes de pierre noble Tier 5 | — |
| ⚗️ | `atelier_alchimie` | Atelier d'alchimie | bois ×6 + pierre ×4 + griffe ×2 | Potions | — |
| ⛵ | `embarcadere` | Embarcadère | planche ×10 + bois ×8 + pierre ×4 | Grands bateaux Tier 3+ | Posé **sur la rive** |

> Les **constructions défensives** (clôture, palissade, mur, portail, pièges, filet)
> ne sont pas des stations : ce sont des objets que l'on pose, traités dans
> [CONSTRUCTIONS.md](CONSTRUCTIONS.md). Leur *recette* reste toutefois rattachée à un outil
> (voir §3).

### Le problème d'amorçage (« mains nues »)

On ne peut pas tout rattacher à une station : il faut pouvoir **construire sa première
station** sans station. On conserve donc un petit socle **« à mains nues »**, accessible
sans aucun outil, limité à la survie et à la pose des premières structures.

Ce socle n'est **pas** l'ancien onglet inventaire : il s'ouvre par une action de terrain
(menu de pose / artisanat rapide, touche dédiée), pas dans le sac. Voir §5.

---

## 3. Recettes par outil

Source : [js/data/recipes.js](../js/data/recipes.js). Les lignes marquées **★ proposition**
sont des réaffectations recommandées (recettes aujourd'hui `req: null`, à rattacher à un
outil pour cohérence diégétique — voir §4).

### 🖐️ Mains nues — socle de survie & d'amorçage

Disponible partout, sans outil. Strictement le nécessaire pour survivre et bâtir.

| Recette | Coût | Donne |
|---------|------|-------|
| Planche | bois ×2 | planche ×1 |
| Torche | bois ×1 + cuir ×1 | torche ×3 |
| Rame | bois ×2 + cuir ×1 | rame ×1 |
| Panier | fibre_coco ×3 + bois ×1 | panier ×1 |
| Massue en bois | bois ×4 | massue_bois ×1 |
| Sagaie | bois ×2 + pierre ×1 + plume ×1 | sagaie ×1 |
| Fronde | cuir ×2 + bois ×1 | fronde ×1 |
| Flèches (×5) | bois ×1 + pierre ×1 + plume ×2 | fleche ×5 |
| Salade de fruits | pomme ×1 + prune ×1 + cerise ×1 | salade ×1 |
| Canne en bambou | bois ×2 + fibre_coco ×1 | canne_bambou ×1 |

**Constructions à poser** (bâties à mains nues, débloquent ou défendent) :

| Recette | Coût | Donne |
|---------|------|-------|
| Feu de camp | planche ×2 + pierre ×2 | feu ×1 |
| Marmite | pierre ×6 + os ×2 | marmite ×1 |
| Établi | bois ×8 + pierre ×3 | etabli ×1 |
| Atelier d'alchimie | bois ×6 + pierre ×4 + griffe ×2 | atelier_alchimie ×1 |
| Embarcadère | planche ×10 + bois ×8 + pierre ×4 | embarcadere ×1 |
| Radeau | bois ×8 + planche ×4 + fibre_coco ×3 | radeau ×1 |
| Clôture en bois | bois ×2 | cloture_bois ×1 |
| Piège à pieu | bois ×3 + pierre ×1 | pieu_piege ×1 |
| Filet de fibres | fibre_coco ×3 + bois ×1 | filet_chasse ×1 |
| Hache de pierre | bois ×3 + pierre ×2 | hache_pierre ×1 |
| Pioche de pierre | bois ×3 + pierre ×4 | pioche_pierre ×1 |
| Serpe en pierre | pierre ×2 + bois ×1 | serpe_pierre ×1 |
| Lance | bois ×2 + pierre ×1 + plume ×1 | lance ×1 |
| Dague de griffes | griffe ×2 + planche ×1 | dague ×1 |
| Chapeau de plumes | plume ×4 + cuir ×1 | chapeau ×1 |
| Tunique de cuir | cuir ×4 | tunique ×1 |
| Bottes de cuir | cuir ×2 | bottes ×1 |
| Carquois en cuir | cuir ×3 + bois ×1 | carquois_cuir ×1 |

> Note : `atelier_taille` (basalte ×8 + pierre ×6 + charbon ×2) se pose aussi à mains nues,
> mais ses ingrédients (basalte, charbon) exigent déjà l'établi en amont — c'est un gating
> naturel.

---

### 🔥 Feu de camp — grillades

Cuisson directe sur flamme. Rapide, simple, ne demande pas de marmite.

| Recette | Coût | Donne |
|---------|------|-------|
| ★ Brochette | viande ×1 + bois ×1 | brochette ×1 |
| ★ Noix de coco rôtie | noix_coco ×2 + charbon ×1 | noix_rotie ×1 |
| ★ Poisson grillé | poisson ×2 + charbon ×1 | poisson_grille ×1 |
| ★ Sashimi | bec_de_cane ×1 + charbon ×1 | sashimi ×1 |

> **Proposition de design** : on sépare *griller* (feu) de *mijoter* (marmite). Le feu gère
> les plats simples à un ingrédient ; la marmite gère les soupes, ragoûts et festins. Cela
> donne au feu un rôle de craft à part entière dès le début de partie, et pas seulement un
> rôle de lumière + dépendance de la marmite.

---

### 🍲 Marmite — cuisine élaborée

`req: "marmite"`. **Ne fonctionne que collée à un `feu` actif** (vérification temps réel,
garde la chaleur 60 s après extinction — voir [CONSTRUCTIONS.md](CONSTRUCTIONS.md)).

| Recette | Coût | Donne |
|---------|------|-------|
| Ragoût de viande | viande ×2 + bois ×1 | ragout ×1 |
| Bouillon de fruits | pomme ×1 + poire ×1 + orange ×1 | bouillon_fruits ×1 |
| Soupe à l'os | os ×2 + viande ×1 | soupe_os ×1 |
| Festin du chasseur | viande ×3 + cuir ×1 | festin_chasseur ×1 |
| Confit de sanglier | viande ×3 + graisse ×1 | confit_sanglier ×1 |
| Soupe de requin | viande_requin ×1 + noix_coco ×1 | soupe_requin ×1 |
| Élixir polynésien | peche ×2 + cerise ×2 + prune ×1 | elixir_fruit ×1 |
| Soyo | bec_de_cane ×2 + noix_coco ×1 + charbon ×1 | soyo ×1 |
| ★ Huile de friture | huile_poisson ×2 + pierre ×1 | huile_friture ×1 |

---

### 🔨 Établi — armes, outils, matériaux (Tier 2-4)

`req: "etabli"`. Le cœur de la progression militaire et utilitaire.

**Matériaux & gréement**

| Recette | Coût | Donne |
|---------|------|-------|
| Bois dur | bois ×3 | bois_dur ×1 |
| Voile | fibre_coco ×4 + bois ×2 | voile ×1 |

**Armes Tier 2**

| Recette | Coût | Donne |
|---------|------|-------|
| Patu en pierre | pierre ×3 + cuir ×1 | patu_pierre ×1 |
| Patu en os | os ×3 + cuir ×1 | patu_os ×1 |
| Casse-tête bec | bois ×2 + pierre ×2 | casse_tete_bec ×1 |
| Casse-tête champignon | bois ×1 + pierre ×3 | casse_tete_champ ×1 |
| Ula | bois ×3 + pierre ×1 | ula ×1 |
| Pāhoa | pierre ×2 + cuir ×1 | pahoa ×1 |
| Ihe | bois ×2 + pierre ×1 + cuir ×1 | ihe ×1 |
| Arc | bois ×3 + cuir ×2 | arc ×1 |
| Serpe obsidienne | obsidienne ×2 + bois ×1 | serpe_obsidienne ×1 |
| Hache obsidienne | obsidienne ×3 + bois ×2 + cuir ×1 | hache_obsidienne ×1 |
| Pioche de basalte | basalte ×3 + bois ×2 | pioche_basalte ×1 |

**Armes Tier 3 (bois dur, basalte, obsidienne)**

| Recette | Coût | Donne |
|---------|------|-------|
| Taiaha | bois_dur ×3 + pierre ×2 + plume ×2 | taiaha ×1 |
| Tewhatewha | bois_dur ×2 + pierre ×2 + plume ×3 | tewhatewha ×1 |
| U'u | bois_dur ×3 + os ×2 + plume_noire ×1 | u_u ×1 |
| Akau tau | bois_dur ×2 + basalte ×2 | akau_tau ×1 |
| Totokia | basalte ×3 + bois ×1 | totokia ×1 |
| Lame d'obsidienne | obsidienne ×3 + bois ×1 | lame_obsidienne ×1 |
| Flèches obsidienne (×5) | bois ×1 + obsidienne ×1 + plume ×1 | fleche_obsidienne ×5 |
| Pioche obsidienne | obsidienne ×3 + bois ×2 | pioche_obsidienne ×1 |

**Armes Tier 4 (dents de requin)**

| Recette | Coût | Donne |
|---------|------|-------|
| Leiomano | bois ×2 + dent_requin ×4 + fibre_coco ×1 | leiomano ×1 |
| Épée à dents | planche ×2 + dent_requin ×6 + fibre_coco ×2 | epee_requin ×1 |
| Dague à dents | planche ×1 + dent_requin ×3 + cuir ×1 | dague_requin ×1 |
| Lance à dents | bois ×2 + dent_requin ×3 + fibre_coco ×1 | lance_requin ×1 |

**Armures & équipement**

| Recette | Coût | Donne |
|---------|------|-------|
| Casque poisson-globe | fibre_coco ×2 + os ×2 | casque_poisson ×1 |
| Cape de plumes | plume ×8 + cuir ×2 | cape_plumes ×1 |
| Jupe de combat | fibre_coco ×3 + cuir ×1 | jupe_fibre ×1 |
| Armure fibre tressée | fibre_coco ×6 + os ×2 | armure_fibre_coco ×1 |
| Carquois en os | os ×3 + cuir ×2 | carquois_os ×1 |
| Canne en os | bois ×1 + os ×2 + fibre_coco ×2 | canne_os ×1 |
| Canne en fer | planche ×2 + basalte ×2 + fibre_coco ×3 | canne_fer ×1 |

**Constructions & navires établi**

| Recette | Coût | Donne |
|---------|------|-------|
| Palissade | planche ×3 + bois ×1 | palissade ×1 |
| Portail en bois | planche ×4 + cuir ×1 | portail_bois ×1 |
| Pirogue | bois_dur ×5 + planche ×3 + cuir ×1 + rame ×1 | pirogue ×1 |
| ★ Flèches noires (×5) | plume_noire ×2 + bois ×1 + obsidienne ×1 | fleche_noire ×5 |
| ★ Flèches lunaires (×5) | cristal_lunaire ×1 + plume_noire ×1 + bois ×1 | fleche_lunaire ×5 |

---

### 🪓 Atelier de taille — pierre noble (Tier 5) & armes lunaires

`req: "atelier_taille"`. On taille, abrade, polit le jade et la serpentine. Pas de métal
dans cet univers — voir [CONSTRUCTIONS.md](CONSTRUCTIONS.md).

| Recette | Coût | Donne |
|---------|------|-------|
| Mur de basalte | basalte ×5 | mur_basalte ×1 |
| Mere serpentine | serpentine ×2 + os ×1 | mere_serpentine ×1 |
| Totokia basalte | basalte ×3 + cuir ×1 | totokia_basalte ×1 |
| Patu pounamu | jade ×2 + cuir ×1 | patu_jade ×1 |
| Hache-ostensoir | jade ×1 + serpentine ×1 + bois ×1 | hache_ostensoir ×1 |
| Totokia jade | jade ×1 + basalte ×2 | totokia_jade ×1 |
| Hache de jade | jade ×2 + bois ×1 | hache_jade ×1 |
| ★ Taiaha lunaire | fourrure_lunaire ×1 + bois_dur ×2 + jade ×1 | taiaha_lunaire ×1 |
| ★ Leiomano lunaire | fourrure_lunaire ×1 + dent_requin ×5 + cristal_lunaire ×1 | leiomano_lunaire ×1 |
| ★ U'u lunaire | fourrure_lunaire ×2 + bois_dur ×2 + cristal_lunaire ×1 | u_u_lunaire ×1 |
| ★ Arc lunaire | fourrure_lunaire ×1 + bois ×2 + cristal_lunaire ×1 | arc_lunaire ×1 |

> **Proposition** : les armes lunaires (Tier 6) sont aujourd'hui `req: null` — craftables
> partout, ce qui casse la courbe. Les rattacher à l'atelier de taille fait de ce dernier le
> point d'aboutissement de l'arbre, et donne une raison de revenir à la base pour l'endgame.

---

### ⚗️ Atelier d'alchimie — potions & bombes

`req: "atelier_alchimie"`. Détails des effets dans [FOOD.md](FOOD.md).

| Recette | Coût | Donne |
|---------|------|-------|
| Potion de soin | os ×1 + plume ×2 + pomme ×1 | potion_soin ×1 |
| Antidote | griffe ×1 + cerise ×2 + prune ×1 | potion_antivenin ×1 |
| Potion de force | os ×2 + cuir ×1 + orange ×1 | potion_force ×1 |
| Potion de rapidité | griffe ×1 + plume ×3 + cerise ×2 | potion_rapidite ×1 |
| Potion de vigueur | fourrure_lunaire ×1 + plume_noire ×1 | potion_vigueur ×1 |
| Vision nocturne | plume_noire ×2 + cristal_lunaire ×1 | potion_nuit ×1 |
| Bombe de fumée | charbon ×2 + cuir ×1 | bombe_fumee ×1 |
| Fiole de feu | charbon ×3 + fourrure_lunaire ×1 | bombe_feu ×1 |
| ★ Onction kaimana | graisse_baleine ×1 + foie_requin ×1 | onction_kaimana ×1 |

---

### ⛵ Embarcadère — grands navires & arme marine

`req: "embarcadere"`. Posé sur la rive. Voir [NAVIGATION.md](NAVIGATION.md) et [OCEAN.md](OCEAN.md).

| Recette | Coût | Donne |
|---------|------|-------|
| Va'a à balancier | bois_dur ×8 + planche ×5 + fibre_coco ×6 + bois ×4 + rame ×1 | vaa_balancier ×1 |
| Proa micronésien | bois_dur ×10 + planche ×6 + fibre_coco ×8 + voile ×1 + cuir ×4 | proa ×1 |
| Waka taua | bois_dur ×15 + planche ×10 + fibre_coco ×6 + jade ×1 + os ×4 + plume ×6 | waka_taua ×1 |
| Harpon de baleine | os_baleine ×2 + bois_dur ×3 + fibre_coco ×2 | harpon ×1 |

---

## 4. Récapitulatif des réaffectations (★)

Recettes aujourd'hui `req: null` que l'on propose de rattacher à un outil, pour que la
géographie des stations porte réellement la progression :

| Recette | Aujourd'hui | Proposé | Raison |
|---------|-------------|---------|--------|
| brochette, noix_rotie, poisson_grille, sashimi | partout | 🔥 feu | Donne un vrai craft au feu de camp |
| huile_friture | partout | 🍲 marmite | C'est de la transformation culinaire |
| fleche_noire, fleche_lunaire | partout | 🔨 établi | Munitions = atelier d'armement |
| onction_kaimana | partout | ⚗️ alchimie | Préparation de baume |
| taiaha/leiomano/u_u/arc lunaires | partout | 🪓 atelier de taille | Endgame, exige un retour à la base |

Tout le reste qui est `req: null` (planche, outils de pierre, armures de cuir simples,
constructions à poser…) **reste à mains nues** : c'est le socle d'amorçage assumé.

---

## 5. Conséquences sur le level design

### La base comme arbre de compétences spatial

Puisque chaque outil = une famille de recettes, **l'emplacement physique des outils dessine
ce que le joueur peut faire et où**. Quelques principes :

```
Camp de départ
  └─ feu + marmite (collés)        → cuisine complète
  └─ établi                        → armement Tier 2-4
  └─ atelier d'alchimie            → potions
  └─ atelier de taille (tardif)    → endgame
Rive proche
  └─ embarcadère                   → exploration maritime
```

- **Regroupement obligatoire de la marmite et du feu** : la marmite ne marche que collée à
  un feu actif. Cela crée naturellement un « coin cuisine ». Bon repère visuel.
- **L'atelier de taille arrive tard** (basalte + charbon, donc établi requis en amont).
  Le poser, c'est franchir un palier ; il marque visuellement une base mature.
- **L'embarcadère force un choix de terrain** (rive). La base s'étire vers l'eau.

### Crafting hors de la base = friction voulue

Avec le craft dans l'inventaire, le joueur fabrique n'importe où, n'importe quand. En le
liant aux stations posées, **partir en expédition loin de la base devient un engagement** :
on emporte ce qu'on a fabriqué, on ne réapprovisionne pas en armes au milieu de la forêt.
Cela valorise :

- les **stations avancées posées en avant-poste** (un établi planté près du camp kobold),
- les **consommables** (potions, grillades) emportés *avant* l'assaut,
- la **portée d'interaction** de 6 tiles déjà codée (`nearbyWorkshop`) comme rayon de confort.

### Lecture pour le joueur

L'outil sous le curseur d'interaction doit annoncer ce qu'il fabrique : surbrillance de la
station à portée + libellé (« Établi — armes & outils »). Le joueur apprend la carte de ses
savoir-faire en se déplaçant, pas en lisant un menu.

---

## 6. Pistes d'implémentation

État actuel dans [js/ui/inventory-ui.js](../js/ui/inventory-ui.js) :

- Onglet **Fabrication** dans l'inventaire (`elRecipes`, `refreshCraft`, `switchTab`).
- Filtres `CRAFT_FILTERS` (AUTO / MAIN / ÉTABLI / …) et `craftFilter`.
- `nearbyWorkshop()` détecte déjà les stations dans un rayon de 6 tiles.
- `recipesToShow()` filtre par `req` selon la station proche.

Migration vers le craft diégétique :

1. **Retirer l'onglet Fabrication de l'inventaire** : supprimer le panneau `craft`,
   `elRecipes`, `CRAFT_FILTERS`, `craftFilter`, `switchTab("craft")`. L'inventaire ne fait
   plus que sac + équipement + stats + poids.
2. **Interaction sur station** : à l'action principale face à une station posée (ou touche
   dédiée), ouvrir un panneau de craft **filtré sur cette seule station**. Réutiliser
   `recipesToShow` en lui passant l'`id` de la station ciblée au lieu de `craftFilter`.
   Le `req` des recettes devient la clé de routage — aucune logique nouvelle de filtrage.
3. **Menu « mains nues »** : une action de terrain (ex. touche de pose / artisanat rapide)
   ouvre uniquement les recettes `req: null` du socle §3. C'est ce qui permet de bâtir la
   première station.
4. **Marmite** : conserver le contrôle « feu actif adjacent » avant d'ouvrir/activer ses
   recettes (déjà décrit dans [CONSTRUCTIONS.md](CONSTRUCTIONS.md)).
5. **Réaffecter les recettes ★** : ajouter le champ `req` correspondant dans
   [js/data/recipes.js](../js/data/recipes.js) (cf. tableau §4). Changement de données pur,
   sans toucher au moteur.
6. **Feedback monde** : surbrillance + libellé de la station à portée, et message
   « hors de portée d'un atelier » si le joueur tente un craft sans station.

> Le moteur de craft (`canCraft`, `craft`, coûts, overflow au sol) reste inchangé. Tout le
> travail est : (a) déplacer l'ouverture du panneau de l'inventaire vers l'interaction
> monde, (b) router par `req`, (c) corriger les `req` manquants dans les données.
