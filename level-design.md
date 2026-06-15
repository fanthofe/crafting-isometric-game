# La Plaine — Document de Level Design & Évolution

## Vision générale

Le jeu passe d'une île de survie libre à une île **vivante et narrative**, habitée par deux esprits de la nature antagonistes et par une menace kobold qui ronge l'équilibre du monde. Le héros devient le médiateur entre ces forces, armé de ses outils de craft et de ses compétences.

---

## Les deux Esprits de la Nature

### Esprit de la Forêt — *Ao* (feu follet vert)

Ao est l'esprit des choses qui poussent, des cycles naturels et de la connaissance artisanale. Il est bienveillant, curieux, parfois impatient.

**Apparence :**
- Feu follet vert émeraude avec un halo pulsant (nuance `#39d353` → `#a8ffb8`)
- Orbite lentement autour du joueur à ~1.5 tiles de distance quand il est « invoqué »
- Laisse une traîne de particules vertes animées
- La nuit il brille davantage ; pendant la pluie ses couleurs virent au bleu-vert

**Comportement :**
- Apparaît au camp de départ dès le début, guide le premier craft (planche → feu de camp)
- Suit le joueur à distance modérée sur la carte
- Se rapproche en vibrant quand le joueur entre dans un biome ou s'approche d'une ressource spéciale
- Monologue textuel court dans une bulle (style RPG) : courtes phrases en blanc sur fond vert sombre

**Informations qu'il donne :**
- « Cette essence de bouleau ne demande que deux coups — mais le chêne t'écrasera les bras si tu n'as pas ta hache. »
- « Les arbres fruitiers poussent en cercle autour des pierres sacrées. Cueille-les tous avant la nuit. »
- « L'eau douce là-bas cache des roseaux. Les roseaux font de bons carquois. »
- Se tait si le joueur est en combat (ne distrait pas)
- Donne des recettes contextuelles quand le joueur a les matériaux manquants

---

### Esprit du Sang — *Raka* (feu follet rouge)

Raka est l'esprit des conflits, de la chasse profonde et des territoires perdus. Il n'est pas mauvais — il est honnête sur le danger.

**Apparence :**
- Feu follet rouge brique avec pulsations rapides (`#c0473f` → `#ff9070`)
- Se déplace par à-coups nerveux, jamais vraiment posé
- Halo de particules en forme d'éclats plutôt que de traîne douce
- La nuit : prend une teinte rouge sang plus saturée, halo plus large

**Comportement :**
- Apparaît seulement une fois que le joueur a tué son premier animal ou reçu sa première blessure
- Ne suit pas le joueur — il apparaît à distance, pointe une direction, attend
- Si le joueur l'approche à ~3 tiles il parle, puis repart
- S'intensifie en rouge vif quand des kobolds sont proches (radar de danger passif)
- Se cache/s'éteint si le joueur est K.O. et respawn au camp

**Informations qu'il donne :**
- « Le campement kobold est au nord-est. Ils ont volé des fruits sacrés. »
- « Ne t'approche pas de la zone rouge sans armure — le chef kobold est plus rapide que le cerf. »
- « Trois kobolds patrouillent ce sentier la nuit. Attends l'aube ou passe par les roseaux. »
- « Ta lance est bien, mais ils ont des boucliers. Craft des flèches si tu veux les surprendre. »
- Donne des infos sur les camps, les patterns de patrouille, les drops rares des kobolds

---

### Interaction entre les deux esprits

Quand Ao et Raka sont tous les deux proches du joueur simultanément (rare, événement), ils se disputent en dialogues :

> **Ao :** « Il doit replanter ce qu'il coupe. »
> **Raka :** « Il doit survivre d'abord. »

Ces échanges révèlent un lore plus profond sur l'île et son histoire.

---

## Les Kobolds — *les Fils de la Lune Brisée*

Les kobolds sont des créatures mi-loups mi-humanoïdes qui ont été corrompus par un vieux fragment de magie lunaire enfoui sous l'île. Ils forment des clans, construisent des camps rudimentaires et pillent systématiquement les ressources naturelles.

### Apparence (pixel-art, vue isométrique)

Corps de ~14×16 pixels, plus grand que les animaux actuels :
- Fourrure grise foncée / marron avec reflets argentés (lune)
- Debout sur deux pattes légèrement courbées (posture de loup-garou)
- Museau court, oreilles dressées en pointe, yeux jaunes lumineux
- Griffes visibles au bout des bras
- Certains portent des guenilles ou de petites armures de fortune (cuir volé, os)

**3 variants visuels :**

