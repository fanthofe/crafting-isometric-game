# Recettes JS — Référence complète
*À copier dans `js/inventory.js` — tableau `RECIPES`.*
*Voir [GDD.md](GDD.md) pour le contexte · fichiers thématiques pour les détails.*

---

```javascript
const RECIPES = [

  // ═══════════════════════════════════════════════
  // RESSOURCES DE BASE
  // ═══════════════════════════════════════════════
  {id:"planche",            cost:{bois:2},                                      gives:{planche:1}},
  {id:"bois_dur",           cost:{bois:3},                                      gives:{bois_dur:1},           requires:"etabli"},
  {id:"voile",              cost:{fibre_coco:4, bois:2},                        gives:{voile:1},              requires:"etabli"},
  {id:"rame",               cost:{bois:2, cuir:1},                              gives:{rame:1}},

  // ═══════════════════════════════════════════════
  // CARQUOIS
  // ═══════════════════════════════════════════════
  {id:"carquois_cuir",      cost:{cuir:3, bois:1},                              gives:{carquois_cuir:1},      slot:"carquois"},
  {id:"carquois_os",        cost:{os:3, cuir:2},                                gives:{carquois_os:1},        slot:"carquois"},

  // ═══════════════════════════════════════════════
  // OUTILS — Bûcheronnage
  // ═══════════════════════════════════════════════
  {id:"hache_pierre",       cost:{bois:3, pierre:2},                            gives:{hache_pierre:1},       slot:"bucheron"},
  {id:"hache_obsidienne",   cost:{bois:2, obsidienne:2},                        gives:{hache_obsidienne:1},   slot:"bucheron"},
  {id:"hache_jade",         cost:{bois:1, jade:2},                              gives:{hache_jade:1},         slot:"bucheron"},

  // ═══════════════════════════════════════════════
  // OUTILS — Cueillette
  // ═══════════════════════════════════════════════
  {id:"panier",             cost:{bois:2, cuir:1},                              gives:{panier:1},             slot:"cueillette"},
  {id:"serpe_pierre",       cost:{bois:1, pierre:2},                            gives:{serpe_pierre:1},       slot:"cueillette"},
  {id:"serpe_obsidienne",   cost:{bois:1, obsidienne:2},                        gives:{serpe_obsidienne:1},   slot:"cueillette"},

  // ═══════════════════════════════════════════════
  // OUTILS — Minage
  // ═══════════════════════════════════════════════
  {id:"pioche_pierre",      cost:{bois:2, pierre:3},                            gives:{pioche_pierre:1},      slot:"minage"},
  {id:"pioche_basalte",     cost:{bois:2, basalte:3},                           gives:{pioche_basalte:1},     slot:"minage"},
  {id:"pioche_obsidienne",  cost:{bois:1, obsidienne:3},                        gives:{pioche_obsidienne:1},  slot:"minage"},

  // ═══════════════════════════════════════════════
  // ARMURES
  // ═══════════════════════════════════════════════
  {id:"chapeau",            cost:{plume:4, cuir:1},                             gives:{chapeau:1},            slot:"tete"},
  {id:"casque_poisson",     cost:{fibre_coco:2, os:2},                          gives:{casque_poisson:1},     slot:"tete"},
  {id:"cape_plumes",        cost:{plume:8, cuir:2},                             gives:{cape_plumes:1},        slot:"tete"},
  {id:"tunique",            cost:{cuir:4},                                       gives:{tunique:1},            slot:"torse"},
  {id:"armure_fibre_coco",  cost:{fibre_coco:6, os:2},                          gives:{armure_fibre_coco:1},  slot:"torse"},
  {id:"bottes",             cost:{cuir:2},                                       gives:{bottes:1},             slot:"pieds"},
  {id:"jupe_fibre",         cost:{fibre_coco:3, cuir:1},                        gives:{jupe_fibre:1},         slot:"pieds"},

  // ═══════════════════════════════════════════════
  // ARMES — Tier 1 (aucun prérequis)
  // ═══════════════════════════════════════════════
  {id:"massue_bois",        cost:{bois:4},                                      gives:{massue_bois:1}},
  {id:"sagaie",             cost:{bois:2, pierre:1, plume:1},                   gives:{sagaie:1}},
  {id:"fronde",             cost:{cuir:2, bois:1},                              gives:{fronde:1}},
  {id:"pieu_affute",        cost:{bois:2, pierre:1},                            gives:{pieu_affute:1}},

  // ═══════════════════════════════════════════════
  // ARMES — Tier 2 (établi)
  // ═══════════════════════════════════════════════
  {id:"patu_pierre",        cost:{pierre:3, cuir:1},                            gives:{patu_pierre:1},        requires:"etabli"},
  {id:"patu_os",            cost:{os:3, cuir:1},                                gives:{patu_os:1},            requires:"etabli"},
  {id:"casse_tete_bec",     cost:{bois:2, pierre:2},                            gives:{casse_tete_bec:1},     requires:"etabli"},
  {id:"casse_tete_champ",   cost:{bois:1, pierre:3},                            gives:{casse_tete_champ:1},   requires:"etabli"},
  {id:"ula",                cost:{bois:3, pierre:1},                            gives:{ula:1},                requires:"etabli"},
  {id:"pahoa",              cost:{pierre:2, cuir:1},                            gives:{pahoa:1},              requires:"etabli"},
  {id:"ihe",                cost:{bois:2, pierre:1, cuir:1},                    gives:{ihe:1},                requires:"etabli"},
  {id:"arc",                cost:{bois:3, cuir:2},                              gives:{arc:1},                requires:"etabli"},
  {id:"fleche",             cost:{bois:1, pierre:1, plume:2},                   gives:{fleche:5}},

  // ═══════════════════════════════════════════════
  // ARMES — Tier 3 (établi + bois_dur)
  // ═══════════════════════════════════════════════
  {id:"taiaha",             cost:{bois_dur:3, pierre:2, plume:2},               gives:{taiaha:1},             requires:"etabli"},
  {id:"tewhatewha",         cost:{bois_dur:2, pierre:2, plume:3},               gives:{tewhatewha:1},         requires:"etabli"},
  {id:"u_u",                cost:{bois_dur:3, os:2, plume_noire:1},             gives:{u_u:1},                requires:"etabli"},
  {id:"akau_tau",           cost:{bois_dur:2, basalte:2},                       gives:{akau_tau:1},           requires:"etabli"},
  {id:"totokia",            cost:{basalte:3, bois:1},                           gives:{totokia:1},            requires:"etabli"},
  {id:"lame_obsidienne",    cost:{obsidienne:3, bois:1},                        gives:{lame_obsidienne:1},    requires:"etabli"},
  {id:"fleche_obsidienne",  cost:{bois:1, obsidienne:1, plume:1},               gives:{fleche_obsidienne:5},  requires:"etabli"},

  // ═══════════════════════════════════════════════
  // ARMES — Tier 4 (dents de requin)
  // ═══════════════════════════════════════════════
  {id:"leiomano",           cost:{bois:2, dent_requin:4, fibre_coco:1},         gives:{leiomano:1},           requires:"etabli"},
  {id:"epee_requin",        cost:{planche:2, dent_requin:6, fibre_coco:2},      gives:{epee_requin:1},        requires:"etabli"},
  {id:"dague_requin",       cost:{planche:1, dent_requin:3, cuir:1},            gives:{dague_requin:1},       requires:"etabli"},
  {id:"lance_requin",       cost:{bois:2, dent_requin:3, fibre_coco:1},         gives:{lance_requin:1},       requires:"etabli"},

  // ═══════════════════════════════════════════════
  // ARMES — Tier 5 (atelier de taille)
  // ═══════════════════════════════════════════════
  {id:"mere_serpentine",    cost:{serpentine:2, os:1},                          gives:{mere_serpentine:1},    requires:"atelier_taille"},
  {id:"totokia_basalte",    cost:{basalte:3, cuir:1},                           gives:{totokia_basalte:1},    requires:"atelier_taille"},
  {id:"patu_jade",          cost:{jade:2, cuir:1},                              gives:{patu_jade:1},          requires:"atelier_taille"},
  {id:"hache_ostensoir",    cost:{jade:1, serpentine:1, bois:1},                gives:{hache_ostensoir:1},    requires:"atelier_taille"},
  {id:"totokia_jade",       cost:{jade:1, basalte:2},                           gives:{totokia_jade:1},       requires:"atelier_taille"},

  // ═══════════════════════════════════════════════
  // ARMES — Tier 6 (endgame lunaire)
  // ═══════════════════════════════════════════════
  {id:"taiaha_lunaire",     cost:{fourrure_lunaire:1, bois_dur:2, jade:1},                  gives:{taiaha_lunaire:1}},
  {id:"leiomano_lunaire",   cost:{fourrure_lunaire:1, dent_requin:5, cristal_lunaire:1},    gives:{leiomano_lunaire:1}},
  {id:"u_u_lunaire",        cost:{fourrure_lunaire:2, bois_dur:2, cristal_lunaire:1},       gives:{u_u_lunaire:1}},
  {id:"arc_lunaire",        cost:{fourrure_lunaire:1, bois:2, cristal_lunaire:1},           gives:{arc_lunaire:1}},
  {id:"fleche_noire",       cost:{plume_noire:1, bois:1, pierre:1},                        gives:{fleche_noire:3}},

  // ═══════════════════════════════════════════════
  // NAVIGATION — Bateaux
  // ═══════════════════════════════════════════════
  {id:"radeau",             cost:{bois:8, planche:4, fibre_coco:3},                         gives:{radeau:1},           type:"bateau"},
  {id:"pirogue",            cost:{bois_dur:5, planche:3, cuir:1, rame:1},                   gives:{pirogue:1},          type:"bateau",  requires:"etabli"},
  {id:"vaa_balancier",      cost:{bois_dur:8, planche:5, fibre_coco:6, bois:4, rame:1},     gives:{vaa_balancier:1},    type:"bateau",  requires:"embarcadere"},
  {id:"proa",               cost:{bois_dur:10, planche:6, fibre_coco:8, voile:1, cuir:4},   gives:{proa:1},             type:"bateau",  requires:"embarcadere"},
  {id:"waka_taua",          cost:{bois_dur:15, planche:10, fibre_coco:6, jade:1, os:4, plume:6}, gives:{waka_taua:1},   type:"bateau",  requires:"embarcadere"},

  // ═══════════════════════════════════════════════
  // CONSTRUCTIONS — Barrières
  // ═══════════════════════════════════════════════
  {id:"cloture_bois",       cost:{bois:2},                                      gives:{cloture_bois:1},       type:"construction"},
  {id:"palissade",          cost:{planche:3, bois:1},                           gives:{palissade:1},          type:"construction"},
  {id:"mur_basalte",        cost:{basalte:5},                                   gives:{mur_basalte:1},        type:"construction"},
  {id:"portail_bois",       cost:{planche:4, cuir:1},                           gives:{portail_bois:1},       type:"construction"},
  {id:"pieu_piege",         cost:{bois:3, pierre:1},                            gives:{pieu_piege:1},         type:"construction"},
  {id:"filet_chasse",       cost:{fibre_coco:3, bois:1},                        gives:{filet_chasse:1},       type:"construction"},

  // ═══════════════════════════════════════════════
  // CONSTRUCTIONS — Ateliers & Embarcadère
  // ═══════════════════════════════════════════════
  {id:"etabli",             cost:{bois:8, pierre:3},                            gives:{etabli:1},             type:"construction"},
  {id:"atelier_taille",     cost:{basalte:8, pierre:6, charbon:2},              gives:{atelier_taille:1},     type:"construction"},
  {id:"atelier_alchimie",   cost:{bois:6, pierre:4, griffe:2},                  gives:{atelier_alchimie:1},   type:"construction"},
  {id:"marmite",            cost:{pierre:6, os:2},                              gives:{marmite:1},            type:"construction", requires:"feu"},
  {id:"embarcadere",        cost:{planche:10, bois:8, pierre:4},                gives:{embarcadere:1},        type:"construction"},

  // ═══════════════════════════════════════════════
  // CUISINE — Marmite sur feu
  // ═══════════════════════════════════════════════
  {id:"brochette",          cost:{viande:1, bois:1},                            gives:{brochette:1}},
  {id:"salade",             cost:{pomme:1, prune:1, cerise:1},                  gives:{salade:1}},
  {id:"ragout",             cost:{viande:2, bois:1},                            gives:{ragout:1},             requires:"marmite"},
  {id:"bouillon_fruits",    cost:{pomme:1, poire:1, orange:1},                  gives:{bouillon_fruits:1},    requires:"marmite"},
  {id:"soupe_os",           cost:{os:2, viande:1},                              gives:{soupe_os:1},           requires:"marmite"},
  {id:"festin_chasseur",    cost:{viande:3, cuir:1},                            gives:{festin_chasseur:1},    requires:"marmite"},
  {id:"confit_sanglier",    cost:{viande:3, graisse:1},                         gives:{confit_sanglier:1},    requires:"marmite"},
  {id:"noix_rotie",         cost:{noix_coco:2, charbon:1},                      gives:{noix_rotie:1},         requires:"marmite"},
  {id:"poisson_grille",     cost:{poisson:2, charbon:1},                        gives:{poisson_grille:1},     requires:"marmite"},
  {id:"soupe_requin",       cost:{viande_requin:1, noix_coco:1},                gives:{soupe_requin:1},       requires:"marmite"},
  {id:"elixir_fruit",       cost:{peche:2, cerise:2, prune:1},                  gives:{elixir_fruit:1},       requires:"marmite"},

  // ═══════════════════════════════════════════════
  // POTIONS — Atelier d'alchimie
  // ═══════════════════════════════════════════════
  {id:"potion_soin",        cost:{os:1, plume:2, pomme:1},                      gives:{potion_soin:1},        requires:"atelier_alchimie"},
  {id:"potion_vigueur",     cost:{fourrure_lunaire:1, plume_noire:1},           gives:{potion_vigueur:1},     requires:"atelier_alchimie"},
  {id:"potion_force",       cost:{os:2, cuir:1, orange:1},                      gives:{potion_force:1},       requires:"atelier_alchimie"},
  {id:"potion_rapidite",    cost:{griffe:1, plume:3, cerise:2},                 gives:{potion_rapidite:1},    requires:"atelier_alchimie"},
  {id:"potion_antivenin",   cost:{griffe:1, cerise:2, prune:1},                 gives:{potion_antivenin:1},   requires:"atelier_alchimie"},
  {id:"potion_nuit",        cost:{plume_noire:2, cristal_lunaire:1},            gives:{potion_nuit:1},        requires:"atelier_alchimie"},
  {id:"bombe_fumee",        cost:{charbon:2, cuir:1},                           gives:{bombe_fumee:1},        requires:"atelier_alchimie"},
  {id:"bombe_feu",          cost:{charbon:3, fourrure_lunaire:1},               gives:{bombe_feu:1},          requires:"atelier_alchimie"},

];
```

---

## Bilan recettes

| Catégorie | Nombre |
|-----------|--------|
| Ressources de base | 4 |
| Carquois | 2 |
| Outils de récolte | 9 |
| Armures | 7 |
| Armes Tier 1 | 4 |
| Armes Tier 2 | 9 |
| Armes Tier 3 | 7 |
| Armes Tier 4 | 4 |
| Armes Tier 5 | 5 |
| Armes Tier 6 | 5 |
| Bateaux | 5 |
| Constructions (barrières) | 6 |
| Constructions (ateliers) | 5 |
| Cuisine | 11 |
| Potions | 8 |
| **Total** | **~91** |
