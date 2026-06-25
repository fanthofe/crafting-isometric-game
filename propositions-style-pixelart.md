# Propositions de Style : Pixel Art 2.5D Isométrique

Ce document présente trois propositions de thèmes CSS pour transformer l'interface de **Kaimana** en une expérience Pixel Art 2.5D cohérente avec la perspective isométrique du jeu.

## Principes du style 2.5D Pixel Art
Pour obtenir un effet de profondeur (2.5D) en pixel art via CSS, nous utilisons :
1.  **Bordures doubles ou triples** : Simulent l'épaisseur d'un panneau (une bordure claire en haut/gauche, une sombre en bas/droite).
2.  **Ombres portées "Pixel-Perfect"** : Utilisation de `box-shadow` sans flou pour garder des bords nets.
3.  **Textures procédurales** : Utilisation de dégradés linéaires pour simuler des reflets ou du grain.

---

## Proposition 1 : Héritage Artisanal
*Un style chaleureux rappelant le bois sculpté et le parchemin, idéal pour un jeu de survie et de craft.*

```css
:root {
  --p1-wood-light: #d2a763;
  --p1-wood-mid: #8a6240;
  --p1-wood-dark: #4a3e28;
  --p1-paper: #fdf6e3;
  --p1-accent: #e8743f;
}

/* Panel Principal (Inventaire) */
#inv {
  background: var(--p1-paper);
  border: 4px solid var(--p1-wood-dark);
  box-shadow:
    inset -4px -4px 0px var(--p1-wood-mid),
    4px 4px 0px rgba(0,0,0,0.3);
  border-radius: 0; /* Pixel art = angles droits ou biseautés */
}

/* Emplacements (Slots) */
.islot, .slot {
  background: #eee0c0;
  border: 2px solid var(--p1-wood-mid);
  box-shadow: inset 2px 2px 0px var(--p1-wood-dark);
}

.islot.filled {
  background: var(--p1-wood-light);
}

/* Boutons */
button {
  background: var(--p1-wood-mid);
  color: white;
  border: none;
  box-shadow:
    inset -2px -2px 0px var(--p1-wood-dark),
    inset 2px 2px 0px var(--p1-wood-light);
  font-family: "Courier New", monospace;
  image-rendering: pixelated;
}
```

---

## Proposition 2 : Nuit Lunaire
*Un style sombre et mystique avec des accents néons, parfait pour l'ambiance des Kobolds et de la magie nocturne.*

```css
:root {
  --p2-void: #0e0c12;
  --p2-obsidian: #1a1625;
  --p2-moon-glow: #7080b0;
  --p2-magic-cyan: #4fe1ff;
  --p2-magic-purple: #8e5bc8;
}

#inv {
  background: var(--p2-obsidian);
  border: 2px solid var(--p2-moon-glow);
  box-shadow:
    0 0 0 2px var(--p2-void),
    0 0 15px rgba(142, 91, 200, 0.4);
  color: #dde8ff;
}

.islot {
  background: var(--p2-void);
  border: 1px solid #3a304a;
  box-shadow: inset 0 0 8px rgba(79, 225, 255, 0.1);
}

.islot:hover {
  border-color: var(--p2-magic-cyan);
  background: #251e33;
}

#invHeader {
  background: var(--p2-void);
  border-bottom: 2px solid var(--p2-magic-purple);
}
```

---

## Proposition 3 : Vigueur de l'Aube
*Un mélange organique de pierre taillée et de mousse verte, renforçant le lien avec la nature et l'Esprit Ao.*

```css
:root {
  --p3-stone-light: #9aa2a6;
  --p3-stone-dark: #4e565b;
  --p3-moss: #4ea75d;
  --p3-leaf: #83c96b;
  --p3-earth: #2b3a2e;
}

#inv {
  background: #c4cacd;
  border: 4px solid var(--p3-stone-dark);
  position: relative;
}

/* Effet de biseau 2.5D sur le panel */
#inv::before {
  content: "";
  position: absolute;
  inset: 0;
  border: 4px solid white;
  border-right-color: var(--p3-stone-light);
  border-bottom-color: var(--p3-stone-light);
  pointer-events: none;
}

.itab.active {
  background: var(--p3-moss);
  color: white;
  border: 2px solid var(--p3-earth);
  box-shadow: inset -2px -2px 0px rgba(0,0,0,0.2);
}

.islot.filled {
  background: #d9e0e3;
  border: 2px solid var(--p3-stone-dark);
}
```

---

## Comment appliquer ces styles ?

1.  **Choisissez un thème** ci-dessus.
2.  **Copiez les variables CSS** (`:root`) dans votre fichier `css/base.css`.
3.  **Remplacez les règles** correspondantes dans `css/inventory.css` ou `css/hud.css`.
4.  **Assurez-vous** que la propriété `image-rendering: pixelated;` est bien appliquée sur tous vos canvas et icônes pour éviter le flou lors du redimensionnement.

### Astuce pour l'Isométrie
Pour que l'UI semble "posée" dans le monde isométrique, vous pouvez appliquer une légère déformation de perspective sur certains éléments décoratifs (comme les étiquettes de section) :
```css
.seclabel {
  transform: skewY(-5deg); /* Aligne légèrement sur l'axe isométrique */
}
```