| Type | Silhouette | Détail |
|------|------------|--------|
| Éclaireur | Mince, rapide | Fourrure grise, pas d'armure |
| Guerrier | Plus trapu | Épaule en os, cicatrice à l'œil |
| Chef de meute | Large, imposant | Manteau de peau noire, yeux rouges |

---

### Stats & IA

| Type | HP | Vitesse | Dégâts | Portée détection | Drop |
|------|-----|---------|--------|-----------------|------|
| Éclaireur | 3 | 3.8 | 1 | 5 tiles | Os, cuir, parfois une plume noire |
| Guerrier | 6 | 2.5 | 2 | 4 tiles | Cuir × 2, parfois une griffe |
| Chef | 12 | 2.8 | 3 | 6 tiles | Griffe de chef (craft rare), cuir × 3 |

**Comportements IA :**
- **Éclaireur** : patrouille un sentier aléatoire, fuit si HP < 2, revient au camp
- **Guerrier** : charge directement, pas de fuite, attaque en priorité si le joueur a déjà tué un kobold dans la session
- **Chef** : donne l'alerte aux kobolds proches (rayon 4 tiles), attaque en dernier si les sbires sont encore vivants, utilise des esquives latérales
- **Comportement de meute** : si 2+ kobolds voient le joueur, ils essaient de l'encercler (un attaque de face, l'autre contourne)

---

### Drops & Nouveaux Matériaux

| Matériau | Source | Utilisation craft |
|----------|--------|-------------------|
| Os | Éclaireur | Pointe de flèche, talisman d'os |
| Griffe de kobold | Guerrier / Chef | Dague de griffes, amulette |
| Fourrure lunaire | Chef uniquement | Cape de lune (armure spéciale) |
| Plume noire | Rare, éclaireur | Encre, talisman de nuit |

---

## Level Design de l'Île — Zones et Biomes

L'île est redécoupée en zones distinctes avec des identités fortes. Le joueur part du centre-sud et explore vers les zones plus dangereuses.

```
         [Zone Glaciale - Nord]
              ❄ kobolds chefs
          [Forêt Dense - Nord-Est]
              🌲 kobolds guerriers
    [Marécage]   [Camp principal kobold]
    🌿 roseaux   ⚔ camp fortifié
          [La Plaine - Centre]
              🏕 Camp de départ
    [Plage Ouest]   [Vergers - Est]
    🐚 coquillages  🍎 arbres fruitiers
         [Pointe Sud - Ruines]
              🏚 structures effondrées
```

### Zone 0 — Camp de départ (centre)
- Zone safe, aucun kobold
- Ao apparaît ici en premier
- Feu de camp permanent pré-placé
- Ressources de base : quelques arbres, 2 rochers

### Zone 1 — La Plaine (autour du camp, rayon ~15 tiles)
- Terrain actuel, animaux non-agressifs
- Kobolds absents le jour, 1-2 éclaireurs la nuit
- Raka apparaît ici pour la première fois

