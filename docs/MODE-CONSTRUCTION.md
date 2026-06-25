# Mode Construction — pose au fantôme

*Voir [CRAFTING-LEVEL-DESIGN.md](CRAFTING-LEVEL-DESIGN.md) · [CONSTRUCTIONS.md](CONSTRUCTIONS.md) · [CONTROL.md](CONTROL.md)*

> **Statut : implémenté (ateliers + défenses).** Tout se construit via le menu **🔨 (B)** →
> fantôme devant le joueur (vert/rouge) → **E / clic** valide, **R** pivote, **Échap / clic droit**
> annule. Coût consommé à la pose. Groupes **Ateliers** et **Défenses** ; toutes les constructions
> sont retirées des fenêtres de craft.
>
> **Défenses livrées** : clôture / palissade / mur de basalte / portail (bloquent, ont des PV,
> détruits par le joueur **E** ou rongés par les kobolds chargeurs) ; **pieu** (5 dégâts au kobold
> qui marche dessus, consommé) ; **filet** (immobilise un kobold 8 s, récupérable au sol).
>
> Reste à faire : portail ouvrable (bloque tout le monde pour l'instant), pièges actifs aussi
> contre les animaux, réglage de distance, bouton ⟳ tactile.

---

## 0. Décisions actées

| # | Choix retenu |
|---|--------------|
| 1 | **Teinte** : 🔴 rouge = pose **interdite** uniquement. 🟢 vert = pose valide. |
| 2 | **Positionnement** : le fantôme reste **devant le joueur** (on vise en se tournant / se déplaçant). Pas de suivi souris libre. |
| 3 | **Coût** : matériaux **consommés à la validation de la pose**, pas avant. |
| 4 | **Périmètre** : le mode construction ne sert qu'aux **constructions** (stations, défenses). Le craft d'objets/armes/outils/potions/nourriture reste dans les fenêtres d'atelier. |

---

## 1. Conséquence structurelle (le point important)

Puisque les constructions se **paient à la pose** (#3) et se posent via ce mode (#4), elles
**quittent les fenêtres de fabrication**. On ne « crafte » plus un établi dans le sac pour le
poser ensuite : on le **construit** directement dans le monde.

Règle de tri unique, basée sur l'item produit :

```
recette dont la sortie a une propriété ITEMS[x].place   →  MENU CONSTRUCTION (pose au fantôme)
recette dont la sortie n'a PAS de .place                →  FENÊTRE D'ATELIER (va dans le sac)
```

Concrètement, sortent des fenêtres de craft vers le menu construction :
`feu, marmite, etabli, atelier_taille, atelier_alchimie, embarcadere,
cloture_bois, palissade, mur_basalte, portail_bois, pieu_piege, filet_chasse`.

> Les **bateaux** (`radeau, pirogue, vaa_balancier, proa, waka_taua`) gardent leur flux actuel :
> ils restent des objets craftés puis **mis à l'eau en embarquant** (E au bord de l'eau). Ils ne
> passent pas par le fantôme terrestre. (Pose à l'eau = éventuelle V3.)

---

## 2. Le modèle de visée « devant le joueur »

Le fantôme se pose sur la **case visée**, déduite de la direction du joueur — exactement le
vecteur `DIRV` déjà utilisé par `placeFire`.

- Le joueur **se tourne / se déplace** → la case visée se met à jour → le fantôme suit.
- **Portée** : par défaut la **case directement devant**. On peut autoriser un réglage de
  distance (1 → 2 → 3 cases devant) via molette / `+` `−` / un bouton tactile. *MVP = case devant.*
- Avantage majeur : **desktop et tactile partagent le même schéma de visée** (on marche, on
  oriente), pas besoin d'un mode souris à part. La souris ne sert qu'au clic de validation.

```
        ↑ joueur regarde en haut          le fantôme occupe la
         ◇  ← case visée (fantôme)         case devant ; tourner
        🧍                                   le perso déplace le fantôme
```

---

## 3. Le fantôme (l'aperçu)

- **Sprite réel** de la construction, rendu **translucide** (~45 %).
- **État valide → vert/or** ; **état invalide → rouge** (#1).
- **Emprise au sol** : les tuiles concernées sont surlignées en **diamants** de la couleur de
  l'état. C'est ce qui montre « l'espace que ça prendra » en isométrie.

```
   valide (emprise 1×1)        invalide (chevauche un rocher)
         ◇  vert                      ◆  rouge
```

- Léger flottement + ombre portée pour bien distinguer le fantôme du décor déjà posé.
- Pour les emprises multi-tuiles, si **une seule** tuile est mauvaise, tout passe rouge ; en V3
  on peut ne teinter en rouge que la/les tuile(s) fautive(s) pour montrer *pourquoi*.

---

## 4. Le menu de sélection

- Un bouton **« 🔨 Construire »** (clavier + bouton tactile dédié) ouvre une **palette** des
  constructions, groupées : **Ateliers · Défenses**.
- Chaque entrée affiche : icône, nom, **coût**, mini-indicateur d'**emprise** (1×1, 1×2…).
- État de chaque entrée :
  - **constructible** (matériaux OK **et** prérequis satisfait) → cliquable ;
  - **grisé** sinon, avec la raison (`matériaux manquants` / `près d'un établi`).
- **Prérequis = la règle `req` existante, exprimée en proximité.** Une construction `req:"etabli"`
  (palissade, portail) n'est constructible qu'**à portée d'un établi** ; les constructions sans
  `req` (feu, établi lui-même, clôture) se bâtissent partout. On réutilise donc la logique de
  craft diégétique déjà en place, sans nouveau concept de déblocage.
- Clic sur une entrée constructible → la palette se ferme → **entrée en mode fantôme**.

---

## 5. Flux complet

```
[Construire]  →  palette  →  choix d'une construction
      ↓
  MODE CONSTRUCTION (le jeu continue)
      ↓
  fantôme devant le joueur · vert/rouge · emprise visible
      ↓
  on vise en se tournant / marchant   ([R] pivote, [molette] distance)
      ↓
  validation :  clic G  ou  E / Entrée   (✓ en tactile)
   · si rouge → refus + petit feedback "pas la place ici"
   · si vert  → matériaux consommés, construction posée, particules
      ↓
  le fantôme **revient** (pose en série de la même construction)
      ↓
  [clic D] / [Échap] / bouton ✕  →  sortie du mode
```

---

## 6. Rotation & emprise multi-tuiles

- Donnée par construction : **empreinte** = liste d'offsets de tuiles (`feu = [[0,0]]`,
  `embarcadère = [[0,0],[0,1]]`, future hutte = 2×2) + **rotation** courante.
- **[R]** / bouton **⟳** fait pivoter l'empreinte de 90° (utile : embarcadère le long de la rive,
  portails, futurs bâtiments asymétriques). Objets symétriques : rotation sans effet ou simple
  changement de sprite.
- La validité teste **chaque** tuile de l'empreinte ; la pose les marque toutes bloquées.

---

## 7. Règles de validité (`canPlaceAt`)

Un seul juge centralise le vert/rouge ; le rendu ne fait que lire le verdict.

Passe au **rouge** si l'une des tuiles d'empreinte est :
- hors carte, ou déjà **bloquée** (arbre, rocher, autre construction) ;
- de l'**eau** — *sauf* l'embarcadère, dont la règle est **inverse** (doit toucher l'eau / être
  sur la rive) ;
- occupée par le **joueur** ou un **PNJ**.

Cas particulier **marmite** : posable partout (vert), mais affiche un **liseré
d'avertissement** « froide » si aucun feu adjacent — elle reste posable, simplement inactive
tant qu'on n'allume pas un feu à côté (cohérent avec le système actuel).

---

## 8. Coût & entrées

- **Coût consommé uniquement à la pose validée** (#3). Annuler / sortir du mode ne coûte rien.
- En pose en série, chaque validation reconsomme ; quand on ne peut plus payer, le fantôme
  passe rouge avec « matériaux manquants ».

**Entrées proposées** (à intégrer à [CONTROL.md](CONTROL.md)) :

| Action | Desktop | Tactile |
|--------|---------|---------|
| Ouvrir le menu | touche **B** | bouton **🔨** |
| Viser | se tourner / marcher | d-pad |
| Pivoter | **R** | bouton **⟳** |
| (option) distance | molette / `+` `−` | bouton **↔** |
| Valider | **clic G** ou **E** | bouton **✓** |
| Annuler / sortir | **clic D** / **Échap** | bouton **✕** |

---

## 9. Phasage

- **MVP** — bouton → palette (ateliers + défenses) → fantôme **1×1 devant le joueur**,
  vert/rouge + diamant d'emprise, validation, coût à la pose, pose en série, sortie. Sortie des
  constructions hors des fenêtres de craft. → couvre toute la demande.
- **V2** — empreintes multi-tuiles + rotation + réglage de distance.
- **V3** — tuile fautive surlignée, liaisons visuelles (clôtures qui se joignent), mise à l'eau
  des bateaux au fantôme.

---

## 10. Ce que ça touche dans le code (ossature, sans détail)

- une **machine à états « build »** (construction choisie, rotation, distance) coexistant avec `explore` ;
- un champ **`foot` (+ `rot`)** par construction ;
- une **passe de rendu fantôme** (sprite teinté + diamants) dans la boucle de dessin ;
- `canPlaceAt()` centralisant la validité ; `placeBuildable()` adapté pour **empreinte + coût à la pose** ;
- le **tri craft/construction** par `ITEMS[x].place` (retire les constructions des fenêtres d'atelier) ;
- les **entrées** desktop + 4-5 boutons tactiles du mode.
