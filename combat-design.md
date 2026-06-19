# Combat RPG tour par tour — Document de préparation

> Objectif : ajouter une boucle de combat **type Chrono Trigger** déclenchée
> automatiquement à l'approche d'un monstre. Le héros et les monstres se placent
> à des emplacements précis **sur la carte** (pas d'écran de combat séparé), puis
> on enchaîne les tours jusqu'à la victoire, la fuite ou la défaite.

---

## 1. Référence & intention

Chrono Trigger, ce sont quatre piliers à reproduire :

1. **Combat sur le terrain** — pas de transition vers une arène. La caméra se cale
   sur la zone, les ennemis déjà visibles deviennent les combattants.
2. **Placement** — héros d'un côté, ennemis en formation en face.
3. **ATB (Active Time Battle)** — chaque combattant a une jauge qui se remplit ;
   quand elle est pleine, il agit. C'est « tour par tour » mais rythmé par le temps.
4. **Menu de commandes** — Attaquer / Technique / Objet / Fuir.

> ⚠️ « tour par tour » + « type Chrono Trigger » sont légèrement contradictoires
> (CT est de l'ATB temps réel). Voir les décisions §3.

---

## 2. État des lieux du code (points d'ancrage)

Le jeu est un ensemble de scripts classiques partageant la portée globale, chargés
dans l'ordre par [la-plaine.html](la-plaine.html). La boucle unique
[`loop(now)`](js/game.js) fait **update puis render** chaque frame.

Briques déjà en place et réutilisables :

| Brique | Où | Réutilisation en combat |
|---|---|---|
| `player {x,y,dir,hp,maxHp,swing,hurtT}` | [js/world-logic.js](js/world-logic.js) | combattant joueur |
| `kobolds[]`, `KOBOLD_TYPES` (`hp,speed,xp,drops,dmg,w,h`) | [js/kobolds.js](js/kobolds.js) | combattants ennemis |
| `ANIMAL_TYPES` (`sanglier` est `aggressive`) | [js/sprites.js](js/sprites.js) | ennemis optionnels |
| `statForce()`, `statForceBois()`, `statDefense()` | [js/inventory.js](js/inventory.js) | dégâts / défense du héros |
| `gainXP(id,n)`, `SKILLS` | [js/items.js](js/items.js) | récompenses |
| `groundItems.push(...)` | [js/world-logic.js](js/world-logic.js) | butin à la victoire |
| `floats.push({sx,sy,t,str,c})`, `burst(sx,sy,c,n)` | [js/effects.js](js/effects.js) | nombres de dégâts, impacts |
| `toScreen(tx,ty)`, `isBlocked(tx,ty)` | [js/world-logic.js](js/world-logic.js) | placement & rendu |
| `drawHero(...)`, `KOBOLD_IMG`, `ANIMAL_IMG` | [js/hero.js](js/hero.js), [js/sprites.js](js/sprites.js) | sprites des combattants |
| `keys`, `actionQueued`, `KEYMAP` | [js/input.js](js/input.js) | navigation du menu |
| caméra `camX/camY`, `ox/oy` | [js/game.js](js/game.js) | cadrage sur la zone |
| esprits `ao`/`raka`, `spiritSay()` | [js/spirits.js](js/spirits.js) | dialogues, allié potentiel |

**Important** : aujourd'hui tout tourne dans un seul mode implicite (exploration).
Le combat impose d'introduire une **machine à états** globale.

---

## 3. Décisions de design (recommandations)

Chaque décision est tranchée par une reco pour ne pas bloquer le dev. À ajuster.

> ✅ **D1 et D2 sont verrouillées** (choix validé) : **tour-par-tour strict** et
> **héros seul**. L'ATB (jalon 6) et les alliés deviennent des extensions
> facultatives, pas des objectifs.

| # | Question | Options | **Décision** |
|---|---|---|---|
| D1 ✅ | Rythme des tours | ATB temps réel vs tour-par-tour strict | **Tour-par-tour strict** (ordre fixe par vitesse). ATB = extension optionnelle plus tard, l'archi le permet sans tout refaire. |
| D2 ✅ | Groupe joueur | Héros seul vs groupe | **Héros seul.** L'archi reste prête pour N alliés (raka) si on l'ajoute un jour. |
| D3 | Lieu du combat | Arène séparée vs **sur la carte** | **Sur la carte** (fidèle à CT). On fige l'exploration et on repositionne les combattants autour du point de contact. |
| D4 | Déclencheurs | Tous les monstres vs sélection | **Kobolds + animaux `aggressive` (sanglier).** Les proies (lapin, cerf…) restent en chasse temps réel hors combat. |
| D5 ✅ | Fuite | Oui / non | **Oui, 5ᵉ commande du menu.** Proba liée à la vitesse ; réussie → repositionne le héros hors de portée (cf. §12). |
| D6 ✅ | Commandes du menu | — | **Liste validée : `Attaquer · Compétences · Défendre · Objets · Fuir`.** Voir §9.2. |
| D7 | Game over | Mort = ? | À définir : respawn au camp avec perte partielle d'XP, ou simple soin. **Reco : respawn au `spawn`, HP plein, message de raka.** |

> Ces décisions sont les seules qui changent l'architecture. Le reste découle.

---

## 4. Architecture cible

### 4.1 Machine à états globale

Nouvelle variable globale `gameMode` (dans un nouveau fichier, voir §8) :

```
"explore"   → boucle actuelle (déplacement, récolte, chasse temps réel)
"battle"    → boucle de combat (ci-dessous)
```

Sous-phases du combat (`battle.phase`) :

```
"intro"   → caméra + combattants glissent vers leurs positions (~0.6 s),
            le cercle de combat apparaît et la pénombre se ferme (§9.1)
"player"  → en attente d'une commande du joueur (menu actif)
"action"  → animation d'une action en cours (avance, frappe, recul)
"enemy"   → l'IA d'un ennemi joue son tour
"victory" → butin + XP, puis retour "explore"
"defeat"  → game over (D7)
"flee"    → animation de fuite, puis retour "explore"
```

### 4.2 Branchement dans la boucle

Dans [`loop(now)`](js/game.js), on aiguille :

```js
if (gameMode === "explore") {
  updateExplore(dt);        // = corps actuel de la mise à jour, extrait tel quel
} else {
  updateBattle(dt, t);      // nouveau (combat.js)
}
renderWorld(t);             // = rendu actuel (toujours affiché, c'est CT !)
if (gameMode === "battle") renderBattleUI(t);   // menu, jauges, curseur
```

> Le monde continue d'être **rendu** pendant le combat (sprites des combattants
> inclus), seules les **mises à jour d'exploration** sont gelées. C'est ce qui
> donne le rendu « sur place » de Chrono Trigger.

### 4.3 Modèle de données d'un combat

```js
const battle = {
  active: false,
  phase: "intro",
  allies: [],      // [{ ref:player,  side:"ally", hp, maxHp, atb, pos:{x,y}, home:{x,y}, ... }]
  enemies: [],     // [{ ref:kobold,  side:"enemy", type, hp, maxHp, atb, pos, home, ai, ... }]
  order: [],       // file des tours (tour-par-tour) OU tri par ATB
  turnIx: 0,
  cursor: 0,       // sélection de cible / d'option
  menu: "root",    // "root" | "target" | "skill" | "item"  (cf. §9.2)
  anchor: {x,y},   // centre de la zone de combat (point de contact)
  timer: 0,
};
```

Chaque **combattant** est un objet de combat qui *référence* l'entité monde
(`ref`) mais possède ses propres stats de combat, pour ne pas polluer la logique
d'exploration :

```js
function makeCombatant(ref, side, kind){
  return {
    ref, side, kind,                 // kind: "hero" | "kobold:guerrier" | ...
    hp: ref.hp, maxHp: ref.maxHp,
    atk, def, spd,                   // dérivés (voir §6)
    atb: 0,                          // 0..1 (jalon ATB)
    pos: {x:ref.x, y:ref.y},         // position de combat (tuiles)
    home: null,                      // emplacement assigné sur la grille de combat
    anim: {t:0, kind:"idle"},        // idle | step | hit | hurt | ko
    alive: true,
  };
}
```

---

## 5. Déclenchement automatique

Dans `updateExplore`, après la mise à jour des kobolds, scanner la proximité :

```js
const TRIGGER_RADIUS = 2.2;        // tuiles
if (gameMode === "explore") {
  const near = kobolds.filter(k => !k.dead &&
                 Math.hypot(k.x-player.x, k.y-player.y) < TRIGGER_RADIUS);
  if (near.length) startBattle(near);
}
```

Règles :
- On agrège les kobolds **proches entre eux** (rayon de groupe ~3 tuiles autour du
  déclencheur) pour embarquer toute la patrouille → combats à plusieurs ennemis.
- `startBattle()` met `gameMode="battle"`, gèle les vitesses des ennemis, calcule
  les emplacements (§7) et passe en phase `intro`.
- Garde-fou : pas de re-déclenchement pendant `intro/victory/flee` ni juste après
  un combat (petit `cooldown` sur le joueur).

---

## 6. Stats de combat (dérivation)

Pour rester cohérent avec l'équipement/compétences existants :

**Héros**
```
atk = statForce()                       // déjà = 1 + chasse + arme
def = statDefense()                     // déjà = somme des def d'armure
spd = 4 + (equip.pieds ? 1 : 0)         // influe sur l'ordre / l'ATB
hpMax = player.maxHp
```

**Ennemis** (depuis `KOBOLD_TYPES`)
```
atk = T.dmg
def = 0  (ou T.def si on l'ajoute)
spd = T.speed
hpMax = T.hp
```

> Formule de dégâts proposée (à équilibrer) :
> `dmg = max(1, atk - def_cible + alea(-0..1))`, ×1.5 sur coup critique (5 %).

À terme, ajouter aux types ennemis : `def`, `crit`, liste de `moves` (techniques).

---

## 7. Placement des combattants (le cœur « CT »)

À `startBattle`, on calcule un **repère de combat** :

1. `anchor` = milieu entre le joueur et le barycentre des ennemis.
2. Axe joueur→ennemis = direction de la formation.
3. **Côté allié** : 1 à 3 emplacements alignés perpendiculairement, à ~2 tuiles de
   l'anchor du côté du joueur.
4. **Côté ennemi** : N emplacements en arc/ligne du côté opposé.
5. Pour chaque emplacement : si `isBlocked()` ou eau → chercher la tuile libre la
   plus proche (spirale courte). Évite de planter un combattant dans un arbre/lac.
6. Pendant `intro`, on **interpole** `pos` de chaque combattant de sa position
   actuelle vers son `home` (lerp ~0.6 s), et la caméra glisse vers `anchor`.

```
        [E1]
   [E2]        anchor        [Héros]
        [E3]
   ←—— ennemis ——→        ←—— allié(s) ——→
```

Détails :
- La caméra se **verrouille** sur `anchor` pendant tout le combat (override du
  suivi joueur actuel basé sur `camX/camY`).
- Les combattants regardent l'adversaire (`dir` gauche/droite selon l'écran).