### Zone 2 — Les Vergers de l'Est
- Dense en arbres fruitiers (x2 par rapport à maintenant)
- Des kobolds « pillent » les fruits : on les trouve près des arbres, ce qui crée un dilemme (cueillir = attirer l'attention)
- Ao parle des cycles de repousse perturbés

### Zone 3 — Le Marécage (ouest)
- Sol boueux = vitesse réduite de 30% (y compris les kobolds)
- Roseaux récoltables → carquois, filtre à eau (nouvelle ressource)
- Ambiance : brume permanente, grenouilles, lucioles vertes permanentes
- 2-3 kobolds guerriers qui patrouillent lentement

### Zone 4 — Forêt Dense (nord-est)
- Arbres très serrés : visibilité réduite, caméra zoomée
- Kobolds guerriers en patrouille à 2
- Butin rare : fourrure lunaire sur les guerriers de nuit
- Raka refuse d'y entrer, attend à l'orée

### Zone 5 — Camp Kobold Principal (nord)
- Structure visible de loin (fumée, torches rouges)
- 4-6 kobolds dont 1 chef
- Récompense : coffre de butin (griffe de chef + fourrure lunaire garantie)
- Détruire le camp = les kobolds disparaissent de la zone 3 et 4 pendant un cycle de jour (20 minutes)
- Le camp se reconstruit progressivement

### Zone 6 — Ruines du Sud
- Structures en pierre effondrées (nouveau décor)
- Aucun kobold mais animaux plus rares et plus dangereux (nouveau : ours ?)
- Lore : les ruines sont l'ancien sanctuaire des esprits Ao et Raka
- Craft spécial possible uniquement ici : Autel de pierre → objets liés aux esprits

---

## Nouvelles Recettes de Craft

### Avec les nouveaux matériaux

| Recette | Ingrédients | Résultat | Effet |
|---------|-------------|---------|-------|
| Flèche | Bois × 1 + Os × 1 + Plume × 1 | Flèche × 3 | Attaque à distance (nouvelle mécanique) |
| Dague de griffes | Griffe × 2 + Planche × 1 | Dague | +2 dmg, attaque rapide |
| Cape de lune | Fourrure lunaire × 3 + Cuir × 2 | Cape | +3 def + invisibilité partielle la nuit |
| Talisman d'os | Os × 3 + Plume noire × 1 | Talisman | Réduit portée de détection des kobolds |
| Amulette de forêt | Griffe × 1 + Feuille sacrée × 2 | Amulette | Ao donne 2× plus d'indices |
| Torche | Bois × 1 + Cuir × 1 | Torche × 3 | Éclaire la nuit, repousse kobolds |
| Arc | Planche × 2 + Cuir × 1 | Arc | Nécessite Flèches pour tirer |
| Piège à loup | Planche × 3 + Pierre × 2 | Piège | Immobilise un kobold 8s |

### Craft à l'Autel des Ruines (rare)

| Recette | Ingrédients | Résultat | Effet |
|---------|-------------|---------|-------|
| Cristal d'Ao | Feuilles sacrées × 5 + Pierre × 3 | Cristal vert | Invoque Ao même dans les zones dangereuses |
| Cristal de Raka | Griffe de chef × 1 + Plume noire × 3 | Cristal rouge | Raka révèle tous les kobolds sur la carte 60s |
| Médaillon des Deux | Cristal Ao + Cristal Raka + Or × 1 | Médaillon | Puissance ultime — les esprits parlent en duo |

---

## Progression Narrative

### Acte 1 — L'Arrivée (actuel)
- Le héros explore, craft, chasse
- Ao apparaît, guide le craft de base
- Premières blessures → Raka apparaît

### Acte 2 — La Menace
- Les kobolds éclaireurs commencent à se montrer la nuit
- Raka indique le camp principal, avertit du chef
- Ao constate que les arbres fruitiers de l'est sont pillés
- Objectif implicite : sécuriser les Vergers

### Acte 3 — La Confrontation
- Le joueur attaque le camp kobold
- Le chef kobold est un mini-boss (12 HP, esquives, appelle des renforts)
- Raka vibre fortement, donne des conseils tactiques en temps réel

### Acte 4 — Les Ruines
- Après la défaite du chef, Ao révèle les Ruines du Sud
- Les deux esprits se retrouvent dans les ruines — dialogue long, lore de l'île
- Le joueur craft le Médaillon des Deux → fin du cycle, l'île se régénère (arbres repoussent plus vite, kobolds diminuent)

---

## Nouvelles Mécaniques à Implémenter

### Priorité 1 — Fondations narratives
- [ ] Système de dialogue bulle pour Ao et Raka (file de messages avec délai)
- [ ] Feu follet rouge (Raka) avec comportement de radar
- [ ] Feu follet vert (Ao) avec comportement de guide
- [ ] Kobolds éclaireurs (IA de patrouille basique)

### Priorité 2 — Contenu
- [ ] Kobolds guerriers + chef
- [ ] Camp kobold sur la carte (4-6 kobolds + structure)
- [ ] Matériaux kobold (os, griffe, fourrure lunaire)
- [ ] Recettes associées (dague, cape, talisman)
- [ ] Zone marécage (sol lent, roseaux)

### Priorité 3 — Profondeur
- [ ] Système de flèches + arc (attaque à distance)
- [ ] Pièges à loup posables
- [ ] Autel des ruines
- [ ] Lore dialogues Ao/Raka
- [ ] Zones distinctes avec densité de kobolds progressive

---

## Notes de Style & Cohérence

- **Les kobolds parlent** : quand ils voient le joueur, un texte flottant court en rouge sombre (grognement stylisé : « *hrrrk* » ou « *là ! là !* »)
- **Ao et Raka ne se battent jamais** : ils sont des observateurs, jamais des combattants
- **Tone global** : survie poétique, pas d'interface de quête formelle — les informations passent uniquement par les dialogues des esprits
- **Palette kobold** : grises/argentées, contrastent avec les verts/bruns de la nature et les rouges/oranges du combat
- **Audio imaginé** (si sons ajoutés plus tard) : Ao = carillon léger, Raka = crépitement sourd
