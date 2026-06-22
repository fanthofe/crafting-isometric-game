"use strict";
/* Recettes de fabrication et fonctions de craft. */

const RECIPES = [
  /* ── Tier 0 : sans atelier ── */
  {id:"planche",      label:"Planche",           cost:{bois:2},                      gives:{planche:1}},
  {id:"feu",          label:"Feu de camp",        cost:{planche:2, pierre:2},         gives:{feu:1}},
  {id:"salade",       label:"Salade de fruits",   cost:{pomme:1, prune:1, cerise:1},  gives:{salade:1}},
  {id:"brochette",    label:"Brochette",          cost:{viande:1, bois:1},            gives:{brochette:1}},
  {id:"torche",       label:"Torche",             cost:{bois:1, cuir:1},              gives:{torche:3}},
  {id:"massue_bois",  label:"Massue en bois",     cost:{bois:4},                      gives:{massue_bois:1}},
  {id:"sagaie",       label:"Sagaie",             cost:{bois:2, pierre:1, plume:1},   gives:{sagaie:1}},
  {id:"fronde",       label:"Fronde",             cost:{cuir:2, bois:1},              gives:{fronde:1}},
  {id:"fleche",       label:"Flèches (×5)",        cost:{bois:1, pierre:1, plume:2},   gives:{fleche:5}},
  {id:"rame",         label:"Rame",               cost:{bois:2, cuir:1},              gives:{rame:1}},
  {id:"radeau",       label:"Radeau",             cost:{bois:8, planche:4, fibre_coco:3}, gives:{radeau:1}},

  /* ── Tier 1 : matières spéciales ── */
  {id:"hache_pierre",   label:"Hache de pierre",    cost:{bois:3, pierre:2},           gives:{hache_pierre:1}},
  {id:"lance",          label:"Lance",              cost:{bois:2, pierre:1, plume:1},  gives:{lance:1}},
  {id:"chapeau",        label:"Chapeau de plumes",  cost:{plume:4, cuir:1},            gives:{chapeau:1}},
  {id:"tunique",        label:"Tunique de cuir",    cost:{cuir:4},                     gives:{tunique:1}},
  {id:"bottes",         label:"Bottes de cuir",     cost:{cuir:2},                     gives:{bottes:1}},
  {id:"dague",          label:"Dague de griffes",   cost:{griffe:2, planche:1},        gives:{dague:1}},
  {id:"pioche_pierre",  label:"Pioche de pierre",   cost:{bois:3, pierre:4},           gives:{pioche_pierre:1}},
  {id:"carquois_cuir",  label:"Carquois en cuir",   cost:{cuir:3, bois:1},             gives:{carquois_cuir:1}},
  {id:"panier",         label:"Panier",             cost:{fibre_coco:3, bois:1},       gives:{panier:1}},
  {id:"serpe_pierre",   label:"Serpe en pierre",    cost:{pierre:2, bois:1},           gives:{serpe_pierre:1}},
  {id:"cloture_bois",   label:"Clôture en bois",    cost:{bois:2},                     gives:{cloture_bois:1}},
  {id:"filet_chasse",   label:"Filet de fibres",    cost:{fibre_coco:3, bois:1},       gives:{filet_chasse:1}},
  {id:"pieu_piege",     label:"Piège à pieu",       cost:{bois:3, pierre:1},           gives:{pieu_piege:1}},
  {id:"marmite",        label:"Marmite",            cost:{pierre:6, os:2},             gives:{marmite:1}},
  {id:"etabli",         label:"Établi",             cost:{bois:8, pierre:3},           gives:{etabli:1}},
  {id:"atelier_alchimie",label:"Atelier d'alchimie",cost:{bois:6, pierre:4, griffe:2}, gives:{atelier_alchimie:1}},
  {id:"embarcadere",    label:"Embarcadère",        cost:{planche:10, bois:8, pierre:4},gives:{embarcadere:1}},

  /* ── Tier 2 : établi ── */
  {id:"bois_dur",        label:"Bois dur",              cost:{bois:3},                              gives:{bois_dur:1},            req:"etabli"},
  {id:"voile",           label:"Voile",                 cost:{fibre_coco:4, bois:2},                gives:{voile:1},               req:"etabli"},
  {id:"patu_pierre",     label:"Patu en pierre",        cost:{pierre:3, cuir:1},                    gives:{patu_pierre:1},         req:"etabli"},
  {id:"patu_os",         label:"Patu en os",            cost:{os:3, cuir:1},                        gives:{patu_os:1},             req:"etabli"},
  {id:"casse_tete_bec",  label:"Casse-tête bec",        cost:{bois:2, pierre:2},                    gives:{casse_tete_bec:1},      req:"etabli"},
  {id:"casse_tete_champ",label:"Casse-tête champignon", cost:{bois:1, pierre:3},                    gives:{casse_tete_champ:1},    req:"etabli"},
  {id:"ula",             label:"Ula",                   cost:{bois:3, pierre:1},                    gives:{ula:1},                 req:"etabli"},
  {id:"pahoa",           label:"Pāhoa",                 cost:{pierre:2, cuir:1},                    gives:{pahoa:1},               req:"etabli"},
  {id:"ihe",             label:"Ihe",                   cost:{bois:2, pierre:1, cuir:1},            gives:{ihe:1},                 req:"etabli"},
  {id:"arc",             label:"Arc",                   cost:{bois:3, cuir:2},                      gives:{arc:1},                 req:"etabli"},
  {id:"casque_poisson",  label:"Casque poisson-globe",  cost:{fibre_coco:2, os:2},                  gives:{casque_poisson:1},      req:"etabli"},
  {id:"cape_plumes",     label:"Cape de plumes",        cost:{plume:8, cuir:2},                     gives:{cape_plumes:1},         req:"etabli"},
  {id:"jupe_fibre",      label:"Jupe de combat",        cost:{fibre_coco:3, cuir:1},                gives:{jupe_fibre:1},          req:"etabli"},
  {id:"carquois_os",     label:"Carquois en os",        cost:{os:3, cuir:2},                        gives:{carquois_os:1},         req:"etabli"},
  {id:"serpe_obsidienne",label:"Serpe obsidienne",      cost:{obsidienne:2, bois:1},                gives:{serpe_obsidienne:1},    req:"etabli"},
  {id:"hache_obsidienne",label:"Hache obsidienne",      cost:{obsidienne:3, bois:2, cuir:1},        gives:{hache_obsidienne:1},    req:"etabli"},
  {id:"pioche_basalte",  label:"Pioche de basalte",     cost:{basalte:3, bois:2},                   gives:{pioche_basalte:1},      req:"etabli"},
  {id:"palissade",       label:"Palissade",             cost:{planche:3, bois:1},                   gives:{palissade:1},           req:"etabli"},
  {id:"portail_bois",    label:"Portail en bois",       cost:{planche:4, cuir:1},                   gives:{portail_bois:1},        req:"etabli"},
  {id:"pirogue",         label:"Pirogue",               cost:{bois_dur:5, planche:3, cuir:1, rame:1},gives:{pirogue:1},            req:"etabli"},

  /* ── Tier 3 : établi + bois_dur ── */
  {id:"taiaha",         label:"Taiaha",               cost:{bois_dur:3, pierre:2, plume:2},        gives:{taiaha:1},             req:"etabli"},
  {id:"tewhatewha",     label:"Tewhatewha",           cost:{bois_dur:2, pierre:2, plume:3},        gives:{tewhatewha:1},         req:"etabli"},
  {id:"u_u",            label:"U'u",                  cost:{bois_dur:3, os:2, plume_noire:1},      gives:{u_u:1},                req:"etabli"},
  {id:"akau_tau",       label:"Akau tau",             cost:{bois_dur:2, basalte:2},                gives:{akau_tau:1},           req:"etabli"},
  {id:"totokia",        label:"Totokia",              cost:{basalte:3, bois:1},                    gives:{totokia:1},            req:"etabli"},
  {id:"lame_obsidienne",label:"Lame d'obsidienne",    cost:{obsidienne:3, bois:1},                 gives:{lame_obsidienne:1},    req:"etabli"},
  {id:"fleche_obsidienne",label:"Flèches obsidienne (×5)",cost:{bois:1, obsidienne:1, plume:1},  gives:{fleche_obsidienne:5},  req:"etabli"},
  {id:"pioche_obsidienne",label:"Pioche obsidienne",  cost:{obsidienne:3, bois:2},                 gives:{pioche_obsidienne:1},  req:"etabli"},
  {id:"armure_fibre_coco",label:"Armure fibre tressée",cost:{fibre_coco:6, os:2},                  gives:{armure_fibre_coco:1},  req:"etabli"},
  {id:"vaa_balancier",  label:"Va'a à balancier",     cost:{bois_dur:8, planche:5, fibre_coco:6, bois:4, rame:1}, gives:{vaa_balancier:1}, req:"embarcadere"},

  /* ── Tier 4 : dents de requin ── */
  {id:"leiomano",    label:"Leiomano",       cost:{bois:2, dent_requin:4, fibre_coco:1},    gives:{leiomano:1},    req:"etabli"},
  {id:"epee_requin", label:"Épée à dents",   cost:{planche:2, dent_requin:6, fibre_coco:2}, gives:{epee_requin:1}, req:"etabli"},
  {id:"dague_requin",label:"Dague à dents",  cost:{planche:1, dent_requin:3, cuir:1},       gives:{dague_requin:1},req:"etabli"},
  {id:"lance_requin",label:"Lance à dents",  cost:{bois:2, dent_requin:3, fibre_coco:1},    gives:{lance_requin:1},req:"etabli"},

  /* ── Tier 5 : atelier de taille ── */
  {id:"atelier_taille",  label:"Atelier de taille",  cost:{basalte:8, pierre:6, charbon:2},  gives:{atelier_taille:1}},
  {id:"mur_basalte",     label:"Mur de basalte",     cost:{basalte:5},                       gives:{mur_basalte:1},     req:"atelier_taille"},
  {id:"mere_serpentine", label:"Mere serpentine",    cost:{serpentine:2, os:1},              gives:{mere_serpentine:1}, req:"atelier_taille"},
  {id:"totokia_basalte", label:"Totokia basalte",    cost:{basalte:3, cuir:1},               gives:{totokia_basalte:1}, req:"atelier_taille"},
  {id:"patu_jade",       label:"Patu pounamu",       cost:{jade:2, cuir:1},                  gives:{patu_jade:1},       req:"atelier_taille"},
  {id:"hache_ostensoir", label:"Hache-ostensoir",    cost:{jade:1, serpentine:1, bois:1},    gives:{hache_ostensoir:1}, req:"atelier_taille"},
  {id:"totokia_jade",    label:"Totokia jade",       cost:{jade:1, basalte:2},               gives:{totokia_jade:1},    req:"atelier_taille"},
  {id:"hache_jade",      label:"Hache de jade",      cost:{jade:2, bois:1},                  gives:{hache_jade:1},      req:"atelier_taille"},
  {id:"proa",            label:"Proa micronésien",   cost:{bois_dur:10, planche:6, fibre_coco:8, voile:1, cuir:4},          gives:{proa:1},        req:"embarcadere"},
  {id:"waka_taua",       label:"Waka taua",          cost:{bois_dur:15, planche:10, fibre_coco:6, jade:1, os:4, plume:6},   gives:{waka_taua:1},   req:"embarcadere"},

  /* ── Tier 6 : lunaires ── */
  {id:"taiaha_lunaire",   label:"Taiaha lunaire",       cost:{fourrure_lunaire:1, bois_dur:2, jade:1},            gives:{taiaha_lunaire:1}},
  {id:"leiomano_lunaire", label:"Leiomano lunaire",     cost:{fourrure_lunaire:1, dent_requin:5, cristal_lunaire:1},gives:{leiomano_lunaire:1}},
  {id:"u_u_lunaire",      label:"U'u lunaire",          cost:{fourrure_lunaire:2, bois_dur:2, cristal_lunaire:1}, gives:{u_u_lunaire:1}},
  {id:"arc_lunaire",      label:"Arc lunaire",          cost:{fourrure_lunaire:1, bois:2, cristal_lunaire:1},     gives:{arc_lunaire:1}},
  {id:"fleche_noire",     label:"Flèches noires (×5)",  cost:{plume_noire:2, bois:1, obsidienne:1},              gives:{fleche_noire:5}},
  {id:"fleche_lunaire",   label:"Flèches lunaires (×5)",cost:{cristal_lunaire:1, plume_noire:1, bois:1},         gives:{fleche_lunaire:5}},

  /* ── Potions : atelier alchimie ── */
  {id:"potion_soin",     label:"Potion de soin",          cost:{os:1, plume:2, pomme:1},           gives:{potion_soin:1},     req:"atelier_alchimie"},
  {id:"potion_antivenin",label:"Antidote",                cost:{griffe:1, cerise:2, prune:1},       gives:{potion_antivenin:1},req:"atelier_alchimie"},
  {id:"potion_force",    label:"Potion de force",         cost:{os:2, cuir:1, orange:1},            gives:{potion_force:1},    req:"atelier_alchimie"},
  {id:"potion_rapidite", label:"Potion de rapidité",      cost:{griffe:1, plume:3, cerise:2},       gives:{potion_rapidite:1}, req:"atelier_alchimie"},
  {id:"potion_vigueur",  label:"Potion de vigueur",       cost:{fourrure_lunaire:1, plume_noire:1}, gives:{potion_vigueur:1},  req:"atelier_alchimie"},
  {id:"potion_nuit",     label:"Vision nocturne",         cost:{plume_noire:2, cristal_lunaire:1},  gives:{potion_nuit:1},     req:"atelier_alchimie"},
  {id:"bombe_fumee",     label:"Bombe de fumée",          cost:{charbon:2, cuir:1},                 gives:{bombe_fumee:1},     req:"atelier_alchimie"},
  {id:"bombe_feu",       label:"Fiole de feu",            cost:{charbon:3, fourrure_lunaire:1},     gives:{bombe_feu:1},       req:"atelier_alchimie"},

  /* ── Cuisine : marmite ── */
  {id:"ragout",          label:"Ragoût de viande",        cost:{viande:2, bois:1},                  gives:{ragout:1},          req:"marmite"},
  {id:"bouillon_fruits", label:"Bouillon de fruits",      cost:{pomme:1, poire:1, orange:1},        gives:{bouillon_fruits:1}, req:"marmite"},
  {id:"soupe_os",        label:"Soupe à l'os",            cost:{os:2, viande:1},                    gives:{soupe_os:1},        req:"marmite"},
  {id:"festin_chasseur", label:"Festin du chasseur",      cost:{viande:3, cuir:1},                  gives:{festin_chasseur:1}, req:"marmite"},
  {id:"confit_sanglier", label:"Confit de sanglier",      cost:{viande:3, graisse:1},               gives:{confit_sanglier:1}, req:"marmite"},
  {id:"noix_rotie",      label:"Noix de coco rôtie",      cost:{noix_coco:2, charbon:1},            gives:{noix_rotie:1},      req:"marmite"},
  {id:"poisson_grille",  label:"Poisson grillé",          cost:{poisson:2, charbon:1},              gives:{poisson_grille:1},  req:"marmite"},
  {id:"soupe_requin",    label:"Soupe de requin",         cost:{viande_requin:1, noix_coco:1},      gives:{soupe_requin:1},    req:"marmite"},
  {id:"elixir_fruit",    label:"Élixir polynésien",       cost:{peche:2, cerise:2, prune:1},        gives:{elixir_fruit:1},    req:"marmite"},

  /* ── Cannes à pêche ── */
  {id:"canne_bambou", label:"Canne en bambou",   cost:{bois:2, fibre_coco:1},              gives:{canne_bambou:1}},
  {id:"canne_os",     label:"Canne en os",       cost:{bois:1, os:2, fibre_coco:2},        gives:{canne_os:1},     req:"etabli"},
  {id:"canne_fer",    label:"Canne en fer",      cost:{planche:2, basalte:2, fibre_coco:3},gives:{canne_fer:1},    req:"etabli"},

  /* ── Cuisine marine ── */
  {id:"sashimi",        label:"Sashimi",              cost:{bec_de_cane:1, charbon:1},                       gives:{sashimi:1},        req:"marmite"},
  {id:"soyo",           label:"Soyo",                 cost:{bec_de_cane:2, noix_coco:1, charbon:1},          gives:{soyo:1},           req:"marmite"},
  {id:"huile_friture",  label:"Huile de friture",     cost:{huile_poisson:2, pierre:1},                      gives:{huile_friture:1}},
  {id:"onction_kaimana",label:"Onction kaimana",      cost:{graisse_baleine:1, foie_requin:1},               gives:{onction_kaimana:1}},

  /* ── Arme marine ── */
  {id:"harpon", label:"Harpon de baleine", cost:{os_baleine:2, bois_dur:3, fibre_coco:2}, gives:{harpon:1}, req:"embarcadere"},
];

function canCraft(r){ return Object.entries(r.cost).every(([k,n])=>countItem(k)>=n); }
function craft(r){
  if(!canCraft(r)) return;
  for(const [k,n] of Object.entries(r.cost)) removeItem(k,n);
  for(const [k,n] of Object.entries(r.gives)){
    const left = addItem(k,n);
    if(left>0) dropOnGround(k,left);
  }
  refreshUI();
}
function costText(cost){
  return Object.entries(cost).map(([k,n])=>`${n} ${ITEMS[k].name.toLowerCase()}`).join(" + ");
}
