# crafting-isometric-game

**La Plaine** — un petit jeu isométrique (survie / récolte / artisanat) en JavaScript pur, sans aucun framework.

## Lancer le jeu

```bash
xdg-open index.html
```

Ou double-clic sur [`la-plaine.html`](la-plaine.html). Aucune dépendance, aucun build.

## Contrôles

- **Flèches / ZQSD** : se déplacer
- **E** ou **Espace** : couper / cueillir / chasser
- **I** : inventaire
- **F** : poser un feu de camp
- Tactile : d-pad + boutons d'action

## Architecture

Le code est séparé en HTML / CSS / JS. Les scripts sont des modules classiques
chargés dans l'ordre de leurs dépendances (ils partagent la portée globale).

```
la-plaine.html      Structure HTML + ordre de chargement des scripts
css/
  style.css         Tous les styles (HUD, inventaire, contrôles tactiles…)
js/
  config.js         Réglages globaux, canvas, mise à l'échelle, aléatoire déterministe
  world.js          Génération procédurale de l'île (sols, eau, plages, lacs, décor)
  items.js          Données des objets, compétences et expérience
  inventory.js      Slots, poids, ajout/retrait, recettes et fabrication
  ui.js             Interface DOM (grille, équipement, compétences, infobulles, HUD)
  sprites.js        Pré-rendu des graphismes (tuiles, décor, icônes, cœurs, animaux)
  kobolds.js        Sprites et types des ennemis kobolds
  hero.js           Dessin du personnage joueur
  effects.js        Papillons, particules, textes flottants, météo, jour/nuit
  spirits.js        Esprits de la Nature (lueurs, apparition, dialogues)
  input.js          Entrées clavier et contrôles tactiles
  world-logic.js    Logique du monde (joueur, animaux, combat, interactions)
  game.js           Boucle de jeu (mise à jour, rendu, amorçage)
```

Voir aussi [`level-design.md`](level-design.md) pour la conception du niveau.