---

## 8. Découpage en fichiers

Nouveau fichier **[js/combat.js](js/combat.js)**, chargé **après**
`world-logic.js` et **avant** `game.js` dans [la-plaine.html](la-plaine.html)
(il utilise toScreen/isBlocked/stats, et game.js l'appelle).

Contenu :
```
gameMode (état global)
battle (objet d'état §4.3)
makeCombatant(), deriveStats()
startBattle(group)   placeCombatants()   endBattle(result)
updateBattle(dt,t)   → switch(battle.phase)
  stepIntro / stepPlayerInput / stepAction / stepEnemy / stepVictory / stepDefeat / stepFlee
chooseEnemyAction(c) (IA)
applyAttack(src, dst)  (dégâts, floats, burst, KO)
renderBattleUI(t)    (menu, curseur de cible, jauges PV/ATB, bannière)
```

Refactor minimal côté [js/game.js](js/game.js) :
- Extraire le corps actuel de la mise à jour dans `updateExplore(dt,t)`.
- Extraire le rendu dans `renderWorld(t)` (déjà quasi le cas).
- Ajouter l'aiguillage §4.2.
- Dans la boucle de rendu des entités, lire `pos` du combattant si l'entité est
  en combat (sinon `x/y` du monde), pour afficher les glissements de placement.

Pas de framework, pas de build : on reste sur des scripts classiques + portée
globale, comme le reste du projet.

---

## 9. UI de combat

Réutiliser le canvas (pas de DOM lourd), style pixel cohérent :
- **Menu de commandes** bas-gauche : `Attaquer · Compétences · Défendre · Objets · Fuir`
  (curseur clavier ↑/↓, validation E/Espace, retour Échap). Navigation via
  `keys`/`KEYMAP`. Détail des 5 commandes en §9.2.
- **Sélection de cible** : curseur (chevron) au-dessus de l'ennemi visé, ←/→ pour
  changer de cible.
- **Jauges** : barre PV sous chaque combattant (déjà faite pour les kobolds, à
  généraliser) ; barre **ATB** au jalon 6.
- **Nombres de dégâts** : `floats.push()` (déjà en place) en blanc/rouge, soins
  en vert.
- **Bannière** : « Combat ! », « Victoire ! », « Vous fuyez ! » via un encart en
  haut (réutiliser le style des bulles d'esprit de [js/game.js](js/game.js)).

> Le menu inventaire (`I`) est désactivé pendant le combat, sauf la sous-commande
> « Objet » qui ouvre une liste filtrée (consommables `food` de `slots`).

### 9.1 Zone de combat « style Wakfu » (cercle éclairé + pénombre autour)

À l'entrée en combat, on délimite visuellement l'arène : un **cercle de combat
visible** au sol, et **tout autour s'assombrit** pour concentrer le regard sur la
scène (comme la phase de combat de Wakfu).

**Géométrie.** En isométrique, un cercle au sol se projette en **ellipse** à
l'écran (rapport `TH/TW = 0.5`). On le centre sur `battle.anchor` :
```
centre écran : c = toScreen(anchor.x, anchor.y) + (ox,oy)
rayon         : R = (portée max des combattants depuis l'anchor + marge) en px
ellipse       : rayonX = R,  rayonY = R * (TH/TW)   // = R/2, aplatissement iso
```
`R` se calcule une fois au placement (§7) à partir de l'écartement des `home`.

**Rendu** — tout à la fin de `renderWorld`, **après** entités et décor mais
**avant** l'UI de combat (menu, jauges), pour que le menu reste lumineux :

```js
// 1) voile sombre sur tout l'écran, troué par un dégradé radial au centre
cx.save();
cx.translate(c.x, c.y);
cx.scale(1, TH/TW);                 // rend le dégradé elliptique (iso)
const g = cx.createRadialGradient(0,0, R*0.6, 0,0, R*1.35);
g.addColorStop(0,   "rgba(8,10,30,0)");      // centre : net, pleine lumière
g.addColorStop(0.7, "rgba(8,10,30,0)");
g.addColorStop(1,   `rgba(8,10,30,${0.6*battle.zoneK})`);  // bord : pénombre
cx.fillStyle = g;
cx.setTransform(1,0,0,1,0,0);       // on peint sur tout l'écran
cx.fillRect(0,0,LW,LH);
cx.restore();

// 2) anneau lumineux marquant la limite du cercle de combat
cx.save();
cx.translate(c.x, c.y); cx.scale(1, TH/TW);
cx.beginPath(); cx.arc(0,0, R, 0, 7);
cx.strokeStyle = `rgba(120,180,255,${0.5*battle.zoneK})`;
cx.lineWidth = 2; cx.stroke();
// liseré pulsé plus fin pour l'effet « magique »
cx.beginPath(); cx.arc(0,0, R-2, 0, 7);
cx.strokeStyle = `rgba(200,225,255,${(0.25+0.15*Math.sin(t*4))*battle.zoneK})`;
cx.lineWidth = 1; cx.stroke();
cx.restore();
```

**Points clés**
- `battle.zoneK` ∈ [0,1] : facteur d'apparition. On le fait monter pendant la
  phase `intro` (fondu ~0.4 s) et redescendre à la sortie → entrée/sortie douces.
- Le **trou central transparent** laisse les combattants en pleine lumière ; le
  monde au-delà du cercle s'assombrit. Comme l'UI est dessinée **après**, elle
  n'est pas affectée.
- L'anneau utilise `globalCompositeOperation="lighter"` possible pour un rendu
  plus « lumineux » (cohérent avec le rendu additif des esprits existant).
- Option « plein Wakfu » : *désaturer* légèrement l'extérieur. Coûteux sur canvas
  (manipulation de pixels). **Reco : se contenter de l'assombrissement** (suffisant
  et performant) ; garder la désaturation pour un éventuel polish.
- Le `setTransform(1,0,0,1,0,0)` part du principe que le canvas n'a pas de
  transform résiduelle à ce stade ; sinon sauvegarder/restaurer la transform
  courante au lieu de la réinitialiser.

**Réglages** (à mettre dans [js/config.js](js/config.js)) :
```js
const BATTLE_ZONE_MARGIN = 28;   // marge (px) autour des combattants
const BATTLE_DARK = 0.6;         // opacité max de la pénombre extérieure
const BATTLE_ZONE_FADE = 3;      // vitesse du fondu d'apparition/disparition
```

### 9.2 Les 4 commandes du joueur

Au tour du héros (phase `player`), le menu racine propose **exactement** :

| Commande | Effet | Cible | Sous-menu |
|---|---|---|---|
| **Attaquer** | Dégât physique de base : `applyAttack` avec `atk = statForce()`. | 1 ennemi | sélection de cible |
| **Compétences** | Liste des `TECHNIQUES` débloquées (techniques de combat). Chaque entrée a un coût (PT, voir ci-dessous) et un effet (gros dégât, zone, soin…). | selon la technique | liste → cible |
| **Défendre** | Pose `combatant.guard = true` jusqu'au prochain tour du héros : dégâts reçus **÷2** (ou `def +X`). Régénère un peu de **PT**. Termine le tour immédiatement. | soi | aucun |
| **Objets** | Liste filtrée des consommables (`ITEMS[id].food`) présents dans `slots`. Soigne / booste, consomme l'objet (`removeItem`). | soi (ou allié) | liste d'objets |
| **Fuir** | Tente de quitter le combat. Proba liée à la vitesse (§12). Réussite → fin du combat + repositionnement hors de portée ; échec → le tour passe à l'ennemi. | — | aucun |

**États du menu** (`battle.menu`) :
```
"root"   → Attaquer | Compétences | Défendre | Objets | Fuir
"target" → choix de l'ennemi (Attaquer, ou technique offensive)
"skill"  → choix d'une technique dans TECHNIQUES
"item"   → choix d'un consommable de slots
```
Échap = remonter d'un cran (`item`/`skill`/`target` → `root`). « Défendre » et
« Fuir » s'exécutent sans sous-menu (confirmation directe).

> ⚠️ **« Compétences » ≠ `SKILLS` existant.** Les `SKILLS`
> (bûcheron/cueillette/chasse, [js/items.js](js/items.js)) sont des compétences
> *passives* qui montent en pratiquant. Les **compétences de combat** sont une
> **nouvelle table `TECHNIQUES`** (capacités actives). On garde les deux séparées ;
> le niveau de `chasse` peut servir à *débloquer* des `TECHNIQUES`.

**Ressource des compétences — PT (Points de Technique).** Nouveau champ sur le
combattant : `pt` / `ptMax`. Proposition :
```
ptMax = 3 + Math.floor((SKILLS.chasse.lvl-1)/2)
pt    démarre à ptMax au début du combat
Attaquer / Défendre : +1 PT (récupération)
Compétence : coûte technique.cost PT (grisée si pt < cost)
```

**Table `TECHNIQUES`** (nouveau fichier de données ou dans combat.js) :
```js
const TECHNIQUES = {
  coup_puissant: {name:"Coup puissant", cost:1, kind:"atk",  power:2.0, target:"one",
                  desc:"Frappe lourde sur un ennemi"},
  tourbillon:    {name:"Tourbillon",    cost:2, kind:"atk",  power:1.2, target:"all",
                  desc:"Touche tous les ennemis", reqChasse:3},
  cri_guerrier:  {name:"Cri du guerrier",cost:2, kind:"buff", target:"self",
                  desc:"Augmente la force quelques tours", reqChasse:5},
};
// débloquée si !req || SKILLS.chasse.lvl >= reqChasse
```

---

## 10. Boucle de tour (jalon 1 : tour-par-tour strict)

```
intro terminé → construire battle.order trié par spd décroissant
boucle :
  combattant courant = order[turnIx]
  s'il est mort → suivant
  si ALLY (héros)  → phase "player" : on attend la commande
  si ENEMY         → phase "enemy"  : chooseEnemyAction puis applyAttack
  après résolution → anim "action", puis turnIx = (turnIx+1) % vivants
  test de fin :
    tous ennemis morts  → "victory"
    tous alliés morts    → "defeat"
turnIx revient au héros → nouveau round
```

**Jalon 6 (ATB)** : remplacer l'ordre fixe par `c.atb += c.spd*dt*K` ; quand
`atb>=1`, le combattant agit puis `atb=0`. Le menu joueur met le temps en pause
(comme l'option « Wait » de CT). Le reste (actions, dégâts, fin) est identique.

---

## 11. IA ennemie (jalon 1 : basique)

```
chooseEnemyAction(c):
  cible = allié vivant le plus proche (souvent le héros)
  90 % → attaque de base
  10 % → (chef kobold) capacité spéciale / cri de ralliement   // jalon 5
```

Évolutions : ciblage du plus faible, fuite si PV bas (cohérent avec le
comportement `flee` actuel des kobolds), soutien entre kobolds.

---

## 12. Fin de combat

**Victoire** :
- Pour chaque ennemi vaincu : `gainXP("chasse", T.xp)` et butin via
  `groundItems.push(...)` au sol près de l'anchor (réutilise la logique de
  [`hitKobold`](js/world-logic.js)). Option : ramassage auto.
- Marquer les kobolds `dead=true` + `respawn` (déjà géré par le monde).
- Bannière « Victoire », `spiritSay("raka", ...)`, puis `gameMode="explore"`,
  caméra rendue au joueur, petit `cooldown` anti-redéclenchement.

**Fuite** : proba `clamp(0.4 + (heroSpd - enemySpdMax)*0.1, 0.1, 0.95)`. Réussie →
téléporter le joueur à quelques tuiles à l'opposé des ennemis ; échec → le tour
passe à l'ennemi.

**Défaite** (D7, reco) : fondu, respawn au `spawn`, `player.hp = player.maxHp`,
message. (Variante plus dure à décider : perte d'objets / d'XP.)

---

## 13. Plan de développement par jalons

- [ ] **J0 — Tuyauterie d'état**
  - [ ] Créer [js/combat.js](js/combat.js), l'ajouter au HTML (avant game.js)
  - [ ] Introduire `gameMode`, extraire `updateExplore` / `renderWorld`
  - [ ] Aiguillage dans `loop()` (le jeu doit tourner exactement comme avant)
- [ ] **J1 — Squelette de combat jouable**
  - [ ] `startBattle` + placement (§7) + phase `intro` (glissements + caméra)
  - [ ] **Zone de combat visuelle (§9.1)** : cercle éclairé + pénombre autour (`battle.zoneK`)
  - [ ] Ordre par `spd`, tour héros (attaque seule) / tour ennemi (IA basique)
  - [ ] `applyAttack` + dégâts + `floats`/`burst` + KO + barres PV
  - [ ] Conditions de victoire/défaite + retour exploration
- [ ] **J2 — Menu & cibles**
  - [ ] Menu canvas racine `Attaquer · Compétences · Défendre · Objets` (clavier + tactile)
  - [ ] Curseur de sélection de cible
  - [ ] **Défendre** (réduction de dégâts jusqu'au prochain tour, +1 PT)
- [ ] **J3 — Objets & fuite**
  - [ ] Commande « Objets » (consommables `food` de `slots`, soin, `removeItem`)
  - [ ] Commande « Fuir » : proba liée à la vitesse + repositionnement (§12)
- [ ] **J4 — Récompenses & game over**
  - [ ] XP, butin au sol, respawn ennemis, bannières, dialogues raka
  - [ ] Gestion de la défaite (D7)
- [ ] **J5 — Compétences de combat (saveur CT)**
  - [ ] Ressource **PT** (`pt`/`ptMax`), table `TECHNIQUES`, déblocage via `SKILLS.chasse`
  - [ ] Effets : gros dégât mono-cible, dégât de zone, buff ; capacité du chef kobold
- [ ] **J6 — (optionnel) Passage en ATB**
  - [ ] Jauges ATB, pause sur menu, tri dynamique — *seulement si on veut s'éloigner du tour-par-tour strict*
- [ ] **J7 — Polish**
  - [ ] Transition d'entrée (zoom/flash), animations d'attaque (avance/recul),
        sons éventuels, équilibrage

> Le jeu reste lançable et cohérent à la fin de **chaque** jalon.

---

## 14. Cas limites à prévoir

- Combat déclenché **au bord de l'eau / dans les arbres** → placement de secours
  (tuile libre la plus proche), sinon recentrer l'anchor.
- Joueur **surchargé** (vitesse réduite) → impact sur `spd`/fuite.
- Mort d'un ennemi **pendant l'intro** ou via DoT → recalcul de l'ordre.
- Ouverture de l'inventaire / pose de feu (`F`) **interdite** en combat.
- Nuit / météo / esprits continuent de tourner visuellement (rendu monde) sans
  perturber la logique de combat.
- Respawn de kobolds (`world` loop) à **suspendre** pendant un combat actif.
- Sauvegarde de la position « monde » du joueur pour la restaurer après le combat
  (sa `pos` de combat ≠ sa position d'exploration).

---

## 15. Récapitulatif des nouveautés de code

**Nouveau fichier** : [js/combat.js](js/combat.js)
**Modifs** :
- [la-plaine.html](la-plaine.html) : `<script src="js/combat.js">` avant game.js
- [js/game.js](js/game.js) : `gameMode`, `updateExplore`/`renderWorld`, aiguillage,
  lecture de `pos` de combat dans le rendu des entités, verrou caméra
- [js/config.js](js/config.js) : constantes (`TRIGGER_RADIUS`, vitesses ATB, etc.)
- [js/input.js](js/input.js) : en combat, les touches pilotent le menu (pas le déplacement)

**Inchangé / réutilisé** : stats, inventaire, XP, drops, floats/burst, sprites,
toScreen/isBlocked, esprits.
